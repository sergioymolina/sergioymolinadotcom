'use strict';
var SMJS = {
    window: jQuery(window),
    document: jQuery(document),
    html: jQuery('html'),
    body: jQuery('body'),
    is_safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    is_firefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
    is_chrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
    is_ie10: navigator.appVersion.indexOf('MSIE 10') !== -1,
    transitionEnd: 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
    animIteration: 'animationiteration webkitAnimationIteration oAnimationIteration MSAnimationIteration',
    animationEnd: 'animationend webkitAnimationEnd',
    getMousePos: function(e) {
        var posx = 0;
        var posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + SMJS.body.scrollLeft() + SMJS.document.scrollLeft();
            posy = e.clientY + SMJS.body.scrollTop() + SMJS.document.scrollTop();
        }
        return { x: posx, y: posy }
    }
};
SMJS.isMobile = { Android: function() { return navigator.userAgent.match(/Android/i); }, BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, any: function() { return (SMJS.isMobile.Android() || SMJS.isMobile.BlackBerry() || SMJS.isMobile.iOS() || SMJS.isMobile.Opera() || SMJS.isMobile.Windows()); } };
var resizeArr = [];
var resizeTimeout;
SMJS.window.on('load resize orientationchange', function(e) {
    if (resizeArr.length) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() { for (var i = 0; i < resizeArr.length; i++) { resizeArr[i](e); } }, 250);
    }
});
SMJS.debounceResize = function(callback) { if (typeof callback === 'function') { resizeArr.push(callback); } else { window.dispatchEvent(new Event('resize')); } }
var throttleArr = [];
var didScroll;
var delta = 5;
var lastScrollTop = 0;
SMJS.window.on('load resize scroll orientationchange', function() { if (throttleArr.length) { didScroll = true; } });

function hasScrolled() {
    var scrollTop = SMJS.window.scrollTop(),
        windowHeight = SMJS.window.height(),
        documentHeight = SMJS.document.height(),
        scrollState = '';
    if (Math.abs(lastScrollTop - scrollTop) <= delta) { return; }
    if (scrollTop > lastScrollTop) { scrollState = 'down'; } else if (scrollTop < lastScrollTop) { scrollState = 'up'; } else { scrollState = 'none'; }
    if (scrollTop === 0) { scrollState = 'start'; } else if (scrollTop >= documentHeight - windowHeight) { scrollState = 'end'; }
    for (var i in throttleArr) { if (typeof throttleArr[i] === 'function') { throttleArr[i](scrollState, scrollTop, lastScrollTop, SMJS.window); } }
    lastScrollTop = scrollTop;
}
setInterval(function() {
    if (didScroll) {
        didScroll = false;
        window.requestAnimationFrame(hasScrolled);
    }
}, 250);
SMJS.throttleScroll = function(callback) { if (typeof callback === 'function') { throttleArr.push(callback); } }