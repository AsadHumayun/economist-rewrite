const { MessageEmbed } = require(`discord.js`);
const ms = require('ms');

module.exports = {
	name: 'mute',
	aliases: ['mute'],
	description: 'Mutes a user',
	category: 'mod',
	cst: "tmod",
	async run(client, message, args) {
		let usr = await client.config.fetchUser(args[0]).catch((err) => {});
		if(!usr) return message.reply(`${client.config.statics.defaults.emoji.err} I can't seem to find that user...`);
		let member = message.guild.member(usr.id);
		if (!member) return message.reply(`${client.config.statics.defaults.emoji.err} The specified user is not a member of this server`);
		if (member.roles.cache.has(message.replyclient.config.statics.defaults.roles.mod.normal) && (message.author.id == client.owner)) {
			return message.reply(`${client.config.statics.defaults.emoji.err} You're not allowed to mute a moderator!`);
		};

		await member.roles.add(client.config.roles.muted);

		let amt = Number(args[1]);
		if(isNaN(amt) || (!args[1])) return message.reply(`${client.config.statics.defaults.emoji.err} You must provide a valid length (in minutes). For permanent mutes, use 0 as the length.`)
		let reason = args.slice(2).join(' ');
		if (!reason) reason = "Moderator didn't specify a reason.";
		await client.db.set("mt" + usr.id, `${amt == 0 ? "-1" : (message.createdTimestamp + (amt * 60000)) - client.config.epoch};${reason}`);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.statics.defaults.emoji.tick} ${member.user.tag} was given a ${amt == 0 ? "permanent" : `${amt} minute`} mute because of "${reason}"; they have been sent the following message:`)
		});
		let dm = new MessageEmbed()
		.setDescription(`You have received a ${amt == 0 ? "permanent" : `${amt} minute`} mute from ${message.guild.name}. Please contact ${client.users.cache.get(client.config.owner).tag} if you believe that this is an unjust mute. You may leave and rejoin the server after the time specified has passed in order to have your mute removed.`)
		.setColor(client.config.colors.red)
		.addField(`Moderator`, message.author.tag)
		.addField("Reason", reason);
		message.reply(dm);
		member.send(dm)
			.catch((x) => {});
		if ((amt * ms("1m")) >= 0x7FFFFFFF) return;
		if (amt != 0) {
			setTimeout(async() => {
				let m = await client.db.get("mt" + member.id);
				if (!m) return;
				member.roles.remove(client.config.roles.muted);
				member.send({
					embed: new MessageEmbed()
					.setDescription(`Your mute has been removed in ${message.guild.name}`)
					.setColor(client.config.statics.defaults.colors.green)
					.addField("Moderator", client.user.tag)
					.addField("Reason", "Time's up!")
				});
				await client.db.delete("mt" + member.id);
			}, amt * ms('1m'))
		};
	},
};