const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 3000;

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware para manejar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Almacenar productos
let productos = [];

// Rutas
app.get('/', (req, res) => {
  res.render('home', { productos });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos });
});

// Configuración de WebSockets
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Emitir lista de productos
  socket.emit('productos', productos);

  // Escuchar eventos de agregar productos
  socket.on('nuevoProducto', (producto) => {
    productos.push(producto);
    io.emit('productos', productos); // Emitir lista actualizada
  });

  // Escuchar eventos de eliminar productos
  socket.on('eliminarProducto', (id) => {
    productos = productos.filter((producto) => producto.id !== id);
    io.emit('productos', productos); // Emitir lista actualizada
  });
});

// Servir archivos estáticos (opcional para recursos)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
