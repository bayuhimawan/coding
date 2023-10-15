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
 * @fileoverview Phaser Template for the Phaser Blockly modification.
 * @author mbordihn@google.com (Markus Bordihn)
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import Blockly from 'blockly';

import { APP_BASE_PATH, PREVIEW_BASE_PATH } from '../../../constants/index.js';

/**
 * @class
 */
export class PhaserTemplate {
  /**
   * @param {string} code
   * @param {object} project
   * @return {string}
   */
  static render(code, project) {
    return `<!DOCTYPE html>
<html>
  <head>
    ${(() => {
      return project
        ? `<title>${project.name}</title>`
        : '<title>Phaser Game</title>';
    })()}
    ${(() => {
      return project
        ? `<base href="${PREVIEW_BASE_PATH}preview/${project.id}/" />`
        : '';
    })()}
    <style>
      * { margin: 0; padding: 0; }
      html, body { width: 100%; height: 100%; overflow: hidden; }
      canvas { display: block; }
    </style>
    ${`<script src="${APP_BASE_PATH}framework/phaser_helper.min.js"></script>`}
    ${`<script src="${APP_BASE_PATH}framework/phaser_extras.min.js"></script>`}
    ${`<script src="${APP_BASE_PATH}framework/phaser.min.js"></script>`}
  </head>
  <body>
    <script>
    ${code || ''}
    </script>
  </body>
</html>`;
  }
}

export default {
  PhaserTemplate,
};
