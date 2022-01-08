import { Constants } from "./Constants.js";
import { Funcs } from "./Functions.js";

/**
 * Utilities class, in context of the currently instantiated Discord client.
 * Acessible via `client.utils` (ref: index.js)
 */
class Utils extends Funcs {
	/**
	 * @constructor
	 * @param {Discord.Client} client The currently instantiated Discord client.
	 */
	constructor(client) {
		if (!client) throw new TypeError("[Class: Utils => Constructor]: client may not be null");
		super(client);
		this.client = client;
		this.owner = "501710994293129216";
	}
}

export { Utils, Constants };