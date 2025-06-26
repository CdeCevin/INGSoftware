// src/Componentes/Auth/ProtectedRoute.js (o donde prefieras)

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole || !allowedRoles.includes(userRole)) {
        // Si no está autenticado o no tiene el rol, redirige a /login
        //return <Navigate to="/login" replace />;
        console.log('lerolero');
        return <Outlet />;
    }

    // Si está autenticado y tiene el rol, renderiza los componentes hijos de la ruta
    return <Outlet />;
};

export default ProtectedRoute;