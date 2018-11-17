import {hash} from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return hash({
      roles: this.get('store').query('role', {sort: 'name'})
    });
  }
});
