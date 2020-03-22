exports.run = async (client, message, args) => {
    await message.delete();
    if(!args || args.length < 1){
        await message.channel.send("> Must provide a command name to reload.").then(m => m.delete({timeout: 5000}));
        return ;
    }
    const commandName = args[0];
    if(!client.commands.has(commandName)) {
        await message.channel.send("> That command does not exist").then(m => m.delete({timeout: 5000}));
        return ;
    }
    delete require.cache[require.resolve(`./${commandName}.js`)];
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    await message.channel.send(`> The command ${commandName} has been reloaded`).then(m => m.delete({timeout: 5000}));
};

exports.conf = {
    name: 'Reload',
    aliases: ['reload', 'r'],
    description: "Reload the command",
    enabled: true,
    args: true,
    usage: 'reload <command>',
    permissions: 'ADMINISTRATOR',
    friendlyLevel: 3,
}