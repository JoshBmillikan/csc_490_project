import React, {useEffect, useState} from 'react';
/** @jsxImportSource @emotion/react */
import {css, ThemeProvider} from "@emotion/react";
import {CodeEditor} from "./CodeEditor";
import {RenderingEngine} from "./graphics/rendering";
import Select from "react-select";
import {themes} from "./theme";

function App() {
    const [getTheme, setTheme] = useState(themes[0])

    const options = themes.map((it) => {
        return {
            value: it,
            label: it.name
        }
    })

    useEffect(() => {
        try {
            let renderingEngine = new RenderingEngine(45, 0.1, 100.0)
            renderingEngine.render(0)
        } catch (error: any) {
            alert(`WebGL initialization failed. your browser may not be compatible\nError: ${error.message}`)
        }
    }, [])

    return (
        <ThemeProvider theme={() => getTheme}>
            <div css={theme => ({
                backgroundColor: theme.backgroundColor,
                height: '100vh',
                width: '100vw'
            })}>
                <header
                    css={theme => (css`
                      background-color: ${theme.secondaryColor};
                      text-align: center;
                      user-select: none;
                      height: 5%;
                      font: 24pt bold;
                      color: ${theme.textColor};
                    `)}
                >Shader Viewer
                </header>
                <div css={{
                    float: 'right',
                    userSelect: 'none'
                }}>
                    <Select
                        defaultValue={options[0]}
                        options={options}
                        onChange={(event) => setTheme(event!.value)}
                    />
                </div>
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
        </ThemeProvider>
    );
}

export default App;
