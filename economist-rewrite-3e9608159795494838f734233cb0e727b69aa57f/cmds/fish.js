const { MessageEmbed } = require("discord.js");
const delay = require("delay");

module.exports = {
	name: "fish",
	aliases: ["cast", "fish"],
	description: "Allows you to go fishing!\nCosts :dollar: 50",
	category: "ecn",
	async run(client, message) {
		let cst = await client.db.get("cst" + message.author.id);
		cst = cst ? cst.split(";") : [];
		if (!cst.includes("fishrod")) return message.reply(`You need a ${client.config.statics.defaults.emoji.fishing_rod} in order to go fishing! \`${message.guild.prefix}shop\``);

		const cd = await client.db.get("fishc" + message.author.id);
		const scnd = client.config.cooldown(message.createdTimestamp, cd * 60_000);
		if (scnd) {
			return message.reply(`Please wait another ${scnd} before fishing, otherwise your rod will break!`);
		}
		await client.db.set("fishc" + message.author.id, client.config.parseCd(message.createdTimestamp, 20_000, true));
		const fishes = [
			":dolphin:",
			":shark:",
			":blowfish:",
			":tropical_fish:",
			":fish:",
		];
		const bal = await client.db.get("bal" + message.author.id) || 0;
		message.channel.send({ embeds: [ new MessageEmbed().setDescription(`${message.author.tag} locates their ${client.config.statics.defaults.emoji.fishing_rod} and goes fishing...`).setColor(message.author.color) ] });
		await delay(2000);
		const Fish = Math.floor(Math.random() * fishes.length);
		const fish = fishes[Fish];
		const amtGained = Math.floor(Math.random() * 250 / 5);
		let dollarsEarned = Math.round(amtGained / 5) * 10;
		// todo: merge fsh into an itms key or something similar.
		let f = await client.db.get(`fsh${message.author.id}`) || "0;0;0;0;0;0";
		f = f.split(";");
		f[Fish] = Number(f[Fish]) + amtGained;
		await client.db.set(`fsh${message.author.id}`, f.join(";"));
		if (fishes[fish] == ":dolphin:") dollarsEarned = (dollarsEarned * 2) * amtGained;
		if (fishes[fish] == ":shark:") dollarsEarned = (dollarsEarned / 2) * amtGained;
		if (fishes[fish] == ":blowfish:") dollarsEarned = 0;
		if (fishes[fish] == ":tropical_fish:") dollarsEarned = (dollarsEarned * 3) * amtGained;
		if (fishes[fish] == ":fish:") dollarsEarned = 10 * amtGained;
		message.channel.send({ embeds: [ new MessageEmbed().setDescription(`${message.author.tag} sits down near a calm pool of water... :droplet:`).setColor(message.author.color) ] });
		await delay(2000);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has found a school of ${fish}...`),
			],
		});
		await delay(2000);
		if (fishes[fish] != ":blowfish:") {
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has caught ${fish} ${amtGained} and earnt :dollar: ${dollarsEarned}`),
				],
			});
			await client.db.set(`bal${message.author.id}`, Number(bal + dollarsEarned));
		}
		else {
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Due to the blowfish having spikes, ${message.author.tag} is unable to catch enough of them and ends up wasting their time :(`),
				],
			});
		}
	},
};