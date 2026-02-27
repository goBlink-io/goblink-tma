import{cI as m,cK as f,cL as a}from"./index-BxHmVW6A.js";import"./index-BIQ64_dT.js";import{c as p}from"./index-D4Znke3K.js";import"./index-Bdxf0QJJ.js";import"./index.es-CmLrfvcW.js";import"./index-nibyPLVP.js";import"./index-By_kGdXh.js";import"./index-C3uLqky6.js";import"./index-zkEPKZCL.js";import"./index-1FSGpYd2.js";import"./index-CxL3Wkrc.js";const d=m`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`;var u=function(o,e,i,r){var n=arguments.length,t=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,i,r);else for(var c=o.length-1;c>=0;c--)(l=o[c])&&(t=(n<3?l(t):n>3?l(e,i,t):l(e,i))||t);return n>3&&t&&Object.defineProperty(e,i,t),t};let s=class extends f{render(){return a`
      <wui-flex flexDirection="column" .padding=${["0","m","m","m"]} gap="s">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `}};s.styles=d;s=u([p("w3m-transactions-view")],s);export{s as W3mTransactionsView};
