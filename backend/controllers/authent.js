import { db } from "../db_connect.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

export const register = (req,res) =>{

    const query = "SELECT * FROM users WHERE username = ?";

    db.query(query,[req.body.username], (err,data) =>{
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("User already in system");

        const saltSync = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(req.body.password, saltSync);

        const query = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

        const values = [
            req.body.username,
            req.body.email,
            hashPass,
            req.body.name,
        ];

        db.query(`USE channel_app`);
        db.query(query, [values] ,(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("User added");

        })
    })

    
};
export const signIn = (req,res) => {

    const query = "SELECT * FROM users WHERE username = ?"
    db.query(`USE channel_app`);
    db.query(query, [req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);

        if(data.length ===0) return res.status(404).json("User does not exist");

        const checkPass = bcrypt.compareSync(req.body.password,data[0].password)

        if(!checkPass) return res.status(400).json("Password or username wrong!")

        const jToken = jwt.sign({id:data[0].id}, "privateKey");
        const {password, ...others} = data[0]

        res.cookie("accessToken", jToken,{
                httpOnly: true,
        }).status(200).json(others);

    });
    
};
export const signOut = (req,res) =>{

    res.clearCookie("accessToken",{
        secure: true,
        sameSite: "none"
    }).status(200).json("SignOut successfull")
    
};