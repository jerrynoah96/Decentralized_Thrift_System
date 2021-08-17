import CanvasJSReact from "../canvasjs.react"
import "../styles/dashboardOverview.css"
import {MdToday} from "react-icons/md"
import {IoPeopleCircle} from "react-icons/io5"
import {GiMoneyStack} from "react-icons/gi"

const DashboardOverview = () => {
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;


    const options = {
        exportEnabled: false,
        animationEnabled: true,
        title: {
            text: "Members Overview",
            fontColor: "#c6c4cb",
        },
        data: [{
            type: "pie",
            startAngle: 75,
            toolTipContent: "<b>{label}</b>: {y}",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}",
            dataPoints: [
                { y: 2, label: "Available Members" },
                { y: 3, label: "Members yet to join" },
            ]
        }],
        backgroundColor: "transparent",
        theme: "dark2",
        height: 200,
    }

    return(
        <div className = "overview-container">
            <div className = "members-chart">
                <CanvasJSChart options = {options} />
            </div>
            <div className = "other-charts">
                <div className = "date-created">
                    <div className = "icon-container">
                        <MdToday className = "icon" />
                    </div>
                    <div className = "details-container">
                        <p className = "key">Created on</p>
                        <p className = "value">July 7 2021</p>
                    </div>
                </div>
                <div className = "members">
                    <div className = "icon-container">
                        <IoPeopleCircle className = "icon" />
                    </div>
                    <div className = "details-container">
                        <p className = "key">Members</p>
                        <p className = "value">4</p>
                    </div>
                </div>
                <div className = "total-collateral">
                    <div className = "icon-container">
                        <GiMoneyStack className = "icon" />
                    </div>
                    <div className = "details-container">
                        <p className = "key">Total Collateral</p>
                        <p className = "value">5000 DAI</p>
                    </div>
                </div>                
            </div>
        </div>
    );
}

export default DashboardOverview;