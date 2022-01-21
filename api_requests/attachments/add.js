const randomIdGenerator = require('random-id-generator')
let Eris = require('eris')
const got = require('got');

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
	path: '/api/v1/attachments',
	method: 'post',
	run: async (req, res, db) => {
const {params, body, headers} = req
if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let user = await db.get('users', {token: headers.authorization})
if(user.length < 1) return res.status(401).json({errors: ["authorization"], message: "Failed Authorization"})
let filename = body.file.split(";")[0].replace('data:image/', '').replace('data:video/', '').replace('data:gif/', '')
if(filename !== "mp4") return res.status(403).json({errors: ['data'], message: "only mp4 is supported"})
var buf = Buffer.from(body.file.split(",")[1], 'base64');
var able = true
var err1 = ``
client.createMessage('832024588351176734', `This File Upload By ${user[0].id}`, [{file: buf, name: "profile." + body.file.split(";")[0].replace('data:image/', '').replace('data:video/', '').replace('data:gif/', '')}]).catch(err =>{
able = false
err1 = err
}).then(msg =>{
if(!able) return res.status(403).json({errors: ['data'], message: err1.message})

if(msg.attachments.length < 1) return res.status(403).json({errors: ['data'], message: "I Can't find any Video's"})
let videoid = randomIdGenerator(6)
res.status(200).json({errros: [], message: "success", attachments: {url: "https://tiktok-developer.glitch.me/api/v1/attachments/" + videoid}, video: {url: "https://tiktok-developer.glitch.me/api/v1/video/" + videoid, id: videoid}, author: {id: user[0].id, username: user[0].username}})
db.insert('attachments', {file: videoid, attachments: {url: "https://tiktok-developer.glitch.me/api/v1/attachments/" + videoid, data: body.file.split(";")[0].replace('data:image/', '').replace('data:video/', '').replace('data:gif/', '')}, video: {url: msg.attachments[0].url, id: videoid}, author: {id: user[0].id, username: user[0].username}})
})
}
}

client.connect()