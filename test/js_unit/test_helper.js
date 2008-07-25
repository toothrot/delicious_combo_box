(function(){
  // http://jehiah.cz/archive/firing-javascript-events-properly
  var TestHelpers = {
    fireEvent: function (element,event){
      if (document.createEventObject) { // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
      } else { // dispatch for firefox + others
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
      }
    }, // fireEvent


    fireMouseEvent: function (element,event){
      if (document.createEventObject) { // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
      } else { // dispatch for firefox + others
        var evt = document.createEvent("MouseEvents");
//      evt.initMouseEvent(type,  canBubble, cancelable, view,   detail,
        evt.initMouseEvent(event, true,      true,       window, 0,
//        screenX, screenY, clientX, clientY,
          0,       0,       0,       0,
//        ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
          false,   false,  false,    false,   0,      null);
        return !element.dispatchEvent(evt);
      }
    }, // fireMouseEvent

    fireKeyboardEvent: function (element,event,keyCode){
      if (document.createEventObject) { // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
      } else { // dispatch for firefox + others
        var evt = document.createEvent("KeyEvents");
        keyCode = keyCode || 13; //enter
        evt.initKeyEvent(
                  event,    // in DOMString typeArg,
                  true,     // in boolean canBubbleArg,
                  true,     // in boolean cancelableArg,
                  window,   // in nsIDOMAbstractView viewArg,  Specifies UIEvent.view. This value may be null.
                  false,    // in boolean ctrlKeyArg,
                  false,    // in boolean altKeyArg,
                  false,    // in boolean shiftKeyArg,
                  false,    // in boolean metaKeyArg,
                  keyCode,  // in unsigned long keyCodeArg,
                  0);       // in unsigned long charCodeArg);  
        return !element.dispatchEvent(evt);
      }
    }, // fireMouseEvent

    superfreakChorus: [
      "That girl is pretty wild now",
      "The girl's a super freak",
      "The kind of girl you read about",
      "In new-wave magazine",
      "That girl is pretty kinky",
      "The girl's a super freak",
      "I really love to taste her",
      "Every time we meet",
      "She's all right, she's all right",
      "That girl's all right with me, yeah",
      "She's a super freak, super freak",
      "She's super-freaky, yow",
      "Super freak, super freak"], //funk

    flunk: function() {
      var funkMessage = this.superfreakChorus.sort(function() {return 0.5 - Math.random()})[0]
      this.fail('FUNK! ' + funkMessage)
    }
  } // TestHelpers

  Object.extend(Test.Unit.Testcase.prototype, TestHelpers)
})()

// Custom Assertions, ho!
Object.extend(Test.Unit.Testcase.prototype,{
  assertEnabled: function(element) {
    var message = arguments[1] || "expected " + element.id + " to be enabled, but it was not!";
    try { (element.disabled) ? this.fail(message) : this.pass(); }
    catch(e) { this.error(e); }
  },
  assertDisabled: function(element) {
    var message = arguments[1] || "expected " + element.id + " to be disabled, but it was not!";
    try { (element.disabled) ? this.pass() : this.fail(message); }
    catch(e) { this.error(e); }
  },
  assertReadOnly: function(element) {
    var message = arguments[1] || "expected " + element.id + " to be readonly, but it was not!";
    try { (element.readOnly) ? this.pass() : this.fail(message); }
    catch(e) { this.error(e); }
  },
  assertNotReadOnly: function(element) {
    var message = arguments[1] || "expected " + element.id + " to not be readonly, but it was!";
    try { (element.readOnly) ? this.fail(message) : this.pass(); }
    catch(e) { this.error(e); }
  },
  assertArrayEqual: function(array1, array2) {with(this){
    assertEqual(array1.length, array2.length,
                "Arrays must be the same length");
    for(var i=0; i < array1.length; i++) {
      assertEqual(array1[i], array2[i]);
    }
  }},
  assertEventFired: function(expectedElement, eventName, firingFunction) {
    var assertionStatus = {failed: true}
    var assertionObserverFunction = function(event) {
      var firedEventName = event.eventName || event.type
      if (event.element() == expectedElement && firedEventName == eventName) { assertionStatus.failed = false }
    }
    try {
      expectedElement.observe(eventName, assertionObserverFunction)
      firingFunction()
      assertionStatus.failed ? this.fail('Expected ' + eventName + ' to fire.') : this.pass()
    } finally {
      expectedElement.stopObserving(eventName, assertionObserverFunction)
    }
  },
  deny: function(expression) {
    this.assert(!expression)
  }
});

