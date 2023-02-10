const SCHEDULE = [
	{
		subject: 'Art Appreciation',
		faculty: 'Josan C. Fermano',
		gcid: '5716034245160687',
		meet: 'https://meet.google.com/acn-auiy-ejt',
		date: [
			{
				day: 'Monday', 
				time: {
					in: new Date().setHours(10,30,0,0),
					out: new Date().setHours(12,0,0,0)
				},
			},
			{
				day: 'Thursday', 
				time: {
					in: new Date().setHours(10,30,0,0),
					out: new Date().setHours(12,0,0,0)
				},
			}
		],
	},
	{
		subject: 'Understanding the Self',
		faculty: 'N/A',
		gcid: 'N/A',
		meet: 'N/A',
		date: [
			{
				day: 'Monday', 
				time: {
					in: new Date().setHours(19,30,0,0),
					out: new Date().setHours(21,0,0,0)
				},
			},
			{
				day: 'Thursday', 
				time: {
					in: new Date().setHours(19,30,0,0),
					out: new Date().setHours(21,0,0,0)
				},
			}
		],
	},
	{
		subject: 'Science, Technology, and Society',
		faculty: 'John Mark B. Revilla',
		gcid: '5784085135010708',
		meet: 'N/A',
		date: [
			{
				day: 'Monday', 
				time: {
					in: new Date().setHours(16,30,0,0),
					out: new Date().setHours(18,0,0,0)
				},
			},
			{
				day: 'Thursday', 
				time: {
					in: new Date().setHours(16,30,0,0),
					out: new Date().setHours(18,0,0,0)
				},
			}
		],
	},
	{
		subject: 'Fitness Activity and Exercises',
		faculty: 'Bernadette M. Tallena',
		gcid: '5865934063441917',
		meet: 'N/A',
		date: [
			{
				day: 'Friday', 
				time: {
					in: new Date().setHours(13,0,0,0),
					out: new Date().setHours(15,0,0,0)
				},
			},
		],
	},
	{
		subject: 'Linear Algebra for Computer Science',
		faculty: 'Yamilita M. Pabilona',
		gcid: '5565259690268202',
		meet: 'https://meet.google.com/ztf-gppz-ggb',
		date: [
			{
				day: 'Tuesday', 
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
		gcid: 'N/A',
		meet: 'N/A',
		date: [
			{
				day: 'Wednesday', 
				time: {
					in: new Date().setHours(17,0,0,0),
					out: new Date().setHours(19,0,0,0)
				},
			},
			{
				day: 'Saturday', 
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
		gcid: '6335813383117874',
		meet: 'N/A',
		date: [
			{
				day: 'Tuesday',
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
		gcid: 'N/A',
		meet: 'N/A',
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

let triggerRollcall = true;
let triggerReminder = true;

const PAYAMAN = '5865527143482260';
const QUAXODE = '5915493318539244';
const UPDATES = '6395449667236192';
const CS1D 	  = '8766273246780136';

const fs = require('fs');
const login = require("fb-chat-api");

// setup user cookie credentials
const credentials = { 
/* 
	https://youtu.be/y9_yd5a3scM
	https://chrome.google.com/webstore/detail/j2team-cookies/okpidcojinmlaakglciglbpcpajaibco
*/

	appState: JSON.parse(
		fs.readFileSync("fbcookies.json", "utf-8")
	).cookies 
}

// use cookie extractor extension to log in
login(credentials, (err, api) => {
	// check for errors when logging in
	if(err) return console.error(err);

	// allow listening and self events
	api.setOptions({listenEvents: false});
	api.setOptions({selfListen: false})

	api.sendMessage('`> bot is now online`', QUAXODE);

	setInterval(() => {
		if (triggerRollcall) {
			const hour = new Date().getHours();
			const minute = new Date().getMinutes();
			const morning = hour === 4 && minute === 0;
			const afternoon = hour === 12 && minute === 0;
			
			if (morning || afternoon) {
				const subjects = getTodaySubjects();

				let format = '`'+`Good ${(hour < 12) ? 'Morning' : 'Afternoon'},`+'`\n\n';

				for (const subj of subjects) {
					const timeIn = 
						new Date(subj.time.in)
						.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
			
					const timeOut = 
						new Date(subj.time.out)
						.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
	
					format +=
					'`'+`${subj.subject}`+'`\n'+
					'`'+`${timeIn} - ${timeOut}`+'`\n'+
					'`'+`${subj.faculty}`+'`\n\n';
				}

				api.sendMessage(format, UPDATES);
				console.log('\n\n'+format);

				triggerStartup = false;
				triggerRollcall = false;
				setTimeout(() => {
					// wait 30 minutes to reactivate
					triggerRollcall = true;
				}, 500*60*60);
			}
		}

		if (triggerReminder) {
			const subject = getNextSubject();
			if (subject) {
				const currentTime = subject.time.now;
				const targetTime = subject.time.in;
				
				const {hours, minutes} = getTimeDifference(targetTime, currentTime);
				
				if (hours == 0 && minutes <= 10) {
					let format = (hours > 0) 
						? '`'+`Reminder: ${subject.subject}`+'`\n`'+`in ${hours} hours and ${minutes} minutes...`+'`'
						: '`'+`Reminder: ${subject.subject}`+'`\n`'+`in ${minutes} minutes...`+'`';
					format += `\n\n ${subject.meet}`;

					// send reminder to chatbot
					api.sendMessage(format, UPDATES);
					if (subject.gcid != 'N/A') {
						api.sendMessage(format, subject.gcid);
					}
					console.log('\n\n'+format);
					
					triggerReminder = false;
					setTimeout(() => {
						// wait 30 minutes to reactivate
						triggerReminder = true;
					}, 500*60*60);
				}
			}
		}
		process.stdout.write(".");
	}, 20000);
});

function getTodaySubjects() {
	let bucket = [];
	const {day, schedule} = filterCurrentDay(SCHEDULE);
	
	for (const i of schedule) {
		for (const j of i.date) {
			if (day == j.day) {
				bucket.push({
					subject: i.subject,
					faculty: i.faculty,
					day: j.day,
					time: {
						in: j.time.in,
						out: j.time.out,
						now: new Date(),
					},
					meet: i.meet,
				});
			}
		}
	}
	
	// sort based on day of week
	return bucket.sort((a, b) => a.time.in - b.time.in);
}

function getNextSubject() {
	const schedule = getTodaySubjects();
	const filterUpcoming = schedule.filter(subject => {
		const currentTime = subject.time.now;
		const targetTime = subject.time.in;
		return targetTime >= currentTime;
	});
	const subject = filterUpcoming[0];
	return (subject !== undefined) ? subject : false;
}

function getTimeDifference(targetTime, currentTime) {
	const differenceInMinutes = (targetTime - currentTime) / 1000 / 60;
	const hours = Math.floor(differenceInMinutes / 60);
	const minutes = Math.floor(differenceInMinutes % 60);
	return {hours, minutes}
}

function filterCurrentDay(schedule) {
	const today = new Date().getDay();
	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const currentDay = weekdays[today];
	return {
		day: currentDay,
		schedule: schedule.filter(subject => subject.date.some(day => day.day === currentDay))
	}; 
}
