const { MessageEmbed } = require("discord.js");
const osu = require("node-os-utils");

module.exports = {
	name: "info",
	aliases: ["info", "stats", "uptime"],
	description: "View some bot infomation",
	category: "utl",
	async run(client, message) {
		const msg = await message.reply("Getting information... (this may take a second!)");
		const cmdCount = (client.user.data.get("cmds") || 0).toString();
		const cm = (message.author.data.get("cmds") || 0).toString();
		const mem = process.memoryUsage().heapUsed / 1024 / 1024;
		const cpu = await osu.cpu.usage();

		msg.edit({
			content: null,
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle("Bot Stats")
					.setDescription("\"Users Cached\" is not entirely accurate as the same user can be counted multiple times on different guilds")
					.setAuthor({ name: client.user.tag, icon: client.user.avatarURL({ dynamic: true }), url: client.config.statics.ssInvite })
					.addField("❯ Name", client.user.tag, true)
					.addField("❯ Commands Used", cmdCount, true)
					.addField("❯ Commands You've Used", cm, true)
					.addField("❯ CPU Usage", `\`${cpu}%\``, true)
					.addField("❯ Servers", client.guilds.cache.size.toString(), true)
					// discord.js docs ref: https://discord.js.org/#/docs/main/stable/class/ClientVoiceManager?scrollTo=adapters (for below field)
					.addField("❯ Voice Connections", client.voice.adapters.size.toString(), true)
					.addField("❯ Created On", client.user.createdAt.toDateString(), true)
					.addField("❯ Users Cached", client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toString(), true)
					.addField("❯ Roles Cached", client.guilds.cache.reduce((a, b) => a + b.roles.cache.size, 0).toString(), true)
					.addField("❯ Channels Cached", client.channels.cache.size.toString(), true)
					.addField("❯ Emoji Cached", client.emojis.cache.size.toString(), true)
					.addField("❯ Total Cached Files", Object.values(require.cache).length.toString(), true)
					.addField("❯ Total Cached Items", Number(client.guilds.cache.size + client.channels.cache.size + client.users.cache.size).toString(), true)
					.addField("❯ WS Status", String(client.ws.status), true)
					.addField("❯ Uptime", client.config.cooldown(message.createdTimestamp, message.createdTimestamp + client.uptime).toString() || "< 1s", true)
					.addField("❯ Memory Usage", `**~**${Math.trunc(mem)}/${Math.trunc(process.memoryUsage().rss / 1024 / 1024)} MB`, true)
					.addField("❯ Discord.js", `v**${require("discord.js").version}**`, true)
					.addField("❯ Total Commands", client.config.commands.size.toString(), true)
					.setFooter(`Ready: ${new Date(client.readyTimestamp).toISOString()}`),
			],
		});
	},
};