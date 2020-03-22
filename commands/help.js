const Discord = require('discord.js');

exports.run = async (client, message) => {
    const helpEmbed = new Discord.MessageEmbed()
        .setTitle(`Help for ${client.user.username}`)
        .setColor(client.config.color.help)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`**How to find ID?**\nRight click on a user, \`Copy ID\`\n**Can't see Copy ID?**\nGo to your Discord Settings, Appearance, Scroll to Advanced: activate Developer Mode`)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL());




    let command_list = message.client.commands.map(command => command.conf);

    let available_commands = command_list.filter(cmd => cmd.friendlyLevel<3);

    for(let i=0; i<available_commands.length; i++){
        helpEmbed.fields.push({
            "name":`**${available_commands[i].name}**\n${available_commands[i].description}`,
            "value":`Usage: \`${client.config.prefix}${available_commands[i].usage}\`\nAliases: ${available_commands[i].aliases.join(`\ /\ `)}`,
        });
    }

    await message.channel.send(helpEmbed)




};

exports.conf = {
    name: 'Help',
    aliases: ['h', 'help'],
    description: "List all the commands",
    enabled: true,
    args: false,
    usage: 'help',
    permissions: 'SEND_MESSAGES',
    friendlyLevel: 0,
}