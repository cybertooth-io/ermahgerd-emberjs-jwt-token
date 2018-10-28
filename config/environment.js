'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'cppdist-com-emberjs',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    'ember-simple-auth': {
      /**
       * Which authenticator is the app using?
       * TODO: is this even a configuration option?
       */
      authenticator: 'authenticator:jwt-token',

      /**
       * Which store implementation will be used?
       * TODO: is this even a configuration option?
       */
      store: 'session-store:local-storage'
    },

    'ember-simple-auth-token': {
      /**
       * Hash of any additional headers you want sent with your requests.
       */
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      /**
       * Whether or not to refresh the access tokens
       */
      refreshAccessTokens: true,

      /**
       * Do you want to set any refresh leeway?  I'd only set this in one place and I choose to add
       * leeway on the server side.  Client side triggers refresh at exact moment of expiry on the client
       * clock.
       */
      refreshLeeway: 0,

      /**
       * What is the name of the refresh token in the payload.  Usually something like `refresh_token`.  In
       * my Rails JWT_Sessions implementation we use the access token to queue up a refresh rather than passing
       * the request token back to the browser.
       */
      refreshTokenPropertyName: 'access',

      /**
       * Server endpoint to send refresh request
       */
      serverTokenRefreshEndpoint: '/token/refresh',

      /**
       * Server endpoint to send authenticate request
       */
      serverTokenEndpoint: '/token/login',

      /**
       * Key in server response that contains the access token
       */
      tokenPropertyName: 'access'
    },

    'ember-simple-auth-customizations': {
      /**
       * The end point that I want triggered when a session is logged out that way the server
       * can do some of it's own cleanup
       */
      invalidateEndpoint: '/token/logout',
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
