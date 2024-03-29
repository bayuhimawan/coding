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
 * @fileoverview Typescript global Type definitions.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

/** ServiceWorkerWebpackPlugin */
declare const serviceWorkerOption: Record<string, unknown>;

/** Assets Array for Cache Worker */
declare const APP_ASSETS: [string];

/** Version from package.json */
declare const APP_VERSION: string;

/** Devmode from Webpack config */
declare const DEVMODE: boolean;

declare module '*.module.css' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
