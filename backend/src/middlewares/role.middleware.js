const UserModel = require('../models/account.model/user.model');
const { KEYS } = require('../constant');
const jwt = require('jsonwebtoken');

exports.hasRole = (roles) => {  return async (req, res, next) => {
    try {
      res.locals.isAuth = false;
      let token = req.cookies ? req.cookies[KEYS.JWT_TOKEN] : null;

      // if not exist cookie[access_token] -> isAuth = false -> next
      if (!token) {
        return res
          .status(403)
          .send({ error: { status: 403, message: 'Access denied.' } });
      }

      // verify jwt
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        const { accountId } = decoded.sub;
        let user = await UserModel.findOne({ accountId }).select(
          '-_id username name avt favoriteList coin role',
        );

        if (!user || !roles.includes(user.role)) {
          return res
            .status(403)
            .send({ error: { status: 403, message: 'Access denied.' } });
        } else {
          user.accountId = accountId;
          res.locals.isAuth = true;
          req.user = user;
        }
      }
      next();
    } catch (error) {
      console.error('Authentication with JWT ERROR: ', error);
      return res.status(401).json({
        message: 'Unauthorized.',
        error,
      });
    }
  };
};
