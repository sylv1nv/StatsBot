const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const alert = require("./message.json");
const  SQLite = require("better-sqlite3");
const sql = new SQLite('./msgStat.sqlite');
const sqlServer = new SQLite('./serverStats.sqlite');
const sqlPlot = new SQLite('./plotData.sqlite');
const sqlGrowth = new SQLite('./growthData.sqlite');

const client = new Discord.Client({
    autoReconnect: true
});

const config = require("./config.json");
client.config = config;


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    let channel = client.channels.cache.find(channel => channel.id === client.config.channel.logs);
    await channel.setTopic(`${client.user.username} uptime: 0 days 0 hours 0 minutes - Memory usage: 0Mb - Ping: 0ms - Refresh 2min`);
    let embed = new Discord.MessageEmbed()
        .setTitle('Status')
        .setDescription('Bot is now starting. please wait..')
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(0x000000)
        .setFooter('Use ' + config.prefix + 'help to see all commands', client.user.displayAvatarURL())

    try {

        let msg = await channel.send({
            embed
        });
        setTimeout(() => {
            let heartbeat = Math.round(client.ping);
            var low = Math.floor(Math.random() * (alert.heartbeat.low).length);
            var medium = Math.floor(Math.random() * (alert.heartbeat.medium).length);
            var hight = Math.floor(Math.random() * (alert.heartbeat.hight).length);

            if (heartbeat < 100) {
                embed.setColor(config.color.info);
                embed.addField(`Heartbeat: ${heartbeat}ms`, alert.heartbeat.low[low]);
            } else if (heartbeat > 200) {
                embed.setColor(config.color.fatal);
                embed.addField(`Heartbeat: ${heartbeat}ms`, alert.heartbeat.hight[hight]);
            } else {
                embed.setColor(config.color.warn);
                embed.addField(`Heartbeat: ${heartbeat}ms`, alert.heartbeat.medium[medium]);
            }
            msg.edit({
                embed
            });
        }, 1000);
        setTimeout(() =>  {
            embed.setColor(0xE70056);
            embed.addField('Logged in', `Time of login: ${new Date()}`);
            msg.edit({
                embed
            });
        }, 1500);
        setTimeout(() => {
            let pingtime = Date.now();
            embed.addField('Startup checkup', 'Calculating ping...', true);
            msg.edit({
                embed
            }).then(function (msg) {
                let time = Date.now() - pingtime;
                embed.addField('Pong!', `🛰 Ping is ${time.toString()}ms`, true);
                msg.edit({
                    embed
                });
            });
        }, 2000);
        setTimeout(() => {
            embed.addField(`${client.user.username} Version`, `${config.version}`);
            embed.setDescription('Bot is Online')
            msg.edit({
                embed
            });
        }, 2500);
    } catch (error) {
        console.log(error);
    }

    //console.log(client.guilds.cache.array().length);
    await client.user.setPresence({
        activity: {
            name: '' + client.guilds.cache.array().length + ' servers | ' + client.config.prefix + 'help',
            type: 'WATCHING'
        },
        status: 'online'
    });

    //---------------- Stats Database System
    // Check if the table "message point" exists.
    const userTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'msgcounter';").get();
    if (!userTable['count(*)']) {
        // If the table isn't there, create it and setup the database correctly.
        sql.prepare("CREATE TABLE msgcounter (id TEXT PRIMARY KEY, user TEXT, guild TEXT, msgcount INTEGER);").run();
        // Ensure that the "id" row is always unique and indexed.
        sql.prepare("CREATE UNIQUE INDEX idx_msgcounter_id ON msgcounter (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }

// And then we have two prepared statements to get and set the score data.
    client.getMsgCount = sql.prepare("SELECT * FROM msgcounter WHERE user = ? AND guild = ?");
    client.setMsgCount = sql.prepare("INSERT OR REPLACE INTO msgcounter (id, user, guild, msgcount) VALUES (@id, @user, @guild, @msgcount);");

   const serverTable = sqlServer.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'serverStats';").get();
    if (!serverTable['count(*)']) {
        // If the table isn't there, create it and setup the database correctly.
        sqlServer.prepare("CREATE TABLE serverStats (guild TEXT PRIMARY KEY, memberCount INTEGER, serverMsgCount INTEGER);").run();
        // Ensure that the "id" row is always unique and indexed.
        sqlServer.prepare("CREATE UNIQUE INDEX idx_serverStats_guild ON serverStats (guild);").run();
        sqlServer.pragma("synchronous = 1");
        sqlServer.pragma("journal_mode = wal");
    }
    client.getServerMsgCount = sqlServer.prepare("SELECT * FROM serverStats WHERE guild = ?");
    client.setServerMsgCount = sqlServer.prepare("INSERT OR REPLACE INTO serverStats (guild, memberCount, serverMsgCount) VALUES (@guild, @memberCount, @serverMsgCount);");


    const plotTable = sqlPlot.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'messagePlot';").get();
    if (!plotTable['count(*)']) {
        // If the table isn't there, create it and setup the database correctly.
        sqlPlot.prepare("CREATE TABLE messagePlot (time TEXT, guild TEXT, msgCount INT, PRIMARY KEY(time, guild));").run();
        // Ensure that the "id" row is always unique and indexed.
        sqlPlot.prepare("CREATE UNIQUE INDEX idx_messagePlot_guildTime ON messagePlot (time, guild);").run();
        sqlPlot.pragma("synchronous = 1");
        sqlPlot.pragma("journal_mode = wal");
    }

    // And then we have two prepared statements to get and set the score data.
    client.getPlotMsgCount = sqlPlot.prepare("SELECT * FROM messagePlot WHERE time = ? AND guild = ?");
    client.setPlotMsgCount = sqlPlot.prepare("INSERT OR REPLACE INTO messagePlot (guild, time, msgCount) VALUES (@guild, @time, @msgCount);");
    client.allPlotMsgCount = sqlPlot.prepare("SELECT * FROM messagePlot WHERE guild = ? ORDER BY time ASC");


    const growthTable = sqlGrowth.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'growthPlot';").get();
    if (!growthTable['count(*)']) {
        // If the table isn't there, create it and setup the database correctly.
        sqlGrowth.prepare("CREATE TABLE growthPlot (time TEXT, guild TEXT, memberCount INT, PRIMARY KEY(time, guild));").run();
        // Ensure that the "id" row is always unique and indexed.
        sqlGrowth.prepare("CREATE UNIQUE INDEX idx_growthPlot_guildTime ON growthPlot (time, guild);").run();
        sqlGrowth.pragma("synchronous = 1");
        sqlGrowth.pragma("journal_mode = wal");
    }

    // And then we have two prepared statements to get and set the score data.
    client.getGrowthCount = sqlGrowth.prepare("SELECT * FROM growthPlot WHERE time = ? AND guild = ?");
    client.setGrowthCount = sqlGrowth.prepare("INSERT OR REPLACE INTO growthPlot (guild, time, memberCount) VALUES (@guild, @time, @memberCount);");
    client.allGrowthCount = sqlGrowth.prepare("SELECT * FROM growthPlot WHERE guild = ? ORDER BY time ASC");




});



