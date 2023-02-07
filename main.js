// const fs = require('fs');
// const login = require("fb-chat-api");

// // get version from package
// let pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
// const version = pkg['version'];
// console.log(`v${version}`);

// // make sure database folder is present
// if (!fs.existsSync('./database')) {
// 	fs.mkdirSync('./database');
// }

// // setup user cookie credentials
// const credentials = { 
// /* 
// 	https://youtu.be/y9_yd5a3scM
// 	https://chrome.google.com/webstore/detail/j2team-cookies/okpidcojinmlaakglciglbpcpajaibco
// */


// 	appState: JSON.parse(
// 		fs.readFileSync("fbcookies.json", "utf-8"))
// 			.cookies 
// }

// // use cookie extractor extension to log in
// login(credentials, (err, api) => {
// 	const self = require('./self.js'); 
// 	const func = require('./func.js');
// 	const tool = require('./tool.js');

// 	// check for errors when logging in
// 	if(err) return console.error(err);

// 	// allow listening and self events
// 	api.setOptions({listenEvents: true});
// 	api.setOptions({selfListen: true})

// 	// chatbot event listener
// 	const listen = api.listen(
// 		(err, event) => {
// 		if(err) return console.error(err);

// 		// check what thread event-type recieved
// 		if (event.type == 'message') 
// 		{ // check chat thread information
// 			api.getThreadInfo(event.threadID, 
// 				(err, message) => {
// 				if(err) console.error(err);

// 				if (event.body.startsWith('>')) 
// 				{ 	// message has command key?
// 					const metadata = event.body.toLowerCase().slice(6);
// 					const request = event.body.toLowerCase().slice(1,5);

// 					let arr = metadata.split(" ");
// 					const key = arr.shift();
// 					const args = arr;

// 					self.markRead(api, event); // mark read when event recieved
// 					self.typingIndicator(api, event); // show typing indicator
					
// 					setTimeout(() => { // add 2s delay to prevent spam			
// 						// listening to global
// 						switch (request) 
// 						{
// 							case 'echo':
// 								self.echo(api, event, '```'+metadata+'```');
// 								break;
// 							case 'calc':
// 								func.eval(metadata, event);
// 								break;
// 							case 'wiki':
// 								func.wiki(api, event, metadata);
// 								break;
// 							case 'what':
// 								func.what();
// 								break;
// 							// bug here
// 							/* 
// 								case 'func':
// 									self.echo(
// 										"```\n"+
// 										"---------------------------\n"+
// 										`As of v${version},\n\n`+
// 										">echo <text> // print text\n"+
// 										">calc <math> // assess math\n"+
// 										">func        // functions\n"+
// 										">tool        // group tools\n"+
// 										">what        // show about\n"+
// 										"---------------------------\n"+
// 										"```"
// 									);
// 									break;
// 							*/
// 							default:
// 								// listening to superuser
// 								if(message.snippetSender === self.superuser)
// 								{
// 									switch (request) 
// 									{
// 										case "stop":
// 											self.echo(api, event, ```--offline--```);
// 											return listen.stopListening();
// 										default:
// 											// superuser
// 											self.echo(api, event, '```command <sudo> not found..```');
// 									}
// 								}
// 								// listening to user only
// 								else if (!message.isGroup) {
// 									// ...
// 								}
// 								// listening to group only
// 								else if (message.isGroup) {
// 									switch (request) 
// 									{
// 										case 'actv': // working
// 											tool.showActive(api, event);
// 											break;
// 										case 'memb': // working
// 											tool.showMember(api, event, key);
// 											break;
// 										case 'crte': // working
// 											tool.createStack(api, event, key, args);
// 											break;
// 										case 'dlte': // working
// 											tool.deleteStack(api, event, key);
// 											break;
// 										case 'join': // working
// 											tool.joinStack(api, event, message, key, args);									
// 											break;
// 										case 'leav': // working
// 											tool.leaveStack(api, event, message, key);
// 											break;
// 										case 'tool': // working
// 											self.echo(api, event,
// 												"```\n"+
// 												"------------------------\n"+
// 												"stack member on a list\n\n"+
// 												"([<key>] optional parameter/s)\n"+
// 												">crte <name> [<key>] // create\n"+
// 												">join <name> [<key>] // join\n"+
// 												">show <name> // show members\n"+
// 												">dlte <name> // delete stack\n"+
// 												">leav <name> // leave stack\n"+
// 												">actv        // show stacks\n"+
// 												"------------------------\n"+
// 												"```"
// 											);
// 											break;
// 										default:
// 											// regular user 
// 											self.echo(api, event, '```command <rudo> not found..```');
// 									}
// 								}
// 					}
// 				}, 2000)
// 				}
// 			})
// 		}
// 		else if (event.type == 'event') 
// 		{ // miscellaneous events (added, nickname, etc)
// 			console.log(event, 'event occured');
// 		}
// 	});

