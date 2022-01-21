const randomIdGenerator = require('random-id-generator')
const got = require('got');
var randomId = require('random-id');

module.exports = {
	path: '/api/v1/messages/channel/:userid',
	method: 'post',
	run: async (req, res, db) => {
const {params, body, headers} = req

if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let author = await db.get('users', {token: headers.authorization})
if(author.length < 1) return res.status(401).json({errors: ["authorization"], message: "Failed Authorization"})

if(!params.userid) return res.status(400).json({errors: ['params','userid'], command: "Unknown UserID"})

let user = await db.get('users', {id: params.userid})
if(user.length < 1) return res.status(403).json({errors: ["userData"], message: "Unknown UserData"})
var len = 16;
 var pattern = '0123456789'
 
var id = randomId(len, pattern)
delete author[0].email
delete author[0].password
delete author[0].token
delete author[0]._id
delete user[0].email
delete user[0].password
delete user[0].token
delete user[0]._id
db.insert('channels', {authorid: author[0].id, authorData: author[0], userid: user[0].id, userData: user[0], channel: id})
res.status(200).json({authorid: author[0].id, authorData: author[0], userid: user[0].id, userData: user[0], channel: id})
  }
}