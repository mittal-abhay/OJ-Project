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
import {Button} from "@/components/ui/button"

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const { token, role } = useAuth(); // Extracting user object containing role information
  const navigate = useNavigate();

  const handleClick = (id) => {
    return () => {
      navigate(`/problem/${id}`);
    };
  };
  const handleDelete = async (id) => {
    // Prompt confirmation before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this problem?");
    if (confirmDelete) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/problems/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log('Problem deleted:', res.data);
        navigate('/problems');
        // Optionally, redirect to the problem details page or display a success message
      } catch (error) {
        console.error('Error deleting problem:', error);
      }
    }
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
          {/* Additional columns for admin */}
          {role === 'admin' && (
            <>
              <TableHead>Delete</TableHead>
              <TableHead>Update</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {problems.map((problem, id) => (
          <TableRow key={id} style={{ cursor: 'pointer' }} onClick={handleClick(problem._id)}>
            <TableCell>Unsolved</TableCell>
            <TableCell>{problem.title}</TableCell>
            <TableCell>90%</TableCell> {/* Placeholder value for acceptance rate */}
            <TableCell>{problem.difficulty_level}</TableCell>
            <TableCell>{problem.tags.join(', ')}</TableCell>
            {/* Additional columns for admin */}
            {role === 'admin' && (
              <>
                  <TableCell><Button onClick={() => handleDelete(problem._id)}>Delete</Button></TableCell>
                <TableCell><Button>Update</Button></TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Problems;
