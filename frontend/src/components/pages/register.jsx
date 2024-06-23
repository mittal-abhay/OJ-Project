import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { valid } from "../../utils/valid";
import { toast } from "react-toastify";
import {useAuth} from "../../context/AuthContext"
import styles from "../styles/register.module.css";


const Register = ({setIsLogin}) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { register } = useAuth();
  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  };
  const [userData, setUserData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { firstname, lastname,email, password } = userData;



  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    const message = valid(email, password);
    if (message) {
      toast.warn(message);
      setIsLoading(false);
      return;
    }

    try {
      await register(userData);
      toast.info("User Registered Successfully");
      setIsLoading(false);
      setIsLogin(true);
    } catch (err) {
      toast.error(err);
      setIsLoading(false);
      return;
    }
  };
  return (

    <div className={styles.container}>
      <h1 className={styles.heading}>Create Account</h1>
      <div className={styles.form}>
        <div className={styles.input}>
          <input
            type="text"
            name="firstname"
            value={firstname}
            onChange={handleChange}
            placeholder="Firstname"
          />
        </div>
        <div className={styles.input}>
          <input
            type="text"
            name="lastname"
            value={lastname}
            onChange={handleChange}
            placeholder="Lastname"
          />
        </div>
        
        <div className={styles.input}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
        <div className={styles.input}>
          <input
            type={show ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
          />
          <span className={styles.showPassword} onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </span>
        </div>
        <button className={styles.registerButton} onClick={handleSubmit}>Register</button>
        </div>
   
      </div>
  );
};

export default Register;
