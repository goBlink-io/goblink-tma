import{cI as p,cJ as u,cQ as f,cK as b,cL as d}from"./index-BxHmVW6A.js";import{R as g,M as m}from"./index-BIQ64_dT.js";import{c as M}from"./index-D4Znke3K.js";import{T as l}from"./index-Dt4tHmeS.js";const x={interpolate(i,e,o){if(i.length!==2||e.length!==2)throw new Error("inputRange and outputRange must be an array of length 2");const n=i[0]||0,r=i[1]||0,t=e[0]||0,s=e[1]||0;return o<n?t:o>r?s:(s-t)/(r-n)*(o-n)+t}},v=p`
  :host {
    width: 100%;
    display: block;
  }
`;var a=function(i,e,o,n){var r=arguments.length,t=r<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,o):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(i,e,o,n);else for(var h=i.length-1;h>=0;h--)(s=i[h])&&(t=(r<3?s(t):r>3?s(e,o,t):s(e,o))||t);return r>3&&t&&Object.defineProperty(e,o,t),t};let c=class extends b{constructor(){super(),this.unsubscribe=[],this.text="",this.open=l.state.open,this.unsubscribe.push(g.subscribeKey("view",()=>{l.hide()}),m.subscribeKey("open",e=>{e||l.hide()}),l.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),l.hide()}render(){return d`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return d`<slot></slot> `}onMouseEnter(){const e=this.getBoundingClientRect();this.open||l.showTooltip({message:this.text,triggerRect:{width:e.width,height:e.height,left:e.left,top:e.top},variant:"shade"})}onMouseLeave(e){this.contains(e.relatedTarget)||l.hide()}};c.styles=[v];a([u()],c.prototype,"text",void 0);a([f()],c.prototype,"open",void 0);c=a([M("w3m-tooltip-trigger")],c);export{x as M};
