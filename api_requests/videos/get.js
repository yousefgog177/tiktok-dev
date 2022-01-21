const randomIdGenerator = require('random-id-generator')
const got = require('got');
const request = require('request');

module.exports = {
	path: '/api/v1/video/:file',
	method: 'get',
	run: async (req, res, db) => {
const {params, body, headers} = req
console.log('tt')
if(!headers["user-agent"]) return res.status(403).json({errors: ["user-agent"], message: "Request Headers user-agent"})

let file = await db.get('attachments', {file: params.file})
if(file.length < 1) {
return res.status(403).json({errors: ["attachments","error-fetch"], message: "This File Is Not Upload"})
}else{
  const url = file[0].video.url
console.log(file[0])
  request({
    url: url,
    encoding: null
  }, 
  (err, resp, buffer) => {
    if (!err && resp.statusCode === 200){
      res.set("Content-Type", "video/mp4");

      res.send(resp.body);
    }
  })
//return res.redirect(file[0].video.url)
}

  }
}