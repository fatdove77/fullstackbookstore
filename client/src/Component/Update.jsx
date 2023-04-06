import { Button } from 'antd';
import React,{useState} from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import {useFetchBooks} from '../hooks/useBookHooks'
import './style.scss'
const Update = () => {
  const  navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname.split('/')[2]);
  const [book,setBooks] = useState({
    title:"",
    description:"",
    price:"",
    cover:""
  });
  const {Update} = useFetchBooks();
  const handleChange = (e)=>{
    setBooks((prev)=>({...prev,[e.target.name] : e.target.value}));
  }

  const handleClick = async(e)=>{
    e.preventDefault();  //阻止默认动作 凡是页面提交之后刷新
    try {
      await Update(location.pathname.split('/')[2],book);
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="form">
      <h1>Update The Book</h1>
      <input type="text" placeholder="title" name = "title" onChange = {handleChange} value = {book.title} />
      <input type="text" placeholder="desc"  name = "description" onChange = {handleChange} value = {book.description}  />
      <input type="number" placeholder="price" name = "price"   onChange = {handleChange} value = {book.price}/>
      <input type="text" placeholder="cover" name = "cover"  onChange = {handleChange} value = {book.cover}/>
      <Button onClick={handleClick} danger>Update</Button>
    </div>
  )
}

export default Update