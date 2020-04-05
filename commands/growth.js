const Discord = require('discord.js');
const fsPromises = require('fs').promises;
const jsdom = require('jsdom');
const pathToPlotly = require.resolve('plotly.js-dist');
const svg2img = require('svg2img');
const fs = require('fs');
//const plotly = require('plotly')("Sylv1n_v", "FDjVVLISQU5RY9SDcEi0");

const serverCooldown = new Set();

exports.run = async (client, message, args) => {
    message.delete();
    if (serverCooldown.has(message.guild.id)) {
        return message.channel.send('> **[COOLDOWN]** Please, wait **5 Minutes** !');
    }
    serverCooldown.add(message.guild.id);
    setTimeout(() => {
        serverCooldown.delete(message.guild.id);
    }, 30000);

    const plotEmbed = new Discord.MessageEmbed()
        .setTitle(`Server Growth | ${client.user.username}`)
        .setColor(client.config.color.help)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`Displaying the Server Member Growth of ${message.guild.name}`)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL());

    async function plotSend() {
        const attachmentPlot = new Discord.MessageAttachment(`./plot/growth${message.guild.id}.png`);
        await message.channel.send(plotEmbed);
        await message.channel.send(attachmentPlot);
    }

    message.channel.startTyping();

    let listAllParticipation = client.allGrowthCount.all(message.guild.id);
    //console.log(listAllParticipation);
    //console.log(listAllParticipation.length);
    let xData =[];
    let yData = [];
    //data.push("Toutes les participations enregistrées");
    for(let i=0; i<listAllParticipation.length; i++){
        console.log(listAllParticipation[i].time + ","+listAllParticipation[i].memberCount);
        xData.push(listAllParticipation[i].time.toString());
        yData.push(listAllParticipation[i].memberCount);
        //data.push("<@"+listAllParticipation[i].user+">" + " | "+listAllParticipation[i].nbParticipation);
    }

    //let data = [{x: xData, y: yData, type: "bar"}];


    const fig = {
        data: [{x: xData, y: yData,type: "scatter"}],
        layout: {
            title: `Server Growth | ${message.guild.name}<br>UTC Time`,
        }
    };

    const opts = {
        format: 'svg',
        imageDataOnly: true };

    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);

    const w = new jsdom.JSDOM('', { runScripts: 'dangerously', virtualConsole }).window

    w.HTMLCanvasElement.prototype.getContext = function() { return null; };
    w.URL.createObjectURL = function() { return null; };

    //generating SVG plot file
    fsPromises.readFile(pathToPlotly, 'utf-8')
        .then(w.eval)
        .then(() => w.Plotly.toImage(fig, opts))
        .then(img => fsPromises.writeFile(`./plot/growth${message.guild.id}.svg`, img)
            .then(() => svg2img(`./plot/growth${message.guild.id}.svg`, function(error, buffer) {
                //converting SVG file to PNG discord send file
                fsPromises.writeFile(`./plot/growth${message.guild.id}.png`, buffer)
                    //Sendind plot to discord
                    .then(plotSend()
                        //Deleting firstly the SVG file
                        .then(() => fs.unlink(`./plot/growth${message.guild.id}.svg`, function (err) {
                            if (err) throw err;
                            //console.log('Source File deleted!');
                        }))
                        //Deleting the PNG file
                        .then(() => fs.unlink(`./plot/growth${message.guild.id}.png`, function (err) {
                            if (err) throw err;
                            //console.log('Png File deleted!');
                        }))
                    )
            }))
        )
        .catch(console.warn);


    message.channel.stopTyping(true);

    //setTimeout Version
    /*setTimeout( () => {
        fs.unlink(`./plot/plot${message.guild.id}.svg`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
        fs.unlink(`./plot/plot${message.guild.id}.png`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        })
    }, 30000);*/

}


exports.conf = {
    name: 'growth',
    aliases: ['growth'],
    description: "Server Member growth",
    enabled: true,
    args: false,
    usage: 'growth',
    permissions: 'ADMINISTRATOR',
    friendlyLevel: 0,
}
