/**
 * Declare all the constants that will be used in the project
 * under the namespace SLOTMACHINE
 */
(function(global){
	global.SLOTMACHINE = {
		// Frames per Second
		FPS: 60,

		// Game Settings
		ITEM_COUNT: 5,
		START_SPEED: 1,

		// Image settings
		SLOT_BACK_MARGIN: 20,
		IMAGE_HEIGHT: 121,
		REEL_WIDTH: 141,
		REEL_1_X_OFFSET: 0,
		REEL_2_X_OFFSET: 141,
		REEL_3_X_OFFSET: 282,

		// DOM selectors
		input_balance: document.getElementById('balance'),
		input_payTable: document.getElementById('pay-table'),
		button_play: document.getElementById('play'),
		button_checkout: document.getElementById('checkout'),
		select_gameMode: document.getElementById('game-mode'),
		select_itemSelector: document.getElementById('item-selector'),
		select_rowSelector: document.getElementById('row-selector'),
		div_fixedModeOptions: document.getElementById('fixed-mode-options')
	};
})(this);