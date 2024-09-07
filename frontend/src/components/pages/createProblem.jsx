import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal, Form, Button } from 'react-bootstrap';

const CreateProblemModal = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const { customFetch } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    tags: '',
    difficulty_level: '',
    score: '',
    constraints: '',
    input_format: '',
    output_format: '',
    testcases: [],
    sample_testcases: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === 'testcases' || type === 'sample_testcases') {
      const updatedTestcases = [...formData[type]];
      updatedTestcases[index] = { ...updatedTestcases[index], [name]: value };
      setFormData({ ...formData, [type]: updatedTestcases });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTestcase = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { input: '', expected_output: '', isEditing: true, is_sample: type === 'sample_testcases' }],
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
      await customFetch(`/api/problems/create`, "POST", formData);
      setFormData({
        title: '',
        statement: '',
        tags: '',
        difficulty_level: '',
        score: '',
        constraints: '',
        input_format: '',
        output_format: '',
        testcases: [],
        sample_testcases: [],
      });
      handleClose();
      navigate('/problems');
    } catch (error) {
      console.error('Error creating problem:', error);
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
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Create Problem</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errors.message && <div className="alert alert-danger">{errors.message}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={(e) => handleChange(e)} required />
          </Form.Group>
          <Form.Group controlId="formStatement" className="mb-3">
            <Form.Label>Statement</Form.Label>
            <Form.Control as="textarea" name="statement" value={formData.statement} onChange={(e) => handleChange(e)} rows={3} required />
          </Form.Group>
          <Form.Group controlId="formTags" className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Form.Control type="text" name="tags" value={formData.tags} onChange={(e) => handleChange(e)} required />
          </Form.Group>
          <Form.Group controlId="formDifficulty" className="mb-3">
            <Form.Label>Difficulty Level</Form.Label>
            <Form.Control type="text" name="difficulty_level" value={formData.difficulty_level} onChange={(e) => handleChange(e)} required />
          </Form.Group>
          <Form.Group controlId="formScore" className="mb-3">
            <Form.Label>Score</Form.Label>
            <Form.Control type="text" name="score" value={formData.score} onChange={(e) => handleChange(e)} required />
          </Form.Group>
          <Form.Group controlId="formConstraints" className="mb-3">
            <Form.Label>Constraints</Form.Label>
            <Form.Control as="textarea" name="constraints" value={formData.constraints} onChange={(e) => handleChange(e)} rows={2} />
          </Form.Group>
          <Form.Group controlId="formInputFormat" className="mb-3">
            <Form.Label>Input Format</Form.Label>
            <Form.Control as="textarea" name="input_format" value={formData.input_format} onChange={(e) => handleChange(e)} rows={2} />
          </Form.Group>
          <Form.Group controlId="formOutputFormat" className="mb-3">
            <Form.Label>Output Format</Form.Label>
            <Form.Control as="textarea" name="output_format" value={formData.output_format} onChange={(e) => handleChange(e)} rows={2} />
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
              Create Problem
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProblemModal;