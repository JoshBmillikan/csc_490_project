/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useState} from "react";

export function CodeEditor() {
    const [getText, setText] = useState("")

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
        </div>
    )
}