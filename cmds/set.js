const Discord = require("discord.js");

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
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst.split(";");
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
		let cstmk = await client.db.get("cstmk" + user.id);
		cstmk = cstmk ? cstmk.split(";") : [];
		if (!cstmk.includes(key) && (!client.keys.includes(key))) {
			cstmk.push(key);
			await client.db.set("cstmk" + user.id, cstmk.join(";"));
		}
		await client.db.set(key + user.id, val)
			.catch(async (err) => {
				client.Notify(err, `${Math.trunc(Date.now() / 60_000)} (${message.guild.name} (${message.guild.id})):[${message.channel.name}]<${message.author.tag} (${message.author.id})>: "${message.content}"`);
			});
		if (!cst.includes("tst")) {
			message.reply({
				embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Successfully set ${key} ${user.id} as ${typeof val == "object" ? JSON.stringify(val) : client.inspect(val)} with type \`${typeof val}\``),
			}).catch((x) => {
				message.reply("Encountered error: `" + x + "`. Resending message...");
				message.reply(`Successfully set ${key} ${user.id} (value too large to display) with type \`${typeof val}\``);
			});
		}
		else {
			message.reply(`Successfully set ${key} ${user.id} as ${client.config.trim(typeof val == "object" ? JSON.stringify(val) : client.config.Inspect(val), 1900)} with type \`${typeof val}\``);
		}
		if (typeof val == "boolean") {
			message.reply("Caution: Setting a value to `Boolean<false>` will simply remove it (set it as `null` thereby removing it).");
		}
		/*		client.channels.cache.get(client.config.channels.set)
			.send({
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setTimestamp()
				.setFooter(`${message.author.tag} | ${message.author.id}`)
				.setTitle(`Value Updated`)
				.addField("Key", key, true)
				.addField("New Value", client.trim(val, 1024), true)
				.addField("\u200b", "\u200b", true)
				.addField("Target User", `${user.tag} | ${user.id}`)
				.addField("Data Type", `\`${typeof val}\``, true)
				.setThumbnail(message.author.displayAvatarURL())
			})*/
	},
};