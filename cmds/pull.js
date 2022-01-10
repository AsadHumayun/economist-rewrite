"use strict";
import { exec } from "child_process";

export default {
	name: "pull",
	aliases: [],
	description: "",
	usage: "",
	category: "own",
	cst: "pull",
	disabled: false,
	async run(client, message) {
		// this command basically runs the script defined in package.json - also it basically pulls the latest commits from the github repo.
		if (!client.const.owners.includes(message.author.id)) {
			return message.reply("Wha? Why would you ever want to use this command?");
		}
		message.react("👌");
		exec("git pull && git reset --hard origin/master && npm install && pm2 restart Economist", (error, output) => {
			if (error) return message.reply("Error on shell script: sent in DMs.") && message.author.send(error.stack);
			message.author.send(output);
		});
	},
};