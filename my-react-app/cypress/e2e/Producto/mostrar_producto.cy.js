describe('Listado de Productos - Verificación de la tabla y datos del backend', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Debería cargar y mostrar la lista de productos obtenida del backend', () => {
    cy.intercept('GET', '/api/products').as('listadoProductos');

    //Visitar la página del listado de productos
    cy.visit('http://localhost:3000/ListadoProducto'); 

    //Esperar que la petición de obtener productos se complete.
    cy.wait('@listadoProductos').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.be.an('array').and.not.to.be.empty;
    });

    //Verificar que el título de la página "Listado de Productos" sea visible
    cy.contains('h1', 'Listado de Productos').should('be.visible'); 

    //Verificar que la tabla esté visible.
    cy.get('table.venta-table').should('be.visible');

    //Verificar los encabezados de la tabla
    cy.get('table.venta-table').within(() => {
        cy.get('th').eq(0).should('contain.text', 'FECHA');
        cy.get('th').eq(1).should('contain.text', 'CÓDIGO');
        cy.get('th').eq(2).should('contain.text', 'STOCK');
        cy.get('th').eq(3).should('contain.text', 'STOCK MÍNIMO');
        cy.get('th').eq(4).should('contain.text', 'PRECIO');
        cy.get('th').eq(5).should('contain.text', 'NOMBRE');
        cy.get('th').eq(6).should('contain.text', 'COLOR');
        cy.get('th').eq(7).should('contain.text', 'FOTO');
    });
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });
});