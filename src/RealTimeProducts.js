import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // URL del backend

const RealTimeProducts = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    // Conectar con el backend
    socket.on('productos', (productosActualizados) => {
      setProductos(productosActualizados);
    });

    return () => socket.off(); // Desconectar al desmontar
  }, []);

  const agregarProducto = (e) => {
    e.preventDefault();
    socket.emit('nuevoProducto', { id: Date.now(), nombre, precio });
    setNombre('');
    setPrecio('');
  };

  return (
    <div>
      <h1>Productos en Tiempo Real</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>{producto.nombre} - {producto.precio}</li>
        ))}
      </ul>
      <form onSubmit={agregarProducto}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del producto"
          required
        />
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
          required
        />
        <button type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default RealTimeProducts;
