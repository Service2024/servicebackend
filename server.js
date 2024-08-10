require('dotenv').config()
const express=require('express')
const bcrypt = require('bcrypt')
const cors=require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const authrouter=require('./routers/authrouter')
const userRouter=require('./routers/userrouters')
const workerRouter=require('./routers/serviceRouters')
const orderRouters=require('./routers/orderRouters')
const port = process.env.APP_PORT || 6060;

app.get("/",(req,res)=>{
    res.send("hello")
})

const pathDir = process.env.PATH_DIR || ''; // Default to empty if not defined
app.use(authrouter)
app.use(userRouter)
app.use(workerRouter)
app.use(orderRouters)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});