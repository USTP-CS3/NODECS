const login = require("fb-chat-api");
const fs = require('fs');
const KEY = '>';

// make sure database folder is present
if (!fs.existsSync('./database')){
	fs.mkdirSync('./database');
}

// use cookie extractor extension to log in
const credentials = { 
	appState: JSON.parse(fs.readFileSync("fbcookies.json", "utf-8")).cookies 
}

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
								let resolve = false;
								const metadata = event.body.toLowerCase().slice(6);
								const request = event.body.toLowerCase().slice(1,5);                      

								// listening to superuser 
								if(message.snippetSender === '100004964793970') { 
										switch (request) {
											case "stop":
												api.sendMessage("```--deactivated--```", event.threadID);
												return listen.stopListening();
										}
								}

								function echo(message) {
									api.sendMessage(message, event.threadID, event.messageID); 
								}
								function echoji(hash) {
									api.setMessageReaction(hash, event.messageID, (err)=> {
										if (err) console.error(err)
									});
								}
								// listening to global
								switch (request) {
										case 'echo':
												api.sendMessage(
														'```'+metadata+'```', 
														event.threadID, 
														event.messageID
												);
												resolve = true;
												break;
										case 'calc':
												console.log(eval(metadata));
												api.sendMessage(
														'```= '+eval(metadata).toString()+'```', event.threadID, 
														(err, msg_info) => { 
																if (err) api.sendMessage("```invalid input..```", event.threadID) }, 
														event.messageID
												);
												resolve = true;   
												break;
										case 'what':
												api.sendMessage(
														"```nodecs is a discord-like bot for messenger automation```", 
														event.threadID, 
														event.messageID
												);
												resolve = true;
												break;
										case 'func':
												api.sendMessage(
												"```\n"+
												"---------------------------\n"+
												"As of v1.1.1,\n\n"+
												">echo <text> // print text\n"+
												">calc <math> // assess math\n"+
												">func        // functions\n"+
												">tool        // group tools\n"+
												">what        // show about\n"+
												"---------------------------\n"+
												"```"
												, event.threadID, event.messageID);
												resolve = true;
												break;
								}
								// listening to group only
								if (message.isGroup) {  
									let arr = metadata.split(" "); 	// convert string metadata to array
									const key = arr.shift();
									const args = arr;

									function createStack(data='') {
										let dict = {[key]:[]};
										if (data !== '') {
											const stacklist = JSON.parse(data);  
											dict = stacklist; 
											dict[key] = []; 	
										}

										if (args.length != 0) {
											const arrg = args.reduce((acc,curr) => (acc[curr]="",acc),{});
											dict[key].push(arrg);
											echo("```stack '"+key+' <'+args+">' has been created..```");
										} else { 
											echo("```stack '"+key+"' has been created..```") 
										}
										
										fs.writeFile(
											'database/stacklist.json', JSON.stringify(dict, null, 2), 
											(err) => {
												if (err) throw err;
										});

										console.log(dict);
									}  

									switch (request) {
										case 'crte': // working
											// read the database
											fs.readFile('./database/stacklist.json', (err, data) => {
												if (err) {
													createStack();
													console.log('--new database created--');
												}
												else {            
													if(JSON.parse(data).hasOwnProperty(key)) {
														echo('```this stack already exists..```');
													}
													else {
														createStack(data);
													}
												}
											});                                       
											resolve = true;
											break;
										case 'join': // working
											// read the database
											fs.readFile('./database/stacklist.json', (err, data) => {
													if (err) echo("```unexisting stack..```");
													else { 
													const stacklist = JSON.parse(data);  
													// check if the name of stack exists
													if (stacklist.hasOwnProperty(key)) {
														// check if length of created template the same as argument 
														const argumentLength = args.length;
														
														if (typeof stacklist[key][0] === 'object') {
															const templateLength = Object.keys(stacklist[key][0]).length;
															if (templateLength == argumentLength) {
																// get name of origin based on id
																let dict = {};
																message.userInfo.forEach(user => {
																	// check if user is aleady in stack
																	if (message.snippetSender == user.id) {
																		
																		let isInStack = false;

																		stacklist[key].forEach(obj => {
																			if (obj['origin'] == user.name) {
																				isInStack = true;
																			}  
																		});

																		if (isInStack) {
																			echo("```you're already in '"+key+"'..```");
																			echoji(':wow:');
																		}
																		else { 
																			dict = {"origin": user.name} 
								
																			let count = 0;
																			for (let obj in stacklist[key][0]) {
																				// copy the template and append to it
																				dict[obj] = args[count]; 
																				count++;
																			}
																			stacklist[key].push(dict);

																			echoji(':like:');
																			fs.writeFile('database/stacklist.json', JSON.stringify(stacklist, null, 2), 
																			(err) => {
																				if (err) throw err;
																			});
																		}
																	}
																});
															} else { echo("```invalid parameters..```") }
														} 
														else {
															if (argumentLength == 0) {
																// get name based on id
																message.userInfo.forEach(user => {
																	// check if user is already in single stack
																	if (message.snippetSender == user.id) {
																		if (stacklist[key].includes(user.name)) {
																			echoji(':wow:');
																			echo("```you're already in '"+key+"'..```");
																		}  
																		else {
																			echoji(':like:');
																			stacklist[key].push(user.name);
																			fs.writeFile(
																				'database/stacklist.json', JSON.stringify(stacklist, null, 2), 
																				(err) => {
																					if (err) throw err;
																			});
																		}
																	}
																});
															}
															else {echo("```parameters aren't required..```")}
														}
													} else {echo("```unexisting stack..```")}
												}
											});
											resolve = true;    
											break;
										case 'actv': // working
											// read the database
											fs.readFile('./database/stacklist.json', (err, data) => {
													if (err) echo ("```no active stacks existing..```");
													else {         
															const stacklist = JSON.parse(data);     
															
															let count = 1;
															let response = '';
															for (var key of Object.keys(stacklist)) {
																if (typeof stacklist[key][0] === 'object') {
																	response += `${count}) ${key} <${Object.keys(stacklist[key][0])}>\n`;
																} 
																else {response += `${count}) ${key}\n`;}
																count++;
															}

															if (response == "") echo ("```no active stacks existing..```");
															else 								echo("```\n"+response+"```");
													}
											});
											resolve = true;
											break;
										case 'dlte': // working
												// read the database
												fs.readFile('./database/stacklist.json', (err, data) => {
														if (err) echo("```there are no keys created..```");
														else {         
															const stacklist = JSON.parse(data);     
															if (stacklist.hasOwnProperty(key)) {
																	delete stacklist[key];
																	fs.writeFile(
																		'database/stacklist.json', JSON.stringify(stacklist, null, 2), 
																		(err) => {
																			if (err) throw err;
																			echo("```stack '"+key+"' has been deleted..```");
																	});
															}
															else { echo("```unexisting stack..```") }
														}
												});
												resolve = true;
												break;
										case 'leav': // working
											fs.readFile('./database/stacklist.json', (err, data) => {
												if (err) echo("```unexisting stack..```");
												else {
													const stacklist = JSON.parse(data);     
													if(stacklist.hasOwnProperty(key)) {
														let count = 0;
														if (typeof stacklist[key][0] === 'object') {
															message.userInfo.forEach(user => {
																// check if user is already in single stack
																if (message.snippetSender == user.id) {
																	
																	let found = false;
																	for (let obj of stacklist[key]) {
																		if (obj['origin'] == user.name) {
																			found = true;
																			break;
																		}
																		count++;
																	}

																	if (found) {
																		stacklist[key].splice(count, 1);
																		fs.writeFile(
																			'database/stacklist.json', JSON.stringify(stacklist, null, 2), 
																			(err) => {
																				if (err) throw err;
																				echoji(':sad:');
																		});			
																	} else echo("```you're not in '"+key+"'..```");
																}
															});													
														}
														else {
															message.userInfo.forEach(user => {
																// check if user is already in single stack
																if (message.snippetSender == user.id) {
																	if (stacklist[key].includes(user.name)) {
																		stacklist[key].splice(
																			stacklist[key].indexOf(user.name)
																		);
																		
																		fs.writeFile(
																			'database/stacklist.json', JSON.stringify(stacklist, null, 2), 
																			(err) => {
																				if (err) throw err;
																				echoji(':sad:');
																		});

																	} 
																	else {
																		echo("```you're not in '"+key+"'..```"); 
																	}
																}
															});	
														}
													}
													else echo("```unexisting stack..```");
												}
											});
											resolve = true;    
											break;
										case 'memb': // working
												// read the database
												fs.readFile('./database/stacklist.json', (err, data) => {
													if (err) echo("```unexisting stack..```");
													else {
														const stacklist = JSON.parse(data);     
														if(stacklist.hasOwnProperty(key)){
															let response = '';
															if (typeof stacklist[key][0] === 'object') {
																stacklist[key].slice(1).forEach(
																	member => response+='*| '+JSON.stringify(member, null, 2)+'\n\n');
															}
															else {
																stacklist[key].forEach(
																	member => response+='*| '+member+'\n');
															}
															if (response == '') echo("```\n*iyaq, wlay nisulod*```"); 
															else echo("```\n"+response+"```");
														}
														else echo("```unexisting stack..```");
													}
												});
												resolve = true;    
												break;
										case 'tool': // working
														api.sendMessage(
																"```\n"+
																"------------------------\n"+
																"stack member on a list\n\n"+
																">actv       // active\n"+
																">memb <key> // members\n"+
																">crte <key> // create\n"+
																">dlte <key> // delete\n"+
																">join <key> // join\n"+
																">leav <key> // leave\n"+
																"------------------------\n"+
																"```"
																, event.threadID, event.messageID);
														resolve = true;
														break;
									}
								}
								// listening to user only
								else {
											// ...
								}
								// if no command was resolved
								if (resolve == false) {
											api.sendMessage("```command not found..```", event.threadID);
								}
						}, 2000)
					}
				})
			break;

			// miscellaneous events (added, nickname, etc)
			case "event":
				console.log(event, 'event occured');
			break;
		}
	});
});