# DiceOctopus

A Discord bot allowing users to play dice.

## Installation

### Requirements

The project relies on **node v20**.

### Install

To install the dependencies, run the following command :

```bash
npm ci
```

### Setup

To setup the bot, you must define a `.env` file containing the following variables :

```txt
TOKEN=<token of your Discord bot>
CLIENT_ID=<id of the application>
GUILD_ID=<id of the development guild> (mandatory if ENV is not "deployment")
ENV=<"development" or "deployment"> (default is "deployment")
```

For the `ENV` variable, if its value is "development" the commands are only updated in the Discord Server with the id `GUILD_ID` otherwise the commands are updated in all the Discord Servers where the bot can execute / (SLASH) commands.

The `GUILD_ID` and `ENV` must be defined only if you want to deploy in "development" mode.

### Start

Firstly, the commands must be deployed in the target servers. To do so, execute the script `deploy-commands.js` using the following command :

```bash
node deploy-commands.js
```

And then, the Bot can be started with the following command :

```bash
node .
```

## Available commands

### /throw

Throws dice.

Usage: `/throw dices [silent]`

Details:   
- `dices`: what to throw. Each dice is of the form `xdy` where `x` is the number of dice to throw and `y` is the type of dice thrown. (e.g. `3d6` means that 3 dices with 6 faces are thrown). It is also possible to add (+) or subtract (-) values to the final result. (e.g. `3d6 + 2` which adds 2 to the final result)
- `silent`: (**optional**) if <tt>true</tt>, do not detail the results of the dices.

Result:    

The command returns the result in bold of the dices and if `silent` is omitted or set to false the details of each dice is shown.   
For example,   
`/throw 1d100 7d8 + 3`  
> 1d100 7d8 + 3 = **62** (59 + 3)
> 
> - 7d8 : 2 + 3 + 8 + 7 + 2 + 5 + 4 (31)   
> - 1d100 : 28 (28)