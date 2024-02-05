const createConnection = require("./rabbitmqConnection");

const consumer = async (queueName) => {
  const { connection, channel } = await createConnection();

  if (!connection || !channel) {
    await createConnection();
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.prefetch(1);
  await channel.consume(queueName, async (msg) => {
    const data = JSON.parse(msg.content.toString());

    console.log("Rabbitmq dan okunan data ", data);

    await new Promise(() => setTimeout(() => channel.ack(msg), 2000));
  });
};

consumer("kuyruk-1");
