import { useState, useEffect } from "react";
import "../styles/purseDashboard.css";
import {useParams} from "react-router-dom";
import DashboardOverview from "../components/dashboardOverview";
import PurseDiscussion from "../components/purseDiscussion"
import PurseActions from "../components/purseActions"
const PurseDashboard = () => {
    
    const {id} = useParams()

    const [activeTab, setActiveTab] = useState("overview")
    const [currentContent, setCurrentContent] = useState(<DashboardOverview />)

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
        
    return(
        <div className = "purseDashboard">
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
                    <h3 className = "purse-id">PURSE ID: {"0x67d...D8dd2"}</h3>
                </div>
                <main className = "main-content">
                    {currentContent}
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