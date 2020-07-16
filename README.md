# Mocks
This is a repo of mocks for NodeJS testing. In it, there are some mocks that already exist, e.g. mongo mocks, and some that *already exist*, but don't have good docs, like the Discord mocks.

## Available mocks:
- Mongodb
- DiscordJS (for bots)

## How to use it?
Let's take the Discord mock as an example. First, let's install Mocks with npm:
`npm install @kvizdos/mocks` 
After that, we can simply require the Discord object from it. Let's destructure it to alias is as `DiscordMocks`
`const { Discord: DiscordMocks } = require("@kvizdos/mocks")`

Now, lets take a look at some bot boilerplate code:
index.js:
```
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require("dotenv");
const MessageHandler = require("./messages");
dotenv.config();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    MessageHandler.ping(msg);
});

client.login(process.env.DISCORDTOKEN);
```
messages.js:
```
module.exports.ping = (msg) => {
    const author = msg.author.username;

    msg.reply(`wow, your name, ${author}, is great!`);
}
```

Now, this will work with the client running, wahoo! But, let's get a unit test in place.
tests/messages.spec.js:
```
const { Discord: DiscordMock } = require("@kvizdos/mocks")
const MessageHandler = require("../messages");

describe("Message unit tests", () => {
    it("should reply with the correct message", () => {
        const Channel = new DiscordMock.Channel();
        const Guild = new DiscordMock.Guild();
        const Member = new DiscordMock.Member(Guild, 12345);
        const Message = new DiscordMock.Message(Member, "Test message", [], Channel, Guild);

        MessageHandler.ping(Message);
        
        expect(Message.replyStatus).toBe("<@1235>, wow, your name, 12345, is great!") // For now, the username is an alias of the ID
    })
})
```

And there you have it! Unit tested Discord bots.