/*
 Copyright (C) Federico Zivolo 2017
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */function getStyleComputedProperty(a,b){if(1!==a.nodeType)return[];var c=window.getComputedStyle(a,null);return b?c[b]:c}function getParentNode(a){return'HTML'===a.nodeName?a:a.parentNode||a.host}function getScrollParent(a){if(!a)return window.document.body;switch(a.nodeName){case'HTML':case'BODY':return a.ownerDocument.body;case'#document':return a.body;}var b=getStyleComputedProperty(a),c=b.overflow,d=b.overflowX,e=b.overflowY;return /(auto|scroll)/.test(c+e+d)?a:getScrollParent(getParentNode(a))}function getOffsetParent(a){var b=a&&a.offsetParent,c=b&&b.nodeName;return c&&'BODY'!==c&&'HTML'!==c?-1!==['TD','TABLE'].indexOf(b.nodeName)&&'static'===getStyleComputedProperty(b,'position')?getOffsetParent(b):b:a?a.ownerDocument.documentElement:window.document.documentElement}function isOffsetContainer(a){var b=a.nodeName;return'BODY'!==b&&('HTML'===b||getOffsetParent(a.firstElementChild)===a)}function getRoot(a){return null===a.parentNode?a:getRoot(a.parentNode)}function findCommonOffsetParent(a,b){if(!a||!a.nodeType||!b||!b.nodeType)return window.document.documentElement;var c=a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING,d=c?a:b,e=c?b:a,f=document.createRange();f.setStart(d,0),f.setEnd(e,0);var g=f.commonAncestorContainer;if(a!==g&&b!==g||d.contains(e))return isOffsetContainer(g)?g:getOffsetParent(g);var h=getRoot(a);return h.host?findCommonOffsetParent(h.host,b):findCommonOffsetParent(a,getRoot(b).host)}function getScroll(a){var b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:'top',c='top'===b?'scrollTop':'scrollLeft',d=a.nodeName;if('BODY'===d||'HTML'===d){var e=a.ownerDocument.documentElement,f=a.ownerDocument.scrollingElement||e;return f[c]}return a[c]}function includeScroll(a,b){var c=2<arguments.length&&void 0!==arguments[2]&&arguments[2],d=getScroll(b,'top'),e=getScroll(b,'left'),f=c?-1:1;return a.top+=d*f,a.bottom+=d*f,a.left+=e*f,a.right+=e*f,a}function getBordersSize(a,b){var c='x'===b?'Left':'Top',d='Left'==c?'Right':'Bottom';return+a['border'+c+'Width'].split('px')[0]+ +a['border'+d+'Width'].split('px')[0]}var isIE10,isIE10$1=function(){return void 0==isIE10&&(isIE10=-1!==navigator.appVersion.indexOf('MSIE 10')),isIE10};function getSize(a,b,c,d){return Math.max(b['offset'+a],b['scroll'+a],c['client'+a],c['offset'+a],c['scroll'+a],isIE10$1()?c['offset'+a]+d['margin'+('Height'===a?'Top':'Left')]+d['margin'+('Height'===a?'Bottom':'Right')]:0)}function getWindowSizes(){var a=window.document.body,b=window.document.documentElement,c=isIE10$1()&&window.getComputedStyle(b);return{height:getSize('Height',a,b,c),width:getSize('Width',a,b,c)}}var _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a};function getClientRect(a){return _extends({},a,{right:a.left+a.width,bottom:a.top+a.height})}function getBoundingClientRect(a){var b={};if(isIE10$1())try{b=a.getBoundingClientRect();var c=getScroll(a,'top'),d=getScroll(a,'left');b.top+=c,b.left+=d,b.bottom+=c,b.right+=d}catch(a){}else b=a.getBoundingClientRect();var e={left:b.left,top:b.top,width:b.right-b.left,height:b.bottom-b.top},f='HTML'===a.nodeName?getWindowSizes():{},g=f.width||a.clientWidth||e.right-e.left,h=f.height||a.clientHeight||e.bottom-e.top,i=a.offsetWidth-g,j=a.offsetHeight-h;if(i||j){var k=getStyleComputedProperty(a);i-=getBordersSize(k,'x'),j-=getBordersSize(k,'y'),e.width-=i,e.height-=j}return getClientRect(e)}function getOffsetRectRelativeToArbitraryNode(a,b){var c=isIE10$1(),d='HTML'===b.nodeName,e=getBoundingClientRect(a),f=getBoundingClientRect(b),g=getScrollParent(a),h=getStyleComputedProperty(b),i=+h.borderTopWidth.split('px')[0],j=+h.borderLeftWidth.split('px')[0],k=getClientRect({top:e.top-f.top-i,left:e.left-f.left-j,width:e.width,height:e.height});if(k.marginTop=0,k.marginLeft=0,!c&&d){var l=+h.marginTop.split('px')[0],m=+h.marginLeft.split('px')[0];k.top-=i-l,k.bottom-=i-l,k.left-=j-m,k.right-=j-m,k.marginTop=l,k.marginLeft=m}return(c?b.contains(g):b===g&&'BODY'!==g.nodeName)&&(k=includeScroll(k,b)),k}function getViewportOffsetRectRelativeToArtbitraryNode(a){var b=Math.max,c=a.ownerDocument.documentElement,d=getOffsetRectRelativeToArbitraryNode(a,c),e=b(c.clientWidth,window.innerWidth||0),f=b(c.clientHeight,window.innerHeight||0),g=getScroll(c),h=getScroll(c,'left'),i={top:g-d.top+d.marginTop,left:h-d.left+d.marginLeft,width:e,height:f};return getClientRect(i)}function isFixed(a){var b=a.nodeName;return'BODY'===b||'HTML'===b?!1:!('fixed'!==getStyleComputedProperty(a,'position'))||isFixed(getParentNode(a))}function getBoundaries(a,b,c,d){var e={top:0,left:0},f=findCommonOffsetParent(a,b);if('viewport'===d)e=getViewportOffsetRectRelativeToArtbitraryNode(f);else{var g;'scrollParent'===d?(g=getScrollParent(getParentNode(a)),'BODY'===g.nodeName&&(g=a.ownerDocument.documentElement)):'window'===d?g=a.ownerDocument.documentElement:g=d;var h=getOffsetRectRelativeToArbitraryNode(g,f);if('HTML'===g.nodeName&&!isFixed(f)){var i=getWindowSizes(),j=i.height,k=i.width;e.top+=h.top-h.marginTop,e.bottom=j+h.top,e.left+=h.left-h.marginLeft,e.right=k+h.left}else e=h}return e.left+=c,e.top+=c,e.right-=c,e.bottom-=c,e}function getArea(a){var b=a.width,c=a.height;return b*c}function computeAutoPlacement(a,b,c,d,e){var f=5<arguments.length&&arguments[5]!==void 0?arguments[5]:0;if(-1===a.indexOf('auto'))return a;var g=getBoundaries(c,d,f,e),h={top:{width:g.width,height:b.top-g.top},right:{width:g.right-b.right,height:g.height},bottom:{width:g.width,height:g.bottom-b.bottom},left:{width:b.left-g.left,height:g.height}},i=Object.keys(h).map(function(a){return _extends({key:a},h[a],{area:getArea(h[a])})}).sort(function(c,a){return a.area-c.area}),j=i.filter(function(a){var b=a.width,d=a.height;return b>=c.clientWidth&&d>=c.clientHeight}),k=0<j.length?j[0].key:i[0].key,l=a.split('-')[1];return k+(l?'-'+l:'')}for(var isBrowser='undefined'!=typeof window&&'undefined'!=typeof window.document,longerTimeoutBrowsers=['Edge','Trident','Firefox'],timeoutDuration=0,i=0;i<longerTimeoutBrowsers.length;i+=1)if(isBrowser&&0<=navigator.userAgent.indexOf(longerTimeoutBrowsers[i])){timeoutDuration=1;break}function microtaskDebounce(a){var b=!1;return function(){b||(b=!0,Promise.resolve().then(function(){b=!1,a()}))}}function taskDebounce(a){var b=!1;return function(){b||(b=!0,setTimeout(function(){b=!1,a()},timeoutDuration))}}var supportsMicroTasks=isBrowser&&window.Promise,debounce=supportsMicroTasks?microtaskDebounce:taskDebounce;function find(a,b){return Array.prototype.find?a.find(b):a.filter(b)[0]}function findIndex(a,b,c){if(Array.prototype.findIndex)return a.findIndex(function(a){return a[b]===c});var d=find(a,function(a){return a[b]===c});return a.indexOf(d)}function getOffsetRect(a){var b;if('HTML'===a.nodeName){var c=getWindowSizes(),d=c.width,e=c.height;b={width:d,height:e,left:0,top:0}}else b={width:a.offsetWidth,height:a.offsetHeight,left:a.offsetLeft,top:a.offsetTop};return getClientRect(b)}function getOuterSizes(a){var b=window.getComputedStyle(a),c=parseFloat(b.marginTop)+parseFloat(b.marginBottom),d=parseFloat(b.marginLeft)+parseFloat(b.marginRight),e={width:a.offsetWidth+d,height:a.offsetHeight+c};return e}function getOppositePlacement(a){var b={left:'right',right:'left',bottom:'top',top:'bottom'};return a.replace(/left|right|bottom|top/g,function(a){return b[a]})}function getPopperOffsets(a,b,c){c=c.split('-')[0];var d=getOuterSizes(a),e={width:d.width,height:d.height},f=-1!==['right','left'].indexOf(c),g=f?'top':'left',h=f?'left':'top',i=f?'height':'width',j=f?'width':'height';return e[g]=b[g]+b[i]/2-d[i]/2,e[h]=c===h?b[h]-d[j]:b[getOppositePlacement(h)],e}function getReferenceOffsets(a,b,c){var d=findCommonOffsetParent(b,c);return getOffsetRectRelativeToArbitraryNode(c,d)}function getSupportedPropertyName(a){for(var b=[!1,'ms','Webkit','Moz','O'],c=a.charAt(0).toUpperCase()+a.slice(1),d=0;d<b.length-1;d++){var e=b[d],f=e?''+e+c:a;if('undefined'!=typeof window.document.body.style[f])return f}return null}function isFunction(a){return a&&'[object Function]'==={}.toString.call(a)}function isModifierEnabled(a,b){return a.some(function(a){var c=a.name,d=a.enabled;return d&&c===b})}function isModifierRequired(a,b,c){var d=find(a,function(a){var c=a.name;return c===b}),e=!!d&&a.some(function(a){return a.name===c&&a.enabled&&a.order<d.order});if(!e){var f='`'+b+'`';console.warn('`'+c+'`'+' modifier is required by '+f+' modifier in order to work, be sure to include it before '+f+'!')}return e}function isNumeric(a){return''!==a&&!isNaN(parseFloat(a))&&isFinite(a)}function getWindow(a){var b=a.ownerDocument;return b?b.defaultView:window}function removeEventListeners(a,b){return getWindow(a).removeEventListener('resize',b.updateBound),b.scrollParents.forEach(function(a){a.removeEventListener('scroll',b.updateBound)}),b.updateBound=null,b.scrollParents=[],b.scrollElement=null,b.eventsEnabled=!1,b}function runModifiers(a,b,c){var d=void 0===c?a:a.slice(0,findIndex(a,'name',c));return d.forEach(function(a){a['function']&&console.warn('`modifier.function` is deprecated, use `modifier.fn`!');var c=a['function']||a.fn;a.enabled&&isFunction(c)&&(b.offsets.popper=getClientRect(b.offsets.popper),b.offsets.reference=getClientRect(b.offsets.reference),b=c(b,a))}),b}function setAttributes(a,b){Object.keys(b).forEach(function(c){var d=b[c];!1===d?a.removeAttribute(c):a.setAttribute(c,b[c])})}function setStyles(a,b){Object.keys(b).forEach(function(c){var d='';-1!==['width','height','top','right','bottom','left'].indexOf(c)&&isNumeric(b[c])&&(d='px'),a.style[c]=b[c]+d})}function attachToScrollParents(a,b,c,d){var e='BODY'===a.nodeName,f=e?a.ownerDocument.defaultView:a;f.addEventListener(b,c,{passive:!0}),e||attachToScrollParents(getScrollParent(f.parentNode),b,c,d),d.push(f)}function setupEventListeners(a,b,c,d){c.updateBound=d,getWindow(a).addEventListener('resize',c.updateBound,{passive:!0});var e=getScrollParent(a);return attachToScrollParents(e,'scroll',c.updateBound,c.scrollParents),c.scrollElement=e,c.eventsEnabled=!0,c}var index={computeAutoPlacement:computeAutoPlacement,debounce:debounce,findIndex:findIndex,getBordersSize:getBordersSize,getBoundaries:getBoundaries,getBoundingClientRect:getBoundingClientRect,getClientRect:getClientRect,getOffsetParent:getOffsetParent,getOffsetRect:getOffsetRect,getOffsetRectRelativeToArbitraryNode:getOffsetRectRelativeToArbitraryNode,getOuterSizes:getOuterSizes,getParentNode:getParentNode,getPopperOffsets:getPopperOffsets,getReferenceOffsets:getReferenceOffsets,getScroll:getScroll,getScrollParent:getScrollParent,getStyleComputedProperty:getStyleComputedProperty,getSupportedPropertyName:getSupportedPropertyName,getWindowSizes:getWindowSizes,isFixed:isFixed,isFunction:isFunction,isModifierEnabled:isModifierEnabled,isModifierRequired:isModifierRequired,isNumeric:isNumeric,removeEventListeners:removeEventListeners,runModifiers:runModifiers,setAttributes:setAttributes,setStyles:setStyles,setupEventListeners:setupEventListeners};export{computeAutoPlacement,debounce,findIndex,getBordersSize,getBoundaries,getBoundingClientRect,getClientRect,getOffsetParent,getOffsetRect,getOffsetRectRelativeToArbitraryNode,getOuterSizes,getParentNode,getPopperOffsets,getReferenceOffsets,getScroll,getScrollParent,getStyleComputedProperty,getSupportedPropertyName,getWindowSizes,isFixed,isFunction,isModifierEnabled,isModifierRequired,isNumeric,removeEventListeners,runModifiers,setAttributes,setStyles,setupEventListeners};export default index;
//# sourceMappingURL=popper-utils.min.js.map
