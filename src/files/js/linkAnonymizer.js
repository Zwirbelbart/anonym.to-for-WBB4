var whitelistedLinks = ['#'];
var serviceUrls = ['http://anonym.to/?', 'http://dontknow.me/at/?'];
var urlPrefix = serviceUrls[linkAnonymizerService];
var regExp = new RegExp("//" + location.host + "($|/)");

function anonymizeLink(elem) {
	$(elem).attr('href', urlPrefix + encodeURIComponent($(elem).attr('href')));
	$(elem).attr('data-anonymized', true);
}

function process() {
	//get all links that are external bot not marked with externalURL
	//this selector also ignores links within the message editor.
	$('*:not(.cke_wysiwyg_div) > a').each(function() {
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

	return !((link.substring(0,4) === "http") ? regExp.test(link) : true);
}

document.addEventListener('DOMContentLoaded', function() { 
	if(typeof urlPrefix == 'undefined') {
		console.log('linkAnonymizer: Unable to determine anonymizer service');
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