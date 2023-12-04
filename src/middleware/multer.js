const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}_${file.fieldname}_${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
});

const cpUpload = upload.fields([
  {name: 'image', maxCount: 1},
  {name: 'url', maxCount: 1},
]);

module.exports = cpUpload;


// fileFilter: (req, file, cb) => {
//   if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//   }
// }
