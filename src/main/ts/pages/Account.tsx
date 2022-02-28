/** @jsxImportSource @emotion/react */
import {Theme} from "@emotion/react";
import React, {FormEvent, useState} from "react";
/*
import {PulseLoader} from "react-spinners";
import {Navigate} from "react-router";
import {apiRoot} from "../data/api";
import {Link} from "react-router-dom";
*/
import 'bootstrap/dist/css/bootstrap.css';
import Figure from 'react-bootstrap/Figure'
import FigureImage from 'react-bootstrap/FigureImage'
import FigureCaption from 'react-bootstrap/FigureCaption'
import "./Account.css"
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import TabContainer from 'react-bootstrap/TabContainer'
import TabPane from 'react-bootstrap/TabPane'
import TabContent from 'react-bootstrap/TabContent'

export function Profile() {
    const [getUsername, setUsername] = useState("")
    const [getEmail, setEmail] = useState("")
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
            fontSize: '14pt',
            fontWeight: 'normal',
            fontFamily: theme.secondaryFontFamily,
        }
    }

    return (
        <div css={{paddingTop: '13vh'}}>
            <div className="container">
                <div className="element">
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
                <div className="element">
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
                    textAlign: 'center',
                    fontSize: '18pt',
                    fontFamily: theme.fontFamily,
                    userSelect: 'none',
                    borderBottomColor: theme.borderColor,
                    paddingTop: '12vh',
                    paddingLeft: '30vh'
                })}>
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="home" title="Home">
                        First
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        Second
                    </Tab>
                    <Tab eventKey="contact" title="Contact">
                        Third
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}