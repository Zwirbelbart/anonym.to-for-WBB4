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
	$(elem).attr('data-anonymized', true);
}

function process() {
	//get all links that are external, ignoring those within the message editor
	$('*:not(.cke_wysiwyg_div) > a').each(function() {  //<--seperaten commit machen, welcher den invaliden selektor fixt
		var link = $(this).attr('href');

		if(isExternalAddress(link))
			$(this).attr('data-external-link', true);

	});

	//anonymize ALL external links now
	$('a[data-external-link]:not([data-anonymized])').each(function() {
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
