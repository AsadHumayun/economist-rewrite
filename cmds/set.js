const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "set",
	aliases: ["set", "s"],
	description: "sets a value with key `<key>` and value `<value>` in the database",
	usage: "<key> <value>",
	cst: "administrator132465798",
	category: "own",
	async run(client, message, args) {
		if (args.length < 3) return message.reply("You must specify a user, key and value.");
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You must specify a user for this command to work!");
		await client.db.getUserData(user.id);
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		const key = args[1];
		let val = args.slice(2).join(" ");
		if (!key || (!val)) return message.reply("You must provide a `<key>` and `<value>` in order for this command to work!");
		if (val.startsWith("\"") && (val.endsWith("\""))) {
			val = String(val).slice(1, -1);
		}
		else {
			if (!isNaN(val)) val = Number(val);
			if (val.toString().toLowerCase() == "true") val = true;
			if (val.toString().toLowerCase() == "false") val = false;
			try {
				val = JSON.parse(val);
			}
			catch (e) {
				// eslint-disable-line no-empty
			}
		}
		await client.db.USERS.update({
			[key]: val,
		}, {
			where: {
				id: user.id,
			},
		})
			.then((resp) => {
				if (resp[0] == 0) {
					return message.channel.send({ content: `Failed to set ${key} ${user.id}: \`No column by name "${key}" exists.\``, allowedMentions: { parse: [] } });
				}
				else if (!cst.includes("tst")) {
					message.reply({
						embeds: [
							new MessageEmbed()
								.setColor(message.author.color)
								.setDescription(`Successfully set ${key} ${user.id} as ${typeof val == "object" ? JSON.stringify(val) : client.config.Inspect(val)} with type \`${typeof val}\``),
						],
					}).catch((x) => {
						message.reply("Encountered error: `" + x + "`. Resending message...");
						message.reply(`Successfully set ${key} ${user.id} (value too large to display) with type \`${typeof val}\``);
					});
				}
				else {
					message.reply(`Successfully set ${key} ${user.id} as ${client.config.trim(typeof val == "object" ? JSON.stringify(val) : client.config.Inspect(val), 1900)} with type \`${typeof val}\``);
				}
			});
	},
};