import { createContext, useState } from "react";

export const AppContext = createContext(null);



const AppContextProvider = ({children}) => {

    const [userAccount, setUserAccount] = useState({
        userAccount: null,
        userSecret: null
    })

    return(
        <AppContext.Provider value = {{userAccount, setUserAccount}}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;