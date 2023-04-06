import express from 'express';
import mysql from 'mysql';
import cors from 'cors'
import bodyParser from 'body-parser';
const app = express();  //创建一个服务器实例



//简历数据库连接
const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"123456",
  database:"express",  //数据库名字 不是连接名 
})

app.use(express.json());  //接受前端传来的json  //?类似一个自动转换？？
app.use(cors());


app.get("/",(req,res)=>{
  res.json("hello this is backend");
})

app.get("/books",(req,res)=>{
  const q = "select * from books";
  db.query(q,(err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
  });
})

app.post("/books",(req,res)=>{
  console.log(req.body);
  try {
    const q = "insert into books (`title`,`description`,`price`,`cover`) values(?)";
    const values = [
    req.body.title,  //前端传来的数据
    req.body.description, 
    req.body.price,
    req.body.cover  
    ]
    db.query(q,[values],(err,data)=>{
      if(err) return res.json(err);
      return res.json("book has been created successfully");
    })
  } catch (error) {
    console.log(error);
  } 
  
})



app.delete("/books/:id",(req,res)=>{
  console.log(req.params.id);
  try {
    const bookId = req.params.id;
    const q = "delete from books where id = ?";
    db.query(q,[bookId],(err,data)=>{
    if(err) return res.json(err);
    return res.json("book has been deleted successfully");
  })
  } catch (error) {
    console.log(error);
  }
})

app.put("/books/:id",(req,res)=>{
  console.log(req.params.id);
  try {
    const bookId = req.params.id;
    const q = "update  books set `title` = ?,`description` = ?,`price` = ?,`cover` = ? where  id = ?";
    
    const values = [
      req.body.title,  //前端传来的数据
      req.body.description, 
      req.body.price,
      req.body.cover  
      ]
    //结构传入变量
    db.query(q,[...values,bookId],(err,data)=>{
    if(err) return res.json(err);
    return res.json("book has been updated successfully");
  })
  } catch (error) {
    console.log(error);
  }
})


app.listen(8800,()=>{
  console.log("Connected to backend!");
})