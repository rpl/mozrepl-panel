Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

let Cc = Components.classes;
let Ci = Components.interfaces;

// basic wrapper for nsIXULTemplateResult
function TemplateResult(aData) {
  this._data = aData;
  // just make a random number for the id
  this._id = Math.random(100000).toString();
}

TemplateResult.prototype = {
  QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIXULTemplateResult]),

  // private storage
  _data: null,

  // right now our results are flat lists, so no containing/recursion take place
  isContainer: false,
  isEmpty: true,
  mayProcessChildren: false,
  resource: null,
  type: "simple-item",

  get id() {
    return this._id;
  },

  // return the value of that bound variable such as ?name
  getBindingFor: function(aVar) {
    // strip off the ? from the beginning of the name
    var name = aVar.toString().slice(1);
    return this._data[name];
  },

  // return an object instead of a string for convenient comparison purposes
  // or null to say just use string value
  getBindingObjectFor: function(aVar) {
    return null;
  },

  // called when a rule matches this item.
  ruleMatched: function(aQuery, aRuleNode) { },

  // the output for a result has been removed and the result is no longer being used by the builder
  hasBeenRemoved: function() { }
};


// basic wrapper for nsISimpleEnumerator
function TemplateResultSet(aArrayOfData) {
  this._index = 0;
  this._array = aArrayOfData;
}

TemplateResultSet.prototype = {
  QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsISimpleEnumerator]),

  hasMoreElements: function() {
    return this._index < this._array.length;
  },

  getNext: function() {
    return new TemplateResult(this._array[this._index++]);
  }
};


// The query processor class - implements nsIXULTemplateQueryProcessor
function TemplateQueryProcessor() {
  // our basic list of data
  this._data = [
                {title: "test1"},
                {title: "test2"},
                {title: "test3"},
                {title: "test4"}
               ];
}

TemplateQueryProcessor.prototype = {
  QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIXULTemplateQueryProcessor]),
  classDescription: "Window List XUL Template Query Processor",
  classID: Components.ID("{4beba06d-99bd-42e4-9409-8c10fa1b04cf}"),
  contractID: "@mozilla.org/xul/xul-query-processor;1?name=windowlist",

  getDatasource: function(aDataSources, aRootNode, aIsTrusted, aBuilder, aShouldDelayBuilding) {
    // TODO: parse the aDataSources variable
    // for now, ignore everything and let's just signal that we have data
    return this._data;
  },

  initializeForBuilding: function(aDatasource, aBuilder, aRootNode) {
    // perform any initialization that can be delayed until the content builder
    // is ready for us to start
	this._data = []; 
    var wm = Cc['@mozilla.org/appshell/window-mediator;1']
      .getService(Ci.nsIWindowMediator);

    var win_enum = wm.getEnumerator(null);
    while(win_enum.hasMoreElements()) {  
      var win = win_enum.getNext();
	  this._data.push({title: win.document.title});
    }
  },

  done: function() {
    // called when the builder is destroyed to clean up state
  },

  compileQuery: function(aBuilder, aQuery, aRefVariable, aMemberVariable) {
    // outputs a query object.
    // eventually we should read the <query> to create filters
    return this._data;
  },

  generateResults: function(aDatasource, aRef, aQuery) {
    // preform any query and pass the data to the result set
    return new TemplateResultSet(this._data);
  },

  addBinding: function(aRuleNode, aVar, aRef, aExpr) {
    // add a variable binding for a particular rule, which we aren't using yet
  },

  translateRef: function(aDatasource, aRefstring) {
    // if we return null, everything stops
    return new TemplateResult(null);
  },

  compareResults: function(aLeft, aRight, aVar) {
    // -1 less, 0 ==, +1 greater
    var leftValue = aLeft.getBindingFor(aVar);
    var rightValue = aRight.getBindingFor(aVar);
    if (leftValue < rightValue) {
      return -1;
    }
    else if (leftValue > rightValue) {
      return  1;
    }
    else {
      return 0;
    }
  }
};


var components = [TemplateQueryProcessor];

function NSGetModule(compMgr, fileSpec) {
  return XPCOMUtils.generateModule(components);
}
