import React, { useEffect, useState } from "react";
import Login from "./login"; 
import Register from "./register"; 
import styles from "../styles/loginRegister.module.css";
import loginImg from "../../assets/login.jpg";
import { Link } from "react-router-dom";
const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.homepage}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.illustration}>
            <img src={loginImg} alt="login" />
          </div>
        </div>
        <div className={styles.right}>
          {isLogin ? (
            <>
              <Login />
              <div className={styles.info}>
                Don't have an account?{" "}
                <span className={styles.link} onClick={() => setIsLogin(false)}>
                  Register
                </span>
              </div>
            </>
          ) : (
            <>
              <Register setIsLogin={setIsLogin}/>
              <div className={styles.info}>
                Already have an account?{" "}
                <span className={styles.link} onClick={() => setIsLogin(true)}>
                  Login
                </span>
              </div>
            </>
          )}
           <div className={styles.info}> <Link to="/">Go to home page</Link></div>
        </div>

      </div>
      
    </div>
  );
};

export default LandingPage;