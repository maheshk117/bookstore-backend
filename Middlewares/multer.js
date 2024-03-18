const multer = require('multer')



 
const storage = multer.memoryStorage()
const upload = multer({storage})

    
const multerStorage = upload.single("bookcover")




module.exports = {multerStorage}