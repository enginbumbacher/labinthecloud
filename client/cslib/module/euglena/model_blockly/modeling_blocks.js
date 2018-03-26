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
  "message0": "Move with default speed",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 270,
  "tooltip": "Tell the the model to move forward with the speed that you defined for the body.",
  "helpUrl": ""
}, { "type": "move_change",
  "message0": "%1 forward speed by %2",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["Increase", "FASTER"], ["Decrease", "SLOWER"]]
  }, {
    "type": "field_dropdown",
    "name": "SPEED",
    "options": [["20 percent", "CHANGE_20"], ["40 percent", "CHANGE_40"], ["60 percent", "CHANGE_60"], ["80 percent", "CHANGE_80"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 270,
  "tooltip": "Tell the model to move faster or slower. E.g. move faster by 50% means 'increase your forward speed by 50% of your default speed'",
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
  "message0": "Rotate with default speed",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "roll_change",
  "message0": "%1 rotation speed by %2",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["Increase", "FASTER"], ["Decrease", "SLOWER"]]
  }, {
    "type": "field_dropdown",
    "name": "SPEED",
    "options": [["20 percent", "CHANGE_20"], ["40 percent", "CHANGE_40"], ["60 percent", "CHANGE_60"], ["80 percent", "CHANGE_80"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "Tell the model to rotate faster around its axis. E.g. Rotate faster by 50% means 'increase your rotate speed by 50% of your default speed'",
  "helpUrl": ""
}, { "type": "roll_stop",
  "message0": "Stop rotating",
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_change",
  "message0": "%1 turn speed by %2",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["Increase", "FASTER"], ["Decrease", "SLOWER"]]
  }, {
    "type": "field_dropdown",
    "name": "SPEED",
    "options": [["20 percent", "CHANGE_20"], ["40 percent", "CHANGE_40"], ["60 percent", "CHANGE_60"], ["80 percent", "CHANGE_80"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 218,
  "tooltip": "Tell the model to turn faster or slower. E.g. turn faster by 50% means 'increase your turning speed by 50% of your default speed'",
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
  "message0": "Turn %1 %2 sensor that detects brighter light",
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
    "options": [["small", "THRESH_10"], ["medium", "THRESH_30"], ["large", "THRESH_50"]]
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

  var code = 'roll_speed +=' + addsubstract + '*' + speed.split('_')[1] + '/ 100 * roll_speed;';
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

Blockly.JavaScript['turn_change'] = function (block) {
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
  var code = 'if (reaction_strength>0) { delta_yaw +=' + '(lightDiff > 0 ? lightDiff : 0.2) * dT *' + addsubstract + ' * ' + speed.split('_')[1] + '/ 100 * EugBody.reaction_strength; }';
  code += 'else { reaction_strength = (1 + ' + addsubstract + '*' + speed.split('_')[1] + '/ 100 ) * EugBody.reaction_strength; }';
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
  code += 'if (!(reaction_strength)) { reaction_strength = EugBody.reaction_strength; }';
  code += 'lightDiff =' + 'calcIntensity' + '* reaction_strength;'; // RIGHT NOW THIS IS WRITTEN FOR 1 EYE. REWRITE TO ADAPT.
  code += 'if (lightDiff == 0) { lightDiff = 0.2 * reaction_strength }';
  code += 'delta_yaw += ' + flipRotationDir + '* Math.abs(lightDiff) * dT;';

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
  code += 'if (!(reaction_strength)) { reaction_strength = EugBody.reaction_strength; }';
  code += 'lightDiff = calcIntensity * reaction_strength;';
  code += 'if (lightDiff == 0) { lightDiff = 0.2 * reaction_strength }';
  code += 'delta_yaw += rotationDir *' + flipRotationDir + '* Math.abs(lightDiff) * dT;';

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
  code += 'if (!(reaction_strength)) { reaction_strength = EugBody.reaction_strength; }';
  code += 'lightDiff =' + 'calcIntensity' + '* reaction_strength;';
  code += 'if (lightDiff == 0) { lightDiff = 0.2 * reaction_strength }';
  code += 'delta_yaw += rotationDir *' + flipRotationDir + '* Math.abs(lightDiff) * dT;';

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
  code += 'if (!(reaction_strength)) { reaction_strength = EugBody.reaction_strength; }';
  code += 'lightDiff =' + 'calcIntensity' + '* reaction_strength;';
  code += 'if (lightDiff == 0) { lightDiff = 0.2 * reaction_strength }';
  code += 'delta_yaw += rotationDir *' + flipRotationDir + '* Math.abs(lightDiff) * dT;';

  return code;
};

// CONDITIONS ************************************************

window.Blockly.JavaScript['master_block'] = function (block) {
  var defaultCode = "var calcIntensity = (EugBody.lightSensors.length>1) ? lightInfo.diffBtwSensors : lightInfo.currentLevel[0];"; // HERE WRITE THE CORE LIGHT - 1 EYE OR 2 EYES. THIS CAN THEN BE MODIFIED WITH THE DROP-DOWN! - WRITE ALL OTHER CODE SUCH THAT IT TAKES THIS LIGHT MEASURE.
  defaultCode += 'var reaction_strength = null;';
  defaultCode += 'var lightDiff = 0;';
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
  var threshold_percentage = 3;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kZWxpbmdfYmxvY2tzLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIkJsb2NrbHkiLCJkZWZpbmVCbG9ja3NXaXRoSnNvbkFycmF5IiwiQmxvY2tzIiwiaW5pdCIsImFwcGVuZER1bW15SW5wdXQiLCJhcHBlbmRGaWVsZCIsImFwcGVuZFN0YXRlbWVudElucHV0Iiwic2V0Q2hlY2siLCJzZXRJbnB1dHNJbmxpbmUiLCJzZXRDb2xvdXIiLCJzZXREZWxldGFibGUiLCJzZXRUb29sdGlwIiwic2V0SGVscFVybCIsInNldFByZXZpb3VzU3RhdGVtZW50Iiwic2V0TmV4dFN0YXRlbWVudCIsInNldE1vdmFibGUiLCJKYXZhU2NyaXB0IiwiYmxvY2siLCJxdWFudGl0eSIsInZhbHVlVG9Db2RlIiwiT1JERVJfTk9ORSIsInJhbmRvbUNvZWZmIiwicmFuZG9tRmFjdG9yIiwiY29kZSIsImZhY3RvciIsImdldEZpZWxkVmFsdWUiLCJwcm9wX3RvIiwibWFnbml0dWRlIiwicGVyY2VudGFnZSIsIm51bWJlciIsInNwZWVkIiwiZGlyZWN0aW9uIiwiYWRkc3Vic3RyYWN0Iiwic3BsaXQiLCJ2YWx1ZV9tYWduaXR1ZGUiLCJmbGlwUm90YXRpb25EaXIiLCJUVVJOX01BWCIsIm9iamVjdCIsImRlZmF1bHRDb2RlIiwiYWxsX2NvZGUiLCJzdGF0ZW1lbnRUb0NvZGUiLCJ0aHJlc2hvbGRfcGVyY2VudGFnZSIsInN0YXRlbWVudHNfY29kZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxDQUFlQyx5QkFBZixDQUF5QyxDQUN2QyxFQUFFLFFBQVEsZUFBVjtBQUNFLGNBQVksb0JBRGQ7QUFFRSxXQUFTLENBQ1A7QUFDRSxZQUFRO0FBRFYsR0FETyxFQUlQO0FBQ0UsWUFBUSxhQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsYUFBUyxDQUNQLFFBRE8sRUFFUCxRQUZPLEVBR1AsZUFITyxFQUlQLGVBSk8sRUFLUCxv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LEdBQ3FJLEdBRGhKO0FBRUEsU0FBT25CLElBQVA7QUFDRCxDQVBEOztBQVNBeEIsT0FBT0MsT0FBUCxDQUFlZ0IsVUFBZixDQUEwQixVQUExQixJQUF3QyxVQUFTQyxLQUFULEVBQWdCO0FBQ3RELE1BQUl5QixrQkFBa0IzQyxPQUFPQyxPQUFQLENBQWVnQixVQUFmLENBQTBCd0IsZUFBMUIsQ0FBMEN2QixLQUExQyxFQUFpRCxNQUFqRCxDQUF0Qjs7QUFFQTtBQUNBLE1BQUl3Qix1QkFBdUIsQ0FBM0I7QUFDQTtBQUNBLE1BQUlsQixPQUFPLGdGQUFnRmtCLG9CQUFoRixHQUF1Rzt3RkFBdkcsR0FDOEVBLG9CQUQ5RSxHQUNxRyxXQURyRyxHQUNtSEMsZUFEbkgsR0FDcUksR0FEaEo7QUFFQSxTQUFPbkIsSUFBUDtBQUNELENBVEQ7O0FBV0F4QixPQUFPQyxPQUFQLENBQWVnQixVQUFmLENBQTBCLFlBQTFCLElBQTBDLFVBQVNDLEtBQVQsRUFBZ0I7QUFDeEQsTUFBSU0sT0FBT3hCLE9BQU9DLE9BQVAsQ0FBZWdCLFVBQWYsQ0FBMEJ3QixlQUExQixDQUEwQ3ZCLEtBQTFDLEVBQWlELE1BQWpELENBQVg7QUFDQTtBQUNBLFNBQU9NLElBQVA7QUFDRCxDQUpEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kZWxpbmdfYmxvY2tzLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93LkJsb2NrbHkuZGVmaW5lQmxvY2tzV2l0aEpzb25BcnJheShbXG4gIHsgXCJ0eXBlXCI6IFwibW9kaWZpZXJfcmFuZFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJtb3JlIG9yIGxlc3MgJTEgJTJcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfdmFsdWVcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiUVVBTlRcIixcbiAgICAgICAgXCJjaGVja1wiOiBbXG4gICAgICAgICAgXCJOdW1iZXJcIixcbiAgICAgICAgICBcIlN0cmluZ1wiLFxuICAgICAgICAgIFwibW9kaWZpZXJfcHJvYlwiLFxuICAgICAgICAgIFwibW9kaWZpZXJfcmFuZFwiLFxuICAgICAgICAgIFwicXVhbnRfcHJvcF8xc2Vuc29yXCIsXG4gICAgICAgICAgXCJxdWFudF9wcm9wXzJzZW5zb3JzXCJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcIm91dHB1dFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDE4MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInF1YWxfYWJzb2x1dGVcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiTUFHTklUVURFXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIHNtYWxsIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJTTUFMTFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImEgbWVkaXVtIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJNRURJVU1cIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIGxhcmdlIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJMQVJHRVwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcIm91dHB1dFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDE4MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInF1YW50X3Byb3BfMXNlbnNvclwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJhbW91bnQgcHJvcC4gdG8gJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRkFDVE9SXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJkaWZmIGluIGxpZ2h0IHNlZW4gbm93IHZzIGJlZm9yZVwiLFxuICAgICAgICAgICAgXCJMSUdIVF9ESUZGXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwibGlnaHQgc2VlbiBub3dcIixcbiAgICAgICAgICAgIFwiTElHSFRfTk9XXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZ2VuZXJhbCBsZXZlbCBvZiBicmlnaHRuZXNzXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0FWR1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwib3V0cHV0XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMTgwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwicXVhbnRfcHJvcF8yc2Vuc29yc1wiLFxuICAgIFwibWVzc2FnZTBcIjogXCJhbW91bnQgcHJvcG9ydGlvbmFsIHRvIHRoZSAlMVwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJGQUNUT1JcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImRpZmZlcmVuY2UgYmV0d2VlbiBsZWZ0IGFuZCByaWdodCBzZW5zb3JzXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0RJRkZcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJwZXJjZWl2ZWQgbGlnaHQgb2YgcmlnaHQgc2Vuc29yXCIsXG4gICAgICAgICAgICBcIkxJR0hUX1JJR0hUXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwicGVyY2VpdmVkIGxpZ2h0IG9mIGxlZnQgc2Vuc29yXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0xFRlRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJnZW5lcmFsIGxldmVsIG9mIGJyaWdodG5lc3NcIixcbiAgICAgICAgICAgIFwiTElHSFRfQVZHXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxODAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJtb3ZlX25vcm1hbFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJNb3ZlIHdpdGggZGVmYXVsdCBzcGVlZFwiLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDI3MCxcbiAgICBcInRvb2x0aXBcIjogXCJUZWxsIHRoZSB0aGUgbW9kZWwgdG8gbW92ZSBmb3J3YXJkIHdpdGggdGhlIHNwZWVkIHRoYXQgeW91IGRlZmluZWQgZm9yIHRoZSBib2R5LlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwibW92ZV9jaGFuZ2VcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiJTEgZm9yd2FyZCBzcGVlZCBieSAlMlwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJESVJFQ1RJT05cIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIkluY3JlYXNlXCIsXG4gICAgICAgICAgICBcIkZBU1RFUlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIkRlY3JlYXNlXCIsXG4gICAgICAgICAgICBcIlNMT1dFUlwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJTUEVFRFwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiMjAgcGVyY2VudFwiLFxuICAgICAgICAgICAgXCJDSEFOR0VfMjBcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCI0MCBwZXJjZW50XCIsXG4gICAgICAgICAgICBcIkNIQU5HRV80MFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIjYwIHBlcmNlbnRcIixcbiAgICAgICAgICAgIFwiQ0hBTkdFXzYwXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiODAgcGVyY2VudFwiLFxuICAgICAgICAgICAgXCJDSEFOR0VfODBcIlxuICAgICAgICAgIF0sXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDI3MCxcbiAgICBcInRvb2x0aXBcIjogXCJUZWxsIHRoZSBtb2RlbCB0byBtb3ZlIGZhc3RlciBvciBzbG93ZXIuIEUuZy4gbW92ZSBmYXN0ZXIgYnkgNTAlIG1lYW5zICdpbmNyZWFzZSB5b3VyIGZvcndhcmQgc3BlZWQgYnkgNTAlIG9mIHlvdXIgZGVmYXVsdCBzcGVlZCdcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcIm1vdmVfc3RvcFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJTdG9wIG1vdmluZyBmb3J3YXJkXCIsXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMjcwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwicm9sbF9ub3JtYWxcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiUm90YXRlIHdpdGggZGVmYXVsdCBzcGVlZFwiLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwicm9sbF9jaGFuZ2VcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiJTEgcm90YXRpb24gc3BlZWQgYnkgJTJcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJJbmNyZWFzZVwiLFxuICAgICAgICAgICAgXCJGQVNURVJcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJEZWNyZWFzZVwiLFxuICAgICAgICAgICAgXCJTTE9XRVJcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiU1BFRURcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIjIwIHBlcmNlbnRcIixcbiAgICAgICAgICAgIFwiQ0hBTkdFXzIwXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiNDAgcGVyY2VudFwiLFxuICAgICAgICAgICAgXCJDSEFOR0VfNDBcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCI2MCBwZXJjZW50XCIsXG4gICAgICAgICAgICBcIkNIQU5HRV82MFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIjgwIHBlcmNlbnRcIixcbiAgICAgICAgICAgIFwiQ0hBTkdFXzgwXCJcbiAgICAgICAgICBdLFxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJUZWxsIHRoZSBtb2RlbCB0byByb3RhdGUgZmFzdGVyIGFyb3VuZCBpdHMgYXhpcy4gRS5nLiBSb3RhdGUgZmFzdGVyIGJ5IDUwJSBtZWFucyAnaW5jcmVhc2UgeW91ciByb3RhdGUgc3BlZWQgYnkgNTAlIG9mIHlvdXIgZGVmYXVsdCBzcGVlZCdcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInJvbGxfc3RvcFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJTdG9wIHJvdGF0aW5nXCIsXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJ0dXJuX2NoYW5nZVwiLFxuICAgIFwibWVzc2FnZTBcIjogXCIlMSB0dXJuIHNwZWVkIGJ5ICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiSW5jcmVhc2VcIixcbiAgICAgICAgICAgIFwiRkFTVEVSXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiRGVjcmVhc2VcIixcbiAgICAgICAgICAgIFwiU0xPV0VSXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlNQRUVEXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCIyMCBwZXJjZW50XCIsXG4gICAgICAgICAgICBcIkNIQU5HRV8yMFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIjQwIHBlcmNlbnRcIixcbiAgICAgICAgICAgIFwiQ0hBTkdFXzQwXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiNjAgcGVyY2VudFwiLFxuICAgICAgICAgICAgXCJDSEFOR0VfNjBcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCI4MCBwZXJjZW50XCIsXG4gICAgICAgICAgICBcIkNIQU5HRV84MFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMjE4LFxuICAgIFwidG9vbHRpcFwiOiBcIlRlbGwgdGhlIG1vZGVsIHRvIHR1cm4gZmFzdGVyIG9yIHNsb3dlci4gRS5nLiB0dXJuIGZhc3RlciBieSA1MCUgbWVhbnMgJ2luY3JlYXNlIHlvdXIgdHVybmluZyBzcGVlZCBieSA1MCUgb2YgeW91ciBkZWZhdWx0IHNwZWVkJ1wiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9yYW5kb21seVwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuIHJhbmRvbWx5IGJ5ICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBsaXR0bGVcIixcbiAgICAgICAgICAgIFwiU01BTExcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIG1vZGVyYXRlIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJNRURJVU1cIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhIGxvdFwiLFxuICAgICAgICAgICAgXCJMQVJHRVwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTgsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVsbCB0aGUgbW9kZWwgdG8gdHVybiByYW5kb21seSBsZWZ0IG9yIHJpZ2h0IGJ5IGEgY2VydGFpbiBhbW91bnQuXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJ0dXJuX2xyXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlR1cm4gJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJsZWZ0XCIsXG4gICAgICAgICAgICBcIkxFRlRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJyaWdodFwiLFxuICAgICAgICAgICAgXCJSSUdIVFwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTgsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVsbCB0aGUgbW9kZWwgdG8gdHVybiBsZWZ0IG9yIHJpZ2h0LiBIb3cgZmFzdCBpdCB0dXJucyBkZXBlbmRzIG9uIHRoZSByZXNwb25zZSBzdHJlbmd0aCBvZiB0aGUgYm9keSBhbmQgdGhlIGxpZ2h0IGludGVuc2l0eS5cIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInR1cm5fYXRfMXNlbnNvclwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuICUxIHRoZSBzZW5zb3JcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhd2F5IGZyb21cIixcbiAgICAgICAgICAgIFwiQVdBWVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInRvd2FyZHNcIixcbiAgICAgICAgICAgIFwiVE9XQVJEU1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTgsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGhpcyBibG9jayBpcyBvbmx5IGFjdGl2ZSB3aGVuIHRoZXJlIGlzIG9uZSBzZW5zb3I7IHRlbGwgdGhlIG1vZGVsIHRvIHR1cm4gYmFzZWQgb24gd2hlcmUgdGhlIHNlbnNvciBpcy4gSG93IGZhc3QgaXQgdHVybnMgZGVwZW5kcyBvbiB0aGUgcmVzcG9uc2Ugc3RyZW5ndGggb2YgdGhlIGJvZHkgYW5kIHRoZSBsaWdodCBpbnRlbnNpdHkuXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJ0dXJuX2F0XzFzZW5zb3JfZXllc3BvdFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYXdheSBmcm9tIHRoZVwiLFxuICAgICAgICAgICAgXCJBV0FZXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwidG93YXJkcyB0aGVcIixcbiAgICAgICAgICAgIFwiVE9XQVJEU1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJPQkpFQ1RcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNlbnNvclwiLFxuICAgICAgICAgICAgXCJTRU5TT1JcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJleWVzcG90XCIsXG4gICAgICAgICAgICBcIlNQT1RcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfV0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMjE4LFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9hdF8yc2Vuc29yc1wiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuICUxICUyIHNlbnNvciB0aGF0IGRldGVjdHMgYnJpZ2h0ZXIgbGlnaHRcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhd2F5IGZyb20gdGhlXCIsXG4gICAgICAgICAgICBcIkFXQVlcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJ0b3dhcmRzIHRoZVwiLFxuICAgICAgICAgICAgXCJUT1dBUkRTXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH1dLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IGZhbHNlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTgsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGhpcyBibG9jayBpcyBvbmx5IGFjdGl2ZSB3aGVuIHRoZXJlIGFyZSB0d28gc2Vuc29yczsgdGVsbCB0aGUgbW9kZWwgdG8gdHVybiBiYXNlZCBvbiBob3cgbXVjaCBsaWdodCBlYWNoIHNlbnNvciBkZXRlY3RzLiBIb3cgZmFzdCBpdCB0dXJucyBkZXBlbmRzIG9uIHRoZSByZXNwb25zZSBzdHJlbmd0aCBvZiB0aGUgYm9keSBhbmQgdGhlIGxpZ2h0IGludGVuc2l0eS5cIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInNlZV9saWdodF9xdWFudGl0eVwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJJZiB0aGUgZGV0ZWN0ZWQgbGlnaHQgaXMgJTE6ICUyICUzXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlRIUkVTSE9MRFwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwic21hbGxcIixcbiAgICAgICAgICAgIFwiVEhSRVNIXzEwXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwibWVkaXVtXCIsXG4gICAgICAgICAgICBcIlRIUkVTSF8zMFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImxhcmdlXCIsXG4gICAgICAgICAgICBcIlRIUkVTSF81MFwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9zdGF0ZW1lbnRcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiQ09ERVwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMjcwLFxuICAgIFwidG9vbHRpcFwiOiBcIllvdSBjYW4gcHVsbCB0aGlzIGJsb2NrIGludG8gdGhlIGNvbnRhaW5lciBibG9jayB0aGF0IHNheXMgJ0lmIGl0IGRldGVjdHMgbGlnaHQnLiBUaGUgbW9kZWwgd2lsbCBvbmx5IGV4ZWN1dGUgdGhlIGJsb2NrcyBpbiB0aGlzIGNvbnRhaW5lciBpZiB0aGUgZGV0ZWN0ZWQgbGlnaHQgaXMgc3Ryb25nIGVub3VnaC5cIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9XG5dKTtcblxud2luZG93LkJsb2NrbHkuQmxvY2tzWydtYXN0ZXJfYmxvY2snXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hcHBlbmREdW1teUlucHV0KClcbiAgICAgICAgLmFwcGVuZEZpZWxkKFwiUHV0IGFsbCB0aGUgYmxvY2tzIGluIGhlcmU6XCIpO1xuICAgIHRoaXMuYXBwZW5kU3RhdGVtZW50SW5wdXQoXCJDT0RFXCIpXG4gICAgICAgIC5zZXRDaGVjayhudWxsKTtcbiAgICB0aGlzLnNldElucHV0c0lubGluZShmYWxzZSk7XG4gICAgdGhpcy5zZXRDb2xvdXIoMjMwKTtcbiAgICB0aGlzLnNldERlbGV0YWJsZShmYWxzZSk7XG4gdGhpcy5zZXRUb29sdGlwKFwiWW91IGNhbiBwdWxsIGFueSBibG9jayBmcm9tIHRoZSB0b29sYm94IGFib3ZlLCBhbmQgZHJhZyBpdCBpbnRvIG9uZSBvZiB0aGUgdGhyZWUgcHVycGxlIGNvbnRhaW5lciBibG9ja3MuXCIpO1xuIHRoaXMuc2V0SGVscFVybChcIlwiKTtcbiAgfVxufTtcblxud2luZG93LkJsb2NrbHkuQmxvY2tzWydzZWVfbGlnaHQnXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hcHBlbmREdW1teUlucHV0KClcbiAgICAgICAgLmFwcGVuZEZpZWxkKFwiSWYgaXQgZGV0ZWN0cyBsaWdodDpcIik7XG4gICAgdGhpcy5hcHBlbmRTdGF0ZW1lbnRJbnB1dChcIkNPREVcIilcbiAgICAgICAgLnNldENoZWNrKG51bGwpO1xuICAgIHRoaXMuc2V0SW5wdXRzSW5saW5lKGZhbHNlKTtcbiAgICB0aGlzLnNldFByZXZpb3VzU3RhdGVtZW50KHRydWUsbnVsbCk7XG4gICAgdGhpcy5zZXROZXh0U3RhdGVtZW50KGZhbHNlLG51bGwpO1xuICAgIHRoaXMuc2V0Q29sb3VyKDEpO1xuICAgIHRoaXMuc2V0RGVsZXRhYmxlKGZhbHNlKTtcbiAgICB0aGlzLnNldE1vdmFibGUoZmFsc2UpO1xuIHRoaXMuc2V0VG9vbHRpcChcIlB1dCBhbnkgYmxvY2sgaW4gaGVyZSB0byBiZSBleGVjdXRlZCBpZiB0aGUgbW9kZWwgZGV0ZWN0cyBsaWdodC5cIik7XG4gdGhpcy5zZXRIZWxwVXJsKFwiXCIpO1xuICB9XG59O1xuXG53aW5kb3cuQmxvY2tseS5CbG9ja3NbJ25vX2xpZ2h0J10gPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYXBwZW5kRHVtbXlJbnB1dCgpXG4gICAgICAgIC5hcHBlbmRGaWVsZChcIklmIGl0IGRldGVjdHMgbm8gbGlnaHQ6XCIpO1xuICAgIHRoaXMuYXBwZW5kU3RhdGVtZW50SW5wdXQoXCJDT0RFXCIpXG4gICAgICAgIC5zZXRDaGVjayhudWxsKTtcbiAgICB0aGlzLnNldElucHV0c0lubGluZShmYWxzZSk7XG4gICAgdGhpcy5zZXRQcmV2aW91c1N0YXRlbWVudCh0cnVlLG51bGwpO1xuICAgIHRoaXMuc2V0TmV4dFN0YXRlbWVudCh0cnVlLG51bGwpO1xuICAgIHRoaXMuc2V0Q29sb3VyKDEpO1xuICAgIHRoaXMuc2V0RGVsZXRhYmxlKGZhbHNlKTtcbiAgICB0aGlzLnNldE1vdmFibGUoZmFsc2UpO1xuIHRoaXMuc2V0VG9vbHRpcChcIlB1dCBhbnkgYmxvY2sgaW4gaGVyZSB0byBiZSBleGVjdXRlZCBpZiB0aGUgbW9kZWwgZG9lcyBub3QgZGV0ZWN0IGxpZ2h0LlwiKTtcbiB0aGlzLnNldEhlbHBVcmwoXCJcIik7XG4gIH1cbn07XG5cbndpbmRvdy5CbG9ja2x5LkJsb2Nrc1snZWl0aGVyX3dheSddID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGVuZER1bW15SW5wdXQoKVxuICAgICAgICAuYXBwZW5kRmllbGQoXCJJbmRlcGVuZGVudCBvZiB3aGV0aGVyIGl0IGRldGVjdHMgbGlnaHQgb3Igbm90OlwiKTtcbiAgICB0aGlzLmFwcGVuZFN0YXRlbWVudElucHV0KFwiQ09ERVwiKVxuICAgICAgICAuc2V0Q2hlY2sobnVsbCk7XG4gICAgdGhpcy5zZXRJbnB1dHNJbmxpbmUoZmFsc2UpO1xuICAgIHRoaXMuc2V0UHJldmlvdXNTdGF0ZW1lbnQodHJ1ZSxudWxsKTtcbiAgICB0aGlzLnNldE5leHRTdGF0ZW1lbnQodHJ1ZSxudWxsKTtcbiAgICB0aGlzLnNldENvbG91cigxKTtcbiAgICB0aGlzLnNldERlbGV0YWJsZShmYWxzZSk7XG4gICAgdGhpcy5zZXRNb3ZhYmxlKGZhbHNlKTtcbiB0aGlzLnNldFRvb2x0aXAoXCJQdXQgYW55IGJsb2NrIGluIGhlcmUgdG8gYmUgZXhlY3V0ZWQgaW5kZXBlbmRlbnRseSBvZiB3aGV0aGVyZSB0aGUgbW9kZWwgZGV0ZWN0cyBsaWdodCBvciBub3QuXCIpO1xuIHRoaXMuc2V0SGVscFVybChcIlwiKTtcbiAgfVxufTtcblxuXG4vLyBRVUFOVElUSUVTIEFORCBNQUdOSVRVREVTXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydtb2RpZmllcl9yYW5kJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgcXVhbnRpdHkgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnZhbHVlVG9Db2RlKGJsb2NrLCdRVUFOVCcsd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FKTtcbiAgdmFyIHJhbmRvbUNvZWZmID0gMC4xO1xuICB2YXIgcmFuZG9tRmFjdG9yID0gJzEgKyBbLTEsMV1bTWF0aC5yYW5kb20oKSoyfDBdKk1hdGgucmFuZG9tKCkgKicgKyByYW5kb21Db2VmZjtcbiAgdmFyIGNvZGUgPSByYW5kb21GYWN0b3IgICsgJyonICsgcXVhbnRpdHk7XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1YW50X3Byb3BfMXNlbnNvciddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGZhY3RvciA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0ZBQ1RPUicpO1xuXG4gIHZhciBwcm9wX3RvID0gbnVsbDtcbiAgc3dpdGNoIChmYWN0b3IpIHtcbiAgICBjYXNlIFwiTElHSFRfRElGRlwiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uZGlmZk5vd1RvQWRhcHRMZXZlbCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfTk9XXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5jdXJyZW50TGV2ZWxbMF0nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxJR0hUX0FWR1wiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uYWRhcHRMZXZlbCc7XG4gICAgICBicmVhaztcbiAgfVxuICB2YXIgY29kZSA9IHByb3BfdG87XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1YW50X3Byb3BfMnNlbnNvcnMnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBmYWN0b3IgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdGQUNUT1InKTtcblxuICB2YXIgcHJvcF90byA9IDA7XG4gIHN3aXRjaCAoZmFjdG9yKSB7XG4gICAgY2FzZSBcIkxJR0hUX0RJRkZcIjpcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmRpZmZOb3dUb0FkYXB0TGV2ZWwnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxJR0hUX1JJR0hUXCI6IC8vIHkgPSAtMVxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uY3VycmVudExldmVsW0V1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLnBvc2l0aW9uLnkgPCAwID8gMCA6IDFdJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMaUdIVF9MRUZUXCI6IC8vIHkgPSAxXG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5jdXJyZW50TGV2ZWxbRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueSA+IDAgPyAwIDogMV0nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxJR0hUX0FWR1wiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uYWRhcHRMZXZlbCc7XG4gICAgICBicmVhaztcbiAgfVxuICB2YXIgY29kZSA9IHByb3BfdG87XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1YWxfYWJzb2x1dGUnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBtYWduaXR1ZGUgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdNQUdOSVRVREUnKTtcbiAgLy8gVGhlIG1hZ25pdHVkZXMgZ2V0IHRyYW5zbGF0ZWQgaW4gcGVyY2VudGFnZXMgb2YgdGhlIGNvcnJlc3BvbmRpbmcgY29yZSB2YWx1ZXMgKGZ3X3NwZWVkLCByb2xsX3NwZWVkLCByZWFjdGlvbl9zdHJlbmd0aClcbiAgLy8gb3Igb2YgdmFsdWVzIGRlZmluZWQgZm9yIGVhY2ggdHlwZSBvZiByZWFjdGlvblxuICB2YXIgcGVyY2VudGFnZSA9IDA7XG4gIHN3aXRjaCAobWFnbml0dWRlKSB7XG4gICAgY2FzZSBcIlZFUllfU01BTExcIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAwLjE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiU01BTExcIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAwLjQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTUVESVVNXCI6XG4gICAgICBwZXJjZW50YWdlID0gMC43O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxBUkdFXCI6XG4gICAgICBwZXJjZW50YWdlID0gMS4wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlZFUllfTEFSR0VcIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAxLjM7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJycgKyBwZXJjZW50YWdlO1xuICByZXR1cm4gW2NvZGUsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORV07XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydtYXRoX251bWJlciddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIG51bWJlciA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ05VTScpO1xuICB2YXIgY29kZSA9IG51bWJlcjtcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxuLy8gQUNUSU9OUyBBTkQgQkVIQVZJT1JTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydtb3ZlX2NoYW5nZSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHNwZWVkID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnU1BFRUQnKTtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuICB2YXIgYWRkc3Vic3RyYWN0ID0gMDtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJGQVNURVJcIjpcbiAgICAgIGFkZHN1YnN0cmFjdCA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiU0xPV0VSXCI6XG4gICAgICBhZGRzdWJzdHJhY3QgPSAtMTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHZhciBjb2RlID0gJ2Z3X3NwZWVkICs9JyArIGFkZHN1YnN0cmFjdCArICcqJyArIHNwZWVkLnNwbGl0KCdfJylbMV0gKyAnLyAxMDAgKiBmd19zcGVlZDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3JvbGxfY2hhbmdlJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3BlZWQgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdTUEVFRCcpO1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG5cbiAgdmFyIGFkZHN1YnN0cmFjdCA9IDA7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiRkFTVEVSXCI6XG4gICAgICBhZGRzdWJzdHJhY3QgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlNMT1dFUlwiOlxuICAgICAgYWRkc3Vic3RyYWN0ID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJ3JvbGxfc3BlZWQgKz0nICsgYWRkc3Vic3RyYWN0ICsgJyonICsgc3BlZWQuc3BsaXQoJ18nKVsxXSArICcvIDEwMCAqIHJvbGxfc3BlZWQ7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG5CbG9ja2x5LkphdmFTY3JpcHRbJ21vdmVfc3RvcCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGNvZGUgPSAnZndfc3BlZWQgPSAwOyc7XG4gIHJldHVybiBjb2RlO1xufTtcblxuQmxvY2tseS5KYXZhU2NyaXB0Wydtb3ZlX25vcm1hbCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGNvZGUgPSAnZndfc3BlZWQgPSBFdWdCb2R5LmZ3X3NwZWVkOyc7XG4gIHJldHVybiBjb2RlO1xufTtcblxuQmxvY2tseS5KYXZhU2NyaXB0Wydyb2xsX25vcm1hbCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGNvZGUgPSAncm9sbF9zcGVlZCA9IEV1Z0JvZHkucm9sbF9zcGVlZDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsncm9sbF9zdG9wJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9ICdyb2xsX3NwZWVkID0gMDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9jaGFuZ2UnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBzcGVlZCA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ1NQRUVEJyk7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcblxuICB2YXIgYWRkc3Vic3RyYWN0ID0gMDtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJGQVNURVJcIjpcbiAgICAgIGFkZHN1YnN0cmFjdCA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiU0xPV0VSXCI6XG4gICAgICBhZGRzdWJzdHJhY3QgPSAtMTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHZhciBjb2RlID0gJ2lmIChyZWFjdGlvbl9zdHJlbmd0aD4wKSB7IGRlbHRhX3lhdyArPScgKyAnKGxpZ2h0RGlmZiA+IDAgPyBsaWdodERpZmYgOiAwLjIpICogZFQgKicgKyAgYWRkc3Vic3RyYWN0ICsgJyAqICcgKyBzcGVlZC5zcGxpdCgnXycpWzFdICsgJy8gMTAwICogRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsgfSc7XG4gIGNvZGUgKz0gJ2Vsc2UgeyByZWFjdGlvbl9zdHJlbmd0aCA9ICgxICsgJyArIGFkZHN1YnN0cmFjdCArICcqJyArIHNwZWVkLnNwbGl0KCdfJylbMV0gKyAnLyAxMDAgKSAqIEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGg7IH0nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9yYW5kb21seSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgLy92YXIgdmFsdWVfbWFnbml0dWRlID0gQmxvY2tseS5KYXZhU2NyaXB0LnZhbHVlVG9Db2RlKGJsb2NrLCAnTUFHTklUVURFJywgQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkUpO1xuICB2YXIgbWFnbml0dWRlID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnTUFHTklUVURFJyk7XG4gIC8vIFRoZSBtYWduaXR1ZGVzIGdldCB0cmFuc2xhdGVkIGluIHBlcmNlbnRhZ2VzIG9mIHRoZSBjb3JyZXNwb25kaW5nIGNvcmUgdmFsdWVzIChmd19zcGVlZCwgcm9sbF9zcGVlZCwgcmVhY3Rpb25fc3RyZW5ndGgpXG4gIC8vIG9yIG9mIHZhbHVlcyBkZWZpbmVkIGZvciBlYWNoIHR5cGUgb2YgcmVhY3Rpb25cbiAgdmFyIHZhbHVlX21hZ25pdHVkZSA9IDA7XG4gIHN3aXRjaCAobWFnbml0dWRlKSB7XG4gICAgY2FzZSBcIlZFUllfU01BTExcIjpcbiAgICAgIHZhbHVlX21hZ25pdHVkZSA9IDAuMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJTTUFMTFwiOlxuICAgICAgdmFsdWVfbWFnbml0dWRlID0gMC40O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIk1FRElVTVwiOlxuICAgICAgdmFsdWVfbWFnbml0dWRlID0gMC43O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxBUkdFXCI6XG4gICAgICB2YWx1ZV9tYWduaXR1ZGUgPSAxLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVkVSWV9MQVJHRVwiOlxuICAgICAgdmFsdWVfbWFnbml0dWRlID0gMS4zO1xuICAgICAgYnJlYWs7XG4gIH1cblxuXG4gIHZhciBjb2RlID0gJ2RlbHRhX3lhdyArPScgKyB2YWx1ZV9tYWduaXR1ZGUgKyAnICogWy0xLDFdW01hdGgucmFuZG9tKCkqMnwwXSpNYXRoLnJhbmRvbSgpICogY29uZmlnLnJlc2V0UmFuZG9tICogZFQ7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wyd0dXJuX2xyJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG5cbiAgLy8gTEVGVCBkaXJlY3Rpb24gaXMgaW4gcG9zaXRpdmUgbG9jYWwgeS1kaXJlY3Rpb24sIGlycmVzcGVjdGl2ZSBvZiBzZW5zb3IgbG9jYXRpb24uXG4gIC8vIFJJR0hUIGRpcmVjdGlvbiBpcyBpbiBuZWdhdGl2ZSBsb2NhbCB5LWRpcmVjdGlvbiwgaXJyZXNwZWN0aXZlIG9mIHNlbnNvciBsb2NhdGlvbi5cbiAgdmFyIGNvZGUgPSAnJztcblxuICB2YXIgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJMRUZUXCI6IC8vIFNldCBjb2VmZmljaWVudCBzdWNoIHRoYXQgd2hlbiBleWUgaXMgb24gKDEsMSkgaW4gcG9zaXRpdmUgeS1kaXJlY3Rpb24sIGxlZnQgaXMgdG93YXJkcyB0aGUgbGlnaHRcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiUklHSFRcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IC0xO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICcnO1xuICB2YXIgVFVSTl9NQVggPSAyO1xuICBjb2RlICs9ICdpZiAoIShyZWFjdGlvbl9zdHJlbmd0aCkpIHsgcmVhY3Rpb25fc3RyZW5ndGggPSBFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoOyB9JztcbiAgY29kZSArPSAnbGlnaHREaWZmID0nICsgJ2NhbGNJbnRlbnNpdHknICsgJyogcmVhY3Rpb25fc3RyZW5ndGg7JzsgLy8gUklHSFQgTk9XIFRISVMgSVMgV1JJVFRFTiBGT1IgMSBFWUUuIFJFV1JJVEUgVE8gQURBUFQuXG4gIGNvZGUgKz0gJ2lmIChsaWdodERpZmYgPT0gMCkgeyBsaWdodERpZmYgPSAwLjIgKiByZWFjdGlvbl9zdHJlbmd0aCB9JztcbiAgY29kZSArPSAnZGVsdGFfeWF3ICs9ICcgKyBmbGlwUm90YXRpb25EaXIgKyAnKiBNYXRoLmFicyhsaWdodERpZmYpICogZFQ7JztcblxuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3R1cm5fYXRfMXNlbnNvciddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuXG4gIC8qXG4gIEluIGRpcmVjdGlvbiBvZiB0aGUgc2Vuc29yOiBXaGVyZSB0aGUgc2Vuc29yIGlzIHBvaW50aW5nIHRvLCBpZiB0aGUgZmllbGQgaXMgc21hbGxlciB0aGFuIDIqUEksIE9SIHdoZXJlIHRoZSBzZW5zb3IgaXMgbG9jYXRlZCBJRiBOT1QgeV9zZW5zb3IgPSAwXG4gIEluIGRpcmVjdGlvbiBvZiB0aGUgZXllc3BvdDogSUYgVEhFUkUgSVMgQU4gRVlFU1BPVCwgdGhlbiBpbiB0aGUgZGlyZWN0aW9uIHRoYXQgaXQgaXMgbG9jYXRlZCBhdC5cbiAgVGhlIGRlY2lkaW5nIGZhY3RvciBpcyB0aGUgeSBjb29yZGluYXRlIG9mIHRoZSBzZW5zb3Igb3JpZW50YXRpb24sIHBvc2l0aW9uIG9yIG9mIHRoZSBleWVzcG90IHBvc2l0aW9uOlxuICAtIHkgPSAwOiBXZSBoYXZlIG5vIHNldCBkaXJlY3Rpb24uXG4gIC0geSA+IDA6IGNvdW50ZXItY2xvY2t3aXNlIGRpcmVjdGlvbiAoaS5lLiBwb3NpdGl2ZSBhbmdsZXMpXG4gIC0geSA8IDA6IGNsb2Nrd2lzZSBkaXJlY3Rpb24gKGkuZS4gbmVnYXRpdmUgYW5nbGVzKVxuXG4gIElmIGRpcmVjdGlvbiBpcyBcIlRPV0FSRFNcIiwgdGhlbiB0aGUgZmxpcFJvdGF0aW9uRGlyIGlzIHBvc2l0aXZlLCBhbmQgbmVnYXRpdmUgb3RoZXJ3aXNlLlxuICAqL1xuIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkFXQVlcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVE9XQVJEU1wiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJ3ZhciByb3RhdGlvbkRpciA9IDA7IFxcXG4gICAgaWYgKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aCkgeyBcXFxuICAgICAgaWYgKEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLmZpZWxkID09IDIqTWF0aC5QSSkgeyBcXFxuICAgICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLnBvc2l0aW9uLnk7IFxcXG4gICAgICB9IGVsc2UgeyBcXFxuICAgICAgICByb3RhdGlvbkRpciA9IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLm9yaWVudGF0aW9uLnk7IFxcXG4gICAgICB9IH0nO1xuXG4gIHZhciBUVVJOX01BWCA9IDI7XG4gIGNvZGUgKz0gJ2lmICghKHJlYWN0aW9uX3N0cmVuZ3RoKSkgeyByZWFjdGlvbl9zdHJlbmd0aCA9IEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGg7IH0nO1xuICBjb2RlICs9ICdsaWdodERpZmYgPSBjYWxjSW50ZW5zaXR5ICogcmVhY3Rpb25fc3RyZW5ndGg7JztcbiAgY29kZSArPSAnaWYgKGxpZ2h0RGlmZiA9PSAwKSB7IGxpZ2h0RGlmZiA9IDAuMiAqIHJlYWN0aW9uX3N0cmVuZ3RoIH0nO1xuICBjb2RlICs9ICdkZWx0YV95YXcgKz0gcm90YXRpb25EaXIgKicgKyAgZmxpcFJvdGF0aW9uRGlyICsgJyogTWF0aC5hYnMobGlnaHREaWZmKSAqIGRUOyc7XG5cbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wyd0dXJuX2F0XzFzZW5zb3JfZXllc3BvdCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuICB2YXIgb2JqZWN0ID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnT0JKRUNUJyk7XG5cbiAgLypcbiAgSW4gZGlyZWN0aW9uIG9mIHRoZSBzZW5zb3I6IFdoZXJlIHRoZSBzZW5zb3IgaXMgcG9pbnRpbmcgdG8sIGlmIHRoZSBmaWVsZCBpcyBzbWFsbGVyIHRoYW4gMipQSSwgT1Igd2hlcmUgdGhlIHNlbnNvciBpcyBsb2NhdGVkIElGIE5PVCB5X3NlbnNvciA9IDBcbiAgSW4gZGlyZWN0aW9uIG9mIHRoZSBleWVzcG90OiBJRiBUSEVSRSBJUyBBTiBFWUVTUE9ULCB0aGVuIGluIHRoZSBkaXJlY3Rpb24gdGhhdCBpdCBpcyBsb2NhdGVkIGF0LlxuICBUaGUgZGVjaWRpbmcgZmFjdG9yIGlzIHRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHNlbnNvciBvcmllbnRhdGlvbiwgcG9zaXRpb24gb3Igb2YgdGhlIGV5ZXNwb3QgcG9zaXRpb246XG4gIC0geSA9IDA6IFdlIGhhdmUgbm8gc2V0IGRpcmVjdGlvbi5cbiAgLSB5ID4gMDogY291bnRlci1jbG9ja3dpc2UgZGlyZWN0aW9uIChpLmUuIHBvc2l0aXZlIGFuZ2xlcylcbiAgLSB5IDwgMDogY2xvY2t3aXNlIGRpcmVjdGlvbiAoaS5lLiBuZWdhdGl2ZSBhbmdsZXMpXG5cbiAgSWYgZGlyZWN0aW9uIGlzIFwiVE9XQVJEU1wiLCB0aGVuIHRoZSBmbGlwUm90YXRpb25EaXIgaXMgcG9zaXRpdmUsIGFuZCBuZWdhdGl2ZSBvdGhlcndpc2UuXG4gICovXG4gdmFyIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiQVdBWVwiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJUT1dBUkRTXCI6XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAtMTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGNvZGUgPSAnJztcblxuICBpZiAob2JqZWN0ID09ICdTRU5TT1InKSB7XG4gICAgY29kZSArPSAndmFyIHJvdGF0aW9uRGlyID0gMDsgXFxcbiAgICBpZiAoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoKSB7IFxcXG4gICAgICBpZiAoRXVnQm9keS5saWdodFNlbnNvcnNbMF0uZmllbGQgPT0gMipNYXRoLlBJKSB7IFxcXG4gICAgICAgIHJvdGF0aW9uRGlyID0gRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueTsgXFxcbiAgICAgIH0gZWxzZSB7IFxcXG4gICAgICAgIHJvdGF0aW9uRGlyID0gRXVnQm9keS5saWdodFNlbnNvcnNbMF0ub3JpZW50YXRpb24ueTsgXFxcbiAgICAgIH0gfSc7XG4gIH0gZWxzZSBpZiAob2JqZWN0ID09ICdTUE9UJykge1xuICAgIGNvZGUgKz0gJ3ZhciByb3RhdGlvbkRpciA9IDA7IFxcXG4gICAgaWYgKEV1Z0JvZHkuc3BvdFBvc2l0aW9ucy5sZW5ndGg9PTEpIHsgXFxcbiAgICAgIHJvdGF0aW9uRGlyID0gRXVnQm9keS5zcG90UG9zaXRpb25zWzBdLnk7IH0nO1xuICB9XG5cbiAgdmFyIFRVUk5fTUFYID0gMjtcbiAgY29kZSArPSAnaWYgKCEocmVhY3Rpb25fc3RyZW5ndGgpKSB7IHJlYWN0aW9uX3N0cmVuZ3RoID0gRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsgfSc7XG4gIGNvZGUgKz0gJ2xpZ2h0RGlmZiA9JyArICdjYWxjSW50ZW5zaXR5JyArICcqIHJlYWN0aW9uX3N0cmVuZ3RoOyc7XG4gIGNvZGUgKz0gJ2lmIChsaWdodERpZmYgPT0gMCkgeyBsaWdodERpZmYgPSAwLjIgKiByZWFjdGlvbl9zdHJlbmd0aCB9JztcbiAgY29kZSArPSAnZGVsdGFfeWF3ICs9IHJvdGF0aW9uRGlyIConICsgIGZsaXBSb3RhdGlvbkRpciArICcqIE1hdGguYWJzKGxpZ2h0RGlmZikgKiBkVDsnO1xuXG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9hdF8yc2Vuc29ycyddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuXG4gIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkFXQVlcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IC0xO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlRPV0FSRFNcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJ3ZhciByb3RhdGlvbkRpciA9IDA7JztcblxuICBjb2RlICs9ICdyb3RhdGlvbkRpciA9IChzZW5zb3JJbnRlbnNpdGllc1sxXSAtIHNlbnNvckludGVuc2l0aWVzWzBdKSA8IDAgPyBFdWdCb2R5LmxpZ2h0U2Vuc29yc1sxXS5wb3NpdGlvbi55IDogRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueTsnO1xuXG4gIHZhciBUVVJOX01BWCA9IDI7XG4gIGNvZGUgKz0gJ2lmICghKHJlYWN0aW9uX3N0cmVuZ3RoKSkgeyByZWFjdGlvbl9zdHJlbmd0aCA9IEV1Z0JvZHkucmVhY3Rpb25fc3RyZW5ndGg7IH0nO1xuICBjb2RlICs9ICdsaWdodERpZmYgPScgKyAnY2FsY0ludGVuc2l0eScgKyAnKiByZWFjdGlvbl9zdHJlbmd0aDsnO1xuICBjb2RlICs9ICdpZiAobGlnaHREaWZmID09IDApIHsgbGlnaHREaWZmID0gMC4yICogcmVhY3Rpb25fc3RyZW5ndGggfSc7XG4gIGNvZGUgKz0gJ2RlbHRhX3lhdyArPSByb3RhdGlvbkRpciAqJyArICBmbGlwUm90YXRpb25EaXIgKyAnKiBNYXRoLmFicyhsaWdodERpZmYpICogZFQ7JztcblxuICByZXR1cm4gY29kZTtcbn07XG5cblxuLy8gQ09ORElUSU9OUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnbWFzdGVyX2Jsb2NrJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZGVmYXVsdENvZGUgPSBcInZhciBjYWxjSW50ZW5zaXR5ID0gKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aD4xKSA/IGxpZ2h0SW5mby5kaWZmQnR3U2Vuc29ycyA6IGxpZ2h0SW5mby5jdXJyZW50TGV2ZWxbMF07XCIgLy8gSEVSRSBXUklURSBUSEUgQ09SRSBMSUdIVCAtIDEgRVlFIE9SIDIgRVlFUy4gVEhJUyBDQU4gVEhFTiBCRSBNT0RJRklFRCBXSVRIIFRIRSBEUk9QLURPV04hIC0gV1JJVEUgQUxMIE9USEVSIENPREUgU1VDSCBUSEFUIElUIFRBS0VTIFRISVMgTElHSFQgTUVBU1VSRS5cbiAgZGVmYXVsdENvZGUgKz0gJ3ZhciByZWFjdGlvbl9zdHJlbmd0aCA9IG51bGw7J1xuICBkZWZhdWx0Q29kZSArPSAndmFyIGxpZ2h0RGlmZiA9IDA7J1xuICB2YXIgYWxsX2NvZGUgPSBCbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSBkZWZhdWx0Q29kZSArIGFsbF9jb2RlO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3NlZV9saWdodF9xdWFudGl0eSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHRocmVzaG9sZF9wZXJjZW50YWdlID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnVEhSRVNIT0xEJyk7XG4gIHZhciBzdGF0ZW1lbnRzX2NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ0NPREUnKTtcbiAgdGhyZXNob2xkX3BlcmNlbnRhZ2UgPSB0aHJlc2hvbGRfcGVyY2VudGFnZS5zcGxpdCgnXycpWzFdO1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICB2YXIgY29kZSA9ICdpZiAoKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aD4xICYmIE1hdGguYWJzKGxpZ2h0SW5mby5kaWZmQnR3U2Vuc29ycykgPiAnICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApIHx8IFxcXG4gICAgICAgICAgICAgKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aCA9PSAxICYmIE1hdGguYWJzKGxpZ2h0SW5mby5jdXJyZW50TGV2ZWxbMF0pID4nICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApKSB7JyArIHN0YXRlbWVudHNfY29kZSArICd9JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydzZWVfbGlnaHQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBzdGF0ZW1lbnRzX2NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ0NPREUnKTtcbiAgdmFyIHRocmVzaG9sZF9wZXJjZW50YWdlID0gMztcbiAgLy8gQWx0ZXJuYXRpdmVseSwgdXNlIHRoZSB0aHJlc2hvbGQgRXVnQm9keS5kZWZhdWx0cy5zZW5zaXRpdml0eV90aHJlc2hvbGRcbiAgdmFyIGNvZGUgPSAnaWYgKChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGg+MSAmJiBNYXRoLmFicyhsaWdodEluZm8uZGlmZkJ0d1NlbnNvcnMpID4gJyArIHRocmVzaG9sZF9wZXJjZW50YWdlICsgJy8gMTAwKSB8fCBcXFxuICAgICAgICAgICAgIChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGggPT0gMSAmJiBNYXRoLmFicyhsaWdodEluZm8uY3VycmVudExldmVsWzBdKSA+JyArIHRocmVzaG9sZF9wZXJjZW50YWdlICsgJy8gMTAwKSkgeycgKyBzdGF0ZW1lbnRzX2NvZGUgKyAnfSc7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnbm9fbGlnaHQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBzdGF0ZW1lbnRzX2NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ0NPREUnKTtcblxuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICB2YXIgdGhyZXNob2xkX3BlcmNlbnRhZ2UgPSA1O1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICB2YXIgY29kZSA9ICdpZiAoKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aD4xICYmIE1hdGguYWJzKGxpZ2h0SW5mby5kaWZmQnR3U2Vuc29ycykgPCAnICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApIHx8IFxcXG4gICAgICAgICAgICAgKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aCA9PSAxICYmIE1hdGguYWJzKGxpZ2h0SW5mby5jdXJyZW50TGV2ZWxbMF0pIDwnICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApKSB7JyArIHN0YXRlbWVudHNfY29kZSArICd9JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydlaXRoZXJfd2F5J10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnQ09ERScpO1xuICAvLyBBbHRlcm5hdGl2ZWx5LCB1c2UgdGhlIHRocmVzaG9sZCBFdWdCb2R5LmRlZmF1bHRzLnNlbnNpdGl2aXR5X3RocmVzaG9sZFxuICByZXR1cm4gY29kZTtcbn07XG4iXX0=
