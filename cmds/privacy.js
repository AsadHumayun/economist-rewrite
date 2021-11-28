const { MessageEmbed } = require('discord.js');
const rm = require('discord.js-reaction-menu');

module.exports = {
	name: 'privacy',
	category: 'utl',
	aliases: ['privacypolicy', 'privacy', 'pp'],
	description: "View the privacy policy and how data is handled.",
	async run(client, message, args) {
		let linkToSupportServer = `[Support Server](${client.config.ssInvite})`;
		const policy = new MessageEmbed()
		.setColor(message.author.color)
		.setTitle("Privacy Policy & Data Manipulation Statement")
		.setDescription("Welcome to our **Privacy Policy** and **Data Manipulation Statement** information area!\n\nPlease click the ▶ reaction to advance to the next page where the privacy policy is enclosed.\n\nThis message will remain active for the next 10 minutes.");
        
		const privacy = new MessageEmbed()
		.setColor(message.author.color)
		.setTitle("Privacy Policy")
		.setDescription(`
		
All data regarding Economist is stored on its local database which is only directly accessible by \`${client.users.cache.get(client.config.owner).tag}\`, who is the bot owner. 
However, there are certain users that are able to access, edit and delete your data. In the ${linkToSupportServer}, users who have the Database Manager role can use the \`${message.guild.prefix}set\`, \`${message.guild.prefix}get\` and \`${message.guild.prefix}delete\` commands on users. 

Additionally, **__repl.it__** support staff also have access to the database as a result of data persistence issues; it is worth noting that they are not likely to waste time digging through data stored on it.

By your continued use of Economist, we will assume that you agree to the Collection and manipulation of user data (IDs)

**In regards to User Data**, only specific user IDs are stored. Other details, such as the user's tag, avatar URL and creation date are fetched directly from Discord itself and are not stored; only displayed.

Messages, users and \`GuildMembers\` will all remain cached until next restart, at which point that are fetched from Discord once again and transferred into the cache.

Intents: \`['GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS']\`

		`)
		const data = new MessageEmbed()
		.setColor(message.author.color)
		.setTitle("Data Manipulation Statement")
		.setDescription(
			`Economist is an in-development economy Discord Bot; it must have the ability to immediately access data within a matter of MS.\n\nIf you wish to view your data, you can use the \`${message.guild.prefix}data\` command. This command will show all data that is directly stored in relation to your user ID. The bot may assume certain values if they are not present.\n\nIf you wish to remove all of your data, please use the \`${message.guild.prefix}deldata\``
		)
		const Pages = [policy, privacy, data];
		
		new rm.menu(message.channel, message.author.id, Pages, require("ms")('10m'), { first: '⏪', back: '◀', next: '▶', last: '⏩', stop: '⏹' });
	},
};