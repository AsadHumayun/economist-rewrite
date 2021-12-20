const { Message } = require("discord.js");
const {cloneDeep} = require("lodash");
// Object.assign only did what we call a SHALLOW clone and didnt copy the methods and functions off the message.
// this led to commands throwing errors when executed.
// hence I have had to use lodash's cloneDeep in conjunction with Object.assign to achieve this result.

module.exports = {
	name: "execute",
	aliases: ["execute", "exec"],
	description: "Run a command as a certain user",
	cst: "administrator132465798",
	category: "own",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must specify a user and a command to execute as the user in order for this command to work!");
		const user = await client.config.fetchUser(args[0]);
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const cloned = JSON.parse(JSON.stringify(message));
		cloned.author = user;
		cloned.content = message.guild.prefix + args.slice(1).join(" ");
		cloned.emit = true;
		cloned.guild = message.guild;
		console.log(cloned);
		const Message1 = Object.assign(cloneDeep(message), {
			content: message.guild.prefix + args.slice(1).join(" "),
			author: user,
			emit: true,
		});
		console.log(Message1.reply);
		client.emit("messageCreate", cloned);
	},
};

// eslint-disable-next-line quotes
'~execute 501710994293129216 bal ';