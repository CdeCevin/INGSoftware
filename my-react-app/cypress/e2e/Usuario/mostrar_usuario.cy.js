//No se puede entrar sin ser admin
describe('Listado de Usuarios - Verificación de la tabla', () => {
  it('Debería mostrar la lista de usuarios con los datos correctos', () => {
    cy.intercept('GET', '/api/userList').as('listaUsuarios');
    
    cy.visit('http://localhost:3000/ListadoUsuarios');

    cy.wait('@listaUsuarios').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 304]);
      
      if (interception.response.statusCode === 200){
        expect(interception.response.body).to.be.an('array').and.not.to.be.empty;

        expect(interception.response.body[0]).to.have.property('RUT', '213233963');
        expect(interception.response.body[0]).to.have.property('Nombre', 'Kevin Olivares');}
    });

    //Verificar que el título de la página o sección sea visible
    cy.contains('h1', 'Listado de Usuarios').should('be.visible'); 

    //Verificar que la tabla esté visible
    cy.get('table.venta-table').should('be.visible');

    //Verificar los encabezados de la tabla
    cy.get('table.venta-table').within(() => {
      cy.get('th').eq(0).should('contain.text', 'RUT');
      cy.get('th').eq(1).should('contain.text', 'TÉLEFONO'); //MODIFICAAAAAAAAR//
      cy.get('th').eq(2).should('contain.text', 'NOMBRE');
      cy.get('th').eq(3).should('contain.text', 'TIPO DE USUARIO');
    });

    cy.get('table.venta-table tbody tr') // Selecciona todas las filas de datos
      .should('have.length.at.least', 1) // Asegura que haya al menos una fila de datos
      .first() // Toma la primera fila para la verificación
      .within(() => {
        cy.get('td').eq(0).should('contain.text', '213233963'); // RUT
        cy.get('td').eq(1).should('contain.text', '12121212'); // TELÉFONO
        cy.get('td').eq(2).should('contain.text', 'Kevin Olivares'); // NOMBRE
        cy.get('td').eq(3).should('contain.text', 'Administrador'); // TIPO DE USUARIO
    });
  });
});