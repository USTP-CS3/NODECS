const fs = require('fs');
const self = require('./self');

function createStack(api, event, key, args) {
	function ccstack(data='') {
		let dict = {[key]:[]};
		if (data !== '') {
			const stacklist = JSON.parse(data);
			dict = stacklist;
			dict[key] = [];
		}

		if (args.length != 0) {
			const arrg = args.reduce((acc,curr) => (acc[curr]="",acc),{});
			dict[key].push(arrg);
			self.echo(api, event, "```stack '"+key+' <'+args+">' has been created..```");
		} else {
			self.echo(api, event, "```stack '"+key+"' has been created..```")
		}

		fs.writeFile(
			'database/stacklist.json', JSON.stringify(dict, null, 2),
			(err) => {
				if (err) throw err;
		});

		console.log(dict);
	}

	// read the database
	fs.readFile('./database/stacklist.json', (err, data) => {
		if (err) {
			ccstack();
			console.log('--new database created--');
		}
		else {
			if(JSON.parse(data).hasOwnProperty(key)) {
					self.echo(api, event, '```this stack already exists..```');
			}
			else {
					ccstack(data);
			}
		}
	});
}

function joinStack(api, event, message, key, args) {
	// read the database
fs.readFile('./database/stacklist.json', (err, data) => {
	if (err) self.echo(api, event, "```unexisting stack..```");
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
					message.userInfo.forEach(
					user => {
						// check if user is aleady in stack
						if (message.snippetSender == user.id) {

							let isInStack = false;

							stacklist[key].forEach(obj => {
								if (obj['origin'] == user.name) {
									isInStack = true;
								}
							});

							if (isInStack) {
								self.echo(api, event, "```you're already in '"+key+"'..```");
								self.echoji(api, event, ':wow:');
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

								self.echoji(api, event, ':like:');
								fs.writeFile('database/stacklist.json', JSON.stringify(stacklist, null, 2),
								(err) => {
									if (err) throw err;
								});
								}
							}
						});
					} else { self.echo(api, event, "```invalid parameters..```") }
			}
			else {
					if (argumentLength == 0) {
						// get name based on id
						message.userInfo.forEach(user => {
							// check if user is already in single stack
							if (message.snippetSender == user.id) {
									if (stacklist[key].includes(user.name)) {
										self.echoji(api, event, ':wow:');
										self.echo(api, event, "```you're already in '"+key+"'..```");
									}
									else {
										self.echoji(api, event, ':like:');
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
					else {self.echo(api, event, "```parameters aren't required..```")}
			}
		} else {self.echo(api, event, "```unexisting stack..```")}
	}
});

}

function deleteStack(api, event, key) {
// read the database
fs.readFile('./database/stacklist.json', (err, data) => {
	if (err) self.echo(api, event, "```there are no keys created..```");
	else {
		const stacklist = JSON.parse(data);
		if (stacklist.hasOwnProperty(key)) {
			delete stacklist[key];
			fs.writeFile(
				'database/stacklist.json', JSON.stringify(stacklist, null, 2),
				(err) => {
					if (err) throw err;
					self.echo(api, event, "```stack '"+key+"' has been deleted..```");
			});
		}
		else { self.echo(api, event, "```unexisting stack..```") }
	}
});
}

function leaveStack(api, event, message, key) {
fs.readFile('./database/stacklist.json', (err, data) => {
	if (err) self.echo(api, event, "```unexisting stack..```");
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
									self.echoji(api, event, ':sad:');
							});
						} else self.echo(api, event, "```you're not in '"+key+"'..```");
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
									self.echoji(api, event, ':sad:');
							});

						}
						else {
							self.echo(api, event, "```you're not in '"+key+"'..```");
						}
					}
				});
			}
		}
		else self.echo(api, event, "```unexisting stack..```");
	}
});
}

function showActive(api, event) {
// read the database
fs.readFile('./database/stacklist.json', 
(err, data) => {
	if (err) self.echo (api, event, "```no active stacks existing..```");
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

		if (response == "") self.echo (api, event, "```no active stacks existing..```");
		else					  self.echo(api, event,  "```\n"+response+"```");
	}
});
}

function showMember(api, event, key) {
// read the database
fs.readFile('./database/stacklist.json', (err, data) => {
	if (err) self.echo(api, event, "```unexisting stack..```");
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
			if (response == '') self.echo(api, event, "```\n*iyaq, wlay nisulod*```");
			else self.echo(api, event, "```\n"+response+"```");
		}
		else self.echo(api, event, "```unexisting stack..```");
	}
});
}

module.exports = {
createStack,
deleteStack,  
joinStack, 
leaveStack,
showActive, 
showMember
}