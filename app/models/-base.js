import DS from 'ember-data';

export default DS.Model.extend({

  /**
   * Attributes
   * ---------------------------------------------------------------------------------------------------------------- */

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});
