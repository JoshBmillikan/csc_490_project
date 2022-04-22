/** @jsxImportSource @emotion/react */
// @ts-ignore
import React, {FormEvent, useState} from "react";
import {PulseLoader} from "react-spinners";
import {Navigate} from "react-router";
import {apiRoot} from "../data/api";
import {Link} from "react-router-dom";
import {css, ThemeProvider} from "@emotion/react";
import "../data/theme";
import './Styles/Login.css'
import {useAppSelector} from "../data/store";


enum LoginState {
    input,
    verifying,
    failed,
    success
}

export function Login() {
    const [getLoginState, setLoginState] = useState(LoginState.input)
    const [getUsername, setUsername] = useState("")
    const [getPassword, setPassword] = useState("")

    const theme = useAppSelector((state) => state.ui.theme)

    return (
        <ThemeProvider theme={()=>theme}>
        <div className="text-center" css={theme => ({
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
            fontFamily: theme.fontFamily
        })}>
        {getLoginState === LoginState.success && <Navigate to='/'/>}
        <main className="form-signin">
            <form onSubmit={event =>{
                setLoginState(LoginState.verifying);
                makeLoginRequest(event, getUsername, getPassword).then((pass)=>{
                    if(pass){
                        setLoginState(LoginState.success);
                    } else{
                        setLoginState(LoginState.failed)
                    }
                })
            }}>
                    <h1 className="h3 mb-3 fw-normal" css={theme=>(css`
                              color: ${theme.thirdTextColor};`)}>Please sign in</h1>

                    <div className="form-floating">
                        <input type="text" className="form-control" id="floatingInput" placeholder="username"
                               onChange={event=>{
                                   setUsername(event.target.value);
                               }}/>
                            <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                               onChange={event =>{
                                   setPassword(event.target.value);
                               }}/>
                            <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="checkbox mb-3">
                        <label css={theme=>(css`
                              color: ${theme.thirdTextColor};`)}>
                            <input type="checkbox" value="remember-me" /> Remember me
                        </label>
                    </div>
                {getLoginState === LoginState.verifying ? <div>
                        <PulseLoader color='lightblue'/>
                    </div> :
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>}

                    <p className="mt-5 mb-3 text-muted">Don't have an account?
                        <Link to={'../register'}
                              className={'register'}
                              css={theme=>(css`
                              color: ${theme.thirdTextColor};
                              :hover{color: grey}`)}
                              >Register
                        </Link>
                    </p>
            </form>
        </main>

        </div>
        </ThemeProvider>)

async function makeLoginRequest(event: FormEvent<HTMLFormElement>, username: string, password: string): Promise<boolean> {
    event.preventDefault()
    const data = {
        username: username,
        password: password,
    }
    const response = await fetch(apiRoot + "login", {
        method: "POST",
        body: JSON.stringify(data)
    })

    return response.ok
}}