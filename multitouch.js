function MultiTouch(element, callbacks)
{
    this.mTouches     = [];
    this.callbacks     = callbacks;
    this.element     = element;

    element.addEventListener('touchstart',     onTouchstart,     false);    
    element.addEventListener('touchmove',     onTouchmove,     false);
    element.addEventListener('touchend',     onTouchend,     false);

    var self = this;
    function onTouchstart(event) {
        console.log(event);
        $.each(event.changedTouches, function(i, touch) {
            // filter target touches
            if ($.inArray(touch, event.targetTouches) >= 0) {
                touch.time     = (new Date()).getTime();
                touch.viX    = 0; 
                touch.viY    = 0; 
                self.mTouches[touch.identifier] = [touch];
                //$('#a').html("[" + touch.identifier + ": " + touch.clientX + "," + touch.clientY + "]");
            }
        });
        
        if (self.callbacks.touchstart) {
            self.callbacks.touchstart(event);
        }
        
        event.preventDefault();
    }

    function onTouchmove(event) {
        $.each(event.changedTouches, function(i, touch) {
            // filter target touches
            if ($.inArray(touch, event.targetTouches) >= 0) {
                touch.time         = (new Date()).getTime();
                var touches     = self.mTouches[touch.identifier],
                    touchPrev    = touches[touches.length - 1],
                     time         = touch.time - touchPrev.time;
                touch.vtX         = (touch.clientX - touchPrev.clientX) / time; 
                touch.vtY        = (touch.clientY - touchPrev.clientY) / time;
                touches.push(touch);
                //$('#b').html("[" + touch.identifier + ": " + touchPrev.clientX + "," + touch.clientY + "]");
                //$('#c').html("[" + touch.identifier + ": " + touch.vtX.toFixed(2) + "," + touch.vtY.toFixed(2) + "]");
            }
        });
        if (self.callbacks.touchmove) {
            self.callbacks.touchmove(event, self);
        }        
        event.preventDefault();
    }

    function onTouchend(event) {
        if (self.callbacks.touchend) {
            self.callbacks.touchend(event);
        }
        
        // dereferencing
        $.each(event.changedTouches, function(i, touch) {
            if (touch.target === self.element) {
                delete self.mTouches[touch.identifier];
                //$('#d').html("[" + touch.identifier + ": " + touch.clientX + "," + touch.clientY + "]");
            }
        });
        
        event.preventDefault();
    }
}

(function($) {
$.fn.multiTouch = function (callbacks) {
    $(this).each(function() {
        var self = $(this);
        self.callbacks = callbacks;
        self.mTouches = [];
        self.on('touchstart', onTouchstart);    
        self.on('touchmove',  onTouchmove);    
        self.on('touchend', onTouchend);    
        self.on('touchenter', onTouchenter);    
        self.on('touchleave', onTouchleave);    
        
        function onTouchstart(event) {
            var origEvent = event.originalEvent;
            $.each(origEvent.changedTouches, function(i, touch) {
                // filter target touches
                if ($.inArray(touch, origEvent.targetTouches) >= 0) {
                    touch.time  = event.timeStamp;
                    touch.viX   = 0; 
                    touch.viY   = 0; 
                    self.mTouches[touch.identifier] = [touch];
                    //$('#a').html("[" + touch.identifier + ": " + touch.clientX + "," + touch.clientY + "]");
                }
            });
        
            if (self.callbacks.touchstart) {
                self.callbacks.touchstart.call(self, event);
            }
            
            origEvent.preventDefault();
        }

        function onTouchmove(event) {
            var origEvent = event.originalEvent;
            $.each(origEvent.changedTouches, function(i, touch) {
                // filter target touches
                if ($.inArray(touch, origEvent.targetTouches) >= 0) {
                    touch.time      = event.timeStamp;
                    var touches     = self.mTouches[touch.identifier];
                        touchPrev   = touches[touches.length - 1];
                        time        = touch.time - touchPrev.time;
                    touch.vtX       = (touch.clientX - touchPrev.clientX) / time; 
                    touch.vtY       = (touch.clientY - touchPrev.clientY) / time;
                    touches.push(touch);
                    //$('#b').html("[" + touch.identifier + ": " + touchPrev.clientX + "," + touch.clientY + "]");
                    //$('#c').html("[" + touch.identifier + ": " + touch.vtX.toFixed(2) + "," + touch.vtY.toFixed(2) + "]");
                }
            });
            if (self.callbacks.touchmove) {
                self.callbacks.touchmove.call(self, event);
            }        
            origEvent.preventDefault();
        }
        
        function onTouchend(event) {
            if (self.callbacks.touchend) {
                self.callbacks.touchend.call(self, event);
            }
            
            // dereferencing
            var origEvent = event.originalEvent;
            $.each(origEvent.changedTouches, function(i, touch) {
                if (touch.target === event.target) {
                    delete self.mTouches[touch.identifier];
                    //$('#d').html("[" + touch.identifier + ": " + touch.clientX + "," + touch.clientY + "]");
                }
            });
        
            origEvent.preventDefault();
        }
        
        function onTouchenter(event) {
            var origEvent = event.originalEvent;
            $.each(origEvent.changedTouches, function(i, touch) {
                // filter target touches
                if ($.inArray(touch, origEvent.targetTouches) >= 0) {
                }
            });
        
            if (self.callbacks.touchenter) {
                self.callbacks.touchenter.call(self, event);
            }
            $('#debug3').html("fuck");
            
            origEvent.preventDefault();
        }    
        
        function onTouchleave(event) {
            var origEvent = event.originalEvent;
            $.each(origEvent.changedTouches, function(i, touch) {
                // filter target touches
                if (touch.target === event.target) {
                }
            });
        
            if (self.callbacks.touchleave) {
                self.callbacks.touchleave.call(self, event);
            }
            
            origEvent.preventDefault();
        }    
    }); // $(this).each();
};
})(jQuery);
