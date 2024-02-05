const express = require("express");
const app = express();
const createConnection = require("./rabbitmqConnection");

require("./consumer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sendMessage = async (queueName, message) => {
  const { connection, channel } = await createConnection();

  if (!connection || !channel) {
    await createConnection();
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

  for (let index = 0; index < 10000; index++) {
    const data = {
      queue,
      message: `Message ${index + 1}`,
      date: new Date(),
    };

    await sendMessage(queue, JSON.stringify(data));
  }

  res.status(200).json({ success: true });
});

const port = 3005;

app.listen(port, () => console.log(`server started ${port}`));
