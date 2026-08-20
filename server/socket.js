const { Server } = require('socket.io');

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*', 
    },
  });

  io.on('connection', (socket) => {
    console.log(`socket connected: ${socket.id}`);


    socket.on('joinProduct', (productId) => {
      socket.join(`product:${productId}`);
    });

    socket.on('leaveProduct', (productId) => {
      socket.leave(`product:${productId}`);
    });

    socket.on('disconnect', () => {
      console.log(`socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io belum di-init. Panggil initSocket(httpServer) dulu di app.js');
  }
  return io;
}

module.exports = { initSocket, getIO };
