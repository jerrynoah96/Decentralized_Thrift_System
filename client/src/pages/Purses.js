import {useState, useEffect, useRef} from "react"
import PurseCard from "../components/purseCard"
import PurseDetailsModal from "../components/purseDetailsModal"
import "../styles/purses.css"
import {GiWallet} from "react-icons/gi"
import {MdExplore} from "react-icons/md"
import CreatePurse from "../components/createPurse";
import CreateNewPurseModal from "../components/createNewPurseModal"
import {BsPlusCircle} from "react-icons/bs"
import PurseCardsContainer from "../components/purseCardsContainer"

const purseArray = [
    {
        id: "4D4T43F",
        dayCreated: "Aug 6, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "3",
        amount: "200USDT",
        open: false,
        isMember: false
    },
    {
        id: "498TRIG",
        dayCreated: "JUL 21, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "12",
        amount: "500USDT",
        open: true,
        isMember: false
    },
    {
        id: "5R456GE",
        dayCreated: "JAN 4, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "45",
        amount: "30USDT",
        open: false,
        isMember: false
    },
    {
        id: "GY3R56T",
        dayCreated: "MAY 6, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "24",
        amount: "50USDT",
        open: false,
        isMember: false
    },
    {
        id: "2E4RU7T",
        dayCreated: "MAR 12, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "2",
        amount: "100USDT",
        open: true,
        isMember: false
    },
    {
        id: "GU57EY4",
        dayCreated: "APR 5, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "12",
        amount: "400USDT",
        open: false,
        isMember: false
    },
    {
        id: "4MG85YD",
        dayCreated: "FEB 20, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "6",
        amount: "500USDT",
        open: true,
        isMember: false
    },
    {
        id: "2NFG5T6",
        dayCreated: "MAY 2, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "3",
        amount: "1000USDT",
        open: true,
        isMember: false
    },
    {
        id: "9H5Y6R7",
        dayCreated: "APR 12, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "13",
        amount: "700USDT",
        open: true,
        isMember: false
    },
    {
        id: "2E4R5T6",
        dayCreated: "JUN 6, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "3",
        amount: "600USDT",
        open: false,
        isMember: false
    },
    {
        id: "7U8E4R5",
        dayCreated: "AUG 1, 2021",
        maxNumberOfMember: "5",
        members: ["0xhjgr8t384u", "0xhjgr8t384u", "0xhjgr8t384u"],
        frequency: "7",
        collateralAmount: "500",
        currrentNoOfMembers: "1",
        amount: "5800USDT",
        open: false,
        isMember: false
    },

]

const Purses = () => {


    const { library, account } = useWeb3React();

    const purseFactoryAddress = "0xEB7031C3eD303ABAbdE60ee414e141fca5Fbe51b";

    
    useEffect(() => {

        // instantiating the purseFactory contract
        if (!!library && typeof purseFactoryAddress !== 'undefined') {
            const purseFactoryAddressInstance = new ethers.Contract(purseFactoryAddress, abi, library);
        
            // (async () => {
            //     const allPurses = await purseFactoryAddressInstance.name();
            //     console.log(name)

            // })();
        }
    },[account, purseFactoryAddress, library])

    const [activeTab, setActiveTab] = useState("myPurses")
    const [content, setContent] = useState([]);
    const [presentCreateNewPurseModal, setPresentCreateNewPurseModal] = useState(false)
    const [displayPurseDetailsModal, setDisplayPurseDetailsModal] = useState(false)

    const [currentlyDisplayedPurseDetails, setCurrentlyDisplayedPurseDetails] = useState({})

    const myPurses = useRef(null)
    const explore = useRef(null)

    const onChangeTab = ({target}) => {
        switch(target.id) {
            case "myPurses":
                setActiveTab("myPurses")
                break;
            case "explore":
                setActiveTab("explore")
                break;
            default:
                break;
        }
    }

    const onPresentCreateNewPurseModal = () => {
        if(presentCreateNewPurseModal)
            setPresentCreateNewPurseModal(false)
        else
            setPresentCreateNewPurseModal(true)
    }

    const onDisplayPurseDetailsModal = ({currentTarget}) => {
        const purseID = currentTarget.id;

        const currentPurse = purseArray.find(purse => purse.id === purseID)
        setCurrentlyDisplayedPurseDetails(currentPurse)
    }

    const onDismissPurseDetailsModal = () => {
        setCurrentlyDisplayedPurseDetails({});
        setDisplayPurseDetailsModal(false);
    }


    useEffect(() => {
        let filtered;
        if(activeTab === "myPurses") {
            
            filtered = purseArray.filter(purse => purse.isMember) 
        } else {
            filtered = [...purseArray]
        }

        setContent(filtered)
    }, [activeTab])

    useEffect(() => {
        if(currentlyDisplayedPurseDetails.id)
            setDisplayPurseDetailsModal(true)
    }, [currentlyDisplayedPurseDetails])



   
    return(
        <div className = "purses container">
            <div className = "header">
                <h1 className = "header-text">Cooperative Purses</h1>
                <button className = "create-new-purse" onClick = {onPresentCreateNewPurseModal}>Create New <BsPlusCircle className = "create-new-purse-icon"/></button>
                <ul className = "purses-nav">
                    <li className = {activeTab === "myPurses" ? "nav-item active-nav-item" : "nav-item"}  id = "myPurses" ref = {myPurses} onClick = {onChangeTab}><GiWallet className = "nav-icon" /> My Purses</li>
                    <li className = {activeTab === "explore" ? "nav-item active-nav-item" : "nav-item"} id = "explore" ref = {explore} onClick = {onChangeTab}><MdExplore className = "nav-icon"/> Explore Purses</li>
                </ul>
            </div>
            
            <PurseCardsContainer>
                {!!content.length ?
                    content.map(purse => {
                        return <div className = "col-6" key = {purse.id}><PurseCard id = {purse.id} onDisplayPurseDetailsModal = {onDisplayPurseDetailsModal} dayCreated = {purse.dayCreated} currrentNoOfMembers = {purse.currrentNoOfMembers} amount = {purse.amount} open = {purse.open}/></div>
                    }) : <CreatePurse setActiveTab = {setActiveTab} onPresentCreateNewPurseModal = {onPresentCreateNewPurseModal} />}
            </PurseCardsContainer>
                {presentCreateNewPurseModal && <CreateNewPurseModal dismissModal = {onPresentCreateNewPurseModal} /> }
                {displayPurseDetailsModal && <PurseDetailsModal onDismissPurseDetailsModal = {onDismissPurseDetailsModal} purseDetails = {currentlyDisplayedPurseDetails} /> }
        </div>
    );
}

export default Purses;