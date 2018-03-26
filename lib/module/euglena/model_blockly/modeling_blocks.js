window.Blockly.defineBlocksWithJsonArray([
  { "type": "modifier_rand",
    "message0": "more or less %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "QUANT",
        "check": [
          "Number",
          "String",
          "modifier_prob",
          "modifier_rand",
          "quant_prop_1sensor",
          "quant_prop_2sensors"
        ]
      }
    ],
    "inputsInline": true,
    "output": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "qual_absolute",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "MAGNITUDE",
        "options": [
          [
            "a small amount",
            "SMALL"
          ],
          [
            "a medium amount",
            "MEDIUM"
          ],
          [
            "a large amount",
            "LARGE"
          ]
        ]
      }
    ],
    "output": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "quant_prop_1sensor",
    "message0": "amount prop. to %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FACTOR",
        "options": [
          [
            "diff in light seen now vs before",
            "LIGHT_DIFF"
          ],
          [
            "light seen now",
            "LIGHT_NOW"
          ],
          [
            "general level of brightness",
            "LIGHT_AVG"
          ]
        ]
      }
    ],
    "inputsInline": true,
    "output": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "quant_prop_2sensors",
    "message0": "amount proportional to the %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FACTOR",
        "options": [
          [
            "difference between left and right sensors",
            "LIGHT_DIFF"
          ],
          [
            "perceived light of right sensor",
            "LIGHT_RIGHT"
          ],
          [
            "perceived light of left sensor",
            "LIGHT_LEFT"
          ],
          [
            "general level of brightness",
            "LIGHT_AVG"
          ]
        ]
      }
    ],
    "inputsInline": true,
    "output": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "move_normal",
    "message0": "Move with default speed",
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "Tell the the model to move forward with the speed that you defined for the body.",
    "helpUrl": ""
  },
  { "type": "move_change",
    "message0": "%1 forward speed by %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "Increase",
            "FASTER"
          ],
          [
            "Decrease",
            "SLOWER"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "SPEED",
        "options": [
          [
            "20 percent",
            "CHANGE_20"
          ],
          [
            "40 percent",
            "CHANGE_40"
          ],
          [
            "60 percent",
            "CHANGE_60"
          ],
          [
            "80 percent",
            "CHANGE_80"
          ],
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "Tell the model to move faster or slower. E.g. move faster by 50% means 'increase your forward speed by 50% of your default speed'",
    "helpUrl": ""
  },
  { "type": "move_stop",
    "message0": "Stop moving forward",
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "roll_normal",
    "message0": "Rotate with default speed",
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 30,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "roll_change",
    "message0": "%1 rotation speed by %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "Increase",
            "FASTER"
          ],
          [
            "Decrease",
            "SLOWER"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "SPEED",
        "options": [
          [
            "20 percent",
            "CHANGE_20"
          ],
          [
            "40 percent",
            "CHANGE_40"
          ],
          [
            "60 percent",
            "CHANGE_60"
          ],
          [
            "80 percent",
            "CHANGE_80"
          ],
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 30,
    "tooltip": "Tell the model to rotate faster around its axis. E.g. Rotate faster by 50% means 'increase your rotate speed by 50% of your default speed'",
    "helpUrl": ""
  },
  { "type": "roll_stop",
    "message0": "Stop rotating",
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 30,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "turn_change",
    "message0": "%1 turn speed by %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "Increase",
            "FASTER"
          ],
          [
            "Decrease",
            "SLOWER"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "SPEED",
        "options": [
          [
            "20 percent",
            "CHANGE_20"
          ],
          [
            "40 percent",
            "CHANGE_40"
          ],
          [
            "60 percent",
            "CHANGE_60"
          ],
          [
            "80 percent",
            "CHANGE_80"
          ],
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 218,
    "tooltip": "Tell the model to turn faster or slower. E.g. turn faster by 50% means 'increase your turning speed by 50% of your default speed'",
    "helpUrl": ""
  },
  { "type": "turn_randomly",
    "message0": "Turn randomly by %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "MAGNITUDE",
        "options": [
          [
            "a little",
            "SMALL"
          ],
          [
            "a moderate amount",
            "MEDIUM"
          ],
          [
            "a lot",
            "LARGE"
          ]
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 218,
    "tooltip": "Tell the model to turn randomly left or right by a certain amount.",
    "helpUrl": ""
  },
  { "type": "turn_lr",
    "message0": "Turn %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "left",
            "LEFT"
          ],
          [
            "right",
            "RIGHT"
          ]
        ]
      }],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 218,
    "tooltip": "Tell the model to turn left or right. How fast it turns depends on the response strength of the body and the light intensity.",
    "helpUrl": ""
  },
  { "type": "turn_at_1sensor",
    "message0": "Turn %1 the sensor",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "away from",
            "AWAY"
          ],
          [
            "towards",
            "TOWARDS"
          ]
        ]
      }],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 218,
    "tooltip": "This block is only active when there is one sensor; tell the model to turn based on where the sensor is. How fast it turns depends on the response strength of the body and the light intensity.",
    "helpUrl": ""
  },
  { "type": "turn_at_1sensor_eyespot",
    "message0": "Turn %1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "away from the",
            "AWAY"
          ],
          [
            "towards the",
            "TOWARDS"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "OBJECT",
        "options": [
          [
            "sensor",
            "SENSOR"
          ],
          [
            "eyespot",
            "SPOT"
          ]
        ]
      }],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 218,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "turn_at_2sensors",
    "message0": "Turn %1 %2 sensor that detects brighter light",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "away from the",
            "AWAY"
          ],
          [
            "towards the",
            "TOWARDS"
          ]
        ]
      },
      {
        "type": "input_dummy"
      }],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 218,
    "tooltip": "This block is only active when there are two sensors; tell the model to turn based on how much light each sensor detects. How fast it turns depends on the response strength of the body and the light intensity.",
    "helpUrl": ""
  },
  { "type": "see_light_quantity",
    "message0": "If the detected light is %1: %2 %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "THRESHOLD",
        "options": [
          [
            "small",
            "THRESH_10"
          ],
          [
            "medium",
            "THRESH_30"
          ],
          [
            "large",
            "THRESH_50"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "CODE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "You can pull this block into the container block that says 'If it detects light'. The model will only execute the blocks in this container if the detected light is strong enough.",
    "helpUrl": ""
  }
]);

