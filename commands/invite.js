const Discord = require('discord.js');

exports.run = async (client, message) => {

    const inviteEmbed = new Discord.MessageEmbed()
        .setTitle(`Invite ${client.user.username} to you server`)
        .setColor(client.config.color.help)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`${client.user.username} is already serving on ${client.guilds.size} servers, why not on yours?\n\nWant to have ${client.user.username} on your server and start to keep track of your server statistics ? [Click on me and I will join your server!](${client.config.invite.botToServer})\nAlso, if you like ${client.user.username} feel free to share it around you!\n\nMade with :bar_chart: by <@${client.config.ownerID}>`)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL());

    await message.channel.send(inviteEmbed)




};

exports.conf = {
    name: 'Invite',
    aliases: ['i', 'share'],
    description: "Invite the bot to your server",
    enabled: true,
    args: false,
    usage: `invite`,
    permissions: 'SEND_MESSAGES',
    friendlyLevel: 0,
}