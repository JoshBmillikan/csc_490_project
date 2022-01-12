import React, {useEffect} from 'react';
/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {CodeEditor} from "./CodeEditor";
import {RenderingEngine} from "./graphics/rendering";

function App() {
    const mainStyle = css`
      background-color: rgb(26, 28, 31);
      height: 100vh;
      width: 100vw;
    `

    useEffect(() => {
        try {
            let renderingEngine = new RenderingEngine(45,0.1,100.0)
            renderingEngine.render(0)
        } catch (error:any) {
            alert(`WebGL initialization failed. your browser may not be compatible\nError: ${error.message}`)
        }
    },[])
    return (
        <div css={mainStyle}>
            <header
                css={css`
                  background-color: rgb(58, 60, 64);
                  text-align: center;
                  user-select: none;
                  height: 5%;
                  font-size: 24pt;
                `}
            >Shader Viewer
            </header>
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
                  border-color: rgb(50, 50, 50);
                `}
                width={"720"}
                height={"500"}
            />
        </span>
        </div>
    );
}

export default App;
