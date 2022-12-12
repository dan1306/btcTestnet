const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = function (req, res, next) {
  // here with the token recieved from the front end
  // we validate it, and if it is a valid token and not expired
  // we turn the token into user data that can be put to use
  // and store it in req, so other routes can have access to
  // a particular logged
  // in user data 

  // Check for the token being sent in three different ways
  let token = req.get('Authorization') || req.query.token || req.body.token;
  if (token) {
    console.log(token)
    // Remove the 'Bearer ' if it was included in the token header
    token = token.replace('Bearer ', '');
    // Check if token is valid and not expired
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err) {
        next(err);
      } else {
        // It's a valid token, so add user to req
        req.user = decoded.user;    
        next();
      }
    });
  } else {
    next();
  }
};
