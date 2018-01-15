window.Blockly.defineBlocksWithJsonArray([
{
    "type": "action_by",
    "message0": "Do sth in %1 %2 by %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": [
          [
            "away from light",
            "LIGHT_AWAY"
          ],
          [
            "towards light",
            "LIGHT_TOWARDS"
          ],
          [
            "away from receptor",
            "RECPT_AWAY"
          ],
          [
            "towards receptor",
            "RECPT_TOWARDS"
          ],
          [
            "forward",
            "FORWARD"
          ],
          [
            "backward",
            "BACKWARD"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "AMOUNT",
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
  {
    "type": "action",
    "message0": "Do sth in %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": [
          [
            "away from light",
            "LIGHT_AWAY"
          ],
          [
            "towards light",
            "LIGHT_TOWARDS"
          ],
          [
            "away from receptor",
            "RECPT_AWAY"
          ],
          [
            "towards receptor",
            "RECPT_TOWARDS"
          ],
          [
            "forward",
            "FORWARD"
          ],
          [
            "backward",
            "BACKWARD"
          ]
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
  {
    "type": "either_way",
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
  {
    "type": "modifier_prob",
    "message0": "%1 with probability proportional to %2",
    "args0": [
      {
        "type": "input_value",
        "name": "QUANT",
        "check": [
          "Number",
          "String"
        ]
      },
      {
        "type": "field_dropdown",
        "name": "Factor",
        "options": [
          [
            "difference between current and previous light",
            "diff_light_CP"
          ],
          [
            "difference between light in left and right receptor",
            "diff_light_LR"
          ],
          [
            "average light",
            "avg_light"
          ],
          [
            "current light",
            "curr_light"
          ]
        ]
      }
    ],
    "inputsInline": true,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "modifier_rand",
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
          "String"
        ]
      }
    ],
    "inputsInline": true,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "qual_absolute",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": [
          [
            "low",
            "LOW"
          ],
          [
            "medium",
            "MEDIUM"
          ],
          [
            "high",
            "HIGH"
          ]
        ]
      }
    ],
    "output": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "qual_relative",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": [
          [
            "less than",
            "LESS"
          ],
          [
            "same as",
            "SAME"
          ],
          [
            "more than",
            "MORE"
          ]
        ]
      }
    ],
    "output": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "see_light",
    "message0": "If I see a change or difference in light: %1 %2",
    "args0": [
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
  },
  {
    "type": "calc_light",
    "message0": "Detect the incoming light",
    "output": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "general_comparison",
    "message0": "Is %1 %2 %3 %4 If yes: %5 If no: %6",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "compare_in",
        "options": [
          [
            "the detected light",
            "curr_light"
          ],
          [
            "the difference in light",
            "diff_light"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "compare",
        "options": [
          [
            "bigger than",
            "BIGGER"
          ],
          [
            "the same as",
            "SAME"
          ],
          [
            "smaller than",
            "SMALLER"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "compare_out",
        "options": [
          [
            "the ambient light",
            "ambient_light"
          ],
          [
            "the reference level",
            "reference_light"
          ],
          [
            "the adaptation level",
            "adaptation_light"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "YES"
      },
      {
        "type": "input_statement",
        "name": "NO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "question_adapt",
    "message0": "Is / are my eye(s) adapted? %1 Yes: %2 No: %3",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "NAME"
      },
      {
        "type": "input_statement",
        "name": "NAME"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "question_restore",
    "message0": "Is the light back to what it was before? %1 Yes: %2 No: %3",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "YES"
      },
      {
        "type": "input_statement",
        "name": "NO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "question_reference",
    "message0": "Is the detected light %1 %2 ? %3 Yes: %4 No: %5",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "compare",
        "options": [
          [
            "brighter than",
            "BRIGHTER"
          ],
          [
            "dimmer than",
            "DIMMER"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "compare_out",
        "options": [
          [
            "the reference level",
            "reference_light"
          ],
          [
            "the adapted level",
            "adapted_light"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "YES"
      },
      {
        "type": "input_statement",
        "name": "NO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "compare_leftright",
    "message0": "Does the left receptor see %1 light than the right receptor? %2 Yes: %3 No: %4",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "compare",
        "options": [
          [
            "more",
            "left_more"
          ],
          [
            "less",
            "left_less"
          ],
          [
            "option",
            "OPTIONNAME"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "NAME"
      },
      {
        "type": "input_statement",
        "name": "NAME"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "compare_nowprevious",
    "message0": "Does the receptor see %1 light now than before? %2 Yes: %3 No: %4",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "compare",
        "options": [
          [
            "more",
            "left_more"
          ],
          [
            "less",
            "left_less"
          ],
          [
            "option",
            "OPTIONNAME"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "YES"
      },
      {
        "type": "input_statement",
        "name": "NO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "question_shock_simple",
    "message0": "Is the difference in light very big? %1 Yes: %2 No: %3",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "YES"
      },
      {
        "type": "input_statement",
        "name": "NO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "question_shock",
    "message0": "Is the difference in light bigger than %1 %2 ? %3 Yes: %4 No: %5",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "NAME",
        "check": "Number"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "YES"
      },
      {
        "type": "input_statement",
        "name": "NO"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "question_reference_simple",
    "message0": "Is the detected light very dim? %1 Yes: %2 No: %3",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "YES"
      },
      {
        "type": "input_statement",
        "name": "NO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
  "type": "forward_speed",
  "message0": "Move forward by %1 %2 micro meters",
  "args0": [
    {
      "type": "field_number",
      "name": "SPEED",
      "value": 0,
      "min": 0,
      "max": 15,
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
}
]);

window.Blockly.Blocks['every_time'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("With every time step, do the following:");
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.setInputsInline(false);
    this.setColour(230);
    this.setDeletable(false);
    this.setMovable(false);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

window.Blockly.JavaScript['every_time'] = function(block) {
  var all_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = '<<<<\n' + all_code + '>>>>\n';
  return code;
};


window.Blockly.JavaScript['forward_speed'] = function(block) {
  var speed = block.getFieldValue('SPEED');
  // TODO: Assemble JavaScript into code variable.
  var code = 'move_forward +=' + speed + ';\n';
  return code;
};

window.Blockly.JavaScript['action'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['action_by'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var value_amount = window.Blockly.JavaScript.valueToCode(block, 'AMOUNT', window.Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['either_way'] = function(block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['modifier_prob'] = function(block) {
  var value_quant = window.Blockly.JavaScript.valueToCode(block, 'QUANT', window.Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_factor = block.getFieldValue('Factor');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['modifier_rand'] = function(block) {
  var value_quant = window.Blockly.JavaScript.valueToCode(block, 'QUANT', window.Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['qual_absolute'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['qual_relative'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['see_light'] = function(block) {
  var statements_code = window.Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['calc_light'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, window.Blockly.JavaScript.ORDER_NONE];
};

window.Blockly.JavaScript['general_comparison'] = function(block) {
  var dropdown_compare_in = block.getFieldValue('compare_in');
  var dropdown_compare = block.getFieldValue('compare');
  var dropdown_compare_out = block.getFieldValue('compare_out');
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_adapt'] = function(block) {
  var statements_name = window.Blockly.JavaScript.statementToCode(block, 'NAME');
  var statements_name = window.Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_restore'] = function(block) {
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_reference'] = function(block) {
  var dropdown_compare = block.getFieldValue('compare');
  var dropdown_compare_out = block.getFieldValue('compare_out');
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['compare_leftright'] = function(block) {
  var dropdown_compare = block.getFieldValue('compare');
  var statements_name = window.Blockly.JavaScript.statementToCode(block, 'NAME');
  var statements_name = window.Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['compare_nowprevious'] = function(block) {
  var dropdown_compare = block.getFieldValue('compare');
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_shock_simple'] = function(block) {
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_shock'] = function(block) {
  var value_name = window.Blockly.JavaScript.valueToCode(block, 'NAME', window.Blockly.JavaScript.ORDER_ATOMIC);
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

window.Blockly.JavaScript['question_reference_simple'] = function(block) {
  var statements_yes = window.Blockly.JavaScript.statementToCode(block, 'YES');
  var statements_no = window.Blockly.JavaScript.statementToCode(block, 'NO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};
