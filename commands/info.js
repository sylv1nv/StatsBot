const Discord = require('discord.js');

exports.run = async (client, message) => {
    const helpEmbed = new Discord.MessageEmbed()
        .setTitle(`Information about ${client.user.username}`)
        .setColor(client.config.color.help)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`${client.user.username} is serving on ${client.guilds.size} servers since March 22, 2020`)
        .addField(`**Having a problem with ${client.user.username}?**`,`Join the support server, submit an issue on GitHub or contact me on Discord.`)
        .addField(`**Want to Contribute?**`,`Contribution is welcome and it will make  ${client.user.username} better. If you want to, you can do a pull request and join the support server.`)
        .addField(`Join the Support Server`,`[Click here](${client.config.invite.userToServer})`, true)
        .addField(`Contribute or submit an issue on GitHub`, `[Click Here](${client.config.github})`, true)
        .addField(`Share ${client.user.username}`,`If you like ${client.user.username} feel free to share it around you! [Click here to invite the bot to a server.](${client.config.invite.botToServer})\n\nMade with :bar_chart: by <@${client.config.ownerID}>`)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL());

   await message.channel.send(helpEmbed)




};

exports.conf = {
    name: 'Info',
    aliases: ['info', 'support'],
    description: "Information about the bot, and what do to if you have a problem",
    enabled: true,
    args: false,
    usage: 'info',
    permissions: 'SEND_MESSAGES',
    friendlyLevel: 0,
}
