import { connect, Channel, ConsumeMessage } from "amqplib";
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class Orden {
    id_orden: number;
    descripcion: string;
    total: number;

    constructor(id_orden: number, descripcion: string, total: number) {
        this.id_orden = id_orden;
        this.descripcion = descripcion;
        this.total = total;
    }
}

async function main() {
    const connection = await connect("amqp://admin:1234@18.213.95.105");
    const channel: Channel = await connection.createChannel();
    const queue: string = 'app.initial';
    await channel.assertQueue(queue, { durable: true });
    console.log('conectado')

    channel.consume(queue, async (message: ConsumeMessage | null) => {
        if (message !== null) {
            try {
                const payload = message.content.toString();
                console.log('Mensaje recibido:', payload);

            
                const orden: Orden = JSON.parse(payload);
                console.log('Orden object:', orden);

                const dataToSend = {
                    orden: orden.descripcion,
                    total: orden.total
                };
                console.log("datos a mandar");
                console.log(dataToSend);
            
                await axios.post("https://event-driven-payment.onrender.com/pagos/", dataToSend);
                console.log('Orden procesada');
            } catch (error) {
                console.error('Error procesando mensaje:', error);
            } finally {
                channel.ack(message); 
            }
        }
    });
}

main().catch(console.error);