/**
 * This Class is the Game's Engine
 * it has the main game loop and set the listeners in the DOM Objects
 * PS: This Class instantiate itself
 */
var Engine = (function(global){
	var game = new SlotMachine(),
		interval = 1000/SLOTMACHINE.FPS,
		animation,
		lastTime,
		now,
		dt;

	/**
	 * Call the load method
	 */
	global.load = function(){
		Resources.load(game.items);
		Resources.onReady(_init);
	};

	/**
	 * Draw the Canvas and set the listeners
	 */
	var _init = function(){
		game.render();
		_setListeners();
	};

	/**
	 * Main loop
	 * Calculate the delta time, update the canvas
	 * update game state and call itself
	 * it finishes when it gets HALT_STATE from the Slotmachine Class
	 * PS: the update game state is called in every single loop
	 * but the canvas is just redrawred under the FPS calculation
	 */
	var _main = function(){
		// Verify whether the loop should stop
		if(game.currentState == game.HALT_STATE){
			_halt();
		}

		// Calculate the delta time
		now = Date.now();
		dt = now - lastTime;

		// Redraw the canvas under the specified FPS
		if(dt > interval){
			if(game.currentState != game.HALT_STATE){
				game.render();
			}

			// Update the current time
			lastTime = now - (dt % interval);
		}

		// Update game state
		if(game.currentState != game.HALT_STATE){
			game.update(dt);
		}

		// Call itself
		animation = window.requestAnimationFrame(_main);
	};

	/**
	 * Halt state
	 * Stop redrawing the canvas and make the Pay Table to blink
	 */
	var _halt = function(){
		if(game.payTable > 0 && (now - game.lastUpdate) > 200){
			game.blinkPayTable();
			game.lastUpdate = now;
		}
	};

	/**
	 * Set the listeners to the DOM Objects
	 */
	var _setListeners = function(){
		SLOTMACHINE.input_balance.addEventListener('focusout', function(element){
			if(isNaN(parseInt(this.value))){
				alert('Excuse me sir! Your balance must be a number. Aren\'t you trying to fool us, are you?');
				this.value = game.balance;
				return;
			}
			if(this.value < 0){
				alert('Sir, if you are owning money to someone, why did you came to a slot machine? Sorry to inform, no money no game!');
				this.value = game.balance;
				return;
			}
			if(this.value > 5000){
				alert('Excuse me sir! For security reasons Your balance must maximum 5000');
				this.value = 5000;
				return;
			}
			game.balance = this.value;
		});

		SLOTMACHINE.button_play.addEventListener('click', function(element){
			if(game.balance < 1){
				alert('Your balance is already 0. Buy more credits to keep playing!');
				return;
			}

			_resetGame();
			// Start main loop
			_main();
		});

		SLOTMACHINE.button_checkout.addEventListener('click', function(element){
			alert('Thank you for playing in our Casino! Come back anytime!');
			game.balance = 0;
			SLOTMACHINE.input_balance.value = 0;
		});

		// Setup the DOM for diferent modes
		SLOTMACHINE.select_gameMode.addEventListener('change', function(element){
			if(this.value === 'fixed'){
				SLOTMACHINE.div_fixedModeOptions.classList.remove('hidden');
			}else if(this.value === 'random'){
				SLOTMACHINE.div_fixedModeOptions.classList.add('hidden');
			}
		});
	};

	/**
	 * Reset the game's configuration
	 * PS: doesn't clean the game balance.
	 */
	var _resetGame = function(){
		window.cancelAnimationFrame(animation);

		SLOTMACHINE.input_payTable.classList.remove('win');
		SLOTMACHINE.input_balance.value = --game.balance;

		game.gameMode = SLOTMACHINE.select_gameMode.value;
		game.payTable = 0;
		SLOTMACHINE.input_payTable.value = game.payTable;

		game.lastUpdate = lastTime = Date.now();
		game.currentState = 1;
		game.resetReelsSpeed();
	}

	load();
})(this);