describe('Actualizar Producto - Verificación de petición', () => {
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/up_producto/').as('actualizarProducto');

    cy.visit('http://localhost:3000/ActualizarProducto');

    cy.get('input').eq(0).type('11'); //codigo producto
    cy.get('input').eq(1).clear().type('Producto de prueba'); //nombre producto
    cy.get('input').eq(2).clear().type('9999'); //precio
    cy.get('input').eq(3).clear().type('50'); //stock
    cy.get('input').eq(4).clear().type('10'); //stock minimo

    cy.get('button').contains('Actualizar').click(); //precionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@actualizarProducto').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
      expect(intercept.request.body).to.include({
      inputCod: '11',
      inputNombre: 'Producto de prueba', 
      inputStock: '50', 
      inputPrecio: '9999', 
      inputStockmin: '10'
      });
    });

    cy.contains('Producto actualizado con éxito.').should('be.visible');

    cy.request('GET', '/api/products').then((resp) => {
      expect(resp.status).to.eq(200);
      const producto = resp.body.find(p => p.codigo === '11');
      expect(producto).to.include({
        nombre: 'Producto de prueba',
        precio: '9999',
        stock: '50',
        stockmin: '10'
      });
    });
  });
});
