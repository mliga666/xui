(function () {

var undefined,
    xui,
    window = this,
    // prevents Google compiler from removing primative and subsidising out allowing us to compress further
    string = new String('string'), 
    document = window.document;

window.x$ = window.xui = xui = function(q) {
  return new xui.fn.find(q);
};

// patch in forEach to help get the size down a little and avoid over the top currying on event.js and dom.js (shortcuts)
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fn) {
    var len = this.length || 0;
    if (typeof fn != 'function') {
      return;
    }
    var that = arguments[1];
    for (var i = 0; i < len; i++) {
      fn.call(that, this[i], i, this);
    }
  };
}

xui.fn = xui.prototype = {

      elements: [],
      
      extend: function(o) {
      	for (var i in o) {
      		xui.prototype[i] = o[i];
      	}
      },

      find: function(q) {
          var ele = [], list, idExpr = /^#([\w-]+)$/, i, j, x;

          // fast matching for pure ID selectors
          if (typeof q == string && idExpr.test(q)) {
              ele = [document.getElementById(q.substr(1))];
          } else if (typeof q == string) {
              // one selector
              ele = Array.prototype.slice.call(document.querySelectorAll(q), 0);
          } else {
			        // an element
              ele = [q];
          }

          this.elements = this.elements.concat(this.reduce(ele));
          return this;
      },


      /**
	 * Array Unique
	 */
      reduce: function(el, b) {
          var a = [];
          
          el.forEach(function (el) {
            // question the support of [].indexOf in older mobiles (RS will bring up 5800 to test)
            if (a.indexOf(el, 0, b) < 0)
                a.push(el);            
          });
          
          return a;
      },


      /**
	 * Array Remove - By John Resig (MIT Licensed) 
	 */
      removex: function(array, from, to) {
          var rest = array.slice((to || from) + 1 || array.length);
          array.length = from < 0 ? array.length + from: from;
          return array.push.apply(array, rest);
      },


      /**
	 * Has modifies the elements array and reurns all the elements that match (has) a CSS Query
	 */
      has: function(q) {
          var list = [];
          this.each(function(el) {
              xui(q).each(function(hel) {
                  if (hel == el) {
                      list.push(el);
                  }
              });
          });
          this.elements = list;
          return this;
      },


      /**
	 * Not modifies the elements array and reurns all the elements that DO NOT match a CSS Query
	 */
      not: function(q) {
          var list = this.elements, i;
          for (i = 0; i < list.length; i++) {
              xui(q).each(function(hel) {
                  if (list[i] == hel) {
                      this.elements = this.removex(list, list.indexOf(list[i]));
                  }
              });
          }
          return this;
      },


      /**
	 * Element iterator.
	 * 
	 * @return {XUI} Returns the XUI object. 
	 */
      each: function(fn) {
          for (var i = 0, len = this.elements.length; i < len; ++i) {
              if (fn.call(this, this.elements[i]) === false)
                  break;
          }
          return this;
      }
};

xui.fn.find.prototype = xui.fn;
	
xui.extend = xui.fn.extend;

  // --- 
  /// imports(); 
  // ---

})();