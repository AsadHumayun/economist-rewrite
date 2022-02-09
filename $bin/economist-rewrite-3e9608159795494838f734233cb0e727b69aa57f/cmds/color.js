const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "color",
	category: "utl",
	aliases: ["color", "colour", "setcolor", "setcolour", "set-color", "set-colour"],
	description: "Changes your colour prefrence (custom color on embeds) you must have the colorist role in the main server",
	usage: "<hexCode>",
	cst: "colorist",
	async run(client, message, args) {
		if (!args.length) {
			const clrs = await client.db.get("clr" + message.author.id) || `${client.config.defaultHexColor};0`;
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setTitle(`${message.author.tag}'s Colour Preferences`)
						.setDescription(`Every time you use a command, each colour is cycled through sequentially. The last value is where the bot is currently at in your cycle. \n\n\`\`\`js\n${client.config.Inspect(clrs.split(";"))}\`\`\``),
				],
			});
		}

		const colors = args
			.map((arg) => {
				const color = `#${arg.replace(/#+/g, "").slice(0, 6)}`;
				if (/^#([a-f\d]{6}|[a-f\d]{3})$/i.test(color)) {
					return color;
				}
				return false;
			});

		if (colors.includes(false)) {
			return message.reply("One of your provided hex colour codes is not valid, please check all values and try again. To add more than one colour, simply separate each one by spaces. If you're still having trouble, feel free to contact `" + client.users.cache.get(client.config.owner).tag + "`");
		}

		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has set their colour preferences to \`${client.config.Inspect(colors)}\`. Use \`${message.guild ? message.guild.prefix : client.const.prefix}color\` to view a list of all your currently set colours.`),
			],
		});
		colors.push("0");
		await client.db.set("clr" + message.author.id, colors.join(";"));
	},
};