//pude entrar y modificar sin ser admin --- avisar

describe('Actualizar Cliente - Verificación de petición', () => {
  it('Envía la petición correctamente al backend', () => {
    cy.intercept('POST', '/api/upEmpresa').as('actualizarEmpresa');

    cy.visit('http://localhost:3000/ActualizarDatos');

    cy.get('input').eq(0).clear().type('Outlet_a_tu_Hogar'); //Nombre Cliente
    cy.get('input').eq(1).clear().type('987654321'); //numero telefonico

    cy.contains('label', 'Región').next('select').select('Maule');
    cy.contains('label', 'Comuna').next('select').select('Talca');

    cy.get('input').eq(2).clear().type('Calle Falsa 321'); //Calle
    cy.get('input').eq(3).clear().type('1321'); //numero de casa

    cy.get('button').contains('Actualizar').click(); //precionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@actualizarEmpresa').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      INnombre: 'Outlet_a_tu_Hogar',
      INtelefono: '987654321',
      INregion: 'Maule', 
      INciudad: 'Talca', 
      INcalle: 'Calle Falsa 321',
      INnumero: '1321'
      });
    });
    cy.contains('Datos actualizado').should('be.visible');
  });
});