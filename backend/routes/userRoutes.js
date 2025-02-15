import express from "express";
import { deleteUser, getUser, loginUser, registerUser, updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser); // ✅ RESTful naming
userRouter.post("/login", loginUser);
userRouter.get("/me", authMiddleware, getUser); // ✅ "/me" instead of "getuser"
userRouter.put("/:id", authMiddleware, updateUser);
userRouter.delete("/:id", authMiddleware, deleteUser);

export default userRouter;