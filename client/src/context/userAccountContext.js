import { createContext } from "react";

const UserAccoount = createContext(null);




const userAccountProvider = ({children}) => {
    return(
        <UserContext.Provider value = {{}}>
            {children}
        </UserContext.Provider>
    );
}