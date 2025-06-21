describe('Actualizar producto - producto no encontrado', () => {
  it('muestra un error si el código no existe', () => {
    cy.intercept('POST', '/api/up_producto/', {
      statusCode: 404,
      body: { mensaje: 'Producto no encontrado' }
    }).as('productoInexistente');

    cy.visit('http://localhost:3000/ActualizarProducto');

    // Ingresar un código inexistente
    cy.get('input').eq(0).type('9999');
    cy.get('input').eq(1).clear().type('Cualquiera');
    cy.get('input').eq(2).clear().type('1000');
    cy.get('input').eq(3).clear().type('10');
    cy.get('input').eq(4).clear().type('2');

    // Hacer clic en "Actualizar"
    cy.get('button').contains('Actualizar').click()

    cy.contains('Producto no encontrado.').should('be.visible');
  });
});

