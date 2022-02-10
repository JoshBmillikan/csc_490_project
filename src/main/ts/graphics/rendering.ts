import {mat4, vec3} from "gl-matrix";
import {store} from "../data/store";

interface ProgramData {
    program: WebGLProgram,
    vertexPosition: number,
    vertexColor: number,
    projection: WebGLUniformLocation,
    model: WebGLUniformLocation
}

interface Buffers {
    position: WebGLBuffer,
    color: WebGLBuffer
}

export class RenderingEngine {
    private gl: WebGLRenderingContext
    private lastTime: number = 0;
    private projection = mat4.create()
    private modelView = mat4.create()
    private buffers: Buffers
    private program: ProgramData

    constructor(fov: number, near: number, far: number) {
        const gl = document.querySelector<HTMLCanvasElement>("#webgl")?.getContext("webgl");
        this.gl = gl!
        mat4.perspective(
            this.projection,
            fov * Math.PI / 180,
            this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
            near,
            far
        )
        mat4.translate(this.modelView,this.modelView,[0,0,-2])
        if (gl) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            const program = this.loadShaders()
            this.program = {
                program: program,
                vertexPosition: this.gl.getAttribLocation(program, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(program,"aVertexColor"),
                projection: this.gl.getUniformLocation(program, "uProjectionMatrix")!,
                model: this.gl.getUniformLocation(program, "uModelViewMatrix")!
            }
            this.buffers = this.initBuffers()
        } else {
            throw new Error("WebGL initialization failed")
        }
    }

    render(currentTime: number) {
        currentTime *= 0.001
        const deltaTime = currentTime - this.lastTime
        this.lastTime = currentTime
        this.draw(deltaTime)
        mat4.rotate(this.modelView,this.modelView,deltaTime,vec3.fromValues(0,0,1))
        requestAnimationFrame((time) => {
            this.render(time)
        })
    }

    private draw(deltaTime:number) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.clearDepth(1.0)
        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.depthFunc(this.gl.LEQUAL)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        const numComponents = 4;
        const type = this.gl.FLOAT;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position)
        this.gl.vertexAttribPointer(
            this.program.vertexPosition,
            numComponents,
            type,
            false,
            0,
            0
        )
        this.gl.enableVertexAttribArray(this.program.vertexPosition)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.buffers.color)
        this.gl.vertexAttribPointer(this.program.vertexColor,numComponents,type,false,0,0)
        this.gl.enableVertexAttribArray(this.program.vertexColor)
        this.gl.useProgram(this.program.program)
        this.gl.uniformMatrix4fv(this.program.projection, false, this.projection)
        this.gl.uniformMatrix4fv(this.program.model, false, this.modelView)

        const vertexCount = 3
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,vertexCount)

    }

    private initBuffers(): Buffers {
        const buffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
        const positions = [
            -0.5, -0.5, 0.0, 1.0,
            0.5, -0.5, 0.0, 1.0,
            0.0,0.5,0.0, 1.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)
        const colors = [
            1.0,0.0,0.0, 1.0,
            0.0,1.0,0.0, 1.0,
            0.0,0.0,1.0, 1.0
        ];
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        return {
            position: buffer!,
            color: colorBuffer!
        }
    }

    private loadShaders(): WebGLProgram {
        const state = store.getState().shader
        const program = this.gl.createProgram()
        if (program) {
            this.gl.attachShader(program, this.compileShader(state.vertex, this.gl.VERTEX_SHADER))
            this.gl.attachShader(program, this.compileShader(state.fragment, this.gl.FRAGMENT_SHADER))
            this.gl.linkProgram(program)
            return program
        } else throw new Error("Failed to create shader program")
    }

    private compileShader(source: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type)
        if (shader) {
            this.gl.shaderSource(shader, source)
            this.gl.compileShader(shader)
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                throw new Error(`Shader compilation failed: ${this.gl.getShaderInfoLog(shader)}`)
            }
            return shader
        } else throw new Error("Shader creation failed")
    }
}

