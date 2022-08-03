const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

const secret = process.env.JWT_SECRET || "AXALIFEJAPAN-SUMMIT-2021"; // super secret

const level = require('level');
const db = level(__dirname + '/db');


const app = express();
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.set('view engine', 'ejs');

const port = 8080;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const generateToken = (req, GUID, opts, role) => {
  opts = opts || {};
  // By default, expire the token after 7 days.
  // NOTE: the value for 'exp' needs to be in seconds since
  // the epoch as per the spec!
  const expiresDefault = '7d';
  const token = jwt.sign({
    auth:  GUID,
    agent: req.headers['user-agent'],
    role: role
  }, secret, { expiresIn: opts.expires || expiresDefault });
  return token;
};

const generateAndStoreToken = (req, opts, role) => {
  const GUID   = new Date().getTime();
  const token  = generateToken(req, GUID, opts, role);
  const record = {
    "valid" : true,
    "created" : new Date().getTime(),
  };

  db.put(GUID, JSON.stringify(record), function (err) {
    console.log("record saved ", record);
  });

  return token;
}

const user = { name: 'test', pass: 'test', role: 'user' };
app.post('/auth', (req, res) => {
  // console.log(req.query);
  // console.log(req.params);
  console.log(req.body);
  if(req.body && req.body.username && req.body.username === user.name && req.body.password && req.body.password === user.pass) {
    const token = generateAndStoreToken(req, null, user.role);
    const cookies = new Cookies(req, res);
    cookies.set('token', token);
    res.writeHead(302, {
      'Location': '/private'
    });
    return res.end();
  } else {
    return res.status(401).sendFile(path.join(__dirname, '/fail.html'));
  }
});

const verify = (token) => {
  let decoded = false;
  console.log('verify', token, secret)
  jwt.verify(token, secret, function (err, payload) {
    console.log(err);
    if (err) {
      decoded = false; // still false
    } else {
      decoded = payload;
    }
  });
  console.log('verify decoded', decoded);
  return decoded;
};

const privado = (res, token, role) => {
  if (role === 'user') {
    return res.status(200).sendFile(path.join(__dirname, '/restricted.html'));
  } else {
    // return res.status(200).sendFile(path.join(__dirname, '/admin.html'));
    return res.status(200).render('admin', {flag: process.env.FLAG || 'flag{axalifejapan-washere-2021!}'})
  }
};

app.get('/private', (req, res) => {
  console.log("in /private");
  const cookies = new Cookies(req, res);
  const token = cookies.get('token');
  const decoded = verify(token);
  if(!decoded || !decoded.auth) {
    return res.status(401).sendFile(path.join(__dirname, '/fail.html'));
  } else {
    db.get(decoded.auth, function (err, record) {
      var r;
      try {
        r = JSON.parse(record);
      } catch (e) {
        r = { valid : false };
      }
      console.log(err,r);
      if (err || !r.valid) {
        return res.status(401).sendFile(path.join(__dirname, '/fail.html'));
      } else {
        return privado(res, token, decoded.role);
        // return callback(res);
      }
    });
  }
});

app.get('/logout', (req, res) => {
   // invalidate the token
  const cookies = new Cookies(req, res);
  const token = cookies.get('token');
  // console.log(' >>> ', token)
  const decoded = verify(token);
  if(decoded) { // otherwise someone can force the server to crash by sending a bad token!
    // asynchronously read and invalidate
    db.get(decoded.auth, function(err, record) {
      if (!err) {
        const updated = JSON.parse(record);
        updated.valid = false;
        db.put(decoded.auth, updated, function (err) {
          console.log('updated: ', updated)
        });
      }
      cookies.set('token');
      res.writeHead(302, {
        'Location': '/'
      });
      return res.end();
    });
  } else {
    cookies.set('token');
    return res.status(401).sendFile(path.join(__dirname, '/fail.html'));
  }
});

app.get('*', (req, res) => {
  res.send('not found');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});