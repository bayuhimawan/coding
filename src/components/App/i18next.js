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
 * @fileoverview Translation Support.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { APP_BASE_PATH } from '../../constants';
import { Settings } from '../Settings/Settings';

/**
 * Adding translation support for the whole app
 */
i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      loadPath: APP_BASE_PATH + 'locales/{{lng}}/{{ns}}.json',
    },
  });

/**
 * Check if language is set and change language if needed.
 */
Settings.getLanguage().then((language) => {
  if (language && language !== i18next.resolvedLanguage) {
    i18next.changeLanguage(language);
  }
});

export default i18next;
