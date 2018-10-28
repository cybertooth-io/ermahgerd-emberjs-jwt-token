import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend(/*TokenAuthorizerMixin, */{
  namespace: 'api/v1'
});
