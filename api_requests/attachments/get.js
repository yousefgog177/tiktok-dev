const randomIdGenerator = require('random-id-generator')
let Eris = require('eris')
const got = require('got');
const request = require('request');

module.exports = {
	path: '/api/v1/attachments/:file',
	method: 'get',
	run: async (req, res, db) => {
const {params, body, headers} = req

if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let user = await db.get('users', {token: headers.authorization})
if(user.length < 1) return res.status(401).json({errors: ["authorization"], message: "Failed Authorization"})

let file = await db.get('attachments', {file: params.file})
if(file.length < 1) {
 file = await db.get('attachments', {})
file = file.filter(d => d.video.id === params.file)
if(file.length < 1) {
return res.status(403).json({errors: ["attachments","error-fetch"], message: "This File Is Not Upload"})
}else{
file[0].video.url = "https://tiktok-developer.glitch.me/api/v1/video/" + file[0].video.id
delete file[0]._id

return res.status(200).json({errors: [], message: "success", data: file[0]})
}}

  }
}