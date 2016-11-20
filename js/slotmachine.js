/**
 * Main game's class
 * it holds every reel, every game state,
 * the balance and the paytable values and
 * the image's URL
 */
var SlotMachine = function(){
	this.HALT_STATE = -1;

	this.gameMode;
	this.currentState = 0;

	this.items = [
		'img/3xBAR.png',
		'img/BAR.png',
		'img/2xBAR.png',
		'img/7.png',
		'img/Cherry.png'
    ];

	this.canvas = document.querySelector('#canvas');

	// Create the Reels
    this.reel1 = new Reel(SLOTMACHINE.REEL_1_X_OFFSET, this.items, this.canvas);
    this.reel2 = new Reel(SLOTMACHINE.REEL_2_X_OFFSET, this.items, this.canvas);
    this.reel3 = new Reel(SLOTMACHINE.REEL_3_X_OFFSET, this.items, this.canvas);

    this.lastUpdate;
    this.payTable = 0;

    this.balance = 5;
};

/**
 * Call the render method for every Reel
 */
SlotMachine.prototype.render = function(){
	this.reel1.render();
	this.reel2.render();
	this.reel3.render();
}

/**
 * Update every reel internal information and the game state
 * @param  double dt Delta Time
 */
SlotMachine.prototype.update = function(dt){
	this.reel1.update(dt);
	this.reel2.update(dt);
	this.reel3.update(dt);

	switch(this.gameMode){
		case 'random':
			this.updateStateRandom();
			break;
		case 'fixed':
			this.updateStateFixed();
			break;
	}
}

/**
 * Return the result from each reel from the row parameter
 * as concatenated string.
 * @param  (String) row /top|middle/bottom/
 * @return (String)     Ex: "000", "135", "111"
 */
SlotMachine.prototype.getRowResults = function(row){
	var reels = {
		1: this.reel1.getItemByRow(row),
		2: this.reel2.getItemByRow(row),
		3: this.reel3.getItemByRow(row)
	};
	return "" + reels['1'] + reels['2'] + reels['3'];
}

/**
 * Draw the win line at the specific row
 * The hard coded numbers here were made by testing
 * @param  string row [top|middle|bottom]
 */
SlotMachine.prototype.drawLine = function(row){
	var rowHeight = this.canvas.height / 3,
		middleOfRowHeight = rowHeight / 2,
		middleOfImageWidth = SLOTMACHINE.REEL_WIDTH / 2;

	ctx = this.canvas.getContext('2d');
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'red';
	ctx.beginPath();

	switch(row){
		case 'top':
			ctx.moveTo(middleOfImageWidth - 27, middleOfRowHeight - 16);
			ctx.lineTo(this.canvas.width - middleOfImageWidth + 27, middleOfRowHeight - 16);
		break;
		case 'middle':
			ctx.moveTo(middleOfImageWidth - 27, middleOfRowHeight + rowHeight + 12);
			ctx.lineTo(this.canvas.width - middleOfImageWidth + 27, middleOfRowHeight + rowHeight + 12);
		break;
		case 'bottom':
			ctx.moveTo(middleOfImageWidth - 27, middleOfRowHeight + (rowHeight * 2) + 16);
			ctx.lineTo(this.canvas.width - middleOfImageWidth + 27, middleOfRowHeight + (rowHeight * 2) + 16);
		break;
	}

	ctx.stroke();
}

/**
 * Check the results by a regular expression
 * call the draw line method
 * update pay table and the balance
 */
SlotMachine.prototype.checkResults = function(){
	var result = {
			top: this.getRowResults('top'),
			middle: this.getRowResults('middle'),
			bottom: this.getRowResults('bottom')
		};

	// All the possible winning possibilities and its prizes
	var winningCase = {
		'top': {
			'cherry': {
				'validate':/4{3}/.test(result['top']),
				'value': 2000
			},
			'7': {
				'validate': /3{3}/.test(result['top']),
				'value': 150,
			},
			'cherryOr7': {
				'validate': /[4/3]{3}/.test(result['top']),
				'value': 75,
			},
			'3xBar': {
				'validate': /0{3}/.test(result['top']),
				'value': 50,
			},
			'2xBar': {
				'validate': /2{3}/.test(result['top']),
				'value': 20,
			},
			'1xBar': {
				'validate': /1{3}/.test(result['top']),
				'value': 10,
			},
			'anyBar': {
				'validate': /[012]{3}/.test(result['top']),
				'value': 5,
			}
		},
		'middle': {
			'cherry': {
				'validate':/4{3}/.test(result['middle']),
				'value': 1000
			},
			'7': {
				'validate': /3{3}/.test(result['middle']),
				'value': 150,
			},
			'cherryOr7': {
				'validate': /[4/3]{3}/.test(result['middle']),
				'value': 75,
			},
			'3xBar': {
				'validate': /0{3}/.test(result['middle']),
				'value': 50,
			},
			'2xBar': {
				'validate': /2{3}/.test(result['middle']),
				'value': 20,
			},
			'1xBar': {
				'validate': /1{3}/.test(result['middle']),
				'value': 10,
			},
			'anyBar': {
				'validate': /[012]{3}/.test(result['middle']),
				'value': 5,
			}
		},
		'bottom': {
			'cherry': {
				'validate':/4{3}/.test(result['bottom']),
				'value': 4000
			},
			'7': {
				'validate': /3{3}/.test(result['bottom']),
				'value': 150,
			},
			'cherryOr7': {
				'validate': /[4/3]{3}/.test(result['bottom']),
				'value': 75,
			},
			'3xBar': {
				'validate': /0{3}/.test(result['bottom']),
				'value': 50,
			},
			'2xBar': {
				'validate': /2{3}/.test(result['bottom']),
				'value': 20,
			},
			'1xBar': {
				'validate': /1{3}/.test(result['bottom']),
				'value': 10,
			},
			'anyBar': {
				'validate': /[012]{3}/.test(result['bottom']),
				'value': 5,
			}
		}
	};

	// Loop through the winning possibilities
	// case winning draw the line in the winning row
	// update the pay table with the prize value
	for(row in winningCase){
		for(item in winningCase[row]){
			if(winningCase[row][item].validate){
				this.payTable += winningCase[row][item].value;

				this.drawLine(row);
				// Break for better performance
				break;
			}
		}
	}
	// Update the pay table
	SLOTMACHINE.input_payTable.value = parseInt(SLOTMACHINE.input_payTable.value) + this.payTable;

	// Update the balance
	this.balance += this.payTable;
	if(this.balance > 5000){
		this.balance = 5000;
		alert('Congratulation you just have more Money than the maximum Machine Value of 5000! Take your change money in the money box.');
	}
	SLOTMACHINE.input_balance.value = this.balance;
};

