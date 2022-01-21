const randomIdGenerator = require('random-id-generator')
const got = require('got');

module.exports = {
	path: '/api/v1/videos',
	method: 'get',
	run: async (req, res, db) => {
const {params, body, headers} = req

if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})
let user = await db.get('users', {token: headers.authorization})
if(user.length < 1) return res.status(401).json({errors: ["authorization"], message: "Failed Authorization"})
let files = await db.get('attachments', {})
let file = files.find(d => !user[0].videos.find(data => data === d.video.id))
if(!file) return res.status(403).json({errors: ["videos"], message: "You Already see all videos"})
user[0].videos.unshift(file.video.id)

db.update('users', {token: headers.authorization}, user[0])

file.video.url = "https://tiktok-developer.glitch.me/api/v1/video/" + file.video.id
delete file._id
res.status(200).json({errors: [], message: "success", data: file})
  }
}