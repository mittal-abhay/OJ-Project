import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDifficulty, setSearchDifficulty] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

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
        const res = await axios.delete(`${BASE_URL}/api/problems/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log('Problem deleted:', res.data);
        setProblems(problems.filter(problem => problem._id !== id));
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
        const res = await axios.get(`${BASE_URL}/api/problems`, {
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
        `${BASE_URL}/api/problems/${selectedProblem._id}/testcase`,
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

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    if (name === "searchQuery") {
      setSearchQuery(value);
    } else if (name === "searchDifficulty") {
      setSearchDifficulty(value);
    } else if (name === "searchTags") {
      setSearchTags(value);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${BASE_URL}/api/problems/search`, {
        params: {
          title: searchQuery,
          difficulty_level: searchDifficulty,
          tags: searchTags,
        },
        headers: {
          Authorization: `${token}`,
        },
      });
      setProblems(res.data);
    } catch (error) {
      console.error('Error searching problems:', error);
    }
  };


  const getBadgeVariant = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        console.log('easy');
        return 'success';
      case 'medium':
        console.log('medium');
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  return (
    <>
      <Navbar />

      <div className="problems-container">
        <Form inline onSubmit={handleSearch} className="mb-3">
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="Search by Title"
                value={searchQuery}
                name="searchQuery"
                onChange={handleSearchChange}
                className="mr-sm-2"
              />
            </Col>
            <Col>
              <Form.Control
                as="select"
                value={searchDifficulty}
                name="searchDifficulty"
                onChange={handleSearchChange}
                className="mr-sm-2"
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Control>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Search by Tags (comma-separated)"
                value={searchTags}
                name="searchTags"
                onChange={handleSearchChange}
                className="mr-sm-2"
              />
            </Col>
          </Row>
          <Button variant="outline-success mt-3" type="submit">Search</Button>
        </Form>

        <div className="table-responsive">

          <Table className="table align-items-center mb-0">

            <thead className="thead-dark">
              <tr>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Title</th>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Difficulty</th>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tags</th>
                {role === 'admin' && (
                  <>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Delete</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Update</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Add Test Cases</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem._id} onClick={handleClick(problem._id)} className="problem-row">
                  <td>
                    <div className="d-flex px-2 py-1">
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="mb-0 text-xs">{problem.title}</h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex px-2 py-1">
                      <div className="d-flex flex-column justify-content-center">
                        {problem.difficulty_level === 'easy' && (
                          <Badge className="badge bg-success">
                            {problem.difficulty_level}
                          </Badge>
                        )}
                        {problem.difficulty_level === 'medium' && (
                          <Badge className="badge bg-warning">
                            {problem.difficulty_level}
                          </Badge>
                        )}
                        {problem.difficulty_level === 'hard' && (
                          <Badge className="badge bg-danger">
                            {problem.difficulty_level}
                          </Badge>
                        )}
                      </div>
                    </div>

                  </td>
                  <td>
                    <div className="d-flex px-2 py-1">
                      {problem.tags.map((tag, index) => (
                        <Badge key={index} className="mr-1 badge bg-secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
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
      </div>




    </>

  );
};

export default Problems;


