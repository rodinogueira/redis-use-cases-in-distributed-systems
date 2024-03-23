const redis = require('redis');
const { promisify } = require('util');

// Criar um cliente Redis
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
    // Outras opções, se necessário
});

// Promisify Redis commands para usar async/await
const incrAsync = promisify(redisClient.incr).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Função para incrementar o contador
async function incrementCounter(counterKey) {
    return await incrAsync(counterKey);
}

// Função para obter o valor atual do contador
async function getCounterValue(counterKey) {
    return await getAsync(counterKey);
}

// Exemplo de uso
async function main() {
    const counterKey = 'myCounter';

    // Incrementar o contador algumas vezes
    await incrementCounter(counterKey);
    await incrementCounter(counterKey);
    await incrementCounter(counterKey);

    // Obter e exibir o valor atual do contador
    const counterValue = await getCounterValue(counterKey);
    console.log('Valor atual do contador:', counterValue);
}

main();
