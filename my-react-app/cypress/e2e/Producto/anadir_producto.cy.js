describe('Ingresar producto nuevo- Verificación de petición', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/ingresar_productos/insertar').as('ingresarProductos');

    cy.visit('http://localhost:3000/IngresoProducto');

    cy.get('input').eq(0).clear().type('cortina azul'); //nombre
    cy.get('input').eq(1).clear().type('1120'); //codigo
    cy.get('input').eq(2).clear().type('10'); //stock
    cy.get('input').eq(3).clear().type('1000'); //precio
    cy.get('input').eq(4).clear().type('azul'); //color producto
    cy.get('input').eq(5).clear().type('cortina'); //tipo de producto
    cy.get('input').eq(6).clear().type('5'); //stock minimo
    cy.get('input[type="file"]').attachFile('imagenPrueba.jpg'); // imagen

    cy.get('button').contains('Añadir').click(); //presionar boton actualizar

    // Verifica que se haya enviado la petición
    cy.wait('@ingresarProductos').then((intercept) => {
        expect(intercept.response.statusCode).to.eq(200);
    });
    // Verificar mensaje de confirmación
    cy.contains('Producto añadido').should('be.visible');

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
      const producto = resp.body.find(p => p[0] === 1120);
      expect(producto, 'Producto con código 1111 debe existir').to.not.be.undefined;
      if (producto) {
        expect(producto[4]).to.eq('cortina azul'); // nombre
        expect(producto[3]).to.eq(1000); // precio
        expect(producto[1]).to.eq(10); // stock
        expect(producto[2]).to.eq(5); // stockmin        
      }
      });
    });
  });
});
