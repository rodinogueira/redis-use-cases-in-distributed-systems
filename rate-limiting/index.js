const express = require('express');
const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const app = express();
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
});

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rate_limit',
    points: 5, // Quantidade de pontos que o usuário recebe por período
    duration: 60, // Período de tempo em segundos
});

app.get('/api', async (req, res) => {
    try {
        await rateLimiter.consume(req.ip); // Limita a taxa de requisições com base no IP do usuário
        res.send('Requisição aceita');
    } catch (err) {
        res.status(429).send('Muitas requisições');
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
