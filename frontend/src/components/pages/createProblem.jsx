import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal, Form, Button } from 'react-bootstrap';

const CreateProblemModal = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    tags: '',
    difficulty_level: '',
    score: '',
    constraints: '',
    input_format: '',
    output_format: '',
    testcases: [{ input: '', expected_output: '' }],
    sample_testcases: [{ input: '', expected_output: '' }],
  });
  const [errors, setErrors] = useState({});

  const { token } = useAuth();

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
    setFormData({
      ...formData,
      [type]: [...formData[type], { input: '', expected_output: '', visibility: false }],
    });
  };

  const removeTestcase = (index, type) => {
    const newTestcases = [...formData[type]];
    newTestcases.splice(index, 1);
    setFormData({ ...formData, [type]: newTestcases });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData)
    try {
      const res = await axios.post('http://localhost:5000/api/problems/create', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });
      setFormData({
        title: '',
        statement: '',
        tags: '',
        difficulty_level: '',
        score: '',
        constraints: '',
        input_format: '',
        output_format: '',
        testcases: [{ input: '', expected_output: '' }],
        sample_testcases: [{ input: '', expected_output: '' }],
      });
      handleClose(); // Close modal after successful submission
      navigate('/problems');
      console.log('Problem created:', res.data);
    } catch (error) {
      console.error('Error creating problem:', error);
      setErrors(error.response.data);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      {errors.message && <div className="alert alert-danger">{errors.message}</div>}
      <Modal.Header closeButton>
        <Modal.Title>Create Problem</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formStatement" className="mb-3">
            <Form.Label>Statement</Form.Label>
            <Form.Control as="textarea" name="statement" value={formData.statement} onChange={handleChange} rows={3} />
          </Form.Group>
          <Form.Group controlId="formTags" className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Form.Control type="text" name="tags" value={formData.tags} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formDifficulty" className="mb-3">
            <Form.Label>Difficulty Level</Form.Label>
            <Form.Control type="text" name="difficulty_level" value={formData.difficulty_level} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formScore" className="mb-3">
            <Form.Label>Score</Form.Label>
            <Form.Control type="text" name="score" value={formData.score} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formConstraints" className="mb-3">
            <Form.Label>Constraints</Form.Label>
            <Form.Control as="textarea" name="constraints" value={formData.constraints} onChange={handleChange} rows={2} />
          </Form.Group>
          <Form.Group controlId="formInputFormat" className="mb-3">
            <Form.Label>Input Format</Form.Label>
            <Form.Control as="textarea" name="input_format" value={formData.input_format} onChange={handleChange} rows={2} />
          </Form.Group>
          <Form.Group controlId="formOutputFormat" className="mb-3">
            <Form.Label>Output Format</Form.Label>
            <Form.Control as="textarea" name="output_format" value={formData.output_format} onChange={handleChange} rows={2} />
          </Form.Group>

          <h3 className="text-center my-4">Test Cases</h3>
          {formData.testcases.map((testcase, index) => (
            <div key={index} className="mb-4">
              <Form.Group controlId={`formTestcaseInput-${index}`} className="mb-3">
                <Form.Label>Input</Form.Label>
                <Form.Control as="textarea" name={`testcases-input-${index}`} value={testcase.input} onChange={handleChange} rows={2} />
              </Form.Group>
              <Form.Group controlId={`formTestcaseOutput-${index}`} className="mb-3">
                <Form.Label>Expected Output</Form.Label>
                <Form.Control as="textarea" name={`testcases-expected_output-${index}`} value={testcase.expected_output} onChange={handleChange} rows={2} />
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
                <Form.Control as="textarea" name={`sample_testcases-input-${index}`} value={testcase.input} onChange={handleChange} rows={2} />
              </Form.Group>
              <Form.Group controlId={`formSampleTestcaseOutput-${index}`} className="mb-3">
                <Form.Label>Expected Output</Form.Label>
                <Form.Control as="textarea" name={`sample_testcases-expected_output-${index}`} value={testcase.expected_output} onChange={handleChange} rows={2} />
              </Form.Group>
              <Button variant="danger" onClick={() => removeTestcase(index, 'sample_testcases')}>Remove Sample Test Case</Button>
            </div>
          ))}
          <Button variant="success" onClick={() => addTestcase('sample_testcases')} className="mb-3">
            Add Sample Test Case
          </Button>

          <Button variant="primary" type="submit">
            Create Problem
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProblemModal;
