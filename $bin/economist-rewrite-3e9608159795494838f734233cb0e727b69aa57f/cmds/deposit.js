const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "deposit",
	aliases: ["deposit", "dep"],
	description: "Deposit money into your Bank Vault.",
	category: "ecn",
	cst: "bvault",
	cstMessage: "You must own a Bank Vault in order for this command to work!",
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst.split(";");
		if (!cst.includes("bvault")) return message.reply("You must own a Bank Vault in order to use this command!");
		if (isNaN(args[0]) || (Number(args[0]) <= 0)) return message.reply("You must enter a positive number");
		const dep = Number(args[0]);
		let bal = await client.db.get("bal" + message.author.id) || 0;
		bal = Number(bal);

		if (bal - dep < 0) return message.reply("Your current balance is insufficient to make this deposit.");
		let v = await client.db.get("vlt" + message.author.id) || "1;0";
		v = v.split(";");
		v[0] = Number(v[0]);
		v[1] = Number(v[1]);
		const capacity = v[0] * 5_000;
		let curr = v[1];
		if (curr + dep > capacity && (v[0] < 9999999999)) return message.reply(`Your vault does not have enough space to hold that much money; upgrade your vault with \`${message.guild ? message.guild.prefix : client.const.prefix}vupgrade\` in order to increase your Bank Vault's capacity!`);
		curr += dep;
		v[1] = curr;
		await client.db.set("bal" + message.author.id, bal - dep);
		await client.db.set("v" + message.author.id, v.join(";"));
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has deposited :dollar: ${dep} into their secure asf Bank Vault! They now have :dollar: ${v[1]} in their Bank Vault.`),
			],
		});
	},
};