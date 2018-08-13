import FieldGroupView from 'core/component/fieldgroup/view';
import Utils from 'core/util/utils';
import Template from './experimentrow.html';
import './experimentrow.scss';

export default class ExperimentRowView extends FieldGroupView {
  constructor(model, tmpl) {
    super(model, tmpl || Template);
  }
}
