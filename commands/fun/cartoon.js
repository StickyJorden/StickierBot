

//Child process for using python
const { spawn } = require("child_process")

//Save image to folder
const fs = require("fs")
const request = require("request")
const path = require("path")
const Discord = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { rejects } = require("assert");

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

//Run python code given url
function python(message, image_name, style)
{
    //Make a promise so the function get selection does not continue until this is done
    return new Promise((resolve, reject) => {
        //Creating child, calling python file, passing url arguement  
        const childPython = spawn('python', ['../StickierBot/python/cartoon/cartoonization.py', '--input_dir', `../StickierBot/python/cartoon/input_images/`, '--output_dir', `../StickierBot/python/cartoon/output_images`, '--styles', style])

        //On successful opening report output
        childPython.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        //On error report output
        childPython.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        //Close the child process
        childPython.on('close', (close) => {
            console.log(`child process exited with code ${close}`);

            resolve();
            build_embed(message, image_name, style)
        });
    });
}

//Get url from message, if no url exsists return null
function get_url(message, rec_url)
{
    console.log(rec_url)
    //Check to see if the message contains attached image
    const attachment = message.attachments.first();

    //If the message has an attachment make it the current url else make it null
    let url = attachment ? attachment.url : null;


    //If no message attachment was found then try to check if a url was linked
    if(url == null)
    {
      url = message.embeds[0] ? message.embeds[0].url : null;
    }
    if(url == null)
    {
        if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).test(rec_url)) {
            throw new Error(`Invalid URL`);
        }
        url = rec_url
    }

    //Return either the working url or null result
    return url
}

//Make sure url is valid
function check_url(message, url)
{
   //If no images were found let the user know
   if(url == null)
   {
       let embed = new Discord.MessageEmbed()
           .setTitle("No Image Found")
           .setDescription("I am very sad.")
   
       message.channel.send({content: " ", embeds: [embed]})
   }
   //If the image is found then name and store it 
   else 
   {
        //Make the image name for retrieval
        let image_name = make_name()
    
        //Save image to path
        request.get(url).on('error', console.error).pipe(fs.createWriteStream(`../StickierBot/python/cartoon/input_images/${image_name}`))

        //Get the users choice for the style
        get_selection(message, image_name) 
   }
}

function get_selection(message, image_name)
{
    //Add buttons so the user can select which style they want
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("shinkai")
            .setLabel("shinkai")
            .setStyle("SUCCESS"),
        new MessageButton()
            .setCustomId("hayao")
            .setLabel("hayao")
            .setStyle("SUCCESS"),
        new MessageButton()
            .setCustomId("hosoda")
            .setLabel("hosoda")
            .setStyle("SUCCESS"),
    );

    //Send buttons and message to chat
    message.channel.send({content: "What style would you like to use?", components: [row] });

    //Make sure only the user who sent the message can respond
    const filter = (interaction) => {
        if(interaction.user.id === message.author.id) return true;
        return interaction.reply({content: "You cannot use this button."})
    };

    //Accept only one result for the collector
    const collector = message.channel.createMessageComponentCollector({
        filter,
        max: 1,
    });

    //TO-DO:
    //Handle NO RESPONSE

    //Handle the button clicked
    collector.on("end", async (ButtonInteraction) => {

        //Read in which style was selected
        const style = ButtonInteraction.first().customId;
        
        //Defer the reply until image is made/converted
        await ButtonInteraction.first().deferReply();
    
        //Call python with the saved image name and selected style 
        await python(message, image_name, style);

        //After the image is done end the loading bar
        await ButtonInteraction.first().editReply({content:"Enjoy!"});
    });
}

//Make the file name
function make_name()
{
    //Make the image name for retrieval
    let imageName = `Img-${Date.now()}.jpg`
    return imageName
}

//Clear input_images folder
function clear_input()
{
    let directory = '../StickierBot/python/cartoon/input_images/';

    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
            });
        }
    });
}

//Clear output_images folder
function clear_output()
{
    let directory = '../StickierBot/python/cartoon/output_images';

    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
            });
        }
    });

}

//Build the embed to send to chat given image name and message channel
function build_embed(message, image_name, style)
{
    //Get the path of the image that was made
    let file = new Discord.MessageAttachment(`../StickierBot/python/cartoon/output_images/${style}/${image_name}`)

    let embed = new Discord.MessageEmbed()
        .setTitle("Cartoonization")
        .setImage(`attachment://${image_name}`)
   
    message.channel.send({content: " ", embeds: [embed], files: [file]})
}

//Comand to handled attached images
module.exports = {
  name: "attach",
  alias: ["cartoon"],
  description: 'return a cartoon version of an image',
  run: async (client, message, args) => { 

    clear_input()
    //clear_output()

    //Get the url from the message
    url = get_url(message, args[0])
    
    //Send embed based of url status
    check_url(message, url)
    
    //TO-DO:
    //Stop comparison output to folder
    //Call Images By Name

  }
}
