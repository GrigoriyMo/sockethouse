const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

var bodyParser = require('body-parser');
var app = express();
const server = createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});


//Событие подключение к сокету 
io.on('connection', (socket) => {
    console.log('-------------------------------')
    console.log('Подключение к удаленному дому установлено');
    console.log(new Date())
    console.log('-------------------------------')
    
    //Событие отключения 
    socket.on('disconnect', () => {
        console.log('-------------------------------')
        console.log('Отключение от удаленного дома');
        console.log(new Date())
        console.log('-------------------------------')
    });

});

app.post('/color/set', (req, res) => {

    //ex: #eae322
    if (req.body.backgroundColor && req.body.floor) {
        io.emit('set color', { floor: req.body.floor, backgroundColor: req.body.backgroundColor });
        console.log('-------------------------------')
        console.log('Запрос на включение света, этаж № ' + req.body.floor)
        console.log(new Date())
        console.log('-------------------------------')
        res.status(200).send();
    } else {
        res.status(400).send();
    }

})


server.listen(3000, () => {
    console.log('started at ' + new Date());
    console.log('server running at http://localhost:3000');
});