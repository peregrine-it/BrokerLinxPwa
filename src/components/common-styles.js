/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css } from 'lit-element';

export const CommonStyles = css`
    .page-build{display:none;}

    .header-light .header-logo, .footer-light .footer-logo{background-image:url(./images/logo-dark.png);}
    .header-dark .header-logo, .footer-dark .footer-logo{background-image:url(./images/logo-light.png);}

    .header .header-logo{
        background-size:70px 16px;
        width:116px;
        margin-left:-58px;
        color:#FFFFFF;
    }

    .footer .footer-logo{
        background-size:120px 28px;
        width:100%;
        height:32px;
        margin:0 auto;
    }

    .menu-header .menu-logo{
        background-image:url(./images/logo.png);
        background-color:rgba(255,255,255,0.05);
        padding:5px;
        border:solid 1px rgba(0,0,0,0.1);
        border-radius:100px;
        background-size:80px 80px;
        background-repeat:no-repeat;
        background-position:center center;
        width:90px;
        height:90px;
        z-index:10;
        display:block;
        margin:20px auto 15px auto;
    }

`;
