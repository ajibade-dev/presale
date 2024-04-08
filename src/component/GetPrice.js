import { useWeb3Contract } from "react-moralis";
import { Presale_ABI, Presale_Address } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import {useState} from "react";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";


export default function Price() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [price, setPrice] = useState(0);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState(null);
  const contAddress = chainId in Presale_Address ? Presale_Address[chainId][0] : null;
  const [numberOfTokens, setNumberOfTokens] = useState(0);

  //const msgValue = ethers.utils.parseEther(price.toString()).mul(numberOfTokens);

  const { dispatch } = useNotification();

  const { runContractFunction: getCurrentStage } = useWeb3Contract({
      abi: Presale_ABI,
      contractAddress: contAddress,
      functionName: "getCurrentStage",
      params: {},
  })

  const { runContractFunction: buyTokens } = useWeb3Contract({
      abi: Presale_ABI,
      contractAddress: contAddress,
      functionName: "buyTokens",
      params: { numberOfTokens }, // Convert numberOfTokens to number
      msgValue: price*numberOfTokens, //* parseInt(numberOfTokens), // Convert numberOfTokens to number
    });

  const { runContractFunction: getCurrentStagePrice } = useWeb3Contract({
    abi: Presale_ABI,
    contractAddress: contAddress,
    functionName: "getCurrentStagePrice",
    params: {},
  })




 //Use Effects
 
  useEffect(() => {
    if(isWeb3Enabled) {
      async function getPrice() {
        try {
          let currentPrice = (await getCurrentStagePrice()).toString();
          if (currentPrice !== undefined || currentPrice !== null) {
            setPrice(currentPrice);
          } else {
            setPrice('0'); // Set to 0 if undefined
          }
        } catch (error) {
          setError(error.message || "Error fetching total raised");
        }
      }
      getPrice()
    }

  }, [isWeb3Enabled, getCurrentStagePrice])


  useEffect(() => {
    if (isWeb3Enabled) {
      async function getStage() {
        try {
          let stage = (await getCurrentStage()).toString();
          if (stage !== undefined) {
            setStage(stage);
          } else {
            setStage('0'); // Set to 0 if undefined
          }
        } catch (error) {
          setError(error.message || "Error fetching total raised");
        }
      }

      getStage();
    }
  }, [isWeb3Enabled, getCurrentStage]);


  const handleSuccess = async (tx) => {
    await tx.wait(1);
    if (tx.status === 1) {
        handleNewNotification();
    }
 }

  const handleNewNotification = () => {
      dispatch({
          type: 'info',
          title: 'Transaction Notification',
          message: 'Transaction Complete!',
          position: 'topR',
          icon: 'bell',
      });
  }

 /*  const handleFailedNotification =  () => {
    // Check the conditions for displaying notifications
    if (stage === 0) {
        dispatch({
            type: 'error',
            title: 'Error',
            message: 'You cannot perform this action at stage zero.',
        });
        return;
    }

    if (stage === 7) {
        dispatch({
            type: 'error',
            title: 'Error',
            message: 'The presale has ended. You cannot perform this action.',
        });
        return;
    }

    if (!numberOfTokens || numberOfTokens === 0) {
      dispatch({
          type: 'error',
          title: 'Error',
          message: 'Please enter a valid amount.',
      });
      return;
  }
  

    try {
        // Code to send the transaction
    } catch (error) {
        console.error("Transaction failed:", error);
        if (error.message.includes('User denied transaction')) {
            dispatch({
                type: 'error',
                title: 'Transaction Rejected',
                message: 'You have rejected the transaction.',
            });
        } else {
            dispatch({
                type: 'error',
                title: 'Transaction Failed',
                message: 'The transaction failed. Please try again later.',
            });
        }
    }
};
 */



  return (

    <div className="flex flex-col justify-center items-center border-4 border-slate-400 rounded-md px-5 py-10 font-poppins font-semibold leading-10 tracking-wider mx-3 mt-3 md:mt-0 md:mx-0">
      {error ?
      (<>
        <div className="">
          <p>Error: {error}</p>
          <h1 className="">Current Stage Price: {ethers.utils.formatUnits(price, "ether")}BNB</h1>
          <h1 className="">Buy Tokens</h1>
          <input type="number" placeholder="Number of Tokens" onChange={(e) => setNumberOfTokens(parseInt(e.target.value))}/> 
          <button onClick={async function(){
            await buyTokens({
              onSuccess: handleSuccess
            })
          }}>Buy Now</button>

        </div>
        {console.log("Invalid number of token was entered!")}
      </>):
        (<div>
          <h1>Current Stage:<span className="text-[#d55025]"> {stage}</span></h1>
          <h1>Current Stage Price:<span className="text-[#d55025]"> {ethers.utils.formatUnits(price, "ether")}BNB</span></h1>
          <h1 className="text-[#d55025] text-2xl my-2">Buy Tokens</h1>
          <input className="border-2 border-[#a35338] text-black rounded-md" type="number" placeholder="Number of Tokens" onChange={(e) => setNumberOfTokens(parseInt(e.target.value))}/> 
          <button className="md:mx-3 my-3 md:my-0 mx-1 px-4 py-1 bg-[#d55025] text-white rounded-md border-2 border-white"
           onClick={async function(){
            await buyTokens({
              onSuccess: handleSuccess
            })
          }}>Buy Now</button>

        </div>)}
    </div>

    )
}

//Error: {error}




/*    const buyTokensHandler = async () => {
    // User confirmation (replace with your preferred method)
    if (!window.confirm("Are you sure you want to purchase tokens?")) {
      return;
    }

    console.log("Transaction Parameters:", { numberOfTokens, price });
    console.log("Contract Information:", { Presale_ABI,Presale_Address });
    //console.log("Moralis Provider Status:", Moralis.provider);

    try {
      const tx = await buyTokens();
      if (!tx || typeof tx.hash !== 'string') {
        throw new Error("Transaction failed: Returned transaction object is invalid");
      }
      console.log("Transaction initiated:", tx.hash);

      // Handle transaction updates (optional)
      // You can use a library like web3.eth.getTransactionReceipt to track the transaction status and update the UI accordingly.

      // Display success message on successful transaction
      console.log("Transaction successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
      setError(error.message || "Transaction failed");
    }
  }; */