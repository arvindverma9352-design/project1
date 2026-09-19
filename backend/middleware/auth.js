const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id, role
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token.' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
    }
    next();
  });
};

const verifyRiderOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin' && req.user.role !== 'rider') {
      return res.status(403).json({ success: false, message: 'Forbidden: Rider or Admin access required.' });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin, verifyRiderOrAdmin };

