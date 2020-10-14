import express from "express"
import multer from "multer"
const router = express.Router()
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  const fileTypes = /jpg||png||jpeg/

  const extType = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = fileTypes.test(file.mimeType)

  if (extType && mimeType) {
    return cb(null, true)
  }

  cb("Images only")
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router
