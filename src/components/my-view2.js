/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import { increment, decrement } from '../actions/counter.js';
import '@material/mwc-dialog';
import '@material/mwc-button/mwc-button'
// We are lazy loading its reducer.
import counter from '../reducers/counter.js';
store.addReducers({
  counter
});

// These are the elements needed by this element.
import './counter-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
// const google_client_id     = '548596808682-rm9ef9m7p1v2r5a51lq29kdp9dn3bbtt.apps.googleusercontent.com';
const google_client_id = '628167191099-o4tho8a6ehpkq1gaunuk4phckgvo8sbu.apps.googleusercontent.com'
const google_client_secret = '03nRVKNJavnasbut501z3QMf';
const scope = 'https://www.google.com/m8/feeds%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email';
// const google_redirect_uri  = 'https://brokerlinx.com/brokerlinxsyncapp/response-callback.php';
const google_redirect_uri = "https://paw-starter.firebaseapp.com/view1";
const googleImportUrl  = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&response_type=code&scope=${scope}&redirect_uri=${google_redirect_uri}&access_type=offline`;

class MyView2 extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      // This is the data from the store.
      _clicks: { type: Number },
      _value: { type: Number }
    };
  }

  static get styles() {
    return [
      SharedStyles
    ];
  }

  render() {
    return html`
      <section>
        <mwc-dialog open>
          <div>
            Give contact access to app
            <a href="${googleImportUrl}">Accept</a>
          </div>
        </mwc-dialog>
      </section>
    `;
  }

  // _counterIncremented() {
  //   store.dispatch(increment());
  // }

  // _counterDecremented() {
  //   store.dispatch(decrement());
  // }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._clicks = state.counter.clicks;
    this._value = state.counter.value;
  }
}

window.customElements.define('my-view2', MyView2);
