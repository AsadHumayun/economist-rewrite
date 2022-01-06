import { Notify } from "../functions.js";

export default {
	name: "warn",
	once: false,
	async execute(client, w) {
		Notify(w, null, client);
	},
};