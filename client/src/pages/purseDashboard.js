import { useState, useEffect, useContext, useRef } from "react";
import "../styles/purseDashboard.css";
import {useParams} from "react-router-dom";
import DashboardOverview from "../components/dashboardOverview";
import PurseDiscussion from "../components/purseDiscussion"
import PurseActions from "../components/purseActions"
import {PurseContext} from "../context/purseContext";
import { useWeb3React } from '@web3-react/core'
import {useHistory} from "react-router-dom"
import {MdKeyboardBackspace} from "react-icons/md"
import purseAbi from "../ABI/purseAbi.json"
import { ethers } from "ethers";
const PurseDashboard = () => {
    
    const {id} = useParams()

    const {purseArray} = useContext(PurseContext)
    const {account, library} = useWeb3React();
    const history = useHistory();
    const [activeTab, setActiveTab] = useState("overview")
    const [dashboardData, setDashboardData] = useState({})

    const overviewLink = useRef(null);
    const chatRoomLink = useRef(null)
    const actionsLink = useRef(null)


    const onChangeTab = ({target}) => {
        switch(target.id) {
            case "overview":
                setActiveTab("overview")
                overviewLink.current.classList.add("active")
                chatRoomLink.current.classList.remove("active")
                actionsLink.current.classList.remove("active")
                break;
            case "chat-room":
                setActiveTab("chat-room")
                chatRoomLink.current.classList.add("active")
                overviewLink.current.classList.remove("active")
                actionsLink.current.classList.remove("active")
                break;
             case "actions":
                setActiveTab("actions")
                actionsLink.current.classList.add("active")
                overviewLink.current.classList.remove("active")
                chatRoomLink.current.classList.remove("active")
                break;
            default:
                break;
        }
    }

    const MoveFundsToBentoBox = async (e) => {
        e.preventDefault();
        // instantiating the purseFactory contract
        if (!!library && typeof dashboardData.id !== 'undefined') {
            const purseContractInstance = new ethers.Contract(dashboardData.id, purseAbi, library.getSigner());

            try{
                await purseContractInstance.deposit_funds_to_bentoBox({gasPrice: ethers.utils.parseUnits('200', 'gwei'), gasLimit: 1000000})
            } catch(err) {
                console.log(err)
            }
           
        }
    }

    useEffect(() => {

        const purse = purseArray.find(currentPurse => currentPurse.id === id)

        if(!purse || !purse.members.includes(account)) history.push("/app/purses")
        
        setDashboardData(purse);

    }, [])

   
        
    return(
        <div className = "purseDashboard">
            <div className = "back-btn-container" onClick = {() => history.push("/app/purses")}><MdKeyboardBackspace /></div>
            <nav className = "purseDashboard-sidebar">
                <ul className = "nav-link-container">
                    <li className = "nav"><button className = "active" id = "overview" ref = {overviewLink} onClick = {onChangeTab}>Overview</button></li>
                    <li className = "nav"><button id = "chat-room" ref = {chatRoomLink} onClick = {onChangeTab}>Chat Room</button></li>
                    <li className = "nav"><button id = "actions" ref = {actionsLink} onClick = {onChangeTab}>Actions</button></li>
                </ul>
            </nav>
            <div className = "right-container">
                <div className = "header">
                    <h1 className = "dashboard-title">DASHBOARD</h1>
                    {dashboardData.id && <div className = "info">
                    <h3 className = "purse-id">PURSE ID: {`${dashboardData.id.substr(0,6)}...${dashboardData.id.substr(dashboardData.id.length-4, id.length)}`}</h3>
                    <h3 className = "bentoBox-bal">Bal of BentoBox: {dashboardData.bentoBoxBal} TTK</h3>
                    </div>
                    }
                    <button onClick = {MoveFundsToBentoBox} className = "to-bentoBox">Move funds to bentoBox <img className = "bento-logo" alt = "bentBox logo" src = "https://raw.githubusercontent.com/sushiswap/sushi-content/master/products/bento-color.png" /></button>
                </div>
                <main className = "main-content">
                    {activeTab === "overview" && dashboardData.id && <DashboardOverview maxMember = {dashboardData.maxMember} availableMember = {dashboardData.members.length} dayCreated = {dashboardData.dayCreated} totalCollateral = {dashboardData.collateral} />}
                    {activeTab === "chat-room" && <PurseDiscussion />}
                    {activeTab === "actions" && <PurseActions />}
                </main>
            </div>
        </div>
    );
}

export default PurseDashboard;