(function(context){
    function parseStorage(ls){
        if(!ls) {
            return;
        }
        return JSON.parse(ls);
    }
    function $(selector, scope){
        $.qs(selector, scope)
    }
    $['qs'] = function(selector, scope) {
        return (scope || document).querySelector(selector);
    }
    $['qsa'] = function(selector, scope) {
        return (scope || document).querySelectorAll(selector);
    }
    $['on'] = function(target, type, cb, useCapture) {
        target.addEventListener(type, cb, !!useCapture);
    }
    $['delegate'] = function(target, selector, type, cb) {

        function customDispatcher(event) {
            const targetNode = event.target;
            // get all nodes inside target.
            const allNodes = $.qsa(selector, target);
            const isNodePresentInside = Array.prototype.includes.call(allNodes, targetNode);
            if(isNodePresentInside) {
                cb(event);
            }
        }

        // event delegation doesn't work on these events.
        // To make this work, either use focusin or focusout,
        // or useCapture true.
        const useCapture = type === 'focus' || type === 'blur';
        $.on(target, type, customDispatcher, useCapture);
    }
    $['parent'] = function(element, parentTagName) {

        // Base condition to break recursion
        if(!element.parentNode) {
            return;
        }
        if(element.parentNode.tagName.toLowerCase() === parentTagName.toLowerCase()) {
            return element.parentNode;
        }
        // recursively go upwards
        return $.parent(element.parentNode, parentTagName);
    }
    context.$ = $;
    context.parseStorage = parseStorage;
})(this);