module.exports = (client, member) => {
    console.log(member.guild.memberCount + "-" + member.guild.name);

    let growthPlotCount;

    //PLOTTING MESSAGE ACTIVITY
    let date = new Date().toISOString().slice(0,-14).toString();
    growthPlotCount = client.getGrowthCount.get(date, member.guild.id);
    //console.log(growthPlotCount);
    if(!growthPlotCount){
        growthPlotCount={
            guild: member.guild.id,
            time: date,
            memberCount: member.guild.memberCount,
        }
    }
    growthPlotCount.memberCount = member.guild.memberCount;
    client.setGrowthCount.run(growthPlotCount);



};



