import React from 'react';
import { Navigate } from 'react-router-dom';

const isStudent = () => {
    return sessionStorage.getItem('role') === 'student';
};

const StudentRoute = ({ children}) => {
    if (!isStudent()) {
        return <Navigate to="/" />;
    }
    return children;
};

export default StudentRoute;