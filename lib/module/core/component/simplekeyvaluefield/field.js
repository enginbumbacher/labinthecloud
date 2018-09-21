import TextAreaField from "core/component/textareafield/field";

class SimpleKeyValueField extends TextAreaField {
  constructor(conf) {
    conf.modelData.help = conf.modelData.help || '';
    conf.modelData.help += `Each option shoud be entered on a separate line, in a {key}|{value} format.`;
    super(conf);
  }

  value() {
    let out = {};
    let val = super.value() || '';
    val = val.split("\n");
    val.forEach((line) => {
      let splitLine = line.split("|");
      if (splitLine.length > 1) {
        out[splitLine[0].trim()] = splitLine[1].trim();
      }
    })
    return out;
  }

  setValue(val) {
    let strVal = [];
    for (let key in val) {
      strVal.push(`${key}|${val[key]}`);
    }
    super.setValue(strVal.join("\n"));
  }
}

SimpleKeyValueField.create = (data = {}) => {
  return new SimpleKeyValueField({ modelData: data });
}

export default SimpleKeyValueField;