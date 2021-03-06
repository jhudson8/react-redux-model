Action Creators
---------------
The action creator in this project is used to easily, and with very little code, create dispatchable actions that interact with this package's reducers.  This uses [redux-effects-fetch](https://github.com/redux-effects/redux-effects-fetch)) but you could create your own by following the [./redux-actions](./redux-actions) interface.

## Promises
If you would like your `store.dispatch` function to return a promise for these actions, include the following code.  
Or you can include [the source code](../src/dispatch-promise.js).
```javascript
import { dispatchPromise } from 'restful-redux';
// "store" is the redux store
dispatchPromise(store);
```

Adding this middleware will include cookies and allow `params.body` object to be serialized as a JSON object with appropriate headers.  Or you can include [the source code](../src/fetch-config-middleware.js).
```javascript
import { fetchConfigMiddleware } from 'restful-redux';
```

### Import and Create New Action Creator
```javascript
import { createActionCreator } from 'restful-redux';

const actionCreator = createActionCreator({
  // prefix for all redux actions of this type
  actionPrefix: 'CUSTOMER',
  // root domain for model data; redux store data structure would be { entities: { customer: { _id_: {_model_data} } } }
  entityType: 'customer',
  // optional normalizr normalize method (see https://github.com/paularmstrong/normalizr;  `import { normalize } from 'normalizr';`)
  normalize: normalize,
  // optional flag (default to true) to indicate if normalized collections should be cloned if a collection entity has changed
  bubbleUp: false,
  // optional value to help log info to console if you are having trouble getting things working
  debug: true
});
```
### Example
[../examples/01-github-profile-viewer/lib/profile-page/actions.js](../examples/01-github-profile-viewer/lib/profile-page/actions.js)

