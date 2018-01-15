"use strict";

window.Blockly.defineBlocksWithJsonArray([{
  "type": "action_by",
  "message0": "Do sth in %1 %2 by %3",
  "args0": [{
    "type": "field_dropdown",
    "name": "NAME",
    "options": [["away from light", "LIGHT_AWAY"], ["towards light", "LIGHT_TOWARDS"], ["away from receptor", "RECPT_AWAY"], ["towards receptor", "RECPT_TOWARDS"], ["forward", "FORWARD"], ["backward", "BACKWARD"]]
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_value",
    "name": "AMOUNT",
    "check": ["Number", "String", "modifier_prob", "modifier_rand"]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "action",
  "message0": "Do sth in %1",
  "args0": [{
    "type": "field_dropdown",
    "name": "NAME",
    "options": [["away from light", "LIGHT_AWAY"], ["towards light", "LIGHT_TOWARDS"], ["away from receptor", "RECPT_AWAY"], ["towards receptor", "RECPT_TOWARDS"], ["forward", "FORWARD"], ["backward", "BACKWARD"]]
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "either_way",
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
}, {
  "type": "modifier_prob",
  "message0": "%1 with probability proportional to %2",
  "args0": [{
    "type": "input_value",
    "name": "QUANT",
    "check": ["Number", "String"]
  }, {
    "type": "field_dropdown",
    "name": "Factor",
    "options": [["difference between current and previous light", "diff_light_CP"], ["difference between light in left and right receptor", "diff_light_LR"], ["average light", "avg_light"], ["current light", "curr_light"]]
  }],
  "inputsInline": true,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "modifier_rand",
  "message0": "more or less %1 %2",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "input_value",
    "name": "QUANT",
    "check": ["Number", "String"]
  }],
  "inputsInline": true,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "qual_absolute",
  "message0": "%1",
  "args0": [{
    "type": "field_dropdown",
    "name": "NAME",
    "options": [["low", "LOW"], ["medium", "MEDIUM"], ["high", "HIGH"]]
  }],
  "output": null,
  "colour": 180,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "qual_relative",
  "message0": "%1",
  "args0": [{
    "type": "field_dropdown",
    "name": "NAME",
    "options": [["less than", "LESS"], ["same as", "SAME"], ["more than", "MORE"]]
  }],
  "output": null,
  "colour": 180,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "see_light",
  "message0": "If I see a change or difference in light: %1 %2",
  "args0": [{
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
}, {
  "type": "calc_light",
  "message0": "Detect the incoming light",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "general_comparison",
  "message0": "Is %1 %2 %3 %4 If yes: %5 If no: %6",
  "args0": [{
    "type": "field_dropdown",
    "name": "compare_in",
    "options": [["the detected light", "curr_light"], ["the difference in light", "diff_light"]]
  }, {
    "type": "field_dropdown",
    "name": "compare",
    "options": [["bigger than", "BIGGER"], ["the same as", "SAME"], ["smaller than", "SMALLER"]]
  }, {
    "type": "field_dropdown",
    "name": "compare_out",
    "options": [["the ambient light", "ambient_light"], ["the reference level", "reference_light"], ["the adaptation level", "adaptation_light"]]
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "YES"
  }, {
    "type": "input_statement",
    "name": "NO"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "question_adapt",
  "message0": "Is / are my eye(s) adapted? %1 Yes: %2 No: %3",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "NAME"
  }, {
    "type": "input_statement",
    "name": "NAME"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "question_restore",
  "message0": "Is the light back to what it was before? %1 Yes: %2 No: %3",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "YES"
  }, {
    "type": "input_statement",
    "name": "NO"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "question_reference",
  "message0": "Is the detected light %1 %2 ? %3 Yes: %4 No: %5",
  "args0": [{
    "type": "field_dropdown",
    "name": "compare",
    "options": [["brighter than", "BRIGHTER"], ["dimmer than", "DIMMER"]]
  }, {
    "type": "field_dropdown",
    "name": "compare_out",
    "options": [["the reference level", "reference_light"], ["the adapted level", "adapted_light"]]
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "YES"
  }, {
    "type": "input_statement",
    "name": "NO"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "compare_leftright",
  "message0": "Does the left receptor see %1 light than the right receptor? %2 Yes: %3 No: %4",
  "args0": [{
    "type": "field_dropdown",
    "name": "compare",
    "options": [["more", "left_more"], ["less", "left_less"], ["option", "OPTIONNAME"]]
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "NAME"
  }, {
    "type": "input_statement",
    "name": "NAME"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "compare_nowprevious",
  "message0": "Does the receptor see %1 light now than before? %2 Yes: %3 No: %4",
  "args0": [{
    "type": "field_dropdown",
    "name": "compare",
    "options": [["more", "left_more"], ["less", "left_less"], ["option", "OPTIONNAME"]]
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "YES"
  }, {
    "type": "input_statement",
    "name": "NO"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "question_shock_simple",
  "message0": "Is the difference in light very big? %1 Yes: %2 No: %3",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "YES"
  }, {
    "type": "input_statement",
    "name": "NO"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "question_shock",
  "message0": "Is the difference in light bigger than %1 %2 ? %3 Yes: %4 No: %5",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "input_value",
    "name": "NAME",
    "check": "Number"
  }, {
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "YES"
  }, {
    "type": "input_statement",
    "name": "NO"
  }],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "question_reference_simple",
  "message0": "Is the detected light very dim? %1 Yes: %2 No: %3",
  "args0": [{
    "type": "input_dummy"
  }, {
    "type": "input_statement",
    "name": "YES"
  }, {
    "type": "input_statement",
    "name": "NO"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
}, {
  "type": "forward_speed",
  "message0": "Move forward by %1 %2 micro meters",
  "args0": [{
    "type": "field_number",
    "name": "SPEED",
    "value": 0,
    "min": 0,
    "max": 15,
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
}]);

window.Blockly.Blocks['every_time'] = {
  init: function init() {
    this.appendDummyInput().appendField("With every time step, do the following:");
    this.appendStatementInput("CODE").setCheck(null);
    this.setInputsInline(false);
    this.setColour(230);
    this.setDeletable(false);
    this.setMovable(false);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

window.Blockly.JavaScript['every_time'] = function (block) {
  var all_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = '<<<<\n' + all_code + '>>>>\n';
  return code;
};

window.Blockly.JavaScript['forward_speed'] = function (block) {
  var speed = block.getFieldValue('SPEED');
  // TODO: Assemble JavaScript into code variable.
  var code = 'move_forward +=' + speed + ';\n';
  return code;
};

window.Blockly.JavaScript['action'] = function (block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['action_by'] = function (block) {
  var dropdown_name = block.getFieldValue('NAME');
  var value_amount = window.Blockly.JavaScript.valueToCode(block, 'AMOUNT', window.Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['either_way'] = function (block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['modifier_prob'] = function (block) {
  var value_quant = window.Blockly.JavaScript.valueToCode(block, 'QUANT', window.Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_factor = block.getFieldValue('Factor');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['modifier_rand'] = function (block) {
  var value_quant = window.Blockly.JavaScript.valueToCode(block, 'QUANT', window.Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['qual_absolute'] = function (block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['qual_relative'] = function (block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['see_light'] = function (block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['calc_light'] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['general_comparison'] = function (block) {
  var dropdown_compare_in = block.getFieldValue('compare_in');
  var dropdown_compare = block.getFieldValue('compare');
  var dropdown_compare_out = block.getFieldValue('compare_out');
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_adapt'] = function (block) {
  var statements_name = window.Blockly.JavaScript.statementToCode(block, 'NAME');
  var statements_name = window.Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_restore'] = function (block) {
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_reference'] = function (block) {
  var dropdown_compare = block.getFieldValue('compare');
  var dropdown_compare_out = block.getFieldValue('compare_out');
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['compare_leftright'] = function (block) {
  var dropdown_compare = block.getFieldValue('compare');
  var statements_name = window.Blockly.JavaScript.statementToCode(block, 'NAME');
  var statements_name = window.Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['compare_nowprevious'] = function (block) {
  var dropdown_compare = block.getFieldValue('compare');
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_shock_simple'] = function (block) {
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_shock'] = function (block) {
  var value_name = window.Blockly.JavaScript.valueToCode(block, 'NAME', window.Blockly.JavaScript.ORDER_ATOMIC);
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_reference_simple'] = function (block) {
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kZWxpbmdfYmxvY2tzLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIkJsb2NrbHkiLCJkZWZpbmVCbG9ja3NXaXRoSnNvbkFycmF5IiwiQmxvY2tzIiwiaW5pdCIsImFwcGVuZER1bW15SW5wdXQiLCJhcHBlbmRGaWVsZCIsImFwcGVuZFN0YXRlbWVudElucHV0Iiwic2V0Q2hlY2siLCJzZXRJbnB1dHNJbmxpbmUiLCJzZXRDb2xvdXIiLCJzZXREZWxldGFibGUiLCJzZXRNb3ZhYmxlIiwic2V0VG9vbHRpcCIsInNldEhlbHBVcmwiLCJKYXZhU2NyaXB0IiwiYmxvY2siLCJhbGxfY29kZSIsInN0YXRlbWVudFRvQ29kZSIsImNvZGUiLCJzcGVlZCIsImdldEZpZWxkVmFsdWUiLCJkcm9wZG93bl9uYW1lIiwidmFsdWVfYW1vdW50IiwidmFsdWVUb0NvZGUiLCJPUkRFUl9BVE9NSUMiLCJzdGF0ZW1lbnRzX2NvZGUiLCJ2YWx1ZV9xdWFudCIsImRyb3Bkb3duX2ZhY3RvciIsIk9SREVSX05PTkUiLCJkcm9wZG93bl9jb21wYXJlX2luIiwiZHJvcGRvd25fY29tcGFyZSIsImRyb3Bkb3duX2NvbXBhcmVfb3V0Iiwic3RhdGVtZW50c195ZXMiLCJzdGF0ZW1lbnRzX25vIiwic3RhdGVtZW50c19uYW1lIiwidmFsdWVfbmFtZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxDQUFlQyx5QkFBZixDQUF5QyxDQUN6QztBQUNJLFVBQVEsV0FEWjtBQUVJLGNBQVksdUJBRmhCO0FBR0ksV0FBUyxDQUNQO0FBQ0UsWUFBUSxnQkFEVjtBQUVFLFlBQVEsTUFGVjtBQUdFLGVBQVcsQ0FDVCxDQUNFLGlCQURGLEVBRUUsWUFGRixDQURTLEVBS1QsQ0FDRSxlQURGLEVBRUUsZUFGRixDQUxTLEVBU1QsQ0FDRSxvQkFERixFQUVFLFlBRkYsQ0FUUyxFQWFULENBQ0Usa0JBREYsRUFFRSxlQUZGLENBYlMsRUFp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RCxDQVBEOztBQVNBbkIsT0FBT0MsT0FBUCxDQUFlYyxVQUFmLENBQTBCLDJCQUExQixJQUF5RCxVQUFTQyxLQUFULEVBQWdCO0FBQ3ZFLE1BQUlpQixpQkFBaUJqQyxPQUFPQyxPQUFQLENBQWVjLFVBQWYsQ0FBMEJHLGVBQTFCLENBQTBDRixLQUExQyxFQUFpRCxLQUFqRCxDQUFyQjtBQUNBLE1BQUlrQixnQkFBZ0JsQyxPQUFPQyxPQUFQLENBQWVjLFVBQWYsQ0FBMEJHLGVBQTFCLENBQTBDRixLQUExQyxFQUFpRCxJQUFqRCxDQUFwQjtBQUNBO0FBQ0EsTUFBSUcsT0FBTyxRQUFYO0FBQ0EsU0FBT0EsSUFBUDtBQUNELENBTkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9tb2RlbGluZ19ibG9ja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuQmxvY2tseS5kZWZpbmVCbG9ja3NXaXRoSnNvbkFycmF5KFtcbntcbiAgICBcInR5cGVcIjogXCJhY3Rpb25fYnlcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiRG8gc3RoIGluICUxICUyIGJ5ICUzXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk5BTUVcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImF3YXkgZnJvbSBsaWdodFwiLFxuICAgICAgICAgICAgXCJMSUdIVF9BV0FZXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwidG93YXJkcyBsaWdodFwiLFxuICAgICAgICAgICAgXCJMSUdIVF9UT1dBUkRTXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYXdheSBmcm9tIHJlY2VwdG9yXCIsXG4gICAgICAgICAgICBcIlJFQ1BUX0FXQVlcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJ0b3dhcmRzIHJlY2VwdG9yXCIsXG4gICAgICAgICAgICBcIlJFQ1BUX1RPV0FSRFNcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJmb3J3YXJkXCIsXG4gICAgICAgICAgICBcIkZPUldBUkRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJiYWNrd2FyZFwiLFxuICAgICAgICAgICAgXCJCQUNLV0FSRFwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF92YWx1ZVwiLFxuICAgICAgICBcIm5hbWVcIjogXCJBTU9VTlRcIixcbiAgICAgICAgXCJjaGVja1wiOiBbXG4gICAgICAgICAgXCJOdW1iZXJcIixcbiAgICAgICAgICBcIlN0cmluZ1wiLFxuICAgICAgICAgIFwibW9kaWZpZXJfcHJvYlwiLFxuICAgICAgICAgIFwibW9kaWZpZXJfcmFuZFwiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAge1xuICAgIFwidHlwZVwiOiBcImFjdGlvblwiLFxuICAgIFwibWVzc2FnZTBcIjogXCJEbyBzdGggaW4gJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiTkFNRVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYXdheSBmcm9tIGxpZ2h0XCIsXG4gICAgICAgICAgICBcIkxJR0hUX0FXQVlcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJ0b3dhcmRzIGxpZ2h0XCIsXG4gICAgICAgICAgICBcIkxJR0hUX1RPV0FSRFNcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJhd2F5IGZyb20gcmVjZXB0b3JcIixcbiAgICAgICAgICAgIFwiUkVDUFRfQVdBWVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInRvd2FyZHMgcmVjZXB0b3JcIixcbiAgICAgICAgICAgIFwiUkVDUFRfVE9XQVJEU1wiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImZvcndhcmRcIixcbiAgICAgICAgICAgIFwiRk9SV0FSRFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImJhY2t3YXJkXCIsXG4gICAgICAgICAgICBcIkJBQ0tXQVJEXCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAge1xuICAgIFwidHlwZVwiOiBcImVpdGhlcl93YXlcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiRWl0aGVyIHdheSwgSSB3aWxsIGRvIHRoZSBmb2xsb3dpbmc6ICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJDT0RFXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IGZhbHNlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyNzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAge1xuICAgIFwidHlwZVwiOiBcIm1vZGlmaWVyX3Byb2JcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiJTEgd2l0aCBwcm9iYWJpbGl0eSBwcm9wb3J0aW9uYWwgdG8gJTJcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfdmFsdWVcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiUVVBTlRcIixcbiAgICAgICAgXCJjaGVja1wiOiBbXG4gICAgICAgICAgXCJOdW1iZXJcIixcbiAgICAgICAgICBcIlN0cmluZ1wiXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkZhY3RvclwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiZGlmZmVyZW5jZSBiZXR3ZWVuIGN1cnJlbnQgYW5kIHByZXZpb3VzIGxpZ2h0XCIsXG4gICAgICAgICAgICBcImRpZmZfbGlnaHRfQ1BcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJkaWZmZXJlbmNlIGJldHdlZW4gbGlnaHQgaW4gbGVmdCBhbmQgcmlnaHQgcmVjZXB0b3JcIixcbiAgICAgICAgICAgIFwiZGlmZl9saWdodF9MUlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImF2ZXJhZ2UgbGlnaHRcIixcbiAgICAgICAgICAgIFwiYXZnX2xpZ2h0XCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiY3VycmVudCBsaWdodFwiLFxuICAgICAgICAgICAgXCJjdXJyX2xpZ2h0XCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW5wdXRzSW5saW5lXCI6IHRydWUsXG4gICAgXCJjb2xvdXJcIjogMTIwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHtcbiAgICBcInR5cGVcIjogXCJtb2RpZmllcl9yYW5kXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIm1vcmUgb3IgbGVzcyAlMSAlMlwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF92YWx1ZVwiLFxuICAgICAgICBcIm5hbWVcIjogXCJRVUFOVFwiLFxuICAgICAgICBcImNoZWNrXCI6IFtcbiAgICAgICAgICBcIk51bWJlclwiLFxuICAgICAgICAgIFwiU3RyaW5nXCJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbnB1dHNJbmxpbmVcIjogdHJ1ZSxcbiAgICBcImNvbG91clwiOiAxMjAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAge1xuICAgIFwidHlwZVwiOiBcInF1YWxfYWJzb2x1dGVcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiTkFNRVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwibG93XCIsXG4gICAgICAgICAgICBcIkxPV1wiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIm1lZGl1bVwiLFxuICAgICAgICAgICAgXCJNRURJVU1cIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJoaWdoXCIsXG4gICAgICAgICAgICBcIkhJR0hcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJvdXRwdXRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAxODAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAge1xuICAgIFwidHlwZVwiOiBcInF1YWxfcmVsYXRpdmVcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiJTFcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiTkFNRVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwibGVzcyB0aGFuXCIsXG4gICAgICAgICAgICBcIkxFU1NcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJzYW1lIGFzXCIsXG4gICAgICAgICAgICBcIlNBTUVcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJtb3JlIHRoYW5cIixcbiAgICAgICAgICAgIFwiTU9SRVwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBcIm91dHB1dFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDE4MCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7XG4gICAgXCJ0eXBlXCI6IFwic2VlX2xpZ2h0XCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIklmIEkgc2VlIGEgY2hhbmdlIG9yIGRpZmZlcmVuY2UgaW4gbGlnaHQ6ICUxICUyXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJDT0RFXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyNzAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAge1xuICAgIFwidHlwZVwiOiBcImNhbGNfbGlnaHRcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiRGV0ZWN0IHRoZSBpbmNvbWluZyBsaWdodFwiLFxuICAgIFwib3V0cHV0XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7XG4gICAgXCJ0eXBlXCI6IFwiZ2VuZXJhbF9jb21wYXJpc29uXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIklzICUxICUyICUzICU0IElmIHllczogJTUgSWYgbm86ICU2XCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpZWxkX2Ryb3Bkb3duXCIsXG4gICAgICAgIFwibmFtZVwiOiBcImNvbXBhcmVfaW5cIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInRoZSBkZXRlY3RlZCBsaWdodFwiLFxuICAgICAgICAgICAgXCJjdXJyX2xpZ2h0XCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwidGhlIGRpZmZlcmVuY2UgaW4gbGlnaHRcIixcbiAgICAgICAgICAgIFwiZGlmZl9saWdodFwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJjb21wYXJlXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJiaWdnZXIgdGhhblwiLFxuICAgICAgICAgICAgXCJCSUdHRVJcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJ0aGUgc2FtZSBhc1wiLFxuICAgICAgICAgICAgXCJTQU1FXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwic21hbGxlciB0aGFuXCIsXG4gICAgICAgICAgICBcIlNNQUxMRVJcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiY29tcGFyZV9vdXRcIixcbiAgICAgICAgXCJvcHRpb25zXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInRoZSBhbWJpZW50IGxpZ2h0XCIsXG4gICAgICAgICAgICBcImFtYmllbnRfbGlnaHRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJ0aGUgcmVmZXJlbmNlIGxldmVsXCIsXG4gICAgICAgICAgICBcInJlZmVyZW5jZV9saWdodFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcInRoZSBhZGFwdGF0aW9uIGxldmVsXCIsXG4gICAgICAgICAgICBcImFkYXB0YXRpb25fbGlnaHRcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfc3RhdGVtZW50XCIsXG4gICAgICAgIFwibmFtZVwiOiBcIllFU1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9zdGF0ZW1lbnRcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiTk9cIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDIxMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7XG4gICAgXCJ0eXBlXCI6IFwicXVlc3Rpb25fYWRhcHRcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiSXMgLyBhcmUgbXkgZXllKHMpIGFkYXB0ZWQ/ICUxIFllczogJTIgTm86ICUzXCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJOQU1FXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJOQU1FXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAge1xuICAgIFwidHlwZVwiOiBcInF1ZXN0aW9uX3Jlc3RvcmVcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiSXMgdGhlIGxpZ2h0IGJhY2sgdG8gd2hhdCBpdCB3YXMgYmVmb3JlPyAlMSBZZXM6ICUyIE5vOiAlM1wiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9zdGF0ZW1lbnRcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiWUVTXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJOT1wiXG4gICAgICB9XG4gICAgXSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMjEwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHtcbiAgICBcInR5cGVcIjogXCJxdWVzdGlvbl9yZWZlcmVuY2VcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiSXMgdGhlIGRldGVjdGVkIGxpZ2h0ICUxICUyID8gJTMgWWVzOiAlNCBObzogJTVcIixcbiAgICBcImFyZ3MwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZmllbGRfZHJvcGRvd25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwiY29tcGFyZVwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwiYnJpZ2h0ZXIgdGhhblwiLFxuICAgICAgICAgICAgXCJCUklHSFRFUlwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImRpbW1lciB0aGFuXCIsXG4gICAgICAgICAgICBcIkRJTU1FUlwiXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJjb21wYXJlX291dFwiLFxuICAgICAgICBcIm9wdGlvbnNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwidGhlIHJlZmVyZW5jZSBsZXZlbFwiLFxuICAgICAgICAgICAgXCJyZWZlcmVuY2VfbGlnaHRcIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJ0aGUgYWRhcHRlZCBsZXZlbFwiLFxuICAgICAgICAgICAgXCJhZGFwdGVkX2xpZ2h0XCJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJZRVNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfc3RhdGVtZW50XCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk5PXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAge1xuICAgIFwidHlwZVwiOiBcImNvbXBhcmVfbGVmdHJpZ2h0XCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIkRvZXMgdGhlIGxlZnQgcmVjZXB0b3Igc2VlICUxIGxpZ2h0IHRoYW4gdGhlIHJpZ2h0IHJlY2VwdG9yPyAlMiBZZXM6ICUzIE5vOiAlNFwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJjb21wYXJlXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJtb3JlXCIsXG4gICAgICAgICAgICBcImxlZnRfbW9yZVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImxlc3NcIixcbiAgICAgICAgICAgIFwibGVmdF9sZXNzXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwib3B0aW9uXCIsXG4gICAgICAgICAgICBcIk9QVElPTk5BTUVcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfc3RhdGVtZW50XCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk5BTUVcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfc3RhdGVtZW50XCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk5BTUVcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDIxMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7XG4gICAgXCJ0eXBlXCI6IFwiY29tcGFyZV9ub3dwcmV2aW91c1wiLFxuICAgIFwibWVzc2FnZTBcIjogXCJEb2VzIHRoZSByZWNlcHRvciBzZWUgJTEgbGlnaHQgbm93IHRoYW4gYmVmb3JlPyAlMiBZZXM6ICUzIE5vOiAlNFwiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJmaWVsZF9kcm9wZG93blwiLFxuICAgICAgICBcIm5hbWVcIjogXCJjb21wYXJlXCIsXG4gICAgICAgIFwib3B0aW9uc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJtb3JlXCIsXG4gICAgICAgICAgICBcImxlZnRfbW9yZVwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImxlc3NcIixcbiAgICAgICAgICAgIFwibGVmdF9sZXNzXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwib3B0aW9uXCIsXG4gICAgICAgICAgICBcIk9QVElPTk5BTUVcIlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfZHVtbXlcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRfc3RhdGVtZW50XCIsXG4gICAgICAgIFwibmFtZVwiOiBcIllFU1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9zdGF0ZW1lbnRcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiTk9cIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJwcmV2aW91c1N0YXRlbWVudFwiOiBudWxsLFxuICAgIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICAgIFwiY29sb3VyXCI6IDIxMCxcbiAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICBcImhlbHBVcmxcIjogXCJcIlxuICB9LFxuICB7XG4gICAgXCJ0eXBlXCI6IFwicXVlc3Rpb25fc2hvY2tfc2ltcGxlXCIsXG4gICAgXCJtZXNzYWdlMFwiOiBcIklzIHRoZSBkaWZmZXJlbmNlIGluIGxpZ2h0IHZlcnkgYmlnPyAlMSBZZXM6ICUyIE5vOiAlM1wiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9zdGF0ZW1lbnRcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiWUVTXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJOT1wiXG4gICAgICB9XG4gICAgXSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMjEwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHtcbiAgICBcInR5cGVcIjogXCJxdWVzdGlvbl9zaG9ja1wiLFxuICAgIFwibWVzc2FnZTBcIjogXCJJcyB0aGUgZGlmZmVyZW5jZSBpbiBsaWdodCBiaWdnZXIgdGhhbiAlMSAlMiA/ICUzIFllczogJTQgTm86ICU1XCIsXG4gICAgXCJhcmdzMFwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X2R1bW15XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3ZhbHVlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIk5BTUVcIixcbiAgICAgICAgXCJjaGVja1wiOiBcIk51bWJlclwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9zdGF0ZW1lbnRcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiWUVTXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJOT1wiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICAgIFwicHJldmlvdXNTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcIm5leHRTdGF0ZW1lbnRcIjogbnVsbCxcbiAgICBcImNvbG91clwiOiAyMTAsXG4gICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgXCJoZWxwVXJsXCI6IFwiXCJcbiAgfSxcbiAge1xuICAgIFwidHlwZVwiOiBcInF1ZXN0aW9uX3JlZmVyZW5jZV9zaW1wbGVcIixcbiAgICBcIm1lc3NhZ2UwXCI6IFwiSXMgdGhlIGRldGVjdGVkIGxpZ2h0IHZlcnkgZGltPyAlMSBZZXM6ICUyIE5vOiAlM1wiLFxuICAgIFwiYXJnczBcIjogW1xuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInR5cGVcIjogXCJpbnB1dF9zdGF0ZW1lbnRcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiWUVTXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcImlucHV0X3N0YXRlbWVudFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJOT1wiXG4gICAgICB9XG4gICAgXSxcbiAgICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJuZXh0U3RhdGVtZW50XCI6IG51bGwsXG4gICAgXCJjb2xvdXJcIjogMjEwLFxuICAgIFwidG9vbHRpcFwiOiBcIlwiLFxuICAgIFwiaGVscFVybFwiOiBcIlwiXG4gIH0sXG4gIHtcbiAgXCJ0eXBlXCI6IFwiZm9yd2FyZF9zcGVlZFwiLFxuICBcIm1lc3NhZ2UwXCI6IFwiTW92ZSBmb3J3YXJkIGJ5ICUxICUyIG1pY3JvIG1ldGVyc1wiLFxuICBcImFyZ3MwXCI6IFtcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJmaWVsZF9udW1iZXJcIixcbiAgICAgIFwibmFtZVwiOiBcIlNQRUVEXCIsXG4gICAgICBcInZhbHVlXCI6IDAsXG4gICAgICBcIm1pblwiOiAwLFxuICAgICAgXCJtYXhcIjogMTUsXG4gICAgICBcInByZWNpc2lvblwiOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJpbnB1dF9kdW1teVwiXG4gICAgfVxuICBdLFxuICBcImlucHV0c0lubGluZVwiOiB0cnVlLFxuICBcInByZXZpb3VzU3RhdGVtZW50XCI6IG51bGwsXG4gIFwibmV4dFN0YXRlbWVudFwiOiBudWxsLFxuICBcImNvbG91clwiOiAwLFxuICBcInRvb2x0aXBcIjogXCJUZXN0XCIsXG4gIFwiaGVscFVybFwiOiBcIlwiXG59XG5dKTtcblxud2luZG93LkJsb2NrbHkuQmxvY2tzWydldmVyeV90aW1lJ10gPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYXBwZW5kRHVtbXlJbnB1dCgpXG4gICAgICAgIC5hcHBlbmRGaWVsZChcIldpdGggZXZlcnkgdGltZSBzdGVwLCBkbyB0aGUgZm9sbG93aW5nOlwiKTtcbiAgICB0aGlzLmFwcGVuZFN0YXRlbWVudElucHV0KFwiQ09ERVwiKVxuICAgICAgICAuc2V0Q2hlY2sobnVsbCk7XG4gICAgdGhpcy5zZXRJbnB1dHNJbmxpbmUoZmFsc2UpO1xuICAgIHRoaXMuc2V0Q29sb3VyKDIzMCk7XG4gICAgdGhpcy5zZXREZWxldGFibGUoZmFsc2UpO1xuICAgIHRoaXMuc2V0TW92YWJsZShmYWxzZSk7XG4gdGhpcy5zZXRUb29sdGlwKFwiXCIpO1xuIHRoaXMuc2V0SGVscFVybChcIlwiKTtcbiAgfVxufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnZXZlcnlfdGltZSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGFsbF9jb2RlID0gQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ0NPREUnKTtcbiAgLy8gVE9ETzogQXNzZW1ibGUgSmF2YVNjcmlwdCBpbnRvIGNvZGUgdmFyaWFibGUuXG4gIHZhciBjb2RlID0gJzw8PDxcXG4nICsgYWxsX2NvZGUgKyAnPj4+Plxcbic7XG4gIHJldHVybiBjb2RlO1xufTtcblxuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydmb3J3YXJkX3NwZWVkJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3BlZWQgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdTUEVFRCcpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSAnbW92ZV9mb3J3YXJkICs9JyArIHNwZWVkICsgJztcXG4nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ2FjdGlvbiddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRyb3Bkb3duX25hbWUgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdOQU1FJyk7XG4gIC8vIFRPRE86IEFzc2VtYmxlIEphdmFTY3JpcHQgaW50byBjb2RlIHZhcmlhYmxlLlxuICB2YXIgY29kZSA9ICcuLi47XFxuJztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydhY3Rpb25fYnknXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBkcm9wZG93bl9uYW1lID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnTkFNRScpO1xuICB2YXIgdmFsdWVfYW1vdW50ID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC52YWx1ZVRvQ29kZShibG9jaywgJ0FNT1VOVCcsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfQVRPTUlDKTtcbiAgLy8gVE9ETzogQXNzZW1ibGUgSmF2YVNjcmlwdCBpbnRvIGNvZGUgdmFyaWFibGUuXG4gIHZhciBjb2RlID0gJy4uLjtcXG4nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ2VpdGhlcl93YXknXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBzdGF0ZW1lbnRzX2NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ0NPREUnKTtcbiAgLy8gVE9ETzogQXNzZW1ibGUgSmF2YVNjcmlwdCBpbnRvIGNvZGUgdmFyaWFibGUuXG4gIHZhciBjb2RlID0gJy4uLjtcXG4nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ21vZGlmaWVyX3Byb2InXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciB2YWx1ZV9xdWFudCA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQudmFsdWVUb0NvZGUoYmxvY2ssICdRVUFOVCcsIHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuT1JERVJfQVRPTUlDKTtcbiAgdmFyIGRyb3Bkb3duX2ZhY3RvciA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ0ZhY3RvcicpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSAnLi4uO1xcbic7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnbW9kaWZpZXJfcmFuZCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIHZhbHVlX3F1YW50ID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC52YWx1ZVRvQ29kZShibG9jaywgJ1FVQU5UJywgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9BVE9NSUMpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSAnLi4uO1xcbic7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbF9hYnNvbHV0ZSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRyb3Bkb3duX25hbWUgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdOQU1FJyk7XG4gIC8vIFRPRE86IEFzc2VtYmxlIEphdmFTY3JpcHQgaW50byBjb2RlIHZhcmlhYmxlLlxuICB2YXIgY29kZSA9ICcuLi4nO1xuICAvLyBUT0RPOiBDaGFuZ2UgT1JERVJfTk9ORSB0byB0aGUgY29ycmVjdCBzdHJlbmd0aC5cbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVhbF9yZWxhdGl2ZSddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRyb3Bkb3duX25hbWUgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdOQU1FJyk7XG4gIC8vIFRPRE86IEFzc2VtYmxlIEphdmFTY3JpcHQgaW50byBjb2RlIHZhcmlhYmxlLlxuICB2YXIgY29kZSA9ICcuLi4nO1xuICAvLyBUT0RPOiBDaGFuZ2UgT1JERVJfTk9ORSB0byB0aGUgY29ycmVjdCBzdHJlbmd0aC5cbiAgcmV0dXJuIFtjb2RlLCB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Lk9SREVSX05PTkVdO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnc2VlX2xpZ2h0J10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3RhdGVtZW50c19jb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdDT0RFJyk7XG4gIC8vIFRPRE86IEFzc2VtYmxlIEphdmFTY3JpcHQgaW50byBjb2RlIHZhcmlhYmxlLlxuICB2YXIgY29kZSA9ICcuLi47XFxuJztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0WydjYWxjX2xpZ2h0J10gPSBmdW5jdGlvbihibG9jaykge1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSAnLi4uJztcbiAgLy8gVE9ETzogQ2hhbmdlIE9SREVSX05PTkUgdG8gdGhlIGNvcnJlY3Qgc3RyZW5ndGguXG4gIHJldHVybiBbY29kZSwgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9OT05FXTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ2dlbmVyYWxfY29tcGFyaXNvbiddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRyb3Bkb3duX2NvbXBhcmVfaW4gPSBibG9jay5nZXRGaWVsZFZhbHVlKCdjb21wYXJlX2luJyk7XG4gIHZhciBkcm9wZG93bl9jb21wYXJlID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnY29tcGFyZScpO1xuICB2YXIgZHJvcGRvd25fY29tcGFyZV9vdXQgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdjb21wYXJlX291dCcpO1xuICB2YXIgc3RhdGVtZW50c195ZXMgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ1lFUycpO1xuICB2YXIgc3RhdGVtZW50c19ubyA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnTk8nKTtcbiAgLy8gVE9ETzogQXNzZW1ibGUgSmF2YVNjcmlwdCBpbnRvIGNvZGUgdmFyaWFibGUuXG4gIHZhciBjb2RlID0gJy4uLjtcXG4nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1ZXN0aW9uX2FkYXB0J10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3RhdGVtZW50c19uYW1lID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdOQU1FJyk7XG4gIHZhciBzdGF0ZW1lbnRzX25hbWUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ05BTUUnKTtcbiAgLy8gVE9ETzogQXNzZW1ibGUgSmF2YVNjcmlwdCBpbnRvIGNvZGUgdmFyaWFibGUuXG4gIHZhciBjb2RlID0gJy4uLjtcXG4nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1ZXN0aW9uX3Jlc3RvcmUnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBzdGF0ZW1lbnRzX3llcyA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnWUVTJyk7XG4gIHZhciBzdGF0ZW1lbnRzX25vID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdOTycpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSAnLi4uO1xcbic7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVlc3Rpb25fcmVmZXJlbmNlJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgZHJvcGRvd25fY29tcGFyZSA9IGJsb2NrLmdldEZpZWxkVmFsdWUoJ2NvbXBhcmUnKTtcbiAgdmFyIGRyb3Bkb3duX2NvbXBhcmVfb3V0ID0gYmxvY2suZ2V0RmllbGRWYWx1ZSgnY29tcGFyZV9vdXQnKTtcbiAgdmFyIHN0YXRlbWVudHNfeWVzID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdZRVMnKTtcbiAgdmFyIHN0YXRlbWVudHNfbm8gPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ05PJyk7XG4gIC8vIFRPRE86IEFzc2VtYmxlIEphdmFTY3JpcHQgaW50byBjb2RlIHZhcmlhYmxlLlxuICB2YXIgY29kZSA9ICcuLi47XFxuJztcbiAgcmV0dXJuIGNvZGU7XG59O1xuXG53aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0Wydjb21wYXJlX2xlZnRyaWdodCddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRyb3Bkb3duX2NvbXBhcmUgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdjb21wYXJlJyk7XG4gIHZhciBzdGF0ZW1lbnRzX25hbWUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ05BTUUnKTtcbiAgdmFyIHN0YXRlbWVudHNfbmFtZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnTkFNRScpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSAnLi4uO1xcbic7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsnY29tcGFyZV9ub3dwcmV2aW91cyddID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIGRyb3Bkb3duX2NvbXBhcmUgPSBibG9jay5nZXRGaWVsZFZhbHVlKCdjb21wYXJlJyk7XG4gIHZhciBzdGF0ZW1lbnRzX3llcyA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnWUVTJyk7XG4gIHZhciBzdGF0ZW1lbnRzX25vID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdOTycpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSAnLi4uO1xcbic7XG4gIHJldHVybiBjb2RlO1xufTtcblxud2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdFsncXVlc3Rpb25fc2hvY2tfc2ltcGxlJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgc3RhdGVtZW50c195ZXMgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ1lFUycpO1xuICB2YXIgc3RhdGVtZW50c19ubyA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnTk8nKTtcbiAgLy8gVE9ETzogQXNzZW1ibGUgSmF2YVNjcmlwdCBpbnRvIGNvZGUgdmFyaWFibGUuXG4gIHZhciBjb2RlID0gJy4uLjtcXG4nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1ZXN0aW9uX3Nob2NrJ10gPSBmdW5jdGlvbihibG9jaykge1xuICB2YXIgdmFsdWVfbmFtZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQudmFsdWVUb0NvZGUoYmxvY2ssICdOQU1FJywgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5PUkRFUl9BVE9NSUMpO1xuICB2YXIgc3RhdGVtZW50c195ZXMgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LnN0YXRlbWVudFRvQ29kZShibG9jaywgJ1lFUycpO1xuICB2YXIgc3RhdGVtZW50c19ubyA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnTk8nKTtcbiAgLy8gVE9ETzogQXNzZW1ibGUgSmF2YVNjcmlwdCBpbnRvIGNvZGUgdmFyaWFibGUuXG4gIHZhciBjb2RlID0gJy4uLjtcXG4nO1xuICByZXR1cm4gY29kZTtcbn07XG5cbndpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHRbJ3F1ZXN0aW9uX3JlZmVyZW5jZV9zaW1wbGUnXSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHZhciBzdGF0ZW1lbnRzX3llcyA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuc3RhdGVtZW50VG9Db2RlKGJsb2NrLCAnWUVTJyk7XG4gIHZhciBzdGF0ZW1lbnRzX25vID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5zdGF0ZW1lbnRUb0NvZGUoYmxvY2ssICdOTycpO1xuICAvLyBUT0RPOiBBc3NlbWJsZSBKYXZhU2NyaXB0IGludG8gY29kZSB2YXJpYWJsZS5cbiAgdmFyIGNvZGUgPSAnLi4uO1xcbic7XG4gIHJldHVybiBjb2RlO1xufTtcbiJdfQ==
