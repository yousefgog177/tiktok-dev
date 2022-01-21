const randomIdGenerator = require('random-id-generator')
const {verify} = require('hcaptcha');

module.exports = {
	path: '/api/v1/login',
	method: 'post',
	run: async (req, res, db) => {
const {params, body, headers} = req
if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let user = await db.get('users', {email: body.email, password: body.password})
if(user.length < 1) return res.status(401).json({errors: ["authorization"], message: "Email Or Password Worng"})
delete user[0].password
delete user[0].email  
delete user[0]._id
res.status(200).json({errors: [], message: "success", data: user[0]})

}
}