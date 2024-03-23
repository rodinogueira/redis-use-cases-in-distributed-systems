const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 3000;

// Criando um cliente Redis
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost'
});

// Middleware para análise do corpo da solicitação JSON
app.use(express.json());

// Endpoint para adicionar um item ao carrinho
app.post('/cart/add', (req, res) => {
    const { userId, itemId, quantity } = req.body;

    // Adicionando o item ao carrinho do usuário no Redis (usando um hash)
    redisClient.hset(`cart:${userId}`, itemId, quantity, (err, reply) => {
        if (err) {
            console.error('Erro ao adicionar item ao carrinho:', err);
            res.status(500).send('Erro ao adicionar item ao carrinho');
        } else {
            res.status(200).send('Item adicionado ao carrinho com sucesso');
        }
    });
});

// Endpoint para visualizar o carrinho de um usuário
app.get('/cart/:userId', (req, res) => {
    const userId = req.params.userId;

    // Obtendo todos os itens no carrinho do usuário do Redis
    redisClient.hgetall(`cart:${userId}`, (err, cartItems) => {
        if (err) {
            console.error('Erro ao recuperar itens do carrinho:', err);
            res.status(500).send('Erro ao recuperar itens do carrinho');
        } else {
            res.status(200).json(cartItems || {});
        }
    });
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
