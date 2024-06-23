import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../commons/navbar';
const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const {token}  = useAuth();
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL;


    useEffect(() => {
        const getLeaderBoard = async () => {
            try {
              const res = await axios.get(`${BASE_URL}/api/users/leaderboard`, {
                headers: {
                  Authorization: `${token}`,
                },
              });
              console.log('Leaderboard:', res.data);
              setLeaderboard(res.data);
            } catch (error) {
              console.error('Error fetching leaderboard:', error);
            }
          };
            getLeaderBoard();
            }
    , [])

  return (
    <>
    <Navbar/>
    <div class="table-responsive mt-5">
    <h1 class="problems-heading ms-5 text-secondary">Leaderboard</h1>
    <table class="table align-items-center mb-0 container-lg">
      <thead>
        <tr>
          <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Rank</th>
          <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Name</th>
          <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Problems Solved</th>
         
        </tr>
      </thead>
      <tbody>
      {leaderboard.map((user, index) => (
        <tr>
          <td>
            <div class="d-flex px-2 py-1">
              <div class="d-flex flex-column justify-content-center">
                <h6 class="mb-0 text-xs">{index+1}</h6>
                </div>
            </div>
          </td>
          <td>
            <div class="d-flex px-2 py-1">
              <div class="d-flex flex-column justify-content-center">
                <h6 class="mb-0 text-xs">{user.firstname + " " + user.lastname}</h6>
                <p class="text-xs text-secondary mb-0">{user.email}</p>
              </div>
            </div>
          </td>
          <td>
            <p class="text-xs font-weight-bold mb-0">{user.problemsSolved}</p>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
    </div>
    </>
  )
}

export default Leaderboard;
