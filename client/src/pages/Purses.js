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


const Purses = () => {


    const { library, account } = useWeb3React();

    const history = useHistory();

    const {purseArray, setPurseArray} = useContext(PurseContext)
    const [displayPurseSkeletons, setDisplayPurseSkeletons] = useState(true)

    const purseFactoryAddress = "0x7239Ed91837Fd756B6C228B3e8A7a9d4A411eb4f";
    const tokenAddress = "0xf0169620C98c21341aBaAeaFB16c69629Dafc06b"

    const [activeTab, setActiveTab] = useState("myPurses")

    const [content, setContent] = useState([]);

    const [presentCreateNewPurseModal, setPresentCreateNewPurseModal] = useState(false)

    const [displayPurseDetailsModal, setDisplayPurseDetailsModal] = useState(false)

    const [currentlyDisplayedPurseDetails, setCurrentlyDisplayedPurseDetails] = useState({})

    const myPurses = useRef(null)
    const explore = useRef(null)

    const [newPurseData, setNewPurseData] = useState({
        amount: "0",
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
        if(newPurseData.amount === "0") {
            const collateral = parseFloat(value.charAt(value.length-1)) * Number(newPurseData.numberOfMembers);
            setNewPurseData({...newPurseData, amount: value.charAt(value.length-1), collateral: collateral.toString()})
            return;

        }
        const collateral = (parseFloat(value) * Number(newPurseData.numberOfMembers)) || 0;
        setNewPurseData({...newPurseData, amount: value, collateral: collateral.toString()});
        
    }


    const onChangeNumberOfMember = (e) => {
        const value = e.target.value;
        if(value === "0" && newPurseData.numberOfMembers === "") {

            const collateral = parseFloat(newPurseData.amount) * Number(value.charAt(value.length-1)) || 0;
            setNewPurseData({...newPurseData, numberOfMembers: value.charAt(value.length-1), collateral: collateral.toString()})
            return
        } 

        const collateral = (parseFloat(newPurseData.amount) * Number(value) || 0);
        setNewPurseData({...newPurseData, numberOfMembers: value, collateral: collateral.toString()})
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
            return alert("amount must be greater than 0")
        }
        if(Number(newPurseData.numberOfMembers) < 2) {
            return alert("number of members must be equal to or greater than 2")
        }
       
        await createPurse(newPurseData.amount, newPurseData.collateral, newPurseData.numberOfMembers, newPurseData.frequency);
    }

    

    useEffect(() => {

        // instantiating the purseFactory contract
        if (!!library && typeof purseFactoryAddress !== 'undefined') {
            const purseFactoryContractInstance = new ethers.Contract(purseFactoryAddress, purseFactoryAbi, library);

            (async () => {
                const allPurseAddress = await purseFactoryContractInstance.allPurse();
               
                const purses = []

               if(!allPurseAddress.length) return setDisplayPurseSkeletons(false);

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
            })();
        }
        // eslint-disable-next-line
    }, [library])


    const approve = async (address, amount) => {
        if (!!library && typeof tokenAddress !== 'undefined') {

            const amountWEI = ethers.utils.parseEther(amount.toString())

            const tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, library.getSigner());

            const app = await tokenInstance.approve(address, amountWEI);

            await app.wait();
        }
    }


    const createPurse = async (contributionAmount, collateral, maxMember, frequency) => {

        if(!contributionAmount || !collateral || !maxMember || !frequency) return;


        if (!library && typeof purseFactoryAddress == 'undefined') return;

        const contributionAmountWEI = ethers.utils.parseEther(contributionAmount.toString(),)

        const collateralWEI = ethers.utils.parseEther(collateral.toString())


        try {

            await approve(purseFactoryAddress, Number(contributionAmount) + Number(collateral))

            const purseFactoryContractInstance = new ethers.Contract(purseFactoryAddress, purseFactoryAbi, library.getSigner());
            await purseFactoryContractInstance.createPurse(contributionAmountWEI, collateralWEI, Number(maxMember), frequency);
        }catch(err) {
            console.log(err)
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
            await purseContractInstance.joinPurse(contributionAmountWEI, collateralWEI)
        } catch(err) {
            console.log(err)
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