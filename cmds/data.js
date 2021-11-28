const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: 'data',
	aliases: ['getdata', 'data', 'store', 'gd'],
	category: 'utl',	
	description: "View a User's stored data",
	cst: "gdt",
	async run(client, message, args) {
		/**
		 * This function will show all stored data regarding a User.
		 * @param {object} user Target user whose data must be shown 
		 */
		async function data(user = message.author) {
			let cstmk = await client.db.get("cstmk" + user.id) || "";
			let Keys = client.keys.concat(cstmk.split(";").concat(["user"]));

			var shown = [];
			Promise.all(
				Keys.map(async(x) => {
					if (shown.includes(x)) {
						return false;
					};
					shown.push(x);
					if (x == "user") return `user=[${user.tag}, ${user.id}]`;
					const value = await client.db.get(`${x}${user.id}`);
					if (value) {
						if (typeof value == "object") {
							const data = Object.entries(value).map((x) => {
								if (typeof x[1] == "object") {
									return "[this.key=" + x[0] + ";" + Object.entries(x[1]).map((z) => z.join(";")).join(";") + "]"
								} else {
									return x.join(";");
								}
							}).join(";");
							return `${x}=${data || "{}"}\n${x}.type=Object`;
						}
						return `${x}=${value}`;
					} else {
						return false;
					};
				})
			)
				.then((f) => f.filter((a) => a != false))
					.then((data) => {
						return message.reply(data, { code: "", split: { char: "" } })
					});
		};
		if (!args.length) args = [message.author.id];
		let user = await client.config.fetchUser(args[0]).catch((x) => {});
		if (!user) {
			user = message.author;
		};
		await data(user);
	},
};