### Action Creator API
* [createFetchAction](#createfetchaction)
* [createGetAction](#creategetaction)
* [createPostAction](#createpostaction)
* [createDeleteAction](#createdeleteaction)
* [createPutAction](#createputaction)
* [createPatchAction](#createpatchaction)
* [createModelDataAction](#createmodeldataaction)

#### createFetchAction
The `fetch` action will replace the contents of your model data with the XHR response.

Any other (`get`, `post`, `delete`, `put`, `patch`) will only replace the model data if the `replaceModel` option is provided.  See below for more details.

See [./redux-actions.md](./redux-actions.md) if you want to know the action shapes that are dispatched.  Useful for debugging or to create a different implementation of this action creator.

##### options
* ***id***: required model id  This can also be `false` for entities that have an unknown id - like the authenticated user of an application.
* ***url***: required fetch url
* ***params***: optional effects-fetch parameters (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
* ***schema***: optional [normalizr](https://github.com/paularmstrong/normalizr) schema if response should be normalized
* ***formatter***: optional function(payload, { id, actionType, entityType }) used to format the response before being evaluated by [normalizr](https://github.com/paularmstrong/normalizr); [see formatter response format](#formatter-return-format)
* ***successAction***: optional action to be dispatched if the XHR is successful: function(_normalized_payload_)
* ***errorAction***: optional action to be dispatched if the XHR is not successful: function({id, actionId, response})

note: if the errorAction or successAction are functions, they will have the XHR response as the first parameter so, if using thunk you should return a function `successAction: function (response) { return function (dispatch) {...}; }`

##### example
```javascript
export function fetch (id) {
  return actionCreator.createFetchAction({
    // or return actionCreator.createGetAction({
    id: id,
    url: `/customer/endpoint/${id}`
  });
}
```

#### createLocalPutAction
Returns a redux action used to set (or replace) a model value
```
return actionCreator.createLocalPutAction(id, _model_value_);
```

[API table of contents](#action-creator-api)

#### createLocalDeleteAction
Returns a redux action used to remove a model value from redux state (as if it had never been fetched)
```
return actionCreator.createLocalDeleteAction(id);
```

[API table of contents](#action-creator-api)

#### createModelDataAction
Returns a dispatchable redux action used to apply model specific meta data.  This data will persist even if the model is updated and can be retrieved using the `data()` function on a model.

##### example
```javascript
export function setLocalCustomerPreference (id, preferenceInfo) {
  // this will be able to retrieved in your React class (assuming the use of the model provider)
  // using model.data().customerPreference
  return actionCreator.createModelDataAction(id, { customerPreference: preferenceInfo });
}

// and in your React component...
const preferenceInfo = props.model.data().preferenceInfo; // data() can return undefined if not set
```

[API table of contents](#action-creator-api)

#### createGetAction
Returns a redux action used to initiate a `GET` request.  See [XHR action details](#xhr-action) for more details.

[API table of contents](#action-creator-api)

#### createPostAction
Returns a redux action used to initiate a `POST` request.  See [XHR action details](#xhr-action) for more details.

[API table of contents](#action-creator-api)


#### createDeleteAction
Returns a redux action used to initiate a `DELETE` request.  See [XHR action details](#xhr-action) for more details.

[API table of contents](#action-creator-api)


#### createPutAction
Returns a redux action used to initiate a `PUT` request.  See [XHR action details](#xhr-action) for more details.

[API table of contents](#action-creator-api)


#### createPatchAction
Returns a redux action used to initiate a `PATCH` request.  See [XHR action details](#xhr-action) for more details.

[API table of contents](#action-creator-api)


#### XHR Action
Returns a dispatchable redux action used to perform an arbitrary XHR request associated with a model.  The last successful action (and response) will be saved in redux state and available using the Model API with `Model.wasActionPerformed(_optional_action_id_).success (or .error)` function ([see Model class docs](./model.md)).


##### options
* ***id***: required model id
* ***actionId***: required action identifier (for example `update`)
* ***url***: required url
* ***params***: optional effects-fetch params `{ method, headers, mode, cache, body }` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
* ***schema***: optional [normalizr](https://github.com/paularmstrong/normalizr) schema if response should be normalized
* ***formatter***: optional function(payload, id) used to format the response before being evaluated by [normalizr](https://github.com/paularmstrong/normalizr); [see formatter return format](#formatter-return-format)
* ***delete***: `true` if the model value should be removed from redux state
* ***replaceModel***: `true` if the model contents should be replaced with this XHR response
* ***clearAfter***: optional time in milis to clear out this recorded action in redux state

*** note***: if `replaceModel` is `true`, use the `createFetchAction` response shape instead of the `response` attribute

##### example
```javascript
export function updateCustomer (id, customerData) {
  // we're using `createPostAction` for example but could be any of
  // createPostAction, createDeleteAction, createPutAction, createPatchAction
  return actionCreator.createPostAction({
    id: id,
    url: `/customer/endpoint/${id}`,
    params: { // see https://github.com/redux-effects/redux-effects-fetch#actions
      body: customerData
    },
    replaceModel: true,
    clearAfter: 3000
  });
}
```

[API table of contents](#action-creator-api)


##### Formatter Return Format
If a `formatter` function is provided it should return an object some or all of these attributes

Fetch (or action with `replaceModel = true`)
* ***result***: formatted model value (accessable using `model.getValue()`)
* ***data***: any model meta data ([see [Model.data()](./model.md))
* ***entities***: normalized format (what [normalizr](https://github.com/paularmstrong/normalizr) would produce).  In this case `result` should be the model id.
* ***delete***: `true` if the model value should be removed from redux state
Any other action
* ***response***: The formatted XHR response payload (accessable using `model.getAction().success` or `model.getAction().error`)
* ***data***: any model meta data ([see [Model.data()](./model.md))


Simple
```
{
  result: _model data_, (accessed using model.value() - see Model docs)
  data: _meta data_ (accessed using model.data() - see Model docs; good for collections where the "model" is an array)
}
```
Advanced
```
{
  result: _model id_
  entities: { // useful for multiple entities provided with a single response (or to normalize the responses)
    _entityType_: { // must match the `entityType` attribute for the action creator options
      _model id_: {
        // the model data
      }
    }
    // other entities values for different ids and/or entity types can be included as well
  },
  data: _meta data_ (accessed using model.data() - see Model docs; good for collections where the "model" is an array)
}
```
[API table of contents](#action-creator-api)
