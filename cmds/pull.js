"use strict";
const { exec } = require("child_process");

export default {
	name: "pull",
	aliases: [],
	description: "",
	usage: "",
	category: "own",
	cst: "pull",
	disabled: true,
	async run(client, message) {
		// this command basically runs the script defined in package.json - also it basically pulls the latest commits from the github repo.
		if (![client.config.owner].includes(message.author.id)) {
			return message.reply("Wha? Why would you ever want to use this command?");
		}
		message.react("👌");
		exec("npm run pull");
	},
};