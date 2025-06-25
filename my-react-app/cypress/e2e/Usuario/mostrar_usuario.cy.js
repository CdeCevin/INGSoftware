describe('Listado de Usuarios - Verificación de la tabla', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Debería mostrar la lista de usuarios con los datos correctos', () => {
    cy.intercept('GET', '/api/userList').as('listaUsuarios');
    
    cy.visit('http://localhost:3000/ListadoUsuarios');

    cy.wait('@listaUsuarios').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 304]);
      
      if (interception.response.statusCode === 200){
        expect(interception.response.body).to.be.an('array').and.not.to.be.empty;

        const usuario = usuarios.find(u => u.RUT === 210176653);
        expect(usuario, 'Usuario con RUT 210176653 debe existir').to.not.be.undefined;

        if (usuario) {
          expect(usuario.Nombre).to.eq('Juan Lopez');
        }
      } 
    });

    //Verificar que el título de la página o sección sea visible
    cy.contains('h1', 'Listado de Usuarios').should('be.visible'); 

    //Verificar que la tabla esté visible
    cy.get('table.venta-table').should('be.visible');

    //Verificar los encabezados de la tabla
    cy.get('table.venta-table').within(() => {
      cy.get('th').eq(0).should('contain.text', 'RUT');
      cy.get('th').eq(1).should('contain.text', 'TELÉFONO');
      cy.get('th').eq(2).should('contain.text', 'NOMBRE');
      cy.get('th').eq(3).should('contain.text', 'TIPO DE USUARIO');
    });

    cy.get('table.venta-table tbody tr').should('have.length.at.least', 1);

    cy.get('table.venta-table tbody tr').each(($row) => {
      const text = $row.text();

      if (text.includes('210176653') && text.includes('Juan Lopez')) {
        // Verifica dentro de esa fila los datos específicos
        cy.wrap($row).within(() => {
          cy.get('td').eq(0).should('contain.text', 210176653); // RUT
          cy.get('td').eq(1).should('contain.text', 912345678); // TELÉFONO
          cy.get('td').eq(2).should('contain.text', 'Juan Lopez'); // NOMBRE
          cy.get('td').eq(3).should('contain.text', 'Administrador'); // TIPO DE USUARIO
        });
      }
    });
  });
});