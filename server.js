import { addMone, connectMongo, getAllMonim, getMoneByIdOrNumber, updateMone } from "./database.js";
import bodyParser from 'body-parser'
import qrcode from 'qrcode-terminal'
import express from 'express'
import fileUpload  from 'express-fileupload'

import fs from 'fs'
import path from 'path'
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const client = new Client({puppeteer: {args: ['--no-sandbox', '--disable-setuid-sandbox']},authStrategy: new LocalAuth()});
const PORT=3001; 
const allData = {}
syncData()
let app = express(); 
client.on('qr', (qr) => {qrcode.generate(qr, { small: true });});
client.on('ready', () => { console.log('WhatsApp client is ready!');});


app.use(bodyParser.json({ limit: '100mb' }));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use((REQ,RES,NEXT)=>{
    RES.header('Access-Control-Allow-Origin','*');
    RES.header('Access-Control-Allow-Headers','Origin, X-Requesed-With , Content-Type , Accept , Authorization');
    if(REQ.method ==='OPTIONS'){
          RES.header('Access-Control-Allow-Method','PUT, POST, PATCH, DELETE, GET');
          return RES.status(200).json({});
    }
    NEXT();
})

connectMongo()

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));
app.use("images",express.static(path.join(__dirname, "images")));
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "dist", "index.html"));});
app.get("/manifest.json", (req, res) => { res.sendFile(path.join(__dirname,"manifest.json"));});
app.get("/service-worker.js", (req, res) => { res.sendFile(path.join(__dirname,"service-worker.js"));});



app.get('/getData',(req,res)=>{
    log("/getData")
    if(!Object.keys(allData).length === 0)
        syncData();

    res.json(allData)
})   



app.get("/getMone/:id", async (req,res)=>{
    
    let id = req.params.id;
    log("/getMone/"+id)
    let mone = await getMoneByIdOrNumber(id);
    res.json(mone)
})




app.post("/updatMone", async(req,res)=>{
    log("/updatMone")

    let mone = req.body;
    updateMone(mone.id,mone).then(()=>{
        res.status(200).json({status:"good"})
    })
    .catch(()=>{
        res.status(400).json({status:"bad"})
    })

    let _mone = findMone(mone.id)
    if(_mone){ 
        Object.assign(_mone, mone);
        allData[mone.street][0].find(v=>v.moneId == _mone.id).read = true;
    }    
    
})



app.post("/sendWhathapp", async(req,res)=>{
    log("/sendWhathapp")

    let _phone = req.body.phone
    let message = req.body.message
    let mone = await getMoneByIdOrNumber(req.body.moneId)
    if (!_phone) {return res.status(400).json({x:'Phone is required'});}
    let phone = _phone.replace("05","9725")

    const chatId = `${phone}@c.us`;
    try {
        await client.sendMessage(chatId, message); 
         res.status(200).json({x:'good'});
    } catch (err) {
        console.error(err);
        res.status(500).json({x:'good'});
    }
    
})



client.initialize();

app.listen(3001, '0.0.0.0', () => {
  console.log('Server running on port 3001');
  console.log('http://localhost:3001/');
});


async function syncData(){
    log("/syncData")

    let data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")).toString());

        for(let i=0; i<data.length; i++){
            let mone = data[i];
            let street = mone.street;

            if(!allData[street]){
                allData[street] = [[]]
            }

            let _mone = await  getMoneByIdOrNumber(mone.id);
            if( _mone ){
                mone = _mone;
            }
            else{
                await addMone(mone);
            }
            allData[street].push(mone);
            allData[street].sort((a,b)=>a.streetNumber-b.streetNumber)
            allData[street][0].sort((a,b)=>a.value-b.value)
            allData[street][0].push({value:`${mone.streetNumber}`,moneId:mone.id,read:mone.read || mone.unRead!="--" })
        }
}

function log(TEXT){
    if(true)
        console.log(TEXT)
}

function findMone(moneid){
    for(let key in allData){
        for(let i=1;i<allData[key].length;i++){
            if(allData[key][i].id == moneid){
                return allData[key][i]
            }
        }
    }
    return null
}