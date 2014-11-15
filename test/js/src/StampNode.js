
var makeset, dict, sort, compare, Forward, heapsort, compareargs;

dict = require( "aureooms-js-dict" );
sort = require( "aureooms-js-sort" );
compare = require( "aureooms-js-compare" );

heapsort = sort.__heapsort__( 2 );

compareargs = sort.lexicographical( compare.increasing );

Forward = function () {

	var calls = this.calls = [];

	this.callback = function ( key, stamp ) {
		calls.push( [ key, stamp ] );
	};

	this.clear = function ( ) {
		calls.splice( 0 );
	};

};

makeset = function ( array ) {

	heapsort( compareargs, array, 0, array.length );

	return array;

};


test( "StampNode" , function () {

	var node, subscriptions, stamp, forward, emptyset;

	emptyset = makeset( [] );

	subscriptions = new dict.Dict( {} );

	stamp = 125;

	node = new pubsub.StampNode( subscriptions, stamp, compare.increasing );


	forward = new Forward();

	node.subscribe( "Erik Satie", 126, forward.callback );

	deepEqual( makeset( forward.calls ), emptyset, "Erik Satie has no new message" );


	forward.clear();

	node.subscribe( "Adrien Ooms", 127, forward.callback );

	deepEqual( makeset( forward.calls ), emptyset, "Neither Adrien nor Erik Satie has a new message" );


	forward.clear();

	node.publish( 127, forward.callback );

	deepEqual( makeset( forward.calls ), makeset( [ ["Erik Satie", 127] ] ), "Erik Satie has a new message" );


	forward.clear();

	node.unsubscribe( "Erik Satie" );

	node.publish( 128, forward.callback );

	deepEqual( makeset( forward.calls ), makeset( [ ["Adrien Ooms", 128] ] ), "Adrien Ooms has a new message" );


	forward.clear();

	node.subscribe( "Ada Lovelace", 127, forward.callback );

	deepEqual( makeset( forward.calls ), makeset( [ ["Ada Lovelace", 128] ] ), "Ada Lovelace has a new message" );


	forward.clear();

	node.subscribe( "Charles Babbage", 128, forward.callback );

	deepEqual( makeset( forward.calls ), emptyset, "Nobody has a new message" );


	forward.clear();

	node.subscribe( "Alan Turing", 129, forward.callback );

	deepEqual( makeset( forward.calls ), emptyset, "Nobody has a new message" );


	forward.clear();

	node.publish( 129, forward.callback );

	deepEqual( makeset( forward.calls ), makeset( [ ["Adrien Ooms", 129], ["Ada Lovelace", 129], ["Charles Babbage", 129] ] ), "Ada, Adrien and Charles have a new message" );


	forward.clear();

	node.publish( 129, forward.callback );

	deepEqual( makeset( forward.calls ), emptyset, "Nobody has a new message" );


	forward.clear();

	node.publish( 130, forward.callback );

	deepEqual( makeset( forward.calls ), makeset( [ ["Alan Turing", 130], ["Adrien Ooms", 130], ["Ada Lovelace", 130], ["Charles Babbage", 130] ] ), "Ada, Adrien, Alan and Charles have a new message" );

} );
