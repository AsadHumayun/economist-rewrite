import { MessageEmbed, Permissions } from "discord.js";
import delay from "delay";

export default {
	name: "guildMemberAdd",
	once: false,
	async execute(client, member) {
		if (member.guild.id != client.config.statics.supportServer) return;
		const user = await client.db.getUserData(member.id);
		let cst = user.get("cst");
		cst = cst ? cst.split(";") : [];
		const channel = member.guild.channels.cache.get(client.config.statics.defaults.channels.general);
		const nick = user.get("nick");
		if (nick) member.setNickname(nick);
		client.config.statics.ditems.forEach((i) => {
			if (cst.includes(i.split(";")[1]) && (!cst.includes(i.split(";")[2]))) {
				cst.push(i.split(";")[2]);
			}
		});
		client.config.statics.cstSpecials.forEach((i) => {
			if (cst.includes(i[0]) && (!cst.includes(i[1]))) {
				cst.push(i[1]);
			}
		});
		const rle = [client.config.statics.defaults.roles.memberRole];
		for (const f of cst) {
			if (member.guild.roles.cache.get(f)) rle.push(f);
		}
		member.roles.add(rle)
			.catch(() => {return;});
		let chn = user.get("chnl");
		if (chn) {
			chn = client.config.listToMatrix(chn.split(";"), 3);
			chn.forEach(async (x) => {
				client.channels.cache.get(client.config.statics.defaults.channels.sflp).send(`${Math.trunc(Date.now() / 60000)}: Attempting to restore permissions for ${member.user.tag}(${member.user.id})>:\nchannel: ${x[0]} -> deny: ${x[1]}, allow: ${x[2]}`);
				try {
					client.channels.cache.get(x[0]).send({ content: `${Math.trunc(Date.now() / 60_000)}: Attempting to restore channel permissions for M(${member.id}) > data: ${x.join(";")}` });
				}
				catch (e) {
					return client.channels.cache.get(client.config.statics.defaults.channels.sflp).send(`${Math.trunc(Date.now() / 60_000)}: Disregarding permissionOverwrites.edit request from M:<${member.user.tag} (${member.id})>: \`No channel with ID "${x[0]}" found.\``);
				}
				// to prevent getting rate limited/ip banned
				// this function works by delaying the resolution of a Promise.
				await delay(1000);
				try {
					console.log(x);
					const permissions = {};
					const deny = Object.entries(new Permissions(BigInt(Number(x[1]))).serialize()).filter((s) => s[1] === true).forEach((s) => permissions[s[0]] = false);
					const allow = Object.entries(new Permissions(BigInt(Number(x[2]))).serialize()).filter((s) => s[1] === true).forEach((s) => permissions[s[0]] = true);
					Object.keys(Permissions.FLAGS).forEach((flag) => {
						if (!Object.keys(permissions).includes(flag)) permissions[flag] = null;
						console.debug(`Set permissions.${flag} as null`);
					})
					console.debug(permissions, deny, allow);
					member.guild.channels.cache.get(x[0]).permissionOverwrites.edit(member.id, permissions);
					client.channels.cache.get(client.config.statics.defaults.channels.sflp).send(`${Math.trunc(Date.now() / 60_000)}: Successfully restored permissions for M:<${member.user.tag} (${member.id})>: ${x[0]} -> d: ${x[1]}, a: ${x[2]}`);
					client.channels.cache.get(x[0]).send(`Successfully restored permissions for M:<${member.user.tag} (${member.id})>: d: ${x[1]}, a: ${x[2]}`);
				}
				catch (e) {
					client.channels.cache.get(client.config.statics.defaults.channels.sflp).send(`${Math.trunc(Date.now() / 60_000)}: Unable to restore permissions for M:<${member.user.tag} (${member.id})>: data: ${x.join(";")}\nError: \`${e}\``);
				}
			});
		}
		if (cst.includes("cl")) {
			channel.send({ content: `♥️ Welcome back ${member}! Can't believe u left me :c` });
		}
		else {
			channel.send({ content: `Welcome ${member} to ${member.guild.name}! :dollar: 500 have been added to your balance! I do hope you enjoy your stay ♥️` });
			const oldBal = Number(user.get("bal"));
			cst.push("cl");
			await client.db.USERS.update({
				bal: oldBal + 500,
				cst: cst.join(";"),
			}, {
				where: {
					id: member.id,
				},
			});
		}
		await user.reload();
		let owner = await client.config.fetchUser(client.config.owner);
		owner = owner.tag;
		let mute = user.get("mt");
		if (mute) {
			mute = mute.split(";");
			if (mute[0] == "-1") {
				client.config.commands.get("mute")
					.run(client, { createdTimestamp: now, guild: member.guild, channel: channel, member: member.guild.member(client.user), author: client.user }, [member.id, "0", mute.slice(1).join(" ")]);
			}
			const date = Number(mute[0]);
			const now = Date.now() / 60_000;
			if (now < date) {
				const mins = date - now;
				client.config.commands.get("mute")
					.run(client, { createdTimestamp: now, guild: member.guild, channel: channel, member: member.guild.member(client.user), author: client.user }, [member.id, Math.round(mins), mute.slice(1).join(" ")]);
			}
			else if (member.roles.cache.has(client.config.statics.defaults.roles.muted) && (now >= date)) {
				// unmute
				client.config.commands.get("unmute")
					.run(client, { createdTimestamp: now, guild: member.guild, channel: channel, member: member.guild.member(client.user), author: client.user }, [member.id, "[automatic-unmute]: Time's up"]);
			}
		}
		if (Number(member.user.createdTimestamp) > Date.now() - 1209600000) {
			client.channels.cache.get(client.config.statics.defaults.channels.modlogs).send({ content: `${Math.trunc(Date.now() / 60_000)}: mute: M:<${member.user.tag} (${member.id})>: anti-raid [M:<${client.user.tag} (${client.user.id})>]` });
			await member.roles.add(client.config.statics.defaults.roles.muted);
			await client.db.USERS.update({
				mt: "-1;anti raid",
			}, {
				where: {
					id: member.id,
				},
			});
			channel.send({ embeds: [
				new MessageEmbed()
					.setColor(client.config.defaults.clr)
					.setDescription(`${member.user.tag} was given a 100000000 minute mute for "anti raid" and sent the following message:`),
			] });
			channel.send({ embeds: [
				new MessageEmbed()
					.setColor("#da0000")
					.setDescription(`You have received a 100000000 minute mute from ${member.guild.name} because of "[automatic-mute]: Anti-raid"`)
					.addField("Moderator", client.user.tag)
					.addField("Reason", `Your account was flagged as a potential threat to our server. If you believe that you were muted erroneously, please contact \`${owner}\`.`),
			] });
			member.send({ embeds: [
				new MessageEmbed()
					.setColor("#da0000")
					.setDescription(`You have received a 100000000 minute mute from ${member.guild.name} because of "[automatic-mute]: Anti-raid"`)
					.addField("Moderator", client.user.tag)
					.addField("Reason", `Your account was flagged as a potential threat to our server. If you believe that you were muted erroneously, please contact \`${owner}\`.`),
			] })
				.catch(() => {return;});
		}
		client.channels.cache.get(client.config.statics.defaults.channels.memberLog).send({ embeds: [
			new MessageEmbed()
				.setTimestamp()
				.setColor("#00FF0C")
				.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
				.setFooter(`Member Joined • ID: ${member.user.id}`, member.user.displayAvatarURL({ dynamic: true })),
		] });
	},
};