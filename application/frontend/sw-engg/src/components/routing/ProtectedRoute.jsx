import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
};

const isStudent = () => {
    return sessionStorage.getItem('role') === 'Student';
};

const isInstructor = () => {
    return sessionStorage.getItem('role') === 'Instructor';
};


const ProtectedRoute = ({ children }) => {

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }


    if (isStudent() || isInstructor()) {
        return children;
    }


    return <Navigate to="/login" />;
};

export default ProtectedRoute;