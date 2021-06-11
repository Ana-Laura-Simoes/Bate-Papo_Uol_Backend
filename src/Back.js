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
return res.sendStatus(200);
}

else res.sendStatus(400);
});



app.get('/messages', (req,res) => {
    const user = req.header("User");
    const limit = req.query.limit;
    
   
    const sendMessages = messages.filter((e)=>e.to==='Todos'|| e.to===user || e.from===user);
   if(sendMessages.length>limit) return res.send(sendMessages.slice(sendMessages.length-limit,sendMessages.lenght));
   else res.send(sendMessages);
    

    });


    app.post('/status', (req,res) => {
        const user = req.header("User");
    
        const participant = (participants.find(({name}) => name === user)) 
        participant
        ? ((participant.lastStatus = Date.now()) && res.sendStatus(200))
        : res.sendStatus(400)
        });



        setInterval(() => {
            participants = participants.filter(element => {
                if (Date.now() - element.lastStatus < 10000) {
                    return true
                }
                else {
                    messages.push({from: element.name, to: 'Todos', text: 'sai da sala...', type: 'status', time: dayjs().format('HH:mm:ss')})
                    return false
                }    
            })
        }, 15000);




app.listen(4000,()=>{console.log("rodando servidor")});