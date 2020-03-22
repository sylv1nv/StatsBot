const Discord = require("discord.js");

module.exports = (client) => {
    client.user.setPresence({
        activity: {
            name: '' + client.guilds.cache.array().length + ' servers | ' + client.config.prefix + 'help',
            type: 'WATCHING'
        },
        status: 'online'
    });
}
