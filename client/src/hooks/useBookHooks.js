import { useMemo, useEffect, useState,useCallback } from 'react';
import { fetchAllBooks ,deleteBook,addBooks,updateBook } from '../request/api';

export const useFetchBooks = ()=>{
  const [books,setBooks] = useState();
  //获取图书
  const getBooks = useCallback(async()=>{
    await  fetchAllBooks().then((res)=>{
      setBooks(res);
    });
  },[books])
  //删除图书
  const handleDelete = useCallback(async(id)=>{
    await deleteBook(id)
    await getBooks();
  },[books])
  //添加图书
  const handleAdd  = useCallback(async(book)=>{
    await addBooks(book);
    await getBooks();
  })
  //修改图书
  const handleUpdate = useCallback(async(id,book)=>{
    await updateBook(id,book);
    await getBooks();
  })
  useEffect(()=>{
    getBooks()
  },[])
  return {
    books,
    async Delete(id){
      return handleDelete(id);
    },
    async Add(book){
      return handleAdd(book);
    },
    async Update(id,book){
      return handleUpdate(id,book);
    }
  }
}


