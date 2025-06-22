//modificar, debido a que no lo puedo modificar sin ser admin, ni siquiera pude entrar bien

describe('Actualizar Usuario - Verificación de petición', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/upUser').as('actualizarUsuario');

    cy.visit('http://localhost:3000/ActualizarUsuario');

    cy.get('input').eq(0).clear().type('210176651');
    cy.get('input').eq(1).clear().type('UsuarioDePrueba'); //nombre
    cy.get('input').eq(2).clear().type('912345678'); //telefono
    cy.contains('label', 'Tipo de Usuario').next('select').select('Administrador');
    cy.get('input').eq(3).clear().type('11112222'); //contraseña

    cy.get('button').contains('Actualizar').click(); //precionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@actualizarUsuario').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      rut: '210176651', 
      INnombre: 'UsuarioDePrueba', 
      INtelefono: '912345678', 
      INtipo: 'Administrador', 
      INpassword: '11112222'
      });
    });
    cy.contains('Usuario actualizado').should('be.visible');
  });
});
