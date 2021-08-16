import "../styles/backdrop.css";
const Backdrop = ({dismissModal}) => {
    return(
        <div className = "backdrop" onClick = {dismissModal}></div>
    );
}
export default Backdrop;