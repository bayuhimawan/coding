/**
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Tile Sprite Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/TileSpriteBlocks.js';

/**
 * @type {array}
 */
export const createBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_tile_sprite_background">
    <value name="x">
      <block type="math_number"><field name="NUM">1</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">0</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_tile_sprite_floor_add">
    <value name="variable">
      <block type="phaser_variable_set">
        <field name="VAR">floor</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">1</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">0</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_tile_sprite_ceiling_add">
    <value name="variable">
      <block type="phaser_variable_set">
        <field name="VAR">ceiling</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">1</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">0</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_tile_sprite_add">
    <value name="variable">
      <block type="phaser_variable_set">
        <field name="VAR">tile_sprite</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">0</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">550</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_tile_sprite_crop">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">blocks</field>
      </block>
    </value>
  </block>`,
  },
];

/**
 * @type {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_tile_sprite_adjust">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">sprite</field>
      </block>
    </value>
    <value name="value">
      <block type="math_number"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_tile_sprite_destroy">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">sprite</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_tile_sprite_autoScroll">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">blocks</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">1</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">0</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_tile_sprite_immovable">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">blocks</field>
      </block>
    </value>
  </block>`,
  },
];

export default {
  createBlocks,
  defaultBlocks,
};
