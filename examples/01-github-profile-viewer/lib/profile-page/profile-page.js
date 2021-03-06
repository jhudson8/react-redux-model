// "dumb / state unaware" React component
import React from 'react';

export default function ({ id, model }) {
  // model was provided automatically by the modelFetcher in the smart component (./index.js)
  // you will *always* get a model even if you actually have no model state data

  const value = model.value();

  if (value) {
    // we have the data fetched
    return (
      <dl>
        <dt>login</dt>
        <dd>{value.login}</dd>
        <dt>url</dt>
        <dd>{value.url}</dd>
        <dt>name</dt>
        <dd>{value.name}</dd>
        <dt>location</dt>
        <dd>{value.location}</dd>
        <dt>public repositories</dt>
        <dd>{value.public_repos}</dd>
      </dl>
    );
  }

  const fetchError = model.fetchError();
  if (fetchError) {
    return (
      <div>Sorry, <em>{id}</em> data could not be loaded: {fetchError.message}</div>
    );
  }

  // if we don't have a model yet and there is no error, there will be a fetch pending
  return (
    <div>Loading {id} details...</div>
  );
}
