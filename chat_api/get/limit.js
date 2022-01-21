const randomIdGenerator = require('random-id-generator')
const got = require('got');

module.exports = {
	path: '/api/v1/messages/limit/:channel',
	method: 'get',
	run: async (req, res, db) => {
const {params, body, headers} = req
if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let author = await db.get('users', {token: headers.authorization})
if(author.length < 1) return res.status(401).json({errors: ["authorization"], message: "Failed Authorization"})

if(!params.channel) return res.status(400).json({errors: ['params','userid'], command: "Unknown UserID"})

let messages = await db.get('messages', {channel: params.channel })
for(let d of messages){
delete d._id
}
res.status(200).json({errors: [], message: "success", data: messages})
  }
}