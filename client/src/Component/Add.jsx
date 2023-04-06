import { Button } from 'antd';
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {useFetchBooks} from '../hooks/useBookHooks'
const Add = () => {
  const  navigate = useNavigate();
  const [book,setBooks] = useState({
    title:"",
    description:"",
    price:"",
    cover:""
  });
  const {Add} = useFetchBooks();
  const handleChange = (e)=>{
    setBooks((prev)=>({...prev,[e.target.name] : e.target.value}));
  }

  const handleClick = async(e)=>{
    e.preventDefault();  //阻止默认动作 凡是页面提交之后刷新
    try {
      await Add(book);
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="form">
      <h1>Add New Book</h1>
      <input type="text" placeholder="title" name = "title" onChange = {handleChange} value = {book.title} />
      <input type="text" placeholder="desc"  name = "description" onChange = {handleChange} value = {book.description}  />
      <input type="number" placeholder="price" name = "price"   onChange = {handleChange} value = {book.price}/>
      <input type="text" placeholder="cover" name = "cover"  onChange = {handleChange} value = {book.cover}/>
      <Button onClick={handleClick}>Add</Button>
    </div>
  )
}

export default Add