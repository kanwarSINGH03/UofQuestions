
import express from 'express';
import {register, signIn, signOut } from '../controllers/authent.js';

const router = express.Router()

router.post("/register",register)
router.post("/signIn",signIn)
router.post("/signOut",signOut)


export default router;