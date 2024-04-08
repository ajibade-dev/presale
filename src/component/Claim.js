import { useWeb3Contract } from "react-moralis";
import { Presale_ABI, Presale_Address } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function Claim() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const contAddress = chainId in Presale_Address ? Presale_Address[chainId][0] : null;

    const { runContractFunction: withdrawClaimForCurrentStage } = useWeb3Contract({
        abi: Presale_ABI,
        contractAddress: contAddress,
        functionName: "withdrawClaimForCurrentStage",
        params: {},
    });

  const handleWithdrawClaim = async () => {
    try {
        await withdrawClaimForCurrentStage();
        console.log("Claim withdrawn successfully");
    } catch (error) {
        if (error.message.includes("No claim available")) {
            console.log("Nothing to claim");
            // Display message to user indicating there is nothing to claim
        } else {
            console.error("Failed to withdraw claim:", error);
            // Handle other errors (display to user, etc.)
        }
    }
  };
  
   
/*     useEffect(() => {
        if (isWeb3Enabled) {
            // Optionally, you can call withdrawClaimForCurrentStage() here directly if you want to trigger it immediately on component mount.
        }
    }, [isWeb3Enabled]);  */

    return (
        <div className="flex flex-col justify-center items-center border-4 border-slate-400 rounded-md px-5 py-10 font-poppins font-semibold leading-10 tracking-wider mx-3 mt-3 md:mt-0 md:mx-0">
            {contAddress ? (
                <button className="md:mx-3 my-3 md:my-0 mx-1 px-4 py-1 bg-[#d55025] text-white rounded-md border-2 border-white" onClick={handleWithdrawClaim}>Withdraw Claim</button>
            ) : (
                <div className="">No BLAB to Claim</div>
            )}
        </div>
    );
}
