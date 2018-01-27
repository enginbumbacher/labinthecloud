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
    "colour": 120,
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
            "a very small amount",
            "VERY_SMALL"
          ],
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
          ],
          [
            "a very large amount",
            "VERY_LARGE"
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
    "colour": 120,
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
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "stop_forward",
    "message0": "Stop moving forward",
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "stop_rolling",
    "message0": "Stop rotating around axis",
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "turn_randomly",
    "message0": "Turn randomly by %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "MAGNITUDE",
        "check": [
          "String",
          "modifier_rand"
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "forward_speed",
    "message0": "Move %1 by %2 %3 percent",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "faster",
            "FASTER"
          ],
          [
            "slower",
            "SLOWER"
          ]
        ]
      },
      {
        "type": "field_number",
        "name": "SPEED",
        "value": 0,
        "min": 0,
        "max": 100,
        "precision": 1
      },
      {
        "type": "input_dummy"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "Test",
    "helpUrl": ""
  },
  { "type": "roll_speed",
    "message0": "Rotate %1 by %2 %3 percent",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "faster",
            "FASTER"
          ],
          [
            "slower",
            "SLOWER"
          ]
        ]
      },
      {
        "type": "field_number",
        "name": "SPEED",
        "value": 0,
        "min": 0,
        "max": 100,
        "precision": 1
      },
      {
        "type": "input_dummy"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "Test",
    "helpUrl": ""
  },
  { "type": "turn_at_1sensor",
    "message0": "Turn %1 the %2 %3 by %4",
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
            "in direction of",
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
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "MAGNITUDE",
        "check": [
          "Number",
          "String",
          "modifier_prob",
          "modifier_rand"
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "turn_lr",
    "message0": "Turn %1 %2 by %3",
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
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "MAGNITUDE",
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
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "turn_at_2sensors",
    "message0": "Turn %1 the %2 sensor %3 by %4",
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
            "in direction of",
            "TOWARDS"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "OBJECT",
        "options": [
          [
            "stronger",
            "STRONGER"
          ],
          [
            "weaker",
            "WEAKER"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "MAGNITUDE",
        "check": [
          "Number",
          "String",
          "modifier_prob",
          "modifier_rand"
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "either_way",
    "message0": "Either way, I will do the following: %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "CODE"
      }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 270,
    "tooltip": "",
    "helpUrl": ""
  },
  { "type": "see_light",
    "message0": "If I see a difference in light that is bigger than %1 percent, then I will ... %2 %3",
    "args0": [
      {
        "type": "field_number",
        "name": "THRESHOLD",
        "value": 0,
        "min": 0,
        "max": 100
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
    "tooltip": "",
    "helpUrl": ""
  }
]);

window.Blockly.Blocks['every_time'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("This is how I process the light:");
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.setInputsInline(false);
    this.setColour(230);
    this.setDeletable(false);
 this.setTooltip("");
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

window.Blockly.JavaScript['forward_speed'] = function(block) {
  var speed = block.getFieldValue('SPEED');
  var direction = blockgetFieldValue('DIRECTION');

  var addsubstract = 0;
  switch(direction) {
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

window.Blockly.JavaScript['roll_speed'] = function(block) {
  var speed = block.getFieldValue('SPEED');
  var direction = blockgetFieldValue('DIRECTION');

  var addsubstract = 0;
  switch(direction) {
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

Blockly.JavaScript['stop_forward'] = function(block) {
  var code = 'fw_speed = 0;';
  return code;
};

Blockly.JavaScript['stop_rolling'] = function(block) {
  var code = 'roll_speed = 0;';
  return code;
};

Blockly.JavaScript['turn_randomly'] = function(block) {
  var value_magnitude = Blockly.JavaScript.valueToCode(block, 'MAGNITUDE', Blockly.JavaScript.ORDER_NONE);
  var code = 'delta_yaw +=' + value_magnitude + ' * [-1,1][Math.random()*2|0]*Math.random() * config.resetRandom * dT;';
  return code;
};

window.Blockly.JavaScript['turn_lr'] = function(block) {
  var direction = block.getFieldValue('DIRECTION');
  var magnitude = window.Blockly.JavaScript.valueToCode(block,'MAGNITUDE',window.Blockly.JavaScript.ORDER_NONE);

  // LEFT direction is in positive local y-direction, irrespective of sensor location.
  // RIGHT direction is in negative local y-direction, irrespective of sensor location.
  var code = '';

  var flipRotationDir = 1;
  switch(direction) {
    case "LEFT": // Set coefficient such that when eye is on (1,1) in positive y-direction, left is towards the light
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

window.Blockly.JavaScript['turn_at_1sensor'] = function(block) {
  var direction = block.getFieldValue('DIRECTION');
  var object = block.getFieldValue('OBJECT');
  var magnitude = window.Blockly.JavaScript.valueToCode(block,'MAGNITUDE',window.Blockly.JavaScript.ORDER_NONE);

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

  code += 'delta_yaw += rotationDir *' +  flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};

window.Blockly.JavaScript['turn_at_2sensors'] = function(block) {
  var direction = block.getFieldValue('DIRECTION');
  var object = block.getFieldValue('OBJECT');
  var magnitude = window.Blockly.JavaScript.valueToCode(block,'MAGNITUDE',window.Blockly.JavaScript.ORDER_NONE);

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

  code += 'delta_yaw += rotationDir *' +  flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};


// CONDITIONS ************************************************

window.Blockly.JavaScript['every_time'] = function(block) {
  var all_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = all_code;
  return code;
};

window.Blockly.JavaScript['see_light'] = function(block) {
  var threshold_percentage = block.getFieldValue('THRESHOLD');
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // Alternatively, use the threshold EugBody.defaults.sensitivity_threshold
  var code = 'if ((EugBody.lightSensors.length>1 && Math.abs(lightInfo.diffBtwSensors) > ' + threshold_percentage + '/ 100) || \
             (EugBody.lightSensors.length == 1 && Math.abs(lightInfo.diffNowToAdaptLevel) >' + threshold_percentage + '/ 100)) {' + statements_code + '}';
  return code;
};
