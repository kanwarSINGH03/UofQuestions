import mysql from "mysql"

export const db = mysql.createConnection(
    {

    host:"mysql1",
    user:"root",
    password:"admin",
    database:"channel_app",
    
    }
)
