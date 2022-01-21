
let express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')
const randomIdGenerator = require('random-id-generator')

let app = express()
let Eris = require('eris')
const MongoClient = require("./MongoSimpleClient/index.js")
const db = new MongoClient("mongodb+srv://yousuf:41371755aa@cluster0.xv7ej.mongodb.net/", "tiktok")
console.log('Ready')
app.use(bodyParser.json({limit: "100mb"}));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get("/style.css", (req, res) => {
    res.sendFile(__dirname + "/styles.css");
})

app.get("/chat", (req, res) => {
    res.sendFile(__dirname + "/chat.html");
})

app.get("/setting", (req, res) => {
    res.sendFile(__dirname + "/setting.html");
})

app.get("/setting", (req, res) => {
    res.sendFile(__dirname + "/setting.html");
})
const http = require('http')
var server = http.createServer(app);

const ws = require("ws")
var wss = new ws.Server({ server });
server.listen(3000)
let client = Eris('ODEzMDI4ODA0NTE5Mzk1NDE4.YDJWFA.y_1YJ03F9H7Fo-jqis7OkJXOhJg')
var on = false
client.on('ready', () =>{
console.log('ready1')
on = true
})
client.on('error', () =>{
console.log('errror2')
on = false
})
client.connect()
wss.on('connection', function connection(ws, req) {
ws.send(JSON.stringify({errors: ["authorization"], d: "login", message: "Request Authorization"}))

var token = ""
var useragent = ""
var success_connect = false
var dn = true
setInterval(() => {
if(success_connect) return;
if(!token) dn = false
if(!token) success_connect = false
if(!token) ws.send(JSON.stringify({errors: ["authorization"], d: "login", message: "Time Out"}))
if(!token) ws.close()
}, 8000)
setInterval(async () => {
let user = await db.get('users', {token: token})
if(user.length < 1){
dn = false
token = ""
ws.send(JSON.stringify({errors: ["authorization"], d: "login", message: "Request Authorization"}))
setInterval(() => {
if(dn) return;
if(!token) ws.send(JSON.stringify({errors: ["authorization"], d: "login", message: "Time Out"}))
if(!token) ws.close()
if(token) dn = true
}, 8000)

}

}, 4000)


  ws.on('message', async function incoming(message) {
let data;
try { data = JSON.parse(message) } catch (e) {}
if(!data) return;
if(!token){
let user = await db.get('users', {token: data.token})
if(user.length < 1){
ws.send(JSON.stringify({errors: ["authorization"], d: "login", message: "Failed Authorization"}))
return ws.close()
}
token = data.token
useragent = req.headers['user-agent']
success_connect = true
delete user[0]._id
delete user[0].password
delete user[0].email
ws.send(JSON.stringify({errors: [], d: "login", message: "success", data_account: user[0], data_req: {"user-agent": req.headers['user-agent']}}))
}/*
if(data.d === "avatar"){
let user = await db.get('users', {token: token})
if(user.length < 1){
ws.send(JSON.stringify({errors: ["authorization"], d: "login", message: "Failed Authorization"}))
return ws.close()
}
let name = data.avatar.split(";")[0].replace('data:image/', '').replace('data:video/', '').replace('data:gif/', '')
if(name === "mp4") return ws.send(JSON.stringify({errors: ["AvatarData"], d: "avatar", message: "mp4 Not Supported in avatar!"})) 
if(name === "gif")  return ws.send(JSON.stringify({errors: ["AvatarData", 'access'], d: "avatar", message: "Missing Access"})) 
var buf = Buffer.from(data.avatar.split(",")[1], 'base64');
var able = true
var err1;
client.createMessage('832024588351176734', `This File Upload By ${user[0].id}`, [{file: buf, name: "profile." + data.avatar.split(";")[0].replace('data:image/', '').replace('data:video/', '').replace('data:gif/', '')}]).catch(err =>{
able = false
err1 = err
}).then(msg =>{
if(!able) return ws.send(JSON.stringify({errors: ["AvatarData"], d: "avatar", message: err1.message}))
let id = randomIdGenerator(8)

if(msg.attachments.length < 1) return ws.send(JSON.stringify({errors: ["AvatarData"], d: "avatar", message: "I Can't find any Video's"}))
db.insert('avatars', {dataID: id + "_" + user[0].id, data: {id: id, authorID: user[0].id}, upload_data: {url: msg.attachments[0].url}, attachments: {url: "https://tiktok-developer.glitch.me/api/v1/avatar/" + id + "/" + user[0].id, data: data.avatar.split(";")[0].replace('data:image/', '').replace('data:video/', '').replace('data:gif/', '')}})

user[0].avatar = "https://tiktok-developer.glitch.me/api/v1/avatar/" + id + "/" + user[0].id
db.update('users', {_id: user[0]._id}, user[0])
return ws.send(JSON.stringify({errors: [], d: "avatar", message: "success"}))
})
}*/
  });
});

        const requests = fs.readdirSync(`./api_requests/`).filter(file => file.endsWith(".js"));


    fs.readdirSync("./api_requests/").forEach(dir => {
        const requests = fs.readdirSync(`./api_requests/${dir}/`).filter(file => file.endsWith(".js"));

        for (let file of requests) {
            let request = require(`./api_requests/${dir}/${file}`);
if(request.method && request.path){
app[request.method](request.path , (req , res) =>{
 
return request.run(req, res, db, wss)
})
}} 

})
        const requests1 = fs.readdirSync(`./chat_api/`).filter(file => file.endsWith(".js"));


    fs.readdirSync("./chat_api/").forEach(dir => {
        const requests1 = fs.readdirSync(`./chat_api/${dir}/`).filter(file => file.endsWith(".js"));

        for (let file of requests1) {
            let request = require(`./chat_api/${dir}/${file}`);
if(request.method && request.path){
app[request.method](request.path , (req , res) =>{
 
return request.run(req, res, db, wss)
})
}} 

})