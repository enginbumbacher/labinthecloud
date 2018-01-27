"use strict";

window.Blockly.defineBlocksWithJsonArray([{ "type": "modifier_rand",
  "message0": "more or less %1 %2",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "input_value",
    "name": "QUANT",
    "check": ["Number", "String", "modifier_prob", "modifier_rand", "quant_prop_1sensor", "quant_prop_2sensors"]
  }],
  "inputsInline": true,
  "output": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "qual_absolute",
  "message0": "%1",
  "args0": [{
    "type": "field_dropdown",
    "name": "MAGNITUDE",
    "options": [["a very small amount", "VERY_SMALL"], ["a small amount", "SMALL"], ["a medium amount", "MEDIUM"], ["a large amount", "LARGE"], ["a very large amount", "VERY_LARGE"]]
  }],
  "output": null,
  "colour": 180,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "quant_prop_1sensor",
  "message0": "amount prop. to %1",
  "args0": [{
    "type": "field_dropdown",
    "name": "FACTOR",
    "options": [["diff in light seen now vs before", "LIGHT_DIFF"], ["light seen now", "LIGHT_NOW"], ["general level of brightness", "LIGHT_AVG"]]
  }],
  "inputsInline": true,
  "output": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "quant_prop_2sensors",
  "message0": "amount proportional to the %1",
  "args0": [{
    "type": "field_dropdown",
    "name": "FACTOR",
    "options": [["difference between left and right sensors", "LIGHT_DIFF"], ["perceived light of right sensor", "LIGHT_RIGHT"], ["perceived light of left sensor", "LIGHT_LEFT"], ["general level of brightness", "LIGHT_AVG"]]
  }],
  "inputsInline": true,
  "output": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "stop_forward",
  "message0": "Stop moving forward",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "stop_rolling",
  "message0": "Stop rotating around axis",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_randomly",
  "message0": "Turn randomly by %1 %2",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "input_value",
    "name": "MAGNITUDE",
    "check": ["String", "modifier_rand"]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "forward_speed",
  "message0": "Move %1 by %2 %3 percent",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["faster", "FASTER"], ["slower", "SLOWER"]]
  }, {
    "type": "field_number",
    "name": "SPEED",
    "value": 0,
    "min": 0,
    "max": 100,
    "precision": 1
  }, {
    "type": "input_dummy"
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "Test",
  "helpUrl": ""
}, { "type": "roll_speed",
  "message0": "Rotate %1 by %2 %3 percent",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["faster", "FASTER"], ["slower", "SLOWER"]]
  }, {
    "type": "field_number",
    "name": "SPEED",
    "value": 0,
    "min": 0,
    "max": 100,
    "precision": 1
  }, {
    "type": "input_dummy"
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "Test",
  "helpUrl": ""
}, { "type": "turn_at_1sensor",
  "message0": "Turn %1 the %2 %3 by %4",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["away from", "AWAY"], ["in direction of", "TOWARDS"]]
  }, {
    "type": "field_dropdown",
    "name": "OBJECT",
    "options": [["sensor", "SENSOR"], ["eyespot", "SPOT"]]
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_value",
    "name": "MAGNITUDE",
    "check": ["Number", "String", "modifier_prob", "modifier_rand"]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_lr",
  "message0": "Turn %1 %2 by %3",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["left", "LEFT"], ["right", "RIGHT"]]
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_value",
    "name": "MAGNITUDE",
    "check": ["Number", "String", "modifier_prob", "modifier_rand", "quant_prop_1sensor", "quant_prop_2sensors"]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_at_2sensors",
  "message0": "Turn %1 the %2 sensor %3 by %4",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["away from", "AWAY"], ["in direction of", "TOWARDS"]]
  }, {
    "type": "field_dropdown",
    "name": "OBJECT",
    "options": [["stronger", "STRONGER"], ["weaker", "WEAKER"]]
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_value",
    "name": "MAGNITUDE",
    "check": ["Number", "String", "modifier_prob", "modifier_rand"]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "either_way",
  "message0": "Either way, I will do the following: %1 %2",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "CODE"
  }],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 270,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "see_light",
  "message0": "If I see a difference in light that is bigger than %1 percent, then I will ... %2 %3",
  "args0": [{
    "type": "field_number",
    "name": "THRESHOLD",
    "value": 0,
    "min": 0,
    "max": 100
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "CODE"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 270,
  "tooltip": "",
  "helpUrl": ""
}]);

