import { MessageEmbed } from "discord.js";

export default {
	name: "messageDelete",
	once: false,
	async execute(client, message) {
		if (message.channel.type == "DM" || message.guild.id !== client.const.supportServer) return;
		if (!message.content) return;
		const { executor } = (await message.guild.fetchAuditLogs({ limit: 1, type: "MESSAGE_DELETE" })).entries.first();
		if (!message.author.bot) {
			const channel = await client.db.CHNL.findOne({ where: { id: message.channel.id } });
			if (channel) {
				await client.db.CHNL.update({ snipe: `${message.author.id};${Buffer.from(message.content).toString("base64")}` }, { where: { id: message.channel.id } });
			}
			else {
				await client.db.CHNL.create({
					id: message.channel.id,
					// encoded to base64 so if the user has a ; in the message, it gets encoded into its base64 equivalent. Prevents ~snipe from functioning unexpectedly.
					snipe: `${message.author.id};${Buffer.from(message.content).toString("base64")}`,
				});
			}
		}
		// todo: add support for logging images.
		const embed = new MessageEmbed()
			.setColor(client.const.colors.red)
			.setAuthor({ name: `Deleted by ${executor ? `${executor.tag} (${executor.id})` : "UNKNOWN#0000"}\n`, iconURL: executor?.displayAvatarURL({ dynamic: true }) })
			.setTitle(`Message sent by ${message.author.tag} (${message.author.id}) deleted in #${message.channel.name}`)
			.setDescription(message.content)
			.setFooter(`Messgae ID: ${message.id}`)
			.setTimestamp();
		client.channels.cache.get(client.const.channels.msgLogs).send({ embeds: [ embed ] }).catch(() => {return;});
	},
};