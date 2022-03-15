/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../data/store";
import {ShaderState} from "../../data/reducers";
import Prism from "prismjs";
import "../../style.css";

export function CodeEditor(this: any) {
    const selector = useAppSelector((state) => state.shader)
    const shaderName = useAppSelector((state) => state.shader.selectedShaderName)
    const [getText, setText] = useState(selector[selector.selectedShaderName as keyof ShaderState] ?? "")
    const dispatch = useAppDispatch()
    const dropData ={vertex:{name:'vertex'}, fragment:{name:'fragment'}};
    let i = 0;

    useEffect(() => {
        const txt = selector[shaderName as keyof ShaderState]
        setText(txt)
    }, [selector, shaderName])

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
        <div css={css`
          padding-left: 10%;
          padding-top: 10%;
          user-select: none;
        `}>
        <textarea
            className={"code"}
            id={"editing"}
            value={getText}
            onChange={(event => setText(event.target.value))}
            onScroll={sync}
            onInput={sync}
            spellCheck={false}
        />
            <pre id={"highlighting"} aria-hidden={true} >
                <code className={"language-js"} id={"highlighting-content"}>{getText}</code>
            </pre>

            <select css={theme=>({
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.borderColor,
                borderStyle: 'inset'
            })}
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
    )
}

function sync (){
    let input_element = document.querySelector("#editing");
    let output_element = document.querySelector("#highlighting");
    if (output_element && input_element) {
        output_element.scrollLeft = input_element.scrollLeft;
        output_element.scrollTop = input_element.scrollTop;
    }
}