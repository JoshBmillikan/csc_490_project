import React from 'react';
/** @jsxImportSource @emotion/react */
import {css, ThemeProvider} from "@emotion/react";
import {useAppDispatch, useAppSelector} from "./data/store";
import {Home} from "./pages/Home";
import {Route, Routes} from "react-router";
import {themes} from "./data/theme";
import './App.css'

function App() {
    // Theme import selector
    const theme = useAppSelector((state) => state.ui.theme)
    // theme constant
    const dispatch = useAppDispatch()
    let c = 0

    return (
        <ThemeProvider theme={() => theme}>
            <div
                className={'background'}
                css={theme => ({
                backgroundColor: theme.backgroundColor
            })}>
                <header
                    className={'header'}
                    css={theme => (css`
                  background-color: ${theme.secondaryColor};
                  color: ${theme.textColor};
                  font-family: ${theme.fontFamily};
                `)}
                >
                    <h1 className={'header-title'}>Shader Viewer</h1>
                    <div className={'header-signin'}>
                        <select className={'themeSelect'}
                            css={theme=>(css`
                                background-color: ${theme.secondaryColor};
                                color: ${theme.textColor};
                                border-color: ${theme.borderColor};
                                :hover{color: ${theme.secondaryTextColor};}
                            `)}
                            onChange={(event)=> {
                                const name = event.target.value
                                if (name) {
                                    dispatch({type:"setTheme", themeName: name})
                                }
                            }
                            }>{
                            Object.keys(themes).map((it) => {
                                return (<option value={it} key={c++}>
                                    {it}
                                </option>)
                            })}
                        </select>
                    </div>
                </header>

                    <Routes>
                        <Route path='/' element={<Home/>}/>
                    </Routes>
            </div>
        </ThemeProvider>
    );
}

export default App;
