import jwt from 'jsonwebtoken';


export const auth = (req, res, next) => {
const header = req.headers.authorization || '';
const token = header.startsWith('Bearer ') ? header.slice(7) : null;
if (!token) return res.status(401).json({ message: 'Missing token' });
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload; // { id, role, email }
next();
} catch (e) {
return res.status(401).json({ message: 'Invalid/expired token' });
}
};


export const issueTokens = (user) => {
const access = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
const refresh = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN || '7d' });
return { access, refresh };
};