const Discord = require("discord.js");

module.exports = {
	name: "get",
	aliases: ["get", "getv"],
	description: "gets a value from the database and returns it. (also shows its data type and how it is formatted by the interpreter)",
	usage: "<user> <key>",
	category: "own",
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst.split(";");

		if (args.length < 2) return message.reply("You must specify a user and a key");
		const user = await client.config.fetchUser(args[0]);
		if (!user) return message.reply("You must specify a user for this command to work!");
		const key = args.slice(1).join(" ");
		if (!key) return message.reply("You must provide a `<key>`; refer to <#726059916791644291> for further details");
		let x = await client.db.get(key + user.id);
		if (!x) return message.reply("null");
		const ot = typeof x;
		if (typeof x == "object") x = "```json\n" + JSON.stringify(x) + "\n```";
		if (x.toString().length <= 4069 && (!cst.includes("tgt"))) {
			message.reply({
				embeds: [
					new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(x)
						.setFooter(ot)
						.setTimestamp(),
				],
			});
		}
		else {
			const msgs = Discord.Util.splitMessage(x.toString(), { char: "" });
			for (const msg of msgs) {
				message.channel.send({
					content: msg,
					messageReference: message.id,
					failIfNotExists: false,
				});
			}
		}
	},
};