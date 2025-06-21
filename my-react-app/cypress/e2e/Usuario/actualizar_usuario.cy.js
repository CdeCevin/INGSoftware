//modificar, debido a que no lo puedo modificar sin ser admin, ni siquiera pude entrar bien

describe('Actualizar Usuario - Verificación de petición', () => {
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/upUser').as('actualizarUsuario');

    cy.visit('http://localhost:3000/ActualizarUsuario');

    cy.get('input').eq(0).clear().type('111112223');
    cy.get('input').eq(1).clear().type('Usuario_Prueba'); //nombre
    cy.get('input').eq(2).clear().type('912345678'); //telefono
    cy.contains('label', 'Tipo de Usuario').next('select').select('Administrador');
    cy.get('input').eq(3).clear().type('1122'); //contraseña

    cy.get('button').contains('Actualizar').click(); //precionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@actualizarUsuario').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      rut: '111112223', 
      INnombre: 'Usuario_Prueba', 
      INtelefono: '912345678', 
      INtipo: 'Administrador', 
      INpassword: '1122'
      });
    });
    cy.contains('Usuario actualizado').should('be.visible');
  });
});
