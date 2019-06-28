const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports.run = async (bot, message, args) => {
    const { result } = await fetch('https://api-ratp.pierre-grimaud.fr/v3/schedules/rers/a/nanterre+ville/R').then(res => res.json())
    const horaires = result.schedules.slice(0,3)
    const catEmbed = new Discord.RichEmbed()
        .setColor('#d643c')
        .setTitle('RER A: Nanterre - Ville: ');
    horaires.forEach(passage => {
        catEmbed.addField('Horaire :', passage.message)
        catEmbed.addField('Destination:', passage.destination)
    })

    message.channel.send(catEmbed)

};

module.exports.help = {
    name: 'rerparis'
};