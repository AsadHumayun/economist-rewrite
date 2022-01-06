import { MessageEmbed } from "discord.js";

export default {
	name: "messageUpdate",
	once: false,
	async execute(client, oldMessage, newMessage) {
		if (oldMessage.channel.type == "DM") return;
		if ((oldMessage.guild.id != client.config.statics.supportServer || (oldMessage.author.bot) || (oldMessage.content === newMessage.content))) return;
		client.channels.cache.get(client.config.statics.defaults.channels.msgLogs).send({
			embeds: [
				new MessageEmbed()
					.setAuthor({ name: `${newMessage.author.tag} (${newMessage.author.id})`, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }) })
					.setTitle(`Message Edited in #${oldMessage.channel.name}`)
					.setThumbnail(oldMessage.author.displayAvatarURL())
					.setColor("RANDOM")
					.addField("Old Message", client.config.trim(oldMessage.content, 1024), true)
					.addField("New Message", client.config.trim(newMessage.content, 1024), true)
					.setFooter(`Message ID: ${newMessage.id}`, newMessage.guild.iconURL({ dynamic: true }))
					.setTimestamp(),
			],
		});
	},
};