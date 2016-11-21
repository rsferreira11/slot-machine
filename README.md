# Slot Machine

## Description

A slot-machine made with Vanilla javascript and canvas.

## Requirements to run

Electricity and a device with a modern browser. If you are reading it right now, you can probably just click [here](index.html) to run. If it doesn't work: double click at index.html.

## Design Pattern

The pattern used for javascript classes is called Pseudo Classical Prototypal pattern. All the properties are definied at the class constructor and the methods are definied extending the class' prototype.

I chose this pattern because it feels I am using a backend programming language like Ruby or PHP.

For the global values, I store them under a namespace so I have less chance of someone overwrite the variables, if this project would be used as part of something bigger. I mean, who would create a variable called SLOTMACHINE? So totally safe =)

## Code Description

For this project I decided to keep every class in a diferent file, because it is better to read, better to debug and better to extend it. And yes, I know that each file would be a http request, but this code is not a production code, if it would go to production I would've used gulp to rewrite all the files into a "all.min.js" and minify it. (The same with the images. Make a Atlases and use cordinates to load them)

I would highly recommend start to read the code from the file [constants.js](js/constants.js) where I kept the project's constants, then go to [resources.js](js/resources.js) where you can find my helper methods (basically the image load, and random generator), then you can follow as pleases you from [engine.js](js/engine.js) and following the method calls into [slotmachine.js](js/slotmachine.js) and [reel.js](js/reel.js). All methods are commented, but if you have any question please write me an email, I will be happy to answer.
