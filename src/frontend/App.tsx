import React from 'react';
/** @jsxImportSource @emotion/react */
import {css, ThemeProvider} from "@emotion/react";
import {useAppDispatch, useAppSelector} from "./data/store";
import {Home} from "./pages/Home";
import {BrowserRouter, Link} from "react-router-dom";
import {Route, Routes} from "react-router";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register"
import {themes} from "./data/theme";
import {Profile} from "./pages/Account";
import './App.css'

function App() {
    // Theme import selector
    const theme = useAppSelector((state) => state.ui.theme)

    const dispatch = useAppDispatch()
    let c = 0

    return (
        <ThemeProvider theme={() => theme}>
            <BrowserRouter basename={'CSC_490_project'}>

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
                        <Link className={'login'}
                              css={theme=>(css`
                              color: ${theme.textColor};
                              :hover{color: ${theme.secondaryTextColor}}`)}
                              to={'login'}>
                    <span className="material-icons">
                        login
                    </span>
                            <span>Sign in</span>
                        </Link>
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
                        <Route path='login' element={<Login/>}/>
                        <Route path='register' element={<Register/>}/>
                        <Route path='profile' element={<Profile/>}/>
                    </Routes>
            </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
