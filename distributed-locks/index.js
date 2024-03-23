const redis = require('redis');
const { promisify } = require('util');

// Criar um cliente Redis
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
    // Outras opções, se necessário
});

// Promisify Redis commands para usar async/await
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Função para adquirir um lock
async function acquireLock(lockKey, expireTimeInSeconds) {
    const currentTime = Date.now();
    const expireTime = currentTime + (expireTimeInSeconds * 1000); // Converter para milissegundos

    // Tentar adquirir o lock
    const result = await setnxAsync(lockKey, expireTime);

    if (result === 1) {
        // O lock foi adquirido com sucesso
        return true;
    } else {
        // O lock já está sendo usado por outra instância
        return false;
    }
}

// Função para liberar um lock
async function releaseLock(lockKey) {
    await delAsync(lockKey);
}

// Exemplo de uso
async function main() {
    const lockKey = 'myLock';
    const expireTimeInSeconds = 60; // Tempo de expiração do lock em segundos

    // Tentar adquirir o lock
    const lockAcquired = await acquireLock(lockKey, expireTimeInSeconds);

    if (lockAcquired) {
        try {
            // O lock foi adquirido com sucesso, executar a tarefa protegida pelo lock
            console.log('Lock adquirido, executando a tarefa...');
            // Simular uma tarefa demorada
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log('Tarefa concluída!');
        } finally {
            // Após a conclusão da tarefa, liberar o lock
            await releaseLock(lockKey);
            console.log('Lock liberado');
        }
    } else {
        // Não foi possível adquirir o lock, outra instância já está executando a tarefa
        console.log('Não foi possível adquirir o lock, outra instância já está executando a tarefa');
    }
}

main();
