export default {
	name: "warn",
	once: false,
	async execute(client, w) {
		client.utils.notify(w, null, client);
	},
};