# PM2-Manager

PM2-manager is a multi support manager for the PM2 package on node.js

This project is in WIP, so bugs, missing features/documentation are normal.

In this repository, you'll find:
- A node.js API using Nest.js to send actions to local PM2 processes
- A typescript Telegram bot to call the api with buttons and menu 
- A typescript Discord bot to do the same things [TODO]

## Installation

```
git clone https://github.com/bycop/pm2-manager
```

Then, in each folder you'll have a readme to explain how to install and how to start.

## Usage

### Telegram

- You'll find a main menu with the list of all the processes running on your server
- Then, when clicking on any of them, you'll have access to start, stop, restart and logs of the process
