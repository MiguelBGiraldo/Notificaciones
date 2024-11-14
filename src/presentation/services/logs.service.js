
const envs = require('../../config/envs');
const amqp = require('amqplib');


const saveLog = async (logData) => {

    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = process.env.LOGS_QUEUE;

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(logData)), { persistent: true });

        console.log("Log enviado a la cola de RabbitMQ");
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error al enviar log a RabbitMQ:", error);
    }
};

module.exports = saveLog;