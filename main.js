const login = require("fb-chat-api");
const fs = require('fs');

// Create simple echo bot
login({ appState: JSON.parse(fs.readFileSync("fbcookies.json", "utf-8")).cookies } , (err, api) => {
    if(err) return console.error(err);

    var yourID = "000000000000000";
    var msg = "Hey! joe wassup imma go now";
    api.sendMessage(msg, yourID);
});