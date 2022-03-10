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

function App() {
    const theme = useAppSelector((state) => state.ui.theme)

    const dispatch = useAppDispatch()
    let c = 0
    return (
        <ThemeProvider theme={() => theme}>
            <BrowserRouter>

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
                    <Link to={'login'}>Sign In</Link>
                    <select
                        css={theme=>({
                            backgroundColor:theme.backgroundColor,
                            color: theme.textColor,
                            borderColor: theme.borderColor,
                            borderStyle: 'inset'
                        })}
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
