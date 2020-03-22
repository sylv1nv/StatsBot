const Discord = require('discord.js');

exports.run = async (client, message) => {

    message.delete();

    const msg = await message.channel.send("Ping ?");

    const pong = new Discord.MessageEmbed()
        .setTitle("Pong ! :ping_pong:")
        .setDescription(`:satellite: Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`)
        .setTimestamp()
    await msg.edit(pong)

}

exports.conf = {
    name: 'Ping',
    aliases: ['ping'],
    description: "Get the ping between the bot and Discord",
    enabled: true,
    args: false,
    usage: 'ping',
    permissions: 'SEND_MESSAGES',
    friendlyLevel: 0,
}
