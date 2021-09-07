import { useState, useEffect, useContext, useRef } from "react";
import "../styles/purseDashboard.css";
import {useParams} from "react-router-dom";
import DashboardOverview from "../components/dashboardOverview";
import PurseDiscussion from "../components/purseDiscussion"
import PurseActions from "../components/purseActions"
import PurseMembersListModal from "../components/purseMembersListModal"
import {PurseContext} from "../context/purseContext";
import { useWeb3React } from '@web3-react/core'
import {useHistory} from "react-router-dom"
import {MdKeyboardBackspace} from "react-icons/md"
import purseAbi from "../ABI/purseAbi.json"
import { ethers } from "ethers";
import {LoaderContext} from "../context/loaderContext";
import {NotificationManager} from 'react-notifications';
import tokenAbi from "../ABI/tokenAbi.json"


const PurseDashboard = () => {
    
    const {id} = useParams()

    const {purseArray} = useContext(PurseContext)
    const {setLoaderState} = useContext(LoaderContext)
    const {account, library} = useWeb3React();
    const history = useHistory();
    const [activeTab, setActiveTab] = useState("overview")
    const [dashboardData, setDashboardData] = useState({})
    const [VotedMemberAddress, setVotedMemberAddress] = useState("")
    const [displayPurseMembersList, setDisplayPurseMembersList] = useState(false)

    const overviewLink = useRef(null);
    const chatRoomLink = useRef(null)
    const actionsLink = useRef(null)

    const tokenAddress = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";

    const onDisplayPurseMembersList = (e) => {
        
        e.preventDefault()

        if(displayPurseMembersList)
            setDisplayPurseMembersList(false)
        else
            setDisplayPurseMembersList(true)

    }


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

        if(dashboardData.members.length < dashboardData.maxMember) return  NotificationManager.error('Members to be in purse are yet to be completed', 'Error!', 3000, () => {}, true);

        // instantiating the purseFactory contract
        if (!!library && typeof dashboardData.id !== 'undefined') {
            const purseContractInstance = new ethers.Contract(dashboardData.id, purseAbi, library.getSigner());

            try{
                const moveFundsTx = await purseContractInstance.deposit_funds_to_bentoBox({gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 1000000})

                const txHash = await library.getTransaction(moveFundsTx.hash);

                if(txHash) setLoaderState(true);

                await moveFundsTx.wait();

                const txReceipt = await library.getTransactionReceipt(moveFundsTx.hash);

                setLoaderState(false);

                if (txReceipt && txReceipt.blockNumber) {
                    NotificationManager.success('Funds moved to Bentobox', 'Success!', 3000, () => {}, true);
                } else {
                    NotificationManager.error('Something went wrong', 'Error!', 3000, () => {}, true)
                }
            } catch(err) {
                setLoaderState(false);
                NotificationManager.error('Something went wrong', 'Error!', 3000, () => {}, true)
            }
           
        }
    }
    // for validating address input to vote for members
    const isAllowableEtheruemCharacter = (e) => {

        const charCode = (e.which) ? e.which : e.keyCode;

        if(VotedMemberAddress === "" && charCode === 48)
            return true;
        else if(VotedMemberAddress === "0" && (charCode === 88 || charCode === 120 ))
            return true
        else if(VotedMemberAddress.length >= 2 && /[a-fA-F0-9]/.test(String.fromCharCode(charCode))) {
            return true;
        }
        
        e.preventDefault();
        return false;
    }

    const onPasteToTokenContractAddress = (e) => {
        const pastedText = e.clipboardData.getData('Text')
        if(/^0x[a-fA-F0-9]{40}$/.test(pastedText))
            return true;
           
        e.preventDefault();
        NotificationManager.error('Not a valid address', 'Error!', 3000, () => {}, true)
        return false;
    }

    const onChangeMemberWallettAddress = (e) => {
        setVotedMemberAddress(e.target.value)
    }

    const onVoteToDisburseFund = async (e) => {

        e.preventDefault()
        if(!dashboardData.members.includes(VotedMemberAddress)) return NotificationManager.error('You cannot vote for non-member', 'Invalid member address!', 3000, () => {}, true)

        if (!!library && typeof dashboardData.id !== 'undefined') {

            const purseContractInstance = new ethers.Contract(dashboardData.id, purseAbi, library.getSigner());
            

            try{
                const voteTx = await purseContractInstance.voteToDisburseFundstoMember(VotedMemberAddress);

                const txHash = await library.getTransaction(voteTx.hash);

                if(txHash) setLoaderState(true);

                await voteTx.wait();

                const txReceipt = await library.getTransactionReceipt(voteTx.hash);

                setLoaderState(false);

                if (txReceipt && txReceipt.blockNumber) {
                    NotificationManager.success('Voted successfully', 'Success!', 3000, () => {}, true);
                } else {
                    NotificationManager.error('Something went wrong', 'Error!', 3000, () => {}, true)
                }

            } catch(err) {
                setLoaderState(false);
                NotificationManager.error('Something went wrong', 'Error!', 3000, () => {}, true)
            }
           
        }
    }


    const approve = async (address, amount) => {
        if (!!library && typeof tokenAddress !== 'undefined') {

            const amountWEI = ethers.utils.parseEther(amount.toString())

            const tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, library.getSigner());

            const app = await tokenInstance.approve(address, amountWEI);
            const txHash = await library.getTransaction(app.hash);
            if(txHash) setLoaderState(true);
            
            await app.wait();
        }
    }

    const deposite = async (e) => {
        e.preventDefault();

        if (!!library && typeof dashboardData.id !== 'undefined') {
            
        try {
            await approve(dashboardData.id, Number(dashboardData.amount))
          
            const purseContractInstance = new ethers.Contract(dashboardData.id, purseAbi, library.getSigner());


            const depositeFunds = await purseContractInstance.depositFunds()

            const txHash = await library.getTransaction(depositeFunds.hash);

            if(!txHash) return setLoaderState(false);

            await depositeFunds.wait()

            const txReceipt = await library.getTransactionReceipt(depositeFunds.hash);

            setLoaderState(false);

            if (txReceipt && txReceipt.blockNumber) {
                NotificationManager.success('Deposited succesfully', 'Success!', 3000, () => {}, true);
            } else {
                NotificationManager.error('Deposit not successfull', 'Something went wrong!', 3000, () => {}, true)
            }
        } catch(err) {
            setLoaderState(false);
            NotificationManager.error('Deposit not successfull', 'Something went wrong!', 3000, () => {}, true)
        }
           
        }

    }

    useEffect(() => {

        const purse = purseArray.find(currentPurse => currentPurse.id === id)

        if(!purse || !purse.members.includes(account)) history.push("/app/purses")
        
        setDashboardData(purse);

        // eslint-disable-next-line
    }, [])

   
        
    return(
        <div className = "purseDashboard">
            <div className = "back-btn-container" onClick = {() => history.push("/app/purses")}><MdKeyboardBackspace /></div>
            <nav className = "purseDashboard-sidebar">
                <ul className = "nav-link-container">
                    <button className = "display-member-button" onClick = {onDisplayPurseMembersList}>PURSE MEMBERS</button>
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
                    <h3 className = "bentoBox-bal">Bal of BentoBox: {dashboardData.bentoBoxBal} DAI</h3>
                    </div>
                    }
                    <button onClick = {MoveFundsToBentoBox} className = "to-bentoBox">Move funds to bentoBox <img className = "bento-logo" alt = "bentBox logo" src = "https://raw.githubusercontent.com/sushiswap/sushi-content/master/products/bento-color.png" /></button>
                </div>
                <main className = "main-content">
                    {activeTab === "overview" && dashboardData.id && <DashboardOverview maxMember = {dashboardData.maxMember} availableMember = {dashboardData.members.length} dayCreated = {dashboardData.dayCreated} totalCollateral = {dashboardData.collateral} />}
                    {activeTab === "chat-room" && <PurseDiscussion />}
                    {activeTab === "actions" && <PurseActions VotedMemberAddress = {VotedMemberAddress} onChangeMemberWallettAddress = {onChangeMemberWallettAddress} isAllowableEtheruemCharacter = {isAllowableEtheruemCharacter} onPasteToTokenContractAddress = {onPasteToTokenContractAddress} onVoteToDisburseFund = {onVoteToDisburseFund} deposite = {deposite} />}
                </main>
            </div>
            {displayPurseMembersList && dashboardData.id && <PurseMembersListModal members = {dashboardData.members} dismissModal = {onDisplayPurseMembersList} />}
        </div>
    );
}

export default PurseDashboard;