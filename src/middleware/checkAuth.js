const jwt = require('jsonwebtoken');

const generateToken = (response, user) => {
  // eslint-disable-next-line camelcase
  const { user_id, userName, email, role } = user;
  const payload = {
    // eslint-disable-next-line camelcase
    user_id,
    userName,
    email,
    role,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '14d',
  });
  response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 3600 * 24 * 14,
    signed: true,
  });
};

// eslint-disable-next-line consistent-return
const authenticate = (request, response, next) => {
  // Get the token from the request, typically from the "Authorization" header
  const token = request.headers.authorization;

  // Check if a token is present
  if (!token) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token to the request object
    request.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification error
    return response.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { generateToken, authenticate };
