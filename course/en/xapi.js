// xapi.js — lightweight xAPI sidecar for immersive Solar PV course activities
// No SCORM impact; sends actor-verb-object statements to an LRS or localStorage queue.
(function (global) {
  'use strict';

  const XAPI = {
    endpoint: '',
    auth: '',
    actor: null,
    sessionId: '',
    queueKey: 'solar_xapi_queue',
    enabled: false
  };

  function init() {
    const params = new URLSearchParams(location.search);
    XAPI.endpoint = params.get('xapiEndpoint') || readStored('xapiEndpoint') || '';
    XAPI.auth = params.get('xapiAuth') || readStored('xapiAuth') || '';

    const learnerId = params.get('learnerId') || readStored('learnerId') || generateId();
    const learnerName = params.get('learnerName') || readStored('learnerName') || 'Learner';

    XAPI.actor = {
      objectType: 'Agent',
      name: learnerName,
      mbox: `mailto:${learnerId}@solarpv.course`
    };

    XAPI.sessionId = generateId();
    XAPI.enabled = true;

    // Flush any queued statements when back online
    window.addEventListener('online', flushQueue);
    flushQueue();
  }

  function readStored(key) {
    try { return localStorage.getItem('solar_' + key); } catch (e) { return null; }
  }

  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function buildStatement(verbId, verbDisplay, objectId, objectName, objectType, result, context) {
    const stmt = {
      actor: XAPI.actor,
      verb: {
        id: verbId,
        display: { 'en-US': verbDisplay }
      },
      object: {
        id: objectId,
        objectType: 'Activity',
        definition: {
          name: { 'en-US': objectName },
          type: objectType || 'http://adlnet.gov/expapi/activities/module'
        }
      },
      context: Object.assign({
        registration: XAPI.sessionId,
        extensions: {
          'https://solarpv.course/session': XAPI.sessionId,
          'https://solarpv.course/page': location.pathname
        }
      }, context || {}),
      timestamp: nowIso()
    };
    if (result) stmt.result = result;
    return stmt;
  }

  function send(stmt) {
    if (!XAPI.enabled) return;
    if (!XAPI.endpoint) {
      queue(stmt);
      return;
    }
    fetch(XAPI.endpoint + '/statements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Experience-API-Version': '1.0.3',
        'Authorization': XAPI.auth || 'Basic ' + btoa('user:pass')
      },
      body: JSON.stringify([stmt]),
      keepalive: true
    }).catch(function () {
      queue(stmt);
    });
  }

  function queue(stmt) {
    try {
      const list = JSON.parse(localStorage.getItem(XAPI.queueKey) || '[]');
      list.push(stmt);
      localStorage.setItem(XAPI.queueKey, JSON.stringify(list.slice(-200))); // keep last 200
    } catch (e) {}
  }

  function flushQueue() {
    if (!XAPI.endpoint) return;
    try {
      const list = JSON.parse(localStorage.getItem(XAPI.queueKey) || '[]');
      if (!list.length) return;
      fetch(XAPI.endpoint + '/statements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Experience-API-Version': '1.0.3',
          'Authorization': XAPI.auth || 'Basic ' + btoa('user:pass')
        },
        body: JSON.stringify(list),
        keepalive: true
      }).then(function (res) {
        if (res.ok) localStorage.setItem(XAPI.queueKey, '[]');
      }).catch(function () {});
    } catch (e) {}
  }

  // Public API
  global.SolarXAPI = {
    init: init,
    send: send,
    flush: flushQueue,
    statement: buildStatement,
    actor: function () { return XAPI.actor; },
    setEndpoint: function (url, authToken) {
      XAPI.endpoint = url;
      XAPI.auth = authToken || '';
      flushQueue();
    },
    // Convenience loggers
    launched: function (activity, name, context) {
      send(buildStatement('http://adlnet.gov/expapi/verbs/launched', 'launched',
        'https://solarpv.course/' + activity, name, 'http://adlnet.gov/expapi/activities/module', null, context));
    },
    interacted: function (activity, name, result, context) {
      send(buildStatement('http://adlnet.gov/expapi/verbs/interacted', 'interacted',
        'https://solarpv.course/' + activity, name, 'http://adlnet.gov/expapi/activities/module', result, context));
    },
    completed: function (activity, name, result, context) {
      send(buildStatement('http://adlnet.gov/expapi/verbs/completed', 'completed',
        'https://solarpv.course/' + activity, name, 'http://adlnet.gov/expapi/activities/module', result, context));
    },
    passed: function (activity, name, result, context) {
      send(buildStatement('http://adlnet.gov/expapi/verbs/passed', 'passed',
        'https://solarpv.course/' + activity, name, 'http://adlnet.gov/expapi/activities/assessment', result, context));
    },
    failed: function (activity, name, result, context) {
      send(buildStatement('http://adlnet.gov/expapi/verbs/failed', 'failed',
        'https://solarpv.course/' + activity, name, 'http://adlnet.gov/expapi/activities/assessment', result, context));
    },
    experienced: function (activity, name, context) {
      send(buildStatement('http://adlnet.gov/expapi/verbs/experienced', 'experienced',
        'https://solarpv.course/' + activity, name, 'http://adlnet.gov/expapi/activities/module', null, context));
    }
  };

  // Auto-init when script loads, but allow apps to re-init with query params if needed.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
