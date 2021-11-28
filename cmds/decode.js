const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "decode",
  aliases: ["decode", "dnc"],
  description: "decodes any supplied text",
  category: "utl",
  async run(client, message, args) {
    const encds = ["ascii", "base64", "binary", "hex", "latin1", "ucs-2", "ucs2", "utf-8", "utf16le", "utf8", "url"];
    let enc;
    if (!encds[Number(args[0]) - 1] || (isNaN(args[0]))) {
      return message.reply(`Invalid index "${args[0]||"null"}"; the indexes are as follows: ${encds.map((x) => `${x} (\`${encds.indexOf(x) + 1}\`)`).join(", ")}`)
    } else {
      if (!args.slice(1).join(" ").length) return message.reply("You must supply some text for me to decode!");

      if (Number(args[0] == 3)) {
        function binaryAgent(str) {
          var newBin = str.split(" ");
          var binCode = [];      
            for (i = 0; i < newBin.length; i++) {
                binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
            }
          return binCode.join("");
        };
        enc = binaryAgent(args.slice(1).join(" "));
      } else if (Number(args[0]) == 11) {
        enc = decodeURIComponent(args.slice(1).join(" "));
      } else {
        enc = Buffer.from(args.slice(1).join(" "), (encds[Number(args[0]) - 1])).toString("ascii");
      }
    }
    if (!enc) return message.reply("The decode function has returned nothing this time round... try to decode something a bit longer than " + args.slice(1).join(" ").length + " characters.");
    message.reply(enc, {
      code: "",
      split: {
        char: ""
      },
    });
  }
}