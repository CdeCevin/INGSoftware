describe('Actualizar Cliente - Verificación de petición', () => {
  it('Envía la petición correctamente al backend', () => {
    cy.intercept('POST', 'http://localhost:3001/api/upCliente').as('actualizarCliente');

    cy.visit('http://localhost:3000/ActualizarCliente');

    cy.get('input').eq(0).type('0'); // Codigo cliente

    cy.get('input').eq(1).clear().type('Cliente_A'); //Nombre Cliente
    cy.get('input').eq(2).clear().type('987654321'); //numero telefonico

    cy.contains('label', 'Región').next('select').select('Maule');
    cy.contains('label', 'Comuna').next('select').select('Talca');

    cy.get('input').eq(3).clear().type('Calle Falsa 123'); //Calle
    cy.get('input').eq(4).clear().type('1231'); //numero de casa

    cy.get('button').contains('Actualizar').click(); //precionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@actualizarCliente').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      cod: '0', 
      INnombre: 'Cliente_A', 
      INtelefono: '987654321', 
      INregion: 'Maule',
      INciudad: 'Talca', 
      INcalle: 'Calle Falsa 123',
      INnumero: '1231'
      });
    });
    cy.contains('Cliente actualizado').should('be.visible');
  });
});