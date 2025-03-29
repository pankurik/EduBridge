import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import apiService from '../../services/apiService';
import {
  Grid, Paper, Box, Typography, TextField, Button,
  Checkbox, FormControlLabel,
  InputAdornment, IconButton
} from '@mui/material';
import theme from '../../theme'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import logo from '../../images/eduBridge.webp';
import backgroundImage from '../../images/Backgroundimage.png';
import backgroundImage2 from '../../images/Background2.webp';
import './Signup.css'

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const isValidEmail = email.endsWith('.edu');
  const isFormFilled = email && password && isValidEmail && confirmedPassword && termsAccepted && firstName && lastName;

  useEffect(() => {
    function handleEnterKey(event) {
      if (event.key === 'Enter' && !isFormFilled) {
        event.preventDefault();
      }
    }

    // Attach the event listener conditionally
    window.addEventListener('keydown', handleEnterKey);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleEnterKey);
    };
  }, [isFormFilled]);  // Dependency on isFormFilled
  
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmedPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (!email.endsWith('.edu')) {
      alert('Please use a .edu email address.');
      return;
    }
    if (!termsAccepted) {
      alert('Please accept the terms and conditions.');
      return;
    }
    if (password !== confirmedPassword){
      alert('Passwords do not match! Please retry.');
      return;
    }
    
    try {
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const response = await apiService.signup(firstName, lastName, email, hashedPassword);
      console.log(response.data);
      alert('Signup successful!');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response.data.message === "Email is already in use") {
        alert('Email already in use. Please login!')
        navigate('/login');
      } else {
        alert('Signup failed.');
      }
    }
  };
  

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid item xs={false} sm={4} md={5} sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'left',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
        }}>
            <Box sx={{ textAlign: 'center', maxWidth: 360 }}>
                <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto', marginBottom: theme.spacing(2), borderRadius: '50%', boxShadow: `0px 0px 10px ${theme.palette.secondary.main}` }} />
                <Typography variant="h3" gutterBottom sx={{ fontFamily: 'AudioWide', fontWeight: 'bold', color: theme.palette.primary.contrastText }}>
                    Welcome Back!
                </Typography>
                <Typography variant="h6" sx={{ color: theme.palette.primary.contrastText }}>
                    To where education connects — log in to continue your journey.
                </Typography>
                <Button className='sign-in' sx={{ mt: 7.95}} variant="contained" onClick={() => navigate('/login')}>
                    Sign In
                </Button>
            </Box>
        </Grid>

        <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square sx={{ backgroundImage: `url(${backgroundImage2})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover', // Adjust to fit the background image as portrait
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column', }}>
            <Box sx={{
                my: -16,
                mx: 32,
                mt: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Typography component="h1" variant="h3" gutterBottom sx={{ fontFamily: 'AudioWide', fontWeight: 'bold' }}>
                    Create an Account
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ my: 16, mx: 32, mt: 1, width: '100%' }}>
                    {/* First Name */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="First Name"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon />
                                </InputAdornment>
                            ),
                        }}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    {/* Last Name */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Last Name"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon />
                                </InputAdornment>
                            ),
                        }}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    {/* Email */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* Password */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Confirm Password */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                    />
                    {/* Terms and Conditions */}
                        <div className='last-row'>
                            <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label="I accept the Terms of Service and Privacy Policy"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        sx={{ mt: 3, mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            mt: 3,
                            mb: 2,
                            fontWeight: 'bold',
                            borderRadius: '25px', // Adjust border radius to make the button smaller
                            textTransform: 'none', // Remove text transformation
                            border: 'none', // Remove button border
                            boxShadow: 'none', // Remove button box shadow
                            fontSize: '20px', // Adjust font size
                            padding: '8px 20px', // Adjust padding to make the button smaller
                            cursor: isFormFilled ? 'pointer' : 'not-allowed',
                            opacity: isFormFilled ? 1 : 0.5,
                            pointerEvents: isFormFilled ? 'auto' : 'none', // Ensure button is not clickable when disabled
                        }}>
                        Sign Up
                    </Button>
                        </div>
                </Box>
            </Box>
        </Grid>
    </Grid>
);
}

export default Signup;


