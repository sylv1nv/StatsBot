const Discord = require('discord.js');
const { timespan } = require("../modules/util.js");

exports.run = async (client, message) => {

    let serverStats = client.getServerMsgCount.get(message.guild.id);

    let memberLoss = serverStats.memberCount-message.guild.memberCount;

    let today = new Date();

    let duration = timespan(message.guild.joinedAt,today);

    const embed = new Discord.MessageEmbed()
        .setTitle(client.user.username)
        .setDescription(`Displaying all available statistics for ${message.guild.name}\nSince \`${message.guild.joinedAt}\`\nThus: \`${duration.years} years, ${duration.months} months, ${duration.days} days and ${duration.hours} hours.\``)
        .setColor(client.config.color.info)
        .setThumbnail(message.guild.iconURL())
        .addField("**Member Stats**", `Actual number of members: \`${message.guild.memberCount}\`\nAll time members count: \`${serverStats.memberCount}\`\nMember loss: \`${memberLoss}\``)
        .addField("**Messages**", `\`${serverStats.serverMsgCount}\` messages sent`)
        .addField("**Server Info**", `Categories: \`${message.guild.channels.cache.filter(c=> c.type === "category").size}\`\nText Channels: \`${message.guild.channels.cache.filter(c=> c.type === "text").size}\`\nVocal Channels: \`${message.guild.channels.cache.filter(c=> c.type === "voice").size}\`\n\nCreated on: \`${message.guild.createdAt}\`\nRegion: \`${message.guild.region}\`\nOwner: ${message.guild.owner} | id: \`${message.guild.owner.id}\``)
        .setFooter(client.user.tag, client.user.displayAvatarURL())
        .setTimestamp()

    await message.channel.send(embed);


};


exports.conf = {
    name: 'Server',
    aliases: ['s','server','serv'],
    description: "Display all the server statistics",
    enabled: true,
    args: false,
    usage: 'serv',
    permissions: 'ADMINISTRATOR',
    friendlyLevel: 0,
}
