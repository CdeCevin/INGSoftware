//modificar, debido a que no lo puedo modificar sin ser admin, ni siquiera pude entrar bien

describe('Ingresar producto nuevo- Verificación de petición', () => {
  beforeEach(() => {
    cy.loginApi();
  })
  it('Envía la petición correctamente al backend', () => {

    cy.intercept('POST', '/api/ingresar_productos/insertar').as('ingresarProductos');

    cy.visit('http://localhost:3000/IngresoProducto');

    cy.get('input').eq(0).clear().type('cortina azul'); //nombre
    cy.get('input').eq(1).clear().type('1111'); //codigo
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

  });
});
