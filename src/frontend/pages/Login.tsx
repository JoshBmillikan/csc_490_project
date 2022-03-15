/** @jsxImportSource @emotion/react */
import {Theme} from "@emotion/react";
import React, {FormEvent, useState} from "react";
import {PulseLoader} from "react-spinners";
import {Navigate} from "react-router";
import {apiRoot} from "../data/api";
import {Link} from "react-router-dom";

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

    const inputFormStyle = (theme: Theme) => {
        return {
            background: theme.backgroundColor,
            color: theme.textColor,
            borderColor: theme.borderColor,
            borderRadius: '3%',
            paddingLeft: '4px',
            paddingTop: '12px',
            paddingRight: '20%',
            paddingBottom: '12px',
            alignContent: 'left',
            margin: 'auto',
            justifyContent: 'left',
            fontSize: '14pt',
            fontWeight: 'normal',
            fontFamily: theme.secondaryFontFamily,
        }
    }

    return (
        <div css={{paddingTop: '10vh'}}>
            <div css={theme => ({
                background: theme.foregroundColor,
                paddingTop: "3vh",
                width: '25%',
                height: '60vh',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                alignContent: 'center',
                borderColor: getLoginState === LoginState.failed ? 'darkred' : theme.borderColor,
                borderStyle: 'solid',
                borderWidth: '1px',
                fontSize: '14pt',
                borderRadius: "2%"
            })}>
                {getLoginState === LoginState.success && <Navigate to='/'/>}
                <header
                    css={theme => ({
                        color: theme.textColor,
                        textAlign: 'center',
                        fontSize: '20pt',
                        fontFamily: theme.fontFamily,
                        fontWeight: 'bold',
                        userSelect: 'none',
                        borderBottomStyle: 'solid',
                        borderBottomColor: theme.borderColor,
                        paddingBottom: '2vh',
                    })}
                >
                    Sign In
                </header>
                {getLoginState === LoginState.failed &&
                    <div css={{color: 'red', textAlign: "center", userSelect: 'none'}}
                    >Invalid username or password</div>}
                <form css={theme => ({
                    color: theme.textColor,
                    paddingTop: '5vh',
                    fontFamily: theme.fontFamily
                })} onSubmit={(event) => {
                    setLoginState(LoginState.verifying)
                    makeLoginRequest(event, getUsername, getPassword).then((it) => {
                        if (it) {
                            setLoginState(LoginState.success)
                        } else {
                            setLoginState(LoginState.failed)
                        }
                    })
                    return false
                }}>
                    <label css={{
                        display: 'block',
                        margin: 'auto',
                        paddingBottom: '5vh',
                        textAlign: 'center',
                        userSelect: 'none',
                    }}>
                        Username<br/>
                        <input type='text' name='username' css={inputFormStyle}
                               onChange={(event) => setUsername(event.target.value)}
                               value={getUsername}
                        />
                    </label>
                    <label css={{
                        display: 'block',
                        margin: 'auto',
                        textAlign: 'center',
                        userSelect: 'none',
                    }}>
                        Password<br/>
                        <input type='password' name='password' css={inputFormStyle}
                               onChange={(event) => setPassword(event.target.value)}
                               value={getPassword}
                        />
                    </label>
                    <div css={{
                        paddingTop: '10vh',
                        textAlign: 'center',
                        userSelect: 'none',
                    }}>{getLoginState === LoginState.verifying ? <div>
                            <PulseLoader color={
                                "lightblue"
                            }/>
                        </div> :
                        <input type='submit' value='Sign In' css={theme => ({
                            width: '55%',
                            height: '4vh',
                            fontFamily: theme.fontFamily,
                            fontWeight: 'bold',
                            fontSize: '16pt',
                            color: theme.textColor,
                            backgroundColor: theme.elementColor,
                        })}/>}
                    </div>
                    <div css={{
                        paddingTop: '3vh',
                        textAlign: 'center',
                        fontSize: '12pt',
                    }}>
                        <p>Don't have an account? <Link to={'../register'}>Create One</Link> </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

async function makeLoginRequest(event: FormEvent<HTMLFormElement>, username: string, password: string): Promise<boolean> {
    event.preventDefault()
    const response = await fetch(apiRoot + "login", {
        method: "POST",
        body: new URLSearchParams(`username=${username}&password=${password}`)
    })

    return response.ok
}