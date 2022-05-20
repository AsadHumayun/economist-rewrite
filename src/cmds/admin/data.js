"use strict";
import { Util } from "discord.js";

export default {
	name: "data",
	aliases: ["getdata", "data", "gd", "userdata"],
	usage: "<id: Snowflake(User | Channel | Guild)>",
	description: "View stored data in context of a Snowflake ID. This command provides support for channel, user, and guild snowflakes.",
	logAsAdminCommand: true,
	cst: "gdt",
	async run(client, message, args) {
		/**
		 * This function will determine what the supplied snowflake is linked to - a Discord User, Channel, or Guild?
		 * @param {string} snowflake Discord snowflake (supplied by user running the command)
		 * @returns {string|boolean} one of (`"channel"`, `"guild"`, `"user"`, `false`)
		 */
		async function determineSnowflakeType(snowflake) {
			if (client.channels.cache.get(snowflake)) {
				return "channel";
			}
			else if (client.guilds.cache.get(snowflake)) {
				return "guild";
			}
			else {
				try {
					await client.db.getUserData(snowflake);
					return "user";
				}
				catch (e) {
					return false;
				}
			}
		}
		/**
		 * This functions dissects the JSON data fetched from the database, and compiles it into a key=value format, and sends it off to the current channel.
		 * @param {JSON} data
		 */
		async function dissect(data) {
			if (!data) return message.reply({ content: `No results matching query "${query}"`, allowedMentions: { parse: [] }});
			const entries = Object.entries(data.toJSON()).filter((e) => !["", null].includes(e[1])).map(e => `${e[0]}=${e[1]}`).join("\n");
			Util.splitMessage(entries, { maxLength: 1992, char: "" }).forEach((msg) => message.channel.send(`\`\`\`\n${msg}\n\`\`\``));
		}
		if (!args.length) args[0] = message.author.id;
		const query = args[0].replace(/[<>@#!]/gmi, "");
		const type = await determineSnowflakeType(query);
		switch (type) {
		case "user":
			await client.db.USERS.findOne({ where: { id: query } }).then((data) => dissect(data));
			break;
		case "channel":
			await client.db.CHNL.findOne({ where: { id: query } }).then((data) => dissect(data));
			break;
		case "guild":
			await client.db.GUILDS.findOne({ where: { id: query } }).then((data) => dissect(data));
			break;
		default:
			message.reply({ content: `Invalid ID "${query}"`, allowedMentions: { parse: [] } });
			break;
		}
	},
};