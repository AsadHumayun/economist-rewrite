const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "dm",
	aliases: ["dm"],
	description: "DMs a user (bot dev only)",
	category: "own",
	logAsAdminCommand: true,
	cst: "dm",
	async run(client, message, args) {
		// by doing args[0]||"", it means that args[0] will a) never be undefined, and b) will mean that the user fetch request still fails, therefore the if statement below it triggers. This saves me from having to write in ANOTHER if statement.
		const user = await client.config.fetchUser(args[0] || "").catch(() => {return;});
		if (!user) return message.reply("You must mention the recipient in order for this command to work!");

		const msg = args.slice(1).join(" ");
		if (!msg) return message.reply("You must include a message.");
		let uclr = await client.db.get("clr" + user.id) || "#00aaaa;0";
		uclr = uclr.split(";");
		// uclr[uclr.length - 1]: the last number tells you where the bot is in its colour cycle. This is updated b4 each command use in index.js.
		const clr = uclr[uclr.length - 1];
		const emb = new MessageEmbed()
			.setColor(clr)
			.setDescription(msg)
			.setFooter(`Sent by: ${message.author.tag}(${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }));
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${user.tag} has been sent the following message:`),
			],
		});
		user.send({ embeds: [emb] })
			.then(() => {
				message.channel.send({ embeds: [emb] });
			})
			.catch((error) => {
				message.channel.send({
					content: `Unable to message U:${user.tag}(${user.id}): \`${error}\``,
				});
			});
	},
};