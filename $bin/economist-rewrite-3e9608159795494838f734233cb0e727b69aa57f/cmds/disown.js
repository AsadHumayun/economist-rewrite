const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	name: "disown",
	aliases: ["disown"],
	description: "This **deletes** your dragon. **THIS ACTION CAN NOT AND WILL NOT BE UNDONE.**",
	category: "pet",
	cst: "dragon",
	async run(client, message) {
		const pet = await client.db.get("pet" + message.author.id) || client.config.statics.defaults.dragon;
		const buttons = [
			new MessageButton()
				.setStyle("SUCCESS")
				.setCustomId("0")
				.setLabel("Keep dragon!"),
			new MessageButton()
				.setStyle("DANGER")
				.setCustomId("1")
				.setLabel("Delete dragon!"),
		];
		const row = new MessageActionRow().addComponents(buttons);
		const filter = (interaction) => {
			interaction.deferUpdate();
			return interaction.user.id == message.author.id;
		};
		// The user will know the command is directed at them because they bot will mention them (allowedMentions.repliedUser)
		const msg = await message.reply({ content: "Are you sure that you would like to disown your dragon? Expires in 30 seconds from sending this message.", components: [row], allowedMentions: { parse: [], repliedUser: true } });
		msg.awaitMessageComponent({ filter, componentType: "BUTTON", time: 30_000 })
			.then(async (interaction) => {
				if (interaction.customId == "1") {
					// user chose to delete dragon
					client.channels.cache.get(client.config.statics.defaults.channels.dsl).send({ content: `Drgn disowned at ${new Date().toISOString()} by U:${message.author.tag}(${message.author.id})\n${pet}` });
					await client.db.delete("pet" + message.author.id);
					let cst = await client.db.get("cst" + message.author.id);
					cst = cst ? cst.split(";") : [];
					cst = cst.filter((f) => !["dragon"].includes(f));
					await client.db.set("cst" + message.author.id, cst.join(";"));
					return msg.edit({
						embeds: [
							new MessageEmbed()
								.setColor(message.author.color)
								.setDescription(`${message.author.tag} has disowned their dragon :cry:`),
						],
						content: null,
						components: [],
					});
				}
				else {
					return msg.edit({
						content: `Wise choice, ${message.author.tag}. Your dragon is still with you :)`,
						components: [],
					});
				}
			})
			.catch(() => {
				return msg.edit({
					content: "You didn't choose an option in time. The command was cancelled.",
					components: [new MessageActionRow().addComponents(buttons.map((btn) => btn.setDisabled()))],
				});
			});
	},
};