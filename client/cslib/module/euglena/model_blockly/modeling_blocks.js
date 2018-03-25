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
}, { "type": "move_normal",
  "message0": "Move with normal speed",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 1,
  "tooltip": "Tell the the model to move forward with the speed that you defined for the body.",
  "helpUrl": ""
}, { "type": "move_change",
  "message0": "Move %1 by %2",
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
  "colour": 270,
  "tooltip": "Tell the model to move faster or slower. E.g. move faster by 50% means 'increase your forward speed by 50% of your current speed'",
  "helpUrl": ""
}, { "type": "move_stop",
  "message0": "Stop moving forward",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 270,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "roll_normal",
  "message0": "Rotate at normal speed",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "roll_change",
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
  "tooltip": "Tell the model to rotate faster around its axis. E.g. Rotate faster by 50% means 'increase your rotate speed by 50% of your current speed'",
  "helpUrl": ""
}, { "type": "roll_stop",
  "message0": "Stop rotating",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_randomly",
  "message0": "Turn randomly by %1 %2",
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
  "colour": 218,
  "tooltip": "Tell the model to turn randomly left or right by a certain amount.",
  "helpUrl": ""
}, { "type": "turn_lr",
  "message0": "Turn %1",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["left", "LEFT"], ["right", "RIGHT"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 218,
  "tooltip": "Tell the model to turn left or right. How fast it turns depends on the response strength of the body and the light intensity.",
  "helpUrl": ""
}, { "type": "turn_at_1sensor",
  "message0": "Turn %1 the sensor",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["away from", "AWAY"], ["towards", "TOWARDS"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 218,
  "tooltip": "This block is only active when there is one sensor; tell the model to turn based on where the sensor is. How fast it turns depends on the response strength of the body and the light intensity.",
  "helpUrl": ""
}, { "type": "turn_at_1sensor_eyespot",
  "message0": "Turn %1 %2",
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
  "colour": 218,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_at_2sensors",
  "message0": "Turn %1 %2 sensor detecting more light",
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
  "colour": 218,
  "tooltip": "This block is only active when there are two sensors; tell the model to turn based on how much light each sensor detects. How fast it turns depends on the response strength of the body and the light intensity.",
  "helpUrl": ""
}, { "type": "see_light_quantity",
  "message0": "If the detected light is %1: %2 %3",
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
  "tooltip": "You can pull this block into the container block that says 'If it detects light'. The model will only execute the blocks in this container if the detected light is strong enough.",
  "helpUrl": ""
}]);

