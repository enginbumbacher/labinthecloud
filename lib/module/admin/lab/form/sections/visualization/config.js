import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Utils from "core/util/utils";

import SelectField from "core/component/selectfield/field";
import ProxyField from "core/component/proxyfield/field";
import CakeConfig from "./cake";
import HistogramConfig from "./histogram";
import TimeSeriesConfig from "./timeseries";
import ComponentSpeedConfig from "./componentspeed";
import OrientationChangeConfig from "./orientationchange";
import TextField from "core/component/textfield/field";

class VisualizationConfig extends FieldGroup {
  constructor(conf) {
    let typeSelector = SelectField.create({
      id: 'id',
      label: 'Graph Type',
      options: {
        circle: 'Cake',
        componentspeed: 'Component Speed',
        histogram: 'Histogram',
        orientationchange: 'Orientation Change',
        timeseries: 'Time Series'
      }
    })
    conf.modelData.fields = conf.modelData.fields || [];
    conf.modelData.fields.push(typeSelector);
    conf.modelData.fields.push(TextField.create({
      id: 'label',
      label: "Graph Name",
      help: `<small>Enter a value to override the default name. Otherwise, leave this field blank.</small>`
    }));
    conf.modelData.fields.push(ProxyField.create({
      id: 'settings',
      fields: [
        CakeConfig.create({
          id: 'circle',
          label: 'Settings - Cake Graph',
          showLabel: true,
          collapsible: true,
          collapsed: true
        }),
        HistogramConfig.create({
          id: 'histogram',
          label: 'Settings - Histogram Graph',
          showLabel: true,
          collapsible: true,
          collapsed: true
        }),
        TimeSeriesConfig.create({
          id: 'timeseries',
          label: 'Settings - Time Series Graph',
          showLabel: true,
          collapsible: true,
          collapsed: true
        }),
        ComponentSpeedConfig.create({
          id: 'componentspeed',
          label: "Settings - Component Speed Graph",
          showLabel: true,
          collapsible: true,
          collapsed: true
        }),
        OrientationChangeConfig.create({
          id: 'orientationchange',
          label: "Settings - Orientation Change Graph",
          showLabel: true,
          collapsible: true,
          collapsed: true
        })
      ],
      proxyControl: typeSelector
    }));
    super(conf);    
  }

  value() {
    let value = super.value();
    if (!value.label) {
      value.label = this.getSubField('id').getSelectedLabel();
    }
    return value;
  }
}

VisualizationConfig.create = (data = {}) => {
  return new VisualizationConfig({ modelData: data });
}

export default VisualizationConfig;