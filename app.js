const express = require("express");
const app = express();
const createConnection = require("./rabbitmqConnection");

require("./consumer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sendMessage = async (queueName, message) => {
  const connection = await createConnection();
  const channel = await connection.createChannel();

  if (!connection) {
    res.status(500).json({ error: "RabbitMQ Sunucusuna Bağlanamıyor !!!" });
  }

  await channel.assertQueue(queueName, { durable: true });

  try {
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
  } catch (error) {
    console.log("Mesaj gönderilirken hata çıktı ", error);
    throw error;
  }

  console.log("Mesaj Gönderildi ", message);

  return true;
};

app.post("/api/send-message", async (req, res) => {
  const { queue, message } = req.body;

  const data = {
    queue,
    message,
    date: new Date(),
  };

  await sendMessage(queue, JSON.stringify(data));

  res.status(200).json({ data });
});

const port = 3005;

app.listen(port, () => console.log(`server started ${port}`));
