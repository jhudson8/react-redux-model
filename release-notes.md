## 6.0.5
- add additional denormalize / colletion schema attributes to model constructor type definition

## v6.0.4
- ensure that the model provider *always* sets a model as long as the id can be determined

## v6.0.3
- remove `entityType` as a required attribute of the Model constructor

## v6.0.2
- use actual booleans rather than timestamps for isFetchPending/isActionPending to make unit tests easier

## v6.0.1
- small bug fix regard loading state with the model provider

## v6.0.0
- added typescript definitions
- removed fuzzy constructors
  - Model constructor only accepts a [single options parameter](https://github.com/jhudson8/restful-redux/blob/031cd7ea3bedc0ee3d2709ddd00d27291ba426e7/src/types.ts#L7)
  - Action creators only accept a [single options parameter](https://github.com/jhudson8/restful-redux/blob/031cd7ea3bedc0ee3d2709ddd00d27291ba426e7/src/types.ts#L17)
  - You must explicitely use `false` as the id value if the id for a Model is N/A

## v5.0.1
- add back Model.fetchError function

## v5.0.0
restful-redux can now support multiple concurrent actions (as long as they have different ids)
- `isActionPending` now requires actionId
- removed `isPending` function
- added `actionError` function
- added `actionSuccess` function


## v4.0.0-beta
createGetAction/createPostAction... and all other except createFetchAction have redux action types of `ACTION` rather than `FETCH`
which will not cause the model to show as being fetched when these actions are executed.  Also, by default, the response from these action will replace the model contents.

## v3.6.0
enhancement: add additional Model constructor for unit testing to indicate a successful fetch: `new Model(_value_, true)`
note: `new Model(_model_value_, { fetch: { success: true } })` is still valid

## v3.5.3
bug fix: treat `createGetAction` as a semantic action rather than a fetch

## v3.5.2
- enhancement: allow modelProvider to support multiple models using the same fetchProp

## v3.5.1
- optimization: don't deep clone meta.data on reducer actions

## v3.5.0
- Added `timeSinceFetch` model function; see Model docs for more details
- Added static functions for all Model instance functions (when you only have the model meta object); see Model docs for more details

## v3.4.4
added additional logging when using `debug: true`

## v3.4.3
do not even allow forceFetch to be called if a fetch is pending

## v3.4.2
do not fetch with the model provider if there has been a previous fetch error (avoid endless cycle) - any additional fetches must be manual

## v3.4.1
only call `forceFetch` function if we should not otherwise fetch

## v3.4.0
add `createLocalDelete` and `createLocalPut` action creator functions to modify redux state through actions without XHR requests

## v3.3.3
enhancement: allow formatter to return undefined and/or the same payload to be treated as if no formatter was used

## v3.3.2
fix action pending state

## v3.3.1
fix bug to ensure that the `pending` attribute is removed once the XHR request comes back

## v3.3.0
Unless you were working with metadata directly these changes are all under the covers.  The data shape of the fetch/action loading state has been change to be similar.  See the new doc (unit testing) for more details on the shape.

Note: with your action creators, if a defined `errorAction` or `successAction` are functions, they will have the XHR response as the first parameter so, if using thunk you should return a function; e.g. `successAction: function (response) { return function (dispatch) {...}; }`

## v3.2.2
- 1 more bug fix with normalization

## v3.2.1
- fixed model reducer handling with normalized results

## v3.2
- change reducer `afterReduce` and `beforeReduce` signature to include `state` as an attribute of the first parameter... `function ({action, id, entities, result, data, state}, meta)`
    `meta` is now the 2nd parameter which is where model state is stored (is a fetch pending, was there an action error... stuff like that).  You can mutate this object directly in `afterReduce` as it has already been cloned
- allow `successAction` and `errorAction` action creator attributes to be functions which will be given the response payload as the 1st parameter (they can still be plain objects like before)

## v3.1.2
- add more unit tests and fixed normalized entity type reducer overwriting bug

##v3.1.1
- fixed `previous state` logging when reducer is in `debug` mode

##v3.1.0
- added support for nexted modelProp and idProp properties in the component provider (nesting using `.`)
```
modelProvider({
  entityType: 'abc',
  modelProp: 'foo.bar'
})(Component)
```

## v3.0.7
- add 1 additional warning to prevent config mistakes

## v3.0.6
- added a warning in fetchConfigMiddleware to make sure it's applied to middleware chain as `fetchConfigMiddleware({ ...options })` rather than just `fetchConfigMiddleware`

## v3.0.5
- no code change.  added unnecessary files to .npmignore

## v3.0.4
- bug fix: keep "pending" action from shallow cloning the normalized source model data if bubbleUp=false

## v3.0.3
- fix bug with modelProvider when using the `id: false` option

## v3.0.2
- added `bubbleUp` option support to individual action creator functions (as opposed to the createActionCreator function where it was already supported)

## v3.0.1
- added `bubbleUp` option support to reducer

## v3.0.0
- renamed `reducer` to `createReducer`
```import { createReducer } from 'restful-redux';```
- renamed `reduxEffectsActionCreator` to `createActionCreator`
```import { createActionCreator } from 'restful-redux';```
- changed `beforeReduce`/`afterReduce` reducer lifecycle method signature
The function signature is (data, state) where `data` is { action, id, entities, result, data } (`reducerUtil` is handy for operations here)
  * ***action***: the dispatched action
  * ***id***: the entity id specific to the action that initiated the reducer
  * ***entities***: the `entities` action payload value (if provided) in the action payload (not the current state entities)
  * ***result***: the `result` action payload value (if provided)
  * ***data***: the `data` action payload value (if provided)
- moved the reducer utility functions from `reducer.util` to `import { reducerUtil } from 'restful-redux'`
- modelProvider has been refactored to match the callback style of redux smart componentWillReceiveProps
```javascript
modelProvider(options)(Component); //  see `modelProvider` docs for more details
```
- extracted reducer utility functions to `reducerUtil`
```javascript
import  { reducerUtil } from `restful-redux`;
```
See model-reducer docs for more details

## v2.2.1
updated examples to use new normalizr schema (and denormalizr impl from normalizr)

## v2.2.0
- add middleware to handle fetch actions with JSON post body content (will serialize content and update headers)
```javascript
import { dispatchPromise } from 'restful-redux';
// "store" is the redux store
dispatchPromise(store);
```
- add helper function to allow dispatched actions to return a promise
```javascript
import { fetchJSONMiddleware } from 'restful-redux';
// include this middleware when creating the redux store
```

## v2.1.1
- allow forceFetch to trigger a fetch even if id does not change

## v2.1.0
- allow forceFetch to be a function for finer grained detail
- provide completedAt/initiatedAt attributes for `wasFetched`, `isFetchPending`, `isActionPending`, `wasActionPerformed` Model functions

## v2.0.1
- fix `bubbleUp` behavior

## v2.0.0
- *only* support new 3.x denormalizr function provided by normalizr (import { denormalizrs } from 'normalizr' - not external `denormalizr` package)
- add `arrayEntrySchema` modelProvider option to allow for collections models value() function to return an array of Models
- standardize action creator formatting { data, result, entities }
- added Model.clearCache(id, entityType, cache)
- if a denormalized entity from a collection is updated, the collection is shallow copied to allow collection consumers to know about the change


## v1.5.0
Added useful entity manipulation reducer utility functions and beforeReduce/afterReduce reducer attributes
See https://github.com/jhudson8/restful-redux/blob/master/docs/model-reducer.md (Util section) for more details

## v1.4.4
allow false when checking for required fields

## v1.4.3
not really a bug fix but not worth a minor release;  allow model provider id to be a static value (it will check props first but, if not found, will be the value provided)

## v1.4.2
bug fix - support id=false in modelProvider

## v1.4.1
bug fix - allow Model.fromCache to use id: false to match an action creator

## v1.4.0
- added a `Model.fromCache` function to reuse cached models if possible
- model providers will now cache models (so no `componentWillReceiveProps`) execution for every render

## v1.3.2
- fix issue with returned action.promise not resolving

## v1.3.1
- fixed bug with error response handling

## v1.3.0
- use "params" attribute instead of "payload" for XHR actions.  This value represents the 2nd parameter of the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

## v1.2.0
- Added `successAction` and `errorAction` as optional attributes to the action creator
- Added `promise` as an attribute of the returned action from the creator
- `redux-thunk` is now required if using the redux effects action creator

## v1.1.1
- bug fix: allow state or state.entities to be passed to model (instead of just state.entities)

## v1.1.0
- Added alternative Model constructor useful for unit testing (id, value)
```
import { Model } from 'restful-redux';
// data() value can be included as {_meta: {data: {...}}}

const myModel = new Model('_modelid_', {
  _meta: {
    data: {
      someMetaValue: 'foo'
    }
  },
  someModelValue: 'bar'
});
```
