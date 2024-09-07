import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext.jsx';

const UpdateProblem = ({ problem, onHide, onUpdate }) => {
  const { customFetch } = useAuth();

  const [formData, setFormData] = useState({
    title: problem.title,
    statement: problem.statement,
    tags: problem.tags.join(', '),
    difficulty_level: problem.difficulty_level,
    score: problem.score,
    input_format: problem.input_format || '',
    output_format: problem.output_format || '',
    constraints: problem.constraints || '',
    testcases: [],
    sample_testcases: [],
  });

  const [oldTestcases, setOldTestcases] = useState([]);
  const [oldSampleTestcases, setOldSampleTestcases] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getTestcases();
    getSampleTestcases();
  }, []);

  const getTestcases = async () => {
    try {
      const response = await customFetch(`/api/problems/${problem._id}/testcase`, "GET");
      setOldTestcases(response.map(tc => ({ ...tc, isOld: true, isEditing: false })));
    } catch (error) {
      console.error('Error getting testcases:', error);
    } 
  };

  const getSampleTestcases = async () => {
    try {
      const response = await customFetch(`/api/problems/${problem._id}/sampletestcase`, "GET");
      setOldSampleTestcases(response.map(tc => ({ ...tc, isOld: true, isEditing: false })));
    } catch (error) { 
      console.error('Error getting sample testcases:', error);
    }
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      testcases: [...oldTestcases, ...prev.testcases.filter(tc => !tc.isOld)],
      sample_testcases: [...oldSampleTestcases, ...prev.sample_testcases.filter(tc => !tc.isOld)],
    }));
  }, [oldTestcases, oldSampleTestcases]);

  const handleChange = (e, index, type) => {
    const { name, value } = e.target;
    const updatedTestcases = [...formData[type]];
    updatedTestcases[index] = { ...updatedTestcases[index], [name]: value };
    setFormData({ ...formData, [type]: updatedTestcases });
  };

  const addTestcase = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { input: '', expected_output: '', isOld: false, isEditing: true, is_sample: type === 'sample_testcases' }],
    });
  };

  const removeTestcase = (index, type) => {
    const newTestcases = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: newTestcases });
  };

  const toggleEdit = (index, type) => {
    const updatedTestcases = [...formData[type]];
    updatedTestcases[index] = { ...updatedTestcases[index], isEditing: !updatedTestcases[index].isEditing };
    setFormData({ ...formData, [type]: updatedTestcases });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch(`/api/problems/${problem._id}`, "PUT", formData);
      onUpdate();
      onHide();
    } catch (error) {
      console.error('Error updating problem:', error);
      setErrors(error);
    }
  };

  const renderTestcases = (type) => {
    return formData[type].map((testcase, index) => (
      <div key={index} className="mb-4 p-3 border rounded">
        <Form.Group controlId={`form${type.charAt(0).toUpperCase() + type.slice(1)}Input-${index}`} className="mb-3">
          <Form.Label>Input</Form.Label>
          <Form.Control
            as="textarea"
            name="input"
            value={testcase.input}
            onChange={(e) => handleChange(e, index, type)}
            rows={2}
            disabled={!testcase.isEditing}
            required
          />
        </Form.Group>
        <Form.Group controlId={`form${type.charAt(0).toUpperCase() + type.slice(1)}Output-${index}`} className="mb-3">
          <Form.Label>Expected Output</Form.Label>
          <Form.Control
            as="textarea"
            name="expected_output"
            value={testcase.expected_output}
            onChange={(e) => handleChange(e, index, type)}
            rows={2}
            disabled={!testcase.isEditing}
            required
          />
        </Form.Group>
        <Button 
          variant={testcase.isEditing ? "primary" : "secondary"} 
          onClick={() => toggleEdit(index, type)} 
          className="me-2"
        >
          {testcase.isEditing ? "Save" : "Edit"}
        </Button>
        <Button variant="danger" onClick={() => removeTestcase(index, type)}>Remove</Button>
      </div>
    ));
  };


  return (
    <Modal show={true} onHide={onHide} className="modal-xl">
            {errors.message && <div className="alert alert-danger">{errors.message}</div>}
      <Modal.Header closeButton>
        <Modal.Title>Update Problem</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formStatement">
            <Form.Label>Statement</Form.Label>
            <Form.Control as="textarea" name="statement" value={formData.statement} onChange={handleChange} rows={3} />
          </Form.Group>
          <Form.Group controlId="formTags">
            <Form.Label>Tags</Form.Label>
            <Form.Control type="text" name="tags" value={formData.tags} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formDifficulty">
            <Form.Label>Difficulty Level</Form.Label>
            <Form.Control type="text" name="difficulty_level" value={formData.difficulty_level} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formScore">
            <Form.Label>Score</Form.Label>
            <Form.Control type="text" name="score" value={formData.score} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formInputFormat">
            <Form.Label>Input Format</Form.Label>
            <Form.Control as="textarea" name="input_format" value={formData.input_format} onChange={handleChange} rows={2} />
          </Form.Group>
          <Form.Group controlId="formOutputFormat">
            <Form.Label>Output Format</Form.Label>
            <Form.Control as="textarea" name="output_format" value={formData.output_format} onChange={handleChange} rows={2} />
          </Form.Group>
          <Form.Group controlId="formConstraints">
            <Form.Label>Constraints</Form.Label>
            <Form.Control as="textarea" name="constraints" value={formData.constraints} onChange={handleChange} rows={2} />
          </Form.Group>
          <h3 className="text-center my-4">Test Cases</h3>
          {renderTestcases('testcases')}
          <Button variant="success" onClick={() => addTestcase('testcases')} className="mb-3">
            Add Test Case
          </Button>
         
          <h3 className="text-center my-4">Sample Test Cases</h3>
          {renderTestcases('sample_testcases')}
          <Button variant="success" onClick={() => addTestcase('sample_testcases')} className="mb-3">
            Add Sample Test Case
          </Button>
          
          <div className='d-grid'>
            <Button variant="primary" type="submit">
              Update Problem
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProblem;
