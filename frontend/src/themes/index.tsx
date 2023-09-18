import './Themes.scss';
import {createContext, ReactNode, useLayoutEffect, useState} from 'react';
import {localSet, localGet} from '@utils/localstorage';
import {ThemeTypes} from './Data';

export interface PropsTypes {
    selected: string[],
    theme: ThemeTypes,
    onSetTheme: () => void,
};

// for consuming in children components, initial state
export const Context = createContext<PropsTypes>({
    theme: {
        name: "light",
        background: "white",
    },
    selected: ["", ""],
    onSetTheme: () => null
});

// Provider in your app
export const Theme = ({children}: {children: ReactNode}) => {

    const theme_default = {name: "light", background: "white"};

    const theme_saved: ThemeTypes = localGet("theme");

    const theme_selected = theme_saved || theme_default;

    const [theme, setTheme] = useState<ThemeTypes>(theme_selected);

    const selected =         
        theme.name === "light"    ? [`#15bb39`, `#15bb3986`] :
        theme.name === "night"    ? [`#6042d7`, `#6042d7cb`] :
        theme.name === "sunset"   ? [`#e79b38`, `#e79b38`]   :
        theme.name === "ocean"    ? [`#1349e8` , `#1348e8c6`] : 
        theme.name === "thunder"  ? [`#f8ee29` , `#f8ee29ef`] :
        ["", ""]

    useLayoutEffect(() => { 
        document.body.style.background = theme.background 
    }, [theme]);

    const onSetTheme = () => {
        let theme_change = {name: "light", background: "white"};
        if(theme.name === "light") theme_change =  {name: "night",  background: "black"};
        if(theme.name === "night") theme_change =  {name: "sunset", background: "black"};
        if(theme.name === "sunset") theme_change = {name: "ocean",  background: "black"};
        if(theme.name === "ocean") theme_change =  {name: "thunder",  background: "black"};
        if(theme.name === "thunder") theme_change =  {name: "light",  background: "black"};
        setTheme(theme_change);
        localSet("theme", theme_change);
    };

    const value: PropsTypes = {
        selected,
        theme,
        onSetTheme,
    };
  
    return (
        <Context.Provider value={value}>
            <div className={`theme-${theme.name}`}>
                {children}
            </div>
        </Context.Provider>
    )
};

export default Theme