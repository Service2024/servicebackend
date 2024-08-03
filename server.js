require('dotenv').config()
const express=require('express')
const cors=require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const router=require('./routers/authrouter')
const port=process.env.APP_PORT||6060

app.get("/",(req,res)=>{
    res.send("hello")
})

app.use(process.env.PATH_DIR,router)

app.listen(port,()=>{
    console.log(`http://localhost:${port}${process.env.PATH_DIR}`)
})