const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "unpunish",
	aliases: ["unpunish", "unpnsh"],
	description: "Remove a user's offence, and unmutes them if necessary.\nNote: this command will NOT unban users -- that should be done via the unban command.",
	category: "mod",
	cst: "moderator",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("Correct usage: `" + message.guild ? message.guild.prefix : client.const.prefix + "unpunish <user> <offence index>`; requires mod");
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply(`"${args[0]}" isn't a valid user??`);
		let ofncs = await client.db.get("ofncs" + user.id);
		ofncs = ofncs ? ofncs.split(";") : [];
		ofncs = ofncs.map(Number);
		const index = Number(args[1]);
		if (!Object.values(client.config.statics.defaults.ofncs)[index - 1]) {
			return message.reply(`Index ${index} out of bounds for length ${Object.keys(client.config.statics.defaults.ofncs).length}`);
		}
		ofncs[index - 1] = ofncs[index - 1] - 1;
		while (ofncs[ofncs.length - 1] == 0) {
			ofncs.pop();
		}
		await client.db.set("ofncs" + user.id, ofncs.join(";"));
		message.reply(`Successfully updated ofncs ${index} ${user.id} from ${ofncs[index - 1] + 1} to ${ofncs[index - 1]}`);
		const level = Object.values(client.config.statics.defaults.ofncs)[index - 1][1];
		const mem = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(user.id);
		if (!mem) return;
		async function unmute() {
			if (!mem.roles.cache.has(client.config.statics.defaults.roles.muted)) return;
			mem.roles.remove(client.config.statics.defaults.roles.muted).catch(() => {return;});
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${user.tag}'s mute has been removed because of "User unpunished"; they were sent the following message:`),
				],
			});
			const e = new MessageEmbed()
				.setColor(client.config.statics.defaults.colors.green)
				.setDescription("Your mute has been removed")
				.addField("Moderator", message.author.tag)
				.addField("Reason", "User unpunished by a Moderator.");
			message.channel.send({ embeds: [e] });
			user.send({ embeds: [e] }).catch(() => {return;});
		}
		if (level == 1 && (ofncs[index - 1] < 2)) {
			await unmute();
		}
		else if (level == 2) {
			await unmute();
		}
		else if (level == 3) {
			await unmute();
		}
		else if (level == 4) {
			await unmute();
		}
	},
};