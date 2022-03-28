import chalk from "chalk";
import { existsSync, createWriteStream, writeFile } from "fs";
import { Util } from "discord.js";
import delay from "delay";

/**
 * Custom logger.
 * Sends to the console just the same as `console.log()`, but it's pretty :)
 * It also contains an essential function for updating logs files in the logs folder.
 */
class Logger {
	/**
	 * @param {Discord.Client} client The currently instantiated Discord client.
	 */
	constructor(client) {
		/**
		 * The currently instantiated Discord client.
		 * @type {Discord.Client}
		 */
		this.client = client;
	}
	/**
	 * Sends an error to the console.
	 * @param {string} mode mode
	 * @param {string} err Error to be sent to console
	 * @example`[MODE => err] <Error>`
	 * @returns {void} void
	 */
	error(mode, err) {
		console.log(`${chalk.rgb(100, 100, 100)(`[${mode} => `)}${chalk.red(" ERROR")}${chalk.rgb(100, 100, 100)("]")} ${err}`);
	}
	/**
	 * Sends a warning to the console.
	 * @param {string} mode General context for error
	 * @param {string} warning Warning to be sent to console
	 */
	warn(mode, warning) {
		console.log(`${chalk.rgb(100, 100, 100)(`[${mode} => `)}${chalk.rgb(250, 111, 12)(" WARNING")}${chalk.rgb(100, 100, 100)("]")} ${warning}`);
	}
	/**
	 * Logs a success message to the console.
	 * @param {string} mode General context for success
	 * @param {string} msg Success message
	 */
	success(mode, msg) {
		console.log(`${chalk.rgb(100, 100, 100)(`[${mode} =>`)}${chalk.greenBright(" SUCCESS")}${chalk.rgb(100, 100, 100)("]")} ${msg}`);
	}
	/**
	 * Sends general info to console.
	 * @param {string} mode General context for info
	 * @param {string} msg Info to be sent to console
	 */
	info(mode, msg) {
		console.log(`${chalk.rgb(100, 100, 100)(`[${mode} =>`)}${chalk.hex("#00aaaa")(" INFO")}${chalk.rgb(100, 100, 100)("]")} ${msg}`);
	}
	/**
	 * Applies raw `console.log()` onto specified parameters.
	 * @param {...any} args Parameters to be logged.
	 * @returns {void} void
	 */
	raw(...args) {
		console.log(...args);
	}
	/**
	 * Updates a log file with the necessary information.
	 * If none is present, then one will be automatically created.
	 * @param {string} logType The type of log to parse (eg sql, cmd, admincmd, etc).
	 * @param {Discord.Message} message The Discord message which initiated the request.
	 * @param {boolean} sendToChannel Whether or not `cLog` should be sent to the parsed Discord text channel. This exists for security purposes.
	 * @param {string} fLog The log message that is to be sent to the file (this may contain extra information useful for debugging
	 * and may contain sensitive information)
	 * @param {string} cLog The log message that is to be sent to the Discord logs channel associated with parsed `logType`; this should not be
	 * as detailed, and is used more informatively and should NOT contain sensitive content, as a Discord channel is most certainly not a place
	 * secure enough.
	 * @returns {void}
	 */
	async updateLogsFile(logType, message, sendToChannel, fLog, cLog) {
		if (!logType) return;
		fLog = Util.splitMessage(fLog, { maxLength: 2000, char: "" });
		if (sendToChannel) cLog = Util.splitMessage(cLog, { maxLength: 2000, char: "" }).join("");
		if (!fLog.endsWith("\n")) {
			flags += "\n";
		}
		const today = new Date(message?.createdTimestamp || Date.now()).toISOString().split("T")[0];
		const path = `${process.cwd()}/.logs/${logType}/${today}.log`;
		// today example: 2021-12-13 (for: 13 Dec 2021)
		if (!existsSync(path)) {
			const b = Date.now();
			if (sendToChannel) this.client.channels.cache.get(this.client.const.logTypes[logType]).send({ content: `Logs file \`${path.replaceAll(process.cwd(), "[cwd]")}\` not found\nAttempting to create new logs file...` });
			writeFile(path, fLog, (async (err) => {
				if (err) process.logger.error("FSERROR(CREATE_FILE)", err) && this.client.channels.cache.get(this.client.const.logTypes[logType]).send({ content: `Error whilst creating new logs file: \`${err}\`` });
				if (sendToChannel) this.client.channels.cache.get(this.client.const.logTypes[logType]).send({ content: `Successfully created new logs file in ${Date.now() - b} ms` });
			}));
		}
		else {
			createWriteStream(path, { flags: "a" }).end(fLog);
		}
		await delay(1000);
		if (sendToChannel) {
			await Promise.all(
				cLog.map(async (log) => {
					return await this.client.channels.cache.get(this.client.const.logTypes[logType]).send({
						content: log,
					});
				}),
			);
		}
	}
}

export { Logger };