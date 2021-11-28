const Discord = require('discord.js');

module.exports = {
	name: 'set',
	aliases: ['set', 's'],
	description: 'sets a value with key `<key>` and value `<value>` in the database',
	usage: '<key> <value>',
	cst: "administrator132465798",
	category: 'own',
	async run(client, message, args) {
		if (args.length < 3) return message.reply("You must specify a user, key and value.");
		let user = await client.config.fetchUser(args[0]).catch((x) => {});
		if (!user) return message.reply("You must specify a user for this command to work!");
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		let key = args[1];
		let val = args.slice(2).join(" ");
		if(!key || (!val)) return message.reply("You must provide a `<key>` and `<value>`; refer to <#726059916791644291> for further details");
		if (val.startsWith('"') && (val.endsWith('"'))) {
			val = String(val).slice(1, -1);
		} else {
			if (!isNaN(val)) val = Number(val);
			if (val.toString().toLowerCase() == "true") val = true;
			if (val.toString().toLowerCase() == "false") val = false;
			try {
				val = JSON.parse(val);
			} catch (e) {

			};
		};
		let cstmk = await client.db.get("cstmk" + user.id);
				cstmk = cstmk ? cstmk.split(";") : [];
		if (!cstmk.includes(key) && (!client.keys.includes(key))) {
			cstmk.push(key);
			await client.db.set("cstmk" + user.id, cstmk.join(";"));
		};
		await client.db.set(key + user.id, val)
			.catch(async(err) => {
				await client.db.set(key + user.id, val);
				message.reply({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`There was an error whilst setting this variable with a specific data type — ${key + user.id}. This operation has been re-attempted.`)
				})
			});
		if (!cst.includes("tst")) {
			message.reply({
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Successfully set ${key} ${user.id} as ${typeof val == "object" ? JSON.stringify(val) : client.inspect(val)} with type \`${typeof val}\``)
			}).catch((x) => {
				console.log(val, typeof val)
				message.reply(`Successfully set ${key} ${user.id} (value too large to display) with type \`${typeof val}\``)
			})
		} else {
			message.reply(`Successfully set ${key} ${user.id} as ${typeof val == "object" ? JSON.stringify(val) : client.inspect(val)} with type \`${typeof val}\``, { split: { char: "" } });
		};
		if (typeof val == "boolean") {
			 message.reply("Due to algebraic operations performed by computers on booleans, it's not possible to set values as false within its primitive data type. If this is done, then the value becomes null.");
		};
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
}