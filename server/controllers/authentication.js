import User from "../models/User.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

//registering the user
export const register = async (req, res) => { 
    try {
        const {firstname, lastname, email, password} = req.body;

        if (!(firstname && lastname && email && password)) {
            return res.status(400).json("Please enter all the information");
        }
        //check if the user already exists
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists!"});
        }
        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create a new user
        const newUser = await User.create({firstname, lastname, email, password: hashedPassword});

        // generate a token for user and send it
        const token = jwt.sign({ id: newUser._id, email }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        newUser.token = token;
        newUser.password = undefined;
        res
            .status(200)
            .json({ message: "You have successfully registered!", user });
    }catch(err){
        return res.status(500).json({message: "Server Error!"});
    }
}


export const login = async (req, res) => {
    try {
        //get all the user data
        const { email, password } = req.body;

        // check that all the data should exists
        if (!(email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        //find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found!");
        }

        //match the password
        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(401).send("Password is incorrect");
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.token = token;
        user.password = undefined;

        //store cookies
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true, //only manipulate by server not by client/user
        };

        //send the token
        res.status(200).cookie("token", token, options).json({
            message: "You have successfully logged in!",
            success: true,
            token,
        });
    } catch (error) {
        console.log(error.message);
    }
}
