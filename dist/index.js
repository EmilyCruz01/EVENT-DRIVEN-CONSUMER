"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const axios_1 = __importDefault(require("axios"));
// Definir la clase Pago
class Pago {
    constructor(idPago, cantidad, concepto) {
        this.idPago = idPago;
        this.cantidad = cantidad;
        this.concepto = concepto;
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, amqplib_1.connect)('amqp://admin:zoe10208@34.198.106.93');
        const channel = yield connection.createChannel();
        const queue = 'up.practica';
        yield channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (message) => __awaiter(this, void 0, void 0, function* () {
            if (message !== null) {
                try {
                    const payload = message.content.toString();
                    console.log('Message received:', payload);
                    const pago = JSON.parse(payload);
                    console.log('Pago object:', pago);
                    const dataToSend = {
                        idFactura: pago.idPago,
                        pagoid: pago.cantidad
                    };
                    console.log("datos a mandar");
                    console.log(dataToSend);
                    yield axios_1.default.post('https://service-payment-8hs5.onrender.com/facturas', dataToSend);
                    console.log('Payment processed');
                }
                catch (error) {
                    console.error('Error processing message:', error);
                }
                finally {
                    channel.ack(message);
                }
            }
        }));
    });
}
main().catch(console.error);
