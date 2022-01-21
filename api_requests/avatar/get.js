const request = require('request');

module.exports = {
	path: '/api/v1/avatar/:avatarID/:id',
	method: 'get',
	run: async (req, res, db) => {
const {params, body, headers} = req

let user = await db.get('users', {id: params.id})
if(user.length < 1) return res.status(403).json({errors: ["userData"], message: "Unknown User"})

if(!params.id || !params.avatarID) return res.status(403).json({errors: ["params_Data"], message: "Request Params id/avatarID"})

let avatar = await db.get('avatars', {dataID: params.avatarID + "_" + params.id})
if(avatar.length < 1) avatar = [{attachments: {url: "https://cdn.discordapp.com/attachments/832024588351176734/835220162781249546/profile.png", data: "png"}, upload_data: {url: "https://cdn.discordapp.com/attachments/832024588351176734/835220162781249546/profile.png"}}]

  let url = avatar[0].upload_data.url

if(user[0].verified === false && avatar[0].attachments.data === "gif") url = "https://cdn.discordapp.com/attachments/832024588351176734/835220162781249546/profile.png"

  request({
    url: url,
    encoding: null
  }, 
  (err, resp, buffer) => {
    if (!err && resp.statusCode === 200){
if(avatar[0].attachments.data === "mp4") res.set("Content-Type", "video/" + avatar[0].attachments.data);
if(avatar[0].attachments.data !== "mp4") res.set("Content-Type", "image/" + avatar[0].attachments.data);
      res.send(resp.body);
    }
  })
  }
}