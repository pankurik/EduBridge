import React from 'react';
import { Navigate } from 'react-router-dom';

const isAdministrator = () => {
    return sessionStorage.getItem('role') === 'administrator';
};

const InstructorRoute = ({ children}) => {
    if (!isAdministrator()) {
        return <Navigate to="/" />;
    }
    return children;
};

export default InstructorRoute;