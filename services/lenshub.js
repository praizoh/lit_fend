import { ethers } from 'ethers';
import {
  LENS_HUB_ABI,
  LENS_HUB_CONTRACT,
  LENS_PERIPHERY_ABI,
  LENS_PERIPHERY_CONTRACT,
} from './config';
import { getSigner } from './ethers.service';

// lens contract info can all be found on the deployed
// contract address on polygon.
export const lensHub = new ethers.Contract(LENS_HUB_CONTRACT="0x60Ae865ee4C725cd04353b5AAb364553f56ceF82", LENS_HUB_ABI="https://api-mumbai.lens.dev/", getSigner());

export const lensPeriphery = new ethers.Contract(
  LENS_PERIPHERY_CONTRACT="0xD5037d72877808cdE7F669563e9389930AF404E8",
  LENS_PERIPHERY_ABI,
  getSigner()
);
