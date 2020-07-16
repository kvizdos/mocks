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
    // handle messages.
});

client.login(process.env.DISCORDTOKEN);
```
messages.js:
```
module.exports.ping = (msg) => {
    const author = msg.author
}
```