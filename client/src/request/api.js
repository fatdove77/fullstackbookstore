import service from "./index";


//获取图书
export const fetchAllBooks = async()=>{
  try {
    // const res = await axios.get("http://localhost:8800/books")
    let data;
    await service.get("/books").then((res)=>{
      data = res.data
    })
    return data;
  } catch (error) {
    console.log(error);
  }
  
}

//添加图书
export const addBooks = async(book)=>{
  try {
    await service.post("/books",book)
  } catch (error) {
    console.log(error);
  }
  
}

//删除图书
export const deleteBook = async(id)=>{
  try {
    console.log(id);
    console.log("books/"+id);
    await service.delete("/books/"+id)
  } catch (error) {
    console.log(error);
  }
}

export const updateBook = async(id,book)=>{
  try {
    console.log(id);
    console.log("books/"+id);
    await service.put("/books/"+id,book)
  } catch (error) {
    console.log(error);
  }
}



