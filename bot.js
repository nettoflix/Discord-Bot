console.log("Iniciando Aplicação");
require('dotenv').config();
//file system
const fs = require('fs')
//discord stuff
const { Client, Intents, Constants, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');
//const token = 'OTU3Mjk4Njk1MTI3MzE4NTY5.Yj8v4g.pGLahZOSuvA2JwNIwy67QZUjNng';
//const clientId = '957298695127318569';
//const guildId = '890258270890123366';
console.log(process.env.token);
const token = process.env.token;
const clientId = process.env.clientId;
const guildId = process.env.guildId;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_INTEGRATIONS, "GUILD_MESSAGES", "DIRECT_MESSAGES"] });
//Google api 
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');
//getWebContent, fetch html
const request_promise = require('request-promise');
const cheerio = require('cheerio');
//const { request } = require('http');
const dolar_url = 'https://br.investing.com/currencies/usd-brl';
//get Piada
const piada_url = 'https://api-charadas.herokuapp.com/puzzle?lang=ptbr';

//global variable pra segurar a resposta da piada
var piada_resposta;

client.on('ready',() =>
{
    console.log("I'm Ready");
    //const idd = '890258270890123366';
    const guild = client.guilds.cache.get(guildId);
    let commands;
    if(guild)
    {
        commands = guild.commands;
    }
    else
    {
        commands = client.application?.commands;    
    }
    commands?.create({
        name: 'meme',
        description: 'envia uma foto com uma legenda',
        options: [
            {
                name: 'foto',
                description: 'Nome da pessoa ou conteúdo a ser buscado',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'legenda',
                description: 'Legenda da foto',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    }); 
    commands?.create({
        name: 'dolar',
        description: 'Dá a cotação atual do dólar'
    }); 
    commands?.create({
        name: 'inspire',
        description: 'Frase de motivação'
    }); 
      commands?.create({
        name: 'piada',
        description: 'O que é o que é?'
    }); 
    commands?.create({
        name: 'piada_resposta',
        description: 'É isso ae'
    }); 
    commands?.create({
        name: 'nico',
        description: 'envia uma foto do nico com uma legenda',
        options: [
            {
                name: 'legenda',
                description: 'Legenda da foto',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    }); 
});

const applyText = (canvas, text, textSize=50) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = textSize;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas
	} while (context.measureText(text).width > canvas.width);

	// Return the result to use in the actual canvas
	return context.font;
};

client.on('interactionCreate', async (interaction)=>
{
if(!interaction.isCommand())
{return;}
const {commandName, options} = interaction;
if(commandName === 'meme')
{
    await interaction.deferReply();
    const foto = options.getString('foto');
    const legenda = options.getString('legenda');
//
    const imageData = await fetchGoogleAndReturnImageLinks(foto);
    if(imageData !== undefined)
    {
        console.log("Imagedata: " + imageData);
        const index = Math.floor(Math.random() * imageData.length);
        const split = imageData[index].split(' ');
        const imageLink = split[0];
        const imageHeight = split[1];
        const imageWidth = split[2];
        const canvas = Canvas.createCanvas(parseInt(imageWidth),parseInt(imageHeight));
        const context = canvas.getContext('2d');
        const img = await Canvas.loadImage(imageLink);
        // This uses the canvas dimensions to stretch the image onto the entire canvas
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        //draw border
        context.strokeStyle = '#0099ff'; // Set the color of the stroke	
        context.lineWidth = 20;
        context.strokeRect(0, 0, canvas.width, canvas.height) // Draw a rectangle with the dimensions of the entire canvas
        context.font = applyText(canvas, legenda);
        context.fillStyle = "rgba(0,0,0, 0.35)";  // last value is alpha [0.0, 1.0]
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.fillText(legenda, 20, (canvas.height - (canvas.height/8)));
        const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
        interaction.editReply({ files: [attachment] });
    }
    else
    {
        let text = "oi casada, deu ruim a pesquisa";
        const canvas = Canvas.createCanvas(1600,1200);
        const context = canvas.getContext('2d');
        const img = await Canvas.loadImage("./Images/encara.jpg");
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#0099ff'; // Set the color of the stroke	
        context.lineWidth = 20;
        context.strokeRect(0, 0, canvas.width, canvas.height) // Draw a rectangle with the dimensions of the entire canvas
        context.font = applyText(canvas, text, 100);
        context.fillStyle = "rgba(0,0,0, 0.35)";  // last value is alpha [0.0, 1.0]
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.fillText(text, 20, (canvas.height - (canvas.height/8)));
        const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
        interaction.editReply({ files: [attachment] });
    }
 
 
}
if(commandName === 'ping')
{
    interaction.reply({
        content: 'pong',
       // ephemeral: true,
    });
}
if(commandName === 'netto')
{
}
if(commandName ==="dolar")
{
    await interaction.deferReply({
        //ephemeral: true
    });
    let dol = await getCotacaoDol();
    interaction.editReply({
        content: dol,
    });
}
if(commandName ==="inspire")
{
    await interaction.deferReply({
       // ephemeral: true
    });
    let frase = await getFrase();
    interaction.editReply({
        content: frase,
    });
}
if(commandName ==="piada")
{
    await interaction.deferReply({
     });
    const data = await buscarPiada();
    const {question, answer} = data;
    console.log(question);
    interaction.editReply({
        content: question,
    });
    piada_resposta = answer;
}
if(commandName ==="piada_resposta")
{
    console.log(piada_resposta);
    if(piada_resposta === '')
    {
        interaction.reply({
            content: 'Mas eu não te contei nenhuma piada!'
        });
        return;
    }
  interaction.reply({
      content: piada_resposta
  });
  piada_resposta = '';
}
if(commandName==='nico')
{
    await interaction.deferReply();
    const legenda = options.getString('legenda');
    const canvas = Canvas.createCanvas(700,500);
    const context = canvas.getContext('2d');
    const tempArray = ["./Images/1.jpg","./Images/2.jpg","./Images/3.jpg", "./Images/4.jpg","./Images/5.jpg","./Images/6.jpg","./Images/7.jpg","./Images/8.jpg","./Images/9.jpg","./Images/10.jpg","./Images/11.jpg"];
    const tempIndex =  Math.floor(Math.random() * tempArray.length);
    const img = await Canvas.loadImage(tempArray[tempIndex]);
	// This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    //draw border
	context.strokeStyle = '#0099ff'; // Set the color of the stroke	
    context.lineWidth = 20;
	context.strokeRect(0, 0, canvas.width, canvas.height) // Draw a rectangle with the dimensions of the entire canvas
    context.font = applyText(canvas, legenda);
    context.fillStyle = "rgba(0,0,0, 0.35)";  // last value is alpha [0.0, 1.0]
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillText(legenda, 20, (canvas.height - (canvas.height/8)));
	const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
	interaction.editReply({ files: [attachment] });
}
});
//
client.on('messageCreate', async (msg) =>{
    console.log("message");
if(msg.content === "nico")
{
    msg.reply("Uhh dêmoiin");
 
}

});
client.on('messageCreate', function (user, userID, channelID, msg, evt) {
    if(msg === "!image")
    {
        console.log("image");
        client.uploadFile( 
            {
            to: channelID,
            file: 'middleFingerMonkey.jpg'
            });
    }
   });
function getFrase()
{
    return new Promise(function(resolve,reject)
    {
        var currentPath = process.cwd();
        fs.readFile(currentPath+ '/frases.txt', 'utf8' , (err, data) => {
          if (err) {
            console.error(err)
            reject(err);
            return;
          }
          let frases = data.split("\n");
          let randomI = Math.floor(Math.random() * frases.length);
          let frase = frases[randomI];
         // console.log(frase);
          resolve(frase);
        }) 
    });
    
}
function getCotacaoDol()
{
    return new Promise(function(resolve, reject)
    {
    request_promise(dolar_url).then(function(html){
      //console.log(html);
      const $ = cheerio.load(html);
      var p = $('.text-2xl').text();
      filtered = p.replace(/[^\d,.]/g, '');
      //console.log(filtered);
      resolve(filtered);
  
    }).catch(function(err){
        //handle error
        console.log("Call failed. Error: " + err.message);
        reject(err);
      });  
    });  
}
function buscarPiada()
{
return new Promise(function(resolve,reject)
{
    request_promise(piada_url).then(function(response){
    const data = JSON.parse(response);
    resolve(data);
    }).catch(function(err){
    console.log(err);
    reject(err);
    });    

})
}
async function fetchGoogleAndReturnImageLinks(query)
{
  const response = await customSearch.cse.list(
    {
      auth: 'AIzaSyDVx8fxQ2L7yhqGXOE7Y7MMeLcKMZw2XAY',
      cx:  'e0396a128b0d798ff',
      q: query,
      searchType: 'image',
      //imgSize: 'huge',
      num: 10,
    });
    try{
        const imagesUrl = response.data.items.map((item)=>
        {
            console.log(item.link);
          return [item.link, item.image.height ,item.image.width].join(' ');
          
        });
        return imagesUrl;
    }catch(e){
        console.log("Couldn't fetch images "+e);
    }
  
}
//bot login
client.login(token);