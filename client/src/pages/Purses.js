import { useState, useEffect, useContext, useRef } from "react"
import {useHistory} from "react-router-dom"
import PurseCard from "../components/purseCard"
import PurseDetailsModal from "../components/purseDetailsModal"
import "../styles/purses.css"
import { GiWallet } from "react-icons/gi"
import { MdExplore } from "react-icons/md"
import CreatePurse from "../components/createPurse";
import CreateNewPurseModal from "../components/createNewPurseModal"
import { BsPlusCircle } from "react-icons/bs"
import PurseCardsContainer from "../components/purseCardsContainer"
import { useWeb3React } from '@web3-react/core'
import { ethers } from "ethers";
import purseFactoryAbi from "../ABI/purseFactoryAbi.json";
import purseAbi from "../ABI/purseAbi.json"
import tokenAbi from "../ABI/tokenAbi.json"
import {PurseContext} from "../context/purseContext";
import PurseCardSkeleton from "../components/purseCardSkeleton";
import {LoaderContext} from "../context/loaderContext";
import {NotificationManager} from 'react-notifications';
import {network} from '../connectors'


const Purses = () => {


    const { library, account, activate } = useWeb3React();

    const {setLoaderState} = useContext(LoaderContext)

    const history = useHistory();

    const {purseArray, setPurseArray} = useContext(PurseContext)
    const [displayPurseSkeletons, setDisplayPurseSkeletons] = useState(true)

    const tokenAddress = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";
    const purseFactoryAddress= "0x681254591658f6Ed04FC50e8225eb3Be9d8b00fE";


    const [activeTab, setActiveTab] = useState("myPurses")

    const [content, setContent] = useState([]);

    const [presentCreateNewPurseModal, setPresentCreateNewPurseModal] = useState(false)

    const [displayPurseDetailsModal, setDisplayPurseDetailsModal] = useState(false)

    const [currentlyDisplayedPurseDetails, setCurrentlyDisplayedPurseDetails] = useState({})

    const myPurses = useRef(null)
    const explore = useRef(null)

    const [newPurseData, setNewPurseData] = useState({
        amount: "",
        numberOfMembers: 2,
        frequency: 1,
        collateral: "0"
    })

    const isMoneyKey = (e) => {

        const charCode = (e.which) ? e.which : e.keyCode;

        if(charCode >= 48 && charCode <= 57) {
    
                    
            if(charCode === 48 && newPurseData.amount === "0") { // if the user tries to enter leading zeros continuosly
                e.preventDefault()
                return false;
            }
        
            return true;
        } else if(charCode === 46 && !!newPurseData.amount && newPurseData.amount.indexOf(".") === -1) { //allow the "." character only if it's not there before
            
            return true;
    
        }
        else {
            e.preventDefault();
            return false;
        }
    }

    const isNumberKey = (e) => {
        const charCode = (e.which) ? e.which : e.keyCode;

        if(charCode >= 48 && charCode <= 57)
            return true;

        e.preventDefault()
        return false
        

    }


    const onChangeAmount = (e) => {
        const value = e.target.value;

        if(value === "") {

            const collateral = "";
            setNewPurseData({...newPurseData, amount: value, collateral: collateral.toString()});
            return

        } else if(Number(value) > 0) {
            if(newPurseData.numberOfMembers === "") {
                const collateral = "";
                setNewPurseData({...newPurseData, amount: value, collateral: collateral.toString()})
                return;
            }
            const collateral = parseFloat(value) * (Number(newPurseData.numberOfMembers) - 1);
            setNewPurseData({...newPurseData, amount: value, collateral: collateral.toString()})
            return;
        } else if(Number(value) > 0) {
            const collateral = parseFloat(value) * (Number(newPurseData.numberOfMembers) - 1);
            setNewPurseData({...newPurseData, amount: value, collateral: collateral.toString()})
        }

        
        
    }


    const onChangeNumberOfMember = (e) => {

        const value = e.target.value;

        if(value === "") {

            const collateral = "";
            setNewPurseData({...newPurseData, numberOfMembers: value, collateral: collateral.toString()});
            return

        } else if(Number(value) >= 1) {

            if(newPurseData.amount === "") {

                const collateral = "";
                setNewPurseData({...newPurseData, numberOfMembers: value, collateral: collateral.toString()})
                return;

            }

            const collateral = parseFloat(newPurseData.amount) * (Number(value) - 1);
            setNewPurseData({...newPurseData, numberOfMembers: value, collateral: collateral.toString()})

        }

    }

    const onChangeFrequency = (e) => {
        const value = e.target.value;
        if(value === "0" && newPurseData.frequency === "") return

        setNewPurseData({...newPurseData, frequency: value})
    }

    const convertCreatedDay = (seconds) => {
        
        let date = new Date(0); // The 0 there is the key, which sets the date to the epoch
        date.setUTCSeconds(seconds);
    
        const dateArray = date.toString().split(' ');
    
        return `${dateArray[2]} ${dateArray[1]} ${dateArray[3]}`;
        
    }

    const onCreateNewPurse = async (e) => {
        e.preventDefault()

        if(!Number(newPurseData.amount)) {
            return NotificationManager.error('amount must be greater than 0', 'Error!', 4000, () => {}, true)
        }
        if(Number(newPurseData.numberOfMembers) < 2) {
            return NotificationManager.error('number of members must be equal to or greater than 2', 'Error!', 4000, () => {}, true)
        }
       
        await createPurse(newPurseData.amount, newPurseData.collateral, newPurseData.numberOfMembers, newPurseData.frequency);
    }
    

    useEffect(() => {

        // instantiating the purseFactory contract
        if (!!library) {
            const purseFactoryContractInstance = new ethers.Contract(purseFactoryAddress, purseFactoryAbi, library);

            
            (async () => {

                try {

                    const allPurseAddress = await purseFactoryContractInstance.allPurse();
                    
                    const purses = []

                    if(!allPurseAddress.length) return setDisplayPurseSkeletons(false); // this will only be true when no purse has been created by the purse factory

                    allPurseAddress.forEach(purseAddress => {
                        const purseContractInstance = new ethers.Contract(purseAddress, purseAbi, library);
    
                        Promise.all([
                            purseContractInstance.check_creation_date(),
                            purseContractInstance.deposit_amount(),
                            purseContractInstance.max_member_num(),
                            purseContractInstance.required_collateral(),
                            purseContractInstance.total_contribution(),
                            purseContractInstance.view_Members(),
                            purseContractInstance.bentoBox_balance(),
                            purseContractInstance.check_time_interval()
                        ]).then(data => {
                            purses.push({
                                id: purseAddress,
                                dayCreated: convertCreatedDay(data[0]),
                                members: data[5],
                                maxMember: data[2].toString(),
                                amount: ethers.utils.formatEther(data[1]),
                                collateral: ethers.utils.formatEther(data[3]),
                                totalContrbution: ethers.utils.formatEther(data[4]),
                                open: data[5].length < data[2],
                                frequency: data[7].toString(),
                                bentoBoxBal: data[6].toString()
                            })

                            if(purses.length === allPurseAddress.length)  {
                                setPurseArray(purses);
                                setDisplayPurseSkeletons(false);
                            }
                        })
    
                        
                    })

                } catch(err) {
                    setDisplayPurseSkeletons(false);
                    NotificationManager.error('Something went wrong', 'Cannot get purses', 3000, () => {}, true);
                }
            })();

            // listen for event here
            purseFactoryContractInstance.on('PurseCreated', () => {

                // to be changed in to a function later
                (async () => {
                    try {
                        const allPurseAddress = await purseFactoryContractInstance.allPurse();
                        
                        const purses = []

                        allPurseAddress.forEach(purseAddress => {
                            const purseContractInstance = new ethers.Contract(purseAddress, purseAbi, library);
        
                            Promise.all([
                                purseContractInstance.check_creation_date(),
                                purseContractInstance.deposit_amount(),
                                purseContractInstance.max_member_num(),
                                purseContractInstance.required_collateral(),
                                purseContractInstance.total_contribution(),
                                purseContractInstance.view_Members(),
                                purseContractInstance.bentoBox_balance(),
                                purseContractInstance.check_time_interval()
                            ]).then(data => {
                                purses.push({
                                    id: purseAddress,
                                    dayCreated: convertCreatedDay(data[0]),
                                    members: data[5],
                                    maxMember: data[2].toString(),
                                    amount: ethers.utils.formatEther(data[1]),
                                    collateral: ethers.utils.formatEther(data[3]),
                                    totalContrbution: ethers.utils.formatEther(data[4]),
                                    open: data[5].length < data[2],
                                    frequency: data[7].toString(),
                                    bentoBoxBal: data[6].toString()
                                })

                                if(purses.length === allPurseAddress.length)  {
                                    setPurseArray(purses);
                                    setDisplayPurseSkeletons(false);
                                }
                            })
        
                            
                        })
                    }catch(err) {
                        console.log(err)
                    }
                })()
            })
        } else {
            (async () => {
                // this will fire this useEffect again because library will be changed
                await activate(network);
            })();
            
        }
        // eslint-disable-next-line
    }, [library])


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


    const createPurse = async (contributionAmount, collateral, maxMember, frequency) => {

        if(!contributionAmount || !collateral || !maxMember || !frequency) return NotificationManager.error('Please fill all the fields appropriately', 'Error!', 3000, () => {}, true);


        if (!library && typeof purseFactoryAddress == 'undefined') return;


        const contributionAmountWEI = ethers.utils.parseEther(contributionAmount.toString())

        const collateralWEI = ethers.utils.parseEther(collateral.toString())


        try {

            await approve(purseFactoryAddress, Number(contributionAmount) + Number(collateral))

            const purseFactoryContractInstance = new ethers.Contract(purseFactoryAddress, purseFactoryAbi, library.getSigner());
            const createPurseTx = await purseFactoryContractInstance.createPurse(contributionAmountWEI, collateralWEI, Number(maxMember), frequency, { gasPrice: 1000000000, gasLimit: 6000000,});
            
            const txHash = await library.getTransaction(createPurseTx.hash);
            if(!txHash) return setLoaderState(false);

            setPresentCreateNewPurseModal(false)

            await createPurseTx.wait()
            
            const txReceipt = await library.getTransactionReceipt(createPurseTx.hash);

            setLoaderState(false);

            if (txReceipt && txReceipt.blockNumber) {
                NotificationManager.success('Purse created successfully', 'Success!', 3000, () => {}, true);
            } else {
                NotificationManager.error('Something went wrong', 'Error!', 3000, () => {}, true)
            }
            
        }catch(err) {
            console.log("Here: ", err)
            setLoaderState(false);
            NotificationManager.error('Something went wrong','Error!', 3000, () => {}, true)
        }

        
    }

    const joinPurse = async (e) => {        

        if (!library) return;
        e.preventDefault();
        const contributionAmountWEI = ethers.utils.parseEther(currentlyDisplayedPurseDetails.amount.toString(),)
        const collateralWEI = ethers.utils.parseEther(currentlyDisplayedPurseDetails.collateral.toString())
        try {
            await approve(currentlyDisplayedPurseDetails.id, Number(currentlyDisplayedPurseDetails.amount) + Number(currentlyDisplayedPurseDetails.collateral))
          
            const purseContractInstance = new ethers.Contract(currentlyDisplayedPurseDetails.id, purseAbi, library.getSigner());

            const joinPurse = await purseContractInstance.joinPurse(contributionAmountWEI, collateralWEI)

            const txHash = await library.getTransaction(joinPurse.hash);

            if(!txHash) return setLoaderState(false);

            setDisplayPurseDetailsModal(false)

            await joinPurse.wait()

            const txReceipt = await library.getTransactionReceipt(joinPurse.hash);

            setLoaderState(false);

            if (txReceipt && txReceipt.blockNumber) {
                NotificationManager.success('Joind a purse successfully', 'Success!', 3000, () => {}, true);
            } else {
                NotificationManager.error('Something went wrong', 'Error!', 3000, () => {}, true)
            }
        } catch(err) {
            setLoaderState(false);
            NotificationManager.error('Something went wrong, could not join purse', 'Error!', 3000, () => {}, true)
        }
    

    }


    const onChangeTab = ({ target }) => {
        switch (target.id) {
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
        if (presentCreateNewPurseModal)
            setPresentCreateNewPurseModal(false)
        else
            setPresentCreateNewPurseModal(true)
    }

    const onDisplayPurseDetailsModal = ({ currentTarget }) => {
        const purseID = currentTarget.id;

        const purse = purseArray.find(currentPurse => currentPurse.id === purseID)

        if(purse.members.includes(account))
            history.push(`/app/purse/${purse.id}`)
        else
            setCurrentlyDisplayedPurseDetails(purse)
    }

    const onDismissPurseDetailsModal = () => {
        setCurrentlyDisplayedPurseDetails({});
        setDisplayPurseDetailsModal(false);
    }


    useEffect(() => {
        let filtered;
        if (activeTab === "myPurses") {

            filtered = purseArray.filter(purse => purse.members.includes(account))
        } else {
            filtered = [...purseArray]
        }

        setContent(filtered)
        // eslint-disable-next-line
    }, [activeTab, purseArray])

    useEffect(() => {
        if (currentlyDisplayedPurseDetails.id)
            setDisplayPurseDetailsModal(true)
    }, [currentlyDisplayedPurseDetails, account])




    return (
        <div className="purses container">
            <div className="header">
                <h1 className="header-text">Cooperative Purses</h1>
                <button className="create-new-purse" onClick={onPresentCreateNewPurseModal}>Create New <BsPlusCircle className="create-new-purse-icon" /></button>
                <ul className="purses-nav">
                    <li className={activeTab === "myPurses" ? "nav-item active-nav-item" : "nav-item"} id="myPurses" ref={myPurses} onClick={onChangeTab}><GiWallet className="nav-icon" /> My Purses</li>
                    <li className={activeTab === "explore" ? "nav-item active-nav-item" : "nav-item"} id="explore" ref={explore} onClick={onChangeTab}><MdExplore className="nav-icon" /> Explore Purses</li>
                </ul>
            </div>

            <PurseCardsContainer>

                {displayPurseSkeletons ? Array(6).fill().map((element, index) => <div key = {index} className = "col-6"><PurseCardSkeleton /></div>) : !!content.length ? content.map(purse =><div className="col-6" key={purse.id}><PurseCard id={purse.id} onDisplayPurseDetailsModal={onDisplayPurseDetailsModal} dayCreated={purse.dayCreated} currrentNoOfMembers={purse.members.length} amount={purse.amount} open={purse.open} /></div>) : <CreatePurse setActiveTab={setActiveTab} onPresentCreateNewPurseModal={onPresentCreateNewPurseModal} />}
                
            </PurseCardsContainer>
            {presentCreateNewPurseModal && <CreateNewPurseModal
            newPurseData = {newPurseData}
            setNewPurseData = {setNewPurseData}
            onCreateNewPurse = {onCreateNewPurse}
            onChangeFrequency = {onChangeFrequency}
            onChangeNumberOfMember = {onChangeNumberOfMember}
            onChangeAmount = {onChangeAmount}
            isNumberKey = {isNumberKey}
            isMoneyKey = {isMoneyKey}
            dismissModal={onPresentCreateNewPurseModal}
            />}
            {displayPurseDetailsModal && <PurseDetailsModal onDismissPurseDetailsModal={onDismissPurseDetailsModal} purseDetails={currentlyDisplayedPurseDetails} joinPurse = {joinPurse}/>}
        </div>
    );
}

export default Purses;