window.Blockly.Blocks['every_time'] = {
  init: function init() {
    this.appendDummyInput().appendField("This is how I process the light:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setColour(230);
    this.setDeletable(false);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

// QUANTITIES AND MAGNITUDES
window.Blockly.JavaScript['modifier_rand'] = function (block) {
  var quantity = window.Blockly.JavaScript.valueToCode(block, 'QUANT', window.Blockly.JavaScript.ORDER_NONE);
  var randomCoeff = 0.1;
  var randomFactor = '1 + [-1,1][Math.random()*2|0]*Math.random() *' + randomCoeff;
  var code = randomFactor + '*' + quantity;
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['quant_prop_1sensor'] = function (block) {
  var factor = block.getFieldValue('FACTOR');

  var prop_to = null;
  switch (factor) {
    case "LIGHT_DIFF":
      prop_to = 'lightInfo.diffNowToAdaptLevel';
      break;
    case "LIGHT_NOW":
      prop_to = 'lightInfo.currentLevel[0]';
      break;
    case "LIGHT_AVG":
      prop_to = 'lightInfo.adaptLevel';
      break;
  }
  var code = prop_to;
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['quant_prop_2sensors'] = function (block) {
  var factor = block.getFieldValue('FACTOR');

  var prop_to = 0;
  switch (factor) {
    case "LIGHT_DIFF":
      prop_to = 'lightInfo.diffNowToAdaptLevel';
      break;
    case "LIGHT_RIGHT":
      // y = -1
      prop_to = 'lightInfo.currentLevel[EugBody.lightSensors[0].position.y < 0 ? 0 : 1]';
      break;
    case "LiGHT_LEFT":
      // y = 1
      prop_to = 'lightInfo.currentLevel[EugBody.lightSensors[0].position.y > 0 ? 0 : 1]';
      break;
    case "LIGHT_AVG":
      prop_to = 'lightInfo.adaptLevel';
      break;
  }
  var code = prop_to;
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['qual_absolute'] = function (block) {
  var magnitude = block.getFieldValue('MAGNITUDE');
  // The magnitudes get translated in percentages of the corresponding core values (fw_speed, roll_speed, reaction_strength)
  // or of values defined for each type of reaction
  var percentage = 0;
  switch (magnitude) {
    case "VERY_SMALL":
      percentage = 0.1;
      break;
    case "SMALL":
      percentage = 0.4;
      break;
    case "MEDIUM":
      percentage = 0.7;
      break;
    case "LARGE":
      percentage = 1.0;
      break;
    case "VERY_LARGE":
      percentage = 1.3;
      break;
  }

  var code = '' + percentage;
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['math_number'] = function (block) {
  var number = block.getFieldValue('NUM');
  var code = number;
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

// ACTIONS AND BEHAVIORS ************************************************

window.Blockly.JavaScript['forward_speed'] = function (block) {
  var speed = block.getFieldValue('SPEED');
  var direction = blockgetFieldValue('DIRECTION');

  var addsubstract = 0;
  switch (direction) {
    case "FASTER":
      addsubstract = 1;
      break;
    case "SLOWER":
      addsubtract = -1;
      break;
  }
  var code = 'fw_speed +=' + addsubtract + '*' + speed + '/ 100 * fw_speed;';
  return code;
};

window.Blockly.JavaScript['roll_speed'] = function (block) {
  var speed = block.getFieldValue('SPEED');
  var direction = blockgetFieldValue('DIRECTION');

  var addsubstract = 0;
  switch (direction) {
    case "FASTER":
      addsubstract = 1;
      break;
    case "SLOWER":
      addsubtract = -1;
      break;
  }

  var code = 'roll_speed +=' + addsubtract + '*' + speed + '/ 100 * roll_speed;';
  return code;
};

Blockly.JavaScript['stop_forward'] = function (block) {
  var code = 'fw_speed = 0;';
  return code;
};

Blockly.JavaScript['stop_rolling'] = function (block) {
  var code = 'roll_speed = 0;';
  return code;
};

Blockly.JavaScript['turn_randomly'] = function (block) {
  var value_magnitude = Blockly.JavaScript.valueToCode(block, 'MAGNITUDE', Blockly.JavaScript.ORDER_NONE);
  var code = 'delta_yaw +=' + value_magnitude + ' * [-1,1][Math.random()*2|0]*Math.random() * config.resetRandom * dT;';
  return code;
};

window.Blockly.JavaScript['turn_lr'] = function (block) {
  var direction = block.getFieldValue('DIRECTION');
  var magnitude = window.Blockly.JavaScript.valueToCode(block, 'MAGNITUDE', window.Blockly.JavaScript.ORDER_NONE);

  // LEFT direction is in positive local y-direction, irrespective of sensor location.
  // RIGHT direction is in negative local y-direction, irrespective of sensor location.
  var code = '';

  var flipRotationDir = 1;
  switch (direction) {
    case "LEFT":
      // Set coefficient such that when eye is on (1,1) in positive y-direction, left is towards the light
      flipRotationDir = -1;
      break;
    case "RIGHT":
      flipRotationDir = 1;
      break;
  }

  var code = '';
  var TURN_MAX = 2;
  code += 'var lightDiff = 0;';
  if (String(magnitude).match("lightInfo")) {
    if (String(magnitude).match("diffNowToAdaptLevel")) {
      code += 'lightDiff = onlyPositiveLightChange && lightInfo.diffNowToAdaptLevel < 0 ? 0 :' + magnitude + ';';
    } else {
      code += 'lightDiff =' + magnitude + ';';
    }
  } else {
    code += 'lightDiff =' + magnitude + '* EugBody.reaction_strength;';
    // lightDiff = magnitude * TURN_MAX;
  }

  code += 'delta_yaw += ' + flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};

window.Blockly.JavaScript['turn_at_1sensor'] = function (block) {
  var direction = block.getFieldValue('DIRECTION');
  var object = block.getFieldValue('OBJECT');
  var magnitude = window.Blockly.JavaScript.valueToCode(block, 'MAGNITUDE', window.Blockly.JavaScript.ORDER_NONE);

  /*
  In direction of the sensor: Where the sensor is pointing to, if the field is smaller than 2*PI, OR where the sensor is located IF NOT y_sensor = 0
  In direction of the eyespot: IF THERE IS AN EYESPOT, then in the direction that it is located at.
  The deciding factor is the y coordinate of the sensor orientation, position or of the eyespot position:
  - y = 0: We have no set direction.
  - y > 0: counter-clockwise direction (i.e. positive angles)
  - y < 0: clockwise direction (i.e. negative angles)
   If direction is "TOWARDS", then the flipRotationDir is positive, and negative otherwise.
  */
  var flipRotationDir = 1;
  switch (direction) {
    case "AWAY":
      flipRotationDir = -1;
      break;
    case "TOWARDS":
      flipRotationDir = 1;
      break;
  }

  var code = '';

  if (object == 'SENSOR') {
    code += 'var rotationDir = 0; \
    if (EugBody.lightSensors.length) { \
      if (EugBody.lightSensors[0].field == 2*Math.PI) { \
        rotationDir = EugBody.lightSensors[0].position.y; \
      } else { \
        rotationDir = EugBody.lightSensors[0].orientation.y; \
      } }';
  } else if (object == 'SPOT') {
    code += 'var rotationDir = 0; \
    if (EugBody.spotPositions.length==1) { \
      rotationDir = EugBody.spotPositions[0].y; }';
  }

  var TURN_MAX = 2;
  code += 'var lightDiff = 0;';
  if (String(magnitude).match("lightInfo")) {
    if (String(magnitude).match("diffNowToAdaptLevel")) {
      code += 'lightDiff = onlyPositiveLightChange && lightInfo.diffNowToAdaptLevel < 0 ? 0 :' + magnitude + ';';
    } else {
      code += 'lightDiff =' + magnitude + ';';
    }
  } else {
    code += 'lightDiff =' + magnitude + '* EugBody.reaction_strength;';
    // lightDiff = magnitude * TURN_MAX;
  }

  code += 'delta_yaw += rotationDir *' + flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};

window.Blockly.JavaScript['turn_at_2sensors'] = function (block) {
  var direction = block.getFieldValue('DIRECTION');
  var object = block.getFieldValue('OBJECT');
  var magnitude = window.Blockly.JavaScript.valueToCode(block, 'MAGNITUDE', window.Blockly.JavaScript.ORDER_NONE);

  var flipRotationDir = 1;
  switch (direction) {
    case "AWAY":
      flipRotationDir = -1;
      break;
    case "TOWARDS":
      flipRotationDir = 1;
      break;
  }

  var code = 'var rotationDir = 0;';

  if (object == 'WEAKER') {
    code += 'rotationDir = (sensorIntensities[1] - sensorIntensities[0]) >= 0 ? EugBody.lightSensors[1].position.y : EugBody.lightSensors[0].position.y;';
  } else if (object == 'STRONGER') {
    code += 'rotationDir = (sensorIntensities[1] - sensorIntensities[0]) < 0 ? EugBody.lightSensors[1].position.y : EugBody.lightSensors[0].position.y;';
  }

  var TURN_MAX = 2;
  code += 'var lightDiff = 0;';
  if (String(magnitude).match("lightInfo")) {
    if (String(magnitude).match("diffNowToAdaptLevel")) {
      code += 'lightDiff = onlyPositiveLightChange && lightInfo.diffNowToAdaptLevel < 0 ? 0 :' + magnitude + ';';
    } else {
      code += 'lightDiff =' + magnitude + ';';
    }
  } else {
    code += 'lightDiff =' + magnitude + '* EugBody.reaction_strength;';
    // lightDiff = magnitude * TURN_MAX;
  }

  code += 'delta_yaw += rotationDir *' + flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};

// CONDITIONS ************************************************

window.Blockly.JavaScript['every_time'] = function (block) {
  var all_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = all_code;
  return code;
};

window.Blockly.JavaScript['see_light'] = function (block) {
  var threshold_percentage = block.getFieldValue('THRESHOLD');
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) > ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.diffNowToAdaptLevel) >' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kZWxpbmdfYmxvY2tzLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIkJsb2NrbHkiLCJkZWZpbmVCbG9ja3NXaXRoSnNvbkFycmF5IiwiQmxvY2tzIiwiaW5pdCIsImFwcGVuZER1bW15SW5wdXQiLCJhcHBlbmRGaWVsZCIsImFwcGVuZFN0YXRlbWVudElucHV0Iiwic2V0Q2hlY2siLCJzZXRJbnB1dHNJbmxpbmUiLCJzZXRDb2xvdXIiLCJzZXREZWxldGFibGUiLCJzZXRUb29sdGlwIiwic2V0SGVscFVybCIsIkphdmFTY3JpcHQiLCJibG9jayIsInF1YW50aXR5IiwidmFsdWVUb0NvZGUiLCJPUkRFUl9OT05FIiwicmFuZG9tQ29lZmYiLCJyYW5kb21GYWN0b3IiLCJjb2RlIiwiZmFjdG9yIiwiZ2V0RmllbGRWYWx1ZSIsInByb3BfdG8iLCJtYWduaXR1ZGUiLCJwZXJjZW50YWdlIiwibnVtYmVyIiwic3BlZWQiLCJkaXJlY3Rpb24iLCJibG9ja2dldEZpZWxkVmFsdWUiLCJhZGRzdWJzdHJhY3QiLCJhZGRzdWJ0cmFjdCIsInZhbHVlX21hZ25pdHVkZSIsImZsaXBSb3RhdGlvbkRpciIsIlRVUk5fTUFYIiwiU3RyaW5nIiwibWF0Y2giLCJvYmplY3QiLCJhbGxfY29kZSIsInN0YXRlbWVudFRvQ29kZSIsInRocmVzaG9sZF9wZXJjZW50YWdlIiwic3RhdGVtZW50c19jb2RlIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPQyxPQUFQLENBQWVDLHlCQUFmLENBQXlDLENBQ3ZDLEVBQUUsUUFBUSxlQUFWO0FBQ0UsY0FBWSxvQkFEZDtBQUVFLFdBQVMsQ0FDUDtBQUNFLFlBQVE7QUFEVixHQURPLEVBSVA7QUFDRSxZQUFRLGFBRFY7QUFFRSxZQUFRLE9BRlY7QUFHRSxhQUFTLENBQ1AsUUFETyxFQUVQLFFBRk8sRUFHUCxlQUhPLEVBSVAsZUFKTyxFQUtQLG9CQUxPLEVBTVAscUJBTk87QUFIWCxHQUpP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QTNCO0FBQ0EsTUFBSW1CLGtCQUFrQjFDLE9BQU9DLE9BQVAsQ0FBZWEsVUFBZixDQUEwQjBCLGVBQTFCLENBQTBDekIsS0FBMUMsRUFBaUQsTUFBakQsQ0FBdEI7QUFDQTtBQUNBLE1BQUlNLE9BQU8sZ0ZBQWdGb0Isb0JBQWhGLEdBQXVHOzRGQUF2RyxHQUNrRkEsb0JBRGxGLEdBQ3lHLFdBRHpHLEdBQ3VIQyxlQUR2SCxHQUN5SSxHQURwSjtBQUVBLFNBQU9yQixJQUFQO0FBQ0QsQ0FQRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L21vZGVsaW5nX2Jsb2Nrcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5CbG9ja2x5LmRlZmluZUJsb2Nrc1dpdGhKc29uQXJyYXkoW1xuICB7IFwidHlwZVwiOiBcIm1vZGlmaWVyX3JhbmRcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwibW9yZSBvciBsZXNzICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3ZhbHVlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlFVQU5UXCIsXG4gICAgICAgIFwiY2hlY2tcIjogW1xuICAgICAgICAgIFwiTnVtYmVyXCIsXG4gICAgICAgICAgXCJTdHJpbmdcIixcbiAgICAgICAgICBcIm1vZGlmaWVyX3Byb2JcIixcbiAgICAgICAgICBcIm1vZGlmaWVyX3JhbmRcIixcbiAgICAgICAgICBcInF1YW50X3Byb3BfMXNlbnNvclwiLFxuICAgICAgICAgIFwicXVhbnRfcHJvcF8yc2Vuc29yc1wiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxMjAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJxdWFsX2Fic29sdXRlXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIiUxXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSB2ZXJ5IHNtYWxsIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJWRVJZX1NNQUxMXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBzbWFsbCBhbW91bnRcIixcbiAgICAgICAgICAgIFwiU01BTExcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIG1lZGl1bSBhbW91bnRcIixcbiAgICAgICAgICAgIFwiTUVESVVNXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBsYXJnZSBhbW91bnRcIixcbiAgICAgICAgICAgIFwiTEFSR0VcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIHZlcnkgbGFyZ2UgYW1vdW50XCIsXG4gICAgICAgICAgICBcIlZFUllfTEFSR0VcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxODAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJxdWFudF9wcm9wXzFzZW5zb3JcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiYW1vdW50IHByb3AuIHRvICUxXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkZBQ1RPUlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZGlmZiBpbiBsaWdodCBzZWVuIG5vdyB2cyBiZWZvcmVcIixcbiAgICAgICAgICAgIFwiTElHSFRfRElGRlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImxpZ2h0IHNlZW4gbm93XCIsXG4gICAgICAgICAgICBcIkxJR0hUX05PV1wiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImdlbmVyYWwgbGV2ZWwgb2YgYnJpZ2h0bmVzc1wiLFxuICAgICAgICAgICAgXCJMSUdIVF9BVkdcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcIm91dHB1dFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDEyMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInF1YW50X3Byb3BfMnNlbnNvcnNcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiYW1vdW50IHByb3BvcnRpb25hbCB0byB0aGUgJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRkFDVE9SXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJkaWZmZXJlbmNlIGJldHdlZW4gbGVmdCBhbmQgcmlnaHQgc2Vuc29yc1wiLFxuICAgICAgICAgICAgXCJMSUdIVF9ESUZGXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwicGVyY2VpdmVkIGxpZ2h0IG9mIHJpZ2h0IHNlbnNvclwiLFxuICAgICAgICAgICAgXCJMSUdIVF9SSUdIVFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInBlcmNlaXZlZCBsaWdodCBvZiBsZWZ0IHNlbnNvclwiLFxuICAgICAgICAgICAgXCJMSUdIVF9MRUZUXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZ2VuZXJhbCBsZXZlbCBvZiBicmlnaHRuZXNzXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0FWR1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwib3V0cHV0XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMTIwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwic3RvcF9mb3J3YXJkXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlN0b3AgbW92aW5nIGZvcndhcmRcIixcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwic3RvcF9yb2xsaW5nXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlN0b3Agcm90YXRpbmcgYXJvdW5kIGF4aXNcIixcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9yYW5kb21seVwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuIHJhbmRvbWx5IGJ5ICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3ZhbHVlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcImNoZWNrXCI6IFtcbiAgICAgICAgICBcIlN0cmluZ1wiLFxuICAgICAgICAgIFwibW9kaWZpZXJfcmFuZFwiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJmb3J3YXJkX3NwZWVkXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIk1vdmUgJTEgYnkgJTIgJTMgcGVyY2VudFwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJESVJFQ1RJT05cIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImZhc3RlclwiLFxuICAgICAgICAgICAgXCJGQVNURVJcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJzbG93ZXJcIixcbiAgICAgICAgICAgIFwiU0xPV0VSXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX251bWJlclwiLFxuICAgICAgICBcIm5hbWVcIjogXCJTUEVFRFwiLFxuICAgICAgICBcInZhbHVlXCI6IDAsXG4gICAgICAgIFwibWluXCI6IDAsXG4gICAgICAgIFwibWF4XCI6IDEwMCxcbiAgICAgICAgXCJwcmVjaXNpb25cIjogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMCxcbiAgICBcInRvb2x0aXBcIjogXCJUZXN0XCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJyb2xsX3NwZWVkXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlJvdGF0ZSAlMSBieSAlMiAlMyBwZXJjZW50XCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZmFzdGVyXCIsXG4gICAgICAgICAgICBcIkZBU1RFUlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNsb3dlclwiLFxuICAgICAgICAgICAgXCJTTE9XRVJcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfbnVtYmVyXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlNQRUVEXCIsXG4gICAgICAgIFwidmFsdWVcIjogMCxcbiAgICAgICAgXCJtaW5cIjogMCxcbiAgICAgICAgXCJtYXhcIjogMTAwLFxuICAgICAgICBcInByZWNpc2lvblwiOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAwLFxuICAgIFwidG9vbHRpcFwiOiBcIlRlc3RcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInR1cm5fYXRfMXNlbnNvclwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuICUxIHRoZSAlMiAlMyBieSAlNFwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJESVJFQ1RJT05cIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImF3YXkgZnJvbVwiLFxuICAgICAgICAgICAgXCJBV0FZXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiaW4gZGlyZWN0aW9uIG9mXCIsXG4gICAgICAgICAgICBcIlRPV0FSRFNcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiT0JKRUNUXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJzZW5zb3JcIixcbiAgICAgICAgICAgIFwiU0VOU09SXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZXllc3BvdFwiLFxuICAgICAgICAgICAgXCJTUE9UXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3ZhbHVlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcImNoZWNrXCI6IFtcbiAgICAgICAgICBcIk51bWJlclwiLFxuICAgICAgICAgIFwiU3RyaW5nXCIsXG4gICAgICAgICAgXCJtb2RpZmllcl9wcm9iXCIsXG4gICAgICAgICAgXCJtb2RpZmllcl9yYW5kXCJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInR1cm5fbHJcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiVHVybiAlMSAlMiBieSAlM1wiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJESVJFQ1RJT05cIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImxlZnRcIixcbiAgICAgICAgICAgIFwiTEVGVFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInJpZ2h0XCIsXG4gICAgICAgICAgICBcIlJJR0hUXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3ZhbHVlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcImNoZWNrXCI6IFtcbiAgICAgICAgICBcIk51bWJlclwiLFxuICAgICAgICAgIFwiU3RyaW5nXCIsXG4gICAgICAgICAgXCJtb2RpZmllcl9wcm9iXCIsXG4gICAgICAgICAgXCJtb2RpZmllcl9yYW5kXCIsXG4gICAgICAgICAgXCJxdWFudF9wcm9wXzFzZW5zb3JcIixcbiAgICAgICAgICBcInF1YW50X3Byb3BfMnNlbnNvcnNcIlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9hdF8yc2Vuc29yc1wiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuICUxIHRoZSAlMiBzZW5zb3IgJTMgYnkgJTRcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhd2F5IGZyb21cIixcbiAgICAgICAgICAgIFwiQVdBWVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImluIGRpcmVjdGlvbiBvZlwiLFxuICAgICAgICAgICAgXCJUT1dBUkRTXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk9CSkVDVFwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwic3Ryb25nZXJcIixcbiAgICAgICAgICAgIFwiU1RST05HRVJcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJ3ZWFrZXJcIixcbiAgICAgICAgICAgIFwiV0VBS0VSXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3ZhbHVlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcImNoZWNrXCI6IFtcbiAgICAgICAgICBcIk51bWJlclwiLFxuICAgICAgICAgIFwiU3RyaW5nXCIsXG4gICAgICAgICAgXCJtb2RpZmllcl9wcm9iXCIsXG4gICAgICAgICAgXCJtb2RpZmllcl9yYW5kXCJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcImVpdGhlcl93YXlcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiRWl0aGVyIHdheSwgSSB3aWxsIGRvIHRoZSBmb2xsb3dpbmc6ICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJDT0RFXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IGZhbHNlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyNzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJzZWVfbGlnaHRcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiSWYgSSBzZWUgYSBkaWZmZXJlbmNlIGluIGxpZ2h0IHRoYXQgaXMgYmlnZ2VyIHRoYW4gJTEgcGVyY2VudCwgdGhlbiBJIHdpbGwgLi4uICUyICUzXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX251bWJlclwiLFxuICAgICAgICBcIm5hbWVcIjogXCJUSFJFU0hPTERcIixcbiAgICAgICAgXCJ2YWx1ZVwiOiAwLFxuICAgICAgICBcIm1pblwiOiAwLFxuICAgICAgICBcIm1heFwiOiAxMDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJDT0RFXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyNzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfVxuXSk7XG5cbndpbmRvdy5CbG9ja2x5LkJsb2Nrc1snZXZlcnlfdGltZSddID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGVuZER1bW15SW5wdXQoKVxuICAgICAgICAuYXBwZW5kRmllbGQoXCJUaGlzIGlzIGhvdyBJIHByb2Nlc3MgdGhlIGxpZ2h0OlwiKTtcbiAgICB0aGlzLmFwcGVuZFN0YXRlbWVudElucHV0KFwiQ09ERVwiKVxuICAgICAgICAuc2V0Q2hlY2sobnVsbCk7XG4gICAgdGhpcy5zZXRJbnB1dHNJbmxpbmUoZmFsc2UpO1xuICAgIHRoaXMuc2V0Q29sb3VyKDIzMCk7XG4gICAgdGhpcy5zZXREZWxldGFibGUoZmFsc2UpO1xuIHRoaXMuc2V0VG9vbHRpcChcIlwiKTtcbiB0aGlzLnNldEhlbHBVcmwoXCJcIik7XG4gIH1cbn07XG5cbi8vIFFVQU5USVRJRVMgQU5EIE1BR05JVFVERVNcbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ21vZGlmaWVyX3JhbmQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBxdWFudGl0eSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQudmFsdWVUb0NvZGUoYmxvY2ssJ1FVQU5UJyx3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkUpO1xuICB2YXIgcmFuZG9tQ29lZmYgPSAwLjE7XG4gIHZhciByYW5kb21GYWN0b3IgPSAnMSArIFstMSwxXVtNYXRoLnJhbmRvbSgpKjJ8MF0qTWF0aC5yYW5kb20oKSAqJyArIHJhbmRvbUNvZWZmO1xuICB2YXIgY29kZSA9IHJhbmRvbUZhY3RvciAgKyAnKicgKyBxdWFudGl0eTtcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbnRfcHJvcF8xc2Vuc29yJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZmFjdG9yID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRkFDVE9SJyk7XG5cbiAgdmFyIHByb3BfdG8gPSBudWxsO1xuICBzd2l0Y2ggKGZhY3Rvcikge1xuICAgIGNhc2UgXCJMSUdIVF9ESUZGXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5kaWZmTm93VG9BZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMSUdIVF9OT1dcIjpcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmN1cnJlbnRMZXZlbFswXSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfQVZHXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5hZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICB9XG4gIHZhciBjb2RlID0gcHJvcF90bztcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbnRfcHJvcF8yc2Vuc29ycyddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGZhY3RvciA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0ZBQ1RPUicpO1xuXG4gIHZhciBwcm9wX3RvID0gMDtcbiAgc3dpdGNoIChmYWN0b3IpIHtcbiAgICBjYXNlIFwiTElHSFRfRElGRlwiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uZGlmZk5vd1RvQWRhcHRMZXZlbCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfUklHSFRcIjogLy8geSA9IC0xXG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5jdXJyZW50TGV2ZWxbRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueSA8IDAgPyAwIDogMV0nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxpR0hUX0xFRlRcIjogLy8geSA9IDFcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmN1cnJlbnRMZXZlbFtFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55ID4gMCA/IDAgOiAxXSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfQVZHXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5hZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICB9XG4gIHZhciBjb2RlID0gcHJvcF90bztcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbF9hYnNvbHV0ZSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIG1hZ25pdHVkZSA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ01BR05JVFVERScpO1xuICAvLyBUaGUgbWFnbml0dWRlcyBnZXQgdHJhbnNsYXRlZCBpbiBwZXJjZW50YWdlcyBvZiB0aGUgY29ycmVzcG9uZGluZyBjb3JlIHZhbHVlcyAoZndfc3BlZWQsIHJvbGxfc3BlZWQsIHJlYWN0aW9uX3N0cmVuZ3RoKVxuICAvLyBvciBvZiB2YWx1ZXMgZGVmaW5lZCBmb3IgZWFjaCB0eXBlIG9mIHJlYWN0aW9uXG4gIHZhciBwZXJjZW50YWdlID0gMDtcbiAgc3dpdGNoIChtYWduaXR1ZGUpIHtcbiAgICBjYXNlIFwiVkVSWV9TTUFMTFwiOlxuICAgICAgcGVyY2VudGFnZSA9IDAuMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJTTUFMTFwiOlxuICAgICAgcGVyY2VudGFnZSA9IDAuNDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJNRURJVU1cIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAwLjc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTEFSR0VcIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAxLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVkVSWV9MQVJHRVwiOlxuICAgICAgcGVyY2VudGFnZSA9IDEuMztcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGNvZGUgPSAnJyArIHBlcmNlbnRhZ2U7XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ21hdGhfbnVtYmVyJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgbnVtYmVyID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnTlVNJyk7XG4gIHZhciBjb2RlID0gbnVtYmVyO1xuICByZXR1cm4gW2NvZGUsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORV07XG59O1xuXG4vLyBBQ1RJT05TIEFORCBCRUhBVklPUlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ2ZvcndhcmRfc3BlZWQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBzcGVlZCA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ1NQRUVEJyk7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9ja2dldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuXG4gIHZhciBhZGRzdWJzdHJhY3QgPSAwO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkZBU1RFUlwiOlxuICAgICAgYWRkc3Vic3RyYWN0ID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJTTE9XRVJcIjpcbiAgICAgIGFkZHN1YnRyYWN0ID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuICB2YXIgY29kZSA9ICdmd19zcGVlZCArPScgKyBhZGRzdWJ0cmFjdCArICcqJyArIHNwZWVkICsgJy8gMTAwICogZndfc3BlZWQ7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydyb2xsX3NwZWVkJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3BlZWQgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdTUEVFRCcpO1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2tnZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcblxuICB2YXIgYWRkc3Vic3RyYWN0ID0gMDtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJGQVNURVJcIjpcbiAgICAgIGFkZHN1YnN0cmFjdCA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiU0xPV0VSXCI6XG4gICAgICBhZGRzdWJ0cmFjdCA9IC0xO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICdyb2xsX3NwZWVkICs9JyArIGFkZHN1YnRyYWN0ICsgJyonICsgc3BlZWQgKyAnLyAxMDAgKiByb2xsX3NwZWVkOyc7XG4gIHJldHVybiBjb2RlO1xufTtcblxuQmxvY2tseS5KYXZhU2NyaXB0WydzdG9wX2ZvcndhcmQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBjb2RlID0gJ2Z3X3NwZWVkID0gMDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsnc3RvcF9yb2xsaW5nJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9ICdyb2xsX3NwZWVkID0gMDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9yYW5kb21seSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHZhbHVlX21hZ25pdHVkZSA9IEJsb2NrbHkuSmF2YVNjcmlwdC52YWx1ZVRvQ29kZShibG9jaywgJ01BR05JVFVERScsIEJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FKTtcbiAgdmFyIGNvZGUgPSAnZGVsdGFfeWF3ICs9JyArIHZhbHVlX21hZ25pdHVkZSArICcgKiBbLTEsMV1bTWF0aC5yYW5kb20oKSoyfDBdKk1hdGgucmFuZG9tKCkgKiBjb25maWcucmVzZXRSYW5kb20gKiBkVDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3R1cm5fbHInXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcbiAgdmFyIG1hZ25pdHVkZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQudmFsdWVUb0NvZGUoYmxvY2ssJ01BR05JVFVERScsd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FKTtcblxuICAvLyBMRUZUIGRpcmVjdGlvbiBpcyBpbiBwb3NpdGl2ZSBsb2NhbCB5LWRpcmVjdGlvbiwgaXJyZXNwZWN0aXZlIG9mIHNlbnNvciBsb2NhdGlvbi5cbiAgLy8gUklHSFQgZGlyZWN0aW9uIGlzIGluIG5lZ2F0aXZlIGxvY2FsIHktZGlyZWN0aW9uLCBpcnJlc3BlY3RpdmUgb2Ygc2Vuc29yIGxvY2F0aW9uLlxuICB2YXIgY29kZSA9ICcnO1xuXG4gIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkxFRlRcIjogLy8gU2V0IGNvZWZmaWNpZW50IHN1Y2ggdGhhdCB3aGVuIGV5ZSBpcyBvbiAoMSwxKSBpbiBwb3NpdGl2ZSB5LWRpcmVjdGlvbiwgbGVmdCBpcyB0b3dhcmRzIHRoZSBsaWdodFxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gLTE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiUklHSFRcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJyc7XG4gIHZhciBUVVJOX01BWCA9IDI7XG4gIGNvZGUgKz0gJ3ZhciBsaWdodERpZmYgPSAwOyc7XG4gIGlmIChTdHJpbmcobWFnbml0dWRlKS5tYXRjaChcImxpZ2h0SW5mb1wiKSkge1xuICAgIGlmIChTdHJpbmcobWFnbml0dWRlKS5tYXRjaChcImRpZmZOb3dUb0FkYXB0TGV2ZWxcIikpIHtcbiAgICAgIGNvZGUgKz0gJ2xpZ2h0RGlmZiA9IG9ubHlQb3NpdGl2ZUxpZ2h0Q2hhbmdlICYmIGxpZ2h0SW5mby5kaWZmTm93VG9BZGFwdExldmVsIDwgMCA/IDAgOicgKyBtYWduaXR1ZGUgKyAnOyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvZGUgKz0gJ2xpZ2h0RGlmZiA9JyArIG1hZ25pdHVkZSArICc7JztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29kZSArPSAnbGlnaHREaWZmID0nICsgbWFnbml0dWRlICsgJyogRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsnO1xuICAgIC8vIGxpZ2h0RGlmZiA9IG1hZ25pdHVkZSAqIFRVUk5fTUFYO1xuICB9XG5cbiAgY29kZSArPSAnZGVsdGFfeWF3ICs9ICcgKyBmbGlwUm90YXRpb25EaXIgKyAnKiBNYXRoLmFicyhFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoICogbGlnaHREaWZmKSAqIGRUOyc7XG5cbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wyd0dXJuX2F0XzFzZW5zb3InXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcbiAgdmFyIG9iamVjdCA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ09CSkVDVCcpO1xuICB2YXIgbWFnbml0dWRlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC52YWx1ZVRvQ29kZShibG9jaywnTUFHTklUVURFJyx3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkUpO1xuXG4gIC8qXG4gIEluIGRpcmVjdGlvbiBvZiB0aGUgc2Vuc29yOiBXaGVyZSB0aGUgc2Vuc29yIGlzIHBvaW50aW5nIHRvLCBpZiB0aGUgZmllbGQgaXMgc21hbGxlciB0aGFuIDIqUEksIE9SIHdoZXJlIHRoZSBzZW5zb3IgaXMgbG9jYXRlZCBJRiBOT1QgeV9zZW5zb3IgPSAwXG4gIEluIGRpcmVjdGlvbiBvZiB0aGUgZXllc3BvdDogSUYgVEhFUkUgSVMgQU4gRVlFU1BPVCwgdGhlbiBpbiB0aGUgZGlyZWN0aW9uIHRoYXQgaXQgaXMgbG9jYXRlZCBhdC5cbiAgVGhlIGRlY2lkaW5nIGZhY3RvciBpcyB0aGUgeSBjb29yZGluYXRlIG9mIHRoZSBzZW5zb3Igb3JpZW50YXRpb24sIHBvc2l0aW9uIG9yIG9mIHRoZSBleWVzcG90IHBvc2l0aW9uOlxuICAtIHkgPSAwOiBXZSBoYXZlIG5vIHNldCBkaXJlY3Rpb24uXG4gIC0geSA+IDA6IGNvdW50ZXItY2xvY2t3aXNlIGRpcmVjdGlvbiAoaS5lLiBwb3NpdGl2ZSBhbmdsZXMpXG4gIC0geSA8IDA6IGNsb2Nrd2lzZSBkaXJlY3Rpb24gKGkuZS4gbmVnYXRpdmUgYW5nbGVzKVxuXG4gIElmIGRpcmVjdGlvbiBpcyBcIlRPV0FSRFNcIiwgdGhlbiB0aGUgZmxpcFJvdGF0aW9uRGlyIGlzIHBvc2l0aXZlLCBhbmQgbmVnYXRpdmUgb3RoZXJ3aXNlLlxuICAqL1xuIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkFXQVlcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IC0xO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlRPV0FSRFNcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJyc7XG5cbiAgaWYgKG9iamVjdCA9PSAnU0VOU09SJykge1xuICAgIGNvZGUgKz0gJ3ZhciByb3RhdGlvbkRpciA9IDA7IFxcXG4gICAgaWYgKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aCkgeyBcXFxuICAgICAgaWYgKEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLmZpZWxkID09IDIqTWF0aC5QSSkgeyBcXFxuICAgICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLnBvc2l0aW9uLnk7IFxcXG4gICAgICB9IGVsc2UgeyBcXFxuICAgICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLm9yaWVudGF0aW9uLnk7IFxcXG4gICAgICB9IH0nO1xuICB9IGVsc2UgaWYgKG9iamVjdCA9PSAnU1BPVCcpIHtcbiAgICBjb2RlICs9ICd2YXIgcm90YXRpb25EaXIgPSAwOyBcXFxuICAgIGlmIChFdWdCb2R5LnNwb3RQb3NpdGlvbnMubGVuZ3RoPT0xKSB7IFxcXG4gICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkuc3BvdFBvc2l0aW9uc1swXS55OyB9JztcbiAgfVxuXG4gIHZhciBUVVJOX01BWCA9IDI7XG4gIGNvZGUgKz0gJ3ZhciBsaWdodERpZmYgPSAwOyc7XG4gIGlmIChTdHJpbmcobWFnbml0dWRlKS5tYXRjaChcImxpZ2h0SW5mb1wiKSkge1xuICAgIGlmIChTdHJpbmcobWFnbml0dWRlKS5tYXRjaChcImRpZmZOb3dUb0FkYXB0TGV2ZWxcIikpIHtcbiAgICAgIGNvZGUgKz0gJ2xpZ2h0RGlmZiA9IG9ubHlQb3NpdGl2ZUxpZ2h0Q2hhbmdlICYmIGxpZ2h0SW5mby5kaWZmTm93VG9BZGFwdExldmVsIDwgMCA/IDAgOicgKyBtYWduaXR1ZGUgKyAnOyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvZGUgKz0gJ2xpZ2h0RGlmZiA9JyArIG1hZ25pdHVkZSArICc7JztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29kZSArPSAnbGlnaHREaWZmID0nICsgbWFnbml0dWRlICsgJyogRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsnO1xuICAgIC8vIGxpZ2h0RGlmZiA9IG1hZ25pdHVkZSAqIFRVUk5fTUFYO1xuICB9XG5cbiAgY29kZSArPSAnZGVsdGFfeWF3ICs9IHJvdGF0aW9uRGlyIConICsgIGZsaXBSb3RhdGlvbkRpciArICcqIE1hdGguYWJzKEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGggKiBsaWdodERpZmYpICogZFQ7JztcblxuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3R1cm5fYXRfMnNlbnNvcnMnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcbiAgdmFyIG9iamVjdCA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ09CSkVDVCcpO1xuICB2YXIgbWFnbml0dWRlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC52YWx1ZVRvQ29kZShibG9jaywnTUFHTklUVURFJyx3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkUpO1xuXG4gIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkFXQVlcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IC0xO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlRPV0FSRFNcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJ3ZhciByb3RhdGlvbkRpciA9IDA7JztcblxuICBpZiAob2JqZWN0ID09ICdXRUFLRVInKSB7XG4gICAgY29kZSArPSAncm90YXRpb25EaXIgPSAoc2Vuc29ySW50ZW5zaXRpZXNbMV0gLSBzZW5zb3JJbnRlbnNpdGllc1swXSkgPj0gMCA/IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzFdLnBvc2l0aW9uLnkgOiBFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55Oyc7XG4gIH0gZWxzZSBpZiAob2JqZWN0ID09ICdTVFJPTkdFUicpIHtcbiAgICBjb2RlICs9ICdyb3RhdGlvbkRpciA9IChzZW5zb3JJbnRlbnNpdGllc1sxXSAtIHNlbnNvckludGVuc2l0aWVzWzBdKSA8IDAgPyBFdWdCb2R5LmxpZ2h0U2Vuc29yc1sxXS5wb3NpdGlvbi55IDogRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueTsnO1xuICB9XG5cbiAgdmFyIFRVUk5fTUFYID0gMjtcbiAgY29kZSArPSAndmFyIGxpZ2h0RGlmZiA9IDA7JztcbiAgaWYgKFN0cmluZyhtYWduaXR1ZGUpLm1hdGNoKFwibGlnaHRJbmZvXCIpKSB7XG4gICAgaWYgKFN0cmluZyhtYWduaXR1ZGUpLm1hdGNoKFwiZGlmZk5vd1RvQWRhcHRMZXZlbFwiKSkge1xuICAgICAgY29kZSArPSAnbGlnaHREaWZmID0gb25seVBvc2l0aXZlTGlnaHRDaGFuZ2UgJiYgbGlnaHRJbmZvLmRpZmZOb3dUb0FkYXB0TGV2ZWwgPCAwID8gMCA6JyArIG1hZ25pdHVkZSArICc7JztcbiAgICB9IGVsc2Uge1xuICAgICAgY29kZSArPSAnbGlnaHREaWZmID0nICsgbWFnbml0dWRlICsgJzsnO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb2RlICs9ICdsaWdodERpZmYgPScgKyBtYWduaXR1ZGUgKyAnKiBFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoOyc7XG4gICAgLy8gbGlnaHREaWZmID0gbWFnbml0dWRlICogVFVSTl9NQVg7XG4gIH1cblxuICBjb2RlICs9ICdkZWx0YV95YXcgKz0gcm90YXRpb25EaXIgKicgKyAgZmxpcFJvdGF0aW9uRGlyICsgJyogTWF0aC5hYnMoRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aCAqIGxpZ2h0RGlmZikgKiBkVDsnO1xuXG4gIHJldHVybiBjb2RlO1xufTtcblxuXG4vLyBDT05ESVRJT05TICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydldmVyeV90aW1lJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgYWxsX2NvZGUgPSBCbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSBhbGxfY29kZTtcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydzZWVfbGlnaHQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciB0aHJlc2hvbGRfcGVyY2VudGFnZSA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ1RIUkVTSE9MRCcpO1xuICB2YXIgc3RhdGVtZW50c19jb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdDT0RFJyk7XG4gIC8vIEFsdGVybmF0aXZlbHksIHVzZSB0aGUgdGhyZXNob2xkIEV1Z0JvZHkuZGVmYXVsdHMuc2Vuc2l0aXZpdHlfdGhyZXNob2xkXG4gIHZhciBjb2RlID0gJ2lmICgoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoPjEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmRpZmZCdHdTZW5zb3JzKSA+ICcgKyB0aHJlc2hvbGRfcGVyY2VudGFnZSArICcvIDEwMCkgfHwgXFxcbiAgICAgICAgICAgICAoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoID09IDEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmRpZmZOb3dUb0FkYXB0TGV2ZWwpID4nICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApKSB7JyArIHN0YXRlbWVudHNfY29kZSArICd9JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuIl19
