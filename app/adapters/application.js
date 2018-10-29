import DS from 'ember-data';
import EmberSimpleAuthTokenHeaders from 'ember-simple-auth-token/mixins/token-authorizer';

export default DS.JSONAPIAdapter.extend(EmberSimpleAuthTokenHeaders, {
  namespace: 'api/v1/protected'
});