window.Blockly.Blocks['master_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Put all the blocks in here:");
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.setInputsInline(false);
    this.setColour(230);
    this.setDeletable(false);
 this.setTooltip("You can pull any block from the toolbox above, and drag it into one of the three purple container blocks.");
 this.setHelpUrl("");
  }
};

window.Blockly.Blocks['see_light'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("If it detects light:");
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true,null);
    this.setNextStatement(false,null);
    this.setColour(1);
    this.setDeletable(false);
    this.setMovable(false);
 this.setTooltip("Put any block in here to be executed if the model detects light.");
 this.setHelpUrl("");
  }
};

window.Blockly.Blocks['no_light'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("If it detects no light:");
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true,null);
    this.setNextStatement(true,null);
    this.setColour(1);
    this.setDeletable(false);
    this.setMovable(false);
 this.setTooltip("Put any block in here to be executed if the model does not detect light.");
 this.setHelpUrl("");
  }
};

window.Blockly.Blocks['either_way'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Independent of whether it detects light or not:");
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true,null);
    this.setNextStatement(true,null);
    this.setColour(1);
    this.setDeletable(false);
    this.setMovable(false);
 this.setTooltip("Put any block in here to be executed independently of whethere the model detects light or not.");
 this.setHelpUrl("");
  }
};


