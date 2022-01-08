import { readdirSync } from "fs";

/**
 * EventHandler class, will be used for collecting and registering different events from their separate files.
 */
export class EventHandler {
	/**
	 * @param {Discord.Client} client Currently instantiated Discord client
	 * @param {?boolean} debug Whether or not to have debug mode enabled
	 * @constructor
	 */
	constructor(client, debug = false) {
		if (!client) throw new TypeError("[EventHandler => Constructor] [client]: Client may not be null");
		if (typeof debug !== "boolean") throw new TypeError(`[EventHandler => Constructor] [debug]: debug must be of type Boolean. Received type ${typeof debug}`);
		this.client = client;
		this.debug = debug;
	}
	/**
	 * Loads all events currentlly present in the `./events` directory. Only takes into account .js files.
	 * @returns {void} void
	 */
	async load() {
		console.info("Loading events...");
		let count = 0;
		const eventFiles = readdirSync("./events/").filter((f) => f.endsWith(".js") && !["EventHandler.js"].includes(f));
		if (this.debug) console.log("Iterating files:\n", eventFiles);
		for (const file of eventFiles) {
			const event = await import(`./${file}`);
			if (this.debug) console.info(`Imported ${file}, type ${typeof event}`);
			if (event.default.once) {
				if (this.debug) console.info(`Acknowledged ${file} event as ONCE\nBinding event imported form "${file}"...`);
				this.client.once(event.default.name, (...args) => event.default.execute(this.client, ...args));
				count++;
			}
			else {
				if (this.debug) console.info(`Binding event "${file.split(".")[0]}" (from ./events/${file})...`);
				this.client.on(event.default.name, (...args) => event.default.execute(this.client, ...args));
				count++;
			}
		}
		console.info(`Registered ${count} events.`);
	}
}