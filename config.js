import amqp from "amqplib";

// Define configuration options
const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME;
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;
const RABBITMQ_VHOST = process.env.RABBITMQ_VHOST;

// Define connection URL
const RABBITMQ_URL = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/${RABBITMQ_VHOST}`;

class RabbitMQConfig {
  constructor() {
    this.channel = null;
  }

  // Establishes a connection
  async connect() {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      this.channel = await conn.createChannel();
      console.log(`✅  Connected to RabbitMQ server at ${RABBITMQ_URL}`);
    } catch (error) {
      console.log(`❌  Failed to connect to RabbitMQ server at ${RABBITMQ_URL}: ${error}`);
      throw error;
    }
  }

  // Creates a queue with the specified name and options
  async createQueue(queueName, options) {
    if (!this.channel) {
      return this.connect();
    }
    await this.channel.assertQueue(queueName, options);
  }

  // Publishes a message to the specified queue
  async publishToQueue(queueName, message) {
    if (!this.channel) {
      return this.connect();
    }
    await this.channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`✅  Send Message to ${queueName} in ${RABBITMQ_VHOST}`);
  }

  // Subscribes to messages from the specified queue and invokes the callback
  async subscribeToQueue(queueName, callback, options) {
    if (!this.channel) {
      return this.connect();
    }
    await this.channel.consume(
      queueName,
      (msg) => {
        const message = msg.content.toString();
        callback(message);
        this.channel.ack(msg);
      },
      options
    );
  }

  // Closes the channel
  async close() {
    await this.channel.close();
  }
}

export default RabbitMQConfig;
