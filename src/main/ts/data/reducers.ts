import {Theme} from "@emotion/react";
import {AvailableThemes, themes} from "./theme";
import {AnyAction} from "@reduxjs/toolkit";

export class UiState {
    theme: Theme = themes.dark
}

function loadPersistUi(): UiState {
    const saved = localStorage.getItem("_SHADER_VIEW_UI_STATE")
    if (saved)
        return JSON.parse(saved) ?? new UiState()
    else return new UiState()
}

export interface ThemeAction extends AnyAction {
    themeName: string
}

export const rootReducer = {
    ui: uiReducer
}

function uiReducer(state: UiState = loadPersistUi(), action: AnyAction) {
    const act = (action as ThemeAction)
    switch (act.type as string) {
        case 'setTheme':
            const theme: Theme = themes[act.themeName as keyof AvailableThemes]
            const newState =  {
                theme: theme
            }
            localStorage.setItem("_SHADER_VIEW_UI_STATE",JSON.stringify(newState))
            return newState
        default:
            return state
    }
}