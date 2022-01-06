"use strict";
/* eslint-env node es6 */
import { Collection, Client, Options, Intents } from "discord.js";
import { config } from "dotenv";
import Sequelize, { DataTypes } from "sequelize";

import { EventHandler } from "./events/EventHandler.js";
import { ClientConfiguration } from "./config.js";

import User from "./models/User.js";
import Guild from "./models/Guild.js";
import Channel from "./models/Channel.js";
import Bug from "./models/Bug.js";

config();

/** The currently instantiated Discord client*/
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
	/**
	- MESSAGE_CREATE
  - MESSAGE_UPDATE
  - MESSAGE_DELETE
  - CHANNEL_PINS_UPDATE
	 */
	intents: new Intents().add([
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.DIRECT_MESSAGES,
	]),
	partials: ["CHANNEL", "MESSAGE"],
});

/** Used for storing user command cooldowns and rate limits - there used to be 2 separate collections to store each, but that used more memory*/
client.collection = new Collection();

console.log("Creating Sequelize instance...");
const sequelize = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	storage: "database.sqlite",
	logging: false,
});

console.log("Defining models...");

const Users = User(sequelize, DataTypes);
const Guilds = Guild(sequelize, DataTypes);
const Channels = Channel(sequelize, DataTypes);
const Bugs = Bug(sequelize, DataTypes);

if (process.argv.includes("--syncdb") || process.argv.includes("-s")) {
	(async () => {
		// have to use an asynchronous wrapper for sync method
		console.log("Attempting to sync database...");
		const now = Date.now();
		await sequelize.sync({ force: true });
		console.log(`Successfully synced database in ${Date.now() - now} ms`);
	})();
}

client.config = new ClientConfiguration(client);
client.db = {
	USERS: Users,
	CHNL: Channels,
	BUGS: Bugs,
	GUILDS: Guilds,
	getUserData: (async (uid) => {
		const user = await Users.findOne({ where: { id: uid } });
		if (!user) Users.create({ id: uid });

		return await Users.findOne({ where: { id: uid } });
	}),
};
console.log("Loading commands...");
// This is used to cache all of the commands upon startup
client.config.commands = new Collection();

client.config.cacheCommands("./cmds", client.config.commands)
	.then((e) => console.log(`Registered ${e[1]} commands.`));

const eventHandler = new EventHandler(client);

eventHandler.load();

process.on("unhandledRejection", client.config.Notify);

client.login(process.env.token);