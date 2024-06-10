import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import img1 from '../../assets/Coding-illustration.avif'
import Navbar from '../commons/navbar';
import "./home.css";
const Home = () => {
  return (
    <>
    <Navbar/>
    <Container className="fluid">
      <Row >
        <Col md={6} className="text-md-left mt-5">
          <h1 className="display-4 mt-4">Welcome to CodeNow!!</h1>
          <p className="lead mt-3">CodeNow is your premier platform for engaging coding challenges and comprehensive practice problems, designed to enhance your programming skills and prepare you for competitive coding and technical interviews.</p>
          <Link to="/problems">
            <button className="solve-btn">Start Solving Problems</button>
          </Link>
        </Col>
        <Col md={6} className="text-center">
          <img src={img1} alt="Coding" className="img-fluid" />
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Home;
