const amqplib = require("amqplib");

async function createConnection() {
  try {
    const connectionString = "amqp://kadimteknoloji:123456@localhost:5672/test";
    const connection = await amqplib.connect(connectionString);
    return connection;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

module.exports = createConnection;


// not diğer videoda her istekte bağlantı açma sorunu çöz bağlantı varsa üzerinden devam et