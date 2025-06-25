// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import 'cypress-file-upload';

Cypress.Commands.add('loginApi', () => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    rut: 210165541,
    password: '11112222'
  }).then((resp) => {
    window.localStorage.setItem('token', resp.body.token);
    window.localStorage.setItem('userRole', resp.body.userRole || 'Administrador');
    window.localStorage.setItem('userRut', resp.body.userRut || '210165541');
  });
});
