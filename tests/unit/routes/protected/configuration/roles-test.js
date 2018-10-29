import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Route | protected/configuration/roles', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:protected/configuration/roles');
    assert.ok(route);
  });
});
