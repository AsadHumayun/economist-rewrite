const { Util } = require("discord.js");

module.exports = {
	name: "data",
	aliases: ["getdata", "data", "store", "gd"],
	category: "utl",
	description: "View a User's stored data",
	logAsAdminCommand: true,
	cst: "gdt",
	async run(client, message, args) {
		/**
		 * This function will show all stored data regarding a User.
		 * @param {object} user Target user whose data must be shown
		 */
		async function data(user = message.author) {
			const cstmk = await client.db.get("cstmk" + user.id) || "";
			const Keys = client.keys.concat(cstmk.split(";").concat(["user"]));

			const shown = [];
			Promise.all(
				Keys.map(async (x) => {
					if (shown.includes(x)) {
						return false;
					}
					shown.push(x);
					if (x == "user") return `user=[${user.tag}, ${user.id}]`;
					let value = await client.db.get(`${x}${user.id}`);
					if (value) {
						value = require("util").inspect(value, { depthL: 0 });
						return `${x}=${value}`;
					}
					else {
						return false;
					}
				}),
			)
				.then((f) => f.filter((a) => a != false))
				.then((fetchedData) => {
					fetchedData = Util.splitMessage(fetchedData.join("\n").toString(), { char: "\n", maxLength: 1992 });
					for (const msg of fetchedData) {
						message.reply({
							content: "```\n" + msg + "\n```",
						});
					}
				});
		}
		if (!args.length) args = [message.author.id];
		let user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) {
			user = message.author;
		}
		await data(user);
	},
};