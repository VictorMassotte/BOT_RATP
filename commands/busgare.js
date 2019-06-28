const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports.run = async (bot, message, args) => {
    const { result } = await fetch('https://api-ratp.pierre-grimaud.fr/v3/schedules/bus/157/general+leclerc/A').then(res => res.json())
    const horaires = result.schedules.slice(0,2)
    const catEmbed = new Discord.RichEmbed()
        .setColor('#d643c')
        .setTitle('Station General Leclerc, BUS 157: ');
    horaires.forEach(passage => {
        catEmbed.addField('Passage dans :', passage.message)
    })

    message.channel.send(catEmbed)

};

module.exports.help = {
    name: 'busgare'
};