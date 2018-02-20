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
  "colour": 30,
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
}, { "type": "turn_at_1sensor",
  "message0": "Turn %1 the %2",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["away from", "AWAY"], ["in direction of", "TOWARDS"]]
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
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
}, { "type": "turn_at_2sensors",
  "message0": "Turn %1 the %2 sensor",
  "args0": [{
    "type": "field_dropdown",
    "name": "DIRECTION",
    "options": [["away from", "AWAY"], ["in direction of", "TOWARDS"]]
  }, {
    "type": "field_dropdown",
    "name": "OBJECT",
    "options": [["stronger", "STRONGER"], ["weaker", "WEAKER"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 30,
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
  var code = 'fw_speed +=' + addsubstract + '*' + speed + '/ 100 * fw_speed;';
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
  var object = block.getFieldValue('OBJECT');

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
  code += 'var lightDiff =' + 'calcIntensity' + '* EugBody.reaction_strength;';
  code += 'delta_yaw += rotationDir *' + flipRotationDir + '* Math.abs(EugBody.reaction_strength * lightDiff) * dT;';

  return code;
};

// CONDITIONS ************************************************

window.Blockly.JavaScript['every_time'] = function (block) {
  var defaultCode = "var calcIntensity = (EugBody.lightSensors.length>1) ? lightInfo.diffBtwSensors : lightInfo.currentLevel[0];"; // HERE WRITE THE CORE LIGHT - 1 EYE OR 2 EYES. THIS CAN THEN BE MODIFIED WITH THE DROP-DOWN! - WRITE ALL OTHER CODE SUCH THAT IT TAKES THIS LIGHT MEASURE.
  var all_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = defaultCode + all_code;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kZWxpbmdfYmxvY2tzLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIkJsb2NrbHkiLCJkZWZpbmVCbG9ja3NXaXRoSnNvbkFycmF5IiwiQmxvY2tzIiwiaW5pdCIsImFwcGVuZER1bW15SW5wdXQiLCJhcHBlbmRGaWVsZCIsImFwcGVuZFN0YXRlbWVudElucHV0Iiwic2V0Q2hlY2siLCJzZXRJbnB1dHNJbmxpbmUiLCJzZXRDb2xvdXIiLCJzZXREZWxldGFibGUiLCJzZXRUb29sdGlwIiwic2V0SGVscFVybCIsIkphdmFTY3JpcHQiLCJibG9jayIsInF1YW50aXR5IiwidmFsdWVUb0NvZGUiLCJPUkRFUl9OT05FIiwicmFuZG9tQ29lZmYiLCJyYW5kb21GYWN0b3IiLCJjb2RlIiwiZmFjdG9yIiwiZ2V0RmllbGRWYWx1ZSIsInByb3BfdG8iLCJtYWduaXR1ZGUiLCJwZXJjZW50YWdlIiwibnVtYmVyIiwic3BlZWQiLCJkaXJlY3Rpb24iLCJhZGRzdWJzdHJhY3QiLCJ2YWx1ZV9tYWduaXR1ZGUiLCJmbGlwUm90YXRpb25EaXIiLCJUVVJOX01BWCIsIm9iamVjdCIsImRlZmF1bHRDb2RlIiwiYWxsX2NvZGUiLCJzdGF0ZW1lbnRUb0NvZGUiLCJ0aHJlc2hvbGRfcGVyY2VudGFnZSIsInN0YXRlbWVudHNfY29kZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxDQUFlQyx5QkFBZixDQUF5QyxDQUN2QyxFQUFFLFFBQVEsZUFBVjtBQUNFLGNBQVksb0JBRGQ7QUFFRSxXQUFTLENBQ1A7QUFDRSxZQUFRO0FBRFYsR0FETyxFQUlQO0FBQ0UsWUFBUSxhQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsYUFBUyxDQUNQLFFBRE8sRUFFUCxRQUZPLEVBR1AsZUFITyxFQUlQLGVBSk8sRUFLUCxvQkFMTyxFQU1QLHFCQU5PO0FBSFgsR0FKTyxDQUZYO0FBbUJFLGtCQUFnQixJQW5CbEI7QUFvQkUsWUFBVSxJ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QjtBQUN4RCxNQUFJb0IsY0FBYyw2R0FBbEIsQ0FEd0QsQ0FDd0U7QUFDaEksTUFBSUMsV0FBV25DLFFBQVFhLFVBQVIsQ0FBbUJ1QixlQUFuQixDQUFtQ3RCLEtBQW5DLEVBQTBDLE1BQTFDLENBQWY7QUFDQTtBQUNBLE1BQUlNLE9BQU9jLGNBQWNDLFFBQXpCO0FBQ0EsU0FBT2YsSUFBUDtBQUNELENBTkQ7O0FBUUFyQixPQUFPQyxPQUFQLENBQWVhLFVBQWYsQ0FBMEIsV0FBMUIsSUFBeUMsVUFBU0MsS0FBVCxFQUFnQjtBQUN2RCxNQUFJdUIsdUJBQXVCdkIsTUFBTVEsYUFBTixDQUFvQixXQUFwQixDQUEzQjtBQUNBLE1BQUlnQixrQkFBa0J2QyxPQUFPQyxPQUFQLENBQWVhLFVBQWYsQ0FBMEJ1QixlQUExQixDQUEwQ3RCLEtBQTFDLEVBQWlELE1BQWpELENBQXRCO0FBQ0E7QUFDQSxNQUFJTSxPQUFPLGdGQUFnRmlCLG9CQUFoRixHQUF1Rzs0RkFBdkcsR0FDa0ZBLG9CQURsRixHQUN5RyxXQUR6RyxHQUN1SEMsZUFEdkgsR0FDeUksR0FEcEo7QUFFQSxTQUFPbEIsSUFBUDtBQUNELENBUEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9tb2RlbGluZ19ibG9ja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuQmxvY2tseS5kZWZpbmVCbG9ja3NXaXRoSnNvbkFycmF5KFtcbiAgeyBcInR5cGVcIjogXCJtb2RpZmllcl9yYW5kXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIm1vcmUgb3IgbGVzcyAlMSAlMlwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF92YWx1ZVwiLFxuICAgICAgICBcIm5hbWVcIjogXCJRVUFOVFwiLFxuICAgICAgICBcImNoZWNrXCI6IFtcbiAgICAgICAgICBcIk51bWJlclwiLFxuICAgICAgICAgIFwiU3RyaW5nXCIsXG4gICAgICAgICAgXCJtb2RpZmllcl9wcm9iXCIsXG4gICAgICAgICAgXCJtb2RpZmllcl9yYW5kXCIsXG4gICAgICAgICAgXCJxdWFudF9wcm9wXzFzZW5zb3JcIixcbiAgICAgICAgICBcInF1YW50X3Byb3BfMnNlbnNvcnNcIlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwib3V0cHV0XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMTgwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwicXVhbF9hYnNvbHV0ZVwiLFxuICAgIFwibWVzc2FnZTBcIjogXCIlMVwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJNQUdOSVRVREVcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImEgdmVyeSBzbWFsbCBhbW91bnRcIixcbiAgICAgICAgICAgIFwiVkVSWV9TTUFMTFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImEgc21hbGwgYW1vdW50XCIsXG4gICAgICAgICAgICBcIlNNQUxMXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSBtZWRpdW0gYW1vdW50XCIsXG4gICAgICAgICAgICBcIk1FRElVTVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImEgbGFyZ2UgYW1vdW50XCIsXG4gICAgICAgICAgICBcIkxBUkdFXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYSB2ZXJ5IGxhcmdlIGFtb3VudFwiLFxuICAgICAgICAgICAgXCJWRVJZX0xBUkdFXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwib3V0cHV0XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMTgwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwicXVhbnRfcHJvcF8xc2Vuc29yXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcImFtb3VudCBwcm9wLiB0byAlMVwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJGQUNUT1JcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImRpZmYgaW4gbGlnaHQgc2VlbiBub3cgdnMgYmVmb3JlXCIsXG4gICAgICAgICAgICBcIkxJR0hUX0RJRkZcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJsaWdodCBzZWVuIG5vd1wiLFxuICAgICAgICAgICAgXCJMSUdIVF9OT1dcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJnZW5lcmFsIGxldmVsIG9mIGJyaWdodG5lc3NcIixcbiAgICAgICAgICAgIFwiTElHSFRfQVZHXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxODAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJxdWFudF9wcm9wXzJzZW5zb3JzXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcImFtb3VudCBwcm9wb3J0aW9uYWwgdG8gdGhlICUxXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkZBQ1RPUlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZGlmZmVyZW5jZSBiZXR3ZWVuIGxlZnQgYW5kIHJpZ2h0IHNlbnNvcnNcIixcbiAgICAgICAgICAgIFwiTElHSFRfRElGRlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInBlcmNlaXZlZCBsaWdodCBvZiByaWdodCBzZW5zb3JcIixcbiAgICAgICAgICAgIFwiTElHSFRfUklHSFRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJwZXJjZWl2ZWQgbGlnaHQgb2YgbGVmdCBzZW5zb3JcIixcbiAgICAgICAgICAgIFwiTElHSFRfTEVGVFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImdlbmVyYWwgbGV2ZWwgb2YgYnJpZ2h0bmVzc1wiLFxuICAgICAgICAgICAgXCJMSUdIVF9BVkdcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcIm91dHB1dFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDE4MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInN0b3BfZm9yd2FyZFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJTdG9wIG1vdmluZyBmb3J3YXJkXCIsXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJzdG9wX3JvbGxpbmdcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiU3RvcCByb3RhdGluZyBhcm91bmQgYXhpc1wiLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9yYW5kb21seVwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJUdXJuIHJhbmRvbWx5IGJ5ICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3ZhbHVlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk1BR05JVFVERVwiLFxuICAgICAgICBcImNoZWNrXCI6IFtcbiAgICAgICAgICBcIlN0cmluZ1wiLFxuICAgICAgICAgIFwibW9kaWZpZXJfcmFuZFwiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDMwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwiZm9yd2FyZF9zcGVlZFwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJNb3ZlICUxIGJ5ICUyICUzIHBlcmNlbnRcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJmYXN0ZXJcIixcbiAgICAgICAgICAgIFwiRkFTVEVSXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwic2xvd2VyXCIsXG4gICAgICAgICAgICBcIlNMT1dFUlwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9udW1iZXJcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiU1BFRURcIixcbiAgICAgICAgXCJ2YWx1ZVwiOiAwLFxuICAgICAgICBcIm1pblwiOiAwLFxuICAgICAgICBcIm1heFwiOiAxMDAsXG4gICAgICAgIFwicHJlY2lzaW9uXCI6IDI1XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJUZXN0XCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJyb2xsX3NwZWVkXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlJvdGF0ZSAlMSBieSAlMiAlMyBwZXJjZW50XCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZmFzdGVyXCIsXG4gICAgICAgICAgICBcIkZBU1RFUlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNsb3dlclwiLFxuICAgICAgICAgICAgXCJTTE9XRVJcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfbnVtYmVyXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlNQRUVEXCIsXG4gICAgICAgIFwidmFsdWVcIjogMCxcbiAgICAgICAgXCJtaW5cIjogMCxcbiAgICAgICAgXCJtYXhcIjogMTAwLFxuICAgICAgICBcInByZWNpc2lvblwiOiAyNVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiVGVzdFwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHsgXCJ0eXBlXCI6IFwidHVybl9hdF8xc2Vuc29yXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlR1cm4gJTEgdGhlICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYXdheSBmcm9tXCIsXG4gICAgICAgICAgICBcIkFXQVlcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJpbiBkaXJlY3Rpb24gb2ZcIixcbiAgICAgICAgICAgIFwiVE9XQVJEU1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJPQkpFQ1RcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInNlbnNvclwiLFxuICAgICAgICAgICAgXCJTRU5TT1JcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJleWVzcG90XCIsXG4gICAgICAgICAgICBcIlNQT1RcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfV0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJ0dXJuX2xyXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIlR1cm4gJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiRElSRUNUSU9OXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJsZWZ0XCIsXG4gICAgICAgICAgICBcIkxFRlRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJyaWdodFwiLFxuICAgICAgICAgICAgXCJSSUdIVFwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcInR1cm5fYXRfMnNlbnNvcnNcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiVHVybiAlMSB0aGUgJTIgc2Vuc29yXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkRJUkVDVElPTlwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYXdheSBmcm9tXCIsXG4gICAgICAgICAgICBcIkFXQVlcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJpbiBkaXJlY3Rpb24gb2ZcIixcbiAgICAgICAgICAgIFwiVE9XQVJEU1wiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJPQkpFQ1RcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInN0cm9uZ2VyXCIsXG4gICAgICAgICAgICBcIlNUUk9OR0VSXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwid2Vha2VyXCIsXG4gICAgICAgICAgICBcIldFQUtFUlwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAzMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7IFwidHlwZVwiOiBcImVpdGhlcl93YXlcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiRWl0aGVyIHdheSwgSSB3aWxsIGRvIHRoZSBmb2xsb3dpbmc6ICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJDT0RFXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IGZhbHNlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyNzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAgeyBcInR5cGVcIjogXCJzZWVfbGlnaHRcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiSWYgSSBzZWUgYSBkaWZmZXJlbmNlIGluIGxpZ2h0IHRoYXQgaXMgYmlnZ2VyIHRoYW4gJTEgcGVyY2VudCwgdGhlbiBJIHdpbGwgLi4uICUyICUzXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX251bWJlclwiLFxuICAgICAgICBcIm5hbWVcIjogXCJUSFJFU0hPTERcIixcbiAgICAgICAgXCJ2YWx1ZVwiOiAwLFxuICAgICAgICBcIm1pblwiOiAwLFxuICAgICAgICBcIm1heFwiOiAxMDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJDT0RFXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyNzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfVxuXSk7XG5cbndpbmRvdy5CbG9ja2x5LkJsb2Nrc1snZXZlcnlfdGltZSddID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGVuZER1bW15SW5wdXQoKVxuICAgICAgICAuYXBwZW5kRmllbGQoXCJUaGlzIGlzIGhvdyBJIHByb2Nlc3MgdGhlIGxpZ2h0OlwiKTtcbiAgICB0aGlzLmFwcGVuZFN0YXRlbWVudElucHV0KFwiQ09ERVwiKVxuICAgICAgICAuc2V0Q2hlY2sobnVsbCk7XG4gICAgdGhpcy5zZXRJbnB1dHNJbmxpbmUoZmFsc2UpO1xuICAgIHRoaXMuc2V0Q29sb3VyKDIzMCk7XG4gICAgdGhpcy5zZXREZWxldGFibGUoZmFsc2UpO1xuIHRoaXMuc2V0VG9vbHRpcChcIlwiKTtcbiB0aGlzLnNldEhlbHBVcmwoXCJcIik7XG4gIH1cbn07XG5cbi8vIFFVQU5USVRJRVMgQU5EIE1BR05JVFVERVNcbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ21vZGlmaWVyX3JhbmQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBxdWFudGl0eSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQudmFsdWVUb0NvZGUoYmxvY2ssJ1FVQU5UJyx3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkUpO1xuICB2YXIgcmFuZG9tQ29lZmYgPSAwLjE7XG4gIHZhciByYW5kb21GYWN0b3IgPSAnMSArIFstMSwxXVtNYXRoLnJhbmRvbSgpKjJ8MF0qTWF0aC5yYW5kb20oKSAqJyArIHJhbmRvbUNvZWZmO1xuICB2YXIgY29kZSA9IHJhbmRvbUZhY3RvciAgKyAnKicgKyBxdWFudGl0eTtcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbnRfcHJvcF8xc2Vuc29yJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZmFjdG9yID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRkFDVE9SJyk7XG5cbiAgdmFyIHByb3BfdG8gPSBudWxsO1xuICBzd2l0Y2ggKGZhY3Rvcikge1xuICAgIGNhc2UgXCJMSUdIVF9ESUZGXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5kaWZmTm93VG9BZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJMSUdIVF9OT1dcIjpcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmN1cnJlbnRMZXZlbFswXSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfQVZHXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5hZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICB9XG4gIHZhciBjb2RlID0gcHJvcF90bztcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbnRfcHJvcF8yc2Vuc29ycyddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGZhY3RvciA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0ZBQ1RPUicpO1xuXG4gIHZhciBwcm9wX3RvID0gMDtcbiAgc3dpdGNoIChmYWN0b3IpIHtcbiAgICBjYXNlIFwiTElHSFRfRElGRlwiOlxuICAgICAgcHJvcF90byA9ICdsaWdodEluZm8uZGlmZk5vd1RvQWRhcHRMZXZlbCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfUklHSFRcIjogLy8geSA9IC0xXG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5jdXJyZW50TGV2ZWxbRXVnQm9keS5saWdodFNlbnNvcnNbMF0ucG9zaXRpb24ueSA8IDAgPyAwIDogMV0nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkxpR0hUX0xFRlRcIjogLy8geSA9IDFcbiAgICAgIHByb3BfdG8gPSAnbGlnaHRJbmZvLmN1cnJlbnRMZXZlbFtFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55ID4gMCA/IDAgOiAxXSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTElHSFRfQVZHXCI6XG4gICAgICBwcm9wX3RvID0gJ2xpZ2h0SW5mby5hZGFwdExldmVsJztcbiAgICAgIGJyZWFrO1xuICB9XG4gIHZhciBjb2RlID0gcHJvcF90bztcbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbF9hYnNvbHV0ZSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIG1hZ25pdHVkZSA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ01BR05JVFVERScpO1xuICAvLyBUaGUgbWFnbml0dWRlcyBnZXQgdHJhbnNsYXRlZCBpbiBwZXJjZW50YWdlcyBvZiB0aGUgY29ycmVzcG9uZGluZyBjb3JlIHZhbHVlcyAoZndfc3BlZWQsIHJvbGxfc3BlZWQsIHJlYWN0aW9uX3N0cmVuZ3RoKVxuICAvLyBvciBvZiB2YWx1ZXMgZGVmaW5lZCBmb3IgZWFjaCB0eXBlIG9mIHJlYWN0aW9uXG4gIHZhciBwZXJjZW50YWdlID0gMDtcbiAgc3dpdGNoIChtYWduaXR1ZGUpIHtcbiAgICBjYXNlIFwiVkVSWV9TTUFMTFwiOlxuICAgICAgcGVyY2VudGFnZSA9IDAuMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJTTUFMTFwiOlxuICAgICAgcGVyY2VudGFnZSA9IDAuNDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJNRURJVU1cIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAwLjc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTEFSR0VcIjpcbiAgICAgIHBlcmNlbnRhZ2UgPSAxLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVkVSWV9MQVJHRVwiOlxuICAgICAgcGVyY2VudGFnZSA9IDEuMztcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGNvZGUgPSAnJyArIHBlcmNlbnRhZ2U7XG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ21hdGhfbnVtYmVyJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgbnVtYmVyID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnTlVNJyk7XG4gIHZhciBjb2RlID0gbnVtYmVyO1xuICByZXR1cm4gW2NvZGUsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfTk9ORV07XG59O1xuXG4vLyBBQ1RJT05TIEFORCBCRUhBVklPUlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ2ZvcndhcmRfc3BlZWQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBzcGVlZCA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ1NQRUVEJyk7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcblxuICB2YXIgYWRkc3Vic3RyYWN0ID0gMDtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJGQVNURVJcIjpcbiAgICAgIGFkZHN1YnN0cmFjdCA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiU0xPV0VSXCI6XG4gICAgICBhZGRzdWJzdHJhY3QgPSAtMTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHZhciBjb2RlID0gJ2Z3X3NwZWVkICs9JyArIGFkZHN1YnN0cmFjdCArICcqJyArIHNwZWVkICsgJy8gMTAwICogZndfc3BlZWQ7JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydyb2xsX3NwZWVkJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3BlZWQgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdTUEVFRCcpO1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG5cbiAgdmFyIGFkZHN1YnN0cmFjdCA9IDA7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiRkFTVEVSXCI6XG4gICAgICBhZGRzdWJzdHJhY3QgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlNMT1dFUlwiOlxuICAgICAgYWRkc3Vic3RyYWN0ID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJ3JvbGxfc3BlZWQgKz0nICsgYWRkc3Vic3RyYWN0ICsgJyonICsgc3BlZWQgKyAnLyAxMDAgKiByb2xsX3NwZWVkOyc7XG4gIHJldHVybiBjb2RlO1xufTtcblxuQmxvY2tseS5KYXZhU2NyaXB0WydzdG9wX2ZvcndhcmQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBjb2RlID0gJ2Z3X3NwZWVkID0gMDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsnc3RvcF9yb2xsaW5nJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgY29kZSA9ICdyb2xsX3NwZWVkID0gMDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9yYW5kb21seSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHZhbHVlX21hZ25pdHVkZSA9IEJsb2NrbHkuSmF2YVNjcmlwdC52YWx1ZVRvQ29kZShibG9jaywgJ01BR05JVFVERScsIEJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FKTtcbiAgdmFyIGNvZGUgPSAnZGVsdGFfeWF3ICs9JyArIHZhbHVlX21hZ25pdHVkZSArICcgKiBbLTEsMV1bTWF0aC5yYW5kb20oKSoyfDBdKk1hdGgucmFuZG9tKCkgKiBjb25maWcucmVzZXRSYW5kb20gKiBkVDsnO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3R1cm5fbHInXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdESVJFQ1RJT04nKTtcblxuICAvLyBMRUZUIGRpcmVjdGlvbiBpcyBpbiBwb3NpdGl2ZSBsb2NhbCB5LWRpcmVjdGlvbiwgaXJyZXNwZWN0aXZlIG9mIHNlbnNvciBsb2NhdGlvbi5cbiAgLy8gUklHSFQgZGlyZWN0aW9uIGlzIGluIG5lZ2F0aXZlIGxvY2FsIHktZGlyZWN0aW9uLCBpcnJlc3BlY3RpdmUgb2Ygc2Vuc29yIGxvY2F0aW9uLlxuICB2YXIgY29kZSA9ICcnO1xuXG4gIHZhciBmbGlwUm90YXRpb25EaXIgPSAxO1xuICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBcIkxFRlRcIjogLy8gU2V0IGNvZWZmaWNpZW50IHN1Y2ggdGhhdCB3aGVuIGV5ZSBpcyBvbiAoMSwxKSBpbiBwb3NpdGl2ZSB5LWRpcmVjdGlvbiwgbGVmdCBpcyB0b3dhcmRzIHRoZSBsaWdodFxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJSSUdIVFwiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gLTE7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBjb2RlID0gJyc7XG4gIHZhciBUVVJOX01BWCA9IDI7XG4gIGNvZGUgKz0gJ3ZhciBsaWdodERpZmYgPScgKyAnY2FsY0ludGVuc2l0eScgKyAnKiBFdWdCb2R5LnJlYWN0aW9uX3N0cmVuZ3RoOyc7IC8vIFJJR0hUIE5PVyBUSElTIElTIFdSSVRURU4gRk9SIDEgRVlFLiBSRVdSSVRFIFRPIEFEQVBULlxuXG4gIGNvZGUgKz0gJ2RlbHRhX3lhdyArPSAnICsgZmxpcFJvdGF0aW9uRGlyICsgJyogTWF0aC5hYnMoRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aCAqIGxpZ2h0RGlmZikgKiBkVDsnO1xuXG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9hdF8xc2Vuc29yJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZGlyZWN0aW9uID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnRElSRUNUSU9OJyk7XG4gIHZhciBvYmplY3QgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdPQkpFQ1QnKTtcblxuICAvKlxuICBJbiBkaXJlY3Rpb24gb2YgdGhlIHNlbnNvcjogV2hlcmUgdGhlIHNlbnNvciBpcyBwb2ludGluZyB0bywgaWYgdGhlIGZpZWxkIGlzIHNtYWxsZXIgdGhhbiAyKlBJLCBPUiB3aGVyZSB0aGUgc2Vuc29yIGlzIGxvY2F0ZWQgSUYgTk9UIHlfc2Vuc29yID0gMFxuICBJbiBkaXJlY3Rpb24gb2YgdGhlIGV5ZXNwb3Q6IElGIFRIRVJFIElTIEFOIEVZRVNQT1QsIHRoZW4gaW4gdGhlIGRpcmVjdGlvbiB0aGF0IGl0IGlzIGxvY2F0ZWQgYXQuXG4gIFRoZSBkZWNpZGluZyBmYWN0b3IgaXMgdGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgc2Vuc29yIG9yaWVudGF0aW9uLCBwb3NpdGlvbiBvciBvZiB0aGUgZXllc3BvdCBwb3NpdGlvbjpcbiAgLSB5ID0gMDogV2UgaGF2ZSBubyBzZXQgZGlyZWN0aW9uLlxuICAtIHkgPiAwOiBjb3VudGVyLWNsb2Nrd2lzZSBkaXJlY3Rpb24gKGkuZS4gcG9zaXRpdmUgYW5nbGVzKVxuICAtIHkgPCAwOiBjbG9ja3dpc2UgZGlyZWN0aW9uIChpLmUuIG5lZ2F0aXZlIGFuZ2xlcylcblxuICBJZiBkaXJlY3Rpb24gaXMgXCJUT1dBUkRTXCIsIHRoZW4gdGhlIGZsaXBSb3RhdGlvbkRpciBpcyBwb3NpdGl2ZSwgYW5kIG5lZ2F0aXZlIG90aGVyd2lzZS5cbiAgKi9cbiB2YXIgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgIGNhc2UgXCJBV0FZXCI6XG4gICAgICBmbGlwUm90YXRpb25EaXIgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlRPV0FSRFNcIjpcbiAgICAgIGZsaXBSb3RhdGlvbkRpciA9IC0xO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY29kZSA9ICcnO1xuXG4gIGlmIChvYmplY3QgPT0gJ1NFTlNPUicpIHtcbiAgICBjb2RlICs9ICd2YXIgcm90YXRpb25EaXIgPSAwOyBcXFxuICAgIGlmIChFdWdCb2R5LmxpZ2h0U2Vuc29ycy5sZW5ndGgpIHsgXFxcbiAgICAgIGlmIChFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5maWVsZCA9PSAyKk1hdGguUEkpIHsgXFxcbiAgICAgICAgcm90YXRpb25EaXIgPSBFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55OyBcXFxuICAgICAgfSBlbHNlIHsgXFxcbiAgICAgICAgcm90YXRpb25EaXIgPSBFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5vcmllbnRhdGlvbi55OyBcXFxuICAgICAgfSB9JztcbiAgfSBlbHNlIGlmIChvYmplY3QgPT0gJ1NQT1QnKSB7XG4gICAgY29kZSArPSAndmFyIHJvdGF0aW9uRGlyID0gMDsgXFxcbiAgICBpZiAoRXVnQm9keS5zcG90UG9zaXRpb25zLmxlbmd0aD09MSkgeyBcXFxuICAgICAgcm90YXRpb25EaXIgPSBFdWdCb2R5LnNwb3RQb3NpdGlvbnNbMF0ueTsgfSc7XG4gIH1cblxuICB2YXIgVFVSTl9NQVggPSAyO1xuICBjb2RlICs9ICd2YXIgbGlnaHREaWZmID0nICsgJ2NhbGNJbnRlbnNpdHknICsgJyogRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsnO1xuICBjb2RlICs9ICdkZWx0YV95YXcgKz0gcm90YXRpb25EaXIgKicgKyAgZmxpcFJvdGF0aW9uRGlyICsgJyogTWF0aC5hYnMoRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aCAqIGxpZ2h0RGlmZikgKiBkVDsnO1xuXG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsndHVybl9hdF8yc2Vuc29ycyddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0RJUkVDVElPTicpO1xuICB2YXIgb2JqZWN0ID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnT0JKRUNUJyk7XG5cbiAgdmFyIGZsaXBSb3RhdGlvbkRpciA9IDE7XG4gIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIFwiQVdBWVwiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gLTE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVE9XQVJEU1wiOlxuICAgICAgZmxpcFJvdGF0aW9uRGlyID0gMTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGNvZGUgPSAndmFyIHJvdGF0aW9uRGlyID0gMDsnO1xuXG4gIGlmIChvYmplY3QgPT0gJ1dFQUtFUicpIHtcbiAgICBjb2RlICs9ICdyb3RhdGlvbkRpciA9IChzZW5zb3JJbnRlbnNpdGllc1sxXSAtIHNlbnNvckludGVuc2l0aWVzWzBdKSA+PSAwID8gRXVnQm9keS5saWdodFNlbnNvcnNbMV0ucG9zaXRpb24ueSA6IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzBdLnBvc2l0aW9uLnk7JztcbiAgfSBlbHNlIGlmIChvYmplY3QgPT0gJ1NUUk9OR0VSJykge1xuICAgIGNvZGUgKz0gJ3JvdGF0aW9uRGlyID0gKHNlbnNvckludGVuc2l0aWVzWzFdIC0gc2Vuc29ySW50ZW5zaXRpZXNbMF0pIDwgMCA/IEV1Z0JvZHkubGlnaHRTZW5zb3JzWzFdLnBvc2l0aW9uLnkgOiBFdWdCb2R5LmxpZ2h0U2Vuc29yc1swXS5wb3NpdGlvbi55Oyc7XG4gIH1cblxuICB2YXIgVFVSTl9NQVggPSAyO1xuICBjb2RlICs9ICd2YXIgbGlnaHREaWZmID0nICsgJ2NhbGNJbnRlbnNpdHknICsgJyogRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aDsnO1xuICBjb2RlICs9ICdkZWx0YV95YXcgKz0gcm90YXRpb25EaXIgKicgKyAgZmxpcFJvdGF0aW9uRGlyICsgJyogTWF0aC5hYnMoRXVnQm9keS5yZWFjdGlvbl9zdHJlbmd0aCAqIGxpZ2h0RGlmZikgKiBkVDsnO1xuXG4gIHJldHVybiBjb2RlO1xufTtcblxuXG4vLyBDT05ESVRJT05TICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydldmVyeV90aW1lJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZGVmYXVsdENvZGUgPSBcInZhciBjYWxjSW50ZW5zaXR5ID0gKEV1Z0JvZHkubGlnaHRTZW5zb3JzLmxlbmd0aD4xKSA/IGxpZ2h0SW5mby5kaWZmQnR3U2Vuc29ycyA6IGxpZ2h0SW5mby5jdXJyZW50TGV2ZWxbMF07XCIgLy8gSEVSRSBXUklURSBUSEUgQ09SRSBMSUdIVCAtIDEgRVlFIE9SIDIgRVlFUy4gVEhJUyBDQU4gVEhFTiBCRSBNT0RJRklFRCBXSVRIIFRIRSBEUk9QLURPV04hIC0gV1JJVEUgQUxMIE9USEVSIENPREUgU1VDSCBUSEFUIElUIFRBS0VTIFRISVMgTElHSFQgTUVBU1VSRS5cbiAgdmFyIGFsbF9jb2RlID0gQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ0NPREUnKTtcbiAgLy8gVE9ETzogQXNzZW1ibGUgSmF2YVNjcmlwdCBpbnRvIGNvZGUgdmFyaWFibGUuXG4gIHZhciBjb2RlID0gZGVmYXVsdENvZGUgKyBhbGxfY29kZTtcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydzZWVfbGlnaHQnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciB0aHJlc2hvbGRfcGVyY2VudGFnZSA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ1RIUkVTSE9MRCcpO1xuICB2YXIgc3RhdGVtZW50c19jb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdDT0RFJyk7XG4gIC8vIEFsdGVybmF0aXZlbHksIHVzZSB0aGUgdGhyZXNob2xkIEV1Z0JvZHkuZGVmYXVsdHMuc2Vuc2l0aXZpdHlfdGhyZXNob2xkXG4gIHZhciBjb2RlID0gJ2lmICgoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoPjEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmRpZmZCdHdTZW5zb3JzKSA+ICcgKyB0aHJlc2hvbGRfcGVyY2VudGFnZSArICcvIDEwMCkgfHwgXFxcbiAgICAgICAgICAgICAoRXVnQm9keS5saWdodFNlbnNvcnMubGVuZ3RoID09IDEgJiYgTWF0aC5hYnMobGlnaHRJbmZvLmRpZmZOb3dUb0FkYXB0TGV2ZWwpID4nICsgdGhyZXNob2xkX3BlcmNlbnRhZ2UgKyAnLyAxMDApKSB7JyArIHN0YXRlbWVudHNfY29kZSArICd9JztcbiAgcmV0dXJuIGNvZGU7XG59O1xuIl19
