import{dt as A,du as k,dv as V,dw as W,cI as _,cJ as p,cK as R,cL as l,cM as j,cQ as C}from"./index-BxHmVW6A.js";import{r as Y,b as I,G as h,d as S,R as z,O as G,E as P,g as q,W as H}from"./index-BIQ64_dT.js";import{U as M,c as N}from"./index-D4Znke3K.js";import"./index-By_kGdXh.js";import"./index-zkEPKZCL.js";import"./index-C3uLqky6.js";import"./index-1FSGpYd2.js";import"./index-CxL3Wkrc.js";A.extend(k);A.extend(V);const K={...W,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}},J=["January","February","March","April","May","June","July","August","September","October","November","December"];A.locale("en-web3-modal",K);const F={getMonthNameByIndex(e){return J[e]},getYear(e=new Date().toISOString()){return A(e).year()},getRelativeDateFromNow(e){return A(e).locale("en-web3-modal").fromNow(!0)},formatDate(e,t="DD MMM"){return A(e).format(t)}},Q=3,X=["receive","deposit","borrow","claim"],Z=["withdraw","repay","burn"],D={getTransactionGroupTitle(e,t){const i=F.getYear(),r=F.getMonthNameByIndex(t);return e===i?r:`${r} ${e}`},getTransactionImages(e){const[t,i]=e,r=!!t&&(e==null?void 0:e.every(s=>!!s.nft_info)),n=(e==null?void 0:e.length)>1;return(e==null?void 0:e.length)===2&&!r?[this.getTransactionImage(i),this.getTransactionImage(t)]:n?e.map(s=>this.getTransactionImage(s)):[this.getTransactionImage(t)]},getTransactionImage(e){return{type:D.getTransactionTransferTokenType(e),url:D.getTransactionImageURL(e)}},getTransactionImageURL(e){var n,o,s,a,c;let t;const i=!!(e!=null&&e.nft_info),r=!!(e!=null&&e.fungible_info);return e&&i?t=(s=(o=(n=e==null?void 0:e.nft_info)==null?void 0:n.content)==null?void 0:o.preview)==null?void 0:s.url:e&&r&&(t=(c=(a=e==null?void 0:e.fungible_info)==null?void 0:a.icon)==null?void 0:c.url),t},getTransactionTransferTokenType(e){if(e!=null&&e.fungible_info)return"FUNGIBLE";if(e!=null&&e.nft_info)return"NFT"},getTransactionDescriptions(e){var y,T,v;const t=(y=e==null?void 0:e.metadata)==null?void 0:y.operationType,i=e==null?void 0:e.transfers,r=((T=e==null?void 0:e.transfers)==null?void 0:T.length)>0,n=((v=e==null?void 0:e.transfers)==null?void 0:v.length)>1,o=r&&(i==null?void 0:i.every(w=>!!(w!=null&&w.fungible_info))),[s,a]=i;let c=this.getTransferDescription(s),u=this.getTransferDescription(a);if(!r)return(t==="send"||t==="receive")&&o?(c=M.getTruncateString({string:e==null?void 0:e.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),u=M.getTruncateString({string:e==null?void 0:e.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[c,u]):[e.metadata.status];if(n)return i.map(w=>this.getTransferDescription(w)).reverse();let m="";return X.includes(t)?m="+":Z.includes(t)&&(m="-"),c=m.concat(c),[c]},getTransferDescription(e){var i;let t="";return e&&(e!=null&&e.nft_info?t=((i=e==null?void 0:e.nft_info)==null?void 0:i.name)||"-":e!=null&&e.fungible_info&&(t=this.getFungibleTransferDescription(e)||"-")),t},getFungibleTransferDescription(e){var r;return e?[this.getQuantityFixedValue(e==null?void 0:e.quantity.numeric),(r=e==null?void 0:e.fungible_info)==null?void 0:r.symbol].join(" ").trim():null},getQuantityFixedValue(e){return e?parseFloat(e).toFixed(Q):null}};var L;(function(e){e.approve="approved",e.bought="bought",e.borrow="borrowed",e.burn="burnt",e.cancel="canceled",e.claim="claimed",e.deploy="deployed",e.deposit="deposited",e.execute="executed",e.mint="minted",e.receive="received",e.repay="repaid",e.send="sent",e.sell="sold",e.stake="staked",e.trade="swapped",e.unstake="unstaked",e.withdraw="withdrawn"})(L||(L={}));const ee=_`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-005);
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }
`;var b=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};let f=class extends R{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){const[t,i]=this.images,r=(t==null?void 0:t.type)==="NFT",n=i!=null&&i.url?i.type==="NFT":r,o=r?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)",s=n?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)";return this.style.cssText=`
    --local-left-border-radius: ${o};
    --local-right-border-radius: ${s};
    `,l`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){const[t,i]=this.images,r=t==null?void 0:t.type;return this.images.length===2&&(t!=null&&t.url||i!=null&&i.url)?l`<div class="swap-images-container">
        ${t!=null&&t.url?l`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
        ${i!=null&&i.url?l`<wui-image src=${i.url} alt="Transaction image"></wui-image>`:null}
      </div>`:t!=null&&t.url?l`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:r==="NFT"?l`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`:l`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`}templateIcon(){let t="accent-100",i;return i=this.getIcon(),this.status&&(t=this.getStatusColor()),i?l`
      <wui-icon-box
        size="xxs"
        iconColor=${t}
        backgroundColor=${t}
        background="opaque"
        icon=${i}
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():this.type==="trade"?"swapHorizontalBold":this.type==="approve"?"checkmark":this.type==="cancel"?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success-100";case"failed":return"error-100";case"pending":return"inverse-100";default:return"accent-100"}}};f.styles=[ee];b([p()],f.prototype,"type",void 0);b([p()],f.prototype,"status",void 0);b([p()],f.prototype,"direction",void 0);b([p({type:Boolean})],f.prototype,"onlyDirectionIcon",void 0);b([p({type:Array})],f.prototype,"images",void 0);b([p({type:Object})],f.prototype,"secondImage",void 0);f=b([N("wui-transaction-visual")],f);const te=_`
  :host > wui-flex:first-child {
    align-items: center;
    column-gap: var(--wui-spacing-s);
    padding: 6.5px var(--wui-spacing-xs) 6.5px var(--wui-spacing-xs);
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;var g=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};let d=class extends R{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[],this.price=[],this.amount=[],this.symbol=[]}render(){return l`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${j(this.direction)}
          type=${this.type}
          onlyDirectionIcon=${j(this.onlyDirectionIcon)}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${L[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){var i;const t=(i=this.descriptions)==null?void 0:i[0];return t?l`
          <wui-text variant="small-500" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}templateSecondDescription(){var i;const t=(i=this.descriptions)==null?void 0:i[1];return t?l`
          <wui-icon class="description-separator-icon" size="xxs" name="arrowRight"></wui-icon>
          <wui-text variant="small-400" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}};d.styles=[Y,te];g([p()],d.prototype,"type",void 0);g([p({type:Array})],d.prototype,"descriptions",void 0);g([p()],d.prototype,"date",void 0);g([p({type:Boolean})],d.prototype,"onlyDirectionIcon",void 0);g([p()],d.prototype,"status",void 0);g([p()],d.prototype,"direction",void 0);g([p({type:Array})],d.prototype,"images",void 0);g([p({type:Array})],d.prototype,"price",void 0);g([p({type:Array})],d.prototype,"amount",void 0);g([p({type:Array})],d.prototype,"symbol",void 0);d=g([N("wui-transaction-list-item")],d);const ie=_`
  :host > wui-flex:first-child {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`;var oe=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};let B=class extends R{render(){return l`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px"></wui-shimmer>
        <wui-flex flexDirection="column" gap="2xs">
          <wui-shimmer width="72px" height="16px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="148px" height="14px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" borderRadius="5xs"></wui-shimmer>
      </wui-flex>
    `}};B.styles=[Y,ie];B=oe([N("wui-transaction-list-item-loader")],B);const re=_`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: var(--wui-spacing-m);
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`;var $=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};const O="last-transaction",ne=7;let x=class extends R{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=I.state.activeCaipAddress,this.transactionsByYear=h.state.transactionsByYear,this.loading=h.state.loading,this.empty=h.state.empty,this.next=h.state.next,h.clearCursor(),this.unsubscribe.push(I.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(h.resetTransactions(),h.fetchTransactions(t)),this.caipAddress=t}),I.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),h.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){h.resetTransactions(),this.caipAddress&&h.fetchTransactions(S.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(i=>{const r=parseInt(i,10),n=new Array(12).fill(null).map((o,s)=>{var u;const a=D.getTransactionGroupTitle(r,s),c=(u=this.transactionsByYear[r])==null?void 0:u[s];return{groupTitle:a,transactions:c}}).filter(({transactions:o})=>o).reverse();return n.map(({groupTitle:o,transactions:s},a)=>{const c=a===n.length-1;return s?l`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${c?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200" data-testid="group-title"
                >${o}</wui-text
              >
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(s,c)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,i){const{date:r,descriptions:n,direction:o,isAllNFT:s,images:a,status:c,transfers:u,type:m}=this.getTransactionListItemProps(t),y=(u==null?void 0:u.length)>1;return(u==null?void 0:u.length)===2&&!s?l`
        <wui-transaction-list-item
          date=${r}
          .direction=${o}
          id=${i&&this.next?O:""}
          status=${c}
          type=${m}
          .images=${a}
          .descriptions=${n}
        ></wui-transaction-list-item>
      `:y?u.map((v,w)=>{const E=D.getTransferDescription(v),U=i&&w===u.length-1;return l` <wui-transaction-list-item
          date=${r}
          direction=${v.direction}
          id=${U&&this.next?O:""}
          status=${c}
          type=${m}
          .onlyDirectionIcon=${!0}
          .images=${[a[w]]}
          .descriptions=${[E]}
        ></wui-transaction-list-item>`}):l`
      <wui-transaction-list-item
        date=${r}
        .direction=${o}
        id=${i&&this.next?O:""}
        status=${c}
        type=${m}
        .images=${a}
        .descriptions=${n}
      ></wui-transaction-list-item>
    `}templateTransactions(t,i){return t.map((r,n)=>{const o=i&&n===t.length-1;return l`${this.templateRenderTransaction(r,o)}`})}emptyStateActivity(){return l`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["3xl","xl","3xl","xl"]}
      gap="xl"
      data-testid="empty-activity-state"
    >
      <wui-icon-box
        backgroundColor="gray-glass-005"
        background="gray"
        iconColor="fg-200"
        icon="wallet"
        size="lg"
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="xs">
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >No Transactions yet</wui-text
        >
        <wui-text align="center" variant="small-500" color="fg-200"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return l`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
      data-testid="empty-account-state"
    >
      <wui-icon-box
        icon="swapHorizontal"
        size="inherit"
        iconColor="fg-200"
        backgroundColor="fg-200"
        iconSize="lg"
      ></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="xs"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100">No activity yet</wui-text>
        <wui-text variant="small-400" align="center" color="fg-200"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return this.page==="account"?l`${this.emptyStateAccount()}`:l`${this.emptyStateActivity()}`}templateLoading(){return this.page==="activity"?Array(ne).fill(l` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t):null}onReceiveClick(){z.push("WalletReceive")}createPaginationObserver(){const{projectId:t}=G.state;this.paginationObserver=new IntersectionObserver(([i])=>{i!=null&&i.isIntersecting&&!this.loading&&(h.fetchTransactions(S.getPlainAddress(this.caipAddress)),P.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:S.getPlainAddress(this.caipAddress),projectId:t,cursor:this.next,isSmartAccount:q(I.state.activeChain)===H.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){var i,r,n;(i=this.paginationObserver)==null||i.disconnect();const t=(r=this.shadowRoot)==null?void 0:r.querySelector(`#${O}`);t&&((n=this.paginationObserver)==null||n.observe(t))}getTransactionListItemProps(t){var c,u,m,y,T;const i=F.formatDate((c=t==null?void 0:t.metadata)==null?void 0:c.minedAt),r=D.getTransactionDescriptions(t),n=t==null?void 0:t.transfers,o=(u=t==null?void 0:t.transfers)==null?void 0:u[0],s=!!o&&((m=t==null?void 0:t.transfers)==null?void 0:m.every(v=>!!v.nft_info)),a=D.getTransactionImages(n);return{date:i,direction:o==null?void 0:o.direction,descriptions:r,isAllNFT:s,images:a,status:(y=t.metadata)==null?void 0:y.status,transfers:n,type:(T=t.metadata)==null?void 0:T.operationType}}};x.styles=re;$([p()],x.prototype,"page",void 0);$([C()],x.prototype,"caipAddress",void 0);$([C()],x.prototype,"transactionsByYear",void 0);$([C()],x.prototype,"loading",void 0);$([C()],x.prototype,"empty",void 0);$([C()],x.prototype,"next",void 0);x=$([N("w3m-activity-list")],x);
