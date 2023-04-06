import {contract} from "../BC_config/contractAddress";
import abi from '../BC_config/ABI.json'
import usdtAbi from '../BC_config/USDT_abi.json'

export function GetContract(){
  const Web3 = require('web3');
  const web3 = new Web3(window.ethereum);
  //AWW的合约
  const awwContract = new web3.eth.Contract(abi,contract.AWW); //修改contractAddress的对象/////////////
  return awwContract
  
}


export function GetUsdtContract(){
  const Web3 = require('web3');
  const web3 = new Web3(window.ethereum);
  //AWW的合约
  const awwContract = new web3.eth.Contract(usdtAbi,contract.USDT);
  return awwContract
}


