'use strict';

const Command = require("../../structure/Command.js"),
      { MessageEmbed } = require('discord.js'),
      { botslogs } = require('../../configs/channels.json'),
      { verificator } = require('../../configs/roles.json'),
      { prefix } = require("../../configs/config.json"),
      bots = require("../../models/bots");

class Setsite extends Command {
    constructor() {
        super({
            name: 'setsite',
            category: 'botlist',
            description: 'Définir le site web d\'un bot.',
            aliases: ["botsite"],
            usage: 'setsite <id> <lien | none>',
            example: ["setsite 692374264476860507 https://g-ca.fr"],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        if (!args[0]) return message.channel.send(`\`\`\`${prefix}setsite <id bot> <lien | none>\`\`\``)
            const member = await message.guild.members.fetch(`${args[0]}`)
            if (!member) return message.channel.send(`**${client.no} ➜ Identifiant invalide.**`)
            const db = await bots.findOne({ botID: member.user.id })
            if (!db) return message.channel.send("**" + client.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)**')
            if (db.ownerID !== message.author.id && !message.member.roles.cache.get(verificator)) return message.channel.send("**" + client.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**")
            if (!args[1]) return message.channel.send("**" + client.no + ' ➜ Il faudrai peut-être entrer un lien non ?**')
            if (args[1] === 'none' && db.site) {
                const e = new MessageEmbed()
                .setColor(client.color)
                .setTitle("Modification du profil...")
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp(new Date())
                .setDescription(`<@${message.author.id}> vient juste d'éditer le site web de votre robot <@${member.id}> :`)
                .setFields({
                    name: "➜ Avant :",
                    value: `\`\`\`${db.site}\`\`\``,
                    inline: false
                },
                {
                    name: "➜ Après :",
                    value: `\`\`\`none\`\`\``,
                    inline: false
                })
                client.channels.cache.get(botslogs).send({ content: `<@${db.ownerID}>`, embeds: [e] })
                message.channel.send("**" + client.yes + " ➜ Modifications enregistrées avec succès !**")
                setTimeout(async () => {
                    return await bots.findOneAndUpdate({ botID: member.user.id }, { $set: { site: null } }, { upsert: true })
                }, 2000)
            }
            if (args[1] === 'none' && !db.site) return message.channel.send("**" + client.no + ' ➜ Tu m\'as demandé supprimer un lien qui n\'a jamais été enregistré ¯\\_(ツ)_/¯**')
            if (args[1] !== "none") {
                if (!args[1].startsWith('http') || args[1] === "https://" || args[1] === "http://") return message.channel.send("**" + client.no + " ➜ Le lien entré est invalide. Je vous rappelle que le lien doit commencer par `https://` ou `http://`**")

                const e = new MessageEmbed()
                .setColor(client.color)
                .setTitle("Modification du profil...")
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp(new Date())
                .setDescription(`<@${message.author.id}> vient juste d'éditer le site web de votre robot <@${member.id}> :`)
                .setFields({
                    name: "➜ Avant :",
                    value: `\`\`\`${db.site || "none"}\`\`\``,
                    inline: false
                },
                {
                    name: "➜ Après :",
                    value: `\`\`\`${args[1]}\`\`\``,
                    inline: false
                })
                client.channels.cache.get(botslogs).send({ content: `<@${db.ownerID}>`, embeds: [e] })
                message.channel.send("**" + client.yes + " ➜ Modifications enregistrées avec succès !**")
                setTimeout(async () => {
                    return await bots.findOneAndUpdate({ botID: member.user.id }, { $set: { site: args[1] } }, { upsert: true })
                }, 2000)
            }
    }
}

module.exports = new Setsite;
