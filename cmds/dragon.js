const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "dragon",
	aliases: ["dragon", "d"],
	category: "pet",
	description: "View your dragon's stats",
	cst: "dragon",
	async run(client, message, args) {
		async function Embed(u) {
			let data = await client.db.get("pet" + u.id);
			const cst = await client.db.get("cst" + u.id) || "";
			if (!data) {
				await client.db.set("pet" + u.id, client.config.statics.defaults.dragon);
				data = client.config.statics.defaults.dragon;
			}
			if (!cst.includes("dragon") || (!data)) {
				return message.reply(`${message.author.id == u.id ? "You don't own a dragon!" : `${u.tag} does not own a dragon!`} Why not tame one by using \`${message.guild.prefix}tame\``);
			}
			if (u.bot == true || (cst.includes("maxdragon888"))) {
				data = client.config.statics.defaults.maxPet;
			}
			const alias = await client.config.getDragonAlias(message.author.id, client);
			console.log(alias);
			data = data.split(";");
			if (data.length < client.config.statics.defaults.intendedPetLength) return message.reply("Malformed dragon data; please contact an administrator in the support server and they'll gladly fix it for you!");
			const emb = new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`${u.tag}'s ${client.config.capital(alias[0])} [${cst.includes("maxdragon888") ? "∞" : data[0]}]`)
			// alias[0] is the alias.displayname - refer to ../config.js: Funcs.getDragonAlias (async function)
				.setDescription(`\`${message.guild.prefix}disown\` to disown your ${alias[0]} and delete it.\n\`${message.guild.prefix}feed\` to feed your ${alias[0]} and completely refill its energy.\n\`${message.guild.prefix}name <new name>\` to name your ${alias[0]}. (requires Supreme)\n\`${message.guild.prefix}stroke\` to stroke your ${alias[0]} and increase its affection by 1.\n\`${message.guild.prefix}search\` to get your ${alias[0]} to go out searching for fish and gain a certain amount of XP depending on your ${alias[0]}'s intellect.\n\`${message.guild.prefix}upgrade <stat> <amount>\` to upgrade \`<stat>\` by \`<amount>\` points, \`<amount>\` defaults to 1.\n\`${message.guild.prefix}downgrade <stat>\` to downgrade a stat by 1 point and receive ${alias[1][3]} 1 in return \`${message.guild.prefix}deprive <stat>\` to completely remove all invested ${alias[1][3]} on the stat and receive the appropriate amount of credits in return. For example, say a user has 5 total points on strength: \`${message.guild.prefix}deprive strength\` would set the strength stat to 1 and return 4 credits to the user.\n\`${message.guild.prefix}defend\` to toggle your ${alias[0]}'s protection     —     your ${alias[0]} must have at least 200 health in order for it successively to protect you from attackers.`)
				.addField(
					"Basic Stats",
					`
${alias[1][0]} Health — ${client.config.comma(client.config.noExponents(data[1]))}/10000
${alias[1][1]} Energy —  ${client.config.comma(client.config.noExponents(data[2]))}/100
`
					, true,
				)
				.addField(
					"Advanced Stats",
					`
${alias[1][2]} Experience — ${client.config.comma(client.config.noExponents(data[3]))}/${client.config.statics.reqs[Number(data[0]) - 1] ? client.config.comma(client.config.noExponents(client.config.statics.reqs[Number(data[0]) - 1])) : "∞"}
${alias[1][3]} Credits  — ${client.config.comma(client.config.noExponents(data[4]))}
${alias[1][4]} Intellect  — ${client.config.comma(client.config.noExponents(data[5]))}
${alias[1][5]} Endurance  — ${client.config.comma(client.config.noExponents(data[6]))}
${alias[1][6]} Strength —  ${client.config.comma(client.config.noExponents(data[7]))}
${alias[1][7]} Affection  — ${client.config.comma(client.config.noExponents(data[8]))}
${alias[1][8]} Glycogenesis — ${client.config.comma(client.config.noExponents(data[9]))}
`,
				);
			return message.reply({ embeds: [emb] });
		}
		// end function
		let usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) usr = message.author;
		Embed(usr);
	},
};