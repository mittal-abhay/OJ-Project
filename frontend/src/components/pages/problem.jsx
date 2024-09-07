import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../commons/navbar.jsx';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import AceEditor from 'react-ace';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// Import Ace Editor modes and themes
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';  // Dark theme
import Loader from '../commons/Loader/Loader.jsx';
// Import custom styles
import '../styles/problem.css';

const Problem = () => {
  const COMPILER_URL = import.meta.env.VITE_APP_COMPILER_URL;
  const { customFetch, token} = useAuth();
  const { id } = useParams();
  const { user, logout } = useAuth();
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

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await customFetch(`/api/problems/${id}`, "GET");
        setProblem(res);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    const fetchTestCases = async () => {
      try {
        const res = await customFetch(`/api/problems/${id}/testcase`, "GET");
        setTestCases(res);
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };
    
    const fetchSampleTestCases = async () => {
      try {
        const res = await customFetch(`/api/problems/${id}/sampletestcase`, "GET");
        setSampleTestCases(res);
      } catch (error) {
        console.error('Error fetching sample test cases:', error);
      }
    };

    if (id) {
      fetchProblem();
      fetchTestCases();
      fetchSampleTestCases();
    }
  }, [id]);

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
  
      const res = await fetch(`${COMPILER_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          code: userCode,
          inputValue: stestCaseInput, // Send custom input
          lang: language,
        }),
      });
      if(res.status === 401){
        logout();
      }
      if (!res.ok) {
        throw await res.json();
      }
      const data = await res.json();
      setResult(data.output);
      setCodeError('');
    } catch (err) {
      setResult(JSON.stringify(err.error));
      setCodeError(err.message);
    } finally {
      setLoading(false);
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

      const res = await fetch(`${COMPILER_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          code: userCode,
          inputValue: [customInput], // Send custom input
          lang: language,
        }),
      });
      if(res.status === 401){
        logout();
      }

      if (!res.ok) {
        throw await res.json();
      }
      const data = await res.json();
      setResult(data.output);
      setCodeError('');
    } catch (err) {
      setResult(JSON.stringify(err.error));
      setCodeError(err.message);
    } finally {
      setLoading(false);
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
      const res = await fetch(`${COMPILER_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          user_id: user,
          prob_id: id,
          code: userCode,
          lang: language,
        }),
      });
      if(res.status === 401){
        logout();
      }
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();
      setResult(JSON.stringify(data.submission.comment, null, 2));
      setTestCaseStatus(testCases.map(() => 'passed')); // Set all test cases to 'passed'
      setVerdict("Accepted");
      setCodeError('');
    } catch (error) {
      const errorData = await error.json();
      setResult(errorData.message);
  
      if (errorData.message === "Code is Missing") {
        setVerdict("");
        setCodeError("");
        setTestCaseStatus([]);
        return;
      }
  
      const comment = errorData.submission.comment;
      setResult(comment);
  
      if (comment.includes('Compilation Error')) {
        setVerdict("Compilation Error");
        setTestCaseStatus([]); // Reset test case status to an empty array
        setCodeError(JSON.stringify(errorData.error));
        return;
      }
  
      if (errorData.message.includes('TLE')) {
        setVerdict("Time Limit Exceeded");
        setTestCaseStatus([]); // Reset test case status to an empty array
        setCodeError(JSON.stringify(errorData.error));
        return;
      }
  
      if (!comment.includes('failed at testcase')) {
        setTestCaseStatus(testCases.map(() => 'failed'));
        setVerdict("Wrong Answer");
        setCodeError(JSON.stringify(errorData.error));
        return;
      }
  
      const failedTestCase = parseInt(comment.match(/\d+/)[0], 10) - 1;
  
      setTestCaseStatus(testCases.map((_, index) => {
        if (index < failedTestCase) return 'passed';
        if (index === failedTestCase) return 'failed';
        return ''; // Return empty string if not matched
      }));
      
      setVerdict("Wrong Answer");
      setCodeError('');
    } finally {
      console.log(testCaseStatus)
      setLoading(false);
    }
  };
  
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };


  if (!problem) {
    return <div>Loading</div>;
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
                      {loading && <Loader/>}
                      {verdict && <pre style={{ fontWeight: 'bold' }}> Verdict: {verdict}</pre>}
                      {codeError && <pre style={{ color: 'red' }}> Error: {codeError}</pre>}
                      <pre style={{ fontFamily: 'monospace' }}>{result}</pre>
                    </Card.Text>
                    <d className="test-case-indicators">
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
                    </d>
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