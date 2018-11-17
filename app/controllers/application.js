import {inject as service} from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    logout(session) {
      session.invalidate(true, session.get('data.authenticated'));
      return false;
    }
  },

  session: service()
});
