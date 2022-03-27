/** @jsxImportSource @emotion/react */
import {css, useTheme} from "@emotion/react";
// @ts-ignore
import React, {useEffect, useState} from "react";
import {CodeEditor} from "./Components/CodeEditor";
import {RenderingEngine} from "../graphics/rendering";
import {useAppSelector} from "../data/store";
import Modal from "react-modal";

export function Home() {
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
            color: theme.textColor,
        },
    };
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

    useEffect(() => {
        const {fov, zNear, zFar} = getSettings
        RenderingEngine.getInstance().setProjection(fov,zNear,zFar)
    }, [getSettings])

    return (
        <div>
            <span css={css`float: left`}>
            <CodeEditor/>
        </span>
            <span css={css`
              float: right;
              padding-right: 5%;
              padding-top: 10%;
            `}>
                <div css={theme => css`
                  float: right;
                  background-color: ${theme.backgroundColor};
                  color: silver;
                `}>
                    <div>
                <button css={{backgroundColor: 'inherit', color: 'inherit', border: 'hidden'}}
                        onClick={() => setShowSettings(!getShowSettings)}>
                    <span className="material-icons">
                        settings
                    </span>
                </button>
                        </div><div>
                <button css={{backgroundColor: 'inherit', color: 'inherit', border: 'hidden'}}>
                    <span className="material-icons">
                        file_upload
                    </span>
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
                <label css={{
                    backgroundColor: "silver",
                    textColor: "black",
                    width: '20%'
                }}
                >FPS: {getFps.toFixed(2)}</label>
            </div>
        </span>
            <Modal
                isOpen={getShowSettings}
                onRequestClose={() => setShowSettings(false)}
                style={modalStyle}
            >
                <form
                    id={'settings'}
                    onSubmit={(it) => {
                        it.preventDefault()
                        setSettings({
                            ...getSettings,
                            fov: parseFloat((document.getElementById('fov') as HTMLInputElement).value),
                        })
                        setShowSettings(false)
                    }}
                >
                    <label>FOV:</label><input name={'fov'} id={'fov'} type={"number"} defaultValue={getSettings.fov}/><br/>

                    <button onClick={()=>setShowSettings(false)}>
                        Cancel
                    </button>
                    <input type={'submit'} value={'Ok'}/>
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
