import {Theme} from "@emotion/react";
import {Property} from 'csstype';

declare module '@emotion/react' {
    export interface Theme {
        name: string,
        backgroundColor: Property.Color,
        secondaryColor: Property.Color,
        textColor: Property.Color,
        foregroundColor: Property.Color,
        borderColor: Property.Color,
        fontFamily: Property.FontFamily,
        secondaryFontFamily: Property.FontFamily,
        elementColor: Property.Color,
    }
}

export interface AvailableThemes {
    dark: Theme,
    light: Theme
}

export const themes: AvailableThemes = {
    dark: {
        name: 'dark',
        backgroundColor: 'rgb(26, 28, 30)',
        secondaryColor: 'rgb(58, 60, 64)',
        textColor: 'white',
        foregroundColor: 'rgb(32,35,37)',
        borderColor: 'rgb(60,60,60)',
        fontFamily: 'roboto',
        secondaryFontFamily: 'monospace',
        elementColor: "rgb(90,80,200)"

    }, light: {
        name: 'light',
        backgroundColor: 'rgb(240,240,240)',
        secondaryColor: 'lightsteelblue',
        textColor: 'black',
        foregroundColor: 'whitesmoke',
        borderColor: 'rgb(50,50,50)',
        fontFamily: 'roboto',
        secondaryFontFamily: 'monospace',
        elementColor: 'rgb(200,200,200)'
    }
}