import React, { useEffect, useState } from "react";
import Login from "../pages/login"; 
import Register from "../pages/register"; 
import styles from "../styles/landingPage.module.css";
import loginImg from "../../assets/login.png";
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
              <Register />
              <div className={styles.info}>
                Already have an account?{" "}
                <span className={styles.link} onClick={() => setIsLogin(true)}>
                  Login
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;