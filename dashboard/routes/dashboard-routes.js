const express = require('express');
const client = require('../../index');
const { valiadateGuild } = require('../modules/middleware');

const router = express.Router();

router.get('/dashboard', (req,res) => res.render('dashboard/index'));

router.get('/servers/:id', valiadateGuild, (req,res) => res.render('dashboard/show'));

module.exports = router;