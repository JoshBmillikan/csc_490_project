/** @jsxImportSource @emotion/react */
import {css, Theme, ThemeProvider} from "@emotion/react";
import React, {FormEvent, useState} from "react";
import {PulseLoader} from "react-spinners";
import {Navigate} from "react-router";
import {apiRoot} from "../data/api";
import {Link} from "react-router-dom";
import "../data/theme";
import {useAppSelector} from "../data/store";

enum RegistrationState {
    input,
    verifying,
    failed,
    success
}

export function Register() {
    // States for registration
    const [getRegistrationState, setRegistrationState] = useState(RegistrationState.input);
    const [getUsername, setUsername] = useState('');
    const [getEmail, setEmail] = useState('');
    const [getPassword, setPassword] = useState('');
    const theme = useAppSelector((state) => state.ui.theme)

    return (
        <ThemeProvider theme={()=>theme}>
            <div className="text-center" css={theme => ({
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                fontFamily: theme.fontFamily
            })}>
                {getRegistrationState === RegistrationState.success && <Navigate to='/'/>}
                <main className="form-signin">
                    {getRegistrationState === RegistrationState.failed &&
                                    <div css={{color: 'red', textAlign: "center", userSelect: 'none'}}
                                    >Invalid username or password</div>}
                    <form onSubmit={(event) => {
                                    setRegistrationState(RegistrationState.verifying)
                                    makeRegisterRequest(event, getUsername, getEmail, getPassword).then((it) => {
                                        if (it) {
                                            setRegistrationState(RegistrationState.success)
                                        } else {
                                            setRegistrationState(RegistrationState.failed)
                                        }
                                    })
                                    return false
                                }}>
                        <h1 className="h3 mb-3 fw-normal" css={theme=>(css`
                              color: ${theme.thirdTextColor};`)}>Create Account</h1>

                        <div className="form-floating">
                            <input type="text" className="form-control" id="floatingInput" placeholder="username"
                                   onChange={(event) => setUsername(event.target.value)}
                                                   value={getUsername}/>
                            <label htmlFor="floatingInput">Username</label>
                        </div>
                        <div className="form-floating">
                            <input type="text" className="form-control" id="floatingInput" placeholder="email"
                                   onChange={(event) => setEmail(event.target.value)}
                                   value={getEmail}/>
                            <label htmlFor="floatingInput">Email</label>
                        </div>
                        <div className="form-floating">
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                                   onChange={(event) => setPassword(event.target.value)}
                                                   value={getPassword}/>
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        {getRegistrationState === RegistrationState.verifying ? <div>
                                <PulseLoader color='lightblue'/>
                            </div> :
                            <button className="w-100 btn btn-lg btn-primary" type="submit">Create Account</button>}

                        <p className="mt-5 mb-3 text-muted">Already have an account?
                            <Link to={'../login'}
                                  className={'register'}
                                  css={theme=>(css`
                              color: ${theme.thirdTextColor};
                              :hover{color: grey}`)}
                            >Sign in
                            </Link>
                        </p>
                    </form>
                </main>

            </div>
        </ThemeProvider>)

}
async function makeRegisterRequest(event: FormEvent<HTMLFormElement>, username: string, email: string, password: string): Promise<boolean> {
    event.preventDefault()
    const api = apiRoot + "create_account"
    const responseBody = {
        username: username,
        password: password,
        email: email
    }
    const response = await fetch(api, {
        method: "POST",
        body: JSON.stringify(responseBody)
    })

    return response.ok
}