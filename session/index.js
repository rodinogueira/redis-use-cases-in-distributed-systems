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

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    // Simulação de verificação de credenciais
    if (email === 'usuario@example.com' && password === 'senha123') {
        // Credenciais corretas, definir os dados da sessão
        req.session.clientId = 'abc123';
        req.session.myNum = 5;
        res.json('Você está logado agora');
    } else {
        // Credenciais incorretas
        res.status(401).json('Credenciais inválidas');
    }
});

app.get('/profile', (req, res) => {
    res.json(req.session);
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message });
});

app.listen(8080, () => console.log('Servidor está rodando na porta 8080'));
