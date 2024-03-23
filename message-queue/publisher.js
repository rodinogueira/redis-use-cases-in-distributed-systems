const redis = require('redis');

const client = redis.createClient();

client.on('connect', () => {
    console.log('Conectado ao Redis');
});

const channel = 'messageQueue';

// Função para publicar uma mensagem na fila
function publishMessage(message) {
    client.publish(channel, message, (err) => {
        if (err) {
            console.error('Erro ao publicar mensagem:', err);
        } else {
            console.log(`Mensagem publicada na fila: "${message}"`);
        }
    });
}

// Simulação de publicação de mensagens
setInterval(() => {
    const message = `Mensagem de teste em ${new Date().toLocaleTimeString()}`;
    publishMessage(message);
}, 2000);