window.Blockly.Blocks['master_block'] = {
  init: function init() {
    this.appendDummyInput().appendField("Put all the blocks in here:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setColour(230);
    this.setDeletable(false);
    this.setTooltip("You can pull any block from the toolbox above, and drag it into one of the three purple container blocks.");
    this.setHelpUrl("");
  }
};

window.Blockly.Blocks['see_light'] = {
  init: function init() {
    this.appendDummyInput().appendField("If it detects light:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(false, null);
    this.setColour(1);
    this.setDeletable(false);
    this.setMovable(false);
    this.setTooltip("Put any block in here to be executed if the model detects light.");
    this.setHelpUrl("");
  }
};

window.Blockly.Blocks['no_light'] = {
  init: function init() {
    this.appendDummyInput().appendField("If it detects no light:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(1);
    this.setDeletable(false);
    this.setMovable(false);
    this.setTooltip("Put any block in here to be executed if the model does not detect light.");
    this.setHelpUrl("");
  }
};

window.Blockly.Blocks['either_way'] = {
  init: function init() {
    this.appendDummyInput().appendField("Independent of whether it detects light or not:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(1);
    this.setDeletable(false);
    this.setMovable(false);
    this.setTooltip("Put any block in here to be executed independently of whethere the model detects light or not.");
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

window.Blockly.JavaScript['move_change'] = function (block) {
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

window.Blockly.JavaScript['roll_change'] = function (block) {
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

Blockly.JavaScript['move_stop'] = function (block) {
  var code = 'fw_speed = 0;';
  return code;
};

Blockly.JavaScript['move_normal'] = function (block) {
  var code = 'fw_speed = EugBody.fw_speed;';
  return code;
};

Blockly.JavaScript['roll_normal'] = function (block) {
  var code = 'roll_speed = EugBody.roll_speed;';
  return code;
};

Blockly.JavaScript['roll_stop'] = function (block) {
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
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.currentLevel[0]) >' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};

window.Blockly.JavaScript['see_light'] = function (block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  var threshold_percentage = 5;
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) > ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.currentLevel[0]) >' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};

window.Blockly.JavaScript['no_light'] = function (block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var threshold_percentage = 5;
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) < ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.currentLevel[0]) <' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};

window.Blockly.JavaScript['either_way'] = function (block) {
  var code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  return code;
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kZWxpbmdfYmxvY2tzLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIkJsb2NrbHkiLCJkZWZpbmVCbG9ja3NXaXRoSnNvbkFycmF5IiwiQmxvY2tzIiwiaW5pdCIsImFwcGVuZER1bW15SW5wdXQiLCJhcHBlbmRGaWVsZCIsImFwcGVuZFN0YXRlbWVudElucHV0Iiwic2V0Q2hlY2siLCJzZXRJbnB1dHNJbmxpbmUiLCJzZXRDb2xvdXIiLCJzZXREZWxldGFibGUiLCJzZXRUb29sdGlwIiwic2V0SGVscFVybCIsInNldFByZXZpb3VzU3RhdGVtZW50Iiwic2V0TmV4dFN0YXRlbWVudCIsInNldE1vdmFibGUiLCJKYXZhU2NyaXB0IiwiYmxvY2siLCJxdWFudGl0eSIsInZhbHVlVG9Db2RlIiwiT1JERVJfTk9ORSIsInJhbmRvbUNvZWZmIiwicmFuZG9tRmFjdG9yIiwiY29kZSIsImZhY3RvciIsImdldEZpZWxkVmFsdWUiLCJwcm9wX3RvIiwibWFnbml0dWRlIiwicGVyY2VudGFnZSIsIm51bWJlciIsInNwZWVkIiwiZGlyZWN0aW9uIiwiYWRkc3Vic3RyYWN0Iiwic3BsaXQiLCJ2YWx1ZV9tYWduaXR1ZGUiLCJmbGlwUm90YXRpb25EaXIiLCJUVVJOX01BWCIsIm9iamVjdCIsImRlZmF1bHRDb2RlIiwiYWxsX2NvZGUiLCJzdGF0ZW1lbnRUb0NvZGUiLCJ0aHJlc2hvbGRfcGVyY2VudGFnZSIsInN0YXRlbWVudHNfY29kZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxDQUFlQyx5QkFBZixDQUF5QyxDQUN2QyxFQUFFLFFBQVEsZUFBVjtBQUNFLGNBQVksb0JBRGQ7QUFFRSxXQUFTLENBQ1A7QUFDRSxZQUFRO0FBRFYsR0FETyxFQUlQO0FBQ0UsWUFBUSxhQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsYUFBUyxDQUNQLFFBRE8sRUFFUCxRQUZPLEVBR1AsZUFITyxFQUlQLGVBSk8sRUFLUCxv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U0FBT25CLElBQVA7QUFDRCxDQVJEOztBQVVBeEIsT0FBT0MsT0FBUCxDQUFlZ0IsVUFBZixDQUEwQixZQUExQixJQUEwQyxVQUFTQyxLQUFULEVBQWdCO0FBQ3hELE1BQUlNLE9BQU94QixPQUFPQyxPQUFQLENBQWVnQixVQUFmLENBQTBCd0IsZUFBMUIsQ0FBMEN2QixLQUExQyxFQUFpRCxNQUFqRCxDQUFYO0FBQ0E7QUFDQSxTQUFPTSxJQUFQO0FBQ0QsQ0FKRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L21vZGVsaW5nX2Jsb2Nrcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5CbG9ja2x5LmRlZmluZUJsb2Nrc1dpdGhKc29uQXJyYXkoW1xuICB7IFwidHlwZVwiOiBcIm1vZGlmaWVyX3JhbmRcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwibW9yZSBvciBsZXNzICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3ZhbHVlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlFVQU5UXCIsXG4gICAgICAgIFwiY2hlY2tcIjogW1xuICAgICAgICAgIFwiTnVtYmVyXCIsXG4gICAgICAgICAgXCJTdHJpbmdcIixcbiAgICAgICAgICBcIm1vZGlmaWVyX3Byb2JcIixcbiAgICAgICAgICBcIm1vZGlmaWVyX3JhbmRcIixcbiAgICAgICAgICBcInF1YW50X3Byb3BfMXNlbnNvclwiLFxuICAgICAgICAgIFwicXVhbnRfcHJvcF8yc2Vuc29yc1wiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxODAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJxdWFsX2Fic29sdXRlXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIiUxXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBzbWFsbCBhbW91bnRcIixcbiAgICAgICAgICAgIFwiU01BTExcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIG1lZGl1bSBhbW91bnRcIixcbiAgICAgICAgICAgIFwiTUVESVVNXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBsYXJnZSBhbW91bnRcIixcbiAgICAgICAgICAgIFwiTEFSR0VcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxODAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJxdWFudF9wcm9wXzFzZW5zb3JcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiYW1vdW50IHByb3AuIHRvICUxXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkZBQ1RPUlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZGlmZiBpbiBsaWdodCBzZWVuIG5vdyB2cyBiZWZvcmVcIixcbiAgICAgICAgICAgIFwiTElHSFRfRElGRlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImxpZ2h0IHNlZW4gbm93XCIsXG4gICAgICAgICAgICBcIkxJR0hUX05PV1wiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImdlbmVyYWwgbGV2ZWwgb2YgYnJpZ2h0bmVzc1wiLFxuICAgICAgICAgICAgXCJMSUdIVF9BVkdcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcIm91dHB1dFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDE4MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInF1YW50X3Byb3BfMnNlbnNvcnNcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiYW1vdW50IHByb3BvcnRpb25hbCB0byB0aGUgJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRkFDVE9SXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJkaWZmZXJlbmNlIGJldHdlZW4gbGVmdCBhbmQgcmlnaHQgc2Vuc29yc1wiLFxuICAgICAgICAgICAgXCJMSUdIVF9ESUZGXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwicGVyY2VpdmVkIGxpZ2h0IG9mIHJpZ2h0IHNlbnNvclwiLFxuICAgICAgICAgICAgXCJMSUdIVF9SSUdIVFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInBlcmNlaXZlZCBsaWdodCBvZiBsZWZ0IHNlbnNvclwiLFxuICAgICAgICAgICAgXCJMSUdIVF9MRUZUXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZ2VuZXJhbCBsZXZlbCBvZiBicmlnaHRuZXNzXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0FWR1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwib3V0cHV0XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMTgwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwibW92ZV9ub3JtYWxcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiTW92ZSB3aXRoIG5vcm1hbCBzcGVlZFwiLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDEsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVsbCB0aGUgdGhlIG1vZGVsIHRvIG1vdmUgZm9yd2FyZCB3aXRoIHRoZSBzcGVlZCB0aGF0IHlvdSBkZWZpbmVkIGZvciB0aGUgYm9keS5cIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcIm1vdmVfY2hhbmdlXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIk1vdmUgJTEgYnkgJTJcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJmYXN0ZXJcIixcbiAgICAgICAgICAgIFwiRkFTVEVSXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwic2xvd2VyXCIsXG4gICAgICAgICAgICBcIlNMT1dFUlwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJTUEVFRFwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiMjUgcGVyY2VudFwiLFxuICAgICAgICAgICAgXCJDSEFOR0VfMjVcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCI1MCBwZXJjZW50XCIsXG4gICAgICAgICAgICBcIkNIQU5HRV81MFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIjc1IHBlcmNlbnRcIixcbiAgICAgICAgICAgIFwiQ0hBTkdFXzc1XCJcbiAgICAgICAgICBdLFxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyNzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVsbCB0aGUgbW9kZWwgdG8gbW92ZSBmYXN0ZXIgb3Igc2xvd2VyLiBFLmcuIG1vdmUgZmFzdGVyIGJ5IDUwJSBtZWFucyAnaW5jcmVhc2UgeW91ciBmb3J3YXJkIHNwZWVkIGJ5IDUwJSBvZiB5b3VyIGN1cnJlbnQgc3BlZWQnXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJtb3ZlX3N0b3BcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiU3RvcCBtb3ZpbmcgZm9yd2FyZFwiLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDI3MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInJvbGxfbm9ybWFsXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlJvdGF0ZSBhdCBub3JtYWwgc3BlZWRcIixcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInJvbGxfY2hhbmdlXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlJvdGF0ZSAlMSBieSAlMiAlMyBwZXJjZW50XCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZmFzdGVyXCIsXG4gICAgICAgICAgICBcIkZBU1RFUlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNsb3dlclwiLFxuICAgICAgICAgICAgXCJTTE9XRVJcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfbnVtYmVyXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlNQRUVEXCIsXG4gICAgICAgIFwidmFsdWVcIjogMCxcbiAgICAgICAgXCJtaW5cIjogMCxcbiAgICAgICAgXCJtYXhcIjogMTAwLFxuICAgICAgICBcInByZWNpc2lvblwiOiAyNVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVsbCB0aGUgbW9kZWwgdG8gcm90YXRlIGZhc3RlciBhcm91bmQgaXRzIGF4aXMuIEUuZy4gUm90YXRlIGZhc3RlciBieSA1MCUgbWVhbnMgJ2luY3JlYXNlIHlvdXIgcm90YXRlIHNwZWVkIGJ5IDUwJSBvZiB5b3VyIGN1cnJlbnQgc3BlZWQnXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJyb2xsX3N0b3BcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiU3RvcCByb3RhdGluZ1wiLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9yYW5kb21seVwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuIHJhbmRvbWx5IGJ5ICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBsaXR0bGVcIixcbiAgICAgICAgICAgIFwiU01BTExcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIG1vZGVyYXRlIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJNRURJVU1cIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIGxvdFwiLFxuICAgICAgICAgICAgXCJMQVJHRVwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTgsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVsbCB0aGUgbW9kZWwgdG8gdHVybiByYW5kb21seSBsZWZ0IG9yIHJpZ2h0IGJ5IGEgY2VydGFpbiBhbW91bnQuXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJ0dXJuX2xyXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlR1cm4gJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJsZWZ0XCIsXG4gICAgICAgICAgICBcIkxFRlRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJyaWdodFwiLFxuICAgICAgICAgICAgXCJSSUdIVFwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTgsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVsbCB0aGUgbW9kZWwgdG8gdHVybiBsZWZ0IG9yIHJpZ2h0LiBIb3cgZmFzdCBpdCB0dXJucyBkZXBlbmRzIG9uIHRoZSByZXNwb25zZSBzdHJlbmd0aCBvZiB0aGUgYm9keSBhbmQgdGhlIGxpZ2h0IGludGVuc2l0eS5cIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInR1cm5fYXRfMXNlbnNvclwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuICUxIHRoZSBzZW5zb3JcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhd2F5IGZyb21cIixcbiAgICAgICAgICAgIFwiQVdBWVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInRvd2FyZHNcIixcbiAgICAgICAgICAgIFwiVE9XQVJEU1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTgsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGhpcyBibG9jayBpcyBvbmx5IGFjdGl2ZSB3aGVuIHRoZXJlIGlzIG9uZSBzZW5zb3I7IHRlbGwgdGhlIG1vZGVsIHRvIHR1cm4gYmFzZWQgb24gd2hlcmUgdGhlIHNlbnNvciBpcy4gSG93IGZhc3QgaXQgdHVybnMgZGVwZW5kcyBvbiB0aGUgcmVzcG9uc2Ugc3RyZW5ndGggb2YgdGhlIGJvZHkgYW5kIHRoZSBsaWdodCBpbnRlbnNpdHkuXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJ0dXJuX2F0XzFzZW5zb3JfZXllc3BvdFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYXdheSBmcm9tIHRoZVwiLFxuICAgICAgICAgICAgXCJBV0FZXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwidG93YXJkcyB0aGVcIixcbiAgICAgICAgICAgIFwiVE9XQVJEU1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJPQkpFQ1RcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNlbnNvclwiLFxuICAgICAgICAgICAgXCJTRU5TT1JcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJleWVzcG90XCIsXG4gICAgICAgICAgICBcIlNQT1RcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfV0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMjE4LFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9hdF8yc2Vuc29yc1wiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuICUxICUyIHNlbnNvciBkZXRlY3RpbmcgbW9yZSBsaWdodFwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJESVJFQ1RJT05cIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImF3YXkgZnJvbSB0aGVcIixcbiAgICAgICAgICAgIFwiQVdBWVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInRvd2FyZHMgdGhlXCIsXG4gICAgICAgICAgICBcIlRPV0FSRFNcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfV0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogZmFsc2UsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDIxOCxcbiAgICBcInRvb2x0aXBcIjogXCJUaGlzIGJsb2NrIGlzIG9ubHkgYWN0aXZlIHdoZW4gdGhlcmUgYXJlIHR3byBzZW5zb3JzOyB0ZWxsIHRoZSBtb2RlbCB0byB0dXJuIGJhc2VkIG9uIGhvdyBtdWNoIGxpZ2h0IGVhY2ggc2Vuc29yIGRldGVjdHMuIEhvdyBmYXN0IGl0IHR1cm5zIGRlcGVuZHMgb24gdGhlIHJlc3BvbnNlIHN0cmVuZ3RoIG9mIHRoZSBib2R5IGFuZCB0aGUgbGlnaHQgaW50ZW5zaXR5LlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwic2VlX2xpZ2h0X3F1YW50aXR5XCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIklmIHRoZSBkZXRlY3RlZCBsaWdodCBpcyAlMTogJTIgJTNcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiVEhSRVNIT0xEXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJzbWFsbFwiLFxuICAgICAgICAgICAgXCJUSFJFU0hfMjBcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJtZWRpdW1cIixcbiAgICAgICAgICAgIFwiVEhSRVNIXzQwXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwibGFyZ2VcIixcbiAgICAgICAgICAgIFwiVEhSRVNIXzYwXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJDT0RFXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyNzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiWW91IGNhbiBwdWxsIHRoaXMgYmxvY2sgaW50byB0aGUgY29udGFpbmVyIGJsb2NrIHRoYXQgc2F5cyAnSWYgaXQgZGV0ZWN0cyBsaWdodCcuIFRoZSBtb2RlbCB3aWxsIG9ubHkgZXhlY3V0ZSB0aGUgYmxvY2tzIGluIHRoaXMgY29udGFpbmVyIGlmIHRoZSBkZXRlY3RlZCBsaWdodCBpcyBzdHJvbmcgZW5vdWdoLlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH1cbl0pO1xuXG53aW5kb3cuQmxvY2tseS5CbG9ja3NbJ21hc3Rlcl9ibG9jayddID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGVuZER1bW15SW5wdXQoKVxuICAgICAgICAuYXBwZW5kRmllbGQoXCJQdXQgYWxsIHRoZSBibG9ja3MgaW4gaGVyZTpcIik7XG4gICAgdGhpcy5hcHBlbmRTdGF0ZW1lbnRJbnB1dChcIkNPREVcIilcbiAgICAgICAgLnNldENoZWNrKG51bGwpO1xuICAgIHRoaXMuc2V0SW5wdXRzSW5saW5lKGZhbHNlKTtcbiAgICB0aGlzLnNldENvbG91cigyMzApO1xuICAgIHRoaXMuc2V0RGVsZXRhYmxlKGZhbHNlKTtcbiB0aGlzLnNldFRvb2x0aXAoXCJZb3UgY2FuIHB1bGwgYW55IGJsb2NrIGZyb20gdGhlIHRvb2xib3ggYWJvdmUsIGFuZCBkcmFnIGl0IGludG8gb25lIG9mIHRoZSB0aHJlZSBwdXJwbGUgY29udGFpbmVyIGJsb2Nrcy5cIik7XG4gdGhpcy5zZXRIZWxwVXJsKFwiXCIpO1xuICB9XG59O1xuXG53aW5kb3cuQmxvY2tseS5CbG9ja3NbJ3NlZV9saWdodCddID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGVuZER1bW15SW5wdXQoKVxuICAgICAgICAuYXBwZW5kRmllbGQoXCJJZiBpdCBkZXRlY3RzIGxpZ2h0OlwiKTtcbiAgICB0aGlzLmFwcGVuZFN0YXRlbWVudElucHV0KFwiQ09ERVwiKVxuICAgICAgICAuc2V0Q2hlY2sobnVsbCk7XG4gICAgdGhpcy5zZXRJbnB1dHNJbmxpbmUoZmFsc2UpO1xuICAgIHRoaXMuc2V0UHJldmlvdXNTdGF0ZW1lbnQodHJ1ZSxudWxsKTtcbiAgICB0aGlzLnNldE5leHRTdGF0ZW1lbnQoZmFsc2UsbnVsbCk7XG4gICAgdGhpcy5zZXRDb2xvdXIoMSk7XG4gICAgdGhpcy5zZXREZWxldGFibGUoZmFsc2UpO1xuICAgIHRoaXMuc2V0TW92YWJsZShmYWxzZSk7XG4gdGhpcy5zZXRUb29sdGlwKFwiUHV0IGFueSBibG9jayBpbiBoZXJlIHRvIGJlIGV4ZWN1dGVkIGlmIHRoZSBtb2RlbCBkZXRlY3RzIGxpZ2h0LlwiKTtcbiB0aGlzLnNldEhlbHBVcmwoXCJcIik7XG4gIH1cbn07XG5cbndpbmRvdy5CbG9ja2x5LkJsb2Nrc1snbm9fbGlnaHQnXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hcHBlbmREdW1teUlucHV0KClcbiAgICAgICAgLmFwcGVuZEZpZWxkKFwiSWYgaXQgZGV0ZWN0cyBubyBsaWdodDpcIik7XG4gICAgdGhpcy5hcHBlbmRTdGF0ZW1lbnRJbnB1dChcIkNPREVcIilcbiAgICAgICAgLnNldENoZWNrKG51bGwpO1xuICAgIHRoaXMuc2V0SW5wdXRzSW5saW5lKGZhbHNlKTtcbiAgICB0aGlzLnNldFByZXZpb3VzU3RhdGVtZW50KHRydWUsbnVsbCk7XG4gICAgdGhpcy5zZXROZXh0U3RhdGVtZW50KHRydWUsbnVsbCk7XG4gICAgdGhpcy5zZXRDb2xvdXIoMSk7XG4gICAgdGhpcy5zZXREZWxldGFibGUoZmFsc2UpO1xuICAgIHRoaXMuc2V0TW92YWJsZShmYWxzZSk7XG4gdGhpcy5zZXRUb29sdGlwKFwiUHV0IGFueSBibG9jayBpbiBoZXJlIHRvIGJlIGV4ZWN1dGVkIGlmIHRoZSBtb2RlbCBkb2VzIG5vdCBkZXRlY3QgbGlnaHQuXCIpO1xuIHRoaXMuc2V0SGVscFVybChcIlwiKTtcbiAgfVxufTtcblxud2luZG93LkJsb2NrbHkuQmxvY2tzWydlaXRoZXJfd2F5J10gPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYXBwZW5kRHVtbXlJbnB1dCgpXG4gICAgICAgIC5hcHBlbmRGaWVsZChcIkluZGVwZW5kZW50IG9mIHdoZXRoZXIgaXQgZGV0ZWN0cyBsaWdodCBvciBub3Q6XCIpO1xuICAgIHRoaXMuYXBwZW5kU3RhdGVtZW50SW5wdXQoXCJDT0RFXCIpXG4gICAgICAgIC5zZXRDaGVjayhudWxsKTtcbiAgICB0aGlzLnNldElucHV0c0lubGluZShmYWxzZSk7XG4gICAgdGhpcy5zZXRQcmV2aW91c1N0YXRlbWVudCh0cnVlLG51bGwpO1xuICAgIHRoaXMuc2V0TmV4dFN0YXRlbWVudCh0cnVlLG51bGwpO1xuICAgIHRoaXMuc2V0Q29sb3VyKDEpO1xuICAgIHRoaXMuc2V0RGVsZXRhYmxlKGZhbHNlKTtcbiAgICB0aGlzLnNldE1vdmFibGUoZmFsc2UpO1xuIHRoaXMuc2V0VG9vbHRpcChcIlB1dCBhbnkgYmxvY2sgaW4gaGVyZSB0byBiZSBleGVjdXRlZCBpbmRlcGVuZGVudGx5IG9mIHdoZXRoZXJlIHRoZSBtb2RlbCBkZXRlY3RzIGxpZ2h0IG9yIG5vdC5cIik7XG4gdGhpcy5zZXRIZWxwVXJsKFwiXCIpO1xuICB9XG59O1xuXG5cbi8vIFFVQU5USVRJRVMgQU5EIE1BR05JVFVERVNcbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ21vZGlmaWVyX3JhbmQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBxdWFudGl0eSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQudmFsdWVUb0NvZGUoYmxvY2ssJ1FVQU5UJyx3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkUpO1xuICB2YXIgcmFuZG9tQ29lZmYgPSAwLjE7XG4gIHZhciByYW5kb21GYWN0b3IgPSAnMSArIFstMSwxXVtNYXRoLnJhbmRvbSgpKjJ8MF0qTWF0aC5yYW5kb20oKSAqJyArIHJhbmRvbUNvZWZmO1xuICB2YXIgY29kZSA9IHJhbmRvbUZhY3RvciAgKyAnKicgKyBxdWFudGl0eTtcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbnRfcHJvcF8xc2Vuc29yJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZmFjdG9yID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRkFDVE9SJyk7XG5cbiAgdmFyIHByb3BfdG8gPSBudWxsO1xuICBzd2l0Y2ggKGZhY3Rvcikge1xuICAgIGNhc2UgXCJMSUdIVF9ESUZGXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5kaWZmTm93VG9BZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMSUdIVF9OT1dcIjpcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmN1cnJlbnRMZXZlbFswXSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfQVZHXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5hZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICB9XG4gIHZhciBjb2RlID0gcHJvcF90bztcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbnRfcHJvcF8yc2Vuc29ycyddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGZhY3RvciA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0ZBQ1RPUicpO1xuXG4gIHZhciBwcm9wX3RvID0gMDtcbiAgc3dpdGNoIChmYWN0b3IpIHtcbiAgICBjYXNlIFwiTElHSFRfRElGRlwiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uZGlmZk5vd1RvQWRhcHRMZXZlbCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfUklHSFRcIjogLy8geSA9IC0xXG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5jdXJyZW50TGV2ZWxbRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueSA8IDAgPyAwIDogMV0nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxpR0hUX0xFRlRcIjogLy8geSA9IDFcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmN1cnJlbnRMZXZlbFtFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55ID4gMCA/IDAgOiAxXSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfQVZHXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5hZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICB9XG4gIHZhciBjb2RlID0gcHJvcF90bztcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbF9hYnNvbHV0ZSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIG1hZ25pdHVkZSA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ01BR05JVFVERScpO1xuICAvLyBUaGUgbWFnbml0dWRlcyBnZXQgdHJhbnNsYXRlZCBpbiBwZXJjZW50YWdlcyBvZiB0aGUgY29ycmVzcG9uZGluZyBjb3JlIHZhbHVlcyAoZndfc3BlZWQsIHJvbGxfc3BlZWQsIHJlYWN0aW9uX3N0cmVuZ3RoKVxuICAvLyBvciBvZiB2YWx1ZXMgZGVmaW5lZCBmb3IgZWFjaCB0eXBlIG9mIHJlYWN0aW9uXG4gIHZhciBwZXJjZW50YWdlID0gMDtcbiAgc3dpdGNoIChtYWduaXR1ZGUpIHtcbiAgICBjYXNlIFwiVkVSWV9TTUFMTFwiOlxuICAgICAgcGVyY2VudGFnZSA9IDAuMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJTTUFMTFwiOlxuICAgICAgcGVyY2VudGFnZSA9IDAuNDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJNRURJVU1cIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAwLjc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTEFSR0VcIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAxLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVkVSWV9MQVJHRVwiOlxuICAgICAgcGVyY2VudGFnZSA9IDEuMztcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGNvZGUgPSAnJyArIHBlcmNlbnRhZ2U7XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ21hdGhfbnVtYmVyJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgbnVtYmVyID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnTlVNJyk7XG4gIHZhciBjb2RlID0gbnVtYmVyO1xuICByZXR1cm4gW2NvZGUsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORV07XG59O1xuXG4vLyBBQ1RJT05TIEFORCBCRUhBVklPUlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ21vdmVfY2hhbmdlJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3BlZWQgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdTUEVFRCcpO1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG5cbiAgdmFyIGFkZHN1YnN0cmFjdCA9IDA7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiRkFTVEVSXCI6XG4gICAgICBhZGRzdWJzdHJhY3QgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlNMT1dFUlwiOlxuICAgICAgYWRkc3Vic3RyYWN0ID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuICB2YXIgY29kZSA9ICdmd19zcGVlZCArPScgKyBhZGRzdWJzdHJhY3QgKyAnKicgKyBzcGVlZC5zcGxpdCgnXycpWzFdICsgJy8gMTAwICogZndfc3BlZWQ7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydyb2xsX2NoYW5nZSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHNwZWVkID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnU1BFRUQnKTtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuXG4gIHZhciBhZGRzdWJzdHJhY3QgPSAwO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkZBU1RFUlwiOlxuICAgICAgYWRkc3Vic3RyYWN0ID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJTTE9XRVJcIjpcbiAgICAgIGFkZHN1YnN0cmFjdCA9IC0xO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICdyb2xsX3NwZWVkICs9JyArIGFkZHN1YnN0cmFjdCArICcqJyArIHNwZWVkICsgJy8gMTAwICogcm9sbF9zcGVlZDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsnbW92ZV9zdG9wJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9ICdmd19zcGVlZCA9IDA7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG5CbG9ja2x5LkphdmFTY3JpcHRbJ21vdmVfbm9ybWFsJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9ICdmd19zcGVlZCA9IEV1Z0JvZHkuZndfc3BlZWQ7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG5CbG9ja2x5LkphdmFTY3JpcHRbJ3JvbGxfbm9ybWFsJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9ICdyb2xsX3NwZWVkID0gRXVnQm9keS5yb2xsX3NwZWVkOyc7XG4gIHJldHVybiBjb2RlO1xufTtcblxuQmxvY2tseS5KYXZhU2NyaXB0Wydyb2xsX3N0b3AnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBjb2RlID0gJ3JvbGxfc3BlZWQgPSAwOyc7XG4gIHJldHVybiBjb2RlO1xufTtcblxuQmxvY2tseS5KYXZhU2NyaXB0Wyd0dXJuX3JhbmRvbWx5J10gPSBmdW5jdGlvbihibG9jaykge1xuICAvL3ZhciB2YWx1ZV9tYWduaXR1ZGUgPSBCbG9ja2x5LkphdmFTY3JpcHQudmFsdWVUb0NvZGUoYmxvY2ssICdNQUdOSVRVREUnLCBCbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORSk7XG4gIHZhciBtYWduaXR1ZGUgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdNQUdOSVRVREUnKTtcbiAgLy8gVGhlIG1hZ25pdHVkZXMgZ2V0IHRyYW5zbGF0ZWQgaW4gcGVyY2VudGFnZXMgb2YgdGhlIGNvcnJlc3BvbmRpbmcgY29yZSB2YWx1ZXMgKGZ3X3NwZWVkLCByb2xsX3NwZWVkLCByZWFjdGlvbl9zdHJlbmd0aClcbiAgLy8gb3Igb2YgdmFsdWVzIGRlZmluZWQgZm9yIGVhY2ggdHlwZSBvZiByZWFjdGlvblxuICB2YXIgdmFsdWVfbWFnbml0dWRlID0gMDtcbiAgc3dpdGNoIChtYWduaXR1ZGUpIHtcbiAgICBjYXNlIFwiVkVSWV9TTUFMTFwiOlxuICAgICAgdmFsdWVfbWFnbml0dWRlID0gMC4xO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlNNQUxMXCI6XG4gICAgICB2YWx1ZV9tYWduaXR1ZGUgPSAwLjQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTUVESVVNXCI6XG4gICAgICB2YWx1ZV9tYWduaXR1ZGUgPSAwLjc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTEFSR0VcIjpcbiAgICAgIHZhbHVlX21hZ25pdHVkZSA9IDEuMDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJWRVJZX0xBUkdFXCI6XG4gICAgICB2YWx1ZV9tYWduaXR1ZGUgPSAxLjM7XG4gICAgICBicmVhaztcbiAgfVxuXG5cbiAgdmFyIGNvZGUgPSAnZGVsdGFfeWF3ICs9JyArIHZhbHVlX21hZ25pdHVkZSArICcgKiBbLTEsMV1bTWF0aC5yYW5kb20oKSoyfDBdKk1hdGgucmFuZG9tKCkgKiBjb25maWcucmVzZXRSYW5kb20gKiBkVDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3R1cm5fbHInXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcblxuICAvLyBMRUZUIGRpcmVjdGlvbiBpcyBpbiBwb3NpdGl2ZSBsb2NhbCB5LWRpcmVjdGlvbiwgaXJyZXNwZWN0aXZlIG9mIHNlbnNvciBsb2NhdGlvbi5cbiAgLy8gUklHSFQgZGlyZWN0aW9uIGlzIGluIG5lZ2F0aXZlIGxvY2FsIHktZGlyZWN0aW9uLCBpcnJlc3BlY3RpdmUgb2Ygc2Vuc29yIGxvY2F0aW9uLlxuICB2YXIgY29kZSA9ICcnO1xuXG4gIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkxFRlRcIjogLy8gU2V0IGNvZWZmaWNpZW50IHN1Y2ggdGhhdCB3aGVuIGV5ZSBpcyBvbiAoMSwxKSBpbiBwb3NpdGl2ZSB5LWRpcmVjdGlvbiwgbGVmdCBpcyB0b3dhcmRzIHRoZSBsaWdodFxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJSSUdIVFwiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJyc7XG4gIHZhciBUVVJOX01BWCA9IDI7XG4gIGNvZGUgKz0gJ3ZhciBsaWdodERpZmYgPScgKyAnY2FsY0ludGVuc2l0eScgKyAnKiBFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoOyc7IC8vIFJJR0hUIE5PVyBUSElTIElTIFdSSVRURU4gRk9SIDEgRVlFLiBSRVdSSVRFIFRPIEFEQVBULlxuXG4gIGNvZGUgKz0gJ2RlbHRhX3lhdyArPSAnICsgZmxpcFJvdGF0aW9uRGlyICsgJyogTWF0aC5hYnMoRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aCAqIGxpZ2h0RGlmZikgKiBkVDsnO1xuXG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9hdF8xc2Vuc29yJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG5cbiAgLypcbiAgSW4gZGlyZWN0aW9uIG9mIHRoZSBzZW5zb3I6IFdoZXJlIHRoZSBzZW5zb3IgaXMgcG9pbnRpbmcgdG8sIGlmIHRoZSBmaWVsZCBpcyBzbWFsbGVyIHRoYW4gMipQSSwgT1Igd2hlcmUgdGhlIHNlbnNvciBpcyBsb2NhdGVkIElGIE5PVCB5X3NlbnNvciA9IDBcbiAgSW4gZGlyZWN0aW9uIG9mIHRoZSBleWVzcG90OiBJRiBUSEVSRSBJUyBBTiBFWUVTUE9ULCB0aGVuIGluIHRoZSBkaXJlY3Rpb24gdGhhdCBpdCBpcyBsb2NhdGVkIGF0LlxuICBUaGUgZGVjaWRpbmcgZmFjdG9yIGlzIHRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHNlbnNvciBvcmllbnRhdGlvbiwgcG9zaXRpb24gb3Igb2YgdGhlIGV5ZXNwb3QgcG9zaXRpb246XG4gIC0geSA9IDA6IFdlIGhhdmUgbm8gc2V0IGRpcmVjdGlvbi5cbiAgLSB5ID4gMDogY291bnRlci1jbG9ja3dpc2UgZGlyZWN0aW9uIChpLmUuIHBvc2l0aXZlIGFuZ2xlcylcbiAgLSB5IDwgMDogY2xvY2t3aXNlIGRpcmVjdGlvbiAoaS5lLiBuZWdhdGl2ZSBhbmdsZXMpXG5cbiAgSWYgZGlyZWN0aW9uIGlzIFwiVE9XQVJEU1wiLCB0aGVuIHRoZSBmbGlwUm90YXRpb25EaXIgaXMgcG9zaXRpdmUsIGFuZCBuZWdhdGl2ZSBvdGhlcndpc2UuXG4gICovXG4gdmFyIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiQVdBWVwiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJUT1dBUkRTXCI6XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAtMTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGNvZGUgPSAndmFyIHJvdGF0aW9uRGlyID0gMDsgXFxcbiAgICBpZiAoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoKSB7IFxcXG4gICAgICBpZiAoRXVnQm9keS5saWdodFNlbnNvcnNbMF0uZmllbGQgPT0gMipNYXRoLlBJKSB7IFxcXG4gICAgICAgIHJvdGF0aW9uRGlyID0gRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueTsgXFxcbiAgICAgIH0gZWxzZSB7IFxcXG4gICAgICAgIHJvdGF0aW9uRGlyID0gRXVnQm9keS5saWdodFNlbnNvcnNbMF0ub3JpZW50YXRpb24ueTsgXFxcbiAgICAgIH0gfSc7XG5cbiAgdmFyIFRVUk5fTUFYID0gMjtcbiAgY29kZSArPSAndmFyIGxpZ2h0RGlmZiA9JyArICdjYWxjSW50ZW5zaXR5JyArICcqIEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGg7JztcbiAgY29kZSArPSAnZGVsdGFfeWF3ICs9IHJvdGF0aW9uRGlyIConICsgIGZsaXBSb3RhdGlvbkRpciArICcqIE1hdGguYWJzKEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGggKiBsaWdodERpZmYpICogZFQ7JztcblxuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3R1cm5fYXRfMXNlbnNvcl9leWVzcG90J10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG4gIHZhciBvYmplY3QgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdPQkpFQ1QnKTtcblxuICAvKlxuICBJbiBkaXJlY3Rpb24gb2YgdGhlIHNlbnNvcjogV2hlcmUgdGhlIHNlbnNvciBpcyBwb2ludGluZyB0bywgaWYgdGhlIGZpZWxkIGlzIHNtYWxsZXIgdGhhbiAyKlBJLCBPUiB3aGVyZSB0aGUgc2Vuc29yIGlzIGxvY2F0ZWQgSUYgTk9UIHlfc2Vuc29yID0gMFxuICBJbiBkaXJlY3Rpb24gb2YgdGhlIGV5ZXNwb3Q6IElGIFRIRVJFIElTIEFOIEVZRVNQT1QsIHRoZW4gaW4gdGhlIGRpcmVjdGlvbiB0aGF0IGl0IGlzIGxvY2F0ZWQgYXQuXG4gIFRoZSBkZWNpZGluZyBmYWN0b3IgaXMgdGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgc2Vuc29yIG9yaWVudGF0aW9uLCBwb3NpdGlvbiBvciBvZiB0aGUgZXllc3BvdCBwb3NpdGlvbjpcbiAgLSB5ID0gMDogV2UgaGF2ZSBubyBzZXQgZGlyZWN0aW9uLlxuICAtIHkgPiAwOiBjb3VudGVyLWNsb2Nrd2lzZSBkaXJlY3Rpb24gKGkuZS4gcG9zaXRpdmUgYW5nbGVzKVxuICAtIHkgPCAwOiBjbG9ja3dpc2UgZGlyZWN0aW9uIChpLmUuIG5lZ2F0aXZlIGFuZ2xlcylcblxuICBJZiBkaXJlY3Rpb24gaXMgXCJUT1dBUkRTXCIsIHRoZW4gdGhlIGZsaXBSb3RhdGlvbkRpciBpcyBwb3NpdGl2ZSwgYW5kIG5lZ2F0aXZlIG90aGVyd2lzZS5cbiAgKi9cbiB2YXIgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJBV0FZXCI6XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlRPV0FSRFNcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IC0xO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICcnO1xuXG4gIGlmIChvYmplY3QgPT0gJ1NFTlNPUicpIHtcbiAgICBjb2RlICs9ICd2YXIgcm90YXRpb25EaXIgPSAwOyBcXFxuICAgIGlmIChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGgpIHsgXFxcbiAgICAgIGlmIChFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5maWVsZCA9PSAyKk1hdGguUEkpIHsgXFxcbiAgICAgICAgcm90YXRpb25EaXIgPSBFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55OyBcXFxuICAgICAgfSBlbHNlIHsgXFxcbiAgICAgICAgcm90YXRpb25EaXIgPSBFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5vcmllbnRhdGlvbi55OyBcXFxuICAgICAgfSB9JztcbiAgfSBlbHNlIGlmIChvYmplY3QgPT0gJ1NQT1QnKSB7XG4gICAgY29kZSArPSAndmFyIHJvdGF0aW9uRGlyID0gMDsgXFxcbiAgICBpZiAoRXVnQm9keS5zcG90UG9zaXRpb25zLmxlbmd0aD09MSkgeyBcXFxuICAgICAgcm90YXRpb25EaXIgPSBFdWdCb2R5LnNwb3RQb3NpdGlvbnNbMF0ueTsgfSc7XG4gIH1cblxuICB2YXIgVFVSTl9NQVggPSAyO1xuICBjb2RlICs9ICd2YXIgbGlnaHREaWZmID0nICsgJ2NhbGNJbnRlbnNpdHknICsgJyogRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsnO1xuICBjb2RlICs9ICdkZWx0YV95YXcgKz0gcm90YXRpb25EaXIgKicgKyAgZmxpcFJvdGF0aW9uRGlyICsgJyogTWF0aC5hYnMoRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aCAqIGxpZ2h0RGlmZikgKiBkVDsnO1xuXG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9hdF8yc2Vuc29ycyddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuXG4gIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkFXQVlcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IC0xO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlRPV0FSRFNcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJ3ZhciByb3RhdGlvbkRpciA9IDA7JztcblxuICBjb2RlICs9ICdyb3RhdGlvbkRpciA9IChzZW5zb3JJbnRlbnNpdGllc1sxXSAtIHNlbnNvckludGVuc2l0aWVzWzBdKSA8IDAgPyBFdWdCb2R5LmxpZ2h0U2Vuc29yc1sxXS5wb3NpdGlvbi55IDogRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueTsnO1xuXG4gIHZhciBUVVJOX01BWCA9IDI7XG4gIGNvZGUgKz0gJ3ZhciBsaWdodERpZmYgPScgKyAnY2FsY0ludGVuc2l0eScgKyAnKiBFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoOyc7XG4gIGNvZGUgKz0gJ2RlbHRhX3lhdyArPSByb3RhdGlvbkRpciAqJyArICBmbGlwUm90YXRpb25EaXIgKyAnKiBNYXRoLmFicyhFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoICogbGlnaHREaWZmKSAqIGRUOyc7XG5cbiAgcmV0dXJuIGNvZGU7XG59O1xuXG5cbi8vIENPTkRJVElPTlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ21hc3Rlcl9ibG9jayddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRlZmF1bHRDb2RlID0gXCJ2YXIgY2FsY0ludGVuc2l0eSA9IChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGg+MSkgPyBsaWdodEluZm8uZGlmZkJ0d1NlbnNvcnMgOiBsaWdodEluZm8uY3VycmVudExldmVsWzBdO1wiIC8vIEhFUkUgV1JJVEUgVEhFIENPUkUgTElHSFQgLSAxIEVZRSBPUiAyIEVZRVMuIFRISVMgQ0FOIFRIRU4gQkUgTU9ESUZJRUQgV0lUSCBUSEUgRFJPUC1ET1dOISAtIFdSSVRFIEFMTCBPVEhFUiBDT0RFIFNVQ0ggVEhBVCBJVCBUQUtFUyBUSElTIExJR0hUIE1FQVNVUkUuXG4gIHZhciBhbGxfY29kZSA9IEJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdDT0RFJyk7XG4gIC8vIFRPRE86IEFzc2VtYmxlIEphdmFTY3JpcHQgaW50byBjb2RlIHZhcmlhYmxlLlxuICB2YXIgY29kZSA9IGRlZmF1bHRDb2RlICsgYWxsX2NvZGU7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnc2VlX2xpZ2h0X3F1YW50aXR5J10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgdGhyZXNob2xkX3BlcmNlbnRhZ2UgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdUSFJFU0hPTEQnKTtcbiAgdmFyIHN0YXRlbWVudHNfY29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICB0aHJlc2hvbGRfcGVyY2VudGFnZSA9IHRocmVzaG9sZF9wZXJjZW50YWdlLnNwbGl0KCdfJylbMV07XG4gIC8vIEFsdGVybmF0aXZlbHksIHVzZSB0aGUgdGhyZXNob2xkIEV1Z0JvZHkuZGVmYXVsdHMuc2Vuc2l0aXZpdHlfdGhyZXNob2xkXG4gIHZhciBjb2RlID0gJ2lmICgoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoPjEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmRpZmZCdHdTZW5zb3JzKSA+ICcgKyB0aHJlc2hvbGRfcGVyY2VudGFnZSArICcvIDEwMCkgfHwgXFxcbiAgICAgICAgICAgICAoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoID09IDEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmN1cnJlbnRMZXZlbFswXSkgPicgKyB0aHJlc2hvbGRfcGVyY2VudGFnZSArICcvIDEwMCkpIHsnICsgc3RhdGVtZW50c19jb2RlICsgJ30nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3NlZV9saWdodCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHN0YXRlbWVudHNfY29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICB2YXIgdGhyZXNob2xkX3BlcmNlbnRhZ2UgPSA1O1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICB2YXIgY29kZSA9ICdpZiAoKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aD4xICYmIE1hdGguYWJzKGxpZ2h0SW5mby5kaWZmQnR3U2Vuc29ycykgPiAnICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApIHx8IFxcXG4gICAgICAgICAgICAgKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aCA9PSAxICYmIE1hdGguYWJzKGxpZ2h0SW5mby5jdXJyZW50TGV2ZWxbMF0pID4nICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApKSB7JyArIHN0YXRlbWVudHNfY29kZSArICd9JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydub19saWdodCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHN0YXRlbWVudHNfY29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICB2YXIgdGhyZXNob2xkX3BlcmNlbnRhZ2UgPSA1O1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICB2YXIgY29kZSA9ICdpZiAoKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aD4xICYmIE1hdGguYWJzKGxpZ2h0SW5mby5kaWZmQnR3U2Vuc29ycykgPCAnICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApIHx8IFxcXG4gICAgICAgICAgICAgKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aCA9PSAxICYmIE1hdGguYWJzKGxpZ2h0SW5mby5jdXJyZW50TGV2ZWxbMF0pIDwnICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApKSB7JyArIHN0YXRlbWVudHNfY29kZSArICd9JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydlaXRoZXJfd2F5J10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICByZXR1cm4gY29kZTtcbn07XG4iXX0=
