var serviceUrls = new Array('http://anonym.to/?', 'http://dontknow.me/at/?');
var urlPrefix = serviceUrls[linkAnonymizerService];

function anonymizeLink(elem) {
	$(elem).attr('href', urlPrefix + $(elem).attr('href'));
	$(elem).attr('data-anonymized', true);
}

function process() {
	$('a[class="externalURL"]:not([data-anonymized])').each(function() {
		anonymizeLink(this);
	});	
}

document.addEventListener('DOMContentLoaded', function() { 
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