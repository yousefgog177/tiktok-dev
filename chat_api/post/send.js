const randomIdGenerator = require('random-id-generator')
const got = require('got');
let Eris = require('eris')

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
module.exports = {
	path: '/api/v1/messages/:channel',
	method: 'post',
	run: async (req, res, db, wss) => {
const {params, body, headers} = req
if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let author = await db.get('users', {token: headers.authorization})
if(author.length < 1) return res.status(401).json({errors: ["authorization"], message: "Failed Authorization"})

if(!params.channel) return res.status(400).json({errors: ['params','userid'], command: "Unknown UserID"})

let channel = await db.get('channels', {channel: params.channel})
if(channel.length < 1) return res.status(403).json({errors: ["channelData"], message: "Unknown channelData"})
let user = await db.get('users', {id: channel[0].userid})
if(user.length < 1) return res.status(403).json({errors: ["userData"], message: "Unknown User"})

if(!body.attachments || body.attachments.length < 1) {
var msg_id = randomIdGenerator(16)
db.insert('messages', {attachments: [], msg_id: msg_id, channel: params.channel, double: author[0].id + "-" + user[0].id, id: author[0].id, user: params.userid, userData: user[0], authorData: author[0], content: body.content || "Hi"})
delete author[0].email
delete author[0].password
delete author[0].token
delete author[0]._id
delete user[0].email
delete user[0].password
delete user[0].token
delete user[0]._id
  wss.clients.forEach( client => {
    client.send(JSON.stringify({
errors: [],
attachments: [],
channel: params.channel,
msg_id: msg_id,

d: "createMessage",
message: "success",
double: author[0].id + "-" + user[0].id,
id: author[0].id,
user: params.userid, 
userData: user[0], 
authorData: author[0], 
content: body.content || "Hi"
}));
  }); 

res.status(200).json({errors: [], message: "success", data: {
attachments: [], 
channel: params.channel, 
msg_id: msg_id,
double: author[0].id + "-" + user[0].id, 
id: author[0].id, user: params.userid, 
message: body.content || "Hi"
}})
  }else{

var urls = []
if(!Array.isArray(body.attachments)) return res.status(403).json({errors: ['Array-Data'], message: "Request Array Attachments"})
for(const data of body.attachments){
var buf = Buffer.from(data.split(",")[1], 'base64');
var able = true
await client.createMessage('826923695628877846', `this upload by ${author[0].id}`, [{file: buf, name: "profile." + data.split(";")[0].replace('data:image/', '').replace('data:video/', '').replace('data:gif/', '')}]).catch(err =>{
able = false
}).then(msg =>{
if(msg && able){

for(const d of msg.attachments){
let attachmentid = randomIdGenerator(6)
var bat = data.split(";")[0].replace("data:image/", "").replace("data:video/", "").replace("data:gif/", "")
urls.unshift("https://tiktok-developer.glitch.me/api/v1/attachment/" + attachmentid + "." + bat)
db.insert('attachments-chat', {
data: bat,
authorid: author[0].id, 
id: attachmentid, 
upload: {url: d.url}, file: {url: "https://tiktok-developer.glitch.me/api/v1/attachment/" + attachmentid + "." + bat}, 
author: {id: author[0].id, data: author[0]}, 
channel: {channel: params.channel, data: channel[0]}
})
}

}
})
}
await new Promise((res , rej) =>{ setTimeout(() => res() , 1500)})
db.insert('messages', {attachments: urls, msg_id: msg_id, channel: params.channel, double: author[0].id + "-" + user[0].id, id: author[0].id, user: params.userid, userData: user[0], authorData: author[0], content: body.content || "Hi"})

delete author[0].email
delete author[0].password
delete author[0].token
delete author[0]._id
delete user[0].email
delete user[0].password
delete user[0].token
delete user[0]._id
  wss.clients.forEach( client => {
    client.send(JSON.stringify({
errors: [],
msg_id: msg_id,
attachments: urls,
channel: params.channel,
d: "createMessage",
message: "success",
double: author[0].id + "-" + user[0].id,
id: author[0].id,
user: params.userid, 
userData: user[0], 
authorData: author[0], 
content: body.content || "Hi"
}));
  }); 

res.status(200).json({errors: [], message: "success", data: {
attachments: urls, 
msg_id: msg_id,

channel: params.channel, 
double: author[0].id + "-" + user[0].id, 
id: author[0].id, user: params.userid, 
message: body.content || "Hi"
}})
}

}
}

client.connect()