const logger = require("../../Utils/logger");
const { userModel } = require('./UserModel')
const secretKey = process.env.secretKey
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const path = require('path');
const fs  = require('fs')
module.exports = {


  CraeteUser: async (req, res) => {
    try {
      console.log("in code");
      const LoginBody = new userModel(req.body);
      await LoginBody.save().then((data) => {
        res.send({
          success: true,
          message: "User Created Succesfully",
          data: data
        })
      }).catch(error => {
        console.log(error);
        res.send({
          success: false,
          message: "error in user creation",
          error: error
        })
      })
    } catch (error) {
      res.send({
        success: false,
        message: "error in try",
        error: error
      })
    }
  },

  loginUser: async (req, res) => {
    try {
      const { Email, Password } = req.body;
      // console.log("req", req.body);
      const username = await userModel.findOne({ Email: Email });


      let token = jwt.sign({ username: username._id }, secretKey, {
        expiresIn: 60 * 15
      });

      const isMatch = await bcrypt.compare(Password, username.Password)

      if (isMatch && token) {
        res.status(200).send({
          success: true,
          message: 'valid credentails',
          token: token
        });
      } else {
        res.send({
          success: false,
          message: 'invalid credentials',
        });
      }
    }
    catch (error) {
      console.log(error);
      res.send({
        success: false,
        message: "please provide email and password",
        error: error
      });
    }
  },

  UploadFile : async(req , res) => {
    try {
      res.send({
        success : true,
        message : "file uploaded"
      })
    } catch (error) {
      res.send({
        success : false,
        message : "file uploaded",
        error : error
      })
    }

  },

  ReadFile : async(req , res) => {
    try {
      let filename = req.body.filename
      const filePath = `./uploads/${filename}`;

      const readStream = fs.createReadStream(filePath);

      readStream.pipe(res);

      readStream.on('error', (err) => {
        console.error(err);
        res.send('Internal Server Error');
      });
    } catch (error) {
      res.send({
        success : false,
        message : "Error At try",
        error : error
      })
    }
  },

  deleteFile : async(req , res) => {
    try {
      console.log("in code");
      const filename = req.body.filename;
      console.log("in code",filename);
      if(req.body.filename){
       
        fs.unlink(`uploads/${filename}`  , (error) => {
          if (error) {
            res.send({
              success : false,
              message : "Error at Deleting file",
              error : error
            })
          }else{
            res.send({
              success : true,
              message : "File deleted successfully",
            })
          }
        });
     
      }
    } catch (error) {
      res.send({
        success : false,
        message : "Error At try",
        error : error
      })
    }
  }
}
