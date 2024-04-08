import {ConnectButton} from '@web3uikit/web3';
// import bits from "../logo/bits.png"

export default function Header() {
    return (
        <div className="flex flex-row bg-[#07091a] text-white justify-between px-10 py-2">
            {/* <img src={bits} alt="bits" /> */}
            
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
