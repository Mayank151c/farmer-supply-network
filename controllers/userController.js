// controllers/userController.js

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.create = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'user details created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.alldistributer = async (req, res) => {
    try {
        const users = await User.find({type: 'Distributor'});
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.readById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'user details not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'user details not found' });
        }
        res.status(200).json({ message: 'user details updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.auth = async(req, res, next)=> {
    try {
        console.log("Cookies: ",req.cookies);

        if(!req.cookies || !req.cookies.jwt || !req.cookies.username) throw new Error('Cookies not found.');
        const user = await User.findOne({username: req.cookies.username});
        if(!user.tokens.includes(req.cookies.jwt)) throw new Error('Token does not match with username.');

        req.viewdata = user;
        jwt.verify(req.cookies.jwt, 'secret');
        next();
    }
    catch(e) {
        console.log("Auth Error: ",e.message);
        res.status(500).json({message: e.message, redirect: '/login'});
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compare(password, user.password)) throw new Error('Username or password is wrong.');
        
        const token = jwt.sign({username}, 'secret', {expiresIn: '7d'});
        user.tokens.push(token);
        await user.save();

        res.cookie('jwt', token);
        res.cookie('username', username);
        res.cookie('_id', user._id);

        res.status(200).json();
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ message: e.message, error: true });
    }
};

exports.signup = async (req, res) => {
    try {
        if(!req.body || !req.body.password) throw new Error('Request body not found.');

        req.body.password = await bcrypt.hash(req.body.password, 8);
        const data = req.body;
        await User.create(data);

        res.status(200).json({ message: 'Signup successfully', add: true });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ message: e.message, error: true });
    }
};
