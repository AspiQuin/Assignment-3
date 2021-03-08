const express   = require('express');
const path      = require("path");
const app       = express();
const http      = require('http');
//const server    = require('http').createServer(app);  

const LISTEN_PORT = 8080;

// Set process name
process.title = "IMD3901-Assignment-Server";

app.use(express.static(__dirname + '/public')); //set root path of server ...

const webServer = http.createServer(app);
const io = require("socket.io")(webServer);

const rooms = {};

io.on("connection", socket => {
    console.log("user connected", socket.id);

    let curRoom = null;

    socket.on("joinRoom", data=>{
        const { room } = data;

        if (!rooms[room]) {
            rooms[room] = {
                name: room,
                occupants: {},
            };
        }

        const joinedTime = Date.now();
        rooms[room].occupants[socket.id] = joinedTime;
        curRoom = room;

        console.log('${socket.id} joined room ${room}');
        socket.join(room);

        socket.emit("connectSuccess", { joinedTime });
        const occupants = rooms[room].occupants;
        io.in(curRoom).emit("occupantsChanged", { occupants });
    });

    socket.on("send", data => {
        io.to(data.to).emit("send", data);
    });

    socket.on("broadcast", data => {
        socket.to(curRoom).broadcast.emit("broadcast", data);
    });

    socket.on("disconnect", () => {
        console.log('disconnected: ', socket.id, curRoom);
        if (rooms[curRoom]) {
            console.log("user disconnected", socket.id);
    
            delete rooms[curRoom].occupants[socket.id];
            const occupants = rooms[curRoom].occupants;
            socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });
    
            if (occupants == {}) {
                console.log("everybody left room");
                delete rooms[curRoom];
            }
        }
    });
});
webServer.listen(LISTEN_PORT, () => {
    console.log("listening on http://localhost:" + LISTEN_PORT);
});

console.log("Listening on port: " + LISTEN_PORT );

//this is call a "route" - basically a url path from your website for static pages
app.get( '/', function( req, res ){ 
    res.sendFile( __dirname + '/public/index.html' );
});
