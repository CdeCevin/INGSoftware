describe('Actualizar Producto - Verificación de petición', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/eliminarProducto').as('eliminarProducto');

    cy.visit('http://localhost:3000/EliminarProducto');

    cy.get('input').eq(0).type('1111'); //codigo producto

    cy.get('button').contains('Eliminar').click(); //presionar boton actualizar

     cy.wait('@eliminarProducto').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
        codigo: '1111'
      });
    });
    // Verificar mensaje de confirmación
    cy.contains('Producto eliminado').should('be.visible');

  });
});