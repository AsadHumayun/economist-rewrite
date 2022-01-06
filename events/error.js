import { Notify } from "../functions.js";

export default {
	name: "erorr",
	once: false,
	async execute(client, e) {
		Notify(e, null, client);
	},
};