const express = require('express');
const redis = require('redis');

const app = express();
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
    // Outras opções, se necessário
});

app.use(express.json()); // Middleware para analisar o corpo da solicitação JSON

app.post('/login', (req, res) => {
    let { userId, date } = req.body;
    if (userId === undefined) {
        userId = 1; // Definindo um valor padrão para userId
    }
    
    // Convertendo a data para um número inteiro que representa o offset do bit
    const timestamp = new Date(date).getTime();

    // Definindo o bit correspondente à data para o usuário no bitmap
    redisClient.setbit(`user:${userId}:logins`, timestamp, 1, (err, reply) => {
        if (err) {
            console.error('Erro ao registrar login do usuário:', err);
            res.status(500).send('Erro ao registrar login do usuário');
        } else {
            console.log('Bit definido com sucesso:', reply); // Adicionar este log para verificar se o bit foi definido corretamente
            res.status(200).send('Login do usuário registrado com sucesso');
        }
    });
});


app.listen(3000, () => {
    console.log('Servidor está rodando em http://localhost:3000');
});
