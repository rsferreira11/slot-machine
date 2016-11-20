/**
 * Class represents one Reel of the Slot Machine
 */
var Reel = function(x_offset, items, canvas){
	this.canvas = canvas;

	this.speed;

	this.x = x_offset;
	this.y = - SLOTMACHINE.SLOT_BACK_MARGIN;

	this.items = items;

	// Shows which item comes after each item
	this.transitionSchema = {
		0: 1,
		1: 2,
		2: 3,
		3: 4,
		4: 0
	}

	// Set the Items
    this.top = Resources.getRandomItem();
    this.middle = this.transitionSchema[this.top];
    this.bottom = this.transitionSchema[this.middle];
};

// Clean the canvas in the reel space
Reel.prototype.clearMyself = function(ctx){
	ctx.clearRect(this.x, 0, SLOTMACHINE.REEL_WIDTH, this.canvas.height);
};

// Draw the canvas
Reel.prototype.render = function(){
	var elementNumber = this.top,
		elementToBeDrawedYOffset = this.y;

	//Get the canvas and clean it
	ctx = this.canvas.getContext('2d');
	this.clearMyself(ctx);
	ctx.fillStyle = '#ddd';

	// Redraw each item
	for (var i = 0; i < SLOTMACHINE.ITEM_COUNT; i++) {
		var asset = Resources.getImage(this.items[elementNumber]);

		ctx.drawImage(asset, this.x, elementToBeDrawedYOffset);

		// Update the positions to draw next item
		elementToBeDrawedYOffset += SLOTMACHINE.IMAGE_HEIGHT;
		elementNumber = this.transitionSchema[elementNumber];
	}
};

/**
 * Update items' position by the speed times the delta time
 * @param  double dt Delta time
 */
Reel.prototype.update = function(dt){
	var speed = this.speed * dt;

	// Update y value
	this.y -= speed;

	// if the Y offset is lower than one image and the margin, update the reel
	if(this.y < (- SLOTMACHINE.IMAGE_HEIGHT - SLOTMACHINE.SLOT_BACK_MARGIN)){
		this.y = - SLOTMACHINE.SLOT_BACK_MARGIN;
		this.top = this.transitionSchema[this.top];
		this.middle = this.transitionSchema[this.middle];
		this.bottom = this.transitionSchema[this.bottom];
	}
};

/**
 * Stop the reel
 * Method has different behaviour to each game mode
 * @param  String gameMode
 */
Reel.prototype.stop = function(gameMode = 'random'){
	// Fixed Game Mode
	if(gameMode === 'fixed'){
		if(this.speed == 0){
			return true;
		}

		// Check if the selected item is in the right row and right position to stop
		if(SLOTMACHINE.select_itemSelector.value == this.getItemByRow(SLOTMACHINE.select_rowSelector.value)
			&& this.y + 5 < (- SLOTMACHINE.IMAGE_HEIGHT + SLOTMACHINE.SLOT_BACK_MARGIN)){
			// Fix an end position
			this.y = (- SLOTMACHINE.IMAGE_HEIGHT - SLOTMACHINE.SLOT_BACK_MARGIN);
			// Stop the reel
			this.speed = 0;
			return true;
		}
		return false;
	}
	// Random Game Mode
	// Check if is at right position to stop
	if(this.y + 5 < (- SLOTMACHINE.IMAGE_HEIGHT + SLOTMACHINE.SLOT_BACK_MARGIN)){
		// Fix an end position
		this.y = (- SLOTMACHINE.IMAGE_HEIGHT - SLOTMACHINE.SLOT_BACK_MARGIN);
		// Stop the reel
		this.speed = 0;
	}
};

/**
 * Return which element is in the row passed by argument
 * PS: The row status just update after the method Reel.update
 * But when the reel stops for rendering porpuses this status
 * is not update. For this reason before you return the result
 * grab the status in the Reel.transitionSchema.
 */
Reel.prototype.getItemByRow = function(row){
	return this.transitionSchema[this[row]];
}