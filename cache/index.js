const express = require('express');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');

const app = express();

const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
    // Outras opções, se necessário
});

redisClient.on('error', (err) => {
    console.error('Erro ao conectar ao Redis:', err);
});

app.use(express.json());

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'mySecret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
        sameSite: 'lax'
    }
}));

// Simulação de dados de usuário
const userData = {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    age: 30
};

// Rota para obter dados de usuário
app.get('/user', (req, res) => {
    // Verificar se os dados do usuário estão em cache no Redis
    redisClient.get('userData', (err, cachedData) => {
        if (err) {
            console.error('Erro ao obter dados do cache:', err);
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }

        if (cachedData) {
            // Se os dados estiverem em cache, retorná-los
            console.log('Dados do usuário obtidos do cache');
            res.json(JSON.parse(cachedData));
        } else {
            // Se os dados não estiverem em cache, buscar no banco de dados
            console.log('Dados do usuário buscados do banco de dados');
            // Supondo que os dados do usuário sejam buscados de um banco de dados aqui
            // Por enquanto, usaremos dados de exemplo
            const user = userData;
            // Salvar os dados em cache no Redis por 5 minutos (300 segundos)
            redisClient.setex('userData', 300, JSON.stringify(user));
            res.json(user);
        }
    });
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message });
});

app.listen(8080, () => console.log('Servidor está rodando na porta 8080'));
