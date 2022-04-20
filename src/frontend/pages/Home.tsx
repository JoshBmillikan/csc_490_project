/** @jsxImportSource @emotion/react */
import {css, useTheme} from "@emotion/react";
import React, {useEffect, useState} from "react";
import {CodeEditor} from "./Components/CodeEditor";
import {RenderingEngine} from "../graphics/rendering";
import {useAppSelector} from "../data/store";
import Modal from "react-modal";
import parseObj from '@hippie/obj'
import './Styles/Home.css'

export function Home() {
    // states
    const vertex = useAppSelector((state) => state.shader.vertex)
    const fragment = useAppSelector((state) => state.shader.fragment)
    const [getError, setError] = useState(false)
    const [getFps, setFps] = useState(0.0)
    const [getShowSettings, setShowSettings] = useState(false)
    // FOV state for changing in settings
    const [getSettings, setSettings] = useState<Settings>({
        fov: 45,
        zNear: 0.1,
        zFar: 100,
    })
    // modal theme
    const theme = useTheme()
    const modalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: theme.backgroundColor,
            color: theme.thirdTextColor,
        },
    };
    // Mount rendering engine and reload everytime the vertex or fragment shader is updated
    useEffect(() => {
        try {
            let instance = RenderingEngine.getInstance()
            if (instance)
                instance.stop = true;
            const settings = getSettings
            let renderingEngine = new RenderingEngine(
                settings.fov,
                settings.zNear,
                settings.zFar,
                vertex,
                fragment,
                (time: number) => setFps(1 / time)
            )
            renderingEngine.render(0)
            setError(false)
        } catch (error: any) {
            setError(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vertex, fragment])

    // Mount the Fov settings and update redering engine everytime there is a FOV change
    useEffect(() => {
        const {fov, zNear, zFar} = getSettings
        RenderingEngine.getInstance().setProjection(fov, zNear, zFar)
    }, [getSettings])

    return (
        <div>
            <span className={'codeEditor'}>
            <CodeEditor/>
        </span>
            <span className={'renderWindow'}>
                <div className={'renderBtns'}>
                    <div>
                <button className={'settingsBtn'} css={{backgroundColor: 'inherit', color: 'inherit', border: 'hidden'}}
                        onClick={() => setShowSettings(!getShowSettings)}>
                    <span className="material-icons">
                        settings
                    </span>
                </button>
                        </div><div>
                <button className={'fileBtn'} css={{backgroundColor: 'inherit', color: 'inherit', border: 'hidden'}}
                        onClick={() => {
                            const file = document.getElementById("file_upload")
                            file?.click()
                        }}
                >
                    <span className="material-icons">
                        file_upload
                    </span>
                    <input type={'file'}
                           name={'file upload'}
                           id={'file_upload'}
                           css={css`visibility: hidden; 
                                user-select: none;
                                width: 0;
                            `}
                           onChange={async (event) => {
                               if (event.target.files) {
                                   const txt = await event.target.files[0].text()
                                   const [model] = parseObj(txt)
                                   const settings = getSettings
                                   let instance = RenderingEngine.getInstance()
                                   if (instance)
                                       instance.stop = true
                                   let renderingEngine = new RenderingEngine(
                                       settings.fov,
                                       settings.zNear,
                                       settings.zFar,
                                       vertex,
                                       fragment,
                                       (time: number) => setFps(1 / time),
                                       model
                                   )
                                   renderingEngine.render(0)
                               }
                           }}
                    />
                </button>
                    </div>
                </div>
            <canvas
                id={"webgl"}
                css={css`
                  border-width: 2px;
                  border-style: ridge;
                  border-color: ${getError ? "rgb(200,50,50);" : "rgb(50, 50, 50);"}
                `}
                width={"600"}
                height={"500"}
            />
                <div>
                <label css={ theme =>css`
                  color: ${theme.thirdTextColor}
                `}>
                    FPS: {getFps.toFixed(2)}
                </label>
            </div>
        </span>
            <Modal
                isOpen={getShowSettings}
                onRequestClose={() => setShowSettings(false)}
                style={modalStyle}>
                <form
                    id={'settings'}
                    onSubmit={(it) => {
                        it.preventDefault()
                        setSettings({
                            ...getSettings,
                            fov: parseFloat((document.getElementById('fov') as HTMLInputElement).value),
                        })
                        setShowSettings(false)
                    }}>

                    <label>FOV:</label>
                    <input
                        name={'fov'}
                        id={'fov'}
                        type={"number"}
                        defaultValue={getSettings.fov}
                    />
                    <br/>
                    <div id={'modalBtns'}>
                            <input id={'cancel'} type={'button'} value={'Cancel'} onClick={() => setShowSettings(false)}>
                            </input>
                            <input id={'ok'} type={'submit'} value={'Ok'}/>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

interface Settings {
    fov: number,
    zNear: number,
    zFar: number,
}