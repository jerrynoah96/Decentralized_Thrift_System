import {useState, createContext} from "react"

export const PurseContext = createContext(null)

const PurseContextProvider = ({children}) => {
    const [purseArray, setPurseArray] = useState([])
    return(
        <PurseContext.Provider value = {{purseArray, setPurseArray}}>
            {children}
        </PurseContext.Provider>
    );
}

export default PurseContextProvider;