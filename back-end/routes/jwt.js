const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.get('/verify-auth', (req, res) => {
	const token = req.cookies.token; // Le token reside dans req 
	if (!token) {
	  return res.json({ authenticated: false });
	}
	console.log(token);
	console.log('je suis bien la');
	try {
	  const decoded = jwt.verify(token, process.env.JWT_SECRET);
	  return res.json({ authenticated: true, user: decoded });
	} catch (err) {
	  return res.json({ authenticated: false });
	}
  });
  
  module.exports = router;