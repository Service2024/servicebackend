require('dotenv').config()
const express=require('express')
const cors=require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const authrouter=require('./routers/authrouter')
const userRouter=require('./routers/userrouters')
const workerRouter=require('./routers/serviceRouters')
const port=process.env.APP_PORT||6060

app.get("/",(req,res)=>{
    res.send("hello")
})

app.use(process.env.PATH_DIR,authrouter)
app.use(process.env.PATH_DIR,userRouter)
app.use(process.env.PATH_DIR,workerRouter)


app.listen(port,()=>{
    console.log(`http://localhost:${port}${process.env.PATH_DIR}`)
})