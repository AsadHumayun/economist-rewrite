const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "disown",
	aliases: ["disown"],
	description: "This **deletes** your dragon. **THIS ACTION CAN NOT AND WILL NOT BE UNDONE.**",
	category: "pet",
	cst: "dragon",
	async run(client, message) {
		const pet = await client.db.get("pet" + message.author.id) || client.config.statics.defaults.dragon;
		const filter = m => m.author.id === message.author.id;
		await message.reply("Are you sure you want to disown your dragon? **This action cannot and will not be undone.** Reply with `y`. A response other than `y` will be considered as no.");
		// await here ensures that this message is sent before the collector starts.
		message.channel.awaitMessages({ filter: filter, max: 1, time: 10_000, errors: ["time"] }).then(async (c) => {
			if (c.first().content.toLowerCase() == "y") {
				client.channels.cache.get(client.config.statics.defaults.channels.dsl).send({ content: `Drgn disowned at ${new Date().toISOString()} by U:${message.author.tag}(${message.author.id})\n${pet}` });
				await client.db.delete("pet" + message.author.id);
				let cst = await client.db.get("cst" + message.author.id);
				cst = cst ? cst.split(";") : [];
				cst = cst.filter((f) => !["dragon"].includes(f));
				await client.db.set("cst" + message.author.id, cst.join(";"));
				return message.reply({
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`${message.author.tag} has disowned their dragon :cry:`),
					],
				});
			}
			else {message.reply("You didn't respond with `y`; I'll take that as a no.");}
		})
			.catch(() => {
				message.reply("`No response received. Dragon not deleted!`");
			});
	},
};