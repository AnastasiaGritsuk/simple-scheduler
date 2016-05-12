var assert = require('assert');
var scheduler = require('./../scheduler');
expect = require('chai').expect;

describe("delay :", function () {

    it('simple delay working', function (done) {
	    scheduler.delay(100, function(){
           done();
        });
	});

	it('delay can be cancelled', function (done) {
		
	    var cancel = scheduler.delay(100, function(error){
	    	if(error){
	    		done();	
	    	}
	    });
	    cancel(true); 
	    
	});

	it('delay lasts not more then requested', function (done) {
		
		var start = Date.now();
		scheduler.delay(100, function(){
			var end = Date.now();
           	expect(end - start).least(100);
           	done();
        });            
	});
});

describe("measure :", function () {

	var arr = new Array(3);

    it('time of function execution', function (done) {
        scheduler.measure(function(arg){
            setTimeout(function() {
                arg();
            }, 10);
        }, function(time){
            expect(time).least(10);
            done();
        });
    });


	it('works correctly for functions with different time of execution', function (done) {
    	function measureWrapper(period, index, callback){
            scheduler.measure(function(finish){
                setTimeout(function() {
                    finish();
                }, period);
            }, function(time){
                arr[index] = time;     
                callback();          
            });
        }

        measureWrapper(10, 0, function(){
            measureWrapper(100, 1, function(){
                measureWrapper(1000, 2, function(){
                    var isBigger = false;

                    for(var i=0;i<arr.length;i++){
                        if(arr[i] < arr[i+1]){
                            isBigger = true;
                        }
                    }

                    expect(isBigger).equals(true);
                    done();
                })
            })
        })
	});
});
	
describe("scheduleSequence : ", function () {
	var item = function (next){
					next();
				}
	var itemWithError = function (next){
					next('single');
				}

	it('pass empty array to scheduling', function (done) {

    	scheduler.scheduleSequence(
    		[], 
			function(x){}, function(error, resume) {
				if(error)
					return;

	    		done();
	    	});    	
	});

	it('schedule running of one item', function (done) {
    	scheduler.scheduleSequence(
    		[item], 
			function(x){}, function(error, resume) {
				if(error)
					return;

	    		done();
	    	});
	});

	it('schedule running of several items', function (done) {
    	scheduler.scheduleSequence(
    		[item, item, item, item], 
			function(x){}, function(error, resume) {
				if(error)
					return;

	    		done();
	    	});    	
	});

		
	it('? abort run of several items', function (done) {
		var check;

    	scheduler.scheduleSequence(
    		[item, item, function (next){
					next('stopAll');
				}, itemWithError], 
			function(x){}, function(error, resume) {
                
                if(error == 'single') {
                	resume();
                	return;
                }else if(error == "stopAll"){
                	check = true;
                }else{
                	check = false;
                }

                expect(check).equals(true);
                done();                
	    	});
	});

    it('abort run of one item and continue run others', function (done) {
        scheduler.scheduleSequence(
            [item, item, itemWithError, item], 
            function(x){
              
            }, function(error, resume) {
                if(error == 'single'){
                    resume();
                    return;
                }

                done();
            });
    });

    it('abort run of one item', function (done) {
        scheduler.scheduleSequence(
            [itemWithError], 
            function(x){
              
            }, function(error, resume) {
                if(error == 'single'){
                    resume();
                    return;
                }

                done();
            });
    });

    it('simply progressFn working', function (done) {

        scheduler.scheduleSequence(
            [item], function (x){
                done();
            }, function(error, resume) {
                
            });
    });

    it('cancel every item and finish it successfully', function (done) {

        scheduler.scheduleSequence(
            [itemWithError, itemWithError, itemWithError], function (x){
            
            }, function(error, resume) {
                if(error == 'single') {
                    resume();
                    return;
                }

                done();
            });
    });

    it('cancel the last item and finish it successfully', function (done) {

        scheduler.scheduleSequence(
            [item, item, itemWithError], function (x){
            
            }, function(error, resume) {
                if(error == 'single') {
                    resume();
                    return;
                }
                done();
            });
    });

    it('error propagation', function (done) {

        scheduler.scheduleSequence(
            [itemWithError], function (x){
            
            }, function(error, resume) {
                if(error) {
                	done();    
                }
            });
    }); 	

});