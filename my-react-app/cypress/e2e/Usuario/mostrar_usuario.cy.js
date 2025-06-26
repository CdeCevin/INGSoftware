describe('Listado de Usuarios - Verificación de la tabla', () => {
  beforeEach(() => {
    cy.loginApi();
  });

  it('Debería mostrar la tabla de usuarios con datos', () => {
    cy.intercept('GET', '/api/userList').as('listaUsuarios');

    cy.visit('http://localhost:3000/ListadoUsuarios');

    // Espera respuesta del backend
    cy.wait('@listaUsuarios').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 304]);
      if (interception.response.statusCode === 200) {
        expect(interception.response.body).to.be.an('array').and.not.to.be.empty;
      }
    });

    // Verifica que el título de la sección esté visible
    cy.contains('h1', 'Listado de Usuarios').should('be.visible'); 

    // Verifica que la tabla esté visible
    cy.get('table.venta-table').should('be.visible');

    // Verifica los encabezados de la tabla
    cy.get('table.venta-table').within(() => {
      cy.get('th').eq(0).should('contain.text', 'RUT');
      cy.get('th').eq(1).should('contain.text', 'TELÉFONO');
      cy.get('th').eq(2).should('contain.text', 'NOMBRE');
      cy.get('th').eq(3).should('contain.text', 'TIPO DE USUARIO');
    });

    // Verifica que la tabla tenga al menos una fila de datos
    cy.get('table.venta-table tbody tr').should('have.length.at.least', 1);
  });
});