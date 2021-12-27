const Discord = require("discord.js");
const { inspect } = require("util");

module.exports = {
	name: "eval",
	aliases: ["run", "evaluate", "eval", "evalu8"],
	desc: "Takes some javascript code and evaluates it! This is limited to our bot developers as it is very powerful.",
	usage: "eval <code>",
	category: "own",
	cst: "administrator132465798",
	async run(client, message, args) {
		// eval command is very powerful and dangerous.
		// allows for a user to execute a piece of code.
		// alllowed people are only myself (the ID in config.js ClientConfiguration class),
		const devs = [client.config.owner, "757958112992034918"];

		if (!devs.includes(message.author.id)) {
			// they get denied access.
			return message.reply("Wha? Why would you ever want to use this command?");
		}

		if (message.emit) {
			return message.reply("This command cannot be executed on a fakely-emitted `messageCreate` event.");
		}

		const msg = await message.reply("**__E__valuating** Please Wait");
		// source: https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/examples/making-an-eval-command.md
		const clean = async (text) => {
			if (text && text.constructor.name == "Promise") {text = await text;}
			if (typeof text !== "string") {text = inspect(text, { depth: 0 });}
			text = text
				.replace(/`/g, "`" + String.fromCharCode(8203))
				.replace(/@/g, "@" + String.fromCharCode(8203));
			return text;
		};
		try {
			const code = args.join(" ");
			if (!code) {
				return msg.edit("You need must provide some code to evaluate in order for this command to work!");
			}
			const s = Date.now();
			if (code.includes("token")) return msg.edit("client token cannot be evaled!");
			if (code.includes("client[")) return msg.edit("client[ cannot be evaled!");
			if (code.includes("client [")) return msg.edit("client [ cannot be evaled!");
			const ev = eval(args.join(" "));
			let cleaned = await clean(ev);
			cleaned = cleaned.toString();
			msg.edit({
				content: null,
				embeds: [
					new Discord.MessageEmbed()
						.setColor(client.config.statics.defaults.colors.green)
						.setTitle("Successfully evaluated in " + (Date.now() - s) + " ms")
						.setFooter(new Date(message.createdTimestamp).toISOString())
						.setDescription(`\`\`\`\n${client.config.trim(cleaned, 4090)}\n\`\`\``),
				],
			});
		}
		catch (err) {
			msg.edit({
				content: null,
				embeds: [
					new Discord.MessageEmbed()
						.setTitle("Error")
						.setDescription(`\`\`\`\n${err}\n\`\`\``)
						.setColor([255, 0, 0])
						.setFooter(new Date(message.createdTimestamp).toISOString()),
				],
			});
		}
	},
};