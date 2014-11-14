

var StampNode = function ( subscriptions, stamp ) {
	this.subscriptions = subscriptions;
	this.stamp = stamp;
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

	if ( this.stamp > stamp ) {

		forward( key, this.stamp );

		this.subscriptions.set( key, this.stamp );

	}

	else {

		this.subscriptions.set( key, stamp );

	}

};


StampNode.prototype.unsubscribe = function ( key ) {

	this.subscriptions.unset( key );

};


StampNode.prototype.publish = function ( stamp, forward ) {

	this.subscriptions.each( function ( key, stamp ) {

		if ( this.stamp > stamp ) {

			forward( key, this.stamp );

			return this.stamp;
		}

		else {

			return stamp;

		}

	} );

};


exports.StampNode = StampNode;
