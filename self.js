const superuser = '100004964793970';

function echo(api, event, message) { // reply to command with resend text 
	api.sendMessage(message, event.threadID, event.messageID); 
}

function echoji(api, event, hash) { // reply to command with emoji
	api.setMessageReaction(hash, event.messageID, 
		(err)=> { 
		if (err) console.error(err)
	});
}

function markRead(api, event) {
	api.markAsRead(event.threadID, 
		(err) => {
		if(err) console.error(err);
	});
}

function typingIndicator(api, event) {
	api.sendTypingIndicator(event.threadID, 
		(err)=> { 
		if (err) console.error(err)
	});
}

module.exports = {
	superuser, 
	typingIndicator,
	echo, echoji, markRead,
}