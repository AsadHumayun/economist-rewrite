let Discord = require("discord.js");
const { exec } = require("child_process");

module.exports = {
	name: "pull",
	aliases: [],
	description: "",
	usage: "",
	category: 'own',
    cst: "pull",
    async run(client, message, args) {
        if (![client.config.owner, "523579776749928449", "208948873433972737"].includes(message.author.id)) {
            return message.reply("Wha? Why would you ever want to use this command?");
        };
        message.react("👌");
        exec("npm run pull");
    },
};