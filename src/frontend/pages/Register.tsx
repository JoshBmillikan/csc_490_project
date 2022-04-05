/** @jsxImportSource @emotion/react */
import {css, Theme} from "@emotion/react";
import React, {FormEvent, useState} from "react";
import {PulseLoader} from "react-spinners";
import {Navigate} from "react-router";
import {apiRoot} from "../data/api";
import {Link} from "react-router-dom";
import "../data/theme";

enum RegistrationState {
    input,
    verifying,
    failed,
    success
}

export function Register(){
    // States for registration
    const [getRegistrationState, setRegistrationState] = useState(RegistrationState.input);
    const [getUsername, setUsername] = useState('');
    const [getEmail, setEmail] = useState('');
    const [getPassword, setPassword] = useState('');
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
    return(
        <div css={{paddingTop: '17vh'}}>
            <div css={theme => ({
                background: theme.foregroundColor,
                paddingTop: "3vh",
                width: '25%',
                height: '85vh',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                alignContent: 'center',
                borderColor: getRegistrationState === RegistrationState.failed ? 'darkred' : theme.borderColor,
                borderStyle: 'solid',
                borderWidth: '1px',
                fontSize: '14pt',
                borderRadius: "2%"
            })}>
                {getRegistrationState === RegistrationState.success && <Navigate to='/'/>}
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
                    User Registration
                </header>
                {getRegistrationState === RegistrationState.failed &&
                    <div css={{color: 'red', textAlign: "center", userSelect: 'none'}}
                    >Invalid username or password</div>}
                <form css={theme => ({
                    color: theme.textColor,
                    paddingTop: '5vh',
                    fontFamily: theme.fontFamily
                })} onSubmit={(event) => {
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
                        paddingBottom: '5vh',
                        textAlign: 'center',
                        userSelect: 'none',
                    }}>
                        Email<br/>
                        <input type='text' name='email' css={inputFormStyle}
                               onChange={(event) => setEmail(event.target.value)}
                               value={getEmail}
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
                    }}>{getRegistrationState === RegistrationState.verifying ? <div>
                            <PulseLoader color={
                                "lightblue"
                            }/>
                        </div> :
                        <input type='submit' value='Sign Up' css={theme => ({
                            width: '55%',
                            height: '6vh',
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
                        <p>Already have an account?
                            <Link to={'../login'}
                                  className={'login'}
                                  css={theme=>(css`
                              color: ${theme.textColor};
                              :hover{color: ${theme.secondaryTextColor}}`)}
                            >
                                <button>Sign in</button>
                            </Link> </p>
                    </div>
                </form>
            </div>
        </div>
    )
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