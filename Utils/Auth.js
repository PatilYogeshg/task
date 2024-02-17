const jwt = require('jsonwebtoken');
const {userModel} = require('../Controller/UserCreation/UserModel');
const secretKey = process.env.secretKey

module.exports.Auth = async (req, res, next) => {

    try {

        const token = req.headers.authorization;

        const decode = jwt.verify(token, secretKey);

        const data = await userModel.findOne({_id:decode.username});
        
        if(data) {
            req.user = data;
            next();
        } else {
            res.send({
                status : false,
                message :"Authentication Error"
            });
        }       
    } catch (error) {
        if(error) {
            res.send({
                status: false,
                msg: "Please Login To Continue"
            })
        }
    }

}