// 	// scheduler 
// 	setInterval(() => {
// 		const current = new Date(); 
// 		console.log(current);
// 	}, 1000);
// });


const SCHEDULE = [
	{
		subject: 'Art Appreciation',
		faculty: 'Josan C. Fermano',
		date: [
			{
				day: 'Monday', 
				time: {
					in: new Date().setHours(10,30),
					out: new Date().setHours(12)
				},
			},
			{
				day: 'Thursday', 
				time: {
					in: new Date().setHours(10,30),
					out: new Date().setHours(12)
				},
			}
		],
	},
	{
		subject: 'Understanding the Self',
		faculty: 'N/A',
		date: [
			{
				day: 'Monday', 
				time: {
					in: new Date().setHours(19,30),
					out: new Date().setHours(21)
				},
			},
			{
				day: 'Thursday', 
				time: {
					in: new Date().setHours(19,30),
					out: new Date().setHours(21)
				},
			}
		],
	},
	{
		subject: 'Science, Technology, and Society',
		faculty: 'John Mark B. Revilla',
		date: [
			{
				day: 'Monday', 
				time: {
					in: new Date().setHours(16,30),
					out: new Date().setHours(18)
				},
			},
			{
				day: 'Thursday', 
				time: {
					in: new Date().setHours(16,30),
					out: new Date().setHours(18)
				},
			}
		],
	},
	{
		subject: 'Fitness Activity and Exercises',
		faculty: 'Bernadette M. Tallena',
		date: [
			{
				day: 'Friday', 
				time: {
					in: new Date().setHours(13),
					out: new Date().setHours(15)
				},
			},
		],
	},
	{
		subject: 'Linear Algebra for Computer Science',
		faculty: 'Yamilita M. Pabilona',
		date: [
			{
				day: 'Thursday', 
				time: {
					in: new Date().setHours(10,30,0,0),
					out: new Date().setHours(12,0,0,0)
				},
			},
			{
				day: 'Friday', 
				time: {
					in: new Date().setHours(10,30,0,0),
					out: new Date().setHours(12,0,0,0)
				},
			},
		],
	},
	{
		subject: 'Computer Programming 2',
		faculty: 'Joie Ann Mac',
		date: [
			{
				day: 'Wednesday', 
				time: {
					in: new Date().setHours(17,0,0,0),
					out: new Date().setHours(19,0,0,0)
				},
			},
			{
				day: 'Friday', 
				time: {
					in: new Date().setHours(13,30,0,0),
					out: new Date().setHours(16,30,0,0)
				},
			},
		],
	},
	{
		subject: 'Physics for Computer Science (Basic Electronics)',
		faculty: 'Jefrie Bilar',
		date: [
			{
				day: 'Thursday', 
				time: {
					in: new Date().setHours(15,0,0,0),
					out: new Date().setHours(17,0,0,0)
				},
			},
			{
				day: 'Friday', 
				time: {
					in: new Date().setHours(16,30,0,0),
					out: new Date().setHours(19,30,0,0)
				},
			},
		],
	},
	{
		subject: 'Reserve Officer Training Corps 2',
		faculty: 'Irish Delos Reyes',
		date: [
			{
				day: 'Saturday', 
				time: {
					in: new Date().setHours(8,0,0,0),
					out: new Date().setHours(12,0,0,0)
				},
			},
		],
	},

	
]


// what is the current day
const DAYS = [
	'Sunday', 
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
];
const DAY = DAYS[new Date().getDay()];


// what are the subjects on that day
function getTodaySubjects() {
	let bucket = [];
	let format = '';
	for (const i of SCHEDULE) {
		for (const j of i.date) {
			const timeIn = 
				new Date(j.time.in)
				.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
			
			const timeOut = 
				new Date(j.time.out)
				.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

			if (DAY == j.day) {
				bucket.push(i);

				format += 
				`${i.subject}\n`+
				`${j.day} `+
				`${timeIn} - ${timeOut}\n`+
				`${i.faculty}\n\n`;
			}
		}
	}
	return {bucket, format};
}

function getNextSubjects() {
	
}

console.log(getTodaySubjects().bucket);

// setInterval(() => {
// 	const now = new Date(); 
// 	const day = now.getDay();
// 	const time = now.toLocaleTimeString(); 
	
// 	console.log(time);
// 	console.log(WEEK[day]);

// 	const morning = new Date().setHours(5,0,0,0);
// 	const afternoon = new Date().setHours(12,0,0,0);

// 	// if (morning < now) {
// 	// console.log("7am has passed");
// 	// } else {
// 	// console.log("7am has not passed");
// 	// }

	
// }, 1000);


