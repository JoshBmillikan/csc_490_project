import {mat4, vec3} from "gl-matrix";
import {IObj} from "@hippie/obj";

interface ProgramData {
    program: WebGLProgram,
    vertexPosition: number,
    vertexColor: number,
    projection: WebGLUniformLocation,
    model: WebGLUniformLocation
}

interface Buffers {
    position: WebGLBuffer,
    color: WebGLBuffer,
    index: WebGLBuffer | null,
}

export class RenderingEngine {
    private gl: WebGLRenderingContext
    private lastTime: number = 0;
    private projection = mat4.create()
    private modelView = mat4.create()
    private buffers: Buffers
    private program: ProgramData
    private static instance: RenderingEngine
    private vertexCount = 3
    stop: boolean = false
    private readonly timerCallback: Function | null
    private model: IObj | null

    constructor(
        fov: number,
        near: number,
        far: number,
        vertexShader: string,
        fragmentShader: string,
        timerCallback: Function | null = null,
        model: IObj | null = null
    ) {
        this.timerCallback = timerCallback
        this.model = model
        const gl = document.querySelector<HTMLCanvasElement>("#webgl")?.getContext("webgl");
        this.gl = gl!
        mat4.perspective(
            this.projection,
            fov * Math.PI / 180,
            this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
            near,
            far
        )
        mat4.translate(this.modelView, this.modelView, [0, 0, -3])
        if (gl) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            const program = this.loadShaders(vertexShader, fragmentShader)
            this.program = {
                program: program,
                vertexPosition: this.gl.getAttribLocation(program, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(program, "aVertexColor"),
                projection: this.gl.getUniformLocation(program, "uProjectionMatrix")!,
                model: this.gl.getUniformLocation(program, "uModelViewMatrix")!
            }
            if (model)
                this.buffers = this.loadModel(model)
            else
                this.buffers = this.initBuffers()
            RenderingEngine.instance = this
        } else {
            throw new Error("WebGL initialization failed")
        }
    }

    render(currentTime: number) {
        currentTime *= 0.001
        const deltaTime = currentTime - this.lastTime
        this.lastTime = currentTime
        this.draw(deltaTime)
        mat4.rotate(this.modelView, this.modelView, deltaTime, vec3.fromValues(0.5, 0.5, .4))
        if (this.timerCallback)
            this.timerCallback(deltaTime)
        requestAnimationFrame((time) => {
            if (!this.stop)
                this.render(time)
        })

    }

    static getInstance() {
        return RenderingEngine.instance
    }

    private loadModel(data: IObj) {
        this.gl.finish()
        const buffer = this.gl.createBuffer()!
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
        const vert = data.vertices
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vert, this.gl.STATIC_DRAW)

        this.vertexCount = vert.length
        const colorBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
        let color = [1.0]
        for (let i = 0; i < vert.length; i++) {
            switch (i % 3) {
                case 0: color.push(1.0,0.0,0.0); break;
                case 1: color.push(0.0,1.0,0.0); break;
                case 2: color.push(0.0,0.0,1.0); break;
            }
            color.push(1.0)
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(color), this.gl.STATIC_DRAW)
        const indexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data.indices!, this.gl.STATIC_DRAW)
        return {
            position: buffer!,
            color: colorBuffer!,
            index: indexBuffer
        }
    }

    setScale(x: number, y: number, z: number) {
        mat4.scale(this.modelView, this.modelView, [x,y,z])
    }

    setProjection(fov: number, near: number, far: number) {
        mat4.perspective(
            this.projection,
            fov * Math.PI / 180,
            this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
            near,
            far
        )
    }

    private draw(deltaTime: number) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.clearDepth(1.0)
        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.enable(this.gl.CULL_FACE)
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
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color)
        this.gl.vertexAttribPointer(this.program.vertexColor, numComponents, type, false, 0, 0)
        this.gl.enableVertexAttribArray(this.program.vertexColor)
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.index)
        this.gl.useProgram(this.program.program)
        this.gl.uniformMatrix4fv(this.program.projection, false, this.projection)
        this.gl.uniformMatrix4fv(this.program.model, false, this.modelView)


        if (this.model)
            this.gl.drawElements(this.gl.TRIANGLES, this.model!.indices!.length, this.gl.UNSIGNED_SHORT, 0);
        else
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount)
    }

    private initBuffers(): Buffers {
        const buffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
        const positions = [
            -0.5, -0.5, 0.0, 1.0,
            0.5, -0.5, 0.0, 1.0,
            0.0, 0.5, 0.0, 1.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)
        const colors = [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        return {
            position: buffer!,
            color: colorBuffer!,
            index: null
        }
    }

    private loadShaders(vertexShader: string, fragmentShader: string): WebGLProgram {
        const program = this.gl.createProgram()
        if (program) {
            this.gl.attachShader(program, this.compileShader(vertexShader, this.gl.VERTEX_SHADER))
            this.gl.attachShader(program, this.compileShader(fragmentShader, this.gl.FRAGMENT_SHADER))
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

