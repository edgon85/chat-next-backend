const { comprobarJWT } = require("../helpers/jwt");
const {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
  getUsuarios,
} = require("../controllers/sockets");

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", async (socket) => {
      console.log("Cliente conectado");

      const token = socket.handshake.query["x-token"];

      //Validar JWT
      const [valido, uid] = comprobarJWT(token);

      if (!valido) {
        console.log("Socket no identificado");
        // Si el token no es valido, desconectar
        return socket.disconnect();
      }

      await usuarioConectado(uid);

      //unir al usuario a una sala de socket.io
      socket.join(uid);

      // TODO: Saber que usuario esta activo

      // TODO: Emitir todos los usuarios conectados
      this.io.emit("lista-usuarios", await getUsuarios());

      // TODO: Socket join, uid

      //escuchar cuando el cliente manda un mensaje
      //Mensaje personal
      socket.on("mensaje-personal", async (payload) => {
        const message = await grabarMensaje(payload);
        this.io.to(payload.from).emit("mensaje-personal", message);
        this.io.to(payload.to).emit("mensaje-personal", message); // hacer que no pase al servidor
      });

      // TODO: Disconnect
      // marcar en la base de datos que el usuario se desconecto

      // TODO: Emitir todos los usuarios conectados
      socket.on("disconnect", async () => {
        usuarioDesconectado(uid);
        this.io.emit("lista-usuarios", await getUsuarios());
      });
    });
  }
}

module.exports = Sockets;
