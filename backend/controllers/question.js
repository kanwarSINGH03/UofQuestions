import  jwt  from "jsonwebtoken";
import moment from "moment";
import {db} from "../db_connect.js"

export const getQuestions = (req,res) => {

    const jToken = req.cookies.accessToken;
    if(!jToken) return res.status(401).json("User not signed In")

    jwt.verify(jToken, "privateKey", (err, userInfo)=>{

    if(err) return res.status(403).json("Invalid Token!")

    const query = `SELECT q.*, u.id AS userId, name FROM questions AS q JOIN users AS u ON (u.id = q.userId)`;



    db.query(query, [userInfo.id], (err,data)=>{

        if(err) return res.status(500).json("Could not get questions");
        return res.status(200).json(data);

    });

    });
    
};

export const addQuestion = (req,res) => {
    const jToken = req.cookies.accessToken;
    if(!jToken) return res.status(401).json("User not signed In")

    jwt.verify(jToken, "privateKey", (err, userInfo)=>{

    if(err) return res.status(403).json("Invalid Token!")

    const query = "INSERT INTO questions (`descrip`,`img`,`userId`,`time`) VALUES (?)";


    const values = [
        req.body.descrip,
        req.body.img,
        userInfo.id,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")     
    ]
  
    db.query(query, [values], (err,data)=>{

        if(err) return res.status(500).json("Could not add question");
        return res.status(200).json("Question added in db");

    });

    });
    
};
