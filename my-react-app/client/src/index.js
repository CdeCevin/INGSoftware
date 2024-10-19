import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js' //aqui siempre me sale error, pero me funciona igual ?? dios sabrá que está fallando
import { MemoryRouter, MemoryRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MemoryRouter>
        <App />
    </MemoryRouter>
);
