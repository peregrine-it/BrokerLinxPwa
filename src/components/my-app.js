/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  updateFirstState,
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './my-icons.js';
import './snack-bar.js';

// const google_client_id     = '548596808682-rm9ef9m7p1v2r5a51lq29kdp9dn3bbtt.apps.googleusercontent.com';
const google_client_id = '475473977152-ar16j43cgja9m36l5jmkui8iqifpq00h.apps.googleusercontent.com'
const google_client_secret = 'YBvlr7mmD1jnVxNYNL-vYY1t';
const scope = 'https://www.google.com/m8/feeds%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email';
// const google_redirect_uri  = 'https://brokerlinx.com/brokerlinxsyncapp/response-callback.php';
const google_redirect_uri = "https://paw-starter.firebaseapp.com/view1";
const googleImportUrl  = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&response_type=code&scope=${scope}&redirect_uri=${google_redirect_uri}&access_type=offline`;


class MyApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
      _firstTime: { type: Boolean },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-drawer-width: 256px;

          --app-primary-color: #E91E63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: #78909C;
        }

        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
        }

        [main-title] {
          font-family: 'Pacifico';
          text-transform: lowercase;
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          padding-right: 44px;
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          min-height: 100vh;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          padding: 24px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }

        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 460px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }

          .main-content {
            padding-top: 107px;
          }

          /* The drawer button isn't shown in the wide layout, so we don't
          need to offset the title */
          [main-title] {
            padding-right: 0px;
          }
        }
      `
    ];
  }

  render() {
    // Anything that's related to rendering should be done in here.
    if (this._firstTime)  {
      return html`
        <a href="${googleImportUrl}">Get the Google link </a>
      ` 
    } else {
      return html`
        <!-- Header -->
        <app-header condenses reveals effects="waterfall">
          <app-toolbar class="toolbar-top">
            <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
            <div main-title>${this.appTitle}</div>
          </app-toolbar>

          <!-- This gets hidden on a small screen-->
          <nav class="toolbar-list">
            <a ?selected="${this._page === 'view1'}" href="/view1">View One</a>
            <a ?selected="${this._page === 'view2'}" href="/view2">View Two</a>
            <a ?selected="${this._page === 'view3'}" href="/view3">View Three</a>
          </nav>
        </app-header>

        <!-- Drawer content -->
        <app-drawer
            .opened="${this._drawerOpened}"
            @opened-changed="${this._drawerOpenedChanged}">
          <nav class="drawer-list">
            <a ?selected="${this._page === 'view1'}" href="/view1">View One</a>
            <a ?selected="${this._page === 'view2'}" href="/view2">View Two</a>
            <a ?selected="${this._page === 'view3'}" href="/view3">View Three</a>
          </nav>
        </app-drawer>

        <!-- Main content -->
        <main role="main" class="main-content">
          <my-view1 class="page" ?active="${this._page === 'view1'}"></my-view1>
          <my-view2 class="page" ?active="${this._page === 'view2'}"></my-view2>
          <my-view3 class="page" ?active="${this._page === 'view3'}"></my-view3>
          <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
        </main>

        <footer>
          <p>Made with &hearts; by the Polymer team.</p>
        </footer>

        <snack-bar ?active="${this._snackbarOpened}">
          You are now ${this._offline ? 'offline' : 'online'}.
        </snack-bar>
      `;
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
    window.addEventListener('appinstalled', (event) => {
      console.log('👍', 'appinstalled', event);
      store.dispatch(updateFirstState(true));
    });
  }

  firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`,
        () => store.dispatch(updateDrawerState(false)));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _menuButtonClicked() {
    store.dispatch(updateDrawerState(true));
  }

  _drawerOpenedChanged(e) {
    store.dispatch(updateDrawerState(e.target.opened));
  }

  stateChanged(state) {
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._snackbarOpened = state.app.snackbarOpened;
    this._drawerOpened = state.app.drawerOpened;
    this._firstTime = state.app.firstTime;
  }
}

window.customElements.define('my-app', MyApp);
