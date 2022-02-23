import {Theme} from "@emotion/react";
import {AvailableThemes, themes} from "./theme";
import {AnyAction} from "@reduxjs/toolkit";
//import {Prism} from "";

export class UiState {
    theme: Theme = themes.dark
}

export class ShaderState {
    selectedShaderName: string = "vertex";
    vertex: string = vertexShaderSource;
    fragment: string = fragShaderSource;
}

function loadPersistUi(): UiState {
    const saved = localStorage.getItem("_SHADER_VIEW_UI_STATE")
    if (saved)
        return JSON.parse(saved) ?? new UiState()
    else return new UiState()
}

function loadPersistShader(): ShaderState {
    const saved = localStorage.getItem("_SHADER_STATE")
    if (saved)
        return JSON.parse(saved) ?? new ShaderState()
    else return new ShaderState()
}

export interface ThemeAction extends AnyAction {
    themeName: string
}

export interface ShaderAction extends AnyAction {
    shaderName: string,
    newShader: string | null
}

export const rootReducer = {
    ui: uiReducer,
    shader: shaderReducer
}

function shaderReducer(state: ShaderState = loadPersistShader(), action: AnyAction) {
    const act = (action as ShaderAction)
    switch (act.type as string) {
        case "updateShader":
            const key = act.shaderName as keyof typeof state
            let newState = {...state}
            newState[key] = act.newShader!
            localStorage.setItem("_SHADER_STATE", JSON.stringify(newState))
            //console.log(newState[key]);
            let result_element = document.getElementById("#highlighting-content");
            if (result_element && result_element.innerText) {
                result_element.innerText = newState[key];
                //Prism.highlightElement(result_element);
            }
            return newState
        case "selectShader":
            return {
                ...state,
                selectedShaderName: act.shaderName,
            }
        default: return state
    }
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

const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

const fragShaderSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;