/**
 * Reset each reel speed
 */
SlotMachine.prototype.resetReelsSpeed = function(){
	this.reel1.speed = SLOTMACHINE.START_SPEED;
	this.reel2.speed = SLOTMACHINE.START_SPEED;
	this.reel3.speed = SLOTMACHINE.START_SPEED;
}
/**
 * Toggle the pay table input field
 * if called many times, make blink effect
 */
SlotMachine.prototype.blinkPayTable = function(){
	SLOTMACHINE.input_payTable.classList.toggle('win');
}

/**
 * Update the state for the random mode
 */
SlotMachine.prototype.updateStateRandom = function(){
	switch(this.currentState){
		// Disable Fields
		case 1:
			SLOTMACHINE.button_play.setAttribute('disabled', 'disabled');
			SLOTMACHINE.button_checkout.setAttribute('disabled', 'disabled');
			SLOTMACHINE.select_gameMode.setAttribute('disabled', 'disabled');
			SLOTMACHINE.input_balance.setAttribute('disabled', 'disabled');

			this.currentState = 2
			break;

		// Game Starts
		case 2:
			if((Date.now() - this.lastUpdate) >= 2000){
				this.lastUpdate = Date.now();
				this.currentState = 3;
			}
			break;

		// Stop Reel 1
		case 3:
			this.reel1.stop();
			if((Date.now() - this.lastUpdate) > 500){
				this.lastUpdate = Date.now();
				this.currentState = 4;
			}
			break;

		// Stop Reel 2
		case 4:
			this.reel2.stop();
			if((Date.now() - this.lastUpdate) > 500){
				this.lastUpdate = Date.now();
				this.currentState = 5;
			}
			break;

		// Stop Reel 3
		case 5:
			this.reel3.stop();
			if((Date.now() - this.lastUpdate) > 500){
				this.lastUpdate = Date.now();
				this.currentState = 6;
			}
			break;

		// Display the results
		case 6:
			this.checkResults();
			this.lastUpdate = Date.now();
			SLOTMACHINE.input_payTable.value = this.payTable;
			SLOTMACHINE.button_play.removeAttribute('disabled');
			SLOTMACHINE.button_checkout.removeAttribute('disabled');
			SLOTMACHINE.input_balance.removeAttribute('disabled');
			SLOTMACHINE.select_gameMode.removeAttribute('disabled');
			this.currentState = this.HALT_STATE;
			break;
	}
};

/**
 * Update state for Fixed Mode
 */
SlotMachine.prototype.updateStateFixed = function(){
	switch(this.currentState){
		// Disable Fields
		case 1:
			SLOTMACHINE.button_play.setAttribute('disabled', 'disabled');
			SLOTMACHINE.button_checkout.setAttribute('disabled', 'disabled');
			SLOTMACHINE.input_balance.setAttribute('disabled', 'disabled');
			SLOTMACHINE.select_gameMode.setAttribute('disabled', 'disabled');
			SLOTMACHINE.select_itemSelector.setAttribute('disabled', 'disabled');
			SLOTMACHINE.select_rowSelector.setAttribute('disabled', 'disabled');

			this.currentState = 2
			break;

		// Game Starts
		case 2:
			if((Date.now() - this.lastUpdate) >= 2000){
				this.lastUpdate = Date.now();
				this.currentState = 3;
			}
			break;

		// Stop Reel 1
		case 3:
			if((Date.now() - this.lastUpdate) > 500 && this.reel1.stop('fixed')){
				this.lastUpdate = Date.now();
				this.currentState = 4;
			}
			break;

		// Stop Reel 2
		case 4:
			if((Date.now() - this.lastUpdate) > 500 && this.reel2.stop('fixed')){
				this.lastUpdate = Date.now();
				this.currentState = 5;
			}
			break;

		// Stop Reel 3
		case 5:
			if((Date.now() - this.lastUpdate) > 500 && this.reel3.stop('fixed')){
				this.lastUpdate = Date.now();
				this.currentState = 6;
			}
			break;

		// Display the results
		case 6:
			SLOTMACHINE.button_play.removeAttribute('disabled');
			SLOTMACHINE.button_checkout.removeAttribute('disabled');
			SLOTMACHINE.input_balance.removeAttribute('disabled');
			SLOTMACHINE.select_gameMode.removeAttribute('disabled');
			SLOTMACHINE.select_itemSelector.removeAttribute('disabled');
			SLOTMACHINE.select_rowSelector.removeAttribute('disabled');

			this.checkResults();
			SLOTMACHINE.input_payTable.value = this.payTable;
			this.currentState = this.HALT_STATE;
			break;
	}
};