const express = require('express');
const { commands }  = require('../../handler/index');

const router = express.Router();

router.get('/', (req,res) => res.render('index'));
router.get('/commands', (req,res) => res.render('commands', {
   subtitle: "Commands",
   categories: [ 
    {name: 'Admin', icon:'fas fa-gavel'}, 
    {name: 'Economy', icon:'fas fa-sack-dollar'},
    {name: 'Games', icon: 'fas fa-gamepad'},
    {name: 'Music', icon: 'fas fa-compact-disc'},
    {name: 'Fun', icon: 'fas fa-masks-theater'}
    ], 
    commands: Array.from(commands.values()),
    commandsString: JSON.stringify(Array.from(commands.values()))
}));

module.exports = router;