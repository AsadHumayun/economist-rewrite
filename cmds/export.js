const { Util } = require("discord.js");
const delay = require("delay");

module.exports = {
	name: "export",
	aliases: ["export"],
	description: "Exports all entries out of the database, either into a txt file, or sends it via DM. Good for periodically backing up the database.",
	owner: true,
	cst: "exportdata",
	async run(client, message, args) {
		if (!args.length) return message.channel.send("You must specify a model to export in order for this command to work!");
		const opts = ["USER", "GUILD", "CHANNEL", "BUG"];
		const option = opts.findIndex((opt) => opt.startsWith(args[0].toUpperCase()));
		if (option < 0) return message.reply({ content: `Invalid model "${args[0]}"; valid models are [${opts.join(", ")}]`, allowedMentions: { parse: [] } });
		const msg = await message.channel.send({ content: "Fetching database values..." });
		const start = Date.now();
		let entries = await client.db[option == 2 ? "CHNL" : opts[option] + "S"].findAll().then((arr) => arr.map((entry) => entry.toJSON()));
		await msg.edit({ content: "Compiling entries..." });
		entries = entries.map((entry) => {
			// remove null values and return base64 encoded
			for (const key of Object.keys(entry)) {
				// note the use of strict === comparison - prevents something with a value of "null" as opposed to null being removed.
				if (entry[key] === null) {
					console.log(`Deleted key ${key}`);
					delete entry[key];
				}
				else {continue;}
			}
			return Buffer.from(require("util").inspect(entry, { depth: null })).toString("base64");
		});
		await msg.edit({ content: `Successfully compiled ${entries.length} ${opts[option]} models in ${Date.now() - start} ms.` });
		const msgs = Util.splitMessage(entries.join(";"), { maxLength: 2000, char: "" });
		await message.author.send(`[Sequelize => Backup (${new Date().toISOString()})]: MODEL=<${opts[option]}>`);
		for (const dm in msgs) {
			// delaying ensures that all messages are sent in correct order, which is absolutely necessary for exported data to be of any use.
			await delay(200);
			await message.author.send(msgs[dm]);
		}
		/**
		 right now, entries = [ {id:,bal:,etc}, {id:,bal:,etc} ]
		 */
	},
};