const randomIdGenerator = require('random-id-generator')
const got = require('got');
const request = require('request');

module.exports = {
	path: '/api/v1/attachment/:id.:data',
	method: 'get',
	run: async (req, res, db) => {
const {params, body, headers} = req
if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let attachment = await db.get('attachments-chat', {id: params.id })
if(attachment.length < 1) return res.status(403).json({errors: ['attachmentData'], message: "Failed Get Attachment"})
  const url = attachment[0].upload.url

  request({
    url: url,
    encoding: null
  }, 
  (err, resp, buffer) => {
    if (!err && resp.statusCode === 200){
if(attachment[0].data === "mp4") res.set("Content-Type", "video/" + attachment[0].data);
if(attachment[0].data !== "mp4") res.set("Content-Type", "image/" + attachment[0].data);
console.log(attachment[0].data)
      res.send(resp.body);
    }
  })
  }

  
  
}