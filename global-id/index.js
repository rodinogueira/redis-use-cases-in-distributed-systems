const express = require('express');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const redis = require('redis');

const app = express();

const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
    // Outras opções, se necessário
});

// Definir o limite de requisições por segundo
const opts = {
    storeClient: redisClient,
    points: 10, // 10 requisições
    duration: 1, // por segundo
    keyPrefix: 'middleware', // prefixo chave global
};

const rateLimiter = new RateLimiterRedis(opts);

// Middleware para aplicar o rate limiting global
const rateLimitMiddleware = (req, res, next) => {
    const clientIp = req.ip;

    rateLimiter.consume(clientIp)
        .then(() => {
            console.log(`Acesso permitido para o IP: ${clientIp}`);
            next();
        })
        .catch((rejRes) => {
            const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
            console.log(`Acesso negado para o IP: ${clientIp}. Tente novamente em ${secs} segundo(s).`);
            res.status(429).send(`Muitas requisições. Por favor, tente novamente em ${secs} segundo(s).`);
        });
};

// Aplicar o middleware globalmente para todas as rotas
app.use(rateLimitMiddleware);

// Rotas do aplicativo
app.get('/api', (req, res) => {
    res.send('Rota principal da API');
});

// Iniciar o servidor
app.listen(8080, () => {
    console.log('Servidor está rodando na porta 8080');
});
