describe('Actualizar Producto - Verificación de petición', () => {
  beforeEach(() => {
    cy.loginApi();
  });
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('PUT', '/api/up_producto/1121').as('actualizarProducto');

    cy.visit('http://localhost:3000/ActualizarProducto');

    cy.get('input').eq(0).type('1121'); //codigo producto
    cy.get('input').eq(1).clear().type('Cortina azul plus'); //nombre producto
    cy.get('input').eq(2).clear().type('2000'); //precio
    cy.get('input').eq(3).clear().type('50'); //stock
    cy.get('input').eq(4).clear().type('10'); //stock minimo
    cy.get('input[type="file"]').attachFile('imagenPrueba.jpg'); //imagen producto

    cy.get('button').contains('Actualizar').click(); //presionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@actualizarProducto').then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
    });

    //Verificación mensaje de confirmación
    cy.contains('Producto actualizado').should('be.visible');
    
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');

      cy.request({
        method: 'GET',
        url: '/api/products',
        headers: {
        Authorization: `Bearer ${token}`
        }
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        console.log('Respuesta del backend:', resp.body);
        const producto = resp.body.find(p => p[0] === 1121);
        expect(producto, 'Producto con código 1121 debe existir').to.not.be.undefined;

        if (producto) {
          expect(producto[4]).to.eq('Cortina azul plus'); // nombre
          expect(producto[3]).to.eq(2000); // precio
          expect(producto[1]).to.eq(50); // stock
          expect(producto[2]).to.eq(10); // stockmin
        }
      });
    });
  });
});
