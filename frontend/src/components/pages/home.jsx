import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '../commons/navbar';
import './home.css'; // Import the custom CSS file
import img1 from '../../assets/Coding-illustration.avif'; // Adjust the path to your image

const Home = () => {
  return (
    <div>
      <Navbar />
      <Container className="home-container">
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-left">
            <p className="welcome-text">Welcome to CodeNow</p>
            <p className="sub-text">Your one-stop destination for coding challenges and practice problems.</p>
            <Link to="/problems">
              <Button className="solve-button mb-2">Solve Problems</Button>
            </Link>
          </Col>
          <Col md={6} className="text-center">
            <img src={img1} alt="Coding" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
