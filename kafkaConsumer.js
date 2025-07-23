import { consumer } from "./config/kafkaClient.js";
export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📩 Order Received [Kafka]: ${message.value.toString()}`);
    },
  });
};