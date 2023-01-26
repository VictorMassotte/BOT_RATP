require("dotenv").config();
const Discord = require("discord.js");
const moment = require("moment-timezone");
const { default: axios } = require("axios");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const Client = new Discord.Client({ intents: [] });
console.log("Connexion en cours...");

const data = new SlashCommandBuilder()
  .setName("bus")
  .setDescription("Donne les horaires des bus 157")
  .addStringOption((option) =>
    option.setName("numero_bus")
    .setDescription("Numero de bus")
    .setRequired(true)
    .addChoices(
        { name: '157', value: '157' },
    ))
    .addStringOption((option) =>
    option.setName("arret_bus")
    .setDescription("Arret de bus")
    .setRequired(true)
    .addChoices(
        { name: 'Boulevard de la Seine', value: '24620' },
        { name: 'Général Leclerc', value: '27700' },
    )
    );

Client.on("ready", () => {
  Client.application.commands.create(data);
  console.log("Le bot est prêt !");
});

Client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {

   if (interaction.commandName === "bus") {

    const idArret = interaction.options.get("arret_bus").value;
    const arrayBus = [];

      const busPromise = axios.get(
        `https://prim.iledefrance-mobilites.fr/marketplace/stop-monitoring?MonitoringRef=STIF:StopPoint:Q:${idArret}:`,
        {
          headers: {
            apiKey: process.env.API_KEY,
          },
        }
      );

      const busRepesponse = await busPromise;
      const busJson = busRepesponse.data;

      for (
        let i = 0;
        i < busJson.Siri.ServiceDelivery.StopMonitoringDelivery.length;
        i++
      ) {
        arrayBus.push(
          busJson.Siri.ServiceDelivery.StopMonitoringDelivery[i]
            .MonitoredStopVisit
        );
      }

      const arrayDirectionName = [];
      const arrayExpectedDepartureTime = [];
      const arrayDepartureStatus = [];
      const arrayStationName = [];

      arrayBus.forEach((element) => {
        element.forEach((monitor) => {

        arrayStationName.push(monitor.MonitoredVehicleJourney.MonitoredCall.StopPointName);
         arrayDirectionName.push(
            monitor.MonitoredVehicleJourney.DirectionName
          );
          arrayDepartureStatus.push(
            monitor.MonitoredVehicleJourney.MonitoredCall.DepartureStatus
          );

          const originalTime =
            monitor.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime;
          const updatedTime = updateTime(originalTime, "Europe/Paris");
          arrayExpectedDepartureTime.push(updatedTime);
        });
      });

      if (arrayExpectedDepartureTime.length >= 1) {

        const embed = new EmbedBuilder()
            .setTitle("Station: " + arrayStationName.map(data => data[0].value)[0])
            .setDescription("Direction: " + arrayDirectionName.map(data => data[0].value)[0])
          .setThumbnail(
            "https://www.bougerenville.com/wp-content/uploads/2019/02/bus-157-idf-ratp.jpg"
          )
          .setColor(0x00ae86)
          .addFields(
            {
              name: "Temps d'attente",
              value: arrayExpectedDepartureTime[0],
              inline: true,
            },
            {
              name: "Statut",
              value: arrayDepartureStatus[0],
              inline: true,
            }
          )
          .addFields(
            { name: "\u200B", value: "\u200B" },
            {
              name: "Temps d'attente",
              value: arrayExpectedDepartureTime[1],
              inline: true,
            },
            {
              name: "Statut",
              value: arrayDepartureStatus[1],
              inline: true,
            },
            { name: "\u200B", value: "\u200B" }
          )

          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      } else if (arrayExpectedDepartureTime.length === 0) {
        const embed = new EmbedBuilder()
        .setTitle("Station: " + arrayStationName.map(data => data[0].value)[0])
        .setDescription("Direction: " + arrayDirectionName.map(data => data[0].value)[0])
          .setThumbnail(
            "https://www.bougerenville.com/wp-content/uploads/2019/02/bus-157-idf-ratp.jpg"
          )
          .setColor(0x00ae86)
          .addFields(
            {
              name: "Temps d'attente",
              value: arrayExpectedDepartureTime[0],
              inline: true,
            },
            {
              name: "Statut",
              value: arrayDepartureStatus[0],
              inline: true,
            }
          )

          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
            .setTitle("Information non disponible")
            .setColor(0x00ae86)
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
      }
    }
  }
});

function updateTime(time, timezone) {
  const originalTime = moment.utc(time);
  const newTime = moment.tz(originalTime, timezone);
  const duration = moment.duration(newTime.diff(moment()));
  return `Dans ${duration.hours()} heures et ${duration.minutes()} minutes`;
}

Client.login(process.env.TOKEN);
