const redis = require('redis');

// Criar cliente Redis
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
    // Outras opções, se necessário
});

// Manipular erros de conexão Redis
redisClient.on('error', (err) => {
    console.error('Erro ao conectar ao Redis:', err);
});

// Adicionar pontuação de jogadores na leaderboard
function addScoreToLeaderboard(player, score) {
    redisClient.zadd('leaderboard', score, player, (err, reply) => {
        if (err) {
            console.error('Erro ao adicionar pontuação à leaderboard:', err);
        } else {
            console.log(`Pontuação de ${player} adicionada à leaderboard com sucesso`);
        }
    });
}

// Obter classificação de um jogador na leaderboard
function getPlayerRank(player) {
    redisClient.zrevrank('leaderboard', player, (err, rank) => {
        if (err) {
            console.error('Erro ao obter classificação do jogador:', err);
        } else {
            console.log(`${player} está classificado em ${rank + 1}`);
        }
    });
}

// Obter top N jogadores da leaderboard
function getTopPlayers(count) {
    redisClient.zrevrange('leaderboard', 0, count - 1, 'WITHSCORES', (err, players) => {
        if (err) {
            console.error('Erro ao obter os melhores jogadores:', err);
        } else {
            console.log(`Os ${count} melhores jogadores:`);
            for (let i = 0; i < players.length; i += 2) {
                console.log(`${i / 2 + 1}. ${players[i]} - Pontuação: ${players[i + 1]}`);
            }
        }
    });
}

// Exemplo de uso
addScoreToLeaderboard('Player1', 100);
addScoreToLeaderboard('Player2', 150);
addScoreToLeaderboard('Player3', 200);

getPlayerRank('Player2');
getTopPlayers(3);
