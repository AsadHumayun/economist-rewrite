const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "giverole",
	aliases: ["giverole", "gr"],
	description: "Assigns an assignable role to the mentioned user, only useable by the bot owner.",
	category: "own",
	cst: "ggr",
	// "ggr" standing for "give guild role"
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must specify a role<keyword> and member in order for this command to work!");
		"~giverole <user> <keyword> <hoist>";
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [ ] } });

		const Name = `${usr.tag}'s New Custom Role`;
		let roles = await client.db.get("cgrl" + usr.id);
		roles = roles ? roles.split(";") : [];
		roles = client.config.listToMatrix(roles, 2);
		const kw = args[1].toLowerCase();
		const kws = roles.map((x) => x[0]);
		if (kws.includes(kw)) return message.reply("That user already has a role by that keyword. Please choose a differnt one.");
		if (!args[2]) args[2] = "";
		const hoist = args[2].includes("-h");
		const role = await message.guild.roles.create({
			data: {
				name: Name,
				position: 9,
				color: "#000000",
				mentionable: false,
				hoist: hoist == true ? true : false,
				permissions: 0,
			},
			reason: `Creating an assignable role for ${usr.tag} (${usr.id}), with keyword "${kw}"\nU:${message.author.tag}(${message.author.id})`,
		});
		args[1] = args[1].toLowerCase();
		roles.push([kw, role.id]);
		roles = roles.map((f) => Array.from(f).join(";"));
		await client.db.set("cgrl" + usr.id, roles.join(";"));
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${client.config.statics.defaults.emoji.tick} ${usr.tag} now has an assignable role (ID ${role.id})`),
			],
		});
	},
};