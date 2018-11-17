import {get, set} from '@ember/object';
import {typeOf} from '@ember/utils';
import config from 'ember-get-config';
import fetch from 'fetch';
import JwtAuthenticator from 'ember-simple-auth-token/authenticators/jwt';

export default JwtAuthenticator.extend({
  /**
   * __Triggered when the authentication data is invalidated by the authenticator due to an external
   * or scheduled event__. This might happen, e.g., if a token expires or an event is triggered from
   * an external authentication provider that the authenticator uses. The session handles the event
   * and will invalidate itself when it is triggered.
   *
   * @event sessionDataInvalidated
   * @public
   */

  /**
   * Triggered when the authenticator refreshed the access token (see [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6)).
   *
   * @event sessionDataUpdated
   * @param {Object} data The updated session data
   * @public
   */

  /**
   * @method init
   * @private
   */
  init() {
    this._super(...arguments);

    const esatConf = config['ember-simple-auth-token'] || {};
    this.authorizationHeaderName = esatConf.authorizationHeaderName || 'Authorization';
    this.authorizationPrefix = esatConf.authorizationPrefix === '' ? '' : esatConf.authorizationPrefix || 'Bearer ';

    const conf = config['ember-simple-auth-customizations'] || {};
    this.invalidateEndpoint = conf.invalidateEndpoint || '/api/token-invalidate';
  },

  /**
   *
   * @param data
   * @param isInvalidateServerSide
   * @param sessionData -  the `data.authenticated` portion of the `session` service that includes
   * the access token and claims.  Basically your logout action needs to pass `session.get('data.authenticated')`
   * to this function.
   *
   * The `authenticated` data is usually shaped like the following, all we want is the `access` token:
   *
   * <pre>
   *  {
   *    access: "X.X.X",
   *    authenticator: "authenticator:jwt-token",
   *    exp: ##########,
   *    tokenData: {
   *      exp: ##########,
   *      user_id: ###,
   *      uid: "X#-X#-X#-X#-X#",
   *      ruid: "Y#-Y#-Y#-Y#-Y#"
   *    }
   *  }
   * </pre>
   * @override
   */
  invalidate(data, isInvalidateServerSide, sessionData) {
    // TODO: this is a complete fucking mess hack
    // if it so happens that we're being asked to logout; then make sure these two arguments are passed in
    // I'm doing this to tap-dance around how my parent classes use this
    if ('boolean' === typeOf(isInvalidateServerSide) && isInvalidateServerSide) {
      this.invalidateServerSide(get(sessionData, this.tokenPropertyName));
    }

    return this._super(...arguments);
  },

  /**
   * When a user actually logs out officially; lets go invalidate their session on the server.
   *
   * @param accessToken - the access token that will be used to invalidate the session.
   * @return {Promise<any>}
   * @private
   */
  invalidateServerSide(accessToken) {
    const headers = this.headers;
    set(headers, this.authorizationHeaderName, `${this.authorizationPrefix}${accessToken}`);
    return new Promise((resolve, reject) => {
      return fetch(this.invalidateEndpoint, {
        method: 'DELETE',
        headers: headers
      })
        .then((response) => resolve(response))
        .catch((errors) => reject(errors));
    });

  },

  /**
   * Override of the `ember-simple-auth-token/addon/authenticators/jwt.js` handler for `handleAccessTokenExpiration`.
   * For whatever reason, I receive an `fullName must be a proper full name ...` error if the invalidate is told
   * to trigger the `sessionDataInvalidated` event.
   *
   * @method handleAccessTokenExpiration
   * @private
   * @override
   */
  handleAccessTokenExpiration() {
    return this.invalidate().then(() => {
      // this.trigger('sessionDataInvalidated');
    });
  },

  /**
   * Makes a refresh token request to grab a new authenticated JWT token from the server.
   *
   * It will return a resolving promise if a successful POST is made to the `JWT.serverTokenRefreshEndpoint`.
   * After the new token is obtained it will schedule the next automatic token refresh based
   * on the new `expiresAt` time.
   *
   * The session will be updated via the trigger `sessionDataUpdated`.
   *
   * @method refreshAccessToken
   * @private
   * @override
   */
  refreshAccessToken(token) {
    set(this.headers, this.authorizationHeaderName, `${this.authorizationPrefix}${token}`);
    return this._super(...arguments)
      .finally(() => {
        delete this.headers[this.authorizationHeaderName];
      });
  }
});
