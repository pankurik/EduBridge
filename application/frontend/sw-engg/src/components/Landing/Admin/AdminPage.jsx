import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { Box, Paper, TextField, Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import theme from '../../../theme'; // Ensure the theme is imported correctly
import BackgroundImage from '../../../images/Background2.webp';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await apiService.fetchUsers();
      const usersWithDefaultRole = fetchedUsers.map(user => ({
        ...user,
        role: user.role || 'Student' // Set default to 'Student' if not specified
      }));
      setUsers(usersWithDefaultRole);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleRoleChange = async (email, newRole) => {
    if (users.find(user => user.email === email && user.role === 'admin')) {
      setFeedback({ open: true, message: 'Admin role cannot be changed.', severity: 'error' });
      return;
    }
    try {
      const response = await apiService.updateUserRole(email, newRole);
      if (response.success) {
        setUsers(users.map(user =>
          user.email === email ? { ...user, role: newRole } : user
        ));
        setFeedback({ open: true, message: 'Role updated successfully.', severity: 'success' });
      } else {
        console.error('Failed to update user role in the database.');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleCloseFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 'auto',
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        margin: 0,
        padding: theme.spacing(3),
      }}
    >
      <Paper elevation={6} square sx={{
        width: '100%',
        maxWidth: 800,
        margin: theme.spacing(2),
        padding: theme.spacing(3),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
      }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: theme.spacing(2) }}>
          Admin Page
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: theme.spacing(2) }}
        />
        <Table sx={{ marginBottom: theme.spacing(2) }}>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? (
                    'Admin'
                  ) : (
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.email, e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="Student">Student</MenuItem>
                      <MenuItem value="Instructor">Instructor</MenuItem>
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Snackbar open={feedback.open} autoHideDuration={6000} onClose={handleCloseFeedback}>
        <Alert onClose={handleCloseFeedback} severity={feedback.severity} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPage;
