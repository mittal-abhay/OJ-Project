import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx';

const Problem = () => {
  //get list of problems from backend

  const {token} = useAuth(); 
  
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/problems", {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        }
      );
      console.log(response.data);
      } catch (error) {
        console.error("Error fetching problems ", error);
      }
    };

    fetchProblems();
  }, []);


  return (
    <div>
      <h1>Problem</h1>
    </div>
  )
}

export default Problem
