const { Util } = require("discord.js");

module.exports = {
	name: "data",
	aliases: ["getdata", "data", "store", "gd"],
	category: "utl",
	description: "View a User's stored data",
	logAsAdminCommand: true,
	cst: "gdt",
	async run(client, message, args) {
		let user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) user = message.author;
		const data = await client.db.getUserData(user.id);
		const entries = Object.entries(data.toJSON()).filter((e) => ![null, "", 0].includes(e[1])).map((e) => `${e[0]}=${e[1]}`).join("\n");
		Util.splitMessage(entries, { maxLength: 1992 }).forEach((msg) => message.channel.send(`\`\`\`\n${msg}\n\`\`\``));
	},
};