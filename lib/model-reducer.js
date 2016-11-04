'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (domain) {

  function update(state, id, entities, meta, clearModel) {
    // make sure our necessary data structure is initialized
    var stateEntities = state.entities || {};
    stateEntities._meta = stateEntities._meta || {};

    // make sure we are immutable
    state = Object.assign({}, state);
    state.entities = Object.assign({}, entities ? updateEntityModels(entities, stateEntities) : stateEntities);
    state.entities._meta = Object.assign({}, state.entities._meta);

    // update the metadata
    stateEntities = state.entities;
    var metaDomain = Object.assign({}, stateEntities._meta[domain]);
    stateEntities._meta[domain] = metaDomain;
    meta = Object.assign({}, metaDomain[id], meta);

    // clear out any undefined fields
    for (var key in meta) {
      if (meta.hasOwnProperty(key) && typeof meta[key] === 'undefined') {
        delete meta[key];
      }
    }
    metaDomain[id] = meta;

    if (clearModel) {
      // just delete the model if this action requires it
      stateEntities[domain] = Object.assign({}, stateEntities[domain]);
      delete stateEntities[domain][id];
    }

    return state;
  }

  // prepare the action types that we'll be looking for
  var handlers = [{
    state: 'FETCH_SUCCESS',
    meta: {
      fetched: 'full',
      fetchPending: undefined,
      fetchError: undefined,
      actionId: undefined,
      actionPending: undefined,
      actionSuccess: undefined,
      actionError: undefined,
      actionResponse: undefined
    }
  }, {
    state: 'FETCH_PENDING',
    clearModel: true,
    meta: {
      fetched: undefined,
      fetchPending: true
    }
  }, {
    state: 'FETCH_ERROR',
    clearModel: true,
    meta: {
      _responseProp: 'fetchError',
      fetched: false,
      fetchPending: undefined
    }
  }, {
    state: 'ACTION_ERROR',
    meta: {
      _responseProp: 'actionError',
      actionPending: undefined
    }
  }, {
    state: 'ACTION_PENDING',
    meta: {
      actionPending: true,
      actionError: undefined,
      actionResponse: undefined
    }
  }, {
    state: 'ACTION_SUCCESS',
    meta: {
      _responseProp: 'actionResponse',
      actionPending: undefined,
      actionError: undefined,
      actionSuccess: true
    }
  }, {
    state: 'ACTION_CLEAR',
    meta: {
      actionId: undefined,
      actionPending: undefined,
      actionError: undefined,
      actionResponse: undefined,
      actionSuccess: undefined
    }
  }].map(function (data) {
    return [domain + '_' + data.state, data];
  });

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    var type = action.type;
    for (var i = 0; i < handlers.length; i++) {
      if (handlers[i][0] === type) {
        // we've got a match
        var options = handlers[i][1];
        var payload = action.payload;
        var entities = payload.entities;
        var response = payload.response;
        var id = payload.result || payload.id;
        var actionId = payload.actionId;
        var meta = Object.assign({}, options.meta);
        var responseProp = meta._responseProp;

        if (actionId) {
          meta.actionId = actionId;
        }
        if (responseProp) {
          delete meta._responseProp;
          meta[responseProp] = response;
        }

        return update(state, id, entities, meta, options.clearModel);
      }
    }
    return state;
  };
};

function updateEntityModels(values, entities) {
  var rtn = Object.assign({}, entities);
  var domainIndex = {};
  for (var domain in values) {
    if (values.hasOwnProperty(domain)) {
      rtn[domain] = Object.assign({}, rtn[domain], values[domain]);
    }
  }
  return rtn;
} /**
   * Utility method for a consistent fetch pattern.  Return the state if applicable and false otherwise.
   * Options
   * - state: the reducer state
   * - domain: the domain used to isolate the event type names
   * - action: action
   */