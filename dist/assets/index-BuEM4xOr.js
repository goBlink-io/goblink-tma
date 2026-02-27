import{cI as c,cJ as d,cK as g,cL as u}from"./index-BxHmVW6A.js";import"./index-1FSGpYd2.js";import"./index-CxL3Wkrc.js";import{c as h}from"./index-D4Znke3K.js";import{r as m,e as w}from"./index-BIQ64_dT.js";import"./index-By_kGdXh.js";const x=c`
  :host {
    display: block;
  }

  :host > button,
  :host > wui-flex {
    gap: var(--wui-spacing-xxs);
    padding: var(--wui-spacing-xs);
    padding-right: var(--wui-spacing-1xs);
    height: 40px;
    border-radius: var(--wui-border-radius-l);
    background: var(--wui-color-gray-glass-002);
    border-width: 0px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
  }

  :host > button wui-image {
    width: 24px;
    height: 24px;
    border-radius: var(--wui-border-radius-s);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }
`;var p=function(o,t,r,s){var a=arguments.length,e=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,r):s,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(o,t,r,s);else for(var l=o.length-1;l>=0;l--)(n=o[l])&&(e=(a<3?n(e):a>3?n(t,r,e):n(t,r))||e);return a>3&&e&&Object.defineProperty(t,r,e),e};let i=class extends g{constructor(){super(...arguments),this.text="",this.loading=!1}render(){return this.loading?u` <wui-flex alignItems="center" gap="xxs" padding="xs">
        <wui-shimmer width="24px" height="24px"></wui-shimmer>
        <wui-shimmer width="40px" height="20px" borderRadius="4xs"></wui-shimmer>
      </wui-flex>`:u`
      <button>
        ${this.tokenTemplate()}
        <wui-text variant="paragraph-600" color="fg-100">${this.text}</wui-text>
      </button>
    `}tokenTemplate(){return this.imageSrc?u`<wui-image src=${this.imageSrc}></wui-image>`:u`
      <wui-icon-box
        size="sm"
        iconColor="fg-200"
        backgroundColor="fg-300"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};i.styles=[m,w,x];p([d()],i.prototype,"imageSrc",void 0);p([d()],i.prototype,"text",void 0);p([d({type:Boolean})],i.prototype,"loading",void 0);i=p([h("wui-token-button")],i);
