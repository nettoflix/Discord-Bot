const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const guildId = process.env.guildId;
const clientId = process.env.clientId;
const token = process.env.guildId;
const commands = [
	new SlashCommandBuilder().setName('panaca').setDescription('Replies with babaca!'),
	//new SlashCommandBuilder().setName('dolar').setDescription('Dá a atual cotação do dólar'),
	//new SlashCommandBuilder().setName('inspire').setDescription('Cita uma frase de inspiração'),
	//new SlashCommandBuilder().setName('piada').setDescription('Piada o que é o que é?'),
	//new SlashCommandBuilder().setName('piada_resposta').setDescription('Revela a resposta da piada'),
	//new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	//new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);
( async ()=>
{
	try{
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: {commands} });
		console.log("success!");
	}
	catch(e)
	{
		console.log(e);
	}
})();