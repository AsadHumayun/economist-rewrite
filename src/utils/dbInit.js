import Sequelize, { DataTypes } from "sequelize";
import { join } from "node:path";
import { client } from "../index.js";
import User from "../models/User.js";
import Guild from "../models/Guild.js";
import Channel from "../models/Channel.js";
import Bug from "../models/Bug.js";

/**
 * Instantiates the database connection and defines models.
 * @returns {Record<K<string>, V<Sequelize.Model<any, any> | Sequelize>>}
 */
export function dbInit() {
	process.logger.info("INIT", "Creating Sequelize instance...");
	const DB_PATH = join(process.cwd(), "database.sqlite");

	const sequelize = new Sequelize("database", "user", "password", {
		host: "localhost",
		dialect: "sqlite",
		storage: DB_PATH,
		logQueryParameters: true,
		logging: (log, { type }) => type === "SELECT" ? void 0 : process.logger.updateLogsFile("sql", null, false, `[${Math.trunc(Date.now() / 60000)} (${client.uptime})] ${log}\n`, null),
	});

	const Users = User(sequelize, DataTypes);
	const Guilds = Guild(sequelize, DataTypes);
	const Channels = Channel(sequelize, DataTypes);
	const Bugs = Bug(sequelize, DataTypes);

	if (process.argv.includes("--syncdb") || process.argv.includes("-s")) {
		process.logger.warn("ARGV:S", "Attempting to sync database...");
		const now = Date.now();
		sequelize.sync({ force: true });
		process.logger.success("ARGV:S", `Successfully synced database in ${Date.now() - now} ms`);
	}

	return Object.freeze({
		sequelize,
		Users,
		Guilds,
		Channels,
		Bugs,
	});
}