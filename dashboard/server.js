const express = require('express');
const app = express();
const { commands } = require('../handler/index')

app.set('views', __dirname + '/views');
app.set('view engine', 'pug')

app.use(express.static(`${__dirname}/assets`));
app.locals.basedir = `${__dirname}/assets`;

app.get('/', (req,res) => res.render('index', {}));

app.get('/commands', (req,res) => res.render('commands',{
   subtitle: "Commands",
   categories: [ 
    {name: 'Admin', icon:'fas fa-gavel'}, 
    {name: 'Economy', icon:'fas fa-sack-dollar'},
    {name: 'Games', icon: 'fas fa-gamepad'},
    {name: 'Music', icon: 'fas fa-compact-disc'},
    {name: 'Fun', icon: 'fas fa-masks-theater'},
    ], 
    commands: Array.from(commands.values()),
    commandsString: JSON.stringify(Array.from(commands.values()))
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Dashboard: Online at port ${port}`))

