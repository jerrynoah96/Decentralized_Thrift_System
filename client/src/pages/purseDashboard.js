import { useState, useEffect, useContext } from "react";
import "../styles/purseDashboard.css";
import {useParams} from "react-router-dom";
import DashboardOverview from "../components/dashboardOverview";
import PurseDiscussion from "../components/purseDiscussion"
import PurseActions from "../components/purseActions"
import {PurseContext} from "../context/purseContext";
import { useWeb3React } from '@web3-react/core'
import {useHistory} from "react-router-dom"
import {MdKeyboardBackspace} from "react-icons/md"
const PurseDashboard = () => {
    
    const {id} = useParams()
    console.log("params: ", id)
    const {purseArray} = useContext(PurseContext)
    const {account } = useWeb3React();
    const history = useHistory();
    const [activeTab, setActiveTab] = useState("overview")
    const [currentContent, setCurrentContent] = useState(<DashboardOverview />)
    const [dashbordData, setDashboardData] = useState({})

    const onChangeTab = ({target}) => {
        switch(target.id) {
            case "overview":
                setActiveTab("overview")
                break;
            case "discussion":
                setActiveTab("discussion")
                break;
             case "actions":
                setActiveTab("actions")
                break;
            default:
                break;
        }
    }

    useEffect(() => {

        const purse = purseArray.find(currentPurse => currentPurse.id === id)

        if(!purse || !purse.members.includes(account)) history.push("/app/purses")
        

        setDashboardData(purse);
    })
        
    return(
        <div className = "purseDashboard">
            <div className = "back-btn-container" onClick = {() => history.push("/app/purses")}><MdKeyboardBackspace /></div>
            <nav className = "purseDashboard-sidebar">
                <ul className = "nav-link-container">
                    <li className = "nav"><button className = "active" id = "overview" onClick = {onChangeTab}>Overview</button></li>
                    <li className = "nav"><button id = "discussion" onClick = {onChangeTab}>Discussion (26)</button></li>
                    <li className = "nav"><button id = "actions" onClick = {onChangeTab}>Actions</button></li>
                </ul>
            </nav>
            <div className = "right-container">
                <div className = "header">
                    <h1 className = "dashboard-title">DASHBOARD</h1>
                    {dashbordData.id && <h3 className = "purse-id">PURSE ID: {`${dashbordData.id.substr(0,6)}...${dashbordData.id.substr(dashbordData.id.length-4, id.length)}`}</h3>}
                </div>
                <main className = "main-content">
                    {dashbordData.id && <DashboardOverview maxMember = {dashbordData.maxMember} availableMember = {dashbordData.members.length} dayCreated = {dashbordData.dayCreated} totalCollateral = {dashbordData.collateral} />}
                </main>
            </div>
        </div>
    );
}

export default PurseDashboard;

// vote to disburse funds takes in address
// move funds to bentobox
// total funds
// total collateral
// time created