import React,{useState,useEffect,useCallback} from 'react'
import {injected} from '../BC_config/connector'
import { NETWORK } from '../BC_config//netConfig';
import cogoToast from 'cogo-toast';
import { useWeb3React } from "@web3-react/core"
import Web3 from 'web3';

export const useWeb3Hook = ()=>{
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const [isConnect,setIsConnect] = useState(false);  //是否连接 控制按钮内样式
  const [isLoading,setIsLoading] = useState(false); //正在连接中  显示缓冲图标
  const [w3,setW3] = useState();

  useEffect(()=>{
    let account = localStorage.getItem("currentAccount");
    if(account!=null){
      handleConnect()
    }
  },[])


  const handleConnect = useCallback(async()=>{
    //有钱包
    if(window.ethereum!==undefined){
      //开始按钮加载
      setIsLoading(true);
      let chainId = NETWORK.chainId;
      let chainName = NETWORK.chainName;
      let rpcUrls = NETWORK.rpcUrls;
      console.log(window.ethereum.chainId);
      //如果钱包地址不在主网 那么切换网络
      if(window.ethereum.chainId!=chainId){
        try {
          await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{chainId}],
          });
      } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
              try {
                  await window.ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [
                          {
                              chainId,
                              chainName,
                              rpcUrls /* ... */,
                          },
                      ],
                  });
              } catch (addError) {
                  // handle "add" error
                  cogoToast.error("连接出错",addError);
                  setIsLoading(false);
              }
          }
          else if (switchError.code === 4001) {
              alert('❌ 你拒绝了 "切换网络" 的请求');
              return;
            } else if (switchError.code === -32002) {
              // alert(
              //   '😊 已经发送了 "切换网络" 的请求，\n请动动你发财的小手在钱包内确认一下。',
              // );
              return;
            } else {
              alert(switchError.message);
              return switchError.message;
            }
        }
        finally{
          setIsLoading(false);
        }
      }

      const web3 = new Web3(window.ethereum);
      setW3(web3);
      //连接钱包
      try{
        await window.ethereum.enable().then((res)=>{
          localStorage.setItem("currentAccount",res[0]);
        })
        activate(injected)
        setIsConnect(true);
      }catch(e){

      }
      finally{
        setIsLoading(false);
      }

      // let account = localStorage.getItem("currentAccount");
      // console.log(account);
    }
    //没有钱包
    else {
      cogoToast("请下载钱包")
      
    }

  },[])

  const handleDisconnect  = useCallback(()=>{
    console.log("退出钱包");
    try {
      localStorage.removeItem("currentAccount");
      setW3(null);
      window.location.reload();
    } catch (ex) {
        cogoToast.error("退出钱包错误",ex);
  }
  },[])

  return {
    isLoading,
    isConnect,
    account,
    w3,
    async Connect(){
      return await handleConnect();
    },
     Disconnect(){
      return  handleDisconnect();
    }
    //返回变量和函数
  }
}