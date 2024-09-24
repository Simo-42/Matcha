// routes/index.js
const express = require('express');
const authRoutes = require('./auth');
const passwordForgotRoutes = require('./pass_forgot');
const jwtRoutes = require('./jwt');
const afterAuthRoutes = require('./after_auth');
const swipeRoutes = require('./swipe');
const uploadRoutes = require('./upload');
const messageRoutes = require('./messagerie');
const notifications	= require('./notification');

module.exports = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/password', passwordForgotRoutes);
    app.use('/api/jwt', jwtRoutes);
    app.use('/api/after_auth', afterAuthRoutes);
    app.use('/api/swipe', swipeRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/message', messageRoutes);
	app.use('/api/notification', notifications);
};
