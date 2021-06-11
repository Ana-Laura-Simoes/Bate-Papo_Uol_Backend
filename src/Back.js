import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

const app = express();
app.use(express.json());
var corsOptions = {
    origin: '*',
}
app.use(cors(corsOptions));

//const user={name: 'João', lastStatus: 12313123};
let participants=[];
let messages=[];

app.post('/participants', (req,res) => {
    const participant = req.body.name;

    if(participant && !participants.some(({name}) => name === participant)) {
        participants.push({name: participant,lastStatus: Date.now()})
        messages.push({from: participant, to: 'Todos', text: 'entra na sala', type: 'status', time: dayjs().format('HH:mm:ss')})
        //console.log(messages);
        return res.sendStatus(200)
    }
    res.sendStatus(400)
});


app.get('/participants', (req,res) => {
res.send(participants);
});


app.post('/messages', (req,res)=>{
const message=req.body;
const from = req.header("User");

if(message.to.length >0 && message.text.length>0 &&(message.type==='message' || message.type==='private_message') && participants.some(({name}) => name === from))
{messages.push({from,...message,time: dayjs().format('HH:mm:ss')});
console.log(messages);
return res.sendStatus(200);
}

else res.sendStatus(400);
});





app.listen(4000,()=>{console.log("rodando servidor")});