import { MessageEmbed } from "discord.js";

export default {
	name: "assign",
	aliases: ["assign", "assignupgr"],
	description: "Assigns access to your currently owned or co-owned dragon aliases",
	async run(client, message, args) {
		if (args.length < 2) return message.reply(`You msut folloe the format of \`${message.guild?.prefix || "~"}assign <user> <dragon alias | upgrade>\` in order for this command to work!`);
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		const kw = args[1];
		if (!user) return message.reply({ content: `Unknown user "${args[0]}"`, allowedMentions: { parse: [] } });
		let upgr = message.author.data.get("upgr")?.split(";") || [];
		if (upgr.length < 2) return message.reply("You don't have any assignable dragon aliases!");
		upgr = client.utils.listToMatrix(upgr, 2);
		const keys = upgr.map((f) => f[0]);
		if (!keys.includes(kw)) return message.reply({ content: `Unknown upgr "${kw}"; \`${message.guild?.prefix || "~"}upgrs\` to view a list of assignable upgrades`, allowedMentions: { parse: [] } });
		const data = await client.db.getUserData(user.id);
		let cst = data.get("cst")?.split(";") || [];
		const tupgr = upgr.find((f) => f[0] === kw);
		if (cst.includes(tupgr[1])) {
			cst = cst.filter((f) => ![tupgr[1]].includes(f));
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${user.tag} has lost the ${kw} upgrade`),
				],
			});
		}
		else {
			cst.push(tupgr[1]);
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${user.tag} has received the ${kw} upgrade`),
				],
			});
		}
		client.db.USERS.update({
			cst: cst.join(";"),
		}, {
			where: {
				id: user.id,
			},
		});
	},
};