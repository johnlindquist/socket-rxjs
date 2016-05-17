const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const {Observable} = require('rxjs');

console.log(path.join(__dirname + '/index.html'));
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, './index.html')));

const connect$ = Observable.fromEventPattern(
    h => io.on('connection', h),
    ()=> console.log('done')
).share();

const chatMessage$ = connect$
    .switchMap(socket =>         
        Observable.fromEventPattern(h => 
            socket.on('chat message', h),
            ()=> console.log('done')
    )
);


chatMessage$.subscribe(v => console.log(v));


http.listen(3000, ()=> console.log('listening on *:3000'));