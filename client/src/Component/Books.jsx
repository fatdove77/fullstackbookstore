import { Button } from 'antd';
import React,{useEffect,useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useFetchBooks } from '../hooks/useBookHooks'
import { deleteBook } from '../request/api';
import './style.scss'
import { fetchAllBooks } from '../request/api';
const Books = () => {
  const {books,Delete}=  useFetchBooks();
  const navigate = useNavigate();
  //删除图书方法
  const handleDelete = async(id) =>{
    await Delete(id);
  }

  const ShowBooks = ()=>{
    return (
      books&&books.map((item,index)=>{
        return (
          <div className="book" key = {item.id}> 
            {item.cover&&<img src = {item.cover}></img>}
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <span>{item.price}</span>
            <Button size = "large" type = "default" danger onClick = {()=>handleDelete(item.id)}>Delete</Button>
            <Button size = "large" type = "default" > <Link to = {`/update/${item.id}`}> Update</Link></Button>
          </div>
        )
      })
    )
  }


  return (
    <div style = {{minWidth:'80vw',height:'100vh'}} >
      <h1>FATDOVE BOOK SHOP</h1>
      <div className="flex flex-wrap justify-around">
        <ShowBooks className = "flex "></ShowBooks>
      </div>
      
      <Button  onClick={()=>{navigate("/add")}}>Add New Book</Button>
    </div>
  )
}

export default Books