import { MessageEmbed } from "discord.js";

export default {
	name: "guildMemberRemove",
	once: false,
	async execute(client, member) {
		if (member.guild.id != client.const.supportServer) return;
		client.channels.cache.get(client.const.channels.memberLog).send({
			embeds: [
				new MessageEmbed()
					.setTimestamp()
					.setColor("#da0000")
					.setDescription(`Created At: \`${member.user.createdAt.toISOString()}\`\nJoined At: \`${member.joinedAt.toISOString()}\``)
					.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
					.setFooter(`Member Left • ID: ${member.user.id}`),
			],
		});
	},
};