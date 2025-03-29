import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Box, Button, Link, Paper, TextField, Typography, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../../images/eduBridge.webp';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import backgroundImage from '../../images/Backgroundimage.png';
import theme from '../../theme';
import './ForgotPassword.css'
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const isValidEmail = email.endsWith('.edu');
    const isFormFilled = otp && newPassword;

    useEffect(() => {
        function handleEnterKey(event) {

          if (event.key == 'Enter' && (isFormFilled || !isValidEmail)){
            event.preventDefault();
          }
        }
    
        // Attach the event listener conditionally
        window.addEventListener('keydown', handleEnterKey);
    
        // Cleanup function to remove the event listener
        return () => {
          window.removeEventListener('keydown', handleEnterKey);
        };
      }, [isValidEmail] || [isFormFilled]);  // Dependency on isValidEmail or isFormFilled

    const handleRequestReset = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage('Please enter your email.');
            return;
        }
        try {
            await apiService.requestPasswordReset(email);
            setMessage('If the email is registered, you will receive a password reset email shortly.');
            setResetSent(true); // Update resetSent state here
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await apiService.resetPasswordWithOtp(email, otp, newPassword);
            alert('Your password has been reset successfully. You can now login with your new password.');
            navigate(`/login`);
        } catch (error) {
            setMessage('Failed to reset password. Please ensure your OTP is correct and try again.');
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: theme.backgroundSize,
                backgroundPosition: theme.backgroundPosition,
            }}
        >
            <Paper elevation={6} square sx={{
                padding: '40px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxWidth: '450px'
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Avatar src={logo} sx={{ width: 100, height: 100, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>Forgot Your Password?</Typography>
                    <form onSubmit={resetSent ? handleResetPassword : handleRequestReset} noValidate sx={{ mt: 1 }}>
                        {resetSent ? (
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="otp"
                                    label="OTP"
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="newPassword"
                                    label="New Password"
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ 
                                        mt: 3, 
                                        mb: 2,
                                        cursor: isFormFilled ? 'pointer' : 'not-allowed',
                                        opacity: isFormFilled ? 1 : 0.5,
                                        pointerEvents: isFormFilled ? 'auto' : 'none', 
                                    }}
                                    startIcon={<LockOutlinedIcon />}
                                >
                                    Reset Password
                                </Button>
                            </>
                        ) : (
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <EmailIcon color="action" sx={{ mr: 2 }} />
                                        ),
                                    }}
                                />
                                <div className='login-text'>
                                    <Link href="/login" variant="body2" >
                                    Go back to Login
                                    </Link>
                                </div>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ 
                                        mt: 3, 
                                        mb: 2, 
                                        cursor: isValidEmail ? 'pointer' : 'not-allowed',
                                        opacity: isValidEmail ? 1 : 0.5,
                                        pointerEvents: isValidEmail ? 'auto' : 'none',
                                    }}
                                >
                                    Send Reset Link
                                </Button>
                            </>
                        )}
                    </form>
                    <Box sx={{ mt: 2 }}>
                        {message && <Typography color="secondary">{message}</Typography>}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default ForgotPassword;



