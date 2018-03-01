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
  "message0": "Paddle randomly left/right by %1 %2",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "field_dropdown",
    "name": "MAGNITUDE",
    "options": [["a little", "SMALL"], ["a moderate amount", "MEDIUM"], ["a lot", "LARGE"]]
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
    this.appendDummyInput().appendField("Every time, do:");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kZWxpbmdfYmxvY2tzLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIkJsb2NrbHkiLCJkZWZpbmVCbG9ja3NXaXRoSnNvbkFycmF5IiwiQmxvY2tzIiwiaW5pdCIsImFwcGVuZER1bW15SW5wdXQiLCJhcHBlbmRGaWVsZCIsImFwcGVuZFN0YXRlbWVudElucHV0Iiwic2V0Q2hlY2siLCJzZXRJbnB1dHNJbmxpbmUiLCJzZXRDb2xvdXIiLCJzZXREZWxldGFibGUiLCJzZXRUb29sdGlwIiwic2V0SGVscFVybCIsInNldFByZXZpb3VzU3RhdGVtZW50Iiwic2V0TmV4dFN0YXRlbWVudCIsInNldE1vdmFibGUiLCJKYXZhU2NyaXB0IiwiYmxvY2siLCJxdWFudGl0eSIsInZhbHVlVG9Db2RlIiwiT1JERVJfTk9ORSIsInJhbmRvbUNvZWZmIiwicmFuZG9tRmFjdG9yIiwiY29kZSIsImZhY3RvciIsImdldEZpZWxkVmFsdWUiLCJwcm9wX3RvIiwibWFnbml0dWRlIiwicGVyY2VudGFnZSIsIm51bWJlciIsInNwZWVkIiwiZGlyZWN0aW9uIiwiYWRkc3Vic3RyYWN0Iiwic3BsaXQiLCJ2YWx1ZV9tYWduaXR1ZGUiLCJmbGlwUm90YXRpb25EaXIiLCJUVVJOX01BWCIsIm9iamVjdCIsImRlZmF1bHRDb2RlIiwiYWxsX2NvZGUiLCJzdGF0ZW1lbnRUb0NvZGUiLCJ0aHJlc2hvbGRfcGVyY2VudGFnZSIsInN0YXRlbWVudHNfY29kZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxDQUFlQyx5QkFBZixDQUF5QyxDQUN2QyxFQUFFLFFBQVEsZUFBVjtBQUNFLGNBQVksb0JBRGQ7QUFFRSxXQUFTLENBQ1A7QUFDRSxZQUFRO0FBRFYsR0FETyxFQUlQO0FBQ0UsWUFBUSxhQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsYUFBUyxDQUNQLFFBRE8sRUFFUCxRQUZPLEVBR1AsZUFITyxFQUlQLGVBSk8sRUFLUCxv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a2x5L21vZGVsaW5nX2Jsb2Nrcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5CbG9ja2x5LmRlZmluZUJsb2Nrc1dpdGhKc29uQXJyYXkoW1xuICB7IFwidHlwZVwiOiBcIm1vZGlmaWVyX3JhbmRcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwibW9yZSBvciBsZXNzICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3ZhbHVlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlFVQU5UXCIsXG4gICAgICAgIFwiY2hlY2tcIjogW1xuICAgICAgICAgIFwiTnVtYmVyXCIsXG4gICAgICAgICAgXCJTdHJpbmdcIixcbiAgICAgICAgICBcIm1vZGlmaWVyX3Byb2JcIixcbiAgICAgICAgICBcIm1vZGlmaWVyX3JhbmRcIixcbiAgICAgICAgICBcInF1YW50X3Byb3BfMXNlbnNvclwiLFxuICAgICAgICAgIFwicXVhbnRfcHJvcF8yc2Vuc29yc1wiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxODAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJxdWFsX2Fic29sdXRlXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIiUxXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBzbWFsbCBhbW91bnRcIixcbiAgICAgICAgICAgIFwiU01BTExcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIG1lZGl1bSBhbW91bnRcIixcbiAgICAgICAgICAgIFwiTUVESVVNXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBsYXJnZSBhbW91bnRcIixcbiAgICAgICAgICAgIFwiTEFSR0VcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxODAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJxdWFudF9wcm9wXzFzZW5zb3JcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiYW1vdW50IHByb3AuIHRvICUxXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkZBQ1RPUlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZGlmZiBpbiBsaWdodCBzZWVuIG5vdyB2cyBiZWZvcmVcIixcbiAgICAgICAgICAgIFwiTElHSFRfRElGRlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImxpZ2h0IHNlZW4gbm93XCIsXG4gICAgICAgICAgICBcIkxJR0hUX05PV1wiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImdlbmVyYWwgbGV2ZWwgb2YgYnJpZ2h0bmVzc1wiLFxuICAgICAgICAgICAgXCJMSUdIVF9BVkdcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcIm91dHB1dFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDE4MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInF1YW50X3Byb3BfMnNlbnNvcnNcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiYW1vdW50IHByb3BvcnRpb25hbCB0byB0aGUgJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRkFDVE9SXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJkaWZmZXJlbmNlIGJldHdlZW4gbGVmdCBhbmQgcmlnaHQgc2Vuc29yc1wiLFxuICAgICAgICAgICAgXCJMSUdIVF9ESUZGXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwicGVyY2VpdmVkIGxpZ2h0IG9mIHJpZ2h0IHNlbnNvclwiLFxuICAgICAgICAgICAgXCJMSUdIVF9SSUdIVFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInBlcmNlaXZlZCBsaWdodCBvZiBsZWZ0IHNlbnNvclwiLFxuICAgICAgICAgICAgXCJMSUdIVF9MRUZUXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZ2VuZXJhbCBsZXZlbCBvZiBicmlnaHRuZXNzXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0FWR1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwib3V0cHV0XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMTgwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHdpc3RmbGFwXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlR3aXN0IG9yIGZsYXAgYXQgbm9ybWFsIHNwZWVkXCIsXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJzdG9wX2ZvcndhcmRcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiU3RvcCBtb3ZpbmcgZm9yd2FyZFwiLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwic3RvcF9yb2xsaW5nXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlN0b3Agcm90YXRpbmcgYXJvdW5kIGF4aXNcIixcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInR1cm5fcmFuZG9tbHlcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiUGFkZGxlIHJhbmRvbWx5IGxlZnQvcmlnaHQgYnkgJTEgJTJcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiTUFHTklUVURFXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIGxpdHRsZVwiLFxuICAgICAgICAgICAgXCJTTUFMTFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImEgbW9kZXJhdGUgYW1vdW50XCIsXG4gICAgICAgICAgICBcIk1FRElVTVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImEgbG90XCIsXG4gICAgICAgICAgICBcIkxBUkdFXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwiZm9yd2FyZF9zcGVlZFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUd2lzdCBvciBmbGFwICUxIGJ5ICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZmFzdGVyXCIsXG4gICAgICAgICAgICBcIkZBU1RFUlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNsb3dlclwiLFxuICAgICAgICAgICAgXCJTTE9XRVJcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiU1BFRURcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIjI1IHBlcmNlbnRcIixcbiAgICAgICAgICAgIFwiQ0hBTkdFXzI1XCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiNTAgcGVyY2VudFwiLFxuICAgICAgICAgICAgXCJDSEFOR0VfNTBcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCI3NSBwZXJjZW50XCIsXG4gICAgICAgICAgICBcIkNIQU5HRV83NVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVzdFwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwicm9sbF9zcGVlZFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJSb3RhdGUgJTEgYnkgJTIgJTMgcGVyY2VudFwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJESVJFQ1RJT05cIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImZhc3RlclwiLFxuICAgICAgICAgICAgXCJGQVNURVJcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJzbG93ZXJcIixcbiAgICAgICAgICAgIFwiU0xPV0VSXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX251bWJlclwiLFxuICAgICAgICBcIm5hbWVcIjogXCJTUEVFRFwiLFxuICAgICAgICBcInZhbHVlXCI6IDAsXG4gICAgICAgIFwibWluXCI6IDAsXG4gICAgICAgIFwibWF4XCI6IDEwMCxcbiAgICAgICAgXCJwcmVjaXNpb25cIjogMjVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlRlc3RcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInR1cm5fbHJcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiUGFkZGxlIHRvd2FyZHMgdGhlICUxXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwibGVmdFwiLFxuICAgICAgICAgICAgXCJMRUZUXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwicmlnaHRcIixcbiAgICAgICAgICAgIFwiUklHSFRcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfV0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJ0dXJuX2F0XzFzZW5zb3JcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiUGFkZGxlICUxIHRoZSBzZW5zb3JcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhd2F5IGZyb21cIixcbiAgICAgICAgICAgIFwiQVdBWVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInRvd2FyZHNcIixcbiAgICAgICAgICAgIFwiVE9XQVJEU1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInR1cm5fYXRfMXNlbnNvcl9leWVzcG90XCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlBhZGRsZSAlMSAlMlwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJESVJFQ1RJT05cIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImF3YXkgZnJvbSB0aGVcIixcbiAgICAgICAgICAgIFwiQVdBWVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInRvd2FyZHMgdGhlXCIsXG4gICAgICAgICAgICBcIlRPV0FSRFNcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiT0JKRUNUXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJzZW5zb3JcIixcbiAgICAgICAgICAgIFwiU0VOU09SXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZXllc3BvdFwiLFxuICAgICAgICAgICAgXCJTUE9UXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1dLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9hdF8yc2Vuc29yc1wiLFxuICAgIFwibWVzc2FnZTBcIjogXCJQYWRkbGUgJTEgJTIgc2Vuc29yIHRoYXQgZGV0ZWN0cyBtb3JlIGxpZ2h0XCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYXdheSBmcm9tIHRoZVwiLFxuICAgICAgICAgICAgXCJBV0FZXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwidG93YXJkcyB0aGVcIixcbiAgICAgICAgICAgIFwiVE9XQVJEU1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9XSxcbiAgICBcImlucHV0c0lubGluZVwiOiBmYWxzZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJzZWVfbGlnaHRfcXVhbnRpdHlcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiSWYgdGhlcmUgaXMgYSAlMSBsaWdodCBzaWduYWwsIGRvOiAlMiAlM1wiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJUSFJFU0hPTERcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNtYWxsXCIsXG4gICAgICAgICAgICBcIlRIUkVTSF8yMFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIm1lZGl1bVwiLFxuICAgICAgICAgICAgXCJUSFJFU0hfNDBcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJsYXJnZVwiLFxuICAgICAgICAgICAgXCJUSFJFU0hfNjBcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfc3RhdGVtZW50XCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkNPREVcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDI3MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9XG5dKTtcblxud2luZG93LkJsb2NrbHkuQmxvY2tzWydtYXN0ZXJfYmxvY2snXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hcHBlbmREdW1teUlucHV0KClcbiAgICAgICAgLmFwcGVuZEZpZWxkKFwiUHV0IGFsbCB0aGUgcHJvZ3JhbW1pbmcgYmxvY2tzIGluIGhlcmU6XCIpO1xuICAgIHRoaXMuYXBwZW5kU3RhdGVtZW50SW5wdXQoXCJDT0RFXCIpXG4gICAgICAgIC5zZXRDaGVjayhudWxsKTtcbiAgICB0aGlzLnNldElucHV0c0lubGluZShmYWxzZSk7XG4gICAgdGhpcy5zZXRDb2xvdXIoMjMwKTtcbiAgICB0aGlzLnNldERlbGV0YWJsZShmYWxzZSk7XG4gdGhpcy5zZXRUb29sdGlwKFwiXCIpO1xuIHRoaXMuc2V0SGVscFVybChcIlwiKTtcbiAgfVxufTtcblxud2luZG93LkJsb2NrbHkuQmxvY2tzWydzZWVfbGlnaHQnXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hcHBlbmREdW1teUlucHV0KClcbiAgICAgICAgLmFwcGVuZEZpZWxkKFwiSWYgdGhlcmUgaXMgYSBsaWdodCBzaWduYWwsIGRvOlwiKTtcbiAgICB0aGlzLmFwcGVuZFN0YXRlbWVudElucHV0KFwiQ09ERVwiKVxuICAgICAgICAuc2V0Q2hlY2sobnVsbCk7XG4gICAgdGhpcy5zZXRJbnB1dHNJbmxpbmUoZmFsc2UpO1xuICAgIHRoaXMuc2V0UHJldmlvdXNTdGF0ZW1lbnQodHJ1ZSxudWxsKTtcbiAgICB0aGlzLnNldE5leHRTdGF0ZW1lbnQodHJ1ZSxudWxsKTtcbiAgICB0aGlzLnNldENvbG91cigyNzApO1xuICAgIHRoaXMuc2V0RGVsZXRhYmxlKGZhbHNlKTtcbiAgICB0aGlzLnNldE1vdmFibGUoZmFsc2UpO1xuIHRoaXMuc2V0VG9vbHRpcChcIlwiKTtcbiB0aGlzLnNldEhlbHBVcmwoXCJcIik7XG4gIH1cbn07XG5cbndpbmRvdy5CbG9ja2x5LkJsb2Nrc1snbm9fbGlnaHQnXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hcHBlbmREdW1teUlucHV0KClcbiAgICAgICAgLmFwcGVuZEZpZWxkKFwiSWYgdGhlcmUgaXMgbm8gbGlnaHQgc2lnbmFsLCBkbzpcIik7XG4gICAgdGhpcy5hcHBlbmRTdGF0ZW1lbnRJbnB1dChcIkNPREVcIilcbiAgICAgICAgLnNldENoZWNrKG51bGwpO1xuICAgIHRoaXMuc2V0SW5wdXRzSW5saW5lKGZhbHNlKTtcbiAgICB0aGlzLnNldFByZXZpb3VzU3RhdGVtZW50KHRydWUsbnVsbCk7XG4gICAgdGhpcy5zZXROZXh0U3RhdGVtZW50KHRydWUsbnVsbCk7XG4gICAgdGhpcy5zZXRDb2xvdXIoMjcwKTtcbiAgICB0aGlzLnNldERlbGV0YWJsZShmYWxzZSk7XG4gICAgdGhpcy5zZXRNb3ZhYmxlKGZhbHNlKTtcbiB0aGlzLnNldFRvb2x0aXAoXCJcIik7XG4gdGhpcy5zZXRIZWxwVXJsKFwiXCIpO1xuICB9XG59O1xuXG53aW5kb3cuQmxvY2tseS5CbG9ja3NbJ2VpdGhlcl93YXknXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hcHBlbmREdW1teUlucHV0KClcbiAgICAgICAgLmFwcGVuZEZpZWxkKFwiRXZlcnkgdGltZSwgZG86XCIpO1xuICAgIHRoaXMuYXBwZW5kU3RhdGVtZW50SW5wdXQoXCJDT0RFXCIpXG4gICAgICAgIC5zZXRDaGVjayhudWxsKTtcbiAgICB0aGlzLnNldElucHV0c0lubGluZShmYWxzZSk7XG4gICAgdGhpcy5zZXRQcmV2aW91c1N0YXRlbWVudCh0cnVlLG51bGwpO1xuICAgIHRoaXMuc2V0TmV4dFN0YXRlbWVudCh0cnVlLG51bGwpO1xuICAgIHRoaXMuc2V0Q29sb3VyKDI3MCk7XG4gICAgdGhpcy5zZXREZWxldGFibGUoZmFsc2UpO1xuICAgIHRoaXMuc2V0TW92YWJsZShmYWxzZSk7XG4gdGhpcy5zZXRUb29sdGlwKFwiXCIpO1xuIHRoaXMuc2V0SGVscFVybChcIlwiKTtcbiAgfVxufTtcblxuXG4vLyBRVUFOVElUSUVTIEFORCBNQUdOSVRVREVTXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydtb2RpZmllcl9yYW5kJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgcXVhbnRpdHkgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnZhbHVlVG9Db2RlKGJsb2NrLCdRVUFOVCcsd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FKTtcbiAgdmFyIHJhbmRvbUNvZWZmID0gMC4xO1xuICB2YXIgcmFuZG9tRmFjdG9yID0gJzEgKyBbLTEsMV1bTWF0aC5yYW5kb20oKSoyfDBdKk1hdGgucmFuZG9tKCkgKicgKyByYW5kb21Db2VmZjtcbiAgdmFyIGNvZGUgPSByYW5kb21GYWN0b3IgICsgJyonICsgcXVhbnRpdHk7XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1YW50X3Byb3BfMXNlbnNvciddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGZhY3RvciA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0ZBQ1RPUicpO1xuXG4gIHZhciBwcm9wX3RvID0gbnVsbDtcbiAgc3dpdGNoIChmYWN0b3IpIHtcbiAgICBjYXNlIFwiTElHSFRfRElGRlwiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uZGlmZk5vd1RvQWRhcHRMZXZlbCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfTk9XXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5jdXJyZW50TGV2ZWxbMF0nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxJR0hUX0FWR1wiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uYWRhcHRMZXZlbCc7XG4gICAgICBicmVhaztcbiAgfVxuICB2YXIgY29kZSA9IHByb3BfdG87XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1YW50X3Byb3BfMnNlbnNvcnMnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBmYWN0b3IgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdGQUNUT1InKTtcblxuICB2YXIgcHJvcF90byA9IDA7XG4gIHN3aXRjaCAoZmFjdG9yKSB7XG4gICAgY2FzZSBcIkxJR0hUX0RJRkZcIjpcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmRpZmZOb3dUb0FkYXB0TGV2ZWwnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxJR0hUX1JJR0hUXCI6IC8vIHkgPSAtMVxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uY3VycmVudExldmVsW0V1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLnBvc2l0aW9uLnkgPCAwID8gMCA6IDFdJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMaUdIVF9MRUZUXCI6IC8vIHkgPSAxXG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5jdXJyZW50TGV2ZWxbRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueSA+IDAgPyAwIDogMV0nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxJR0hUX0FWR1wiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uYWRhcHRMZXZlbCc7XG4gICAgICBicmVhaztcbiAgfVxuICB2YXIgY29kZSA9IHByb3BfdG87XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1YWxfYWJzb2x1dGUnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBtYWduaXR1ZGUgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdNQUdOSVRVREUnKTtcbiAgLy8gVGhlIG1hZ25pdHVkZXMgZ2V0IHRyYW5zbGF0ZWQgaW4gcGVyY2VudGFnZXMgb2YgdGhlIGNvcnJlc3BvbmRpbmcgY29yZSB2YWx1ZXMgKGZ3X3NwZWVkLCByb2xsX3NwZWVkLCByZWFjdGlvbl9zdHJlbmd0aClcbiAgLy8gb3Igb2YgdmFsdWVzIGRlZmluZWQgZm9yIGVhY2ggdHlwZSBvZiByZWFjdGlvblxuICB2YXIgcGVyY2VudGFnZSA9IDA7XG4gIHN3aXRjaCAobWFnbml0dWRlKSB7XG4gICAgY2FzZSBcIlZFUllfU01BTExcIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAwLjE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiU01BTExcIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAwLjQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTUVESVVNXCI6XG4gICAgICBwZXJjZW50YWdlID0gMC43O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxBUkdFXCI6XG4gICAgICBwZXJjZW50YWdlID0gMS4wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlZFUllfTEFSR0VcIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAxLjM7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJycgKyBwZXJjZW50YWdlO1xuICByZXR1cm4gW2NvZGUsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORV07XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydtYXRoX251bWJlciddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIG51bWJlciA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ05VTScpO1xuICB2YXIgY29kZSA9IG51bWJlcjtcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxuLy8gQUNUSU9OUyBBTkQgQkVIQVZJT1JTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydmb3J3YXJkX3NwZWVkJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3BlZWQgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdTUEVFRCcpO1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG5cbiAgdmFyIGFkZHN1YnN0cmFjdCA9IDA7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiRkFTVEVSXCI6XG4gICAgICBhZGRzdWJzdHJhY3QgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlNMT1dFUlwiOlxuICAgICAgYWRkc3Vic3RyYWN0ID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuICB2YXIgY29kZSA9ICdmd19zcGVlZCArPScgKyBhZGRzdWJzdHJhY3QgKyAnKicgKyBzcGVlZC5zcGxpdCgnXycpWzFdICsgJy8gMTAwICogZndfc3BlZWQ7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydyb2xsX3NwZWVkJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3BlZWQgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdTUEVFRCcpO1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG5cbiAgdmFyIGFkZHN1YnN0cmFjdCA9IDA7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiRkFTVEVSXCI6XG4gICAgICBhZGRzdWJzdHJhY3QgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlNMT1dFUlwiOlxuICAgICAgYWRkc3Vic3RyYWN0ID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJ3JvbGxfc3BlZWQgKz0nICsgYWRkc3Vic3RyYWN0ICsgJyonICsgc3BlZWQgKyAnLyAxMDAgKiByb2xsX3NwZWVkOyc7XG4gIHJldHVybiBjb2RlO1xufTtcblxuQmxvY2tseS5KYXZhU2NyaXB0WydzdG9wX2ZvcndhcmQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBjb2RlID0gJ2Z3X3NwZWVkID0gMDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsndHdpc3RmbGFwJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9ICdmd19zcGVlZCA9IEV1Z0JvZHkuZndfc3BlZWQ7JztcbiAgY29kZSArPSAncm9sbF9zcGVlZCA9IEV1Z0JvZHkucm9sbF9zcGVlZDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsnc3RvcF9yb2xsaW5nJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9ICdyb2xsX3NwZWVkID0gMDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9yYW5kb21seSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgLy92YXIgdmFsdWVfbWFnbml0dWRlID0gQmxvY2tseS5KYXZhU2NyaXB0LnZhbHVlVG9Db2RlKGJsb2NrLCAnTUFHTklUVURFJywgQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkUpO1xuICB2YXIgbWFnbml0dWRlID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnTUFHTklUVURFJyk7XG4gIC8vIFRoZSBtYWduaXR1ZGVzIGdldCB0cmFuc2xhdGVkIGluIHBlcmNlbnRhZ2VzIG9mIHRoZSBjb3JyZXNwb25kaW5nIGNvcmUgdmFsdWVzIChmd19zcGVlZCwgcm9sbF9zcGVlZCwgcmVhY3Rpb25fc3RyZW5ndGgpXG4gIC8vIG9yIG9mIHZhbHVlcyBkZWZpbmVkIGZvciBlYWNoIHR5cGUgb2YgcmVhY3Rpb25cbiAgdmFyIHZhbHVlX21hZ25pdHVkZSA9IDA7XG4gIHN3aXRjaCAobWFnbml0dWRlKSB7XG4gICAgY2FzZSBcIlZFUllfU01BTExcIjpcbiAgICAgIHZhbHVlX21hZ25pdHVkZSA9IDAuMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJTTUFMTFwiOlxuICAgICAgdmFsdWVfbWFnbml0dWRlID0gMC40O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIk1FRElVTVwiOlxuICAgICAgdmFsdWVfbWFnbml0dWRlID0gMC43O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxBUkdFXCI6XG4gICAgICB2YWx1ZV9tYWduaXR1ZGUgPSAxLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVkVSWV9MQVJHRVwiOlxuICAgICAgdmFsdWVfbWFnbml0dWRlID0gMS4zO1xuICAgICAgYnJlYWs7XG4gIH1cblxuXG4gIHZhciBjb2RlID0gJ2RlbHRhX3lhdyArPScgKyB2YWx1ZV9tYWduaXR1ZGUgKyAnICogWy0xLDFdW01hdGgucmFuZG9tKCkqMnwwXSpNYXRoLnJhbmRvbSgpICogY29uZmlnLnJlc2V0UmFuZG9tICogZFQ7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wyd0dXJuX2xyJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG5cbiAgLy8gTEVGVCBkaXJlY3Rpb24gaXMgaW4gcG9zaXRpdmUgbG9jYWwgeS1kaXJlY3Rpb24sIGlycmVzcGVjdGl2ZSBvZiBzZW5zb3IgbG9jYXRpb24uXG4gIC8vIFJJR0hUIGRpcmVjdGlvbiBpcyBpbiBuZWdhdGl2ZSBsb2NhbCB5LWRpcmVjdGlvbiwgaXJyZXNwZWN0aXZlIG9mIHNlbnNvciBsb2NhdGlvbi5cbiAgdmFyIGNvZGUgPSAnJztcblxuICB2YXIgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJMRUZUXCI6IC8vIFNldCBjb2VmZmljaWVudCBzdWNoIHRoYXQgd2hlbiBleWUgaXMgb24gKDEsMSkgaW4gcG9zaXRpdmUgeS1kaXJlY3Rpb24sIGxlZnQgaXMgdG93YXJkcyB0aGUgbGlnaHRcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiUklHSFRcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IC0xO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICcnO1xuICB2YXIgVFVSTl9NQVggPSAyO1xuICBjb2RlICs9ICd2YXIgbGlnaHREaWZmID0nICsgJ2NhbGNJbnRlbnNpdHknICsgJyogRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsnOyAvLyBSSUdIVCBOT1cgVEhJUyBJUyBXUklUVEVOIEZPUiAxIEVZRS4gUkVXUklURSBUTyBBREFQVC5cblxuICBjb2RlICs9ICdkZWx0YV95YXcgKz0gJyArIGZsaXBSb3RhdGlvbkRpciArICcqIE1hdGguYWJzKEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGggKiBsaWdodERpZmYpICogZFQ7JztcblxuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3R1cm5fYXRfMXNlbnNvciddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuXG4gIC8qXG4gIEluIGRpcmVjdGlvbiBvZiB0aGUgc2Vuc29yOiBXaGVyZSB0aGUgc2Vuc29yIGlzIHBvaW50aW5nIHRvLCBpZiB0aGUgZmllbGQgaXMgc21hbGxlciB0aGFuIDIqUEksIE9SIHdoZXJlIHRoZSBzZW5zb3IgaXMgbG9jYXRlZCBJRiBOT1QgeV9zZW5zb3IgPSAwXG4gIEluIGRpcmVjdGlvbiBvZiB0aGUgZXllc3BvdDogSUYgVEhFUkUgSVMgQU4gRVlFU1BPVCwgdGhlbiBpbiB0aGUgZGlyZWN0aW9uIHRoYXQgaXQgaXMgbG9jYXRlZCBhdC5cbiAgVGhlIGRlY2lkaW5nIGZhY3RvciBpcyB0aGUgeSBjb29yZGluYXRlIG9mIHRoZSBzZW5zb3Igb3JpZW50YXRpb24sIHBvc2l0aW9uIG9yIG9mIHRoZSBleWVzcG90IHBvc2l0aW9uOlxuICAtIHkgPSAwOiBXZSBoYXZlIG5vIHNldCBkaXJlY3Rpb24uXG4gIC0geSA+IDA6IGNvdW50ZXItY2xvY2t3aXNlIGRpcmVjdGlvbiAoaS5lLiBwb3NpdGl2ZSBhbmdsZXMpXG4gIC0geSA8IDA6IGNsb2Nrd2lzZSBkaXJlY3Rpb24gKGkuZS4gbmVnYXRpdmUgYW5nbGVzKVxuXG4gIElmIGRpcmVjdGlvbiBpcyBcIlRPV0FSRFNcIiwgdGhlbiB0aGUgZmxpcFJvdGF0aW9uRGlyIGlzIHBvc2l0aXZlLCBhbmQgbmVnYXRpdmUgb3RoZXJ3aXNlLlxuICAqL1xuIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkFXQVlcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVE9XQVJEU1wiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJ3ZhciByb3RhdGlvbkRpciA9IDA7IFxcXG4gICAgaWYgKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aCkgeyBcXFxuICAgICAgaWYgKEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLmZpZWxkID09IDIqTWF0aC5QSSkgeyBcXFxuICAgICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLnBvc2l0aW9uLnk7IFxcXG4gICAgICB9IGVsc2UgeyBcXFxuICAgICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLm9yaWVudGF0aW9uLnk7IFxcXG4gICAgICB9IH0nO1xuXG4gIHZhciBUVVJOX01BWCA9IDI7XG4gIGNvZGUgKz0gJ3ZhciBsaWdodERpZmYgPScgKyAnY2FsY0ludGVuc2l0eScgKyAnKiBFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoOyc7XG4gIGNvZGUgKz0gJ2RlbHRhX3lhdyArPSByb3RhdGlvbkRpciAqJyArICBmbGlwUm90YXRpb25EaXIgKyAnKiBNYXRoLmFicyhFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoICogbGlnaHREaWZmKSAqIGRUOyc7XG5cbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wyd0dXJuX2F0XzFzZW5zb3JfZXllc3BvdCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuICB2YXIgb2JqZWN0ID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnT0JKRUNUJyk7XG5cbiAgLypcbiAgSW4gZGlyZWN0aW9uIG9mIHRoZSBzZW5zb3I6IFdoZXJlIHRoZSBzZW5zb3IgaXMgcG9pbnRpbmcgdG8sIGlmIHRoZSBmaWVsZCBpcyBzbWFsbGVyIHRoYW4gMipQSSwgT1Igd2hlcmUgdGhlIHNlbnNvciBpcyBsb2NhdGVkIElGIE5PVCB5X3NlbnNvciA9IDBcbiAgSW4gZGlyZWN0aW9uIG9mIHRoZSBleWVzcG90OiBJRiBUSEVSRSBJUyBBTiBFWUVTUE9ULCB0aGVuIGluIHRoZSBkaXJlY3Rpb24gdGhhdCBpdCBpcyBsb2NhdGVkIGF0LlxuICBUaGUgZGVjaWRpbmcgZmFjdG9yIGlzIHRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHNlbnNvciBvcmllbnRhdGlvbiwgcG9zaXRpb24gb3Igb2YgdGhlIGV5ZXNwb3QgcG9zaXRpb246XG4gIC0geSA9IDA6IFdlIGhhdmUgbm8gc2V0IGRpcmVjdGlvbi5cbiAgLSB5ID4gMDogY291bnRlci1jbG9ja3dpc2UgZGlyZWN0aW9uIChpLmUuIHBvc2l0aXZlIGFuZ2xlcylcbiAgLSB5IDwgMDogY2xvY2t3aXNlIGRpcmVjdGlvbiAoaS5lLiBuZWdhdGl2ZSBhbmdsZXMpXG5cbiAgSWYgZGlyZWN0aW9uIGlzIFwiVE9XQVJEU1wiLCB0aGVuIHRoZSBmbGlwUm90YXRpb25EaXIgaXMgcG9zaXRpdmUsIGFuZCBuZWdhdGl2ZSBvdGhlcndpc2UuXG4gICovXG4gdmFyIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiQVdBWVwiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJUT1dBUkRTXCI6XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAtMTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGNvZGUgPSAnJztcblxuICBpZiAob2JqZWN0ID09ICdTRU5TT1InKSB7XG4gICAgY29kZSArPSAndmFyIHJvdGF0aW9uRGlyID0gMDsgXFxcbiAgICBpZiAoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoKSB7IFxcXG4gICAgICBpZiAoRXVnQm9keS5saWdodFNlbnNvcnNbMF0uZmllbGQgPT0gMipNYXRoLlBJKSB7IFxcXG4gICAgICAgIHJvdGF0aW9uRGlyID0gRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueTsgXFxcbiAgICAgIH0gZWxzZSB7IFxcXG4gICAgICAgIHJvdGF0aW9uRGlyID0gRXVnQm9keS5saWdodFNlbnNvcnNbMF0ub3JpZW50YXRpb24ueTsgXFxcbiAgICAgIH0gfSc7XG4gIH0gZWxzZSBpZiAob2JqZWN0ID09ICdTUE9UJykge1xuICAgIGNvZGUgKz0gJ3ZhciByb3RhdGlvbkRpciA9IDA7IFxcXG4gICAgaWYgKEV1Z0JvZHkuc3BvdFBvc2l0aW9ucy5sZW5ndGg9PTEpIHsgXFxcbiAgICAgIHJvdGF0aW9uRGlyID0gRXVnQm9keS5zcG90UG9zaXRpb25zWzBdLnk7IH0nO1xuICB9XG5cbiAgdmFyIFRVUk5fTUFYID0gMjtcbiAgY29kZSArPSAndmFyIGxpZ2h0RGlmZiA9JyArICdjYWxjSW50ZW5zaXR5JyArICcqIEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGg7JztcbiAgY29kZSArPSAnZGVsdGFfeWF3ICs9IHJvdGF0aW9uRGlyIConICsgIGZsaXBSb3RhdGlvbkRpciArICcqIE1hdGguYWJzKEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGggKiBsaWdodERpZmYpICogZFQ7JztcblxuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3R1cm5fYXRfMnNlbnNvcnMnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcblxuICB2YXIgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJBV0FZXCI6XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAtMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJUT1dBUkRTXCI6XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAxO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICd2YXIgcm90YXRpb25EaXIgPSAwOyc7XG5cbiAgY29kZSArPSAncm90YXRpb25EaXIgPSAoc2Vuc29ySW50ZW5zaXRpZXNbMV0gLSBzZW5zb3JJbnRlbnNpdGllc1swXSkgPCAwID8gRXVnQm9keS5saWdodFNlbnNvcnNbMV0ucG9zaXRpb24ueSA6IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLnBvc2l0aW9uLnk7JztcblxuICB2YXIgVFVSTl9NQVggPSAyO1xuICBjb2RlICs9ICd2YXIgbGlnaHREaWZmID0nICsgJ2NhbGNJbnRlbnNpdHknICsgJyogRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsnO1xuICBjb2RlICs9ICdkZWx0YV95YXcgKz0gcm90YXRpb25EaXIgKicgKyAgZmxpcFJvdGF0aW9uRGlyICsgJyogTWF0aC5hYnMoRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aCAqIGxpZ2h0RGlmZikgKiBkVDsnO1xuXG4gIHJldHVybiBjb2RlO1xufTtcblxuXG4vLyBDT05ESVRJT05TICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydtYXN0ZXJfYmxvY2snXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkZWZhdWx0Q29kZSA9IFwidmFyIGNhbGNJbnRlbnNpdHkgPSAoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoPjEpID8gbGlnaHRJbmZvLmRpZmZCdHdTZW5zb3JzIDogbGlnaHRJbmZvLmN1cnJlbnRMZXZlbFswXTtcIiAvLyBIRVJFIFdSSVRFIFRIRSBDT1JFIExJR0hUIC0gMSBFWUUgT1IgMiBFWUVTLiBUSElTIENBTiBUSEVOIEJFIE1PRElGSUVEIFdJVEggVEhFIERST1AtRE9XTiEgLSBXUklURSBBTEwgT1RIRVIgQ09ERSBTVUNIIFRIQVQgSVQgVEFLRVMgVEhJUyBMSUdIVCBNRUFTVVJFLlxuICB2YXIgYWxsX2NvZGUgPSBCbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSBkZWZhdWx0Q29kZSArIGFsbF9jb2RlO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3NlZV9saWdodF9xdWFudGl0eSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHRocmVzaG9sZF9wZXJjZW50YWdlID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnVEhSRVNIT0xEJyk7XG4gIHZhciBzdGF0ZW1lbnRzX2NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ0NPREUnKTtcbiAgdGhyZXNob2xkX3BlcmNlbnRhZ2UgPSB0aHJlc2hvbGRfcGVyY2VudGFnZS5zcGxpdCgnXycpWzFdO1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICB2YXIgY29kZSA9ICdpZiAoKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aD4xICYmIE1hdGguYWJzKGxpZ2h0SW5mby5kaWZmQnR3U2Vuc29ycykgPiAnICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApIHx8IFxcXG4gICAgICAgICAgICAgKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aCA9PSAxICYmIE1hdGguYWJzKGxpZ2h0SW5mby5kaWZmTm93VG9BZGFwdExldmVsKSA+JyArIHRocmVzaG9sZF9wZXJjZW50YWdlICsgJy8gMTAwKSkgeycgKyBzdGF0ZW1lbnRzX2NvZGUgKyAnfSc7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnc2VlX2xpZ2h0J10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3RhdGVtZW50c19jb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdDT0RFJyk7XG4gIHZhciB0aHJlc2hvbGRfcGVyY2VudGFnZSA9IDAuMTtcbiAgLy8gQWx0ZXJuYXRpdmVseSwgdXNlIHRoZSB0aHJlc2hvbGQgRXVnQm9keS5kZWZhdWx0cy5zZW5zaXRpdml0eV90aHJlc2hvbGRcbiAgdmFyIGNvZGUgPSAnaWYgKChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGg+MSAmJiBNYXRoLmFicyhsaWdodEluZm8uZGlmZkJ0d1NlbnNvcnMpID4gJyArIHRocmVzaG9sZF9wZXJjZW50YWdlICsgJy8gMTAwKSB8fCBcXFxuICAgICAgICAgICAgIChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGggPT0gMSAmJiBNYXRoLmFicyhsaWdodEluZm8uZGlmZk5vd1RvQWRhcHRMZXZlbCkgPicgKyB0aHJlc2hvbGRfcGVyY2VudGFnZSArICcvIDEwMCkpIHsnICsgc3RhdGVtZW50c19jb2RlICsgJ30nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ25vX2xpZ2h0J10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3RhdGVtZW50c19jb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdDT0RFJyk7XG4gIC8vIEFsdGVybmF0aXZlbHksIHVzZSB0aGUgdGhyZXNob2xkIEV1Z0JvZHkuZGVmYXVsdHMuc2Vuc2l0aXZpdHlfdGhyZXNob2xkXG4gIHZhciB0aHJlc2hvbGRfcGVyY2VudGFnZSA9IDAuMjtcbiAgLy8gQWx0ZXJuYXRpdmVseSwgdXNlIHRoZSB0aHJlc2hvbGQgRXVnQm9keS5kZWZhdWx0cy5zZW5zaXRpdml0eV90aHJlc2hvbGRcbiAgdmFyIGNvZGUgPSAnaWYgKChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGg+MSAmJiBNYXRoLmFicyhsaWdodEluZm8uZGlmZkJ0d1NlbnNvcnMpIDwgJyArIHRocmVzaG9sZF9wZXJjZW50YWdlICsgJy8gMTAwKSB8fCBcXFxuICAgICAgICAgICAgIChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGggPT0gMSAmJiBNYXRoLmFicyhsaWdodEluZm8uZGlmZk5vd1RvQWRhcHRMZXZlbCkgPCcgKyB0aHJlc2hvbGRfcGVyY2VudGFnZSArICcvIDEwMCkpIHsnICsgc3RhdGVtZW50c19jb2RlICsgJ30nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ2VpdGhlcl93YXknXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBjb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdDT0RFJyk7XG4gIC8vIEFsdGVybmF0aXZlbHksIHVzZSB0aGUgdGhyZXNob2xkIEV1Z0JvZHkuZGVmYXVsdHMuc2Vuc2l0aXZpdHlfdGhyZXNob2xkXG4gIHJldHVybiBjb2RlO1xufTtcbiJdfQ==
