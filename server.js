import Express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import {Server} from 'socket.io'
import path from "path";

dotenv.config()

const app = Express()  

app.use(cors())

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(Express.static("."))

app.get('/',(req,res)=>{
    res.render('index',{
        address : process.env.WEBURL
    });
})

const server = app.listen(process.env.PORT,(err)=>{
    if(!err)
        console.log('Server running');
})

const io = new Server(server,{
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            })

io.on('connection',(socket)=>{
    socket.on('newMsgFromClient',msg=>{
        console.log('received msg', msg)
        io.emit('newMsgFromServer',msg)
    })
})