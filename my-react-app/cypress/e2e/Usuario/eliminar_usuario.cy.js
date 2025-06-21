//modificar, debido a que no lo puedo modificar sin ser admin, ni siquiera pude entrar bien

describe('Eliminar Producto - Verificación de petición', () => {
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/eliminarUsuario').as('eliminarUsuario');

    cy.visit('http://localhost:3000/EliminarUsuario');

    cy.get('input').eq(0).clear().type('111112223'); //rut

    cy.get('button').contains('Eliminar').click(); //precionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@eliminarUsuario').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      INRut: '111112223', 
      });
    });
    cy.contains('Usuario eliminado').should('be.visible');
  });
});
