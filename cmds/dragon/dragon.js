"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "dragon",
	aliases: ["dragon", "d"],
	description: "View your dragon's stats",
	cst: "dragon",
	cstMessage: "You do not own a pet dragon. You may purchase one with `{prefix}tame`!",
	async run(client, message, args) {
		async function Embed(u) {
			const userData = await client.db.getUserData(u.id);
			let data = userData.get("drgn");
			const cst = (userData.get("cst") || "").split(";");
			if (!cst.includes("dragon")) {
				return message.reply(`${message.author.id == u.id ? "You don't own a dragon!" : `${u.tag} does not own a dragon!`} Why not tame one by using \`${message.guild?.prefix || "~"}tame\``);
			}
			if (u.bot == true || cst.includes("maxdragon888")) {
				data = client.const.maxDragon;
			}
			const alias = await client.utils.getDragonAlias(message.author.id);
			data = data.split(";");
			if (data.length < client.const.intendedPetLength) return message.reply("Malformed dragon data; please contact an administrator in the support server and they'll gladly fix it for you!");
			const emb = new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`${u.tag}'s ${client.utils.capital(alias[0])} [${cst.includes("maxdragon888") ? "∞" : data[0]}]`)
			// alias[0] is the alias.displayname - refer to ../config.js: Funcs.getDragonAlias (async function)
				.setDescription(`\`${message.guild?.prefix || "~"}disown\` to disown your ${alias[0]} and delete it.\n\`${message.guild?.prefix || "~"}feed\` to feed your ${alias[0]} and completely refill its energy.\n\`${message.guild?.prefix || "~"}name <new name>\` to name your ${alias[0]}. (requires Supreme)\n\`${message.guild?.prefix || "~"}stroke\` to stroke your ${alias[0]} and increase its affection by 1.\n\`${message.guild?.prefix || "~"}search\` to get your ${alias[0]} to go out searching for fish and gain a certain amount of XP depending on your ${alias[0]}'s intellect.\n\`${message.guild?.prefix || "~"}upgrade <stat> <amount>\` to upgrade \`<stat>\` by \`<amount>\` points, \`<amount>\` defaults to 1.\n\`${message.guild?.prefix || "~"}downgrade <stat>\` to downgrade a stat by 1 point and receive ${alias[1][3]} 1 in return \`${message.guild?.prefix || "~"}deprive <stat>\` to completely remove all invested ${alias[1][3]} on the stat and receive the appropriate amount of credits in return. For example, say a user has 5 total points on strength: \`${message.guild?.prefix || "~"}deprive strength\` would set the strength stat to 1 and return 4 credits to the user.\n\`${message.guild?.prefix || "~"}defend\` to toggle your ${alias[0]}'s protection     —     your ${alias[0]} must have at least 200 health in order for it successively to protect you from attackers.`)
				.addField(
					"Basic Stats",
					`
${alias[1][0]} Health — ${client.utils.comma(client.utils.noExponents(data[1]))}/10000
${alias[1][1]} Energy —  ${client.utils.comma(client.utils.noExponents(data[2]))}/100
`
					, true,
				)
				.addField(
					"Advanced Stats",
					`
${alias[1][2]} Experience — ${client.utils.comma(client.utils.noExponents(data[3]))}/${client.const.reqs[Number(data[0]) - 1] ? client.utils.comma(client.utils.noExponents(client.const.reqs[Number(data[0]) - 1])) : "∞"}
${alias[1][3]} Credits  — ${client.utils.comma(client.utils.noExponents(data[4]))}
${alias[1][4]} Intellect  — ${client.utils.comma(client.utils.noExponents(data[5]))}
${alias[1][5]} Endurance  — ${client.utils.comma(client.utils.noExponents(data[6]))}
${alias[1][6]} Strength —  ${client.utils.comma(client.utils.noExponents(data[7]))}
${alias[1][7]} Affection  — ${client.utils.comma(client.utils.noExponents(data[8]))}
${alias[1][8]} Glycogenesis — ${client.utils.comma(client.utils.noExponents(data[9]))}
`,
				);
			return message.reply({ embeds: [ emb ] });
		}
		// end function
		let usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) usr = message.author;
		Embed(usr);
	},
};