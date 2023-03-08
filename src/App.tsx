import { ethers } from '../node_modules/ethers/';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

import contractABI from './GiveForeverABI.json';
import { GiveForeverContract } from './types';

import './App.css';
import { useState } from 'react';

const contractAddress = '0xADdAf656b0dCf066197156105B8770B2A91d9C31'; // Goerli

function App() {
  const [userAmount, setUserAmount] = useState<string>('');
  const [contract, setContract] = useState<GiveForeverContract>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [userAddress, setUserAddress] = useState<string>();

  const provider = new ethers.BrowserProvider(window.ethereum);

  const connect = async () => {
    setIsLoading(true);
    try {
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      ) as GiveForeverContract;

      setContract(contract);
      setTimeout(() => {
        setIsLoading(false);

      }, 2000);

      const awaitedUserAddress = await signer.getAddress();
      setUserAddress(awaitedUserAddress);
      console.log('User address: ', awaitedUserAddress);
    }
    catch (e) {
      console.log('Something went wrong... ', e);
      setIsLoading(false);
    }
  }

  const donate = async () => {
    const weiAmount = ethers.parseEther(userAmount);
  }

  const withdraw = async () => {
    if (!contract) return;

    await contract.withdraw();
  }

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
              sx={{ color: contract && !isLoading ? '#53a548' : 'hsl(200, 5%, 66%)' }}
            />
            <p
              className={`icon-text ${contract && !isLoading ? 'icon-text-connected' : 'icon-text-disconnected'}`}
            >
              {contract && !isLoading ? "connected" : "disconnected"}
            </p>
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
