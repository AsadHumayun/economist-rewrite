"use strict";
import { MessageEmbed, Permissions } from "discord.js";

export default {
	name: "apply",
	aliases: ["apply"],
	description: "Apply for staff",
	category: null,
	ssOnly: true,
	async run(client, message) {
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		if (!cst.includes("canapply")) {
			// make sure account is > 6 months old
			if (Number(message.author.createdTimestamp) > Date.now() - 15778463000) {
				return message.reply({ content: "Your account is too new to apply for staff!" });
			}
			// make sure the user has been in the server for > 3 months
			if (Number(message.author.createdTimestamp) > Date.now() - 7889231500) {
				return message.reply({ content: "You have not been in this server for long enough in order to apply for staff!" });
			}
		}
		const ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(message.author.id));
		if (ch) return message.reply({ content: "You've already applied for staff!" });
		// docs ref: https://discord.js.org/#/docs/main/stable/class/GuildChannelManager?scrollTo=create
		const appChannel = await message.guild.channels.create(`app-${message.author.id}`, {
			// GuildChannelManager.create docs ref: https://discord.js.org/#/docs/main/stable/typedef/CategoryCreateChannelOptions
			parent: client.config.statics.defaults.channels.appCat,
			type: "TEXT",
			topic: message.author.id,
			nsfw: false,
			reason: `[${new Date(message.createdTimestamp).toISOString()}]: U:<${message.author.tag} (${message.author.id})> applied for staff`,
			permissionOverwrites: [{
				id: message.guild.id,
				allow: [],
				deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			}, {
				id: message.author.id,
				allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.SEND_MESSAGES],
				deny: [],
			}, {
				id: client.config.statics.defaults.roles.mod.normal,
				allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
				deny: [],
			}],
		})
			.catch((e) => {
				message.reply({ content: `Unable to create TextBasedChannel, exception: \`${e}\` has been reported.` });
				client.config.Notify(e, message.content);
			});
		message.member.roles.add(client.config.statics.defaults.roles.applicant);
		message.reply({ embeds: [
			new MessageEmbed()
				.setColor(client.config.statics.defaults.colors.green)
				.setDescription(`${message.author.tag} has successfully applied for staff! \`#${appChannel.name}\``),
		] });
		appChannel.send({ content: `Welcome ${message.author} to your personal staff application channel!`, embeds: [
			new MessageEmbed()
				.setColor(message.author.color)
				.setDescription("Here, you'll be writing (and submitting) your staff application. Please do not use bot commands here or chit-chat — doing so may result in the deletion of your application. Before you apply, be sure to take a look at <#803665236523221033> and good luck!"),
		] });
	},
};