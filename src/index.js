"use strict";
/* eslint-env node es6 */
import { Collection, Client, Options, Intents } from "discord.js";
import { config } from "dotenv";
import Sequelize, { DataTypes } from "sequelize";

import { EventHandler } from "./events/EventHandler.js";
import { Utils, Constants } from "./Utils/Construct.js";

import User from "./models/User.js";
import Guild from "./models/Guild.js";
import Channel from "./models/Channel.js";
import Bug from "./models/Bug.js";

// loads .env content into `process.env`
config();

/**
 * The currently instantiated Discord Client.
 * @type {Discord.Client}
 */
const client = new Client({
	// Overriding the cache used in GuildManager, ChannelManager, GuildChannelManager, RoleManager, and PermissionOverwriteManager is unsupported and will break functionality
	makeCache: Options.cacheWithLimits({
		MessageManager: 100,
		GuildMemberManager: 100,
		PresenceManager: 0,
		GuildStickerManager: 0,
		GuildInviteManager: 0,
		GuildBanManager: 0,
	}),
	allowedMentions: { parse: ["users", "roles"], repliedUser: false },
	intents: new Intents().add([
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.DIRECT_MESSAGES,
	]),
	// enable commands in DMChannels
	partials: ["CHANNEL"],
});

console.log("Creating Sequelize instance...");
const sequelize = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	storage: "./database.sqlite",
	logging: false,
});

console.log("Defining models...");

const Users = User(sequelize, DataTypes);
const Guilds = Guild(sequelize, DataTypes);
const Channels = Channel(sequelize, DataTypes);
const Bugs = Bug(sequelize, DataTypes);

if (process.argv.includes("--syncdb") || process.argv.includes("-s")) {
	console.log("Attempting to sync database...");
	const now = Date.now();
	sequelize.sync({ force: true });
	console.log(`Successfully synced database in ${Date.now() - now} ms`);
}

client.utils = new Utils(client);

client._seq = sequelize;

client.db = {
	USERS: Users,
	CHNL: Channels,
	BUGS: Bugs,
	GUILDS: Guilds,
	/**
	 * Returns the data for a user.
	 * Creates an account for the user in the database if none found.
	 * @param {string} uid Discord User ID to fetch data for.
	 * @returns {Promise<UserData>} UserData as Object
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

console.log("Loading commands...");

/** This is used to cache all of the commands upon startup */
client.commands = new Collection();

client.utils.cacheCommands("/src/cmds", client.commands)
	.then(e => console.log(`Registered ${e} commands.`));

const eventHandler = new EventHandler(client, true);

eventHandler.load();

process.on("unhandledRejection", e => client.utils.notify(e, null));

client.login(process.env.token);