import * as assign from 'object-assign';

/**
 * Enhance any redux-effects-fetch actions that are dispatched by setting 'same-origin' (or provided) credentials,
 * setting any provided headers and looking for object body content and setting JSON headers and serializing the content.
 *
 * options
 * "credentials": the [credentials](https://github.github.io/fetch/)
 * "headers": object or function(action) which returns any headers that should be applied to the payload
 * "autoJSON": (defaults to true) boolean or function(action) which allows for auto-setting of JSON headers and
 *    serialization of body content if the body content is an object
 */

// redux-effects-fetch action type
const EFFECT_FETCH = 'EFFECT_FETCH';
export default function (options) {
  options = options || {};
  // default to same origin credentials which allow cookie passing
  options.credentials = options.hasOwnProperty('credentials') ? options.credentials : 'same-origin';

  return () => (next) => {
    if (next.type) {
      throw new Error('restful-redux fetchConfigMiffleware is not used correctly (options are not provided).  Should be `fetchConfigMiddleware()`');
    }
    return function (action) {
      if (action.type === EFFECT_FETCH) {
        // we've got an XHR request - clone the action so we can tweak it
        let params = action.payload.params || {};
        action = assign({}, action, {
          payload: assign({}, action.payload, {
            params: assign({
              // use default credentials
              credentials: options.credentials,
              headers: {}
            }, params)
          })
        });
        params = action.payload.params;

        // auto add any headers
        const headers = setting('headers', options, action);
        if (headers) {
          assign(params.headers, headers);
        }

        const autoJSON = setting('autoJSON', options, action);
        if (autoJSON !== false) {
          const body = params.body;
          if (typeof body === 'object' || Array.isArray(body)) {
            params.headers = assign({
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
            }, params.headers);
            params.body = JSON.stringify(body);
          }
        }
      }
      return next(action);
    };
  };
}

function setting (key, options, action) {
  return typeof options[key] === 'function' ? options[key](action) : options[key];
}
