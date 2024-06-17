import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../commons/navbar.jsx';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import AceEditor from 'react-ace';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Import Ace Editor modes and themes
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';  // Dark theme

// Import custom styles
import './problem.css';

const Problem = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [verdict, setVerdict] = useState(''); // State for verdict
  const [testCases, setTestCases] = useState([]);
  const [testCaseStatus, setTestCaseStatus] = useState([]); // State to track the pass/fail status of each test case
  const [sampleTestCases, setSampleTestCases] = useState([]); // State for sample test cases
  const [customInput, setCustomInput] = useState([]); // State for custom input
  const [sampleTestCaseInput, setSampleTestCaseInput] = useState([]); // State for sample test case input
  const [result, setResult] = useState(''); // State for result
  const [codeError, setCodeError] = useState(''); // State for code error
  const [language, setLanguage] = useState('cpp'); // State for language
  const [loading, setLoading] = useState(false);
  const REACT_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${REACT_APP_BASE_URL}/api/problems/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setProblem(res.data);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    const fetchTestCases = async () => {
      try {
        const res = await axios.get(`${REACT_APP_BASE_URL}/api/problems/${id}/testcase`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setTestCases(res.data);
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };

    const fetchSampleTestCases = async () => {
      try {
        const res = await axios.get(`${REACT_APP_BASE_URL}/api/problems/${id}/sampletestcase`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setSampleTestCases(res.data);
      } catch (error) {
        console.error('Error fetching sample test cases:', error);
      }
    };

    if (id) {
      fetchProblem();
      fetchTestCases();
      fetchSampleTestCases();
    }
  }, [id, token]);

  const handleUserCodeChange = (newValue) => {
    setUserCode(newValue);
  };

  const handleCustomInputChange = (event) => {
    setCustomInput(event.target.value);
  };

  const handleRunCode = async () => {
    setLoading(true);
    setVerdict("");
    setCodeError("");
    setTestCaseStatus([]);
    setResult('');
    try {
      const stestCaseInput = sampleTestCases.map((samplecase) => samplecase.input);
      setSampleTestCaseInput(stestCaseInput);
      const res = await axios.post(`${REACT_APP_BASE_URL}/run`, {
        code: userCode,
        inputValue: stestCaseInput,// Send custom input
        lang: language,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        }
      });
      setLoading(false);
      setResult(res.data.output);
      setCodeError('');
      setTestCaseStatus([]);
      setVerdict("");
    } catch (error) {
      setLoading(false);
      setCodeError(JSON.stringify(error.response.data.error));
      setResult(error.response.data.message);
      setTestCaseStatus([]);
      setVerdict("");
    }
  };

  const handleRunCustomInput = async () => {
    setLoading(true);
    setVerdict("");
    setCodeError("");
    setTestCaseStatus([]);
    setResult('');
    try {

      const res = await axios.post( `${REACT_APP_BASE_URL}/run`, {
        code: userCode,
        inputValue: [customInput], // Send custom input
        lang: language,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        }
      });
      setLoading(false);
      setResult(res.data.output);
      setCodeError('');
      setTestCaseStatus([]);
      setVerdict("");
    } catch (error) {
      setLoading(false);
      setCodeError(JSON.stringify(error.response.data.error));
      setResult(error.response.data.message);
      setTestCaseStatus([]);
      setVerdict("");
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setVerdict("");
    setCodeError("");
    setTestCaseStatus([]);
    setResult('');
    try {

      const res = await axios.post(`${REACT_APP_BASE_URL}/submit`, {
        user_id: user,
        prob_id: id,
        code: userCode,
        lang: language,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        }
      });
      setLoading(false);
      setResult(JSON.stringify(res.data.submission.comment, null, 2));
      // Set all test cases to 'passed'
      setTestCaseStatus(testCases.map(() => 'passed'));
      setVerdict("Accepted")
      setCodeError('');
    } catch (error) {
      setLoading(false);
      setResult(error.response.data.message);
      console.log(error.response.data.submission)
      if (result === "Code is Missing") {
        setVerdict("");
        setCodeError("");
        setTestCaseStatus([]);
        return;
      }
      const comment = error.response.data.submission.comment;
      setResult(comment);

      if (comment.includes('Compilation Error')) {
        setVerdict("Compilation Error")
        setTestCaseStatus([]); // Reset test case status to an empty array
        setCodeError(JSON.stringify(error.response.data.error));
        return;
      }
      const tlecase = error.response.data.message;

      if (tlecase.includes('TLE')) {
        setVerdict("Time Limit Exceeded")
        setTestCaseStatus([]); // Reset test case status to an empty array
        setCodeError(JSON.stringify(error.response.data.error));
        return;
      }
      if (!comment.includes('failed at testcase')) {
        setTestCaseStatus(testCases.map(() => 'failed'));
        setVerdict("Wrong Answer")
        setCodeError(JSON.stringify(error.response.data.error));
        return;
      }

      const failedTestCase = parseInt(comment.match(/\d+/)[0], 10) - 1;

      setTestCaseStatus(testCases.map((_, index) => {
        if (index < failedTestCase) return 'passed';
        if (index === failedTestCase) return 'failed';
        setVerdict("Wrong Answer")
        setCodeError('');
        return '';
      }));


    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };




  if (!problem) {
    return <div>Problem doesn't exist</div>;
  }
  return (
    <div>
      <Navbar />
      <Container fluid>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header as="h3" style={{ fontWeight: 'bold' }}>{problem.title}</Card.Header>
              <Card.Body>
                <h4 style={{ fontWeight: 'bold' }}>Problem Statement:</h4>
                <Card.Text className="mb-3">{problem.statement}</Card.Text>
                <h4 style={{ fontWeight: 'bold' }}>Input Format:</h4>
                <Card.Text className="mb-3">{problem.input_format}</Card.Text>
                <h4 style={{ fontWeight: 'bold' }}>Constraints:</h4>
                <Card.Text className="mb-3">{problem.constraints}</Card.Text>
                <h4 style={{ fontWeight: 'bold' }}>Output Format:</h4>
                <Card.Text className="mb-3">{problem.output_format}</Card.Text>
                <h4 style={{ fontWeight: 'bold' }}>Execution Time Limit: </h4>
                <Card.Text className="mb-3">{problem.execution_time_limit} seconds</Card.Text>
                <h4 style={{ fontWeight: 'bold' }}>Sample Test Cases:</h4>
                {sampleTestCases.map((samplecase, index) => (
                  <div key={index} className="sample-test-case" style={{ marginBottom: '10px' }}>
                    <CopyToClipboard text={samplecase.input.replace(/\\n/g, '\n')}>
                      <Button variant="primary" size="sm" style={{ float: 'right' }}>
                        Copy Input
                      </Button>
                    </CopyToClipboard>
                    <div style={{ backgroundColor: '#272822', color: 'white', padding: '10px', border: '10px' }}>
                      <p style={{ fontWeight: 'bold' }}>Input:</p>
                      <pre style={{ fontFamily: 'monospace', color: 'white' }}>{samplecase.input}</pre>
                      <p style={{ fontWeight: 'bold' }}>Output:</p>
                      <pre style={{ fontFamily: 'monospace', color: 'white' }}>{samplecase.expected_output}</pre>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Row className="mx-2">
                <Col>
                  <p className="fw-bold mt-4">Code</p>
                </Col>
                <Col>
                  <Form.Select className="mt-3" aria-label="Select Language" onChange={handleLanguageChange} value={language}>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                  </Form.Select>
                </Col>
              </Row>


              <Card.Body>
                <AceEditor
                  mode="c_cpp"
                  theme="monokai" // Set to dark theme
                  name="codeEditor"
                  onChange={handleUserCodeChange}
                  fontSize={16}
                  value={userCode}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                  style={{ width: '100%', fontFamily: 'monospace' }}
                />
                <div className="mt-3 d-flex justify-content-between">
                  <Button variant="primary" onClick={handleRunCode}>Run</Button>
                  <Button variant="success" onClick={handleSubmitCode}>Submit</Button>
                </div>

                <Form.Group className="mt-3">
                  <Form.Label>Custom Input</Form.Label>
                  <Form.Control as="textarea" rows={3} value={customInput} onChange={handleCustomInputChange} />
                  <Button variant="secondary" onClick={handleRunCustomInput} className="mt-2">Run Custom Input</Button>
                </Form.Group>

                <Card className="mt-3">
                  <Card.Header as="h4" style={{ fontWeight: 'bold' }}>Output</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      {loading && <pre>Loading....</pre>}
                      {verdict && <pre style={{ fontWeight: 'bold' }}> Verdict: {verdict}</pre>}
                      <pre style={{ fontFamily: 'monospace' }}>{result}</pre>
                      {codeError && <pre style={{ color: 'red' }}> Error: {codeError}</pre>}
                    </Card.Text>
                    <div className="test-case-indicators">
                      {testCaseStatus.map((status, index) => (
                        status && (
                          <div
                            key={index}
                            className={`test-case-rectangle ${status}`}
                            style={{ marginBottom: '5px', fontWeight: 'bold' }}
                          >
                            Test Case {index + 1}
                          </div>
                        )
                      ))}
                    </div>
                  </Card.Body>
                </Card>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Problem; 