import{cI as d,cJ as u,cK as m,cM as f,cL as c}from"./index-BxHmVW6A.js";import{c as v}from"./index-D4Znke3K.js";import{r as b}from"./index-BIQ64_dT.js";import"./index-BaxBz4yO.js";const w=d`
  :host {
    position: relative;
    display: inline-block;
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var a=function(o,i,r,s){var n=arguments.length,e=n<3?i:s===null?s=Object.getOwnPropertyDescriptor(i,r):s,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(o,i,r,s);else for(var p=o.length-1;p>=0;p--)(l=o[p])&&(e=(n<3?l(e):n>3?l(i,r,e):l(i,r))||e);return n>3&&e&&Object.defineProperty(i,r,e),e};let t=class extends m{constructor(){super(...arguments),this.disabled=!1}render(){return c`
      <wui-input-text
        type="email"
        placeholder="Email"
        icon="mail"
        size="mdl"
        .disabled=${this.disabled}
        .value=${this.value}
        data-testid="wui-email-input"
        tabIdx=${f(this.tabIdx)}
      ></wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?c`<wui-text variant="tiny-500" color="error-100">${this.errorMessage}</wui-text>`:null}};t.styles=[b,w];a([u()],t.prototype,"errorMessage",void 0);a([u({type:Boolean})],t.prototype,"disabled",void 0);a([u()],t.prototype,"value",void 0);a([u()],t.prototype,"tabIdx",void 0);t=a([v("wui-email-input")],t);
