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
 * @fileoverview Audio Phaser Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/AudioBlocks.js';

/**
 * @return {array}
 */
export const createBlocks = [
  {
    kind: 'block',
    blockxml: `
    <block type="phaser_audio_add_bgm">
      <value name="variable">
        <block type="phaser_variable_set">
          <field name="VAR">bgm</field>
        </block>
      </value>
    </block>
`,
  },
  {
    kind: 'block',
    blockxml: `
    <block type="phaser_audio_add">
      <value name="variable">
        <block type="phaser_variable_set">
          <field name="VAR">sound</field>
        </block>
      </value>
    </block>
`,
  },
];

/**
 * @return {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_audio_play">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">sound</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_audio_pause">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">sound</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_audio_resume">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">sound</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_audio_stop">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">sound</field>
      </block>
    </value>
  </block>`,
  },
];

export default {
  createBlocks,
  defaultBlocks,
};
