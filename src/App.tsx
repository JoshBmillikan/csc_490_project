import React from 'react';
/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {CodeEditor} from "./CodeEditor";

function App() {
    const mainStyle = css`
      background-color: lightsteelblue;
      height: 100vh;
      width: 100vw;
    `
    return (
        <div css={mainStyle}>
            <header
                css={css`
                  background-color: slategray;
                  text-align: center;
                  user-select: none;
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
            <canvas id={"webgl"} css={css`
              background-color: white;
              border-width: 2px;
              border-style: ridge;
              height: 40vh;
            `}/>
        </span>
        </div>
    );
}

export default App;
