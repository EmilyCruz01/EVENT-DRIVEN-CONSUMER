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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Orden {
    constructor(id_orden, descripcion, total) {
        this.id_orden = id_orden;
        this.descripcion = descripcion;
        this.total = total;
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, amqplib_1.connect)("amqp://admin:1234@18.213.95.105:5672/");
        const channel = yield connection.createChannel();
        const queue = 'orders_exchange';
        yield channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (message) => __awaiter(this, void 0, void 0, function* () {
            if (message !== null) {
                try {
                    const payload = message.content.toString();
                    console.log('Mensaje recibido:', payload);
                    const orden = JSON.parse(payload);
                    console.log('Orden object:', orden);
                    const dataToSend = {
                        orden: orden.descripcion,
                        total: orden.total
                    };
                    console.log("datos a mandar");
                    console.log(dataToSend);
                    yield axios_1.default.post('https://event-driven-payment.onrender.com/pagos', dataToSend);
                    console.log('Pago procesado');
                }
                catch (error) {
                    console.error('Error procesando mensage:', error);
                }
                finally {
                    channel.ack(message);
                }
            }
        }));
    });
}
main().catch(console.error);
