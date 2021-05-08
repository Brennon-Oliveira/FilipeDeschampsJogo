import express from 'express';
import http from 'http';

const PORT = 3000;
const app = express();
const server = http.createServer(app);

app.use(express.static('public'));

server.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
})