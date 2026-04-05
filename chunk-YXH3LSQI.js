import{a as Tt,b as je,c as Et,d as ze}from"./chunk-GNC3KR5I.js";import{a as It,b as At}from"./chunk-IWGH6LM2.js";import"./chunk-FHMTR2TN.js";import{a as kt,b as Dt}from"./chunk-OIHVRYJO.js";import{a as vt,b as yt,c as Ct,d as wt}from"./chunk-HROISEGA.js";import{a as re}from"./chunk-UZNQICES.js";import{b as Ft}from"./chunk-PEIXM7UF.js";import{f as st,g as dt,l as pt,o as _t}from"./chunk-IJAPQWK4.js";import"./chunk-E55ULZPU.js";import{a as Re}from"./chunk-YWZIWMCN.js";import"./chunk-6OVE7R3D.js";import{a as ht,b as St,c as Mt}from"./chunk-ZQOII4WH.js";import{a as gt}from"./chunk-DNSGJPPH.js";import{n as xt,o as Ne}from"./chunk-KNMQUUX7.js";import{E as Pe,F as Ve,I as ue,d as ut,e as ft,m as bt,n as Be,o as ae,p as j,t as Le,u as Oe,z as oe}from"./chunk-DE45EEBB.js";import{$d as De,A as W,Ab as we,Bb as ce,Cb as xe,Db as Se,Eb as y,Fb as C,Ha as s,Ic as ne,Jb as J,Jc as Me,K as ge,Kb as tt,Kc as z,L as he,Lb as Y,Mb as X,Md as Ke,N as be,Nb as x,Nc as rt,Ob as p,Oc as ke,P as w,Pa as Q,Pb as E,Pc as lt,Qb as k,Rc as D,Tb as P,U as h,Ua as S,Ub as V,V as b,Va as ve,Vb as N,W as q,Wb as ee,X as et,Xb as me,Ya as ye,Yb as nt,Za as Ce,Zd as mt,_a as u,_c as He,a as I,aa as _,ad as ct,b as K,de as Te,eb as T,ec as it,gc as at,ha as _e,hb as de,hc as G,he as ie,ia as U,ib as pe,ie as $,lc as H,le as Ee,mb as d,nb as o,ne as Ie,ob as r,od as Ze,oe as Ae,p as Je,pb as g,pc as Z,pe as R,qe as Fe,tb as A,tc as te,ub as F,v as Xe,vb as L,vc as O,wb as M,wc as ot,yb as f,zb as m}from"./chunk-GMZSMWDI.js";var Bt=`
    .p-fieldset {
        background: dt('fieldset.background');
        border: 1px solid dt('fieldset.border.color');
        border-radius: dt('fieldset.border.radius');
        color: dt('fieldset.color');
        padding: dt('fieldset.padding');
        margin: 0;
    }

    .p-fieldset-legend {
        background: dt('fieldset.legend.background');
        border-radius: dt('fieldset.legend.border.radius');
        border-width: dt('fieldset.legend.border.width');
        border-style: solid;
        border-color: dt('fieldset.legend.border.color');
        color: dt('fieldset.legend.color');
        padding: dt('fieldset.legend.padding');
        transition:
            background dt('fieldset.transition.duration'),
            color dt('fieldset.transition.duration'),
            outline-color dt('fieldset.transition.duration'),
            box-shadow dt('fieldset.transition.duration');
    }

    .p-fieldset-toggleable > .p-fieldset-legend {
        padding: 0;
    }

    .p-fieldset-toggle-button {
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        text-decoration: none;
        display: flex;
        gap: dt('fieldset.legend.gap');
        align-items: center;
        justify-content: center;
        padding: dt('fieldset.legend.padding');
        background: transparent;
        border: 0 none;
        border-radius: dt('fieldset.legend.border.radius');
        transition:
            background dt('fieldset.transition.duration'),
            color dt('fieldset.transition.duration'),
            outline-color dt('fieldset.transition.duration'),
            box-shadow dt('fieldset.transition.duration');
        outline-color: transparent;
    }

    .p-fieldset-legend-label {
        font-weight: dt('fieldset.legend.font.weight');
    }

    .p-fieldset-toggle-button:focus-visible {
        box-shadow: dt('fieldset.legend.focus.ring.shadow');
        outline: dt('fieldset.legend.focus.ring.width') dt('fieldset.legend.focus.ring.style') dt('fieldset.legend.focus.ring.color');
        outline-offset: dt('fieldset.legend.focus.ring.offset');
    }

    .p-fieldset-toggleable > .p-fieldset-legend:hover {
        color: dt('fieldset.legend.hover.color');
        background: dt('fieldset.legend.hover.background');
    }

    .p-fieldset-toggle-icon {
        color: dt('fieldset.toggle.icon.color');
        transition: color dt('fieldset.transition.duration');
    }

    .p-fieldset-toggleable > .p-fieldset-legend:hover .p-fieldset-toggle-icon {
        color: dt('fieldset.toggle.icon.hover.color');
    }

    .p-fieldset-content-container {
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-fieldset-content-wrapper {
        min-height: 0;
    }

    .p-fieldset-content {
        padding: dt('fieldset.content.padding');
    }
`;var Qt=["header"],Yt=["expandicon"],Gt=["collapseicon"],Ht=["content"],Zt=["contentWrapper"],Kt=["*",[["p-header"]]],Ut=["*","p-header"];function Jt(n,a){if(n&1&&(q(),g(0,"svg",11)),n&2){let e=m(3);x(e.cx("toggleIcon")),d("pBind",e.ptm("toggleIcon"))}}function Xt(n,a){n&1&&L(0)}function en(n,a){if(n&1&&(o(0,"span",3),u(1,Xt,1,0,"ng-container",6),r()),n&2){let e=m(3);x(e.cx("toggleIcon")),d("pBind",e.ptm("toggleIcon")),s(),d("ngTemplateOutlet",e.expandIconTemplate||e._expandIconTemplate)}}function tn(n,a){if(n&1&&(A(0),u(1,Jt,1,3,"svg",9)(2,en,2,4,"span",10),F()),n&2){let e=m(2);s(),d("ngIf",!e.expandIconTemplate&&!e._expandIconTemplate),s(),d("ngIf",e.expandIconTemplate||e._expandIconTemplate)}}function nn(n,a){if(n&1&&(q(),g(0,"svg",13)),n&2){let e=m(3);x(e.cx("toggleIcon")),d("pBind",e.ptm("toggleIcon")),T("aria-hidden",!0)}}function an(n,a){n&1&&L(0)}function on(n,a){if(n&1&&(o(0,"span",3),u(1,an,1,0,"ng-container",6),r()),n&2){let e=m(3);x(e.cx("toggleIcon")),d("pBind",e.ptm("toggleIcon")),s(),d("ngTemplateOutlet",e.collapseIconTemplate||e._collapseIconTemplate)}}function rn(n,a){if(n&1&&(A(0),u(1,nn,1,4,"svg",12)(2,on,2,4,"span",10),F()),n&2){let e=m(2);s(),d("ngIf",!e.collapseIconTemplate&&!e._collapseIconTemplate),s(),d("ngIf",e.collapseIconTemplate||e._collapseIconTemplate)}}function ln(n,a){n&1&&L(0)}function sn(n,a){if(n&1){let e=M();A(0),o(1,"button",7),f("click",function(i){h(e);let l=m();return b(l.toggle(i))})("keydown",function(i){h(e);let l=m();return b(l.onKeyDown(i))}),u(2,tn,3,2,"ng-container",8)(3,rn,3,2,"ng-container",8)(4,ln,1,0,"ng-container",6),r(),F()}if(n&2){let e=m(),t=J(4);s(),x(e.cx("toggleButton")),d("pBind",e.ptm("toggleButton")),T("id",e.id+"_header")("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)("aria-label",e.buttonAriaLabel),s(),d("ngIf",e.collapsed),s(),d("ngIf",!e.collapsed),s(),d("ngTemplateOutlet",t)}}function dn(n,a){n&1&&L(0)}function pn(n,a){if(n&1&&(o(0,"span",3),p(1),r(),ce(2,1),u(3,dn,1,0,"ng-container",6)),n&2){let e=m();x(e.cx("legendLabel")),d("pBind",e.ptm("legendLabel")),s(),E(e.legend),s(2),d("ngTemplateOutlet",e.headerTemplate||e._headerTemplate)}}function cn(n,a){n&1&&L(0)}var mn={root:({instance:n})=>["p-fieldset p-component",{"p-fieldset-toggleable":n.toggleable,"p-fieldset-collapsed":n.collapsed&&n.toggleable}],legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",contentWrapper:"p-fieldset-content-wrapper",content:"p-fieldset-content"},Lt=(()=>{class n extends Ee{name="fieldset";style=Bt;classes=mn;static \u0275fac=(()=>{let e;return function(i){return(e||(e=U(n)))(i||n)}})();static \u0275prov=ge({token:n,factory:n.\u0275fac})}return n})();var Ot=new be("FIELDSET_INSTANCE"),fe=(()=>{class n extends Ae{componentName="Fieldset";$pcFieldset=w(Ot,{optional:!0,skipSelf:!0})??void 0;_componentStyle=w(Lt);bindDirectiveInstance=w(R,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}get dataP(){return this.cn({toggleable:this.toggleable})}legend;toggleable;style;styleClass;transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";motionOptions=Z(void 0);computedMotionOptions=H(()=>I(I({},this.ptm("motion")),this.motionOptions()));collapsedChange=new _;onBeforeToggle=new _;onAfterToggle=new _;contentWrapperViewChild;_id=mt("pn_id_");get id(){return this._id}get buttonAriaLabel(){return this.legend}_collapsed;get collapsed(){return this._collapsed}set collapsed(e){this._collapsed=e}headerTemplate;expandIconTemplate;collapseIconTemplate;contentTemplate;toggle(e){this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.collapsed?this.expand():this.collapse(),e.preventDefault()}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault())}expand(){this._collapsed=!1,this.collapsedChange.emit(!1),this.updateTabIndex()}collapse(){this._collapsed=!0,this.collapsedChange.emit(!0),this.updateTabIndex()}getBlockableElement(){return this.el.nativeElement.children[0]}updateTabIndex(){this.contentWrapperViewChild&&this.contentWrapperViewChild.nativeElement.querySelectorAll("input, button, select, a, textarea, [tabindex]").forEach(t=>{this.collapsed?t.setAttribute("tabindex","-1"):t.removeAttribute("tabindex")})}onToggleDone(e){this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed})}_headerTemplate;_expandIconTemplate;_collapseIconTemplate;_contentTemplate;templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"expandicon":this._expandIconTemplate=e.template;break;case"collapseicon":this._collapseIconTemplate=e.template;break;case"content":this._contentTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=U(n)))(i||n)}})();static \u0275cmp=S({type:n,selectors:[["p-fieldset"]],contentQueries:function(t,i,l){if(t&1&&xe(l,Qt,4)(l,Yt,4)(l,Gt,4)(l,Ht,4)(l,ie,4),t&2){let c;y(c=C())&&(i.headerTemplate=c.first),y(c=C())&&(i.expandIconTemplate=c.first),y(c=C())&&(i.collapseIconTemplate=c.first),y(c=C())&&(i.contentTemplate=c.first),y(c=C())&&(i.templates=c)}},viewQuery:function(t,i){if(t&1&&Se(Zt,5),t&2){let l;y(l=C())&&(i.contentWrapperViewChild=l.first)}},inputs:{legend:"legend",toggleable:[2,"toggleable","toggleable",O],style:"style",styleClass:"styleClass",transitionOptions:"transitionOptions",motionOptions:[1,"motionOptions"],collapsed:[2,"collapsed","collapsed",O]},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[ee([Lt,{provide:Ot,useExisting:n},{provide:Ie,useExisting:n}]),ye([R]),Ce],ngContentSelectors:Ut,decls:11,vars:28,consts:[["legendContent",""],["contentWrapper",""],[3,"ngStyle","pBind"],[3,"pBind"],[4,"ngIf","ngIfElse"],["pMotionName","p-collapsible","role","region",3,"pMotionOnAfterEnter","pMotionOnAfterLeave","pBind","pMotion","pMotionOptions","id"],[4,"ngTemplateOutlet"],["tabindex","0","role","button",3,"click","keydown","pBind"],[4,"ngIf"],["data-p-icon","plus",3,"class","pBind",4,"ngIf"],[3,"class","pBind",4,"ngIf"],["data-p-icon","plus",3,"pBind"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],["data-p-icon","minus",3,"pBind"]],template:function(t,i){if(t&1&&(we(Kt),o(0,"fieldset",2)(1,"legend",3),u(2,sn,5,10,"ng-container",4)(3,pn,4,5,"ng-template",null,0,G),r(),o(5,"div",5),f("pMotionOnAfterEnter",function(c){return i.onToggleDone(c)})("pMotionOnAfterLeave",function(c){return i.onToggleDone(c)}),o(6,"div",3)(7,"div",3,1),ce(9),u(10,cn,1,0,"ng-container",6),r()()()()),t&2){let l=J(4);x(i.cn(i.cx("root"),i.styleClass)),d("ngStyle",i.style)("pBind",i.ptm("root")),T("id",i.id)("data-p",i.dataP),s(),x(i.cx("legend")),d("pBind",i.ptm("legend")),T("data-p",i.dataP),s(),d("ngIf",i.toggleable)("ngIfElse",l),s(3),x(i.cx("contentContainer")),d("pBind",i.ptm("contentContainer"))("pMotion",!i.toggleable||i.toggleable&&!i.collapsed)("pMotionOptions",i.computedMotionOptions())("id",i.id+"_content"),T("aria-labelledby",i.id+"_header")("aria-hidden",i.collapsed)("tabindex",i.collapsed?"-1":void 0),s(),x(i.cx("contentWrapper")),d("pBind",i.ptm("contentWrapper")),s(),x(i.cx("content")),d("pBind",i.ptm("content")),s(3),d("ngTemplateOutlet",i.contentTemplate||i._contentTemplate)}},dependencies:[D,z,ke,rt,gt,ht,$,Fe,R,Ve,Pe],encapsulation:2,changeDetection:0})}return n})(),se=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=ve({type:n});static \u0275inj=he({imports:[fe,$,Fe,$,Fe]})}return n})();var Vt=`
    .p-drawer {
        display: flex;
        flex-direction: column;
        transform: translate3d(0px, 0px, 0px);
        position: relative;
        transition: transform 0.3s;
        background: dt('drawer.background');
        color: dt('drawer.color');
        border-style: solid;
        border-color: dt('drawer.border.color');
        box-shadow: dt('drawer.shadow');
    }

    .p-drawer-content {
        overflow-y: auto;
        flex-grow: 1;
        padding: dt('drawer.content.padding');
    }

    .p-drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('drawer.header.padding');
    }

    .p-drawer-footer {
        padding: dt('drawer.footer.padding');
    }

    .p-drawer-title {
        font-weight: dt('drawer.title.font.weight');
        font-size: dt('drawer.title.font.size');
    }

    .p-drawer-full .p-drawer {
        transition: none;
        transform: none;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100%;
        top: 0px !important;
        left: 0px !important;
        border-width: 1px;
    }

    .p-drawer-left .p-drawer-enter-active {
        animation: p-animate-drawer-enter-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-left .p-drawer-leave-active {
        animation: p-animate-drawer-leave-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-right .p-drawer-enter-active {
        animation: p-animate-drawer-enter-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-right .p-drawer-leave-active {
        animation: p-animate-drawer-leave-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-top .p-drawer-enter-active {
        animation: p-animate-drawer-enter-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-top .p-drawer-leave-active {
        animation: p-animate-drawer-leave-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-bottom .p-drawer-enter-active {
        animation: p-animate-drawer-enter-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-bottom .p-drawer-leave-active {
        animation: p-animate-drawer-leave-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-full .p-drawer-enter-active {
        animation: p-animate-drawer-enter-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-full .p-drawer-leave-active {
        animation: p-animate-drawer-leave-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    
    .p-drawer-left .p-drawer {
        width: 20rem;
        height: 100%;
        border-inline-end-width: 1px;
    }

    .p-drawer-right .p-drawer {
        width: 20rem;
        height: 100%;
        border-inline-start-width: 1px;
    }

    .p-drawer-top .p-drawer {
        height: 10rem;
        width: 100%;
        border-block-end-width: 1px;
    }

    .p-drawer-bottom .p-drawer {
        height: 10rem;
        width: 100%;
        border-block-start-width: 1px;
    }

    .p-drawer-left .p-drawer-content,
    .p-drawer-right .p-drawer-content,
    .p-drawer-top .p-drawer-content,
    .p-drawer-bottom .p-drawer-content {
        width: 100%;
        height: 100%;
    }

    .p-drawer-open {
        display: flex;
    }

    .p-drawer-mask:dir(rtl) {
        flex-direction: row-reverse;
    }

    @keyframes p-animate-drawer-enter-left {
        from {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-left {
        to {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-right {
        from {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-right {
        to {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-top {
        from {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-top {
        to {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-bottom {
        from {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-bottom {
        to {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-full {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-drawer-leave-full {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;var un=["header"],fn=["footer"],gn=["content"],hn=["closeicon"],bn=["headless"],_n=["container"],vn=["closeButton"],yn=["*"];function Cn(n,a){n&1&&L(0)}function wn(n,a){if(n&1&&u(0,Cn,1,0,"ng-container",4),n&2){let e=m(2);d("ngTemplateOutlet",e.headlessTemplate||e._headlessTemplate)}}function xn(n,a){n&1&&L(0)}function Sn(n,a){if(n&1&&(o(0,"div",9),p(1),r()),n&2){let e=m(3);x(e.cx("title")),d("pBind",e.ptm("title")),s(),E(e.header)}}function Mn(n,a){n&1&&(q(),g(0,"svg",12)),n&2&&T("data-pc-section","closeicon")}function kn(n,a){}function Dn(n,a){n&1&&u(0,kn,0,0,"ng-template")}function Tn(n,a){if(n&1&&u(0,Mn,1,1,"svg",11)(1,Dn,1,0,null,4),n&2){let e=m(4);d("ngIf",!e.closeIconTemplate&&!e._closeIconTemplate),s(),d("ngTemplateOutlet",e.closeIconTemplate||e._closeIconTemplate)}}function En(n,a){if(n&1){let e=M();o(0,"p-button",10),f("onClick",function(i){h(e);let l=m(3);return b(l.close(i))})("keydown.enter",function(i){h(e);let l=m(3);return b(l.close(i))}),u(1,Tn,2,2,"ng-template",null,1,G),r()}if(n&2){let e=m(3);d("pt",e.ptm("pcCloseButton"))("ngClass",e.cx("pcCloseButton"))("buttonProps",e.closeButtonProps)("ariaLabel",e.ariaCloseLabel)("unstyled",e.unstyled()),T("data-pc-group-section","iconcontainer")}}function In(n,a){n&1&&L(0)}function An(n,a){n&1&&L(0)}function Fn(n,a){if(n&1&&(A(0),o(1,"div",5),u(2,An,1,0,"ng-container",4),r(),F()),n&2){let e=m(3);s(),d("pBind",e.ptm("footer"))("ngClass",e.cx("footer")),T("data-pc-section","footer"),s(),d("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}function Bn(n,a){if(n&1&&(o(0,"div",5),u(1,xn,1,0,"ng-container",4)(2,Sn,2,4,"div",6)(3,En,3,6,"p-button",7),r(),o(4,"div",5),ce(5),u(6,In,1,0,"ng-container",4),r(),u(7,Fn,3,4,"ng-container",8)),n&2){let e=m(2);d("pBind",e.ptm("header"))("ngClass",e.cx("header")),T("data-pc-section","header"),s(),d("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),s(),d("ngIf",e.header),s(),d("ngIf",e.showCloseIcon&&e.closable),s(),d("pBind",e.ptm("content"))("ngClass",e.cx("content")),T("data-pc-section","content"),s(2),d("ngTemplateOutlet",e.contentTemplate||e._contentTemplate),s(),d("ngIf",e.footerTemplate||e._footerTemplate)}}function Ln(n,a){if(n&1){let e=M();o(0,"div",3,0),f("pMotionOnBeforeEnter",function(i){h(e);let l=m();return b(l.onBeforeEnter(i))})("pMotionOnAfterLeave",function(i){h(e);let l=m();return b(l.onAfterLeave(i))})("keydown",function(i){h(e);let l=m();return b(l.onKeyDown(i))}),de(2,wn,1,1,"ng-container")(3,Bn,8,11),r()}if(n&2){let e=m();X(e.style),x(e.cn(e.cx("root"),e.styleClass)),d("pBind",e.ptm("root"))("pMotion",e.visible)("pMotionAppear",!0)("pMotionEnterActiveClass",e.$enterAnimation())("pMotionLeaveActiveClass",e.$leaveAnimation())("pMotionOptions",e.computedMotionOptions()),T("data-p",e.dataP)("data-p-open",e.visible),s(2),pe(e.headlessTemplate||e._headlessTemplate?2:3)}}var On=`
${Vt}

/** For PrimeNG **/
.p-drawer {
    position: fixed;
}

.p-drawer-left {
    top: 0;
    left: 0;
    width: 20rem;
    height: 100%;
    border-inline-end-width: 1px;
}

.p-drawer-right {
    top: 0;
    right: 0;
    width: 20rem;
    height: 100%;
    border-inline-start-width: 1px;
}

.p-drawer-top {
    top: 0;
    left: 0;
    width: 100%;
    height: 10rem;
    border-block-end-width: 1px;
}

.p-drawer-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10rem;
    border-block-start-width: 1px;
}

.p-drawer-full {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    -webkit-transition: none;
    transition: none;
}

/* Animations */
.p-drawer-enter-left {
    animation: p-animate-drawer-enter-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.p-drawer-leave-left {
    animation: p-animate-drawer-leave-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.p-drawer-enter-right {
    animation: p-animate-drawer-enter-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.p-drawer-leave-right {
    animation: p-animate-drawer-leave-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.p-drawer-enter-top {
    animation: p-animate-drawer-enter-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.p-drawer-leave-top {
    animation: p-animate-drawer-leave-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.p-drawer-enter-bottom {
    animation: p-animate-drawer-enter-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.p-drawer-leave-bottom {
    animation: p-animate-drawer-leave-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.p-drawer-enter-full {
    animation: p-animate-drawer-enter-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.p-drawer-leave-full {
    animation: p-animate-drawer-leave-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}
`,Pn={mask:({instance:n})=>["p-drawer-mask",{"p-overlay-mask p-overlay-mask-enter-active":n.modal},{"p-drawer-full":n.fullScreen()}],root:({instance:n})=>["p-drawer p-component",{"p-drawer-full":n.fullScreen(),"p-drawer-open":n.visible},`p-drawer-${n.position()}`],header:"p-drawer-header",title:"p-drawer-title",pcCloseButton:"p-drawer-close-button",content:"p-drawer-content",footer:"p-drawer-footer"},Nt=(()=>{class n extends Ee{name="drawer";style=On;classes=Pn;static \u0275fac=(()=>{let e;return function(i){return(e||(e=U(n)))(i||n)}})();static \u0275prov=ge({token:n,factory:n.\u0275fac})}return n})();var Rt=new be("DRAWER_INSTANCE"),Vn=(()=>{class n extends Ae{componentName="Drawer";$pcDrawer=w(Rt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=w(R,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}appendTo=Z(void 0);motionOptions=Z(void 0);computedMotionOptions=H(()=>I(I({},this.ptm("motion")),this.motionOptions()));blockScroll=!1;style;styleClass;ariaCloseLabel;autoZIndex=!0;baseZIndex=0;modal=!0;closeButtonProps={severity:"secondary",text:!0,rounded:!0};dismissible=!0;showCloseIcon=!0;closeOnEscape=!0;transitionOptions="150ms cubic-bezier(0, 0, 0.2, 1)";get visible(){return this._visible??!1}set visible(e){this._visible=e,this._visible&&!this.modalVisible&&(this.modalVisible=!0)}position=Z("left");fullScreen=Z(!1);$enterAnimation=H(()=>this.fullScreen()?"p-drawer-enter-full":`p-drawer-enter-${this.position()}`);$leaveAnimation=H(()=>this.fullScreen()?"p-drawer-leave-full":`p-drawer-leave-${this.position()}`);header;maskStyle;closable=!0;onShow=new _;onHide=new _;visibleChange=new _;containerViewChild;closeButtonViewChild;initialized;_visible;_position="left";_fullScreen=!1;modalVisible=!1;container;mask;maskClickListener;documentEscapeListener;animationEndListener;_componentStyle=w(Nt);onAfterViewInit(){this.initialized=!0}headerTemplate;footerTemplate;contentTemplate;closeIconTemplate;headlessTemplate;$appendTo=H(()=>this.appendTo()||this.config.overlayAppendTo());_headerTemplate;_footerTemplate;_contentTemplate;_closeIconTemplate;_headlessTemplate;templates;onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"closeicon":this._closeIconTemplate=e.template;break;case"headless":this._headlessTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}onKeyDown(e){e.code==="Escape"&&this.hide(!1)}show(){this.container?.setAttribute(this.$attrSelector,""),this.autoZIndex&&ue.set("modal",this.container,this.baseZIndex||this.config.zIndex.modal),this.modal&&this.enableModality(),this.onShow.emit({}),this.visibleChange.emit(!0)}hide(e=!0){e&&this.onHide.emit({}),this.modal&&this.disableModality()}close(e){this.hide(),this.visibleChange.emit(!1),e.preventDefault()}enableModality(){let e=this.document.querySelectorAll('[data-p-open="true"]'),t=e.length,i=t==1?String(parseInt(this.container.style.zIndex)-1):String(parseInt(e[t-1].style.zIndex)-1);if(!this.mask){if(this.mask=this.renderer.createElement("div"),this.mask){let l=`z-index: ${i};${this.getMaskStyle()}`;Ke(this.mask,"style",l),Ke(this.mask,"data-p",this.dataP),He(this.mask,this.cx("mask"))}this.dismissible&&(this.maskClickListener=this.renderer.listen(this.mask,"click",l=>{this.dismissible&&this.close(l)})),this.renderer.appendChild(this.document.body,this.mask),this.blockScroll&&ut()}}getMaskStyle(){return this.maskStyle?Object.entries(this.maskStyle).map(([e,t])=>`${e}: ${t}`).join("; "):""}disableModality(){this.mask&&(!this.$unstyled()&&ct(this.mask,"p-overlay-mask-enter-active"),!this.$unstyled()&&He(this.mask,"p-overlay-mask-leave-active"),this.animationEndListener=this.renderer.listen(this.mask,"animationend",this.destroyModal.bind(this)))}destroyModal(){this.unbindMaskClickListener(),this.mask&&this.renderer.removeChild(this.document.body,this.mask),this.blockScroll&&ft(),this.unbindAnimationEndListener(),this.mask=null}onBeforeEnter(e){this.container=e.element,this.appendContainer(),this.show(),this.closeOnEscape&&this.bindDocumentEscapeListener()}onAfterLeave(){this.hide(!1),ue.clear(this.container),this.unbindGlobalListeners(),this.modalVisible=!1,this.container=null}appendContainer(){this.$appendTo()&&this.$appendTo()!=="self"&&(this.$appendTo()==="body"?Ze(this.document.body,this.container):Ze(this.$appendTo(),this.container))}bindDocumentEscapeListener(){let e=this.el?this.el.nativeElement.ownerDocument:this.document;this.documentEscapeListener=this.renderer.listen(e,"keydown",t=>{t.which==27&&parseInt(this.container?.style.zIndex)===ue.get(this.container)&&this.close(t)})}unbindDocumentEscapeListener(){this.documentEscapeListener&&(this.documentEscapeListener(),this.documentEscapeListener=null)}unbindMaskClickListener(){this.maskClickListener&&(this.maskClickListener(),this.maskClickListener=null)}unbindGlobalListeners(){this.unbindMaskClickListener(),this.unbindDocumentEscapeListener()}unbindAnimationEndListener(){this.animationEndListener&&this.mask&&(this.animationEndListener(),this.animationEndListener=null)}onDestroy(){this.initialized=!1,this.visible&&this.modal&&this.destroyModal(),this.$appendTo()&&this.container&&this.renderer.appendChild(this.el.nativeElement,this.container),this.container&&this.autoZIndex&&ue.clear(this.container),this.container=null,this.unbindGlobalListeners(),this.unbindAnimationEndListener()}get dataP(){return this.cn({"full-screen":this.position()==="full",[this.position()]:this.position(),open:this.visible,modal:this.modal})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=U(n)))(i||n)}})();static \u0275cmp=S({type:n,selectors:[["p-drawer"]],contentQueries:function(t,i,l){if(t&1&&xe(l,un,4)(l,fn,4)(l,gn,4)(l,hn,4)(l,bn,4)(l,ie,4),t&2){let c;y(c=C())&&(i.headerTemplate=c.first),y(c=C())&&(i.footerTemplate=c.first),y(c=C())&&(i.contentTemplate=c.first),y(c=C())&&(i.closeIconTemplate=c.first),y(c=C())&&(i.headlessTemplate=c.first),y(c=C())&&(i.templates=c)}},viewQuery:function(t,i){if(t&1&&Se(_n,5)(vn,5),t&2){let l;y(l=C())&&(i.containerViewChild=l.first),y(l=C())&&(i.closeButtonViewChild=l.first)}},inputs:{appendTo:[1,"appendTo"],motionOptions:[1,"motionOptions"],blockScroll:[2,"blockScroll","blockScroll",O],style:"style",styleClass:"styleClass",ariaCloseLabel:"ariaCloseLabel",autoZIndex:[2,"autoZIndex","autoZIndex",O],baseZIndex:[2,"baseZIndex","baseZIndex",ot],modal:[2,"modal","modal",O],closeButtonProps:"closeButtonProps",dismissible:[2,"dismissible","dismissible",O],showCloseIcon:[2,"showCloseIcon","showCloseIcon",O],closeOnEscape:[2,"closeOnEscape","closeOnEscape",O],transitionOptions:"transitionOptions",visible:"visible",position:[1,"position"],fullScreen:[1,"fullScreen"],header:"header",maskStyle:"maskStyle",closable:[2,"closable","closable",O]},outputs:{onShow:"onShow",onHide:"onHide",visibleChange:"visibleChange"},features:[ee([Nt,{provide:Rt,useExisting:n},{provide:Ie,useExisting:n}]),ye([R]),Ce],ngContentSelectors:yn,decls:1,vars:1,consts:[["container",""],["icon",""],["role","complementary","pFocusTrap","",3,"pBind","pMotion","pMotionAppear","pMotionEnterActiveClass","pMotionLeaveActiveClass","pMotionOptions","class","style"],["role","complementary","pFocusTrap","",3,"pMotionOnBeforeEnter","pMotionOnAfterLeave","keydown","pBind","pMotion","pMotionAppear","pMotionEnterActiveClass","pMotionLeaveActiveClass","pMotionOptions"],[4,"ngTemplateOutlet"],[3,"pBind","ngClass"],[3,"pBind","class",4,"ngIf"],[3,"pt","ngClass","buttonProps","ariaLabel","unstyled","onClick","keydown.enter",4,"ngIf"],[4,"ngIf"],[3,"pBind"],[3,"onClick","keydown.enter","pt","ngClass","buttonProps","ariaLabel","unstyled"],["data-p-icon","times",4,"ngIf"],["data-p-icon","times"]],template:function(t,i){t&1&&(we(),de(0,Ln,4,13,"div",2)),t&2&&pe(i.modalVisible?0:-1)},dependencies:[D,ne,z,ke,ae,bt,$,R,yt,vt,Ve,Pe],encapsulation:2,changeDetection:0})}return n})(),jt=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=ve({type:n});static \u0275inj=he({imports:[Vn,$,$]})}return n})();var We=class n{busy=!1;dropdownValues=[];dropdownValue=null;isLoading=!1;specialtySelected=new _;patientApi=w(re);cdr=w(te);messageService=w(Te);ngOnInit(){this.isLoading=!0,this.patientApi.getSpecialties().pipe(W(()=>{this.isLoading=!1,this.cdr.markForCheck()})).subscribe({next:a=>{this.dropdownValues=a??[],this.cdr.markForCheck()},error:a=>{console.error("Error cargando especialidades:",a),this.messageService.add({severity:"error",summary:"No se pudieron cargar especialidades",detail:"Intenta nuevamente en unos segundos."})}})}buscar(){this.dropdownValue&&this.specialtySelected.emit(this.dropdownValue)}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=S({type:n,selectors:[["app-selector-especialidad"]],inputs:{busy:"busy"},outputs:{specialtySelected:"specialtySelected"},decls:15,vars:6,consts:[[1,"card"],[3,"show"],[1,"w-full","bg-primary","text-primary-contrast","text-center","font-semibold","py-1","mb-4","rounded-none"],["legend","1. Selecciona una Especialidad",3,"toggleable"],[1,"w-full","flex","flex-col","gap-2","sm:flex-row","sm:items-center","sm:justify-between"],[1,"w-full","flex","flex-wrap","items-stretch","gap-2","sm:flex-nowrap","sm:items-center","sm:flex-1","sm:min-w-0"],[1,"flex-1","min-w-0","sm:flex-initial","sm:min-w-0"],[1,"flex","items-center","gap-2"],[1,"pi","pi-briefcase"],["styleClass","w-full sm:w-64","icon","pi pi-chevron-down","optionLabel","name","filterPlaceholder","Buscar especialidad...","placeholder","Seleccione ..",3,"ngModelChange","ngModel","options","filter"],["label","Buscar","icon","pi pi-search","severity","success",1,"sm:w-auto",3,"click","loading"],[1,"w-full","grid","grid-cols-2","gap-2","sm:w-auto","sm:flex","sm:flex-row","sm:items-center","sm:justify-end"],["icon","pi pi-calendar","label","Consulta tus Citas","severity","success","routerLink","/appointment-list",1,"w-full","sm:w-auto"],["icon","pi pi-file","label","Consulta tus facturas","severity","success","routerLink","/invoices-list",1,"w-full","sm:w-auto"]],template:function(e,t){e&1&&(o(0,"div",0),g(1,"app-loading-overlay",1),o(2,"div",2),p(3," Agendamiento "),r(),o(4,"p-fieldset",3)(5,"div",4)(6,"div",5)(7,"p-inputgroup",6)(8,"p-inputgroup-addon",7),g(9,"i",8),r(),o(10,"p-select",9),N("ngModelChange",function(l){return V(t.dropdownValue,l)||(t.dropdownValue=l),l}),r()(),o(11,"p-button",10),f("click",function(){return t.buscar()}),r()(),o(12,"div",11),g(13,"p-button",12)(14,"p-button",13),r()()()()),e&2&&(s(),d("show",t.isLoading||t.busy),s(3),d("toggleable",!1),s(6),P("ngModel",t.dropdownValue),d("options",t.dropdownValues)("filter",!0),s(),d("loading",t.isLoading))},dependencies:[D,oe,Le,Oe,pt,dt,se,fe,je,Tt,ze,Et,Ne,xt,j,ae,Re],encapsulation:2})};var jn=n=>({"ring-[var(--primary-color)]":n});function zn(n,a){if(n&1&&(o(0,"div",13),p(1),r()),n&2){let e=a.$implicit,t=a.index,i=m();Y("text-primary",t===i.todayColumnIndex),s(),k(" ",e," ")}}function $n(n,a){if(n&1&&(A(0),o(1,"div",20)(2,"span",21),p(3),r(),o(4,"span",22),p(5),r()(),F()),n&2){let e=m(2).$implicit;s(3),k("",e.slots," tur.."),s(2),k("",e.slots," turnos disponibles")}}function Wn(n,a){n&1&&(o(0,"div",23)(1,"span",21),p(2,"No disp."),r(),o(3,"span",22),p(4,"No disponible"),r()())}function qn(n,a){if(n&1){let e=M();o(0,"div",15)(1,"button",16),f("click",function(){h(e);let i=m().$implicit,l=m();return b(l.selectDateAndOpen(i))}),o(2,"div",17)(3,"div",18),p(4),r(),u(5,$n,6,2,"ng-container",19)(6,Wn,5,0,"ng-template",null,1,G),r()()()}if(n&2){let e=J(7),t=m().$implicit,i=m();s(),tt("background",t.available?i.isSelected(t.date)?i.selectedBg:i.availableBg:null),Y("cursor-not-allowed",!t.available)("opacity-70",!t.available)("bg-surface-0",t.available)("dark:bg-surface-900",t.available)("bg-surface-100",!t.available)("dark:bg-surface-800",!t.available)("text-surface-400",!t.available)("dark:text-surface-500",!t.available)("ring-2",i.isSelected(t.date))("ring-inset",i.isSelected(t.date))("ring-green-600",i.isSelected(t.date))("dark:ring-green-400",i.isSelected(t.date))("ring-1",i.isToday(t.date)&&!i.isSelected(t.date))("ring-inset",i.isToday(t.date)&&!i.isSelected(t.date)),d("disabled",!t.available)("ngClass",nt(35,jn,i.isToday(t.date)&&!i.isSelected(t.date))),s(3),k(" ",t.date.getDate()," "),s(),d("ngIf",t.available)("ngIfElse",e)}}function Qn(n,a){n&1&&g(0,"div",15)}function Yn(n,a){if(n&1&&(A(0),u(1,qn,8,37,"div",14)(2,Qn,1,0,"ng-template",null,0,G),F()),n&2){let e=a.$implicit,t=J(3);s(),d("ngIf",e.date)("ngIfElse",t)}}var Qe=class n{specialtyId=null;loadingChange=new _;dateSelected=new _;weekDayLabels=["Lunes","Martes","Mi\xE9rcoles","Jueves","Viernes","S\xE1bado","Domingo"];availableBg="color-mix(in srgb, var(--primary-color), transparent 92%)";selectedBg="color-mix(in srgb, var(--primary-color), transparent 82%)";viewMonth=this.startOfMonth(new Date);monthCells=this.buildMonthCells(this.viewMonth);selectedDate=this.findFirstAvailableDate(this.monthCells);patientApi=w(re);cdr=w(te);monthCache=new Map;loading=!1;get todayColumnIndex(){let a=new Date().getDay();return a===0?6:a-1}get monthLabel(){let a=new Intl.DateTimeFormat("es-EC",{month:"long",year:"numeric"}).format(this.viewMonth);return a.charAt(0).toUpperCase()+a.slice(1)}nextMonth(){this.viewMonth=this.startOfMonth(new Date(this.viewMonth.getFullYear(),this.viewMonth.getMonth()+1,1)),this.monthCells=this.buildMonthCells(this.viewMonth),this.selectedDate=this.findFirstAvailableDate(this.monthCells),this.loadMonthAvailability()}prevMonth(){this.viewMonth=this.startOfMonth(new Date(this.viewMonth.getFullYear(),this.viewMonth.getMonth()-1,1)),this.monthCells=this.buildMonthCells(this.viewMonth),this.selectedDate=this.findFirstAvailableDate(this.monthCells),this.loadMonthAvailability()}ngOnChanges(a){a.specialtyId&&(this.monthCells=this.buildMonthCells(this.viewMonth),this.selectedDate=this.findFirstAvailableDate(this.monthCells),this.loadMonthAvailability())}selectDateAndOpen(a){!a.date||!a.available||(this.selectedDate=a.date,this.dateSelected.emit(this.selectedDate))}isSelected(a){return this.selectedDate?this.toYmd(a)===this.toYmd(this.selectedDate):!1}isToday(a){return this.toYmd(a)===this.toYmd(new Date)}trackByCell=(a,e)=>e.date?this.toYmd(e.date):`empty-${a}`;buildMonthCells(a){let e=this.startOfMonth(a),t=new Date(e.getFullYear(),e.getMonth()+1,0).getDate(),l=(e.getDay()+6)%7,c=[];for(let v=0;v<l;v++)c.push({date:null,available:!1,slots:0});for(let v=1;v<=t;v++){let B=new Date(e.getFullYear(),e.getMonth(),v);c.push({date:B,available:!1,slots:0})}for(;c.length%7!==0;)c.push({date:null,available:!1,slots:0});for(;c.length<42;)c.push({date:null,available:!1,slots:0});return c}findFirstAvailableDate(a){for(let e of a)if(e.date&&e.available)return e.date;return null}isDateAvailable(a){return!this.isPast(a)}isPast(a){let e=this.startOfDay(new Date);return this.startOfDay(a).getTime()<e.getTime()}startOfDay(a){let e=new Date(a);return e.setHours(0,0,0,0),e}startOfMonth(a){return new Date(a.getFullYear(),a.getMonth(),1)}toYmd(a){let e=a.getFullYear(),t=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");return`${e}-${t}-${i}`}setLoading(a){this.loading!==a&&(this.loading=a,this.loadingChange.emit(a),this.cdr.markForCheck())}getMonthKey(){let a=this.viewMonth.getFullYear(),e=String(this.viewMonth.getMonth()+1).padStart(2,"0");return`${this.specialtyId??"none"}-${a}-${e}`}loadMonthAvailability(){if(!this.specialtyId){this.setLoading(!1),this.applySlotsFromMap(new Map);return}let a=this.getMonthKey(),e=this.monthCache.get(a);if(e){this.applySlotsFromMap(e);return}let t=this.specialtyId,i=this.monthCells.filter(c=>!!c.date).map(c=>c.date).filter(c=>this.isDateAvailable(c));if(i.length===0){this.setLoading(!1);return}this.setLoading(!0);let l=i.map(c=>{let v=this.toYmd(c);return this.patientApi.getAvailability(t,v).pipe(Je(B=>{let $t=this.countAvailableSlots(B??[]);return{ymd:v,slots:$t}}))});if(l.length===0){let c=new Map;this.monthCache.set(a,c),this.applySlotsFromMap(c),this.setLoading(!1);return}Xe(l).pipe(W(()=>this.setLoading(!1))).subscribe({next:c=>{let v=new Map;for(let B of c)v.set(B.ymd,B.slots);this.monthCache.set(a,v),this.applySlotsFromMap(v)},error:c=>{console.error("Error cargando disponibilidad del mes:",c),this.cdr.markForCheck()}})}applySlotsFromMap(a){this.monthCells=this.monthCells.map(e=>{if(!e.date)return e;if(!this.isDateAvailable(e.date))return K(I({},e),{slots:0,available:!1});let t=a.get(this.toYmd(e.date))??0;return K(I({},e),{slots:t,available:t>0})}),this.selectedDate=this.findFirstAvailableDate(this.monthCells),this.cdr.markForCheck()}countAvailableSlots(a){let e=0;for(let t of a){let i=t.horarios??[];for(let l of i)(l.estado??"").toString().toLowerCase()==="disponible"&&e++}return e}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=S({type:n,selectors:[["app-calendar-custom"]],inputs:{specialtyId:"specialtyId"},outputs:{loadingChange:"loadingChange",dateSelected:"dateSelected"},features:[_e],decls:12,vars:5,consts:[["emptyCell",""],["notAvailable",""],[1,"card"],["legend","2. Selecciona una Fecha",3,"toggleable"],[1,"w-full","max-w-5xl","mx-auto"],[1,"flex","items-center","justify-between","gap-3","mb-2"],["label","< Anterior","severity","primary",3,"onClick"],[1,"text-center","font-semibold","text-lg","sm:text-xl"],["label","Siguiente >","severity","primary",3,"onClick"],[1,"grid","grid-cols-7","gap-1.5","sm:gap-2","mb-2"],["class","text-center text-[10px] sm:text-sm leading-tight font-semibold text-surface-600 dark:text-surface-300",3,"text-primary",4,"ngFor","ngForOf"],[1,"grid","grid-cols-7","gap-1.5","sm:gap-2"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"text-center","text-[10px]","sm:text-sm","leading-tight","font-semibold","text-surface-600","dark:text-surface-300"],["class","h-12 sm:h-14",4,"ngIf","ngIfElse"],[1,"h-12","sm:h-14"],["type","button",1,"w-full","h-full","rounded-none","p-1","sm:p-1.5","transition-colors","border-0","focus:outline-none","focus:ring-0","focus-visible:outline-none",3,"click","disabled","ngClass"],[1,"h-full","w-full","flex","flex-col","items-center","justify-center","text-center"],[1,"text-base","sm:text-lg","font-semibold","leading-none"],[4,"ngIf","ngIfElse"],[1,"mt-1","text-[9px]","sm:text-xs","leading-tight","text-green-600","dark:text-green-400","whitespace-nowrap"],[1,"sm:hidden"],[1,"hidden","sm:inline"],[1,"mt-1","text-[9px]","sm:text-xs","leading-tight","text-surface-500","dark:text-surface-400","whitespace-nowrap"]],template:function(e,t){e&1&&(o(0,"div",2)(1,"p-fieldset",3)(2,"div",4)(3,"div",5)(4,"p-button",6),f("onClick",function(){return t.prevMonth()}),r(),o(5,"div",7),p(6),r(),o(7,"p-button",8),f("onClick",function(){return t.nextMonth()}),r()(),o(8,"div",9),u(9,zn,2,3,"div",10),r(),o(10,"div",11),u(11,Yn,4,2,"ng-container",12),r()()()()),e&2&&(s(),d("toggleable",!1),s(5),E(t.monthLabel),s(3),d("ngForOf",t.weekDayLabels),s(2),d("ngForOf",t.monthCells)("ngForTrackBy",t.trackByCell))},dependencies:[D,ne,Me,z,j,ae,se,fe],encapsulation:2})};var Hn=()=>({width:"65vw"}),Zn=()=>({"1024px":"80vw","768px":"95vw"});function Kn(n,a){if(n&1){let e=M();o(0,"button",33),f("click",function(){let i=h(e).$implicit,l=m().$implicit,c=m();return b(c.marcarSeleccion(l,i))}),p(1),r()}if(n&2){let e=a.$implicit,t=m(2);d("disabled",e.estado==="ocupado"||e.estado==="bloqueado"||e.estado==="no_disponible")("ngClass",t.getClaseTurno(e)),s(),k(" ",e.hora," ")}}function Un(n,a){if(n&1&&(o(0,"div",20)(1,"div",21)(2,"div",22)(3,"div",23),g(4,"i",24),o(5,"span",25),p(6),r()(),o(7,"div",26),p(8," Precio: "),o(9,"span",27),p(10),r()()(),o(11,"div",28)(12,"span",29),p(13,"Dias de atenci\xF3n:"),r(),p(14),r()(),o(15,"div",30)(16,"div",31),u(17,Kn,2,3,"button",32),r()()()),n&2){let e=a.$implicit;s(6),E(e.nombre),s(4),k("$ ",e.precio),s(4),k(" ",e.dias," "),s(3),d("ngForOf",e.horarios)}}function Jn(n,a){if(n&1){let e=M();o(0,"button",34),f("click",function(){h(e);let i=m();return b(i.close())}),r(),o(1,"button",35),f("click",function(){h(e);let i=m();return b(i.confirm())}),r()}if(n&2){let e=m();s(),d("disabled",!e.citaSeleccionada)}}var Ye=class n{constructor(){}medicos=[];specialtyName=null;selectedDate=null;visible=!1;visibleChange=new _;internalVisible=!1;confirmRequested=new _;citaSeleccionada=null;ngOnChanges(a){a.visible&&(this.internalVisible=this.visible,this.visible||this.limpiarSeleccion())}getClaseTurno(a){if(a?.seleccionado)return"bg-green-700 text-white border-green-800 shadow-sm";switch(a?.estado){case"disponible":return"bg-[#b3d4f0] text-blue-900 border-blue-300 hover:bg-blue-300 hover:text-blue-900 cursor-pointer";case"ocupado":return"bg-orange-50 text-orange-800 border-orange-200 opacity-80";case"bloqueado":return"bg-red-500 text-white border-red-600 opacity-80";case"no_disponible":return"bg-surface-200 text-surface-500 border-surface-300 opacity-70";default:return"bg-surface-100 text-surface-600 border-surface-200"}}getDiaSemana(){return this.selectedDate?["Domingo","Lunes","Martes","Mi\xE9rcoles","Jueves","Viernes","S\xE1bado"][this.selectedDate.getDay()]:"\u2014"}marcarSeleccion(a,e){this.limpiarSeleccion(),e.seleccionado=!0,this.citaSeleccionada={medico:a,turno:e,fecha:this.selectedDate}}limpiarSeleccion(){this.medicos?.forEach(a=>a?.horarios?.forEach(e=>e.seleccionado=!1)),this.citaSeleccionada=null}close(){this.internalVisible=!1,this.visibleChange.emit(!1),this.limpiarSeleccion()}handleHide(){this.internalVisible=!1,this.visibleChange.emit(!1),this.limpiarSeleccion()}confirm(){let a=this.buildCheckoutData();a&&this.confirmRequested.emit(a)}buildCheckoutData(){if(!this.citaSeleccionada)return null;let a=this.selectedDate?this.selectedDate.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}):"";return{doctor:this.citaSeleccionada.medico,timeSlot:this.citaSeleccionada.turno,specialty:this.specialtyName||"CIRUG\xCDA MAXILO FACIAL",formattedDate:`${this.getDiaSemana()} ${a}`.trim()}}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=S({type:n,selectors:[["app-doctor-time-modal"]],inputs:{medicos:"medicos",specialtyName:"specialtyName",selectedDate:"selectedDate",visible:"visible"},outputs:{visibleChange:"visibleChange",confirmRequested:"confirmRequested"},features:[_e],decls:50,vars:16,consts:[["header","Citas Disponibles",3,"visibleChange","onHide","visible","breakpoints","modal","draggable","resizable"],[1,"flex","flex-col","md:flex-row","md:items-center","gap-4","mb-4","p-component","text-surface-900","dark:text-surface-0","text-sm","md:text-base"],[1,"font-semibold"],[1,"uppercase"],[1,"border","border-surface-300","dark:border-surface-600","rounded-md","overflow-hidden","p-component"],[1,"flex","text-white","font-semibold","text-sm",2,"background-color","var(--primary-color)"],[1,"w-full","md:w-1/2","p-2","border-r","border-surface-200/40","text-center"],[1,"hidden","md:block","w-1/2","p-2","text-center"],["class","flex flex-col md:flex-row border-t border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900",4,"ngFor","ngForOf"],[1,"mt-5","pt-4","text-sm","text-surface-900","dark:text-surface-0","p-component"],[1,"font-semibold","mb-3"],[1,"flex","flex-col","gap-2.5"],[1,"flex","items-center","gap-2"],[1,"w-24","font-medium","text-surface-700","dark:text-surface-300"],[1,"rounded-full","px-3","py-1","text-xs","font-semibold","bg-surface-200","text-surface-600","border","border-surface-300"],[1,"rounded-full","px-3","py-1","text-xs","font-semibold","bg-[#b3d4f0]","text-blue-900","border","border-blue-300"],[1,"rounded-full","px-3","py-1","text-xs","font-semibold","bg-orange-100","text-orange-800","border","border-orange-200"],[1,"rounded-full","px-3","py-1","text-xs","font-semibold","bg-red-500","text-white","border","border-red-600"],[1,"rounded-full","px-3","py-1","text-xs","font-semibold","bg-green-700","text-white","border","border-green-800"],["pTemplate","footer"],[1,"flex","flex-col","md:flex-row","border-t","border-surface-300","dark:border-surface-600","bg-surface-0","dark:bg-surface-900"],[1,"w-full","md:w-1/2","p-3","border-b","md:border-b-0","md:border-r","border-surface-300","dark:border-surface-600"],[1,"flex","justify-between","items-center","mb-1"],[1,"text-surface-900","dark:text-surface-0","flex","items-center","gap-2"],[1,"pi","pi-user","text-surface-700","dark:text-surface-300"],[1,"uppercase","tracking-wide"],[1,"text-surface-700","dark:text-surface-200","whitespace-nowrap"],[1,"font-semibold","text-surface-900","dark:text-surface-0"],[1,"text-[11px]","text-surface-700","dark:text-surface-300","mt-0.5"],[1,"font-bold","text-surface-800","dark:text-surface-100"],[1,"w-full","md:w-1/2","p-3"],[1,"grid","grid-cols-3","sm:grid-cols-4","gap-2"],["class","p-component rounded-full px-2 py-1.5 text-xs sm:text-sm font-semibold text-center transition-colors disabled:cursor-not-allowed border",3,"disabled","ngClass","click",4,"ngFor","ngForOf"],[1,"p-component","rounded-full","px-2","py-1.5","text-xs","sm:text-sm","font-semibold","text-center","transition-colors","disabled:cursor-not-allowed","border",3,"click","disabled","ngClass"],["pButton","","label","Cerrar","icon","pi pi-times",1,"p-button-text","p-button-secondary",3,"click"],["pButton","","icon","pi pi-check","label","Confirmar Turno",1,"p-button-primary",3,"click","disabled"]],template:function(e,t){e&1&&(o(0,"p-dialog",0),N("visibleChange",function(l){return V(t.internalVisible,l)||(t.internalVisible=l),l}),f("onHide",function(){return t.handleHide()}),o(1,"div",1)(2,"div")(3,"span",2),p(4,"Especialidad:"),r(),o(5,"span",3),p(6),r()(),o(7,"div")(8,"span",2),p(9,"Fecha:"),r(),p(10),it(11,"date"),r(),o(12,"div")(13,"span",2),p(14,"Dia:"),r(),p(15),r()(),o(16,"div",4)(17,"div",5)(18,"div",6),p(19,"M\xE9dico"),r(),o(20,"div",7),p(21,"Turnos disponibles"),r()(),u(22,Un,18,4,"div",8),r(),o(23,"div",9)(24,"div",10),p(25,"Informaci\xF3n"),r(),o(26,"div",11)(27,"div",12)(28,"span",13),p(29,"Disponibles:"),r(),o(30,"span",14),p(31,"No Disponibles"),r(),o(32,"span",15),p(33,"Disponibles"),r()(),o(34,"div",12)(35,"span",13),p(36,"Ocupado:"),r(),o(37,"span",16),p(38,"Ocupado"),r()(),o(39,"div",12)(40,"span",13),p(41,"Bloqueado:"),r(),o(42,"span",17),p(43,"Bloqueado"),r()(),o(44,"div",12)(45,"span",13),p(46,"Seleccionado:"),r(),o(47,"span",18),p(48,"Seleccionado"),r()()()(),u(49,Jn,2,1,"ng-template",19),r()),e&2&&(X(me(14,Hn)),P("visible",t.internalVisible),d("breakpoints",me(15,Zn))("modal",!0)("draggable",!1)("resizable",!1),s(6),E(t.specialtyName||"CIRUGIA MAXILO FACIAL"),s(4),k(" ",t.selectedDate?at(11,11,t.selectedDate,"yyyy-MM-dd"):"\u2014"," "),s(5),k(" ",t.getDiaSemana()),s(7),d("ngForOf",t.medicos))},dependencies:[D,ne,Me,j,Be,ie,wt,Ct,lt],encapsulation:2})};var Ge=class n{appointmentData;onBack=new _;onConfirm=new _;selectedPaymentMethod="";goBack(){this.onBack.emit()}confirmCheckout(){this.selectedPaymentMethod&&this.onConfirm.emit(this.selectedPaymentMethod)}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=S({type:n,selectors:[["app-payment-method"]],inputs:{appointmentData:"appointmentData"},outputs:{onBack:"onBack",onConfirm:"onConfirm"},decls:78,vars:27,consts:[[1,"fadein","animation-duration-500","max-w-6xl","mx-auto","w-full","p-4"],["pButton","","icon","pi pi-arrow-left","label","Volver",1,"p-button-text","p-button-secondary","mb-4","p-0",3,"click"],[1,"grid","grid-cols-1","lg:grid-cols-12","gap-6"],[1,"col-span-1","lg:col-span-8"],[1,"card","h-full","p-5","border","border-surface-200","dark:border-surface-700","shadow-sm","rounded-xl"],[1,"flex","items-start","justify-between","gap-3","flex-wrap"],[1,"text-2xl","font-bold","text-surface-900","dark:text-surface-0"],[1,"text-surface-500"],[1,"mt-4","flex","flex-col","gap-3"],["for","payCash",1,"flex","items-center","gap-3","p-4","border-1","border-surface-200","dark:border-surface-700","border-round","cursor-pointer","transition-colors","hover:bg-surface-50","dark:hover:bg-surface-800"],["name","paymentGroup","value","cash","inputId","payCash",3,"ngModelChange","ngModel"],[1,"flex","items-center","gap-3","min-w-0"],[1,"w-10","h-10","rounded-full","flex","items-center","justify-center",2,"background-color","var(--surface-100)","color","var(--primary-color)"],[1,"pi","pi-money-bill"],[1,"min-w-0"],[1,"font-semibold","text-surface-900","dark:text-surface-0"],[1,"text-sm","text-surface-500"],["for","payCard",1,"flex","items-center","gap-3","p-4","border-1","border-surface-200","dark:border-surface-700","border-round","cursor-pointer","transition-colors","hover:bg-surface-50","dark:hover:bg-surface-800"],["name","paymentGroup","value","card","inputId","payCard",3,"ngModelChange","ngModel"],[1,"pi","pi-credit-card"],["for","payInsurance",1,"flex","items-center","gap-3","p-4","border-1","border-surface-200","dark:border-surface-700","border-round","cursor-pointer","transition-colors","hover:bg-surface-50","dark:hover:bg-surface-800"],["name","paymentGroup","value","insurance","inputId","payInsurance",3,"ngModelChange","ngModel"],[1,"pi","pi-shield"],[1,"mt-5","flex","justify-end"],["pButton","","label","Confirmar y agendar","icon","pi pi-check",3,"click","disabled"],[1,"col-span-1","lg:col-span-4"],[1,"card","p-5","border","border-surface-200","dark:border-surface-700","shadow-sm","rounded-xl","sticky","top-4"],[1,"text-xl","font-bold","text-surface-900","dark:text-surface-0"],[1,"text-xs","font-semibold","uppercase","text-surface-500"],[1,"border-1","border-surface-200","dark:border-surface-700","border-round","p-3"],[1,"mt-2","flex","flex-col","gap-1","text-surface-900","dark:text-surface-0"],[1,"flex","items-center","gap-2"],[1,"pi","pi-calendar","text-primary"],[1,"font-semibold"],[1,"pi","pi-clock","text-primary"],[1,"flex","items-center","justify-between","border-t","border-surface-200","dark:border-surface-700","pt-3"],[1,"font-semibold","text-surface-700","dark:text-surface-300"]],template:function(e,t){e&1&&(o(0,"div",0)(1,"button",1),f("click",function(){return t.goBack()}),r(),o(2,"div",2)(3,"div",3)(4,"div",4)(5,"div",5)(6,"div")(7,"div",6),p(8,"Confirmaci\xF3n y pago"),r(),o(9,"div",7),p(10,"Elige tu m\xE9todo de pago para finalizar el agendamiento."),r()()(),o(11,"div",8)(12,"label",9)(13,"p-radioButton",10),N("ngModelChange",function(l){return V(t.selectedPaymentMethod,l)||(t.selectedPaymentMethod=l),l}),r(),o(14,"div",11)(15,"div",12),g(16,"i",13),r(),o(17,"div",14)(18,"div",15),p(19,"Pago en cl\xEDnica"),r(),o(20,"div",16),p(21,"Efectivo en recepci\xF3n el d\xEDa de tu cita."),r()()()(),o(22,"label",17)(23,"p-radioButton",18),N("ngModelChange",function(l){return V(t.selectedPaymentMethod,l)||(t.selectedPaymentMethod=l),l}),r(),o(24,"div",11)(25,"div",12),g(26,"i",19),r(),o(27,"div",14)(28,"div",15),p(29,"Tarjeta"),r(),o(30,"div",16),p(31,"Cr\xE9dito o d\xE9bito en la cl\xEDnica."),r()()()(),o(32,"label",20)(33,"p-radioButton",21),N("ngModelChange",function(l){return V(t.selectedPaymentMethod,l)||(t.selectedPaymentMethod=l),l}),r(),o(34,"div",11)(35,"div",12),g(36,"i",22),r(),o(37,"div",14)(38,"div",15),p(39,"Seguro privado"),r(),o(40,"div",16),p(41,"Aplican condiciones y copagos seg\xFAn cobertura."),r()()()()(),o(42,"div",23)(43,"button",24),f("click",function(){return t.confirmCheckout()}),r()()()(),o(44,"div",25)(45,"div",26)(46,"div",27),p(47,"Resumen"),r(),o(48,"div",16),p(49,"Revisa tu informaci\xF3n antes de confirmar."),r(),o(50,"div",8)(51,"div")(52,"div",28),p(53,"Especialidad"),r(),o(54,"div",15),p(55),r()(),o(56,"div")(57,"div",28),p(58,"M\xE9dico tratante"),r(),o(59,"div",15),p(60),r()(),o(61,"div",29)(62,"div",28),p(63,"Fecha y hora"),r(),o(64,"div",30)(65,"div",31),g(66,"i",32),o(67,"span",33),p(68),r()(),o(69,"div",31),g(70,"i",34),o(71,"span",33),p(72),r()()()(),o(73,"div",35)(74,"span",36),p(75,"Total"),r(),o(76,"span",6),p(77),r()()()()()()()),e&2&&(s(12),Y("border-primary",t.selectedPaymentMethod==="cash")("bg-surface-50",t.selectedPaymentMethod==="cash")("dark:bg-surface-800",t.selectedPaymentMethod==="cash"),s(),P("ngModel",t.selectedPaymentMethod),s(9),Y("border-primary",t.selectedPaymentMethod==="card")("bg-surface-50",t.selectedPaymentMethod==="card")("dark:bg-surface-800",t.selectedPaymentMethod==="card"),s(),P("ngModel",t.selectedPaymentMethod),s(9),Y("border-primary",t.selectedPaymentMethod==="insurance")("bg-surface-50",t.selectedPaymentMethod==="insurance")("dark:bg-surface-800",t.selectedPaymentMethod==="insurance"),s(),P("ngModel",t.selectedPaymentMethod),s(10),d("disabled",!t.selectedPaymentMethod),s(12),E(t.appointmentData==null?null:t.appointmentData.specialty),s(5),k(" ",t.appointmentData==null||t.appointmentData.doctor==null?null:t.appointmentData.doctor.nombre," "),s(8),E(t.appointmentData==null?null:t.appointmentData.formattedDate),s(4),E(t.appointmentData==null||t.appointmentData.timeSlot==null?null:t.appointmentData.timeSlot.hora),s(5),k(" $ ",t.appointmentData==null||t.appointmentData.doctor==null?null:t.appointmentData.doctor.precio," "))},dependencies:[D,oe,Le,Oe,j,Be,Mt,St],encapsulation:2})};var Xn=()=>({width:"400px"});function ei(n,a){if(n&1){let e=M();o(0,"app-calendar-custom",22),f("loadingChange",function(i){h(e);let l=m(2);return b(l.onCalendarioLoadingChange(i))})("dateSelected",function(i){h(e);let l=m(2);return b(l.abrirModalDoctores(i))}),r()}if(n&2){let e=m(2);d("specialtyId",(e.especialidadSeleccionada==null?null:e.especialidadSeleccionada.idEspecialidad)??null)}}function ti(n,a){if(n&1){let e=M();A(0),o(1,"app-selector-especialidad",18),f("specialtySelected",function(i){h(e);let l=m();return b(l.recibirEspecialidad(i))}),r(),o(2,"div",19),de(3,ei,1,1,"app-calendar-custom",20),r(),o(4,"app-doctor-time-modal",21),N("visibleChange",function(i){h(e);let l=m();return V(l.mostrarModal,i)||(l.mostrarModal=i),b(i)}),f("confirmRequested",function(i){h(e);let l=m();return b(l.confirmarCita(i))}),r(),F()}if(n&2){let e=m();s(),d("busy",e.cargandoCalendario),s(2),pe(e.mostrandoCalendario?3:-1),s(),P("visible",e.mostrarModal),d("medicos",e.listaMedicos)("specialtyName",e.especialidadSeleccionada==null?null:e.especialidadSeleccionada.name)("selectedDate",e.fechaSeleccionada)}}function ni(n,a){if(n&1){let e=M();A(0),o(1,"app-payment-method",23),f("onBack",function(){h(e);let i=m();return b(i.vistaActual="agendamiento")})("onConfirm",function(i){h(e);let l=m();return b(l.pagarYAgendar(i))}),r(),F()}if(n&2){let e=m();s(),d("appointmentData",e.citaConfirmada)}}var zt=class n{constructor(a,e,t,i,l,c){this.authService=a;this.patientApi=e;this.messageService=t;this.confirmationService=i;this.cdr=l;this.router=c;this.userLabel=this.authService.getDisplayLabel()}userLabel;vistaActual="agendamiento";mostrarModal=!1;especialidadSeleccionada=null;fechaSeleccionada=null;citaConfirmada=null;cargandoDisponibilidad=!1;agendando=!1;cargandoCalendario=!1;mostrandoCalendario=!1;listaMedicos=[];recibirEspecialidad(a){this.especialidadSeleccionada=a,this.mostrandoCalendario=!0,this.cargandoCalendario=!0,this.cdr.markForCheck()}onCalendarioLoadingChange(a){this.cargandoCalendario=a,this.cdr.markForCheck()}abrirModalDoctores(a){if(!this.especialidadSeleccionada?.idEspecialidad){this.messageService.add({severity:"warn",summary:"Atenci\xF3n",detail:"Primero selecciona una especialidad."});return}this.fechaSeleccionada=a,this.cargandoDisponibilidad=!0,this.listaMedicos=[],this.cdr.markForCheck();let e=this.formatLocalDateYMD(a),t=this.especialidadSeleccionada.idEspecialidad;this.patientApi.getAvailability(t,e).pipe(W(()=>{this.cargandoDisponibilidad=!1,this.cdr.markForCheck()})).subscribe({next:i=>{this.listaMedicos=(i??[]).map(l=>K(I({},l),{horarios:(l.horarios??[]).map(c=>K(I({},c),{seleccionado:!1}))})),this.mostrarModal=!0,this.cdr.markForCheck()},error:i=>{console.error("Error cargando disponibilidad:",i),this.messageService.add({severity:"error",summary:"No se pudo cargar disponibilidad",detail:"Intenta nuevamente."})}})}confirmarCita(a){this.mostrarModal=!1,this.citaConfirmada=a,this.vistaActual="pagos"}pagarYAgendar(a){if(this.agendando)return;let e=this.authService.getUserId(),t=this.fechaSeleccionada,i=this.citaConfirmada,l=this.especialidadSeleccionada?.idEspecialidad;if(!e||!t||!i||!l){this.messageService.add({severity:"warn",summary:"Atenci\xF3n",detail:"Faltan datos para agendar la cita."});return}let c=i.doctor?.id,v=i.timeSlot?.hora;if(!c||!v){this.messageService.add({severity:"warn",summary:"Atenci\xF3n",detail:"Selecciona un turno v\xE1lido."});return}this.agendando=!0,this.cdr.markForCheck(),this.patientApi.createAppointment({idPaciente:e,idMedico:c,idEspecialidad:l,fecha:this.formatLocalDateYMD(t),hora:v,metodoPago:a}).pipe(W(()=>{this.agendando=!1,this.cdr.markForCheck()})).subscribe({next:B=>{this.messageService.add({severity:"success",summary:"Cita agendada",detail:B?.mensaje??"Cita agendada correctamente."}),this.router.navigate(["/appointment-list"])},error:B=>{console.error("Error creando cita:",B),this.messageService.add({severity:"error",summary:"No se pudo agendar",detail:B?.error?.mensaje||"Intenta nuevamente."})}})}formatLocalDateYMD(a){let e=a.getFullYear(),t=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");return`${e}-${t}-${i}`}static \u0275fac=function(e){return new(e||n)(Q(_t),Q(re),Q(Te),Q(De),Q(te),Q(st))};static \u0275cmp=S({type:n,selectors:[["app-appointments-form"]],features:[ee([De])],decls:20,vars:11,consts:[[1,"relative","overflow-hidden","bg-surface-50","dark:bg-surface-950","min-h-screen"],[1,"relative","z-50"],["title","Club de Leones","logoutLink","/auth/login",3,"showActions","showThemeToggle","showUser","userLabel","showLogout"],["position","top-right"],[3,"show"],["key","citaConfirm","rejectButtonStyleClass","p-button-text"],["aria-hidden","true",1,"pointer-events-none","absolute","inset-0","z-0"],[1,"absolute","-left-40","top-10","w-[34rem]","h-16","bg-yellow-400","-rotate-45","opacity-90"],[1,"absolute","-left-56","top-24","w-[34rem]","h-16","bg-yellow-300","-rotate-45","opacity-70"],[1,"absolute","-left-56","top-20","w-[36rem]","h-1","-rotate-45",2,"background-color","var(--primary-color)"],[1,"absolute","left-14","bottom-24","w-16","h-16","rounded-full","bg-surface-200","dark:bg-surface-700","opacity-80"],[1,"absolute","right-16","bottom-36","w-20","h-20","rounded-full","opacity-70","flex","items-center","justify-center","shadow-lg",2,"background-color","var(--primary-color)"],[1,"text-yellow-400","font-serif","font-bold","text-5xl","drop-shadow-md",2,"font-family","'Times New Roman', serif"],["viewBox","0 0 600 600","fill","none",1,"absolute","-left-40","-bottom-40","w-[520px]","h-[520px]","opacity-95"],["d","M120 480C180 330 320 250 480 240","stroke","var(--primary-color)","stroke-width","26","stroke-linecap","round"],["d","M170 520C250 330 390 270 540 260","stroke","currentColor","stroke-width","26","stroke-linecap","round",1,"text-yellow-400"],[1,"relative","z-10","p-4","md:p-6","flex","flex-col","pt-16","md:pt-18"],[4,"ngIf"],[3,"specialtySelected","busy"],[1,"mt-4"],[3,"specialtyId"],[3,"visibleChange","confirmRequested","visible","medicos","specialtyName","selectedDate"],[3,"loadingChange","dateSelected","specialtyId"],[3,"onBack","onConfirm","appointmentData"]],template:function(e,t){e&1&&(o(0,"div",0)(1,"div",1),g(2,"app-header",2),r(),g(3,"p-toast",3)(4,"app-loading-overlay",4)(5,"p-confirmDialog",5),o(6,"div",6),g(7,"div",7)(8,"div",8)(9,"div",9)(10,"div",10),o(11,"div",11)(12,"span",12),p(13,"L"),r()(),q(),o(14,"svg",13),g(15,"path",14)(16,"path",15),r()(),et(),o(17,"div",16),u(18,ti,5,6,"ng-container",17)(19,ni,2,1,"ng-container",17),r()()),e&2&&(s(2),d("showActions",!0)("showThemeToggle",!1)("showUser",!0)("userLabel",t.userLabel)("showLogout",!0),s(2),d("show",t.cargandoCalendario||t.cargandoDisponibilidad||t.agendando),s(),X(me(10,Xn)),s(13),d("ngIf",t.vistaActual==="agendamiento"),s(),d("ngIf",t.vistaActual==="pagos"))},dependencies:[D,z,We,Qe,Ye,Ge,At,It,Dt,kt,oe,j,se,je,ze,Ne,jt,Ft,Re],encapsulation:2})};export{zt as AppointmentsFormComponent};
