const { MessageEmbed, escapeMarkdown } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'stun',
	aliases: ['stun'],
	cst: "administrator132465798",
	description: 'stuns a user, preventing them from using any commands',
	category: 'own',
	async run(client, message, args) {
		if(!args.length || (isNaN(args[1]))) return message.reply("You must specify the user to stun, along with the stun time (in minutes)");
		let usr = await client.config.fetchUser(args[0]).catch((e) => {});
		if (!usr) return message.reply("You have to like ping someone, dom dom");
		await client.db.set("stn" + usr.id, client.parseCd(message.createdTimestamp, Number(args[1])*60000));
		await client.db.set("dns" + usr.id, client.parseCd(message.createdTimestamp, Number(args[1])*60000));
		message.reply(`${client.config.statics.defaults.emoji.tick} Successfully stunned **${escapeMarkdown(usr.tag)}** for ${args[1]} minutes.`);
	},
};