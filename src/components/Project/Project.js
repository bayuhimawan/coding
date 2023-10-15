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
 * @fileoverview Project definition.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { v4 as uuidv4 } from 'uuid';

import { ProjectType } from './ProjectType';
import { Database } from '../../utils/db/Database';

const DATABASE_NAME = 'Projects';

/**
 * @class
 */
export class Project {
  /**
   * @param {string} id
   * @param {string} type
   * @param {string} name
   * @param {string} description
   * @param {string} lastModified
   * @constructor
   */
  constructor(
    id = uuidv4(),
    type = ProjectType.NONE,
    name = '',
    description = '',
    lastModified = new Date().toISOString(),
  ) {
    this.isArchived = false;
    this.isEmpty = true;
    this.icon = '🎮';
    this.id = id || uuidv4();
    this.type = type || ProjectType.NONE;
    this.name = name || '';
    this.description = description || '';
    this.icon = Project.getDefaultProjectIcon(this.type);
    this.lastModified = lastModified || new Date().toISOString();
    this.screenshot = '';
  }

  /**
   * @return {string}
   */
  getScreenshot() {
    return this.screenshot;
  }

  /**
   * @param {string} screenshot
   * @return {Project}
   */
  setScreenshot(screenshot) {
    this.screenshot = screenshot;
    return this;
  }

  /**
   * @return {boolean}
   */
  hasScreenshot() {
    return !!this.screenshot;
  }

  /**
   * @return {string}
   */
  getId() {
    return this.id;
  }

  /**
   * @param {string} icon
   * @return {Project}
   */
  setIcon(icon) {
    this.icon = icon;
    return this;
  }

  /**
   * @param {string} name
   * @return {Project}
   */
  setName(name) {
    this.name = name;
    return this;
  }

  /**
   * @param {string} description
   * @return {Project}
   */
  setDescription(description) {
    this.description = description;
    return this;
  }

  /**
   * @param {string} lastModified
   * @return {Project}
   */
  setLastModified(lastModified = new Date().toISOString()) {
    this.lastModified = lastModified;
    return this;
  }

  /**
   * @return {boolean}
   */
  getIsEmpty() {
    return this.isEmpty;
  }

  /**
   * @param {boolean} isEmpty
   * @return {Project}
   */
  setIsEmpty(isEmpty) {
    this.isEmpty = isEmpty;
    return this;
  }

  /**
   * @return {boolean}
   */
  getIsArchived() {
    return this.isArchived;
  }

  /**
   * @param {boolean} isArchived
   * @return {Project}
   */
  setIsArchived(isArchived) {
    this.isArchived = isArchived;
    return this;
  }

  /**
   * @return {Promise<Project>}
   */
  save() {
    return new Promise((resolve) => {
      const projectDatabase = new Database(DATABASE_NAME, this.type);
      projectDatabase
        .put(this.id, {
          icon: this.icon,
          id: this.id,
          type: this.type,
          name: this.name,
          description: this.description,
          lastModified: this.lastModified,
          screenshot: this.screenshot,
          isEmpty: this.isEmpty,
          isArchived: this.isArchived,
        })
        .then(() => {
          resolve(this);
        });
    });
  }

  /**
   * @return {Project}
   */
  load() {
    const projectDatabase = new Database(DATABASE_NAME, this.type);
    projectDatabase.get(this.id).then((data) => {
      if (data) {
        this.icon = data.icon;
        this.name = data.name;
        this.description = data.description;
        this.lastModified = data.lastModified;
        this.screenshot = data.screenshot;
        this.isEmpty = data.isEmpty;
        this.isArchived = data.isArchived;
      }
    });
    return this;
  }

  /**
   * @return {Promise<Project>}
   */
  archive() {
    this.isArchived = true;
    return this.save();
  }

