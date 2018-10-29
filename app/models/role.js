import BaseModel from './-base';
import DS from 'ember-data';

export default BaseModel.extend({
  key: DS.attr('string'),
  name: DS.attr('string'),
  notes: DS.attr('string')
});