// QUANTITIES AND MAGNITUDES
window.Blockly.JavaScript['modifier_rand'] = function(block) {
  var quantity = window.Blockly.JavaScript.valueToCode(block,'QUANT',window.Blockly.JavaScript.ORDER_NONE);
  var randomCoeff = 0.1;
  var randomFactor = '1 + [-1,1][Math.random()*2|0]*Math.random() *' + randomCoeff;
  var code = randomFactor  + '*' + quantity;
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['quant_prop_1sensor'] = function(block) {
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

window.Blockly.JavaScript['quant_prop_2sensors'] = function(block) {
  var factor = block.getFieldValue('FACTOR');

  var prop_to = 0;
  switch (factor) {
    case "LIGHT_DIFF":
      prop_to = 'lightInfo.diffNowToAdaptLevel';
      break;
    case "LIGHT_RIGHT": // y = -1
      prop_to = 'lightInfo.currentLevel[EugBody.lightSensors[0].position.y < 0 ? 0 : 1]';
      break;
    case "LiGHT_LEFT": // y = 1
      prop_to = 'lightInfo.currentLevel[EugBody.lightSensors[0].position.y > 0 ? 0 : 1]';
      break;
    case "LIGHT_AVG":
      prop_to = 'lightInfo.adaptLevel';
      break;
  }
  var code = prop_to;
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['qual_absolute'] = function(block) {
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

window.Blockly.JavaScript['math_number'] = function(block) {
  var number = block.getFieldValue('NUM');
  var code = number;
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

// ACTIONS AND BEHAVIORS ************************************************

window.Blockly.JavaScript['move_change'] = function(block) {
  var speed = block.getFieldValue('SPEED');
  var direction = block.getFieldValue('DIRECTION');
  var addsubstract = 0;
  switch(direction) {
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

window.Blockly.JavaScript['roll_change'] = function(block) {
  var speed = block.getFieldValue('SPEED');
  var direction = block.getFieldValue('DIRECTION');

  var addsubstract = 0;
  switch(direction) {
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

Blockly.JavaScript['move_stop'] = function(block) {
  var code = 'fw_speed = 0;';
  return code;
};

Blockly.JavaScript['move_normal'] = function(block) {
  var code = 'fw_speed = EugBody.fw_speed;';
  return code;
};

Blockly.JavaScript['roll_normal'] = function(block) {
  var code = 'roll_speed = EugBody.roll_speed;';
  return code;
};

Blockly.JavaScript['roll_stop'] = function(block) {
  var code = 'roll_speed = 0;';
  return code;
};

Blockly.JavaScript['turn_change'] = function(block) {
  var speed = block.getFieldValue('SPEED');
  var direction = block.getFieldValue('DIRECTION');

  var addsubstract = 0;
  switch(direction) {
    case "FASTER":
      addsubstract = 1;
      break;
    case "SLOWER":
      addsubstract = -1;
      break;
  }
  var code = 'if (reaction_strength>0) { delta_yaw +=' + '(lightDiff > 0 ? lightDiff : 0.2) * dT *' +  addsubstract + ' * ' + speed.split('_')[1] + '/ 100 * EugBody.reaction_strength; }';
  code += 'else { reaction_strength = (1 + ' + addsubstract + '*' + speed.split('_')[1] + '/ 100 ) * EugBody.reaction_strength; }';
  return code;
};

Blockly.JavaScript['turn_randomly'] = function(block) {
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

window.Blockly.JavaScript['turn_lr'] = function(block) {
  var direction = block.getFieldValue('DIRECTION');

  // LEFT direction is in positive local y-direction, irrespective of sensor location.
  // RIGHT direction is in negative local y-direction, irrespective of sensor location.
  var code = '';

  var flipRotationDir = 1;
  switch(direction) {
    case "LEFT": // Set coefficient such that when eye is on (1,1) in positive y-direction, left is towards the light
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

window.Blockly.JavaScript['turn_at_1sensor'] = function(block) {
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
  switch(direction) {
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
  code += 'delta_yaw += rotationDir *' +  flipRotationDir + '* Math.abs(lightDiff) * dT;';

  return code;
};

window.Blockly.JavaScript['turn_at_1sensor_eyespot'] = function(block) {
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
  switch(direction) {
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
  code += 'delta_yaw += rotationDir *' +  flipRotationDir + '* Math.abs(lightDiff) * dT;';

  return code;
};

window.Blockly.JavaScript['turn_at_2sensors'] = function(block) {
  var direction = block.getFieldValue('DIRECTION');

  var flipRotationDir = 1;
  switch(direction) {
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
  code += 'delta_yaw += rotationDir *' +  flipRotationDir + '* Math.abs(lightDiff) * dT;';

  return code;
};


// CONDITIONS ************************************************

window.Blockly.JavaScript['master_block'] = function(block) {
  var defaultCode = "var calcIntensity = (EugBody.lightSensors.length>1) ? lightInfo.diffBtwSensors : lightInfo.currentLevel[0];" // HERE WRITE THE CORE LIGHT - 1 EYE OR 2 EYES. THIS CAN THEN BE MODIFIED WITH THE DROP-DOWN! - WRITE ALL OTHER CODE SUCH THAT IT TAKES THIS LIGHT MEASURE.
  defaultCode += 'var reaction_strength = null;'
  defaultCode += 'var lightDiff = 0;'
  var all_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = defaultCode + all_code;
  return code;
};

window.Blockly.JavaScript['see_light_quantity'] = function(block) {
  var threshold_percentage = block.getFieldValue('THRESHOLD');
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  threshold_percentage = threshold_percentage.split('_')[1];
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) > ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.currentLevel[0]) >' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};

window.Blockly.JavaScript['see_light'] = function(block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  var threshold_percentage = 3;
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) > ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.currentLevel[0]) >' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};

window.Blockly.JavaScript['no_light'] = function(block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');

  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var threshold_percentage = 5;
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) < ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.currentLevel[0]) <' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};

window.Blockly.JavaScript['either_way'] = function(block) {
  var code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  return code;
};
