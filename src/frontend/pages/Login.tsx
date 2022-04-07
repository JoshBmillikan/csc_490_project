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
        <body className="text-center" css={theme => ({
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
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating">
                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                               onChange={event=>{
                                   setUsername(event.target.value);
                               }}/>
                            <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                               onChange={event =>{
                                   setPassword(event.target.value);
                               }}/>
                            <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="checkbox mb-3">
                        <label>
                            <input type="checkbox" value="remember-me"/> Remember me
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
                              color: ${theme.textColor};
                              :hover{color: ${theme.secondaryTextColor}}`)}
                              >
                            <button>Register</button>
                        </Link>
                    </p>
            </form>
        </main>

        </body>
        </ThemeProvider>)

//         <div css={{paddingTop: '10vh'}}>
//             <div css={theme => ({
//                 background: theme.foregroundColor,
//                 paddingTop: "3vh",
//                 width: '25%',
//                 height: '60vh',
//                 display: 'block',
//                 marginLeft: 'auto',
//                 marginRight: 'auto',
//                 alignContent: 'center',
//                 borderColor: getLoginState === LoginState.failed ? 'darkred' : theme.borderColor,
//                 borderStyle: 'solid',
//                 borderWidth: '1px',
//                 fontSize: '14pt',
//                 borderRadius: "2%"
//             })}>
//                 <header
//                     css={theme => ({
//                         color: theme.textColor,
//                         textAlign: 'center',
//                         fontSize: '20pt',
//                         fontFamily: theme.fontFamily,
//                         fontWeight: 'bold',
//                         userSelect: 'none',
//                         borderBottomStyle: 'solid',
//                         borderBottomColor: theme.borderColor,
//                         paddingBottom: '2vh',
//                     })}
//                 >
//                     Sign In
//                 </header>
//                 {getLoginState === LoginState.failed &&
//                     <div css={{color: 'red', textAlign: "center", userSelect: 'none'}}
//                     >Invalid username or password</div>}
//                 <form css={theme => ({
//                     color: theme.textColor,
//                     paddingTop: '5vh',
//                     fontFamily: theme.fontFamily
//                 })} onSubmit={(event) => {
//                     setLoginState(LoginState.verifying)
//                     makeLoginRequest(event, getUsername, getPassword).then((it) => {
//                         if (it) {
//                             setLoginState(LoginState.success)
//                         } else {
//                             setLoginState(LoginState.failed)
//                         }
//                     })
//                     return false
//                 }}>
//                     <label css={{
//                         display: 'block',
//                         margin: 'auto',
//                         paddingBottom: '5vh',
//                         textAlign: 'center',
//                         userSelect: 'none',
//                     }}>
//                         Username<br/>
//                         <input type='text' name='username' css={inputFormStyle}
//                                onChange={(event) => setUsername(event.target.value)}
//                                value={getUsername}
//                         />
//                     </label>
//                     <label css={{
//                         display: 'block',
//                         margin: 'auto',
//                         textAlign: 'center',
//                         userSelect: 'none',
//                     }}>
//                         Password<br/>
//                         <input type='password' name='password' css={inputFormStyle}
//                                onChange={(event) => setPassword(event.target.value)}
//                                value={getPassword}
//                         />
//                     </label>
//                     <div css={{
//                         paddingTop: '10vh',
//                         textAlign: 'center',
//                         userSelect: 'none',
//                     }}>{getLoginState === LoginState.verifying ? <div>
//                             <PulseLoader color={
//                                 "lightblue"
//                             }/>
//                         </div> :
//                         <input className={'btn'} type='submit' value='Sign In' css={theme => ({
//                             width: '55%',
//                             height: '4vh',
//                             fontFamily: theme.fontFamily,
//                             fontWeight: 'bold',
//                             fontSize: '16pt',
//                             color: theme.textColor,
//                             backgroundColor: theme.elementColor,
//
//                         })}/>}
//                     </div>
//                     <div css={{
//                         paddingTop: '3vh',
//                         textAlign: 'center',
//                         fontSize: '12pt',
//                     }}>
//                         <p>Don't have an account? <Link to={'../register'}>Create One</Link> </p>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

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