  /**
   * @param {ProjectType} type
   * @param {boolean} showArchived
   * @return {Promise}
   */
  static getProjects(type = ProjectType.NONE, showArchived = false) {
    return new Promise((resolve) => {
      const projectDatabase = new Database(DATABASE_NAME, type);
      projectDatabase.getAll().then((data) => {
        const projects = [];
        if (data && data.length > 0) {
          data.forEach((projectEntry) => {
            if (showArchived || !projectEntry.isArchived) {
              const project = new Project(
                projectEntry.id,
                projectEntry.type,
                projectEntry.name,
                projectEntry.description,
                projectEntry.lastModified,
              );
              if (projectEntry.icon) {
                project.setIcon(projectEntry.icon);
              }
              if (projectEntry.screenshot) {
                project.setScreenshot(projectEntry.screenshot);
              }
              project.setIsEmpty(projectEntry.isEmpty);
              project.setIsArchived(projectEntry.isArchived);
              projects.push(project);
            }
          });
        }
        resolve(projects);
      });
    });
  }

  /**
   * @param {ProjectType} type
   * @param {boolean} includeArchived
   * @return {Promise}
   */
  static hasProjects(type = ProjectType.NONE, includeArchived = false) {
    return new Promise((resolve) => {
      const projectDatabase = new Database(DATABASE_NAME, type);
      projectDatabase.getAll().then((data) => {
        if (data && data.length > 0) {
          data.forEach((projectEntry) => {
            if (
              projectEntry.type === type &&
              (includeArchived || !projectEntry.isArchived)
            ) {
              return resolve(true);
            }
          });
        }
        resolve(false);
      });
    });
  }

  /**
   * @param {string} id
   * @param {ProjectType} type
   * @return {Promise}
   */
  static getProject(id, type = ProjectType.NONE) {
    return new Promise((resolve, reject) => {
      const projectDatabase = new Database(DATABASE_NAME, type);
      let foundProjectId = false;
      projectDatabase.getAll().then((data) => {
        if (data && data.length > 0) {
          data.forEach((projectEntry) => {
            if (projectEntry.id === id) {
              foundProjectId = true;
              if (projectEntry.type === type) {
                const project = new Project(
                  projectEntry.id,
                  projectEntry.type,
                  projectEntry.name,
                  projectEntry.description,
                  projectEntry.lastModified,
                );
                if (projectEntry.icon) {
                  project.setIcon(projectEntry.icon);
                }
                if (projectEntry.screenshot) {
                  project.setScreenshot(projectEntry.screenshot);
                }
                project.setIsEmpty(projectEntry.isEmpty);
                project.setIsArchived(projectEntry.isArchived);
                resolve(project);
                return;
              }
            }
          });
        }
        if (foundProjectId) {
          reject(new Error(`Found Project ${id} but without type ${type}`));
        } else {
          reject(new Error(`Project ${id} with type ${type} not found!`));
        }
      });
    });
  }

  /**
   * @param {string} name
   * @param {ProjectType} type
   * @return {Promise}
   */
  static getDefaultProject(name, type) {
    const project = new Project(undefined, type, name);
    project.setIsEmpty(false);
    return project.save();
  }

  /**
   * @param {string} name
   * @param {ProjectType} type
   * @return {Promise}
   */
  static getEmptyProject(name, type) {
    const project = new Project(undefined, type, name);
    return project.save();
  }

  /**
   * @param {ProjectType} type
   * @return {string}
   */
  static getRandomProjectIcon(type) {
    let iconSet = [];
    switch (type) {
      case ProjectType.NONE:
        iconSet = ['📝'];
        break;
      case ProjectType.GAME_EDITOR:
        iconSet = ['👾', '🎮', '🕹️', '🎲', '🎰', '🎳', '🎯', '🎱', '🎮'];
        break;
      default:
        iconSet = ['📓', '📒', '📕', '📗', '📘', '📙', '📚', '📖'];
    }
    return iconSet[Math.floor(Math.random() * iconSet.length)];
  }

  /**
   * @param {ProjectType} type
   * @return {string}
   */
  static getDefaultProjectIcon(type) {
    switch (type) {
      case ProjectType.NONE:
        return '📝';
      case ProjectType.GAME_EDITOR:
        return '👾';
      default:
        return '📝';
    }
  }
}
