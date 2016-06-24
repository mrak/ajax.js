'use strict';
(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.ajax = factory();
  }
})(this, function () {
  return function (options, cb) {
    var done = false;
    var cb = cb || function () {};
    var req = new XMLHttpRequest();

    function callback() {
      if (done) { return; }
      done = true;
      cb.apply(null, arguments);
    }

    req.onreadystatechange = function () {
      var data = {
        xhr: req,
        text: req.responseText,
        status: req.status
      };

      if (req.readyState === 4) {
        if (req.status < 200 && req.status >= 400) {
          callback(data);
        } else {
          callback(null, data);
        }
      }
    };

    req.open(options.method || 'GET', options.url, true);
    req.withCredentials = options.withCredentials === true;

    Object.keys(options.headers || {}).forEach(function (header) {
      req.setRequestHeader(header, options.headers[header]);
    });

    try { req.send(options.body); } catch (e) { callback(e); }
    return req;
  }
});
