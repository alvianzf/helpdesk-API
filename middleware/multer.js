const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/images')
  },
  filename: (req, file, callback) => {
    const fileType = file.mimetype.slice(6)
    callback(null, file.fieldname + '-' + Date.now() + '.' + fileType)
  }
})

const uploadFilter = (req, file, callback) => {
  const allowedType = /jpeg|jpg|png|img/
  const extFile     = allowedType.test(path.extname(file.originalname).toLowerCase())
  const mimeType    = allowedType.test(file.mimetype)

  if (extFile && mimeType) {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const upload = multer({ storage: storage, fileFilter: uploadFilter })

module.exports = upload