let Discord = require("discord.js");

module.exports = {
	name: "eval",
	aliases: ["run", "evaluate", 'eval', 'evalu8'],
	desc: "Takes some javascript code and evaluates it! This is limited to our bot developers as it is very powerful.",
	usage: "eval <code>",
	category: 'own',
	cst: "administrator132465798",
async run(client, message, args) {
	let devs = [client.config.owner, "523579776749928449", "208948873433972737"]

	if (!devs.includes(message.author.id)) { // (eval role id) 
		return message.reply("Wha? Why would you ever want to use this command?")	
	};

	msg = await message.reply(
		`**__E__valuating** Please Wait`
	);
	async function clean(text) {
		if (typeof(text) === "string")
			return await text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
				return await text;
	}

	try {
		async function escapeRegExp(str) {
			return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
		}
		let code = args.join(" ")
		if (!code) {
			return msg.edit("You need to give me some code to evaluate!")
		};
	//	code = code.toString().replace(new RegExp(escapeRegExp(client.token), 'g'), '/*token removed*/');
		
	//	if(code.includes('forEach') && (message.author.id != client.owner)) return msg.edit(process.env.re + ' forEach is forbidden!')
		if(code.includes('token')) return msg.edit('client token cannot be evaled!')
		if(code.includes('client[')) return msg.edit('client[ cannot be evaled!')
		if(code.includes('client [')) return msg.edit('client [ cannot be evaled!')
		let evaled;
			if (code instanceof Promise) {
				evaled = await eval(code);
			} else {
				evaled = eval(code);
			};
		if (typeof evaled !== "string")
			evaled = require("util")
				.inspect(evaled);
			let cleaned = await clean(evaled);
		 msg.edit("", {
			embed: new Discord.MessageEmbed()
			.setTitle("Evaluation Successful!")
			.setDescription(`\`\`\`xl\n${cleaned}\n\`\`\``)
			.setColor(message.author.color)
		});
	} catch (err) {
			msg.edit("", {
				embed: new Discord.MessageEmbed()
				.setTitle("Evaluation Unsuccessful")
				.setDescription(`\`\`\`xl\n${err}\n\`\`\``)
				.setColor([255, 0, 0])
			});
		};
	},
};