const express = require('express');
const app = express();
const chalk = require('chalk');
const cors = require('cors');

app.use(cors());
const options = {
  cors: {
    origin: 'http://localhost:4200',
  },
};

const server = require('http').Server(app)
const io = require('socket.io')(server, options);



app.get('/', function (req, res) {
    res.send('Hello World!');
  });

io.on('connection', socket =>{

    const idHandShake = socket.id;

    const { namePage } = socket.handshake.query;

    console.log(`${chalk.green(`Nou dispositiu: ${idHandShake}`)} connectant a la ${namePage}`);
    socket.join(namePage)

    socket.on('evento', (res) => {
        // Emet el missatge a tots els membres de les sales menys a la persona que envia el missatge  
        console.log(res);
        socket.to(namePage).emit('evento', res);
    
      })
   
    socket.on('disconnect', function () {
        console.log('user disconnected');
      });
});

server.listen(5000, () => {
    console.log(`>> Socket llest i escoltant pel port: ${chalk.green('5000')}`)
})