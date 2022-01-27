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
    }
}

export const themes:Theme[] = [{
    name: 'dark',
    backgroundColor: 'rgb(26, 28, 30)',
    secondaryColor: 'rgb(58, 60, 64)',
    textColor: 'white',
    foregroundColor: 'rgb(32,35,37)',
    borderColor: 'rgb(60,60,60)'
}, {
    name: 'light',
    backgroundColor: 'lightgrey',
    secondaryColor: 'lightsteelblue',
    textColor: 'black',
    foregroundColor: 'whitesmoke',
    borderColor: 'rgb(50,50,50)'
}]