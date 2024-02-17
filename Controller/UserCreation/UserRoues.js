const express = require('express');
const router = express.Router();
const UserController  = require('./UserController');
const multer = require('multer')
const {Auth} = require('../../Utils/Auth') 

const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null, './uploads')
    },
    filename : function (req,file,cb){
        const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, suffix + '-' + file.originalname )
    }
})

const upload = multer({storage : storage})


router.post('/CraeteUser' , UserController.CraeteUser);
router.post('/loginUser' , UserController.loginUser);
router.post('/UploadFile' ,Auth, upload.array('file',10),UserController.UploadFile);
router.post('/deleteFile' ,Auth, UserController.deleteFile);
router.post('/ReadFile' ,Auth, UserController.ReadFile);

module.exports = router;