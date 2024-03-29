﻿"use strict";
/**
 * 
 * @author asadhumayun
 */

import { Collection, Client, Options, Intents } from "discord.js";
import { config } from "dotenv";
import { EventHandler } from "./events/EventHandler.js";
import { Logger } from "./utils/Logger.js";
import { Utils, Constants } from "./utils/utils.js";
import { dbInit } from "./utils/dbInit.js";

/**
 * The currently instantiated Discord Client.
 * @type {Discord.Client}
 */
const client = new Client({
	// Overriding the cache used in GuildManager, ChannelManager, GuildChannelManager, RoleManager
	// and PermissionOverwriteManager is unsupported and will break functionality
	makeCache: Options.cacheWithLimits({
		MessageManager: 100,
		GuildMemberManager: 100,
		PresenceManager: 0,
		GuildStickerManager: 0,
		GuildInviteManager: 0,
		GuildBanManager: 0,
	}),
	allowedMentions: { parse: [], repliedUser: false },
	intents: new Intents([
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.DIRECT_MESSAGES,
	]),
	// enable commands in DMChannels
	partials: ["CHANNEL"],
});

client.utils = new Utils(client);
process.logger = new Logger(client);

const {
	sequelize,
	Users,
	Channels,
	Guilds,
	Bugs,
} = dbInit();

process.logger.info("INIT", "Defining models...");

client.db = {
	USERS: Users,
	CHNL: Channels,
	BUGS: Bugs,
	GUILDS: Guilds,
	/**
	 * Returns the data for a user.
	 * Creates an account for the user in the database if none found.
	 * @param {string} uid Discord User ID to fetch data for.
	 * @returns {Promise<UserData<record<K<string>, V<any>>>>} UserData as Object
	 */
	async getUserData(uid) {
		const user = await Users.findByPk(uid);
		if (!user) Users.create({ id: uid });

		return await Users.findByPk(uid);
	},
};

/**
 * Used for storing user command cooldowns and rate limits - there used to be 2 separate collections to store each, but that used more memory.
 * @type {Collection}
 */
client.collection = new Collection();

/** Constants used globally by the client.*/
client.const = Constants;

process.logger.info("INIT", "Loading Commands...");

/** This is used to cache all of the commands upon startup */
client.commands = new Collection();

client.utils.cacheCommands("/src/cmds", client.commands)
	.then(e => process.logger.success("INIT", `Registered ${e} commands`));

const eventHandler = new EventHandler(client, false);

eventHandler.load();

process.on("unhandledRejection", e => process.logger.error("unhandledRej", e.stack));

config();
client.login(process.env.token);

// necessary to export so utils can be accessed in files where client is not available
export { client };