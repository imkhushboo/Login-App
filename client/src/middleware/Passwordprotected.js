import React, { useContext } from 'react';
import helperContext from '../context/helperContext';
import { Navigate } from 'react-router-dom';


export default function Passwordprotected({ children }) {
    const { profile } = useContext(helperContext);
    if (!profile.name) {
        return <Navigate to='/' replace={true}></Navigate>
    }
    return children;
}
