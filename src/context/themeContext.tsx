import React, { Dispatch, SetStateAction, createContext, useEffect, useLayoutEffect, useRef, useState } from "react"


type Theme = 'light' | 'dark'

const usePrevious = (value: Theme) => {
  const ref = useRef<Theme>()
  
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const getInitialTheme = (key: string): Theme => {
  const storageTheme = window.localStorage.getItem(key) as Theme
  if(storageTheme) {
    return storageTheme
  }
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme)").matches ? "dark" : "light"
}

const useStorageTheme = (key: string): [Theme, Dispatch<SetStateAction<Theme>>] => {
  
  const [theme, setTheme] = useState<Theme>(getInitialTheme(key))

  useEffect(() => {
    window.localStorage.setItem(key, theme)
  }, [theme, key])

  return [theme, setTheme]
}

type ThemeContextProps = {
  theme: Theme;
  ToggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  ToggleTheme: () => {console.log("ToggleTheme")},
})

type PropsProvider = {
  children: React.ReactNode;
}

export const ThemeProvider = ({children}: PropsProvider) => {
  const [theme, setTheme] = useStorageTheme("theme")
  const oldTheme = usePrevious(theme)

  useLayoutEffect(() => {
    document.documentElement.classList.remove(oldTheme!)
    document.documentElement.classList.add(theme)
  }, [theme, oldTheme])

  const ToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{theme, ToggleTheme}} >
      {children}
    </ThemeContext.Provider>
  )
}