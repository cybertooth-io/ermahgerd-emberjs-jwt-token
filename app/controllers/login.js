import {inject as service} from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    login(session, email, password) {
      session
        .authenticate('authenticator:jwt-token', {email: email, password: password})
        .then(() => {
          this.transitionToRoute('protected.index');
        }, () => {
          console.error('Failed to authenticate.');
          // TODO - present a message for failed authentication
        });
      return false;
    }
  },

  session: service()
});
