import express from "express";
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/authent.js"
import replyRoutes from "./routes/replies.js"
import questionRoutes from "./routes/questions.js"
import multer from "multer"; //for uploading images
import cors from "cors";
import { db } from "./db_connect.js";
import cookieParser from "cookie-parser";

const app = express()

const PORT = 8080;
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Credentials", true)

  next();
});
app.use(express.json());
app.use(
  cors({
      origin:"http://localhost:3000",

})
);
app.use(cookieParser());

db.connect();
app.get('/',(req, res) => {


  try {
     db.query(`CREATE DATABASE IF NOT EXISTS channel_app`);
     
     db.query(`USE channel_app`);

     db.query(`CREATE TABLE IF NOT EXISTS users 
      ( id int NOT NULL AUTO_INCREMENT, 
        username varchar(45) NOT NULL,
        email varchar(45) NOT NULL,
        password varchar(200) NOT NULL,
        name varchar(45) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY id_UNIQUE (id)
      )ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `);
      // Other table creations in correct order
     db.query(`CREATE TABLE IF NOT EXISTS questions 
      (
        id int NOT NULL AUTO_INCREMENT,
        descrip varchar(200) DEFAULT NULL,
        img varchar(300) DEFAULT NULL,
        userId int NOT NULL,
        time datetime DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY id_UNIQUE (id),
        KEY userId_idx (userId),
        CONSTRAINT userId FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      
      `);
     db.query(`CREATE TABLE IF NOT EXISTS replies (
      id int NOT NULL AUTO_INCREMENT,
      descrip varchar(200) NOT NULL,
      time datetime DEFAULT NULL,
      userId int NOT NULL,
      questionId int NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY id_UNIQUE (id),
      KEY questionId_idx (questionId),
      KEY commentUserId_idx (userId),
      CONSTRAINT commentUserId FOREIGN KEY (userId) REFERENCES users (id),
      CONSTRAINT questionId FOREIGN KEY (questionId) REFERENCES questions (id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`);

    db.query(`CREATE TABLE IF NOT EXISTS likes (
      id int NOT NULL AUTO_INCREMENT,
      userId int NOT NULL,
      questionId int NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY id_UNIQUE (id),
      KEY likeUserId_idx (userId),
      KEY likeQuestionId_idx (questionId),
      CONSTRAINT likeQuestionId FOREIGN KEY (questionId) REFERENCES questions (id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT likeUserId FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`);

      res.send("Database and tables created successfully");
  } catch (error) {
      console.error(error);
      res.status(500).send("Error initializing the database");
  }
});





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
const upload = multer({ storage: storage });
  
app.post("/backend/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
});

app.use("/backend/users",userRoutes);
app.use("/backend/authent",authRoutes);
app.use("/backend/replies",replyRoutes);
app.use("/backend/questions",questionRoutes);

app.listen(PORT);