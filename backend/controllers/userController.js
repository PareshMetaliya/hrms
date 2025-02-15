import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check user is available or not
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create New User
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate token
        const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { password, email } = req.body;

        // Check if user exits

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found..!" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate jwt token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ success: true, message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get User by jwt token
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not Found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};

// UpdateUser
export const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { id } = req.params;

        // Ensure user is updating their own account (or is an admin)
        if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only update your own account"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        // Hash password  If password Availble
        if (password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).select("-password");
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {


    const { id } = req.params;

    // Ensure user is updating their own account (or is an admin)
    if (req.user.id !== id && req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Unauthorized: You can only delete your own account"
        });
    }

    try {
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        res
            .status(200)
            .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};
