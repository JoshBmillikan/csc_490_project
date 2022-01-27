/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useEffect, useState} from "react";

function save(text:string) {
    localStorage.setItem("SHADER_VIEWER_LAST_SHADER",text)
}

export function CodeEditor() {
    const [getText, setText] = useState(localStorage.getItem("SHADER_VIEWER_LAST_SHADER") ?? "")

    useEffect(()=> {
        const t = setTimeout(()=>save(getText),1000)
        return () => clearTimeout(t)
    },[getText])

    return (
        <div css={css`
          padding-left: 10%;
          padding-top: 10%;
          user-select: none;
        `}>
        <textarea
            value={getText}
            onChange={(event => setText(event.target.value))}
            css={theme => ({
                height: '80vh',
                width: '50vh',
                backgroundColor: theme.foregroundColor,
                color: theme.textColor,
                resize: 'none',
                borderStyle: 'solid',
                borderColor: theme.borderColor,
                borderRadius: "3%",
                padding: '10px'
            })}
        />
            <button
                name={"Load"}
                css={css`
                  width: 15%;
                  color: black;
                  background-color: gray;
                  border: black;
            `}
            > Render
            </button>
        </div>
    )
}