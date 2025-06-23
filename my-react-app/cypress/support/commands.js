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

Cypress.Commands.add('login', (usuario, contraseña) => {
    cy.visit('http://localhost:3000'); // cambia según tu ruta

    cy.get('input').eq(0).type(usuario);
    cy.get('input').eq(1).type(contraseña);

    cy.get('button').contains('Entrar').click();
    cy.url().should('include', '/Bienvenido/inicio');
});

Cypress.Commands.add('loginApi', () => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    rut: 213233963,
    password: '12345678'
  }).then((resp) => {
    window.localStorage.setItem('token', resp.body.token);
    window.localStorage.setItem('userRole', resp.body.userRole || 'Administrador');
    window.localStorage.setItem('userRut', resp.body.userRut || '213233963');
  });
});
