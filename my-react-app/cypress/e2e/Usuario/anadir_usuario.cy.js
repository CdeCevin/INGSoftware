//modificar, debido a que no lo puedo modificar sin ser admin, ni siquiera pude entrar bien

describe('Ingresar Usuario - Verificación de petición', () => {
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/ingresarUsuario').as('ingresarUsuario');

    cy.visit('http://localhost:3000/AgregarUsuario');

    cy.get('input').eq(0).clear().type('Usuario_Prueba'); //nombre
    cy.get('input').eq(1).clear().type('111112223'); //rut
    cy.get('input').eq(2).clear().type('912345678'); //telefono
    cy.contains('label', 'Tipo de Usuario').next('select').select('Administrador');
    cy.get('input').eq(4).clear().type('1111'); //contraseña

    cy.get('button').contains('Actualizar').click(); //precionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@ingresarUsuario').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      INnombre: 'Usuario_Prueba',
      INRut: '111112223', 
      INtelefono: '912345678', 
      INRol: 'Administrador', 
      INpassword: '1111'
      });
    });

    cy.contains('Usuario añadido').should('be.visible');

  });
});
