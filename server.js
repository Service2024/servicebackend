require('dotenv').config()
const express=require('express')
const bcrypt = require('bcrypt')
const UserDatabase=require('./db/models/user_table')
const cors=require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const authrouter=require('./routers/authrouter')
const userRouter=require('./routers/userrouters')
const workerRouter=require('./routers/serviceRouters')
const port = process.env.APP_PORT || 6060;

app.get("/",(req,res)=>{
    res.send("hello")
})

app.post("/signup", async (req, res) => {
    try {
        const { firstname, lastname, email, phonenumber, password, userType } = req.body;

        // Validate that all required fields are provided
        if (!firstname || !lastname || !email || !phonenumber || !password) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // Salt rounds for bcrypt (make sure `saltRounds` is defined, e.g., const saltRounds = 10;)
        const saltRounds = 10;
        const bcrypt_password = await bcrypt.hash(password, saltRounds);

        // Create a new user in the database
        const newUser = await UserDatabase.create({
            firstname,
            lastname,
            email,
            phonenumber,
            password: bcrypt_password,
            userType: userType || '0'
        });
        res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while processing your request"
        });
    }
});
const pathDir = process.env.PATH_DIR || ''; // Default to empty if not defined
app.use(authrouter)
app.use(userRouter)
app.use(workerRouter)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});