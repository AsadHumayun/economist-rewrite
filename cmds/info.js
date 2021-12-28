const { MessageEmbed } = require("discord.js");
const osu = require("node-os-utils");

module.exports = {
	name: "info",
	aliases: ["info", "stats", "uptime"],
	description: "View some bot infomation",
	category: "utl",
	async run(client, message) {
		const msg = await message.reply("Getting information... (this may take a second!)");
		const rgu = await client.db.USERS.count();
		const cmdCount = (client.user.data.get("cmds") || 0).toString();
		const cmd = (message.author.data.get("cmds") || 0).toString();
		const cpu = await osu.cpu.usage();

		msg.edit({
			content: null,
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle("Bot Stats")
					.setDescription("\"Users Cached\" is not entirely accurate as the same user can be counted multiple times on different guilds")
					.setAuthor({ name: client.user.tag, icon: client.user.avatarURL({ dynamic: true }), url: client.config.statics.ssInvite })
					.addField("❯ Registered Users", rgu.toString(), true)
					.addField("❯ Commands Used", `${client.config.comma(cmd)}/${client.config.comma(cmdCount)}`, true)
					.addField("❯ CPU Usage", `\`${cpu}%\``, true)
					.addField("❯ Created On", client.user.createdAt.toDateString(), true)
					.addField("❯ Users Cached", client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toString(), true)
					.addField("❯ Uptime", client.config.cooldown(message.createdTimestamp, message.createdTimestamp + client.uptime).toString() || "< 1s", true)
					.addField("❯ Memory Usage", `**~**${Math.trunc(process.memoryUsage().heapUsed / 1024 / 1024)}/${Math.trunc(process.memoryUsage().rss / 1024 / 1024)} MB`, true)
					.addField("❯ Total Commands", client.config.commands.size.toString(), true)
					.setFooter(`Ready: ${new Date(client.readyTimestamp).toISOString()}`),
			],
		});
	},
};