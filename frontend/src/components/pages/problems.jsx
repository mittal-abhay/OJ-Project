import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.jsx";
import UpdateProblem from '../pages/updateProblem.jsx';
import Navbar from '../commons/navbar.jsx';
import CreateProblemModal from '../pages/createProblem.jsx';
import './problems.css';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddTestcaseModal, setShowAddTestcaseModal] = useState(false);
  
  const [testCaseFormData, setTestCaseFormData] = useState({
    input: '',
    expected_output: '',  
  });
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const handleClick = (id) => {
    return () => {
      navigate(`/problem/${id}`);
    };
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this problem?");
    if (confirmDelete) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/problems/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log('Problem deleted:', res.data);
        setProblems(problems.filter(problem => problem._id !== id)); // Remove the deleted problem from state
        navigate('/problems');
      } catch (error) {
        console.error('Error deleting problem:', error);
      }
    }
  };

  const handleUpdate = (problem) => {
    setSelectedProblem(problem);
    setShowUpdateModal(true);
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

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleShowAddTestcaseModal = (problem) => {
    setSelectedProblem(problem);
    setShowAddTestcaseModal(true);
  };

  const handleCloseAddTestcaseModal = () => {
    setShowAddTestcaseModal(false);
  };

  const handleAddTestcase = async (e) => {
    e.preventDefault();
    try {  
      const res = await axios.post(
        `http://localhost:5000/api/problems/${selectedProblem._id}/testcase`,
        testCaseFormData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        }
      );
      console.log('Test case added:', res.data);
      // You may want to update the problem's test cases here or refetch the problem details
      setShowAddTestcaseModal(false);
    } catch (error) {
      console.error('Error adding test case:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestCaseFormData({ ...testCaseFormData, [name]: value });
  };

  return (
    <>
      <Navbar />
      <div className="problems-container">
        <Table striped bordered hover className="problems-table">
          <caption className="problems-caption">The set of Problems to practice</caption>
          <thead className="thead-dark">
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
              {role === 'admin' && (
                <>
                  <th>Delete</th>
                  <th>Update</th>
                  <th>Add Test Cases</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id} onClick={handleClick(problem._id)} className="problem-row">
                <td>{problem.title}</td>
                <td>{problem.difficulty_level}</td>
                <td>{problem.tags.join(', ')}</td>
                {role === 'admin' && (
                  <>
                    <td>
                      <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(problem._id); }}>
                        Delete
                      </Button>
                    </td>
                    <td>
                      <Button variant="primary" onClick={(e) => { e.stopPropagation(); handleUpdate(problem); }}>
                        Update
                      </Button>
                    </td>
                    <td>
                      <Button variant="success" onClick={(e) => { e.stopPropagation(); handleShowAddTestcaseModal(problem); }}>
                        Add Test Case
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
        {role === 'admin' && (
          <Button variant="primary" onClick={handleShowCreateModal} className="mb-3">
            Add a Problem
          </Button>
        )}
      </div>

      {/* Update Problem Modal */}
      {showUpdateModal && (
        <UpdateProblem
          problem={selectedProblem}
          onHide={handleCloseUpdateModal}
          onUpdate={handleUpdateSuccess}
        />
      )}

      {/* Create Problem Modal */}
      {showCreateModal && (
        <CreateProblemModal show={showCreateModal} handleClose={handleCloseCreateModal} />
      )}

      {/* Add Test Case Modal */}
      <Modal show={showAddTestcaseModal} onHide={handleCloseAddTestcaseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Test Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTestcase}>
            <Form.Group controlId="formTestcaseInput">
              <Form.Label>Input</Form.Label>
              <Form.Control as="textarea" rows={3} name="input" value={testCaseFormData.input} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formTestcaseOutput">
              <Form.Label>Expected Output</Form.Label>
              <Form.Control as="textarea" rows={3} name="expected_output" value={testCaseFormData.expected_output} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Add Test Case
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Problems;
