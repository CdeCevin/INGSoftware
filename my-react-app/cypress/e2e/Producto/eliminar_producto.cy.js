describe('Actualizar Producto - Verificación de petición', () => {
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/eliminarProducto').as('eliminarProducto');

    cy.visit('http://localhost:3000/EliminarProducto');

    cy.get('input').eq(0).type('10'); //codigo producto

    cy.get('button').contains('Eliminar').click(); //precionar boton actualizar

     cy.wait('@eliminarProducto').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
        codigo: '10'
      });
    });

    cy.contains('Producto eliminado').should('be.visible');

  });
});