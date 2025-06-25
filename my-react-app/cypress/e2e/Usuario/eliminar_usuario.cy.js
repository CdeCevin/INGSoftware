describe('Eliminar Producto - Verificación de petición', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/eliminarUsuario').as('eliminarUsuario');

    cy.visit('http://localhost:3000/EliminarUsuario');

    cy.get('input').eq(0).clear().type('210176653'); //rut

    cy.get('button').contains('Eliminar').click(); //presionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@eliminarUsuario').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      Rut_Usuario: '210176653', 
      });
    });
    //Verificación de mensaje de confirmación
    cy.contains('Usuario eliminado').should('be.visible');
  });
});
