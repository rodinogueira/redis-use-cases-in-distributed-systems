const redis = require('redis');

const client = redis.createClient();

client.on('connect', () => {
    console.log('Conectado ao Redis');
});

const channel = 'messageQueue';

// Função para lidar com as mensagens recebidas da fila
client.subscribe(channel);

client.on('message', (channel, message) => {
    console.log(`Nova mensagem recebida da fila: "${message}"`);
});

console.log('Aguardando mensagens...');
