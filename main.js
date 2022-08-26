const login = require("fb-chat-api");
const fs = require('fs');

// use cookie extractor extension to log in
const credentials = { appState: JSON.parse(fs.readFileSync("fbcookies.json", "utf-8")).cookies } 
login(credentials, (err, api) => {
    
    // check for errors when logging in
    if(err) return console.error(err);

    // allow listening and self events
    api.setOptions({listenEvents: true});
    api.setOptions({selfListen: true})

    // chatbot event listener
    const listen = api.listen((err, event) => {
        // check for listening errors
        if(err) return console.error(err);

        // mark read as soon as event recieved
        api.markAsRead(event.threadID, (err) => {
            if(err) console.error(err);
        });

        // check what thread event-type recieved
        switch(event.type) {

            // check chat thread information
            case "message": 
                api.getThreadInfo(event.threadID, (err, dt) => {
                    if(err) console.error(err);
                    
                    
                    console.log(dt);
                    console.log('-----------------------');
                    
                    // give host superuser commands
                    if(dt.snippetSender === '100004964793970') { 
                        if ( event.body === '>stop()') {
                            api.sendMessage("-- NODECS DEACTIVATED --", event.threadID);
                            return listen.stopListening();
                        }
                    }

                    // listening to group chat
                    if (dt.isGroup) {
                        // api.sendMessage(event.body, event.threadID);
                    }
                    // listening to user chat
                    else {
                        
                    }
                })
            break;
   
            // miscellaneous events (added, nickname, etc)
            case "event":
                console.log(event);
            break;
        }
    });
});