import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('login');
  this.route('protected', function () {
    this.route('configuration', function () {
      this.route('roles', function () {
      });
    });
  });
});

export default Router;
