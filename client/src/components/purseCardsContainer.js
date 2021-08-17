import "../styles/purseCardsContainer.css"

const PurseCardContainer = ({children}) => {
    return(
        <div className = "row purseCard-enclosing-component">
            {children}
        </div>
    );
}

export default PurseCardContainer;