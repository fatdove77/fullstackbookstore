import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  value:0,
  lang:'zh-CN'
}

const demoSlice = createSlice({
  name:'demo',  //定义actions的头
  initialState,  //state的初始值
  reducers:{ 
    setValue:(state)=>{
      console.log(state.value)
    },

  }
})


export const {setValue} = demoSlice.actions;

export default demoSlice.reducer