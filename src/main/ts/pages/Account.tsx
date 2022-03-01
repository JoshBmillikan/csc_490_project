/** @jsxImportSource @emotion/react */
import {Theme} from "@emotion/react";
import React, {FormEvent, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import {PulseLoader} from "react-spinners";

export function Profile() {
    const [getUsername, setUsername] = useState("")
    const [getEmail, setEmail] = useState("")
    const [getPassword, setPassword] = useState("")
    const [getNewPassword, setNewPassword] = useState("")
    const [getRNewPassword, setRNewPassword] = useState("")
    const current = new Date();
    const date = `${current.getMonth()+1}/${current.getDate()}/${current.getFullYear()}`;

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
            fontSize: '15pt',
            fontWeight: 'normal',
            fontFamily: theme.secondaryFontFamily,
        }
    }

    return (
        <div css={{
                paddingTop: '13vh',
             }}>
            <div className="container" css={{display: 'flex'}}>
                <div className="element" css={{height: '150px', margin: '5px', flex: '0 0 auto'}}>
                    <figure
                        css={theme => ({
                            color: theme.textColor,
                            paddingLeft: '15vh'
                        })}>
                        <img
                            src= "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            alt="No photo uploaded"
                            width="100"
                            height="100"
                        />
                        <figcaption>
                            Profile Picture
                        </figcaption>
                    </figure>
                </div>
                <div className="element" css={{height: '150px', margin: '5px', flex: '0 0 auto'}}>
                    <text
                        css={theme => ({
                            color: theme.textColor,
                            textAlign: 'left',
                            fontSize: '13pt',
                            fontFamily: theme.fontFamily,
                            userSelect: 'none',
                            borderBottomColor: theme.borderColor,
                            paddingBottom: '12vh',
                            paddingLeft: '5vh'
                        })}
                    >
                        Username: {getUsername}
                    </text>
                    <br/>
                    <text
                        css={theme => ({
                            color: theme.textColor,
                            textAlign: 'left',
                            fontSize: '13pt',
                            fontFamily: theme.fontFamily,
                            userSelect: 'none',
                            borderBottomColor: theme.borderColor,
                            paddingBottom: '12vh',
                            paddingLeft: '5vh'
                        })}
                    >
                        Email: {getUsername}
                    </text>
                    <br/>
                    <text
                        css={theme => ({
                            color: theme.textColor,
                            textAlign: 'left',
                            fontSize: '13pt',
                            fontFamily: theme.fontFamily,
                            userSelect: 'none',
                            borderBottomColor: theme.borderColor,
                            paddingBottom: '12vh',
                            paddingLeft: '5vh'
                        })}
                    >
                        Date Joined: {date}
                    </text>
                </div>
            </div>
            <div
                css={theme => ({
                    color: theme.textColor,
                    width: 1300,
                    borderStyle: 'solid',
                    borderWidth: '3px',
                    margin: 'auto',
                    textAlign: 'center',
                    fontSize: '18pt',
                    fontFamily: theme.fontFamily,
                    userSelect: 'none',
                    borderRadius: '5px 5px 5px 5px',
                    padding: '10px',
                    borderColor: theme.borderColor,
                    backgroundColor: theme.backgroundColor
                })}>
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="shaders" title="Shaders">
                        First
                    </Tab>
                    <Tab eventKey="notifications" title="Notifications">
                        Second
                    </Tab>
                    <Tab eventKey="password" title="Password">
                        <form>
                            <label css={{
                                display: 'block',
                                margin: 'auto',
                                textAlign: 'center',
                                userSelect: 'none',
                                fontSize: '15pt',
                                paddingBottom: '3vh'
                            }}>
                                Current Password:
                                <input type='password' name='password' css={inputFormStyle}
                                       onChange={(event) => setPassword(event.target.value)}
                                       value={getPassword}
                                />
                            </label>
                            <label css={{
                                display: 'block',
                                margin: 'auto',
                                textAlign: 'center',
                                userSelect: 'none',
                                fontSize: '15pt',
                                paddingBottom: '3vh'
                            }}>
                                New Password:
                                <input type='password' name='newPassword' css={inputFormStyle}
                                       onChange={(event) => setNewPassword(event.target.value)}
                                       value={getNewPassword}
                                />
                            </label>
                            <label css={{
                                display: 'block',
                                margin: 'auto',
                                textAlign: 'center',
                                userSelect: 'none',
                                fontSize: '15pt',
                                paddingBottom: '3vh'
                            }}>
                                Repeat New Password:
                                <input type='password' name='rNewPassword' css={inputFormStyle}
                                       onChange={(event) => setRNewPassword(event.target.value)}
                                       value={getRNewPassword}
                                />
                            </label>
                            <div css={{
                                textAlign: 'center',
                                userSelect: 'none',
                            }}>
                                <input type='submit' value='Save Changes' css={theme => ({
                                    width: '20%',
                                    height: '6vh',
                                    fontFamily: theme.fontFamily,
                                    fontWeight: 'bold',
                                    fontSize: '14pt',
                                    color: theme.textColor,
                                    backgroundColor: theme.elementColor,
                                })}/>
                            </div>
                        </form>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}