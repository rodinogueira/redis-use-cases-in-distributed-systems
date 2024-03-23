const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Digite "publisher" para iniciar o publisher ou "subscriber" para iniciar o subscriber: ', (answer) => {
    if (answer === 'publisher') {
        startPublisher();
    } else if (answer === 'subscriber') {
        startSubscriber();
    } else {
        console.log('Entrada inválida. Digite "publisher" ou "subscriber".');
        rl.close();
    }
});

function startPublisher() {
    const publisherProcess = spawn('node', ['publisher.js']);
    
    publisherProcess.stdout.on('data', (data) => {
        console.log(`[Publisher] ${data}`);
    });

    publisherProcess.stderr.on('data', (data) => {
        console.error(`[Publisher error] ${data}`);
    });

    publisherProcess.on('close', (code) => {
        console.log(`[Publisher] Processo encerrado com código ${code}`);
    });
}

function startSubscriber() {
    const subscriberProcess = spawn('node', ['subscriber.js']);
    
    subscriberProcess.stdout.on('data', (data) => {
        console.log(`[Subscriber] ${data}`);
    });

    subscriberProcess.stderr.on('data', (data) => {
        console.error(`[Subscriber error] ${data}`);
    });

    subscriberProcess.on('close', (code) => {
        console.log(`[Subscriber] Processo encerrado com código ${code}`);
    });
}
