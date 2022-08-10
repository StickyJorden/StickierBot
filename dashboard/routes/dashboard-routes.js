const express = require('express');
const { guilds } = require('../../index');
const client = require('../../index');
const { valiadateGuild } = require('../modules/middleware');

const router = express.Router();

router.get('/dashboard', (req,res) => res.render('dashboard/index'));

router.get('/servers/:id', valiadateGuild, async (req,res) => res.render('dashboard/show'));

router.put('/servers/:id/:module', valiadateGuild, async (req,res) => {

    try {
        
        const { id, module } = req.params;

        const saveGuild = await guilds.cache.get(id);

        saveGuild[module] = req.body; 

        await saveGuild.save();

        res.redirect(`/servers/${id}`);

    } catch {
        res.render(`errors/400`);
    }

});

module.exports = router;