import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import axios from 'axios';  
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.jsx";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleClick = (id) => {
    return () => {
      navigate(`/problem/${id}`);
    };
  };

  useEffect(() => {
    const getProblems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/problems', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setProblems(res.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    getProblems();
  }, [token]);

  return (
    <Table>
      <TableCaption>The set of Problems to practice</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Acceptance Rate</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Tags</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {problems.map((problem, id) => (
          <TableRow key={id} style={{ cursor: 'pointer' }} onClick={handleClick(problem._id)}>
            <TableCell>Accepted</TableCell>
            <TableCell>{problem.title}</TableCell>
            <TableCell>90%</TableCell> {/* Placeholder value for acceptance rate */}
            <TableCell>{problem.difficulty_level}</TableCell>
            <TableCell>{problem.tags.join(', ')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Problems;
