var whitelistedLinks = ['#'];
var services = [
	{
		'displayName': 'anonym.to',
		'anonymize': function(link) { 
			return 'http://anonym.to/?' + encodeURIComponent(link); 
		}
	},
	{
		'displayName': 'dontknow.me',
		'anonymize': function(link) { 
			return 'http://dontknow.me/at/?' + encodeURIComponent(link); 
		}
	},
	{
		'displayName': 'HideMyAss',
		'anonymize': function(link) { 
			return  document.location.protocol + '//hidemyass.com/?' + encodeURIComponent(link); 
		}
	}
]
var service;
var regExp = new RegExp("//" + location.host + "($|/)");

function anonymizeLink(elem) {
	$(elem).attr('href', service.anonymize($(elem).attr('href')));
	$(elem).attr('data-anonymized', 'true');
}

function process() {
	//get all links that are not checked (so far), ignoring those within the message editor
	$('a:not([data-external-link])').each(function() {
		var c = $(this);
		if($('.redactor-box').has(c).length < 1) {
			var link = c.attr('href');
			var anonymized = c.attr('data-anonymized');

			//check if this link is a) really external and b) not anonymized (not having data-anonymized set to 'true')
			if(isExternalAddress(link) && (typeof anonymized == 'undefined' || anonymized != 'true'))
				c.attr('data-external-link', 'true');
		}
	});

	//now anonymize all links that were marked being external that were not anonymized yet
	$('a[data-external-link]').each(function() {
		var anonymized = $(this).attr('data-anonymized');

		if(typeof anonymized == 'undefined' || anonymized != 'true')
			anonymizeLink(this);
	});
}

function isExternalAddress(link) {
	if(typeof link == 'undefined' || $.inArray(link, whitelistedLinks) > -1)
		return false;

	return !((link.substring(0, 4) === "http") ? regExp.test(link) : true);
}

document.addEventListener('DOMContentLoaded', function() { 
	if(typeof linkAnonymizerService == 'undefined') {
		console.error('linkAnonymizer: Unable to determine anonymizer service, aborting');
		return;
	}

	service = services[linkAnonymizerService];

	if(typeof service == 'undefined') {
		console.error('linkAnonymizer: Service not defined, aborting');
		return;
	}

	$(document).ready(function() {
		process();
	});

	$('html').bind('DOMSubtreeModified', function(e) {
		throttle(process, 500);
	});
});

//credits: http://www.nczonline.net/blog/2007/11/30/the-throttle-function/
function throttle(method, delay) {
	clearTimeout(method._tId);
	method._tId= setTimeout(function(){
		method();
	}, delay);
}