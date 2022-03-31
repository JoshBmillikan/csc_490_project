import {Theme} from "@emotion/react";
import {Property} from 'csstype';

declare module '@emotion/react' {
    export interface Theme {
        name: string,
        backgroundColor: Property.Color,
        secondaryColor: Property.Color,
        textColor: Property.Color,
        secondaryTextColor: Property.Color,
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
        secondaryTextColor: 'black',
        foregroundColor: 'rgb(32,35,37)',
        borderColor: 'rgb(60,60,60)',
        fontFamily: 'Helvetica Neue',
        secondaryFontFamily: 'monospace',
        elementColor: "rgb(90,80,200)"

    }, light: {
        name: 'light',
        backgroundColor: 'rgb(240,240,240)',
        secondaryColor: 'rgb(30,85,187)',
        textColor: 'black',
        secondaryTextColor: 'white',
        foregroundColor: 'whitesmoke',
        borderColor: 'rgb(30,85,187)',
        fontFamily: 'Helvetica Neue',
        secondaryFontFamily: 'monospace',
        elementColor: 'rgb(200,200,200)'
    }
}