# 前后端调用逻辑

## 准备工具

react+express.js+axios+mysql



## 配置express.js

```
mkdir backend
cd backend
```

通过 `npm init` 命令为你的应用创建一个 `package.json` 文件。 

```console
$ npm init
```

创建index.js

```console
$ npm install express --save
```

更改package.json如下，主要更改module以及使用nodeman

```js
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js "
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "mysql": "^2.18.1",
    "nodemon": "^2.0.22"
  }
}
```

```js
npm start //开启nodejs后端
```



## react

正常下载就好了

```js
npx create-react-app client
```



## axios设置

```js
npm install axios
```

前端利用axios连接nodejs最好封装一下 

新建request/index.js,配置封装axios，导出service

```js
//在index.js中引入axios
import axios from 'axios';
//引入qs模块，用来序列化post类型的数据
import QS from 'qs';
//antd的message提示组件，大家可根据自己的ui组件更改。
import { message } from 'antd'

//保存环境变量
const isPrd = process.env.NODE_ENV == 'production';

//区分开发环境还是生产环境基础URL
export const basicUrl = isPrd ? 'http://localhost:8800' : 'http://localhost:8800'

//设置axios基础路径
const service = axios.create({
  baseURL: basicUrl
})

// 请求拦截器
service.interceptors.request.use(config => { 
  // 每次发送请求之前本地存储中是否存在token，也可以通过Redux这里只演示通过本地拿到token
  // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
  // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
  const token = window.localStorage.getItem('userToken') || window.sessionStorage.getItem('userToken');
  //在每次的请求中添加token
  config.data = Object.assign({}, config.data, {
    token: token,
  })
  //设置请求头
  config.headers = {
    'Content-Type':'application/json'  //发送json数据 
  }
  //序列化请求参数，不然post请求参数后台接收不正常
  // config.data = QS.stringify(config.data)
  return config
}, error => { 
    return error;
})

// 响应拦截器
service.interceptors.response.use(response => {
  //根据返回不同的状态码做不同的事情
  // 这里一定要和后台开发人员协商好统一的错误状态码
  if (response.code) {
    switch (response.code) {
      case 200:
        return response.data;
      case 401:
        //未登录处理方法
        break;
      case 403:
        //token过期处理方法
        break;
      default:
        message.error(response.data.msg)
    }
  } else { 
    return response;
  }
})
//最后把封装好的axios导出
export default service
```



## mysql数据库建立

数据库下建立连接express->books表

```js
/*
 Navicat MySQL Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80028
 Source Host           : localhost:3306
 Source Schema         : express

 Target Server Type    : MySQL
 Target Server Version : 80028
 File Encoding         : 65001

 Date: 06/04/2023 19:55:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for books
-- ----------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL,
  `price` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

```



## 前后端路由

前后端调用不可避开的一个知识点就是路由。路由又分成前端路由和后端路由。根据我个人的理解，前端路由负责页面的跳转，后端路由负责api接口的路径。



### 前端路由

在react中我们设置三个界面，分别是主页，添加图书页以及修改图书页。



那么在业务中我们通常用Router->index.js这种文件结构设置前端的路由，方便集成化管理。同时要使用react-router的hooks降低代码量、lazy和suspense用于懒加载以及路由跳转的加载渲染。

```js
import React ,{lazy,Suspense}from 'react'
import './style.scss'
import { AnimatePresence } from "framer-motion";
import { useRoutes  } from 'react-router-dom';

const Books  = lazy(
  async()=>await import('../Component/Books')
);

const Add  = lazy(
  async()=>await import('../Component/Add')
);

const Update  = lazy(
  async()=>await import('../Component/Update')
);


function Index() {
  const element = useRoutes([
    {
      path:'/',
      element:<Books></Books>
    },
    {
      path:'/add',
      element:<Add></Add>
    },
    {
      path:'/update/:id',
      element:<Update></Update>
    },
  ])
  return (
    <div className="router flex-center">
      <Suspense fallback={<p>loading</p>}>
          {element}
      </Suspense>
      
    </div>
     
  )
}

export default Index
```





### 后端路由

后端路由就是要对应前端在不同业务需求下的不同操作，比如我们这个图书管理的demo，后端的起码要声明crud的路由。



例如如下的针对get请求的路由设置。

```js
import express from 'express';
import mysql from 'mysql';
import cors from 'cors'
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
```



## 封装hook

我们从最底层开始封装

在react下新建request/api.js用来存放前端封装的axios的方法。

以下是封装的图书增删改查方法,我建议最好封装，尽管这个例子很简单代码复用很少。

```js
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

//更新图书
export const updateBook = async(id,book)=>{
  try {
    console.log(id);
    console.log("books/"+id);
    await service.put("/books/"+id,book)
  } catch (error) {
    console.log(error);
  }
}

```



接着封装useBookHook.JS文件，useBookHook封装books状态量，以及和books相关的方法，这里封装了CRUD方法。

如果不这样封装，那么用到图书的地方就要调用一次，代码重写率很高。同时我也建议以后都将数据和方法封装到一起。如果数据交叉那么可以用redux来存储数据。（这是我跟公司大神学习的）

```js
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
  },[books])
  //修改图书
  const handleUpdate = useCallback(async(id,book)=>{
    await updateBook(id,book);
    await getBooks();
  },[books])
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
```



## 调用逻辑

books变量,直接从hooks中就能读取，hooks调用axios.get获取。

```js
const {books,Delete}=  useFetchBooks();
```

这里我们拿delete举例。

首先组件有个删除按钮，点击删除图书。

组件中的调用如下（代码片段）

```js
const {books,Delete}=  useFetchBooks();
  const navigate = useNavigate();
  //删除图书方法
  const handleDelete = async(id) =>{
    await Delete(id);
  }
  <Button size = "large" type = "default" danger onClick = {()=>handleDelete(item.id)}>Delete</Button>
```

组件调用useBookHooks的方法

```js
const handleDelete = useCallback(async(id)=>{
    await deleteBook(id)
    await getBooks();//删除后更新状态量
  },[books])
```

request/api.js的封装方法

```js
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
```



后端的对应处理

```js
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
```







