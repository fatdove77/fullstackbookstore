// BigNumber(item.num).div(Math.pow(10,18)).toString()



const BigNumber = require('bignumber.js');


//将合约读取的数字转化为float 保留两位小数
export function BigToFloat (data){
  return parseFloat(BigNumber(data).div(Math.pow(10,18)).toString(10)).toFixed(2) ;
}

//将整数转化为BigNumber再转化为string  传入合约中

export function IntToBig(data){
  return BigNumber(data).multipliedBy(Math.pow(10,18)).toString(10);   //toString的参数代表进制
  
}