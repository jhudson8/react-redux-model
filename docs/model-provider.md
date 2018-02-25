Model Provider
---------------
A React class used to auto-fetch and inject Model objects (which wrap your model data) into the React properties.  This of this like a smart (as in smart vs. dumb) component for higher order model association.

### Example
[../examples/01-github-profile-viewer/lib/profile-page/index.js](../examples/01-github-profile-viewer/lib/profile-page/index.js)

```javascript
import { modelProvider } from 'restful-redux';
import { connect } from 'react-redux';

// referring to your custom code here
import CustomerPage from './customer-page';
import { fetch } from './customer-actions';

// redux mapStateToProps smart component function
function mapStateToProps (state) {
  return {
    // the `app` attribute of state would match the combineReducers sub-state
    entities: state.app
  }
}

// redux mapDispatchToProps smart component function
function mapDispatchToProps (dispatch) {
  return {
    // a `fetch` property is required and will be used to initiate the fetch
    // the property name can be overridden using the `fetchProp` option
    fetch: id => dispatch(fetch(id))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(

  modelProvider({
    model: {
      // react-router will give us route token values in `props.params`
      id: 'params.id',
      // should match the action creator `entityType` option
      entityType: 'customer',
      // if this is not included, the model will not be auto-fetched
      fetchProp: 'fetch',
      // function used to force a fetch even if the model data has already been retrieved
      // note: this function will not be called if a fetch is pending
      forceFetch: function (id, model, newProps, prevProps) { return true },
      // used if the model represents a collection and you want the value() response to contain Model objects rather than data
      arrayEntrySchema: _your_normalizr_schema_,
      // optional callback function when either the id value changes *or* the component is mounted
      onIdChange: function(_new_id_, _old_id_, props)
    },
    // of if there are more than 1 model
    models: [{
      ...
    }, {
      ...
    }]
    // optional value to help log info to console if you are having trouble getting things working
    debug: true
  })(CustomerPage);

);
```
or if you have multiple models to work with
```javascript
...

modelProvider({
  debug: true,
  models: [{
    id: 'params.id',
    entityType: 'customer',
    fetchProp: 'fetch'
  }, {
    ...
  }]
})(CustomerPage);
```

### options
* ***models***: (if more than 1 model should be referenced, array of objects with following options)
* ***id***: function(props) or string (nesting using `.`) to identify the model id from React component properties.  This can also be `false` for entities that have an unknown id - like the authenticated user of an application.
* ***entityType***: arbitrary string value (but should be meaningful to the model type) which should match the `entityType` value in your reducer and action creator
* ***propName***: property name used for the model object (defaults to `model`)
* ***idPropName***: the property name used for the model id (defaults to `id`)
* ***fetchProp***: the property used to fetch the model if necessary (the model will not be auto-fetched if this is not set)
* ***modelClass***: the model class to use (defaults to { Model } from 'restful-redux`;  see [Model docs]('./model.md))
* ***forceFetch***:  Function `(newId, currentModel, newProps, currentProps)` which returns a boolean for finer grained control (return `true` to fetch).  This function will execute during mount and any properties change but not if there is a current XHR pending.
* ***denormalize***: normalizr denormalize function if you want the model value to be denormalized (`schema` is required)
* ***schema***: normalizr schema to denormalize the value
* ***arrayEntrySchema***: normalizr schema if the model value is an array and you want
* ***fetchOptions***: optional function(props, id) used to provide a 2nd parameter to the fetch method if the `id` is not sufficient
