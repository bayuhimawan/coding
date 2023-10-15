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
 * @fileoverview Preview for the desktop screen.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React, { createRef } from 'react';

import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';

import styles from './style.module.css';
import PreviewToolbar from './PreviewToolbar';

/**
 *
 */
export class Preview extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.timer = {
      handleResize: null,
      handleReload: null,
    };
    this.state = {
      base: props.base || '/preview/',
      hideContent: false,
      loaded: false,
      loading: false,
      location: props.location || '',
      readOnly: typeof props.readOnly != 'undefined' ? props.readOnly : false,
      hideURL: typeof props.hideURL != 'undefined' ? props.hideURL : false,
    };
    this.windowId = props.windowId;
    this.contentWrapper = createRef();
    this.contentIframe = createRef();
    this.contentLoadTimer = null;

    window.addEventListener('resize', this.resize.bind(this));
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    if (this.timer.handleResize) {
      window.clearTimeout(this.timer.handleResize);
      delete this.timer.handleResize;
    }
    this.timer.handleResize = window.setTimeout(() => {
      this.reload();
    }, 100);
  }

  /**
   * @param {string} location
   */
  setPreviewLocation(location = '') {
    console.log('Change preview location', location, this.state.base);

    // Check for content iframe.
    if (!this.contentIframe) {
      return;
    }

    // Check if we have a valid base path or location.
    if (
      !this.state.base &&
      (!location || (location && !/^\s*$/.test(location)))
    ) {
      return;
    }

    // If there is a base path, we need to add it to the target location.
    let targetLocation = location || this.state.base;
    if (this.state.base && location && !location.startsWith(this.state.base)) {
      targetLocation =
        this.state.base +
        (!this.state.base.endsWith('/') || !location.startsWith('/'))
          ? '/'
          : '' + location;
    }

    // Make sure we have a valid target location.
    if (
      !targetLocation.startsWith('preview/') &&
      !targetLocation.startsWith('/preview/')
    ) {
      targetLocation = '/preview/' + targetLocation;
    }
    if (targetLocation.startsWith('/')) {
      targetLocation = targetLocation.substring(1);
    }

    // Update state with new location and loading state.
    this.setState({ location: targetLocation, loaded: false, loading: true });

    // Set timeout for loading content.
    if (this.contentLoadTimer) {
      clearTimeout(this.contentLoadTimer);
    }
    this.contentLoadTimer = setTimeout(() => {
      console.warn('Timeout ...');
      this.stop();
    }, 10000);

    // Set new location.
    console.log('Set preview location', targetLocation);
    this.contentIframe.current.src = targetLocation;
  }

  /**
   * Update Preview Location.
   */
  updatePreviewLocation() {
    console.debug('Update preview location ...', this.state.location);
    this.setPreviewLocation(this.state.location);
  }

  /**
   * @param {event} event
   */
  handleContentIframeLoad(event) {
    if (this.contentLoadTimer) {
      clearTimeout(this.contentLoadTimer);
    }
    if (
      this.contentIframe.current.contentWindow.location.href != 'about:blank'
    ) {
      console.debug('Iframe Content Loaded:', event);
      this.setState({ loaded: true, loading: false });
    }
  }

  /**
   * @param {event} event
   */
  handleContentIframeError(event) {
    console.error('Iframe Content Error:', event);
    this.setState({ loaded: false, loading: false });
    if (this.contentLoadTimer) {
      clearTimeout(this.contentLoadTimer);
    }
  }

  /**
   *
   */
  goToHomePage() {
    this.setState({ location: '' });
    this.setPreviewLocation();
  }

  /**
   * Reloads the iframe content with a debounce of 100ms.
   */
  reload() {
    if (
      !this.contentIframe ||
      !this.contentIframe.current?.contentWindow ||
      !this.state.location
    ) {
      return;
    }
    if (this.timer.handleReload) {
      window.clearTimeout(this.timer.handleReload);
      delete this.timer.handleReload;
    }
    this.timer.handleReload = window.setTimeout(() => {
      console.debug('Reloading Iframe ...');
      this.setState({ loaded: false, loading: true });
      this.contentIframe.current.contentWindow.location.reload();
    }, 100);
  }

  /**
   * Stops the iframe content.
   */
  stop() {
    if (!this.contentIframe) {
      return;
    }
    console.debug('Stopping Iframe ...');
    this.contentIframe.current.contentWindow.stop();
    this.contentIframe.current.contentWindow.location = 'about:blank';
    this.setState({ loaded: false, loading: false });
  }

  /**
   * @external
   */
  hideContent() {
    this.setState({ hideContent: true });
  }

  /**
   * @external
   */
  showContent() {
    this.setState({ hideContent: false });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <Paper elevation={3} square>
          <PreviewToolbar
            preview={this}
            hideURL={this.props.hideURL}
            readOnly={this.props.readOnly}
            onFullscreen={this.props.onFullscreen}
          />
          <Box className={styles.contentWrapper} ref={this.contentWrapper}>
            {this.state.loading && (
              <Backdrop
                className={styles.contentLoadingScreen}
                sx={{
                  color: '#fff',
                  position: 'absolute',
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={this.state.loading}
                transitionDuration={0}
              >
                <CircularProgress color="inherit" />
                <span className={styles.contentLoadingScreenTitle}>
                  Loading ...
                </span>
              </Backdrop>
            )}
            {(this.state.hideContent ||
              (!this.state.location && !this.state.loading)) && (
              <Backdrop
                className={styles.contentResize}
                sx={{
                  color: '#fff',
                  position: 'absolute',
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={
                  this.state.hideContent ||
                  (!this.state.location && !this.state.loading)
                }
                transitionDuration={0}
              >
                <AspectRatioIcon />
                <span className={styles.contentLoadingScreenTitle}>
                  Preview
                </span>
              </Backdrop>
            )}
            <iframe
              className={`${
                this.windowId
                  ? styles.contentIframeWindow
                  : styles.contentIframe
              } ${this.state.hideContent ? styles.contentIframeHidden : ''}`}
              ref={this.contentIframe}
              src=""
              allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen"
              allowFullScreen
              onLoad={this.handleContentIframeLoad.bind(this)}
              onError={this.handleContentIframeError.bind(this)}
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-top-navigation-by-user-activation allow-downloads"
              title="Preview Content Container"
            ></iframe>
          </Box>
        </Paper>
      </React.StrictMode>
    );
  }
}

Preview.propTypes = {
  base: PropTypes.string,
  hideURL: PropTypes.bool,
  location: PropTypes.string,
  onFullscreen: PropTypes.func,
  readOnly: PropTypes.bool,
  windowId: PropTypes.string,
};
