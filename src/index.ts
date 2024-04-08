// const express = require('express');
import express from 'express'
import cors from 'cors';
import router from './routes/user.routes';
import '../src/db/connect'
import { errorHandler, notFound } from './middleware/ErrorHanlders';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
const { Server } = require('socket.io');

import path from 'path';
import env from './lib/env';







const app = express();

app.use(cors());


app.use(express.json())


// app.use(notFound);
// app.use(errorHandler)



const PORT = 8000;


app.use('/api/user', router);
app.use('/api/chat', chatRoutes)
app.use('/api/chat/message', messageRoutes)



// const __dirname1 = path.resolve();

// if(env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname1, '../frontend/build')));

//     app.get("*", (req,res) => {
//         res.sendFile(path.resolve(__dirname1, '../frontend', 'build', 'index.html'));
//     });

// }else{
//     app.get('/', (req,res) => {
//         res.sendFile('API IS RUNNING SUCCESSFULLY')
//     })
// }


app.get("/", (req, res) => {
    res.send("<h2>Hello TS Node Dev</h2>");
})

const server = app.listen(PORT, () => {
    console.log("App is Listening on Port ");
})


const io = new Server(server, {
    pingTimeout: 60000,
    cors:{
        origin:'http://localhost:3000'
    }
});


io.on('connection', (socket: any) => {
    // console.log('connect to server')


    socket.on('setup', (userData:any) =>{
        socket.join(userData._id);
        // console.log(userData._id)
        socket.emit('connected')
    });

    socket.on('join chat', (room: string) => {
        socket.join(room);
        console.log('user joined room',room)
    });

    socket.on('typing', (room : any) => socket.in(room).emit('typing') );
    socket.on('stop typing', (room : any) => socket.in(room).emit('stop typing') );

    socket.on('new message', ( newMessageReceived: any) => {
        let chat = newMessageReceived.chat;
        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach((user: any) =>{
            if(user._id.toString() === newMessageReceived.sender._id.toString()) return;

            socket.in(user._id).emit('message recieved', newMessageReceived);
        })
    })


    socket.off('setup', (userData:any) => {
        console.log('user disconnected');
        socket.leave(userData._id)
    });
});


// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
//   });