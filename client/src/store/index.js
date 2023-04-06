import { configureStore } from "@reduxjs/toolkit";

import demoSlice from './features/demoSlice'
const store = configureStore({
  reducer:{
    demo:demoSlice, //首页显示的五个变量[合约地址，平台运行时间...]
  }
})
export default store