const randomIdGenerator = require('random-id-generator')
const got = require('got');
var randomId = require('random-id');

module.exports = {
	path: '/api/v1/messages/channel/:userid',
	method: 'get',
	run: async (req, res, db) => {
const {params, body, headers} = req

if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let author = await db.get('users', {token: headers.authorization})
if(author.length < 1) return res.status(401).json({errors: ["authorization"], message: "Failed Authorization"})

if(!params.userid) return res.status(400).json({errors: ['params','userid'], command: "Unknown UserID"})

let user = await db.get('users', {id: params.userid})
if(user.length < 1) return res.status(403).json({errors: ["userData"], message: "Unknown UserData"})

var channel = await db.get('channels', {authorid: author[0].id, userid: user[0].id})
if(channel.length < 1) {
channel = await db.get('channels', {userid: author[0].id, authorid: user[0].id})
}
if(channel.length < 1) return res.status(403).json({errors: ["channelData"], message: "Unknown ChannelData"})
let find = channel.filter(d => d.authorid === author[0].id && d.userid === user[0].id || d.userid === author[0].id && d.authorid === user[0].id)

if(find.length < 1) return res.status(403).json({errors: ["channelData"], message: "Unknown ChannelData"})
delete find[0]._id
delete find[0].userData.password
delete find[0].userData.email  
delete find[0].userData._id
delete find[0].userData.token
delete find[0].authorData.password
delete find[0].authorData.email  
delete find[0].authorData._id
delete find[0].authorData.token
res.status(200).json(channel[0])
  }
}