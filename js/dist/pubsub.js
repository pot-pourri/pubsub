(function(exports, undefined){

	'use strict';


/* js/src/StampNode.js */

/**
 * pubsub node that only notifies clients whose stamp is less than
 * the currently published stamp.
 *
 * @param {dict} subscriptions a ( key, stamp ) python-style dict
 * @param {comparable} stamp
 * @param {comparator} the comparison function used to compare stamps
 */
var StampNode = function ( subscriptions, stamp, compare ) {
	this.subscriptions = subscriptions;
	this.stamp = stamp;
	this.compare = compare;
};


/**
 * Subscribes client with key *key* and stamp *stamp*. If
 * *stamp* < current stamp then we forward the current stamp
 * to client with key *key*.
 *
 * @param  {key} key      key of the subscriber
 * @param  {comparable} stamp   most up to date stamp the subscriber has
 * @param  {callback} forward the function to call when the stamp for a client
 *                    is outdated
 */

StampNode.prototype.subscribe = function ( key, stamp, forward ) {

	this.subscriptions.set( key, this.update( forward )( key, stamp ) );

};


StampNode.prototype.unsubscribe = function ( key ) {

	this.subscriptions.unset( key );

};


StampNode.prototype.publish = function ( stamp, forward ) {

	this.stamp = stamp;

	this.subscriptions.update( this.update( forward ) );

};

StampNode.prototype.update = function ( forward ) {

	var that = this;

	return function ( key, stamp ) {

		if ( that.compare( that.stamp, stamp ) > 0 ) {

			forward( key, that.stamp );

			return that.stamp;
		}

		else {

			return stamp;

		}

	};

};


exports.StampNode = StampNode;

})(typeof exports === 'undefined' ? this['pubsub'] = {} : exports);
