/**
 * Class made to keep all Auxiliar/Helper methods to the project
 * You can access these methods under the namespace Resource
 */
(function(){
	var resourceCache = {};
	var loading = [];
	var readyCallbacks = [];

	/**
	 * Load one or many images
	 * @param  string url url to the image
	 */
	function load(url){
		if(url instanceof Array){
			url.forEach(function(url){
				_load(url);
			})
		} else {
			_load(url);
		}
	}

	/**
	 * Private load method
	 * Check whether the image is already in the Cache
	 * if it is not, it loads it
	 * @param  string url url to the image
	 */
	function _load(url){
		// Check cache
		if(resourceCache[url]){
			return resourceCache[url];
		}
		// Not in Cache, loads the image
		else{
			var img = new Image();
			img.onload = function() {
				resourceCache[url] = img;
				if(isReady()){
					// Execute the callback stack
					readyCallbacks.forEach(function(func){ func(); })
				}
			};
			resourceCache[url] = false;
			img.src = url;
		}
	}

	/**
	 * Get the image object from the cache
	 * @param  string url url to the image
	 */
    function getImage(url) {
        return resourceCache[url];
    }

    /**
     * Check whether the image is already loaded
     * @return {Boolean} true: ready|false: not ready
     */
    function isReady() {
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Return a random item ID from the loaded images
     * @return int ramdom item ID [0-SLOTMACHINE.ITEM_COUNT-1]
     */
	function getRandomItem() {
		min = Math.ceil(0);
		max = Math.floor(SLOTMACHINE.ITEM_COUNT - 1);
		return ((Math.floor(Math.random() * (max - min + 1)) + min));
	}

	/**
	 * Push a callback to callback stack
	 * @param  function func callback function
	 */
	function onReady(func){
		readyCallbacks.push(func);
	}

	/**
	 * Store the methods under the namespace
	 */
	window.Resources = {
		load: load,
		getImage: getImage,
		isReady: isReady,
		getRandomItem: getRandomItem,
		onReady: onReady
	};
})();