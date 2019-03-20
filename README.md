<p align="left"> 
  <img src="https://i.imgur.com/h8wIKwH.png" width="75px" height="75px">
</p>

# Albatross [![Blog](https://img.shields.io/badge/Blog-Read-blue.svg)](https://blog.quavergame.com) [![Discord](https://discordapp.com/api/guilds/354206121386573824/widget.png?style=shield)](https://discord.gg/nJa8VFr)

Albatross is one of many servers that powers the rhythm game [Quaver](https://github.com/Quaver). In particular, this server handles things such as: 

* Game client login & authentication
* In-Game Chat
* Multiplayer (In Development)
* Built-in chat bot
* Online user listing & statuses
* and much more!

It's the game server that brings the Quaver client to life wth the rest of the world.

## Setting Up & Running

**Please Note:** In order to run and use this server, you'll need to be a [Steam Partner](https://partner.steamgames.com/), as the server makes use of publisher-only API calls to Steam. 

As such, this server is being developed for internal use, and no support will be given for the usage this software.

* Generate both a [Steam Web & Publisher API key](https://partner.steamgames.com/doc/webapi_overview/auth).
* Make sure Redis is installed.
* Compile the server using the TypeScript compiler (`tsc`)
* In the `dist` folder, create a folder named `config`
* Copy the [example config file](https://github.com/Swan/Albatross/tree/master/src/config) into the `config` folder and rename it to `config.json`
* Fill in the appropriate details within the config file.
* Start up the server with `node index.js` or a process manager of your choice.

### Server Event Logs

**Note:** It's also possible to log important server events & in-game chat messages to Discord via a Webhook. If you'd like this functionality, it's as simple as setting this info in the config file as well.

### Adding Chat Channels

Creating and removing chat channels is as simple as modifying the config file.

An example chat channel would be the following:

```json
{
  "name": "#quaver", 
  "description": "General discussion about Quaver. Type /help for more information!", 
  "allowedUserGroups": 1,
  "isModerated": false,
  "autojoin": true,
  "discordWebhook": {
    "id": "",
    "token": ""
  }
```

* **name** - The name of the chat channel as it appears in-game
* **description** - The description of the chat channel as it appears in-game
* **allowedUserGroups** - The [UserGroup]() required to access this channel.
* **isModerated** - If true, only administrators and developers can talk in this channel.
* **autojoin** - If true, players who connect to the server will automatically be placed in this channel.

## License

Albatross is released and licensed under the [GNU Affero General Public License v3.0](/LICENSE). Please see the [LICENSE](/LICENSE) file for more information.
