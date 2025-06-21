describe('Formulario de Login', () => {
  it('Permite iniciar sesión con RUT y contraseña', () => {
    cy.visit('http://localhost:3000');

    cy.get('input').eq(0).type('213233963'); //RUT
    cy.get('input').eq(1).type('1234'); //password
    cy.get('button').contains('Entrar').click();

    cy.url().should('include', '/Bienvenido/inicio');
  });
});
