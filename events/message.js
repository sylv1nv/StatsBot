const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./msgStat.sqlite');

module.exports = (client, message) => {
    if (message.author.bot) return;

    let msgUserCount;
    let msgServerCount;

    if (message.guild) {

        msgServerCount= client.getServerMsgCount.get(message.guild.id);
        if(!msgServerCount){
            msgServerCount={
                id: message.guild.id,
                guild: message.guild.id,
                memberCount: message.guild.memberCount,
                serverMsgCount: 0,
            }
        }
        msgServerCount.serverMsgCount++;
        client.setServerMsgCount.run(msgServerCount);

        //USER MESSAGE COUNT SYSTEM
        msgUserCount = client.getMsgCount.get(message.author.id, message.guild.id);
        // If the score doesn't exist (new user), initialize with defaults.
        if (!msgUserCount) {
            msgUserCount = {
                id: `${message.guild.id}-${message.author.id}`,
                user: message.author.id,
                guild: message.guild.id,
                msgcount: 0,
            };
        }
        // Increment points.
        msgUserCount.msgcount++;
        // Save data to the sqlite table.
        client.setMsgCount.run(msgUserCount);
    }

    if(message.content.length > 1023) return;

    if (message.content.indexOf(client.config.prefix) !== 0) return;
    if (message.channel.type === "dm") return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;

    //Check if the command is enabled and inform only authorized permission
    if (!cmd.conf.enabled)
        if(message.member.hasPermission(cmd.conf.permissions)){
            return message.reply(`That command is not enabled`).catch(error => console.error('Command not enabled: ', error));
        }

    //FRIENDLY LEVEL FOR COMMANDS CHANNEL RESTRICTION
    if (cmd.conf.friendlyLevel === 3){
        if(message.member.id !== client.config.ownerID){
            return ;
        }
    }


    if (cmd.conf.permissions) {
        if (!message.member.hasPermission(cmd.conf.permissions)) {
           return;
        }
    }

    //try to execute the command. warn user there was an error
    try {
        cmd.run(client, message, args);
    } catch (err){
        message.channel.send('There was an error trying to execute that command!').then(m => m.delete({timeout: 5000}));
    }

};



