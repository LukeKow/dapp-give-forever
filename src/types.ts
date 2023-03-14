import { ethers } from '../node_modules/ethers/';

type DepositPayload = {
  value: bigint,
}

export type GiveForeverContract = {
  deposit: (payload: DepositPayload) => void;
  withdraw: () => void;
  updateWallet: (address: string) => void;
} & ethers.Contract;