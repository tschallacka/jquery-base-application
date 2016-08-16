+function($){
	/**
	 * what to mark the application elemetns with in the dom (like <div data-your-application-name>)
     * The application object will be bound to this marker. To access the application object directly
     * you can do $('.foo').data('your-application-name').something() where something is a prototype function
     * you defined on the application object
	 */
	var applicationMarker = 'your-application-name';
	/**
	 * How to register the Application name in the jquery namespace. 
     * Will become $('.foo').yourApplicationName
	 */
	var applicationname = 'yourApplicationName';
	
    /**
     * The initialisation will get the element it's going to be bound to handed to it.
     */
	var Application = function($elem) {
		this.$el = $elem;
	}
	/**
	 * This function get's called if if the application is 'rebound' to the object.
	 * You can leave this empty, or use it for a 'reset' when calling the function manually
	 */
	Application.prototype.reInit = function() {
		
	}
	/**
	 * This get's called when your application first fires up.
	 * Set here the default variables etc... you need.
     * bind event handlers like this.$el.on('click','.mybutton',this.proxy(this.something));
     * where something is a prototype method defined on the application
	 */
	Application.prototype.init = function() {
		
	}
	/**
	 * This get's called when your application is deleted.
	 * unbind variables and event handlers here.
     * unbind event handlers like this.$el.off('click','.mybutton',this.proxy(this.something));
     * where something is a prototype method defined on the application
	 */
	Application.prototype.destroy = function() {
		this.$el = null;
	}
	/**
	 * ================================================================================
	 *            Your own prototype methods go below this line
	 * ================================================================================
	 */
	
	
	
	
	/**!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 * ================================================================================
	 *            Initialisation of the application itself. Do not modify
	 * ================================================================================
	 */
	Application.prototype.preInit = function() {
		this.proxiedMethods = {};
		if ($.tsch === undefined) {
        	$.tsch = {};
		}
	
	    if ($.tsch.framework === undefined) {
	        $.tsch.framework = {
	    		_proxyCounter : 0
    		};
	    }
	
	    
	}
	
	
	Application.prototype.proxy = function(method) {
        if (method.tschProxyId === undefined) {
            $.tsch.framework._proxyCounter++;
            method.__TschProxyId = $.tsch.framework._proxyCounter;
        }

        if (this.proxiedMethods[method.__TschProxyId] !== undefined) {
            return this.proxiedMethods[method.__TschProxyId];
        }

        this.proxiedMethods[method.__TschProxyId] = method.bind(this);
        return this.proxiedMethods[method.__TschProxyId];
    }
	
	Application.prototype.dispose = function()  {
        for (var key in this.proxiedMethods) {
            this.proxiedMethods[key] = null;
        }

        this.proxiedMethods = null;
    }
	
	$.fn[applicationname] = function(command) {
		if(command == undefined || command == null) {
			this.each(function(index,elem) {
				var $this = $(elem);
				if($this.is(['[data-'+applicationMarker+']'])) {
					var exists = $this.data(applicationMarker);
					if(exists && exists instanceof Application)  {
						exists.reInit();
						return;
					}
					else {
						var app = new Application($this);
						app.preInit();
						$this.data(applicationMarker,app);
						app.init();
					}
				}
				else {
					throw new Error('Type of provided element is not marked with data-'+applicationMarker+'. Please add this marker before invoking this plugin!');
				}
			});
		}
		else {
			command = command.toLowerCase().trim();
			if(command == 'remove' || command == 'destroy') {
				this.each(function(index,elem) {
					var $this = $(elem);				
					var app = $this.data(applicationMarker);
					app.destroy();/** call to user application **/
					app.dispose();/** call to clean up proxy methods **/
					app = null;
					$this.removeData(applicationMarker);
				});
			}
		}
		
	}
	$(document).ready(function() {
		$('[data-'+applicationMarker+']')[applicationname]();
	});
}(jQuery);