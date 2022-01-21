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
	path: '/api/v1/users/@me',
	method: 'patch',
	run: async (req, res, db, ws) => {
let { headers, body } = req
    
if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let user = await db.get('users', {token: headers.authorization})
if(user.length < 1) return res.status(401).json({errors: ["authorization"], message: "Failed Authorization"})

var avatar = body.avatar
if(avatar){
var buf = Buffer.from(body.avatar.split(",")[1], 'base64');
var able = true
var err1 = ``
var name = body.avatar.split(";")[0].replace('data:image/', '').replace('data:video/', '').replace('data:gif/', '')
if(name === "mp4") return res.status(403).json({errors: ['avatarData'], message: "mp4 Not Supported in avatar!"})
if(name === "gif" && user[0].verified === false) return res.status(403).json({errors: ['avatarData', 'access'], message: "Missing Access"})

var msg = await client.createMessage('832024588351176734', `This File Upload By ${user[0].id}`, [{file: buf, name: "profile." + name}]).catch(err =>{})
if(!msg) return res.status(403).json({errors: ['avatarData', 'upload'], message: err1.message})

if(msg.attachments.length < 1) return res.status(403).json({errors: ['avatarData', 'upload'], message: "Failed To Upload"})
var id = randomIdGenerator(8)
db.insert('avatars', {dataID: id + "_" + user[0].id, data: {id: id, authorID: user[0].id}, upload_data: {url: msg.attachments[0].url}, attachments: {url: "https://tiktok-developer.glitch.me/api/v1/avatar/" + id + "/" + user[0].id, data: body.avatar.split(";")[0].replace('data:image/', '').replace('data:video/', '').replace('data:gif/', '')}})

avatar = "https://tiktok-developer.glitch.me/api/v1/avatar/" + id + "/" + user[0].id

}else{
avatar = user[0].avatar
}

var email = body.email
if(email){

if(!body.new_password) return res.status(403).json({errors: ['emailData', 'Body'], message: "Request Password"})
if(body.new_password !== user[0].password) return res.status(403).json({errors: ['emailData', 'passwordData'], message: "Worng Password"})
email = body.email
}else{
email = user[0].email
}
var token = user[0].token
var password = body.password
if(password){

if(!body.new_password) return res.status(403).json({errors: ['passwordData', 'Body'], message: "Request Password"})
if(body.new_password !== user[0].password) return res.status(403).json({errors: ['passwordData'], message: "Worng Password"})
password = body.password

token = randomIdGenerator(62)
}else{
password = user[0].password
}

user[0].username = body.username || user[0].username,
user[0].avatar = avatar,
user[0].email = email,
user[0].password = password,
user[0].token = token,


db.update('users', {_id: user[0]._id}, user[0])
delete user[0].password
res.status(200).json(user[0])
    
  }
}
client.connect()