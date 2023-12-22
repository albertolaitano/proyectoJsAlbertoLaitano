let productos; 
function obtenerProductos() {
    return new Promise((resolve, reject) => {
        fetch('../JSON/productos.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al cargar la API, comunícate con tu administrador");
                }
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

async function main() {
    try {
        productos = await obtenerProductos();
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error en la app ", error);
    }
}

function crearCard(producto) {
    const card = document.createElement("div");
    card.classList.add("card");

    const imagen = document.createElement("img");
    imagen.classList.add("cardImagen");
    imagen.src = producto.imagen;
    imagen.alt = producto.alt;

    const nombre = document.createElement("h2");
    nombre.classList.add("cardNombre");
    nombre.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.classList.add("cardPrecio");
    precio.textContent = `$ ${producto.precio.toFixed(2)}`;

    const boton = document.createElement("button");
    boton.classList.add("cardBoton");
    boton.textContent = "Agregar al carrito";
    boton.addEventListener("click", () => agregarAlCarrito(producto));

    card.appendChild(imagen);
    card.appendChild(nombre);
    card.appendChild(precio);
    card.appendChild(boton);

    return card;
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("cardsContainer");
    contenedor.innerHTML = ""; 

    productos.map(producto => {
        const card = crearCard(producto);
        contenedor.appendChild(card);
    });
}

function filtrarProductos() {
    const textoBusqueda = document.getElementById("buscadorProducto").value.toLowerCase();
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(textoBusqueda)
    );
    mostrarProductos(productosFiltrados);
}

document.getElementById("buscadorProducto").addEventListener("input", filtrarProductos);

main();

let modalCarrito = document.getElementById('modalCarrito');
let btnCarrito = document.getElementById('btnCarrito');

document.addEventListener('DOMContentLoaded', function() {
    btnCarrito.addEventListener('click', function() {

        abrirCerrarModalCarrito();
        actualizarCarrito();
    });

    window.onclick = function(event) {
        if (event.target === modalCarrito) {
            modalCarrito.style.display = 'none';
        }
    };
});

function abrirCerrarModalCarrito() {
    const modal = document.getElementById('modalCarrito');

    if (modal) {
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        } else {
            modal.style.display = 'block';
        }
    }
}

function abrirModalCarrito() {
    const modal = document.getElementById('modalCarrito');
    if (modal) {
        modal.style.display = 'block';
    }
}

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarritoLocalStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);
    if (productoExistente) {
        productoExistente.cantidad += 1;     
    } else {
        let nuevoProducto = {
            id: producto.id,
            imagen: producto.imagen,
            nombre: producto.nombre,
            cantidad: 1,  
            precio: producto.precio
        };

        carrito.push(nuevoProducto);
    }
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Artículo añadido correctamente al carrito",
        showConfirmButton: false,
        timer: 1200
    });
    habilitarBoton();
    actualizarCarrito();
    guardarCarritoLocalStorage();
}

function actualizarCarrito() {
    let listaCarrito = document.getElementById('listaCarrito');
    let totalElemento = document.getElementById('valorTotal');

    listaCarrito.innerHTML = '';
 
    let valorTotal = 0;

    carrito.map(function(producto) {
        let nuevoElemento = document.createElement('li');

        let imagenProducto = document.createElement('img');
        imagenProducto.src = producto.imagen;
        imagenProducto.alt = producto.nombre;
        imagenProducto.classList.add("imagen-carrito");

        let btnEliminar = document.createElement('button');
        btnEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>';

        btnEliminar.addEventListener('click', function() {
            eliminarProducto(producto.id); 
        });
     
        nuevoElemento.appendChild(imagenProducto);
        
        let nombreProducto = document.createElement('h2');
        nombreProducto.textContent = producto.nombre;

        let cantidadProducto = document.createElement('input');
        cantidadProducto.type = 'number';
        cantidadProducto.value = producto.cantidad;
        cantidadProducto.textContent = producto.cantidad;
        cantidadProducto.classList.add("inputCantidad");
        
        let precioProducto = document.createElement('p');
        precioProducto.textContent = ' $ ' + producto.precio;

        let subTotalProducto = document.createElement('p');
        subTotalProducto.textContent = ' $ ' + producto.precio * producto.cantidad;
        
        nuevoElemento.appendChild(nombreProducto);
        nuevoElemento.appendChild(cantidadProducto);
        nuevoElemento.appendChild(precioProducto);
        nuevoElemento.appendChild(subTotalProducto);
        nuevoElemento.appendChild(btnEliminar);
        listaCarrito.appendChild(nuevoElemento);
        
        valorTotal += producto.precio * producto.cantidad;
    });

    totalElemento.textContent = valorTotal.toFixed(2);   
}

function eliminarProducto(id) {
    const productoExistente = carrito.find(producto => producto.id === id);
    if (productoExistente) {
        if (productoExistente.cantidad > 1) {
            productoExistente.cantidad -= 1;
        } else {
            carrito = carrito.filter(producto => producto.id !== id);
        }
    }
    actualizarCarrito();
    guardarCarritoLocalStorage();
}

function limpiarCarrito() {
    if (carrito.length > 0) {
        Swal.fire({
            title: "¿Deseas eliminar todos los artículos del carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, limpiar carrito!",
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                actualizarCarrito();
                localStorage.clear();
              Swal.fire({
                title: "Eliminado!",
                text: "Has eliminado todos los artículos del carrito.",
                icon: "success"
              });
              
              deshabilitarBoton();
            }
        });
    }
}

function habilitarBoton() {
    botonLimpiar.disabled = false;
    botonLimpiar.style.opacity = "1";
    botonLimpiar.style.cursor = "pointer";
}

function deshabilitarBoton() {
    if (carrito.length === 0) {
        botonLimpiar.disabled = true;
        botonLimpiar.style.opacity = "0.5"; 
        botonLimpiar.style.cursor = "not-allowed";
    }
}

botonLimpiar.addEventListener("click", function(){
    if (!botonLimpiar.disabled) {
        return limpiarCarrito();
    } 
})

botonFinalizarCompra.addEventListener("click", function(){
    if (carrito.length > 0) {
        Swal.fire({
            position: "center",
            icon: "success",
            html: '<img src="img/apu-deja-simpsons.webp" alt="Apu, gracias por su compras" style="width: 300px; height: auto;">',
            title: "Gracias por su compras, vuelva prontos!",
            showConfirmButton: false,
            timer: 3000
        });
    }
})


