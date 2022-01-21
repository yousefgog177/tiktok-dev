const randomIdGenerator = require('random-id-generator')

module.exports = {
	path: '/api/v1/users/:id',
	method: 'get',
	run: async (req, res, db) => {
const {params, body, headers} = req
if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})
if(params.id !== "@me"){
let user = await db.get('users', {id: params.id})
if(user.length < 1) return res.status(403).json({errors: ["userData"], message: "Unknown User"})
delete user[0]._id
delete user[0].token
delete user[0].email
delete user[0].password
res.status(200).json(user[0])

}else{
let user = await db.get('users', {token: headers.authorization})
if(user.length < 1) return res.status(401).json({errors: ["authorization"], message: "Failed Authorization"})
delete user[0]._id
delete user[0].email
delete user[0].password
res.status(200).json(user[0])

}

  }
}