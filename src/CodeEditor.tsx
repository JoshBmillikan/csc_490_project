/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useState} from "react";

export function CodeEditor() {
    const [getText, setText] = useState("")

    return (
        <div css={css`
          padding-left: 10%;
          padding-top: 10%
        `}>
        <textarea
            value={getText}
            onChange={(event => setText(event.target.value))}
            css={css`
              height: 80vh;
              width: 50vh;
              background-color: black;
              color: white;
              resize: none;
            `}
        />
        </div>
    )
}