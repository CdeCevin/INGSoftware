describe('Actualizar Usuario - Verificación de petición', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/upUser').as('actualizarUsuario');

    cy.visit('http://localhost:3000/ActualizarUsuario');

    cy.get('input').eq(0).clear().type('210176654'); //RUT
    cy.get('input').eq(1).clear().type('Juan Lopez'); //nombre
    cy.get('input').eq(2).clear().type('912345678'); //telefono
    cy.contains('label', 'Tipo de Usuario').next('select').select('Administrador'); //Selección tipo usuario
    cy.get('input').eq(3).clear().type('11112222'); //contraseña

    cy.get('button').contains('Actualizar').click(); //presionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@actualizarUsuario').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      rut: '210176654', 
      INnombre: 'Juan Lopez', 
      INtelefono: '912345678', 
      INtipo: 'Administrador', 
      INpassword: '11112222'
      });
    });
    // Verificación de mensaje de confirmación
    cy.contains('Usuario actualizado').should('be.visible');
  });
});
