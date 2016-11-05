import test from 'ava' ;

import { Dict } from "aureooms-js-dict" ;
import * as heapsort from "aureooms-js-heapsort" ;
import { increasing , lexicographical } from "aureooms-js-compare" ;

import { StampNode } from '../../src' ;

const sort = heapsort.dary( 2 );

const compare = lexicographical( increasing );

class Forward {

	constructor ( ) {

		this.calls = [ ] ;

		this.callback = ( key, stamp ) => {
			this.calls.push( [ key, stamp ] );
		}

		this.clear = ( ) => {
			this.calls.splice( 0 );
		}

	}

}

function makeset ( array ) {

	sort( compare , array , 0 , array.length ) ;

	return array ;

}

test( "StampNode" , t => {

	const emptyset = makeset( [] ) ;

	const subscriptions = new Dict( {} ) ;

	const stamp = 125;

	const node = new StampNode( subscriptions, stamp, increasing );

	const forward = new Forward();

	node.subscribe( "Erik Satie", 126, forward.callback );

	t.deepEqual( makeset( forward.calls ), emptyset, "Erik Satie has no new message" );


	forward.clear();

	node.subscribe( "Adrien Ooms", 127, forward.callback );

	t.deepEqual( makeset( forward.calls ), emptyset, "Neither Adrien nor Erik Satie have a new message" );


	forward.clear();

	node.publish( 127, forward.callback );

	t.deepEqual( makeset( forward.calls ), makeset( [ ["Erik Satie", 127] ] ), "Erik Satie has a new message" );


	forward.clear();

	node.unsubscribe( "Erik Satie" );

	node.publish( 128, forward.callback );

	t.deepEqual( makeset( forward.calls ), makeset( [ ["Adrien Ooms", 128] ] ), "Adrien Ooms has a new message" );


	forward.clear();

	node.subscribe( "Ada Lovelace", 127, forward.callback );

	t.deepEqual( makeset( forward.calls ), makeset( [ ["Ada Lovelace", 128] ] ), "Ada Lovelace has a new message" );


	forward.clear();

	node.subscribe( "Charles Babbage", 128, forward.callback );

	t.deepEqual( makeset( forward.calls ), emptyset, "Nobody has a new message" );


	forward.clear();

	node.subscribe( "Alan Turing", 129, forward.callback );

	t.deepEqual( makeset( forward.calls ), emptyset, "Nobody has a new message" );


	forward.clear();

	node.publish( 129, forward.callback );

	t.deepEqual( makeset( forward.calls ), makeset( [ ["Adrien Ooms", 129], ["Ada Lovelace", 129], ["Charles Babbage", 129] ] ), "Ada, Adrien and Charles have a new message" );


	forward.clear();

	node.publish( 129, forward.callback );

	t.deepEqual( makeset( forward.calls ), emptyset, "Nobody has a new message" );


	forward.clear();

	node.publish( 130, forward.callback );

	t.deepEqual( makeset( forward.calls ), makeset( [ ["Alan Turing", 130], ["Adrien Ooms", 130], ["Ada Lovelace", 130], ["Charles Babbage", 130] ] ), "Ada, Adrien, Alan and Charles have a new message" );

} );
