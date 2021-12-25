const Discord = require("discord.js");

module.exports = {
	name: "get",
	aliases: ["get", "getv"],
	description: "gets a value from the database and returns it. (also shows its data type and how it is formatted by the interpreter)",
	usage: "<user> <key>",
	logAsAdminCommand: true,
	category: "own",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must specify a user and a key");
		const user = await client.config.fetchUser(args[0]);
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const data = await client.db.getUserData(user.id);
		const key = args.slice(1).join(" ");
		let x = data.get(key);
		const ot = typeof x;
		if (typeof x == "object") x = "```json\n" + JSON.stringify(x) + "\n```";
		if (x.toString().length <= 4069 && (!(message.author.data.get("cst") || "").split(";").includes("tgt"))) {
			message.reply({
				embeds: [
					new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(x.toString())
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