client.on('disconnected', () => {
    console.log("Disconnected from Discord");
    console.log("Attempting to log in...");
    client.login(config.token);
});

//---------------- Update Channel Owner with client Uptime
setInterval(() => {
    uptime = client.uptime;
    var seconds = Math.round(uptime / 1000);
    var minutes = 0;
    var hours = 0;
    var days = 0;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const ping = Math.round(client.ws.ping);
    while (seconds >= 60) {
        seconds -= 60;
        minutes += 1;
    }
    while (minutes >= 60) {
        minutes -= 60;
        hours += 1;
    }
    while (hours >= 24) {
        hours -= 24;
        days += 1;
    }
    let channel = client.channels.cache.find(channel => channel.id === client.config.channel.logs);
    channel.setTopic(`${client.user.username} uptime: ${days} days ${hours} hours ${minutes} minutes - Memory usage: ${Math.round(used * 100) / 100}Mb - Ping: ${ping}ms - Refresh 2min`).catch(console.error);

}, 120000);




//READING EVENTS FOLDER
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Enmap();
client.aliases = new Discord.Collection();

//READING COMMANDS FOLDER
fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        client.commands.set(props.conf.name, props);
        console.log(`Attempting to load command ${props.conf.name}`);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.conf.name)
        });

    });
});

client.login(config.token);
