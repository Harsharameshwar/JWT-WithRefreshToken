const express= require('express');
const dotenv=require('dotenv');
const app= express();
const jwt = require('jsonwebtoken')

dotenv.config();

app.use(express.json());



let refreshTokens=[]


app.post('/token',(req,res)=>{
    const refreshToken=req.body.token;
    if(refreshToken===null) return res.status(403);
    if(!refreshTokens.includes(refreshToken)) return res.status(401);

    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err){
            res.status(403).json("Invalid Token")
        }
        const accessToken= generateAccessToken({name:user.name});
        res.status(200).json({accessToken:accessToken})
    })
})

app.post('/login',(req,res)=>{
    //Authentication
    const username=req.body.username;
    const user={name:username};

    const accessToken=generateAccessToken(user)
    const refreshToken= jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.status(200).json({accessToken:accessToken,refreshToken:refreshToken});
})

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15s'});
}




app.listen(3000,(req,res)=>{
    console.log("Server is up and running!")
})



