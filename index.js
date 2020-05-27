// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot is ready to operate.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`protect and serve`);
});

client.on("guildCreate", (guild) => {
  // This event triggers when the bot joins a guild.
  console.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
  );
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", (guild) => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async (message) => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "help") {
    message.delete().catch((O_o) => {});
    message.channel.send(
      "`LISTE DES COMMANDES`\n`1. /help: affiche le présent message`\n`2. /purge x: nettoie x messages`"
    );
  }

  if (command === "plainte") {
    // Delete la commande pour plus de clarté
    message.delete().catch((O_o) => {});
    // Set le filtre en ignorant les messages du bot
    let filter = (m) => !m.author.bot;
    message.channel.send(
      "Veuillez entrer le **nom** et le **prénom** de la victime."
    );
    // Message 1 - Nom Prénom
    message.channel.awaitMessages(filter, { max: 2 }).then((collected1) => {
      const response1 = collected1.first();
      let name = response1.content;

      // Message 2 - Téléphone
      message.channel.send("Veuillez saisir son **n° de téléphone**.");
      message.channel.awaitMessages(filter, { max: 2 }).then((collected2) => {
        const response2 = collected2.first();
        let tel = response2.content;

        // Message 3 - Déposition
        message.channel.send("Veuillez maintenant rédiger la **déposition**.");
        message.channel.awaitMessages(filter, { max: 2 }).then((collected3) => {
          const response3 = collected3.first();
          let deposition = response3.content;

          // Result
          let embed = new Discord.RichEmbed()
            .setTitle("Dépôt de plainte - " + name + " (" + tel + ")")
            .setDescription(deposition)
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setColor("#FFAB32");

          message.channel.send("Valider la plainte ?");
          message.channel.send(embed).then((embedMessage) => {
            embedMessage.react("👍").then(() => embedMessage.react("👎"));
          });

          const filter2 = (reaction) => {
            return ["👍", "👎"].includes(reaction.emoji.name);
          };

          message.awaitReactions(filter2, { max: 4, time: 5000, errors: ["time"] })
          .then((collected) => {
            const reaction = collected.first();
            console.log("aa");
            if (reaction.emoji.name === "👍") {
              console.log("ff");
              message.reply("sa marche lol");
            } else message.reply("Operation canceled.");
          })
          .catch(() => {
            message.reply(
              "No reaction after 5 seconds, operation cancelled"
            );
          });
        });
      });
    });

    /**
     *
     *
     *
     *
     *
     *
     *
     */
  }

  if (command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply(
        "Please provide a number between 2 and 100 for the number of messages to delete"
      );

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({ limit: deleteCount });
    message.channel
      .bulkDelete(fetched)
      .catch((error) =>
        message.reply(`Couldn't delete messages because of: ${error}`)
      );
  }
});

client.login(config.token);
