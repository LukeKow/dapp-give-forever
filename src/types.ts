import { BigNumber, ethers } from 'ethers';

type DepositPayload = {
  value: BigNumber,
}

export type GiveForeverContract = {
  deposit: (payload: DepositPayload) => void;
  withdraw: () => void;
  updateWallet: (address: string) => void;
} & ethers.Contract;