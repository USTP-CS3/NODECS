const login = require("fb-chat-api");
const fs = require('fs');
const KEY = '>';


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
                api.getThreadInfo(event.threadID, (err, message) => {
                    if(err) console.error(err);

                    // check if message starts with command key
                    if (event.body.startsWith(KEY)) {
                        // show typing indicator
                        api.sendTypingIndicator(event.threadID, (err) => console.error(err));  
                        // add 2s delay to prevent spam
                        setTimeout(() => {
                            console.log(message);
                            console.log('-----------------------');

                            let resolve = false;
                            const metadata = event.body.toLowerCase();
                            const request = metadata.slice(1,5);                      

                            // listening to superuser 
                            if(message.snippetSender === '100004964793970') { 
                                switch (request) {
                                    case "stop":
                                        api.sendMessage("-- NODECS DEACTIVATED --", event.threadID);
                                        return listen.stopListening();
                                }
                            }

                            // listening to group only
                            if (message.isGroup) {
                                // ...
                            }
                            // listening to user only
                            else {
                                // ...
                            }

                            // listening to global
                            switch (request) {
                                case 'echo':
                                    api.sendMessage(
                                        metadata.slice(5), 
                                        event.threadID, 
                                        event.messageID
                                    );
                                    resolve = true;
                                    break;
                                case 'calc':
                                    console.log(eval(metadata.slice(5)));
                                    api.sendMessage(
                                        '= '+eval(metadata.slice(5)).toString(), event.threadID, 
                                        (err, msg_info) => { 
                                            if (err) api.sendMessage("invalid input...", event.threadID) }, 
                                        event.messageID
                                    );
                                    resolve = true;   
                                    break;
                                case 'what':
                                    api.sendMessage(
                                        "NODECS: a discord-like bot for facebook messenger", 
                                        event.threadID, 
                                        event.messageID
                                    );
                                    resolve = true;
                                    break;
                                case 'comd':
                                    api.sendMessage(
                                    "As of v1.0.0,\n"+
                                    "echo <string> // print text\n"+
                                    "calc <string> // calculator\n"+
                                    "comd          // commands\n"+
                                    "what          // about"
                                    , event.threadID, event.messageID);
                                    resolve = true;
                                    break;
                            }

                            if (resolve == false) {
                                api.sendMessage("command not found...", event.threadID);
                            }
                        }, 2000)
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