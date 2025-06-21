// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
Cypress.Commands.add('login', (usuario, contraseña) => {
    cy.visit('http://localhost:3000'); // cambia según tu ruta

    cy.get('input').eq(0).type(usuario);
    cy.get('input').eq(1).type(contraseña);

    cy.get('button').contains('Entrar').click();
    cy.url().should('include', '/Bienvenido/inicio');
});

Cypress.Commands.add('loginApi', () => {
  cy.request('POST', '/api/login', {
    usuario: '213233963',
    password: '1234'
  }).then((resp) => {
    window.localStorage.setItem('token', resp.body.token);
  });
});
