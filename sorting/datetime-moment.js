/**
 * This plug-in for DataTables represents the ultimate option in extensibility
 * for sorting date / time strings correctly. It uses
 * [Moment.js](http://momentjs.com) to create automatic type detection and
 * sorting plug-ins for DataTables based on a given format. This way, DataTables
 * will automatically detect your temporal information and sort it correctly.
 *
 * For usage instructions, please see the DataTables blog
 * post that [introduces it](//datatables.net/blog/2014-12-18).
 *
 * @name Ultimate Date / Time sorting
 * @summary Sort date and time in any format using Moment.js
 * @author [Allan Jardine](//datatables.net)
 * @depends DataTables 1.10+, Moment.js 1.7+
 *
 * @example
 *    $.fn.dataTable.moment( 'HH:mm MMM D, YY' );
 *    $.fn.dataTable.moment( 'dddd, MMMM Do, YYYY' );
 *
 *    $('#example').DataTable();
 */

(function($) {

$.fn.dataTable.moment = function ( format, locale, acceptableValues ) {
	
	// Null and empty values are acceptable by default
	var defaultAcceptableValues = [ '', null ];
	
	acceptableValues = ( acceptableValues == undefined) ?
		defaultAcceptableValues :
		defaultAcceptableValues.concat(acceptableValues);
	
	var types = $.fn.dataTable.ext.type;

	// Add type detection
	types.detect.unshift( function ( d ) {
		// Strip HTML tags if possible
		if ( d && d.replace ) {
			d = d.replace(/<.*?>/g, '');
		}
		
		if ( acceptableValues.indexOf(d) > 0 ) {
			return 'moment-'+format;
		}

		return moment( d, format, locale, true ).isValid() ?
			'moment-'+format :
			null;
	} );

	// Add sorting method - use an integer for the sorting
	types.order[ 'moment-'+format+'-pre' ] = function ( d ) {
		return ( acceptableValues.indexOf(d) > 0 ) ?
			-Infinity :
			parseInt( moment( d.replace ? d.replace(/<.*?>/g, '') : d, format, locale, true ).format( 'x' ), 10 );
	};
};

}(jQuery));
