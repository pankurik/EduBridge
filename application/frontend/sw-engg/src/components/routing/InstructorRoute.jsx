import React from 'react';
import { Navigate } from 'react-router-dom';

// Function to check if the user's role is 'instructor'
const isInstructor = () => {
    return sessionStorage.getItem('role') === 'instructor';
};

// Component to protect routes intended only for instructors
const InstructorRoute = ({ children }) => {
    if (!isInstructor()) {
        return <Navigate to="/" />;
    }
    return children;
};

export default InstructorRoute;
