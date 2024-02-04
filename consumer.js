const createConnection = require("./rabbitmqConnection");

const consumer = async (queueName) => {
  const connection = await createConnection();
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  await channel.consume(queueName, (msg) => {
    const data = JSON.parse(msg.content.toString());

    console.log("Rabbitmq dan okunan data ", data);

    channel.ack(msg);
  });
};

consumer("kuyruk-1")
