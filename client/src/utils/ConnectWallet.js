import { NETWORK } from "../BC_config/networkConfig";
import cogoToast from "cogo-toast";
export  async function  SwitchNet(){
  let chainId = NETWORK.chainId;
      let chainName = NETWORK.chainName;
      let rpcUrls = NETWORK.rpcUrls;
      console.log(window.ethereum.chainId);
      if(window.ethereum.chainId=='12306'){   //修改链id/////////////////////
        //连接别的钱包
      }
      else {
        try {
          // setIsLoading(true);
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
                console.log(addError);
                  // handle "add" error
                  cogoToast.error("连接出错",addError);
              }
          }
        }
      }
}