import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Problem = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problems/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setProblem(res.data);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id, token]);

  if (!problem) {
    return <div>Problem doesn't exist</div>;
  }

  return (
    <div>
      <h1>{problem.title}</h1>
      <p>{problem.statement}</p>
      <p>Difficulty: {problem.difficulty_level}</p>
      <p>Tags: {problem.tags.join(', ')}</p>
    </div>
  );
};

export default Problem;
