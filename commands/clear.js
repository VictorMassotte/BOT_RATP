const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports.run = async (bot, message, args) => {

    message.channel.bulkDelete(args[0]).then(() => {
        message.channel
            .send(`J'ai supprime ***${args[0]} messages*** pour vous !`)
            .then(msg => msg.delete(5000));

    });
};

module.exports.help = {
    name: 'clear'
};
