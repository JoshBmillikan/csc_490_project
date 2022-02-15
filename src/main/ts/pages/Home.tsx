/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import React, {useEffect, useState} from "react";
import {CodeEditor} from "../CodeEditor";
import {RenderingEngine} from "../graphics/rendering";
import {useAppSelector} from "../data/store";


export function Home() {

    const vertex = useAppSelector((state) => state.shader.vertex)
    const fragment = useAppSelector((state) => state.shader.fragment)
    const [getError,setError] = useState(false)
    useEffect(() => {
        try {
            let instance = RenderingEngine.getInstance()
            if (instance)
                instance.stop = true;
            let renderingEngine = new RenderingEngine(45, 0.1, 100.0, vertex, fragment)
            renderingEngine.render(0)
            setError(false)
        } catch (error: any) {
            setError(true)
        }
    }, [vertex, fragment])

    return (
        <div>

            <span css={css`float: left`}>
            <CodeEditor/>
        </span>
            <span css={css`
              float: right;
              padding-right: 10%;
              padding-top: 10%;
            `}>
            <canvas
                id={"webgl"}
                css={css`
                  border-width: 2px;
                  border-style: ridge;
                  border-color: ${getError ? "rgb(200,50,50);": "rgb(50, 50, 50);"}
                `}
                width={"720"}
                height={"500"}
            />
        </span>
        </div>
    )
}