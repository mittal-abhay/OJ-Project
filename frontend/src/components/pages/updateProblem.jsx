import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext.jsx';

const UpdateProblem = ({ problem, onHide, onUpdate }) => {
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
  const [errors, setErrors] = useState({});

  const { token } = useAuth();
  const REACT_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('testcases') || name.startsWith('sample_testcases')) {
      const [_, field, index] = name.split('-');
      const newTestcases = [...formData[name.startsWith('testcases') ? 'testcases' : 'sample_testcases']];
      if (type === 'checkbox') {
        newTestcases[index][field] = checked;
      } else {
        newTestcases[index][field] = value;
      }
      setFormData({ ...formData, [name.startsWith('testcases') ? 'testcases' : 'sample_testcases']: newTestcases });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTestcase = (type) => {
    if (type === 'testcases') {
      setFormData({
        ...formData,
        testcases: [...formData.testcases, { input: '', expected_output: '' }],
      });
    } else if (type === 'sample_testcases') {
      setFormData({
        ...formData,
        sample_testcases: [...formData.sample_testcases, { input: '', expected_output: '' }],
      });
    }
  };

  const removeTestcase = (index, type) => {
    const newTestcases = [...formData[type]];
    newTestcases.splice(index, 1);
    setFormData({ ...formData, [type]: newTestcases });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${REACT_APP_BASE_URL}/api/problems/${problem._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });
      onUpdate(); // Update the problem list after successful update
      onHide(); // Hide the modal
    } catch (error) {
      console.error('Error updating problem:', error);
      setErrors(error.response.data);
    }
  };

  return (
    <Modal show={true} onHide={onHide}>
      {errors.message && <p className="text-danger text-center">{errors.message}</p>}
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
          {formData.testcases.map((testcase, index) => (
            <div key={index} className="mb-4">
              <Form.Group controlId={`formTestcaseInput-${index}`} className="mb-3">
                <Form.Label>Input</Form.Label>
                <Form.Control as="textarea" name={`testcases-input-${index}`} value={testcase.input} onChange={handleChange} rows={2} required/>
              </Form.Group>
              <Form.Group controlId={`formTestcaseOutput-${index}`} className="mb-3">
                <Form.Label>Expected Output</Form.Label>
                <Form.Control as="textarea" name={`testcases-expected_output-${index}`} value={testcase.expected_output} onChange={handleChange} rows={2} required/>
              </Form.Group>
              <Button variant="danger" onClick={() => removeTestcase(index, 'testcases')}>Remove Test Case</Button>
            </div>
          ))}
          <Button variant="success" onClick={() => addTestcase('testcases')} className="mb-3">
            Add Test Case
          </Button>
         
          <h3 className="text-center my-4">Sample Test Cases</h3>
          {formData.sample_testcases.map((testcase, index) => (
            <div key={index} className="mb-4">
              <Form.Group controlId={`formSampleTestcaseInput-${index}`} className="mb-3">
                <Form.Label>Input</Form.Label>
                <Form.Control as="textarea" name={`sample_testcases-input-${index}`} value={testcase.input} onChange={handleChange} rows={2} required/>
              </Form.Group>
              <Form.Group controlId={`formSampleTestcaseOutput-${index}`} className="mb-3">
                <Form.Label>Expected Output</Form.Label>
                <Form.Control as="textarea" name={`sample_testcases-expected_output-${index}`} value={testcase.expected_output} onChange={handleChange} rows={2} required/>
              </Form.Group>
              <Button variant="danger" onClick={() => removeTestcase(index, 'sample_testcases')}>Remove Sample Test Case</Button>
            </div>
          ))}

          <Button variant="success" onClick={() => addTestcase('sample_testcases')} className="mb-3">
            Add Sample Test Case
          </Button>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProblem;
