const self = require('./self');
const wikipedia = require('wikijs').default;

function calc(metadata, event) {
	api.sendMessage(
		'```= '+eval(metadata).toString()+'```', event.threadID,
		(err, msg_info) => {
			if (err) api.sendMessage("```invalid input..```", event.threadID) 
		},
		event.messageID
	);
}

function wiki(api, event, metadata) {
	if (metadata == '') {
		self.echo(api, event, '```no input given..```');
	} else {
		wikipedia()
		.page(metadata)
		.then(page => page.summary())
		.then((result) => self.echo(
			api, event, '```\n'+result+'\n```'))
		.catch(err => {
			if (err) {
				self.echo(
					api, event, '```error retrieving result..```')
			}
		});
	}
}

function what() {
	self.echo("```nodec: discord-like bot for messenger automation```");
}

module.exports = {calc, wiki, what}