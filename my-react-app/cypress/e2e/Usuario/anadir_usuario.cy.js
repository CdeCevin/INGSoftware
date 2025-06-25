describe('Ingresar Usuario nuevo- Verificación de petición', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/ingresarUsuario').as('ingresarUsuario');

    cy.visit('http://localhost:3000/AgregarUsuarios');

    cy.get('input').eq(0).clear().type('Juan Perez'); //nombre
    cy.get('input').eq(1).clear().type('210176654'); //rut
    cy.get('input').eq(2).clear().type('912345678'); //telefono
    cy.contains('label', 'Tipo de Usuario').next('select').select('Administrador'); // selección de tipo usuario
    cy.get('input').eq(3).clear().type('11112222'); //contraseña

    cy.get('button').contains('Añadir').click(); //presionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@ingresarUsuario').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      INnombre: 'Juan Perez',
      INRut: '210176654', 
      INtelefono: '912345678', 
      INRol: 'Administrador', 
      INpassword: '11112222'
      });
    });
    // Verificación de mensaje de confirmación
    cy.contains('Usuario añadido').should('be.visible');

  });
});
