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

app.use(Express.static("public"))

app.get('/',(req,res)=>{
    res.render('index',{
        address : process.env.WEBURL
    });
})

const usernames = ["Muggle Mischief", "Lumos Luna", "Wizarding Whiz", "Snape Sorcerer", "Patronus Pixie", "Quidditch Quest", "Diagon Daring", "Gryffin Giggles", "Hagrids Helper", "Azkaban Escapee"]

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
    let user = usernames.pop()
    if (user){
        socket.emit('username',user)

        console.log('connected',user)
        console.log('Users on chat : ',10 - usernames.length)

        io.emit('newUser',user)
        
        socket.on('newMsgFromClient',({msg,sender})=>{
            io.emit('newMsgFromServer',{msg,sender})
        })

        socket.on('disconnect',()=>{
            console.log('Connection closed with : ',user)
            usernames.push(user)
            io.emit('lostUser',user)
            console.log('Users on chat : ',10 - usernames.length)

        })
    }
    else{
        socket.disconnect()
    }
})