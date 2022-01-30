import chalk from "chalk";

/**
 * Custom logger.
 * Sends to the console just the same as `console.log()`, but it's pretty :)
 */
class Logger {
	constructor() {
		return this;
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
	void function raw(...args) {
		console.log(...args);
	}
}

export { Logger };