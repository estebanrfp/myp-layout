/**
 * Layout.js v1.0.0
 * https://desarrolloactivo.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2015, desarrolloactivo.com
 */
 
var Layout = (function() {

	var $el = $( '#main' ),
		$sections = $el.children( 'section' ),
	
		$sectionWork = $( '#work-section' ),

		$workItems = $( '#work-items > li' ),

		$workPanelsContainer = $( '#panel-work-items' ),
		$workPanels = $workPanelsContainer.children( 'div' ),
		totalWorkPanels = $workPanels.length,

		$nextWorkItem = $workPanelsContainer.find( 'nav > span.next-work' ),

		isAnimating = false,

		$closeWorkItem = $workPanelsContainer.find( 'nav > span.icon-close' ),
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},

		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// support css transitions
		supportTransitions = Modernizr.csstransitions;

	function init() {
		initEvents();
	}

	function initEvents() {
		
		$sections.each( function() {
			
			var $section = $( this );

			$section.on( 'click', function() {

				if( !$section.data( 'open' ) ) {
					$section.data( 'open', true ).addClass( 'expand expand-top' );
					$el.addClass( 'expand-item' );	
				}

			} ).find( 'span.icon-close' ).on( 'click', function() {
				
				// close the expanded section and scale up the others
				$section.data( 'open', false ).removeClass( 'expand' ).on( transEndEventName, function( event ) {
					if( !$( event.target ).is( 'section' ) ) return false;
					$( this ).off( transEndEventName ).removeClass( 'expand-top' );
				} );

				if( !supportTransitions ) {
					$section.removeClass( 'expand-top' );
				}

				$el.removeClass( 'expand-item' );
				
				return false;

			} );

		} );

		// clicking on a work item: the current section scales down and the respective work panel slides up
		$workItems.on( 'click', function( event ) {

			// scale down main section
			$sectionWork.addClass( 'scale-down' );

			// show panel for this work item
			$workPanelsContainer.addClass( 'panel-items-show' );

			var $panel = $workPanelsContainer.find("[data-panel='" + $( this ).data( 'panel' ) + "']");
			currentWorkPanel = $panel.index();
			$panel.addClass( 'show-work' );

			return false;

		} );

		// navigating the work items: current work panel scales down and the next work panel slides up
		$nextWorkItem.on( 'click', function( event ) {
			
			if( isAnimating ) {
				return false;
			}
			isAnimating = true;

			var $currentPanel = $workPanels.eq( currentWorkPanel );
			currentWorkPanel = currentWorkPanel < totalWorkPanels - 1 ? currentWorkPanel + 1 : 0;
			var $nextPanel = $workPanels.eq( currentWorkPanel );

			$currentPanel.removeClass( 'show-work' ).addClass( 'hide-current-work' ).on( transEndEventName, function( event ) {
				if( !$( event.target ).is( 'div' ) ) return false;
				$( this ).off( transEndEventName ).removeClass( 'hide-current-work' );
				isAnimating = false;
			} );

			if( !supportTransitions ) {
				$currentPanel.removeClass( 'hide-current-work' );
				isAnimating = false;
			}
			
			$nextPanel.addClass( 'show-work' );

			return false;

		} );

		// clicking the work panels close button: the current work panel slides down and the section scales up again
		$closeWorkItem.on( 'click', function( event ) {

			// scale up main section
			$sectionWork.removeClass( 'scale-down' );
			$workPanelsContainer.removeClass( 'panel-items-show' );
			$workPanels.eq( currentWorkPanel ).removeClass( 'show-work' );
			
			return false;

		} );

	}

	return { init : init };

})();