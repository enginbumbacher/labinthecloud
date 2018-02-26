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
  "colour": 180,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "qual_absolute",
  "message0": "%1",
  "args0": [{
    "type": "field_dropdown",
    "name": "MAGNITUDE",
    "options": [["a small amount", "SMALL"], ["a medium amount", "MEDIUM"], ["a large amount", "LARGE"]]
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
  "colour": 180,
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
  "colour": 180,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "twistflap",
  "message0": "Twist or flap at normal speed",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "stop_forward",
  "message0": "Stop moving forward",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "stop_rolling",
  "message0": "Stop rotating around axis",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_randomly",
  "message0": "Change direction randomly by %1 %2",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "field_dropdown",
    "name": "MAGNITUDE",
    "options": [["a small amount", "SMALL"], ["a medium amount", "MEDIUM"], ["a large amount", "LARGE"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "forward_speed",
  "message0": "Twist or flap %1 by %2",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["faster", "FASTER"], ["slower", "SLOWER"]]
  }, {
    "type": "field_dropdown",
    "name": "SPEED",
    "options": [["25 percent", "CHANGE_25"], ["50 percent", "CHANGE_50"], ["75 percent", "CHANGE_75"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
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
    "precision": 25
  }, {
    "type": "input_dummy"
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "Test",
  "helpUrl": ""
}, { "type": "turn_lr",
  "message0": "Paddle towards the %1",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["left", "LEFT"], ["right", "RIGHT"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_at_1sensor",
  "message0": "Paddle %1 the sensor",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["away from", "AWAY"], ["towards", "TOWARDS"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_at_1sensor_eyespot",
  "message0": "Paddle %1 %2",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["away from the", "AWAY"], ["towards the", "TOWARDS"]]
  }, {
    "type": "field_dropdown",
    "name": "OBJECT",
    "options": [["sensor", "SENSOR"], ["eyespot", "SPOT"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_at_2sensors",
  "message0": "Paddle %1 %2 sensor that detects more light",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["away from the", "AWAY"], ["towards the", "TOWARDS"]]
  }, {
    "type": "input_dummy"
  }],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "see_light_quantity",
  "message0": "If there is a %1 light signal, do: %2 %3",
  "args0": [{
    "type": "field_dropdown",
    "name": "THRESHOLD",
    "options": [["small", "THRESH_20"], ["medium", "THRESH_40"], ["large", "THRESH_60"]]
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

window.Blockly.Blocks['master_block'] = {
  init: function init() {
    this.appendDummyInput().appendField("Put all the programming blocks in here:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setColour(230);
    this.setDeletable(false);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

window.Blockly.Blocks['see_light'] = {
  init: function init() {
    this.appendDummyInput().appendField("If there is a light signal, do:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setDeletable(false);
    this.setMovable(false);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

window.Blockly.Blocks['no_light'] = {
  init: function init() {
    this.appendDummyInput().appendField("If there is no light signal, do:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setDeletable(false);
    this.setMovable(false);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

window.Blockly.Blocks['either_way'] = {
  init: function init() {
    this.appendDummyInput().appendField("With or without a light signal, do:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setDeletable(false);
    this.setMovable(false);
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
  var direction = block.getFieldValue('DIRECTION');

  var addsubstract = 0;
  switch (direction) {
    case "FASTER":
      addsubstract = 1;
      break;
    case "SLOWER":
      addsubstract = -1;
      break;
  }
  var code = 'fw_speed +=' + addsubstract + '*' + speed.split('_')[1] + '/ 100 * fw_speed;';
  return code;
};

window.Blockly.JavaScript['roll_speed'] = function (block) {
  var speed = block.getFieldValue('SPEED');
  var direction = block.getFieldValue('DIRECTION');

  var addsubstract = 0;
  switch (direction) {
    case "FASTER":
      addsubstract = 1;
      break;
    case "SLOWER":
      addsubstract = -1;
      break;
  }

  var code = 'roll_speed +=' + addsubstract + '*' + speed + '/ 100 * roll_speed;';
  return code;
};

Blockly.JavaScript['stop_forward'] = function (block) {
  var code = 'fw_speed = 0;';
  return code;
};

Blockly.JavaScript['twistflap'] = function (block) {
  var code = 'fw_speed = EugBody.fw_speed;';
  code += 'roll_speed = EugBody.roll_speed;';
  return code;
};

Blockly.JavaScript['stop_rolling'] = function (block) {
  var code = 'roll_speed = 0;';
  return code;
};

Blockly.JavaScript['turn_randomly'] = function (block) {
  //var value_magnitude = Blockly.JavaScript.valueToCode(block, 'MAGNITUDE', Blockly.JavaScript.ORDER_NONE);
  var magnitude = block.getFieldValue('MAGNITUDE');
  // The magnitudes get translated in percentages of the corresponding core values (fw_speed, roll_speed, reaction_strength)
  // or of values defined for each type of reaction
  var value_magnitude = 0;
  switch (magnitude) {
    case "VERY_SMALL":
      value_magnitude = 0.1;
      break;
    case "SMALL":
      value_magnitude = 0.4;
      break;
    case "MEDIUM":
      value_magnitude = 0.7;
      break;
    case "LARGE":
      value_magnitude = 1.0;
      break;
    case "VERY_LARGE":
      value_magnitude = 1.3;
      break;
  }

  var code = 'delta_yaw +=' + value_magnitude + ' * [-1,1][Math.random()*2|0]*Math.random() * config.resetRandom * dT;';
  return code;
};

window.Blockly.JavaScript['turn_lr'] = function (block) {
  var direction = block.getFieldValue('DIRECTION');

  // LEFT direction is in positive local y-direction, irrespective of sensor location.
  // RIGHT direction is in negative local y-direction, irrespective of sensor location.
  var code = '';

  var flipRotationDir = 1;
  switch (direction) {
    case "LEFT":
      // Set coefficient such that when eye is on (1,1) in positive y-direction, left is towards the light
      flipRotationDir = 1;
      break;
    case "RIGHT":
      flipRotationDir = -1;
      break;
  }

  var code = '';
  var TURN_MAX = 2;
  code += 'var lightDiff =' + 'calcIntensity' + '* EugBody.reaction_strength;'; // RIGHT NOW THIS IS WRITTEN FOR 1 EYE. REWRITE TO ADAPT.

  code += 'delta_yaw += ' + flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};

window.Blockly.JavaScript['turn_at_1sensor'] = function (block) {
  var direction = block.getFieldValue('DIRECTION');

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
      flipRotationDir = 1;
      break;
    case "TOWARDS":
      flipRotationDir = -1;
      break;
  }

  var code = 'var rotationDir = 0; \
    if (EugBody.lightSensors.length) { \
      if (EugBody.lightSensors[0].field == 2*Math.PI) { \
        rotationDir = EugBody.lightSensors[0].position.y; \
      } else { \
        rotationDir = EugBody.lightSensors[0].orientation.y; \
      } }';

  var TURN_MAX = 2;
  code += 'var lightDiff =' + 'calcIntensity' + '* EugBody.reaction_strength;';
  code += 'delta_yaw += rotationDir *' + flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};

window.Blockly.JavaScript['turn_at_1sensor_eyespot'] = function (block) {
  var direction = block.getFieldValue('DIRECTION');
  var object = block.getFieldValue('OBJECT');

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
      flipRotationDir = 1;
      break;
    case "TOWARDS":
      flipRotationDir = -1;
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
  code += 'var lightDiff =' + 'calcIntensity' + '* EugBody.reaction_strength;';
  code += 'delta_yaw += rotationDir *' + flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};

window.Blockly.JavaScript['turn_at_2sensors'] = function (block) {
  var direction = block.getFieldValue('DIRECTION');

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

  code += 'rotationDir = (sensorIntensities[1] - sensorIntensities[0]) < 0 ? EugBody.lightSensors[1].position.y : EugBody.lightSensors[0].position.y;';

  var TURN_MAX = 2;
  code += 'var lightDiff =' + 'calcIntensity' + '* EugBody.reaction_strength;';
  code += 'delta_yaw += rotationDir *' + flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};

// CONDITIONS ************************************************

window.Blockly.JavaScript['master_block'] = function (block) {
  var defaultCode = "var calcIntensity = (EugBody.lightSensors.length>1) ? lightInfo.diffBtwSensors : lightInfo.currentLevel[0];"; // HERE WRITE THE CORE LIGHT - 1 EYE OR 2 EYES. THIS CAN THEN BE MODIFIED WITH THE DROP-DOWN! - WRITE ALL OTHER CODE SUCH THAT IT TAKES THIS LIGHT MEASURE.
  var all_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = defaultCode + all_code;
  return code;
};

window.Blockly.JavaScript['see_light_quantity'] = function (block) {
  var threshold_percentage = block.getFieldValue('THRESHOLD');
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  threshold_percentage = threshold_percentage.split('_')[1];
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) > ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.diffNowToAdaptLevel) >' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};

window.Blockly.JavaScript['see_light'] = function (block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  var threshold_percentage = 0.1;
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) > ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.diffNowToAdaptLevel) >' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};

window.Blockly.JavaScript['no_light'] = function (block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var threshold_percentage = 0.2;
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) < ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.diffNowToAdaptLevel) <' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};

window.Blockly.JavaScript['either_way'] = function (block) {
  var code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  return code;
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kZWxpbmdfYmxvY2tzLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIkJsb2NrbHkiLCJkZWZpbmVCbG9ja3NXaXRoSnNvbkFycmF5IiwiQmxvY2tzIiwiaW5pdCIsImFwcGVuZER1bW15SW5wdXQiLCJhcHBlbmRGaWVsZCIsImFwcGVuZFN0YXRlbWVudElucHV0Iiwic2V0Q2hlY2siLCJzZXRJbnB1dHNJbmxpbmUiLCJzZXRDb2xvdXIiLCJzZXREZWxldGFibGUiLCJzZXRUb29sdGlwIiwic2V0SGVscFVybCIsInNldFByZXZpb3VzU3RhdGVtZW50Iiwic2V0TmV4dFN0YXRlbWVudCIsInNldE1vdmFibGUiLCJKYXZhU2NyaXB0IiwiYmxvY2siLCJxdWFudGl0eSIsInZhbHVlVG9Db2RlIiwiT1JERVJfTk9ORSIsInJhbmRvbUNvZWZmIiwicmFuZG9tRmFjdG9yIiwiY29kZSIsImZhY3RvciIsImdldEZpZWxkVmFsdWUiLCJwcm9wX3RvIiwibWFnbml0dWRlIiwicGVyY2VudGFnZSIsIm51bWJlciIsInNwZWVkIiwiZGlyZWN0aW9uIiwiYWRkc3Vic3RyYWN0Iiwic3BsaXQiLCJ2YWx1ZV9tYWduaXR1ZGUiLCJmbGlwUm90YXRpb25EaXIiLCJUVVJOX01BWCIsIm9iamVjdCIsImRlZmF1bHRDb2RlIiwiYWxsX2NvZGUiLCJzdGF0ZW1lbnRUb0NvZGUiLCJ0aHJlc2hvbGRfcGVyY2VudGFnZSIsInN0YXRlbWVudHNfY29kZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxDQUFlQyx5QkFBZixDQUF5QyxDQUN2QyxFQUFFLFFBQVEsZUFBVjtBQUNFLGNBQVksb0JBRGQ7QUFFRSxXQUFTLENBQ1A7QUFDRSxZQUFRO0FBRFYsR0FETyxFQUlQO0FBQ0UsWUFBUSxhQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsYUFBUyxDQUNQLFFBRE8sRUFFUCxRQUZPLEVBR1AsZUFITyxFQUlQLGVBSk8sRUFLUCxv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b2NrbHkvbW9kZWxpbmdfYmxvY2tzLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93LkJsb2NrbHkuZGVmaW5lQmxvY2tzV2l0aEpzb25BcnJheShbXG4gIHsgXCJ0eXBlXCI6IFwibW9kaWZpZXJfcmFuZFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJtb3JlIG9yIGxlc3MgJTEgJTJcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfdmFsdWVcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiUVVBTlRcIixcbiAgICAgICAgXCJjaGVja1wiOiBbXG4gICAgICAgICAgXCJOdW1iZXJcIixcbiAgICAgICAgICBcIlN0cmluZ1wiLFxuICAgICAgICAgIFwibW9kaWZpZXJfcHJvYlwiLFxuICAgICAgICAgIFwibW9kaWZpZXJfcmFuZFwiLFxuICAgICAgICAgIFwicXVhbnRfcHJvcF8xc2Vuc29yXCIsXG4gICAgICAgICAgXCJxdWFudF9wcm9wXzJzZW5zb3JzXCJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcIm91dHB1dFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDE4MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInF1YWxfYWJzb2x1dGVcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiTUFHTklUVURFXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIHNtYWxsIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJTTUFMTFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImEgbWVkaXVtIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJNRURJVU1cIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIGxhcmdlIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJMQVJHRVwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcIm91dHB1dFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDE4MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInF1YW50X3Byb3BfMXNlbnNvclwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJhbW91bnQgcHJvcC4gdG8gJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRkFDVE9SXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJkaWZmIGluIGxpZ2h0IHNlZW4gbm93IHZzIGJlZm9yZVwiLFxuICAgICAgICAgICAgXCJMSUdIVF9ESUZGXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwibGlnaHQgc2VlbiBub3dcIixcbiAgICAgICAgICAgIFwiTElHSFRfTk9XXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZ2VuZXJhbCBsZXZlbCBvZiBicmlnaHRuZXNzXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0FWR1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwib3V0cHV0XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMTgwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwicXVhbnRfcHJvcF8yc2Vuc29yc1wiLFxuICAgIFwibWVzc2FnZTBcIjogXCJhbW91bnQgcHJvcG9ydGlvbmFsIHRvIHRoZSAlMVwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJGQUNUT1JcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImRpZmZlcmVuY2UgYmV0d2VlbiBsZWZ0IGFuZCByaWdodCBzZW5zb3JzXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0RJRkZcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJwZXJjZWl2ZWQgbGlnaHQgb2YgcmlnaHQgc2Vuc29yXCIsXG4gICAgICAgICAgICBcIkxJR0hUX1JJR0hUXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwicGVyY2VpdmVkIGxpZ2h0IG9mIGxlZnQgc2Vuc29yXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0xFRlRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJnZW5lcmFsIGxldmVsIG9mIGJyaWdodG5lc3NcIixcbiAgICAgICAgICAgIFwiTElHSFRfQVZHXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxODAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJ0d2lzdGZsYXBcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiVHdpc3Qgb3IgZmxhcCBhdCBub3JtYWwgc3BlZWRcIixcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInN0b3BfZm9yd2FyZFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJTdG9wIG1vdmluZyBmb3J3YXJkXCIsXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJzdG9wX3JvbGxpbmdcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiU3RvcCByb3RhdGluZyBhcm91bmQgYXhpc1wiLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9yYW5kb21seVwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJDaGFuZ2UgZGlyZWN0aW9uIHJhbmRvbWx5IGJ5ICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBzbWFsbCBhbW91bnRcIixcbiAgICAgICAgICAgIFwiU01BTExcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIG1lZGl1bSBhbW91bnRcIixcbiAgICAgICAgICAgIFwiTUVESVVNXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBsYXJnZSBhbW91bnRcIixcbiAgICAgICAgICAgIFwiTEFSR0VcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJmb3J3YXJkX3NwZWVkXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlR3aXN0IG9yIGZsYXAgJTEgYnkgJTJcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJmYXN0ZXJcIixcbiAgICAgICAgICAgIFwiRkFTVEVSXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwic2xvd2VyXCIsXG4gICAgICAgICAgICBcIlNMT1dFUlwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJTUEVFRFwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiMjUgcGVyY2VudFwiLFxuICAgICAgICAgICAgXCJDSEFOR0VfMjVcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCI1MCBwZXJjZW50XCIsXG4gICAgICAgICAgICBcIkNIQU5HRV81MFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIjc1IHBlcmNlbnRcIixcbiAgICAgICAgICAgIFwiQ0hBTkdFXzc1XCJcbiAgICAgICAgICBdLFxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJUZXN0XCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJyb2xsX3NwZWVkXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlJvdGF0ZSAlMSBieSAlMiAlMyBwZXJjZW50XCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZmFzdGVyXCIsXG4gICAgICAgICAgICBcIkZBU1RFUlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNsb3dlclwiLFxuICAgICAgICAgICAgXCJTTE9XRVJcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfbnVtYmVyXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlNQRUVEXCIsXG4gICAgICAgIFwidmFsdWVcIjogMCxcbiAgICAgICAgXCJtaW5cIjogMCxcbiAgICAgICAgXCJtYXhcIjogMTAwLFxuICAgICAgICBcInByZWNpc2lvblwiOiAyNVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVzdFwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9sclwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJQYWRkbGUgdG93YXJkcyB0aGUgJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJsZWZ0XCIsXG4gICAgICAgICAgICBcIkxFRlRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJyaWdodFwiLFxuICAgICAgICAgICAgXCJSSUdIVFwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInR1cm5fYXRfMXNlbnNvclwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJQYWRkbGUgJTEgdGhlIHNlbnNvclwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJESVJFQ1RJT05cIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImF3YXkgZnJvbVwiLFxuICAgICAgICAgICAgXCJBV0FZXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwidG93YXJkc1wiLFxuICAgICAgICAgICAgXCJUT1dBUkRTXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1dLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9hdF8xc2Vuc29yX2V5ZXNwb3RcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiUGFkZGxlICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYXdheSBmcm9tIHRoZVwiLFxuICAgICAgICAgICAgXCJBV0FZXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwidG93YXJkcyB0aGVcIixcbiAgICAgICAgICAgIFwiVE9XQVJEU1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJPQkpFQ1RcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNlbnNvclwiLFxuICAgICAgICAgICAgXCJTRU5TT1JcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJleWVzcG90XCIsXG4gICAgICAgICAgICBcIlNQT1RcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfV0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJ0dXJuX2F0XzJzZW5zb3JzXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlBhZGRsZSAlMSAlMiBzZW5zb3IgdGhhdCBkZXRlY3RzIG1vcmUgbGlnaHRcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhd2F5IGZyb20gdGhlXCIsXG4gICAgICAgICAgICBcIkFXQVlcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJ0b3dhcmRzIHRoZVwiLFxuICAgICAgICAgICAgXCJUT1dBUkRTXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH1dLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IGZhbHNlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInNlZV9saWdodF9xdWFudGl0eVwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJJZiB0aGVyZSBpcyBhICUxIGxpZ2h0IHNpZ25hbCwgZG86ICUyICUzXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlRIUkVTSE9MRFwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwic21hbGxcIixcbiAgICAgICAgICAgIFwiVEhSRVNIXzIwXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwibWVkaXVtXCIsXG4gICAgICAgICAgICBcIlRIUkVTSF80MFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImxhcmdlXCIsXG4gICAgICAgICAgICBcIlRIUkVTSF82MFwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9zdGF0ZW1lbnRcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiQ09ERVwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMjcwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH1cbl0pO1xuXG53aW5kb3cuQmxvY2tseS5CbG9ja3NbJ21hc3Rlcl9ibG9jayddID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGVuZER1bW15SW5wdXQoKVxuICAgICAgICAuYXBwZW5kRmllbGQoXCJQdXQgYWxsIHRoZSBwcm9ncmFtbWluZyBibG9ja3MgaW4gaGVyZTpcIik7XG4gICAgdGhpcy5hcHBlbmRTdGF0ZW1lbnRJbnB1dChcIkNPREVcIilcbiAgICAgICAgLnNldENoZWNrKG51bGwpO1xuICAgIHRoaXMuc2V0SW5wdXRzSW5saW5lKGZhbHNlKTtcbiAgICB0aGlzLnNldENvbG91cigyMzApO1xuICAgIHRoaXMuc2V0RGVsZXRhYmxlKGZhbHNlKTtcbiB0aGlzLnNldFRvb2x0aXAoXCJcIik7XG4gdGhpcy5zZXRIZWxwVXJsKFwiXCIpO1xuICB9XG59O1xuXG53aW5kb3cuQmxvY2tseS5CbG9ja3NbJ3NlZV9saWdodCddID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGVuZER1bW15SW5wdXQoKVxuICAgICAgICAuYXBwZW5kRmllbGQoXCJJZiB0aGVyZSBpcyBhIGxpZ2h0IHNpZ25hbCwgZG86XCIpO1xuICAgIHRoaXMuYXBwZW5kU3RhdGVtZW50SW5wdXQoXCJDT0RFXCIpXG4gICAgICAgIC5zZXRDaGVjayhudWxsKTtcbiAgICB0aGlzLnNldElucHV0c0lubGluZShmYWxzZSk7XG4gICAgdGhpcy5zZXRQcmV2aW91c1N0YXRlbWVudCh0cnVlLG51bGwpO1xuICAgIHRoaXMuc2V0TmV4dFN0YXRlbWVudCh0cnVlLG51bGwpO1xuICAgIHRoaXMuc2V0Q29sb3VyKDI3MCk7XG4gICAgdGhpcy5zZXREZWxldGFibGUoZmFsc2UpO1xuICAgIHRoaXMuc2V0TW92YWJsZShmYWxzZSk7XG4gdGhpcy5zZXRUb29sdGlwKFwiXCIpO1xuIHRoaXMuc2V0SGVscFVybChcIlwiKTtcbiAgfVxufTtcblxud2luZG93LkJsb2NrbHkuQmxvY2tzWydub19saWdodCddID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGVuZER1bW15SW5wdXQoKVxuICAgICAgICAuYXBwZW5kRmllbGQoXCJJZiB0aGVyZSBpcyBubyBsaWdodCBzaWduYWwsIGRvOlwiKTtcbiAgICB0aGlzLmFwcGVuZFN0YXRlbWVudElucHV0KFwiQ09ERVwiKVxuICAgICAgICAuc2V0Q2hlY2sobnVsbCk7XG4gICAgdGhpcy5zZXRJbnB1dHNJbmxpbmUoZmFsc2UpO1xuICAgIHRoaXMuc2V0UHJldmlvdXNTdGF0ZW1lbnQodHJ1ZSxudWxsKTtcbiAgICB0aGlzLnNldE5leHRTdGF0ZW1lbnQodHJ1ZSxudWxsKTtcbiAgICB0aGlzLnNldENvbG91cigyNzApO1xuICAgIHRoaXMuc2V0RGVsZXRhYmxlKGZhbHNlKTtcbiAgICB0aGlzLnNldE1vdmFibGUoZmFsc2UpO1xuIHRoaXMuc2V0VG9vbHRpcChcIlwiKTtcbiB0aGlzLnNldEhlbHBVcmwoXCJcIik7XG4gIH1cbn07XG5cbndpbmRvdy5CbG9ja2x5LkJsb2Nrc1snZWl0aGVyX3dheSddID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGVuZER1bW15SW5wdXQoKVxuICAgICAgICAuYXBwZW5kRmllbGQoXCJXaXRoIG9yIHdpdGhvdXQgYSBsaWdodCBzaWduYWwsIGRvOlwiKTtcbiAgICB0aGlzLmFwcGVuZFN0YXRlbWVudElucHV0KFwiQ09ERVwiKVxuICAgICAgICAuc2V0Q2hlY2sobnVsbCk7XG4gICAgdGhpcy5zZXRJbnB1dHNJbmxpbmUoZmFsc2UpO1xuICAgIHRoaXMuc2V0UHJldmlvdXNTdGF0ZW1lbnQodHJ1ZSxudWxsKTtcbiAgICB0aGlzLnNldE5leHRTdGF0ZW1lbnQodHJ1ZSxudWxsKTtcbiAgICB0aGlzLnNldENvbG91cigyNzApO1xuICAgIHRoaXMuc2V0RGVsZXRhYmxlKGZhbHNlKTtcbiAgICB0aGlzLnNldE1vdmFibGUoZmFsc2UpO1xuIHRoaXMuc2V0VG9vbHRpcChcIlwiKTtcbiB0aGlzLnNldEhlbHBVcmwoXCJcIik7XG4gIH1cbn07XG5cblxuLy8gUVVBTlRJVElFUyBBTkQgTUFHTklUVURFU1xud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnbW9kaWZpZXJfcmFuZCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHF1YW50aXR5ID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC52YWx1ZVRvQ29kZShibG9jaywnUVVBTlQnLHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORSk7XG4gIHZhciByYW5kb21Db2VmZiA9IDAuMTtcbiAgdmFyIHJhbmRvbUZhY3RvciA9ICcxICsgWy0xLDFdW01hdGgucmFuZG9tKCkqMnwwXSpNYXRoLnJhbmRvbSgpIConICsgcmFuZG9tQ29lZmY7XG4gIHZhciBjb2RlID0gcmFuZG9tRmFjdG9yICArICcqJyArIHF1YW50aXR5O1xuICByZXR1cm4gW2NvZGUsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORV07XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydxdWFudF9wcm9wXzFzZW5zb3InXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBmYWN0b3IgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdGQUNUT1InKTtcblxuICB2YXIgcHJvcF90byA9IG51bGw7XG4gIHN3aXRjaCAoZmFjdG9yKSB7XG4gICAgY2FzZSBcIkxJR0hUX0RJRkZcIjpcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmRpZmZOb3dUb0FkYXB0TGV2ZWwnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxJR0hUX05PV1wiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uY3VycmVudExldmVsWzBdJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMSUdIVF9BVkdcIjpcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmFkYXB0TGV2ZWwnO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgdmFyIGNvZGUgPSBwcm9wX3RvO1xuICByZXR1cm4gW2NvZGUsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORV07XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydxdWFudF9wcm9wXzJzZW5zb3JzJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZmFjdG9yID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRkFDVE9SJyk7XG5cbiAgdmFyIHByb3BfdG8gPSAwO1xuICBzd2l0Y2ggKGZhY3Rvcikge1xuICAgIGNhc2UgXCJMSUdIVF9ESUZGXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5kaWZmTm93VG9BZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMSUdIVF9SSUdIVFwiOiAvLyB5ID0gLTFcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmN1cnJlbnRMZXZlbFtFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55IDwgMCA/IDAgOiAxXSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTGlHSFRfTEVGVFwiOiAvLyB5ID0gMVxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uY3VycmVudExldmVsW0V1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLnBvc2l0aW9uLnkgPiAwID8gMCA6IDFdJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMSUdIVF9BVkdcIjpcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmFkYXB0TGV2ZWwnO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgdmFyIGNvZGUgPSBwcm9wX3RvO1xuICByZXR1cm4gW2NvZGUsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORV07XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydxdWFsX2Fic29sdXRlJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgbWFnbml0dWRlID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnTUFHTklUVURFJyk7XG4gIC8vIFRoZSBtYWduaXR1ZGVzIGdldCB0cmFuc2xhdGVkIGluIHBlcmNlbnRhZ2VzIG9mIHRoZSBjb3JyZXNwb25kaW5nIGNvcmUgdmFsdWVzIChmd19zcGVlZCwgcm9sbF9zcGVlZCwgcmVhY3Rpb25fc3RyZW5ndGgpXG4gIC8vIG9yIG9mIHZhbHVlcyBkZWZpbmVkIGZvciBlYWNoIHR5cGUgb2YgcmVhY3Rpb25cbiAgdmFyIHBlcmNlbnRhZ2UgPSAwO1xuICBzd2l0Y2ggKG1hZ25pdHVkZSkge1xuICAgIGNhc2UgXCJWRVJZX1NNQUxMXCI6XG4gICAgICBwZXJjZW50YWdlID0gMC4xO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlNNQUxMXCI6XG4gICAgICBwZXJjZW50YWdlID0gMC40O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIk1FRElVTVwiOlxuICAgICAgcGVyY2VudGFnZSA9IDAuNztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMQVJHRVwiOlxuICAgICAgcGVyY2VudGFnZSA9IDEuMDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJWRVJZX0xBUkdFXCI6XG4gICAgICBwZXJjZW50YWdlID0gMS4zO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICcnICsgcGVyY2VudGFnZTtcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnbWF0aF9udW1iZXInXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBudW1iZXIgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdOVU0nKTtcbiAgdmFyIGNvZGUgPSBudW1iZXI7XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbi8vIEFDVElPTlMgQU5EIEJFSEFWSU9SUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnZm9yd2FyZF9zcGVlZCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHNwZWVkID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnU1BFRUQnKTtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuXG4gIHZhciBhZGRzdWJzdHJhY3QgPSAwO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkZBU1RFUlwiOlxuICAgICAgYWRkc3Vic3RyYWN0ID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJTTE9XRVJcIjpcbiAgICAgIGFkZHN1YnN0cmFjdCA9IC0xO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgdmFyIGNvZGUgPSAnZndfc3BlZWQgKz0nICsgYWRkc3Vic3RyYWN0ICsgJyonICsgc3BlZWQuc3BsaXQoJ18nKVsxXSArICcvIDEwMCAqIGZ3X3NwZWVkOyc7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncm9sbF9zcGVlZCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHNwZWVkID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnU1BFRUQnKTtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuXG4gIHZhciBhZGRzdWJzdHJhY3QgPSAwO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkZBU1RFUlwiOlxuICAgICAgYWRkc3Vic3RyYWN0ID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJTTE9XRVJcIjpcbiAgICAgIGFkZHN1YnN0cmFjdCA9IC0xO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICdyb2xsX3NwZWVkICs9JyArIGFkZHN1YnN0cmFjdCArICcqJyArIHNwZWVkICsgJy8gMTAwICogcm9sbF9zcGVlZDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsnc3RvcF9mb3J3YXJkJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9ICdmd19zcGVlZCA9IDA7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG5CbG9ja2x5LkphdmFTY3JpcHRbJ3R3aXN0ZmxhcCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGNvZGUgPSAnZndfc3BlZWQgPSBFdWdCb2R5LmZ3X3NwZWVkOyc7XG4gIGNvZGUgKz0gJ3JvbGxfc3BlZWQgPSBFdWdCb2R5LnJvbGxfc3BlZWQ7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG5CbG9ja2x5LkphdmFTY3JpcHRbJ3N0b3Bfcm9sbGluZyddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGNvZGUgPSAncm9sbF9zcGVlZCA9IDA7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG5CbG9ja2x5LkphdmFTY3JpcHRbJ3R1cm5fcmFuZG9tbHknXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIC8vdmFyIHZhbHVlX21hZ25pdHVkZSA9IEJsb2NrbHkuSmF2YVNjcmlwdC52YWx1ZVRvQ29kZShibG9jaywgJ01BR05JVFVERScsIEJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FKTtcbiAgdmFyIG1hZ25pdHVkZSA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ01BR05JVFVERScpO1xuICAvLyBUaGUgbWFnbml0dWRlcyBnZXQgdHJhbnNsYXRlZCBpbiBwZXJjZW50YWdlcyBvZiB0aGUgY29ycmVzcG9uZGluZyBjb3JlIHZhbHVlcyAoZndfc3BlZWQsIHJvbGxfc3BlZWQsIHJlYWN0aW9uX3N0cmVuZ3RoKVxuICAvLyBvciBvZiB2YWx1ZXMgZGVmaW5lZCBmb3IgZWFjaCB0eXBlIG9mIHJlYWN0aW9uXG4gIHZhciB2YWx1ZV9tYWduaXR1ZGUgPSAwO1xuICBzd2l0Y2ggKG1hZ25pdHVkZSkge1xuICAgIGNhc2UgXCJWRVJZX1NNQUxMXCI6XG4gICAgICB2YWx1ZV9tYWduaXR1ZGUgPSAwLjE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiU01BTExcIjpcbiAgICAgIHZhbHVlX21hZ25pdHVkZSA9IDAuNDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJNRURJVU1cIjpcbiAgICAgIHZhbHVlX21hZ25pdHVkZSA9IDAuNztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMQVJHRVwiOlxuICAgICAgdmFsdWVfbWFnbml0dWRlID0gMS4wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlZFUllfTEFSR0VcIjpcbiAgICAgIHZhbHVlX21hZ25pdHVkZSA9IDEuMztcbiAgICAgIGJyZWFrO1xuICB9XG5cblxuICB2YXIgY29kZSA9ICdkZWx0YV95YXcgKz0nICsgdmFsdWVfbWFnbml0dWRlICsgJyAqIFstMSwxXVtNYXRoLnJhbmRvbSgpKjJ8MF0qTWF0aC5yYW5kb20oKSAqIGNvbmZpZy5yZXNldFJhbmRvbSAqIGRUOyc7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9sciddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuXG4gIC8vIExFRlQgZGlyZWN0aW9uIGlzIGluIHBvc2l0aXZlIGxvY2FsIHktZGlyZWN0aW9uLCBpcnJlc3BlY3RpdmUgb2Ygc2Vuc29yIGxvY2F0aW9uLlxuICAvLyBSSUdIVCBkaXJlY3Rpb24gaXMgaW4gbmVnYXRpdmUgbG9jYWwgeS1kaXJlY3Rpb24sIGlycmVzcGVjdGl2ZSBvZiBzZW5zb3IgbG9jYXRpb24uXG4gIHZhciBjb2RlID0gJyc7XG5cbiAgdmFyIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiTEVGVFwiOiAvLyBTZXQgY29lZmZpY2llbnQgc3VjaCB0aGF0IHdoZW4gZXllIGlzIG9uICgxLDEpIGluIHBvc2l0aXZlIHktZGlyZWN0aW9uLCBsZWZ0IGlzIHRvd2FyZHMgdGhlIGxpZ2h0XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlJJR0hUXCI6XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAtMTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGNvZGUgPSAnJztcbiAgdmFyIFRVUk5fTUFYID0gMjtcbiAgY29kZSArPSAndmFyIGxpZ2h0RGlmZiA9JyArICdjYWxjSW50ZW5zaXR5JyArICcqIEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGg7JzsgLy8gUklHSFQgTk9XIFRISVMgSVMgV1JJVFRFTiBGT1IgMSBFWUUuIFJFV1JJVEUgVE8gQURBUFQuXG5cbiAgY29kZSArPSAnZGVsdGFfeWF3ICs9ICcgKyBmbGlwUm90YXRpb25EaXIgKyAnKiBNYXRoLmFicyhFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoICogbGlnaHREaWZmKSAqIGRUOyc7XG5cbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wyd0dXJuX2F0XzFzZW5zb3InXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcblxuICAvKlxuICBJbiBkaXJlY3Rpb24gb2YgdGhlIHNlbnNvcjogV2hlcmUgdGhlIHNlbnNvciBpcyBwb2ludGluZyB0bywgaWYgdGhlIGZpZWxkIGlzIHNtYWxsZXIgdGhhbiAyKlBJLCBPUiB3aGVyZSB0aGUgc2Vuc29yIGlzIGxvY2F0ZWQgSUYgTk9UIHlfc2Vuc29yID0gMFxuICBJbiBkaXJlY3Rpb24gb2YgdGhlIGV5ZXNwb3Q6IElGIFRIRVJFIElTIEFOIEVZRVNQT1QsIHRoZW4gaW4gdGhlIGRpcmVjdGlvbiB0aGF0IGl0IGlzIGxvY2F0ZWQgYXQuXG4gIFRoZSBkZWNpZGluZyBmYWN0b3IgaXMgdGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgc2Vuc29yIG9yaWVudGF0aW9uLCBwb3NpdGlvbiBvciBvZiB0aGUgZXllc3BvdCBwb3NpdGlvbjpcbiAgLSB5ID0gMDogV2UgaGF2ZSBubyBzZXQgZGlyZWN0aW9uLlxuICAtIHkgPiAwOiBjb3VudGVyLWNsb2Nrd2lzZSBkaXJlY3Rpb24gKGkuZS4gcG9zaXRpdmUgYW5nbGVzKVxuICAtIHkgPCAwOiBjbG9ja3dpc2UgZGlyZWN0aW9uIChpLmUuIG5lZ2F0aXZlIGFuZ2xlcylcblxuICBJZiBkaXJlY3Rpb24gaXMgXCJUT1dBUkRTXCIsIHRoZW4gdGhlIGZsaXBSb3RhdGlvbkRpciBpcyBwb3NpdGl2ZSwgYW5kIG5lZ2F0aXZlIG90aGVyd2lzZS5cbiAgKi9cbiB2YXIgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJBV0FZXCI6XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlRPV0FSRFNcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IC0xO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICd2YXIgcm90YXRpb25EaXIgPSAwOyBcXFxuICAgIGlmIChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGgpIHsgXFxcbiAgICAgIGlmIChFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5maWVsZCA9PSAyKk1hdGguUEkpIHsgXFxcbiAgICAgICAgcm90YXRpb25EaXIgPSBFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55OyBcXFxuICAgICAgfSBlbHNlIHsgXFxcbiAgICAgICAgcm90YXRpb25EaXIgPSBFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5vcmllbnRhdGlvbi55OyBcXFxuICAgICAgfSB9JztcblxuICB2YXIgVFVSTl9NQVggPSAyO1xuICBjb2RlICs9ICd2YXIgbGlnaHREaWZmID0nICsgJ2NhbGNJbnRlbnNpdHknICsgJyogRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsnO1xuICBjb2RlICs9ICdkZWx0YV95YXcgKz0gcm90YXRpb25EaXIgKicgKyAgZmxpcFJvdGF0aW9uRGlyICsgJyogTWF0aC5hYnMoRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aCAqIGxpZ2h0RGlmZikgKiBkVDsnO1xuXG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9hdF8xc2Vuc29yX2V5ZXNwb3QnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcbiAgdmFyIG9iamVjdCA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ09CSkVDVCcpO1xuXG4gIC8qXG4gIEluIGRpcmVjdGlvbiBvZiB0aGUgc2Vuc29yOiBXaGVyZSB0aGUgc2Vuc29yIGlzIHBvaW50aW5nIHRvLCBpZiB0aGUgZmllbGQgaXMgc21hbGxlciB0aGFuIDIqUEksIE9SIHdoZXJlIHRoZSBzZW5zb3IgaXMgbG9jYXRlZCBJRiBOT1QgeV9zZW5zb3IgPSAwXG4gIEluIGRpcmVjdGlvbiBvZiB0aGUgZXllc3BvdDogSUYgVEhFUkUgSVMgQU4gRVlFU1BPVCwgdGhlbiBpbiB0aGUgZGlyZWN0aW9uIHRoYXQgaXQgaXMgbG9jYXRlZCBhdC5cbiAgVGhlIGRlY2lkaW5nIGZhY3RvciBpcyB0aGUgeSBjb29yZGluYXRlIG9mIHRoZSBzZW5zb3Igb3JpZW50YXRpb24sIHBvc2l0aW9uIG9yIG9mIHRoZSBleWVzcG90IHBvc2l0aW9uOlxuICAtIHkgPSAwOiBXZSBoYXZlIG5vIHNldCBkaXJlY3Rpb24uXG4gIC0geSA+IDA6IGNvdW50ZXItY2xvY2t3aXNlIGRpcmVjdGlvbiAoaS5lLiBwb3NpdGl2ZSBhbmdsZXMpXG4gIC0geSA8IDA6IGNsb2Nrd2lzZSBkaXJlY3Rpb24gKGkuZS4gbmVnYXRpdmUgYW5nbGVzKVxuXG4gIElmIGRpcmVjdGlvbiBpcyBcIlRPV0FSRFNcIiwgdGhlbiB0aGUgZmxpcFJvdGF0aW9uRGlyIGlzIHBvc2l0aXZlLCBhbmQgbmVnYXRpdmUgb3RoZXJ3aXNlLlxuICAqL1xuIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkFXQVlcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVE9XQVJEU1wiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJyc7XG5cbiAgaWYgKG9iamVjdCA9PSAnU0VOU09SJykge1xuICAgIGNvZGUgKz0gJ3ZhciByb3RhdGlvbkRpciA9IDA7IFxcXG4gICAgaWYgKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aCkgeyBcXFxuICAgICAgaWYgKEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLmZpZWxkID09IDIqTWF0aC5QSSkgeyBcXFxuICAgICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLnBvc2l0aW9uLnk7IFxcXG4gICAgICB9IGVsc2UgeyBcXFxuICAgICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLm9yaWVudGF0aW9uLnk7IFxcXG4gICAgICB9IH0nO1xuICB9IGVsc2UgaWYgKG9iamVjdCA9PSAnU1BPVCcpIHtcbiAgICBjb2RlICs9ICd2YXIgcm90YXRpb25EaXIgPSAwOyBcXFxuICAgIGlmIChFdWdCb2R5LnNwb3RQb3NpdGlvbnMubGVuZ3RoPT0xKSB7IFxcXG4gICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkuc3BvdFBvc2l0aW9uc1swXS55OyB9JztcbiAgfVxuXG4gIHZhciBUVVJOX01BWCA9IDI7XG4gIGNvZGUgKz0gJ3ZhciBsaWdodERpZmYgPScgKyAnY2FsY0ludGVuc2l0eScgKyAnKiBFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoOyc7XG4gIGNvZGUgKz0gJ2RlbHRhX3lhdyArPSByb3RhdGlvbkRpciAqJyArICBmbGlwUm90YXRpb25EaXIgKyAnKiBNYXRoLmFicyhFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoICogbGlnaHREaWZmKSAqIGRUOyc7XG5cbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wyd0dXJuX2F0XzJzZW5zb3JzJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG5cbiAgdmFyIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiQVdBWVwiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gLTE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVE9XQVJEU1wiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGNvZGUgPSAndmFyIHJvdGF0aW9uRGlyID0gMDsnO1xuXG4gIGNvZGUgKz0gJ3JvdGF0aW9uRGlyID0gKHNlbnNvckludGVuc2l0aWVzWzFdIC0gc2Vuc29ySW50ZW5zaXRpZXNbMF0pIDwgMCA/IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzFdLnBvc2l0aW9uLnkgOiBFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55Oyc7XG5cbiAgdmFyIFRVUk5fTUFYID0gMjtcbiAgY29kZSArPSAndmFyIGxpZ2h0RGlmZiA9JyArICdjYWxjSW50ZW5zaXR5JyArICcqIEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGg7JztcbiAgY29kZSArPSAnZGVsdGFfeWF3ICs9IHJvdGF0aW9uRGlyIConICsgIGZsaXBSb3RhdGlvbkRpciArICcqIE1hdGguYWJzKEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGggKiBsaWdodERpZmYpICogZFQ7JztcblxuICByZXR1cm4gY29kZTtcbn07XG5cblxuLy8gQ09ORElUSU9OUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnbWFzdGVyX2Jsb2NrJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZGVmYXVsdENvZGUgPSBcInZhciBjYWxjSW50ZW5zaXR5ID0gKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aD4xKSA/IGxpZ2h0SW5mby5kaWZmQnR3U2Vuc29ycyA6IGxpZ2h0SW5mby5jdXJyZW50TGV2ZWxbMF07XCIgLy8gSEVSRSBXUklURSBUSEUgQ09SRSBMSUdIVCAtIDEgRVlFIE9SIDIgRVlFUy4gVEhJUyBDQU4gVEhFTiBCRSBNT0RJRklFRCBXSVRIIFRIRSBEUk9QLURPV04hIC0gV1JJVEUgQUxMIE9USEVSIENPREUgU1VDSCBUSEFUIElUIFRBS0VTIFRISVMgTElHSFQgTUVBU1VSRS5cbiAgdmFyIGFsbF9jb2RlID0gQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ0NPREUnKTtcbiAgLy8gVE9ETzogQXNzZW1ibGUgSmF2YVNjcmlwdCBpbnRvIGNvZGUgdmFyaWFibGUuXG4gIHZhciBjb2RlID0gZGVmYXVsdENvZGUgKyBhbGxfY29kZTtcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydzZWVfbGlnaHRfcXVhbnRpdHknXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciB0aHJlc2hvbGRfcGVyY2VudGFnZSA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ1RIUkVTSE9MRCcpO1xuICB2YXIgc3RhdGVtZW50c19jb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdDT0RFJyk7XG4gIHRocmVzaG9sZF9wZXJjZW50YWdlID0gdGhyZXNob2xkX3BlcmNlbnRhZ2Uuc3BsaXQoJ18nKVsxXTtcbiAgLy8gQWx0ZXJuYXRpdmVseSwgdXNlIHRoZSB0aHJlc2hvbGQgRXVnQm9keS5kZWZhdWx0cy5zZW5zaXRpdml0eV90aHJlc2hvbGRcbiAgdmFyIGNvZGUgPSAnaWYgKChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGg+MSAmJiBNYXRoLmFicyhsaWdodEluZm8uZGlmZkJ0d1NlbnNvcnMpID4gJyArIHRocmVzaG9sZF9wZXJjZW50YWdlICsgJy8gMTAwKSB8fCBcXFxuICAgICAgICAgICAgIChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGggPT0gMSAmJiBNYXRoLmFicyhsaWdodEluZm8uZGlmZk5vd1RvQWRhcHRMZXZlbCkgPicgKyB0aHJlc2hvbGRfcGVyY2VudGFnZSArICcvIDEwMCkpIHsnICsgc3RhdGVtZW50c19jb2RlICsgJ30nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3NlZV9saWdodCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHN0YXRlbWVudHNfY29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICB2YXIgdGhyZXNob2xkX3BlcmNlbnRhZ2UgPSAwLjE7XG4gIC8vIEFsdGVybmF0aXZlbHksIHVzZSB0aGUgdGhyZXNob2xkIEV1Z0JvZHkuZGVmYXVsdHMuc2Vuc2l0aXZpdHlfdGhyZXNob2xkXG4gIHZhciBjb2RlID0gJ2lmICgoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoPjEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmRpZmZCdHdTZW5zb3JzKSA+ICcgKyB0aHJlc2hvbGRfcGVyY2VudGFnZSArICcvIDEwMCkgfHwgXFxcbiAgICAgICAgICAgICAoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoID09IDEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmRpZmZOb3dUb0FkYXB0TGV2ZWwpID4nICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApKSB7JyArIHN0YXRlbWVudHNfY29kZSArICd9JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydub19saWdodCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHN0YXRlbWVudHNfY29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICB2YXIgdGhyZXNob2xkX3BlcmNlbnRhZ2UgPSAwLjI7XG4gIC8vIEFsdGVybmF0aXZlbHksIHVzZSB0aGUgdGhyZXNob2xkIEV1Z0JvZHkuZGVmYXVsdHMuc2Vuc2l0aXZpdHlfdGhyZXNob2xkXG4gIHZhciBjb2RlID0gJ2lmICgoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoPjEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmRpZmZCdHdTZW5zb3JzKSA8ICcgKyB0aHJlc2hvbGRfcGVyY2VudGFnZSArICcvIDEwMCkgfHwgXFxcbiAgICAgICAgICAgICAoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoID09IDEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmRpZmZOb3dUb0FkYXB0TGV2ZWwpIDwnICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApKSB7JyArIHN0YXRlbWVudHNfY29kZSArICd9JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydlaXRoZXJfd2F5J10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICByZXR1cm4gY29kZTtcbn07XG4iXX0=
