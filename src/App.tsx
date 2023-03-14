import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

import { GiveForeverContract } from './types';

import './App.css';
import giveForeverAbi from './GiveForeverABI.json';

// const contractAddress = '0xADdAf656b0dCf066197156105B8770B2A91d9C31'; // Goerli
// const walletAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // from *.sol file 

function App() {
  const [userAmount, setUserAmount] = useState<string>('');
  const [contract, setContract] = useState<GiveForeverContract>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [userAddress, setUserAddress] = useState<string>();
  const [walletAddress, setWalletAddress] = useState<string>('');


  const connect = async () => {
    if (!walletAddress || !window.ethereum) return;

    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      console.log('signer: ', signer);
      const contract = new ethers.Contract(
        walletAddress,
        giveForeverAbi,
        signer
      ) as GiveForeverContract;

      setContract(contract);

      const awaitedUserAddress = await signer.getAddress();
      setUserAddress(awaitedUserAddress);
      console.log('User address: ', awaitedUserAddress);
      setIsLoading(false);
    }
    catch (e) {
      console.log('Something went wrong... ', e);
      setIsLoading(false);
    }
  }

  const donate = async () => {
    const weiAmount = ethers.utils.parseEther(userAmount);
    console.log('weiAmount: ', weiAmount);

    const tx: any = await contract?.deposit({ value: weiAmount });
    console.log('tx: ', tx);
    const receipt = await tx.wait();
    console.log('receipt: ', receipt);
  }

  const withdraw = async () => {
    if (!contract) return;

    await contract.withdraw();
  }

  const isContractLoaded = contract && !isLoading;

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <span className='blue'>
            Give
          </span>
          Forever
          <br />
          <span className='description'>A perpetual vault for charity donation</span>
        </h1>
        <div className='connect-container'>
          <input
            className='input donate-input'
            type='text'
            placeholder='send ETH to...'
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <div className='button-container connect-container'>
            <button
              className={`button-secondary button full-width-button connect-button ${isLoading ? 'button-disabled' : ''}`}
              onClick={connect}
              disabled={isLoading}
            >
              Connect
            </button>
            <div className='connect-icon-wrapper'>
              <CloudSyncIcon
                className='connect-icon'
                sx={{ color: isContractLoaded ? '#53a548' : 'hsl(200, 5%, 66%)' }}
              />
              <p
                className={`icon-text ${isContractLoaded ? 'icon-text-connected' : 'icon-text-disconnected'}`}
              >
                {isContractLoaded ? "connected" : "disconnected"}
              </p>
            </div>
          </div>
        </div>

        <div className='donate-container'>
          <input
            className='input donate-input'
            type='text'
            placeholder='ETH'
            value={userAmount}
            onChange={(e) => setUserAmount(e.target.value)}
          />
          <button
            className={`button-primary button donate-button ${isLoading ? 'button-disabled' : ''}`}
            onClick={donate}
            disabled={isLoading}
          >
            Donate
          </button>
        </div>
        <div className='button-container withdraw-container'>
          <button
            className={`button-warn button full-width-button ${isLoading ? 'button-disabled' : ''}`}
            onClick={withdraw}
            disabled={isLoading}
          >
            Withdraw
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
