const amqp = require('amqplib');
const CheckService = require('../presentation/services/check.service');

async function consumeLogs(dataSource) {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = process.env.LOGS_QUEUE;

        await channel.assertQueue(queue, { durable: true });
        console.log("Esperando logs en la cola...");

        let checkService = new CheckService(dataSource, () => console.log("El log se guardo"), () => console.log("Hubo un error en el log"))

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const log = JSON.parse(msg.content.toString());
                // Guarda el log en la base de datos
                await checkService.execute(log);
                console.log("Log recibido y guardado en la base de datos:", log);

                channel.ack(msg); // Confirmar que el mensaje fue procesado
            }
        });
    } catch (error) {
        console.error("Error al consumir logs de RabbitMQ:", error);
    }
}

module.exports = consumeLogs;