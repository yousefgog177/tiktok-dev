const randomIdGenerator = require('random-id-generator')
const {verify} = require('hcaptcha');
var randomId = require('random-id');

module.exports = {
	path: '/api/v1/register',
	method: 'post',
	run: async (req, res, db) => {
const {params, body, headers} = req
if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})
if(!body.email) return res.status(403).json({errors: ['email-request','Body'], message: "Request Email"})
if(!body.password) return res.status(403).json({errors: ['password-request','Body'], message: "Request password"})
if(!body.username) return res.status(403).json({errors: ['username-request','Body'], message: "Request Username"})
let user = await db.get('users', {email: body.email})
if(user.length < 1){
var len = 16;
 var pattern = '0123456789'
 
var id = randomId(len, pattern)
let token = randomIdGenerator(62)
db.insert('users', {verified: false, id: id, email: body.email, password: body.password, username: body.username, token: token, videos: [], avatar: "https://cdn.discordapp.com/attachments/832024588351176734/835220162781249546/profile.png"})
res.status(200).json({errors: [], message: "success", token: token})
}else{
 return res.status(403).json({errors: ["email","email-error"], message: "This Account Is Already Login"})
}


}
}