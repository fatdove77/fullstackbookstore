//用于存放合约中直接提取的变量  一般都是call调用
import { useMemo, useEffect, useState,useCallback } from 'react';
import { useWeb3React } from "@web3-react/core";

import { BigToFloat } from '../utils/Transfer';
import { IntToBig } from '../utils/Transfer';
import { GetContract } from '../utils/GetContract';
import { GetUsdtContract } from '../utils/GetContract';

import Web3 from 'web3';

export const useSplitBalance = ()=>{
  const {account} = useWeb3React();
  console.log(account);
  const [contract,setContract] = useState(GetContract());
  const [split,setSplit] = useState();
  useEffect(()=>{
    (async()=>{
      if(!account)return ;
      await contract.methods.rewardInfo(account).call().then((res)=>{
        console.log(res.split);
        setSplit(BigToFloat(res.split));
      })
    })()
  },[account])
  return useMemo(()=>{
    console.log(split);
    return split;
  },[split])
}

//得到主网币和usdt
export const useBalance = ()=>{
  const {account} = useWeb3React();
  const [contract,setContract] = useState(GetContract());
  const [usdtContract,setUsdtContract] = useState(GetUsdtContract());
  const [usdt,setUsdt] = useState();
  const [fibo,setFibo] = useState();
  const web3 = new Web3(window.ethereum);
  useEffect(()=>{
    (async()=>{
      if(!account)return ;
      //主网余额
      await web3.eth.getBalance(account).then(res=>{
        setFibo(BigToFloat(res));
      })
      await usdtContract.methods.balanceOf(account).call().then((res)=>{
        setUsdt(BigToFloat(res));
      })
    })()
  },[account])
  return useMemo(()=>{
    const data = {fibo,usdt};
    console.log(data);
    return data;
  },[usdt,fibo])
}


