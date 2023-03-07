import { ethers } from '../node_modules/ethers/';

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
      setIsLoading(false);

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
        <div className='button-container connect-button-container'>
          <button
            className="button-secondary button full-width-button"
            onClick={connect}
            disabled={isLoading}
          >
            Connect
          </button>
        </div>
        <div className='donate-container'>
          <input
            className='input donate-input'
            type='text'
            placeholder='ETH'
            value={userAmount}
            onChange={(e) => setUserAmount(e.target.value)}
          />
          <button className="button-primary button donate-button" onClick={donate}>Donate</button>
        </div>
        <div className='button-container withdraw-container'>
          <button className="button-warn button full-width-button" onClick={withdraw}>Withdraw</button>
        </div>
      </header>
    </div>
  );
}

export default App;
