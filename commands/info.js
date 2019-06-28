const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let botIcon = bot.user.displayAvatarURL;
    let embed = new Discord.RichEmbed()
        .setDescription('Information sur le bot')
        .setColor('d643c')
        .addField('Nom du bot', bit.user.username)
        .addField('Creer le', bot.user.createdAt);

 return message.channel.send(embed);      
};

module.exports.help = {
    name: 'info'
};