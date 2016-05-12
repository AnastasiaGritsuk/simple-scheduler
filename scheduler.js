function scheduleSequence(items, progressFn, continueWith){
	loop(0);

	function loop(i_){
		var i = i_;

		if(i == items.length){
			continueWith();
			return;
		}

		function progressInternal(value){
			progressFn((i+1) * 20);
		}

		items[i](function(error){
			if(error) {
				continueWith(error, resume);
				return;
			}
			function resume() {
				progressInternal(i);
				loop(i+1);
			}

			resume();
		});
	}
}

function measure(fn,continueWith) {
	var start = Date.now();
	fn(function(){
		var end = Date.now();
		continueWith(end - start);
	}); 
}

function delay(period,fn) {
	var id = setTimeout(fn,period);

	return function(error){
		if(error){
			clearTimeout(id);	
			fn(error);
		}
	}
}

module.exports = {
	scheduleSequence:scheduleSequence,
	delay:delay,
	measure:measure
}