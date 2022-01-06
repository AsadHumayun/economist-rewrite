import { MessageEmbed } from "discord.js";

export default {
	name: "guildMemberRemove",
	once: false,
	async execute(client, member) {
		if (member.guild.id != client.config.statics.supportServer) return;
		client.channels.cache.get(client.config.statics.defaults.channels.memberLog).send({
			embeds: [
				new MessageEmbed()
					.setTimestamp()
					.setColor("#da0000")
					.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
					.setFooter(`Member Left • ID: ${member.user.id}`, member.user.displayAvatarURL({ dynamic: true })),
			],
		});
	},
};