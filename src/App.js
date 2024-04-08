import { MoralisProvider } from 'react-moralis';
import Header from './component/Header';
import Price from './component/GetPrice';
import Stage from './component/GetStage';
import HardCap from './component/GetHardCap';
import TokenLeft from './component/TokenLeft';
import TokenRaised from './component/TotalRaised';
import Claim from './component/Claim';
import { NotificationProvider } from '@web3uikit/core';

function App() {
  return (
    <MoralisProvider initializeOnMount = {false}>
      <NotificationProvider>
        <Header />
        <div className="flex md:flex-wrap flex-col justify-center w-screen md:flex-row gap-6 h-full text-white py-2 md:px-10 md:py-5 ">
        <Price />
       {/*  <Stage /> */}
        <HardCap />
        <TokenLeft />
        <TokenRaised />
        <Claim />
        </div>
       
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default App;
