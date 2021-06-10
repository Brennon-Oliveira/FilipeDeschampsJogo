import express from 'express';
import http from 'http';
import createGame from './public/game.js';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static('public'));

const game = createGame();
// game.start();

game.subscribe(command=>{
    sockets.emit(command.type, command);
})

sockets.on('connection', socket => {
    const playerId = socket.id;

    game.addPlayer({ playerId })

    socket.emit('setup', game.state);

    socket.on('disconnect', ()=>{

        game.removePlayer({playerId})
    })

    socket.on('move-player', (command)=>{
        command.type = 'move-player';
        command.playerId = playerId;

        game.movePlayer(command);
    })
})

server.listen(PORT, ()=>{
    console.log(`Server is running at http://192.168.0.107:${PORT}`);
})
