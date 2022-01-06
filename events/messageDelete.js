import { MessageEmbed } from "discord.js";
import * as moment from "moment";

export default {
	name: "messageDelete",
	once: false,
	async execute(client, message) {
		if (message.guild.id !== client.config.statics.supportServer) return;
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
		const embed = new MessageEmbed()
			.setColor(client.config.statics.defaults.colors.red)
			.setTitle("Message Deleted in #" + message.channel.name)
			.setDescription(`**Deleted By:** ${executor ? `${executor.tag} (${executor.id})` : "UNKNOWN#0000"}\n**Sent By:** ${message.author.tag} (${message.author.id})`)
			.addField("Message Sent At", moment(message.createdTimestamp))
			.setFooter("Deleted")
			.setTimestamp()
			.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL(), url: message.url });
		if (!message.content && (message.attachments.size)) {
			embed
				.setDescription(`Attachments Detected: ${message.attachments.map(x => `[Attachment](${x.url})`).join(" ")}`)
				.setImage(message.attachments.first().url.replace("cdn", "media").replace("com", "net"));
		}
		else {
			embed
				.setDescription(message["content"]);
		}
		client.channels.cache.get(client.config.statics.defaults.channels.msgLogs).send({ embeds: [ embed ] }).catch(() => {return;});
	},
};