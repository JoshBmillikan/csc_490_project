/** @jsxImportSource @emotion/react */
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../data/store";
import {ShaderState} from "../../data/reducers";
// @ts-ignore
import Prism from "prismjs";
import "./style.css"
import {css} from "@emotion/react";

export function CodeEditor(this: any) {
    // shader selector states
    const selector = useAppSelector((state) => state.shader)
    const shaderName = useAppSelector((state) => state.shader.selectedShaderName)
    // text states
    const [getText, setText] = useState(selector[selector.selectedShaderName as keyof ShaderState] ?? "")
    const dispatch = useAppDispatch()
    // Selector names and constant
    const dropData ={vertex:{name:'vertex'}, fragment:{name:'fragment'}};
    let i = 0;

    // Mount the text state and update the state everytime the text is changed in the editor
    useEffect(() => {
        const txt = selector[shaderName as keyof ShaderState]
        setText(txt)
    }, [selector, shaderName])

    // Mount the shader save timer and update the redux state every 1000ms after the final key press
    useEffect(()=> {
        const t = setTimeout(()=>{
            dispatch({shaderName: selector.selectedShaderName, newShader: getText, type: "updateShader"})
        },1000)
        return () => clearTimeout(t)
    },[dispatch, getText, selector.selectedShaderName])

    // Highlights the code editor text
    // Highlights upon mounting and then everytime the text is changed
    useEffect (()=>{
        Prism.highlightAll();
    },[getText])

    return (
        <div>
            <div className={'editorContainer'}>
        <textarea
            className={"code"}
            id={"editing"}
            value={getText}
            onChange={(event => setText(event.target.value))}
            onScroll={sync}
            onInput={sync}
            spellCheck={false}
        />
            <pre className={'line-numbers'} id={"highlighting"}>
                <code className='language-glsl'>{getText}</code>
            </pre>
            </div>
            <div className={'contain'}>
                <select className={'selector'} css={theme=>(css`
                                background-color: transparent;
                                color: ${theme.thirdTextColor};
                                border-color: transparent;
                                :hover{color: gray;}
                            `)}
                        onChange={(event)=>{
                            const name = event.target.value;
                            if (name){
                                dispatch({type:'selectShader', shaderName: name, newShader: null})
                            }
                        }
                        }>
                    {Object.keys(dropData).map((it:string)=> {
                        return (<option value={it} key={i++}>
                            {it}
                        </option>)
                    })}
                </select>
            </div>
        </div>

    )
}

function sync (){
    // scroll sync function
    // get the inner and outter text areas and set their scrolls to sync together everytime a scroll is activated
    let input_element = document.querySelector("#editing");
    let output_element = document.querySelector("#highlighting");
    if (output_element && input_element) {
        output_element.scrollLeft = input_element.scrollLeft;
        output_element.scrollTop = input_element.scrollTop;
    }
}