from pydantic import BaseModel

# Modelo de datos para el producto
class Producto(BaseModel):
    codigo: int
    nombre: str
    stock: int
    precio: float

# Repositorio para manejar el acceso a datos
class ProductRepository:
    def __init__(self):
        self.productos = []  # Simula una base de datos en memoria

    def delete_product(self, codigo: int):
        self.productos = [p for p in self.productos if p.codigo != codigo]

    def insert_product(self, producto: Producto):
        self.productos.append(producto)

# Servicio para manejar la lógica de negocio
class ProductService:
    def __init__(self, repository: ProductRepository):
        self.repository = repository

    def eliminar_producto(self, codigo: int):
        if not isinstance(codigo, int):
            raise ValueError("El código debe ser un número.")
        self.repository.delete_product(codigo)

    def ingresar_producto(self, producto: Producto):
        if producto.stock < 0 or producto.precio <= 0:
            raise ValueError("Valores de stock o precio no válidos.")
        self.repository.insert_product(producto)

# Controlador para manejar las solicitudes
class ProductController:
    def __init__(self, service: ProductService):
        self.service = service

    def eliminar_producto(self, codigo: int):
        try:
            self.service.eliminar_producto(codigo)
            return {"message": "Producto eliminado correctamente"}
        except Exception as e:
            return {"error": str(e)}

    def ingresar_producto(self, producto_data: dict):
        try:
            producto = Producto(**producto_data)
            self.service.ingresar_producto(producto)
            return {"message": "Producto ingresado correctamente"}
        except Exception as e:
            return {"error": str(e)}

# Ejemplo de uso
if __name__ == "__main__":
    # Instanciar las dependencias
    repository = ProductRepository()
    service = ProductService(repository)
    controller = ProductController(service)

    # Ingresar un producto
    producto_data = {
        "codigo": 1,
        "nombre": "Camiseta",
        "stock": 10,
        "precio": 19.99
    }
    print(controller.ingresar_producto(producto_data))

    # Eliminar el producto
    print(controller.eliminar_producto(1))