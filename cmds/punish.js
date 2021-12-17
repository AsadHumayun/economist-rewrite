const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "punish",
	aliases: [ "punish", "pnsh" ],
	description: "Punish a user for violating a specific rule; bot will automatically upgrade the intensity of the punishment based off of current offences in relation to that violation.",
	category: "mod",
	ssOnly: true,
	cst: "tmod",
	async run(client, message, args) {
		if (args.length < 2) return message.reply(`You must specify a User and an offence under the format \`${message.guild.prefix}punish <user> <punishment index>\` in order for this command to work!`);
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });
		if (isNaN(args[1])) return message.reply(`Invalid index "${args[1]}"`, { allowedMentions: { parse: [] } });
		const index = Number(args[1]);
		let ofncs = await client.db.get("ofncs" + user.id);
		ofncs = ofncs ? ofncs.split(";") : [];
		for (const x in ofncs) {
			if (ofncs[x] == "") continue;
			ofncs[x] = Number(ofncs[x]);
		}
		console.log(`ofncs: ${ofncs}`)
		if (!Object.values(client.config.statics.defaults.ofncs)[index - 1]) {
			return message.reply(`Index ${index} out of bounds for length ${Object.keys(client.config.statics.defaults.ofncs).length}`);
		}
		if (!ofncs[index - 1]) ofncs[index - 1] = 0;
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${user.tag} has been punished for "${Object.values(client.config.statics.defaults.ofncs)[index - 1][0]}"; they were sent the following message:`),
			],
		});
		const mem = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(user.id);
		const level = Object.values(client.config.statics.defaults.ofncs)[index - 1][1];
		async function ban() {
			try {
				const banEmbed = new MessageEmbed()
					.setColor(client.config.statics.defaults.colors.red)
					.setDescription(`You have received a permanent ban from ${message.guild.name}. If you believe that this is a mistake, please contact ${client.users.cache.get(client.config.owner).tag} (don't spam my DMs).`)
					.addField("Moderator", message.author.tag, true)
					.addField("Reason", Object.values(client.config.statics.defaults.ofncs)[index - 1][0], true);
				mem.ban({
					reason: `${Object.values(client.config.statics.defaults.ofncs)[index - 1][0]}\nResponsible moderator: U: ${message.author.tag} (${message.author.id}), target: ${user.tag} (${user.id})`,
					days: 0,
				});
				try {
					mem.send({ embeds: [ banEmbed ] });
					message.channel.send({ embeds: [ banEmbed ] });
				}
				catch (e) {
					message.channel.send(`Unable to send messages to this user: ${user.tag} (${user.id})`);
				}
			}
			catch (e) {
				message.reply(`Failed to ban U: <${message.author.tag} (${message.author.id})>: \`${e}\``);
			}
		}
		async function muted(hrs) {
			await mem.roles.add(client.config.statics.defaults.roles.muted).catch(() => {return;});
			await client.db.set("mt" + user.id, `${(message.createdTimestamp + ms(`${hrs}h`)) / 60_000};${Object.values(client.config.statics.defaults.ofncs)[index - 1][0]}`);
			const membed = new MessageEmbed()
				.setColor(client.config.statics.defaults.colors.red)
				.setDescription(`You have received a ${hrs} hour mute from ${message.guild.name}. You may leave and re-join the server after said time has passed to have your mute auto-removed. If you believe that this was an unjust punishment, please PM ${client.users.cache.get(client.config.owner).tag} (don't spam though, otherwise I'll just ignore you).`)
				.addField("Moderator", `${message.author.tag}`, true)
				.addField("Reason", Object.values(client.config.statics.defaults.ofncs)[index - 1][0]);
			try {
				client.users.cache.get(user.id).send({ embeds: [ membed ] });
				message.channel.send({ embeds: [ membed ] });
			}
			catch (e) {
				message.channel.send(`Unable to PM ${user.tag} (${user.id})`);
			}
		}
		async function warn() {
			const em = new MessageEmbed()
				.setColor(client.config.statics.defaults.colors.red)
				.setDescription(`You have received a warning from ${message.guild.name}. If you believe that this was a mistake, please PM ${client.users.cache.get(client.config.owner).tag} (don't spam though, otherwise I'll just ignore you).`)
				.addField("Moderator", `${message.author.tag}`, true)
				.addField("Reason", Object.values(client.config.statics.defaults.ofncs)[index - 1][0]);
			try {
				client.users.cache.get(user.id).send({ embeds: [ em ] });
				message.channel.send({ embeds: [ em ] });
			}
			catch (e) {
				message.channel.send(`Unable to send messages to this user: ${user.tag} (${user.id})`);
			}
		}
		if (level == 1) {
			// level 1 offences:
			// 2 warnings; then 1h mutes
			if (ofncs[index - 1] > 2) {
				muted("1");
			}
			else {
				warn();
			}
		}
		else if (level == 2) {
			// level 2 offences:
			// first 2 1h mutes then 3h mutes
			if (ofncs[index - 1] >= 2) {
				muted("3");
			}
			else {
				muted("1");
			}
		}
		else if (level == 3) {
			// level 3 offences
			// 6h mutes then permed
			if (ofncs[index - 1] <= 3) {
				muted("6");
			}
			else if (level == 4) {
				// level 4 offences:
				// users are allowed to appeal for permanent mutes. They have 3 perm mutes, and then it's a permanent ban from the guild.
				if (ofncs[index - 1] >= 3) {
					// ban
					ban();
				}
				else {
					muted("10000000000000000");
					// permanent mute
				}
			}
			else {
				muted("10000000000000000");
			}
		}
		else if (level == 4) {
			//  level 4 offences - instant permanent ban
			ban();
		}
		console.log(`ofncs: ${ofncs}`)
		ofncs[index - 1] = Number(ofncs[index - 1]) + 1;
		console.log(`ofncs: ${ofncs}`);
		ofncs = ofncs.join(";");
		await client.db.set("ofncs" + user.id, ofncs);
	},
};