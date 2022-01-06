export default {
	name: "erorr",
	once: false,
	async execute(client, e) {
		client.config.Notify(e);
	},
};