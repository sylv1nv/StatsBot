const Discord = require('discord.js');
const { timespan } = require("../modules/util.js");
exports.run = async (client, message, args) => {
    let userStats;
    let messageCount;
    let userLastMessage;
    let userLastMessageDate;
    let userLastMessageChannel;
    let today = new Date();

    if (!args[0]) {
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle("Command Error")
            .setColor(client.config.color.error)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`Please provide a user id \n Usage: \`${client.config.prefix}since <id>\``)
            .addField(`How to find ID ?`,`Right click on a user, copy ID`)
            .addField(`Can't see \`Copy ID\``, `Go to your Discord Settings --> Appearance --> Scroll to Advanced: activate Developer Mode`)
            .setTimestamp()
            .setFooter('Use ' + client.config.prefix + 'help to see all commands', client.user.displayAvatarURL())
        return message.channel.send(errorEmbed).then(m => m.delete( {timeout: 5000}));
    }

    let member = message.guild.member(args[0]);

    userStats = client.getMsgCount.get(member.id, message.guild.id);
    if(!userStats){
        messageCount =0;
        }
    if(userStats) {
        messageCount = userStats.msgcount;
    }
    let duration = timespan(member.joinedAt, today);


    let accountDuration = timespan(member.user.createdAt,today);

    userLastMessage = member.lastMessage;
    if(userLastMessage === null){
        userLastMessageDate = "Haven't sent a message";
        userLastMessageChannel = "any channel";
    }
    if(userLastMessage) {
        userLastMessageDate = member.lastMessage.createdAt;
        userLastMessageChannel = userLastMessage.channel;
    }
    let statBotduration = timespan(message.guild.joinedAt,today);

    const embed = new Discord.MessageEmbed()
        .setTitle(client.user.username)
        .setColor(client.config.color.info)
        .setDescription(`Displaying all available statistics for <@${member.id}>\nSince \`${message.guild.joinedAt}\`\nThus:\`${statBotduration.years} years, ${statBotduration.months} months, ${statBotduration.days} days and ${statBotduration.hours} hours.\``)
        .setThumbnail(member.user.displayAvatarURL())
        .addField(`**User Stats**`, `Server member since: \`${duration.years} years, ${duration.months} months, ${duration.days} days and ${duration.hours} hours\`\nMessages Sent: \`${messageCount}\`\n`)
        .addField(`**User Info**`, `Last message: \`${userLastMessageDate}\` in ${userLastMessageChannel}\n\nServer joined on: \`${member.joinedAt}\`\n\nAccount created on: \`${member.user.createdAt}\`\nThus: \`${accountDuration.years} years, ${accountDuration.months} months, ${accountDuration.days} days and ${accountDuration.hours} hours\``)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL())

    await message.channel.send(embed);

}


exports.conf = {
    name: 'Since',
    aliases: ['since','userinfo','uinfo','ui'],
    description: "Display all available statistics about a specified user",
    enabled: true,
    args: true,
    usage: 'since <UserID>',
    permissions: 'KICK_MEMBERS',
    friendlyLevel: 0,
}
