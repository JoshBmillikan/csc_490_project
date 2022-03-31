/** @jsxImportSource @emotion/react */
import {css, useTheme} from "@emotion/react";
// @ts-ignore
import React, {useEffect, useState} from "react";
import {CodeEditor} from "./Components/CodeEditor";
import {RenderingEngine} from "../graphics/rendering";
import {useAppSelector} from "../data/store";
import Modal from "react-modal";
import './Styles/Home.css'
import {Settings} from "./Components/Settings";

export function Home() {
    // States
    const vertex = useAppSelector((state) => state.shader.vertex)
    const fragment = useAppSelector((state) => state.shader.fragment)
    const [getError, setError] = useState(false)
    const [getFps, setFps] = useState(0.0)
    const [getShowSettings, setShowSettings] = useState(false)
    const [getSettings, setSettings] = useState<Settings>({
        fov: 45,
        zNear: 0.1,
        zFar: 100,
    })
    // Render with webgl on mount and anytime a shader changes
    useEffect(() => {
        try {
            let instance = RenderingEngine.getInstance()
            if (instance)
                instance.stop = true;
            const settings = getSettings
            let renderingEngine = new RenderingEngine(settings.fov, settings.zNear, settings.zFar, vertex, fragment, (time: number) => setFps(1 / time))
            renderingEngine.render(0)
            setError(false)
        } catch (error: any) {
            setError(true)
        }
    }, [vertex, fragment])

    // Render the fov on the settings change
    useEffect(() => {
        const {fov, zNear, zFar} = getSettings
        RenderingEngine.getInstance().setProjection(fov,zNear,zFar)
    }, [getSettings])

    // Handle the fov change by setting fov state
    const onFovChange = (fov:any) =>{
        console.log(fov)
        setSettings({...getSettings, fov})
    }

    return (
        <div>
            <span className={'codeEditor'}>
            <CodeEditor/>
        </span>
            <span className={'renderWindow'}>
                <div className={'btns'} css={theme => css`
                  background-color: ${theme.backgroundColor};
                `}>
                    <div>
                <button className={'btns-settings'} css={{backgroundColor: 'inherit', color: 'inherit', border: 'hidden'}}
                        data-bs-toggle={'modal'} data-bs-target={'#exampleModal'}>
                    <span className="material-icons">
                        settings
                    </span>
                </button>
                        </div><div>
                <button  className={'btns-upload'}   css={{backgroundColor: 'inherit', color: 'inherit', border: 'hidden'}}>
                    <span className="material-icons">
                        file_upload
                    </span>
                </button>
                    </div>
                </div>
            <canvas
                id={"webgl"}
                className={'webgl'}
                css={css`
                  border-color: ${getError ? "rgb(200,50,50);" : "rgb(50, 50, 50);"}
                `}
                width={"600%"}
                height={"600%"}
            />
                <div>
                <label className={'fps'} css={theme=>({color: theme.textColor})}
                >FPS: {getFps.toFixed(2)}</label>
            </div>
        </span>
            <Settings fov={onFovChange} fovNum={getSettings.fov}></Settings>
        </div>
    )
}

interface Settings {
    fov: number,
    zNear: number,
    zFar: number,
}
