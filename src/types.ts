import { ethers } from '../node_modules/ethers/';

export type GiveForeverContract = {
  deposit: () => void;
  withdraw: () => void;
  updateWallet: (address: string) => void;
} & ethers.Contract;