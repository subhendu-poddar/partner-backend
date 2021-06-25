const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt.config');
const db = require("../../models");
const Users = db.user;
const Partners = db.partner;
const { ROLES } = require('../../utilities/constants');

exports.verifyJwtToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token){
        return res.status(403).send({
            auth: false, message: 'No token provided.'
        });
    }
    jwt.verify(token, jwtConfig.JWT_SECRET, (err, decoded) => {
        if (err){
            return res.status(500).send({
                auth: false,
                message: 'Fail to Authenticate.',
                description: err
            });
        }
        if (decoded.role === ROLES.DEFAULT)
        {
            Users.findOne({
                where: {
                    id: decoded.id
                }
            }).then(user => {
                if (!user) {
                    return res.status(404).send({
                        auth: false,
                        message: 'User Not Found.',
                    });
                }
                req.userId = decoded.id;
                req.role = decoded.role
                next();
            }).catch(err => {
                res.status(500).send({
                    auth: false,
                    message: 'Something went wrong.',
                    description: err
                });
            });
        }
        else if (decoded.role === ROLES.PARTNER)
        {
            Partners.findOne({
                where: {
                    id: decoded.id
                }
            }).then(partner => {
                if (!partner) {
                    return res.status(404).send({
                        auth: false,
                        message: 'Partner Not Found.',
                    });
                }
                req.partnerId = decoded.id;
                req.role = decoded.role
                next();
            }).catch(err => {
                res.status(500).send({
                    auth: false,
                    message: 'Something went wrong.',
                    description: err
                });
            });
        }
    });
}
