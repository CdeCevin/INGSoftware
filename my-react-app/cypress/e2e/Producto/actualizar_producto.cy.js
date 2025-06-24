describe('Actualizar Producto - Verificación de petición', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('PUT', '/api/up_producto/1000').as('actualizarProducto');

    cy.visit('http://localhost:3000/ActualizarProducto');

    cy.get('input').eq(0).type('1111'); //codigo producto
    cy.get('input').eq(1).clear().type('Cortina azul plus'); //nombre producto
    cy.get('input').eq(2).clear().type('2000'); //precio
    cy.get('input').eq(3).clear().type('50'); //stock
    cy.get('input').eq(4).clear().type('10'); //stock minimo
    cy.get('input[type="file"]').attachFile('imagenPrueba.jpg'); //imagen producto

    cy.get('button').contains('Actualizar').click(); //presionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@actualizarProducto').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      inputCod: '1111',
      inputNombre: 'Cortina azul plus', 
      inputStock: '50', 
      inputPrecio: '2000', 
      inputStockmin: '10'
      });
    });

    //Verificación mensaje de confirmación
    cy.contains('Producto actualizado.').should('be.visible');

    cy.request('GET', '/api/products').then((resp) => {
      expect(resp.status).to.eq(200);
      const producto = resp.body.find(p => p.codigo === '1111');
      expect(producto).to.include({
        nombre: 'Cortina azul plus',
        precio: '2000',
        stock: '50',
        stockmin: '10'
      });
    });
  });
});
