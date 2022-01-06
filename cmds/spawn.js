"use strict";

export default {
	name: "spawn",
	aliases: ["spawn"],
	description: "Spawns a briefcase in the current channel",
	category: "own",
	cst: "spawn",
	async run(client, message) {
		const channel = await client.db.CHNL.findOne({ where: { id: message.channel.id } });
		if (channel.get("pkg")) {
			return message.reply(`There is already a briefcase in this channel! Steal it with \`${message.guild.prefix}steal\``);
		}
		else {
			message.reply(`Someone just dropped their :briefcase: briefcase in this channel! Hurry up and steal it with \`${message.guild.prefix}steal\`!`);
			await client.db.CHNL.update({
				pkg: true,
			}, {
				where: {
					id: message.channel.id,
				},
			});
		}
	},
};