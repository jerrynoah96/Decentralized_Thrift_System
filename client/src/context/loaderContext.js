import {useState, createContext} from "react"

export const LoaderContext = createContext(null)

const LoaderContextProvider = ({children}) => {
    const [loaderState, setLoaderState] = useState(false)
    return(
        <LoaderContext.Provider value = {{loaderState, setLoaderState}}>
            {children}
        </LoaderContext.Provider>
    );
}

export default LoaderContextProvider;