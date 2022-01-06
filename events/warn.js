export default {
	name: "warn",
	once: false,
	async execute(client, w) {
		client.config.Notify(w);
	},
};