import React, { useState } from 'react';
import { Container, Typography, Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const RegisterPage = ({setIsLogin}) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, password } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.');
      return;
    }

    try {
      await register({ firstname, lastname, email, password });
      setIsLogin(true);
    
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Firstname" name="firstname" variant="outlined" fullWidth margin="normal" value={formData.firstname} onChange={handleChange} />
          <TextField label="Lastname" name="lastname" variant="outlined" fullWidth margin="normal" value={formData.lastname} onChange={handleChange} />
          <TextField label="Email" name="email" variant="outlined" fullWidth margin="normal" value={formData.email} onChange={handleChange} />
          <TextField label="Password" name="password" variant="outlined" type="password" fullWidth margin="normal" value={formData.password} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary" fullWidth>Sign Up</Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;