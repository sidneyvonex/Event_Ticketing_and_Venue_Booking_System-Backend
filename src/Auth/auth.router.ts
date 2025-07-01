import {Router } from "express";
import { createUser } from "./auth.controller";

export const authRouter = Router();

authRouter.post('/auth/register',createUser)
// authRouter.post('/auth/login');