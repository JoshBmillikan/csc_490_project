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
        `} className={"code"}>
        <textarea
            value={getText}
            onChange={(event => setText(event.target.value))}
            css={css`
              height: 80vh;
              width: 50vh;
              background-color: rgb(20,20,20);
              color: white;
              resize: none;
              border: ridge rgb(50,50,50);
            `}
        />
        </div>
    )
}