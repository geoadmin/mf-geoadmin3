!function(){"use strict";var e=0;function St(t){return t.ol_uid||(t.ol_uid=++e)}var r="5.2.0",n=function(i){function t(t){var e="Assertion failed. See https://openlayers.org/en/"+r.split("-")[0]+"/doc/errors/#"+t+" for details.";i.call(this,e);this.code=t;this.name="AssertionError";this.message=e}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(Error),a={ADD:"add",REMOVE:"remove"},h={PROPERTYCHANGE:"propertychange"},T="function"==typeof Object.assign?Object.assign:function(t,e){var i=arguments;if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var r=Object(t),n=1,o=arguments.length;n<o;++n){var s=i[n];if(null!=s)for(var a in s)s.hasOwnProperty(a)&&(r[a]=s[a])}return r};function _(t){for(var e in t)delete t[e]}function s(t){var e=[];for(var i in t)e.push(t[i]);return e}function Ct(t){var e;for(e in t)return!1;return!e}function l(r){var t=function(t){var e=r.listener,i=r.bindTo||r.target;r.callOnce&&g(r);return e.call(i,t)};return r.boundListener=t}function u(t,e,i,r){for(var n,o=0,s=t.length;o<s;++o)if((n=t[o]).listener===e&&n.bindTo===i){r&&(n.deleteIndex=o);return n}}function c(t,e){var i=t.ol_lm;return i?i[e]:void 0}function p(t){var e=t.ol_lm;e||(e=t.ol_lm={});return e}function o(t,e){var i=c(t,e);if(i){for(var r=0,n=i.length;r<n;++r){t.removeEventListener(e,i[r].boundListener);_(i[r])}i.length=0;var o=t.ol_lm;if(o){delete o[e];0===Object.keys(o).length&&delete t.ol_lm}}}function S(t,e,i,r,n){var o=p(t),s=o[e];s||(s=o[e]=[]);var a=u(s,i,r,!1);if(a)n||(a.callOnce=!1);else{a={bindTo:r,callOnce:!!n,listener:i,target:t,type:e};t.addEventListener(e,l(a));s.push(a)}return a}function d(t,e,i,r){return S(t,e,i,r,!0)}function f(t,e,i,r){var n=c(t,e);if(n){var o=u(n,i,r,!0);o&&g(o)}}function g(t){if(t&&t.target){t.target.removeEventListener(t.type,t.boundListener);var e=c(t.target,t.type);if(e){var i="deleteIndex"in t?t.deleteIndex:e.indexOf(t);-1!==i&&e.splice(i,1);0===e.length&&o(t.target,t.type)}_(t)}}function y(t){var e=p(t);for(var i in e)o(t,i)}var t=function(){this.disposed_=!1};t.prototype.dispose=function(){if(!this.disposed_){this.disposed_=!0;this.disposeInternal()}};t.prototype.disposeInternal=function(){};function v(){return!0}function m(){return!1}function L(){}var x=function(t){this.propagationStopped;this.type=t;this.target=null};x.prototype.preventDefault=function(){this.propagationStopped=!0};x.prototype.stopPropagation=function(){this.propagationStopped=!0};function E(t){t.stopPropagation()}var i=function(t){function e(){t.call(this);this.pendingRemovals_={};this.dispatching_={};this.listeners_={}}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.addEventListener=function(t,e){var i=this.listeners_[t];i||(i=this.listeners_[t]=[]);-1===i.indexOf(e)&&i.push(e)};e.prototype.dispatchEvent=function(t){var e,i="string"==typeof t?new x(t):t,r=i.type,n=(i.target=this).listeners_[r];if(n){if(!(r in this.dispatching_)){this.dispatching_[r]=0;this.pendingRemovals_[r]=0}++this.dispatching_[r];for(var o=0,s=n.length;o<s;++o)if(!1===n[o].call(this,i)||i.propagationStopped){e=!1;break}--this.dispatching_[r];if(0===this.dispatching_[r]){var a=this.pendingRemovals_[r];delete this.pendingRemovals_[r];for(;a--;)this.removeEventListener(r,L);delete this.dispatching_[r]}return e}};e.prototype.disposeInternal=function(){y(this)};e.prototype.getListeners=function(t){return this.listeners_[t]};e.prototype.hasListener=function(t){return t?t in this.listeners_:0<Object.keys(this.listeners_).length};e.prototype.removeEventListener=function(t,e){var i=this.listeners_[t];if(i){var r=i.indexOf(e);if(t in this.pendingRemovals_){i[r]=L;++this.pendingRemovals_[t]}else{i.splice(r,1);0===i.length&&delete this.listeners_[t]}}};return e}(t),R={CHANGE:"change",CLEAR:"clear",CONTEXTMENU:"contextmenu",CLICK:"click",DBLCLICK:"dblclick",DRAGENTER:"dragenter",DRAGOVER:"dragover",DROP:"drop",ERROR:"error",KEYDOWN:"keydown",KEYPRESS:"keypress",LOAD:"load",MOUSEDOWN:"mousedown",MOUSEMOVE:"mousemove",MOUSEOUT:"mouseout",MOUSEUP:"mouseup",MOUSEWHEEL:"mousewheel",MSPOINTERDOWN:"MSPointerDown",RESIZE:"resize",TOUCHSTART:"touchstart",TOUCHMOVE:"touchmove",TOUCHEND:"touchend",WHEEL:"wheel"},C=function(t){function e(){t.call(this);this.revision_=0}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.changed=function(){++this.revision_;this.dispatchEvent(R.CHANGE)};e.prototype.getRevision=function(){return this.revision_};e.prototype.on=function(t,e){if(Array.isArray(t)){for(var i=t.length,r=new Array(i),n=0;n<i;++n)r[n]=S(this,t[n],e);return r}return S(this,t,e)};e.prototype.once=function(t,e){if(Array.isArray(t)){for(var i=t.length,r=new Array(i),n=0;n<i;++n)r[n]=d(this,t[n],e);return r}return d(this,t,e)};e.prototype.un=function(t,e){if(Array.isArray(t))for(var i=0,r=t.length;i<r;++i)f(this,t[i],e);else f(this,t,e)};return e}(i);var I=function(r){function t(t,e,i){r.call(this,t);this.key=e;this.oldValue=i}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(x),w=function(e){function t(t){e.call(this);St(this);this.values_={};void 0!==t&&this.setProperties(t)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.get=function(t){var e;this.values_.hasOwnProperty(t)&&(e=this.values_[t]);return e};t.prototype.getKeys=function(){return Object.keys(this.values_)};t.prototype.getProperties=function(){return T({},this.values_)};t.prototype.notify=function(t,e){var i;i=P(t);this.dispatchEvent(new I(i,t,e));i=h.PROPERTYCHANGE;this.dispatchEvent(new I(i,t,e))};t.prototype.set=function(t,e,i){if(i)this.values_[t]=e;else{var r=this.values_[t];r!==(this.values_[t]=e)&&this.notify(t,r)}};t.prototype.setProperties=function(t,e){for(var i in t)this.set(i,t[i],e)};t.prototype.unset=function(t,e){if(t in this.values_){var i=this.values_[t];delete this.values_[t];e||this.notify(t,i)}};return t}(C),O={};function P(t){return O.hasOwnProperty(t)?O[t]:O[t]="change:"+t}var b="length",M=function(i){function t(t,e){i.call(this,t);this.element=e}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(x),F=function(o){function t(t,e){o.call(this);var i=e||{};this.unique_=!!i.unique;this.array_=t||[];if(this.unique_)for(var r=0,n=this.array_.length;r<n;++r)this.assertUnique_(this.array_[r],r);this.updateLength_()}o&&(t.__proto__=o);((t.prototype=Object.create(o&&o.prototype)).constructor=t).prototype.clear=function(){for(;0<this.getLength();)this.pop()};t.prototype.extend=function(t){for(var e=0,i=t.length;e<i;++e)this.push(t[e]);return this};t.prototype.forEach=function(t){for(var e=this.array_,i=0,r=e.length;i<r;++i)t(e[i],i,e)};t.prototype.getArray=function(){return this.array_};t.prototype.item=function(t){return this.array_[t]};t.prototype.getLength=function(){return this.get(b)};t.prototype.insertAt=function(t,e){this.unique_&&this.assertUnique_(e);this.array_.splice(t,0,e);this.updateLength_();this.dispatchEvent(new M(a.ADD,e))};t.prototype.pop=function(){return this.removeAt(this.getLength()-1)};t.prototype.push=function(t){this.unique_&&this.assertUnique_(t);var e=this.getLength();this.insertAt(e,t);return this.getLength()};t.prototype.remove=function(t){for(var e=this.array_,i=0,r=e.length;i<r;++i)if(e[i]===t)return this.removeAt(i)};t.prototype.removeAt=function(t){var e=this.array_[t];this.array_.splice(t,1);this.updateLength_();this.dispatchEvent(new M(a.REMOVE,e));return e};t.prototype.setAt=function(t,e){var i=this.getLength();if(t<i){this.unique_&&this.assertUnique_(e,t);var r=this.array_[t];this.array_[t]=e;this.dispatchEvent(new M(a.REMOVE,r));this.dispatchEvent(new M(a.ADD,e))}else{for(var n=i;n<t;++n)this.insertAt(n,void 0);this.insertAt(t,e)}};t.prototype.updateLength_=function(){this.set(b,this.array_.length)};t.prototype.assertUnique_=function(t,e){for(var i=0,r=this.array_.length;i<r;++i)if(this.array_[i]===t&&i!==e)throw new n(58)};return t}(w);function A(t,e){if(!t)throw new n(e)}var N={BOTTOM_LEFT:"bottom-left",BOTTOM_RIGHT:"bottom-right",TOP_LEFT:"top-left",TOP_RIGHT:"top-right"},D={UNKNOWN:0,INTERSECTING:1,ABOVE:2,RIGHT:4,BELOW:8,LEFT:16};function G(t){for(var e=X(),i=0,r=t.length;i<r;++i)J(e,t[i]);return e}function k(t,e,i){if(i){i[0]=t[0]-e;i[1]=t[1]-e;i[2]=t[2]+e;i[3]=t[3]+e;return i}return[t[0]-e,t[1]-e,t[2]+e,t[3]+e]}function j(t,e){if(e){e[0]=t[0];e[1]=t[1];e[2]=t[2];e[3]=t[3];return e}return t.slice()}function U(t,e,i){var r,n;return(r=e<t[0]?t[0]-e:t[2]<e?e-t[2]:0)*r+(n=i<t[1]?t[1]-i:t[3]<i?i-t[3]:0)*n}function Y(t,e){return B(t,e[0],e[1])}function Q(t,e){return t[0]<=e[0]&&e[2]<=t[2]&&t[1]<=e[1]&&e[3]<=t[3]}function B(t,e,i){return t[0]<=e&&e<=t[2]&&t[1]<=i&&i<=t[3]}function V(t,e){var i=t[0],r=t[1],n=t[2],o=t[3],s=e[0],a=e[1],h=D.UNKNOWN;s<i?h|=D.LEFT:n<s&&(h|=D.RIGHT);a<r?h|=D.BELOW:o<a&&(h|=D.ABOVE);h===D.UNKNOWN&&(h=D.INTERSECTING);return h}function X(){return[1/0,1/0,-1/0,-1/0]}function z(t,e,i,r,n){if(n){n[0]=t;n[1]=e;n[2]=i;n[3]=r;return n}return[t,e,i,r]}function W(t){return z(1/0,1/0,-1/0,-1/0,t)}function H(t,e){var i=t[0],r=t[1];return z(i,r,i,r,e)}function K(t,e){return tt(W(e),t)}function Z(t,e,i,r,n){return et(W(n),t,e,i,r)}function $(t,e){return t[0]==e[0]&&t[2]==e[2]&&t[1]==e[1]&&t[3]==e[3]}function q(t,e){e[0]<t[0]&&(t[0]=e[0]);e[2]>t[2]&&(t[2]=e[2]);e[1]<t[1]&&(t[1]=e[1]);e[3]>t[3]&&(t[3]=e[3]);return t}function J(t,e){e[0]<t[0]&&(t[0]=e[0]);e[0]>t[2]&&(t[2]=e[0]);e[1]<t[1]&&(t[1]=e[1]);e[1]>t[3]&&(t[3]=e[1])}function tt(t,e){for(var i=0,r=e.length;i<r;++i)J(t,e[i]);return t}function et(t,e,i,r,n){for(;i<r;i+=n)rt(t,e[i],e[i+1]);return t}function it(t,e){for(var i=0,r=e.length;i<r;++i)tt(t,e[i]);return t}function rt(t,e,i){t[0]=Math.min(t[0],e);t[1]=Math.min(t[1],i);t[2]=Math.max(t[2],e);t[3]=Math.max(t[3],i)}function nt(t,e,i){var r;return(r=e.call(i,st(t)))?r:(r=e.call(i,at(t)))?r:(r=e.call(i,ft(t)))?r:(r=e.call(i,dt(t)))||!1}function ot(t){var e=0;gt(t)||(e=_t(t)*ct(t));return e}function st(t){return[t[0],t[1]]}function at(t){return[t[2],t[1]]}function ht(t){return[(t[0]+t[2])/2,(t[1]+t[3])/2]}function lt(t,e){var i;e===N.BOTTOM_LEFT?i=st(t):e===N.BOTTOM_RIGHT?i=at(t):e===N.TOP_LEFT?i=dt(t):e===N.TOP_RIGHT?i=ft(t):A(!1,13);return i}function ut(t,e,i,r,n){var o=e*r[0]/2,s=e*r[1]/2,a=Math.cos(i),h=Math.sin(i),l=o*a,u=o*h,c=s*a,p=s*h,d=t[0],f=t[1],_=d-l+p,g=d-l-p,y=d+l-p,v=d+l+p,m=f-u-c,x=f-u+c,E=f+u+c,T=f+u-c;return z(Math.min(_,g,y,v),Math.min(m,x,E,T),Math.max(_,g,y,v),Math.max(m,x,E,T),n)}function ct(t){return t[3]-t[1]}function pt(t,e,i){var r=i||[1/0,1/0,-1/0,-1/0];if(Rt(t,e)){t[0]>e[0]?r[0]=t[0]:r[0]=e[0];t[1]>e[1]?r[1]=t[1]:r[1]=e[1];t[2]<e[2]?r[2]=t[2]:r[2]=e[2];t[3]<e[3]?r[3]=t[3]:r[3]=e[3]}else W(r);return r}function dt(t){return[t[0],t[3]]}function ft(t){return[t[2],t[3]]}function _t(t){return t[2]-t[0]}function Rt(t,e){return t[0]<=e[2]&&t[2]>=e[0]&&t[1]<=e[3]&&t[3]>=e[1]}function gt(t){return t[2]<t[0]||t[3]<t[1]}function yt(t,e){if(e){e[0]=t[0];e[1]=t[1];e[2]=t[2];e[3]=t[3];return e}return t}function vt(t,e){var i=(t[2]-t[0])/2*(e-1),r=(t[3]-t[1])/2*(e-1);t[0]-=i;t[2]+=i;t[1]-=r;t[3]+=r}function mt(t,e,i){var r=!1,n=V(t,e),o=V(t,i);if(n===D.INTERSECTING||o===D.INTERSECTING)r=!0;else{var s,a,h=t[0],l=t[1],u=t[2],c=t[3],p=e[0],d=e[1],f=i[0],_=i[1],g=(_-d)/(f-p);o&D.ABOVE&&!(n&D.ABOVE)&&(r=h<=(s=f-(_-c)/g)&&s<=u);r||!(o&D.RIGHT)||n&D.RIGHT||(r=l<=(a=_-(f-u)*g)&&a<=c);r||!(o&D.BELOW)||n&D.BELOW||(r=h<=(s=f-(_-l)/g)&&s<=u);r||!(o&D.LEFT)||n&D.LEFT||(r=l<=(a=_-(f-h)*g)&&a<=c)}return r}function xt(t,e,i){var r,n,o,s=[t[0],t[1],t[0],t[3],t[2],t[1],t[2],t[3]];e(s,s,2);return r=[s[0],s[2],s[4],s[6]],n=[s[1],s[3],s[5],s[7]],o=i,z(Math.min.apply(null,r),Math.min.apply(null,n),Math.max.apply(null,r),Math.max.apply(null,n),o)}function It(t,e,i,r,n,o){for(var s=o||[],a=0,h=e;h<i;h+=r){var l=t[h],u=t[h+1];s[a++]=n[0]*l+n[2]*u+n[4];s[a++]=n[1]*l+n[3]*u+n[5]}o&&s.length!=a&&(s.length=a);return s}function Et(t,e,i,r,n,o,s){for(var a=s||[],h=Math.cos(n),l=Math.sin(n),u=o[0],c=o[1],p=0,d=e;d<i;d+=r){var f=t[d]-u,_=t[d+1]-c;a[p++]=u+f*h-_*l;a[p++]=c+f*l+_*h;for(var g=d+2;g<d+r;++g)a[p++]=t[g]}s&&a.length!=p&&(a.length=p);return a}function Tt(t,e,i,r,n,o,s,a){for(var h=a||[],l=s[0],u=s[1],c=0,p=e;p<i;p+=r){var d=t[p]-l,f=t[p+1]-u;h[c++]=l+n*d;h[c++]=u+o*f;for(var _=p+2;_<p+r;++_)h[c++]=t[_]}a&&h.length!=c&&(h.length=c);return h}function wt(t,e,i,r,n,o,s){for(var a=s||[],h=0,l=e;l<i;l+=r){a[h++]=t[l]+n;a[h++]=t[l+1]+o;for(var u=l+2;u<l+r;++u)a[h++]=t[u]}s&&a.length!=h&&(a.length=h);return a}function Lt(t,e,i){return Math.min(Math.max(t,e),i)}var Ot="cosh"in Math?Math.cosh:function(t){var e=Math.exp(t);return(e+1/e)/2};function Pt(t){A(0<t,29);return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function bt(t,e,i,r,n,o){var s=n-i,a=o-r;if(0!==s||0!==a){var h=((t-i)*s+(e-r)*a)/(s*s+a*a);if(1<h){i=n;r=o}else if(0<h){i+=s*h;r+=a*h}}return Mt(t,e,i,r)}function Mt(t,e,i,r){var n=i-t,o=r-e;return n*n+o*o}function Ft(t){for(var e=t.length,i=0;i<e;i++){for(var r=i,n=Math.abs(t[i][i]),o=i+1;o<e;o++){var s=Math.abs(t[o][i]);if(n<s){n=s;r=o}}if(0===n)return null;var a=t[r];t[r]=t[i];t[i]=a;for(var h=i+1;h<e;h++)for(var l=-t[h][i]/t[i][i],u=i;u<e+1;u++)i==u?t[h][u]=0:t[h][u]+=l*t[i][u]}for(var c=new Array(e),p=e-1;0<=p;p--){c[p]=t[p][e]/t[p][p];for(var d=p-1;0<=d;d--)t[d][e]-=t[d][p]*c[p]}return c}function At(t){return 180*t/Math.PI}function Nt(t){return t*Math.PI/180}function Dt(t,e){var i=t%e;return i*e<0?i+e:i}function Gt(t,e,i){return t+i*(e-t)}var kt={POINT:"Point",LINE_STRING:"LineString",LINEAR_RING:"LinearRing",POLYGON:"Polygon",MULTI_POINT:"MultiPoint",MULTI_LINE_STRING:"MultiLineString",MULTI_POLYGON:"MultiPolygon",GEOMETRY_COLLECTION:"GeometryCollection",CIRCLE:"Circle"},jt=6371008.8;function Ut(t,e,i){var r=i||jt,n=Nt(t[1]),o=Nt(e[1]),s=(o-n)/2,a=Nt(e[0]-t[0])/2,h=Math.sin(s)*Math.sin(s)+Math.sin(a)*Math.sin(a)*Math.cos(n)*Math.cos(o);return 2*r*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))}function Yt(t,e){for(var i=0,r=0,n=t.length;r<n-1;++r)i+=Ut(t[r],t[r+1],e);return i}function Bt(t,e){for(var i=0,r=t.length,n=t[r-1][0],o=t[r-1][1],s=0;s<r;s++){var a=t[s][0],h=t[s][1];i+=Nt(a-n)*(2+Math.sin(Nt(o))+Math.sin(Nt(h)));n=a;o=h}return i*e*e/2}function Vt(t,e,i,r){var n=r||jt,o=Nt(t[1]),s=Nt(t[0]),a=e/n,h=Math.asin(Math.sin(o)*Math.cos(a)+Math.cos(o)*Math.sin(a)*Math.cos(i));return[At(s+Math.atan2(Math.sin(i)*Math.sin(a)*Math.cos(o),Math.cos(a)-Math.sin(o)*Math.sin(h))),At(h)]}var Xt={DEGREES:"degrees",FEET:"ft",METERS:"m",PIXELS:"pixels",TILE_PIXELS:"tile-pixels",USFEET:"us-ft"},zt={};zt[Xt.DEGREES]=2*Math.PI*6370997/360;zt[Xt.FEET]=.3048;zt[Xt.METERS]=1;zt[Xt.USFEET]=1200/3937;var Wt=function(t){this.code_=t.code;this.units_=t.units;this.extent_=void 0!==t.extent?t.extent:null;this.worldExtent_=void 0!==t.worldExtent?t.worldExtent:null;this.axisOrientation_=void 0!==t.axisOrientation?t.axisOrientation:"enu";this.global_=void 0!==t.global&&t.global;this.canWrapX_=!(!this.global_||!this.extent_);this.getPointResolutionFunc_=t.getPointResolution;this.defaultTileGrid_=null;this.metersPerUnit_=t.metersPerUnit};Wt.prototype.canWrapX=function(){return this.canWrapX_};Wt.prototype.getCode=function(){return this.code_};Wt.prototype.getExtent=function(){return this.extent_};Wt.prototype.getUnits=function(){return this.units_};Wt.prototype.getMetersPerUnit=function(){return this.metersPerUnit_||zt[this.units_]};Wt.prototype.getWorldExtent=function(){return this.worldExtent_};Wt.prototype.getAxisOrientation=function(){return this.axisOrientation_};Wt.prototype.isGlobal=function(){return this.global_};Wt.prototype.setGlobal=function(t){this.global_=t;this.canWrapX_=!(!t||!this.extent_)};Wt.prototype.getDefaultTileGrid=function(){return this.defaultTileGrid_};Wt.prototype.setDefaultTileGrid=function(t){this.defaultTileGrid_=t};Wt.prototype.setExtent=function(t){this.extent_=t;this.canWrapX_=!(!this.global_||!t)};Wt.prototype.setWorldExtent=function(t){this.worldExtent_=t};Wt.prototype.setGetPointResolution=function(t){this.getPointResolutionFunc_=t};Wt.prototype.getPointResolutionFunc=function(){return this.getPointResolutionFunc_};var Ht=6378137,Kt=Math.PI*Ht,Zt=[-Kt,-Kt,Kt,Kt],qt=[-180,-85,180,85],Jt=function(e){function t(t){e.call(this,{code:t,units:Xt.METERS,extent:Zt,global:!0,worldExtent:qt,getPointResolution:function(t,e){return t/Ot(e[1]/Ht)}})}e&&(t.__proto__=e);return(t.prototype=Object.create(e&&e.prototype)).constructor=t}(Wt),Qt=[new Jt("EPSG:3857"),new Jt("EPSG:102100"),new Jt("EPSG:102113"),new Jt("EPSG:900913"),new Jt("urn:ogc:def:crs:EPSG:6.18:3:3857"),new Jt("urn:ogc:def:crs:EPSG::3857"),new Jt("http://www.opengis.net/gml/srs/epsg.xml#3857")];function $t(t,e,i){var r=t.length,n=1<i?i:2,o=e;void 0===o&&(o=2<n?t.slice():new Array(r));for(var s=Kt,a=0;a<r;a+=n){o[a]=s*t[a]/180;var h=Ht*Math.log(Math.tan(Math.PI*(t[a+1]+90)/360));s<h?h=s:h<-s&&(h=-s);o[a+1]=h}return o}function te(t,e,i){var r=t.length,n=1<i?i:2,o=e;void 0===o&&(o=2<n?t.slice():new Array(r));for(var s=0;s<r;s+=n){o[s]=180*t[s]/Kt;o[s+1]=360*Math.atan(Math.exp(t[s+1]/Ht))/Math.PI-90}return o}var ee=[-180,-90,180,90],ie=6378137*Math.PI/180,re=function(i){function t(t,e){i.call(this,{code:t,units:Xt.DEGREES,extent:ee,axisOrientation:e,global:!0,metersPerUnit:ie,worldExtent:ee})}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(Wt),ne=[new re("CRS:84"),new re("EPSG:4326","neu"),new re("urn:ogc:def:crs:EPSG::4326","neu"),new re("urn:ogc:def:crs:EPSG:6.6:4326","neu"),new re("urn:ogc:def:crs:OGC:1.3:CRS84"),new re("urn:ogc:def:crs:OGC:2:84"),new re("http://www.opengis.net/gml/srs/epsg.xml#4326","neu"),new re("urn:x-ogc:def:crs:EPSG:4326","neu")],oe={};function se(){oe={}}function ae(t){return oe[t]||null}function he(t,e){oe[t]=e}var le={};function ue(){le={}}function ce(t,e,i){var r=t.getCode(),n=e.getCode();r in le||(le[r]={});le[r][n]=i}function pe(t,e){var i;t in le&&e in le[t]&&(i=le[t][e]);return i}function de(t,e,i){var r;if(void 0!==e){for(var n=0,o=t.length;n<o;++n)e[n]=t[n];r=e}else r=t.slice();return r}function fe(t,e,i){if(void 0!==e&&t!==e){for(var r=0,n=t.length;r<n;++r)e[r]=t[r];t=e}return t}function _e(t){he(t.getCode(),t);ce(t,t,de)}function ge(t){t.forEach(_e)}function ye(t){var e=null;if(t instanceof Wt)e=t;else if("string"==typeof t){e=ae(t)}return e}function ve(t,e,i,r){var n,o=(t=ye(t)).getPointResolutionFunc();if(o)n=o(e,i);else{if(t.getUnits()==Xt.DEGREES&&!r||r==Xt.DEGREES)n=e;else{var s=Re(t,ye("EPSG:4326")),a=[i[0]-e/2,i[1],i[0]+e/2,i[1],i[0],i[1]-e/2,i[0],i[1]+e/2];n=(Ut((a=s(a,a,2)).slice(0,2),a.slice(2,4))+Ut(a.slice(4,6),a.slice(6,8)))/2;var h=r?zt[r]:t.getMetersPerUnit();void 0!==h&&(n/=h)}}return n}function me(t){ge(t);t.forEach(function(e){t.forEach(function(t){e!==t&&ce(e,t,de)})})}function xe(t,i,r,n){t.forEach(function(e){i.forEach(function(t){ce(e,t,r);ce(t,e,n)})})}function Ee(t,e){return t?"string"==typeof t?ye(t):t:ye(e)}function Te(l){return function(t,e,i){for(var r=t.length,n=void 0!==i?i:2,o=void 0!==e?e:new Array(r),s=0;s<r;s+=n){var a=l([t[s],t[s+1]]);o[s]=a[0];o[s+1]=a[1];for(var h=n-1;2<=h;--h)o[s+h]=t[s+h]}return o}}function Se(t,e,i,r){var n=ye(t),o=ye(e);ce(n,o,Te(i));ce(o,n,Te(r))}function Ce(t,e){if(t===e)return!0;var i=t.getUnits()===e.getUnits();return t.getCode()===e.getCode()?i:Re(t,e)===de&&i}function Re(t,e){var i=pe(t.getCode(),e.getCode());i||(i=fe);return i}function Ie(t,e){return Re(ye(t),ye(e))}function we(t,e,i){return Ie(e,i)(t,void 0,t.length)}function Le(t,e,i){return xt(t,Ie(e,i))}function Oe(){me(Qt);me(ne);xe(ne,Qt,$t,te)}Oe();var Pe=new Array(6);function be(){return[1,0,0,1,0,0]}function Me(t){return Ae(t,1,0,0,1,0,0)}function Fe(t,e){var i=t[0],r=t[1],n=t[2],o=t[3],s=t[4],a=t[5],h=e[0],l=e[1],u=e[2],c=e[3],p=e[4],d=e[5];t[0]=i*h+n*l;t[1]=r*h+o*l;t[2]=i*u+n*c;t[3]=r*u+o*c;t[4]=i*p+n*d+s;t[5]=r*p+o*d+a;return t}function Ae(t,e,i,r,n,o,s){t[0]=e;t[1]=i;t[2]=r;t[3]=n;t[4]=o;t[5]=s;return t}function Ne(t,e){t[0]=e[0];t[1]=e[1];t[2]=e[2];t[3]=e[3];t[4]=e[4];t[5]=e[5];return t}function De(t,e){var i=e[0],r=e[1];e[0]=t[0]*i+t[2]*r+t[4];e[1]=t[1]*i+t[3]*r+t[5];return e}function Ge(t,e){var i=Math.cos(e),r=Math.sin(e);return Fe(t,Ae(Pe,i,r,-r,i,0,0))}function ke(t,e,i){return Fe(t,Ae(Pe,e,0,0,i,0,0))}function je(t,e,i){return Fe(t,Ae(Pe,1,0,0,1,e,i))}function Ue(t,e,i,r,n,o,s,a){var h=Math.sin(o),l=Math.cos(o);t[0]=r*l;t[1]=n*h;t[2]=-r*h;t[3]=n*l;t[4]=s*r*l-a*r*h+e;t[5]=s*n*h+a*n*l+i;return t}function Ye(t){var e=Be(t);A(0!==e,32);var i=t[0],r=t[1],n=t[2],o=t[3],s=t[4],a=t[5];t[0]=o/e;t[1]=-r/e;t[2]=-n/e;t[3]=i/e;t[4]=(n*a-o*s)/e;t[5]=-(i*a-r*s)/e;return t}function Be(t){return t[0]*t[3]-t[1]*t[2]}var Ve=[1,0,0,1,0,0],Xe=function(t){function e(){t.call(this);this.extent_=[1/0,1/0,-1/0,-1/0];this.extentRevision_=-1;this.simplifiedGeometryCache={};this.simplifiedGeometryMaxMinSquaredTolerance=0;this.simplifiedGeometryRevision=0}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.clone=function(){};e.prototype.closestPointXY=function(t,e,i,r){};e.prototype.getClosestPoint=function(t,e){var i=e||[NaN,NaN];this.closestPointXY(t[0],t[1],i,1/0);return i};e.prototype.intersectsCoordinate=function(t){return this.containsXY(t[0],t[1])};e.prototype.computeExtent=function(t){};e.prototype.getExtent=function(t){if(this.extentRevision_!=this.getRevision()){this.extent_=this.computeExtent(this.extent_);this.extentRevision_=this.getRevision()}return yt(this.extent_,t)};e.prototype.rotate=function(t,e){};e.prototype.scale=function(t,e,i){};e.prototype.simplify=function(t){return this.getSimplifiedGeometry(t*t)};e.prototype.getSimplifiedGeometry=function(t){};e.prototype.getType=function(){};e.prototype.applyTransform=function(t){};e.prototype.intersectsExtent=function(t){};e.prototype.translate=function(t,e){};e.prototype.transform=function(s,a){var t=(s=ye(s)).getUnits()==Xt.TILE_PIXELS?function(t,e,i){var r=s.getExtent(),n=s.getWorldExtent(),o=ct(n)/ct(r);Ue(Ve,n[0],n[3],o,-o,0,0,0);It(t,0,t.length,i,Ve,e);return Ie(s,a)(t,e,i)}:Ie(s,a);this.applyTransform(t);return this};return e}(w);Xe.prototype.containsXY=m;var ze=/^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i,We=/^([a-z]*)$/i;function He(t){return"string"==typeof t?t:$e(t)}var Ke,Ze,qe=(Ke={},Ze=0,function(t){var e;if(Ke.hasOwnProperty(t))e=Ke[t];else{if(1024<=Ze){var i=0;for(var r in Ke)if(0==(3&i++)){delete Ke[r];--Ze}}e=function(t){var e,i,r,n,o;We.exec(t)&&(t=function(t){var e=document.createElement("div");e.style.color=t;if(""===e.style.color)return"";document.body.appendChild(e);var i=getComputedStyle(e).color;document.body.removeChild(e);return i}(t));if(ze.exec(t)){var s,a=t.length-1;s=a<=4?1:2;var h=4===a||8===a;e=parseInt(t.substr(1+0*s,s),16);i=parseInt(t.substr(1+1*s,s),16);r=parseInt(t.substr(1+2*s,s),16);n=h?parseInt(t.substr(1+3*s,s),16):255;if(1==s){e=(e<<4)+e;i=(i<<4)+i;r=(r<<4)+r;h&&(n=(n<<4)+n)}o=[e,i,r,n/255]}else if(0==t.indexOf("rgba("))Qe(o=t.slice(5,-1).split(",").map(Number));else if(0==t.indexOf("rgb(")){(o=t.slice(4,-1).split(",").map(Number)).push(1);Qe(o)}else A(!1,14);return o}(t);Ke[t]=e;++Ze}return e});function Je(t){return Array.isArray(t)?t:qe(t)}function Qe(t){t[0]=Lt(t[0]+.5|0,0,255);t[1]=Lt(t[1]+.5|0,0,255);t[2]=Lt(t[2]+.5|0,0,255);t[3]=Lt(t[3],0,1);return t}function $e(t){var e=t[0];e!=(0|e)&&(e=e+.5|0);var i=t[1];i!=(0|i)&&(i=i+.5|0);var r=t[2];r!=(0|r)&&(r=r+.5|0);return"rgba("+e+","+i+","+r+","+(void 0===t[3]?1:t[3])+")"}function ti(t){return ei(t)?t:$e(t)}function ei(t){return"string"==typeof t||t instanceof CanvasPattern||t instanceof CanvasGradient}function ii(t,e){var i=document.createElement("canvas");t&&(i.width=t);e&&(i.height=e);return i.getContext("2d")}function ri(t){var e=t.offsetWidth,i=getComputedStyle(t);return e+=parseInt(i.marginLeft,10)+parseInt(i.marginRight,10)}function ni(t){var e=t.offsetHeight,i=getComputedStyle(t);return e+=parseInt(i.marginTop,10)+parseInt(i.marginBottom,10)}function oi(t,e){var i=e.parentNode;i&&i.replaceChild(t,e)}function si(t){return t&&t.parentNode?t.parentNode.removeChild(t):null}function ai(t){for(;t.lastChild;)t.removeChild(t.lastChild)}var hi=34962,li=5126,ui=6408,ci=9729,pi=10242,di=10243,fi=3553,_i=33071,gi=36160,yi=["experimental-webgl","webgl","webkit-3d","moz-webgl"];function vi(t,e){for(var i=yi.length,r=0;r<i;++r)try{var n=t.getContext(yi[r],e);if(n)return n}catch(t){}return null}var mi,xi;if("undefined"!=typeof window&&"WebGLRenderingContext"in window)try{var Ei=vi(document.createElement("canvas"),{failIfMajorPerformanceCaveat:!0});if(Ei){mi=Ei.getParameter(Ei.MAX_TEXTURE_SIZE);xi=Ei.getSupportedExtensions()}}catch(t){}var Ti,Si,Ci="undefined"!=typeof navigator?navigator.userAgent.toLowerCase():"",Ri=-1!==Ci.indexOf("firefox"),Ii=-1!==Ci.indexOf("safari")&&-1==Ci.indexOf("chrom"),wi=-1!==Ci.indexOf("webkit")&&-1==Ci.indexOf("edge"),Li=-1!==Ci.indexOf("macintosh"),Oi=window.devicePixelRatio||1,Pi=function(){var t=!1;try{t=!!document.createElement("canvas").getContext("2d").setLineDash}catch(t){}return t}(),bi="geolocation"in navigator,Mi="ontouchstart"in window,Fi="PointerEvent"in window,Ai=!!navigator.msPointerEnabled,Ni={IDLE:0,LOADING:1,LOADED:2,ERROR:3},Di="ol-hidden",Gi="ol-selectable",ki="ol-unselectable",ji="ol-unsupported",Ui="ol-control",Yi="ol-collapsed",Bi=(Si={},function(t){Ti||(Ti=document.createElement("div").style);if(!(t in Si)){Ti.font=t;var e=Ti.fontFamily;Ti.font="";if(!e)return null;Si[t]=e.split(/,\s?/)}return Si[t]}),Vi=function(e){function t(t){e.call(this);this.highWaterMark=void 0!==t?t:2048;this.count_=0;this.entries_={};this.oldest_=null;this.newest_=null}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.canExpireCache=function(){return this.getCount()>this.highWaterMark};t.prototype.clear=function(){this.count_=0;this.entries_={};this.oldest_=null;this.newest_=null;this.dispatchEvent(R.CLEAR)};t.prototype.containsKey=function(t){return this.entries_.hasOwnProperty(t)};t.prototype.forEach=function(t,e){for(var i=this.oldest_;i;){t.call(e,i.value_,i.key_,this);i=i.newer}};t.prototype.get=function(t){var e=this.entries_[t];A(void 0!==e,15);if(e===this.newest_)return e.value_;if(e===this.oldest_){this.oldest_=this.oldest_.newer;this.oldest_.older=null}else{e.newer.older=e.older;e.older.newer=e.newer}e.newer=null;e.older=this.newest_;this.newest_.newer=e;return(this.newest_=e).value_};t.prototype.remove=function(t){var e=this.entries_[t];A(void 0!==e,15);if(e===this.newest_){this.newest_=e.older;this.newest_&&(this.newest_.newer=null)}else if(e===this.oldest_){this.oldest_=e.newer;this.oldest_&&(this.oldest_.older=null)}else{e.newer.older=e.older;e.older.newer=e.newer}delete this.entries_[t];--this.count_;return e.value_};t.prototype.getCount=function(){return this.count_};t.prototype.getKeys=function(){var t,e=new Array(this.count_),i=0;for(t=this.newest_;t;t=t.older)e[i++]=t.key_;return e};t.prototype.getValues=function(){var t,e=new Array(this.count_),i=0;for(t=this.newest_;t;t=t.older)e[i++]=t.value_;return e};t.prototype.peekLast=function(){return this.oldest_.value_};t.prototype.peekLastKey=function(){return this.oldest_.key_};t.prototype.peekFirstKey=function(){return this.newest_.key_};t.prototype.pop=function(){var t=this.oldest_;delete this.entries_[t.key_];t.newer&&(t.newer.older=null);this.oldest_=t.newer;this.oldest_||(this.newest_=null);--this.count_;return t.value_};t.prototype.replace=function(t,e){this.get(t);this.entries_[t].value_=e};t.prototype.set=function(t,e){A(!(t in this.entries_),16);var i={key_:t,newer:null,older:this.newest_,value_:e};this.newest_?this.newest_.newer=i:this.oldest_=i;this.newest_=i;this.entries_[t]=i;++this.count_};t.prototype.setSize=function(t){this.highWaterMark=t};t.prototype.prune=function(){for(;this.canExpireCache();)this.pop()};return t}(i),Xi="10px sans-serif",zi=[0,0,0,1],Wi="round",Hi=[],Ki="round",Zi=[0,0,0,1],qi="center",Ji="middle",Qi=[0,0,0,0],$i=new Vi,tr={},er=null,ir={},rr=function(){var o,h,s=60,a=tr,l="32px ",u=["monospace","serif"],c=u.length,p="wmytzilWMYTZIL@#/&?$%10";function d(t){for(var e=nr(),i=100;i<=700;i+=300){for(var r=i+" ",n=!0,o=0;o<c;++o){var s=u[o];e.font=r+l+s;h=e.measureText(p).width;if(t!=s){e.font=r+l+t+","+s;var a=e.measureText(p).width;n=n&&a!=h}}if(n)return!0}return!1}function f(){var t=!0;for(var e in a)if(a[e]<s)if(d(e)){a[e]=s;_(ir);er=null;$i.clear()}else{++a[e];t=!1}if(t){clearInterval(o);o=void 0}}return function(t){var e=Bi(t);if(e)for(var i=0,r=e.length;i<r;++i){var n=e[i];if(!(n in a)){a[n]=s;d(n)||void(a[n]=0)===o&&(o=setInterval(f,32))}}}}();function nr(){er||(er=ii(1,1));return er}var or,sr,ar=(sr=ir,function(t){var e=sr[t];if(null==e){if(!or){(or=document.createElement("span")).textContent="M";or.style.margin=or.style.padding="0 !important";or.style.position="absolute !important";or.style.left="-99999px !important"}or.style.font=t;document.body.appendChild(or);e=sr[t]=or.offsetHeight;document.body.removeChild(or)}return e});function hr(t,e){var i=nr();t!=i.font&&(i.font=t);return i.measureText(e).width}function lr(t,e,i,r){if(0!==e){t.translate(i,r);t.rotate(e);t.translate(-i,-r)}}var ur=[1,0,0,1,0,0];function cr(t,e,i,r,n,o,s,a,h,l,u){var c;if(1!=i){c=t.globalAlpha;t.globalAlpha=c*i}e&&t.setTransform.apply(t,e);t.drawImage(r,n,o,s,a,h,l,s*u,a*u);c&&(t.globalAlpha=c);e&&t.setTransform.apply(t,ur)}var pr=function(t){this.opacity_=t.opacity;this.rotateWithView_=t.rotateWithView;this.rotation_=t.rotation;this.scale_=t.scale};pr.prototype.getOpacity=function(){return this.opacity_};pr.prototype.getRotateWithView=function(){return this.rotateWithView_};pr.prototype.getRotation=function(){return this.rotation_};pr.prototype.getScale=function(){return this.scale_};pr.prototype.getSnapToPixel=function(){return!1};pr.prototype.getAnchor=function(){};pr.prototype.getImage=function(t){};pr.prototype.getHitDetectionImage=function(t){};pr.prototype.getImageState=function(){};pr.prototype.getImageSize=function(){};pr.prototype.getHitDetectionImageSize=function(){};pr.prototype.getOrigin=function(){};pr.prototype.getSize=function(){};pr.prototype.setOpacity=function(t){this.opacity_=t};pr.prototype.setRotateWithView=function(t){this.rotateWithView_=t};pr.prototype.setRotation=function(t){this.rotation_=t};pr.prototype.setScale=function(t){this.scale_=t};pr.prototype.setSnapToPixel=function(t){};pr.prototype.listenImageChange=function(t,e){};pr.prototype.load=function(){};pr.prototype.unlistenImageChange=function(t,e){};var dr=function(i){function e(t){var e=void 0!==t.rotateWithView&&t.rotateWithView;i.call(this,{opacity:1,rotateWithView:e,rotation:void 0!==t.rotation?t.rotation:0,scale:1});this.checksums_=null;this.canvas_=null;this.hitDetectionCanvas_=null;this.fill_=void 0!==t.fill?t.fill:null;this.origin_=[0,0];this.points_=t.points;this.radius_=void 0!==t.radius?t.radius:t.radius1;this.radius2_=t.radius2;this.angle_=void 0!==t.angle?t.angle:0;this.stroke_=void 0!==t.stroke?t.stroke:null;this.anchor_=null;this.size_=null;this.imageSize_=null;this.hitDetectionImageSize_=null;this.atlasManager_=t.atlasManager;this.render_(this.atlasManager_)}i&&(e.__proto__=i);((e.prototype=Object.create(i&&i.prototype)).constructor=e).prototype.clone=function(){var t=new e({fill:this.getFill()?this.getFill().clone():void 0,points:this.getPoints(),radius:this.getRadius(),radius2:this.getRadius2(),angle:this.getAngle(),stroke:this.getStroke()?this.getStroke().clone():void 0,rotation:this.getRotation(),rotateWithView:this.getRotateWithView(),atlasManager:this.atlasManager_});t.setOpacity(this.getOpacity());t.setScale(this.getScale());return t};e.prototype.getAnchor=function(){return this.anchor_};e.prototype.getAngle=function(){return this.angle_};e.prototype.getFill=function(){return this.fill_};e.prototype.getHitDetectionImage=function(t){return this.hitDetectionCanvas_};e.prototype.getImage=function(t){return this.canvas_};e.prototype.getImageSize=function(){return this.imageSize_};e.prototype.getHitDetectionImageSize=function(){return this.hitDetectionImageSize_};e.prototype.getImageState=function(){return Ni.LOADED};e.prototype.getOrigin=function(){return this.origin_};e.prototype.getPoints=function(){return this.points_};e.prototype.getRadius=function(){return this.radius_};e.prototype.getRadius2=function(){return this.radius2_};e.prototype.getSize=function(){return this.size_};e.prototype.getStroke=function(){return this.stroke_};e.prototype.listenImageChange=function(t,e){};e.prototype.load=function(){};e.prototype.unlistenImageChange=function(t,e){};e.prototype.render_=function(t){var e,i,r="",n="",o=0,s=null,a=0,h=0;if(this.stroke_){null===(i=this.stroke_.getColor())&&(i=Zi);i=ti(i);void 0===(h=this.stroke_.getWidth())&&(h=1);s=this.stroke_.getLineDash();a=this.stroke_.getLineDashOffset();if(!Pi){s=null;a=0}void 0===(n=this.stroke_.getLineJoin())&&(n=Ki);void 0===(r=this.stroke_.getLineCap())&&(r=Wi);void 0===(o=this.stroke_.getMiterLimit())&&(o=10)}var l=2*(this.radius_+h)+1,u={strokeStyle:i,strokeWidth:h,size:l,lineCap:r,lineDash:s,lineDashOffset:a,lineJoin:n,miterLimit:o};if(void 0===t){var c=ii(l,l);this.canvas_=c.canvas;e=l=this.canvas_.width;this.draw_(u,c,0,0);this.createHitDetectionCanvas_(u)}else{l=Math.round(l);var p,d=!this.fill_;d&&(p=this.drawHitDetectionCanvas_.bind(this,u));var f=this.getChecksum(),_=t.add(f,l,l,this.draw_.bind(this,u),p);this.canvas_=_.image;this.origin_=[_.offsetX,_.offsetY];e=_.image.width;if(d){this.hitDetectionCanvas_=_.hitImage;this.hitDetectionImageSize_=[_.hitImage.width,_.hitImage.height]}else{this.hitDetectionCanvas_=this.canvas_;this.hitDetectionImageSize_=[e,e]}}this.anchor_=[l/2,l/2];this.size_=[l,l];this.imageSize_=[e,e]};e.prototype.draw_=function(t,e,i,r){var n,o,s;e.setTransform(1,0,0,1,0,0);e.translate(i,r);e.beginPath();var a=this.points_;if(a===1/0)e.arc(t.size/2,t.size/2,this.radius_,0,2*Math.PI,!0);else{var h=void 0!==this.radius2_?this.radius2_:this.radius_;h!==this.radius_&&(a*=2);for(n=0;n<=a;n++){o=2*n*Math.PI/a-Math.PI/2+this.angle_;s=n%2==0?this.radius_:h;e.lineTo(t.size/2+s*Math.cos(o),t.size/2+s*Math.sin(o))}}if(this.fill_){var l=this.fill_.getColor();null===l&&(l=zi);e.fillStyle=ti(l);e.fill()}if(this.stroke_){e.strokeStyle=t.strokeStyle;e.lineWidth=t.strokeWidth;if(t.lineDash){e.setLineDash(t.lineDash);e.lineDashOffset=t.lineDashOffset}e.lineCap=t.lineCap;e.lineJoin=t.lineJoin;e.miterLimit=t.miterLimit;e.stroke()}e.closePath()};e.prototype.createHitDetectionCanvas_=function(t){this.hitDetectionImageSize_=[t.size,t.size];if(this.fill_)this.hitDetectionCanvas_=this.canvas_;else{var e=ii(t.size,t.size);this.hitDetectionCanvas_=e.canvas;this.drawHitDetectionCanvas_(t,e,0,0)}};e.prototype.drawHitDetectionCanvas_=function(t,e,i,r){e.setTransform(1,0,0,1,0,0);e.translate(i,r);e.beginPath();var n=this.points_;if(n===1/0)e.arc(t.size/2,t.size/2,this.radius_,0,2*Math.PI,!0);else{var o,s,a,h=void 0!==this.radius2_?this.radius2_:this.radius_;h!==this.radius_&&(n*=2);for(o=0;o<=n;o++){a=2*o*Math.PI/n-Math.PI/2+this.angle_;s=o%2==0?this.radius_:h;e.lineTo(t.size/2+s*Math.cos(a),t.size/2+s*Math.sin(a))}}e.fillStyle=zi;e.fill();if(this.stroke_){e.strokeStyle=t.strokeStyle;e.lineWidth=t.strokeWidth;if(t.lineDash){e.setLineDash(t.lineDash);e.lineDashOffset=t.lineDashOffset}e.stroke()}e.closePath()};e.prototype.getChecksum=function(){var t=this.stroke_?this.stroke_.getChecksum():"-",e=this.fill_?this.fill_.getChecksum():"-";if(!this.checksums_||t!=this.checksums_[1]||e!=this.checksums_[2]||this.radius_!=this.checksums_[3]||this.radius2_!=this.checksums_[4]||this.angle_!=this.checksums_[5]||this.points_!=this.checksums_[6]){var i="r"+t+e+(void 0!==this.radius_?this.radius_.toString():"-")+(void 0!==this.radius2_?this.radius2_.toString():"-")+(void 0!==this.angle_?this.angle_.toString():"-")+(void 0!==this.points_?this.points_.toString():"-");this.checksums_=[i,t,e,this.radius_,this.radius2_,this.angle_,this.points_]}return this.checksums_[0]};return e}(pr),fr=function(i){function e(t){var e=t||{};i.call(this,{points:1/0,fill:e.fill,radius:e.radius,stroke:e.stroke,atlasManager:e.atlasManager})}i&&(e.__proto__=i);((e.prototype=Object.create(i&&i.prototype)).constructor=e).prototype.clone=function(){var t=new e({fill:this.getFill()?this.getFill().clone():void 0,stroke:this.getStroke()?this.getStroke().clone():void 0,radius:this.getRadius(),atlasManager:this.atlasManager_});t.setOpacity(this.getOpacity());t.setScale(this.getScale());return t};e.prototype.setRadius=function(t){this.radius_=t;this.render_(this.atlasManager_)};return e}(dr),_r=function(t){var e=t||{};this.color_=void 0!==e.color?e.color:null;this.checksum_=void 0};_r.prototype.clone=function(){var t=this.getColor();return new _r({color:t&&t.slice?t.slice():t||void 0})};_r.prototype.getColor=function(){return this.color_};_r.prototype.setColor=function(t){this.color_=t;this.checksum_=void 0};_r.prototype.getChecksum=function(){void 0===this.checksum_&&(this.color_ instanceof CanvasPattern||this.color_ instanceof CanvasGradient?this.checksum_=St(this.color_).toString():this.checksum_="f"+(this.color_?He(this.color_):"-"));return this.checksum_};var gr=function(t){var e=t||{};this.color_=void 0!==e.color?e.color:null;this.lineCap_=e.lineCap;this.lineDash_=void 0!==e.lineDash?e.lineDash:null;this.lineDashOffset_=e.lineDashOffset;this.lineJoin_=e.lineJoin;this.miterLimit_=e.miterLimit;this.width_=e.width;this.checksum_=void 0};gr.prototype.clone=function(){var t=this.getColor();return new gr({color:t&&t.slice?t.slice():t||void 0,lineCap:this.getLineCap(),lineDash:this.getLineDash()?this.getLineDash().slice():void 0,lineDashOffset:this.getLineDashOffset(),lineJoin:this.getLineJoin(),miterLimit:this.getMiterLimit(),width:this.getWidth()})};gr.prototype.getColor=function(){return this.color_};gr.prototype.getLineCap=function(){return this.lineCap_};gr.prototype.getLineDash=function(){return this.lineDash_};gr.prototype.getLineDashOffset=function(){return this.lineDashOffset_};gr.prototype.getLineJoin=function(){return this.lineJoin_};gr.prototype.getMiterLimit=function(){return this.miterLimit_};gr.prototype.getWidth=function(){return this.width_};gr.prototype.setColor=function(t){this.color_=t;this.checksum_=void 0};gr.prototype.setLineCap=function(t){this.lineCap_=t;this.checksum_=void 0};gr.prototype.setLineDash=function(t){this.lineDash_=t;this.checksum_=void 0};gr.prototype.setLineDashOffset=function(t){this.lineDashOffset_=t;this.checksum_=void 0};gr.prototype.setLineJoin=function(t){this.lineJoin_=t;this.checksum_=void 0};gr.prototype.setMiterLimit=function(t){this.miterLimit_=t;this.checksum_=void 0};gr.prototype.setWidth=function(t){this.width_=t;this.checksum_=void 0};gr.prototype.getChecksum=function(){if(void 0===this.checksum_){this.checksum_="s";this.color_?"string"==typeof this.color_?this.checksum_+=this.color_:this.checksum_+=St(this.color_).toString():this.checksum_+="-";this.checksum_+=","+(void 0!==this.lineCap_?this.lineCap_.toString():"-")+","+(this.lineDash_?this.lineDash_.toString():"-")+","+(void 0!==this.lineDashOffset_?this.lineDashOffset_:"-")+","+(void 0!==this.lineJoin_?this.lineJoin_:"-")+","+(void 0!==this.miterLimit_?this.miterLimit_.toString():"-")+","+(void 0!==this.width_?this.width_.toString():"-")}return this.checksum_};var yr=function(t){var e=t||{};this.geometry_=null;this.geometryFunction_=Tr;void 0!==e.geometry&&this.setGeometry(e.geometry);this.fill_=void 0!==e.fill?e.fill:null;this.image_=void 0!==e.image?e.image:null;this.renderer_=void 0!==e.renderer?e.renderer:null;this.stroke_=void 0!==e.stroke?e.stroke:null;this.text_=void 0!==e.text?e.text:null;this.zIndex_=e.zIndex};yr.prototype.clone=function(){var t=this.getGeometry();t&&t.clone&&(t=t.clone());return new yr({geometry:t,fill:this.getFill()?this.getFill().clone():void 0,image:this.getImage()?this.getImage().clone():void 0,stroke:this.getStroke()?this.getStroke().clone():void 0,text:this.getText()?this.getText().clone():void 0,zIndex:this.getZIndex()})};yr.prototype.getRenderer=function(){return this.renderer_};yr.prototype.setRenderer=function(t){this.renderer_=t};yr.prototype.getGeometry=function(){return this.geometry_};yr.prototype.getGeometryFunction=function(){return this.geometryFunction_};yr.prototype.getFill=function(){return this.fill_};yr.prototype.setFill=function(t){this.fill_=t};yr.prototype.getImage=function(){return this.image_};yr.prototype.setImage=function(t){this.image_=t};yr.prototype.getStroke=function(){return this.stroke_};yr.prototype.setStroke=function(t){this.stroke_=t};yr.prototype.getText=function(){return this.text_};yr.prototype.setText=function(t){this.text_=t};yr.prototype.getZIndex=function(){return this.zIndex_};yr.prototype.setGeometry=function(e){"function"==typeof e?this.geometryFunction_=e:"string"==typeof e?this.geometryFunction_=function(t){return t.get(e)}:e?void 0!==e&&(this.geometryFunction_=function(){return e}):this.geometryFunction_=Tr;this.geometry_=e};yr.prototype.setZIndex=function(t){this.zIndex_=t};function vr(t){var e;if("function"==typeof t)e=t;else{var i;if(Array.isArray(t))i=t;else{A(t instanceof yr,41);i=[t]}e=function(){return i}}return e}var mr=null;function xr(t,e){if(!mr){var i=new _r({color:"rgba(255,255,255,0.4)"}),r=new gr({color:"#3399CC",width:1.25});mr=[new yr({image:new fr({fill:i,stroke:r,radius:5}),fill:i,stroke:r})]}return mr}function Er(){var t={},e=[255,255,255,1],i=[0,153,255,1];t[kt.POLYGON]=[new yr({fill:new _r({color:[255,255,255,.5]})})];t[kt.MULTI_POLYGON]=t[kt.POLYGON];t[kt.LINE_STRING]=[new yr({stroke:new gr({color:e,width:5})}),new yr({stroke:new gr({color:i,width:3})})];t[kt.MULTI_LINE_STRING]=t[kt.LINE_STRING];t[kt.CIRCLE]=t[kt.POLYGON].concat(t[kt.LINE_STRING]);t[kt.POINT]=[new yr({image:new fr({radius:6,fill:new _r({color:i}),stroke:new gr({color:e,width:1.5})}),zIndex:1/0})];t[kt.MULTI_POINT]=t[kt.POINT];t[kt.GEOMETRY_COLLECTION]=t[kt.POLYGON].concat(t[kt.LINE_STRING],t[kt.POINT]);return t}function Tr(t){return t.getGeometry()}var Sr=function(r){function n(t){r.call(this);this.id_=void 0;this.geometryName_="geometry";this.style_=null;this.styleFunction_=void 0;this.geometryChangeKey_=null;S(this,P(this.geometryName_),this.handleGeometryChanged_,this);if(void 0!==t)if(t instanceof Xe||!t){var e=t;this.setGeometry(e)}else{var i=t;this.setProperties(i)}}r&&(n.__proto__=r);((n.prototype=Object.create(r&&r.prototype)).constructor=n).prototype.clone=function(){var t=new n(this.getProperties());t.setGeometryName(this.getGeometryName());var e=this.getGeometry();e&&t.setGeometry(e.clone());var i=this.getStyle();i&&t.setStyle(i);return t};n.prototype.getGeometry=function(){return this.get(this.geometryName_)};n.prototype.getId=function(){return this.id_};n.prototype.getGeometryName=function(){return this.geometryName_};n.prototype.getStyle=function(){return this.style_};n.prototype.getStyleFunction=function(){return this.styleFunction_};n.prototype.handleGeometryChange_=function(){this.changed()};n.prototype.handleGeometryChanged_=function(){if(this.geometryChangeKey_){g(this.geometryChangeKey_);this.geometryChangeKey_=null}var t=this.getGeometry();t&&(this.geometryChangeKey_=S(t,R.CHANGE,this.handleGeometryChange_,this));this.changed()};n.prototype.setGeometry=function(t){this.set(this.geometryName_,t)};n.prototype.setStyle=function(t){this.style_=t;this.styleFunction_=t?Cr(t):void 0;this.changed()};n.prototype.setId=function(t){this.id_=t;this.changed()};n.prototype.setGeometryName=function(t){f(this,P(this.geometryName_),this.handleGeometryChanged_,this);this.geometryName_=t;S(this,P(this.geometryName_),this.handleGeometryChanged_,this);this.handleGeometryChanged_()};return n}(w);function Cr(t){if("function"==typeof t)return t;var e;if(Array.isArray(t))e=t;else{A(t instanceof yr,41);e=[t]}return function(){return e}}var Rr={ACCURACY:"accuracy",ACCURACY_GEOMETRY:"accuracyGeometry",ALTITUDE:"altitude",ALTITUDE_ACCURACY:"altitudeAccuracy",HEADING:"heading",POSITION:"position",PROJECTION:"projection",SPEED:"speed",TRACKING:"tracking",TRACKING_OPTIONS:"trackingOptions"};function Ir(t,e,i){for(var r,n,o=i||wr,s=0,a=t.length,h=!1;s<a;)if((n=+o(t[r=s+(a-s>>1)],e))<0)s=r+1;else{a=r;h=!n}return h?s:~s}function wr(t,e){return e<t?1:t<e?-1:0}function Lr(t,e){return 0<=t.indexOf(e)}function Or(t,e,i){var r,n=t.length;if(t[0]<=e)return 0;if(e<=t[n-1])return n-1;if(0<i){for(r=1;r<n;++r)if(t[r]<e)return r-1}else if(i<0){for(r=1;r<n;++r)if(t[r]<=e)return r}else for(r=1;r<n;++r){if(t[r]==e)return r;if(t[r]<e)return t[r-1]-e<e-t[r]?r-1:r}return n-1}function Pr(t,e,i){for(;e<i;){var r=t[e];t[e]=t[i];t[i]=r;++e;--i}}function br(t,e){for(var i=Array.isArray(e)?e:[e],r=i.length,n=0;n<r;n++)t[t.length]=i[n]}function Mr(t,e){var i=t.indexOf(e),r=-1<i;r&&t.splice(i,1);return r}function Fr(t,e){for(var i,r=t.length>>>0,n=0;n<r;n++)if(e(i=t[n],n,t))return i;return null}function Ar(t,e){var i=t.length;if(i!==e.length)return!1;for(var r=0;r<i;r++)if(t[r]!==e[r])return!1;return!0}function Nr(t,i){var e,r=t.length,n=Array(t.length);for(e=0;e<r;e++)n[e]={index:e,value:t[e]};n.sort(function(t,e){return i(t.value,e.value)||t.index-e.index});for(e=0;e<t.length;e++)t[e]=n[e].value}function Dr(i,r){var n;return!i.every(function(t,e){return!r(t,n=e,i)})?n:-1}function Gr(r,t,n){var o=t||wr;return r.every(function(t,e){if(0===e)return!0;var i=o(r[e-1],t);return!(0<i||n&&0===i)})}var kr={XY:"XY",XYZ:"XYZ",XYM:"XYM",XYZM:"XYZM"},jr=function(t){function e(){t.call(this);this.layout=kr.XY;this.stride=2;this.flatCoordinates=null}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.computeExtent=function(t){return Z(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t)};e.prototype.getCoordinates=function(){};e.prototype.getFirstCoordinate=function(){return this.flatCoordinates.slice(0,this.stride)};e.prototype.getFlatCoordinates=function(){return this.flatCoordinates};e.prototype.getLastCoordinate=function(){return this.flatCoordinates.slice(this.flatCoordinates.length-this.stride)};e.prototype.getLayout=function(){return this.layout};e.prototype.getSimplifiedGeometry=function(t){if(this.simplifiedGeometryRevision!=this.getRevision()){_(this.simplifiedGeometryCache);this.simplifiedGeometryMaxMinSquaredTolerance=0;this.simplifiedGeometryRevision=this.getRevision()}if(t<0||0!==this.simplifiedGeometryMaxMinSquaredTolerance&&t<=this.simplifiedGeometryMaxMinSquaredTolerance)return this;var e=t.toString();if(this.simplifiedGeometryCache.hasOwnProperty(e))return this.simplifiedGeometryCache[e];var i=this.getSimplifiedGeometryInternal(t);if(i.getFlatCoordinates().length<this.flatCoordinates.length)return this.simplifiedGeometryCache[e]=i;this.simplifiedGeometryMaxMinSquaredTolerance=t;return this};e.prototype.getSimplifiedGeometryInternal=function(t){return this};e.prototype.getStride=function(){return this.stride};e.prototype.setFlatCoordinates=function(t,e){this.stride=Ur(t);this.layout=t;this.flatCoordinates=e};e.prototype.setCoordinates=function(t,e){};e.prototype.setLayout=function(t,e,i){var r;if(t)r=Ur(t);else{for(var n=0;n<i;++n){if(0===e.length){this.layout=kr.XY;this.stride=2;return}e=e[0]}t=function(t){var e;2==t?e=kr.XY:3==t?e=kr.XYZ:4==t&&(e=kr.XYZM);return e}(r=e.length)}this.layout=t;this.stride=r};e.prototype.applyTransform=function(t){if(this.flatCoordinates){t(this.flatCoordinates,this.flatCoordinates,this.stride);this.changed()}};e.prototype.rotate=function(t,e){var i=this.getFlatCoordinates();if(i){var r=this.getStride();Et(i,0,i.length,r,t,e,i);this.changed()}};e.prototype.scale=function(t,e,i){var r=e;void 0===r&&(r=t);var n=i;n||(n=ht(this.getExtent()));var o=this.getFlatCoordinates();if(o){var s=this.getStride();Tt(o,0,o.length,s,t,r,n,o);this.changed()}};e.prototype.translate=function(t,e){var i=this.getFlatCoordinates();if(i){var r=this.getStride();wt(i,0,i.length,r,t,e,i);this.changed()}};return e}(Xe);function Ur(t){var e;t==kr.XY?e=2:t==kr.XYZ||t==kr.XYM?e=3:t==kr.XYZM&&(e=4);return e}jr.prototype.containsXY=m;function Yr(t,e,i){var r=t.getFlatCoordinates();if(r){var n=t.getStride();return It(r,0,r.length,n,e,i)}return null}function Br(t,e,i,r){for(var n=0,o=t[i-r],s=t[i-r+1];e<i;e+=r){var a=t[e],h=t[e+1];n+=s*a-o*h;o=a;s=h}return n/2}function Vr(t,e,i,r){for(var n=0,o=0,s=i.length;o<s;++o){var a=i[o];n+=Br(t,e,a,r);e=a}return n}function Xr(t,e,i,r){for(var n=0,o=0,s=i.length;o<s;++o){var a=i[o];n+=Vr(t,e,a,r);e=a[a.length-1]}return n}function zr(t,e,i,r,n,o,s){var a,h=t[e],l=t[e+1],u=t[i]-h,c=t[i+1]-l;if(0===u&&0===c)a=e;else{var p=((n-h)*u+(o-l)*c)/(u*u+c*c);if(1<p)a=i;else{if(0<p){for(var d=0;d<r;++d)s[d]=Gt(t[e+d],t[i+d],p);s.length=r;return}a=e}}for(var f=0;f<r;++f)s[f]=t[a+f];s.length=r}function Wr(t,e,i,r,n){var o=t[e],s=t[e+1];for(e+=r;e<i;e+=r){var a=t[e],h=t[e+1],l=Mt(o,s,a,h);n<l&&(n=l);o=a;s=h}return n}function Hr(t,e,i,r,n){for(var o=0,s=i.length;o<s;++o){var a=i[o];n=Wr(t,e,a,r,n);e=a}return n}function Kr(t,e,i,r,n){for(var o=0,s=i.length;o<s;++o){var a=i[o];n=Hr(t,e,a,r,n);e=a[a.length-1]}return n}function Zr(t,e,i,r,n,o,s,a,h,l,u){if(e==i)return l;var c,p;if(0===n){if((p=Mt(s,a,t[e],t[e+1]))<l){for(c=0;c<r;++c)h[c]=t[e+c];h.length=r;return p}return l}for(var d=u||[NaN,NaN],f=e+r;f<i;){zr(t,f-r,f,r,s,a,d);if((p=Mt(s,a,d[0],d[1]))<l){l=p;for(c=0;c<r;++c)h[c]=d[c];f+=h.length=r}else f+=r*Math.max((Math.sqrt(p)-Math.sqrt(l))/n|0,1)}if(o){zr(t,i-r,e,r,s,a,d);if((p=Mt(s,a,d[0],d[1]))<l){l=p;for(c=0;c<r;++c)h[c]=d[c];h.length=r}}return l}function qr(t,e,i,r,n,o,s,a,h,l,u){for(var c=u||[NaN,NaN],p=0,d=i.length;p<d;++p){var f=i[p];l=Zr(t,e,f,r,n,o,s,a,h,l,c);e=f}return l}function Jr(t,e,i,r,n,o,s,a,h,l,u){for(var c=u||[NaN,NaN],p=0,d=i.length;p<d;++p){var f=i[p];l=qr(t,e,f,r,n,o,s,a,h,l,c);e=f[f.length-1]}return l}function Qr(t,e,i,r){for(var n=0,o=i.length;n<o;++n)t[e++]=i[n];return e}function $r(t,e,i,r){for(var n=0,o=i.length;n<o;++n)for(var s=i[n],a=0;a<r;++a)t[e++]=s[a];return e}function tn(t,e,i,r,n){for(var o=n||[],s=0,a=0,h=i.length;a<h;++a){var l=$r(t,e,i[a],r);e=o[s++]=l}o.length=s;return o}function en(t,e,i,r,n){for(var o=n||[],s=0,a=0,h=i.length;a<h;++a){var l=tn(t,e,i[a],r,o[s]);e=(o[s++]=l)[l.length-1]}o.length=s;return o}function rn(t,e,i,r,n){for(var o=void 0!==n?n:[],s=0,a=e;a<i;a+=r)o[s++]=t.slice(a,a+r);o.length=s;return o}function nn(t,e,i,r,n){for(var o=void 0!==n?n:[],s=0,a=0,h=i.length;a<h;++a){var l=i[a];o[s++]=rn(t,e,l,r,o[s]);e=l}o.length=s;return o}function on(t,e,i,r,n){for(var o=void 0!==n?n:[],s=0,a=0,h=i.length;a<h;++a){var l=i[a];o[s++]=nn(t,e,l,r,o[s]);e=l[l.length-1]}o.length=s;return o}function sn(t,e,i,r,n,o,s){var a=(i-e)/r;if(a<3){for(;e<i;e+=r){o[s++]=t[e];o[s++]=t[e+1]}return s}var h=new Array(a);h[0]=1;h[a-1]=1;for(var l=[e,i-r],u=0;0<l.length;){for(var c=l.pop(),p=l.pop(),d=0,f=t[p],_=t[p+1],g=t[c],y=t[c+1],v=p+r;v<c;v+=r){var m=bt(t[v],t[v+1],f,_,g,y);if(d<m){u=v;d=m}}if(n<d){h[(u-e)/r]=1;p+r<u&&l.push(p,u);u+r<c&&l.push(u,c)}}for(var x=0;x<a;++x)if(h[x]){o[s++]=t[e+x*r];o[s++]=t[e+x*r+1]}return s}function an(t,e,i,r,n,o,s,a){for(var h=0,l=i.length;h<l;++h){var u=i[h];s=sn(t,e,u,r,n,o,s);a.push(s);e=u}return s}function hn(t,e,i,r,n,o,s){if(i<=e+r){for(;e<i;e+=r){o[s++]=t[e];o[s++]=t[e+1]}return s}var a=t[e],h=t[e+1],l=o[s++]=a,u=o[s++]=h;for(e+=r;e<i;e+=r)if(Mt(a,h,l=t[e],u=t[e+1])>n){a=o[s++]=l;h=o[s++]=u}if(l!=a||u!=h){o[s++]=l;o[s++]=u}return s}function ln(t,e){return e*Math.round(t/e)}function un(t,e,i,r,n,o,s){if(e==i)return s;var a,h,l=ln(t[e],n),u=ln(t[e+1],n);e+=r;o[s++]=l;o[s++]=u;do{a=ln(t[e],n);h=ln(t[e+1],n);if((e+=r)==i){o[s++]=a;o[s++]=h;return s}}while(a==l&&h==u);for(;e<i;){var c=ln(t[e],n),p=ln(t[e+1],n);e+=r;if(c!=a||p!=h){var d=a-l,f=h-u,_=c-l,g=p-u;if(d*g==f*_&&(d<0&&_<d||d==_||0<d&&d<_)&&(f<0&&g<f||f==g||0<f&&f<g)){a=c;h=p}else{l=o[s++]=a;u=o[s++]=h;a=c;h=p}}}o[s++]=a;o[s++]=h;return s}function cn(t,e,i,r,n,o,s,a){for(var h=0,l=i.length;h<l;++h){var u=i[h];s=un(t,e,u,r,n,o,s);a.push(s);e=u}return s}function pn(t,e,i,r,n,o,s,a){for(var h=0,l=i.length;h<l;++h){var u=i[h],c=[];s=cn(t,e,u,r,n,o,s,c);a.push(c);e=u[u.length-1]}return s}var dn=function(i){function r(t,e){i.call(this);this.maxDelta_=-1;this.maxDeltaRevision_=-1;void 0===e||Array.isArray(t[0])?this.setCoordinates(t,e):this.setFlatCoordinates(e,t)}i&&(r.__proto__=i);((r.prototype=Object.create(i&&i.prototype)).constructor=r).prototype.clone=function(){return new r(this.flatCoordinates.slice(),this.layout)};r.prototype.closestPointXY=function(t,e,i,r){if(r<U(this.getExtent(),t,e))return r;if(this.maxDeltaRevision_!=this.getRevision()){this.maxDelta_=Math.sqrt(Wr(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,0));this.maxDeltaRevision_=this.getRevision()}return Zr(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,this.maxDelta_,!0,t,e,i,r)};r.prototype.getArea=function(){return Br(this.flatCoordinates,0,this.flatCoordinates.length,this.stride)};r.prototype.getCoordinates=function(){return rn(this.flatCoordinates,0,this.flatCoordinates.length,this.stride)};r.prototype.getSimplifiedGeometryInternal=function(t){var e=[];e.length=sn(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t,e,0);return new r(e,kr.XY)};r.prototype.getType=function(){return kt.LINEAR_RING};r.prototype.intersectsExtent=function(t){};r.prototype.setCoordinates=function(t,e){this.setLayout(e,t,1);this.flatCoordinates||(this.flatCoordinates=[]);this.flatCoordinates.length=$r(this.flatCoordinates,0,t,this.stride);this.changed()};return r}(jr),fn=function(i){function t(t,e){i.call(this);this.setCoordinates(t,e)}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.clone=function(){return new t(this.flatCoordinates.slice(),this.layout)};t.prototype.closestPointXY=function(t,e,i,r){var n=this.flatCoordinates,o=Mt(t,e,n[0],n[1]);if(o<r){for(var s=this.stride,a=0;a<s;++a)i[a]=n[a];i.length=s;return o}return r};t.prototype.getCoordinates=function(){return this.flatCoordinates?this.flatCoordinates.slice():[]};t.prototype.computeExtent=function(t){return H(this.flatCoordinates,t)};t.prototype.getType=function(){return kt.POINT};t.prototype.intersectsExtent=function(t){return B(t,this.flatCoordinates[0],this.flatCoordinates[1])};t.prototype.setCoordinates=function(t,e){this.setLayout(e,t,0);this.flatCoordinates||(this.flatCoordinates=[]);this.flatCoordinates.length=Qr(this.flatCoordinates,0,t,this.stride);this.changed()};return t}(jr);function _n(e,i,r,n,t){return!nt(t,function(t){return!gn(e,i,r,n,t[0],t[1])})}function gn(t,e,i,r,n,o){for(var s=0,a=t[i-r],h=t[i-r+1];e<i;e+=r){var l=t[e],u=t[e+1];h<=o?o<u&&0<(l-a)*(o-h)-(n-a)*(u-h)&&s++:u<=o&&(l-a)*(o-h)-(n-a)*(u-h)<0&&s--;a=l;h=u}return 0!==s}function yn(t,e,i,r,n,o){if(0===i.length)return!1;if(!gn(t,e,i[0],r,n,o))return!1;for(var s=1,a=i.length;s<a;++s)if(gn(t,i[s-1],i[s],r,n,o))return!1;return!0}function vn(t,e,i,r,n,o){if(0===i.length)return!1;for(var s=0,a=i.length;s<a;++s){var h=i[s];if(yn(t,e,h,r,n,o))return!0;e=h[h.length-1]}return!1}function mn(t,e,i,r,n,o,s){for(var a,h,l,u,c,p,d,f=n[o+1],_=[],g=0,y=i.length;g<y;++g){var v=i[g];u=t[v-r];p=t[v-r+1];for(a=e;a<v;a+=r){c=t[a];d=t[a+1];if(f<=p&&d<=f||p<=f&&f<=d){l=(f-p)/(d-p)*(c-u)+u;_.push(l)}u=c;p=d}}var m=NaN,x=-1/0;_.sort(wr);u=_[0];for(a=1,h=_.length;a<h;++a){c=_[a];var E=Math.abs(c-u);if(x<E&&yn(t,e,i,r,l=(u+c)/2,f)){m=l;x=E}u=c}isNaN(m)&&(m=n[o]);if(s){s.push(m,f,x);return s}return[m,f,x]}function xn(t,e,i,r,n){for(var o=[],s=0,a=i.length;s<a;++s){var h=i[s];o=mn(t,e,h,r,n,2*s,o);e=h[h.length-1]}return o}function En(t,e,i,r,n,o){for(var s,a=[t[e],t[e+1]],h=[];e+r<i;e+=r){h[0]=t[e+r];h[1]=t[e+r+1];if(s=n.call(o,a,h))return s;a[0]=h[0];a[1]=h[1]}return!1}function Tn(t,e,i,r,n){var o=et([1/0,1/0,-1/0,-1/0],t,e,i,r);return!!Rt(n,o)&&(!!Q(n,o)||(o[0]>=n[0]&&o[2]<=n[2]||(o[1]>=n[1]&&o[3]<=n[3]||En(t,e,i,r,function(t,e){return mt(n,t,e)}))))}function Sn(t,e,i,r,n){for(var o=0,s=i.length;o<s;++o){if(Tn(t,e,i[o],r,n))return!0;e=i[o]}return!1}function Cn(t,e,i,r,n){return!!Tn(t,e,i,r,n)||(!!gn(t,e,i,r,n[0],n[1])||(!!gn(t,e,i,r,n[0],n[3])||(!!gn(t,e,i,r,n[2],n[1])||!!gn(t,e,i,r,n[2],n[3]))))}function Rn(t,e,i,r,n){if(!Cn(t,e,i[0],r,n))return!1;if(1===i.length)return!0;for(var o=1,s=i.length;o<s;++o)if(_n(t,i[o-1],i[o],r,n))return!1;return!0}function In(t,e,i,r,n){for(var o=0,s=i.length;o<s;++o){var a=i[o];if(Rn(t,e,a,r,n))return!0;e=a[a.length-1]}return!1}function wn(t,e,i,r){for(;e<i-r;){for(var n=0;n<r;++n){var o=t[e+n];t[e+n]=t[i-r+n];t[i-r+n]=o}e+=r;i-=r}}function Ln(t,e,i,r){for(var n=0,o=t[i-r],s=t[i-r+1];e<i;e+=r){var a=t[e],h=t[e+1];n+=(a-o)*(h+s);o=a;s=h}return 0<n}function On(t,e,i,r,n){for(var o=void 0!==n&&n,s=0,a=i.length;s<a;++s){var h=i[s],l=Ln(t,e,h,r);if(0===s){if(o&&l||!o&&!l)return!1}else if(o&&!l||!o&&l)return!1;e=h}return!0}function Pn(t,e,i,r,n){for(var o=0,s=i.length;o<s;++o)if(!On(t,e,i[o],r,n))return!1;return!0}function bn(t,e,i,r,n){for(var o=void 0!==n&&n,s=0,a=i.length;s<a;++s){var h=i[s],l=Ln(t,e,h,r);(0===s?o&&l||!o&&!l:o&&!l||!o&&l)&&wn(t,e,h,r);e=h}return e}function Mn(t,e,i,r,n){for(var o=0,s=i.length;o<s;++o)e=bn(t,e,i[o],r,n);return e}var Fn=function(r){function n(t,e,i){r.call(this);this.ends_=[];this.flatInteriorPointRevision_=-1;this.flatInteriorPoint_=null;this.maxDelta_=-1;this.maxDeltaRevision_=-1;this.orientedRevision_=-1;this.orientedFlatCoordinates_=null;if(void 0!==e&&i){this.setFlatCoordinates(e,t);this.ends_=i}else this.setCoordinates(t,e)}r&&(n.__proto__=r);((n.prototype=Object.create(r&&r.prototype)).constructor=n).prototype.appendLinearRing=function(t){this.flatCoordinates?br(this.flatCoordinates,t.getFlatCoordinates()):this.flatCoordinates=t.getFlatCoordinates().slice();this.ends_.push(this.flatCoordinates.length);this.changed()};n.prototype.clone=function(){return new n(this.flatCoordinates.slice(),this.layout,this.ends_.slice())};n.prototype.closestPointXY=function(t,e,i,r){if(r<U(this.getExtent(),t,e))return r;if(this.maxDeltaRevision_!=this.getRevision()){this.maxDelta_=Math.sqrt(Hr(this.flatCoordinates,0,this.ends_,this.stride,0));this.maxDeltaRevision_=this.getRevision()}return qr(this.flatCoordinates,0,this.ends_,this.stride,this.maxDelta_,!0,t,e,i,r)};n.prototype.containsXY=function(t,e){return yn(this.getOrientedFlatCoordinates(),0,this.ends_,this.stride,t,e)};n.prototype.getArea=function(){return Vr(this.getOrientedFlatCoordinates(),0,this.ends_,this.stride)};n.prototype.getCoordinates=function(t){var e;void 0!==t?bn(e=this.getOrientedFlatCoordinates().slice(),0,this.ends_,this.stride,t):e=this.flatCoordinates;return nn(e,0,this.ends_,this.stride)};n.prototype.getEnds=function(){return this.ends_};n.prototype.getFlatInteriorPoint=function(){if(this.flatInteriorPointRevision_!=this.getRevision()){var t=ht(this.getExtent());this.flatInteriorPoint_=mn(this.getOrientedFlatCoordinates(),0,this.ends_,this.stride,t,0);this.flatInteriorPointRevision_=this.getRevision()}return this.flatInteriorPoint_};n.prototype.getInteriorPoint=function(){return new fn(this.getFlatInteriorPoint(),kr.XYM)};n.prototype.getLinearRingCount=function(){return this.ends_.length};n.prototype.getLinearRing=function(t){return t<0||this.ends_.length<=t?null:new dn(this.flatCoordinates.slice(0===t?0:this.ends_[t-1],this.ends_[t]),this.layout)};n.prototype.getLinearRings=function(){for(var t=this.layout,e=this.flatCoordinates,i=this.ends_,r=[],n=0,o=0,s=i.length;o<s;++o){var a=i[o],h=new dn(e.slice(n,a),t);r.push(h);n=a}return r};n.prototype.getOrientedFlatCoordinates=function(){if(this.orientedRevision_!=this.getRevision()){var t=this.flatCoordinates;if(On(t,0,this.ends_,this.stride))this.orientedFlatCoordinates_=t;else{this.orientedFlatCoordinates_=t.slice();this.orientedFlatCoordinates_.length=bn(this.orientedFlatCoordinates_,0,this.ends_,this.stride)}this.orientedRevision_=this.getRevision()}return this.orientedFlatCoordinates_};n.prototype.getSimplifiedGeometryInternal=function(t){var e=[],i=[];e.length=cn(this.flatCoordinates,0,this.ends_,this.stride,Math.sqrt(t),e,0,i);return new n(e,kr.XY,i)};n.prototype.getType=function(){return kt.POLYGON};n.prototype.intersectsExtent=function(t){return Rn(this.getOrientedFlatCoordinates(),0,this.ends_,this.stride,t)};n.prototype.setCoordinates=function(t,e){this.setLayout(e,t,2);this.flatCoordinates||(this.flatCoordinates=[]);var i=tn(this.flatCoordinates,0,t,this.stride,this.ends_);this.flatCoordinates.length=0===i.length?0:i[i.length-1];this.changed()};return n}(jr);function An(t,e,i,r){for(var n=i||32,o=[],s=0;s<n;++s)br(o,Vt(t,e,2*Math.PI*s/n,r));o.push(o[0],o[1]);return new Fn(o,kr.XY,[o.length])}function Nn(t){var e=t[0],i=t[1],r=t[2],n=t[3],o=[e,i,e,n,r,n,r,i,e,i];return new Fn(o,kr.XY,[o.length])}function Dn(t,e,i){for(var r=e||32,n=t.getStride(),o=t.getLayout(),s=t.getCenter(),a=n*(r+1),h=new Array(a),l=0;l<a;l+=n){h[l]=0;h[l+1]=0;for(var u=2;u<n;u++)h[l+u]=s[u]}var c=[h.length],p=new Fn(h,o,c);Gn(p,s,t.getRadius(),i);return p}function Gn(t,e,i,r){for(var n=t.getFlatCoordinates(),o=t.getStride(),s=n.length/o-1,a=r||0,h=0;h<=s;++h){var l=h*o,u=a+2*Dt(h,s)*Math.PI/s;n[l]=e[0]+i*Math.cos(u);n[l+1]=e[1]+i*Math.sin(u)}t.changed()}var kn=function(i){function t(t){i.call(this);var e=t||{};this.position_=null;this.transform_=fe;this.watchId_=void 0;S(this,P(Rr.PROJECTION),this.handleProjectionChanged_,this);S(this,P(Rr.TRACKING),this.handleTrackingChanged_,this);void 0!==e.projection&&this.setProjection(e.projection);void 0!==e.trackingOptions&&this.setTrackingOptions(e.trackingOptions);this.setTracking(void 0!==e.tracking&&e.tracking)}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.disposeInternal=function(){this.setTracking(!1);i.prototype.disposeInternal.call(this)};t.prototype.handleProjectionChanged_=function(){var t=this.getProjection();if(t){this.transform_=Re(ye("EPSG:4326"),t);this.position_&&this.set(Rr.POSITION,this.transform_(this.position_))}};t.prototype.handleTrackingChanged_=function(){if(bi){var t=this.getTracking();if(t&&void 0===this.watchId_)this.watchId_=navigator.geolocation.watchPosition(this.positionChange_.bind(this),this.positionError_.bind(this),this.getTrackingOptions());else if(!t&&void 0!==this.watchId_){navigator.geolocation.clearWatch(this.watchId_);this.watchId_=void 0}}};t.prototype.positionChange_=function(t){var e=t.coords;this.set(Rr.ACCURACY,e.accuracy);this.set(Rr.ALTITUDE,null===e.altitude?void 0:e.altitude);this.set(Rr.ALTITUDE_ACCURACY,null===e.altitudeAccuracy?void 0:e.altitudeAccuracy);this.set(Rr.HEADING,null===e.heading?void 0:Nt(e.heading));if(this.position_){this.position_[0]=e.longitude;this.position_[1]=e.latitude}else this.position_=[e.longitude,e.latitude];var i=this.transform_(this.position_);this.set(Rr.POSITION,i);this.set(Rr.SPEED,null===e.speed?void 0:e.speed);var r=An(this.position_,e.accuracy);r.applyTransform(this.transform_);this.set(Rr.ACCURACY_GEOMETRY,r);this.changed()};t.prototype.positionError_=function(t){t.type=R.ERROR;this.setTracking(!1);this.dispatchEvent(t)};t.prototype.getAccuracy=function(){return this.get(Rr.ACCURACY)};t.prototype.getAccuracyGeometry=function(){return this.get(Rr.ACCURACY_GEOMETRY)||null};t.prototype.getAltitude=function(){return this.get(Rr.ALTITUDE)};t.prototype.getAltitudeAccuracy=function(){return this.get(Rr.ALTITUDE_ACCURACY)};t.prototype.getHeading=function(){return this.get(Rr.HEADING)};t.prototype.getPosition=function(){return this.get(Rr.POSITION)};t.prototype.getProjection=function(){return this.get(Rr.PROJECTION)};t.prototype.getSpeed=function(){return this.get(Rr.SPEED)};t.prototype.getTracking=function(){return this.get(Rr.TRACKING)};t.prototype.getTrackingOptions=function(){return this.get(Rr.TRACKING_OPTIONS)};t.prototype.setProjection=function(t){this.set(Rr.PROJECTION,ye(t))};t.prototype.setTracking=function(t){this.set(Rr.TRACKING,t)};t.prototype.setTrackingOptions=function(t){this.set(Rr.TRACKING_OPTIONS,t)};return t}(w);function jn(t,e,i){var r=void 0!==i?t.toFixed(i):""+t,n=r.indexOf(".");return e<(n=-1===n?r.length:n)?r:new Array(1+e-n).join("0")+r}function Un(t,e){for(var i=(""+t).split("."),r=(""+e).split("."),n=0;n<Math.max(i.length,r.length);n++){var o=parseInt(i[n]||"0",10),s=parseInt(r[n]||"0",10);if(s<o)return 1;if(o<s)return-1}return 0}function Yn(t,e){t[0]+=e[0];t[1]+=e[1];return t}function Bn(t,e){var i=e.getRadius(),r=e.getCenter(),n=r[0],o=r[1],s=t[0]-n,a=t[1]-o;0===s&&0===a&&(s=1);var h=Math.sqrt(s*s+a*a);return[n+i*s/h,o+i*a/h]}function Vn(t,e){var i,r,n=t[0],o=t[1],s=e[0],a=e[1],h=s[0],l=s[1],u=a[0],c=a[1],p=u-h,d=c-l,f=0===p&&0===d?0:(p*(n-h)+d*(o-l))/(p*p+d*d||0);if(f<=0){i=h;r=l}else if(1<=f){i=u;r=c}else{i=h+f*p;r=l+f*d}return[i,r]}function Xn(t,e,i){var r=Dt(e+180,360)-180,n=Math.abs(3600*r),o=i||0,s=Math.pow(10,o),a=Math.floor(n/3600),h=Math.floor((n-3600*a)/60),l=n-3600*a-60*h;if(60<=(l=Math.ceil(l*s)/s)){l=0;h+=1}if(60<=h){h=0;a+=1}return a+"° "+jn(h,2)+"′ "+jn(l,2,o)+"″"+(0==r?"":" "+t.charAt(r<0?1:0))}function zn(t,e,i){return t?e.replace("{x}",t[0].toFixed(i)).replace("{y}",t[1].toFixed(i)):""}function Wn(t,e){for(var i=!0,r=t.length-1;0<=r;--r)if(t[r]!=e[r]){i=!1;break}return i}function Hn(t,e){var i=Math.cos(e),r=Math.sin(e),n=t[0]*i-t[1]*r,o=t[1]*i+t[0]*r;t[0]=n;t[1]=o;return t}function Kn(t,e){t[0]*=e;t[1]*=e;return t}function Zn(t,e){var i=t[0]-e[0],r=t[1]-e[1];return i*i+r*r}function qn(t,e){return Math.sqrt(Zn(t,e))}function Jn(t,e){return Zn(t,Vn(t,e))}function Qn(t,e){return zn(t,"{x}, {y}",e)}function $n(t,e,i,r,n,o){var s=NaN,a=NaN,h=(i-e)/r;if(1===h){s=t[e];a=t[e+1]}else if(2==h){s=(1-n)*t[e]+n*t[e+r];a=(1-n)*t[e+1]+n*t[e+r+1]}else if(0!==h){for(var l=t[e],u=t[e+1],c=0,p=[0],d=e+r;d<i;d+=r){var f=t[d],_=t[d+1];c+=Math.sqrt((f-l)*(f-l)+(_-u)*(_-u));p.push(c);l=f;u=_}var g=n*c,y=Ir(p,g);if(y<0){var v=(g-p[-y-2])/(p[-y-1]-p[-y-2]),m=e+(-y-2)*r;s=Gt(t[m],t[m+r],v);a=Gt(t[m+1],t[m+r+1],v)}else{s=t[e+y*r];a=t[e+y*r+1]}}if(o){o[0]=s;o[1]=a;return o}return[s,a]}function to(t,e,i,r,n,o){if(i==e)return null;var s;if(n<t[e+r-1]){if(o){(s=t.slice(e,e+r))[r-1]=n;return s}return null}if(t[i-1]<n){if(o){(s=t.slice(i-r,i))[r-1]=n;return s}return null}if(n==t[e+r-1])return t.slice(e,e+r);for(var a=e/r,h=i/r;a<h;){var l=a+h>>1;n<t[(l+1)*r-1]?h=l:a=l+1}var u=t[a*r-1];if(n==u)return t.slice((a-1)*r,(a-1)*r+r);var c=(n-u)/(t[(a+1)*r-1]-u);s=[];for(var p=0;p<r-1;++p)s.push(Gt(t[(a-1)*r+p],t[a*r+p],c));s.push(n);return s}function eo(t,e,i,r,n,o,s){if(s)return to(t,e,i[i.length-1],r,n,o);var a;if(n<t[r-1]){if(o){(a=t.slice(0,r))[r-1]=n;return a}return null}if(t[t.length-1]<n){if(o){(a=t.slice(t.length-r))[r-1]=n;return a}return null}for(var h=0,l=i.length;h<l;++h){var u=i[h];if(e!=u){if(n<t[e+r-1])return null;if(n<=t[u-1])return to(t,e,u,r,n,!1);e=u}}return null}function io(t,e,i,r){for(var n=t[e],o=t[e+1],s=0,a=e+r;a<i;a+=r){var h=t[a],l=t[a+1];s+=Math.sqrt((h-n)*(h-n)+(l-o)*(l-o));n=h;o=l}return s}var ro=function(i){function r(t,e){i.call(this);this.flatMidpoint_=null;this.flatMidpointRevision_=-1;this.maxDelta_=-1;this.maxDeltaRevision_=-1;void 0===e||Array.isArray(t[0])?this.setCoordinates(t,e):this.setFlatCoordinates(e,t)}i&&(r.__proto__=i);((r.prototype=Object.create(i&&i.prototype)).constructor=r).prototype.appendCoordinate=function(t){this.flatCoordinates?br(this.flatCoordinates,t):this.flatCoordinates=t.slice();this.changed()};r.prototype.clone=function(){return new r(this.flatCoordinates.slice(),this.layout)};r.prototype.closestPointXY=function(t,e,i,r){if(r<U(this.getExtent(),t,e))return r;if(this.maxDeltaRevision_!=this.getRevision()){this.maxDelta_=Math.sqrt(Wr(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,0));this.maxDeltaRevision_=this.getRevision()}return Zr(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,this.maxDelta_,!1,t,e,i,r)};r.prototype.forEachSegment=function(t){return En(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t)};r.prototype.getCoordinateAtM=function(t,e){if(this.layout!=kr.XYM&&this.layout!=kr.XYZM)return null;var i=void 0!==e&&e;return to(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t,i)};r.prototype.getCoordinates=function(){return rn(this.flatCoordinates,0,this.flatCoordinates.length,this.stride)};r.prototype.getCoordinateAt=function(t,e){return $n(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t,e)};r.prototype.getLength=function(){return io(this.flatCoordinates,0,this.flatCoordinates.length,this.stride)};r.prototype.getFlatMidpoint=function(){if(this.flatMidpointRevision_!=this.getRevision()){this.flatMidpoint_=this.getCoordinateAt(.5,this.flatMidpoint_);this.flatMidpointRevision_=this.getRevision()}return this.flatMidpoint_};r.prototype.getSimplifiedGeometryInternal=function(t){var e=[];e.length=sn(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t,e,0);return new r(e,kr.XY)};r.prototype.getType=function(){return kt.LINE_STRING};r.prototype.intersectsExtent=function(t){return Tn(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t)};r.prototype.setCoordinates=function(t,e){this.setLayout(e,t,1);this.flatCoordinates||(this.flatCoordinates=[]);this.flatCoordinates.length=$r(this.flatCoordinates,0,t,this.stride);this.changed()};return r}(jr);function no(t,e,i){for(var r,n,o,s,a,h,l=[],u=t(0),c=t(1),p=e(u),d=e(c),f=[c,u],_=[d,p],g=[1,0],y={},v=1e5;0<--v&&0<g.length;){o=g.pop();u=f.pop();p=_.pop();if(!((h=o.toString())in y)){l.push(p[0],p[1]);y[h]=!0}s=g.pop();c=f.pop();d=_.pop();if(bt((n=e(r=t(a=(o+s)/2)))[0],n[1],p[0],p[1],d[0],d[1])<i){l.push(d[0],d[1]);y[h=s.toString()]=!0}else{g.push(s,a,a,o);_.push(d,n,n,p);f.push(c,r,r,u)}}return l}function oo(e,i,r,t,n){return no(function(t){return[e,i+(r-i)*t]},Ie(ye("EPSG:4326"),t),n)}function so(e,i,r,t,n){return no(function(t){return[i+(r-i)*t,e]},Ie(ye("EPSG:4326"),t),n)}var ao={POSTCOMPOSE:"postcompose",PRECOMPOSE:"precompose",RENDER:"render",RENDERCOMPLETE:"rendercomplete"},ho={POINT:"point",LINE:"line"},lo=function(t){var e=t||{};this.font_=e.font;this.rotation_=e.rotation;this.rotateWithView_=e.rotateWithView;this.scale_=e.scale;this.text_=e.text;this.textAlign_=e.textAlign;this.textBaseline_=e.textBaseline;this.fill_=void 0!==e.fill?e.fill:new _r({color:"#333"});this.maxAngle_=void 0!==e.maxAngle?e.maxAngle:Math.PI/4;this.placement_=void 0!==e.placement?e.placement:ho.POINT;this.overflow_=!!e.overflow;this.stroke_=void 0!==e.stroke?e.stroke:null;this.offsetX_=void 0!==e.offsetX?e.offsetX:0;this.offsetY_=void 0!==e.offsetY?e.offsetY:0;this.backgroundFill_=e.backgroundFill?e.backgroundFill:null;this.backgroundStroke_=e.backgroundStroke?e.backgroundStroke:null;this.padding_=void 0===e.padding?null:e.padding};lo.prototype.clone=function(){return new lo({font:this.getFont(),placement:this.getPlacement(),maxAngle:this.getMaxAngle(),overflow:this.getOverflow(),rotation:this.getRotation(),rotateWithView:this.getRotateWithView(),scale:this.getScale(),text:this.getText(),textAlign:this.getTextAlign(),textBaseline:this.getTextBaseline(),fill:this.getFill()?this.getFill().clone():void 0,stroke:this.getStroke()?this.getStroke().clone():void 0,offsetX:this.getOffsetX(),offsetY:this.getOffsetY(),backgroundFill:this.getBackgroundFill()?this.getBackgroundFill().clone():void 0,backgroundStroke:this.getBackgroundStroke()?this.getBackgroundStroke().clone():void 0})};lo.prototype.getOverflow=function(){return this.overflow_};lo.prototype.getFont=function(){return this.font_};lo.prototype.getMaxAngle=function(){return this.maxAngle_};lo.prototype.getPlacement=function(){return this.placement_};lo.prototype.getOffsetX=function(){return this.offsetX_};lo.prototype.getOffsetY=function(){return this.offsetY_};lo.prototype.getFill=function(){return this.fill_};lo.prototype.getRotateWithView=function(){return this.rotateWithView_};lo.prototype.getRotation=function(){return this.rotation_};lo.prototype.getScale=function(){return this.scale_};lo.prototype.getStroke=function(){return this.stroke_};lo.prototype.getText=function(){return this.text_};lo.prototype.getTextAlign=function(){return this.textAlign_};lo.prototype.getTextBaseline=function(){return this.textBaseline_};lo.prototype.getBackgroundFill=function(){return this.backgroundFill_};lo.prototype.getBackgroundStroke=function(){return this.backgroundStroke_};lo.prototype.getPadding=function(){return this.padding_};lo.prototype.setOverflow=function(t){this.overflow_=t};lo.prototype.setFont=function(t){this.font_=t};lo.prototype.setMaxAngle=function(t){this.maxAngle_=t};lo.prototype.setOffsetX=function(t){this.offsetX_=t};lo.prototype.setOffsetY=function(t){this.offsetY_=t};lo.prototype.setPlacement=function(t){this.placement_=t};lo.prototype.setFill=function(t){this.fill_=t};lo.prototype.setRotation=function(t){this.rotation_=t};lo.prototype.setScale=function(t){this.scale_=t};lo.prototype.setStroke=function(t){this.stroke_=t};lo.prototype.setText=function(t){this.text_=t};lo.prototype.setTextAlign=function(t){this.textAlign_=t};lo.prototype.setTextBaseline=function(t){this.textBaseline_=t};lo.prototype.setBackgroundFill=function(t){this.backgroundFill_=t};lo.prototype.setBackgroundStroke=function(t){this.backgroundStroke_=t};lo.prototype.setPadding=function(t){this.padding_=t};var uo=new gr({color:"rgba(0,0,0,0.2)"}),co=[90,45,30,20,10,5,2,1,.5,.2,.1,.05,.01,.005,.002,.001],po=function(t){var e=t||{};this.map_=null;this.postcomposeListenerKey_=null;this.projection_=null;this.maxLat_=1/0;this.maxLon_=1/0;this.minLat_=-1/0;this.minLon_=-1/0;this.maxLatP_=1/0;this.maxLonP_=1/0;this.minLatP_=-1/0;this.minLonP_=-1/0;this.targetSize_=void 0!==e.targetSize?e.targetSize:100;this.maxLines_=void 0!==e.maxLines?e.maxLines:100;this.meridians_=[];this.parallels_=[];this.strokeStyle_=void 0!==e.strokeStyle?e.strokeStyle:uo;this.fromLonLatTransform_=void 0;this.toLonLatTransform_=void 0;this.projectionCenterLonLat_=null;this.meridiansLabels_=null;this.parallelsLabels_=null;if(1==e.showLabels){this.lonLabelFormatter_=null==e.lonLabelFormatter?Xn.bind(this,"EW"):e.lonLabelFormatter;this.latLabelFormatter_=null==e.latLabelFormatter?Xn.bind(this,"NS"):e.latLabelFormatter;this.lonLabelPosition_=null==e.lonLabelPosition?0:e.lonLabelPosition;this.latLabelPosition_=null==e.latLabelPosition?1:e.latLabelPosition;this.lonLabelStyle_=void 0!==e.lonLabelStyle?e.lonLabelStyle:new lo({font:"12px Calibri,sans-serif",textBaseline:"bottom",fill:new _r({color:"rgba(0,0,0,1)"}),stroke:new gr({color:"rgba(255,255,255,1)",width:3})});this.latLabelStyle_=void 0!==e.latLabelStyle?e.latLabelStyle:new lo({font:"12px Calibri,sans-serif",textAlign:"end",fill:new _r({color:"rgba(0,0,0,1)"}),stroke:new gr({color:"rgba(255,255,255,1)",width:3})});this.meridiansLabels_=[];this.parallelsLabels_=[]}this.setMap(void 0!==e.map?e.map:null)};po.prototype.addMeridian_=function(t,e,i,r,n,o){var s=this.getMeridian_(t,e,i,r,o);if(Rt(s.getExtent(),n)){if(this.meridiansLabels_){var a=this.getMeridianPoint_(s,n,o);this.meridiansLabels_[o]={geom:a,text:this.lonLabelFormatter_(t)}}this.meridians_[o++]=s}return o};po.prototype.getMeridianPoint_=function(t,e,i){var r,n=t.getFlatCoordinates(),o=Math.max(e[1],n[1]),s=Math.min(e[3],n[n.length-1]),a=Lt(e[1]+Math.abs(e[1]-e[3])*this.lonLabelPosition_,o,s),h=[n[0],a];i in this.meridiansLabels_?(r=this.meridiansLabels_[i].geom).setCoordinates(h):r=new fn(h);return r};po.prototype.addParallel_=function(t,e,i,r,n,o){var s=this.getParallel_(t,e,i,r,o);if(Rt(s.getExtent(),n)){if(this.parallelsLabels_){var a=this.getParallelPoint_(s,n,o);this.parallelsLabels_[o]={geom:a,text:this.latLabelFormatter_(t)}}this.parallels_[o++]=s}return o};po.prototype.getParallelPoint_=function(t,e,i){var r,n=t.getFlatCoordinates(),o=Math.max(e[0],n[0]),s=Math.min(e[2],n[n.length-2]),a=[Lt(e[0]+Math.abs(e[0]-e[2])*this.latLabelPosition_,o,s),n[1]];i in this.parallelsLabels_?(r=this.parallelsLabels_[i].geom).setCoordinates(a):r=new fn(a);return r};po.prototype.createGraticule_=function(t,e,i,r){var n=this.getInterval_(i);if(-1!=n){var o,s,a,h,l=this.toLonLatTransform_(e),u=l[0],c=l[1],p=this.maxLines_,d=[Math.max(t[0],this.minLonP_),Math.max(t[1],this.minLatP_),Math.min(t[2],this.maxLonP_),Math.min(t[3],this.maxLatP_)],f=(d=Le(d,this.projection_,"EPSG:4326"))[3],_=d[2],g=d[1],y=d[0];h=Lt(u=Math.floor(u/n)*n,this.minLon_,this.maxLon_);s=this.addMeridian_(h,g,f,r,t,0);o=0;for(;h!=this.minLon_&&o++<p;){h=Math.max(h-n,this.minLon_);s=this.addMeridian_(h,g,f,r,t,s)}h=Lt(u,this.minLon_,this.maxLon_);o=0;for(;h!=this.maxLon_&&o++<p;){h=Math.min(h+n,this.maxLon_);s=this.addMeridian_(h,g,f,r,t,s)}this.meridians_.length=s;this.meridiansLabels_&&(this.meridiansLabels_.length=s);a=Lt(c=Math.floor(c/n)*n,this.minLat_,this.maxLat_);s=this.addParallel_(a,y,_,r,t,0);o=0;for(;a!=this.minLat_&&o++<p;){a=Math.max(a-n,this.minLat_);s=this.addParallel_(a,y,_,r,t,s)}a=Lt(c,this.minLat_,this.maxLat_);o=0;for(;a!=this.maxLat_&&o++<p;){a=Math.min(a+n,this.maxLat_);s=this.addParallel_(a,y,_,r,t,s)}this.parallels_.length=s;this.parallelsLabels_&&(this.parallelsLabels_.length=s)}else{this.meridians_.length=this.parallels_.length=0;this.meridiansLabels_&&(this.meridiansLabels_.length=0);this.parallelsLabels_&&(this.parallelsLabels_.length=0)}};po.prototype.getInterval_=function(t){for(var e=this.projectionCenterLonLat_[0],i=this.projectionCenterLonLat_[1],r=-1,n=Math.pow(this.targetSize_*t,2),o=[],s=[],a=0,h=co.length;a<h;++a){var l=co[a]/2;o[0]=e-l;o[1]=i-l;s[0]=e+l;s[1]=i+l;this.fromLonLatTransform_(o,o);this.fromLonLatTransform_(s,s);if(Math.pow(s[0]-o[0],2)+Math.pow(s[1]-o[1],2)<=n)break;r=co[a]}return r};po.prototype.getMap=function(){return this.map_};po.prototype.getMeridian_=function(t,e,i,r,n){var o=oo(t,e,i,this.projection_,r),s=this.meridians_[n];if(s){s.setFlatCoordinates(kr.XY,o);s.changed()}else s=this.meridians_[n]=new ro(o,kr.XY);return s};po.prototype.getMeridians=function(){return this.meridians_};po.prototype.getParallel_=function(t,e,i,r,n){var o=so(t,e,i,this.projection_,r),s=this.parallels_[n];if(s){s.setFlatCoordinates(kr.XY,o);s.changed()}else s=new ro(o,kr.XY);return s};po.prototype.getParallels=function(){return this.parallels_};po.prototype.handlePostCompose_=function(t){var e,i,r,n,o=t.vectorContext,s=t.frameState,a=s.extent,h=s.viewState,l=h.center,u=h.projection,c=h.resolution,p=s.pixelRatio,d=c*c/(4*p*p);(!this.projection_||!Ce(this.projection_,u))&&this.updateProjectionInfo_(u);this.createGraticule_(a,l,c,d);o.setFillStrokeStyle(null,this.strokeStyle_);for(e=0,i=this.meridians_.length;e<i;++e){r=this.meridians_[e];o.drawGeometry(r)}for(e=0,i=this.parallels_.length;e<i;++e){r=this.parallels_[e];o.drawGeometry(r)}if(this.meridiansLabels_)for(e=0,i=this.meridiansLabels_.length;e<i;++e){n=this.meridiansLabels_[e];this.lonLabelStyle_.setText(n.text);o.setTextStyle(this.lonLabelStyle_);o.drawGeometry(n.geom)}if(this.parallelsLabels_)for(e=0,i=this.parallelsLabels_.length;e<i;++e){n=this.parallelsLabels_[e];this.latLabelStyle_.setText(n.text);o.setTextStyle(this.latLabelStyle_);o.drawGeometry(n.geom)}};po.prototype.updateProjectionInfo_=function(t){var e=ye("EPSG:4326"),i=t.getWorldExtent(),r=Le(i,e,t);this.maxLat_=i[3];this.maxLon_=i[2];this.minLat_=i[1];this.minLon_=i[0];this.maxLatP_=r[3];this.maxLonP_=r[2];this.minLatP_=r[1];this.minLonP_=r[0];this.fromLonLatTransform_=Ie(e,t);this.toLonLatTransform_=Ie(t,e);this.projectionCenterLonLat_=this.toLonLatTransform_(ht(t.getExtent()));this.projection_=t};po.prototype.setMap=function(t){if(this.map_){g(this.postcomposeListenerKey_);this.postcomposeListenerKey_=null;this.map_.render()}if(t){this.postcomposeListenerKey_=S(t,ao.POSTCOMPOSE,this.handlePostCompose_,this);t.render()}this.map_=t};var fo=function(n){function t(t,e,i,r){n.call(this);this.extent=t;this.pixelRatio_=i;this.resolution=e;this.state=r}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.changed=function(){this.dispatchEvent(R.CHANGE)};t.prototype.getExtent=function(){return this.extent};t.prototype.getImage=function(){};t.prototype.getPixelRatio=function(){return this.pixelRatio_};t.prototype.getResolution=function(){return this.resolution};t.prototype.getState=function(){return this.state};t.prototype.load=function(){};return t}(i),_o=function(s){function t(t,e,i,r,n,o){s.call(this,t,e,i,Ni.IDLE);this.src_=r;this.image_=new Image;null!==n&&(this.image_.crossOrigin=n);this.imageListenerKeys_=null;this.state=Ni.IDLE;this.imageLoadFunction_=o}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.getImage=function(){return this.image_};t.prototype.handleImageError_=function(){this.state=Ni.ERROR;this.unlistenImage_();this.changed()};t.prototype.handleImageLoad_=function(){void 0===this.resolution&&(this.resolution=ct(this.extent)/this.image_.height);this.state=Ni.LOADED;this.unlistenImage_();this.changed()};t.prototype.load=function(){if(this.state==Ni.IDLE||this.state==Ni.ERROR){this.state=Ni.LOADING;this.changed();this.imageListenerKeys_=[d(this.image_,R.ERROR,this.handleImageError_,this),d(this.image_,R.LOAD,this.handleImageLoad_,this)];this.imageLoadFunction_(this,this.src_)}};t.prototype.setImage=function(t){this.image_=t};t.prototype.unlistenImage_=function(){this.imageListenerKeys_.forEach(g);this.imageListenerKeys_=null};return t}(fo),go=function(s){function t(t,e,i,r,n){var o=void 0!==n?Ni.IDLE:Ni.LOADED;s.call(this,t,e,i,o);this.loader_=void 0!==n?n:null;this.canvas_=r;this.error_=null}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.getError=function(){return this.error_};t.prototype.handleLoad_=function(t){if(t){this.error_=t;this.state=Ni.ERROR}else this.state=Ni.LOADED;this.changed()};t.prototype.load=function(){if(this.state==Ni.IDLE){this.state=Ni.LOADING;this.changed();this.loader_(this.handleLoad_.bind(this))}};t.prototype.getImage=function(){return this.canvas_};return t}(fo),yo={IDLE:0,LOADING:1,LOADED:2,ERROR:3,EMPTY:4,ABORT:5};function vo(t){return Math.pow(t,3)}function mo(t){return 1-vo(1-t)}function xo(t){return 3*t*t-2*t*t*t}function Eo(t){return t}var To=function(n){function t(t,e,i){n.call(this);var r=i||{};this.tileCoord=t;this.state=e;this.interimTile=null;this.key="";this.transition_=void 0===r.transition?250:r.transition;this.transitionStarts_={}}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.changed=function(){this.dispatchEvent(R.CHANGE)};t.prototype.getKey=function(){return this.key+"/"+this.tileCoord};t.prototype.getInterimTile=function(){if(!this.interimTile)return this;var t=this.interimTile;do{if(t.getState()==yo.LOADED)return t;t=t.interimTile}while(t);return this};t.prototype.refreshInterimChain=function(){if(this.interimTile){var t=this.interimTile,e=this;do{if(t.getState()==yo.LOADED){t.interimTile=null;break}t.getState()==yo.LOADING?e=t:t.getState()==yo.IDLE?e.interimTile=t.interimTile:e=t;t=e.interimTile}while(t)}};t.prototype.getTileCoord=function(){return this.tileCoord};t.prototype.getState=function(){return this.state};t.prototype.setState=function(t){this.state=t;this.changed()};t.prototype.load=function(){};t.prototype.getAlpha=function(t,e){if(!this.transition_)return 1;var i=this.transitionStarts_[t];if(i){if(-1===i)return 1}else{i=e;this.transitionStarts_[t]=i}var r=e-i+1e3/60;return r>=this.transition_?1:vo(r/this.transition_)};t.prototype.inTransition=function(t){return!!this.transition_&&-1!==this.transitionStarts_[t]};t.prototype.endTransition=function(t){this.transition_&&(this.transitionStarts_[t]=-1)};return t}(i),So=function(s){function t(t,e,i,r,n,o){s.call(this,t,e,o);this.crossOrigin_=r;this.src_=i;this.image_=new Image;null!==r&&(this.image_.crossOrigin=r);this.imageListenerKeys_=null;this.tileLoadFunction_=n}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.disposeInternal=function(){if(this.state==yo.LOADING){this.unlistenImage_();this.image_=Co()}this.interimTile&&this.interimTile.dispose();this.state=yo.ABORT;this.changed();s.prototype.disposeInternal.call(this)};t.prototype.getImage=function(){return this.image_};t.prototype.getKey=function(){return this.src_};t.prototype.handleImageError_=function(){this.state=yo.ERROR;this.unlistenImage_();this.image_=Co();this.changed()};t.prototype.handleImageLoad_=function(){this.image_.naturalWidth&&this.image_.naturalHeight?this.state=yo.LOADED:this.state=yo.EMPTY;this.unlistenImage_();this.changed()};t.prototype.load=function(){if(this.state==yo.ERROR){this.state=yo.IDLE;this.image_=new Image;null!==this.crossOrigin_&&(this.image_.crossOrigin=this.crossOrigin_)}if(this.state==yo.IDLE){this.state=yo.LOADING;this.changed();this.imageListenerKeys_=[d(this.image_,R.ERROR,this.handleImageError_,this),d(this.image_,R.LOAD,this.handleImageLoad_,this)];this.tileLoadFunction_(this,this.src_)}};t.prototype.unlistenImage_=function(){this.imageListenerKeys_.forEach(g);this.imageListenerKeys_=null};return t}(To);function Co(){var t=ii(1,1);t.fillStyle="rgba(0,0,0,0)";t.fillRect(0,0,1,1);return t.canvas}var Ro=function(t,e,i){this.decay_=t;this.minVelocity_=e;this.delay_=i;this.points_=[];this.angle_=0;this.initialVelocity_=0};Ro.prototype.begin=function(){this.points_.length=0;this.angle_=0;this.initialVelocity_=0};Ro.prototype.update=function(t,e){this.points_.push(t,e,Date.now())};Ro.prototype.end=function(){if(this.points_.length<6)return!1;var t=Date.now()-this.delay_,e=this.points_.length-3;if(this.points_[e+2]<t)return!1;for(var i=e-3;0<i&&this.points_[i+2]>t;)i-=3;var r=this.points_[e+2]-this.points_[i+2];if(r<1e3/60)return!1;var n=this.points_[e]-this.points_[i],o=this.points_[e+1]-this.points_[i+1];this.angle_=Math.atan2(o,n);this.initialVelocity_=Math.sqrt(n*n+o*o)/r;return this.initialVelocity_>this.minVelocity_};Ro.prototype.getDistance=function(){return(this.minVelocity_-this.initialVelocity_)/this.decay_};Ro.prototype.getAngle=function(){return this.angle_};var Io={IMAGE:"IMAGE",TILE:"TILE",VECTOR_TILE:"VECTOR_TILE",VECTOR:"VECTOR"},wo=function(r){function t(t,e,i){r.call(this,t);this.map=e;this.frameState=void 0!==i?i:null}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(x),Lo=function(o){function t(t,e,i,r,n){o.call(this,t,e,n);this.originalEvent=i;this.pixel=e.getEventPixel(i);this.coordinate=e.getCoordinateFromPixel(this.pixel);this.dragging=void 0!==r&&r}o&&(t.__proto__=o);((t.prototype=Object.create(o&&o.prototype)).constructor=t).prototype.preventDefault=function(){o.prototype.preventDefault.call(this);this.originalEvent.preventDefault()};t.prototype.stopPropagation=function(){o.prototype.stopPropagation.call(this);this.originalEvent.stopPropagation()};return t}(wo),Oo={SINGLECLICK:"singleclick",CLICK:R.CLICK,DBLCLICK:R.DBLCLICK,POINTERDRAG:"pointerdrag",POINTERMOVE:"pointermove",POINTERDOWN:"pointerdown",POINTERUP:"pointerup",POINTEROVER:"pointerover",POINTEROUT:"pointerout",POINTERENTER:"pointerenter",POINTERLEAVE:"pointerleave",POINTERCANCEL:"pointercancel"},Po=function(o){function t(t,e,i,r,n){o.call(this,t,e,i.originalEvent,r,n);this.pointerEvent=i}o&&(t.__proto__=o);return(t.prototype=Object.create(o&&o.prototype)).constructor=t}(Lo),bo={POINTERMOVE:"pointermove",POINTERDOWN:"pointerdown",POINTERUP:"pointerup",POINTEROVER:"pointerover",POINTEROUT:"pointerout",POINTERENTER:"pointerenter",POINTERLEAVE:"pointerleave",POINTERCANCEL:"pointercancel"},Mo=function(t,e){this.dispatcher=t;this.mapping_=e};Mo.prototype.getEvents=function(){return Object.keys(this.mapping_)};Mo.prototype.getHandlerForEvent=function(t){return this.mapping_[t]};var Fo=1,Ao="mouse";function No(t){if(!this.isEventSimulatedFromTouch_(t)){Fo.toString()in this.pointerMap&&this.cancel(t);var e=Yo(t,this.dispatcher);this.pointerMap[Fo.toString()]=t;this.dispatcher.down(e,t)}}function Do(t){if(!this.isEventSimulatedFromTouch_(t)){var e=Yo(t,this.dispatcher);this.dispatcher.move(e,t)}}function Go(t){if(!this.isEventSimulatedFromTouch_(t)){var e=this.pointerMap[Fo.toString()];if(e&&e.button===t.button){var i=Yo(t,this.dispatcher);this.dispatcher.up(i,t);this.cleanupMouse()}}}function ko(t){if(!this.isEventSimulatedFromTouch_(t)){var e=Yo(t,this.dispatcher);this.dispatcher.enterOver(e,t)}}function jo(t){if(!this.isEventSimulatedFromTouch_(t)){var e=Yo(t,this.dispatcher);this.dispatcher.leaveOut(e,t)}}var Uo=function(i){function t(t){var e={mousedown:No,mousemove:Do,mouseup:Go,mouseover:ko,mouseout:jo};i.call(this,t,e);this.pointerMap=t.pointerMap;this.lastTouches=[]}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.isEventSimulatedFromTouch_=function(t){for(var e=this.lastTouches,i=t.clientX,r=t.clientY,n=0,o=e.length,s=void 0;n<o&&(s=e[n]);n++){var a=Math.abs(i-s[0]),h=Math.abs(r-s[1]);if(a<=25&&h<=25)return!0}return!1};t.prototype.cancel=function(t){var e=Yo(t,this.dispatcher);this.dispatcher.cancel(e,t);this.cleanupMouse()};t.prototype.cleanupMouse=function(){delete this.pointerMap[Fo.toString()]};return t}(Mo);function Yo(t,e){var i=e.cloneEvent(t,t),r=i.preventDefault;i.preventDefault=function(){t.preventDefault();r()};i.pointerId=Fo;i.isPrimary=!0;i.pointerType=Ao;return i}var Bo=["","unavailable","touch","pen","mouse"];function Vo(t){this.pointerMap[t.pointerId.toString()]=t;var e=this.prepareEvent_(t);this.dispatcher.down(e,t)}function Xo(t){var e=this.prepareEvent_(t);this.dispatcher.move(e,t)}function zo(t){var e=this.prepareEvent_(t);this.dispatcher.up(e,t);this.cleanup(t.pointerId)}function Wo(t){var e=this.prepareEvent_(t);this.dispatcher.leaveOut(e,t)}function Ho(t){var e=this.prepareEvent_(t);this.dispatcher.enterOver(e,t)}function Ko(t){var e=this.prepareEvent_(t);this.dispatcher.cancel(e,t);this.cleanup(t.pointerId)}function Zo(t){var e=this.dispatcher.makeEvent("lostpointercapture",t,t);this.dispatcher.dispatchEvent(e)}function qo(t){var e=this.dispatcher.makeEvent("gotpointercapture",t,t);this.dispatcher.dispatchEvent(e)}var Jo=function(i){function t(t){var e={MSPointerDown:Vo,MSPointerMove:Xo,MSPointerUp:zo,MSPointerOut:Wo,MSPointerOver:Ho,MSPointerCancel:Ko,MSGotPointerCapture:qo,MSLostPointerCapture:Zo};i.call(this,t,e);this.pointerMap=t.pointerMap}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.prepareEvent_=function(t){var e=t;"number"==typeof t.pointerType&&((e=this.dispatcher.cloneEvent(t,t)).pointerType=Bo[t.pointerType]);return e};t.prototype.cleanup=function(t){delete this.pointerMap[t.toString()]};return t}(Mo);function Qo(t){this.dispatcher.fireNativeEvent(t)}function $o(t){this.dispatcher.fireNativeEvent(t)}function ts(t){this.dispatcher.fireNativeEvent(t)}function es(t){this.dispatcher.fireNativeEvent(t)}function is(t){this.dispatcher.fireNativeEvent(t)}function rs(t){this.dispatcher.fireNativeEvent(t)}function ns(t){this.dispatcher.fireNativeEvent(t)}function os(t){this.dispatcher.fireNativeEvent(t)}var ss=function(i){function t(t){var e={pointerdown:Qo,pointermove:$o,pointerup:ts,pointerout:es,pointerover:is,pointercancel:rs,gotpointercapture:os,lostpointercapture:ns};i.call(this,t,e)}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(Mo),as=!1,hs=function(n){function t(t,e,i){n.call(this,t);this.originalEvent=e;var r=i||{};this.buttons=this.getButtons_(r);this.pressure=this.getPressure_(r,this.buttons);this.bubbles="bubbles"in r&&r.bubbles;this.cancelable="cancelable"in r&&r.cancelable;this.view="view"in r?r.view:null;this.detail="detail"in r?r.detail:null;this.screenX="screenX"in r?r.screenX:0;this.screenY="screenY"in r?r.screenY:0;this.clientX="clientX"in r?r.clientX:0;this.clientY="clientY"in r?r.clientY:0;this.ctrlKey="ctrlKey"in r&&r.ctrlKey;this.altKey="altKey"in r&&r.altKey;this.shiftKey="shiftKey"in r&&r.shiftKey;this.metaKey="metaKey"in r&&r.metaKey;this.button="button"in r?r.button:0;this.relatedTarget="relatedTarget"in r?r.relatedTarget:null;this.pointerId="pointerId"in r?r.pointerId:0;this.width="width"in r?r.width:0;this.height="height"in r?r.height:0;this.tiltX="tiltX"in r?r.tiltX:0;this.tiltY="tiltY"in r?r.tiltY:0;this.pointerType="pointerType"in r?r.pointerType:"";this.hwTimestamp="hwTimestamp"in r?r.hwTimestamp:0;this.isPrimary="isPrimary"in r&&r.isPrimary;e.preventDefault&&(this.preventDefault=function(){e.preventDefault()})}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.getButtons_=function(t){var e;if(t.buttons||as)e=t.buttons;else switch(t.which){case 1:e=1;break;case 2:e=4;break;case 3:e=2;break;default:e=0}return e};t.prototype.getPressure_=function(t,e){return t.pressure?t.pressure:e?.5:0};return t}(x);!function(){try{var t=new MouseEvent("click",{buttons:1});as=1===t.buttons}catch(t){}}();function ls(t){this.vacuumTouches_(t);this.setPrimaryTouch_(t.changedTouches[0]);this.dedupSynthMouse_(t);this.clickCount_++;this.processTouches_(t,this.overDown_)}function us(t){this.processTouches_(t,this.moveOverOut_)}function cs(t){this.dedupSynthMouse_(t);this.processTouches_(t,this.upOut_)}function ps(t){this.processTouches_(t,this.cancelOut_)}var ds=function(r){function t(t,e){var i={touchstart:ls,touchmove:us,touchend:cs,touchcancel:ps};r.call(this,t,i);this.pointerMap=t.pointerMap;this.mouseSource=e;this.firstTouchId_=void 0;this.clickCount_=0;this.resetId_=void 0;this.dedupTimeout_=2500}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.isPrimaryTouch_=function(t){return this.firstTouchId_===t.identifier};t.prototype.setPrimaryTouch_=function(t){var e=Object.keys(this.pointerMap).length;if(0===e||1===e&&Fo.toString()in this.pointerMap){this.firstTouchId_=t.identifier;this.cancelResetClickCount_()}};t.prototype.removePrimaryPointer_=function(t){if(t.isPrimary){this.firstTouchId_=void 0;this.resetClickCount_()}};t.prototype.resetClickCount_=function(){this.resetId_=setTimeout(this.resetClickCountHandler_.bind(this),200)};t.prototype.resetClickCountHandler_=function(){this.clickCount_=0;this.resetId_=void 0};t.prototype.cancelResetClickCount_=function(){void 0!==this.resetId_&&clearTimeout(this.resetId_)};t.prototype.touchToPointer_=function(t,e){var i=this.dispatcher.cloneEvent(t,e);i.pointerId=e.identifier+2;i.bubbles=!0;i.cancelable=!0;i.detail=this.clickCount_;i.button=0;i.buttons=1;i.width=e.webkitRadiusX||e.radiusX||0;i.height=e.webkitRadiusY||e.radiusY||0;i.pressure=e.webkitForce||e.force||.5;i.isPrimary=this.isPrimaryTouch_(e);i.pointerType="touch";i.clientX=e.clientX;i.clientY=e.clientY;i.screenX=e.screenX;i.screenY=e.screenY;return i};t.prototype.processTouches_=function(t,e){var i=Array.prototype.slice.call(t.changedTouches),r=i.length;function n(){t.preventDefault()}for(var o=0;o<r;++o){var s=this.touchToPointer_(t,i[o]);s.preventDefault=n;e.call(this,t,s)}};t.prototype.findTouch_=function(t,e){for(var i=t.length,r=0;r<i;r++){if(t[r].identifier===e)return!0}return!1};t.prototype.vacuumTouches_=function(t){var e=t.touches,i=Object.keys(this.pointerMap),r=i.length;if(r>=e.length){for(var n=[],o=0;o<r;++o){var s=i[o],a=this.pointerMap[s];s==Fo||this.findTouch_(e,s-2)||n.push(a.out)}for(var h=0;h<n.length;++h)this.cancelOut_(t,n[h])}};t.prototype.overDown_=function(t,e){this.pointerMap[e.pointerId]={target:e.target,out:e,outTarget:e.target};this.dispatcher.over(e,t);this.dispatcher.enter(e,t);this.dispatcher.down(e,t)};t.prototype.moveOverOut_=function(t,e){var i=e,r=this.pointerMap[i.pointerId];if(r){var n=r.out,o=r.outTarget;this.dispatcher.move(i,t);if(n&&o!==i.target){n.relatedTarget=i.target;i.relatedTarget=o;n.target=o;if(i.target){this.dispatcher.leaveOut(n,t);this.dispatcher.enterOver(i,t)}else{i.target=o;i.relatedTarget=null;this.cancelOut_(t,i)}}r.out=i;r.outTarget=i.target}};t.prototype.upOut_=function(t,e){this.dispatcher.up(e,t);this.dispatcher.out(e,t);this.dispatcher.leave(e,t);this.cleanUpPointer_(e)};t.prototype.cancelOut_=function(t,e){this.dispatcher.cancel(e,t);this.dispatcher.out(e,t);this.dispatcher.leave(e,t);this.cleanUpPointer_(e)};t.prototype.cleanUpPointer_=function(t){delete this.pointerMap[t.pointerId];this.removePrimaryPointer_(t)};t.prototype.dedupSynthMouse_=function(t){var e=this.mouseSource.lastTouches,i=t.changedTouches[0];if(this.isPrimaryTouch_(i)){var r=[i.clientX,i.clientY];e.push(r);setTimeout(function(){Mr(e,r)},this.dedupTimeout_)}};return t}(Mo),fs=[["bubbles",!1],["cancelable",!1],["view",null],["detail",null],["screenX",0],["screenY",0],["clientX",0],["clientY",0],["ctrlKey",!1],["altKey",!1],["shiftKey",!1],["metaKey",!1],["button",0],["relatedTarget",null],["buttons",0],["pointerId",0],["width",0],["height",0],["pressure",0],["tiltX",0],["tiltY",0],["pointerType",""],["hwTimestamp",0],["isPrimary",!1],["type",""],["target",null],["currentTarget",null],["which",0]],_s=function(e){function t(t){e.call(this);this.element_=t;this.pointerMap={};this.eventMap_={};this.eventSourceList_=[];this.registerSources()}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.registerSources=function(){if(Fi)this.registerSource("native",new ss(this));else if(Ai)this.registerSource("ms",new Jo(this));else{var t=new Uo(this);this.registerSource("mouse",t);Mi&&this.registerSource("touch",new ds(this,t))}this.register_()};t.prototype.registerSource=function(t,e){var i=e,r=i.getEvents();if(r){r.forEach(function(t){var e=i.getHandlerForEvent(t);e&&(this.eventMap_[t]=e.bind(i))}.bind(this));this.eventSourceList_.push(i)}};t.prototype.register_=function(){for(var t=this.eventSourceList_.length,e=0;e<t;e++){var i=this.eventSourceList_[e];this.addEvents_(i.getEvents())}};t.prototype.unregister_=function(){for(var t=this.eventSourceList_.length,e=0;e<t;e++){var i=this.eventSourceList_[e];this.removeEvents_(i.getEvents())}};t.prototype.eventHandler_=function(t){var e=t.type,i=this.eventMap_[e];i&&i(t)};t.prototype.addEvents_=function(t){t.forEach(function(t){S(this.element_,t,this.eventHandler_,this)}.bind(this))};t.prototype.removeEvents_=function(t){t.forEach(function(t){f(this.element_,t,this.eventHandler_,this)}.bind(this))};t.prototype.cloneEvent=function(t,e){for(var i={},r=0,n=fs.length;r<n;r++){var o=fs[r][0];i[o]=t[o]||e[o]||fs[r][1]}return i};t.prototype.down=function(t,e){this.fireEvent(bo.POINTERDOWN,t,e)};t.prototype.move=function(t,e){this.fireEvent(bo.POINTERMOVE,t,e)};t.prototype.up=function(t,e){this.fireEvent(bo.POINTERUP,t,e)};t.prototype.enter=function(t,e){t.bubbles=!1;this.fireEvent(bo.POINTERENTER,t,e)};t.prototype.leave=function(t,e){t.bubbles=!1;this.fireEvent(bo.POINTERLEAVE,t,e)};t.prototype.over=function(t,e){t.bubbles=!0;this.fireEvent(bo.POINTEROVER,t,e)};t.prototype.out=function(t,e){t.bubbles=!0;this.fireEvent(bo.POINTEROUT,t,e)};t.prototype.cancel=function(t,e){this.fireEvent(bo.POINTERCANCEL,t,e)};t.prototype.leaveOut=function(t,e){this.out(t,e);this.contains_(t.target,t.relatedTarget)||this.leave(t,e)};t.prototype.enterOver=function(t,e){this.over(t,e);this.contains_(t.target,t.relatedTarget)||this.enter(t,e)};t.prototype.contains_=function(t,e){return!(!t||!e)&&t.contains(e)};t.prototype.makeEvent=function(t,e,i){return new hs(t,i,e)};t.prototype.fireEvent=function(t,e,i){var r=this.makeEvent(t,e,i);this.dispatchEvent(r)};t.prototype.fireNativeEvent=function(t){var e=this.makeEvent(t.type,t,t);this.dispatchEvent(e)};t.prototype.wrapMouseEvent=function(t,e){return this.makeEvent(t,Uo.prepareEvent(e,this),e)};t.prototype.disposeInternal=function(){this.unregister_();e.prototype.disposeInternal.call(this)};return t}(i),gs=function(r){function t(t,e){r.call(this);this.map_=t;this.clickTimeoutId_=0;this.dragging_=!1;this.dragListenerKeys_=[];this.moveTolerance_=e?e*Oi:Oi;this.down_=null;var i=this.map_.getViewport();this.activePointers_=0;this.trackedTouches_={};this.pointerEventHandler_=new _s(i);this.documentPointerEventHandler_=null;this.pointerdownListenerKey_=S(this.pointerEventHandler_,bo.POINTERDOWN,this.handlePointerDown_,this);this.relayedListenerKey_=S(this.pointerEventHandler_,bo.POINTERMOVE,this.relayEvent_,this)}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.emulateClick_=function(e){var t=new Po(Oo.CLICK,this.map_,e);this.dispatchEvent(t);if(0!==this.clickTimeoutId_){clearTimeout(this.clickTimeoutId_);this.clickTimeoutId_=0;t=new Po(Oo.DBLCLICK,this.map_,e);this.dispatchEvent(t)}else this.clickTimeoutId_=setTimeout(function(){this.clickTimeoutId_=0;var t=new Po(Oo.SINGLECLICK,this.map_,e);this.dispatchEvent(t)}.bind(this),250)};t.prototype.updateActivePointers_=function(t){var e=t;e.type==Oo.POINTERUP||e.type==Oo.POINTERCANCEL?delete this.trackedTouches_[e.pointerId]:e.type==Oo.POINTERDOWN&&(this.trackedTouches_[e.pointerId]=!0);this.activePointers_=Object.keys(this.trackedTouches_).length};t.prototype.handlePointerUp_=function(t){this.updateActivePointers_(t);var e=new Po(Oo.POINTERUP,this.map_,t);this.dispatchEvent(e);e.propagationStopped||this.dragging_||!this.isMouseActionButton_(t)||this.emulateClick_(this.down_);if(0===this.activePointers_){this.dragListenerKeys_.forEach(g);this.dragListenerKeys_.length=0;this.dragging_=!1;this.down_=null;this.documentPointerEventHandler_.dispose();this.documentPointerEventHandler_=null}};t.prototype.isMouseActionButton_=function(t){return 0===t.button};t.prototype.handlePointerDown_=function(t){this.updateActivePointers_(t);var e=new Po(Oo.POINTERDOWN,this.map_,t);this.dispatchEvent(e);this.down_=t;if(0===this.dragListenerKeys_.length){this.documentPointerEventHandler_=new _s(document);this.dragListenerKeys_.push(S(this.documentPointerEventHandler_,Oo.POINTERMOVE,this.handlePointerMove_,this),S(this.documentPointerEventHandler_,Oo.POINTERUP,this.handlePointerUp_,this),S(this.pointerEventHandler_,Oo.POINTERCANCEL,this.handlePointerUp_,this))}};t.prototype.handlePointerMove_=function(t){if(this.isMoving_(t)){this.dragging_=!0;var e=new Po(Oo.POINTERDRAG,this.map_,t,this.dragging_);this.dispatchEvent(e)}t.preventDefault()};t.prototype.relayEvent_=function(t){var e=!(!this.down_||!this.isMoving_(t));this.dispatchEvent(new Po(t.type,this.map_,t,e))};t.prototype.isMoving_=function(t){return this.dragging_||Math.abs(t.clientX-this.down_.clientX)>this.moveTolerance_||Math.abs(t.clientY-this.down_.clientY)>this.moveTolerance_};t.prototype.disposeInternal=function(){if(this.relayedListenerKey_){g(this.relayedListenerKey_);this.relayedListenerKey_=null}if(this.pointerdownListenerKey_){g(this.pointerdownListenerKey_);this.pointerdownListenerKey_=null}this.dragListenerKeys_.forEach(g);this.dragListenerKeys_.length=0;if(this.documentPointerEventHandler_){this.documentPointerEventHandler_.dispose();this.documentPointerEventHandler_=null}if(this.pointerEventHandler_){this.pointerEventHandler_.dispose();this.pointerEventHandler_=null}r.prototype.disposeInternal.call(this)};return t}(i),ys={POSTRENDER:"postrender",MOVESTART:"movestart",MOVEEND:"moveend"},vs={LAYERGROUP:"layergroup",SIZE:"size",TARGET:"target",VIEW:"view"},ms=function(t,e){this.priorityFunction_=t;this.keyFunction_=e;this.elements_=[];this.priorities_=[];this.queuedElements_={}};ms.prototype.clear=function(){this.elements_.length=0;this.priorities_.length=0;_(this.queuedElements_)};ms.prototype.dequeue=function(){var t=this.elements_,e=this.priorities_,i=t[0];if(1==t.length){t.length=0;e.length=0}else{t[0]=t.pop();e[0]=e.pop();this.siftUp_(0)}var r=this.keyFunction_(i);delete this.queuedElements_[r];return i};ms.prototype.enqueue=function(t){A(!(this.keyFunction_(t)in this.queuedElements_),31);var e=this.priorityFunction_(t);if(e==1/0)return!1;this.elements_.push(t);this.priorities_.push(e);this.queuedElements_[this.keyFunction_(t)]=!0;this.siftDown_(0,this.elements_.length-1);return!0};ms.prototype.getCount=function(){return this.elements_.length};ms.prototype.getLeftChildIndex_=function(t){return 2*t+1};ms.prototype.getRightChildIndex_=function(t){return 2*t+2};ms.prototype.getParentIndex_=function(t){return t-1>>1};ms.prototype.heapify_=function(){var t;for(t=(this.elements_.length>>1)-1;0<=t;t--)this.siftUp_(t)};ms.prototype.isEmpty=function(){return 0===this.elements_.length};ms.prototype.isKeyQueued=function(t){return t in this.queuedElements_};ms.prototype.isQueued=function(t){return this.isKeyQueued(this.keyFunction_(t))};ms.prototype.siftUp_=function(t){for(var e=this.elements_,i=this.priorities_,r=e.length,n=e[t],o=i[t],s=t;t<r>>1;){var a=this.getLeftChildIndex_(t),h=this.getRightChildIndex_(t),l=h<r&&i[h]<i[a]?h:a;e[t]=e[l];i[t]=i[l];t=l}e[t]=n;i[t]=o;this.siftDown_(s,t)};ms.prototype.siftDown_=function(t,e){for(var i=this.elements_,r=this.priorities_,n=i[e],o=r[e];t<e;){var s=this.getParentIndex_(e);if(!(r[s]>o))break;i[e]=i[s];r[e]=r[s];e=s}i[e]=n;r[e]=o};ms.prototype.reprioritize=function(){var t,e,i,r=this.priorityFunction_,n=this.elements_,o=this.priorities_,s=0,a=n.length;for(e=0;e<a;++e)if((i=r(t=n[e]))==1/0)delete this.queuedElements_[this.keyFunction_(t)];else{o[s]=i;n[s++]=t}n.length=s;o.length=s;this.heapify_()};var xs=function(i){function t(e,t){i.call(this,function(t){return e.apply(null,t)},function(t){return t[0].getKey()});this.tileChangeCallback_=t;this.tilesLoading_=0;this.tilesLoadingKeys_={}}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.enqueue=function(t){var e=i.prototype.enqueue.call(this,t);if(e){S(t[0],R.CHANGE,this.handleTileChange,this)}return e};t.prototype.getTilesLoading=function(){return this.tilesLoading_};t.prototype.handleTileChange=function(t){var e=t.target,i=e.getState();if(i===yo.LOADED||i===yo.ERROR||i===yo.EMPTY||i===yo.ABORT){f(e,R.CHANGE,this.handleTileChange,this);var r=e.getKey();if(r in this.tilesLoadingKeys_){delete this.tilesLoadingKeys_[r];--this.tilesLoading_}this.tileChangeCallback_()}};t.prototype.loadMoreTiles=function(t,e){for(var i,r,n,o=0,s=!1;this.tilesLoading_<t&&o<e&&0<this.getCount();){n=(r=this.dequeue()[0]).getKey();if((i=r.getState())===yo.ABORT)s=!0;else if(i===yo.IDLE&&!(n in this.tilesLoadingKeys_)){this.tilesLoadingKeys_[n]=!0;++this.tilesLoading_;++o;r.load()}}0===o&&s&&this.tileChangeCallback_()};return t}(ms),Es=42,Ts=256;function Ss(e){return function(t){return t?[Lt(t[0],e[0],e[2]),Lt(t[1],e[1],e[3])]:void 0}}function Cs(t){return t}function Rs(s){return function(t,e,i){if(void 0!==t){var r=Or(s,t,i);r=Lt(r+e,0,s.length-1);var n=Math.floor(r);if(r!=n&&n<s.length-1){var o=s[n]/s[n+1];return s[n]/Math.pow(o,r-n)}return s[n]}}}function Is(s,a,h){return function(t,e,i){if(void 0!==t){var r=-i/2+.5,n=Math.floor(Math.log(a/t)/Math.log(s)+r),o=Math.max(n+e,0);void 0!==h&&(o=Math.min(o,h));return a/Math.pow(s,o)}}}function ws(t,e){return void 0!==t?0:void 0}function Ls(t,e){return void 0!==t?t+e:void 0}function Os(t){var i=2*Math.PI/t;return function(t,e){return void 0!==t?t=Math.floor((t+e)/i+.5)*i:void 0}}function Ps(t){var i=t||Nt(5);return function(t,e){return void 0!==t?Math.abs(t+e)<=i?0:t+e:void 0}}var bs={ANIMATING:0,INTERACTING:1},Ms={CENTER:"center",RESOLUTION:"resolution",ROTATION:"rotation"},Fs=function(i){function t(t){i.call(this);var e=T({},t);this.hints_=[0,0];this.animations_=[];this.updateAnimationKey_;this.updateAnimations_=this.updateAnimations_.bind(this);this.projection_=Ee(e.projection,"EPSG:3857");this.applyOptions_(e)}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.applyOptions_=function(t){var e={};e[Ms.CENTER]=void 0!==t.center?t.center:null;var i=Ds(t);this.maxResolution_=i.maxResolution;this.minResolution_=i.minResolution;this.zoomFactor_=i.zoomFactor;this.resolutions_=t.resolutions;this.minZoom_=i.minZoom;var r=Ns(t),n=i.constraint,o=Gs(t);this.constraints_={center:r,resolution:n,rotation:o};if(void 0!==t.resolution)e[Ms.RESOLUTION]=t.resolution;else if(void 0!==t.zoom){e[Ms.RESOLUTION]=this.constrainResolution(this.maxResolution_,t.zoom-this.minZoom_);this.resolutions_&&(e[Ms.RESOLUTION]=Lt(Number(this.getResolution()||e[Ms.RESOLUTION]),this.minResolution_,this.maxResolution_))}e[Ms.ROTATION]=void 0!==t.rotation?t.rotation:0;this.setProperties(e);this.options_=t};t.prototype.getUpdatedOptions_=function(t){var e=T({},this.options_);void 0!==e.resolution?e.resolution=this.getResolution():e.zoom=this.getZoom();e.center=this.getCenter();e.rotation=this.getRotation();return T({},e,t)};t.prototype.animate=function(t){var e,i=arguments,r=arguments.length;if(1<r&&"function"==typeof arguments[r-1]){e=arguments[r-1];--r}if(this.isDef()){for(var n=Date.now(),o=this.getCenter().slice(),s=this.getResolution(),a=this.getRotation(),h=[],l=0;l<r;++l){var u=i[l],c={start:n,complete:!1,anchor:u.anchor,duration:void 0!==u.duration?u.duration:1e3,easing:u.easing||xo};if(u.center){c.sourceCenter=o;c.targetCenter=u.center;o=c.targetCenter}if(void 0!==u.zoom){c.sourceResolution=s;c.targetResolution=this.constrainResolution(this.maxResolution_,u.zoom-this.minZoom_,0);s=c.targetResolution}else if(u.resolution){c.sourceResolution=s;c.targetResolution=u.resolution;s=c.targetResolution}if(void 0!==u.rotation){c.sourceRotation=a;var p=Dt(u.rotation-a+Math.PI,2*Math.PI)-Math.PI;c.targetRotation=a+p;a=c.targetRotation}c.callback=e;ks(c)?c.complete=!0:n+=c.duration;h.push(c)}this.animations_.push(h);this.setHint(bs.ANIMATING,1);this.updateAnimations_()}else{var d=arguments[r-1];d.center&&this.setCenter(d.center);void 0!==d.zoom&&this.setZoom(d.zoom);void 0!==d.rotation&&this.setRotation(d.rotation);e&&As(e,!0)}};t.prototype.getAnimating=function(){return 0<this.hints_[bs.ANIMATING]};t.prototype.getInteracting=function(){return 0<this.hints_[bs.INTERACTING]};t.prototype.cancelAnimations=function(){this.setHint(bs.ANIMATING,-this.hints_[bs.ANIMATING]);for(var t=0,e=this.animations_.length;t<e;++t){var i=this.animations_[t];i[0].callback&&As(i[0].callback,!1)}this.animations_.length=0};t.prototype.updateAnimations_=function(){var t=this;if(void 0!==this.updateAnimationKey_){cancelAnimationFrame(this.updateAnimationKey_);this.updateAnimationKey_=void 0}if(this.getAnimating()){for(var e=Date.now(),i=!1,r=this.animations_.length-1;0<=r;--r){for(var n=t.animations_[r],o=!0,s=0,a=n.length;s<a;++s){var h=n[s];if(!h.complete){var l=e-h.start,u=0<h.duration?l/h.duration:1;if(1<=u){h.complete=!0;u=1}else o=!1;var c=h.easing(u);if(h.sourceCenter){var p=h.sourceCenter[0],d=h.sourceCenter[1],f=p+c*(h.targetCenter[0]-p),_=d+c*(h.targetCenter[1]-d);t.set(Ms.CENTER,[f,_])}if(h.sourceResolution&&h.targetResolution){var g=1===c?h.targetResolution:h.sourceResolution+c*(h.targetResolution-h.sourceResolution);h.anchor&&t.set(Ms.CENTER,t.calculateCenterZoom(g,h.anchor));t.set(Ms.RESOLUTION,g)}if(void 0!==h.sourceRotation&&void 0!==h.targetRotation){var y=1===c?Dt(h.targetRotation+Math.PI,2*Math.PI)-Math.PI:h.sourceRotation+c*(h.targetRotation-h.sourceRotation);h.anchor&&t.set(Ms.CENTER,t.calculateCenterRotate(y,h.anchor));t.set(Ms.ROTATION,y)}i=!0;if(!h.complete)break}}if(o){t.animations_[r]=null;t.setHint(bs.ANIMATING,-1);var v=n[0].callback;v&&As(v,!0)}}this.animations_=this.animations_.filter(Boolean);i&&void 0===this.updateAnimationKey_&&(this.updateAnimationKey_=requestAnimationFrame(this.updateAnimations_))}};t.prototype.calculateCenterRotate=function(t,e){var i,r=this.getCenter();if(void 0!==r){Hn(i=[r[0]-e[0],r[1]-e[1]],t-this.getRotation());Yn(i,e)}return i};t.prototype.calculateCenterZoom=function(t,e){var i,r=this.getCenter(),n=this.getResolution();if(void 0!==r&&void 0!==n){i=[e[0]-t*(e[0]-r[0])/n,e[1]-t*(e[1]-r[1])/n]}return i};t.prototype.getSizeFromViewport_=function(){var t=[100,100],e='.ol-viewport[data-view="'+St(this)+'"]',i=document.querySelector(e);if(i){var r=getComputedStyle(i);t[0]=parseInt(r.width,10);t[1]=parseInt(r.height,10)}return t};t.prototype.constrainCenter=function(t){return this.constraints_.center(t)};t.prototype.constrainResolution=function(t,e,i){var r=e||0,n=i||0;return this.constraints_.resolution(t,r,n)};t.prototype.constrainRotation=function(t,e){var i=e||0;return this.constraints_.rotation(t,i)};t.prototype.getCenter=function(){return this.get(Ms.CENTER)};t.prototype.getConstraints=function(){return this.constraints_};t.prototype.getHints=function(t){if(void 0===t)return this.hints_.slice();t[0]=this.hints_[0];t[1]=this.hints_[1];return t};t.prototype.calculateExtent=function(t){var e=t||this.getSizeFromViewport_(),i=this.getCenter();A(i,1);var r=this.getResolution();A(void 0!==r,2);var n=this.getRotation();A(void 0!==n,3);return ut(i,r,n,e)};t.prototype.getMaxResolution=function(){return this.maxResolution_};t.prototype.getMinResolution=function(){return this.minResolution_};t.prototype.getMaxZoom=function(){return this.getZoomForResolution(this.minResolution_)};t.prototype.setMaxZoom=function(t){this.applyOptions_(this.getUpdatedOptions_({maxZoom:t}))};t.prototype.getMinZoom=function(){return this.getZoomForResolution(this.maxResolution_)};t.prototype.setMinZoom=function(t){this.applyOptions_(this.getUpdatedOptions_({minZoom:t}))};t.prototype.getProjection=function(){return this.projection_};t.prototype.getResolution=function(){return this.get(Ms.RESOLUTION)};t.prototype.getResolutions=function(){return this.resolutions_};t.prototype.getResolutionForExtent=function(t,e){var i=e||this.getSizeFromViewport_(),r=_t(t)/i[0],n=ct(t)/i[1];return Math.max(r,n)};t.prototype.getResolutionForValueFunction=function(t){var e=t||2,i=this.maxResolution_,r=this.minResolution_,n=Math.log(i/r)/Math.log(e);return function(t){return i/Math.pow(e,t*n)}};t.prototype.getRotation=function(){return this.get(Ms.ROTATION)};t.prototype.getValueForResolutionFunction=function(t){var e=t||2,i=this.maxResolution_,r=this.minResolution_,n=Math.log(i/r)/Math.log(e);return function(t){return Math.log(i/t)/Math.log(e)/n}};t.prototype.getState=function(t){var e=this.getCenter(),i=this.getProjection(),r=this.getResolution(),n=r/t,o=this.getRotation();return{center:[Math.round(e[0]/n)*n,Math.round(e[1]/n)*n],projection:void 0!==i?i:null,resolution:r,rotation:o,zoom:this.getZoom()}};t.prototype.getZoom=function(){var t,e=this.getResolution();void 0!==e&&(t=this.getZoomForResolution(e));return t};t.prototype.getZoomForResolution=function(t){var e,i,r=this.minZoom_||0;if(this.resolutions_){var n=Or(this.resolutions_,t,1);r=n;e=this.resolutions_[n];i=n==this.resolutions_.length-1?2:e/this.resolutions_[n+1]}else{e=this.maxResolution_;i=this.zoomFactor_}return r+Math.log(e/t)/Math.log(i)};t.prototype.getResolutionForZoom=function(t){return this.constrainResolution(this.maxResolution_,t-this.minZoom_,0)};t.prototype.fit=function(t,e){var i,r=e||{},n=r.size;n||(n=this.getSizeFromViewport_());if(t instanceof jr)t.getType()===kt.CIRCLE?(i=Nn(t=t.getExtent())).rotate(this.getRotation(),ht(t)):i=t;else{A(Array.isArray(t),24);A(!gt(t),25);i=Nn(t)}var o,s=void 0!==r.padding?r.padding:[0,0,0,0],a=void 0===r.constrainResolution||r.constrainResolution,h=void 0!==r.nearest&&r.nearest;o=void 0!==r.minResolution?r.minResolution:void 0!==r.maxZoom?this.constrainResolution(this.maxResolution_,r.maxZoom-this.minZoom_,0):0;for(var l=i.getFlatCoordinates(),u=this.getRotation(),c=Math.cos(-u),p=Math.sin(-u),d=1/0,f=1/0,_=-1/0,g=-1/0,y=i.getStride(),v=0,m=l.length;v<m;v+=y){var x=l[v]*c-l[v+1]*p,E=l[v]*p+l[v+1]*c;d=Math.min(d,x);f=Math.min(f,E);_=Math.max(_,x);g=Math.max(g,E)}var T=this.getResolutionForExtent([d,f,_,g],[n[0]-s[1]-s[3],n[1]-s[0]-s[2]]);T=isNaN(T)?o:Math.max(T,o);if(a){var S=this.constrainResolution(T,0,0);!h&&S<T&&(S=this.constrainResolution(S,-1,0));T=S}p=-p;var C=(d+_)/2,R=(f+g)/2,I=[(C+=(s[1]-s[3])/2*T)*c-(R+=(s[0]-s[2])/2*T)*p,R*c+C*p],w=r.callback?r.callback:L;if(void 0!==r.duration)this.animate({resolution:T,center:I,duration:r.duration,easing:r.easing},w);else{this.setResolution(T);this.setCenter(I);As(w,!0)}};t.prototype.centerOn=function(t,e,i){var r=this.getRotation(),n=Math.cos(-r),o=Math.sin(-r),s=t[0]*n-t[1]*o,a=t[1]*n+t[0]*o,h=this.getResolution(),l=(s+=(e[0]/2-i[0])*h)*n-(a+=(i[1]-e[1]/2)*h)*(o=-o),u=a*n+s*o;this.setCenter([l,u])};t.prototype.isDef=function(){return!!this.getCenter()&&void 0!==this.getResolution()};t.prototype.rotate=function(t,e){if(void 0!==e){var i=this.calculateCenterRotate(t,e);this.setCenter(i)}this.setRotation(t)};t.prototype.setCenter=function(t){this.set(Ms.CENTER,t);this.getAnimating()&&this.cancelAnimations()};t.prototype.setHint=function(t,e){this.hints_[t]+=e;this.changed();return this.hints_[t]};t.prototype.setResolution=function(t){this.set(Ms.RESOLUTION,t);this.getAnimating()&&this.cancelAnimations()};t.prototype.setRotation=function(t){this.set(Ms.ROTATION,t);this.getAnimating()&&this.cancelAnimations()};t.prototype.setZoom=function(t){this.setResolution(this.getResolutionForZoom(t))};return t}(w);function As(t,e){setTimeout(function(){t(e)},0)}function Ns(t){return void 0!==t.extent?Ss(t.extent):Cs}function Ds(t){var e,i,r,n=void 0!==t.minZoom?t.minZoom:0,o=void 0!==t.maxZoom?t.maxZoom:28,s=void 0!==t.zoomFactor?t.zoomFactor:2;if(void 0!==t.resolutions){var a=t.resolutions;i=a[n];r=void 0!==a[o]?a[o]:a[a.length-1];e=Rs(a)}else{var h=Ee(t.projection,"EPSG:3857"),l=h.getExtent(),u=(l?Math.max(_t(l),ct(l)):360*zt[Xt.DEGREES]/h.getMetersPerUnit())/Ts/Math.pow(2,0),c=u/Math.pow(2,28);void 0!==(i=t.maxResolution)?n=0:i=u/Math.pow(s,n);void 0===(r=t.minResolution)&&(r=void 0!==t.maxZoom?void 0!==t.maxResolution?i/Math.pow(s,o):u/Math.pow(s,o):c);o=n+Math.floor(Math.log(i/r)/Math.log(s));r=i/Math.pow(s,o-n);e=Is(s,i,o-n)}return{constraint:e,maxResolution:i,minResolution:r,minZoom:n,zoomFactor:s}}function Gs(t){if(void 0===t.enableRotation||t.enableRotation){var e=t.constrainRotation;return void 0===e||!0===e?Ps():!1===e?Ls:"number"==typeof e?Os(e):Ls}return ws}function ks(t){return!(t.sourceCenter&&t.targetCenter&&!Wn(t.sourceCenter,t.targetCenter))&&(t.sourceResolution===t.targetResolution&&t.sourceRotation===t.targetRotation)}var js={OPACITY:"opacity",VISIBLE:"visible",EXTENT:"extent",Z_INDEX:"zIndex",MAX_RESOLUTION:"maxResolution",MIN_RESOLUTION:"minResolution",SOURCE:"source"},Us=function(i){function t(t){i.call(this);var e=T({},t);e[js.OPACITY]=void 0!==t.opacity?t.opacity:1;e[js.VISIBLE]=void 0===t.visible||t.visible;e[js.Z_INDEX]=t.zIndex;e[js.MAX_RESOLUTION]=void 0!==t.maxResolution?t.maxResolution:1/0;e[js.MIN_RESOLUTION]=void 0!==t.minResolution?t.minResolution:0;this.setProperties(e);this.state_={layer:this,managed:!0};this.type}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getType=function(){return this.type};t.prototype.getLayerState=function(){this.state_.opacity=Lt(this.getOpacity(),0,1);this.state_.sourceState=this.getSourceState();this.state_.visible=this.getVisible();this.state_.extent=this.getExtent();this.state_.zIndex=this.getZIndex()||0;this.state_.maxResolution=this.getMaxResolution();this.state_.minResolution=Math.max(this.getMinResolution(),0);return this.state_};t.prototype.getLayersArray=function(t){};t.prototype.getLayerStatesArray=function(t){};t.prototype.getExtent=function(){return this.get(js.EXTENT)};t.prototype.getMaxResolution=function(){return this.get(js.MAX_RESOLUTION)};t.prototype.getMinResolution=function(){return this.get(js.MIN_RESOLUTION)};t.prototype.getOpacity=function(){return this.get(js.OPACITY)};t.prototype.getSourceState=function(){};t.prototype.getVisible=function(){return this.get(js.VISIBLE)};t.prototype.getZIndex=function(){return this.get(js.Z_INDEX)};t.prototype.setExtent=function(t){this.set(js.EXTENT,t)};t.prototype.setMaxResolution=function(t){this.set(js.MAX_RESOLUTION,t)};t.prototype.setMinResolution=function(t){this.set(js.MIN_RESOLUTION,t)};t.prototype.setOpacity=function(t){this.set(js.OPACITY,t)};t.prototype.setVisible=function(t){this.set(js.VISIBLE,t)};t.prototype.setZIndex=function(t){this.set(js.Z_INDEX,t)};return t}(w),Ys={UNDEFINED:"undefined",LOADING:"loading",READY:"ready",ERROR:"error"},Bs="layers",Vs=function(n){function t(t){var e=t||{},i=T({},e);delete i.layers;var r=e.layers;n.call(this,i);this.layersListenerKeys_=[];this.listenerKeys_={};S(this,P(Bs),this.handleLayersChanged_,this);if(r)if(Array.isArray(r))r=new F(r.slice(),{unique:!0});else{A(r instanceof F,43);r=r}else r=new F(void 0,{unique:!0});this.setLayers(r)}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.handleLayerChange_=function(){this.changed()};t.prototype.handleLayersChanged_=function(){this.layersListenerKeys_.forEach(g);this.layersListenerKeys_.length=0;var t=this.getLayers();this.layersListenerKeys_.push(S(t,a.ADD,this.handleLayersAdd_,this),S(t,a.REMOVE,this.handleLayersRemove_,this));for(var e in this.listenerKeys_)this.listenerKeys_[e].forEach(g);_(this.listenerKeys_);for(var i=t.getArray(),r=0,n=i.length;r<n;r++){var o=i[r];this.listenerKeys_[St(o).toString()]=[S(o,h.PROPERTYCHANGE,this.handleLayerChange_,this),S(o,R.CHANGE,this.handleLayerChange_,this)]}this.changed()};t.prototype.handleLayersAdd_=function(t){var e=t.element,i=St(e).toString();this.listenerKeys_[i]=[S(e,h.PROPERTYCHANGE,this.handleLayerChange_,this),S(e,R.CHANGE,this.handleLayerChange_,this)];this.changed()};t.prototype.handleLayersRemove_=function(t){var e=St(t.element).toString();this.listenerKeys_[e].forEach(g);delete this.listenerKeys_[e];this.changed()};t.prototype.getLayers=function(){return this.get(Bs)};t.prototype.setLayers=function(t){this.set(Bs,t)};t.prototype.getLayersArray=function(t){var e=void 0!==t?t:[];this.getLayers().forEach(function(t){t.getLayersArray(e)});return e};t.prototype.getLayerStatesArray=function(t){var e=void 0!==t?t:[],i=e.length;this.getLayers().forEach(function(t){t.getLayerStatesArray(e)});for(var r=this.getLayerState(),n=i,o=e.length;n<o;n++){var s=e[n];s.opacity*=r.opacity;s.visible=s.visible&&r.visible;s.maxResolution=Math.min(s.maxResolution,r.maxResolution);s.minResolution=Math.max(s.minResolution,r.minResolution);void 0!==r.extent&&(void 0!==s.extent?s.extent=pt(s.extent,r.extent):s.extent=r.extent)}return e};t.prototype.getSourceState=function(){return Ys.READY};return t}(Us);function Xs(t,e,i){void 0===i&&(i=[0,0]);i[0]=t[0]+2*e;i[1]=t[1]+2*e;return i}function zs(t){return 0<t[0]&&0<t[1]}function Ws(t,e,i){void 0===i&&(i=[0,0]);i[0]=t[0]*e+.5|0;i[1]=t[1]*e+.5|0;return i}function Hs(t,e){if(Array.isArray(t))return t;void 0===e?e=[t,t]:e[0]=e[1]=t;return e}var Ks=function(s){function t(t){s.call(this);var e=function(t){var e=null;void 0!==t.keyboardEventTarget&&(e="string"==typeof t.keyboardEventTarget?document.getElementById(t.keyboardEventTarget):t.keyboardEventTarget);var i,r,n,o={},s=t.layers instanceof Vs?t.layers:new Vs({layers:t.layers});o[vs.LAYERGROUP]=s;o[vs.TARGET]=t.target;o[vs.VIEW]=void 0!==t.view?t.view:new Fs;if(void 0!==t.controls)if(Array.isArray(t.controls))i=new F(t.controls.slice());else{A(t.controls instanceof F,47);i=t.controls}if(void 0!==t.interactions)if(Array.isArray(t.interactions))r=new F(t.interactions.slice());else{A(t.interactions instanceof F,48);r=t.interactions}if(void 0!==t.overlays)if(Array.isArray(t.overlays))n=new F(t.overlays.slice());else{A(t.overlays instanceof F,49);n=t.overlays}else n=new F;return{controls:i,interactions:r,keyboardEventTarget:e,overlays:n,values:o}}(t);this.maxTilesLoading_=void 0!==t.maxTilesLoading?t.maxTilesLoading:16;this.loadTilesWhileAnimating_=void 0!==t.loadTilesWhileAnimating&&t.loadTilesWhileAnimating;this.loadTilesWhileInteracting_=void 0!==t.loadTilesWhileInteracting&&t.loadTilesWhileInteracting;this.pixelRatio_=void 0!==t.pixelRatio?t.pixelRatio:Oi;this.animationDelayKey_;this.animationDelay_=function(){this.animationDelayKey_=void 0;this.renderFrame_.call(this,Date.now())}.bind(this);this.coordinateToPixelTransform_=[1,0,0,1,0,0];this.pixelToCoordinateTransform_=[1,0,0,1,0,0];this.frameIndex_=0;this.frameState_=null;this.previousExtent_=null;this.viewPropertyListenerKey_=null;this.viewChangeListenerKey_=null;this.layerGroupPropertyListenerKeys_=null;this.viewport_=document.createElement("div");this.viewport_.className="ol-viewport"+(Mi?" ol-touch":"");this.viewport_.style.position="relative";this.viewport_.style.overflow="hidden";this.viewport_.style.width="100%";this.viewport_.style.height="100%";this.viewport_.style.msTouchAction="none";this.viewport_.style.touchAction="none";this.overlayContainer_=document.createElement("div");this.overlayContainer_.className="ol-overlaycontainer";this.viewport_.appendChild(this.overlayContainer_);this.overlayContainerStopEvent_=document.createElement("div");this.overlayContainerStopEvent_.className="ol-overlaycontainer-stopevent";for(var i=[R.CLICK,R.DBLCLICK,R.MOUSEDOWN,R.TOUCHSTART,R.MSPOINTERDOWN,Oo.POINTERDOWN,R.MOUSEWHEEL,R.WHEEL],r=0,n=i.length;r<n;++r)S(this.overlayContainerStopEvent_,i[r],E);this.viewport_.appendChild(this.overlayContainerStopEvent_);this.mapBrowserEventHandler_=new gs(this,t.moveTolerance);for(var o in Oo)S(this.mapBrowserEventHandler_,Oo[o],this.handleMapBrowserEvent,this);this.keyboardEventTarget_=e.keyboardEventTarget;this.keyHandlerKeys_=null;S(this.viewport_,R.CONTEXTMENU,this.handleBrowserEvent,this);S(this.viewport_,R.WHEEL,this.handleBrowserEvent,this);S(this.viewport_,R.MOUSEWHEEL,this.handleBrowserEvent,this);this.controls=e.controls||new F;this.interactions=e.interactions||new F;this.overlays_=e.overlays;this.overlayIdIndex_={};this.renderer_=this.createRenderer();this.handleResize_;this.focus_=null;this.postRenderFunctions_=[];this.tileQueue_=new xs(this.getTilePriority.bind(this),this.handleTileChange_.bind(this));this.skippedFeatureUids_={};S(this,P(vs.LAYERGROUP),this.handleLayerGroupChanged_,this);S(this,P(vs.VIEW),this.handleViewChanged_,this);S(this,P(vs.SIZE),this.handleSizeChanged_,this);S(this,P(vs.TARGET),this.handleTargetChanged_,this);this.setProperties(e.values);this.controls.forEach(function(t){t.setMap(this)}.bind(this));S(this.controls,a.ADD,function(t){t.element.setMap(this)},this);S(this.controls,a.REMOVE,function(t){t.element.setMap(null)},this);this.interactions.forEach(function(t){t.setMap(this)}.bind(this));S(this.interactions,a.ADD,function(t){t.element.setMap(this)},this);S(this.interactions,a.REMOVE,function(t){t.element.setMap(null)},this);this.overlays_.forEach(this.addOverlayInternal_.bind(this));S(this.overlays_,a.ADD,function(t){this.addOverlayInternal_(t.element)},this);S(this.overlays_,a.REMOVE,function(t){var e=t.element.getId();void 0!==e&&delete this.overlayIdIndex_[e.toString()];t.element.setMap(null)},this)}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.createRenderer=function(){throw new Error("Use a map type that has a createRenderer method")};t.prototype.addControl=function(t){this.getControls().push(t)};t.prototype.addInteraction=function(t){this.getInteractions().push(t)};t.prototype.addLayer=function(t){this.getLayerGroup().getLayers().push(t)};t.prototype.addOverlay=function(t){this.getOverlays().push(t)};t.prototype.addOverlayInternal_=function(t){var e=t.getId();void 0!==e&&(this.overlayIdIndex_[e.toString()]=t);t.setMap(this)};t.prototype.disposeInternal=function(){this.mapBrowserEventHandler_.dispose();f(this.viewport_,R.CONTEXTMENU,this.handleBrowserEvent,this);f(this.viewport_,R.WHEEL,this.handleBrowserEvent,this);f(this.viewport_,R.MOUSEWHEEL,this.handleBrowserEvent,this);if(void 0!==this.handleResize_){removeEventListener(R.RESIZE,this.handleResize_,!1);this.handleResize_=void 0}if(this.animationDelayKey_){cancelAnimationFrame(this.animationDelayKey_);this.animationDelayKey_=void 0}this.setTarget(null);s.prototype.disposeInternal.call(this)};t.prototype.forEachFeatureAtPixel=function(t,e,i){if(this.frameState_){var r=this.getCoordinateFromPixel(t),n=void 0!==(i=void 0!==i?i:{}).hitTolerance?i.hitTolerance*this.frameState_.pixelRatio:0,o=void 0!==i.layerFilter?i.layerFilter:v;return this.renderer_.forEachFeatureAtCoordinate(r,this.frameState_,n,e,null,o,null)}};t.prototype.getFeaturesAtPixel=function(t,e){var i=null;this.forEachFeatureAtPixel(t,function(t){i||(i=[]);i.push(t)},e);return i};t.prototype.forEachLayerAtPixel=function(t,e,i){if(this.frameState_){var r=i||{},n=void 0!==r.hitTolerance?i.hitTolerance*this.frameState_.pixelRatio:0,o=r.layerFilter||v;return this.renderer_.forEachLayerAtPixel(t,this.frameState_,n,e,null,o,null)}};t.prototype.hasFeatureAtPixel=function(t,e){if(!this.frameState_)return!1;var i=this.getCoordinateFromPixel(t),r=void 0!==(e=void 0!==e?e:{}).layerFilter?e.layerFilter:v,n=void 0!==e.hitTolerance?e.hitTolerance*this.frameState_.pixelRatio:0;return this.renderer_.hasFeatureAtCoordinate(i,this.frameState_,n,r,null)};t.prototype.getEventCoordinate=function(t){return this.getCoordinateFromPixel(this.getEventPixel(t))};t.prototype.getEventPixel=function(t){var e=this.viewport_.getBoundingClientRect(),i=t.changedTouches?t.changedTouches[0]:t;return[i.clientX-e.left,i.clientY-e.top]};t.prototype.getTarget=function(){return this.get(vs.TARGET)};t.prototype.getTargetElement=function(){var t=this.getTarget();return void 0!==t?"string"==typeof t?document.getElementById(t):t:null};t.prototype.getCoordinateFromPixel=function(t){var e=this.frameState_;return e?De(e.pixelToCoordinateTransform,t.slice()):null};t.prototype.getControls=function(){return this.controls};t.prototype.getOverlays=function(){return this.overlays_};t.prototype.getOverlayById=function(t){var e=this.overlayIdIndex_[t.toString()];return void 0!==e?e:null};t.prototype.getInteractions=function(){return this.interactions};t.prototype.getLayerGroup=function(){return this.get(vs.LAYERGROUP)};t.prototype.getLayers=function(){return this.getLayerGroup().getLayers()};t.prototype.getPixelFromCoordinate=function(t){var e=this.frameState_;return e?De(e.coordinateToPixelTransform,t.slice(0,2)):null};t.prototype.getRenderer=function(){return this.renderer_};t.prototype.getSize=function(){return this.get(vs.SIZE)};t.prototype.getView=function(){return this.get(vs.VIEW)};t.prototype.getViewport=function(){return this.viewport_};t.prototype.getOverlayContainer=function(){return this.overlayContainer_};t.prototype.getOverlayContainerStopEvent=function(){return this.overlayContainerStopEvent_};t.prototype.getTilePriority=function(t,e,i,r){var n=this.frameState_;if(!(n&&e in n.wantedTiles))return 1/0;if(!n.wantedTiles[e][t.getKey()])return 1/0;var o=i[0]-n.focus[0],s=i[1]-n.focus[1];return 65536*Math.log(r)+Math.sqrt(o*o+s*s)/r};t.prototype.handleBrowserEvent=function(t,e){var i=e||t.type,r=new Lo(i,this,t);this.handleMapBrowserEvent(r)};t.prototype.handleMapBrowserEvent=function(t){if(this.frameState_){this.focus_=t.coordinate;t.frameState=this.frameState_;var e=this.getInteractions().getArray();if(!1!==this.dispatchEvent(t))for(var i=e.length-1;0<=i;i--){var r=e[i];if(r.getActive()){if(!r.handleEvent(t))break}}}};t.prototype.handlePostRender=function(){var t=this.frameState_,e=this.tileQueue_;if(!e.isEmpty()){var i=this.maxTilesLoading_,r=i;if(t){var n=t.viewHints;if(n[bs.ANIMATING]){i=this.loadTilesWhileAnimating_?8:0;r=2}if(n[bs.INTERACTING]){i=this.loadTilesWhileInteracting_?8:0;r=2}}if(e.getTilesLoading()<i){e.reprioritize();e.loadMoreTiles(i,r)}}!t||!this.hasListener(ys.RENDERCOMPLETE)||t.animate||this.tileQueue_.getTilesLoading()||function t(e){for(var i=0,r=e.length;i<r;++i){var n=e[i];if(n instanceof Vs)return t(n.getLayers().getArray());var o=e[i].getSource();if(o&&o.loading)return!0}return!1}(this.getLayers().getArray())||this.renderer_.dispatchRenderEvent(ao.RENDERCOMPLETE,t);for(var o=this.postRenderFunctions_,s=0,a=o.length;s<a;++s)o[s](this,t);o.length=0};t.prototype.handleSizeChanged_=function(){this.render()};t.prototype.handleTargetChanged_=function(){var t;this.getTarget()&&(t=this.getTargetElement());if(this.keyHandlerKeys_){for(var e=0,i=this.keyHandlerKeys_.length;e<i;++e)g(this.keyHandlerKeys_[e]);this.keyHandlerKeys_=null}if(t){t.appendChild(this.viewport_);var r=this.keyboardEventTarget_?this.keyboardEventTarget_:t;this.keyHandlerKeys_=[S(r,R.KEYDOWN,this.handleBrowserEvent,this),S(r,R.KEYPRESS,this.handleBrowserEvent,this)];if(!this.handleResize_){this.handleResize_=this.updateSize.bind(this);addEventListener(R.RESIZE,this.handleResize_,!1)}}else{this.renderer_.removeLayerRenderers();si(this.viewport_);if(void 0!==this.handleResize_){removeEventListener(R.RESIZE,this.handleResize_,!1);this.handleResize_=void 0}}this.updateSize()};t.prototype.handleTileChange_=function(){this.render()};t.prototype.handleViewPropertyChanged_=function(){this.render()};t.prototype.handleViewChanged_=function(){if(this.viewPropertyListenerKey_){g(this.viewPropertyListenerKey_);this.viewPropertyListenerKey_=null}if(this.viewChangeListenerKey_){g(this.viewChangeListenerKey_);this.viewChangeListenerKey_=null}var t=this.getView();if(t){this.viewport_.setAttribute("data-view",St(t));this.viewPropertyListenerKey_=S(t,h.PROPERTYCHANGE,this.handleViewPropertyChanged_,this);this.viewChangeListenerKey_=S(t,R.CHANGE,this.handleViewPropertyChanged_,this)}this.render()};t.prototype.handleLayerGroupChanged_=function(){if(this.layerGroupPropertyListenerKeys_){this.layerGroupPropertyListenerKeys_.forEach(g);this.layerGroupPropertyListenerKeys_=null}var t=this.getLayerGroup();t&&(this.layerGroupPropertyListenerKeys_=[S(t,h.PROPERTYCHANGE,this.render,this),S(t,R.CHANGE,this.render,this)]);this.render()};t.prototype.isRendered=function(){return!!this.frameState_};t.prototype.renderSync=function(){this.animationDelayKey_&&cancelAnimationFrame(this.animationDelayKey_);this.animationDelay_()};t.prototype.render=function(){void 0===this.animationDelayKey_&&(this.animationDelayKey_=requestAnimationFrame(this.animationDelay_))};t.prototype.removeControl=function(t){return this.getControls().remove(t)};t.prototype.removeInteraction=function(t){return this.getInteractions().remove(t)};t.prototype.removeLayer=function(t){return this.getLayerGroup().getLayers().remove(t)};t.prototype.removeOverlay=function(t){return this.getOverlays().remove(t)};t.prototype.renderFrame_=function(t){var e,i=this.getSize(),r=this.getView(),n=[1/0,1/0,-1/0,-1/0],o=this.frameState_,s=null;if(void 0!==i&&zs(i)&&r&&r.isDef()){for(var a=r.getHints(this.frameState_?this.frameState_.viewHints:void 0),h=this.getLayerGroup().getLayerStatesArray(),l={},u=0,c=h.length;u<c;++u)l[St(h[u].layer)]=h[u];e=r.getState(this.pixelRatio_);s={animate:!1,coordinateToPixelTransform:this.coordinateToPixelTransform_,extent:n,focus:this.focus_?this.focus_:e.center,index:this.frameIndex_++,layerStates:l,layerStatesArray:h,pixelRatio:this.pixelRatio_,pixelToCoordinateTransform:this.pixelToCoordinateTransform_,postRenderFunctions:[],size:i,skippedFeatureUids:this.skippedFeatureUids_,tileQueue:this.tileQueue_,time:t,usedTiles:{},viewState:e,viewHints:a,wantedTiles:{}}}s&&(s.extent=ut(e.center,e.resolution,e.rotation,s.size,n));this.frameState_=s;this.renderer_.renderFrame(s);if(s){s.animate&&this.render();Array.prototype.push.apply(this.postRenderFunctions_,s.postRenderFunctions);if(o){if(!this.previousExtent_||!gt(this.previousExtent_)&&!$(s.extent,this.previousExtent_)){this.dispatchEvent(new wo(ys.MOVESTART,this,o));this.previousExtent_=W(this.previousExtent_)}}if(this.previousExtent_&&!s.viewHints[bs.ANIMATING]&&!s.viewHints[bs.INTERACTING]&&!$(s.extent,this.previousExtent_)){this.dispatchEvent(new wo(ys.MOVEEND,this,s));j(s.extent,this.previousExtent_)}}this.dispatchEvent(new wo(ys.POSTRENDER,this,s));setTimeout(this.handlePostRender.bind(this),0)};t.prototype.setLayerGroup=function(t){this.set(vs.LAYERGROUP,t)};t.prototype.setSize=function(t){this.set(vs.SIZE,t)};t.prototype.setTarget=function(t){this.set(vs.TARGET,t)};t.prototype.setView=function(t){this.set(vs.VIEW,t)};t.prototype.skipFeature=function(t){var e=St(t).toString();this.skippedFeatureUids_[e]=!0;this.render()};t.prototype.updateSize=function(){var t=this.getTargetElement();if(t){var e=getComputedStyle(t);this.setSize([t.offsetWidth-parseFloat(e.borderLeftWidth)-parseFloat(e.paddingLeft)-parseFloat(e.paddingRight)-parseFloat(e.borderRightWidth),t.offsetHeight-parseFloat(e.borderTopWidth)-parseFloat(e.paddingTop)-parseFloat(e.paddingBottom)-parseFloat(e.borderBottomWidth)])}else this.setSize(void 0)};t.prototype.unskipFeature=function(t){var e=St(t).toString();delete this.skippedFeatureUids_[e];this.render()};return t}(w);var Zs=function(e){function t(t){e.call(this);this.element=t.element?t.element:null;this.target_=null;this.map_=null;this.listenerKeys=[];this.render=t.render?t.render:L;t.target&&this.setTarget(t.target)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.disposeInternal=function(){si(this.element);e.prototype.disposeInternal.call(this)};t.prototype.getMap=function(){return this.map_};t.prototype.setMap=function(t){this.map_&&si(this.element);for(var e=0,i=this.listenerKeys.length;e<i;++e)g(this.listenerKeys[e]);this.listenerKeys.length=0;this.map_=t;if(this.map_){(this.target_?this.target_:t.getOverlayContainerStopEvent()).appendChild(this.element);this.render!==L&&this.listenerKeys.push(S(t,ys.POSTRENDER,this.render,this));t.render()}};t.prototype.setTarget=function(t){this.target_="string"==typeof t?document.getElementById(t):t};return t}(w),qs=function(r){function t(t){var e=T({},t);delete e.source;r.call(this,e);this.mapPrecomposeKey_=null;this.mapRenderKey_=null;this.sourceChangeKey_=null;t.map&&this.setMap(t.map);S(this,P(js.SOURCE),this.handleSourcePropertyChange_,this);var i=t.source?t.source:null;this.setSource(i)}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.getLayersArray=function(t){var e=t||[];e.push(this);return e};t.prototype.getLayerStatesArray=function(t){var e=t||[];e.push(this.getLayerState());return e};t.prototype.getSource=function(){return this.get(js.SOURCE)||null};t.prototype.getSourceState=function(){var t=this.getSource();return t?t.getState():Ys.UNDEFINED};t.prototype.handleSourceChange_=function(){this.changed()};t.prototype.handleSourcePropertyChange_=function(){if(this.sourceChangeKey_){g(this.sourceChangeKey_);this.sourceChangeKey_=null}var t=this.getSource();t&&(this.sourceChangeKey_=S(t,R.CHANGE,this.handleSourceChange_,this));this.changed()};t.prototype.setMap=function(t){if(this.mapPrecomposeKey_){g(this.mapPrecomposeKey_);this.mapPrecomposeKey_=null}t||this.changed();if(this.mapRenderKey_){g(this.mapRenderKey_);this.mapRenderKey_=null}if(t){this.mapPrecomposeKey_=S(t,ao.PRECOMPOSE,function(t){var e=this.getLayerState();e.managed=!1;void 0===this.getZIndex()&&(e.zIndex=1/0);t.frameState.layerStatesArray.push(e);t.frameState.layerStates[St(this)]=e},this);this.mapRenderKey_=S(this,R.CHANGE,t.render,t);this.changed()}};t.prototype.setSource=function(t){this.set(js.SOURCE,t)};return t}(Us);function Js(t,e){return t.visible&&e>=t.minResolution&&e<t.maxResolution}var Qs=function(u){function t(t){var e=t||{};u.call(this,{element:document.createElement("div"),render:e.render||$s,target:e.target});this.ulElement_=document.createElement("ul");this.collapsed_=void 0===e.collapsed||e.collapsed;this.collapsible_=void 0===e.collapsible||e.collapsible;this.collapsible_||(this.collapsed_=!1);var i=void 0!==e.className?e.className:"ol-attribution",r=void 0!==e.tipLabel?e.tipLabel:"Attributions",n=void 0!==e.collapseLabel?e.collapseLabel:"»";if("string"==typeof n){this.collapseLabel_=document.createElement("span");this.collapseLabel_.textContent=n}else this.collapseLabel_=n;var o=void 0!==e.label?e.label:"i";if("string"==typeof o){this.label_=document.createElement("span");this.label_.textContent=o}else this.label_=o;var s=this.collapsible_&&!this.collapsed_?this.collapseLabel_:this.label_,a=document.createElement("button");a.setAttribute("type","button");a.title=r;a.appendChild(s);S(a,R.CLICK,this.handleClick_,this);var h=i+" "+ki+" "+Ui+(this.collapsed_&&this.collapsible_?" "+Yi:"")+(this.collapsible_?"":" ol-uncollapsible"),l=this.element;l.className=h;l.appendChild(this.ulElement_);l.appendChild(a);this.renderedAttributions_=[];this.renderedVisible_=!0}u&&(t.__proto__=u);((t.prototype=Object.create(u&&u.prototype)).constructor=t).prototype.getSourceAttributions_=function(t){for(var e={},i=[],r=t.layerStatesArray,n=t.viewState.resolution,o=0,s=r.length;o<s;++o){var a=r[o];if(Js(a,n)){var h=a.layer.getSource();if(h){var l=h.getAttributions();if(l){var u=l(t);if(u)if(Array.isArray(u)){for(var c=0,p=u.length;c<p;++c)if(!(u[c]in e)){i.push(u[c]);e[u[c]]=!0}}else if(!(u in e)){i.push(u);e[u]=!0}}}}}return i};t.prototype.updateElement_=function(t){if(t){var e=this.getSourceAttributions_(t),i=0<e.length;if(this.renderedVisible_!=i){this.element.style.display=i?"":"none";this.renderedVisible_=i}if(!Ar(e,this.renderedAttributions_)){ai(this.ulElement_);for(var r=0,n=e.length;r<n;++r){var o=document.createElement("li");o.innerHTML=e[r];this.ulElement_.appendChild(o)}this.renderedAttributions_=e}}else if(this.renderedVisible_){this.element.style.display="none";this.renderedVisible_=!1}};t.prototype.handleClick_=function(t){t.preventDefault();this.handleToggle_()};t.prototype.handleToggle_=function(){this.element.classList.toggle(Yi);this.collapsed_?oi(this.collapseLabel_,this.label_):oi(this.label_,this.collapseLabel_);this.collapsed_=!this.collapsed_};t.prototype.getCollapsible=function(){return this.collapsible_};t.prototype.setCollapsible=function(t){if(this.collapsible_!==t){this.collapsible_=t;this.element.classList.toggle("ol-uncollapsible");!t&&this.collapsed_&&this.handleToggle_()}};t.prototype.setCollapsed=function(t){this.collapsible_&&this.collapsed_!==t&&this.handleToggle_()};t.prototype.getCollapsed=function(){return this.collapsed_};return t}(Zs);function $s(t){this.updateElement_(t.frameState)}var ta=function(h){function t(t){var e=t||{};h.call(this,{element:document.createElement("div"),render:e.render||ea,target:e.target});var i=void 0!==e.className?e.className:"ol-rotate",r=void 0!==e.label?e.label:"⇧";this.label_=null;if("string"==typeof r){this.label_=document.createElement("span");this.label_.className="ol-compass";this.label_.textContent=r}else{this.label_=r;this.label_.classList.add("ol-compass")}var n=e.tipLabel?e.tipLabel:"Reset rotation",o=document.createElement("button");o.className=i+"-reset";o.setAttribute("type","button");o.title=n;o.appendChild(this.label_);S(o,R.CLICK,this.handleClick_,this);var s=i+" "+ki+" "+Ui,a=this.element;a.className=s;a.appendChild(o);this.callResetNorth_=e.resetNorth?e.resetNorth:void 0;this.duration_=void 0!==e.duration?e.duration:250;this.autoHide_=void 0===e.autoHide||e.autoHide;this.rotation_=void 0;this.autoHide_&&this.element.classList.add(Di)}h&&(t.__proto__=h);((t.prototype=Object.create(h&&h.prototype)).constructor=t).prototype.handleClick_=function(t){t.preventDefault();void 0!==this.callResetNorth_?this.callResetNorth_():this.resetNorth_()};t.prototype.resetNorth_=function(){var t=this.getMap().getView();t&&void 0!==t.getRotation()&&(0<this.duration_?t.animate({rotation:0,duration:this.duration_,easing:mo}):t.setRotation(0))};return t}(Zs);function ea(t){var e=t.frameState;if(e){var i=e.viewState.rotation;if(i!=this.rotation_){var r="rotate("+i+"rad)";if(this.autoHide_){var n=this.element.classList.contains(Di);n||0!==i?n&&0!==i&&this.element.classList.remove(Di):this.element.classList.add(Di)}this.label_.style.msTransform=r;this.label_.style.webkitTransform=r;this.label_.style.transform=r}this.rotation_=i}}var ia=function(p){function t(t){var e=t||{};p.call(this,{element:document.createElement("div"),target:e.target});var i=void 0!==e.className?e.className:"ol-zoom",r=void 0!==e.delta?e.delta:1,n=void 0!==e.zoomInLabel?e.zoomInLabel:"+",o=void 0!==e.zoomOutLabel?e.zoomOutLabel:"−",s=void 0!==e.zoomInTipLabel?e.zoomInTipLabel:"Zoom in",a=void 0!==e.zoomOutTipLabel?e.zoomOutTipLabel:"Zoom out",h=document.createElement("button");h.className=i+"-in";h.setAttribute("type","button");h.title=s;h.appendChild("string"==typeof n?document.createTextNode(n):n);S(h,R.CLICK,this.handleClick_.bind(this,r));var l=document.createElement("button");l.className=i+"-out";l.setAttribute("type","button");l.title=a;l.appendChild("string"==typeof o?document.createTextNode(o):o);S(l,R.CLICK,this.handleClick_.bind(this,-r));var u=i+" "+ki+" "+Ui,c=this.element;c.className=u;c.appendChild(h);c.appendChild(l);this.duration_=void 0!==e.duration?e.duration:250}p&&(t.__proto__=p);((t.prototype=Object.create(p&&p.prototype)).constructor=t).prototype.handleClick_=function(t,e){e.preventDefault();this.zoomByDelta_(t)};t.prototype.zoomByDelta_=function(t){var e=this.getMap().getView();if(e){var i=e.getResolution();if(i){var r=e.constrainResolution(i,t);if(0<this.duration_){e.getAnimating()&&e.cancelAnimations();e.animate({resolution:r,duration:this.duration_,easing:mo})}else e.setResolution(r)}}};return t}(Zs);function ra(t){var e=t||{},i=new F;(void 0===e.zoom||e.zoom)&&i.push(new ia(e.zoomOptions));(void 0===e.rotate||e.rotate)&&i.push(new ta(e.rotateOptions));(void 0===e.attribution||e.attribution)&&i.push(new Qs(e.attributionOptions));return i}var na={ACTIVE:"active"},oa=function(e){function t(t){e.call(this);this.map_=null;this.setActive(!0);this.handleEvent=t.handleEvent}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getActive=function(){return this.get(na.ACTIVE)};t.prototype.getMap=function(){return this.map_};t.prototype.setActive=function(t){this.set(na.ACTIVE,t)};t.prototype.setMap=function(t){this.map_=t};return t}(w);function sa(t,e,i){var r=t.getCenter();if(r){var n=t.constrainCenter([r[0]+e[0],r[1]+e[1]]);i?t.animate({duration:i,easing:Eo,center:n}):t.setCenter(n)}}function aa(t,e,i,r){ha(t,e=t.constrainRotation(e,0),i,r)}function ha(t,e,i,r){if(void 0!==e){var n=t.getRotation(),o=t.getCenter();void 0!==n&&o&&0<r?t.animate({rotation:e,anchor:i,duration:r,easing:mo}):t.rotate(e,i)}}function la(t,e,i,r,n){ca(t,e=t.constrainResolution(e,0,n),i,r)}function ua(t,e,i,r){var n=t.getResolution(),o=t.constrainResolution(n,e,0);if(void 0!==o){var s=t.getResolutions();o=Lt(o,t.getMinResolution()||s[s.length-1],t.getMaxResolution()||s[0])}if(i&&void 0!==o&&o!==n){var a=t.getCenter(),h=t.calculateCenterZoom(o,i);h=t.constrainCenter(h);i=[(o*a[0]-n*h[0])/(o-n),(o*a[1]-n*h[1])/(o-n)]}ca(t,o,i,r)}function ca(t,e,i,r){if(e){var n=t.getResolution(),o=t.getCenter();if(void 0!==n&&o&&e!==n&&r)t.animate({resolution:e,anchor:i,duration:r,easing:mo});else{if(i){var s=t.calculateCenterZoom(e,i);t.setCenter(s)}t.setResolution(e)}}}var pa=function(i){function t(t){i.call(this,{handleEvent:da});var e=t||{};this.delta_=e.delta?e.delta:1;this.duration_=void 0!==e.duration?e.duration:250}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(oa);function da(t){var e=!1,i=t.originalEvent;if(t.type==Oo.DBLCLICK){var r=t.map,n=t.coordinate,o=i.shiftKey?-this.delta_:this.delta_;ua(r.getView(),o,n,this.duration_);t.preventDefault();e=!0}return!e}var fa=function(t){var e=t.originalEvent;return e.altKey&&!(e.metaKey||e.ctrlKey)&&!e.shiftKey},_a=function(t){var e=t.originalEvent;return e.altKey&&!(e.metaKey||e.ctrlKey)&&e.shiftKey},ga=function(t){return t.target.getTargetElement()===document.activeElement},ya=v,va=function(t){var e=t.originalEvent;return 0==e.button&&!(wi&&Li&&e.ctrlKey)},ma=m,xa=function(t){return"pointermove"==t.type},Ea=function(t){return t.type==Oo.SINGLECLICK},Ta=function(t){var e=t.originalEvent;return!e.altKey&&!(e.metaKey||e.ctrlKey)&&!e.shiftKey},Sa=function(t){var e=t.originalEvent;return!e.altKey&&!(e.metaKey||e.ctrlKey)&&e.shiftKey},Ca=function(t){var e=t.originalEvent.target.tagName;return"INPUT"!==e&&"SELECT"!==e&&"TEXTAREA"!==e},Ra=function(t){A(t.pointerEvent,56);return"mouse"==t.pointerEvent.pointerType},Ia=function(t){var e=t.pointerEvent;return e.isPrimary&&0===e.button},wa=L,La=m,Oa=m,Pa=L,ba=function(i){function t(t){var e=t||{};i.call(this,{handleEvent:e.handleEvent||Fa});this.handleDownEvent_=e.handleDownEvent?e.handleDownEvent:Oa;this.handleDragEvent_=e.handleDragEvent?e.handleDragEvent:wa;this.handleMoveEvent_=e.handleMoveEvent?e.handleMoveEvent:Pa;this.handleUpEvent_=e.handleUpEvent?e.handleUpEvent:La;this.handlingDownUpSequence=!1;this.stopDown=e.stopDown?e.stopDown:Aa;this.trackedPointers_={};this.targetPointers=[]}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.updateTrackedPointers_=function(t){if((r=t.type)===Oo.POINTERDOWN||r===Oo.POINTERDRAG||r===Oo.POINTERUP){var e=t.pointerEvent,i=e.pointerId.toString();t.type==Oo.POINTERUP?delete this.trackedPointers_[i]:t.type==Oo.POINTERDOWN?this.trackedPointers_[i]=e:i in this.trackedPointers_&&(this.trackedPointers_[i]=e);this.targetPointers=s(this.trackedPointers_)}var r};return t}(oa);function Ma(t){for(var e=t.length,i=0,r=0,n=0;n<e;n++){i+=t[n].clientX;r+=t[n].clientY}return[i/e,r/e]}function Fa(t){if(!(t instanceof Po))return!0;var e=!1;this.updateTrackedPointers_(t);if(this.handlingDownUpSequence){if(t.type==Oo.POINTERDRAG)this.handleDragEvent_(t);else if(t.type==Oo.POINTERUP){var i=this.handleUpEvent_(t);this.handlingDownUpSequence=i&&0<this.targetPointers.length}}else if(t.type==Oo.POINTERDOWN){var r=this.handleDownEvent_(t);r&&t.preventDefault();this.handlingDownUpSequence=r;e=this.stopDown(r)}else t.type==Oo.POINTERMOVE&&this.handleMoveEvent_(t);return!e}function Aa(t){return t}var Na=function(i){function t(t){i.call(this,{handleDownEvent:ka,handleDragEvent:Da,handleUpEvent:Ga,stopDown:m});var e=t||{};this.kinetic_=e.kinetic;this.lastCentroid=null;this.lastPointersCount_;this.panning_=!1;this.condition_=e.condition?e.condition:Ta;this.noKinetic_=!1}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(ba);function Da(t){if(!this.panning_){this.panning_=!0;this.getMap().getView().setHint(bs.INTERACTING,1)}var e=this.targetPointers,i=Ma(e);if(e.length==this.lastPointersCount_){this.kinetic_&&this.kinetic_.update(i[0],i[1]);if(this.lastCentroid){var r=this.lastCentroid[0]-i[0],n=i[1]-this.lastCentroid[1],o=t.map.getView(),s=[r,n];Kn(s,o.getResolution());Hn(s,o.getRotation());Yn(s,o.getCenter());s=o.constrainCenter(s);o.setCenter(s)}}else this.kinetic_&&this.kinetic_.begin();this.lastCentroid=i;this.lastPointersCount_=e.length}function Ga(t){var e=t.map,i=e.getView();if(0===this.targetPointers.length){if(!this.noKinetic_&&this.kinetic_&&this.kinetic_.end()){var r=this.kinetic_.getDistance(),n=this.kinetic_.getAngle(),o=i.getCenter(),s=e.getPixelFromCoordinate(o),a=e.getCoordinateFromPixel([s[0]-r*Math.cos(n),s[1]-r*Math.sin(n)]);i.animate({center:i.constrainCenter(a),duration:500,easing:mo})}if(this.panning_){this.panning_=!1;i.setHint(bs.INTERACTING,-1)}return!1}this.kinetic_&&this.kinetic_.begin();return!(this.lastCentroid=null)}function ka(t){if(0<this.targetPointers.length&&this.condition_(t)){var e=t.map.getView();this.lastCentroid=null;e.getAnimating()&&e.setCenter(t.frameState.viewState.center);this.kinetic_&&this.kinetic_.begin();this.noKinetic_=1<this.targetPointers.length;return!0}return!1}var ja=function(i){function t(t){var e=t||{};i.call(this,{handleDownEvent:Ba,handleDragEvent:Ua,handleUpEvent:Ya,stopDown:m});this.condition_=e.condition?e.condition:_a;this.lastAngle_=void 0;this.duration_=void 0!==e.duration?e.duration:250}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(ba);function Ua(t){if(Ra(t)){var e=t.map,i=e.getView();if(i.getConstraints().rotation!==ws){var r=e.getSize(),n=t.pixel,o=Math.atan2(r[1]/2-n[1],n[0]-r[0]/2);if(void 0!==this.lastAngle_){var s=o-this.lastAngle_;ha(i,i.getRotation()-s)}this.lastAngle_=o}}}function Ya(t){if(!Ra(t))return!0;var e=t.map.getView();e.setHint(bs.INTERACTING,-1);aa(e,e.getRotation(),void 0,this.duration_);return!1}function Ba(t){if(!Ra(t))return!1;if(va(t)&&this.condition_(t)){t.map.getView().setHint(bs.INTERACTING,1);return!(this.lastAngle_=void 0)}return!1}var Va=function(e){function t(t){e.call(this);this.geometry_=null;this.element_=document.createElement("div");this.element_.style.position="absolute";this.element_.className="ol-box "+t;this.map_=null;this.startPixel_=null;this.endPixel_=null}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.disposeInternal=function(){this.setMap(null)};t.prototype.render_=function(){var t=this.startPixel_,e=this.endPixel_,i=this.element_.style;i.left=Math.min(t[0],e[0])+"px";i.top=Math.min(t[1],e[1])+"px";i.width=Math.abs(e[0]-t[0])+"px";i.height=Math.abs(e[1]-t[1])+"px"};t.prototype.setMap=function(t){if(this.map_){this.map_.getOverlayContainer().removeChild(this.element_);var e=this.element_.style;e.left=e.top=e.width=e.height="inherit"}this.map_=t;this.map_&&this.map_.getOverlayContainer().appendChild(this.element_)};t.prototype.setPixels=function(t,e){this.startPixel_=t;this.endPixel_=e;this.createOrUpdateGeometry();this.render_()};t.prototype.createOrUpdateGeometry=function(){var t=this.startPixel_,e=this.endPixel_,i=[t,[t[0],e[1]],e,[e[0],t[1]]].map(this.map_.getCoordinateFromPixel,this.map_);i[4]=i[0].slice();this.geometry_?this.geometry_.setCoordinates([i]):this.geometry_=new Fn([i])};t.prototype.getGeometry=function(){return this.geometry_};return t}(t),Xa={BOXSTART:"boxstart",BOXDRAG:"boxdrag",BOXEND:"boxend"},za=function(r){function t(t,e,i){r.call(this,t);this.coordinate=e;this.mapBrowserEvent=i}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(x),Wa=function(i){function t(t){i.call(this,{handleDownEvent:qa,handleDragEvent:Ka,handleUpEvent:Za});var e=t||{};this.box_=new Va(e.className||"ol-dragbox");this.minArea_=void 0!==e.minArea?e.minArea:64;this.onBoxEnd_=e.onBoxEnd?e.onBoxEnd:L;this.startPixel_=null;this.condition_=e.condition?e.condition:ya;this.boxEndCondition_=e.boxEndCondition?e.boxEndCondition:Ha}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getGeometry=function(){return this.box_.getGeometry()};return t}(ba);function Ha(t,e,i){var r=i[0]-e[0],n=i[1]-e[1];return r*r+n*n>=this.minArea_}function Ka(t){if(Ra(t)){this.box_.setPixels(this.startPixel_,t.pixel);this.dispatchEvent(new za(Xa.BOXDRAG,t.coordinate,t))}}function Za(t){if(!Ra(t))return!0;this.box_.setMap(null);if(this.boxEndCondition_(t,this.startPixel_,t.pixel)){this.onBoxEnd_(t);this.dispatchEvent(new za(Xa.BOXEND,t.coordinate,t))}return!1}function qa(t){if(!Ra(t))return!1;if(va(t)&&this.condition_(t)){this.startPixel_=t.pixel;this.box_.setMap(t.map);this.box_.setPixels(this.startPixel_,this.startPixel_);this.dispatchEvent(new za(Xa.BOXSTART,t.coordinate,t));return!0}return!1}var Ja=function(r){function t(t){var e=t||{},i=e.condition?e.condition:Sa;r.call(this,{condition:i,className:e.className||"ol-dragzoom",onBoxEnd:Qa});this.duration_=void 0!==e.duration?e.duration:200;this.out_=void 0!==e.out&&e.out}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(Wa);function Qa(){var t=this.getMap(),e=t.getView(),i=t.getSize(),r=this.getGeometry().getExtent();if(this.out_){var n=e.calculateExtent(i),o=K([t.getPixelFromCoordinate(st(r)),t.getPixelFromCoordinate(ft(r))]);vt(n,1/e.getResolutionForExtent(o,i));r=n}var s=e.constrainResolution(e.getResolutionForExtent(r,i)),a=ht(r);a=e.constrainCenter(a);e.animate({resolution:s,center:a,duration:this.duration_,easing:mo})}var $a={LEFT:37,UP:38,RIGHT:39,DOWN:40},th=function(i){function t(t){i.call(this,{handleEvent:eh});var e=t||{};this.defaultCondition_=function(t){return Ta(t)&&Ca(t)};this.condition_=void 0!==e.condition?e.condition:this.defaultCondition_;this.duration_=void 0!==e.duration?e.duration:100;this.pixelDelta_=void 0!==e.pixelDelta?e.pixelDelta:128}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(oa);function eh(t){var e=!1;if(t.type==R.KEYDOWN){var i=t.originalEvent.keyCode;if(this.condition_(t)&&(i==$a.DOWN||i==$a.LEFT||i==$a.RIGHT||i==$a.UP)){var r=t.map.getView(),n=r.getResolution()*this.pixelDelta_,o=0,s=0;i==$a.DOWN?s=-n:i==$a.LEFT?o=-n:i==$a.RIGHT?o=n:s=n;var a=[o,s];Hn(a,r.getRotation());sa(r,a,this.duration_);t.preventDefault();e=!0}}return!e}var ih=function(i){function t(t){i.call(this,{handleEvent:rh});var e=t||{};this.condition_=e.condition?e.condition:Ca;this.delta_=e.delta?e.delta:1;this.duration_=void 0!==e.duration?e.duration:100}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(oa);function rh(t){var e=!1;if(t.type==R.KEYDOWN||t.type==R.KEYPRESS){var i=t.originalEvent.charCode;if(this.condition_(t)&&(i=="+".charCodeAt(0)||i=="-".charCodeAt(0))){var r=t.map,n=i=="+".charCodeAt(0)?this.delta_:-this.delta_;ua(r.getView(),n,void 0,this.duration_);t.preventDefault();e=!0}}return!e}var nh={TRACKPAD:"trackpad",WHEEL:"wheel"},oh=function(i){function t(t){i.call(this,{handleEvent:sh});var e=t||{};this.delta_=0;this.duration_=void 0!==e.duration?e.duration:250;this.timeout_=void 0!==e.timeout?e.timeout:80;this.useAnchor_=void 0===e.useAnchor||e.useAnchor;this.constrainResolution_=e.constrainResolution||!1;this.condition_=e.condition?e.condition:ya;this.lastAnchor_=null;this.startTime_=void 0;this.timeoutId_=void 0;this.mode_=void 0;this.trackpadEventGap_=400;this.trackpadTimeoutId_=void 0;this.trackpadDeltaPerZoom_=300;this.trackpadZoomBuffer_=1.5}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.decrementInteractingHint_=function(){this.trackpadTimeoutId_=void 0;this.getMap().getView().setHint(bs.INTERACTING,-1)};t.prototype.handleWheelZoom_=function(t){var e=t.getView();e.getAnimating()&&e.cancelAnimations();ua(e,-Lt(this.delta_,-1,1),this.lastAnchor_,this.duration_);this.mode_=void 0;this.delta_=0;this.lastAnchor_=null;this.startTime_=void 0;this.timeoutId_=void 0};t.prototype.setMouseAnchor=function(t){(this.useAnchor_=t)||(this.lastAnchor_=null)};return t}(oa);function sh(t){if(!this.condition_(t))return!0;var e=t.type;if(e!==R.WHEEL&&e!==R.MOUSEWHEEL)return!0;t.preventDefault();var i,r=t.map,n=t.originalEvent;this.useAnchor_&&(this.lastAnchor_=t.coordinate);if(t.type==R.WHEEL){i=n.deltaY;Ri&&n.deltaMode===WheelEvent.DOM_DELTA_PIXEL&&(i/=Oi);n.deltaMode===WheelEvent.DOM_DELTA_LINE&&(i*=40)}else if(t.type==R.MOUSEWHEEL){i=-n.wheelDeltaY;Ii&&(i/=3)}if(0===i)return!1;var o=Date.now();void 0===this.startTime_&&(this.startTime_=o);(!this.mode_||o-this.startTime_>this.trackpadEventGap_)&&(this.mode_=Math.abs(i)<4?nh.TRACKPAD:nh.WHEEL);if(this.mode_===nh.TRACKPAD){var s=r.getView();this.trackpadTimeoutId_?clearTimeout(this.trackpadTimeoutId_):s.setHint(bs.INTERACTING,1);this.trackpadTimeoutId_=setTimeout(this.decrementInteractingHint_.bind(this),this.trackpadEventGap_);var a=s.getResolution()*Math.pow(2,i/this.trackpadDeltaPerZoom_),h=s.getMinResolution(),l=s.getMaxResolution(),u=0;if(a<h){a=Math.max(a,h/this.trackpadZoomBuffer_);u=1}else if(l<a){a=Math.min(a,l*this.trackpadZoomBuffer_);u=-1}if(this.lastAnchor_){var c=s.calculateCenterZoom(a,this.lastAnchor_);s.setCenter(s.constrainCenter(c))}s.setResolution(a);0===u&&this.constrainResolution_&&s.animate({resolution:s.constrainResolution(a,0<i?-1:1),easing:mo,anchor:this.lastAnchor_,duration:this.duration_});0<u?s.animate({resolution:h,easing:mo,anchor:this.lastAnchor_,duration:500}):u<0&&s.animate({resolution:l,easing:mo,anchor:this.lastAnchor_,duration:500});this.startTime_=o;return!1}this.delta_+=i;var p=Math.max(this.timeout_-(o-this.startTime_),0);clearTimeout(this.timeoutId_);this.timeoutId_=setTimeout(this.handleWheelZoom_.bind(this,r),p);return!1}var ah=function(i){function t(t){i.call(this,{handleDownEvent:uh,handleDragEvent:hh,handleUpEvent:lh,stopDown:m});var e=t||{};this.anchor_=null;this.lastAngle_=void 0;this.rotating_=!1;this.rotationDelta_=0;this.threshold_=void 0!==e.threshold?e.threshold:.3;this.duration_=void 0!==e.duration?e.duration:250}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(ba);function hh(t){var e=0,i=this.targetPointers[0],r=this.targetPointers[1],n=Math.atan2(r.clientY-i.clientY,r.clientX-i.clientX);if(void 0!==this.lastAngle_){var o=n-this.lastAngle_;this.rotationDelta_+=o;!this.rotating_&&Math.abs(this.rotationDelta_)>this.threshold_&&(this.rotating_=!0);e=o}this.lastAngle_=n;var s=t.map,a=s.getView();if(a.getConstraints().rotation!==ws){var h=s.getViewport().getBoundingClientRect(),l=Ma(this.targetPointers);l[0]-=h.left;l[1]-=h.top;this.anchor_=s.getCoordinateFromPixel(l);if(this.rotating_){var u=a.getRotation();s.render();ha(a,u+e,this.anchor_)}}}function lh(t){if(this.targetPointers.length<2){var e=t.map.getView();e.setHint(bs.INTERACTING,-1);if(this.rotating_){aa(e,e.getRotation(),this.anchor_,this.duration_)}return!1}return!0}function uh(t){if(2<=this.targetPointers.length){var e=t.map;this.anchor_=null;this.lastAngle_=void 0;this.rotating_=!1;this.rotationDelta_=0;this.handlingDownUpSequence||e.getView().setHint(bs.INTERACTING,1);return!0}return!1}var ch=function(i){function t(t){i.call(this,{handleDownEvent:fh,handleDragEvent:ph,handleUpEvent:dh,stopDown:m});var e=t||{};this.constrainResolution_=e.constrainResolution||!1;this.anchor_=null;this.duration_=void 0!==e.duration?e.duration:400;this.lastDistance_=void 0;this.lastScaleDelta_=1}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(ba);function ph(t){var e=1,i=this.targetPointers[0],r=this.targetPointers[1],n=i.clientX-r.clientX,o=i.clientY-r.clientY,s=Math.sqrt(n*n+o*o);void 0!==this.lastDistance_&&(e=this.lastDistance_/s);this.lastDistance_=s;var a=t.map,h=a.getView(),l=h.getResolution(),u=h.getMaxResolution(),c=h.getMinResolution(),p=l*e;if(u<p){e=u/l;p=u}else if(p<c){e=c/l;p=c}1!=e&&(this.lastScaleDelta_=e);var d=a.getViewport().getBoundingClientRect(),f=Ma(this.targetPointers);f[0]-=d.left;f[1]-=d.top;this.anchor_=a.getCoordinateFromPixel(f);a.render();ca(h,p,this.anchor_)}function dh(t){if(this.targetPointers.length<2){var e=t.map.getView();e.setHint(bs.INTERACTING,-1);var i=e.getResolution();if(this.constrainResolution_||i<e.getMinResolution()||i>e.getMaxResolution()){var r=this.lastScaleDelta_-1;la(e,i,this.anchor_,this.duration_,r)}return!1}return!0}function fh(t){if(2<=this.targetPointers.length){var e=t.map;this.anchor_=null;this.lastDistance_=void 0;this.lastScaleDelta_=1;this.handlingDownUpSequence||e.getView().setHint(bs.INTERACTING,1);return!0}return!1}var _h="addfeatures",gh=function(n){function t(t,e,i,r){n.call(this,t);this.features=i;this.file=e;this.projection=r}n&&(t.__proto__=n);return(t.prototype=Object.create(n&&n.prototype)).constructor=t}(x),yh=function(i){function t(t){var e=t||{};i.call(this,{handleEvent:v});this.formatConstructors_=e.formatConstructors?e.formatConstructors:[];this.projection_=e.projection?ye(e.projection):null;this.dropListenKeys_=null;this.source_=e.source||null;this.target=e.target?e.target:null}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.handleResult_=function(t,e){var i=e.target.result,r=this.getMap(),n=this.projection_;if(!n){n=r.getView().getProjection()}for(var o=this.formatConstructors_,s=[],a=0,h=o.length;a<h;++a){var l=new o[a];if((s=this.tryReadFeatures_(l,i,{featureProjection:n}))&&0<s.length)break}if(this.source_){this.source_.clear();this.source_.addFeatures(s)}this.dispatchEvent(new gh(_h,t,s,n))};t.prototype.registerListeners_=function(){var t=this.getMap();if(t){var e=this.target?this.target:t.getViewport();this.dropListenKeys_=[S(e,R.DROP,vh,this),S(e,R.DRAGENTER,mh,this),S(e,R.DRAGOVER,mh,this),S(e,R.DROP,mh,this)]}};t.prototype.setActive=function(t){i.prototype.setActive.call(this,t);t?this.registerListeners_():this.unregisterListeners_()};t.prototype.setMap=function(t){this.unregisterListeners_();i.prototype.setMap.call(this,t);this.getActive()&&this.registerListeners_()};t.prototype.tryReadFeatures_=function(t,e,i){try{return t.readFeatures(e,i)}catch(t){return null}};t.prototype.unregisterListeners_=function(){if(this.dropListenKeys_){this.dropListenKeys_.forEach(g);this.dropListenKeys_=null}};return t}(oa);function vh(t){for(var e=t.dataTransfer.files,i=0,r=e.length;i<r;++i){var n=e.item(i),o=new FileReader;o.addEventListener(R.LOAD,this.handleResult_.bind(this,n));o.readAsText(n)}}function mh(t){t.stopPropagation();t.preventDefault();t.dataTransfer.dropEffect="copy"}var xh=function(i){function t(t){var e=t||{};i.call(this,{handleDownEvent:Sh,handleDragEvent:Eh,handleUpEvent:Th});this.condition_=e.condition?e.condition:Sa;this.lastAngle_=void 0;this.lastMagnitude_=void 0;this.lastScaleDelta_=0;this.duration_=void 0!==e.duration?e.duration:400}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(ba);function Eh(t){if(Ra(t)){var e=t.map,i=e.getSize(),r=t.pixel,n=r[0]-i[0]/2,o=i[1]/2-r[1],s=Math.atan2(o,n),a=Math.sqrt(n*n+o*o),h=e.getView();if(h.getConstraints().rotation!==ws&&void 0!==this.lastAngle_){var l=s-this.lastAngle_;ha(h,h.getRotation()-l)}this.lastAngle_=s;if(void 0!==this.lastMagnitude_){ca(h,this.lastMagnitude_*(h.getResolution()/a))}void 0!==this.lastMagnitude_&&(this.lastScaleDelta_=this.lastMagnitude_/a);this.lastMagnitude_=a}}function Th(t){if(!Ra(t))return!0;var e=t.map.getView();e.setHint(bs.INTERACTING,-1);var i=this.lastScaleDelta_-1;aa(e,e.getRotation());la(e,e.getResolution(),void 0,this.duration_,i);this.lastScaleDelta_=0;return!1}function Sh(t){if(!Ra(t))return!1;if(this.condition_(t)){t.map.getView().setHint(bs.INTERACTING,1);this.lastAngle_=void 0;return!(this.lastMagnitude_=void 0)}return!1}var Ch=function(n){function t(t,e,i){n.call(this);if(void 0!==i&&void 0===e)this.setFlatCoordinates(i,t);else{var r=e||0;this.setCenterAndRadius(t,r,i)}}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.clone=function(){return new t(this.flatCoordinates.slice(),void 0,this.layout)};t.prototype.closestPointXY=function(t,e,i,r){var n=this.flatCoordinates,o=t-n[0],s=e-n[1],a=o*o+s*s;if(a<r){if(0===a)for(var h=0;h<this.stride;++h)i[h]=n[h];else{var l=this.getRadius()/Math.sqrt(a);i[0]=n[0]+l*o;i[1]=n[1]+l*s;for(var u=2;u<this.stride;++u)i[u]=n[u]}i.length=this.stride;return a}return r};t.prototype.containsXY=function(t,e){var i=this.flatCoordinates,r=t-i[0],n=e-i[1];return r*r+n*n<=this.getRadiusSquared_()};t.prototype.getCenter=function(){return this.flatCoordinates.slice(0,this.stride)};t.prototype.computeExtent=function(t){var e=this.flatCoordinates,i=e[this.stride]-e[0];return z(e[0]-i,e[1]-i,e[0]+i,e[1]+i,t)};t.prototype.getRadius=function(){return Math.sqrt(this.getRadiusSquared_())};t.prototype.getRadiusSquared_=function(){var t=this.flatCoordinates[this.stride]-this.flatCoordinates[0],e=this.flatCoordinates[this.stride+1]-this.flatCoordinates[1];return t*t+e*e};t.prototype.getType=function(){return kt.CIRCLE};t.prototype.intersectsExtent=function(t){if(Rt(t,this.getExtent())){var e=this.getCenter();return t[0]<=e[0]&&t[2]>=e[0]||(t[1]<=e[1]&&t[3]>=e[1]||nt(t,this.intersectsCoordinate,this))}return!1};t.prototype.setCenter=function(t){var e=this.stride,i=this.flatCoordinates[e]-this.flatCoordinates[0],r=t.slice();r[e]=r[0]+i;for(var n=1;n<e;++n)r[e+n]=t[n];this.setFlatCoordinates(this.layout,r);this.changed()};t.prototype.setCenterAndRadius=function(t,e,i){this.setLayout(i,t,0);this.flatCoordinates||(this.flatCoordinates=[]);var r=this.flatCoordinates,n=Qr(r,0,t,this.stride);r[n++]=r[0]+e;for(var o=1,s=this.stride;o<s;++o)r[n++]=r[o];r.length=n;this.changed()};t.prototype.getCoordinates=function(){};t.prototype.setCoordinates=function(t,e){};t.prototype.setRadius=function(t){this.flatCoordinates[this.stride]=this.flatCoordinates[0]+t;this.changed()};return t}(jr);Ch.prototype.transform;var Rh=function(l){function r(t,e,i){l.call(this);this.ends_=[];this.maxDelta_=-1;this.maxDeltaRevision_=-1;if(Array.isArray(t[0]))this.setCoordinates(t,e);else if(void 0!==e&&i){this.setFlatCoordinates(e,t);this.ends_=i}else{for(var r=this.getLayout(),n=[],o=[],s=0,a=t.length;s<a;++s){var h=t[s];0===s&&(r=h.getLayout());br(n,h.getFlatCoordinates());o.push(n.length)}this.setFlatCoordinates(r,n);this.ends_=o}}l&&(r.__proto__=l);((r.prototype=Object.create(l&&l.prototype)).constructor=r).prototype.appendLineString=function(t){this.flatCoordinates?br(this.flatCoordinates,t.getFlatCoordinates().slice()):this.flatCoordinates=t.getFlatCoordinates().slice();this.ends_.push(this.flatCoordinates.length);this.changed()};r.prototype.clone=function(){return new r(this.flatCoordinates.slice(),this.layout,this.ends_.slice())};r.prototype.closestPointXY=function(t,e,i,r){if(r<U(this.getExtent(),t,e))return r;if(this.maxDeltaRevision_!=this.getRevision()){this.maxDelta_=Math.sqrt(Hr(this.flatCoordinates,0,this.ends_,this.stride,0));this.maxDeltaRevision_=this.getRevision()}return qr(this.flatCoordinates,0,this.ends_,this.stride,this.maxDelta_,!1,t,e,i,r)};r.prototype.getCoordinateAtM=function(t,e,i){if(this.layout!=kr.XYM&&this.layout!=kr.XYZM||0===this.flatCoordinates.length)return null;var r=void 0!==e&&e,n=void 0!==i&&i;return eo(this.flatCoordinates,0,this.ends_,this.stride,t,r,n)};r.prototype.getCoordinates=function(){return nn(this.flatCoordinates,0,this.ends_,this.stride)};r.prototype.getEnds=function(){return this.ends_};r.prototype.getLineString=function(t){return t<0||this.ends_.length<=t?null:new ro(this.flatCoordinates.slice(0===t?0:this.ends_[t-1],this.ends_[t]),this.layout)};r.prototype.getLineStrings=function(){for(var t=this.flatCoordinates,e=this.ends_,i=this.layout,r=[],n=0,o=0,s=e.length;o<s;++o){var a=e[o],h=new ro(t.slice(n,a),i);r.push(h);n=a}return r};r.prototype.getFlatMidpoints=function(){for(var t=[],e=this.flatCoordinates,i=0,r=this.ends_,n=this.stride,o=0,s=r.length;o<s;++o){var a=r[o];br(t,$n(e,i,a,n,.5));i=a}return t};r.prototype.getSimplifiedGeometryInternal=function(t){var e=[],i=[];e.length=an(this.flatCoordinates,0,this.ends_,this.stride,t,e,0,i);return new r(e,kr.XY,i)};r.prototype.getType=function(){return kt.MULTI_LINE_STRING};r.prototype.intersectsExtent=function(t){return Sn(this.flatCoordinates,0,this.ends_,this.stride,t)};r.prototype.setCoordinates=function(t,e){this.setLayout(e,t,2);this.flatCoordinates||(this.flatCoordinates=[]);var i=tn(this.flatCoordinates,0,t,this.stride,this.ends_);this.flatCoordinates.length=0===i.length?0:i[i.length-1];this.changed()};return r}(jr),Ih=function(i){function t(t,e){i.call(this);e&&!Array.isArray(t[0])?this.setFlatCoordinates(e,t):this.setCoordinates(t,e)}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.appendPoint=function(t){this.flatCoordinates?br(this.flatCoordinates,t.getFlatCoordinates()):this.flatCoordinates=t.getFlatCoordinates().slice();this.changed()};t.prototype.clone=function(){return new t(this.flatCoordinates.slice(),this.layout)};t.prototype.closestPointXY=function(t,e,i,r){if(r<U(this.getExtent(),t,e))return r;for(var n=this.flatCoordinates,o=this.stride,s=0,a=n.length;s<a;s+=o){var h=Mt(t,e,n[s],n[s+1]);if(h<r){r=h;for(var l=0;l<o;++l)i[l]=n[s+l];i.length=o}}return r};t.prototype.getCoordinates=function(){return rn(this.flatCoordinates,0,this.flatCoordinates.length,this.stride)};t.prototype.getPoint=function(t){var e=this.flatCoordinates?this.flatCoordinates.length/this.stride:0;return t<0||e<=t?null:new fn(this.flatCoordinates.slice(t*this.stride,(t+1)*this.stride),this.layout)};t.prototype.getPoints=function(){for(var t=this.flatCoordinates,e=this.layout,i=this.stride,r=[],n=0,o=t.length;n<o;n+=i){var s=new fn(t.slice(n,n+i),e);r.push(s)}return r};t.prototype.getType=function(){return kt.MULTI_POINT};t.prototype.intersectsExtent=function(t){for(var e=this.flatCoordinates,i=this.stride,r=0,n=e.length;r<n;r+=i){if(B(t,e[r],e[r+1]))return!0}return!1};t.prototype.setCoordinates=function(t,e){this.setLayout(e,t,1);this.flatCoordinates||(this.flatCoordinates=[]);this.flatCoordinates.length=$r(this.flatCoordinates,0,t,this.stride);this.changed()};return t}(jr);function wh(t,e,i,r){for(var n=[],o=[1/0,1/0,-1/0,-1/0],s=0,a=i.length;s<a;++s){var h=i[s];o=Z(t,e,h[0],r);n.push((o[0]+o[2])/2,(o[1]+o[3])/2);e=h[h.length-1]}return n}var Lh=function(d){function r(t,e,i){d.call(this);this.endss_=[];this.flatInteriorPointsRevision_=-1;this.flatInteriorPoints_=null;this.maxDelta_=-1;this.maxDeltaRevision_=-1;this.orientedRevision_=-1;this.orientedFlatCoordinates_=null;if(!i&&!Array.isArray(t[0])){for(var r=this.getLayout(),n=[],o=[],s=0,a=t.length;s<a;++s){var h=t[s];0===s&&(r=h.getLayout());for(var l=n.length,u=h.getEnds(),c=0,p=u.length;c<p;++c)u[c]+=l;br(n,h.getFlatCoordinates());o.push(u)}e=r;t=n;i=o}if(void 0!==e&&i){this.setFlatCoordinates(e,t);this.endss_=i}else this.setCoordinates(t,e)}d&&(r.__proto__=d);((r.prototype=Object.create(d&&d.prototype)).constructor=r).prototype.appendPolygon=function(t){var e;if(this.flatCoordinates){var i=this.flatCoordinates.length;br(this.flatCoordinates,t.getFlatCoordinates());for(var r=0,n=(e=t.getEnds().slice()).length;r<n;++r)e[r]+=i}else{this.flatCoordinates=t.getFlatCoordinates().slice();e=t.getEnds().slice();this.endss_.push()}this.endss_.push(e);this.changed()};r.prototype.clone=function(){for(var t=this.endss_.length,e=new Array(t),i=0;i<t;++i)e[i]=this.endss_[i].slice();return new r(this.flatCoordinates.slice(),this.layout,e)};r.prototype.closestPointXY=function(t,e,i,r){if(r<U(this.getExtent(),t,e))return r;if(this.maxDeltaRevision_!=this.getRevision()){this.maxDelta_=Math.sqrt(Kr(this.flatCoordinates,0,this.endss_,this.stride,0));this.maxDeltaRevision_=this.getRevision()}return Jr(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride,this.maxDelta_,!0,t,e,i,r)};r.prototype.containsXY=function(t,e){return vn(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride,t,e)};r.prototype.getArea=function(){return Xr(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride)};r.prototype.getCoordinates=function(t){var e;void 0!==t?Mn(e=this.getOrientedFlatCoordinates().slice(),0,this.endss_,this.stride,t):e=this.flatCoordinates;return on(e,0,this.endss_,this.stride)};r.prototype.getEndss=function(){return this.endss_};r.prototype.getFlatInteriorPoints=function(){if(this.flatInteriorPointsRevision_!=this.getRevision()){var t=wh(this.flatCoordinates,0,this.endss_,this.stride);this.flatInteriorPoints_=xn(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride,t);this.flatInteriorPointsRevision_=this.getRevision()}return this.flatInteriorPoints_};r.prototype.getInteriorPoints=function(){return new Ih(this.getFlatInteriorPoints().slice(),kr.XYM)};r.prototype.getOrientedFlatCoordinates=function(){if(this.orientedRevision_!=this.getRevision()){var t=this.flatCoordinates;if(Pn(t,0,this.endss_,this.stride))this.orientedFlatCoordinates_=t;else{this.orientedFlatCoordinates_=t.slice();this.orientedFlatCoordinates_.length=Mn(this.orientedFlatCoordinates_,0,this.endss_,this.stride)}this.orientedRevision_=this.getRevision()}return this.orientedFlatCoordinates_};r.prototype.getSimplifiedGeometryInternal=function(t){var e=[],i=[];e.length=pn(this.flatCoordinates,0,this.endss_,this.stride,Math.sqrt(t),e,0,i);return new r(e,kr.XY,i)};r.prototype.getPolygon=function(t){if(t<0||this.endss_.length<=t)return null;var e;if(0===t)e=0;else{var i=this.endss_[t-1];e=i[i.length-1]}var r=this.endss_[t].slice(),n=r[r.length-1];if(0!==e)for(var o=0,s=r.length;o<s;++o)r[o]-=e;return new Fn(this.flatCoordinates.slice(e,n),this.layout,r)};r.prototype.getPolygons=function(){for(var t=this.layout,e=this.flatCoordinates,i=this.endss_,r=[],n=0,o=0,s=i.length;o<s;++o){var a=i[o].slice(),h=a[a.length-1];if(0!==n)for(var l=0,u=a.length;l<u;++l)a[l]-=n;var c=new Fn(e.slice(n,h),t,a);r.push(c);n=h}return r};r.prototype.getType=function(){return kt.MULTI_POLYGON};r.prototype.intersectsExtent=function(t){return In(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride,t)};r.prototype.setCoordinates=function(t,e){this.setLayout(e,t,3);this.flatCoordinates||(this.flatCoordinates=[]);var i=en(this.flatCoordinates,0,t,this.stride,this.endss_);if(0===i.length)this.flatCoordinates.length=0;else{var r=i[i.length-1];this.flatCoordinates.length=0===r.length?0:r[r.length-1]}this.changed()};return r}(jr),Oh={IMAGE:"image",VECTOR:"vector"},Ph="renderOrder",bh=function(r){function t(t){var e=t||{},i=T({},e);delete i.style;delete i.renderBuffer;delete i.updateWhileAnimating;delete i.updateWhileInteracting;r.call(this,i);this.declutter_=void 0!==e.declutter&&e.declutter;this.renderBuffer_=void 0!==e.renderBuffer?e.renderBuffer:100;this.style_=null;this.styleFunction_=void 0;this.setStyle(e.style);this.updateWhileAnimating_=void 0!==e.updateWhileAnimating&&e.updateWhileAnimating;this.updateWhileInteracting_=void 0!==e.updateWhileInteracting&&e.updateWhileInteracting;this.renderMode_=e.renderMode||Oh.VECTOR;this.type=Io.VECTOR}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.getDeclutter=function(){return this.declutter_};t.prototype.setDeclutter=function(t){this.declutter_=t};t.prototype.getRenderBuffer=function(){return this.renderBuffer_};t.prototype.getRenderOrder=function(){return this.get(Ph)};t.prototype.getStyle=function(){return this.style_};t.prototype.getStyleFunction=function(){return this.styleFunction_};t.prototype.getUpdateWhileAnimating=function(){return this.updateWhileAnimating_};t.prototype.getUpdateWhileInteracting=function(){return this.updateWhileInteracting_};t.prototype.setRenderOrder=function(t){this.set(Ph,t)};t.prototype.setStyle=function(t){this.style_=void 0!==t?t:xr;this.styleFunction_=null===t?void 0:vr(this.style_);this.changed()};t.prototype.getRenderMode=function(){return this.renderMode_};return t}(qs);bh.prototype.getSource;var Mh={ARRAY_BUFFER:"arraybuffer",JSON:"json",TEXT:"text",XML:"xml"};function Fh(i,o,s,a){return function(t,e,r){var n=new XMLHttpRequest;n.open("GET","function"==typeof i?i(t,e,r):i,!0);o.getType()==Mh.ARRAY_BUFFER&&(n.responseType="arraybuffer");n.onload=function(t){if(!n.status||200<=n.status&&n.status<300){var e,i=o.getType();i==Mh.JSON||i==Mh.TEXT?e=n.responseText:i==Mh.XML?(e=n.responseXML)||(e=(new DOMParser).parseFromString(n.responseText,"application/xml")):i==Mh.ARRAY_BUFFER&&(e=n.response);e?s.call(this,o.readFeatures(e,{featureProjection:r}),o.readProjection(e),o.getLastExtent()):a.call(this)}else a.call(this)}.bind(this);n.onerror=function(){a.call(this)}.bind(this);n.send()}}function Ah(t,e){return Fh(t,e,function(t,e){this.addFeatures(t)},L)}function Nh(t,e){return[[-1/0,-1/0,1/0,1/0]]}var Dh=function(e){function t(t){e.call(this);this.projection_=ye(t.projection);this.attributions_=this.adaptAttributions_(t.attributions);this.loading=!1;this.state_=void 0!==t.state?t.state:Ys.READY;this.wrapX_=void 0!==t.wrapX&&t.wrapX}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.adaptAttributions_=function(e){return e?Array.isArray(e)?function(t){return e}:"function"==typeof e?e:function(t){return[e]}:null};t.prototype.getAttributions=function(){return this.attributions_};t.prototype.getProjection=function(){return this.projection_};t.prototype.getResolutions=function(){};t.prototype.getState=function(){return this.state_};t.prototype.getWrapX=function(){return this.wrapX_};t.prototype.refresh=function(){this.changed()};t.prototype.setAttributions=function(t){this.attributions_=this.adaptAttributions_(t);this.changed()};t.prototype.setState=function(t){this.state_=t;this.changed()};return t}(w);Dh.prototype.forEachFeatureAtCoordinate=L;var Gh={ADDFEATURE:"addfeature",CHANGEFEATURE:"changefeature",CLEAR:"clear",REMOVEFEATURE:"removefeature"};"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var kh,jh=(function(t,e){t.exports=function(){function _(t,e,i,r,n){for(;i<r;){if(600<r-i){var o=r-i+1,s=e-i+1,a=Math.log(o),h=.5*Math.exp(2*a/3),l=.5*Math.sqrt(a*h*(o-h)/o)*(s-o/2<0?-1:1),u=Math.max(i,Math.floor(e-s*h/o+l)),c=Math.min(r,Math.floor(e+(o-s)*h/o+l));_(t,e,u,c,n)}var p=t[e],d=i,f=r;g(t,i,e);0<n(t[r],p)&&g(t,i,r);for(;d<f;){g(t,d,f);d++;f--;for(;n(t[d],p)<0;)d++;for(;0<n(t[f],p);)f--}0===n(t[i],p)?g(t,i,f):g(t,++f,r);f<=e&&(i=f+1);e<=f&&(r=f-1)}}function g(t,e,i){var r=t[e];t[e]=t[i];t[i]=r}function o(t,e){return t<e?-1:e<t?1:0}return function(t,e,i,r,n){_(t,e,i||0,r||t.length-1,n||o)}}()}(kh={exports:{}},kh.exports),kh.exports),Uh=Bh,Yh=Bh;function Bh(t,e){if(!(this instanceof Bh))return new Bh(t,e);this._maxEntries=Math.max(4,t||9);this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries));e&&this._initFormat(e);this.clear()}Bh.prototype={all:function(){return this._all(this.data,[])},search:function(t){var e=this.data,i=[],r=this.toBBox;if(!Qh(t,e))return i;for(var n,o,s,a,h=[];e;){for(n=0,o=e.children.length;n<o;n++){s=e.children[n];Qh(t,a=e.leaf?r(s):s)&&(e.leaf?i.push(s):Jh(t,a)?this._all(s,i):h.push(s))}e=h.pop()}return i},collides:function(t){var e=this.data,i=this.toBBox;if(!Qh(t,e))return!1;for(var r,n,o,s,a=[];e;){for(r=0,n=e.children.length;r<n;r++){o=e.children[r];if(Qh(t,s=e.leaf?i(o):o)){if(e.leaf||Jh(t,s))return!0;a.push(o)}}e=a.pop()}return!1},load:function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var e=0,i=t.length;e<i;e++)this.insert(t[e]);return this}var r=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===r.height)this._splitRoot(this.data,r);else{if(this.data.height<r.height){var n=this.data;this.data=r;r=n}this._insert(r,this.data.height-r.height-1,!0)}else this.data=r;return this},insert:function(t){t&&this._insert(t,this.data.height-1);return this},clear:function(){this.data=$h([]);return this},remove:function(t,e){if(!t)return this;for(var i,r,n,o,s=this.data,a=this.toBBox(t),h=[],l=[];s||h.length;){if(!s){s=h.pop();r=h[h.length-1];i=l.pop();o=!0}if(s.leaf&&-1!==(n=Vh(t,s.children,e))){s.children.splice(n,1);h.push(s);this._condense(h);return this}if(o||s.leaf||!Jh(s,a))if(r){i++;s=r.children[i];o=!1}else s=null;else{h.push(s);l.push(i);i=0;s=(r=s).children[0]}}return this},toBBox:function(t){return t},compareMinX:Hh,compareMinY:Kh,toJSON:function(){return this.data},fromJSON:function(t){this.data=t;return this},_all:function(t,e){for(var i=[];t;){t.leaf?e.push.apply(e,t.children):i.push.apply(i,t.children);t=i.pop()}return e},_build:function(t,e,i,r){var n,o=i-e+1,s=this._maxEntries;if(o<=s){Xh(n=$h(t.slice(e,i+1)),this.toBBox);return n}if(!r){r=Math.ceil(Math.log(o)/Math.log(s));s=Math.ceil(o/Math.pow(s,r-1))}(n=$h([])).leaf=!1;n.height=r;var a,h,l,u,c=Math.ceil(o/s),p=c*Math.ceil(Math.sqrt(s));tl(t,e,i,p,this.compareMinX);for(a=e;a<=i;a+=p){tl(t,a,l=Math.min(a+p-1,i),c,this.compareMinY);for(h=a;h<=l;h+=c){u=Math.min(h+c-1,l);n.children.push(this._build(t,h,u,r-1))}}Xh(n,this.toBBox);return n},_chooseSubtree:function(t,e,i,r){for(var n,o,s,a,h,l,u,c,p,d;;){r.push(e);if(e.leaf||r.length-1===i)break;u=c=1/0;for(n=0,o=e.children.length;n<o;n++){h=Zh(s=e.children[n]);if((l=(p=t,d=s,(Math.max(d.maxX,p.maxX)-Math.min(d.minX,p.minX))*(Math.max(d.maxY,p.maxY)-Math.min(d.minY,p.minY)))-h)<c){c=l;u=h<u?h:u;a=s}else if(l===c&&h<u){u=h;a=s}}e=a||e.children[0]}return e},_insert:function(t,e,i){var r=this.toBBox,n=i?t:r(t),o=[],s=this._chooseSubtree(n,this.data,e,o);s.children.push(t);Wh(s,n);for(;0<=e&&o[e].children.length>this._maxEntries;){this._split(o,e);e--}this._adjustParentBBoxes(n,o,e)},_split:function(t,e){var i=t[e],r=i.children.length,n=this._minEntries;this._chooseSplitAxis(i,n,r);var o=this._chooseSplitIndex(i,n,r),s=$h(i.children.splice(o,i.children.length-o));s.height=i.height;s.leaf=i.leaf;Xh(i,this.toBBox);Xh(s,this.toBBox);e?t[e-1].children.push(s):this._splitRoot(i,s)},_splitRoot:function(t,e){this.data=$h([t,e]);this.data.height=t.height+1;this.data.leaf=!1;Xh(this.data,this.toBBox)},_chooseSplitIndex:function(t,e,i){var r,n,o,s,a,h,l,u,c,p,d,f,_,g;h=l=1/0;for(r=e;r<=i-e;r++){n=zh(t,0,r,this.toBBox);o=zh(t,r,i,this.toBBox);s=(c=n,p=o,void 0,d=Math.max(c.minX,p.minX),f=Math.max(c.minY,p.minY),_=Math.min(c.maxX,p.maxX),g=Math.min(c.maxY,p.maxY),Math.max(0,_-d)*Math.max(0,g-f));a=Zh(n)+Zh(o);if(s<h){h=s;u=r;l=a<l?a:l}else if(s===h&&a<l){l=a;u=r}}return u},_chooseSplitAxis:function(t,e,i){var r=t.leaf?this.compareMinX:Hh,n=t.leaf?this.compareMinY:Kh;this._allDistMargin(t,e,i,r)<this._allDistMargin(t,e,i,n)&&t.children.sort(r)},_allDistMargin:function(t,e,i,r){t.children.sort(r);var n,o,s=this.toBBox,a=zh(t,0,e,s),h=zh(t,i-e,i,s),l=qh(a)+qh(h);for(n=e;n<i-e;n++){o=t.children[n];Wh(a,t.leaf?s(o):o);l+=qh(a)}for(n=i-e-1;e<=n;n--){o=t.children[n];Wh(h,t.leaf?s(o):o);l+=qh(h)}return l},_adjustParentBBoxes:function(t,e,i){for(var r=i;0<=r;r--)Wh(e[r],t)},_condense:function(t){for(var e,i=t.length-1;0<=i;i--)0===t[i].children.length?0<i?(e=t[i-1].children).splice(e.indexOf(t[i]),1):this.clear():Xh(t[i],this.toBBox)},_initFormat:function(t){var e=["return a"," - b",";"];this.compareMinX=new Function("a","b",e.join(t[0]));this.compareMinY=new Function("a","b",e.join(t[1]));this.toBBox=new Function("a","return {minX: a"+t[0]+", minY: a"+t[1]+", maxX: a"+t[2]+", maxY: a"+t[3]+"};")}};function Vh(t,e,i){if(!i)return e.indexOf(t);for(var r=0;r<e.length;r++)if(i(t,e[r]))return r;return-1}function Xh(t,e){zh(t,0,t.children.length,e,t)}function zh(t,e,i,r,n){n||(n=$h(null));n.minX=1/0;n.minY=1/0;n.maxX=-1/0;n.maxY=-1/0;for(var o,s=e;s<i;s++){o=t.children[s];Wh(n,t.leaf?r(o):o)}return n}function Wh(t,e){t.minX=Math.min(t.minX,e.minX);t.minY=Math.min(t.minY,e.minY);t.maxX=Math.max(t.maxX,e.maxX);t.maxY=Math.max(t.maxY,e.maxY);return t}function Hh(t,e){return t.minX-e.minX}function Kh(t,e){return t.minY-e.minY}function Zh(t){return(t.maxX-t.minX)*(t.maxY-t.minY)}function qh(t){return t.maxX-t.minX+(t.maxY-t.minY)}function Jh(t,e){return t.minX<=e.minX&&t.minY<=e.minY&&e.maxX<=t.maxX&&e.maxY<=t.maxY}function Qh(t,e){return e.minX<=t.maxX&&e.minY<=t.maxY&&e.maxX>=t.minX&&e.maxY>=t.minY}function $h(t){return{children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function tl(t,e,i,r,n){for(var o,s=[e,i];s.length;)if(!((i=s.pop())-(e=s.pop())<=r)){o=e+Math.ceil((i-e)/r/2)*r;jh(t,o,e,i,n);s.push(e,o,o,i)}}Uh.default=Yh;var el=function(t){this.rbush_=Uh(t,void 0);this.items_={}};el.prototype.insert=function(t,e){var i={minX:t[0],minY:t[1],maxX:t[2],maxY:t[3],value:e};this.rbush_.insert(i);this.items_[St(e)]=i};el.prototype.load=function(t,e){for(var i=new Array(e.length),r=0,n=e.length;r<n;r++){var o=t[r],s=e[r],a={minX:o[0],minY:o[1],maxX:o[2],maxY:o[3],value:s};i[r]=a;this.items_[St(s)]=a}this.rbush_.load(i)};el.prototype.remove=function(t){var e=St(t),i=this.items_[e];delete this.items_[e];return null!==this.rbush_.remove(i)};el.prototype.update=function(t,e){var i=this.items_[St(e)];if(!$([i.minX,i.minY,i.maxX,i.maxY],t)){this.remove(e);this.insert(t,e)}};el.prototype.getAll=function(){return this.rbush_.all().map(function(t){return t.value})};el.prototype.getInExtent=function(t){var e={minX:t[0],minY:t[1],maxX:t[2],maxY:t[3]};return this.rbush_.search(e).map(function(t){return t.value})};el.prototype.forEach=function(t,e){return this.forEach_(this.getAll(),t,e)};el.prototype.forEachInExtent=function(t,e,i){return this.forEach_(this.getInExtent(t),e,i)};el.prototype.forEach_=function(t,e,i){for(var r,n=0,o=t.length;n<o;n++)if(r=e.call(i,t[n]))return r;return r};el.prototype.isEmpty=function(){return Ct(this.items_)};el.prototype.clear=function(){this.rbush_.clear();this.items_={}};el.prototype.getExtent=function(t){var e=this.rbush_.data;return z(e.minX,e.minY,e.maxX,e.maxY,t)};el.prototype.concat=function(t){this.rbush_.load(t.rbush_.all());for(var e in t.items_)this.items_[0|e]=t.items_[0|e]};var il=function(i){function t(t,e){i.call(this,t);this.feature=e}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(x),rl=function(o){function t(t){var e=t||{};o.call(this,{attributions:e.attributions,projection:void 0,state:Ys.READY,wrapX:void 0===e.wrapX||e.wrapX});this.loader_=L;this.format_=e.format;this.overlaps_=null==e.overlaps||e.overlaps;this.url_=e.url;if(void 0!==e.loader)this.loader_=e.loader;else if(void 0!==this.url_){A(this.format_,7);this.loader_=Ah(this.url_,this.format_)}this.strategy_=void 0!==e.strategy?e.strategy:Nh;var i,r,n=void 0===e.useSpatialIndex||e.useSpatialIndex;this.featuresRtree_=n?new el:null;this.loadedExtentsRtree_=new el;this.nullGeometryFeatures_={};this.idIndex_={};this.undefIdIndex_={};this.featureChangeKeys_={};this.featuresCollection_=null;e.features instanceof F?r=(i=e.features).getArray():Array.isArray(e.features)&&(r=e.features);n||void 0!==i||(i=new F(r));void 0!==r&&this.addFeaturesInternal(r);void 0!==i&&this.bindFeaturesCollection_(i)}o&&(t.__proto__=o);((t.prototype=Object.create(o&&o.prototype)).constructor=t).prototype.addFeature=function(t){this.addFeatureInternal(t);this.changed()};t.prototype.addFeatureInternal=function(t){var e=St(t).toString();if(this.addToIndex_(e,t)){this.setupChangeEvents_(e,t);var i=t.getGeometry();if(i){var r=i.getExtent();this.featuresRtree_&&this.featuresRtree_.insert(r,t)}else this.nullGeometryFeatures_[e]=t;this.dispatchEvent(new il(Gh.ADDFEATURE,t))}};t.prototype.setupChangeEvents_=function(t,e){this.featureChangeKeys_[t]=[S(e,R.CHANGE,this.handleFeatureChange_,this),S(e,h.PROPERTYCHANGE,this.handleFeatureChange_,this)]};t.prototype.addToIndex_=function(t,e){var i=!0,r=e.getId();if(void 0!==r)r.toString()in this.idIndex_?i=!1:this.idIndex_[r.toString()]=e;else{A(!(t in this.undefIdIndex_),30);this.undefIdIndex_[t]=e}return i};t.prototype.addFeatures=function(t){this.addFeaturesInternal(t);this.changed()};t.prototype.addFeaturesInternal=function(t){for(var e=[],i=[],r=[],n=0,o=t.length;n<o;n++){var s=t[n],a=St(s).toString();this.addToIndex_(a,s)&&i.push(s)}for(var h=0,l=i.length;h<l;h++){var u=i[h],c=St(u).toString();this.setupChangeEvents_(c,u);var p=u.getGeometry();if(p){var d=p.getExtent();e.push(d);r.push(u)}else this.nullGeometryFeatures_[c]=u}this.featuresRtree_&&this.featuresRtree_.load(e,r);for(var f=0,_=i.length;f<_;f++)this.dispatchEvent(new il(Gh.ADDFEATURE,i[f]))};t.prototype.bindFeaturesCollection_=function(e){var i=!1;S(this,Gh.ADDFEATURE,function(t){if(!i){i=!0;e.push(t.feature);i=!1}});S(this,Gh.REMOVEFEATURE,function(t){if(!i){i=!0;e.remove(t.feature);i=!1}});S(e,a.ADD,function(t){if(!i){i=!0;this.addFeature(t.element);i=!1}},this);S(e,a.REMOVE,function(t){if(!i){i=!0;this.removeFeature(t.element);i=!1}},this);this.featuresCollection_=e};t.prototype.clear=function(t){if(t){for(var e in this.featureChangeKeys_){this.featureChangeKeys_[e].forEach(g)}if(!this.featuresCollection_){this.featureChangeKeys_={};this.idIndex_={};this.undefIdIndex_={}}}else if(this.featuresRtree_){this.featuresRtree_.forEach(this.removeFeatureInternal,this);for(var i in this.nullGeometryFeatures_)this.removeFeatureInternal(this.nullGeometryFeatures_[i])}this.featuresCollection_&&this.featuresCollection_.clear();this.featuresRtree_&&this.featuresRtree_.clear();this.loadedExtentsRtree_.clear();this.nullGeometryFeatures_={};var r=new il(Gh.CLEAR);this.dispatchEvent(r);this.changed()};t.prototype.forEachFeature=function(t){return this.featuresRtree_?this.featuresRtree_.forEach(t):this.featuresCollection_?this.featuresCollection_.forEach(t):void 0};t.prototype.forEachFeatureAtCoordinateDirect=function(e,i){var t=[e[0],e[1],e[0],e[1]];return this.forEachFeatureInExtent(t,function(t){return t.getGeometry().intersectsCoordinate(e)?i(t):void 0})};t.prototype.forEachFeatureInExtent=function(t,e){return this.featuresRtree_?this.featuresRtree_.forEachInExtent(t,e):this.featuresCollection_?this.featuresCollection_.forEach(e):void 0};t.prototype.forEachFeatureIntersectingExtent=function(i,r){return this.forEachFeatureInExtent(i,function(t){if(t.getGeometry().intersectsExtent(i)){var e=r(t);if(e)return e}})};t.prototype.getFeaturesCollection=function(){return this.featuresCollection_};t.prototype.getFeatures=function(){var t;if(this.featuresCollection_)t=this.featuresCollection_.getArray();else if(this.featuresRtree_){t=this.featuresRtree_.getAll();Ct(this.nullGeometryFeatures_)||br(t,s(this.nullGeometryFeatures_))}return t};t.prototype.getFeaturesAtCoordinate=function(t){var e=[];this.forEachFeatureAtCoordinateDirect(t,function(t){e.push(t)});return e};t.prototype.getFeaturesInExtent=function(t){return this.featuresRtree_.getInExtent(t)};t.prototype.getClosestFeatureToCoordinate=function(t,e){var n=t[0],o=t[1],s=null,a=[NaN,NaN],h=1/0,l=[-1/0,-1/0,1/0,1/0],u=e||v;this.featuresRtree_.forEachInExtent(l,function(t){if(u(t)){var e=t.getGeometry(),i=h;if((h=e.closestPointXY(n,o,a,h))<i){s=t;var r=Math.sqrt(h);l[0]=n-r;l[1]=o-r;l[2]=n+r;l[3]=o+r}}});return s};t.prototype.getExtent=function(t){return this.featuresRtree_.getExtent(t)};t.prototype.getFeatureById=function(t){var e=this.idIndex_[t.toString()];return void 0!==e?e:null};t.prototype.getFormat=function(){return this.format_};t.prototype.getOverlaps=function(){return this.overlaps_};t.prototype.getResolutions=function(){};t.prototype.getUrl=function(){return this.url_};t.prototype.handleFeatureChange_=function(t){var e=t.target,i=St(e).toString(),r=e.getGeometry();if(r){var n=r.getExtent();if(i in this.nullGeometryFeatures_){delete this.nullGeometryFeatures_[i];this.featuresRtree_&&this.featuresRtree_.insert(n,e)}else this.featuresRtree_&&this.featuresRtree_.update(n,e)}else if(!(i in this.nullGeometryFeatures_)){this.featuresRtree_&&this.featuresRtree_.remove(e);this.nullGeometryFeatures_[i]=e}var o=e.getId();if(void 0!==o){var s=o.toString();if(i in this.undefIdIndex_){delete this.undefIdIndex_[i];this.idIndex_[s]=e}else if(this.idIndex_[s]!==e){this.removeFromIdIndex_(e);this.idIndex_[s]=e}}else if(!(i in this.undefIdIndex_)){this.removeFromIdIndex_(e);this.undefIdIndex_[i]=e}this.changed();this.dispatchEvent(new il(Gh.CHANGEFEATURE,e))};t.prototype.hasFeature=function(t){var e=t.getId();return void 0!==e?e in this.idIndex_:St(t).toString()in this.undefIdIndex_};t.prototype.isEmpty=function(){return this.featuresRtree_.isEmpty()&&Ct(this.nullGeometryFeatures_)};t.prototype.loadFeatures=function(t,r,n){var o=this,s=this.loadedExtentsRtree_,a=this.strategy_(t,r);this.loading=!1;for(var e=function(t,e){var i=a[t];if(!s.forEachInExtent(i,function(t){return Q(t.extent,i)})){o.loader_.call(o,i,r,n);s.insert(i,{extent:i.slice()});o.loading=!0}},i=0,h=a.length;i<h;++i)e(i)};t.prototype.removeLoadedExtent=function(e){var i,t=this.loadedExtentsRtree_;t.forEachInExtent(e,function(t){if($(t.extent,e)){i=t;return!0}});i&&t.remove(i)};t.prototype.removeFeature=function(t){var e=St(t).toString();e in this.nullGeometryFeatures_?delete this.nullGeometryFeatures_[e]:this.featuresRtree_&&this.featuresRtree_.remove(t);this.removeFeatureInternal(t);this.changed()};t.prototype.removeFeatureInternal=function(t){var e=St(t).toString();this.featureChangeKeys_[e].forEach(g);delete this.featureChangeKeys_[e];var i=t.getId();void 0!==i?delete this.idIndex_[i.toString()]:delete this.undefIdIndex_[e];this.dispatchEvent(new il(Gh.REMOVEFEATURE,t))};t.prototype.removeFromIdIndex_=function(t){var e=!1;for(var i in this.idIndex_)if(this.idIndex_[i]===t){delete this.idIndex_[i];e=!0;break}return e};t.prototype.setLoader=function(t){this.loader_=t};return t}(Dh),nl={POINT:"Point",LINE_STRING:"LineString",POLYGON:"Polygon",CIRCLE:"Circle"},ol="drawstart",sl="drawend",al=function(i){function t(t,e){i.call(this,t);this.feature=e}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(x),hl=function(o){function t(t){o.call(this,{handleDownEvent:ul,handleEvent:ll,handleUpEvent:cl,stopDown:m});this.shouldHandle_=!1;this.downPx_=null;this.downTimeout_;this.lastDragTime_;this.freehand_=!1;this.source_=t.source?t.source:null;this.features_=t.features?t.features:null;this.snapTolerance_=t.snapTolerance?t.snapTolerance:12;this.type_=t.type;this.mode_=function(t){var e;t===kt.POINT||t===kt.MULTI_POINT?e=nl.POINT:t===kt.LINE_STRING||t===kt.MULTI_LINE_STRING?e=nl.LINE_STRING:t===kt.POLYGON||t===kt.MULTI_POLYGON?e=nl.POLYGON:t===kt.CIRCLE&&(e=nl.CIRCLE);return e}(this.type_);this.stopClick_=!!t.stopClick;this.minPoints_=t.minPoints?t.minPoints:this.mode_===nl.POLYGON?3:2;this.maxPoints_=t.maxPoints?t.maxPoints:1/0;this.finishCondition_=t.finishCondition?t.finishCondition:v;var i,e=t.geometryFunction;if(!e)if(this.type_===kt.CIRCLE)e=function(t,e){var i=e||new Ch([NaN,NaN]),r=Zn(t[0],t[1]);i.setCenterAndRadius(t[0],Math.sqrt(r));return i};else{var r,n=this.mode_;n===nl.POINT?r=fn:n===nl.LINE_STRING?r=ro:n===nl.POLYGON&&(r=Fn);e=function(t,e){var i=e;i?n===nl.POLYGON?t[0].length?i.setCoordinates([t[0].concat([t[0][0]])]):i.setCoordinates([]):i.setCoordinates(t):i=new r(t);return i}}this.geometryFunction_=e;this.dragVertexDelay_=void 0!==t.dragVertexDelay?t.dragVertexDelay:500;this.finishCoordinate_=null;this.sketchFeature_=null;this.sketchPoint_=null;this.sketchCoords_=null;this.sketchLine_=null;this.sketchLineCoords_=null;this.squaredClickTolerance_=t.clickTolerance?t.clickTolerance*t.clickTolerance:36;this.overlay_=new bh({source:new rl({useSpatialIndex:!1,wrapX:!!t.wrapX&&t.wrapX}),style:t.style?t.style:(i=Er(),function(t,e){return i[t.getGeometry().getType()]}),updateWhileInteracting:!0});this.geometryName_=t.geometryName;this.condition_=t.condition?t.condition:Ta;this.freehandCondition_;t.freehand?this.freehandCondition_=ya:this.freehandCondition_=t.freehandCondition?t.freehandCondition:Sa;S(this,P(na.ACTIVE),this.updateState_,this)}o&&(t.__proto__=o);((t.prototype=Object.create(o&&o.prototype)).constructor=t).prototype.setMap=function(t){o.prototype.setMap.call(this,t);this.updateState_()};t.prototype.getOverlay=function(){return this.overlay_};t.prototype.handlePointerMove_=function(t){if(this.downPx_&&(!this.freehand_&&this.shouldHandle_||this.freehand_&&!this.shouldHandle_)){var e=this.downPx_,i=t.pixel,r=e[0]-i[0],n=e[1]-i[1],o=r*r+n*n;this.shouldHandle_=this.freehand_?o>this.squaredClickTolerance_:o<=this.squaredClickTolerance_;if(!this.shouldHandle_)return!0}this.finishCoordinate_?this.modifyDrawing_(t):this.createOrUpdateSketchPoint_(t);return!0};t.prototype.atFinish_=function(t){var e=!1;if(this.sketchFeature_){var i=!1,r=[this.finishCoordinate_];if(this.mode_===nl.LINE_STRING)i=this.sketchCoords_.length>this.minPoints_;else if(this.mode_===nl.POLYGON){i=this.sketchCoords_[0].length>this.minPoints_;r=[this.sketchCoords_[0][0],this.sketchCoords_[0][this.sketchCoords_[0].length-2]]}if(i)for(var n=t.map,o=0,s=r.length;o<s;o++){var a=r[o],h=n.getPixelFromCoordinate(a),l=t.pixel,u=l[0]-h[0],c=l[1]-h[1],p=this.freehand_?1:this.snapTolerance_;if(e=Math.sqrt(u*u+c*c)<=p){this.finishCoordinate_=a;break}}}return e};t.prototype.createOrUpdateSketchPoint_=function(t){var e=t.coordinate.slice();if(this.sketchPoint_){this.sketchPoint_.getGeometry().setCoordinates(e)}else{this.sketchPoint_=new Sr(new fn(e));this.updateSketchFeatures_()}};t.prototype.startDrawing_=function(t){var e=t.coordinate;this.finishCoordinate_=e;if(this.mode_===nl.POINT)this.sketchCoords_=e.slice();else if(this.mode_===nl.POLYGON){this.sketchCoords_=[[e.slice(),e.slice()]];this.sketchLineCoords_=this.sketchCoords_[0]}else this.sketchCoords_=[e.slice(),e.slice()];this.sketchLineCoords_&&(this.sketchLine_=new Sr(new ro(this.sketchLineCoords_)));var i=this.geometryFunction_(this.sketchCoords_);this.sketchFeature_=new Sr;this.geometryName_&&this.sketchFeature_.setGeometryName(this.geometryName_);this.sketchFeature_.setGeometry(i);this.updateSketchFeatures_();this.dispatchEvent(new al(ol,this.sketchFeature_))};t.prototype.modifyDrawing_=function(t){var e,i,r,n=t.coordinate,o=this.sketchFeature_.getGeometry();if(this.mode_===nl.POINT)i=this.sketchCoords_;else if(this.mode_===nl.POLYGON){i=(e=this.sketchCoords_[0])[e.length-1];this.atFinish_(t)&&(n=this.finishCoordinate_.slice())}else i=(e=this.sketchCoords_)[e.length-1];i[0]=n[0];i[1]=n[1];this.geometryFunction_(this.sketchCoords_,o);if(this.sketchPoint_){this.sketchPoint_.getGeometry().setCoordinates(n)}if(o instanceof Fn&&this.mode_!==nl.POLYGON){this.sketchLine_||(this.sketchLine_=new Sr);var s=o.getLinearRing(0);if(r=this.sketchLine_.getGeometry()){r.setFlatCoordinates(s.getLayout(),s.getFlatCoordinates());r.changed()}else{r=new ro(s.getFlatCoordinates(),s.getLayout());this.sketchLine_.setGeometry(r)}}else this.sketchLineCoords_&&(r=this.sketchLine_.getGeometry()).setCoordinates(this.sketchLineCoords_);this.updateSketchFeatures_()};t.prototype.addToDrawing_=function(t){var e,i,r=t.coordinate,n=this.sketchFeature_.getGeometry();if(this.mode_===nl.LINE_STRING){this.finishCoordinate_=r.slice();(i=this.sketchCoords_).length>=this.maxPoints_&&(this.freehand_?i.pop():e=!0);i.push(r.slice());this.geometryFunction_(i,n)}else if(this.mode_===nl.POLYGON){(i=this.sketchCoords_[0]).length>=this.maxPoints_&&(this.freehand_?i.pop():e=!0);i.push(r.slice());e&&(this.finishCoordinate_=i[0]);this.geometryFunction_(this.sketchCoords_,n)}this.updateSketchFeatures_();e&&this.finishDrawing()};t.prototype.removeLastPoint=function(){if(this.sketchFeature_){var t,e=this.sketchFeature_.getGeometry();if(this.mode_===nl.LINE_STRING){(t=this.sketchCoords_).splice(-2,1);this.geometryFunction_(t,e);2<=t.length&&(this.finishCoordinate_=t[t.length-2].slice())}else if(this.mode_===nl.POLYGON){(t=this.sketchCoords_[0]).splice(-2,1);this.sketchLine_.getGeometry().setCoordinates(t);this.geometryFunction_(this.sketchCoords_,e)}0===t.length&&(this.finishCoordinate_=null);this.updateSketchFeatures_()}};t.prototype.finishDrawing=function(){var t=this.abortDrawing_();if(t){var e=this.sketchCoords_,i=t.getGeometry();if(this.mode_===nl.LINE_STRING){e.pop();this.geometryFunction_(e,i)}else if(this.mode_===nl.POLYGON){e[0].pop();this.geometryFunction_(e,i);e=i.getCoordinates()}this.type_===kt.MULTI_POINT?t.setGeometry(new Ih([e])):this.type_===kt.MULTI_LINE_STRING?t.setGeometry(new Rh([e])):this.type_===kt.MULTI_POLYGON&&t.setGeometry(new Lh([e]));this.dispatchEvent(new al(sl,t));this.features_&&this.features_.push(t);this.source_&&this.source_.addFeature(t)}};t.prototype.abortDrawing_=function(){this.finishCoordinate_=null;var t=this.sketchFeature_;if(t){this.sketchFeature_=null;this.sketchPoint_=null;this.sketchLine_=null;this.overlay_.getSource().clear(!0)}return t};t.prototype.extend=function(t){var e=t.getGeometry();this.sketchFeature_=t;this.sketchCoords_=e.getCoordinates();var i=this.sketchCoords_[this.sketchCoords_.length-1];this.finishCoordinate_=i.slice();this.sketchCoords_.push(i.slice());this.updateSketchFeatures_();this.dispatchEvent(new al(ol,this.sketchFeature_))};t.prototype.updateSketchFeatures_=function(){var t=[];this.sketchFeature_&&t.push(this.sketchFeature_);this.sketchLine_&&t.push(this.sketchLine_);this.sketchPoint_&&t.push(this.sketchPoint_);var e=this.overlay_.getSource();e.clear(!0);e.addFeatures(t)};t.prototype.updateState_=function(){var t=this.getMap(),e=this.getActive();t&&e||this.abortDrawing_();this.overlay_.setMap(e?t:null)};return t}(ba);function ll(t){t.originalEvent.type===R.CONTEXTMENU&&t.preventDefault();this.freehand_=this.mode_!==nl.POINT&&this.freehandCondition_(t);var e=t.type===Oo.POINTERMOVE,i=!0;if(this.lastDragTime_&&t.type===Oo.POINTERDRAG){if(Date.now()-this.lastDragTime_>=this.dragVertexDelay_){this.downPx_=t.pixel;this.shouldHandle_=!this.freehand_;e=!0}else this.lastDragTime_=void 0;if(this.shouldHandle_&&this.downTimeout_){clearTimeout(this.downTimeout_);this.downTimeout_=void 0}}if(this.freehand_&&t.type===Oo.POINTERDRAG&&null!==this.sketchFeature_){this.addToDrawing_(t);i=!1}else this.freehand_&&t.type===Oo.POINTERDOWN?i=!1:e?(i=t.type===Oo.POINTERMOVE)&&this.freehand_?i=this.handlePointerMove_(t):(t.pointerEvent.pointerType==Ao||t.type===Oo.POINTERDRAG&&!this.downTimeout_)&&this.handlePointerMove_(t):t.type===Oo.DBLCLICK&&(i=!1);return Fa.call(this,t)&&i}function ul(t){this.shouldHandle_=!this.freehand_;if(this.freehand_){this.downPx_=t.pixel;this.finishCoordinate_||this.startDrawing_(t);return!0}if(this.condition_(t)){this.lastDragTime_=Date.now();this.downTimeout_=setTimeout(function(){this.handlePointerMove_(new Po(Oo.POINTERMOVE,t.map,t.pointerEvent,t.frameState))}.bind(this),this.dragVertexDelay_);this.downPx_=t.pixel;return!0}return!1}function cl(t){var e=!0;if(this.downTimeout_){clearTimeout(this.downTimeout_);this.downTimeout_=void 0}this.handlePointerMove_(t);var i=this.mode_===nl.CIRCLE;if(this.shouldHandle_){if(this.finishCoordinate_)this.freehand_||i?this.finishDrawing():this.atFinish_(t)?this.finishCondition_(t)&&this.finishDrawing():this.addToDrawing_(t);else{this.startDrawing_(t);this.mode_===nl.POINT&&this.finishDrawing()}e=!1}else if(this.freehand_){this.finishCoordinate_=null;this.abortDrawing_()}!e&&this.stopClick_&&t.stopPropagation();return e}var pl="extentchanged",dl=function(e){function t(t){e.call(this,pl);this.extent=t}e&&(t.__proto__=e);return(t.prototype=Object.create(e&&e.prototype)).constructor=t}(x),fl=function(n){function t(t){n.call(this,{handleDownEvent:gl,handleDragEvent:yl,handleEvent:_l,handleUpEvent:vl});var i,r,e=t||{};this.extent_=null;this.pointerHandler_=null;this.pixelTolerance_=void 0!==e.pixelTolerance?e.pixelTolerance:10;this.snappedToVertex_=!1;this.extentFeature_=null;this.vertexFeature_=null;t||(t={});this.extentOverlay_=new bh({source:new rl({useSpatialIndex:!1,wrapX:!!t.wrapX}),style:t.boxStyle?t.boxStyle:(i=Er(),function(t,e){return i[kt.POLYGON]}),updateWhileAnimating:!0,updateWhileInteracting:!0});this.vertexOverlay_=new bh({source:new rl({useSpatialIndex:!1,wrapX:!!t.wrapX}),style:t.pointerStyle?t.pointerStyle:(r=Er(),function(t,e){return r[kt.POINT]}),updateWhileAnimating:!0,updateWhileInteracting:!0});t.extent&&this.setExtent(t.extent)}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.snapToVertex_=function(t,e){var i,r=e.getCoordinateFromPixel(t),n=this.getExtent();if(n){var o=[[[(i=n)[0],i[1]],[i[0],i[3]]],[[i[0],i[3]],[i[2],i[3]]],[[i[2],i[3]],[i[2],i[1]]],[[i[2],i[1]],[i[0],i[1]]]];o.sort(function(t,e){return Jn(r,t)-Jn(r,e)});var s=o[0],a=Vn(r,s),h=e.getPixelFromCoordinate(a);if(qn(t,h)<=this.pixelTolerance_){var l=e.getPixelFromCoordinate(s[0]),u=e.getPixelFromCoordinate(s[1]),c=Zn(h,l),p=Zn(h,u),d=Math.sqrt(Math.min(c,p));this.snappedToVertex_=d<=this.pixelTolerance_;this.snappedToVertex_&&(a=p<c?s[1]:s[0]);return a}}return null};t.prototype.handlePointerMove_=function(t){var e=t.pixel,i=t.map,r=this.snapToVertex_(e,i);r||(r=i.getCoordinateFromPixel(e));this.createOrUpdatePointerFeature_(r)};t.prototype.createOrUpdateExtentFeature_=function(t){var e=this.extentFeature_;if(e)t?e.setGeometry(Nn(t)):e.setGeometry(void 0);else{e=new Sr(t?Nn(t):{});this.extentFeature_=e;this.extentOverlay_.getSource().addFeature(e)}return e};t.prototype.createOrUpdatePointerFeature_=function(t){var e=this.vertexFeature_;if(e){e.getGeometry().setCoordinates(t)}else{e=new Sr(new fn(t));this.vertexFeature_=e;this.vertexOverlay_.getSource().addFeature(e)}return e};t.prototype.setMap=function(t){this.extentOverlay_.setMap(t);this.vertexOverlay_.setMap(t);n.prototype.setMap.call(this,t)};t.prototype.getExtent=function(){return this.extent_};t.prototype.setExtent=function(t){this.extent_=t||null;this.createOrUpdateExtentFeature_(t);this.dispatchEvent(new dl(this.extent_))};return t}(ba);function _l(t){if(!(t instanceof Po))return!0;t.type!=Oo.POINTERMOVE||this.handlingDownUpSequence||this.handlePointerMove_(t);Fa.call(this,t);return!1}function gl(t){var e=t.pixel,i=t.map,r=this.getExtent(),n=this.snapToVertex_(e,i),o=function(t){var e=null,i=null;t[0]==r[0]?e=r[2]:t[0]==r[2]&&(e=r[0]);t[1]==r[1]?i=r[3]:t[1]==r[3]&&(i=r[1]);return null!==e&&null!==i?[e,i]:null};if(n&&r){var s=n[0]==r[0]||n[0]==r[2]?n[0]:null,a=n[1]==r[1]||n[1]==r[3]?n[1]:null;null!==s&&null!==a?this.pointerHandler_=ml(o(n)):null!==s?this.pointerHandler_=xl(o([s,r[1]]),o([s,r[3]])):null!==a&&(this.pointerHandler_=xl(o([r[0],a]),o([r[2],a])))}else{n=i.getCoordinateFromPixel(e);this.setExtent([n[0],n[1],n[0],n[1]]);this.pointerHandler_=ml(n)}return!0}function yl(t){if(this.pointerHandler_){var e=t.coordinate;this.setExtent(this.pointerHandler_(e));this.createOrUpdatePointerFeature_(e)}return!0}function vl(t){this.pointerHandler_=null;var e=this.getExtent();e&&0!==ot(e)||this.setExtent(null);return!1}function ml(e){return function(t){return G([e,t])}}function xl(e,i){return e[0]==i[0]?function(t){return G([e,[t[0],i[1]]])}:e[1]==i[1]?function(t){return G([e,[i[0],t[1]]])}:null}var El=0,Tl=1,Sl={MODIFYSTART:"modifystart",MODIFYEND:"modifyend"},Cl=function(r){function t(t,e,i){r.call(this,t);this.features=e;this.mapBrowserEvent=i}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(x),Rl=function(r){function t(t){r.call(this,{handleDownEvent:wl,handleDragEvent:Ll,handleEvent:Pl,handleUpEvent:Ol});this.condition_=t.condition?t.condition:Ia;this.defaultDeleteCondition_=function(t){return fa(t)&&Ea(t)};this.deleteCondition_=t.deleteCondition?t.deleteCondition:this.defaultDeleteCondition_;this.insertVertexCondition_=t.insertVertexCondition?t.insertVertexCondition:ya;this.vertexFeature_=null;this.vertexSegments_=null;this.lastPixel_=[0,0];this.ignoreNextSingleClick_=!1;this.modified_=!1;this.rBush_=new el;this.pixelTolerance_=void 0!==t.pixelTolerance?t.pixelTolerance:10;this.snappedToVertex_=!1;this.changingFeature_=!1;this.dragSegments_=[];this.overlay_=new bh({source:new rl({useSpatialIndex:!1,wrapX:!!t.wrapX}),style:t.style?t.style:(i=Er(),function(t,e){return i[kt.POINT]}),updateWhileAnimating:!0,updateWhileInteracting:!0});var i,e;this.SEGMENT_WRITERS_={Point:this.writePointGeometry_,LineString:this.writeLineStringGeometry_,LinearRing:this.writeLineStringGeometry_,Polygon:this.writePolygonGeometry_,MultiPoint:this.writeMultiPointGeometry_,MultiLineString:this.writeMultiLineStringGeometry_,MultiPolygon:this.writeMultiPolygonGeometry_,Circle:this.writeCircleGeometry_,GeometryCollection:this.writeGeometryCollectionGeometry_};this.source_=null;if(t.source){this.source_=t.source;e=new F(this.source_.getFeatures());S(this.source_,Gh.ADDFEATURE,this.handleSourceAdd_,this);S(this.source_,Gh.REMOVEFEATURE,this.handleSourceRemove_,this)}else e=t.features;if(!e)throw new Error("The modify interaction requires features or a source");this.features_=e;this.features_.forEach(this.addFeature_.bind(this));S(this.features_,a.ADD,this.handleFeatureAdd_,this);S(this.features_,a.REMOVE,this.handleFeatureRemove_,this);this.lastPointerEvent_=null}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.addFeature_=function(t){var e=t.getGeometry();e&&e.getType()in this.SEGMENT_WRITERS_&&this.SEGMENT_WRITERS_[e.getType()].call(this,t,e);var i=this.getMap();i&&i.isRendered()&&this.getActive()&&this.handlePointerAtPixel_(this.lastPixel_,i);S(t,R.CHANGE,this.handleFeatureChange_,this)};t.prototype.willModifyFeatures_=function(t){if(!this.modified_){this.modified_=!0;this.dispatchEvent(new Cl(Sl.MODIFYSTART,this.features_,t))}};t.prototype.removeFeature_=function(t){this.removeFeatureSegmentData_(t);if(this.vertexFeature_&&0===this.features_.getLength()){this.overlay_.getSource().removeFeature(this.vertexFeature_);this.vertexFeature_=null}f(t,R.CHANGE,this.handleFeatureChange_,this)};t.prototype.removeFeatureSegmentData_=function(e){var t=this.rBush_,i=[];t.forEach(function(t){e===t.feature&&i.push(t)});for(var r=i.length-1;0<=r;--r)t.remove(i[r])};t.prototype.setActive=function(t){if(this.vertexFeature_&&!t){this.overlay_.getSource().removeFeature(this.vertexFeature_);this.vertexFeature_=null}r.prototype.setActive.call(this,t)};t.prototype.setMap=function(t){this.overlay_.setMap(t);r.prototype.setMap.call(this,t)};t.prototype.getOverlay=function(){return this.overlay_};t.prototype.handleSourceAdd_=function(t){t.feature&&this.features_.push(t.feature)};t.prototype.handleSourceRemove_=function(t){t.feature&&this.features_.remove(t.feature)};t.prototype.handleFeatureAdd_=function(t){this.addFeature_(t.element)};t.prototype.handleFeatureChange_=function(t){if(!this.changingFeature_){var e=t.target;this.removeFeature_(e);this.addFeature_(e)}};t.prototype.handleFeatureRemove_=function(t){var e=t.element;this.removeFeature_(e)};t.prototype.writePointGeometry_=function(t,e){var i=e.getCoordinates(),r={feature:t,geometry:e,segment:[i,i]};this.rBush_.insert(e.getExtent(),r)};t.prototype.writeMultiPointGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length;r<n;++r){var o=i[r],s={feature:t,geometry:e,depth:[r],index:r,segment:[o,o]};this.rBush_.insert(e.getExtent(),s)}};t.prototype.writeLineStringGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length-1;r<n;++r){var o=i.slice(r,r+2),s={feature:t,geometry:e,index:r,segment:o};this.rBush_.insert(G(o),s)}};t.prototype.writeMultiLineStringGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length;r<n;++r)for(var o=i[r],s=0,a=o.length-1;s<a;++s){var h=o.slice(s,s+2),l={feature:t,geometry:e,depth:[r],index:s,segment:h};this.rBush_.insert(G(h),l)}};t.prototype.writePolygonGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length;r<n;++r)for(var o=i[r],s=0,a=o.length-1;s<a;++s){var h=o.slice(s,s+2),l={feature:t,geometry:e,depth:[r],index:s,segment:h};this.rBush_.insert(G(h),l)}};t.prototype.writeMultiPolygonGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length;r<n;++r)for(var o=i[r],s=0,a=o.length;s<a;++s)for(var h=o[s],l=0,u=h.length-1;l<u;++l){var c=h.slice(l,l+2),p={feature:t,geometry:e,depth:[s,r],index:l,segment:c};this.rBush_.insert(G(c),p)}};t.prototype.writeCircleGeometry_=function(t,e){var i=e.getCenter(),r={feature:t,geometry:e,index:El,segment:[i,i]},n={feature:t,geometry:e,index:Tl,segment:[i,i]},o=[r,n];r.featureSegments=n.featureSegments=o;this.rBush_.insert(H(i),r);this.rBush_.insert(e.getExtent(),n)};t.prototype.writeGeometryCollectionGeometry_=function(t,e){for(var i=e.getGeometriesArray(),r=0;r<i.length;++r)this.SEGMENT_WRITERS_[i[r].getType()].call(this,t,i[r])};t.prototype.createOrUpdateVertexFeature_=function(t){var e=this.vertexFeature_;if(e){e.getGeometry().setCoordinates(t)}else{e=new Sr(new fn(t));this.vertexFeature_=e;this.overlay_.getSource().addFeature(e)}return e};t.prototype.handlePointerMove_=function(t){this.lastPixel_=t.pixel;this.handlePointerAtPixel_(t.pixel,t.map)};t.prototype.handlePointerAtPixel_=function(t,e){var i=e.getCoordinateFromPixel(t),r=k(H(i),e.getView().getResolution()*this.pixelTolerance_),n=this.rBush_.getInExtent(r);if(0<n.length){n.sort(function(t,e){return bl(i,t)-bl(i,e)});var o=n[0],s=o.segment,a=Ml(i,o),h=e.getPixelFromCoordinate(a),l=qn(t,h);if(l<=this.pixelTolerance_){var u={};if(o.geometry.getType()===kt.CIRCLE&&o.index===Tl){this.snappedToVertex_=!0;this.createOrUpdateVertexFeature_(a)}else{var c=e.getPixelFromCoordinate(s[0]),p=e.getPixelFromCoordinate(s[1]),d=Zn(h,c),f=Zn(h,p);l=Math.sqrt(Math.min(d,f));this.snappedToVertex_=l<=this.pixelTolerance_;this.snappedToVertex_&&(a=f<d?s[1]:s[0]);this.createOrUpdateVertexFeature_(a);for(var _=1,g=n.length;_<g;++_){var y=n[_].segment;if(!(Wn(s[0],y[0])&&Wn(s[1],y[1])||Wn(s[0],y[1])&&Wn(s[1],y[0])))break;u[St(y)]=!0}}u[St(s)]=!0;this.vertexSegments_=u;return}}if(this.vertexFeature_){this.overlay_.getSource().removeFeature(this.vertexFeature_);this.vertexFeature_=null}};t.prototype.insertVertex_=function(t,e){for(var i,r=t.segment,n=t.feature,o=t.geometry,s=t.depth,a=t.index;e.length<o.getStride();)e.push(0);switch(o.getType()){case kt.MULTI_LINE_STRING:case kt.POLYGON:(i=o.getCoordinates())[s[0]].splice(a+1,0,e);break;case kt.MULTI_POLYGON:(i=o.getCoordinates())[s[1]][s[0]].splice(a+1,0,e);break;case kt.LINE_STRING:(i=o.getCoordinates()).splice(a+1,0,e);break;default:return}this.setGeometryCoordinates_(o,i);var h=this.rBush_;h.remove(t);this.updateSegmentIndices_(o,a,s,1);var l={segment:[r[0],e],feature:n,geometry:o,depth:s,index:a};h.insert(G(l.segment),l);this.dragSegments_.push([l,1]);var u={segment:[e,r[1]],feature:n,geometry:o,depth:s,index:a+1};h.insert(G(u.segment),u);this.dragSegments_.push([u,0]);this.ignoreNextSingleClick_=!0};t.prototype.removePoint=function(){if(this.lastPointerEvent_&&this.lastPointerEvent_.type!=Oo.POINTERDRAG){var t=this.lastPointerEvent_;this.willModifyFeatures_(t);this.removeVertex_();this.dispatchEvent(new Cl(Sl.MODIFYEND,this.features_,t));return!(this.modified_=!1)}return!1};t.prototype.removeVertex_=function(){var t,e,i,r,n,o,s,a,h,l,u,c=this.dragSegments_,p={},d=!1;for(n=c.length-1;0<=n;--n){u=St((l=(i=c[n])[0]).feature);l.depth&&(u+="-"+l.depth.join("-"));u in p||(p[u]={});if(0===i[1]){p[u].right=l;p[u].index=l.index}else if(1==i[1]){p[u].left=l;p[u].index=l.index+1}}for(u in p){h=p[u].right;s=p[u].left;(a=(o=p[u].index)-1)<0&&(a=0);t=e=(r=(l=void 0!==s?s:h).geometry).getCoordinates();d=!1;switch(r.getType()){case kt.MULTI_LINE_STRING:if(2<e[l.depth[0]].length){e[l.depth[0]].splice(o,1);d=!0}break;case kt.LINE_STRING:if(2<e.length){e.splice(o,1);d=!0}break;case kt.MULTI_POLYGON:t=t[l.depth[1]];case kt.POLYGON:if(4<(t=t[l.depth[0]]).length){o==t.length-1&&(o=0);t.splice(o,1);d=!0;if(0===o){t.pop();t.push(t[0]);a=t.length-1}}}if(d){this.setGeometryCoordinates_(r,e);var f=[];if(void 0!==s){this.rBush_.remove(s);f.push(s.segment[0])}if(void 0!==h){this.rBush_.remove(h);f.push(h.segment[1])}if(void 0!==s&&void 0!==h){var _={depth:l.depth,feature:l.feature,geometry:l.geometry,index:a,segment:f};this.rBush_.insert(G(_.segment),_)}this.updateSegmentIndices_(r,o,l.depth,-1);if(this.vertexFeature_){this.overlay_.getSource().removeFeature(this.vertexFeature_);this.vertexFeature_=null}c.length=0}}return d};t.prototype.setGeometryCoordinates_=function(t,e){this.changingFeature_=!0;t.setCoordinates(e);this.changingFeature_=!1};t.prototype.updateSegmentIndices_=function(e,i,r,n){this.rBush_.forEachInExtent(e.getExtent(),function(t){t.geometry===e&&(void 0===r||void 0===t.depth||Ar(t.depth,r))&&t.index>i&&(t.index+=n)})};return t}(ba);function Il(t,e){return t.index-e.index}function wl(t){if(!this.condition_(t))return!1;this.handlePointerAtPixel_(t.pixel,t.map);var e=t.map.getCoordinateFromPixel(t.pixel);this.dragSegments_.length=0;this.modified_=!1;var i=this.vertexFeature_;if(i){var r=[],n=i.getGeometry().getCoordinates(),o=G([n]),s=this.rBush_.getInExtent(o),a={};s.sort(Il);for(var h=0,l=s.length;h<l;++h){var u=s[h],c=u.segment,p=St(u.feature),d=u.depth;d&&(p+="-"+d.join("-"));a[p]||(a[p]=new Array(2));if(u.geometry.getType()===kt.CIRCLE&&u.index===Tl){if(Wn(Ml(e,u),n)&&!a[p][0]){this.dragSegments_.push([u,0]);a[p][0]=u}}else if(Wn(c[0],n)&&!a[p][0]){this.dragSegments_.push([u,0]);a[p][0]=u}else if(Wn(c[1],n)&&!a[p][1]){if((u.geometry.getType()===kt.LINE_STRING||u.geometry.getType()===kt.MULTI_LINE_STRING)&&a[p][0]&&0===a[p][0].index)continue;this.dragSegments_.push([u,1]);a[p][1]=u}else this.insertVertexCondition_(t)&&St(c)in this.vertexSegments_&&!a[p][0]&&!a[p][1]&&r.push([u,n])}r.length&&this.willModifyFeatures_(t);for(var f=r.length-1;0<=f;--f)this.insertVertex_.apply(this,r[f])}return!!this.vertexFeature_}function Ll(t){this.ignoreNextSingleClick_=!1;this.willModifyFeatures_(t);for(var e=t.coordinate,i=0,r=this.dragSegments_.length;i<r;++i){for(var n=this.dragSegments_[i],o=n[0],s=o.depth,a=o.geometry,h=void 0,l=o.segment,u=n[1];e.length<a.getStride();)e.push(l[u][e.length]);switch(a.getType()){case kt.POINT:h=e;l[0]=l[1]=e;break;case kt.MULTI_POINT:(h=a.getCoordinates())[o.index]=e;l[0]=l[1]=e;break;case kt.LINE_STRING:(h=a.getCoordinates())[o.index+u]=e;l[u]=e;break;case kt.MULTI_LINE_STRING:case kt.POLYGON:(h=a.getCoordinates())[s[0]][o.index+u]=e;l[u]=e;break;case kt.MULTI_POLYGON:(h=a.getCoordinates())[s[1]][s[0]][o.index+u]=e;l[u]=e;break;case kt.CIRCLE:l[0]=l[1]=e;if(o.index===El){this.changingFeature_=!0;a.setCenter(e);this.changingFeature_=!1}else{this.changingFeature_=!0;a.setRadius(qn(a.getCenter(),e));this.changingFeature_=!1}}h&&this.setGeometryCoordinates_(a,h)}this.createOrUpdateVertexFeature_(e)}function Ol(t){for(var e=this.dragSegments_.length-1;0<=e;--e){var i=this.dragSegments_[e][0],r=i.geometry;if(r.getType()===kt.CIRCLE){var n=r.getCenter(),o=i.featureSegments[0],s=i.featureSegments[1];o.segment[0]=o.segment[1]=n;s.segment[0]=s.segment[1]=n;this.rBush_.update(H(n),o);this.rBush_.update(r.getExtent(),s)}else this.rBush_.update(G(i.segment),i)}if(this.modified_){this.dispatchEvent(new Cl(Sl.MODIFYEND,this.features_,t));this.modified_=!1}return!1}function Pl(t){if(!(t instanceof Po))return!0;var e;(this.lastPointerEvent_=t).map.getView().getInteracting()||t.type!=Oo.POINTERMOVE||this.handlingDownUpSequence||this.handlePointerMove_(t);this.vertexFeature_&&this.deleteCondition_(t)&&(e=!(t.type!=Oo.SINGLECLICK||!this.ignoreNextSingleClick_)||this.removePoint());t.type==Oo.SINGLECLICK&&(this.ignoreNextSingleClick_=!1);return Fa.call(this,t)&&!e}function bl(t,e){var i=e.geometry;if(i.getType()===kt.CIRCLE){var r=i;if(e.index===Tl){var n=Zn(r.getCenter(),t),o=Math.sqrt(n)-r.getRadius();return o*o}}return Jn(t,e.segment)}function Ml(t,e){var i=e.geometry;return i.getType()===kt.CIRCLE&&e.index===Tl?i.getClosestPoint(t):Vn(t,e.segment)}var Fl={SELECT:"select"},Al=function(n){function t(t,e,i,r){n.call(this,t);this.selected=e;this.deselected=i;this.mapBrowserEvent=r}n&&(t.__proto__=n);return(t.prototype=Object.create(n&&n.prototype)).constructor=t}(x),Nl=function(s){function t(t){s.call(this,{handleEvent:Dl});var e=t||{};this.condition_=e.condition?e.condition:Ea;this.addCondition_=e.addCondition?e.addCondition:ma;this.removeCondition_=e.removeCondition?e.removeCondition:ma;this.toggleCondition_=e.toggleCondition?e.toggleCondition:Sa;this.multi_=!!e.multi&&e.multi;this.filter_=e.filter?e.filter:v;this.hitTolerance_=e.hitTolerance?e.hitTolerance:0;var i,r=new bh({source:new rl({useSpatialIndex:!1,features:e.features,wrapX:e.wrapX}),style:e.style?e.style:function(){var i=Er();br(i[kt.POLYGON],i[kt.LINE_STRING]);br(i[kt.GEOMETRY_COLLECTION],i[kt.LINE_STRING]);return function(t,e){return t.getGeometry()?i[t.getGeometry().getType()]:null}}(),updateWhileAnimating:!0,updateWhileInteracting:!0});this.featureOverlay_=r;if(e.layers)if("function"==typeof e.layers)i=e.layers;else{var n=e.layers;i=function(t){return Lr(n,t)}}else i=v;this.layerFilter_=i;this.featureLayerAssociation_={};var o=this.featureOverlay_.getSource().getFeaturesCollection();S(o,a.ADD,this.addFeature_,this);S(o,a.REMOVE,this.removeFeature_,this)}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.addFeatureLayerAssociation_=function(t,e){var i=St(t);this.featureLayerAssociation_[i]=e};t.prototype.getFeatures=function(){return this.featureOverlay_.getSource().getFeaturesCollection()};t.prototype.getHitTolerance=function(){return this.hitTolerance_};t.prototype.getLayer=function(t){var e=St(t);return this.featureLayerAssociation_[e]};t.prototype.getOverlay=function(){return this.featureOverlay_};t.prototype.setHitTolerance=function(t){this.hitTolerance_=t};t.prototype.setMap=function(t){var e=this.getMap(),i=this.featureOverlay_.getSource().getFeaturesCollection();e&&i.forEach(e.unskipFeature.bind(e));s.prototype.setMap.call(this,t);this.featureOverlay_.setMap(t);t&&i.forEach(t.skipFeature.bind(t))};t.prototype.addFeature_=function(t){var e=this.getMap();e&&e.skipFeature(t.element)};t.prototype.removeFeature_=function(t){var e=this.getMap();e&&e.unskipFeature(t.element)};t.prototype.removeFeatureLayerAssociation_=function(t){var e=St(t);delete this.featureLayerAssociation_[e]};return t}(oa);function Dl(t){if(!this.condition_(t))return!0;var i=this.addCondition_(t),r=this.removeCondition_(t),n=this.toggleCondition_(t),e=!i&&!r&&!n,o=t.map,s=this.featureOverlay_.getSource().getFeaturesCollection(),a=[],h=[];if(e){_(this.featureLayerAssociation_);o.forEachFeatureAtPixel(t.pixel,function(t,e){if(this.filter_(t,e)){h.push(t);this.addFeatureLayerAssociation_(t,e);return!this.multi_}}.bind(this),{layerFilter:this.layerFilter_,hitTolerance:this.hitTolerance_});for(var l=s.getLength()-1;0<=l;--l){var u=s.item(l),c=h.indexOf(u);if(-1<c)h.splice(c,1);else{s.remove(u);a.push(u)}}0!==h.length&&s.extend(h)}else{o.forEachFeatureAtPixel(t.pixel,function(t,e){if(this.filter_(t,e)){if(!i&&!n||Lr(s.getArray(),t)){if((r||n)&&Lr(s.getArray(),t)){a.push(t);this.removeFeatureLayerAssociation_(t)}}else{h.push(t);this.addFeatureLayerAssociation_(t,e)}return!this.multi_}}.bind(this),{layerFilter:this.layerFilter_,hitTolerance:this.hitTolerance_});for(var p=a.length-1;0<=p;--p)s.remove(a[p]);s.extend(h)}(0<h.length||0<a.length)&&this.dispatchEvent(new Al(Fl.SELECT,h,a,t));return xa(t)}var Gl=function(n){function t(t){n.call(this,{handleEvent:kl,handleDownEvent:v,handleUpEvent:jl,stopDown:m});var e=t||{};this.source_=e.source?e.source:null;this.vertex_=void 0===e.vertex||e.vertex;this.edge_=void 0===e.edge||e.edge;this.features_=e.features?e.features:null;this.featuresListenerKeys_=[];this.featureChangeListenerKeys_={};this.indexedFeaturesExtents_={};this.pendingFeatures_={};this.pixelCoordinate_=null;this.pixelTolerance_=void 0!==e.pixelTolerance?e.pixelTolerance:10;this.sortByDistance_=function(t,e){var i=Jn(this.pixelCoordinate_,t.segment),r=Jn(this.pixelCoordinate_,e.segment);return i-r}.bind(this);this.rBush_=new el;this.SEGMENT_WRITERS_={Point:this.writePointGeometry_,LineString:this.writeLineStringGeometry_,LinearRing:this.writeLineStringGeometry_,Polygon:this.writePolygonGeometry_,MultiPoint:this.writeMultiPointGeometry_,MultiLineString:this.writeMultiLineStringGeometry_,MultiPolygon:this.writeMultiPolygonGeometry_,GeometryCollection:this.writeGeometryCollectionGeometry_,Circle:this.writeCircleGeometry_}}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.addFeature=function(t,e){var i=void 0===e||e,r=St(t),n=t.getGeometry();if(n){var o=this.SEGMENT_WRITERS_[n.getType()];if(o){this.indexedFeaturesExtents_[r]=n.getExtent([1/0,1/0,-1/0,-1/0]);o.call(this,t,n)}}i&&(this.featureChangeListenerKeys_[r]=S(t,R.CHANGE,this.handleFeatureChange_,this))};t.prototype.forEachFeatureAdd_=function(t){this.addFeature(t)};t.prototype.forEachFeatureRemove_=function(t){this.removeFeature(t)};t.prototype.getFeatures_=function(){var t;this.features_?t=this.features_:this.source_&&(t=this.source_.getFeatures());return t};t.prototype.handleFeatureAdd_=function(t){var e;t instanceof il?e=t.feature:t instanceof M&&(e=t.element);this.addFeature(e)};t.prototype.handleFeatureRemove_=function(t){var e;t instanceof il?e=t.feature:t instanceof M&&(e=t.element);this.removeFeature(e)};t.prototype.handleFeatureChange_=function(t){var e=t.target;if(this.handlingDownUpSequence){var i=St(e);i in this.pendingFeatures_||(this.pendingFeatures_[i]=e)}else this.updateFeature_(e)};t.prototype.removeFeature=function(e,t){var i=void 0===t||t,r=St(e),n=this.indexedFeaturesExtents_[r];if(n){var o=this.rBush_,s=[];o.forEachInExtent(n,function(t){e===t.feature&&s.push(t)});for(var a=s.length-1;0<=a;--a)o.remove(s[a])}if(i){g(this.featureChangeListenerKeys_[r]);delete this.featureChangeListenerKeys_[r]}};t.prototype.setMap=function(t){var e=this.getMap(),i=this.featuresListenerKeys_,r=this.getFeatures_();if(e){i.forEach(g);i.length=0;r.forEach(this.forEachFeatureRemove_.bind(this))}n.prototype.setMap.call(this,t);if(t){this.features_?i.push(S(this.features_,a.ADD,this.handleFeatureAdd_,this),S(this.features_,a.REMOVE,this.handleFeatureRemove_,this)):this.source_&&i.push(S(this.source_,Gh.ADDFEATURE,this.handleFeatureAdd_,this),S(this.source_,Gh.REMOVEFEATURE,this.handleFeatureRemove_,this));r.forEach(this.forEachFeatureAdd_.bind(this))}};t.prototype.snapTo=function(t,e,i){var r=G([i.getCoordinateFromPixel([t[0]-this.pixelTolerance_,t[1]+this.pixelTolerance_]),i.getCoordinateFromPixel([t[0]+this.pixelTolerance_,t[1]-this.pixelTolerance_])]),n=this.rBush_.getInExtent(r);this.vertex_&&!this.edge_&&(n=n.filter(function(t){return t.feature.getGeometry().getType()!==kt.CIRCLE}));var o,s,a,h,l=!1,u=null,c=null;if(0<n.length){this.pixelCoordinate_=e;n.sort(this.sortByDistance_);var p=n[0].segment,d=n[0].feature.getGeometry().getType()===kt.CIRCLE;if(this.vertex_&&!this.edge_){o=i.getPixelFromCoordinate(p[0]);s=i.getPixelFromCoordinate(p[1]);a=Zn(t,o);h=Zn(t,s);if(Math.sqrt(Math.min(a,h))<=this.pixelTolerance_){l=!0;u=h<a?p[1]:p[0];c=i.getPixelFromCoordinate(u)}}else if(this.edge_){u=d?Bn(e,n[0].feature.getGeometry()):Vn(e,p);if(qn(t,c=i.getPixelFromCoordinate(u))<=this.pixelTolerance_){l=!0;if(this.vertex_&&!d){o=i.getPixelFromCoordinate(p[0]);s=i.getPixelFromCoordinate(p[1]);a=Zn(c,o);h=Zn(c,s);if(Math.sqrt(Math.min(a,h))<=this.pixelTolerance_){u=h<a?p[1]:p[0];c=i.getPixelFromCoordinate(u)}}}}l&&(c=[Math.round(c[0]),Math.round(c[1])])}return{snapped:l,vertex:u,vertexPixel:c}};t.prototype.updateFeature_=function(t){this.removeFeature(t,!1);this.addFeature(t,!1)};t.prototype.writeCircleGeometry_=function(t,e){for(var i=Dn(e).getCoordinates()[0],r=0,n=i.length-1;r<n;++r){var o=i.slice(r,r+2),s={feature:t,segment:o};this.rBush_.insert(G(o),s)}};t.prototype.writeGeometryCollectionGeometry_=function(t,e){for(var i=e.getGeometriesArray(),r=0;r<i.length;++r){var n=this.SEGMENT_WRITERS_[i[r].getType()];n&&n.call(this,t,i[r])}};t.prototype.writeLineStringGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length-1;r<n;++r){var o=i.slice(r,r+2),s={feature:t,segment:o};this.rBush_.insert(G(o),s)}};t.prototype.writeMultiLineStringGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length;r<n;++r)for(var o=i[r],s=0,a=o.length-1;s<a;++s){var h=o.slice(s,s+2),l={feature:t,segment:h};this.rBush_.insert(G(h),l)}};t.prototype.writeMultiPointGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length;r<n;++r){var o=i[r],s={feature:t,segment:[o,o]};this.rBush_.insert(e.getExtent(),s)}};t.prototype.writeMultiPolygonGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length;r<n;++r)for(var o=i[r],s=0,a=o.length;s<a;++s)for(var h=o[s],l=0,u=h.length-1;l<u;++l){var c=h.slice(l,l+2),p={feature:t,segment:c};this.rBush_.insert(G(c),p)}};t.prototype.writePointGeometry_=function(t,e){var i=e.getCoordinates(),r={feature:t,segment:[i,i]};this.rBush_.insert(e.getExtent(),r)};t.prototype.writePolygonGeometry_=function(t,e){for(var i=e.getCoordinates(),r=0,n=i.length;r<n;++r)for(var o=i[r],s=0,a=o.length-1;s<a;++s){var h=o.slice(s,s+2),l={feature:t,segment:h};this.rBush_.insert(G(h),l)}};return t}(ba);function kl(t){var e=this.snapTo(t.pixel,t.coordinate,t.map);if(e.snapped){t.coordinate=e.vertex.slice(0,2);t.pixel=e.vertexPixel}return Fa.call(this,t)}function jl(t){var e=s(this.pendingFeatures_);if(e.length){e.forEach(this.updateFeature_.bind(this));this.pendingFeatures_={}}return!1}var Ul={TRANSLATESTART:"translatestart",TRANSLATING:"translating",TRANSLATEEND:"translateend"},Yl=function(r){function t(t,e,i){r.call(this,t);this.features=e;this.coordinate=i}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(x),Bl=function(n){function t(t){n.call(this,{handleDownEvent:Vl,handleDragEvent:zl,handleMoveEvent:Wl,handleUpEvent:Xl});var e,i=t||{};this.lastCoordinate_=null;this.features_=void 0!==i.features?i.features:null;if(i.layers)if("function"==typeof i.layers)e=i.layers;else{var r=i.layers;e=function(t){return Lr(r,t)}}else e=v;this.layerFilter_=e;this.hitTolerance_=i.hitTolerance?i.hitTolerance:0;this.lastFeature_=null;S(this,P(na.ACTIVE),this.handleActiveChanged_,this)}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.featuresAtPixel_=function(t,e){return e.forEachFeatureAtPixel(t,function(t){if(!this.features_||Lr(this.features_.getArray(),t))return t}.bind(this),{layerFilter:this.layerFilter_,hitTolerance:this.hitTolerance_})};t.prototype.getHitTolerance=function(){return this.hitTolerance_};t.prototype.setHitTolerance=function(t){this.hitTolerance_=t};t.prototype.setMap=function(t){var e=this.getMap();n.prototype.setMap.call(this,t);this.updateState_(e)};t.prototype.handleActiveChanged_=function(){this.updateState_(null)};t.prototype.updateState_=function(t){var e=this.getMap(),i=this.getActive();if((!e||!i)&&(e=e||t)){e.getViewport().classList.remove("ol-grab","ol-grabbing")}};return t}(ba);function Vl(t){this.lastFeature_=this.featuresAtPixel_(t.pixel,t.map);if(this.lastCoordinate_||!this.lastFeature_)return!1;this.lastCoordinate_=t.coordinate;Wl.call(this,t);var e=this.features_||new F([this.lastFeature_]);this.dispatchEvent(new Yl(Ul.TRANSLATESTART,e,t.coordinate));return!0}function Xl(t){if(this.lastCoordinate_){this.lastCoordinate_=null;Wl.call(this,t);var e=this.features_||new F([this.lastFeature_]);this.dispatchEvent(new Yl(Ul.TRANSLATEEND,e,t.coordinate));return!0}return!1}function zl(t){if(this.lastCoordinate_){var e=t.coordinate,i=e[0]-this.lastCoordinate_[0],r=e[1]-this.lastCoordinate_[1],n=this.features_||new F([this.lastFeature_]);n.forEach(function(t){var e=t.getGeometry();e.translate(i,r);t.setGeometry(e)});this.lastCoordinate_=e;this.dispatchEvent(new Yl(Ul.TRANSLATING,n,e))}}function Wl(t){var e=t.map.getViewport();if(this.featuresAtPixel_(t.pixel,t.map)){e.classList.remove(this.lastCoordinate_?"ol-grab":"ol-grabbing");e.classList.add(this.lastCoordinate_?"ol-grabbing":"ol-grab")}else e.classList.remove("ol-grab","ol-grabbing")}function Hl(t){var e=t||{},i=new F,r=new Ro(-.005,.05,100);(void 0===e.altShiftDragRotate||e.altShiftDragRotate)&&i.push(new ja);(void 0===e.doubleClickZoom||e.doubleClickZoom)&&i.push(new pa({delta:e.zoomDelta,duration:e.zoomDuration}));(void 0===e.dragPan||e.dragPan)&&i.push(new Na({condition:e.onFocusOnly?ga:void 0,kinetic:r}));(void 0===e.pinchRotate||e.pinchRotate)&&i.push(new ah);(void 0===e.pinchZoom||e.pinchZoom)&&i.push(new ch({constrainResolution:e.constrainResolution,duration:e.zoomDuration}));if(void 0===e.keyboard||e.keyboard){i.push(new th);i.push(new ih({delta:e.zoomDelta,duration:e.zoomDuration}))}(void 0===e.mouseWheelZoom||e.mouseWheelZoom)&&i.push(new oh({condition:e.onFocusOnly?ga:void 0,constrainResolution:e.constrainResolution,duration:e.zoomDuration}));(void 0===e.shiftDragZoom||e.shiftDragZoom)&&i.push(new Ja({duration:e.zoomDuration}));return i}var Kl=function(o){function t(t,e,i,r,n){o.call(this,t);this.vectorContext=e;this.frameState=i;this.context=r;this.glContext=n}o&&(t.__proto__=o);return(t.prototype=Object.create(o&&o.prototype)).constructor=t}(x),Zl=function(){};Zl.prototype.drawCustom=function(t,e,i){};Zl.prototype.drawGeometry=function(t){};Zl.prototype.setStyle=function(t){};Zl.prototype.drawCircle=function(t,e){};Zl.prototype.drawFeature=function(t,e){};Zl.prototype.drawGeometryCollection=function(t,e){};Zl.prototype.drawLineString=function(t,e){};Zl.prototype.drawMultiLineString=function(t,e){};Zl.prototype.drawMultiPoint=function(t,e){};Zl.prototype.drawMultiPolygon=function(t,e){};Zl.prototype.drawPoint=function(t,e){};Zl.prototype.drawPolygon=function(t,e){};Zl.prototype.drawText=function(t,e){};Zl.prototype.setFillStrokeStyle=function(t,e){};Zl.prototype.setImageStyle=function(t,e){};Zl.prototype.setTextStyle=function(t,e){};var ql=function(o){function t(t,e,i,r,n){o.call(this);this.context_=t;this.pixelRatio_=e;this.extent_=i;this.transform_=r;this.viewRotation_=n;this.contextFillState_=null;this.contextStrokeState_=null;this.contextTextState_=null;this.fillState_=null;this.strokeState_=null;this.image_=null;this.imageAnchorX_=0;this.imageAnchorY_=0;this.imageHeight_=0;this.imageOpacity_=0;this.imageOriginX_=0;this.imageOriginY_=0;this.imageRotateWithView_=!1;this.imageRotation_=0;this.imageScale_=0;this.imageWidth_=0;this.text_="";this.textOffsetX_=0;this.textOffsetY_=0;this.textRotateWithView_=!1;this.textRotation_=0;this.textScale_=0;this.textFillState_=null;this.textStrokeState_=null;this.textState_=null;this.pixelCoordinates_=[];this.tmpLocalTransform_=[1,0,0,1,0,0]}o&&(t.__proto__=o);((t.prototype=Object.create(o&&o.prototype)).constructor=t).prototype.drawImages_=function(t,e,i,r){var n=this;if(this.image_){var o=It(t,e,i,2,this.transform_,this.pixelCoordinates_),s=this.context_,a=this.tmpLocalTransform_,h=s.globalAlpha;1!=this.imageOpacity_&&(s.globalAlpha=h*this.imageOpacity_);var l=this.imageRotation_;this.imageRotateWithView_&&(l+=this.viewRotation_);for(var u=0,c=o.length;u<c;u+=2){var p=o[u]-n.imageAnchorX_,d=o[u+1]-n.imageAnchorY_;if(0!==l||1!=n.imageScale_){var f=p+n.imageAnchorX_,_=d+n.imageAnchorY_;Ue(a,f,_,n.imageScale_,n.imageScale_,l,-f,-_);s.setTransform.apply(s,a)}s.drawImage(n.image_,n.imageOriginX_,n.imageOriginY_,n.imageWidth_,n.imageHeight_,p,d,n.imageWidth_,n.imageHeight_)}0===l&&1==this.imageScale_||s.setTransform(1,0,0,1,0,0);1!=this.imageOpacity_&&(s.globalAlpha=h)}};t.prototype.drawText_=function(t,e,i,r){var n=this;if(this.textState_&&""!==this.text_){this.textFillState_&&this.setContextFillState_(this.textFillState_);this.textStrokeState_&&this.setContextStrokeState_(this.textStrokeState_);this.setContextTextState_(this.textState_);var o=It(t,e,i,r,this.transform_,this.pixelCoordinates_),s=this.context_,a=this.textRotation_;this.textRotateWithView_&&(a+=this.viewRotation_);for(;e<i;e+=r){var h=o[e]+n.textOffsetX_,l=o[e+1]+n.textOffsetY_;if(0!==a||1!=n.textScale_){var u=Ue(n.tmpLocalTransform_,h,l,n.textScale_,n.textScale_,a,-h,-l);s.setTransform.apply(s,u)}n.textStrokeState_&&s.strokeText(n.text_,h,l);n.textFillState_&&s.fillText(n.text_,h,l)}0===a&&1==this.textScale_||s.setTransform(1,0,0,1,0,0)}};t.prototype.moveToLineTo_=function(t,e,i,r,n){var o=this.context_,s=It(t,e,i,r,this.transform_,this.pixelCoordinates_);o.moveTo(s[0],s[1]);var a=s.length;n&&(a-=2);for(var h=2;h<a;h+=2)o.lineTo(s[h],s[h+1]);n&&o.closePath();return i};t.prototype.drawRings_=function(t,e,i,r){for(var n=0,o=i.length;n<o;++n)e=this.moveToLineTo_(t,e,i[n],r,!0);return e};t.prototype.drawCircle=function(t){if(Rt(this.extent_,t.getExtent())){if(this.fillState_||this.strokeState_){this.fillState_&&this.setContextFillState_(this.fillState_);this.strokeState_&&this.setContextStrokeState_(this.strokeState_);var e=Yr(t,this.transform_,this.pixelCoordinates_),i=e[2]-e[0],r=e[3]-e[1],n=Math.sqrt(i*i+r*r),o=this.context_;o.beginPath();o.arc(e[0],e[1],n,0,2*Math.PI);this.fillState_&&o.fill();this.strokeState_&&o.stroke()}""!==this.text_&&this.drawText_(t.getCenter(),0,2,2)}};t.prototype.setStyle=function(t){this.setFillStrokeStyle(t.getFill(),t.getStroke());this.setImageStyle(t.getImage());this.setTextStyle(t.getText())};t.prototype.drawGeometry=function(t){switch(t.getType()){case kt.POINT:this.drawPoint(t);break;case kt.LINE_STRING:this.drawLineString(t);break;case kt.POLYGON:this.drawPolygon(t);break;case kt.MULTI_POINT:this.drawMultiPoint(t);break;case kt.MULTI_LINE_STRING:this.drawMultiLineString(t);break;case kt.MULTI_POLYGON:this.drawMultiPolygon(t);break;case kt.GEOMETRY_COLLECTION:this.drawGeometryCollection(t);break;case kt.CIRCLE:this.drawCircle(t)}};t.prototype.drawFeature=function(t,e){var i=e.getGeometryFunction()(t);if(i&&Rt(this.extent_,i.getExtent())){this.setStyle(e);this.drawGeometry(i)}};t.prototype.drawGeometryCollection=function(t){for(var e=t.getGeometriesArray(),i=0,r=e.length;i<r;++i)this.drawGeometry(e[i])};t.prototype.drawPoint=function(t){var e=t.getFlatCoordinates(),i=t.getStride();this.image_&&this.drawImages_(e,0,e.length,i);""!==this.text_&&this.drawText_(e,0,e.length,i)};t.prototype.drawMultiPoint=function(t){var e=t.getFlatCoordinates(),i=t.getStride();this.image_&&this.drawImages_(e,0,e.length,i);""!==this.text_&&this.drawText_(e,0,e.length,i)};t.prototype.drawLineString=function(t){if(Rt(this.extent_,t.getExtent())){if(this.strokeState_){this.setContextStrokeState_(this.strokeState_);var e=this.context_,i=t.getFlatCoordinates();e.beginPath();this.moveToLineTo_(i,0,i.length,t.getStride(),!1);e.stroke()}if(""!==this.text_){var r=t.getFlatMidpoint();this.drawText_(r,0,2,2)}}};t.prototype.drawMultiLineString=function(t){var e=t.getExtent();if(Rt(this.extent_,e)){if(this.strokeState_){this.setContextStrokeState_(this.strokeState_);var i=this.context_,r=t.getFlatCoordinates(),n=0,o=t.getEnds(),s=t.getStride();i.beginPath();for(var a=0,h=o.length;a<h;++a)n=this.moveToLineTo_(r,n,o[a],s,!1);i.stroke()}if(""!==this.text_){var l=t.getFlatMidpoints();this.drawText_(l,0,l.length,2)}}};t.prototype.drawPolygon=function(t){if(Rt(this.extent_,t.getExtent())){if(this.strokeState_||this.fillState_){this.fillState_&&this.setContextFillState_(this.fillState_);this.strokeState_&&this.setContextStrokeState_(this.strokeState_);var e=this.context_;e.beginPath();this.drawRings_(t.getOrientedFlatCoordinates(),0,t.getEnds(),t.getStride());this.fillState_&&e.fill();this.strokeState_&&e.stroke()}if(""!==this.text_){var i=t.getFlatInteriorPoint();this.drawText_(i,0,2,2)}}};t.prototype.drawMultiPolygon=function(t){if(Rt(this.extent_,t.getExtent())){if(this.strokeState_||this.fillState_){this.fillState_&&this.setContextFillState_(this.fillState_);this.strokeState_&&this.setContextStrokeState_(this.strokeState_);var e=this.context_,i=t.getOrientedFlatCoordinates(),r=0,n=t.getEndss(),o=t.getStride();e.beginPath();for(var s=0,a=n.length;s<a;++s){var h=n[s];r=this.drawRings_(i,r,h,o)}this.fillState_&&e.fill();this.strokeState_&&e.stroke()}if(""!==this.text_){var l=t.getFlatInteriorPoints();this.drawText_(l,0,l.length,2)}}};t.prototype.setContextFillState_=function(t){var e=this.context_,i=this.contextFillState_;if(i)i.fillStyle!=t.fillStyle&&(i.fillStyle=e.fillStyle=t.fillStyle);else{e.fillStyle=t.fillStyle;this.contextFillState_={fillStyle:t.fillStyle}}};t.prototype.setContextStrokeState_=function(t){var e=this.context_,i=this.contextStrokeState_;if(i){i.lineCap!=t.lineCap&&(i.lineCap=e.lineCap=t.lineCap);if(Pi){Ar(i.lineDash,t.lineDash)||e.setLineDash(i.lineDash=t.lineDash);i.lineDashOffset!=t.lineDashOffset&&(i.lineDashOffset=e.lineDashOffset=t.lineDashOffset)}i.lineJoin!=t.lineJoin&&(i.lineJoin=e.lineJoin=t.lineJoin);i.lineWidth!=t.lineWidth&&(i.lineWidth=e.lineWidth=t.lineWidth);i.miterLimit!=t.miterLimit&&(i.miterLimit=e.miterLimit=t.miterLimit);i.strokeStyle!=t.strokeStyle&&(i.strokeStyle=e.strokeStyle=t.strokeStyle)}else{e.lineCap=t.lineCap;if(Pi){e.setLineDash(t.lineDash);e.lineDashOffset=t.lineDashOffset}e.lineJoin=t.lineJoin;e.lineWidth=t.lineWidth;e.miterLimit=t.miterLimit;e.strokeStyle=t.strokeStyle;this.contextStrokeState_={lineCap:t.lineCap,lineDash:t.lineDash,lineDashOffset:t.lineDashOffset,lineJoin:t.lineJoin,lineWidth:t.lineWidth,miterLimit:t.miterLimit,strokeStyle:t.strokeStyle}}};t.prototype.setContextTextState_=function(t){var e=this.context_,i=this.contextTextState_,r=t.textAlign?t.textAlign:qi;if(i){i.font!=t.font&&(i.font=e.font=t.font);i.textAlign!=r&&(i.textAlign=e.textAlign=r);i.textBaseline!=t.textBaseline&&(i.textBaseline=e.textBaseline=t.textBaseline)}else{e.font=t.font;e.textAlign=r;e.textBaseline=t.textBaseline;this.contextTextState_={font:t.font,textAlign:r,textBaseline:t.textBaseline}}};t.prototype.setFillStrokeStyle=function(t,e){if(t){var i=t.getColor();this.fillState_={fillStyle:ti(i||zi)}}else this.fillState_=null;if(e){var r=e.getColor(),n=e.getLineCap(),o=e.getLineDash(),s=e.getLineDashOffset(),a=e.getLineJoin(),h=e.getWidth(),l=e.getMiterLimit();this.strokeState_={lineCap:void 0!==n?n:Wi,lineDash:o||Hi,lineDashOffset:s||0,lineJoin:void 0!==a?a:Ki,lineWidth:this.pixelRatio_*(void 0!==h?h:1),miterLimit:void 0!==l?l:10,strokeStyle:ti(r||Zi)}}else this.strokeState_=null};t.prototype.setImageStyle=function(t){if(t){var e=t.getAnchor(),i=t.getImage(1),r=t.getOrigin(),n=t.getSize();this.imageAnchorX_=e[0];this.imageAnchorY_=e[1];this.imageHeight_=n[1];this.image_=i;this.imageOpacity_=t.getOpacity();this.imageOriginX_=r[0];this.imageOriginY_=r[1];this.imageRotateWithView_=t.getRotateWithView();this.imageRotation_=t.getRotation();this.imageScale_=t.getScale()*this.pixelRatio_;this.imageWidth_=n[0]}else this.image_=null};t.prototype.setTextStyle=function(t){if(t){var e=t.getFill();if(e){var i=e.getColor();this.textFillState_={fillStyle:ti(i||zi)}}else this.textFillState_=null;var r=t.getStroke();if(r){var n=r.getColor(),o=r.getLineCap(),s=r.getLineDash(),a=r.getLineDashOffset(),h=r.getLineJoin(),l=r.getWidth(),u=r.getMiterLimit();this.textStrokeState_={lineCap:void 0!==o?o:Wi,lineDash:s||Hi,lineDashOffset:a||0,lineJoin:void 0!==h?h:Ki,lineWidth:void 0!==l?l:1,miterLimit:void 0!==u?u:10,strokeStyle:ti(n||Zi)}}else this.textStrokeState_=null;var c=t.getFont(),p=t.getOffsetX(),d=t.getOffsetY(),f=t.getRotateWithView(),_=t.getRotation(),g=t.getScale(),y=t.getText(),v=t.getTextAlign(),m=t.getTextBaseline();this.textState_={font:void 0!==c?c:Xi,textAlign:void 0!==v?v:qi,textBaseline:void 0!==m?m:Ji};this.text_=void 0!==y?y:"";this.textOffsetX_=void 0!==p?this.pixelRatio_*p:0;this.textOffsetY_=void 0!==d?this.pixelRatio_*d:0;this.textRotateWithView_=void 0!==f&&f;this.textRotation_=void 0!==_?_:0;this.textScale_=this.pixelRatio_*(void 0!==g?g:1)}else this.text_=""};return t}(Zl),Jl=function(){this.cache_={};this.cacheSize_=0;this.maxCacheSize_=32};Jl.prototype.clear=function(){this.cache_={};this.cacheSize_=0};Jl.prototype.expire=function(){if(this.cacheSize_>this.maxCacheSize_){var t=0;for(var e in this.cache_){var i=this.cache_[e];if(0==(3&t++)&&!i.hasListener()){delete this.cache_[e];--this.cacheSize_}}}};Jl.prototype.get=function(t,e,i){var r=Ql(t,e,i);return r in this.cache_?this.cache_[r]:null};Jl.prototype.set=function(t,e,i,r){var n=Ql(t,e,i);this.cache_[n]=r;++this.cacheSize_};Jl.prototype.setSize=function(t){this.maxCacheSize_=t;this.expire()};function Ql(t,e,i){return e+":"+t+":"+(i?He(i):"null")}var $l=new Jl,tu=function(e){function t(t){e.call(this);this.map_=t;this.layerRenderers_={};this.layerRendererListeners_={};this.layerRendererConstructors_=[]}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.registerLayerRenderers=function(t){this.layerRendererConstructors_.push.apply(this.layerRendererConstructors_,t)};t.prototype.getLayerRendererConstructors=function(){return this.layerRendererConstructors_};t.prototype.calculateMatrices2D=function(t){var e=t.viewState,i=t.coordinateToPixelTransform,r=t.pixelToCoordinateTransform;Ue(i,t.size[0]/2,t.size[1]/2,1/e.resolution,-1/e.resolution,-e.rotation,-e.center[0],-e.center[1]);Ye(Ne(r,i))};t.prototype.removeLayerRenderers=function(){for(var t in this.layerRenderers_)this.removeLayerRendererByKey_(t).dispose()};t.prototype.forEachFeatureAtCoordinate=function(t,n,e,o,s,i,r){var a,h=n.viewState,l=h.resolution;function u(t,e){var i=St(t).toString(),r=n.layerStates[St(e)].managed;if(!(i in n.skippedFeatureUids)||r)return o.call(s,t,r?e:null)}var c=h.projection,p=t;if(c.canWrapX()){var d=c.getExtent(),f=_t(d),_=t[0];if(_<d[0]||_>d[2]){p=[_+f*Math.ceil((d[0]-_)/f),t[1]]}}var g,y=n.layerStatesArray;for(g=y.length-1;0<=g;--g){var v=y[g],m=v.layer;if(Js(v,l)&&i.call(r,m)){var x=this.getLayerRenderer(m);m.getSource()&&(a=x.forEachFeatureAtCoordinate(m.getSource().getWrapX()?p:t,n,e,u,s));if(a)return a}}};t.prototype.forEachLayerAtPixel=function(t,e,i,r,n,o,s){};t.prototype.hasFeatureAtCoordinate=function(t,e,i,r,n){return void 0!==this.forEachFeatureAtCoordinate(t,e,i,v,this,r,n)};t.prototype.getLayerRenderer=function(t){var e=St(t).toString();if(e in this.layerRenderers_)return this.layerRenderers_[e];for(var i,r=0,n=this.layerRendererConstructors_.length;r<n;++r){var o=this.layerRendererConstructors_[r];if(o.handles(t)){i=o.create(this,t);break}}if(!i)throw new Error("Unable to create renderer for layer: "+t.getType());this.layerRenderers_[e]=i;this.layerRendererListeners_[e]=S(i,R.CHANGE,this.handleLayerRendererChange_,this);return i};t.prototype.getLayerRendererByKey=function(t){return this.layerRenderers_[t]};t.prototype.getLayerRenderers=function(){return this.layerRenderers_};t.prototype.getMap=function(){return this.map_};t.prototype.handleLayerRendererChange_=function(){this.map_.render()};t.prototype.removeLayerRendererByKey_=function(t){var e=this.layerRenderers_[t];delete this.layerRenderers_[t];g(this.layerRendererListeners_[t]);delete this.layerRendererListeners_[t];return e};t.prototype.removeUnusedLayerRenderers_=function(t,e){for(var i in this.layerRenderers_)e&&i in e.layerStates||this.removeLayerRendererByKey_(i).dispose()};t.prototype.scheduleExpireIconCache=function(t){t.postRenderFunctions.push(eu)};t.prototype.scheduleRemoveUnusedLayerRenderers=function(t){for(var e in this.layerRenderers_)if(!(e in t.layerStates)){t.postRenderFunctions.push(this.removeUnusedLayerRenderers_.bind(this));return}};return t}(t);function eu(t,e){$l.expire()}tu.prototype.renderFrame=L;tu.prototype.dispatchRenderEvent=L;function iu(t,e){return t.zIndex-e.zIndex}var ru=[],nu=function(n){function t(t){n.call(this,t);var e=t.getViewport();this.context_=ii();this.canvas_=this.context_.canvas;this.canvas_.style.width="100%";this.canvas_.style.height="100%";this.canvas_.style.display="block";this.canvas_.className=ki;e.insertBefore(this.canvas_,e.childNodes[0]||null);this.renderedVisible_=!0;this.transform_=[1,0,0,1,0,0]}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.dispatchRenderEvent=function(t,e){var i=this.getMap(),r=this.context_;if(i.hasListener(t)){var n=e.extent,o=e.pixelRatio,s=e.viewState.rotation,a=this.getTransform(e),h=new ql(r,o,n,a,s),l=new Kl(t,h,e,r,null);i.dispatchEvent(l)}};t.prototype.getTransform=function(t){var e=t.viewState,i=this.canvas_.width/2,r=this.canvas_.height/2,n=t.pixelRatio/e.resolution,o=-n,s=-e.rotation,a=-e.center[0],h=-e.center[1];return Ue(this.transform_,i,r,n,o,s,a,h)};t.prototype.renderFrame=function(t){if(t){var e=this.context_,i=t.pixelRatio,r=Math.round(t.size[0]*i),n=Math.round(t.size[1]*i);if(this.canvas_.width!=r||this.canvas_.height!=n){this.canvas_.width=r;this.canvas_.height=n}else e.clearRect(0,0,r,n);var o=t.viewState.rotation;this.calculateMatrices2D(t);this.dispatchRenderEvent(ao.PRECOMPOSE,t);var s=t.layerStatesArray;Nr(s,iu);if(o){e.save();lr(e,o,r/2,n/2)}var a,h,l,u,c,p=t.viewState.resolution;for(a=0,h=s.length;a<h;++a){l=(c=s[a]).layer;u=this.getLayerRenderer(l);Js(c,p)&&c.sourceState==Ys.READY&&(u.prepareFrame(t,c)&&u.composeFrame(t,c,e))}o&&e.restore();this.dispatchRenderEvent(ao.POSTCOMPOSE,t);if(!this.renderedVisible_){this.canvas_.style.display="";this.renderedVisible_=!0}this.scheduleRemoveUnusedLayerRenderers(t);this.scheduleExpireIconCache(t)}else if(this.renderedVisible_){this.canvas_.style.display="none";this.renderedVisible_=!1}};t.prototype.forEachLayerAtPixel=function(t,e,i,r,n,o,s){var a,h,l=e.viewState.resolution,u=e.layerStatesArray,c=u.length,p=De(e.pixelToCoordinateTransform,t.slice());for(h=c-1;0<=h;--h){var d=u[h],f=d.layer;if(Js(d,l)&&o.call(s,f)){if(a=this.getLayerRenderer(f).forEachLayerAtCoordinate(p,e,i,r,n))return a}}};t.prototype.registerLayerRenderers=function(t){n.prototype.registerLayerRenderers.call(this,t);for(var e=0,i=t.length;e<i;++e){var r=t[e];Lr(ru,r)||ru.push(r)}};return t}(tu),ou=function(e){function t(t){e.call(this);this.layer_=t}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.createLoadedTileFinder=function(i,r,n){return function(e,t){return i.forEachLoadedTile(r,e,t,function(t){n[e]||(n[e]={});n[e][t.tileCoord.toString()]=t})}};t.prototype.getLayer=function(){return this.layer_};t.prototype.handleImageChange_=function(t){t.target.getState()===Ni.LOADED&&this.renderIfReadyAndVisible()};t.prototype.loadImage=function(t){var e=t.getState();e!=Ni.LOADED&&e!=Ni.ERROR&&S(t,R.CHANGE,this.handleImageChange_,this);if(e==Ni.IDLE){t.load();e=t.getState()}return e==Ni.LOADED};t.prototype.renderIfReadyAndVisible=function(){var t=this.getLayer();t.getVisible()&&t.getSourceState()==Ys.READY&&this.changed()};t.prototype.scheduleExpireCache=function(t,e){if(e.canExpireCache()){var i=function(t,e,i){var r=St(t).toString();r in i.usedTiles&&t.expireCache(i.viewState.projection,i.usedTiles[r])}.bind(null,e);t.postRenderFunctions.push(i)}};t.prototype.updateUsedTiles=function(t,e,i,r){var n=St(e).toString(),o=i.toString();if(n in t)o in t[n]?t[n][o].extend(r):t[n][o]=r;else{t[n]={};t[n][o]=r}};t.prototype.manageTilePyramid=function(t,e,i,r,n,o,s,a,h,l){var u=St(e).toString();u in t.wantedTiles||(t.wantedTiles[u]={});var c,p,d,f,_,g,y=t.wantedTiles[u],v=t.tileQueue;for(g=i.getMinZoom();g<=s;++g){p=i.getTileRangeForExtentAndZ(o,g,p);d=i.getResolution(g);for(f=p.minX;f<=p.maxX;++f)for(_=p.minY;_<=p.maxY;++_)if(s-g<=a){if((c=e.getTile(g,f,_,r,n)).getState()==yo.IDLE){y[c.getKey()]=!0;v.isKeyQueued(c.getKey())||v.enqueue([c,u,i.getTileCoordCenter(c.tileCoord),d])}void 0!==h&&h.call(l,c)}else e.useTile(g,f,_,n)}};return t}(C);ou.prototype.forEachFeatureAtCoordinate=L;ou.prototype.hasFeatureAtCoordinate=m;var su=function(e){function t(t){e.call(this,t);this.renderedResolution;this.transform_=[1,0,0,1,0,0]}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.clip=function(t,e,i){var r=e.pixelRatio,n=e.size[0]*r,o=e.size[1]*r,s=e.viewState.rotation,a=dt(i),h=ft(i),l=at(i),u=st(i);De(e.coordinateToPixelTransform,a);De(e.coordinateToPixelTransform,h);De(e.coordinateToPixelTransform,l);De(e.coordinateToPixelTransform,u);t.save();lr(t,-s,n/2,o/2);t.beginPath();t.moveTo(a[0]*r,a[1]*r);t.lineTo(h[0]*r,h[1]*r);t.lineTo(l[0]*r,l[1]*r);t.lineTo(u[0]*r,u[1]*r);t.clip();lr(t,s,n/2,o/2)};t.prototype.dispatchComposeEvent_=function(t,e,i,r){var n=this.getLayer();if(n.hasListener(t)){var o=i.size[0]*i.pixelRatio,s=i.size[1]*i.pixelRatio,a=i.viewState.rotation;lr(e,-a,o/2,s/2);var h=void 0!==r?r:this.getTransform(i,0),l=new ql(e,i.pixelRatio,i.extent,h,i.viewState.rotation),u=new Kl(t,l,i,e,null);n.dispatchEvent(u);lr(e,a,o/2,s/2)}};t.prototype.forEachLayerAtCoordinate=function(t,e,i,r,n){return this.forEachFeatureAtCoordinate(t,e,i,v,this)?r.call(n,this.getLayer(),null):void 0};t.prototype.postCompose=function(t,e,i,r){this.dispatchComposeEvent_(ao.POSTCOMPOSE,t,e,r)};t.prototype.preCompose=function(t,e,i){this.dispatchComposeEvent_(ao.PRECOMPOSE,t,e,i)};t.prototype.dispatchRenderEvent=function(t,e,i){this.dispatchComposeEvent_(ao.RENDER,t,e,i)};t.prototype.getTransform=function(t,e){var i=t.viewState,r=t.pixelRatio,n=r*t.size[0]/2,o=r*t.size[1]/2,s=r/i.resolution,a=-s,h=-i.rotation,l=-i.center[0]+e,u=-i.center[1];return Ue(this.transform_,n,o,s,a,h,l,u)};t.prototype.composeFrame=function(t,e,i){};t.prototype.prepareFrame=function(t,e){};return t}(ou),au=function(a){function t(t){a.call(this,t);this.coordinateToCanvasPixelTransform=[1,0,0,1,0,0];this.hitCanvasContext_=null}a&&(t.__proto__=a);((t.prototype=Object.create(a&&a.prototype)).constructor=t).prototype.composeFrame=function(t,e,i){this.preCompose(i,t);var r=this.getImage();if(r){var n=e.extent,o=void 0!==n&&!Q(n,t.extent)&&Rt(n,t.extent);o&&this.clip(i,t,n);var s=this.getImageTransform(),a=i.globalAlpha;i.globalAlpha=e.opacity;var h=s[4],l=s[5],u=r.width*s[0],c=r.height*s[3];i.drawImage(r,0,0,+r.width,+r.height,Math.round(h),Math.round(l),Math.round(u),Math.round(c));i.globalAlpha=a;o&&i.restore()}this.postCompose(i,t,e)};t.prototype.getImage=function(){};t.prototype.getImageTransform=function(){};t.prototype.forEachFeatureAtCoordinate=function(t,e,i,r,n){var o=this.getLayer(),s=o.getSource(),a=e.viewState.resolution,h=e.viewState.rotation,l=e.skippedFeatureUids;return s.forEachFeatureAtCoordinate(t,a,h,i,l,function(t){return r.call(n,t,o)})};t.prototype.forEachLayerAtCoordinate=function(t,e,i,r,n){if(this.getImage()){if(this.getLayer().getSource().forEachFeatureAtCoordinate!==L)return a.prototype.forEachLayerAtCoordinate.call(this,arguments);var o=De(this.coordinateToCanvasPixelTransform,t.slice());Kn(o,e.viewState.resolution/this.renderedResolution);this.hitCanvasContext_||(this.hitCanvasContext_=ii(1,1));this.hitCanvasContext_.clearRect(0,0,1,1);this.hitCanvasContext_.drawImage(this.getImage(),o[0],o[1],1,1,0,0,1,1);var s=this.hitCanvasContext_.getImageData(0,0,1,1).data;return 0<s[3]?r.call(n,this.getLayer(),s):void 0}};return t}(su),hu=function(o){function n(t){o.call(this,t);this.image_=null;this.imageTransform_=[1,0,0,1,0,0];this.skippedFeatures_=[];this.vectorRenderer_=null;if(t.getType()===Io.VECTOR)for(var e=0,i=ru.length;e<i;++e){var r=ru[e];if(r!==n&&r.handles(t)){this.vectorRenderer_=new r(t);break}}}o&&(n.__proto__=o);((n.prototype=Object.create(o&&o.prototype)).constructor=n).prototype.disposeInternal=function(){this.vectorRenderer_&&this.vectorRenderer_.dispose();o.prototype.disposeInternal.call(this)};n.prototype.getImage=function(){return this.image_?this.image_.getImage():null};n.prototype.getImageTransform=function(){return this.imageTransform_};n.prototype.prepareFrame=function(t,e){var i,r=t.pixelRatio,n=t.size,o=t.viewState,s=o.center,a=o.resolution,h=this.getLayer().getSource(),l=t.viewHints,u=this.vectorRenderer_,c=t.extent;u||void 0===e.extent||(c=pt(c,e.extent));if(!l[bs.ANIMATING]&&!l[bs.INTERACTING]&&!gt(c)){var p=o.projection,d=this.skippedFeatures_;if(u){var f=u.context,_=T({},t,{size:[_t(c)/a,ct(c)/a],viewState:T({},t.viewState,{rotation:0})}),g=Object.keys(_.skippedFeatureUids).sort();i=new go(c,a,r,f.canvas,function(t){if(u.prepareFrame(_,e)&&(u.replayGroupChanged||!Ar(d,g))){f.canvas.width=_.size[0]*r;f.canvas.height=_.size[1]*r;u.compose(f,_,e);d=g;t()}})}else i=h.getImage(c,a,r,p);if(i&&this.loadImage(i)){this.image_=i;this.skippedFeatures_=d}}if(this.image_){var y=(i=this.image_).getExtent(),v=i.getResolution(),m=i.getPixelRatio(),x=r*v/(a*m),E=Ue(this.imageTransform_,r*n[0]/2,r*n[1]/2,x,x,0,m*(y[0]-s[0])/v,m*(s[1]-y[3])/v);Ue(this.coordinateToCanvasPixelTransform,r*n[0]/2-E[4],r*n[1]/2-E[5],r/a,-r/a,0,-s[0],-s[1]);this.renderedResolution=v*r/m}return!!this.image_};n.prototype.forEachFeatureAtCoordinate=function(t,e,i,r,n){return this.vectorRenderer_?this.vectorRenderer_.forEachFeatureAtCoordinate(t,e,i,r,n):o.prototype.forEachFeatureAtCoordinate.call(this,t,e,i,r,n)};return n}(au);hu.handles=function(t){return t.getType()===Io.IMAGE||t.getType()===Io.VECTOR&&t.getRenderMode()===Oh.IMAGE};hu.create=function(t,e){return new hu(e)};var lu=function(t,e,i,r){this.minX=t;this.maxX=e;this.minY=i;this.maxY=r};lu.prototype.contains=function(t){return this.containsXY(t[1],t[2])};lu.prototype.containsTileRange=function(t){return this.minX<=t.minX&&t.maxX<=this.maxX&&this.minY<=t.minY&&t.maxY<=this.maxY};lu.prototype.containsXY=function(t,e){return this.minX<=t&&t<=this.maxX&&this.minY<=e&&e<=this.maxY};lu.prototype.equals=function(t){return this.minX==t.minX&&this.minY==t.minY&&this.maxX==t.maxX&&this.maxY==t.maxY};lu.prototype.extend=function(t){t.minX<this.minX&&(this.minX=t.minX);t.maxX>this.maxX&&(this.maxX=t.maxX);t.minY<this.minY&&(this.minY=t.minY);t.maxY>this.maxY&&(this.maxY=t.maxY)};lu.prototype.getHeight=function(){return this.maxY-this.minY+1};lu.prototype.getSize=function(){return[this.getWidth(),this.getHeight()]};lu.prototype.getWidth=function(){return this.maxX-this.minX+1};lu.prototype.intersects=function(t){return this.minX<=t.maxX&&this.maxX>=t.minX&&this.minY<=t.maxY&&this.maxY>=t.minY};function uu(t,e,i,r,n){if(void 0===n)return new lu(t,e,i,r);n.minX=t;n.maxX=e;n.minY=i;n.maxY=r;return n}var cu=function(i){function t(t,e){i.call(this,t);this.context=e?null:ii();this.oversampling_;this.renderedExtent_=null;this.renderedRevision;this.renderedTiles=[];this.newTiles_=!1;this.tmpExtent=[1/0,1/0,-1/0,-1/0];this.tmpTileRange_=new lu(0,0,0,0);this.imageTransform_=[1,0,0,1,0,0];this.zDirection=0}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.isDrawableTile_=function(t){var e=t.getState(),i=this.getLayer().getUseInterimTilesOnError();return e==yo.LOADED||e==yo.EMPTY||e==yo.ERROR&&!i};t.prototype.getTile=function(t,e,i,r,n){var o=this.getLayer(),s=o.getSource().getTile(t,e,i,r,n);s.getState()==yo.ERROR&&(o.getUseInterimTilesOnError()?0<o.getPreload()&&(this.newTiles_=!0):s.setState(yo.LOADED));this.isDrawableTile_(s)||(s=s.getInterimTile());return s};t.prototype.prepareFrame=function(t,e){var i=t.pixelRatio,r=t.size,n=t.viewState,o=n.projection,s=n.resolution,a=n.center,h=this.getLayer(),l=h.getSource(),u=l.getRevision(),c=l.getTileGridForProjection(o),p=c.getZForResolution(s,this.zDirection),d=c.getResolution(p),f=Math.round(s/d)||1,_=t.extent;void 0!==e.extent&&(_=pt(_,e.extent));if(gt(_))return!1;var g=c.getTileRangeForExtentAndZ(_,p),y=c.getTileRangeExtent(p,g),v=l.getTilePixelRatio(i),m={};m[p]={};var x,E,T,S=this.createLoadedTileFinder(l,o,m),C=t.viewHints,R=C[bs.ANIMATING]||C[bs.INTERACTING],I=this.tmpExtent,w=this.tmpTileRange_;this.newTiles_=!1;for(E=g.minX;E<=g.maxX;++E)for(T=g.minY;T<=g.maxY;++T)if(!(16<Date.now()-t.time&&R)){x=this.getTile(p,E,T,i,o);if(this.isDrawableTile_(x)){var L=St(this);if(x.getState()==yo.LOADED){var O=(m[p][x.tileCoord.toString()]=x).inTransition(L);this.newTiles_||!O&&-1!==this.renderedTiles.indexOf(x)||(this.newTiles_=!0)}if(1===x.getAlpha(L,t.time))continue}var P=c.getTileCoordChildTileRange(x.tileCoord,w,I),b=!1;P&&(b=S(p+1,P));b||c.forEachTileCoordParentTileRange(x.tileCoord,S,null,w,I)}var M=d*i/v*f;if(!(this.renderedResolution&&16<Date.now()-t.time&&R)&&(this.newTiles_||!this.renderedExtent_||!Q(this.renderedExtent_,_)||this.renderedRevision!=u||f!=this.oversampling_||!R&&M!=this.renderedResolution)){var F=this.context;if(F){var A=l.getTilePixelSize(p,i,o),N=Math.round(g.getWidth()*A[0]/f),D=Math.round(g.getHeight()*A[1]/f),G=F.canvas;if(G.width!=N||G.height!=D){this.oversampling_=f;G.width=N;G.height=D}else{this.renderedExtent_&&!$(y,this.renderedExtent_)&&F.clearRect(0,0,N,D);f=this.oversampling_}}this.renderedTiles.length=0;var k,j,U,Y,B,V,X,z,W,H,K=Object.keys(m).map(Number);K.sort(function(t,e){return t===p?1:e===p?-1:e<t?1:t<e?-1:0});for(Y=0,B=K.length;Y<B;++Y){U=K[Y];j=l.getTilePixelSize(U,i,o);k=c.getResolution(U)/d;X=v*l.getGutterForProjection(o);z=m[U];for(var Z in z){x=z[Z];E=((V=c.getTileCoordExtent(x.getTileCoord(),I))[0]-y[0])/d*v/f;T=(y[3]-V[3])/d*v/f;W=j[0]*k/f;H=j[1]*k/f;this.drawTileImage(x,t,e,E,T,W,H,X,p===U);this.renderedTiles.push(x)}}this.renderedRevision=u;this.renderedResolution=d*i/v*f;this.renderedExtent_=y}var q=this.renderedResolution/s,J=Ue(this.imageTransform_,i*r[0]/2,i*r[1]/2,q,q,0,(this.renderedExtent_[0]-a[0])/this.renderedResolution*i,(a[1]-this.renderedExtent_[3])/this.renderedResolution*i);Ue(this.coordinateToCanvasPixelTransform,i*r[0]/2-J[4],i*r[1]/2-J[5],i/s,-i/s,0,-a[0],-a[1]);this.updateUsedTiles(t.usedTiles,l,p,g);this.manageTilePyramid(t,l,c,i,o,_,p,h.getPreload());this.scheduleExpireCache(t,l);return 0<this.renderedTiles.length};t.prototype.drawTileImage=function(t,e,i,r,n,o,s,a,h){var l=t.getImage(this.getLayer());if(l){var u=St(this),c=h?t.getAlpha(u,e.time):1;1!==c||this.getLayer().getSource().getOpaque(e.viewState.projection)||this.context.clearRect(r,n,o,s);var p=c!==this.context.globalAlpha;if(p){this.context.save();this.context.globalAlpha=c}this.context.drawImage(l,a,a,l.width-2*a,l.height-2*a,r,n,o,s);p&&this.context.restore();1!==c?e.animate=!0:h&&t.endTransition(u)}};t.prototype.getImage=function(){var t=this.context;return t?t.canvas:null};t.prototype.getImageTransform=function(){return this.imageTransform_};return t}(au);cu.handles=function(t){return t.getType()===Io.TILE};cu.create=function(t,e){return new cu(e)};cu.prototype.getLayer;var pu=function(){};pu.prototype.getReplay=function(t,e){};pu.prototype.isEmpty=function(){};var du={CIRCLE:"Circle",DEFAULT:"Default",IMAGE:"Image",LINE_STRING:"LineString",POLYGON:"Polygon",TEXT:"Text"};function fu(t,e,i,r,n,o,s,a){for(var h,l,u,c=[],p=t[e]>t[i-r],d=n.length,f=t[e],_=t[e+1],g=t[e+=r],y=t[e+1],v=0,m=Math.sqrt(Math.pow(g-f,2)+Math.pow(y-_,2)),x="",E=0,T=0;T<d;++T){l=p?d-T-1:T;var S=n.charAt(l),C=o(x=p?S+x:x+S)-E;E+=C;for(var R=s+C/2;e<i-r&&v+m<R;){f=g;_=y;g=t[e+=r];y=t[e+1];v+=m;m=Math.sqrt(Math.pow(g-f,2)+Math.pow(y-_,2))}var I=R-v,w=Math.atan2(y-_,g-f);p&&(w+=0<w?-Math.PI:Math.PI);if(void 0!==u){var L=w-u;L+=L>Math.PI?-2*Math.PI:L<-Math.PI?2*Math.PI:0;if(Math.abs(L)>a)return null}var O=I/m,P=Gt(f,g,O),b=Gt(_,y,O);if(u==w){if(p){h[0]=P;h[1]=b;h[2]=C/2}h[4]=x}else{h=[P,b,(E=C)/2,w,x=S];p?c.unshift(h):c.push(h);u=w}s+=C}return c}var _u={BEGIN_GEOMETRY:0,BEGIN_PATH:1,CIRCLE:2,CLOSE_PATH:3,CUSTOM:4,DRAW_CHARS:5,DRAW_IMAGE:6,END_GEOMETRY:7,FILL:8,MOVE_TO_LINE_TO:9,SET_FILL_STYLE:10,SET_STROKE_STYLE:11,STROKE:12},gu=[_u.FILL],yu=[_u.STROKE],vu=[_u.BEGIN_PATH],mu=[_u.CLOSE_PATH],xu=[du.POLYGON,du.CIRCLE,du.LINE_STRING,du.IMAGE,du.TEXT,du.DEFAULT],Eu={left:0,end:0,center:.5,right:1,start:1,top:0,middle:.5,hanging:.2,alphabetic:.8,ideographic:.8,bottom:1},Tu=[1/0,1/0,-1/0,-1/0],Su=[1,0,0,1,0,0],Cu=function(s){function t(t,e,i,r,n,o){s.call(this);this.declutterTree=o;this.tolerance=t;this.maxExtent=e;this.overlaps=n;this.pixelRatio=r;this.maxLineWidth=0;this.resolution=i;this.alignFill_;this.beginGeometryInstruction1_=null;this.beginGeometryInstruction2_=null;this.bufferedMaxExtent_=null;this.instructions=[];this.coordinates=[];this.coordinateCache_={};this.renderedTransform_=[1,0,0,1,0,0];this.hitDetectionInstructions=[];this.pixelCoordinates_=null;this.state={};this.viewRotation_=0}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.replayTextBackground_=function(t,e,i,r,n,o,s){t.beginPath();t.moveTo.apply(t,e);t.lineTo.apply(t,i);t.lineTo.apply(t,r);t.lineTo.apply(t,n);t.lineTo.apply(t,e);if(o){this.alignFill_=o[2];this.fill_(t)}if(s){this.setStrokeStyle_(t,s);t.stroke()}};t.prototype.replayImage_=function(t,e,i,r,n,o,s,a,h,l,u,c,p,d,f,_,g,y){var v=g||y;e-=n*=p;i-=o*=p;var m,x,E,T,S=f+l>r.width?r.width-l:f,C=a+u>r.height?r.height-u:a,R=_[3]+S*p+_[1],I=_[0]+C*p+_[2],w=e-_[3],L=i-_[0];if(v||0!==c){m=[w,L];x=[w+R,L];E=[w+R,L+I];T=[w,L+I]}var O=null;if(0!==c){var P=e+n,b=i+o;O=Ue(Su,P,b,1,1,c,-P,-b);W(Tu);J(Tu,De(Su,m));J(Tu,De(Su,x));J(Tu,De(Su,E));J(Tu,De(Su,T))}else z(w,L,w+R,L+I,Tu);var M=t.canvas,F=y?y[2]*p/2:0,A=Tu[0]-F<=M.width&&0<=Tu[2]+F&&Tu[1]-F<=M.height&&0<=Tu[3]+F;if(d){e=Math.round(e);i=Math.round(i)}if(s){if(!A&&1==s[4])return;q(s,Tu);var N=A?[t,O?O.slice(0):null,h,r,l,u,S,C,e,i,p]:null;N&&v&&N.push(g,y,m,x,E,T);s.push(N)}else if(A){v&&this.replayTextBackground_(t,m,x,E,T,g,y);cr(t,O,h,r,l,u,S,C,e,i,p)}};t.prototype.applyPixelRatio=function(t){var e=this.pixelRatio;return 1==e?t:t.map(function(t){return t*e})};t.prototype.appendFlatCoordinates=function(t,e,i,r,n,o){var s=this.coordinates.length,a=this.getBufferedMaxExtent();o&&(e+=r);var h,l,u,c=[t[e],t[e+1]],p=[NaN,NaN],d=!0;for(h=e+r;h<i;h+=r){p[0]=t[h];p[1]=t[h+1];if((u=V(a,p))!==l){if(d){this.coordinates[s++]=c[0];this.coordinates[s++]=c[1]}this.coordinates[s++]=p[0];this.coordinates[s++]=p[1];d=!1}else if(u===D.INTERSECTING){this.coordinates[s++]=p[0];this.coordinates[s++]=p[1];d=!1}else d=!0;c[0]=p[0];c[1]=p[1];l=u}if(n&&d||h===e+r){this.coordinates[s++]=c[0];this.coordinates[s++]=c[1]}return s};t.prototype.drawCustomCoordinates_=function(t,e,i,r,n){for(var o=0,s=i.length;o<s;++o){var a=i[o],h=this.appendFlatCoordinates(t,e,a,r,!1,!1);n.push(h);e=a}return e};t.prototype.drawCustom=function(t,e,i){this.beginGeometry(t,e);var r,n,o,s,a,h=t.getType(),l=t.getStride(),u=this.coordinates.length;if(h==kt.MULTI_POLYGON){r=(t=t).getOrientedFlatCoordinates();s=[];for(var c=t.getEndss(),p=a=0,d=c.length;p<d;++p){var f=[];a=this.drawCustomCoordinates_(r,a,c[p],l,f);s.push(f)}this.instructions.push([_u.CUSTOM,u,s,t,i,on])}else if(h==kt.POLYGON||h==kt.MULTI_LINE_STRING){o=[];r=h==kt.POLYGON?t.getOrientedFlatCoordinates():t.getFlatCoordinates();a=this.drawCustomCoordinates_(r,0,t.getEnds(),l,o);this.instructions.push([_u.CUSTOM,u,o,t,i,nn])}else if(h==kt.LINE_STRING||h==kt.MULTI_POINT){r=t.getFlatCoordinates();n=this.appendFlatCoordinates(r,0,r.length,l,!1,!1);this.instructions.push([_u.CUSTOM,u,n,t,i,rn])}else if(h==kt.POINT){r=t.getFlatCoordinates();this.coordinates.push(r[0],r[1]);n=this.coordinates.length;this.instructions.push([_u.CUSTOM,u,n,t,i])}this.endGeometry(t,e)};t.prototype.beginGeometry=function(t,e){this.beginGeometryInstruction1_=[_u.BEGIN_GEOMETRY,e,0];this.instructions.push(this.beginGeometryInstruction1_);this.beginGeometryInstruction2_=[_u.BEGIN_GEOMETRY,e,0];this.hitDetectionInstructions.push(this.beginGeometryInstruction2_)};t.prototype.fill_=function(t){if(this.alignFill_){var e=De(this.renderedTransform_,[0,0]),i=512*this.pixelRatio;t.translate(e[0]%i,e[1]%i);t.rotate(this.viewRotation_)}t.fill();this.alignFill_&&t.setTransform.apply(t,ur)};t.prototype.setStrokeStyle_=function(t,e){t.strokeStyle=e[1];t.lineWidth=e[2];t.lineCap=e[3];t.lineJoin=e[4];t.miterLimit=e[5];if(Pi){t.lineDashOffset=e[7];t.setLineDash(e[6])}};t.prototype.renderDeclutter_=function(t,e){if(t&&5<t.length){var i=t[4];if(1==i||i==t.length-5){var r={minX:t[0],minY:t[1],maxX:t[2],maxY:t[3],value:e};if(!this.declutterTree.collides(r)){this.declutterTree.insert(r);for(var n=5,o=t.length;n<o;++n){var s=t[n];if(s){11<s.length&&this.replayTextBackground_(s[0],s[13],s[14],s[15],s[16],s[11],s[12]);cr.apply(void 0,s)}}}t.length=5;W(t)}}};t.prototype.replay_=function(t,e,i,r,n,o,s){var a,h=this;if(this.pixelCoordinates_&&Ar(e,this.renderedTransform_))a=this.pixelCoordinates_;else{this.pixelCoordinates_||(this.pixelCoordinates_=[]);a=It(this.coordinates,0,this.coordinates.length,2,e,this.pixelCoordinates_);Ne(this.renderedTransform_,e)}for(var l,u,c,p,d,f,_,g,y,v,m,x,E=!Ct(i),T=0,S=r.length,C=0,R=0,I=0,w=null,L=null,O=this.coordinateCache_,P=this.viewRotation_,b={context:t,pixelRatio:this.pixelRatio,resolution:this.resolution,rotation:P},M=this.instructions!=r||this.overlaps?0:200;T<S;){var F=r[T];switch(F[0]){case _u.BEGIN_GEOMETRY:v=F[1];E&&i[St(v).toString()]||!v.getGeometry()?T=F[2]:void 0===s||Rt(s,v.getGeometry().getExtent())?++T:T=F[2]+1;break;case _u.BEGIN_PATH:if(M<R){h.fill_(t);R=0}if(M<I){t.stroke();I=0}if(!R&&!I){t.beginPath();p=d=NaN}++T;break;case _u.CIRCLE:var A=a[C=F[1]],N=a[C+1],D=a[C+2]-A,G=a[C+3]-N,k=Math.sqrt(D*D+G*G);t.moveTo(A+k,N);t.arc(A,N,k,0,2*Math.PI,!0);++T;break;case _u.CLOSE_PATH:t.closePath();++T;break;case _u.CUSTOM:C=F[1];l=F[2];var j=F[3],U=F[4],Y=6==F.length?F[5]:void 0;b.geometry=j;b.feature=v;T in O||(O[T]=[]);var B=O[T];if(Y)Y(a,C,l,2,B);else{B[0]=a[C];B[1]=a[C+1];B.length=2}U(B,b);++T;break;case _u.DRAW_IMAGE:C=F[1];l=F[2];y=F[3];u=F[4];c=F[5];g=o?null:F[6];var V=F[7],X=F[8],z=F[9],W=F[10],H=F[11],K=F[12],Z=F[13],q=F[14],J=void 0,Q=void 0,$=void 0;if(16<F.length){J=F[15];Q=F[16];$=F[17]}else{J=Qi;Q=$=!1}H&&(K+=P);for(;C<l;C+=2)h.replayImage_(t,a[C],a[C+1],y,u,c,g,V,X,z,W,K,Z,n,q,J,Q?w:null,$?L:null);h.renderDeclutter_(g,v);++T;break;case _u.DRAW_CHARS:var tt=F[1],et=F[2],it=F[3];g=o?null:F[4];var rt=F[5],nt=F[6],ot=F[7],st=F[8],at=F[9],ht=F[10],lt=F[11],ut=F[12],ct=F[13],pt=F[14],dt=io(a,tt,et,2),ft=st(ut);if(rt||ft<=dt){var _t=h.textStates[ct].textAlign,gt=fu(a,tt,et,2,ut,st,(dt-ft)*Eu[_t],ot);if(gt){var yt=void 0,vt=void 0,mt=void 0,xt=void 0,Et=void 0;if(ht)for(yt=0,vt=gt.length;yt<vt;++yt){mt=(Et=gt[yt])[4];xt=h.getImage(mt,ct,"",ht);u=Et[2]+lt;c=it*xt.height+2*(.5-it)*lt-at;h.replayImage_(t,Et[0],Et[1],xt,u,c,g,xt.height,1,0,0,Et[3],pt,!1,xt.width,Qi,null,null)}if(nt)for(yt=0,vt=gt.length;yt<vt;++yt){mt=(Et=gt[yt])[4];xt=h.getImage(mt,ct,nt,"");u=Et[2];c=it*xt.height-at;h.replayImage_(t,Et[0],Et[1],xt,u,c,g,xt.height,1,0,0,Et[3],pt,!1,xt.width,Qi,null,null)}}}h.renderDeclutter_(g,v);++T;break;case _u.END_GEOMETRY:if(void 0!==o){var Tt=o(v=F[1]);if(Tt)return Tt}++T;break;case _u.FILL:M?R++:h.fill_(t);++T;break;case _u.MOVE_TO_LINE_TO:C=F[1];l=F[2];m=a[C];_=(x=a[C+1])+.5|0;if((f=m+.5|0)!==p||_!==d){t.moveTo(m,x);p=f;d=_}for(C+=2;C<l;C+=2){f=(m=a[C])+.5|0;_=(x=a[C+1])+.5|0;if(C==l-2||f!==p||_!==d){t.lineTo(m,x);p=f;d=_}}++T;break;case _u.SET_FILL_STYLE:w=F;h.alignFill_=F[2];if(R){h.fill_(t);R=0;if(I){t.stroke();I=0}}t.fillStyle=F[1];++T;break;case _u.SET_STROKE_STYLE:L=F;if(I){t.stroke();I=0}h.setStrokeStyle_(t,F);++T;break;case _u.STROKE:M?I++:t.stroke();++T;break;default:++T}}R&&this.fill_(t);I&&t.stroke()};t.prototype.replay=function(t,e,i,r,n){this.viewRotation_=i;this.replay_(t,e,r,this.instructions,n,void 0,void 0)};t.prototype.replayHitDetection=function(t,e,i,r,n,o){this.viewRotation_=i;return this.replay_(t,e,r,this.hitDetectionInstructions,!0,n,o)};t.prototype.reverseHitDetectionInstructions=function(){var t,e=this.hitDetectionInstructions;e.reverse();var i,r,n=e.length,o=-1;for(t=0;t<n;++t)if((r=(i=e[t])[0])==_u.END_GEOMETRY)o=t;else if(r==_u.BEGIN_GEOMETRY){i[2]=t;Pr(this.hitDetectionInstructions,o,t);o=-1}};t.prototype.setFillStrokeStyle=function(t,e){var i=this.state;if(t){var r=t.getColor();i.fillStyle=ti(r||zi)}else i.fillStyle=void 0;if(e){var n=e.getColor();i.strokeStyle=ti(n||Zi);var o=e.getLineCap();i.lineCap=void 0!==o?o:Wi;var s=e.getLineDash();i.lineDash=s?s.slice():Hi;var a=e.getLineDashOffset();i.lineDashOffset=a||0;var h=e.getLineJoin();i.lineJoin=void 0!==h?h:Ki;var l=e.getWidth();i.lineWidth=void 0!==l?l:1;var u=e.getMiterLimit();i.miterLimit=void 0!==u?u:10;if(i.lineWidth>this.maxLineWidth){this.maxLineWidth=i.lineWidth;this.bufferedMaxExtent_=null}}else{i.strokeStyle=void 0;i.lineCap=void 0;i.lineDash=null;i.lineDashOffset=void 0;i.lineJoin=void 0;i.lineWidth=void 0;i.miterLimit=void 0}};t.prototype.createFill=function(t,e){var i=t.fillStyle,r=[_u.SET_FILL_STYLE,i];"string"!=typeof i&&r.push(!0);return r};t.prototype.applyStroke=function(t){this.instructions.push(this.createStroke(t))};t.prototype.createStroke=function(t){return[_u.SET_STROKE_STYLE,t.strokeStyle,t.lineWidth*this.pixelRatio,t.lineCap,t.lineJoin,t.miterLimit,this.applyPixelRatio(t.lineDash),t.lineDashOffset*this.pixelRatio]};t.prototype.updateFillStyle=function(t,e,i){var r=t.fillStyle;if("string"!=typeof r||t.currentFillStyle!=r){void 0!==r&&this.instructions.push(e.call(this,t,i));t.currentFillStyle=r}};t.prototype.updateStrokeStyle=function(t,e){var i=t.strokeStyle,r=t.lineCap,n=t.lineDash,o=t.lineDashOffset,s=t.lineJoin,a=t.lineWidth,h=t.miterLimit;if(t.currentStrokeStyle!=i||t.currentLineCap!=r||n!=t.currentLineDash&&!Ar(t.currentLineDash,n)||t.currentLineDashOffset!=o||t.currentLineJoin!=s||t.currentLineWidth!=a||t.currentMiterLimit!=h){void 0!==i&&e.call(this,t);t.currentStrokeStyle=i;t.currentLineCap=r;t.currentLineDash=n;t.currentLineDashOffset=o;t.currentLineJoin=s;t.currentLineWidth=a;t.currentMiterLimit=h}};t.prototype.endGeometry=function(t,e){this.beginGeometryInstruction1_[2]=this.instructions.length;this.beginGeometryInstruction1_=null;this.beginGeometryInstruction2_[2]=this.hitDetectionInstructions.length;this.beginGeometryInstruction2_=null;var i=[_u.END_GEOMETRY,e];this.instructions.push(i);this.hitDetectionInstructions.push(i)};t.prototype.getBufferedMaxExtent=function(){if(!this.bufferedMaxExtent_){this.bufferedMaxExtent_=j(this.maxExtent);if(0<this.maxLineWidth){var t=this.resolution*(this.maxLineWidth+1)/2;k(this.bufferedMaxExtent_,t,this.bufferedMaxExtent_)}}return this.bufferedMaxExtent_};return t}(Zl);Cu.prototype.finish=L;var Ru=function(s){function t(t,e,i,r,n,o){s.call(this,t,e,i,r,n,o);this.declutterGroup_=null;this.hitDetectionImage_=null;this.image_=null;this.anchorX_=void 0;this.anchorY_=void 0;this.height_=void 0;this.opacity_=void 0;this.originX_=void 0;this.originY_=void 0;this.rotateWithView_=void 0;this.rotation_=void 0;this.scale_=void 0;this.width_=void 0}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.drawCoordinates_=function(t,e,i,r){return this.appendFlatCoordinates(t,e,i,r,!1,!1)};t.prototype.drawPoint=function(t,e){if(this.image_){this.beginGeometry(t,e);var i=t.getFlatCoordinates(),r=t.getStride(),n=this.coordinates.length,o=this.drawCoordinates_(i,0,i.length,r);this.instructions.push([_u.DRAW_IMAGE,n,o,this.image_,this.anchorX_,this.anchorY_,this.declutterGroup_,this.height_,this.opacity_,this.originX_,this.originY_,this.rotateWithView_,this.rotation_,this.scale_*this.pixelRatio,this.width_]);this.hitDetectionInstructions.push([_u.DRAW_IMAGE,n,o,this.hitDetectionImage_,this.anchorX_,this.anchorY_,this.declutterGroup_,this.height_,this.opacity_,this.originX_,this.originY_,this.rotateWithView_,this.rotation_,this.scale_,this.width_]);this.endGeometry(t,e)}};t.prototype.drawMultiPoint=function(t,e){if(this.image_){this.beginGeometry(t,e);var i=t.getFlatCoordinates(),r=t.getStride(),n=this.coordinates.length,o=this.drawCoordinates_(i,0,i.length,r);this.instructions.push([_u.DRAW_IMAGE,n,o,this.image_,this.anchorX_,this.anchorY_,this.declutterGroup_,this.height_,this.opacity_,this.originX_,this.originY_,this.rotateWithView_,this.rotation_,this.scale_*this.pixelRatio,this.width_]);this.hitDetectionInstructions.push([_u.DRAW_IMAGE,n,o,this.hitDetectionImage_,this.anchorX_,this.anchorY_,this.declutterGroup_,this.height_,this.opacity_,this.originX_,this.originY_,this.rotateWithView_,this.rotation_,this.scale_,this.width_]);this.endGeometry(t,e)}};t.prototype.finish=function(){this.reverseHitDetectionInstructions();this.anchorX_=void 0;this.anchorY_=void 0;this.hitDetectionImage_=null;this.image_=null;this.height_=void 0;this.scale_=void 0;this.opacity_=void 0;this.originX_=void 0;this.originY_=void 0;this.rotateWithView_=void 0;this.rotation_=void 0;this.width_=void 0};t.prototype.setImageStyle=function(t,e){var i=t.getAnchor(),r=t.getSize(),n=t.getHitDetectionImage(1),o=t.getImage(1),s=t.getOrigin();this.anchorX_=i[0];this.anchorY_=i[1];this.declutterGroup_=e;this.hitDetectionImage_=n;this.image_=o;this.height_=r[1];this.opacity_=t.getOpacity();this.originX_=s[0];this.originY_=s[1];this.rotateWithView_=t.getRotateWithView();this.rotation_=t.getRotation();this.scale_=t.getScale();this.width_=r[0]};return t}(Cu),Iu=function(s){function t(t,e,i,r,n,o){s.call(this,t,e,i,r,n,o)}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.drawFlatCoordinates_=function(t,e,i,r){var n=this.coordinates.length,o=this.appendFlatCoordinates(t,e,i,r,!1,!1),s=[_u.MOVE_TO_LINE_TO,n,o];this.instructions.push(s);this.hitDetectionInstructions.push(s);return i};t.prototype.drawLineString=function(t,e){var i=this.state,r=i.strokeStyle,n=i.lineWidth;if(void 0!==r&&void 0!==n){this.updateStrokeStyle(i,this.applyStroke);this.beginGeometry(t,e);this.hitDetectionInstructions.push([_u.SET_STROKE_STYLE,i.strokeStyle,i.lineWidth,i.lineCap,i.lineJoin,i.miterLimit,i.lineDash,i.lineDashOffset],vu);var o=t.getFlatCoordinates(),s=t.getStride();this.drawFlatCoordinates_(o,0,o.length,s);this.hitDetectionInstructions.push(yu);this.endGeometry(t,e)}};t.prototype.drawMultiLineString=function(t,e){var i=this.state,r=i.strokeStyle,n=i.lineWidth;if(void 0!==r&&void 0!==n){this.updateStrokeStyle(i,this.applyStroke);this.beginGeometry(t,e);this.hitDetectionInstructions.push([_u.SET_STROKE_STYLE,i.strokeStyle,i.lineWidth,i.lineCap,i.lineJoin,i.miterLimit,i.lineDash,i.lineDashOffset],vu);for(var o=t.getEnds(),s=t.getFlatCoordinates(),a=t.getStride(),h=0,l=0,u=o.length;l<u;++l)h=this.drawFlatCoordinates_(s,h,o[l],a);this.hitDetectionInstructions.push(yu);this.endGeometry(t,e)}};t.prototype.finish=function(){var t=this.state;null!=t.lastStroke&&t.lastStroke!=this.coordinates.length&&this.instructions.push(yu);this.reverseHitDetectionInstructions();this.state=null};t.prototype.applyStroke=function(t){if(null!=t.lastStroke&&t.lastStroke!=this.coordinates.length){this.instructions.push(yu);t.lastStroke=this.coordinates.length}t.lastStroke=0;s.prototype.applyStroke.call(this,t);this.instructions.push(vu)};return t}(Cu),wu=function(s){function t(t,e,i,r,n,o){s.call(this,t,e,i,r,n,o)}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.drawFlatCoordinatess_=function(t,e,i,r){var n=this.state,o=void 0!==n.fillStyle,s=null!=n.strokeStyle,a=i.length;this.instructions.push(vu);this.hitDetectionInstructions.push(vu);for(var h=0;h<a;++h){var l=i[h],u=this.coordinates.length,c=this.appendFlatCoordinates(t,e,l,r,!0,!s),p=[_u.MOVE_TO_LINE_TO,u,c];this.instructions.push(p);this.hitDetectionInstructions.push(p);if(s){this.instructions.push(mu);this.hitDetectionInstructions.push(mu)}e=l}if(o){this.instructions.push(gu);this.hitDetectionInstructions.push(gu)}if(s){this.instructions.push(yu);this.hitDetectionInstructions.push(yu)}return e};t.prototype.drawCircle=function(t,e){var i=this.state,r=i.fillStyle,n=i.strokeStyle;if(void 0!==r||void 0!==n){this.setFillStrokeStyles_(t);this.beginGeometry(t,e);void 0!==i.fillStyle&&this.hitDetectionInstructions.push([_u.SET_FILL_STYLE,He(zi)]);void 0!==i.strokeStyle&&this.hitDetectionInstructions.push([_u.SET_STROKE_STYLE,i.strokeStyle,i.lineWidth,i.lineCap,i.lineJoin,i.miterLimit,i.lineDash,i.lineDashOffset]);var o=t.getFlatCoordinates(),s=t.getStride(),a=this.coordinates.length;this.appendFlatCoordinates(o,0,o.length,s,!1,!1);var h=[_u.CIRCLE,a];this.instructions.push(vu,h);this.hitDetectionInstructions.push(vu,h);this.hitDetectionInstructions.push(gu);void 0!==i.fillStyle&&this.instructions.push(gu);if(void 0!==i.strokeStyle){this.instructions.push(yu);this.hitDetectionInstructions.push(yu)}this.endGeometry(t,e)}};t.prototype.drawPolygon=function(t,e){var i=this.state,r=i.fillStyle,n=i.strokeStyle;if(void 0!==r||void 0!==n){this.setFillStrokeStyles_(t);this.beginGeometry(t,e);void 0!==i.fillStyle&&this.hitDetectionInstructions.push([_u.SET_FILL_STYLE,He(zi)]);void 0!==i.strokeStyle&&this.hitDetectionInstructions.push([_u.SET_STROKE_STYLE,i.strokeStyle,i.lineWidth,i.lineCap,i.lineJoin,i.miterLimit,i.lineDash,i.lineDashOffset]);var o=t.getEnds(),s=t.getOrientedFlatCoordinates(),a=t.getStride();this.drawFlatCoordinatess_(s,0,o,a);this.endGeometry(t,e)}};t.prototype.drawMultiPolygon=function(t,e){var i=this.state,r=i.fillStyle,n=i.strokeStyle;if(void 0!==r||void 0!==n){this.setFillStrokeStyles_(t);this.beginGeometry(t,e);void 0!==i.fillStyle&&this.hitDetectionInstructions.push([_u.SET_FILL_STYLE,He(zi)]);void 0!==i.strokeStyle&&this.hitDetectionInstructions.push([_u.SET_STROKE_STYLE,i.strokeStyle,i.lineWidth,i.lineCap,i.lineJoin,i.miterLimit,i.lineDash,i.lineDashOffset]);for(var o=t.getEndss(),s=t.getOrientedFlatCoordinates(),a=t.getStride(),h=0,l=0,u=o.length;l<u;++l)h=this.drawFlatCoordinatess_(s,h,o[l],a);this.endGeometry(t,e)}};t.prototype.finish=function(){this.reverseHitDetectionInstructions();this.state=null;var t=this.tolerance;if(0!==t)for(var e=this.coordinates,i=0,r=e.length;i<r;++i)e[i]=ln(e[i],t)};t.prototype.setFillStrokeStyles_=function(t){var e=this.state;void 0!==e.fillStyle&&this.updateFillStyle(e,this.createFill,t);void 0!==e.strokeStyle&&this.updateStrokeStyle(e,this.applyStroke)};return t}(Cu);function Lu(t,e,i,r,n){var o,s,a,h,l,u,c,p,d,f=i,_=i,g=0,y=0,v=i;for(o=i;o<r;o+=n){var m=e[o],x=e[o+1];if(void 0!==h){p=m-h;d=x-l;a=Math.sqrt(p*p+d*d);if(void 0!==u){y+=s;if(t<Math.acos((u*p+c*d)/(s*a))){if(g<y){g=y;f=v;_=o}y=0;v=o-n}}s=a;u=p;c=d}h=m;l=x}return g<(y+=a)?[v,o]:[f,_]}var Ou=function(s){function t(t,e,i,r,n,o){s.call(this,t,e,i,r,n,o);this.declutterGroup_;this.labels_=null;this.text_="";this.textOffsetX_=0;this.textOffsetY_=0;this.textRotateWithView_=void 0;this.textRotation_=0;this.textFillState_=null;this.fillStates={};this.textStrokeState_=null;this.strokeStates={};this.textState_={};this.textStates={};this.textKey_="";this.fillKey_="";this.strokeKey_="";this.widths_={};$i.prune()}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.drawText=function(t,e){var i=this.textFillState_,r=this.textStrokeState_,n=this.textState_;if(""!==this.text_&&n&&(i||r)){var o,s,a=this.coordinates.length,h=t.getType(),l=null,u=2,c=2;if(n.placement===ho.LINE){if(!Rt(this.getBufferedMaxExtent(),t.getExtent()))return;var p;l=t.getFlatCoordinates();c=t.getStride();if(h==kt.LINE_STRING)p=[l.length];else if(h==kt.MULTI_LINE_STRING)p=t.getEnds();else if(h==kt.POLYGON)p=t.getEnds().slice(0,1);else if(h==kt.MULTI_POLYGON){var d=t.getEndss();p=[];for(o=0,s=d.length;o<s;++o)p.push(d[o][0])}this.beginGeometry(t,e);for(var f,_=n.textAlign,g=0,y=0,v=p.length;y<v;++y){if(null==_){var m=Lu(n.maxAngle,l,g,p[y],c);g=m[0];f=m[1]}else f=p[y];for(o=g;o<f;o+=c)this.coordinates.push(l[o],l[o+1]);u=this.coordinates.length;g=p[y];this.drawChars_(a,u,this.declutterGroup_);a=u}this.endGeometry(t,e)}else{var x=this.getImage(this.text_,this.textKey_,this.fillKey_,this.strokeKey_),E=x.width/this.pixelRatio;switch(h){case kt.POINT:case kt.MULTI_POINT:u=(l=t.getFlatCoordinates()).length;break;case kt.LINE_STRING:l=t.getFlatMidpoint();break;case kt.CIRCLE:l=t.getCenter();break;case kt.MULTI_LINE_STRING:u=(l=t.getFlatMidpoints()).length;break;case kt.POLYGON:l=t.getFlatInteriorPoint();if(!n.overflow&&l[2]/this.resolution<E)return;c=3;break;case kt.MULTI_POLYGON:var T=t.getFlatInteriorPoints();l=[];for(o=0,s=T.length;o<s;o+=3)(n.overflow||T[o+2]/this.resolution>=E)&&l.push(T[o],T[o+1]);if(0==(u=l.length))return}u=this.appendFlatCoordinates(l,0,u,c,!1,!1);if(n.backgroundFill||n.backgroundStroke){this.setFillStrokeStyle(n.backgroundFill,n.backgroundStroke);if(n.backgroundFill){this.updateFillStyle(this.state,this.createFill,t);this.hitDetectionInstructions.push(this.createFill(this.state,t))}if(n.backgroundStroke){this.updateStrokeStyle(this.state,this.applyStroke);this.hitDetectionInstructions.push(this.createStroke(this.state))}}this.beginGeometry(t,e);this.drawTextImage_(x,a,u);this.endGeometry(t,e)}}};t.prototype.getImage=function(t,e,i,r){var n,o=r+e+t+i+this.pixelRatio;if(!$i.containsKey(o)){var s=r?this.strokeStates[r]||this.textStrokeState_:null,a=i?this.fillStates[i]||this.textFillState_:null,h=this.textStates[e]||this.textState_,l=this.pixelRatio,u=h.scale*l,c=Eu[h.textAlign||qi],p=r&&s.lineWidth?s.lineWidth:0,d=t.split("\n"),f=d.length,_=[],g=Pu(h.font,d,_),y=ar(h.font),v=y*f,m=g+p,x=ii(Math.ceil(m*u),Math.ceil((v+p)*u));n=x.canvas;$i.set(o,n);1!=u&&x.scale(u,u);x.font=h.font;if(r){x.strokeStyle=s.strokeStyle;x.lineWidth=p;x.lineCap=s.lineCap;x.lineJoin=s.lineJoin;x.miterLimit=s.miterLimit;if(Pi&&s.lineDash.length){x.setLineDash(s.lineDash);x.lineDashOffset=s.lineDashOffset}}i&&(x.fillStyle=a.fillStyle);x.textBaseline="middle";x.textAlign="center";var E,T=.5-c,S=c*n.width/u+T*p;if(r)for(E=0;E<f;++E)x.strokeText(d[E],S+T*_[E],.5*(p+y)+E*y);if(i)for(E=0;E<f;++E)x.fillText(d[E],S+T*_[E],.5*(p+y)+E*y)}return $i.get(o)};t.prototype.drawTextImage_=function(t,e,i){var r=this.textState_,n=this.textStrokeState_,o=this.pixelRatio,s=Eu[r.textAlign||qi],a=Eu[r.textBaseline],h=n&&n.lineWidth?n.lineWidth:0,l=s*t.width/o+2*(.5-s)*h,u=a*t.height/o+2*(.5-a)*h;this.instructions.push([_u.DRAW_IMAGE,e,i,t,(l-this.textOffsetX_)*o,(u-this.textOffsetY_)*o,this.declutterGroup_,t.height,1,0,0,this.textRotateWithView_,this.textRotation_,1,t.width,r.padding==Qi?Qi:r.padding.map(function(t){return t*o}),!!r.backgroundFill,!!r.backgroundStroke]);this.hitDetectionInstructions.push([_u.DRAW_IMAGE,e,i,t,(l-this.textOffsetX_)*o,(u-this.textOffsetY_)*o,this.declutterGroup_,t.height,1,0,0,this.textRotateWithView_,this.textRotation_,1/o,t.width,r.padding,!!r.backgroundFill,!!r.backgroundStroke])};t.prototype.drawChars_=function(t,e,i){var r=this.textStrokeState_,n=this.textState_,o=this.textFillState_,s=this.strokeKey_;r&&(s in this.strokeStates||(this.strokeStates[s]={strokeStyle:r.strokeStyle,lineCap:r.lineCap,lineDashOffset:r.lineDashOffset,lineWidth:r.lineWidth,lineJoin:r.lineJoin,miterLimit:r.miterLimit,lineDash:r.lineDash}));var a=this.textKey_;this.textKey_ in this.textStates||(this.textStates[this.textKey_]={font:n.font,textAlign:n.textAlign||qi,scale:n.scale});var h=this.fillKey_;o&&(h in this.fillStates||(this.fillStates[h]={fillStyle:o.fillStyle}));var l=this.pixelRatio,u=Eu[n.textBaseline],c=this.textOffsetY_*l,p=this.text_,d=n.font,f=n.scale,_=r?r.lineWidth*f/2:0,g=this.widths_[d];g||(this.widths_[d]=g={});this.instructions.push([_u.DRAW_CHARS,t,e,u,i,n.overflow,h,n.maxAngle,function(t){var e=g[t];e||(e=g[t]=hr(d,t));return e*f*l},c,s,_*l,p,a,1]);this.hitDetectionInstructions.push([_u.DRAW_CHARS,t,e,u,i,n.overflow,h,n.maxAngle,function(t){var e=g[t];e||(e=g[t]=hr(d,t));return e*f},c,s,_,p,a,1/l])};t.prototype.setTextStyle=function(t,e){var i,r,n;if(t){this.declutterGroup_=e;var o=t.getFill();if(o){(r=this.textFillState_)||(r=this.textFillState_={});r.fillStyle=ti(o.getColor()||zi)}else r=this.textFillState_=null;var s=t.getStroke();if(s){(n=this.textStrokeState_)||(n=this.textStrokeState_={});var a=s.getLineDash(),h=s.getLineDashOffset(),l=s.getWidth(),u=s.getMiterLimit();n.lineCap=s.getLineCap()||Wi;n.lineDash=a?a.slice():Hi;n.lineDashOffset=void 0===h?0:h;n.lineJoin=s.getLineJoin()||Ki;n.lineWidth=void 0===l?1:l;n.miterLimit=void 0===u?10:u;n.strokeStyle=ti(s.getColor()||Zi)}else n=this.textStrokeState_=null;i=this.textState_;var c=t.getFont()||Xi;rr(c);var p=t.getScale();i.overflow=t.getOverflow();i.font=c;i.maxAngle=t.getMaxAngle();i.placement=t.getPlacement();i.textAlign=t.getTextAlign();i.textBaseline=t.getTextBaseline()||Ji;i.backgroundFill=t.getBackgroundFill();i.backgroundStroke=t.getBackgroundStroke();i.padding=t.getPadding()||Qi;i.scale=void 0===p?1:p;var d=t.getOffsetX(),f=t.getOffsetY(),_=t.getRotateWithView(),g=t.getRotation();this.text_=t.getText()||"";this.textOffsetX_=void 0===d?0:d;this.textOffsetY_=void 0===f?0:f;this.textRotateWithView_=void 0!==_&&_;this.textRotation_=void 0===g?0:g;this.strokeKey_=n?("string"==typeof n.strokeStyle?n.strokeStyle:St(n.strokeStyle))+n.lineCap+n.lineDashOffset+"|"+n.lineWidth+n.lineJoin+n.miterLimit+"["+n.lineDash.join()+"]":"";this.textKey_=i.font+i.scale+(i.textAlign||"?");this.fillKey_=r?"string"==typeof r.fillStyle?r.fillStyle:"|"+St(r.fillStyle):""}else this.text_=""};return t}(Cu);function Pu(t,e,i){for(var r=e.length,n=0,o=0;o<r;++o){var s=hr(t,e[o]);n=Math.max(n,s);i.push(s)}return n}var bu={Circle:wu,Default:Cu,Image:Ru,LineString:Iu,Polygon:wu,Text:Ou},Mu=function(a){function t(t,e,i,r,n,o,s){a.call(this);this.declutterTree_=o;this.declutterGroup_=null;this.tolerance_=t;this.maxExtent_=e;this.overlaps_=n;this.pixelRatio_=r;this.resolution_=i;this.renderBuffer_=s;this.replaysByZIndex_={};this.hitDetectionContext_=ii(1,1);this.hitDetectionTransform_=[1,0,0,1,0,0]}a&&(t.__proto__=a);((t.prototype=Object.create(a&&a.prototype)).constructor=t).prototype.addDeclutter=function(t){var e=null;this.declutterTree_&&(t?(e=this.declutterGroup_)[4]++:(e=this.declutterGroup_=[1/0,1/0,-1/0,-1/0]).push(1));return e};t.prototype.clip=function(t,e){var i=this.getClipCoords(e);t.beginPath();t.moveTo(i[0],i[1]);t.lineTo(i[2],i[3]);t.lineTo(i[4],i[5]);t.lineTo(i[6],i[7]);t.clip()};t.prototype.hasReplays=function(t){for(var e in this.replaysByZIndex_)for(var i=this.replaysByZIndex_[e],r=0,n=t.length;r<n;++r)if(t[r]in i)return!0;return!1};t.prototype.finish=function(){for(var t in this.replaysByZIndex_){var e=this.replaysByZIndex_[t];for(var i in e)e[i].finish()}};t.prototype.forEachFeatureAtCoordinate=function(t,e,i,r,n,o,s){var a,h=2*(r=Math.round(r))+1,l=Ue(this.hitDetectionTransform_,r+.5,r+.5,1/e,-1/e,-i,-t[0],-t[1]),u=this.hitDetectionContext_;if(u.canvas.width!==h||u.canvas.height!==h){u.canvas.width=h;u.canvas.height=h}else u.clearRect(0,0,h,h);if(void 0!==this.renderBuffer_){J(a=[1/0,1/0,-1/0,-1/0],t);k(a,e*(this.renderBuffer_+r),a)}var c,p,d=Nu(r);this.declutterTree_&&(c=this.declutterTree_.all().map(function(t){return t.value}));function f(t){for(var e=u.getImageData(0,0,h,h).data,i=0;i<h;i++)for(var r=0;r<h;r++)if(d[i][r]&&0<e[4*(r*h+i)+3]){var n=void 0;(!c||p!=du.IMAGE&&p!=du.TEXT||-1!==c.indexOf(t))&&(n=o(t));if(n)return n;u.clearRect(0,0,h,h);return}}var _,g,y,v,m,x=Object.keys(this.replaysByZIndex_).map(Number);x.sort(wr);for(_=x.length-1;0<=_;--_){var E=x[_].toString();y=this.replaysByZIndex_[E];for(g=xu.length-1;0<=g;--g)if(void 0!==(v=y[p=xu[g]]))if(!s||p!=du.IMAGE&&p!=du.TEXT){if(m=v.replayHitDetection(u,l,i,n,f,a))return m}else{var T=s[E];T?T.push(v,l.slice(0)):s[E]=[v,l.slice(0)]}}};t.prototype.getClipCoords=function(t){var e=this.maxExtent_,i=e[0],r=e[1],n=e[2],o=e[3],s=[i,r,i,o,n,o,n,r];It(s,0,8,2,t,s);return s};t.prototype.getReplay=function(t,e){var i=void 0!==t?t.toString():"0",r=this.replaysByZIndex_[i];if(void 0===r){r={};this.replaysByZIndex_[i]=r}var n=r[e];if(void 0===n){n=new bu[e](this.tolerance_,this.maxExtent_,this.resolution_,this.pixelRatio_,this.overlaps_,this.declutterTree_);r[e]=n}return n};t.prototype.getReplays=function(){return this.replaysByZIndex_};t.prototype.isEmpty=function(){return Ct(this.replaysByZIndex_)};t.prototype.replay=function(t,e,i,r,n,o,s){var a=Object.keys(this.replaysByZIndex_).map(Number);a.sort(wr);t.save();this.clip(t,e);var h,l,u,c,p,d,f=o||xu;for(h=0,l=a.length;h<l;++h){var _=a[h].toString();p=this.replaysByZIndex_[_];for(u=0,c=f.length;u<c;++u){var g=f[u];d=p[g];if(void 0!==d)if(!s||g!=du.IMAGE&&g!=du.TEXT)d.replay(t,e,i,r,n);else{var y=s[_];y?y.push(d,e.slice(0)):s[_]=[d,e.slice(0)]}}}t.restore()};return t}(pu),Fu={0:[[!0]]};function Au(t,e,i){var r,n=Math.floor(t.length/2);if(n<=e)for(r=n;r<e;r++)t[r][i]=!0;else if(e<n)for(r=e+1;r<n;r++)t[r][i]=!0}function Nu(t){if(void 0!==Fu[t])return Fu[t];for(var e=2*t+1,i=new Array(e),r=0;r<e;r++)i[r]=new Array(e);for(var n=t,o=0,s=0;o<=n;){Au(i,t+n,t+o);Au(i,t+o,t+n);Au(i,t-o,t+n);Au(i,t-n,t+o);Au(i,t-n,t-o);Au(i,t-o,t-n);Au(i,t+o,t-n);Au(i,t+n,t-o);0<2*((s+=1+2*++o)-n)+1&&(s+=1-2*(n-=1))}return Fu[t]=i}function Du(t,e,i,r){for(var n=Object.keys(t).map(Number).sort(wr),o={},s=0,a=n.length;s<a;++s)for(var h=t[n[s].toString()],l=0,u=h.length;l<u;){var c=h[l++],p=h[l++];c.replay(e,p,i,o,r)}}var Gu=.5,ku={Point:function(t,e,i,r){var n=i.getImage();if(n){if(n.getImageState()!=Ni.LOADED)return;var o=t.getReplay(i.getZIndex(),du.IMAGE);o.setImageStyle(n,t.addDeclutter(!1));o.drawPoint(e,r)}var s=i.getText();if(s){var a=t.getReplay(i.getZIndex(),du.TEXT);a.setTextStyle(s,t.addDeclutter(!!n));a.drawText(e,r)}},LineString:function(t,e,i,r){var n=i.getStroke();if(n){var o=t.getReplay(i.getZIndex(),du.LINE_STRING);o.setFillStrokeStyle(null,n);o.drawLineString(e,r)}var s=i.getText();if(s){var a=t.getReplay(i.getZIndex(),du.TEXT);a.setTextStyle(s,t.addDeclutter(!1));a.drawText(e,r)}},Polygon:function(t,e,i,r){var n=i.getFill(),o=i.getStroke();if(n||o){var s=t.getReplay(i.getZIndex(),du.POLYGON);s.setFillStrokeStyle(n,o);s.drawPolygon(e,r)}var a=i.getText();if(a){var h=t.getReplay(i.getZIndex(),du.TEXT);h.setTextStyle(a,t.addDeclutter(!1));h.drawText(e,r)}},MultiPoint:function(t,e,i,r){var n=i.getImage();if(n){if(n.getImageState()!=Ni.LOADED)return;var o=t.getReplay(i.getZIndex(),du.IMAGE);o.setImageStyle(n,t.addDeclutter(!1));o.drawMultiPoint(e,r)}var s=i.getText();if(s){var a=t.getReplay(i.getZIndex(),du.TEXT);a.setTextStyle(s,t.addDeclutter(!!n));a.drawText(e,r)}},MultiLineString:function(t,e,i,r){var n=i.getStroke();if(n){var o=t.getReplay(i.getZIndex(),du.LINE_STRING);o.setFillStrokeStyle(null,n);o.drawMultiLineString(e,r)}var s=i.getText();if(s){var a=t.getReplay(i.getZIndex(),du.TEXT);a.setTextStyle(s,t.addDeclutter(!1));a.drawText(e,r)}},MultiPolygon:function(t,e,i,r){var n=i.getFill(),o=i.getStroke();if(o||n){var s=t.getReplay(i.getZIndex(),du.POLYGON);s.setFillStrokeStyle(n,o);s.drawMultiPolygon(e,r)}var a=i.getText();if(a){var h=t.getReplay(i.getZIndex(),du.TEXT);h.setTextStyle(a,t.addDeclutter(!1));h.drawText(e,r)}},GeometryCollection:function(t,e,i,r){var n,o,s=e.getGeometriesArray();for(n=0,o=s.length;n<o;++n){var a=ku[s[n].getType()];a(t,s[n],i,r)}},Circle:function(t,e,i,r){var n=i.getFill(),o=i.getStroke();if(n||o){var s=t.getReplay(i.getZIndex(),du.CIRCLE);s.setFillStrokeStyle(n,o);s.drawCircle(e,r)}var a=i.getText();if(a){var h=t.getReplay(i.getZIndex(),du.TEXT);h.setTextStyle(a,t.addDeclutter(!1));h.drawText(e,r)}}};function ju(t,e){return St(t)-St(e)}function Uu(t,e){var i=Yu(t,e);return i*i}function Yu(t,e){return Gu*t/e}function Bu(t,e,i,r,n,o){var s=!1,a=i.getImage();if(a){var h=a.getImageState();if(h==Ni.LOADED||h==Ni.ERROR)a.unlistenImageChange(n,o);else{h==Ni.IDLE&&a.load();h=a.getImageState();a.listenImageChange(n,o);s=!0}}!function(t,e,i,r){var n=i.getGeometryFunction()(e);if(!n)return;var o=n.getSimplifiedGeometry(r);if(i.getRenderer())!function t(e,i,r,n){if(i.getType()==kt.GEOMETRY_COLLECTION){for(var o=i.getGeometries(),s=0,a=o.length;s<a;++s)t(e,o[s],r,n);return}var h=e.getReplay(r.getZIndex(),du.DEFAULT);h.drawCustom(i,n,r.getRenderer())}(t,o,i,e);else{var s=ku[o.getType()];s(t,o,i,e)}}(t,e,i,r);return s}var Vu=function(e){function t(t){e.call(this,t);this.declutterTree_=t.getDeclutter()?Uh(9,void 0):null;this.dirty_=!1;this.renderedRevision_=-1;this.renderedResolution_=NaN;this.renderedExtent_=[1/0,1/0,-1/0,-1/0];this.renderedRenderOrder_=null;this.replayGroup_=null;this.replayGroupChanged=!0;this.context=ii();S($i,R.CLEAR,this.handleFontsChanged_,this)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.disposeInternal=function(){f($i,R.CLEAR,this.handleFontsChanged_,this);e.prototype.disposeInternal.call(this)};t.prototype.compose=function(t,e,i){var r=e.extent,n=e.pixelRatio,o=i.managed?e.skippedFeatureUids:{},s=e.viewState,a=s.projection,h=s.rotation,l=a.getExtent(),u=this.getLayer().getSource(),c=this.getTransform(e,0),p=i.extent,d=void 0!==p;d&&this.clip(t,e,p);var f=this.replayGroup_;if(f&&!f.isEmpty()){this.declutterTree_&&this.declutterTree_.clear();var _,g=this.getLayer(),y=0,v=0,m=1!==i.opacity,x=g.hasListener(ao.RENDER);if(m||x){var E=t.canvas.width,T=t.canvas.height;if(h){var S=Math.round(Math.sqrt(E*E+T*T));y=(S-E)/2;v=(S-T)/2;E=T=S}this.context.canvas.width=E;this.context.canvas.height=T;_=this.context}else _=t;var C=_.globalAlpha;m||(_.globalAlpha=i.opacity);_!=t&&_.translate(y,v);var R=e.viewHints,I=!(R[bs.ANIMATING]||R[bs.INTERACTING]),w=e.size[0]*n,L=e.size[1]*n;lr(_,-h,w/2,L/2);f.replay(_,c,h,o,I);if(u.getWrapX()&&a.canWrapX()&&!Q(l,r)){for(var O,P=r[0],b=_t(l),M=0;P<l[0];){O=b*--M;c=this.getTransform(e,O);f.replay(_,c,h,o,I);P+=b}M=0;P=r[2];for(;P>l[2];){O=b*++M;c=this.getTransform(e,O);f.replay(_,c,h,o,I);P-=b}}lr(_,h,w/2,L/2);x&&this.dispatchRenderEvent(_,e,c);if(_!=t){if(m){var F=t.globalAlpha;t.globalAlpha=i.opacity;t.drawImage(_.canvas,-y,-v);t.globalAlpha=F}else t.drawImage(_.canvas,-y,-v);_.translate(-y,-v)}m||(_.globalAlpha=C)}d&&t.restore()};t.prototype.composeFrame=function(t,e,i){var r=this.getTransform(t,0);this.preCompose(i,t,r);this.compose(i,t,e);this.postCompose(i,t,e,r)};t.prototype.forEachFeatureAtCoordinate=function(t,e,i,r,n){if(this.replayGroup_){var o=e.viewState.resolution,s=e.viewState.rotation,a=this.getLayer(),h={};return this.replayGroup_.forEachFeatureAtCoordinate(t,o,s,i,{},function(t){var e=St(t).toString();if(!(e in h)){h[e]=!0;return r.call(n,t,a)}},null)}};t.prototype.handleFontsChanged_=function(t){var e=this.getLayer();e.getVisible()&&this.replayGroup_&&e.changed()};t.prototype.handleStyleImageChange_=function(t){this.renderIfReadyAndVisible()};t.prototype.prepareFrame=function(t,e){var n=this.getLayer(),i=n.getSource(),r=t.viewHints[bs.ANIMATING],o=t.viewHints[bs.INTERACTING],s=n.getUpdateWhileAnimating(),a=n.getUpdateWhileInteracting();if(!this.dirty_&&!s&&r||!a&&o)return!0;var h=t.extent,l=t.viewState,u=l.projection,c=l.resolution,p=t.pixelRatio,d=n.getRevision(),f=n.getRenderBuffer(),_=n.getRenderOrder();void 0===_&&(_=ju);var g=k(h,f*c),y=l.projection.getExtent();if(i.getWrapX()&&l.projection.canWrapX()&&!Q(y,t.extent)){var v=_t(y),m=Math.max(_t(g)/2,v);g[0]=y[0]-m;g[2]=y[2]+m}if(!this.dirty_&&this.renderedResolution_==c&&this.renderedRevision_==d&&this.renderedRenderOrder_==_&&Q(this.renderedExtent_,g))return!(this.replayGroupChanged=!1);this.replayGroup_=null;this.dirty_=!1;var x=new Mu(Yu(c,p),g,c,p,i.getOverlaps(),this.declutterTree_,n.getRenderBuffer());i.loadFeatures(g,c,u);var E=function(t){var e,i=t.getStyleFunction()||n.getStyleFunction();i&&(e=i(t,c));if(e){var r=this.renderFeature(t,c,p,e,x);this.dirty_=this.dirty_||r}}.bind(this);if(_){var T=[];i.forEachFeatureInExtent(g,function(t){T.push(t)},this);T.sort(_);for(var S=0,C=T.length;S<C;++S)E(T[S])}else i.forEachFeatureInExtent(g,E,this);x.finish();this.renderedResolution_=c;this.renderedRevision_=d;this.renderedRenderOrder_=_;this.renderedExtent_=g;this.replayGroup_=x;return this.replayGroupChanged=!0};t.prototype.renderFeature=function(t,e,i,r,n){if(!r)return!1;var o=!1;if(Array.isArray(r))for(var s=0,a=r.length;s<a;++s)o=Bu(n,t,r[s],Uu(e,i),this.handleStyleImageChange_,this)||o;else o=Bu(n,t,r,Uu(e,i),this.handleStyleImageChange_,this);return o};return t}(su);Vu.handles=function(t){return t.getType()===Io.VECTOR};Vu.create=function(t,e){return new Vu(e)};var Xu={IMAGE:"image",HYBRID:"hybrid",VECTOR:"vector"},zu={image:[du.POLYGON,du.CIRCLE,du.LINE_STRING,du.IMAGE,du.TEXT],hybrid:[du.POLYGON,du.LINE_STRING]},Wu={image:[du.DEFAULT],hybrid:[du.IMAGE,du.TEXT,du.DEFAULT],vector:xu},Hu=function(F){function t(t){F.call(this,t,!0);this.declutterTree_=t.getDeclutter()?Uh(9,void 0):null;this.dirty_=!1;this.renderedLayerRevision_;this.tmpTransform_=[1,0,0,1,0,0];this.zDirection=t.getRenderMode()==Xu.VECTOR?1:0;S($i,R.CLEAR,this.handleFontsChanged_,this)}F&&(t.__proto__=F);((t.prototype=Object.create(F&&F.prototype)).constructor=t).prototype.disposeInternal=function(){f($i,R.CLEAR,this.handleFontsChanged_,this);F.prototype.disposeInternal.call(this)};t.prototype.getTile=function(t,e,i,r,n){var o=F.prototype.getTile.call(this,t,e,i,r,n);if(o.getState()===yo.LOADED){this.createReplayGroup_(o,r,n);this.context&&this.renderTileImage_(o,r,n)}return o};t.prototype.prepareFrame=function(t,e){var i=this.getLayer(),r=i.getRevision();if(this.renderedLayerRevision_!=r){this.renderedTiles.length=0;var n=i.getRenderMode();this.context||n==Xu.VECTOR||(this.context=ii());this.context&&n==Xu.VECTOR&&(this.context=null)}this.renderedLayerRevision_=r;return F.prototype.prepareFrame.call(this,t,e)};t.prototype.createReplayGroup_=function(y,v,m){var x=this,E=this.getLayer(),t=E.getRevision(),T=E.getRenderOrder()||null,S=y.getReplayState(E);if(S.dirty||S.renderedRevision!=t||S.renderedRenderOrder!=T){for(var C=E.getSource(),R=C.getTileGrid(),I=C.getTileGridForProjection(m).getResolution(y.tileCoord[0]),w=y.extent,e=function(t,e){var i=y.getTile(y.tileKeys[t]);if(i.getState()==yo.LOADED){var r=i.tileCoord,n=R.getTileCoordExtent(r),o=pt(w,n),s=$(n,o)?null:k(o,E.getRenderBuffer()*I,x.tmpExtent),a=i.getProjection(),h=!1;if(!Ce(m,a)){h=!0;i.setProjection(m)}S.dirty=!1;var l=new Mu(0,o,I,v,C.getOverlaps(),x.declutterTree_,E.getRenderBuffer()),u=Uu(I,v),c=function(t){var e,i=t.getStyleFunction()||E.getStyleFunction();i&&(e=i(t,I));if(e){var r=this.renderFeature(t,u,e,l);this.dirty_=this.dirty_||r;S.dirty=S.dirty||r}},p=i.getFeatures();T&&T!==S.renderedRenderOrder&&p.sort(T);for(var d=0,f=p.length;d<f;++d){var _=p[d];if(h){if(a.getUnits()==Xt.TILE_PIXELS){a.setWorldExtent(n);a.setExtent(i.getExtent())}_.getGeometry().transform(a,m)}s&&!Rt(s,_.getGeometry().getExtent())||c.call(x,_)}l.finish();for(var g in l.getReplays());i.setReplayGroup(E,y.tileCoord.toString(),l)}},i=0,r=y.tileKeys.length;i<r;++i)e(i);S.renderedRevision=t;S.renderedRenderOrder=T}};t.prototype.forEachFeatureAtCoordinate=function(t,e,i,r,n){var o=e.viewState.resolution,s=e.viewState.rotation;i=null==i?0:i;var a,h,l,u,c,p=this.getLayer(),d={},f=this.renderedTiles;for(l=0,u=f.length;l<u;++l){var _=f[l];if(Y(a=k(_.extent,i*o,a),t))for(var g=0,y=_.tileKeys.length;g<y;++g){var v=_.getTile(_.tileKeys[g]);if(v.getState()==yo.LOADED){c=v.getReplayGroup(p,_.tileCoord.toString());h=h||c.forEachFeatureAtCoordinate(t,o,s,i,{},function(t){var e=St(t).toString();if(!(e in d)){d[e]=!0;return r.call(n,t,p)}},null)}}}return h};t.prototype.getReplayTransform_=function(t,e){var i=this.getLayer().getSource().getTileGrid(),r=t.tileCoord,n=i.getResolution(r[0]),o=e.viewState,s=e.pixelRatio,a=o.resolution/s,h=i.getTileCoordExtent(r,this.tmpExtent),l=o.center,u=dt(h),c=e.size,p=Math.round(s*c[0]/2),d=Math.round(s*c[1]/2);return Ue(this.tmpTransform_,p,d,n/a,n/a,o.rotation,(u[0]-l[0])/n,(l[1]-u[1])/n)};t.prototype.handleFontsChanged_=function(t){var e=this.getLayer();e.getVisible()&&void 0!==this.renderedLayerRevision_&&e.changed()};t.prototype.handleStyleImageChange_=function(t){this.renderIfReadyAndVisible()};t.prototype.postCompose=function(t,e,i){var r=this.getLayer(),n=r.getRenderMode();if(n!=Xu.IMAGE){var o,s,a=r.getDeclutter()?{}:null,h=r.getSource(),l=Wu[n],u=e.pixelRatio,c=e.viewState.rotation,p=e.size;c&&lr(t,-c,o=Math.round(u*p[0]/2),s=Math.round(u*p[1]/2));a&&this.declutterTree_.clear();for(var d=e.viewHints,f=!(d[bs.ANIMATING]||d[bs.INTERACTING]),_=this.renderedTiles,g=h.getTileGridForProjection(e.viewState.projection),y=[],v=[],m=_.length-1;0<=m;--m){var x=_[m];if(x.getState()!=yo.ABORT)for(var E=x.tileCoord,T=g.getTileCoordExtent(E,this.tmpExtent)[0]-x.extent[0],S=void 0,C=0,R=x.tileKeys.length;C<R;++C){var I=x.getTile(x.tileKeys[C]);if(I.getState()==yo.LOADED){var w=I.getReplayGroup(r,E.toString());if(w&&w.hasReplays(l)){S||(S=this.getTransform(e,T));var L=I.tileCoord[0],O=w.getClipCoords(S);t.save();t.globalAlpha=i.opacity;for(var P=0,b=y.length;P<b;++P){var M=y[P];if(L<v[P]){t.beginPath();t.moveTo(O[0],O[1]);t.lineTo(O[2],O[3]);t.lineTo(O[4],O[5]);t.lineTo(O[6],O[7]);t.moveTo(M[6],M[7]);t.lineTo(M[4],M[5]);t.lineTo(M[2],M[3]);t.lineTo(M[0],M[1]);t.clip()}}w.replay(t,S,c,{},f,l,a);t.restore();y.push(O);v.push(L)}}}}a&&Du(a,t,c,f);c&&lr(t,c,o,s)}F.prototype.postCompose.call(this,t,e,i)};t.prototype.renderFeature=function(t,e,i,r){if(!i)return!1;var n=!1;if(Array.isArray(i))for(var o=0,s=i.length;o<s;++o)n=Bu(r,t,i[o],e,this.handleStyleImageChange_,this)||n;else n=Bu(r,t,i,e,this.handleStyleImageChange_,this);return n};t.prototype.renderTileImage_=function(t,e,i){var r=this.getLayer(),n=t.getReplayState(r),o=r.getRevision(),s=zu[r.getRenderMode()];if(s&&n.renderedTileRevision!==o){n.renderedTileRevision=o;var a=t.wrappedTileCoord,h=a[0],l=r.getSource(),u=l.getTileGridForProjection(i),c=u.getResolution(h),p=t.getContext(r),d=l.getTilePixelSize(h,e,i);p.canvas.width=d[0];p.canvas.height=d[1];for(var f=u.getTileCoordExtent(a,this.tmpExtent),_=0,g=t.tileKeys.length;_<g;++_){var y=t.getTile(t.tileKeys[_]);if(y.getState()==yo.LOADED){var v=e/c,m=Me(this.tmpTransform_);ke(m,v,-v);je(m,-f[0],-f[3]);y.getReplayGroup(r,t.tileCoord.toString()).replay(p,m,0,{},!0,s)}}}};return t}(cu);Hu.handles=function(t){return t.getType()===Io.VECTOR_TILE};Hu.create=function(t,e){return new Hu(e)};var Ku=function(e){function t(t){(t=T({},t)).controls||(t.controls=ra());t.interactions||(t.interactions=Hl());e.call(this,t)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.createRenderer=function(){var t=new nu(this);t.registerLayerRenderers([hu,cu,Vu,Hu]);return t};return t}(Ks),Zu={BOTTOM_LEFT:"bottom-left",BOTTOM_CENTER:"bottom-center",BOTTOM_RIGHT:"bottom-right",CENTER_LEFT:"center-left",CENTER_CENTER:"center-center",CENTER_RIGHT:"center-right",TOP_LEFT:"top-left",TOP_CENTER:"top-center",TOP_RIGHT:"top-right"},qu="element",Ju="map",Qu="offset",$u="position",tc="positioning",ec=function(e){function t(t){e.call(this);this.options=t;this.id=t.id;this.insertFirst=void 0===t.insertFirst||t.insertFirst;this.stopEvent=void 0===t.stopEvent||t.stopEvent;this.element=document.createElement("div");this.element.className=void 0!==t.className?t.className:"ol-overlay-container "+Gi;this.element.style.position="absolute";this.autoPan=void 0!==t.autoPan&&t.autoPan;this.autoPanAnimation=t.autoPanAnimation||{};this.autoPanMargin=void 0!==t.autoPanMargin?t.autoPanMargin:20;this.rendered={bottom_:"",left_:"",right_:"",top_:"",visible:!0};this.mapPostrenderListenerKey=null;S(this,P(qu),this.handleElementChanged,this);S(this,P(Ju),this.handleMapChanged,this);S(this,P(Qu),this.handleOffsetChanged,this);S(this,P($u),this.handlePositionChanged,this);S(this,P(tc),this.handlePositioningChanged,this);void 0!==t.element&&this.setElement(t.element);this.setOffset(void 0!==t.offset?t.offset:[0,0]);this.setPositioning(void 0!==t.positioning?t.positioning:Zu.TOP_LEFT);void 0!==t.position&&this.setPosition(t.position)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getElement=function(){return this.get(qu)};t.prototype.getId=function(){return this.id};t.prototype.getMap=function(){return this.get(Ju)};t.prototype.getOffset=function(){return this.get(Qu)};t.prototype.getPosition=function(){return this.get($u)};t.prototype.getPositioning=function(){return this.get(tc)};t.prototype.handleElementChanged=function(){ai(this.element);var t=this.getElement();t&&this.element.appendChild(t)};t.prototype.handleMapChanged=function(){if(this.mapPostrenderListenerKey){si(this.element);g(this.mapPostrenderListenerKey);this.mapPostrenderListenerKey=null}var t=this.getMap();if(t){this.mapPostrenderListenerKey=S(t,ys.POSTRENDER,this.render,this);this.updatePixelPosition();var e=this.stopEvent?t.getOverlayContainerStopEvent():t.getOverlayContainer();this.insertFirst?e.insertBefore(this.element,e.childNodes[0]||null):e.appendChild(this.element)}};t.prototype.render=function(){this.updatePixelPosition()};t.prototype.handleOffsetChanged=function(){this.updatePixelPosition()};t.prototype.handlePositionChanged=function(){this.updatePixelPosition();this.get($u)&&this.autoPan&&this.panIntoView()};t.prototype.handlePositioningChanged=function(){this.updatePixelPosition()};t.prototype.setElement=function(t){this.set(qu,t)};t.prototype.setMap=function(t){this.set(Ju,t)};t.prototype.setOffset=function(t){this.set(Qu,t)};t.prototype.setPosition=function(t){this.set($u,t)};t.prototype.panIntoView=function(){var t=this.getMap();if(t&&t.getTargetElement()){var e=this.getRect(t.getTargetElement(),t.getSize()),i=this.getElement(),r=this.getRect(i,[ri(i),ni(i)]),n=this.autoPanMargin;if(!Q(e,r)){var o=r[0]-e[0],s=e[2]-r[2],a=r[1]-e[1],h=e[3]-r[3],l=[0,0];o<0?l[0]=o-n:s<0&&(l[0]=Math.abs(s)+n);a<0?l[1]=a-n:h<0&&(l[1]=Math.abs(h)+n);if(0!==l[0]||0!==l[1]){var u=t.getView().getCenter(),c=t.getPixelFromCoordinate(u),p=[c[0]+l[0],c[1]+l[1]];t.getView().animate({center:t.getCoordinateFromPixel(p),duration:this.autoPanAnimation.duration,easing:this.autoPanAnimation.easing})}}}};t.prototype.getRect=function(t,e){var i=t.getBoundingClientRect(),r=i.left+window.pageXOffset,n=i.top+window.pageYOffset;return[r,n,r+e[0],n+e[1]]};t.prototype.setPositioning=function(t){this.set(tc,t)};t.prototype.setVisible=function(t){if(this.rendered.visible!==t){this.element.style.display=t?"":"none";this.rendered.visible=t}};t.prototype.updatePixelPosition=function(){var t=this.getMap(),e=this.getPosition();if(t&&t.isRendered()&&e){var i=t.getPixelFromCoordinate(e),r=t.getSize();this.updateRenderedPosition(i,r)}else this.setVisible(!1)};t.prototype.updateRenderedPosition=function(t,e){var i=this.element.style,r=this.getOffset(),n=this.getPositioning();this.setVisible(!0);var o=r[0],s=r[1];if(n==Zu.BOTTOM_RIGHT||n==Zu.CENTER_RIGHT||n==Zu.TOP_RIGHT){""!==this.rendered.left_&&(this.rendered.left_=i.left="");var a=Math.round(e[0]-t[0]-o)+"px";this.rendered.right_!=a&&(this.rendered.right_=i.right=a)}else{""!==this.rendered.right_&&(this.rendered.right_=i.right="");n!=Zu.BOTTOM_CENTER&&n!=Zu.CENTER_CENTER&&n!=Zu.TOP_CENTER||(o-=this.element.offsetWidth/2);var h=Math.round(t[0]+o)+"px";this.rendered.left_!=h&&(this.rendered.left_=i.left=h)}if(n==Zu.BOTTOM_LEFT||n==Zu.BOTTOM_CENTER||n==Zu.BOTTOM_RIGHT){""!==this.rendered.top_&&(this.rendered.top_=i.top="");var l=Math.round(e[1]-t[1]-s)+"px";this.rendered.bottom_!=l&&(this.rendered.bottom_=i.bottom=l)}else{""!==this.rendered.bottom_&&(this.rendered.bottom_=i.bottom="");n!=Zu.CENTER_LEFT&&n!=Zu.CENTER_CENTER&&n!=Zu.CENTER_RIGHT||(s-=this.element.offsetHeight/2);var u=Math.round(t[1]+s)+"px";this.rendered.top_!=u&&(this.rendered.top_=i.top=u)}};t.prototype.getOptions=function(){return this.options};return t}(w);function ic(t,e,i,r){if(void 0===r)return[t,e,i];r[0]=t;r[1]=e;r[2]=i;return r}function rc(t,e,i){return t+"/"+e+"/"+i}function nc(t){return rc(t[0],t[1],t[2])}function oc(t){return t.split("/").map(Number)}function sc(t){return(t[1]<<t[0])+t[2]}function ac(t){var e,i,r=t[0],n=new Array(r),o=1<<r-1;for(e=0;e<r;++e){i=48;t[1]&o&&(i+=1);t[2]&o&&(i+=2);n[e]=String.fromCharCode(i);o>>=1}return n.join("")}function hc(t,e){var i=t[0],r=t[1],n=t[2];if(e.getMinZoom()>i||i>e.getMaxZoom())return!1;var o,s=e.getExtent();return!(o=s?e.getTileRangeForExtentAndZ(s,i):e.getFullTileRange(i))||o.containsXY(r,n)}var lc=function(e){function t(t){e.call(this,t)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.expireCache=function(t){for(;this.canExpireCache();){var e=this.peekLast(),i=e.tileCoord[0].toString();if(i in t&&t[i].contains(e.tileCoord))break;this.pop().dispose()}};t.prototype.pruneExceptNewestZ=function(){if(0!==this.getCount()){var e=oc(this.peekFirstKey())[0];this.forEach(function(t){if(t.tileCoord[0]!==e){this.remove(nc(t.tileCoord));t.dispose()}},this)}};return t}(Vi),uc=function(E){function T(t,e,i,s,a,r,h,l,n,u,c,p,d,f,o){E.call(this,t,e,{transition:0});this.context_={};this.loader_;this.replayState_={};this.sourceTiles_=u;this.tileKeys=[];this.extent=null;this.sourceRevision_=i;this.wrappedTileCoord=r;this.loadListenerKeys_=[];this.sourceTileListenerKeys_=[];if(r){var _=this.extent=n.getTileCoordExtent(r),g=n.getResolution(o),y=l.getZForResolution(g),v=o!=t[0],m=0;l.forEachTileCoord(_,y,function(t){var e=pt(_,l.getTileCoordExtent(t)),i=l.getExtent();i&&(e=pt(e,i,e));if(.5<=_t(e)/g&&.5<=ct(e)/g){++m;var r=t.toString(),n=u[r];if(!n&&!v){var o=h(t,c,p);n=u[r]=new d(t,null==o?yo.EMPTY:yo.IDLE,null==o?"":o,s,a);this.sourceTileListenerKeys_.push(S(n,R.CHANGE,f))}if(n&&(!v||n.getState()==yo.LOADED)){n.consumers++;this.tileKeys.push(r)}}}.bind(this));v&&m==this.tileKeys.length&&this.finishLoading_();if(o<=t[0]&&this.state!=yo.LOADED)for(;o>n.getMinZoom();){var x=new T(t,e,i,s,a,r,h,l,n,u,c,p,d,L,--o);if(x.state==yo.LOADED){this.interimTile=x;break}}}}E&&(T.__proto__=E);((T.prototype=Object.create(E&&E.prototype)).constructor=T).prototype.disposeInternal=function(){this.state=yo.ABORT;this.changed();this.interimTile&&this.interimTile.dispose();for(var t=0,e=this.tileKeys.length;t<e;++t){var i=this.tileKeys[t],r=this.getTile(i);r.consumers--;if(0==r.consumers){delete this.sourceTiles_[i];r.dispose()}}this.tileKeys.length=0;this.sourceTiles_=null;this.loadListenerKeys_.forEach(g);this.loadListenerKeys_.length=0;this.sourceTileListenerKeys_.forEach(g);this.sourceTileListenerKeys_.length=0;E.prototype.disposeInternal.call(this)};T.prototype.getContext=function(t){var e=St(t).toString();e in this.context_||(this.context_[e]=ii());return this.context_[e]};T.prototype.getImage=function(t){return-1==this.getReplayState(t).renderedTileRevision?null:this.getContext(t).canvas};T.prototype.getReplayState=function(t){var e=St(t).toString();e in this.replayState_||(this.replayState_[e]={dirty:!1,renderedRenderOrder:null,renderedRevision:-1,renderedTileRevision:-1});return this.replayState_[e]};T.prototype.getKey=function(){return this.tileKeys.join("/")+"-"+this.sourceRevision_};T.prototype.getTile=function(t){return this.sourceTiles_[t]};T.prototype.load=function(){var n=0,o={};this.state==yo.IDLE&&this.setState(yo.LOADING);this.state==yo.LOADING&&this.tileKeys.forEach(function(t){var r=this.getTile(t);if(r.state==yo.IDLE){r.setLoader(this.loader_);r.load()}if(r.state==yo.LOADING){var e=S(r,R.CHANGE,function(t){var e=r.getState();if(e==yo.LOADED||e==yo.ERROR){var i=St(r);if(e==yo.ERROR)o[i]=!0;else{--n;delete o[i]}n-Object.keys(o).length==0&&this.finishLoading_()}}.bind(this));this.loadListenerKeys_.push(e);++n}}.bind(this));n-Object.keys(o).length==0&&setTimeout(this.finishLoading_.bind(this),0)};T.prototype.finishLoading_=function(){for(var t=this.tileKeys.length,e=0,i=t-1;0<=i;--i){var r=this.getTile(this.tileKeys[i]).getState();r!=yo.LOADED&&--t;r==yo.EMPTY&&++e}if(t==this.tileKeys.length){this.loadListenerKeys_.forEach(g);this.loadListenerKeys_.length=0;this.setState(yo.LOADED)}else this.setState(e==this.tileKeys.length?yo.EMPTY:yo.ERROR)};return T}(To);function cc(t,e){var i=Fh(e,t.getFormat(),t.onLoad.bind(t),t.onError.bind(t));t.setLoader(i)}var pc,dc=[0,0,4096,4096],fc=function(s){function t(t,e,i,r,n,o){s.call(this,t,e,o);this.consumers=0;this.extent_=null;this.format_=r;this.features_=null;this.loader_;this.projection_=null;this.replayGroups_={};this.tileLoadFunction_=n;this.url_=i}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.disposeInternal=function(){this.features_=null;this.replayGroups_={};this.state=yo.ABORT;this.changed();s.prototype.disposeInternal.call(this)};t.prototype.getExtent=function(){return this.extent_||dc};t.prototype.getFormat=function(){return this.format_};t.prototype.getFeatures=function(){return this.features_};t.prototype.getKey=function(){return this.url_};t.prototype.getProjection=function(){return this.projection_};t.prototype.getReplayGroup=function(t,e){return this.replayGroups_[St(t)+","+e]};t.prototype.load=function(){if(this.state==yo.IDLE){this.setState(yo.LOADING);this.tileLoadFunction_(this,this.url_);this.loader_(null,NaN,null)}};t.prototype.onLoad=function(t,e,i){this.setProjection(e);this.setFeatures(t);this.setExtent(i)};t.prototype.onError=function(){this.setState(yo.ERROR)};t.prototype.setExtent=function(t){this.extent_=t};t.prototype.setFeatures=function(t){this.features_=t;this.setState(yo.LOADED)};t.prototype.setProjection=function(t){this.projection_=t};t.prototype.setReplayGroup=function(t,e,i){this.replayGroups_[St(t)+","+e]=i};t.prototype.setLoader=function(t){this.loader_=t};return t}(To),_c=function(){if(!pc){var t=document.body;t.webkitRequestFullscreen?pc="webkitfullscreenchange":t.mozRequestFullScreen?pc="mozfullscreenchange":t.msRequestFullscreen?pc="MSFullscreenChange":t.requestFullscreen&&(pc="fullscreenchange")}return pc},gc=function(h){function t(t){var e=t||{};h.call(this,{element:document.createElement("div"),target:e.target});this.cssClassName_=void 0!==e.className?e.className:"ol-full-screen";var i=void 0!==e.label?e.label:"⤢";this.labelNode_="string"==typeof i?document.createTextNode(i):i;var r=void 0!==e.labelActive?e.labelActive:"×";this.labelActiveNode_="string"==typeof r?document.createTextNode(r):r;var n=e.tipLabel?e.tipLabel:"Toggle full-screen",o=document.createElement("button");o.className=this.cssClassName_+"-"+vc();o.setAttribute("type","button");o.title=n;o.appendChild(this.labelNode_);S(o,R.CLICK,this.handleClick_,this);var s=this.cssClassName_+" "+ki+" "+Ui+" "+(yc()?"":ji),a=this.element;a.className=s;a.appendChild(o);this.keys_=void 0!==e.keys&&e.keys;this.source_=e.source}h&&(t.__proto__=h);((t.prototype=Object.create(h&&h.prototype)).constructor=t).prototype.handleClick_=function(t){t.preventDefault();this.handleFullScreen_()};t.prototype.handleFullScreen_=function(){if(yc()){var t=this.getMap();if(t){if(vc())document.exitFullscreen?document.exitFullscreen():document.msExitFullscreen?document.msExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen();else{var e;e=this.source_?"string"==typeof this.source_?document.getElementById(this.source_):this.source_:t.getTargetElement();this.keys_?(i=e).mozRequestFullScreenWithKeys?i.mozRequestFullScreenWithKeys():i.webkitRequestFullscreen?i.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT):mc(i):mc(e)}var i}}};t.prototype.handleFullScreenChange_=function(){var t=this.element.firstElementChild,e=this.getMap();if(vc()){t.className=this.cssClassName_+"-true";oi(this.labelActiveNode_,this.labelNode_)}else{t.className=this.cssClassName_+"-false";oi(this.labelNode_,this.labelActiveNode_)}e&&e.updateSize()};t.prototype.setMap=function(t){h.prototype.setMap.call(this,t);t&&this.listenerKeys.push(S(document,_c(),this.handleFullScreenChange_,this))};return t}(Zs);function yc(){var t=document.body;return!!(t.webkitRequestFullscreen||t.mozRequestFullScreen&&document.mozFullScreenEnabled||t.msRequestFullscreen&&document.msFullscreenEnabled||t.requestFullscreen&&document.fullscreenEnabled)}function vc(){return!!(document.webkitIsFullScreen||document.mozFullScreen||document.msFullscreenElement||document.fullscreenElement)}function mc(t){t.requestFullscreen?t.requestFullscreen():t.msRequestFullscreen?t.msRequestFullscreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.webkitRequestFullscreen&&t.webkitRequestFullscreen()}var xc=function(y){function t(t){var e=t||{};y.call(this,{element:document.createElement("div"),render:e.render||Ec,target:e.target});this.collapsed_=void 0===e.collapsed||e.collapsed;this.collapsible_=void 0===e.collapsible||e.collapsible;this.collapsible_||(this.collapsed_=!1);var i=void 0!==e.className?e.className:"ol-overviewmap",r=void 0!==e.tipLabel?e.tipLabel:"Overview map",n=void 0!==e.collapseLabel?e.collapseLabel:"«";if("string"==typeof n){this.collapseLabel_=document.createElement("span");this.collapseLabel_.textContent=n}else this.collapseLabel_=n;var o=void 0!==e.label?e.label:"»";if("string"==typeof o){this.label_=document.createElement("span");this.label_.textContent=o}else this.label_=o;var s=this.collapsible_&&!this.collapsed_?this.collapseLabel_:this.label_,a=document.createElement("button");a.setAttribute("type","button");a.title=r;a.appendChild(s);S(a,R.CLICK,this.handleClick_,this);this.ovmapDiv_=document.createElement("div");this.ovmapDiv_.className="ol-overviewmap-map";this.ovmap_=new Ku({controls:new F,interactions:new F,view:e.view});var h=this.ovmap_;e.layers&&e.layers.forEach(function(t){h.addLayer(t)}.bind(this));var l=document.createElement("div");l.className="ol-overviewmap-box";l.style.boxSizing="border-box";this.boxOverlay_=new ec({position:[0,0],positioning:Zu.BOTTOM_LEFT,element:l});this.ovmap_.addOverlay(this.boxOverlay_);var u=i+" "+ki+" "+Ui+(this.collapsed_&&this.collapsible_?" "+Yi:"")+(this.collapsible_?"":" ol-uncollapsible"),c=this.element;c.className=u;c.appendChild(this.ovmapDiv_);c.appendChild(a);var p=this,d=this.boxOverlay_,f=this.boxOverlay_.getElement(),_=function(t){var e,i=h.getEventCoordinate({clientX:(e=t).clientX-f.offsetWidth/2,clientY:e.clientY+f.offsetHeight/2});d.setPosition(i)},g=function(t){var e=h.getEventCoordinate(t);p.getMap().getView().setCenter(e);window.removeEventListener("mousemove",_);window.removeEventListener("mouseup",g)};f.addEventListener("mousedown",function(){window.addEventListener("mousemove",_);window.addEventListener("mouseup",g)})}y&&(t.__proto__=y);((t.prototype=Object.create(y&&y.prototype)).constructor=t).prototype.setMap=function(t){var e=this.getMap();if(t!==e){if(e){var i=e.getView();i&&this.unbindView_(i);this.ovmap_.setTarget(null)}y.prototype.setMap.call(this,t);if(t){this.ovmap_.setTarget(this.ovmapDiv_);this.listenerKeys.push(S(t,h.PROPERTYCHANGE,this.handleMapPropertyChange_,this));0===this.ovmap_.getLayers().getLength()&&this.ovmap_.setLayerGroup(t.getLayerGroup());var r=t.getView();if(r){this.bindView_(r);if(r.isDef()){this.ovmap_.updateSize();this.resetExtent_()}}}}};t.prototype.handleMapPropertyChange_=function(t){if(t.key===vs.VIEW){var e=t.oldValue;e&&this.unbindView_(e);var i=this.getMap().getView();this.bindView_(i)}};t.prototype.bindView_=function(t){S(t,P(Ms.ROTATION),this.handleRotationChanged_,this)};t.prototype.unbindView_=function(t){f(t,P(Ms.ROTATION),this.handleRotationChanged_,this)};t.prototype.handleRotationChanged_=function(){this.ovmap_.getView().setRotation(this.getMap().getView().getRotation())};t.prototype.validateExtent_=function(){var t=this.getMap(),e=this.ovmap_;if(t.isRendered()&&e.isRendered()){var i=t.getSize(),r=t.getView().calculateExtent(i),n=e.getSize(),o=e.getView().calculateExtent(n),s=e.getPixelFromCoordinate(dt(r)),a=e.getPixelFromCoordinate(at(r)),h=Math.abs(s[0]-a[0]),l=Math.abs(s[1]-a[1]),u=n[0],c=n[1];h<.1*u||l<.1*c||.75*u<h||.75*c<l?this.resetExtent_():Q(o,r)||this.recenter_()}};t.prototype.resetExtent_=function(){var t=this.getMap(),e=this.ovmap_,i=t.getSize(),r=t.getView().calculateExtent(i),n=e.getView(),o=Math.log(7.5)/Math.LN2;vt(r,1/(.1*Math.pow(2,o/2)));n.fit(r)};t.prototype.recenter_=function(){var t=this.getMap(),e=this.ovmap_,i=t.getView();e.getView().setCenter(i.getCenter())};t.prototype.updateBox_=function(){var t=this.getMap(),e=this.ovmap_;if(t.isRendered()&&e.isRendered()){var i=t.getSize(),r=t.getView(),n=e.getView(),o=r.getRotation(),s=this.boxOverlay_,a=this.boxOverlay_.getElement(),h=r.calculateExtent(i),l=n.getResolution(),u=st(h),c=ft(h),p=this.calculateCoordinateRotate_(o,u);s.setPosition(p);if(a){a.style.width=Math.abs((u[0]-c[0])/l)+"px";a.style.height=Math.abs((c[1]-u[1])/l)+"px"}}};t.prototype.calculateCoordinateRotate_=function(t,e){var i,r=this.getMap().getView().getCenter();if(r){Hn(i=[e[0]-r[0],e[1]-r[1]],t);Yn(i,r)}return i};t.prototype.handleClick_=function(t){t.preventDefault();this.handleToggle_()};t.prototype.handleToggle_=function(){this.element.classList.toggle(Yi);this.collapsed_?oi(this.collapseLabel_,this.label_):oi(this.label_,this.collapseLabel_);this.collapsed_=!this.collapsed_;var t=this.ovmap_;if(!this.collapsed_&&!t.isRendered()){t.updateSize();this.resetExtent_();d(t,ys.POSTRENDER,function(t){this.updateBox_()},this)}};t.prototype.getCollapsible=function(){return this.collapsible_};t.prototype.setCollapsible=function(t){if(this.collapsible_!==t){this.collapsible_=t;this.element.classList.toggle("ol-uncollapsible");!t&&this.collapsed_&&this.handleToggle_()}};t.prototype.setCollapsed=function(t){this.collapsible_&&this.collapsed_!==t&&this.handleToggle_()};t.prototype.getCollapsed=function(){return this.collapsed_};t.prototype.getOverviewMap=function(){return this.ovmap_};return t}(Zs);function Ec(t){this.validateExtent_();this.updateBox_()}var Tc="units",Sc={DEGREES:"degrees",IMPERIAL:"imperial",NAUTICAL:"nautical",METRIC:"metric",US:"us"},Cc=[1,2,5],Rc=function(r){function t(t){var e=t||{},i=void 0!==e.className?e.className:"ol-scale-line";r.call(this,{element:document.createElement("div"),render:e.render||Ic,target:e.target});this.innerElement_=document.createElement("div");this.innerElement_.className=i+"-inner";this.element.className=i+" "+ki;this.element.appendChild(this.innerElement_);this.viewState_=null;this.minWidth_=void 0!==e.minWidth?e.minWidth:64;this.renderedVisible_=!1;this.renderedWidth_=void 0;this.renderedHTML_="";S(this,P(Tc),this.handleUnitsChanged_,this);this.setUnits(e.units||Sc.METRIC)}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.getUnits=function(){return this.get(Tc)};t.prototype.handleUnitsChanged_=function(){this.updateElement_()};t.prototype.setUnits=function(t){this.set(Tc,t)};t.prototype.updateElement_=function(){var t=this.viewState_;if(t){var e=t.center,i=t.projection,r=this.getUnits(),n=r==Sc.DEGREES?Xt.DEGREES:Xt.METERS,o=ve(i,t.resolution,e,n);i.getUnits()!=Xt.DEGREES&&i.getMetersPerUnit()&&n==Xt.METERS&&(o*=i.getMetersPerUnit());var s=this.minWidth_*o,a="";if(r==Sc.DEGREES){var h=zt[Xt.DEGREES];i.getUnits()==Xt.DEGREES?s*=h:o/=h;if(s<h/60){a="″";o*=3600}else if(s<h){a="′";o*=60}else a="°"}else if(r==Sc.IMPERIAL)if(s<.9144){a="in";o/=.0254}else if(s<1609.344){a="ft";o/=.3048}else{a="mi";o/=1609.344}else if(r==Sc.NAUTICAL){o/=1852;a="nm"}else if(r==Sc.METRIC)if(s<.001){a="μm";o*=1e6}else if(s<1){a="mm";o*=1e3}else if(s<1e3)a="m";else{a="km";o/=1e3}else if(r==Sc.US)if(s<.9144){a="in";o*=39.37}else if(s<1609.344){a="ft";o/=.30480061}else{a="mi";o/=1609.3472}else A(!1,33);for(var l,u,c=3*Math.floor(Math.log(this.minWidth_*o)/Math.log(10));;){l=Cc[(c%3+3)%3]*Math.pow(10,Math.floor(c/3));u=Math.round(l/o);if(isNaN(u)){this.element.style.display="none";this.renderedVisible_=!1;return}if(u>=this.minWidth_)break;++c}var p=l+" "+a;if(this.renderedHTML_!=p){this.innerElement_.innerHTML=p;this.renderedHTML_=p}if(this.renderedWidth_!=u){this.innerElement_.style.width=u+"px";this.renderedWidth_=u}if(!this.renderedVisible_){this.element.style.display="";this.renderedVisible_=!0}}else if(this.renderedVisible_){this.element.style.display="none";this.renderedVisible_=!1}};return t}(Zs);function Ic(t){var e=t.frameState;this.viewState_=e?e.viewState:null;this.updateElement_()}var wc=0,Lc=1,Oc=function(o){function t(t){var e=t||{};o.call(this,{element:document.createElement("div"),render:e.render||Pc});this.currentResolution_=void 0;this.direction_=wc;this.dragging_;this.heightLimit_=0;this.widthLimit_=0;this.previousX_;this.previousY_;this.thumbSize_=null;this.sliderInitialized_=!1;this.duration_=void 0!==e.duration?e.duration:200;var i=void 0!==e.className?e.className:"ol-zoomslider",r=document.createElement("button");r.setAttribute("type","button");r.className=i+"-thumb "+ki;var n=this.element;n.className=i+" "+ki+" "+Ui;n.appendChild(r);this.dragger_=new _s(n);S(this.dragger_,bo.POINTERDOWN,this.handleDraggerStart_,this);S(this.dragger_,bo.POINTERMOVE,this.handleDraggerDrag_,this);S(this.dragger_,bo.POINTERUP,this.handleDraggerEnd_,this);S(n,R.CLICK,this.handleContainerClick_,this);S(r,R.CLICK,E)}o&&(t.__proto__=o);((t.prototype=Object.create(o&&o.prototype)).constructor=t).prototype.disposeInternal=function(){this.dragger_.dispose();o.prototype.disposeInternal.call(this)};t.prototype.setMap=function(t){o.prototype.setMap.call(this,t);t&&t.render()};t.prototype.initSlider_=function(){var t=this.element,e=t.offsetWidth,i=t.offsetHeight,r=t.firstElementChild,n=getComputedStyle(r),o=r.offsetWidth+parseFloat(n.marginRight)+parseFloat(n.marginLeft),s=r.offsetHeight+parseFloat(n.marginTop)+parseFloat(n.marginBottom);this.thumbSize_=[o,s];if(i<e){this.direction_=Lc;this.widthLimit_=e-o}else{this.direction_=wc;this.heightLimit_=i-s}this.sliderInitialized_=!0};t.prototype.handleContainerClick_=function(t){var e=this.getMap().getView(),i=this.getRelativePosition_(t.offsetX-this.thumbSize_[0]/2,t.offsetY-this.thumbSize_[1]/2),r=this.getResolutionForPosition_(i);e.animate({resolution:e.constrainResolution(r),duration:this.duration_,easing:mo})};t.prototype.handleDraggerStart_=function(t){if(!this.dragging_&&t.originalEvent.target===this.element.firstElementChild){this.getMap().getView().setHint(bs.INTERACTING,1);this.previousX_=t.clientX;this.previousY_=t.clientY;this.dragging_=!0}};t.prototype.handleDraggerDrag_=function(t){if(this.dragging_){var e=this.element.firstElementChild,i=t.clientX-this.previousX_+parseInt(e.style.left,10),r=t.clientY-this.previousY_+parseInt(e.style.top,10),n=this.getRelativePosition_(i,r);this.currentResolution_=this.getResolutionForPosition_(n);this.getMap().getView().setResolution(this.currentResolution_);this.setThumbPosition_(this.currentResolution_);this.previousX_=t.clientX;this.previousY_=t.clientY}};t.prototype.handleDraggerEnd_=function(t){if(this.dragging_){var e=this.getMap().getView();e.setHint(bs.INTERACTING,-1);e.animate({resolution:e.constrainResolution(this.currentResolution_),duration:this.duration_,easing:mo});this.dragging_=!1;this.previousX_=void 0;this.previousY_=void 0}};t.prototype.setThumbPosition_=function(t){var e=this.getPositionForResolution_(t),i=this.element.firstElementChild;this.direction_==Lc?i.style.left=this.widthLimit_*e+"px":i.style.top=this.heightLimit_*e+"px"};t.prototype.getRelativePosition_=function(t,e){return Lt(this.direction_===Lc?t/this.widthLimit_:e/this.heightLimit_,0,1)};t.prototype.getResolutionForPosition_=function(t){return this.getMap().getView().getResolutionForValueFunction()(1-t)};t.prototype.getPositionForResolution_=function(t){return 1-this.getMap().getView().getValueForResolutionFunction()(t)};return t}(Zs);function Pc(t){if(t.frameState){this.sliderInitialized_||this.initSlider_();var e=t.frameState.viewState.resolution;if(e!==this.currentResolution_){this.currentResolution_=e;this.setThumbPosition_(e)}}}var bc=function(h){function t(t){var e=t||{};h.call(this,{element:document.createElement("div"),target:e.target});this.extent=e.extent?e.extent:null;var i=void 0!==e.className?e.className:"ol-zoom-extent",r=void 0!==e.label?e.label:"E",n=void 0!==e.tipLabel?e.tipLabel:"Fit to extent",o=document.createElement("button");o.setAttribute("type","button");o.title=n;o.appendChild("string"==typeof r?document.createTextNode(r):r);S(o,R.CLICK,this.handleClick_,this);var s=i+" "+ki+" "+Ui,a=this.element;a.className=s;a.appendChild(o)}h&&(t.__proto__=h);((t.prototype=Object.create(h&&h.prototype)).constructor=t).prototype.handleClick_=function(t){t.preventDefault();this.handleZoomToExtent()};t.prototype.handleZoomToExtent=function(){var t=this.getMap().getView(),e=this.extent?this.extent:t.getProjection().getExtent();t.fit(e)};return t}(Zs),Mc=function(t){this.source_=t};Mc.prototype.getType=function(){};Mc.prototype.getSource=function(){return this.source_};Mc.prototype.isAnimated=m;var Fc=function(e){function t(t){e.call(this,t)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getType=function(){return 35632};return t}(Mc),Ac=function(e){function t(t){e.call(this,t)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getType=function(){return 35633};return t}(Mc),Nc=new Fc("precision mediump float;\nvarying vec2 v_center;\nvarying vec2 v_offset;\nvarying float v_halfWidth;\nvarying float v_pixelRatio;\n\n\n\nuniform float u_opacity;\nuniform vec4 u_fillColor;\nuniform vec4 u_strokeColor;\nuniform vec2 u_size;\n\nvoid main(void) {\n  vec2 windowCenter = vec2((v_center.x + 1.0) / 2.0 * u_size.x * v_pixelRatio,\n      (v_center.y + 1.0) / 2.0 * u_size.y * v_pixelRatio);\n  vec2 windowOffset = vec2((v_offset.x + 1.0) / 2.0 * u_size.x * v_pixelRatio,\n      (v_offset.y + 1.0) / 2.0 * u_size.y * v_pixelRatio);\n  float radius = length(windowCenter - windowOffset);\n  float dist = length(windowCenter - gl_FragCoord.xy);\n  if (dist > radius + v_halfWidth) {\n    if (u_strokeColor.a == 0.0) {\n      gl_FragColor = u_fillColor;\n    } else {\n      gl_FragColor = u_strokeColor;\n    }\n    gl_FragColor.a = gl_FragColor.a - (dist - (radius + v_halfWidth));\n  } else if (u_fillColor.a == 0.0) {\n    // Hooray, no fill, just stroke. We can use real antialiasing.\n    gl_FragColor = u_strokeColor;\n    if (dist < radius - v_halfWidth) {\n      gl_FragColor.a = gl_FragColor.a - (radius - v_halfWidth - dist);\n    }\n  } else {\n    gl_FragColor = u_fillColor;\n    float strokeDist = radius - v_halfWidth;\n    float antialias = 2.0 * v_pixelRatio;\n    if (dist > strokeDist) {\n      gl_FragColor = u_strokeColor;\n    } else if (dist >= strokeDist - antialias) {\n      float step = smoothstep(strokeDist - antialias, strokeDist, dist);\n      gl_FragColor = mix(u_fillColor, u_strokeColor, step);\n    }\n  }\n  gl_FragColor.a = gl_FragColor.a * u_opacity;\n  if (gl_FragColor.a <= 0.0) {\n    discard;\n  }\n}\n"),Dc=new Ac("varying vec2 v_center;\nvarying vec2 v_offset;\nvarying float v_halfWidth;\nvarying float v_pixelRatio;\n\n\nattribute vec2 a_position;\nattribute float a_instruction;\nattribute float a_radius;\n\nuniform mat4 u_projectionMatrix;\nuniform mat4 u_offsetScaleMatrix;\nuniform mat4 u_offsetRotateMatrix;\nuniform float u_lineWidth;\nuniform float u_pixelRatio;\n\nvoid main(void) {\n  mat4 offsetMatrix = u_offsetScaleMatrix * u_offsetRotateMatrix;\n  v_center = vec4(u_projectionMatrix * vec4(a_position, 0.0, 1.0)).xy;\n  v_pixelRatio = u_pixelRatio;\n  float lineWidth = u_lineWidth * u_pixelRatio;\n  v_halfWidth = lineWidth / 2.0;\n  if (lineWidth == 0.0) {\n    lineWidth = 2.0 * u_pixelRatio;\n  }\n  vec2 offset;\n  // Radius with anitaliasing (roughly).\n  float radius = a_radius + 3.0 * u_pixelRatio;\n  // Until we get gl_VertexID in WebGL, we store an instruction.\n  if (a_instruction == 0.0) {\n    // Offsetting the edges of the triangle by lineWidth / 2 is necessary, however\n    // we should also leave some space for the antialiasing, thus we offset by lineWidth.\n    offset = vec2(-1.0, 1.0);\n  } else if (a_instruction == 1.0) {\n    offset = vec2(-1.0, -1.0);\n  } else if (a_instruction == 2.0) {\n    offset = vec2(1.0, -1.0);\n  } else {\n    offset = vec2(1.0, 1.0);\n  }\n\n  gl_Position = u_projectionMatrix * vec4(a_position + offset * radius, 0.0, 1.0) +\n      offsetMatrix * vec4(offset * lineWidth, 0.0, 0.0);\n  v_offset = vec4(u_projectionMatrix * vec4(a_position.x + a_radius, a_position.y,\n      0.0, 1.0)).xy;\n\n  if (distance(v_center, v_offset) > 20000.0) {\n    gl_Position = vec4(v_center, 0.0, 1.0);\n  }\n}\n\n\n"),Gc=function(t,e){this.u_projectionMatrix=t.getUniformLocation(e,"u_projectionMatrix");this.u_offsetScaleMatrix=t.getUniformLocation(e,"u_offsetScaleMatrix");this.u_offsetRotateMatrix=t.getUniformLocation(e,"u_offsetRotateMatrix");this.u_lineWidth=t.getUniformLocation(e,"u_lineWidth");this.u_pixelRatio=t.getUniformLocation(e,"u_pixelRatio");this.u_opacity=t.getUniformLocation(e,"u_opacity");this.u_fillColor=t.getUniformLocation(e,"u_fillColor");this.u_strokeColor=t.getUniformLocation(e,"u_strokeColor");this.u_size=t.getUniformLocation(e,"u_size");this.a_position=t.getAttribLocation(e,"a_position");this.a_instruction=t.getAttribLocation(e,"a_instruction");this.a_radius=t.getAttribLocation(e,"a_radius")};function kc(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}function jc(t,e){t[0]=e[0];t[1]=e[1];t[4]=e[2];t[5]=e[3];t[12]=e[4];t[13]=e[5];return t}var Uc=function(i){function t(t,e){i.call(this);this.tolerance=t;this.maxExtent=e;this.origin=ht(e);this.projectionMatrix_=[1,0,0,1,0,0];this.offsetRotateMatrix_=[1,0,0,1,0,0];this.offsetScaleMatrix_=[1,0,0,1,0,0];this.tmpMat4_=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];this.indices=[];this.indicesBuffer=null;this.startIndices=[];this.startIndicesFeature=[];this.vertices=[];this.verticesBuffer=null;this.lineStringReplay=void 0}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getDeleteResourcesFunction=function(t){};t.prototype.finish=function(t){};t.prototype.setUpProgram=function(t,e,i,r){};t.prototype.shutDownProgram=function(t,e){};t.prototype.drawReplay=function(t,e,i,r){};t.prototype.drawHitDetectionReplayOneByOne=function(t,e,i,r,n){};t.prototype.drawHitDetectionReplay=function(t,e,i,r,n,o){return n?this.drawHitDetectionReplayOneByOne(t,e,i,r,o):this.drawHitDetectionReplayAll(t,e,i,r)};t.prototype.drawHitDetectionReplayAll=function(t,e,i,r){t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);this.drawReplay(t,e,i,!0);var n=r(null);return n||void 0};t.prototype.replay=function(t,e,i,r,n,o,s,a,h,l,u){var c,p,d,f,_,g,y,v,m=t.getGL();if(this.lineStringReplay){c=m.isEnabled(m.STENCIL_TEST);p=m.getParameter(m.STENCIL_FUNC);d=m.getParameter(m.STENCIL_VALUE_MASK);f=m.getParameter(m.STENCIL_REF);_=m.getParameter(m.STENCIL_WRITEMASK);g=m.getParameter(m.STENCIL_FAIL);y=m.getParameter(m.STENCIL_PASS_DEPTH_PASS);v=m.getParameter(m.STENCIL_PASS_DEPTH_FAIL);m.enable(m.STENCIL_TEST);m.clear(m.STENCIL_BUFFER_BIT);m.stencilMask(255);m.stencilFunc(m.ALWAYS,1,255);m.stencilOp(m.KEEP,m.KEEP,m.REPLACE);this.lineStringReplay.replay(t,e,i,r,n,o,s,a,h,l,u);m.stencilMask(0);m.stencilFunc(m.NOTEQUAL,1,255)}t.bindBuffer(hi,this.verticesBuffer);t.bindBuffer(34963,this.indicesBuffer);var x=this.setUpProgram(m,t,n,o),E=Me(this.projectionMatrix_);ke(E,2/(i*n[0]),2/(i*n[1]));Ge(E,-r);je(E,-(e[0]-this.origin[0]),-(e[1]-this.origin[1]));var T=Me(this.offsetScaleMatrix_);ke(T,2/n[0],2/n[1]);var S,C=Me(this.offsetRotateMatrix_);0!==r&&Ge(C,-r);m.uniformMatrix4fv(x.u_projectionMatrix,!1,jc(this.tmpMat4_,E));m.uniformMatrix4fv(x.u_offsetScaleMatrix,!1,jc(this.tmpMat4_,T));m.uniformMatrix4fv(x.u_offsetRotateMatrix,!1,jc(this.tmpMat4_,C));m.uniform1f(x.u_opacity,s);void 0===h?this.drawReplay(m,t,a,!1):S=this.drawHitDetectionReplay(m,t,a,h,l,u);this.shutDownProgram(m,x);if(this.lineStringReplay){c||m.disable(m.STENCIL_TEST);m.clear(m.STENCIL_BUFFER_BIT);m.stencilFunc(p,f,d);m.stencilMask(_);m.stencilOp(g,v,y)}return S};t.prototype.drawElements=function(t,e,i,r){var n=e.hasOESElementIndexUint?5125:5123,o=r-i,s=i*(e.hasOESElementIndexUint?4:2);t.drawElements(4,o,n,s)};return t}(Zl),Yc="10px sans-serif",Bc=[0,0,0,1],Vc="round",Xc=[],zc="round",Wc=[0,0,0,1],Hc=Number.EPSILON||2220446049250313e-31,Kc=function(t,e,i,r,n,o){var s=(i-t)*(o-e)-(n-t)*(r-e);return s<=Hc&&-Hc<=s?void 0:0<s},Zc=35044,qc=function(t,e){this.arr_=void 0!==t?t:[];this.usage_=void 0!==e?e:Zc};qc.prototype.getArray=function(){return this.arr_};qc.prototype.getUsage=function(){return this.usage_};var Jc=function(i){function t(t,e){i.call(this,t,e);this.defaultLocations_=null;this.styles_=[];this.styleIndices_=[];this.radius_=0;this.state_={fillColor:null,strokeColor:null,lineDash:null,lineDashOffset:void 0,lineWidth:void 0,changed:!1}}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.drawCoordinates_=function(t,e,i,r){var n,o,s=this,a=this.vertices.length,h=this.indices.length,l=a/4;for(n=e,o=i;n<o;n+=r){s.vertices[a++]=t[n];s.vertices[a++]=t[n+1];s.vertices[a++]=0;s.vertices[a++]=s.radius_;s.vertices[a++]=t[n];s.vertices[a++]=t[n+1];s.vertices[a++]=1;s.vertices[a++]=s.radius_;s.vertices[a++]=t[n];s.vertices[a++]=t[n+1];s.vertices[a++]=2;s.vertices[a++]=s.radius_;s.vertices[a++]=t[n];s.vertices[a++]=t[n+1];s.vertices[a++]=3;s.vertices[a++]=s.radius_;s.indices[h++]=l;s.indices[h++]=l+1;s.indices[h++]=l+2;s.indices[h++]=l+2;s.indices[h++]=l+3;s.indices[h++]=l;l+=4}};t.prototype.drawCircle=function(t,e){var i=t.getRadius(),r=t.getStride();if(i){this.startIndices.push(this.indices.length);this.startIndicesFeature.push(e);if(this.state_.changed){this.styleIndices_.push(this.indices.length);this.state_.changed=!1}this.radius_=i;var n=t.getFlatCoordinates();n=wt(n,0,2,r,-this.origin[0],-this.origin[1]);this.drawCoordinates_(n,0,2,r)}else if(this.state_.changed){this.styles_.pop();if(this.styles_.length){var o=this.styles_[this.styles_.length-1];this.state_.fillColor=o[0];this.state_.strokeColor=o[1];this.state_.lineWidth=o[2];this.state_.changed=!1}}};t.prototype.finish=function(t){this.verticesBuffer=new qc(this.vertices);this.indicesBuffer=new qc(this.indices);this.startIndices.push(this.indices.length);0===this.styleIndices_.length&&0<this.styles_.length&&(this.styles_=[]);this.vertices=null;this.indices=null};t.prototype.getDeleteResourcesFunction=function(t){var e=this.verticesBuffer,i=this.indicesBuffer;return function(){t.deleteBuffer(e);t.deleteBuffer(i)}};t.prototype.setUpProgram=function(t,e,i,r){var n,o=e.getProgram(Nc,Dc);if(this.defaultLocations_)n=this.defaultLocations_;else{n=new Gc(t,o);this.defaultLocations_=n}e.useProgram(o);t.enableVertexAttribArray(n.a_position);t.vertexAttribPointer(n.a_position,2,li,!1,16,0);t.enableVertexAttribArray(n.a_instruction);t.vertexAttribPointer(n.a_instruction,1,li,!1,16,8);t.enableVertexAttribArray(n.a_radius);t.vertexAttribPointer(n.a_radius,1,li,!1,16,12);t.uniform2fv(n.u_size,i);t.uniform1f(n.u_pixelRatio,r);return n};t.prototype.shutDownProgram=function(t,e){t.disableVertexAttribArray(e.a_position);t.disableVertexAttribArray(e.a_instruction);t.disableVertexAttribArray(e.a_radius)};t.prototype.drawReplay=function(t,e,i,r){if(Ct(i)){var n,o,s,a;s=this.startIndices[this.startIndices.length-1];for(n=this.styleIndices_.length-1;0<=n;--n){o=this.styleIndices_[n];a=this.styles_[n];this.setFillStyle_(t,a[0]);this.setStrokeStyle_(t,a[1],a[2]);this.drawElements(t,e,o,s);s=o}}else this.drawReplaySkipping_(t,e,i)};t.prototype.drawHitDetectionReplayOneByOne=function(t,e,i,r,n){var o,s,a,h,l,u,c;c=this.startIndices.length-2;a=this.startIndices[c+1];for(o=this.styleIndices_.length-1;0<=o;--o){h=this.styles_[o];this.setFillStyle_(t,h[0]);this.setStrokeStyle_(t,h[1],h[2]);l=this.styleIndices_[o];for(;0<=c&&this.startIndices[c]>=l;){s=this.startIndices[c];if(void 0===i[St(u=this.startIndicesFeature[c]).toString()]&&u.getGeometry()&&(void 0===n||Rt(n,u.getGeometry().getExtent()))){t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);this.drawElements(t,e,s,a);var p=r(u);if(p)return p}c--;a=s}}};t.prototype.drawReplaySkipping_=function(t,e,i){var r,n,o,s,a,h,l;h=this.startIndices.length-2;o=n=this.startIndices[h+1];for(r=this.styleIndices_.length-1;0<=r;--r){s=this.styles_[r];this.setFillStyle_(t,s[0]);this.setStrokeStyle_(t,s[1],s[2]);a=this.styleIndices_[r];for(;0<=h&&this.startIndices[h]>=a;){l=this.startIndices[h];if(i[St(this.startIndicesFeature[h]).toString()]){n!==o&&this.drawElements(t,e,n,o);o=l}h--;n=l}n!==o&&this.drawElements(t,e,n,o);n=o=a}};t.prototype.setFillStyle_=function(t,e){t.uniform4fv(this.defaultLocations_.u_fillColor,e)};t.prototype.setStrokeStyle_=function(t,e,i){t.uniform4fv(this.defaultLocations_.u_strokeColor,e);t.uniform1f(this.defaultLocations_.u_lineWidth,i)};t.prototype.setFillStrokeStyle=function(t,e){var i,r;if(e){var n=e.getLineDash();this.state_.lineDash=n||Xc;var o=e.getLineDashOffset();this.state_.lineDashOffset=o||0;i=(i=e.getColor())instanceof CanvasGradient||i instanceof CanvasPattern?Wc:Je(i).map(function(t,e){return 3!=e?t/255:t})||Wc;r=void 0!==(r=e.getWidth())?r:1}else{i=[0,0,0,0];r=0}var s=t?t.getColor():[0,0,0,0];s=s instanceof CanvasGradient||s instanceof CanvasPattern?Bc:Je(s).map(function(t,e){return 3!=e?t/255:t})||Bc;if(!(this.state_.strokeColor&&Ar(this.state_.strokeColor,i)&&this.state_.fillColor&&Ar(this.state_.fillColor,s)&&this.state_.lineWidth===r)){this.state_.changed=!0;this.state_.fillColor=s;this.state_.strokeColor=i;this.state_.lineWidth=r;this.styles_.push([s,i,r])}};return t}(Uc),Qc=new Fc("precision mediump float;\nvarying vec2 v_texCoord;\nvarying float v_opacity;\n\nuniform float u_opacity;\nuniform sampler2D u_image;\n\nvoid main(void) {\n  vec4 texColor = texture2D(u_image, v_texCoord);\n  gl_FragColor.rgb = texColor.rgb;\n  float alpha = texColor.a * v_opacity * u_opacity;\n  if (alpha == 0.0) {\n    discard;\n  }\n  gl_FragColor.a = alpha;\n}\n"),$c=new Ac("varying vec2 v_texCoord;\nvarying float v_opacity;\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nattribute vec2 a_offsets;\nattribute float a_opacity;\nattribute float a_rotateWithView;\n\nuniform mat4 u_projectionMatrix;\nuniform mat4 u_offsetScaleMatrix;\nuniform mat4 u_offsetRotateMatrix;\n\nvoid main(void) {\n  mat4 offsetMatrix = u_offsetScaleMatrix;\n  if (a_rotateWithView == 1.0) {\n    offsetMatrix = u_offsetScaleMatrix * u_offsetRotateMatrix;\n  }\n  vec4 offsets = offsetMatrix * vec4(a_offsets, 0.0, 0.0);\n  gl_Position = u_projectionMatrix * vec4(a_position, 0.0, 1.0) + offsets;\n  v_texCoord = a_texCoord;\n  v_opacity = a_opacity;\n}\n\n\n"),tp=function(t,e){this.u_projectionMatrix=t.getUniformLocation(e,"u_projectionMatrix");this.u_offsetScaleMatrix=t.getUniformLocation(e,"u_offsetScaleMatrix");this.u_offsetRotateMatrix=t.getUniformLocation(e,"u_offsetRotateMatrix");this.u_opacity=t.getUniformLocation(e,"u_opacity");this.u_image=t.getUniformLocation(e,"u_image");this.a_position=t.getAttribLocation(e,"a_position");this.a_texCoord=t.getAttribLocation(e,"a_texCoord");this.a_offsets=t.getAttribLocation(e,"a_offsets");this.a_opacity=t.getAttribLocation(e,"a_opacity");this.a_rotateWithView=t.getAttribLocation(e,"a_rotateWithView")},ep={LOST:"webglcontextlost",RESTORED:"webglcontextrestored"},ip=function(i){function t(t,e){i.call(this);this.canvas_=t;this.gl_=e;this.bufferCache_={};this.shaderCache_={};this.programCache_={};this.currentProgram_=null;this.hitDetectionFramebuffer_=null;this.hitDetectionTexture_=null;this.hitDetectionRenderbuffer_=null;this.hasOESElementIndexUint=Lr(xi,"OES_element_index_uint");this.hasOESElementIndexUint&&e.getExtension("OES_element_index_uint");S(this.canvas_,ep.LOST,this.handleWebGLContextLost,this);S(this.canvas_,ep.RESTORED,this.handleWebGLContextRestored,this)}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.bindBuffer=function(t,e){var i=this.getGL(),r=e.getArray(),n=String(St(e));if(n in this.bufferCache_){var o=this.bufferCache_[n];i.bindBuffer(t,o.buffer)}else{var s,a=i.createBuffer();i.bindBuffer(t,a);t==hi?s=new Float32Array(r):34963==t&&(s=this.hasOESElementIndexUint?new Uint32Array(r):new Uint16Array(r));i.bufferData(t,s,e.getUsage());this.bufferCache_[n]={buf:e,buffer:a}}};t.prototype.deleteBuffer=function(t){var e=this.getGL(),i=String(St(t)),r=this.bufferCache_[i];e.isContextLost()||e.deleteBuffer(r.buffer);delete this.bufferCache_[i]};t.prototype.disposeInternal=function(){y(this.canvas_);var t=this.getGL();if(!t.isContextLost()){for(var e in this.bufferCache_)t.deleteBuffer(this.bufferCache_[e].buffer);for(var i in this.programCache_)t.deleteProgram(this.programCache_[i]);for(var r in this.shaderCache_)t.deleteShader(this.shaderCache_[r]);t.deleteFramebuffer(this.hitDetectionFramebuffer_);t.deleteRenderbuffer(this.hitDetectionRenderbuffer_);t.deleteTexture(this.hitDetectionTexture_)}};t.prototype.getCanvas=function(){return this.canvas_};t.prototype.getGL=function(){return this.gl_};t.prototype.getHitDetectionFramebuffer=function(){this.hitDetectionFramebuffer_||this.initHitDetectionFramebuffer_();return this.hitDetectionFramebuffer_};t.prototype.getShader=function(t){var e=String(St(t));if(e in this.shaderCache_)return this.shaderCache_[e];var i=this.getGL(),r=i.createShader(t.getType());i.shaderSource(r,t.getSource());i.compileShader(r);return this.shaderCache_[e]=r};t.prototype.getProgram=function(t,e){var i=St(t)+"/"+St(e);if(i in this.programCache_)return this.programCache_[i];var r=this.getGL(),n=r.createProgram();r.attachShader(n,this.getShader(t));r.attachShader(n,this.getShader(e));r.linkProgram(n);return this.programCache_[i]=n};t.prototype.handleWebGLContextLost=function(){_(this.bufferCache_);_(this.shaderCache_);_(this.programCache_);this.currentProgram_=null;this.hitDetectionFramebuffer_=null;this.hitDetectionTexture_=null;this.hitDetectionRenderbuffer_=null};t.prototype.handleWebGLContextRestored=function(){};t.prototype.initHitDetectionFramebuffer_=function(){var t=this.gl_,e=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,e);var i=np(t,1,1),r=t.createRenderbuffer();t.bindRenderbuffer(t.RENDERBUFFER,r);t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_COMPONENT16,1,1);t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,i,0);t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,r);t.bindTexture(t.TEXTURE_2D,null);t.bindRenderbuffer(t.RENDERBUFFER,null);t.bindFramebuffer(t.FRAMEBUFFER,null);this.hitDetectionFramebuffer_=e;this.hitDetectionTexture_=i;this.hitDetectionRenderbuffer_=r};t.prototype.useProgram=function(t){if(t==this.currentProgram_)return!1;this.getGL().useProgram(t);this.currentProgram_=t;return!0};return t}(t);function rp(t,e,i){var r=t.createTexture();t.bindTexture(t.TEXTURE_2D,r);t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR);void 0!==e&&t.texParameteri(fi,pi,e);void 0!==i&&t.texParameteri(fi,di,i);return r}function np(t,e,i,r,n){var o=rp(t,r,n);t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,i,0,t.RGBA,t.UNSIGNED_BYTE,null);return o}function op(t,e,i,r){var n=rp(t,i,r);t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e);return n}var sp=function(i){function t(t,e){i.call(this,t,e);this.anchorX=void 0;this.anchorY=void 0;this.groupIndices=[];this.hitDetectionGroupIndices=[];this.height=void 0;this.imageHeight=void 0;this.imageWidth=void 0;this.defaultLocations=null;this.opacity=void 0;this.originX=void 0;this.originY=void 0;this.rotateWithView=void 0;this.rotation=void 0;this.scale=void 0;this.width=void 0}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getDeleteResourcesFunction=function(i){var r=this.verticesBuffer,n=this.indicesBuffer,o=this.getTextures(!0),s=i.getGL();return function(){if(!s.isContextLost()){var t,e;for(t=0,e=o.length;t<e;++t)s.deleteTexture(o[t])}i.deleteBuffer(r);i.deleteBuffer(n)}};t.prototype.drawCoordinates=function(t,e,i,r){var n,o,s,a,h,l,u=this,c=this.anchorX,p=this.anchorY,d=this.height,f=this.imageHeight,_=this.imageWidth,g=this.opacity,y=this.originX,v=this.originY,m=this.rotateWithView?1:0,x=-this.rotation,E=this.scale,T=this.width,S=Math.cos(x),C=Math.sin(x),R=this.indices.length,I=this.vertices.length;for(n=e;n<i;n+=r){h=t[n]-u.origin[0];l=t[n+1]-u.origin[1];o=I/8;s=-E*c;a=-E*(d-p);u.vertices[I++]=h;u.vertices[I++]=l;u.vertices[I++]=s*S-a*C;u.vertices[I++]=s*C+a*S;u.vertices[I++]=y/_;u.vertices[I++]=(v+d)/f;u.vertices[I++]=g;u.vertices[I++]=m;s=E*(T-c);a=-E*(d-p);u.vertices[I++]=h;u.vertices[I++]=l;u.vertices[I++]=s*S-a*C;u.vertices[I++]=s*C+a*S;u.vertices[I++]=(y+T)/_;u.vertices[I++]=(v+d)/f;u.vertices[I++]=g;u.vertices[I++]=m;s=E*(T-c);a=E*p;u.vertices[I++]=h;u.vertices[I++]=l;u.vertices[I++]=s*S-a*C;u.vertices[I++]=s*C+a*S;u.vertices[I++]=(y+T)/_;u.vertices[I++]=v/f;u.vertices[I++]=g;u.vertices[I++]=m;s=-E*c;a=E*p;u.vertices[I++]=h;u.vertices[I++]=l;u.vertices[I++]=s*S-a*C;u.vertices[I++]=s*C+a*S;u.vertices[I++]=y/_;u.vertices[I++]=v/f;u.vertices[I++]=g;u.vertices[I++]=m;u.indices[R++]=o;u.indices[R++]=o+1;u.indices[R++]=o+2;u.indices[R++]=o;u.indices[R++]=o+2;u.indices[R++]=o+3}return I};t.prototype.createTextures=function(t,e,i,r){var n,o,s,a,h=e.length;for(a=0;a<h;++a){if((s=St(o=e[a]).toString())in i)n=i[s];else{n=op(r,o,_i,_i);i[s]=n}t[a]=n}};t.prototype.setUpProgram=function(t,e,i,r){var n,o=e.getProgram(Qc,$c);if(this.defaultLocations)n=this.defaultLocations;else{n=new tp(t,o);this.defaultLocations=n}e.useProgram(o);t.enableVertexAttribArray(n.a_position);t.vertexAttribPointer(n.a_position,2,li,!1,32,0);t.enableVertexAttribArray(n.a_offsets);t.vertexAttribPointer(n.a_offsets,2,li,!1,32,8);t.enableVertexAttribArray(n.a_texCoord);t.vertexAttribPointer(n.a_texCoord,2,li,!1,32,16);t.enableVertexAttribArray(n.a_opacity);t.vertexAttribPointer(n.a_opacity,1,li,!1,32,24);t.enableVertexAttribArray(n.a_rotateWithView);t.vertexAttribPointer(n.a_rotateWithView,1,li,!1,32,28);return n};t.prototype.shutDownProgram=function(t,e){t.disableVertexAttribArray(e.a_position);t.disableVertexAttribArray(e.a_offsets);t.disableVertexAttribArray(e.a_texCoord);t.disableVertexAttribArray(e.a_opacity);t.disableVertexAttribArray(e.a_rotateWithView)};t.prototype.drawReplay=function(t,e,i,r){var n=r?this.getHitDetectionTextures():this.getTextures(),o=r?this.hitDetectionGroupIndices:this.groupIndices;if(Ct(i)){var s,a,h;for(s=0,a=n.length,h=0;s<a;++s){t.bindTexture(fi,n[s]);var l=o[s];this.drawElements(t,e,h,l);h=l}}else this.drawReplaySkipping(t,e,i,n,o)};t.prototype.drawReplaySkipping=function(t,e,i,r,n){var o,s,a=0;for(o=0,s=r.length;o<s;++o){t.bindTexture(fi,r[o]);for(var h=0<o?n[o-1]:0,l=n[o],u=h,c=h;a<this.startIndices.length&&this.startIndices[a]<=l;){if(void 0!==i[St(this.startIndicesFeature[a]).toString()]){u!==c&&this.drawElements(t,e,u,c);c=u=a===this.startIndices.length-1?l:this.startIndices[a+1]}else c=a===this.startIndices.length-1?l:this.startIndices[a+1];a++}u!==c&&this.drawElements(t,e,u,c)}};t.prototype.drawHitDetectionReplayOneByOne=function(t,e,i,r,n){var o,s,a,h,l,u=this.startIndices.length-1,c=this.getHitDetectionTextures();for(o=c.length-1;0<=o;--o){t.bindTexture(fi,c[o]);s=0<o?this.hitDetectionGroupIndices[o-1]:0;h=this.hitDetectionGroupIndices[o];for(;0<=u&&this.startIndices[u]>=s;){a=this.startIndices[u];if(void 0===i[St(l=this.startIndicesFeature[u]).toString()]&&l.getGeometry()&&(void 0===n||Rt(n,l.getGeometry().getExtent()))){t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);this.drawElements(t,e,a,h);var p=r(l);if(p)return p}h=a;u--}}};t.prototype.finish=function(t){this.anchorX=void 0;this.anchorY=void 0;this.height=void 0;this.imageHeight=void 0;this.imageWidth=void 0;this.indices=null;this.opacity=void 0;this.originX=void 0;this.originY=void 0;this.rotateWithView=void 0;this.rotation=void 0;this.scale=void 0;this.vertices=null;this.width=void 0};t.prototype.getTextures=function(t){};t.prototype.getHitDetectionTextures=function(){};return t}(Uc),ap=function(n){function t(t,e){n.call(this,t,e);this.images_=[];this.hitDetectionImages_=[];this.textures_=[];this.hitDetectionTextures_=[]}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.drawMultiPoint=function(t,e){this.startIndices.push(this.indices.length);this.startIndicesFeature.push(e);var i=t.getFlatCoordinates(),r=t.getStride();this.drawCoordinates(i,0,i.length,r)};t.prototype.drawPoint=function(t,e){this.startIndices.push(this.indices.length);this.startIndicesFeature.push(e);var i=t.getFlatCoordinates(),r=t.getStride();this.drawCoordinates(i,0,i.length,r)};t.prototype.finish=function(t){var e=t.getGL();this.groupIndices.push(this.indices.length);this.hitDetectionGroupIndices.push(this.indices.length);this.verticesBuffer=new qc(this.vertices);var i=this.indices;this.indicesBuffer=new qc(i);var r={};this.createTextures(this.textures_,this.images_,r,e);this.createTextures(this.hitDetectionTextures_,this.hitDetectionImages_,r,e);this.images_=null;this.hitDetectionImages_=null;n.prototype.finish.call(this,t)};t.prototype.setImageStyle=function(t){var e=t.getAnchor(),i=t.getImage(1),r=t.getImageSize(),n=t.getHitDetectionImage(1),o=t.getOpacity(),s=t.getOrigin(),a=t.getRotateWithView(),h=t.getRotation(),l=t.getSize(),u=t.getScale();if(0===this.images_.length)this.images_.push(i);else if(St(this.images_[this.images_.length-1])!=St(i)){this.groupIndices.push(this.indices.length);this.images_.push(i)}if(0===this.hitDetectionImages_.length)this.hitDetectionImages_.push(n);else if(St(this.hitDetectionImages_[this.hitDetectionImages_.length-1])!=St(n)){this.hitDetectionGroupIndices.push(this.indices.length);this.hitDetectionImages_.push(n)}this.anchorX=e[0];this.anchorY=e[1];this.height=l[1];this.imageHeight=r[1];this.imageWidth=r[0];this.opacity=o;this.originX=s[0];this.originY=s[1];this.rotation=h;this.rotateWithView=a;this.scale=u;this.width=l[0]};t.prototype.getTextures=function(t){return t?this.textures_.concat(this.hitDetectionTextures_):this.textures_};t.prototype.getHitDetectionTextures=function(){return this.hitDetectionTextures_};return t}(sp);function hp(t,e,i,r){var n=i-r;return t[e]===t[n]&&t[e+1]===t[n+1]&&3<(i-e)/r&&!!Br(t,e,i,r)}var lp=new Fc("precision mediump float;\nvarying float v_round;\nvarying vec2 v_roundVertex;\nvarying float v_halfWidth;\n\n\n\nuniform float u_opacity;\nuniform vec4 u_color;\nuniform vec2 u_size;\nuniform float u_pixelRatio;\n\nvoid main(void) {\n  if (v_round > 0.0) {\n    vec2 windowCoords = vec2((v_roundVertex.x + 1.0) / 2.0 * u_size.x * u_pixelRatio,\n        (v_roundVertex.y + 1.0) / 2.0 * u_size.y * u_pixelRatio);\n    if (length(windowCoords - gl_FragCoord.xy) > v_halfWidth * u_pixelRatio) {\n      discard;\n    }\n  }\n  gl_FragColor = u_color;\n  float alpha = u_color.a * u_opacity;\n  if (alpha == 0.0) {\n    discard;\n  }\n  gl_FragColor.a = alpha;\n}\n"),up=new Ac("varying float v_round;\nvarying vec2 v_roundVertex;\nvarying float v_halfWidth;\n\n\nattribute vec2 a_lastPos;\nattribute vec2 a_position;\nattribute vec2 a_nextPos;\nattribute float a_direction;\n\nuniform mat4 u_projectionMatrix;\nuniform mat4 u_offsetScaleMatrix;\nuniform mat4 u_offsetRotateMatrix;\nuniform float u_lineWidth;\nuniform float u_miterLimit;\n\nbool nearlyEquals(in float value, in float ref) {\n  float epsilon = 0.000000000001;\n  return value >= ref - epsilon && value <= ref + epsilon;\n}\n\nvoid alongNormal(out vec2 offset, in vec2 nextP, in float turnDir, in float direction) {\n  vec2 dirVect = nextP - a_position;\n  vec2 normal = normalize(vec2(-turnDir * dirVect.y, turnDir * dirVect.x));\n  offset = u_lineWidth / 2.0 * normal * direction;\n}\n\nvoid miterUp(out vec2 offset, out float round, in bool isRound, in float direction) {\n  float halfWidth = u_lineWidth / 2.0;\n  vec2 tangent = normalize(normalize(a_nextPos - a_position) + normalize(a_position - a_lastPos));\n  vec2 normal = vec2(-tangent.y, tangent.x);\n  vec2 dirVect = a_nextPos - a_position;\n  vec2 tmpNormal = normalize(vec2(-dirVect.y, dirVect.x));\n  float miterLength = abs(halfWidth / dot(normal, tmpNormal));\n  offset = normal * direction * miterLength;\n  round = 0.0;\n  if (isRound) {\n    round = 1.0;\n  } else if (miterLength > u_miterLimit + u_lineWidth) {\n    offset = halfWidth * tmpNormal * direction;\n  }\n}\n\nbool miterDown(out vec2 offset, in vec4 projPos, in mat4 offsetMatrix, in float direction) {\n  bool degenerate = false;\n  vec2 tangent = normalize(normalize(a_nextPos - a_position) + normalize(a_position - a_lastPos));\n  vec2 normal = vec2(-tangent.y, tangent.x);\n  vec2 dirVect = a_lastPos - a_position;\n  vec2 tmpNormal = normalize(vec2(-dirVect.y, dirVect.x));\n  vec2 longOffset, shortOffset, longVertex;\n  vec4 shortProjVertex;\n  float halfWidth = u_lineWidth / 2.0;\n  if (length(a_nextPos - a_position) > length(a_lastPos - a_position)) {\n    longOffset = tmpNormal * direction * halfWidth;\n    shortOffset = normalize(vec2(dirVect.y, -dirVect.x)) * direction * halfWidth;\n    longVertex = a_nextPos;\n    shortProjVertex = u_projectionMatrix * vec4(a_lastPos, 0.0, 1.0);\n  } else {\n    shortOffset = tmpNormal * direction * halfWidth;\n    longOffset = normalize(vec2(dirVect.y, -dirVect.x)) * direction * halfWidth;\n    longVertex = a_lastPos;\n    shortProjVertex = u_projectionMatrix * vec4(a_nextPos, 0.0, 1.0);\n  }\n  //Intersection algorithm based on theory by Paul Bourke (http://paulbourke.net/geometry/pointlineplane/).\n  vec4 p1 = u_projectionMatrix * vec4(longVertex, 0.0, 1.0) + offsetMatrix * vec4(longOffset, 0.0, 0.0);\n  vec4 p2 = projPos + offsetMatrix * vec4(longOffset, 0.0, 0.0);\n  vec4 p3 = shortProjVertex + offsetMatrix * vec4(-shortOffset, 0.0, 0.0);\n  vec4 p4 = shortProjVertex + offsetMatrix * vec4(shortOffset, 0.0, 0.0);\n  float denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);\n  float firstU = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;\n  float secondU = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;\n  float epsilon = 0.000000000001;\n  if (firstU > epsilon && firstU < 1.0 - epsilon && secondU > epsilon && secondU < 1.0 - epsilon) {\n    shortProjVertex.x = p1.x + firstU * (p2.x - p1.x);\n    shortProjVertex.y = p1.y + firstU * (p2.y - p1.y);\n    offset = shortProjVertex.xy;\n    degenerate = true;\n  } else {\n    float miterLength = abs(halfWidth / dot(normal, tmpNormal));\n    offset = normal * direction * miterLength;\n  }\n  return degenerate;\n}\n\nvoid squareCap(out vec2 offset, out float round, in bool isRound, in vec2 nextP,\n    in float turnDir, in float direction) {\n  round = 0.0;\n  vec2 dirVect = a_position - nextP;\n  vec2 firstNormal = normalize(dirVect);\n  vec2 secondNormal = vec2(turnDir * firstNormal.y * direction, -turnDir * firstNormal.x * direction);\n  vec2 hypotenuse = normalize(firstNormal - secondNormal);\n  vec2 normal = vec2(turnDir * hypotenuse.y * direction, -turnDir * hypotenuse.x * direction);\n  float length = sqrt(v_halfWidth * v_halfWidth * 2.0);\n  offset = normal * length;\n  if (isRound) {\n    round = 1.0;\n  }\n}\n\nvoid main(void) {\n  bool degenerate = false;\n  float direction = float(sign(a_direction));\n  mat4 offsetMatrix = u_offsetScaleMatrix * u_offsetRotateMatrix;\n  vec2 offset;\n  vec4 projPos = u_projectionMatrix * vec4(a_position, 0.0, 1.0);\n  bool round = nearlyEquals(mod(a_direction, 2.0), 0.0);\n\n  v_round = 0.0;\n  v_halfWidth = u_lineWidth / 2.0;\n  v_roundVertex = projPos.xy;\n\n  if (nearlyEquals(mod(a_direction, 3.0), 0.0) || nearlyEquals(mod(a_direction, 17.0), 0.0)) {\n    alongNormal(offset, a_nextPos, 1.0, direction);\n  } else if (nearlyEquals(mod(a_direction, 5.0), 0.0) || nearlyEquals(mod(a_direction, 13.0), 0.0)) {\n    alongNormal(offset, a_lastPos, -1.0, direction);\n  } else if (nearlyEquals(mod(a_direction, 23.0), 0.0)) {\n    miterUp(offset, v_round, round, direction);\n  } else if (nearlyEquals(mod(a_direction, 19.0), 0.0)) {\n    degenerate = miterDown(offset, projPos, offsetMatrix, direction);\n  } else if (nearlyEquals(mod(a_direction, 7.0), 0.0)) {\n    squareCap(offset, v_round, round, a_nextPos, 1.0, direction);\n  } else if (nearlyEquals(mod(a_direction, 11.0), 0.0)) {\n    squareCap(offset, v_round, round, a_lastPos, -1.0, direction);\n  }\n  if (!degenerate) {\n    vec4 offsets = offsetMatrix * vec4(offset, 0.0, 0.0);\n    gl_Position = projPos + offsets;\n  } else {\n    gl_Position = vec4(offset, 0.0, 1.0);\n  }\n}\n\n\n"),cp=function(t,e){this.u_projectionMatrix=t.getUniformLocation(e,"u_projectionMatrix");this.u_offsetScaleMatrix=t.getUniformLocation(e,"u_offsetScaleMatrix");this.u_offsetRotateMatrix=t.getUniformLocation(e,"u_offsetRotateMatrix");this.u_lineWidth=t.getUniformLocation(e,"u_lineWidth");this.u_miterLimit=t.getUniformLocation(e,"u_miterLimit");this.u_opacity=t.getUniformLocation(e,"u_opacity");this.u_color=t.getUniformLocation(e,"u_color");this.u_size=t.getUniformLocation(e,"u_size");this.u_pixelRatio=t.getUniformLocation(e,"u_pixelRatio");this.a_lastPos=t.getAttribLocation(e,"a_lastPos");this.a_position=t.getAttribLocation(e,"a_position");this.a_nextPos=t.getAttribLocation(e,"a_nextPos");this.a_direction=t.getAttribLocation(e,"a_direction")},pp=3,dp=5,fp=7,_p=11,gp=13,yp=17,vp=19,mp=23,xp=function(i){function t(t,e){i.call(this,t,e);this.defaultLocations_=null;this.styles_=[];this.styleIndices_=[];this.state_={strokeColor:null,lineCap:void 0,lineDash:null,lineDashOffset:void 0,lineJoin:void 0,lineWidth:void 0,miterLimit:void 0,changed:!1}}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.drawCoordinates_=function(t,e,i,r){var n,o,s,a,h,l,u,c,p=this,d=this.vertices.length,f=this.indices.length,_="bevel"===this.state_.lineJoin?0:"miter"===this.state_.lineJoin?1:2,g="butt"===this.state_.lineCap?0:"square"===this.state_.lineCap?1:2,y=hp(t,e,i,r),v=f,m=1;for(n=e,o=i;n<o;n+=r){h=d/7;l=u;u=c||[t[n],t[n+1]];if(n===e){c=[t[n+r],t[n+r+1]];if(i-e==2*r&&Ar(u,c))break;if(!y){if(g){d=p.addVertices_([0,0],u,c,m*fp*g,d);d=p.addVertices_([0,0],u,c,-m*fp*g,d);p.indices[f++]=h+2;p.indices[f++]=h;p.indices[f++]=h+1;p.indices[f++]=h+1;p.indices[f++]=h+3;p.indices[f++]=h+2}d=p.addVertices_([0,0],u,c,m*pp*(g||1),d);v=(d=p.addVertices_([0,0],u,c,-m*pp*(g||1),d))/7-1;continue}l=[t[i-2*r],t[i-2*r+1]];s=c}else{if(n===i-r){if(y){c=s;break}l=l||[0,0];d=p.addVertices_(l,u,[0,0],m*dp*(g||1),d);d=p.addVertices_(l,u,[0,0],-m*dp*(g||1),d);p.indices[f++]=h;p.indices[f++]=v-1;p.indices[f++]=v;p.indices[f++]=v;p.indices[f++]=h+1;p.indices[f++]=h;if(g){d=p.addVertices_(l,u,[0,0],m*_p*g,d);d=p.addVertices_(l,u,[0,0],-m*_p*g,d);p.indices[f++]=h+2;p.indices[f++]=h;p.indices[f++]=h+1;p.indices[f++]=h+1;p.indices[f++]=h+3;p.indices[f++]=h+2}break}c=[t[n+r],t[n+r+1]]}a=Kc(l[0],l[1],u[0],u[1],c[0],c[1])?-1:1;d=p.addVertices_(l,u,c,a*gp*(_||1),d);d=p.addVertices_(l,u,c,a*yp*(_||1),d);d=p.addVertices_(l,u,c,-a*vp*(_||1),d);if(e<n){p.indices[f++]=h;p.indices[f++]=v-1;p.indices[f++]=v;p.indices[f++]=h+2;p.indices[f++]=h;p.indices[f++]=0<m*a?v:v-1}p.indices[f++]=h;p.indices[f++]=h+2;p.indices[f++]=h+1;v=h+2;m=a;if(_){d=p.addVertices_(l,u,c,a*mp*_,d);p.indices[f++]=h+1;p.indices[f++]=h+3;p.indices[f++]=h}}if(y){h=h||d/7;a=Ln([l[0],l[1],u[0],u[1],c[0],c[1]],0,6,2)?1:-1;d=this.addVertices_(l,u,c,a*gp*(_||1),d);d=this.addVertices_(l,u,c,-a*vp*(_||1),d);this.indices[f++]=h;this.indices[f++]=v-1;this.indices[f++]=v;this.indices[f++]=h+1;this.indices[f++]=h;this.indices[f++]=0<m*a?v:v-1}};t.prototype.addVertices_=function(t,e,i,r,n){this.vertices[n++]=t[0];this.vertices[n++]=t[1];this.vertices[n++]=e[0];this.vertices[n++]=e[1];this.vertices[n++]=i[0];this.vertices[n++]=i[1];this.vertices[n++]=r;return n};t.prototype.isValid_=function(t,e,i,r){var n=i-e;return!(n<2*r)&&(n!==2*r||!Ar([t[e],t[e+1]],[t[e+r],t[e+r+1]]))};t.prototype.drawLineString=function(t,e){var i=t.getFlatCoordinates(),r=t.getStride();if(this.isValid_(i,0,i.length,r)){i=wt(i,0,i.length,r,-this.origin[0],-this.origin[1]);if(this.state_.changed){this.styleIndices_.push(this.indices.length);this.state_.changed=!1}this.startIndices.push(this.indices.length);this.startIndicesFeature.push(e);this.drawCoordinates_(i,0,i.length,r)}};t.prototype.drawMultiLineString=function(t,e){var i=this.indices.length,r=t.getEnds();r.unshift(0);var n,o,s=t.getFlatCoordinates(),a=t.getStride();if(1<r.length)for(n=1,o=r.length;n<o;++n)if(this.isValid_(s,r[n-1],r[n],a)){var h=wt(s,r[n-1],r[n],a,-this.origin[0],-this.origin[1]);this.drawCoordinates_(h,0,h.length,a)}if(this.indices.length>i){this.startIndices.push(i);this.startIndicesFeature.push(e);if(this.state_.changed){this.styleIndices_.push(i);this.state_.changed=!1}}};t.prototype.drawPolygonCoordinates=function(t,e,i){if(!hp(t,0,t.length,i)){t.push(t[0]);t.push(t[1])}this.drawCoordinates_(t,0,t.length,i);if(e.length){var r,n;for(r=0,n=e.length;r<n;++r){if(!hp(e[r],0,e[r].length,i)){e[r].push(e[r][0]);e[r].push(e[r][1])}this.drawCoordinates_(e[r],0,e[r].length,i)}}};t.prototype.setPolygonStyle=function(t,e){var i=void 0===e?this.indices.length:e;this.startIndices.push(i);this.startIndicesFeature.push(t);if(this.state_.changed){this.styleIndices_.push(i);this.state_.changed=!1}};t.prototype.getCurrentIndex=function(){return this.indices.length};t.prototype.finish=function(t){this.verticesBuffer=new qc(this.vertices);this.indicesBuffer=new qc(this.indices);this.startIndices.push(this.indices.length);0===this.styleIndices_.length&&0<this.styles_.length&&(this.styles_=[]);this.vertices=null;this.indices=null};t.prototype.getDeleteResourcesFunction=function(t){var e=this.verticesBuffer,i=this.indicesBuffer;return function(){t.deleteBuffer(e);t.deleteBuffer(i)}};t.prototype.setUpProgram=function(t,e,i,r){var n,o=e.getProgram(lp,up);if(this.defaultLocations_)n=this.defaultLocations_;else{n=new cp(t,o);this.defaultLocations_=n}e.useProgram(o);t.enableVertexAttribArray(n.a_lastPos);t.vertexAttribPointer(n.a_lastPos,2,li,!1,28,0);t.enableVertexAttribArray(n.a_position);t.vertexAttribPointer(n.a_position,2,li,!1,28,8);t.enableVertexAttribArray(n.a_nextPos);t.vertexAttribPointer(n.a_nextPos,2,li,!1,28,16);t.enableVertexAttribArray(n.a_direction);t.vertexAttribPointer(n.a_direction,1,li,!1,28,24);t.uniform2fv(n.u_size,i);t.uniform1f(n.u_pixelRatio,r);return n};t.prototype.shutDownProgram=function(t,e){t.disableVertexAttribArray(e.a_lastPos);t.disableVertexAttribArray(e.a_position);t.disableVertexAttribArray(e.a_nextPos);t.disableVertexAttribArray(e.a_direction)};t.prototype.drawReplay=function(t,e,i,r){var n=t.getParameter(t.DEPTH_FUNC),o=t.getParameter(t.DEPTH_WRITEMASK);if(!r){t.enable(t.DEPTH_TEST);t.depthMask(!0);t.depthFunc(t.NOTEQUAL)}if(Ct(i)){var s,a,h,l;h=this.startIndices[this.startIndices.length-1];for(s=this.styleIndices_.length-1;0<=s;--s){a=this.styleIndices_[s];l=this.styles_[s];this.setStrokeStyle_(t,l[0],l[1],l[2]);this.drawElements(t,e,a,h);t.clear(t.DEPTH_BUFFER_BIT);h=a}}else this.drawReplaySkipping_(t,e,i);if(!r){t.disable(t.DEPTH_TEST);t.clear(t.DEPTH_BUFFER_BIT);t.depthMask(o);t.depthFunc(n)}};t.prototype.drawReplaySkipping_=function(t,e,i){var r,n,o,s,a,h,l;h=this.startIndices.length-2;o=n=this.startIndices[h+1];for(r=this.styleIndices_.length-1;0<=r;--r){s=this.styles_[r];this.setStrokeStyle_(t,s[0],s[1],s[2]);a=this.styleIndices_[r];for(;0<=h&&this.startIndices[h]>=a;){l=this.startIndices[h];if(i[St(this.startIndicesFeature[h]).toString()]){if(n!==o){this.drawElements(t,e,n,o);t.clear(t.DEPTH_BUFFER_BIT)}o=l}h--;n=l}if(n!==o){this.drawElements(t,e,n,o);t.clear(t.DEPTH_BUFFER_BIT)}n=o=a}};t.prototype.drawHitDetectionReplayOneByOne=function(t,e,i,r,n){var o,s,a,h,l,u,c;c=this.startIndices.length-2;a=this.startIndices[c+1];for(o=this.styleIndices_.length-1;0<=o;--o){h=this.styles_[o];this.setStrokeStyle_(t,h[0],h[1],h[2]);l=this.styleIndices_[o];for(;0<=c&&this.startIndices[c]>=l;){s=this.startIndices[c];if(void 0===i[St(u=this.startIndicesFeature[c]).toString()]&&u.getGeometry()&&(void 0===n||Rt(n,u.getGeometry().getExtent()))){t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);this.drawElements(t,e,s,a);var p=r(u);if(p)return p}c--;a=s}}};t.prototype.setStrokeStyle_=function(t,e,i,r){t.uniform4fv(this.defaultLocations_.u_color,e);t.uniform1f(this.defaultLocations_.u_lineWidth,i);t.uniform1f(this.defaultLocations_.u_miterLimit,r)};t.prototype.setFillStrokeStyle=function(t,e){var i=e.getLineCap();this.state_.lineCap=void 0!==i?i:Vc;var r=e.getLineDash();this.state_.lineDash=r||Xc;var n=e.getLineDashOffset();this.state_.lineDashOffset=n||0;var o=e.getLineJoin();this.state_.lineJoin=void 0!==o?o:zc;var s=e.getColor();s=s instanceof CanvasGradient||s instanceof CanvasPattern?Wc:Je(s).map(function(t,e){return 3!=e?t/255:t})||Wc;var a=e.getWidth();a=void 0!==a?a:1;var h=e.getMiterLimit();h=void 0!==h?h:10;if(!this.state_.strokeColor||!Ar(this.state_.strokeColor,s)||this.state_.lineWidth!==a||this.state_.miterLimit!==h){this.state_.changed=!0;this.state_.strokeColor=s;this.state_.lineWidth=a;this.state_.miterLimit=h;this.styles_.push([s,a,h])}};return t}(Uc),Ep=new Fc("precision mediump float;\n\n\n\nuniform vec4 u_color;\nuniform float u_opacity;\n\nvoid main(void) {\n  gl_FragColor = u_color;\n  float alpha = u_color.a * u_opacity;\n  if (alpha == 0.0) {\n    discard;\n  }\n  gl_FragColor.a = alpha;\n}\n"),Tp=new Ac("\n\nattribute vec2 a_position;\n\nuniform mat4 u_projectionMatrix;\nuniform mat4 u_offsetScaleMatrix;\nuniform mat4 u_offsetRotateMatrix;\n\nvoid main(void) {\n  gl_Position = u_projectionMatrix * vec4(a_position, 0.0, 1.0);\n}\n\n\n"),Sp=function(t,e){this.u_projectionMatrix=t.getUniformLocation(e,"u_projectionMatrix");this.u_offsetScaleMatrix=t.getUniformLocation(e,"u_offsetScaleMatrix");this.u_offsetRotateMatrix=t.getUniformLocation(e,"u_offsetRotateMatrix");this.u_color=t.getUniformLocation(e,"u_color");this.u_opacity=t.getUniformLocation(e,"u_opacity");this.a_position=t.getAttribLocation(e,"a_position")},Cp=function(t){this.first_;this.last_;this.head_;this.circular_=void 0===t||t;this.length_=0};Cp.prototype.insertItem=function(t){var e={prev:void 0,next:void 0,data:t},i=this.head_;if(i){var r=i.next;e.prev=i;e.next=r;i.next=e;r&&(r.prev=e);i===this.last_&&(this.last_=e)}else{this.first_=e;this.last_=e;this.circular_&&((e.next=e).prev=e)}this.head_=e;this.length_++};Cp.prototype.removeItem=function(){var t=this.head_;if(t){var e=t.next,i=t.prev;e&&(e.prev=i);i&&(i.next=e);this.head_=e||i;if(this.first_===this.last_){this.head_=void 0;this.first_=void 0;this.last_=void 0}else this.first_===t?this.first_=this.head_:this.last_===t&&(this.last_=i?this.head_.prev:this.head_);this.length_--}};Cp.prototype.firstItem=function(){this.head_=this.first_;if(this.head_)return this.head_.data};Cp.prototype.lastItem=function(){this.head_=this.last_;if(this.head_)return this.head_.data};Cp.prototype.nextItem=function(){if(this.head_&&this.head_.next){this.head_=this.head_.next;return this.head_.data}};Cp.prototype.getNextItem=function(){if(this.head_&&this.head_.next)return this.head_.next.data};Cp.prototype.prevItem=function(){if(this.head_&&this.head_.prev){this.head_=this.head_.prev;return this.head_.data}};Cp.prototype.getPrevItem=function(){if(this.head_&&this.head_.prev)return this.head_.prev.data};Cp.prototype.getCurrItem=function(){if(this.head_)return this.head_.data};Cp.prototype.setFirstItem=function(){if(this.circular_&&this.head_){this.first_=this.head_;this.last_=this.head_.prev}};Cp.prototype.concat=function(t){if(t.head_){if(this.head_){var e=this.head_.next;this.head_.next=t.first_;t.first_.prev=this.head_;e.prev=t.last_;t.last_.next=e;this.length_+=t.length_}else{this.head_=t.head_;this.first_=t.first_;this.last_=t.last_;this.length_=t.length_}t.head_=void 0;t.first_=void 0;t.last_=void 0;t.length_=0}};Cp.prototype.getLength=function(){return this.length_};var Rp=function(i){function t(t,e){i.call(this,t,e);this.lineStringReplay=new xp(t,e);this.defaultLocations_=null;this.styles_=[];this.styleIndices_=[];this.state_={fillColor:null,changed:!1}}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.drawCoordinates_=function(t,e,i){var r=new Cp,n=new el;this.processFlatCoordinates_(t,i,r,n,!0);var o=this.getMaxCoords_(r);if(e.length){var s,a,h=[];for(s=0,a=e.length;s<a;++s){var l={list:new Cp,maxCoords:void 0,rtree:new el};h.push(l);this.processFlatCoordinates_(e[s],i,l.list,l.rtree,!1);this.classifyPoints_(l.list,l.rtree,!0);l.maxCoords=this.getMaxCoords_(l.list)}h.sort(function(t,e){return e.maxCoords[0]===t.maxCoords[0]?t.maxCoords[1]-e.maxCoords[1]:e.maxCoords[0]-t.maxCoords[0]});for(s=0;s<h.length;++s){var u=h[s].list,c=u.firstItem(),p=c,d=void 0;do{if(this.getIntersections_(p,n).length){d=!0;break}p=u.nextItem()}while(c!==p);if(!d&&this.bridgeHole_(u,h[s].maxCoords[0],r,o[0],n)){n.concat(h[s].rtree);this.classifyPoints_(r,n,!1)}}}else this.classifyPoints_(r,n,!1);this.triangulate_(r,n)};t.prototype.processFlatCoordinates_=function(t,e,i,r,n){var o,s,a,h,l,u=Ln(t,0,t.length,e),c=this.vertices.length/2,p=[],d=[];if(n===u){h=a=this.createPoint_(t[0],t[1],c++);for(o=e,s=t.length;o<s;o+=e){l=this.createPoint_(t[o],t[o+1],c++);d.push(this.insertItem_(h,l,i));p.push([Math.min(h.x,l.x),Math.min(h.y,l.y),Math.max(h.x,l.x),Math.max(h.y,l.y)]);h=l}d.push(this.insertItem_(l,a,i));p.push([Math.min(h.x,l.x),Math.min(h.y,l.y),Math.max(h.x,l.x),Math.max(h.y,l.y)])}else{var f=t.length-e;h=a=this.createPoint_(t[f],t[f+1],c++);for(o=f-e,s=0;s<=o;o-=e){l=this.createPoint_(t[o],t[o+1],c++);d.push(this.insertItem_(h,l,i));p.push([Math.min(h.x,l.x),Math.min(h.y,l.y),Math.max(h.x,l.x),Math.max(h.y,l.y)]);h=l}d.push(this.insertItem_(l,a,i));p.push([Math.min(h.x,l.x),Math.min(h.y,l.y),Math.max(h.x,l.x),Math.max(h.y,l.y)])}r.load(p,d)};t.prototype.getMaxCoords_=function(t){for(var e=t.firstItem(),i=e,r=[i.p0.x,i.p0.y];(i=t.nextItem()).p0.x>r[0]&&(r=[i.p0.x,i.p0.y]),i!==e;);return r};t.prototype.classifyPoints_=function(t,e,i){var r=t.firstItem(),n=r,o=t.nextItem(),s=!1;do{var a=i?Kc(o.p1.x,o.p1.y,n.p1.x,n.p1.y,n.p0.x,n.p0.y):Kc(n.p0.x,n.p0.y,n.p1.x,n.p1.y,o.p1.x,o.p1.y);if(void 0===a){this.removeItem_(n,o,t,e);s=!0;o===r&&(r=t.getNextItem());o=n;t.prevItem()}else if(n.p1.reflex!==a){n.p1.reflex=a;s=!0}n=o;o=t.nextItem()}while(n!==r);return s};t.prototype.bridgeHole_=function(t,e,i,r,n){for(var o=t.firstItem();o.p1.x!==e;)o=t.nextItem();var s,a,h,l,u=o.p1,c={x:r,y:u.y,i:-1},p=1/0,d=this.getIntersections_({p0:u,p1:c},n,!0);for(s=0,a=d.length;s<a;++s){var f=d[s],_=this.calculateIntersection_(u,c,f.p0,f.p1,!0),g=Math.abs(u.x-_[0]);if(g<p&&void 0!==Kc(u.x,u.y,f.p0.x,f.p0.y,f.p1.x,f.p1.y)){p=g;l={x:_[0],y:_[1],i:-1};o=f}}if(p===1/0)return!1;h=o.p1;if(0<p){var y=this.getPointsInTriangle_(u,l,o.p1,n);if(y.length){var v=1/0;for(s=0,a=y.length;s<a;++s){var m=y[s],x=Math.atan2(u.y-m.y,c.x-m.x);if(x<v||x===v&&m.x<h.x){v=x;h=m}}}}o=i.firstItem();for(;o.p1.x!==h.x||o.p1.y!==h.y;)o=i.nextItem();var E={x:u.x,y:u.y,i:u.i,reflex:void 0},T={x:o.p1.x,y:o.p1.y,i:o.p1.i,reflex:void 0};t.getNextItem().p0=E;this.insertItem_(u,o.p1,t,n);this.insertItem_(T,E,t,n);o.p1=T;t.setFirstItem();i.concat(t);return!0};t.prototype.triangulate_=function(t,e){for(var i=this,r=!1,n=this.isSimple_(t,e);3<t.getLength();)if(n){if(!i.clipEars_(t,e,n,r)&&!i.classifyPoints_(t,e,r)&&!i.resolveSelfIntersections_(t,e,!0))break}else if(!i.clipEars_(t,e,n,r)&&!i.classifyPoints_(t,e,r)&&!i.resolveSelfIntersections_(t,e)){if(!(n=i.isSimple_(t,e))){i.splitPolygon_(t,e);break}r=!i.isClockwise_(t);i.classifyPoints_(t,e,r)}if(3===t.getLength()){var o=this.indices.length;this.indices[o++]=t.getPrevItem().p0.i;this.indices[o++]=t.getCurrItem().p0.i;this.indices[o++]=t.getNextItem().p0.i}};t.prototype.clipEars_=function(t,e,i,r){var n,o,s,a=this.indices.length,h=t.firstItem(),l=t.getPrevItem(),u=h,c=t.nextItem(),p=t.getNextItem(),d=!1;do{n=u.p0;o=u.p1;s=c.p1;if(!1===o.reflex){var f=void 0;f=i?0===this.getPointsInTriangle_(n,o,s,e,!0).length:r?this.diagonalIsInside_(p.p1,s,o,n,l.p0):this.diagonalIsInside_(l.p0,n,o,s,p.p1);if((i||0===this.getIntersections_({p0:n,p1:s},e).length)&&f&&(i||!1===n.reflex||!1===s.reflex||Ln([l.p0.x,l.p0.y,n.x,n.y,o.x,o.y,s.x,s.y,p.p1.x,p.p1.y],0,10,2)===!r)){this.indices[a++]=n.i;this.indices[a++]=o.i;this.indices[a++]=s.i;this.removeItem_(u,c,t,e);c===h&&(h=p);d=!0}}l=t.getPrevItem();u=t.getCurrItem();c=t.nextItem();p=t.getNextItem()}while(u!==h&&3<t.getLength());return d};t.prototype.resolveSelfIntersections_=function(t,e,i){var r=t.firstItem();t.nextItem();var n=r,o=t.nextItem(),s=!1;do{var a=this.calculateIntersection_(n.p0,n.p1,o.p0,o.p1,i);if(a){var h=!1,l=this.vertices.length,u=this.indices.length,c=l/2,p=t.prevItem();t.removeItem();e.remove(p);h=p===r;var d=void 0;if(i){if(a[0]===n.p0.x&&a[1]===n.p0.y){t.prevItem();d=n.p0;o.p0=d;e.remove(n);h=h||n===r}else{d=o.p1;n.p1=d;e.remove(o);h=h||o===r}t.removeItem()}else{d=this.createPoint_(a[0],a[1],c);n.p1=d;o.p0=d;e.update([Math.min(n.p0.x,n.p1.x),Math.min(n.p0.y,n.p1.y),Math.max(n.p0.x,n.p1.x),Math.max(n.p0.y,n.p1.y)],n);e.update([Math.min(o.p0.x,o.p1.x),Math.min(o.p0.y,o.p1.y),Math.max(o.p0.x,o.p1.x),Math.max(o.p0.y,o.p1.y)],o)}this.indices[u++]=p.p0.i;this.indices[u++]=p.p1.i;this.indices[u++]=d.i;s=!0;if(h)break}n=t.getPrevItem();o=t.nextItem()}while(n!==r);return s};t.prototype.isSimple_=function(t,e){var i=t.firstItem(),r=i;do{if(this.getIntersections_(r,e).length)return!1;r=t.nextItem()}while(r!==i);return!0};t.prototype.isClockwise_=function(t){var e=2*t.getLength(),i=new Array(e),r=t.firstItem(),n=r,o=0;do{i[o++]=n.p0.x;i[o++]=n.p0.y;n=t.nextItem()}while(n!==r);return Ln(i,0,e,2)};t.prototype.splitPolygon_=function(t,e){var i=this,r=t.firstItem(),n=r;do{var o=i.getIntersections_(n,e);if(o.length){var s=o[0],a=i.vertices.length/2,h=i.calculateIntersection_(n.p0,n.p1,s.p0,s.p1),l=i.createPoint_(h[0],h[1],a),u=new Cp,c=new el;i.insertItem_(l,n.p1,u,c);n.p1=l;e.update([Math.min(n.p0.x,l.x),Math.min(n.p0.y,l.y),Math.max(n.p0.x,l.x),Math.max(n.p0.y,l.y)],n);for(var p=t.nextItem();p!==s;){i.insertItem_(p.p0,p.p1,u,c);e.remove(p);t.removeItem();p=t.getCurrItem()}i.insertItem_(s.p0,l,u,c);s.p0=l;e.update([Math.min(s.p1.x,l.x),Math.min(s.p1.y,l.y),Math.max(s.p1.x,l.x),Math.max(s.p1.y,l.y)],s);i.classifyPoints_(t,e,!1);i.triangulate_(t,e);i.classifyPoints_(u,c,!1);i.triangulate_(u,c);break}n=t.nextItem()}while(n!==r)};t.prototype.createPoint_=function(t,e,i){var r=this.vertices.length;return{x:this.vertices[r++]=t,y:this.vertices[r++]=e,i:i,reflex:void 0}};t.prototype.insertItem_=function(t,e,i,r){var n={p0:t,p1:e};i.insertItem(n);r&&r.insert([Math.min(t.x,e.x),Math.min(t.y,e.y),Math.max(t.x,e.x),Math.max(t.y,e.y)],n);return n};t.prototype.removeItem_=function(t,e,i,r){if(i.getCurrItem()===e){i.removeItem();t.p1=e.p1;r.remove(e);r.update([Math.min(t.p0.x,t.p1.x),Math.min(t.p0.y,t.p1.y),Math.max(t.p0.x,t.p1.x),Math.max(t.p0.y,t.p1.y)],t)}};t.prototype.getPointsInTriangle_=function(t,e,i,r,n){for(var o=[],s=r.getInExtent([Math.min(t.x,e.x,i.x),Math.min(t.y,e.y,i.y),Math.max(t.x,e.x,i.x),Math.max(t.y,e.y,i.y)]),a=0,h=s.length;a<h;++a)for(var l in s[a]){var u=s[a][l];"object"!=typeof u||n&&!u.reflex||u.x===t.x&&u.y===t.y||u.x===e.x&&u.y===e.y||u.x===i.x&&u.y===i.y||-1!==o.indexOf(u)||!gn([t.x,t.y,e.x,e.y,i.x,i.y],0,6,2,u.x,u.y)||o.push(u)}return o};t.prototype.getIntersections_=function(t,e,i){for(var r=t.p0,n=t.p1,o=e.getInExtent([Math.min(r.x,n.x),Math.min(r.y,n.y),Math.max(r.x,n.x),Math.max(r.y,n.y)]),s=[],a=0,h=o.length;a<h;++a){var l=o[a];t!==l&&(i||l.p0!==n||l.p1!==r)&&this.calculateIntersection_(r,n,l.p0,l.p1,i)&&s.push(l)}return s};t.prototype.calculateIntersection_=function(t,e,i,r,n){var o=(r.y-i.y)*(e.x-t.x)-(r.x-i.x)*(e.y-t.y);if(0!==o){var s=((r.x-i.x)*(t.y-i.y)-(r.y-i.y)*(t.x-i.x))/o,a=((e.x-t.x)*(t.y-i.y)-(e.y-t.y)*(t.x-i.x))/o;if(!n&&Hc<s&&s<1-Hc&&Hc<a&&a<1-Hc||n&&0<=s&&s<=1&&0<=a&&a<=1)return[t.x+s*(e.x-t.x),t.y+s*(e.y-t.y)]}};t.prototype.diagonalIsInside_=function(t,e,i,r,n){if(void 0===e.reflex||void 0===r.reflex)return!1;var o=(i.x-r.x)*(e.y-r.y)>(i.y-r.y)*(e.x-r.x),s=(n.x-r.x)*(e.y-r.y)<(n.y-r.y)*(e.x-r.x),a=(t.x-e.x)*(r.y-e.y)>(t.y-e.y)*(r.x-e.x),h=(i.x-e.x)*(r.y-e.y)<(i.y-e.y)*(r.x-e.x),l=r.reflex?s||o:s&&o,u=e.reflex?h||a:h&&a;return l&&u};t.prototype.drawMultiPolygon=function(t,e){var i,r,n,o,s=t.getEndss(),a=t.getStride(),h=this.indices.length,l=this.lineStringReplay.getCurrentIndex(),u=t.getFlatCoordinates(),c=0;for(i=0,r=s.length;i<r;++i){var p=s[i];if(0<p.length){var d=wt(u,c,p[0],a,-this.origin[0],-this.origin[1]);if(d.length){var f=[],_=void 0;for(n=1,o=p.length;n<o;++n)if(p[n]!==p[n-1]){_=wt(u,p[n-1],p[n],a,-this.origin[0],-this.origin[1]);f.push(_)}this.lineStringReplay.drawPolygonCoordinates(d,f,a);this.drawCoordinates_(d,f,a)}}c=p[p.length-1]}if(this.indices.length>h){this.startIndices.push(h);this.startIndicesFeature.push(e);if(this.state_.changed){this.styleIndices_.push(h);this.state_.changed=!1}}this.lineStringReplay.getCurrentIndex()>l&&this.lineStringReplay.setPolygonStyle(e,l)};t.prototype.drawPolygon=function(t,e){var i=t.getEnds(),r=t.getStride();if(0<i.length){var n=t.getFlatCoordinates().map(Number),o=wt(n,0,i[0],r,-this.origin[0],-this.origin[1]);if(o.length){var s,a,h,l=[];for(s=1,a=i.length;s<a;++s)if(i[s]!==i[s-1]){h=wt(n,i[s-1],i[s],r,-this.origin[0],-this.origin[1]);l.push(h)}this.startIndices.push(this.indices.length);this.startIndicesFeature.push(e);if(this.state_.changed){this.styleIndices_.push(this.indices.length);this.state_.changed=!1}this.lineStringReplay.setPolygonStyle(e);this.lineStringReplay.drawPolygonCoordinates(o,l,r);this.drawCoordinates_(o,l,r)}}};t.prototype.finish=function(t){this.verticesBuffer=new qc(this.vertices);this.indicesBuffer=new qc(this.indices);this.startIndices.push(this.indices.length);this.lineStringReplay.finish(t);0===this.styleIndices_.length&&0<this.styles_.length&&(this.styles_=[]);this.vertices=null;this.indices=null};t.prototype.getDeleteResourcesFunction=function(t){var e=this.verticesBuffer,i=this.indicesBuffer,r=this.lineStringReplay.getDeleteResourcesFunction(t);return function(){t.deleteBuffer(e);t.deleteBuffer(i);r()}};t.prototype.setUpProgram=function(t,e,i,r){var n,o=e.getProgram(Ep,Tp);if(this.defaultLocations_)n=this.defaultLocations_;else{n=new Sp(t,o);this.defaultLocations_=n}e.useProgram(o);t.enableVertexAttribArray(n.a_position);t.vertexAttribPointer(n.a_position,2,li,!1,8,0);return n};t.prototype.shutDownProgram=function(t,e){t.disableVertexAttribArray(e.a_position)};t.prototype.drawReplay=function(t,e,i,r){var n=t.getParameter(t.DEPTH_FUNC),o=t.getParameter(t.DEPTH_WRITEMASK);if(!r){t.enable(t.DEPTH_TEST);t.depthMask(!0);t.depthFunc(t.NOTEQUAL)}if(Ct(i)){var s,a,h,l;h=this.startIndices[this.startIndices.length-1];for(s=this.styleIndices_.length-1;0<=s;--s){a=this.styleIndices_[s];l=this.styles_[s];this.setFillStyle_(t,l);this.drawElements(t,e,a,h);h=a}}else this.drawReplaySkipping_(t,e,i);if(!r){t.disable(t.DEPTH_TEST);t.clear(t.DEPTH_BUFFER_BIT);t.depthMask(o);t.depthFunc(n)}};t.prototype.drawHitDetectionReplayOneByOne=function(t,e,i,r,n){var o,s,a,h,l,u,c;c=this.startIndices.length-2;a=this.startIndices[c+1];for(o=this.styleIndices_.length-1;0<=o;--o){h=this.styles_[o];this.setFillStyle_(t,h);l=this.styleIndices_[o];for(;0<=c&&this.startIndices[c]>=l;){s=this.startIndices[c];if(void 0===i[St(u=this.startIndicesFeature[c]).toString()]&&u.getGeometry()&&(void 0===n||Rt(n,u.getGeometry().getExtent()))){t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);this.drawElements(t,e,s,a);var p=r(u);if(p)return p}c--;a=s}}};t.prototype.drawReplaySkipping_=function(t,e,i){var r,n,o,s,a,h,l;h=this.startIndices.length-2;o=n=this.startIndices[h+1];for(r=this.styleIndices_.length-1;0<=r;--r){s=this.styles_[r];this.setFillStyle_(t,s);a=this.styleIndices_[r];for(;0<=h&&this.startIndices[h]>=a;){l=this.startIndices[h];if(i[St(this.startIndicesFeature[h]).toString()]){if(n!==o){this.drawElements(t,e,n,o);t.clear(t.DEPTH_BUFFER_BIT)}o=l}h--;n=l}if(n!==o){this.drawElements(t,e,n,o);t.clear(t.DEPTH_BUFFER_BIT)}n=o=a}};t.prototype.setFillStyle_=function(t,e){t.uniform4fv(this.defaultLocations_.u_color,e)};t.prototype.setFillStrokeStyle=function(t,e){var i=t?t.getColor():[0,0,0,0];i=i instanceof CanvasGradient||i instanceof CanvasPattern?Bc:Je(i).map(function(t,e){return 3!=e?t/255:t})||Bc;if(!this.state_.fillColor||!Ar(i,this.state_.fillColor)){this.state_.fillColor=i;this.state_.changed=!0;this.styles_.push(i)}if(e)this.lineStringReplay.setFillStrokeStyle(null,e);else{var r=new gr({color:[0,0,0,0],lineWidth:0});this.lineStringReplay.setFillStrokeStyle(null,r)}};return t}(Uc),Ip=function(t,e){this.space_=e;this.emptyBlocks_=[{x:0,y:0,width:t,height:t}];this.entries_={};this.context_=ii(t,t);this.canvas_=this.context_.canvas};Ip.prototype.get=function(t){return this.entries_[t]||null};Ip.prototype.add=function(t,e,i,r,n){for(var o=this,s=0,a=this.emptyBlocks_.length;s<a;++s){var h=o.emptyBlocks_[s];if(h.width>=e+o.space_&&h.height>=i+o.space_){var l={offsetX:h.x+o.space_,offsetY:h.y+o.space_,image:o.canvas_};o.entries_[t]=l;r.call(n,o.context_,h.x+o.space_,h.y+o.space_);o.split_(s,h,e+o.space_,i+o.space_);return l}}return null};Ip.prototype.split_=function(t,e,i,r){var n,o,s=e.width-i;if(e.height-r<s){n={x:e.x+i,y:e.y,width:e.width-i,height:e.height};o={x:e.x,y:e.y+r,width:i,height:e.height-r};this.updateBlocks_(t,n,o)}else{n={x:e.x+i,y:e.y,width:e.width-i,height:r};o={x:e.x,y:e.y+r,width:e.width,height:e.height-r};this.updateBlocks_(t,n,o)}};Ip.prototype.updateBlocks_=function(t,e,i){var r=[t,1];0<e.width&&0<e.height&&r.push(e);0<i.width&&0<i.height&&r.push(i);this.emptyBlocks_.splice.apply(this.emptyBlocks_,r)};var wp=function(t){var e=t||{};this.currentSize_=void 0!==e.initialSize?e.initialSize:256;this.maxSize_=void 0!==e.maxSize?e.maxSize:void 0!==mi?mi:2048;this.space_=void 0!==e.space?e.space:1;this.atlases_=[new Ip(this.currentSize_,this.space_)];this.currentHitSize_=this.currentSize_;this.hitAtlases_=[new Ip(this.currentHitSize_,this.space_)]};wp.prototype.getInfo=function(t){var e=this.getInfo_(this.atlases_,t);if(!e)return null;var i=this.getInfo_(this.hitAtlases_,t);return this.mergeInfos_(e,i)};wp.prototype.getInfo_=function(t,e){for(var i=0,r=t.length;i<r;++i){var n=t[i].get(e);if(n)return n}return null};wp.prototype.mergeInfos_=function(t,e){return{offsetX:t.offsetX,offsetY:t.offsetY,image:t.image,hitImage:e.image}};wp.prototype.add=function(t,e,i,r,n,o){if(e+this.space_>this.maxSize_||i+this.space_>this.maxSize_)return null;var s=this.add_(!1,t,e,i,r,o);if(!s)return null;var a=void 0!==n?n:L,h=this.add_(!0,t,e,i,a,o);return this.mergeInfos_(s,h)};wp.prototype.add_=function(t,e,i,r,n,o){var s,a,h,l,u=t?this.hitAtlases_:this.atlases_;for(h=0,l=u.length;h<l;++h){if(a=(s=u[h]).add(e,i,r,n,o))return a;if(!a&&h===l-1){var c=void 0;if(t){c=Math.min(2*this.currentHitSize_,this.maxSize_);this.currentHitSize_=c}else{c=Math.min(2*this.currentSize_,this.maxSize_);this.currentSize_=c}s=new Ip(c,this.space_);u.push(s);++l}}return null};var Lp=function(i){function t(t,e){i.call(this,t,e);this.images_=[];this.textures_=[];this.measureCanvas_=ii(0,0).canvas;this.state_={strokeColor:null,lineCap:void 0,lineDash:null,lineDashOffset:void 0,lineJoin:void 0,lineWidth:0,miterLimit:void 0,fillColor:null,font:void 0,scale:void 0};this.text_="";this.textAlign_=void 0;this.textBaseline_=void 0;this.offsetX_=void 0;this.offsetY_=void 0;this.atlases_={};this.currAtlas_=void 0;this.scale=1;this.opacity=1}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.drawText=function(t,e){var i=this;if(this.text_){var r=null,n=2,o=2;switch(t.getType()){case kt.POINT:case kt.MULTI_POINT:n=(r=t.getFlatCoordinates()).length;o=t.getStride();break;case kt.CIRCLE:r=t.getCenter();break;case kt.LINE_STRING:r=t.getFlatMidpoint();break;case kt.MULTI_LINE_STRING:n=(r=t.getFlatMidpoints()).length;break;case kt.POLYGON:r=t.getFlatInteriorPoint();break;case kt.MULTI_POLYGON:n=(r=t.getFlatInteriorPoints()).length}this.startIndices.push(this.indices.length);this.startIndicesFeature.push(e);var s,a,h,l,u,c,p,d,f=this.currAtlas_,_=this.text_.split("\n"),g=this.getTextSize_(_),y=Math.round(g[0]*this.textAlign_-this.offsetX_),v=Math.round(g[1]*this.textBaseline_-this.offsetY_),m=this.state_.lineWidth/2*this.state_.scale;for(s=0,a=_.length;s<a;++s){u=0;c=f.height*s;for(h=0,l=(p=_[s].split("")).length;h<l;++h){if(d=f.atlas.getInfo(p[h])){var x=d.image;i.anchorX=y-u;i.anchorY=v-c;i.originX=0===h?d.offsetX-m:d.offsetX;i.originY=d.offsetY;i.height=f.height;i.width=0===h||h===p.length-1?f.width[p[h]]+m:f.width[p[h]];i.imageHeight=x.height;i.imageWidth=x.width;if(0===i.images_.length)i.images_.push(x);else{if(St(i.images_[i.images_.length-1])!=St(x)){i.groupIndices.push(i.indices.length);i.images_.push(x)}}i.drawText_(r,0,n,o)}u+=i.width}}}};t.prototype.getTextSize_=function(t){var o=this,s=this.currAtlas_,e=t.length*s.height;return[t.map(function(t){for(var e=0,i=0,r=t.length;i<r;++i){var n=t[i];s.width[n]||o.addCharToAtlas_(n);e+=s.width[n]?s.width[n]:0}return e}).reduce(function(t,e){return Math.max(t,e)}),e]};t.prototype.drawText_=function(t,e,i,r){for(var n=e,o=i;n<o;n+=r)this.drawCoordinates(t,e,i,r)};t.prototype.addCharToAtlas_=function(r){if(1===r.length){var t=this.currAtlas_,n=this.state_,e=this.measureCanvas_.getContext("2d");e.font=n.font;var i=Math.ceil(e.measureText(r).width*n.scale);t.atlas.add(r,i,t.height,function(t,e,i){t.font=n.font;t.fillStyle=n.fillColor;t.strokeStyle=n.strokeColor;t.lineWidth=n.lineWidth;t.lineCap=n.lineCap;t.lineJoin=n.lineJoin;t.miterLimit=n.miterLimit;t.textAlign="left";t.textBaseline="top";if(Pi&&n.lineDash){t.setLineDash(n.lineDash);t.lineDashOffset=n.lineDashOffset}1!==n.scale&&t.setTransform(n.scale,0,0,n.scale,0,0);n.strokeColor&&t.strokeText(r,e,i);n.fillColor&&t.fillText(r,e,i)})&&(t.width[r]=i)}};t.prototype.finish=function(t){var e=t.getGL();this.groupIndices.push(this.indices.length);this.hitDetectionGroupIndices=this.groupIndices;this.verticesBuffer=new qc(this.vertices);this.indicesBuffer=new qc(this.indices);this.createTextures(this.textures_,this.images_,{},e);this.state_={strokeColor:null,lineCap:void 0,lineDash:null,lineDashOffset:void 0,lineJoin:void 0,lineWidth:0,miterLimit:void 0,fillColor:null,font:void 0,scale:void 0};this.text_="";this.textAlign_=void 0;this.textBaseline_=void 0;this.offsetX_=void 0;this.offsetY_=void 0;this.images_=null;this.atlases_={};this.currAtlas_=void 0;i.prototype.finish.call(this,t)};t.prototype.setTextStyle=function(t){var e=this.state_,i=t.getFill(),r=t.getStroke();if(t&&t.getText()&&(i||r)){if(i){var n=i.getColor();e.fillColor=ti(n||Bc)}else e.fillColor=null;if(r){var o=r.getColor();e.strokeColor=ti(o||Wc);e.lineWidth=r.getWidth()||1;e.lineCap=r.getLineCap()||Vc;e.lineDashOffset=r.getLineDashOffset()||0;e.lineJoin=r.getLineJoin()||zc;e.miterLimit=r.getMiterLimit()||10;var s=r.getLineDash();e.lineDash=s?s.slice():Xc}else{e.strokeColor=null;e.lineWidth=0}e.font=t.getFont()||Yc;e.scale=t.getScale()||1;this.text_=t.getText();var a=Eu[t.getTextAlign()],h=Eu[t.getTextBaseline()];this.textAlign_=void 0===a?.5:a;this.textBaseline_=void 0===h?.5:h;this.offsetX_=t.getOffsetX()||0;this.offsetY_=t.getOffsetY()||0;this.rotateWithView=!!t.getRotateWithView();this.rotation=t.getRotation()||0;this.currAtlas_=this.getAtlas_(e)}else this.text_=""};t.prototype.getAtlas_=function(t){var e=[];for(var i in t)(t[i]||0===t[i])&&(Array.isArray(t[i])?e=e.concat(t[i]):e.push(t[i]));var r=this.calculateHash_(e);if(!this.atlases_[r]){var n=this.measureCanvas_.getContext("2d");n.font=t.font;var o=Math.ceil((1.5*n.measureText("M").width+t.lineWidth/2)*t.scale);this.atlases_[r]={atlas:new wp({space:t.lineWidth+1}),width:{},height:o}}return this.atlases_[r]};t.prototype.calculateHash_=function(t){for(var e="",i=0,r=t.length;i<r;++i)e+=t[i];return e};t.prototype.getTextures=function(t){return this.textures_};t.prototype.getHitDetectionTextures=function(){return this.textures_};return t}(sp),Op=[1,1],Pp={Circle:Jc,Image:ap,LineString:xp,Polygon:Rp,Text:Lp},bp=function(r){function t(t,e,i){r.call(this);this.maxExtent_=e;this.tolerance_=t;this.renderBuffer_=i;this.replaysByZIndex_={}}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.addDeclutter=function(t,e){};t.prototype.getDeleteResourcesFunction=function(t){var e,n=[];for(e in this.replaysByZIndex_){var i=this.replaysByZIndex_[e];for(var r in i)n.push(i[r].getDeleteResourcesFunction(t))}return function(){for(var t,e=arguments,i=n.length,r=0;r<i;r++)t=n[r].apply(this,e);return t}};t.prototype.finish=function(t){var e;for(e in this.replaysByZIndex_){var i=this.replaysByZIndex_[e];for(var r in i)i[r].finish(t)}};t.prototype.getReplay=function(t,e){var i=void 0!==t?t.toString():"0",r=this.replaysByZIndex_[i];if(void 0===r){r={};this.replaysByZIndex_[i]=r}var n=r[e];if(void 0===n){n=new Pp[e](this.tolerance_,this.maxExtent_);r[e]=n}return n};t.prototype.isEmpty=function(){return Ct(this.replaysByZIndex_)};t.prototype.replay=function(t,e,i,r,n,o,s,a){var h,l,u,c,p,d,f=Object.keys(this.replaysByZIndex_).map(Number);f.sort(wr);for(h=0,l=f.length;h<l;++h){p=this.replaysByZIndex_[f[h].toString()];for(u=0,c=xu.length;u<c;++u){d=p[xu[u]];void 0!==d&&d.replay(t,e,i,r,n,o,s,a,void 0,!1)}}};t.prototype.replayHitDetection_=function(t,e,i,r,n,o,s,a,h,l,u){var c,p,d,f,_,g,y=Object.keys(this.replaysByZIndex_).map(Number);y.sort(function(t,e){return e-t});for(c=0,p=y.length;c<p;++c){f=this.replaysByZIndex_[y[c].toString()];for(d=xu.length-1;0<=d;--d)if(void 0!==(_=f[xu[d]])&&(g=_.replay(t,e,i,r,n,o,s,a,h,l,u)))return g}};t.prototype.forEachFeatureAtCoordinate=function(t,e,i,r,n,o,s,a,h,l){var u,c=e.getGL();c.bindFramebuffer(c.FRAMEBUFFER,e.getHitDetectionFramebuffer());void 0!==this.renderBuffer_&&(u=k(H(t),r*this.renderBuffer_));return this.replayHitDetection_(e,t,r,n,Op,s,a,h,function(t){var e=new Uint8Array(4);c.readPixels(0,0,1,1,c.RGBA,c.UNSIGNED_BYTE,e);if(0<e[3]){var i=l(t);if(i)return i}},!0,u)};t.prototype.hasFeatureAtCoordinate=function(t,e,i,r,n,o,s,a,h){var l=e.getGL();l.bindFramebuffer(l.FRAMEBUFFER,e.getHitDetectionFramebuffer());return void 0!==this.replayHitDetection_(e,t,r,n,Op,s,a,h,function(t){var e=new Uint8Array(4);l.readPixels(0,0,1,1,l.RGBA,l.UNSIGNED_BYTE,e);return 0<e[3]},!1)};return t}(pu),Mp=function(a){function t(t,e,i,r,n,o,s){a.call(this);this.context_=t;this.center_=e;this.extent_=o;this.pixelRatio_=s;this.size_=n;this.rotation_=r;this.resolution_=i;this.imageStyle_=null;this.fillStyle_=null;this.strokeStyle_=null;this.textStyle_=null}a&&(t.__proto__=a);((t.prototype=Object.create(a&&a.prototype)).constructor=t).prototype.drawText_=function(t,e){var i=this.context_,r=t.getReplay(0,du.TEXT);r.setTextStyle(this.textStyle_);r.drawText(e,null);r.finish(i);r.replay(this.context_,this.center_,this.resolution_,this.rotation_,this.size_,this.pixelRatio_,1,{},void 0,!1);r.getDeleteResourcesFunction(i)()};t.prototype.setStyle=function(t){this.setFillStrokeStyle(t.getFill(),t.getStroke());this.setImageStyle(t.getImage());this.setTextStyle(t.getText())};t.prototype.drawGeometry=function(t){switch(t.getType()){case kt.POINT:this.drawPoint(t,null);break;case kt.LINE_STRING:this.drawLineString(t,null);break;case kt.POLYGON:this.drawPolygon(t,null);break;case kt.MULTI_POINT:this.drawMultiPoint(t,null);break;case kt.MULTI_LINE_STRING:this.drawMultiLineString(t,null);break;case kt.MULTI_POLYGON:this.drawMultiPolygon(t,null);break;case kt.GEOMETRY_COLLECTION:this.drawGeometryCollection(t,null);break;case kt.CIRCLE:this.drawCircle(t,null)}};t.prototype.drawFeature=function(t,e){var i=e.getGeometryFunction()(t);if(i&&Rt(this.extent_,i.getExtent())){this.setStyle(e);this.drawGeometry(i)}};t.prototype.drawGeometryCollection=function(t,e){var i,r,n=t.getGeometriesArray();for(i=0,r=n.length;i<r;++i)this.drawGeometry(n[i])};t.prototype.drawPoint=function(t,e){var i=this.context_,r=new bp(1,this.extent_),n=r.getReplay(0,du.IMAGE);n.setImageStyle(this.imageStyle_);n.drawPoint(t,e);n.finish(i);n.replay(this.context_,this.center_,this.resolution_,this.rotation_,this.size_,this.pixelRatio_,1,{},void 0,!1);n.getDeleteResourcesFunction(i)();this.textStyle_&&this.drawText_(r,t)};t.prototype.drawMultiPoint=function(t,e){var i=this.context_,r=new bp(1,this.extent_),n=r.getReplay(0,du.IMAGE);n.setImageStyle(this.imageStyle_);n.drawMultiPoint(t,e);n.finish(i);n.replay(this.context_,this.center_,this.resolution_,this.rotation_,this.size_,this.pixelRatio_,1,{},void 0,!1);n.getDeleteResourcesFunction(i)();this.textStyle_&&this.drawText_(r,t)};t.prototype.drawLineString=function(t,e){var i=this.context_,r=new bp(1,this.extent_),n=r.getReplay(0,du.LINE_STRING);n.setFillStrokeStyle(null,this.strokeStyle_);n.drawLineString(t,e);n.finish(i);n.replay(this.context_,this.center_,this.resolution_,this.rotation_,this.size_,this.pixelRatio_,1,{},void 0,!1);n.getDeleteResourcesFunction(i)();this.textStyle_&&this.drawText_(r,t)};t.prototype.drawMultiLineString=function(t,e){var i=this.context_,r=new bp(1,this.extent_),n=r.getReplay(0,du.LINE_STRING);n.setFillStrokeStyle(null,this.strokeStyle_);n.drawMultiLineString(t,e);n.finish(i);n.replay(this.context_,this.center_,this.resolution_,this.rotation_,this.size_,this.pixelRatio_,1,{},void 0,!1);n.getDeleteResourcesFunction(i)();this.textStyle_&&this.drawText_(r,t)};t.prototype.drawPolygon=function(t,e){var i=this.context_,r=new bp(1,this.extent_),n=r.getReplay(0,du.POLYGON);n.setFillStrokeStyle(this.fillStyle_,this.strokeStyle_);n.drawPolygon(t,e);n.finish(i);n.replay(this.context_,this.center_,this.resolution_,this.rotation_,this.size_,this.pixelRatio_,1,{},void 0,!1);n.getDeleteResourcesFunction(i)();this.textStyle_&&this.drawText_(r,t)};t.prototype.drawMultiPolygon=function(t,e){var i=this.context_,r=new bp(1,this.extent_),n=r.getReplay(0,du.POLYGON);n.setFillStrokeStyle(this.fillStyle_,this.strokeStyle_);n.drawMultiPolygon(t,e);n.finish(i);n.replay(this.context_,this.center_,this.resolution_,this.rotation_,this.size_,this.pixelRatio_,1,{},void 0,!1);n.getDeleteResourcesFunction(i)();this.textStyle_&&this.drawText_(r,t)};t.prototype.drawCircle=function(t,e){var i=this.context_,r=new bp(1,this.extent_),n=r.getReplay(0,du.CIRCLE);n.setFillStrokeStyle(this.fillStyle_,this.strokeStyle_);n.drawCircle(t,e);n.finish(i);n.replay(this.context_,this.center_,this.resolution_,this.rotation_,this.size_,this.pixelRatio_,1,{},void 0,!1);n.getDeleteResourcesFunction(i)();this.textStyle_&&this.drawText_(r,t)};t.prototype.setImageStyle=function(t){this.imageStyle_=t};t.prototype.setFillStrokeStyle=function(t,e){this.fillStyle_=t;this.strokeStyle_=e};t.prototype.setTextStyle=function(t){this.textStyle_=t};return t}(Zl),Fp=new Fc("precision mediump float;\nvarying vec2 v_texCoord;\n\n\nuniform float u_opacity;\nuniform sampler2D u_texture;\n\nvoid main(void) {\n  vec4 texColor = texture2D(u_texture, v_texCoord);\n  gl_FragColor.rgb = texColor.rgb;\n  gl_FragColor.a = texColor.a * u_opacity;\n}\n"),Ap=new Ac("varying vec2 v_texCoord;\n\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nuniform mat4 u_texCoordMatrix;\nuniform mat4 u_projectionMatrix;\n\nvoid main(void) {\n  gl_Position = u_projectionMatrix * vec4(a_position, 0., 1.);\n  v_texCoord = (u_texCoordMatrix * vec4(a_texCoord, 0., 1.)).st;\n}\n\n\n"),Np=function(t,e){this.u_texCoordMatrix=t.getUniformLocation(e,"u_texCoordMatrix");this.u_projectionMatrix=t.getUniformLocation(e,"u_projectionMatrix");this.u_opacity=t.getUniformLocation(e,"u_opacity");this.u_texture=t.getUniformLocation(e,"u_texture");this.a_position=t.getAttribLocation(e,"a_position");this.a_texCoord=t.getAttribLocation(e,"a_texCoord")},Dp=function(i){function t(t,e){i.call(this,e);this.mapRenderer=t;this.arrayBuffer_=new qc([-1,-1,0,0,1,-1,1,0,-1,1,0,1,1,1,1,1]);this.texture=null;this.framebuffer=null;this.framebufferDimension=void 0;this.texCoordMatrix=[1,0,0,1,0,0];this.projectionMatrix=[1,0,0,1,0,0];this.tmpMat4_=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];this.defaultLocations_=null}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.bindFramebuffer=function(t,e){var i=this.mapRenderer.getGL();if(void 0===this.framebufferDimension||this.framebufferDimension!=e){var r=function(t,e,i){if(!t.isContextLost()){t.deleteFramebuffer(e);t.deleteTexture(i)}}.bind(null,i,this.framebuffer,this.texture);t.postRenderFunctions.push(r);var n=np(i,e,e),o=i.createFramebuffer();i.bindFramebuffer(gi,o);i.framebufferTexture2D(gi,36064,fi,n,0);this.texture=n;this.framebuffer=o;this.framebufferDimension=e}else i.bindFramebuffer(gi,this.framebuffer)};t.prototype.composeFrame=function(t,e,i){this.dispatchComposeEvent_(ao.PRECOMPOSE,i,t);i.bindBuffer(hi,this.arrayBuffer_);var r,n=i.getGL(),o=i.getProgram(Fp,Ap);if(this.defaultLocations_)r=this.defaultLocations_;else{r=new Np(n,o);this.defaultLocations_=r}if(i.useProgram(o)){n.enableVertexAttribArray(r.a_position);n.vertexAttribPointer(r.a_position,2,li,!1,16,0);n.enableVertexAttribArray(r.a_texCoord);n.vertexAttribPointer(r.a_texCoord,2,li,!1,16,8);n.uniform1i(r.u_texture,0)}n.uniformMatrix4fv(r.u_texCoordMatrix,!1,jc(this.tmpMat4_,this.getTexCoordMatrix()));n.uniformMatrix4fv(r.u_projectionMatrix,!1,jc(this.tmpMat4_,this.getProjectionMatrix()));n.uniform1f(r.u_opacity,e.opacity);n.bindTexture(fi,this.getTexture());n.drawArrays(5,0,4);this.dispatchComposeEvent_(ao.POSTCOMPOSE,i,t)};t.prototype.dispatchComposeEvent_=function(t,e,i){var r=this.getLayer();if(r.hasListener(t)){var n=i.viewState,o=n.resolution,s=i.pixelRatio,a=i.extent,h=n.center,l=n.rotation,u=i.size,c=new Mp(e,h,o,l,u,a,s),p=new Kl(t,c,i,null,e);r.dispatchEvent(p)}};t.prototype.getTexCoordMatrix=function(){return this.texCoordMatrix};t.prototype.getTexture=function(){return this.texture};t.prototype.getProjectionMatrix=function(){return this.projectionMatrix};t.prototype.handleWebGLContextLost=function(){this.texture=null;this.framebuffer=null;this.framebufferDimension=void 0};t.prototype.prepareFrame=function(t,e,i){};t.prototype.forEachLayerAtPixel=function(t,e,i,r){};return t}(ou),Gp=function(i){function t(t,e){i.call(this,t,e);this.image_=null;this.hitCanvasContext_=null;this.hitTransformationMatrix_=null}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.createTexture_=function(t){var e=t.getImage();return op(this.mapRenderer.getGL(),e,_i,_i)};t.prototype.forEachFeatureAtCoordinate=function(t,e,i,r,n){var o=this.getLayer(),s=o.getSource(),a=e.viewState.resolution,h=e.viewState.rotation,l=e.skippedFeatureUids;return s.forEachFeatureAtCoordinate(t,a,h,i,l,function(t){return r.call(n,t,o)})};t.prototype.prepareFrame=function(t,e,i){var r=this.mapRenderer.getGL(),n=t.pixelRatio,o=t.viewState,s=o.center,a=o.resolution,h=o.rotation,l=this.image_,u=this.texture,c=this.getLayer().getSource(),p=t.viewHints,d=t.extent;void 0!==e.extent&&(d=pt(d,e.extent));if(!p[bs.ANIMATING]&&!p[bs.INTERACTING]&&!gt(d)){var f=o.projection,_=c.getImage(d,a,n,f);if(_){if(this.loadImage(_)){l=_;u=this.createTexture_(_);if(this.texture){var g=function(t,e){t.isContextLost()||t.deleteTexture(e)}.bind(null,r,this.texture);t.postRenderFunctions.push(g)}}}}if(l){var y=this.mapRenderer.getContext().getCanvas();this.updateProjectionMatrix_(y.width,y.height,n,s,a,h,l.getExtent());this.hitTransformationMatrix_=null;var v=this.texCoordMatrix;Me(v);ke(v,1,-1);je(v,0,-1);this.image_=l;this.texture=u}return!!l};t.prototype.updateProjectionMatrix_=function(t,e,i,r,n,o,s){var a=t*n,h=e*n,l=this.projectionMatrix;Me(l);ke(l,2*i/a,2*i/h);Ge(l,-o);je(l,s[0]-r[0],s[1]-r[1]);ke(l,(s[2]-s[0])/2,(s[3]-s[1])/2);je(l,1,1)};t.prototype.hasFeatureAtCoordinate=function(t,e){return void 0!==this.forEachFeatureAtCoordinate(t,e,0,v,this)};t.prototype.forEachLayerAtPixel=function(t,e,i,r){if(this.image_&&this.image_.getImage()){if(this.getLayer().getSource().forEachFeatureAtCoordinate!==L){var n=De(e.pixelToCoordinateTransform,t.slice());return this.forEachFeatureAtCoordinate(n,e,0,v,this)?i.call(r,this.getLayer(),null):void 0}var o=[this.image_.getImage().width,this.image_.getImage().height];this.hitTransformationMatrix_||(this.hitTransformationMatrix_=this.getHitTransformationMatrix_(e.size,o));var s=De(this.hitTransformationMatrix_,t.slice());if(!(s[0]<0||s[0]>o[0]||s[1]<0||s[1]>o[1])){this.hitCanvasContext_||(this.hitCanvasContext_=ii(1,1));this.hitCanvasContext_.clearRect(0,0,1,1);this.hitCanvasContext_.drawImage(this.image_.getImage(),s[0],s[1],1,1,0,0,1,1);var a=this.hitCanvasContext_.getImageData(0,0,1,1).data;return 0<a[3]?i.call(r,this.getLayer(),a):void 0}}};t.prototype.getHitTransformationMatrix_=function(t,e){var i=[1,0,0,1,0,0];je(i,-1,-1);ke(i,2/t[0],2/t[1]);je(i,0,t[1]);ke(i,1,-1);var r=Ye(this.projectionMatrix.slice()),n=[1,0,0,1,0,0];je(n,0,e[1]);ke(n,1,-1);ke(n,e[0]/2,e[1]/2);je(n,1,1);Fe(n,r);Fe(n,i);return n};return t}(Dp);Gp.handles=function(t){return t.getType()===Io.IMAGE};Gp.create=function(t,e){return new Gp(t,e)};var kp=function(i){function t(t){i.call(this,t);var e=t.getViewport();this.canvas_=document.createElement("canvas");this.canvas_.style.width="100%";this.canvas_.style.height="100%";this.canvas_.style.display="block";this.canvas_.className=ki;e.insertBefore(this.canvas_,e.childNodes[0]||null);this.clipTileCanvasWidth_=0;this.clipTileCanvasHeight_=0;this.clipTileContext_=ii();this.renderedVisible_=!0;this.gl_=vi(this.canvas_,{antialias:!0,depth:!0,failIfMajorPerformanceCaveat:!0,preserveDrawingBuffer:!1,stencil:!0});this.context_=new ip(this.canvas_,this.gl_);S(this.canvas_,ep.LOST,this.handleWebGLContextLost,this);S(this.canvas_,ep.RESTORED,this.handleWebGLContextRestored,this);this.textureCache_=new Vi;this.focus_=null;this.tileTextureQueue_=new ms(function(t){var e=t[1],i=t[2],r=e[0]-this.focus_[0],n=e[1]-this.focus_[1];return 65536*Math.log(i)+Math.sqrt(r*r+n*n)/i}.bind(this),function(t){return t[0].getKey()});this.loadNextTileTexture_=function(t,e){if(!this.tileTextureQueue_.isEmpty()){this.tileTextureQueue_.reprioritize();var i=this.tileTextureQueue_.dequeue(),r=i[0],n=i[3],o=i[4];this.bindTileTexture(r,n,o,ci,ci)}return!1}.bind(this);this.textureCacheFrameMarkerCount_=0;this.initializeGL_()}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.bindTileTexture=function(t,e,i,r,n){var o=this.getGL(),s=t.getKey();if(this.textureCache_.containsKey(s)){var a=this.textureCache_.get(s);o.bindTexture(fi,a.texture);if(a.magFilter!=r){o.texParameteri(fi,10240,r);a.magFilter=r}if(a.minFilter!=n){o.texParameteri(fi,10241,n);a.minFilter=n}}else{var h=o.createTexture();o.bindTexture(fi,h);if(0<i){var l=this.clipTileContext_.canvas,u=this.clipTileContext_;if(this.clipTileCanvasWidth_!==e[0]||this.clipTileCanvasHeight_!==e[1]){l.width=e[0];l.height=e[1];this.clipTileCanvasWidth_=e[0];this.clipTileCanvasHeight_=e[1]}else u.clearRect(0,0,e[0],e[1]);u.drawImage(t.getImage(),i,i,e[0],e[1],0,0,e[0],e[1]);o.texImage2D(fi,0,ui,ui,5121,l)}else o.texImage2D(fi,0,ui,ui,5121,t.getImage());o.texParameteri(fi,10240,r);o.texParameteri(fi,10241,n);o.texParameteri(fi,pi,_i);o.texParameteri(fi,di,_i);this.textureCache_.set(s,{texture:h,magFilter:r,minFilter:n})}};t.prototype.dispatchRenderEvent=function(t,e){var i=this.getMap();if(i.hasListener(t)){var r=this.context_,n=e.extent,o=e.size,s=e.viewState,a=e.pixelRatio,h=s.resolution,l=s.center,u=s.rotation,c=new Mp(r,l,h,u,o,n,a),p=new Kl(t,c,e,null,r);i.dispatchEvent(p)}};t.prototype.disposeInternal=function(){var e=this.getGL();e.isContextLost()||this.textureCache_.forEach(function(t){t&&e.deleteTexture(t.texture)});this.context_.dispose();i.prototype.disposeInternal.call(this)};t.prototype.expireCache_=function(t,e){for(var i,r=this.getGL();1024<this.textureCache_.getCount()-this.textureCacheFrameMarkerCount_;){if(i=this.textureCache_.peekLast())r.deleteTexture(i.texture);else{if(+this.textureCache_.peekLastKey()==e.index)break;--this.textureCacheFrameMarkerCount_}this.textureCache_.pop()}};t.prototype.getContext=function(){return this.context_};t.prototype.getGL=function(){return this.gl_};t.prototype.getTileTextureQueue=function(){return this.tileTextureQueue_};t.prototype.handleWebGLContextLost=function(t){t.preventDefault();this.textureCache_.clear();this.textureCacheFrameMarkerCount_=0;var e=this.getLayerRenderers();for(var i in e){e[i].handleWebGLContextLost()}};t.prototype.handleWebGLContextRestored=function(){this.initializeGL_();this.getMap().render()};t.prototype.initializeGL_=function(){var t=this.gl_;t.activeTexture(33984);t.blendFuncSeparate(770,771,1,771);t.disable(2884);t.disable(2929);t.disable(3089);t.disable(2960)};t.prototype.isTileTextureLoaded=function(t){return this.textureCache_.containsKey(t.getKey())};t.prototype.renderFrame=function(t){var e=this.getContext(),i=this.getGL();if(i.isContextLost())return!1;if(!t){if(this.renderedVisible_){this.canvas_.style.display="none";this.renderedVisible_=!1}return!1}this.focus_=t.focus;this.textureCache_.set((-t.index).toString(),null);++this.textureCacheFrameMarkerCount_;this.dispatchRenderEvent(ao.PRECOMPOSE,t);var r=[],n=t.layerStatesArray;Nr(n,iu);var o,s,a,h=t.viewState.resolution;for(o=0,s=n.length;o<s;++o)Js(a=n[o],h)&&a.sourceState==Ys.READY&&this.getLayerRenderer(a.layer).prepareFrame(t,a,e)&&r.push(a);var l=t.size[0]*t.pixelRatio,u=t.size[1]*t.pixelRatio;if(this.canvas_.width!=l||this.canvas_.height!=u){this.canvas_.width=l;this.canvas_.height=u}i.bindFramebuffer(gi,null);i.clearColor(0,0,0,0);i.clear(16384);i.enable(3042);i.viewport(0,0,this.canvas_.width,this.canvas_.height);for(o=0,s=r.length;o<s;++o){a=r[o];this.getLayerRenderer(a.layer).composeFrame(t,a,e)}if(!this.renderedVisible_){this.canvas_.style.display="";this.renderedVisible_=!0}this.calculateMatrices2D(t);1024<this.textureCache_.getCount()-this.textureCacheFrameMarkerCount_&&t.postRenderFunctions.push(this.expireCache_.bind(this));if(!this.tileTextureQueue_.isEmpty()){t.postRenderFunctions.push(this.loadNextTileTexture_);t.animate=!0}this.dispatchRenderEvent(ao.POSTCOMPOSE,t);this.scheduleRemoveUnusedLayerRenderers(t);this.scheduleExpireIconCache(t)};t.prototype.forEachFeatureAtCoordinate=function(t,e,i,r,n,o,s){var a;if(this.getGL().isContextLost())return!1;var h,l=e.viewState,u=e.layerStatesArray;for(h=u.length-1;0<=h;--h){var c=u[h],p=c.layer;if(Js(c,l.resolution)&&o.call(s,p)){if(a=this.getLayerRenderer(p).forEachFeatureAtCoordinate(t,e,i,r,n))return a}}};t.prototype.hasFeatureAtCoordinate=function(t,e,i,r,n){var o=!1;if(this.getGL().isContextLost())return!1;var s,a=e.viewState,h=e.layerStatesArray;for(s=h.length-1;0<=s;--s){var l=h[s],u=l.layer;if(Js(l,a.resolution)&&r.call(n,u)){if(o=this.getLayerRenderer(u).hasFeatureAtCoordinate(t,e))return!0}}return o};t.prototype.forEachLayerAtPixel=function(t,e,i,r,n,o,s){if(this.getGL().isContextLost())return!1;var a,h,l=e.viewState,u=e.layerStatesArray;for(h=u.length-1;0<=h;--h){var c=u[h],p=c.layer;if(Js(c,l.resolution)&&o.call(n,p)){if(a=this.getLayerRenderer(p).forEachLayerAtPixel(t,e,r,n))return a}}};return t}(tu),jp=new Fc("precision mediump float;\nvarying vec2 v_texCoord;\n\n\nuniform sampler2D u_texture;\n\nvoid main(void) {\n  gl_FragColor = texture2D(u_texture, v_texCoord);\n}\n"),Up=new Ac("varying vec2 v_texCoord;\n\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nuniform vec4 u_tileOffset;\n\nvoid main(void) {\n  gl_Position = vec4(a_position * u_tileOffset.xy + u_tileOffset.zw, 0., 1.);\n  v_texCoord = a_texCoord;\n}\n\n\n"),Yp=function(t,e){this.u_tileOffset=t.getUniformLocation(e,"u_tileOffset");this.u_texture=t.getUniformLocation(e,"u_texture");this.a_position=t.getAttribLocation(e,"a_position");this.a_texCoord=t.getAttribLocation(e,"a_texCoord")},Bp=function(i){function t(t,e){i.call(this,t,e);this.fragmentShader_=jp;this.vertexShader_=Up;this.locations_=null;this.renderArrayBuffer_=new qc([0,0,0,1,1,0,1,1,0,1,0,0,1,1,1,0]);this.renderedTileRange_=null;this.renderedFramebufferExtent_=null;this.renderedRevision_=-1;this.tmpSize_=[0,0]}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.disposeInternal=function(){this.mapRenderer.getContext().deleteBuffer(this.renderArrayBuffer_);i.prototype.disposeInternal.call(this)};t.prototype.createLoadedTileFinder=function(e,r,n){var o=this.mapRenderer;return function(i,t){return e.forEachLoadedTile(r,i,t,function(t){var e=o.isTileTextureLoaded(t);if(e){n[i]||(n[i]={});n[i][t.tileCoord.toString()]=t}return e})}};t.prototype.handleWebGLContextLost=function(){i.prototype.handleWebGLContextLost.call(this);this.locations_=null};t.prototype.prepareFrame=function(t,e,i){var r,n=this.mapRenderer,o=i.getGL(),s=t.viewState,a=s.projection,h=this.getLayer(),l=h.getSource(),u=l.getTileGridForProjection(a),c=u.getZForResolution(s.resolution),p=u.getResolution(c),d=l.getTilePixelSize(c,t.pixelRatio,a),f=d[0]/Hs(u.getTileSize(c),this.tmpSize_)[0],_=p/f,g=l.getTilePixelRatio(f)*l.getGutterForProjection(a),y=s.center,v=t.extent,m=u.getTileRangeForExtentAndZ(v,c);if(this.renderedTileRange_&&this.renderedTileRange_.equals(m)&&this.renderedRevision_==l.getRevision())r=this.renderedFramebufferExtent_;else{var x=m.getSize(),E=Pt(Math.max(x[0]*d[0],x[1]*d[1])),T=_*E,S=u.getOrigin(c),C=S[0]+m.minX*d[0]*_,R=S[1]+m.minY*d[1]*_;r=[C,R,C+T,R+T];this.bindFramebuffer(t,E);o.viewport(0,0,E,E);o.clearColor(0,0,0,0);o.clear(16384);o.disable(3042);var I=i.getProgram(this.fragmentShader_,this.vertexShader_);i.useProgram(I);this.locations_||(this.locations_=new Yp(o,I));i.bindBuffer(hi,this.renderArrayBuffer_);o.enableVertexAttribArray(this.locations_.a_position);o.vertexAttribPointer(this.locations_.a_position,2,li,!1,16,0);o.enableVertexAttribArray(this.locations_.a_texCoord);o.vertexAttribPointer(this.locations_.a_texCoord,2,li,!1,16,8);o.uniform1i(this.locations_.u_texture,0);var w={};w[c]={};var L,O,P,b,M,F,A=this.createLoadedTileFinder(l,a,w),N=h.getUseInterimTilesOnError(),D=!0,G=[1/0,1/0,-1/0,-1/0],k=new lu(0,0,0,0);for(b=m.minX;b<=m.maxX;++b)for(M=m.minY;M<=m.maxY;++M){O=l.getTile(c,b,M,f,a);if(void 0===e.extent||Rt(F=u.getTileCoordExtent(O.tileCoord,G),e.extent)){(P=O.getState())==yo.LOADED||P==yo.EMPTY||P==yo.ERROR&&!N||(O=O.getInterimTile());if((P=O.getState())==yo.LOADED){if(n.isTileTextureLoaded(O)){w[c][O.tileCoord.toString()]=O;continue}}else if(P==yo.EMPTY||P==yo.ERROR&&!N)continue;D=!1;u.forEachTileCoordParentTileRange(O.tileCoord,A,null,k,G)||(L=u.getTileCoordChildTileRange(O.tileCoord,k,G))&&A(c+1,L)}}var j=Object.keys(w).map(Number);j.sort(wr);for(var U=new Float32Array(4),Y=0,B=j.length;Y<B;++Y){var V=w[j[Y]];for(var X in V){O=V[X];F=u.getTileCoordExtent(O.tileCoord,G);U[0]=2*(F[2]-F[0])/T;U[1]=2*(F[3]-F[1])/T;U[2]=2*(F[0]-r[0])/T-1;U[3]=2*(F[1]-r[1])/T-1;o.uniform4fv(this.locations_.u_tileOffset,U);n.bindTileTexture(O,d,g*f,ci,ci);o.drawArrays(5,0,4)}}if(D){this.renderedTileRange_=m;this.renderedFramebufferExtent_=r;this.renderedRevision_=l.getRevision()}else{this.renderedTileRange_=null;this.renderedFramebufferExtent_=null;this.renderedRevision_=-1;t.animate=!0}}this.updateUsedTiles(t.usedTiles,l,c,m);var z=n.getTileTextureQueue();this.manageTilePyramid(t,l,u,f,a,v,c,h.getPreload(),function(t){t.getState()!=yo.LOADED||n.isTileTextureLoaded(t)||z.isKeyQueued(t.getKey())||z.enqueue([t,u.getTileCoordCenter(t.tileCoord),u.getResolution(t.tileCoord[0]),d,g*f])},this);this.scheduleExpireCache(t,l);var W=this.texCoordMatrix;Me(W);je(W,(Math.round(y[0]/p)*p-r[0])/(r[2]-r[0]),(Math.round(y[1]/p)*p-r[1])/(r[3]-r[1]));0!==s.rotation&&Ge(W,s.rotation);ke(W,t.size[0]*s.resolution/(r[2]-r[0]),t.size[1]*s.resolution/(r[3]-r[1]));je(W,-.5,-.5);return!0};t.prototype.forEachLayerAtPixel=function(t,e,i,r){if(this.framebuffer){var n=[t[0]/e.size[0],(e.size[1]-t[1])/e.size[1]],o=De(this.texCoordMatrix,n.slice()),s=[o[0]*this.framebufferDimension,o[1]*this.framebufferDimension],a=this.mapRenderer.getContext().getGL();a.bindFramebuffer(a.FRAMEBUFFER,this.framebuffer);var h=new Uint8Array(4);a.readPixels(s[0],s[1],1,1,a.RGBA,a.UNSIGNED_BYTE,h);return 0<h[3]?i.call(r,this.getLayer(),h):void 0}};return t}(Dp);Bp.handles=function(t){return t.getType()===Io.TILE};Bp.create=function(t,e){return new Bp(t,e)};var Vp=function(i){function t(t,e){i.call(this,t,e);this.dirty_=!1;this.renderedRevision_=-1;this.renderedResolution_=NaN;this.renderedExtent_=[1/0,1/0,-1/0,-1/0];this.renderedRenderOrder_=null;this.replayGroup_=null;this.layerState_=null}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.composeFrame=function(t,e,i){this.layerState_=e;var r=t.viewState,n=this.replayGroup_,o=t.size,s=t.pixelRatio,a=this.mapRenderer.getGL();if(n&&!n.isEmpty()){a.enable(a.SCISSOR_TEST);a.scissor(0,0,o[0]*s,o[1]*s);n.replay(i,r.center,r.resolution,r.rotation,o,s,e.opacity,e.managed?t.skippedFeatureUids:{});a.disable(a.SCISSOR_TEST)}};t.prototype.disposeInternal=function(){var t=this.replayGroup_;if(t){var e=this.mapRenderer.getContext();t.getDeleteResourcesFunction(e)();this.replayGroup_=null}i.prototype.disposeInternal.call(this)};t.prototype.forEachFeatureAtCoordinate=function(t,e,i,r,n){if(this.replayGroup_&&this.layerState_){var o=this.mapRenderer.getContext(),s=e.viewState,a=this.getLayer(),h=this.layerState_,l={};return this.replayGroup_.forEachFeatureAtCoordinate(t,o,s.center,s.resolution,s.rotation,e.size,e.pixelRatio,h.opacity,{},function(t){var e=St(t).toString();if(!(e in l)){l[e]=!0;return r.call(n,t,a)}})}};t.prototype.hasFeatureAtCoordinate=function(t,e){if(this.replayGroup_&&this.layerState_){var i=this.mapRenderer.getContext(),r=e.viewState,n=this.layerState_;return this.replayGroup_.hasFeatureAtCoordinate(t,i,r.center,r.resolution,r.rotation,e.size,e.pixelRatio,n.opacity,e.skippedFeatureUids)}return!1};t.prototype.forEachLayerAtPixel=function(t,e,i,r){var n=De(e.pixelToCoordinateTransform,t.slice());return this.hasFeatureAtCoordinate(n,e)?i.call(r,this.getLayer(),null):void 0};t.prototype.handleStyleImageChange_=function(t){this.renderIfReadyAndVisible()};t.prototype.prepareFrame=function(t,e,i){var n=this.getLayer(),r=n.getSource(),o=t.viewHints[bs.ANIMATING],s=t.viewHints[bs.INTERACTING],a=n.getUpdateWhileAnimating(),h=n.getUpdateWhileInteracting();if(!this.dirty_&&!a&&o||!h&&s)return!0;var l=t.extent,u=t.viewState,c=u.projection,p=u.resolution,d=t.pixelRatio,f=n.getRevision(),_=n.getRenderBuffer(),g=n.getRenderOrder();void 0===g&&(g=ju);var y=k(l,_*p);if(!this.dirty_&&this.renderedResolution_==p&&this.renderedRevision_==f&&this.renderedRenderOrder_==g&&Q(this.renderedExtent_,y))return!0;this.replayGroup_&&t.postRenderFunctions.push(this.replayGroup_.getDeleteResourcesFunction(i));this.dirty_=!1;var v=new bp(Yu(p,d),y,n.getRenderBuffer());r.loadFeatures(y,p,c);var m=function(t){var e,i=t.getStyleFunction()||n.getStyleFunction();i&&(e=i(t,p));if(e){var r=this.renderFeature(t,p,d,e,v);this.dirty_=this.dirty_||r}};if(g){var x=[];r.forEachFeatureInExtent(y,function(t){x.push(t)},this);x.sort(g);x.forEach(m.bind(this))}else r.forEachFeatureInExtent(y,m,this);v.finish(i);this.renderedResolution_=p;this.renderedRevision_=f;this.renderedRenderOrder_=g;this.renderedExtent_=y;this.replayGroup_=v;return!0};t.prototype.renderFeature=function(t,e,i,r,n){if(!r)return!1;var o=!1;if(Array.isArray(r))for(var s=r.length-1;0<=s;--s)o=Bu(n,t,r[s],Uu(e,i),this.handleStyleImageChange_,this)||o;else o=Bu(n,t,r,Uu(e,i),this.handleStyleImageChange_,this)||o;return o};return t}(Dp);Vp.handles=function(t){return t.getType()===Io.VECTOR};Vp.create=function(t,e){return new Vp(t,e)};var Xp=function(e){function t(t){(t=T({},t)).controls||(t.controls=ra());t.interactions||(t.interactions=Hl());e.call(this,t)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.createRenderer=function(){var t=new kp(this);t.registerLayerRenderers([Gp,Bp,Vp]);return t};return t}(Ks),zp="projection",Wp="coordinateFormat",Hp=function(r){function t(t){var e=t||{},i=document.createElement("div");i.className=void 0!==e.className?e.className:"ol-mouse-position";r.call(this,{element:i,render:e.render||Kp,target:e.target});S(this,P(zp),this.handleProjectionChanged_,this);e.coordinateFormat&&this.setCoordinateFormat(e.coordinateFormat);e.projection&&this.setProjection(e.projection);this.undefinedHTML_="undefinedHTML"in e?e.undefinedHTML:"&#160;";this.renderOnMouseOut_=!!this.undefinedHTML_;this.renderedHTML_=i.innerHTML;this.mapProjection_=null;this.transform_=null;this.lastMouseMovePixel_=null}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.handleProjectionChanged_=function(){this.transform_=null};t.prototype.getCoordinateFormat=function(){return this.get(Wp)};t.prototype.getProjection=function(){return this.get(zp)};t.prototype.handleMouseMove=function(t){var e=this.getMap();this.lastMouseMovePixel_=e.getEventPixel(t);this.updateHTML_(this.lastMouseMovePixel_)};t.prototype.handleMouseOut=function(t){this.updateHTML_(null);this.lastMouseMovePixel_=null};t.prototype.setMap=function(t){r.prototype.setMap.call(this,t);if(t){var e=t.getViewport();this.listenerKeys.push(S(e,R.MOUSEMOVE,this.handleMouseMove,this));this.renderOnMouseOut_&&this.listenerKeys.push(S(e,R.MOUSEOUT,this.handleMouseOut,this))}};t.prototype.setCoordinateFormat=function(t){this.set(Wp,t)};t.prototype.setProjection=function(t){this.set(zp,ye(t))};t.prototype.updateHTML_=function(t){var e=this.undefinedHTML_;if(t&&this.mapProjection_){if(!this.transform_){var i=this.getProjection();this.transform_=i?Re(this.mapProjection_,i):fe}var r=this.getMap().getCoordinateFromPixel(t);if(r){this.transform_(r,r);var n=this.getCoordinateFormat();e=n?n(r):r.toString()}}if(!this.renderedHTML_||e!==this.renderedHTML_){this.element.innerHTML=e;this.renderedHTML_=e}};return t}(Zs);function Kp(t){var e=t.frameState;if(e){if(this.mapProjection_!=e.viewState.projection){this.mapProjection_=e.viewState.projection;this.transform_=null}}else this.mapProjection_=null;this.updateHTML_(this.lastMouseMovePixel_)}var Zp=function(){this.dataProjection=null;this.defaultFeatureProjection=null};Zp.prototype.getReadOptions=function(t,e){var i;e&&(i={dataProjection:e.dataProjection?e.dataProjection:this.readProjection(t),featureProjection:e.featureProjection});return this.adaptOptions(i)};Zp.prototype.adaptOptions=function(t){return T({dataProjection:this.dataProjection,featureProjection:this.defaultFeatureProjection},t)};Zp.prototype.getLastExtent=function(){return null};Zp.prototype.getType=function(){};Zp.prototype.readFeature=function(t,e){};Zp.prototype.readFeatures=function(t,e){};Zp.prototype.readGeometry=function(t,e){};Zp.prototype.readProjection=function(t){};Zp.prototype.writeFeature=function(t,e){};Zp.prototype.writeFeatures=function(t,e){};Zp.prototype.writeGeometry=function(t,e){};function qp(t,e,i){var r,n=i?ye(i.featureProjection):null,o=i?ye(i.dataProjection):null;r=n&&o&&!Ce(n,o)?t instanceof Xe?(e?t.clone():t).transform(e?n:o,e?o:n):Le(t,o,n):t;if(e&&i&&void 0!==i.decimals){var s=Math.pow(10,i.decimals);r===t&&(r=r.clone());r.applyTransform(function(t){for(var e=0,i=t.length;e<i;++e)t[e]=Math.round(t[e]*s)/s;return t})}return r}var Jp=function(t){function e(){t.call(this)}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.getType=function(){return Mh.JSON};e.prototype.readFeature=function(t,e){return this.readFeatureFromObject(Qp(t),this.getReadOptions(t,e))};e.prototype.readFeatures=function(t,e){return this.readFeaturesFromObject(Qp(t),this.getReadOptions(t,e))};e.prototype.readFeatureFromObject=function(t,e){};e.prototype.readFeaturesFromObject=function(t,e){};e.prototype.readGeometry=function(t,e){return this.readGeometryFromObject(Qp(t),this.getReadOptions(t,e))};e.prototype.readGeometryFromObject=function(t,e){};e.prototype.readProjection=function(t){return this.readProjectionFromObject(Qp(t))};e.prototype.readProjectionFromObject=function(t){};e.prototype.writeFeature=function(t,e){return JSON.stringify(this.writeFeatureObject(t,e))};e.prototype.writeFeatureObject=function(t,e){};e.prototype.writeFeatures=function(t,e){return JSON.stringify(this.writeFeaturesObject(t,e))};e.prototype.writeFeaturesObject=function(t,e){};e.prototype.writeGeometry=function(t,e){return JSON.stringify(this.writeGeometryObject(t,e))};e.prototype.writeGeometryObject=function(t,e){};return e}(Zp);function Qp(t){if("string"!=typeof t)return null!==t?t:null;var e=JSON.parse(t);return e||null}var $p={};$p[kt.POINT]=function(t){var e;e=void 0!==t.m&&void 0!==t.z?new fn([t.x,t.y,t.z,t.m],kr.XYZM):void 0!==t.z?new fn([t.x,t.y,t.z],kr.XYZ):void 0!==t.m?new fn([t.x,t.y,t.m],kr.XYM):new fn([t.x,t.y]);return e};$p[kt.LINE_STRING]=function(t){var e=rd(t);return new ro(t.paths[0],e)};$p[kt.POLYGON]=function(t){var e=rd(t);return new Fn(t.rings,e)};$p[kt.MULTI_POINT]=function(t){var e=rd(t);return new Ih(t.points,e)};$p[kt.MULTI_LINE_STRING]=function(t){var e=rd(t);return new Rh(t.paths,e)};$p[kt.MULTI_POLYGON]=function(t){var e=rd(t);return new Lh(t.rings,e)};var td={};td[kt.POINT]=function(t,e){var i,r=t.getCoordinates(),n=t.getLayout();n===kr.XYZ?i={x:r[0],y:r[1],z:r[2]}:n===kr.XYM?i={x:r[0],y:r[1],m:r[2]}:n===kr.XYZM?i={x:r[0],y:r[1],z:r[2],m:r[3]}:n===kr.XY?i={x:r[0],y:r[1]}:A(!1,34);return i};td[kt.LINE_STRING]=function(t,e){var i=nd(t);return{hasZ:i.hasZ,hasM:i.hasM,paths:[t.getCoordinates()]}};td[kt.POLYGON]=function(t,e){var i=nd(t);return{hasZ:i.hasZ,hasM:i.hasM,rings:t.getCoordinates(!1)}};td[kt.MULTI_POINT]=function(t,e){var i=nd(t);return{hasZ:i.hasZ,hasM:i.hasM,points:t.getCoordinates()}};td[kt.MULTI_LINE_STRING]=function(t,e){var i=nd(t);return{hasZ:i.hasZ,hasM:i.hasM,paths:t.getCoordinates()}};td[kt.MULTI_POLYGON]=function(t,e){for(var i=nd(t),r=t.getCoordinates(!1),n=[],o=0;o<r.length;o++)for(var s=r[o].length-1;0<=s;s--)n.push(r[o][s]);return{hasZ:i.hasZ,hasM:i.hasM,rings:n}};var ed=function(i){function t(t){var e=t||{};i.call(this);this.geometryName_=e.geometryName}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readFeatureFromObject=function(t,e){var i=t,r=id(i.geometry,e),n=new Sr;this.geometryName_&&n.setGeometryName(this.geometryName_);n.setGeometry(r);e&&e.idField&&i.attributes[e.idField]&&n.setId(i.attributes[e.idField]);i.attributes&&n.setProperties(i.attributes);return n};t.prototype.readFeaturesFromObject=function(t,e){var i=e||{};if(t.features){var r=[],n=t.features;i.idField=t.objectIdFieldName;for(var o=0,s=n.length;o<s;++o)r.push(this.readFeatureFromObject(n[o],i));return r}return[this.readFeatureFromObject(t,i)]};t.prototype.readGeometryFromObject=function(t,e){return id(t,e)};t.prototype.readProjectionFromObject=function(t){var e=t;if(e.spatialReference&&e.spatialReference.wkid){return ye("EPSG:"+e.spatialReference.wkid)}return null};t.prototype.writeGeometryObject=function(t,e){return od(t,this.adaptOptions(e))};t.prototype.writeFeatureObject=function(t,e){e=this.adaptOptions(e);var i={},r=t.getGeometry();if(r){i.geometry=od(r,e);e&&e.featureProjection&&(i.geometry.spatialReference={wkid:ye(e.featureProjection).getCode().split(":").pop()})}var n=t.getProperties();delete n[t.getGeometryName()];Ct(n)?i.attributes={}:i.attributes=n;return i};t.prototype.writeFeaturesObject=function(t,e){e=this.adaptOptions(e);for(var i=[],r=0,n=t.length;r<n;++r)i.push(this.writeFeatureObject(t[r],e));return{features:i}};return t}(Jp);function id(t,e){if(!t)return null;var i;if("number"==typeof t.x&&"number"==typeof t.y)i=kt.POINT;else if(t.points)i=kt.MULTI_POINT;else if(t.paths)i=1===t.paths.length?kt.LINE_STRING:kt.MULTI_LINE_STRING;else if(t.rings){var r=rd(t),n=function(t,e){var i,r,n=[],o=[],s=[];for(i=0,r=t.length;i<r;++i){n.length=0;$r(n,0,t[i],e.length);var a=Ln(n,0,n.length,e.length);a?o.push([t[i]]):s.push(t[i])}for(;s.length;){var h=s.shift(),l=!1;for(i=o.length-1;0<=i;i--){var u=o[i][0],c=Q(new dn(u).getExtent(),new dn(h).getExtent());if(c){o[i].push(h);l=!0;break}}l||o.push([h.reverse()])}return o}(t.rings,r);t=T({},t);if(1===n.length){i=kt.POLYGON;t.rings=n[0]}else{i=kt.MULTI_POLYGON;t.rings=n}}return qp((0,$p[i])(t),!1,e)}function rd(t){var e=kr.XY;!0===t.hasZ&&!0===t.hasM?e=kr.XYZM:!0===t.hasZ?e=kr.XYZ:!0===t.hasM&&(e=kr.XYM);return e}function nd(t){var e=t.getLayout();return{hasZ:e===kr.XYZ||e===kr.XYZM,hasM:e===kr.XYM||e===kr.XYZM}}function od(t,e){return(0,td[t.getType()])(qp(t,!0,e),e)}var sd=document.implementation.createDocument("","",null),ad="http://www.w3.org/2001/XMLSchema-instance";function hd(t,e){return sd.createElementNS(t,e)}function ld(t,e){return ud(t,e,[]).join("")}function ud(t,e,i){if(t.nodeType==Node.CDATA_SECTION_NODE||t.nodeType==Node.TEXT_NODE)e?i.push(String(t.nodeValue).replace(/(\r\n|\r|\n)/g,"")):i.push(t.nodeValue);else{var r;for(r=t.firstChild;r;r=r.nextSibling)ud(r,e,i)}return i}function cd(t){return t instanceof Document}function pd(t){return t instanceof Node}function dd(t,e,i){return t.getAttributeNS(e,i)||""}function fd(t){return(new DOMParser).parseFromString(t,"application/xml")}function _d(r,n){return function(t,e){var i=r.call(void 0!==n?n:this,t,e);if(void 0!==i){br(e[e.length-1],i)}}}function gd(r,n){return function(t,e){var i=r.call(void 0!==n?n:this,t,e);if(void 0!==i){e[e.length-1].push(i)}}}function yd(r,n){return function(t,e){var i=r.call(void 0!==n?n:this,t,e);void 0!==i&&(e[e.length-1]=i)}}function vd(o,s,a){return function(t,e){var i=o.call(void 0!==a?a:this,t,e);if(void 0!==i){var r=e[e.length-1],n=void 0!==s?s:t.localName;(n in r?r[n]:r[n]=[]).push(i)}}}function md(r,n,o){return function(t,e){var i=r.call(void 0!==o?o:this,t,e);if(void 0!==i){e[e.length-1][void 0!==n?n:t.localName]=i}}}function xd(r,n){return function(t,e,i){r.call(void 0!==n?n:this,t,e,i);i[i.length-1].node.appendChild(t)}}function Ed(n,t){var o,s;return function(t,e,i){if(void 0===o){o={};var r={};r[t.localName]=n;o[t.namespaceURI]=r;s=Td(t.localName)}Ld(o,s,e,i)}}function Td(t,o){var s=t;return function(t,e,i){var r=e[e.length-1].node,n=s;void 0===n&&(n=i);return hd(void 0!==o?o:r.namespaceURI,n)}}var Sd=Td();function Cd(t,e){for(var i=e.length,r=new Array(i),n=0;n<i;++n)r[n]=t[e[n]];return r}function Rd(t,e,i){var r,n,o=void 0!==i?i:{};for(r=0,n=t.length;r<n;++r)o[t[r]]=e;return o}function Id(t,e,i,r){var n;for(n=e.firstElementChild;n;n=n.nextElementSibling){var o=t[n.namespaceURI];if(void 0!==o){var s=o[n.localName];void 0!==s&&s.call(r,n,i)}}}function wd(t,e,i,r,n){r.push(t);Id(e,i,r,n);return r.pop()}function Ld(t,e,i,r,n,o){for(var s,a,h=(void 0!==n?n:i).length,l=0;l<h;++l)void 0!==(s=i[l])&&void 0!==(a=e.call(void 0!==o?o:this,s,r,void 0!==n?n[l]:void 0))&&t[a.namespaceURI][a.localName].call(o,a,s,r)}function Od(t,e,i,r,n,o,s){n.push(t);Ld(e,i,r,n,o,s);return n.pop()}var Pd=function(t){function e(){t.call(this);this.xmlSerializer_=new XMLSerializer}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.getType=function(){return Mh.XML};e.prototype.readFeature=function(t,e){if(cd(t))return this.readFeatureFromDocument(t,e);if(pd(t))return this.readFeatureFromNode(t,e);if("string"!=typeof t)return null;var i=fd(t);return this.readFeatureFromDocument(i,e)};e.prototype.readFeatureFromDocument=function(t,e){var i=this.readFeaturesFromDocument(t,e);return 0<i.length?i[0]:null};e.prototype.readFeatureFromNode=function(t,e){return null};e.prototype.readFeatures=function(t,e){if(cd(t))return this.readFeaturesFromDocument(t,e);if(pd(t))return this.readFeaturesFromNode(t,e);if("string"!=typeof t)return[];var i=fd(t);return this.readFeaturesFromDocument(i,e)};e.prototype.readFeaturesFromDocument=function(t,e){for(var i=[],r=t.firstChild;r;r=r.nextSibling)r.nodeType==Node.ELEMENT_NODE&&br(i,this.readFeaturesFromNode(r,e));return i};e.prototype.readFeaturesFromNode=function(t,e){};e.prototype.readGeometry=function(t,e){if(cd(t))return this.readGeometryFromDocument(t,e);if(pd(t))return this.readGeometryFromNode(t,e);if("string"!=typeof t)return null;var i=fd(t);return this.readGeometryFromDocument(i,e)};e.prototype.readGeometryFromDocument=function(t,e){return null};e.prototype.readGeometryFromNode=function(t,e){return null};e.prototype.readProjection=function(t){if(cd(t))return this.readProjectionFromDocument(t);if(pd(t))return this.readProjectionFromNode(t);if("string"!=typeof t)return null;var e=fd(t);return this.readProjectionFromDocument(e)};e.prototype.readProjectionFromDocument=function(t){return this.dataProjection};e.prototype.readProjectionFromNode=function(t){return this.dataProjection};e.prototype.writeFeature=function(t,e){var i=this.writeFeatureNode(t,e);return this.xmlSerializer_.serializeToString(i)};e.prototype.writeFeatureNode=function(t,e){return null};e.prototype.writeFeatures=function(t,e){var i=this.writeFeaturesNode(t,e);return this.xmlSerializer_.serializeToString(i)};e.prototype.writeFeaturesNode=function(t,e){return null};e.prototype.writeGeometry=function(t,e){var i=this.writeGeometryNode(t,e);return this.xmlSerializer_.serializeToString(i)};e.prototype.writeGeometryNode=function(t,e){return null};return e}(Zp),bd="http://www.opengis.net/gml",Md=/^[\s\xa0]*$/,Fd=function(i){function t(t){i.call(this);var e=t||{};this.featureType=e.featureType;this.featureNS=e.featureNS;this.srsName=e.srsName;this.schemaLocation="";this.FEATURE_COLLECTION_PARSERS={};this.FEATURE_COLLECTION_PARSERS[bd]={featureMember:yd(this.readFeaturesInternal),featureMembers:yd(this.readFeaturesInternal)}}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readFeaturesInternal=function(t,e){var i=t.localName,r=null;if("FeatureCollection"==i)r="http://www.opengis.net/wfs"===t.namespaceURI?wd([],this.FEATURE_COLLECTION_PARSERS,t,e,this):wd(null,this.FEATURE_COLLECTION_PARSERS,t,e,this);else if("featureMembers"==i||"featureMember"==i){var n=e[0],o=n.featureType,s=n.featureNS;if(!o&&t.childNodes){o=[],s={};for(var a=0,h=t.childNodes.length;a<h;++a){var l=t.childNodes[a];if(1===l.nodeType){var u=l.nodeName.split(":").pop();if(-1===o.indexOf(u)){var c="",p=0,d=l.namespaceURI;for(var f in s){if(s[f]===d){c=f;break}++p}c||(s[c="p"+p]=d);o.push(c+":"+u)}}}if("featureMember"!=i){n.featureType=o;n.featureNS=s}}if("string"==typeof s){var _=s;(s={}).p0=_}var g={},y=Array.isArray(o)?o:[o];for(var v in s){for(var m={},x=0,E=y.length;x<E;++x){(-1===y[x].indexOf(":")?"p0":y[x].split(":")[0])===v&&(m[y[x].split(":").pop()]="featureMembers"==i?gd(this.readFeatureElement,this):yd(this.readFeatureElement,this))}g[s[v]]=m}r=wd("featureMember"==i?void 0:[],g,t,e)}null===r&&(r=[]);return r};t.prototype.readGeometryElement=function(t,e){var i=e[0];i.srsName=t.firstElementChild.getAttribute("srsName");i.srsDimension=t.firstElementChild.getAttribute("srsDimension");var r=wd(null,this.GEOMETRY_PARSERS_,t,e,this);return r?qp(r,!1,i):void 0};t.prototype.readFeatureElement=function(t,e){var i,r,n=t.getAttribute("fid")||dd(t,bd,"id"),o={};for(i=t.firstElementChild;i;i=i.nextElementSibling){var s=i.localName;if(0===i.childNodes.length||1===i.childNodes.length&&(3===i.firstChild.nodeType||4===i.firstChild.nodeType)){var a=ld(i,!1);Md.test(a)&&(a=void 0);o[s]=a}else{"boundedBy"!==s&&(r=s);o[s]=this.readGeometryElement(i,e)}}var h=new Sr(o);r&&h.setGeometryName(r);n&&h.setId(n);return h};t.prototype.readPoint=function(t,e){var i=this.readFlatCoordinatesFromNode_(t,e);if(i)return new fn(i,kr.XYZ)};t.prototype.readMultiPoint=function(t,e){var i=wd([],this.MULTIPOINT_PARSERS_,t,e,this);return i?new Ih(i):void 0};t.prototype.readMultiLineString=function(t,e){var i=wd([],this.MULTILINESTRING_PARSERS_,t,e,this);if(i)return new Rh(i)};t.prototype.readMultiPolygon=function(t,e){var i=wd([],this.MULTIPOLYGON_PARSERS_,t,e,this);if(i)return new Lh(i)};t.prototype.pointMemberParser_=function(t,e){Id(this.POINTMEMBER_PARSERS_,t,e,this)};t.prototype.lineStringMemberParser_=function(t,e){Id(this.LINESTRINGMEMBER_PARSERS_,t,e,this)};t.prototype.polygonMemberParser_=function(t,e){Id(this.POLYGONMEMBER_PARSERS_,t,e,this)};t.prototype.readLineString=function(t,e){var i=this.readFlatCoordinatesFromNode_(t,e);if(i){return new ro(i,kr.XYZ)}};t.prototype.readFlatLinearRing_=function(t,e){var i=wd(null,this.GEOMETRY_FLAT_COORDINATES_PARSERS_,t,e,this);return i||void 0};t.prototype.readLinearRing=function(t,e){var i=this.readFlatCoordinatesFromNode_(t,e);if(i)return new dn(i,kr.XYZ)};t.prototype.readPolygon=function(t,e){var i=wd([null],this.FLAT_LINEAR_RINGS_PARSERS_,t,e,this);if(i&&i[0]){var r,n,o=i[0],s=[o.length];for(r=1,n=i.length;r<n;++r){br(o,i[r]);s.push(o.length)}return new Fn(o,kr.XYZ,s)}};t.prototype.readFlatCoordinatesFromNode_=function(t,e){return wd(null,this.GEOMETRY_FLAT_COORDINATES_PARSERS_,t,e,this)};t.prototype.readGeometryFromNode=function(t,e){var i=this.readGeometryElement(t,[this.getReadOptions(t,e||{})]);return i||null};t.prototype.readFeaturesFromNode=function(t,e){var i={featureType:this.featureType,featureNS:this.featureNS};e&&T(i,this.getReadOptions(t,e));return this.readFeaturesInternal(t,[i])||[]};t.prototype.readProjectionFromNode=function(t){return ye(this.srsName?this.srsName:t.firstElementChild.getAttribute("srsName"))};return t}(Pd);Fd.prototype.MULTIPOINT_PARSERS_={"http://www.opengis.net/gml":{pointMember:gd(Fd.prototype.pointMemberParser_),pointMembers:gd(Fd.prototype.pointMemberParser_)}};Fd.prototype.MULTILINESTRING_PARSERS_={"http://www.opengis.net/gml":{lineStringMember:gd(Fd.prototype.lineStringMemberParser_),lineStringMembers:gd(Fd.prototype.lineStringMemberParser_)}};Fd.prototype.MULTIPOLYGON_PARSERS_={"http://www.opengis.net/gml":{polygonMember:gd(Fd.prototype.polygonMemberParser_),polygonMembers:gd(Fd.prototype.polygonMemberParser_)}};Fd.prototype.POINTMEMBER_PARSERS_={"http://www.opengis.net/gml":{Point:gd(Fd.prototype.readFlatCoordinatesFromNode_)}};Fd.prototype.LINESTRINGMEMBER_PARSERS_={"http://www.opengis.net/gml":{LineString:gd(Fd.prototype.readLineString)}};Fd.prototype.POLYGONMEMBER_PARSERS_={"http://www.opengis.net/gml":{Polygon:gd(Fd.prototype.readPolygon)}};Fd.prototype.RING_PARSERS={"http://www.opengis.net/gml":{LinearRing:yd(Fd.prototype.readFlatLinearRing_)}};function Ad(t){return Nd(ld(t,!1))}function Nd(t){var e=/^\s*(true|1)|(false|0)\s*$/.exec(t);return e?void 0!==e[1]||!1:void 0}function Dd(t){var e=ld(t,!1),i=Date.parse(e);return isNaN(i)?void 0:i/1e3}function Gd(t){return kd(ld(t,!1))}function kd(t){var e=/^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*$/i.exec(t);return e?parseFloat(e[1]):void 0}function jd(t){return Ud(ld(t,!1))}function Ud(t){var e=/^\s*(\d+)\s*$/.exec(t);return e?parseInt(e[1],10):void 0}function Yd(t){return ld(t,!1).trim()}function Bd(t,e){Hd(t,e?"1":"0")}function Vd(t,e){t.appendChild(sd.createCDATASection(e))}function Xd(t,e){var i=new Date(1e3*e),r=i.getUTCFullYear()+"-"+jn(i.getUTCMonth()+1,2)+"-"+jn(i.getUTCDate(),2)+"T"+jn(i.getUTCHours(),2)+":"+jn(i.getUTCMinutes(),2)+":"+jn(i.getUTCSeconds(),2)+"Z";t.appendChild(sd.createTextNode(r))}function zd(t,e){var i=e.toPrecision();t.appendChild(sd.createTextNode(i))}function Wd(t,e){var i=e.toString();t.appendChild(sd.createTextNode(i))}function Hd(t,e){t.appendChild(sd.createTextNode(e))}var Kd=bd+" http://schemas.opengis.net/gml/3.1.1/profiles/gmlsfProfile/1.0.0/gmlsf.xsd",Zd={MultiLineString:"lineStringMember",MultiCurve:"curveMember",MultiPolygon:"polygonMember",MultiSurface:"surfaceMember"},qd=function(i){function t(t){var e=t||{};i.call(this,e);this.surface_=void 0!==e.surface&&e.surface;this.curve_=void 0!==e.curve&&e.curve;this.multiCurve_=void 0===e.multiCurve||e.multiCurve;this.multiSurface_=void 0===e.multiSurface||e.multiSurface;this.schemaLocation=e.schemaLocation?e.schemaLocation:Kd;this.hasZ=void 0!==e.hasZ&&e.hasZ}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readMultiCurve_=function(t,e){var i=wd([],this.MULTICURVE_PARSERS_,t,e,this);if(i){return new Rh(i)}};t.prototype.readMultiSurface_=function(t,e){var i=wd([],this.MULTISURFACE_PARSERS_,t,e,this);if(i)return new Lh(i)};t.prototype.curveMemberParser_=function(t,e){Id(this.CURVEMEMBER_PARSERS_,t,e,this)};t.prototype.surfaceMemberParser_=function(t,e){Id(this.SURFACEMEMBER_PARSERS_,t,e,this)};t.prototype.readPatch_=function(t,e){return wd([null],this.PATCHES_PARSERS_,t,e,this)};t.prototype.readSegment_=function(t,e){return wd([null],this.SEGMENTS_PARSERS_,t,e,this)};t.prototype.readPolygonPatch_=function(t,e){return wd([null],this.FLAT_LINEAR_RINGS_PARSERS_,t,e,this)};t.prototype.readLineStringSegment_=function(t,e){return wd([null],this.GEOMETRY_FLAT_COORDINATES_PARSERS_,t,e,this)};t.prototype.interiorParser_=function(t,e){var i=wd(void 0,this.RING_PARSERS,t,e,this);if(i){e[e.length-1].push(i)}};t.prototype.exteriorParser_=function(t,e){var i=wd(void 0,this.RING_PARSERS,t,e,this);if(i){e[e.length-1][0]=i}};t.prototype.readSurface_=function(t,e){var i=wd([null],this.SURFACE_PARSERS_,t,e,this);if(i&&i[0]){var r,n,o=i[0],s=[o.length];for(r=1,n=i.length;r<n;++r){br(o,i[r]);s.push(o.length)}return new Fn(o,kr.XYZ,s)}};t.prototype.readCurve_=function(t,e){var i=wd([null],this.CURVE_PARSERS_,t,e,this);if(i){return new ro(i,kr.XYZ)}};t.prototype.readEnvelope_=function(t,e){var i=wd([null],this.ENVELOPE_PARSERS_,t,e,this);return z(i[1][0],i[1][1],i[2][0],i[2][1])};t.prototype.readFlatPos_=function(t,e){for(var i,r=ld(t,!1),n=/^\s*([+\-]?\d*\.?\d+(?:[eE][+\-]?\d+)?)\s*/,o=[];i=n.exec(r);){o.push(parseFloat(i[1]));r=r.substr(i[0].length)}if(""===r){var s=e[0].srsName,a="enu";if(s){a=ye(s).getAxisOrientation()}if("neu"===a){var h,l;for(h=0,l=o.length;h<l;h+=3){var u=o[h],c=o[h+1];o[h]=c;o[h+1]=u}}var p=o.length;2==p&&o.push(0);if(0!==p)return o}};t.prototype.readFlatPosList_=function(t,e){var i=ld(t,!1).replace(/^\s*|\s*$/g,""),r=e[0],n=r.srsName,o=r.srsDimension,s="enu";if(n){s=ye(n).getAxisOrientation()}var a,h,l,u=i.split(/\s+/),c=2;t.getAttribute("srsDimension")?c=Ud(t.getAttribute("srsDimension")):t.getAttribute("dimension")?c=Ud(t.getAttribute("dimension")):t.parentNode.getAttribute("srsDimension")?c=Ud(t.parentNode.getAttribute("srsDimension")):o&&(c=Ud(o));for(var p=[],d=0,f=u.length;d<f;d+=c){a=parseFloat(u[d]);h=parseFloat(u[d+1]);l=3===c?parseFloat(u[d+2]):0;"en"===s.substr(0,2)?p.push(a,h,l):p.push(h,a,l)}return p};t.prototype.writePos_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=n?3:2;t.setAttribute("srsDimension",o);var s=r.srsName,a="enu";s&&(a=ye(s).getAxisOrientation());var h,l=e.getCoordinates();h="en"===a.substr(0,2)?l[0]+" "+l[1]:l[1]+" "+l[0];if(n){h+=" "+(l[2]||0)}Hd(t,h)};t.prototype.getCoords_=function(t,e,i){var r="enu";e&&(r=ye(e).getAxisOrientation());var n="en"===r.substr(0,2)?t[0]+" "+t[1]:t[1]+" "+t[0];if(i){n+=" "+(t[2]||0)}return n};t.prototype.writePosList_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=n?3:2;t.setAttribute("srsDimension",o);for(var s,a=r.srsName,h=e.getCoordinates(),l=h.length,u=new Array(l),c=0;c<l;++c){s=h[c];u[c]=this.getCoords_(s,a,n)}Hd(t,u.join(" "))};t.prototype.writePoint_=function(t,e,i){var r=i[i.length-1].srsName;r&&t.setAttribute("srsName",r);var n=hd(t.namespaceURI,"pos");t.appendChild(n);this.writePos_(n,e,i)};t.prototype.writeEnvelope=function(t,e,i){var r=i[i.length-1].srsName;r&&t.setAttribute("srsName",r);var n=[e[0]+" "+e[1],e[2]+" "+e[3]];Od({node:t},this.ENVELOPE_SERIALIZERS_,Sd,n,i,["lowerCorner","upperCorner"],this)};t.prototype.writeLinearRing_=function(t,e,i){var r=i[i.length-1].srsName;r&&t.setAttribute("srsName",r);var n=hd(t.namespaceURI,"posList");t.appendChild(n);this.writePosList_(n,e,i)};t.prototype.RING_NODE_FACTORY_=function(t,e,i){var r=e[e.length-1],n=r.node,o=r.exteriorWritten;void 0===o&&(r.exteriorWritten=!0);return hd(n.namespaceURI,void 0!==o?"interior":"exterior")};t.prototype.writeSurfaceOrPolygon_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=r.srsName;"PolygonPatch"!==t.nodeName&&o&&t.setAttribute("srsName",o);if("Polygon"===t.nodeName||"PolygonPatch"===t.nodeName){var s=e.getLinearRings();Od({node:t,hasZ:n,srsName:o},this.RING_SERIALIZERS_,this.RING_NODE_FACTORY_,s,i,void 0,this)}else if("Surface"===t.nodeName){var a=hd(t.namespaceURI,"patches");t.appendChild(a);this.writeSurfacePatches_(a,e,i)}};t.prototype.writeCurveOrLineString_=function(t,e,i){var r=i[i.length-1].srsName;"LineStringSegment"!==t.nodeName&&r&&t.setAttribute("srsName",r);if("LineString"===t.nodeName||"LineStringSegment"===t.nodeName){var n=hd(t.namespaceURI,"posList");t.appendChild(n);this.writePosList_(n,e,i)}else if("Curve"===t.nodeName){var o=hd(t.namespaceURI,"segments");t.appendChild(o);this.writeCurveSegments_(o,e,i)}};t.prototype.writeMultiSurfaceOrPolygon_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=r.srsName,s=r.surface;o&&t.setAttribute("srsName",o);var a=e.getPolygons();Od({node:t,hasZ:n,srsName:o,surface:s},this.SURFACEORPOLYGONMEMBER_SERIALIZERS_,this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_,a,i,void 0,this)};t.prototype.writeMultiPoint_=function(t,e,i){var r=i[i.length-1],n=r.srsName,o=r.hasZ;n&&t.setAttribute("srsName",n);var s=e.getPoints();Od({node:t,hasZ:o,srsName:n},this.POINTMEMBER_SERIALIZERS_,Td("pointMember"),s,i,void 0,this)};t.prototype.writeMultiCurveOrLineString_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=r.srsName,s=r.curve;o&&t.setAttribute("srsName",o);var a=e.getLineStrings();Od({node:t,hasZ:n,srsName:o,curve:s},this.LINESTRINGORCURVEMEMBER_SERIALIZERS_,this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_,a,i,void 0,this)};t.prototype.writeRing_=function(t,e,i){var r=hd(t.namespaceURI,"LinearRing");t.appendChild(r);this.writeLinearRing_(r,e,i)};t.prototype.writeSurfaceOrPolygonMember_=function(t,e,i){var r=this.GEOMETRY_NODE_FACTORY_(e,i);if(r){t.appendChild(r);this.writeSurfaceOrPolygon_(r,e,i)}};t.prototype.writePointMember_=function(t,e,i){var r=hd(t.namespaceURI,"Point");t.appendChild(r);this.writePoint_(r,e,i)};t.prototype.writeLineStringOrCurveMember_=function(t,e,i){var r=this.GEOMETRY_NODE_FACTORY_(e,i);if(r){t.appendChild(r);this.writeCurveOrLineString_(r,e,i)}};t.prototype.writeSurfacePatches_=function(t,e,i){var r=hd(t.namespaceURI,"PolygonPatch");t.appendChild(r);this.writeSurfaceOrPolygon_(r,e,i)};t.prototype.writeCurveSegments_=function(t,e,i){var r=hd(t.namespaceURI,"LineStringSegment");t.appendChild(r);this.writeCurveOrLineString_(r,e,i)};t.prototype.writeGeometryElement=function(t,e,i){var r,n=i[i.length-1],o=T({},n);o.node=t;r=Array.isArray(e)?n.dataProjection?Le(e,n.featureProjection,n.dataProjection):e:qp(e,!0,n);Od(o,this.GEOMETRY_SERIALIZERS_,this.GEOMETRY_NODE_FACTORY_,[r],i,void 0,this)};t.prototype.writeFeatureElement=function(t,e,i){var r=e.getId();r&&t.setAttribute("fid",r);var n=i[i.length-1],o=n.featureNS,s=e.getGeometryName();if(!n.serializers){n.serializers={};n.serializers[o]={}}var a=e.getProperties(),h=[],l=[];for(var u in a){var c=a[u];if(null!==c){h.push(u);l.push(c);u==s||c instanceof Xe?u in n.serializers[o]||(n.serializers[o][u]=xd(this.writeGeometryElement,this)):u in n.serializers[o]||(n.serializers[o][u]=xd(Hd))}}var p=T({},n);p.node=t;Od(p,n.serializers,Td(void 0,o),l,i,h)};t.prototype.writeFeatureMembers_=function(t,e,i){var r=i[i.length-1],n=r.featureType,o=r.featureNS,s={};s[o]={};s[o][n]=xd(this.writeFeatureElement,this);var a=T({},r);a.node=t;Od(a,s,Td(n,o),e,i)};t.prototype.MULTIGEOMETRY_MEMBER_NODE_FACTORY_=function(t,e,i){var r=e[e.length-1].node;return hd("http://www.opengis.net/gml",Zd[r.nodeName])};t.prototype.GEOMETRY_NODE_FACTORY_=function(t,e,i){var r,n=e[e.length-1],o=n.multiSurface,s=n.surface,a=n.curve,h=n.multiCurve;Array.isArray(t)?r="Envelope":"MultiPolygon"===(r=t.getType())&&!0===o?r="MultiSurface":"Polygon"===r&&!0===s?r="Surface":"LineString"===r&&!0===a?r="Curve":"MultiLineString"===r&&!0===h&&(r="MultiCurve");return hd("http://www.opengis.net/gml",r)};t.prototype.writeGeometryNode=function(t,e){e=this.adaptOptions(e);var i=hd("http://www.opengis.net/gml","geom"),r={node:i,hasZ:this.hasZ,srsName:this.srsName,curve:this.curve_,surface:this.surface_,multiSurface:this.multiSurface_,multiCurve:this.multiCurve_};e&&T(r,e);this.writeGeometryElement(i,t,[r]);return i};t.prototype.writeFeaturesNode=function(t,e){e=this.adaptOptions(e);var i=hd("http://www.opengis.net/gml","featureMembers");i.setAttributeNS(ad,"xsi:schemaLocation",this.schemaLocation);var r={srsName:this.srsName,hasZ:this.hasZ,curve:this.curve_,surface:this.surface_,multiSurface:this.multiSurface_,multiCurve:this.multiCurve_,featureNS:this.featureNS,featureType:this.featureType};e&&T(r,e);this.writeFeatureMembers_(i,t,[r]);return i};return t}(Fd);qd.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS_={"http://www.opengis.net/gml":{pos:yd(qd.prototype.readFlatPos_),posList:yd(qd.prototype.readFlatPosList_)}};qd.prototype.FLAT_LINEAR_RINGS_PARSERS_={"http://www.opengis.net/gml":{interior:qd.prototype.interiorParser_,exterior:qd.prototype.exteriorParser_}};qd.prototype.GEOMETRY_PARSERS_={"http://www.opengis.net/gml":{Point:yd(Fd.prototype.readPoint),MultiPoint:yd(Fd.prototype.readMultiPoint),LineString:yd(Fd.prototype.readLineString),MultiLineString:yd(Fd.prototype.readMultiLineString),LinearRing:yd(Fd.prototype.readLinearRing),Polygon:yd(Fd.prototype.readPolygon),MultiPolygon:yd(Fd.prototype.readMultiPolygon),Surface:yd(qd.prototype.readSurface_),MultiSurface:yd(qd.prototype.readMultiSurface_),Curve:yd(qd.prototype.readCurve_),MultiCurve:yd(qd.prototype.readMultiCurve_),Envelope:yd(qd.prototype.readEnvelope_)}};qd.prototype.MULTICURVE_PARSERS_={"http://www.opengis.net/gml":{curveMember:gd(qd.prototype.curveMemberParser_),curveMembers:gd(qd.prototype.curveMemberParser_)}};qd.prototype.MULTISURFACE_PARSERS_={"http://www.opengis.net/gml":{surfaceMember:gd(qd.prototype.surfaceMemberParser_),surfaceMembers:gd(qd.prototype.surfaceMemberParser_)}};qd.prototype.CURVEMEMBER_PARSERS_={"http://www.opengis.net/gml":{LineString:gd(Fd.prototype.readLineString),Curve:gd(qd.prototype.readCurve_)}};qd.prototype.SURFACEMEMBER_PARSERS_={"http://www.opengis.net/gml":{Polygon:gd(Fd.prototype.readPolygon),Surface:gd(qd.prototype.readSurface_)}};qd.prototype.SURFACE_PARSERS_={"http://www.opengis.net/gml":{patches:yd(qd.prototype.readPatch_)}};qd.prototype.CURVE_PARSERS_={"http://www.opengis.net/gml":{segments:yd(qd.prototype.readSegment_)}};qd.prototype.ENVELOPE_PARSERS_={"http://www.opengis.net/gml":{lowerCorner:gd(qd.prototype.readFlatPosList_),upperCorner:gd(qd.prototype.readFlatPosList_)}};qd.prototype.PATCHES_PARSERS_={"http://www.opengis.net/gml":{PolygonPatch:yd(qd.prototype.readPolygonPatch_)}};qd.prototype.SEGMENTS_PARSERS_={"http://www.opengis.net/gml":{LineStringSegment:yd(qd.prototype.readLineStringSegment_)}};qd.prototype.writeFeatures;qd.prototype.RING_SERIALIZERS_={"http://www.opengis.net/gml":{exterior:xd(qd.prototype.writeRing_),interior:xd(qd.prototype.writeRing_)}};qd.prototype.ENVELOPE_SERIALIZERS_={"http://www.opengis.net/gml":{lowerCorner:xd(Hd),upperCorner:xd(Hd)}};qd.prototype.SURFACEORPOLYGONMEMBER_SERIALIZERS_={"http://www.opengis.net/gml":{surfaceMember:xd(qd.prototype.writeSurfaceOrPolygonMember_),polygonMember:xd(qd.prototype.writeSurfaceOrPolygonMember_)}};qd.prototype.POINTMEMBER_SERIALIZERS_={"http://www.opengis.net/gml":{pointMember:xd(qd.prototype.writePointMember_)}};qd.prototype.LINESTRINGORCURVEMEMBER_SERIALIZERS_={"http://www.opengis.net/gml":{lineStringMember:xd(qd.prototype.writeLineStringOrCurveMember_),curveMember:xd(qd.prototype.writeLineStringOrCurveMember_)}};qd.prototype.GEOMETRY_SERIALIZERS_={"http://www.opengis.net/gml":{Curve:xd(qd.prototype.writeCurveOrLineString_),MultiCurve:xd(qd.prototype.writeMultiCurveOrLineString_),Point:xd(qd.prototype.writePoint_),MultiPoint:xd(qd.prototype.writeMultiPoint_),LineString:xd(qd.prototype.writeCurveOrLineString_),MultiLineString:xd(qd.prototype.writeMultiCurveOrLineString_),LinearRing:xd(qd.prototype.writeLinearRing_),Polygon:xd(qd.prototype.writeSurfaceOrPolygon_),MultiPolygon:xd(qd.prototype.writeMultiSurfaceOrPolygon_),Surface:xd(qd.prototype.writeSurfaceOrPolygon_),MultiSurface:xd(qd.prototype.writeMultiSurfaceOrPolygon_),Envelope:xd(qd.prototype.writeEnvelope)}};var Jd=qd;Jd.prototype.writeFeatures;Jd.prototype.writeFeaturesNode;var Qd=bd+" http://schemas.opengis.net/gml/2.1.2/feature.xsd",$d={MultiLineString:"lineStringMember",MultiCurve:"curveMember",MultiPolygon:"polygonMember",MultiSurface:"surfaceMember"},tf=function(i){function t(t){var e=t||{};i.call(this,e);this.FEATURE_COLLECTION_PARSERS[bd].featureMember=gd(this.readFeaturesInternal);this.schemaLocation=e.schemaLocation?e.schemaLocation:Qd}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readFlatCoordinates_=function(t,e){var i=ld(t,!1).replace(/^\s*|\s*$/g,""),r=e[0].srsName,n="enu";if(r){var o=ye(r);o&&(n=o.getAxisOrientation())}for(var s=i.trim().split(/\s+/),a=[],h=0,l=s.length;h<l;h++){var u=s[h].split(/,+/),c=parseFloat(u[0]),p=parseFloat(u[1]),d=3===u.length?parseFloat(u[2]):0;"en"===n.substr(0,2)?a.push(c,p,d):a.push(p,c,d)}return a};t.prototype.readBox_=function(t,e){var i=wd([null],this.BOX_PARSERS_,t,e,this);return z(i[1][0],i[1][1],i[1][3],i[1][4])};t.prototype.innerBoundaryIsParser_=function(t,e){var i=wd(void 0,this.RING_PARSERS,t,e,this);if(i){e[e.length-1].push(i)}};t.prototype.outerBoundaryIsParser_=function(t,e){var i=wd(void 0,this.RING_PARSERS,t,e,this);if(i){e[e.length-1][0]=i}};t.prototype.GEOMETRY_NODE_FACTORY_=function(t,e,i){var r,n=e[e.length-1],o=n.multiSurface,s=n.surface,a=n.multiCurve;Array.isArray(t)?r="Envelope":"MultiPolygon"===(r=t.getType())&&!0===o?r="MultiSurface":"Polygon"===r&&!0===s?r="Surface":"MultiLineString"===r&&!0===a&&(r="MultiCurve");return hd("http://www.opengis.net/gml",r)};t.prototype.writeFeatureElement=function(t,e,i){var r=e.getId();r&&t.setAttribute("fid",r);var n=i[i.length-1],o=n.featureNS,s=e.getGeometryName();if(!n.serializers){n.serializers={};n.serializers[o]={}}var a=e.getProperties(),h=[],l=[];for(var u in a){var c=a[u];if(null!==c){h.push(u);l.push(c);u==s||c instanceof Xe?u in n.serializers[o]||(n.serializers[o][u]=xd(this.writeGeometryElement,this)):u in n.serializers[o]||(n.serializers[o][u]=xd(Hd))}}var p=T({},n);p.node=t;Od(p,n.serializers,Td(void 0,o),l,i,h)};t.prototype.writeCurveOrLineString_=function(t,e,i){var r=i[i.length-1].srsName;"LineStringSegment"!==t.nodeName&&r&&t.setAttribute("srsName",r);if("LineString"===t.nodeName||"LineStringSegment"===t.nodeName){var n=this.createCoordinatesNode_(t.namespaceURI);t.appendChild(n);this.writeCoordinates_(n,e,i)}else if("Curve"===t.nodeName){var o=hd(t.namespaceURI,"segments");t.appendChild(o);this.writeCurveSegments_(o,e,i)}};t.prototype.writeLineStringOrCurveMember_=function(t,e,i){var r=this.GEOMETRY_NODE_FACTORY_(e,i);if(r){t.appendChild(r);this.writeCurveOrLineString_(r,e,i)}};t.prototype.writeMultiCurveOrLineString_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=r.srsName,s=r.curve;o&&t.setAttribute("srsName",o);var a=e.getLineStrings();Od({node:t,hasZ:n,srsName:o,curve:s},this.LINESTRINGORCURVEMEMBER_SERIALIZERS_,this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_,a,i,void 0,this)};t.prototype.writeGeometryElement=function(t,e,i){var r,n=i[i.length-1],o=T({},n);o.node=t;r=Array.isArray(e)?n.dataProjection?Le(e,n.featureProjection,n.dataProjection):e:qp(e,!0,n);Od(o,this.GEOMETRY_SERIALIZERS_,this.GEOMETRY_NODE_FACTORY_,[r],i,void 0,this)};t.prototype.createCoordinatesNode_=function(t){var e=hd(t,"coordinates");e.setAttribute("decimal",".");e.setAttribute("cs",",");e.setAttribute("ts"," ");return e};t.prototype.writeCoordinates_=function(t,e,i){for(var r=i[i.length-1],n=r.hasZ,o=r.srsName,s=e.getCoordinates(),a=s.length,h=new Array(a),l=0;l<a;++l){var u=s[l];h[l]=this.getCoords_(u,o,n)}Hd(t,h.join(" "))};t.prototype.writeCurveSegments_=function(t,e,i){var r=hd(t.namespaceURI,"LineStringSegment");t.appendChild(r);this.writeCurveOrLineString_(r,e,i)};t.prototype.writeSurfaceOrPolygon_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=r.srsName;"PolygonPatch"!==t.nodeName&&o&&t.setAttribute("srsName",o);if("Polygon"===t.nodeName||"PolygonPatch"===t.nodeName){var s=e.getLinearRings();Od({node:t,hasZ:n,srsName:o},this.RING_SERIALIZERS_,this.RING_NODE_FACTORY_,s,i,void 0,this)}else if("Surface"===t.nodeName){var a=hd(t.namespaceURI,"patches");t.appendChild(a);this.writeSurfacePatches_(a,e,i)}};t.prototype.RING_NODE_FACTORY_=function(t,e,i){var r=e[e.length-1],n=r.node,o=r.exteriorWritten;void 0===o&&(r.exteriorWritten=!0);return hd(n.namespaceURI,void 0!==o?"innerBoundaryIs":"outerBoundaryIs")};t.prototype.writeSurfacePatches_=function(t,e,i){var r=hd(t.namespaceURI,"PolygonPatch");t.appendChild(r);this.writeSurfaceOrPolygon_(r,e,i)};t.prototype.writeRing_=function(t,e,i){var r=hd(t.namespaceURI,"LinearRing");t.appendChild(r);this.writeLinearRing_(r,e,i)};t.prototype.getCoords_=function(t,e,i){var r="enu";e&&(r=ye(e).getAxisOrientation());var n="en"===r.substr(0,2)?t[0]+","+t[1]:t[1]+","+t[0];if(i){n+=","+(t[2]||0)}return n};t.prototype.writePoint_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=r.srsName;o&&t.setAttribute("srsName",o);var s=this.createCoordinatesNode_(t.namespaceURI);t.appendChild(s);var a=e.getCoordinates();Hd(s,this.getCoords_(a,o,n))};t.prototype.writeMultiPoint_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=r.srsName;o&&t.setAttribute("srsName",o);var s=e.getPoints();Od({node:t,hasZ:n,srsName:o},this.POINTMEMBER_SERIALIZERS_,Td("pointMember"),s,i,void 0,this)};t.prototype.writePointMember_=function(t,e,i){var r=hd(t.namespaceURI,"Point");t.appendChild(r);this.writePoint_(r,e,i)};t.prototype.writeLinearRing_=function(t,e,i){var r=i[i.length-1].srsName;r&&t.setAttribute("srsName",r);var n=this.createCoordinatesNode_(t.namespaceURI);t.appendChild(n);this.writeCoordinates_(n,e,i)};t.prototype.writeMultiSurfaceOrPolygon_=function(t,e,i){var r=i[i.length-1],n=r.hasZ,o=r.srsName,s=r.surface;o&&t.setAttribute("srsName",o);var a=e.getPolygons();Od({node:t,hasZ:n,srsName:o,surface:s},this.SURFACEORPOLYGONMEMBER_SERIALIZERS_,this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_,a,i,void 0,this)};t.prototype.writeSurfaceOrPolygonMember_=function(t,e,i){var r=this.GEOMETRY_NODE_FACTORY_(e,i);if(r){t.appendChild(r);this.writeSurfaceOrPolygon_(r,e,i)}};t.prototype.writeEnvelope=function(t,e,i){var r=i[i.length-1].srsName;r&&t.setAttribute("srsName",r);var n=[e[0]+" "+e[1],e[2]+" "+e[3]];Od({node:t},this.ENVELOPE_SERIALIZERS_,Sd,n,i,["lowerCorner","upperCorner"],this)};t.prototype.MULTIGEOMETRY_MEMBER_NODE_FACTORY_=function(t,e,i){var r=e[e.length-1].node;return hd("http://www.opengis.net/gml",$d[r.nodeName])};return t}(Fd);tf.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS_={"http://www.opengis.net/gml":{coordinates:yd(tf.prototype.readFlatCoordinates_)}};tf.prototype.FLAT_LINEAR_RINGS_PARSERS_={"http://www.opengis.net/gml":{innerBoundaryIs:tf.prototype.innerBoundaryIsParser_,outerBoundaryIs:tf.prototype.outerBoundaryIsParser_}};tf.prototype.BOX_PARSERS_={"http://www.opengis.net/gml":{coordinates:gd(tf.prototype.readFlatCoordinates_)}};tf.prototype.GEOMETRY_PARSERS_={"http://www.opengis.net/gml":{Point:yd(Fd.prototype.readPoint),MultiPoint:yd(Fd.prototype.readMultiPoint),LineString:yd(Fd.prototype.readLineString),MultiLineString:yd(Fd.prototype.readMultiLineString),LinearRing:yd(Fd.prototype.readLinearRing),Polygon:yd(Fd.prototype.readPolygon),MultiPolygon:yd(Fd.prototype.readMultiPolygon),Box:yd(tf.prototype.readBox_)}};tf.prototype.GEOMETRY_SERIALIZERS_={"http://www.opengis.net/gml":{Curve:xd(tf.prototype.writeCurveOrLineString_),MultiCurve:xd(tf.prototype.writeMultiCurveOrLineString_),Point:xd(tf.prototype.writePoint_),MultiPoint:xd(tf.prototype.writeMultiPoint_),LineString:xd(tf.prototype.writeCurveOrLineString_),MultiLineString:xd(tf.prototype.writeMultiCurveOrLineString_),LinearRing:xd(tf.prototype.writeLinearRing_),Polygon:xd(tf.prototype.writeSurfaceOrPolygon_),MultiPolygon:xd(tf.prototype.writeMultiSurfaceOrPolygon_),Surface:xd(tf.prototype.writeSurfaceOrPolygon_),MultiSurface:xd(tf.prototype.writeMultiSurfaceOrPolygon_),Envelope:xd(tf.prototype.writeEnvelope)}};tf.prototype.LINESTRINGORCURVEMEMBER_SERIALIZERS_={"http://www.opengis.net/gml":{lineStringMember:xd(tf.prototype.writeLineStringOrCurveMember_),curveMember:xd(tf.prototype.writeLineStringOrCurveMember_)}};tf.prototype.RING_SERIALIZERS_={"http://www.opengis.net/gml":{outerBoundaryIs:xd(tf.prototype.writeRing_),innerBoundaryIs:xd(tf.prototype.writeRing_)}};tf.prototype.POINTMEMBER_SERIALIZERS_={"http://www.opengis.net/gml":{pointMember:xd(tf.prototype.writePointMember_)}};tf.prototype.SURFACEORPOLYGONMEMBER_SERIALIZERS_={"http://www.opengis.net/gml":{surfaceMember:xd(tf.prototype.writeSurfaceOrPolygonMember_),polygonMember:xd(tf.prototype.writeSurfaceOrPolygonMember_)}};tf.prototype.ENVELOPE_SERIALIZERS_={"http://www.opengis.net/gml":{lowerCorner:xd(Hd),upperCorner:xd(Hd)}};var ef=[null,"http://www.topografix.com/GPX/1/0","http://www.topografix.com/GPX/1/1"],rf={rte:bf,trk:Mf,wpt:Ff},nf=Rd(ef,{rte:gd(bf),trk:gd(Mf),wpt:gd(Ff)}),of=Rd(ef,{text:md(Yd,"linkText"),type:md(Yd,"linkType")}),sf=Rd(ef,{rte:xd(function(t,e,i){var r=i[0],n=e.getProperties(),o={node:t,properties:n},s=e.getGeometry();if(s){s=qp(s,!0,r);o.geometryLayout=s.getLayout();n.rtept=s.getCoordinates()}var a=i[i.length-1].node,h=gf[a.namespaceURI],l=Cd(n,h);Od(o,yf,Sd,l,i,h)}),trk:xd(function(t,e,i){var r=i[0],n=e.getProperties(),o={node:t,properties:n},s=e.getGeometry();if(s){s=qp(s,!0,r);n.trkseg=s.getLineStrings()}var a=i[i.length-1].node,h=mf[a.namespaceURI],l=Cd(n,h);Od(o,xf,Sd,l,i,h)}),wpt:xd(function(t,e,i){var r=i[0],n=i[i.length-1];n.properties=e.getProperties();var o=e.getGeometry();if(o){o=qp(o,!0,r);n.geometryLayout=o.getLayout();Nf(t,o.getCoordinates(),i)}})}),af=function(i){function t(t){i.call(this);var e=t||{};this.dataProjection=ye("EPSG:4326");this.readExtensions_=e.readExtensions}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.handleReadExtensions_=function(t){t||(t=[]);for(var e=0,i=t.length;e<i;++e){var r=t[e];if(this.readExtensions_){var n=r.get("extensionsNode_")||null;this.readExtensions_(r,n)}r.set("extensionsNode_",void 0)}};t.prototype.readFeatureFromNode=function(t,e){if(!Lr(ef,t.namespaceURI))return null;var i=rf[t.localName];if(!i)return null;var r=i(t,[this.getReadOptions(t,e)]);if(!r)return null;this.handleReadExtensions_([r]);return r};t.prototype.readFeaturesFromNode=function(t,e){if(!Lr(ef,t.namespaceURI))return[];if("gpx"!=t.localName)return[];var i=wd([],nf,t,[this.getReadOptions(t,e)]);if(i){this.handleReadExtensions_(i);return i}return[]};t.prototype.writeFeaturesNode=function(t,e){e=this.adaptOptions(e);var i=hd("http://www.topografix.com/GPX/1/1","gpx");i.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xsi",ad);i.setAttributeNS(ad,"xsi:schemaLocation","http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd");i.setAttribute("version","1.1");i.setAttribute("creator","OpenLayers");Od({node:i},sf,If,t,[e]);return i};return t}(Pd),hf=Rd(ef,{name:md(Yd),cmt:md(Yd),desc:md(Yd),src:md(Yd),link:Of,number:md(jd),extensions:Pf,type:md(Yd),rtept:function(t,e){var i=wd({},lf,t,e);if(i){var r=e[e.length-1],n=r.flatCoordinates,o=r.layoutOptions;wf(n,o,t,i)}}}),lf=Rd(ef,{ele:md(Gd),time:md(Dd)}),uf=Rd(ef,{name:md(Yd),cmt:md(Yd),desc:md(Yd),src:md(Yd),link:Of,number:md(jd),type:md(Yd),extensions:Pf,trkseg:function(t,e){var i=e[e.length-1];Id(cf,t,e);var r=i.flatCoordinates;i.ends.push(r.length)}}),cf=Rd(ef,{trkpt:function(t,e){var i=wd({},pf,t,e);if(i){var r=e[e.length-1],n=r.flatCoordinates,o=r.layoutOptions;wf(n,o,t,i)}}}),pf=Rd(ef,{ele:md(Gd),time:md(Dd)}),df=Rd(ef,{ele:md(Gd),time:md(Dd),magvar:md(Gd),geoidheight:md(Gd),name:md(Yd),cmt:md(Yd),desc:md(Yd),src:md(Yd),link:Of,sym:md(Yd),type:md(Yd),fix:md(Yd),sat:md(jd),hdop:md(Gd),vdop:md(Gd),pdop:md(Gd),ageofdgpsdata:md(Gd),dgpsid:md(jd),extensions:Pf}),ff=["text","type"],_f=Rd(ef,{text:xd(Hd),type:xd(Hd)}),gf=Rd(ef,["name","cmt","desc","src","link","number","type","rtept"]),yf=Rd(ef,{name:xd(Hd),cmt:xd(Hd),desc:xd(Hd),src:xd(Hd),link:xd(Af),number:xd(Wd),type:xd(Hd),rtept:Ed(xd(Nf))}),vf=Rd(ef,["ele","time"]),mf=Rd(ef,["name","cmt","desc","src","link","number","type","trkseg"]),xf=Rd(ef,{name:xd(Hd),cmt:xd(Hd),desc:xd(Hd),src:xd(Hd),link:xd(Af),number:xd(Wd),type:xd(Hd),trkseg:Ed(xd(function(t,e,i){Od({node:t,geometryLayout:e.getLayout(),properties:{}},Tf,Ef,e.getCoordinates(),i)}))}),Ef=Td("trkpt"),Tf=Rd(ef,{trkpt:xd(Nf)}),Sf=Rd(ef,["ele","time","magvar","geoidheight","name","cmt","desc","src","link","sym","type","fix","sat","hdop","vdop","pdop","ageofdgpsdata","dgpsid"]),Cf=Rd(ef,{ele:xd(zd),time:xd(Xd),magvar:xd(zd),geoidheight:xd(zd),name:xd(Hd),cmt:xd(Hd),desc:xd(Hd),src:xd(Hd),link:xd(Af),sym:xd(Hd),type:xd(Hd),fix:xd(Hd),sat:xd(Wd),hdop:xd(zd),vdop:xd(zd),pdop:xd(zd),ageofdgpsdata:xd(zd),dgpsid:xd(Wd)}),Rf={Point:"wpt",LineString:"rte",MultiLineString:"trk"};function If(t,e,i){var r=t.getGeometry();if(r){var n=Rf[r.getType()];if(n){return hd(e[e.length-1].node.namespaceURI,n)}}}function wf(t,e,i,r){t.push(parseFloat(i.getAttribute("lon")),parseFloat(i.getAttribute("lat")));if("ele"in r){t.push(r.ele);delete r.ele;e.hasZ=!0}else t.push(0);if("time"in r){t.push(r.time);delete r.time;e.hasM=!0}else t.push(0);return t}function Lf(t,e,i){var r=kr.XY,n=2;if(t.hasZ&&t.hasM){r=kr.XYZM;n=4}else if(t.hasZ){r=kr.XYZ;n=3}else if(t.hasM){r=kr.XYM;n=3}if(4!==n){for(var o=0,s=e.length/4;o<s;o++){e[o*n]=e[4*o];e[o*n+1]=e[4*o+1];t.hasZ&&(e[o*n+2]=e[4*o+2]);t.hasM&&(e[o*n+2]=e[4*o+3])}e.length=e.length/4*n;if(i)for(var a=0,h=i.length;a<h;a++)i[a]=i[a]/4*n}return r}function Of(t,e){var i=e[e.length-1],r=t.getAttribute("href");null!==r&&(i.link=r);Id(of,t,e)}function Pf(t,e){e[e.length-1].extensionsNode_=t}function bf(t,e){var i=e[0],r=wd({flatCoordinates:[],layoutOptions:{}},hf,t,e);if(r){var n=r.flatCoordinates;delete r.flatCoordinates;var o=r.layoutOptions;delete r.layoutOptions;var s=Lf(o,n),a=new ro(n,s);qp(a,!1,i);var h=new Sr(a);h.setProperties(r);return h}}function Mf(t,e){var i=e[0],r=wd({flatCoordinates:[],ends:[],layoutOptions:{}},uf,t,e);if(r){var n=r.flatCoordinates;delete r.flatCoordinates;var o=r.ends;delete r.ends;var s=r.layoutOptions;delete r.layoutOptions;var a=Lf(s,n,o),h=new Rh(n,a,o);qp(h,!1,i);var l=new Sr(h);l.setProperties(r);return l}}function Ff(t,e){var i=e[0],r=wd({},df,t,e);if(r){var n={},o=wf([],n,t,r),s=Lf(n,o),a=new fn(o,s);qp(a,!1,i);var h=new Sr(a);h.setProperties(r);return h}}function Af(t,e,i){t.setAttribute("href",e);var r=i[i.length-1].properties,n=[r.linkText,r.linkType];Od({node:t},_f,Sd,n,i,ff)}function Nf(t,e,i){var r=i[i.length-1],n=r.node.namespaceURI,o=r.properties;t.setAttributeNS(null,"lat",e[1]);t.setAttributeNS(null,"lon",e[0]);switch(r.geometryLayout){case kr.XYZM:0!==e[3]&&(o.time=e[3]);case kr.XYZ:0!==e[2]&&(o.ele=e[2]);break;case kr.XYM:0!==e[2]&&(o.time=e[2])}var s="rtept"==t.nodeName?vf[n]:Sf[n],a=Cd(o,s);Od({node:t,properties:o},Cf,Sd,a,i,s)}var Df=function(e){function u(t){e.call(this);this.geometries_=t||null;this.listenGeometriesChange_()}e&&(u.__proto__=e);((u.prototype=Object.create(e&&e.prototype)).constructor=u).prototype.unlistenGeometriesChange_=function(){if(this.geometries_)for(var t=0,e=this.geometries_.length;t<e;++t)f(this.geometries_[t],R.CHANGE,this.changed,this)};u.prototype.listenGeometriesChange_=function(){if(this.geometries_)for(var t=0,e=this.geometries_.length;t<e;++t)S(this.geometries_[t],R.CHANGE,this.changed,this)};u.prototype.clone=function(){var t=new u(null);t.setGeometries(this.geometries_);return t};u.prototype.closestPointXY=function(t,e,i,r){if(r<U(this.getExtent(),t,e))return r;for(var n=this.geometries_,o=0,s=n.length;o<s;++o)r=n[o].closestPointXY(t,e,i,r);return r};u.prototype.containsXY=function(t,e){for(var i=this.geometries_,r=0,n=i.length;r<n;++r)if(i[r].containsXY(t,e))return!0;return!1};u.prototype.computeExtent=function(t){W(t);for(var e=this.geometries_,i=0,r=e.length;i<r;++i)q(t,e[i].getExtent());return t};u.prototype.getGeometries=function(){return Gf(this.geometries_)};u.prototype.getGeometriesArray=function(){return this.geometries_};u.prototype.getSimplifiedGeometry=function(t){if(this.simplifiedGeometryRevision!=this.getRevision()){_(this.simplifiedGeometryCache);this.simplifiedGeometryMaxMinSquaredTolerance=0;this.simplifiedGeometryRevision=this.getRevision()}if(t<0||0!==this.simplifiedGeometryMaxMinSquaredTolerance&&t<this.simplifiedGeometryMaxMinSquaredTolerance)return this;var e=t.toString();if(this.simplifiedGeometryCache.hasOwnProperty(e))return this.simplifiedGeometryCache[e];for(var i=[],r=this.geometries_,n=!1,o=0,s=r.length;o<s;++o){var a=r[o],h=a.getSimplifiedGeometry(t);i.push(h);h!==a&&(n=!0)}if(n){var l=new u(null);l.setGeometriesArray(i);return this.simplifiedGeometryCache[e]=l}this.simplifiedGeometryMaxMinSquaredTolerance=t;return this};u.prototype.getType=function(){return kt.GEOMETRY_COLLECTION};u.prototype.intersectsExtent=function(t){for(var e=this.geometries_,i=0,r=e.length;i<r;++i)if(e[i].intersectsExtent(t))return!0;return!1};u.prototype.isEmpty=function(){return 0===this.geometries_.length};u.prototype.rotate=function(t,e){for(var i=this.geometries_,r=0,n=i.length;r<n;++r)i[r].rotate(t,e);this.changed()};u.prototype.scale=function(t,e,i){var r=i;r||(r=ht(this.getExtent()));for(var n=this.geometries_,o=0,s=n.length;o<s;++o)n[o].scale(t,e,r);this.changed()};u.prototype.setGeometries=function(t){this.setGeometriesArray(Gf(t))};u.prototype.setGeometriesArray=function(t){this.unlistenGeometriesChange_();this.geometries_=t;this.listenGeometriesChange_();this.changed()};u.prototype.applyTransform=function(t){for(var e=this.geometries_,i=0,r=e.length;i<r;++i)e[i].applyTransform(t);this.changed()};u.prototype.translate=function(t,e){for(var i=this.geometries_,r=0,n=i.length;r<n;++r)i[r].translate(t,e);this.changed()};u.prototype.disposeInternal=function(){this.unlistenGeometriesChange_();e.prototype.disposeInternal.call(this)};return u}(Xe);function Gf(t){for(var e=[],i=0,r=t.length;i<r;++i)e.push(t[i].clone());return e}var kf=function(i){function t(t){var e=t||{};i.call(this);this.dataProjection=ye(e.dataProjection?e.dataProjection:"EPSG:4326");e.featureProjection&&(this.defaultFeatureProjection=ye(e.featureProjection));this.geometryName_=e.geometryName;this.extractGeometryName_=e.extractGeometryName}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readFeatureFromObject=function(t,e){var i=null,r=Yf((i="Feature"===t.type?t:{type:"Feature",geometry:t}).geometry,e),n=new Sr;this.geometryName_?n.setGeometryName(this.geometryName_):this.extractGeometryName_&&void 0!==i.geometry_name&&n.setGeometryName(i.geometry_name);n.setGeometry(r);void 0!==i.id&&n.setId(i.id);i.properties&&n.setProperties(i.properties);return n};t.prototype.readFeaturesFromObject=function(t,e){var i=null;if("FeatureCollection"===t.type){i=[];for(var r=t.features,n=0,o=r.length;n<o;++n)i.push(this.readFeatureFromObject(r[n],e))}else i=[this.readFeatureFromObject(t,e)];return i};t.prototype.readGeometryFromObject=function(t,e){return Yf(t,e)};t.prototype.readProjectionFromObject=function(t){var e,i=t.crs;i?"name"==i.type?e=ye(i.properties.name):A(!1,36):e=this.dataProjection;return e};t.prototype.writeFeatureObject=function(t,e){e=this.adaptOptions(e);var i={type:"Feature"},r=t.getId();void 0!==r&&(i.id=r);var n=t.getGeometry();i.geometry=n?Bf(n,e):null;var o=t.getProperties();delete o[t.getGeometryName()];Ct(o)?i.properties=null:i.properties=o;return i};t.prototype.writeFeaturesObject=function(t,e){e=this.adaptOptions(e);for(var i=[],r=0,n=t.length;r<n;++r)i.push(this.writeFeatureObject(t[r],e));return{type:"FeatureCollection",features:i}};t.prototype.writeGeometryObject=function(t,e){return Bf(t,this.adaptOptions(e))};return t}(Jp),jf={Point:function(t){return new fn(t.coordinates)},LineString:function(t){return new ro(t.coordinates)},Polygon:function(t){return new Fn(t.coordinates)},MultiPoint:function(t){return new Ih(t.coordinates)},MultiLineString:function(t){return new Rh(t.coordinates)},MultiPolygon:function(t){return new Lh(t.coordinates)},GeometryCollection:function(t,e){var i=t.geometries.map(function(t){return Yf(t,e)});return new Df(i)}},Uf={Point:function(t,e){return{type:"Point",coordinates:t.getCoordinates()}},LineString:function(t,e){return{type:"LineString",coordinates:t.getCoordinates()}},Polygon:function(t,e){var i;e&&(i=e.rightHanded);return{type:"Polygon",coordinates:t.getCoordinates(i)}},MultiPoint:function(t,e){return{type:"MultiPoint",coordinates:t.getCoordinates()}},MultiLineString:function(t,e){return{type:"MultiLineString",coordinates:t.getCoordinates()}},MultiPolygon:function(t,e){var i;e&&(i=e.rightHanded);return{type:"MultiPolygon",coordinates:t.getCoordinates(i)}},GeometryCollection:function(t,i){return{type:"GeometryCollection",geometries:t.getGeometriesArray().map(function(t){var e=T({},i);delete e.featureProjection;return Bf(t,e)})}},Circle:function(t){return{type:"GeometryCollection",geometries:[]}}};function Yf(t,e){return t?qp((0,jf[t.type])(t),!1,e):null}function Bf(t,e){return(0,Uf[t.getType()])(qp(t,!0,e),e)}var Vf=function(t){function e(){t.call(this)}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.getType=function(){return Mh.TEXT};e.prototype.readFeature=function(t,e){return this.readFeatureFromText(Xf(t),this.adaptOptions(e))};e.prototype.readFeatureFromText=function(t,e){};e.prototype.readFeatures=function(t,e){return this.readFeaturesFromText(Xf(t),this.adaptOptions(e))};e.prototype.readFeaturesFromText=function(t,e){};e.prototype.readGeometry=function(t,e){return this.readGeometryFromText(Xf(t),this.adaptOptions(e))};e.prototype.readGeometryFromText=function(t,e){};e.prototype.readProjection=function(t){return this.readProjectionFromText(Xf(t))};e.prototype.readProjectionFromText=function(t){return this.dataProjection};e.prototype.writeFeature=function(t,e){return this.writeFeatureText(t,this.adaptOptions(e))};e.prototype.writeFeatureText=function(t,e){};e.prototype.writeFeatures=function(t,e){return this.writeFeaturesText(t,this.adaptOptions(e))};e.prototype.writeFeaturesText=function(t,e){};e.prototype.writeGeometry=function(t,e){return this.writeGeometryText(t,this.adaptOptions(e))};e.prototype.writeGeometryText=function(t,e){};return e}(Zp);function Xf(t){return"string"==typeof t?t:""}var zf="barometric",Wf="gps",Hf="none",Kf=/^B(\d{2})(\d{2})(\d{2})(\d{2})(\d{5})([NS])(\d{3})(\d{5})([EW])([AV])(\d{5})(\d{5})/,Zf=/^H.([A-Z]{3}).*?:(.*)/,qf=/^HFDTE(\d{2})(\d{2})(\d{2})/,Jf=/\r\n|\r|\n/,Qf=function(i){function t(t){i.call(this);var e=t||{};this.dataProjection=ye("EPSG:4326");this.altitudeMode_=e.altitudeMode?e.altitudeMode:Hf}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readFeatureFromText=function(t,e){var i,r,n=this.altitudeMode_,o=t.split(Jf),s={},a=[],h=2e3,l=0,u=1,c=-1;for(i=0,r=o.length;i<r;++i){var p=o[i],d=void 0;if("B"==p.charAt(0)){if(d=Kf.exec(p)){var f=parseInt(d[1],10),_=parseInt(d[2],10),g=parseInt(d[3],10),y=parseInt(d[4],10)+parseInt(d[5],10)/6e4;"S"==d[6]&&(y=-y);var v=parseInt(d[7],10)+parseInt(d[8],10)/6e4;"W"==d[9]&&(v=-v);a.push(v,y);if(n!=Hf){var m=void 0;m=n==Wf?parseInt(d[11],10):n==zf?parseInt(d[12],10):0;a.push(m)}var x=Date.UTC(h,l,u,f,_,g);x<c&&(x=Date.UTC(h,l,u+1,f,_,g));a.push(x/1e3);c=x}}else if("H"==p.charAt(0))if(d=qf.exec(p)){u=parseInt(d[1],10);l=parseInt(d[2],10)-1;h=2e3+parseInt(d[3],10)}else(d=Zf.exec(p))&&(s[d[1]]=d[2].trim())}if(0===a.length)return null;var E=n==Hf?kr.XYM:kr.XYZM,T=new ro(a,E),S=new Sr(qp(T,!1,e));S.setProperties(s);return S};t.prototype.readFeaturesFromText=function(t,e){var i=this.readFeatureFromText(t,e);return i?[i]:[]};return t}(Vf),$f={FRACTION:"fraction",PIXELS:"pixels"},t_=function(s){function t(t,e,i,r,n,o){s.call(this);this.hitDetectionImage_=null;this.image_=t||new Image;null!==r&&(this.image_.crossOrigin=r);this.canvas_=o?document.createElement("canvas"):null;this.color_=o;this.imageListenerKeys_=null;this.imageState_=n;this.size_=i;this.src_=e;this.tainting_=!1;this.imageState_==Ni.LOADED&&this.determineTainting_()}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.determineTainting_=function(){var t=ii(1,1);try{t.drawImage(this.image_,0,0);t.getImageData(0,0,1,1)}catch(t){this.tainting_=!0}};t.prototype.dispatchChangeEvent_=function(){this.dispatchEvent(R.CHANGE)};t.prototype.handleImageError_=function(){this.imageState_=Ni.ERROR;this.unlistenImage_();this.dispatchChangeEvent_()};t.prototype.handleImageLoad_=function(){this.imageState_=Ni.LOADED;if(this.size_){this.image_.width=this.size_[0];this.image_.height=this.size_[1]}this.size_=[this.image_.width,this.image_.height];this.unlistenImage_();this.determineTainting_();this.replaceColor_();this.dispatchChangeEvent_()};t.prototype.getImage=function(t){return this.canvas_?this.canvas_:this.image_};t.prototype.getImageState=function(){return this.imageState_};t.prototype.getHitDetectionImage=function(t){if(!this.hitDetectionImage_)if(this.tainting_){var e=this.size_[0],i=this.size_[1],r=ii(e,i);r.fillRect(0,0,e,i);this.hitDetectionImage_=r.canvas}else this.hitDetectionImage_=this.image_;return this.hitDetectionImage_};t.prototype.getSize=function(){return this.size_};t.prototype.getSrc=function(){return this.src_};t.prototype.load=function(){if(this.imageState_==Ni.IDLE){this.imageState_=Ni.LOADING;this.imageListenerKeys_=[d(this.image_,R.ERROR,this.handleImageError_,this),d(this.image_,R.LOAD,this.handleImageLoad_,this)];try{this.image_.src=this.src_}catch(t){this.handleImageError_()}}};t.prototype.replaceColor_=function(){if(!this.tainting_&&null!==this.color_){this.canvas_.width=this.image_.width;this.canvas_.height=this.image_.height;var t=this.canvas_.getContext("2d");t.drawImage(this.image_,0,0);for(var e=t.getImageData(0,0,this.image_.width,this.image_.height),i=e.data,r=this.color_[0]/255,n=this.color_[1]/255,o=this.color_[2]/255,s=0,a=i.length;s<a;s+=4){i[s]*=r;i[s+1]*=n;i[s+2]*=o}t.putImageData(e,0,0)}};t.prototype.unlistenImage_=function(){this.imageListenerKeys_.forEach(g);this.imageListenerKeys_=null};return t}(i);function e_(t,e,i,r,n,o){var s=$l.get(e,r,o);if(!s){s=new t_(t,e,i,r,n,o);$l.set(e,r,o,s)}return s}var i_,r_,n_,o_,s_,a_,h_,l_={BOTTOM_LEFT:"bottom-left",BOTTOM_RIGHT:"bottom-right",TOP_LEFT:"top-left",TOP_RIGHT:"top-right"},u_=function(u){function t(t){var e=t||{},i=void 0!==e.opacity?e.opacity:1,r=void 0!==e.rotation?e.rotation:0,n=void 0!==e.scale?e.scale:1,o=void 0!==e.rotateWithView&&e.rotateWithView;u.call(this,{opacity:i,rotation:r,scale:n,rotateWithView:o});this.anchor_=void 0!==e.anchor?e.anchor:[.5,.5];this.normalizedAnchor_=null;this.anchorOrigin_=void 0!==e.anchorOrigin?e.anchorOrigin:l_.TOP_LEFT;this.anchorXUnits_=void 0!==e.anchorXUnits?e.anchorXUnits:$f.FRACTION;this.anchorYUnits_=void 0!==e.anchorYUnits?e.anchorYUnits:$f.FRACTION;this.crossOrigin_=void 0!==e.crossOrigin?e.crossOrigin:null;var s=void 0!==e.img?e.img:null,a=void 0!==e.imgSize?e.imgSize:null,h=e.src;A(!(void 0!==h&&s),4);A(!s||s&&a,5);void 0!==h&&0!==h.length||!s||(h=s.src||St(s).toString());A(void 0!==h&&0<h.length,6);var l=void 0!==e.src?Ni.IDLE:Ni.LOADED;this.color_=void 0!==e.color?Je(e.color):null;this.iconImage_=e_(s,h,a,this.crossOrigin_,l,this.color_);this.offset_=void 0!==e.offset?e.offset:[0,0];this.offsetOrigin_=void 0!==e.offsetOrigin?e.offsetOrigin:l_.TOP_LEFT;this.origin_=null;this.size_=void 0!==e.size?e.size:null}u&&(t.__proto__=u);((t.prototype=Object.create(u&&u.prototype)).constructor=t).prototype.clone=function(){return new t({anchor:this.anchor_.slice(),anchorOrigin:this.anchorOrigin_,anchorXUnits:this.anchorXUnits_,anchorYUnits:this.anchorYUnits_,crossOrigin:this.crossOrigin_,color:this.color_&&this.color_.slice?this.color_.slice():this.color_||void 0,src:this.getSrc(),offset:this.offset_.slice(),offsetOrigin:this.offsetOrigin_,size:null!==this.size_?this.size_.slice():void 0,opacity:this.getOpacity(),scale:this.getScale(),rotation:this.getRotation(),rotateWithView:this.getRotateWithView()})};t.prototype.getAnchor=function(){if(this.normalizedAnchor_)return this.normalizedAnchor_;var t=this.anchor_,e=this.getSize();if(this.anchorXUnits_==$f.FRACTION||this.anchorYUnits_==$f.FRACTION){if(!e)return null;t=this.anchor_.slice();this.anchorXUnits_==$f.FRACTION&&(t[0]*=e[0]);this.anchorYUnits_==$f.FRACTION&&(t[1]*=e[1])}if(this.anchorOrigin_!=l_.TOP_LEFT){if(!e)return null;t===this.anchor_&&(t=this.anchor_.slice());this.anchorOrigin_!=l_.TOP_RIGHT&&this.anchorOrigin_!=l_.BOTTOM_RIGHT||(t[0]=-t[0]+e[0]);this.anchorOrigin_!=l_.BOTTOM_LEFT&&this.anchorOrigin_!=l_.BOTTOM_RIGHT||(t[1]=-t[1]+e[1])}this.normalizedAnchor_=t;return this.normalizedAnchor_};t.prototype.setAnchor=function(t){this.anchor_=t;this.normalizedAnchor_=null};t.prototype.getColor=function(){return this.color_};t.prototype.getImage=function(t){return this.iconImage_.getImage(t)};t.prototype.getImageSize=function(){return this.iconImage_.getSize()};t.prototype.getHitDetectionImageSize=function(){return this.getImageSize()};t.prototype.getImageState=function(){return this.iconImage_.getImageState()};t.prototype.getHitDetectionImage=function(t){return this.iconImage_.getHitDetectionImage(t)};t.prototype.getOrigin=function(){if(this.origin_)return this.origin_;var t=this.offset_;if(this.offsetOrigin_!=l_.TOP_LEFT){var e=this.getSize(),i=this.iconImage_.getSize();if(!e||!i)return null;t=t.slice();this.offsetOrigin_!=l_.TOP_RIGHT&&this.offsetOrigin_!=l_.BOTTOM_RIGHT||(t[0]=i[0]-e[0]-t[0]);this.offsetOrigin_!=l_.BOTTOM_LEFT&&this.offsetOrigin_!=l_.BOTTOM_RIGHT||(t[1]=i[1]-e[1]-t[1])}this.origin_=t;return this.origin_};t.prototype.getSrc=function(){return this.iconImage_.getSrc()};t.prototype.getSize=function(){return this.size_?this.size_:this.iconImage_.getSize()};t.prototype.listenImageChange=function(t,e){return S(this.iconImage_,R.CHANGE,t,e)};t.prototype.load=function(){this.iconImage_.load()};t.prototype.unlistenImageChange=function(t,e){f(this.iconImage_,R.CHANGE,t,e)};return t}(pr),c_=["http://www.google.com/kml/ext/2.2"],p_=[null,"http://earth.google.com/kml/2.0","http://earth.google.com/kml/2.1","http://earth.google.com/kml/2.2","http://www.opengis.net/kml/2.2"],d_={fraction:$f.FRACTION,pixels:$f.PIXELS,insetPixels:$f.PIXELS},f_=Rd(p_,{ExtendedData:ag,Region:hg,MultiGeometry:md(Q_,"geometry"),LineString:md(Z_,"geometry"),LinearRing:md(q_,"geometry"),Point:md($_,"geometry"),Polygon:md(eg,"geometry"),Style:md(rg),StyleMap:function(t,e){var i=N_(t,e);if(!i)return;var r=e[e.length-1];Array.isArray(i)?r.Style=i:"string"==typeof i?r.styleUrl=i:A(!1,38)},address:md(Yd),description:md(Yd),name:md(Yd),open:md(Ad),phoneNumber:md(Yd),styleUrl:md(M_),visibility:md(Ad)},Rd(c_,{MultiTrack:md(function(t,e){var i=wd([],B_,t,e);return i?new Rh(i):void 0},"geometry"),Track:md(X_,"geometry")})),__=Rd(p_,{ExtendedData:ag,Region:hg,Link:function(t,e){Id(g_,t,e)},address:md(Yd),description:md(Yd),name:md(Yd),open:md(Ad),phoneNumber:md(Yd),visibility:md(Ad)}),g_=Rd(p_,{href:md(M_)}),y_=Rd(p_,{LatLonAltBox:function(t,e){var i=wd({},cg,t,e);if(!i)return;var r=e[e.length-1],n=[parseFloat(i.west),parseFloat(i.south),parseFloat(i.east),parseFloat(i.north)];r.extent=n;r.altitudeMode=i.altitudeMode;r.minAltitude=parseFloat(i.minAltitude);r.maxAltitude=parseFloat(i.maxAltitude)},Lod:function(t,e){var i=wd({},pg,t,e);if(!i)return;var r=e[e.length-1];r.minLodPixels=parseFloat(i.minLodPixels);r.maxLodPixels=parseFloat(i.maxLodPixels);r.minFadeExtent=parseFloat(i.minFadeExtent);r.maxFadeExtent=parseFloat(i.maxFadeExtent)}}),v_=Rd(p_,["Document","Placemark"]),m_=Rd(p_,{Document:xd(function(t,e,i){Od({node:t},yg,vg,e,i,void 0,this)}),Placemark:xd(Bg)}),x_=null;var E_,T_=null;var S_,C_=null;var R_=null;var I_=null;var w_=null;var L_=function(i){function t(t){i.call(this);var e=t||{};w_||function(){x_=new _r({color:i_=[255,255,255,1]});r_=[20,2];n_=$f.PIXELS;o_=$f.PIXELS;s_=[64,64];a_="https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png";h_=.5;T_=new u_({anchor:r_,anchorOrigin:l_.BOTTOM_LEFT,anchorXUnits:n_,anchorYUnits:o_,crossOrigin:"anonymous",rotation:0,scale:h_,size:s_,src:a_});E_="NO_IMAGE";C_=new gr({color:i_,width:1});S_=new gr({color:[51,51,51,1],width:2});R_=new lo({font:"bold 16px Helvetica",fill:x_,stroke:S_,scale:.8});I_=new yr({fill:x_,image:T_,text:R_,stroke:C_,zIndex:0});w_=[I_]}();this.dataProjection=ye("EPSG:4326");this.defaultStyle_=e.defaultStyle?e.defaultStyle:w_;this.extractStyles_=void 0===e.extractStyles||e.extractStyles;this.writeStyles_=void 0===e.writeStyles||e.writeStyles;this.sharedStyles_={};this.showPointNames_=void 0===e.showPointNames||e.showPointNames}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readDocumentOrFolder_=function(t,e){var i=wd([],Rd(p_,{Document:_d(this.readDocumentOrFolder_,this),Folder:_d(this.readDocumentOrFolder_,this),Placemark:gd(this.readPlacemark_,this),Style:this.readSharedStyle_.bind(this),StyleMap:this.readSharedStyleMap_.bind(this)}),t,e,this);return i||void 0};t.prototype.readPlacemark_=function(t,e){var i=wd({geometry:null},f_,t,e);if(i){var r=new Sr,n=t.getAttribute("id");null!==n&&r.setId(n);var a,h,l,u,c,o=e[0],s=i.geometry;s&&qp(s,!1,o);r.setGeometry(s);delete i.geometry;if(this.extractStyles_){var p=i.Style,d=i.styleUrl,f=(a=p,h=d,l=this.defaultStyle_,u=this.sharedStyles_,c=this.showPointNames_,function(t,e){var i,r=c,n="";if(r){var o=t.getGeometry();o&&(r=o.getType()===kt.POINT)}if(r){n=t.get("name");r=r&&n}if(a){if(r){i=O_(a[0],n);return a.concat(i)}return a}if(h){var s=function t(e,i,r){if(Array.isArray(e))return e;if("string"!=typeof e)return i;!(e in r)&&"#"+e in r&&(e="#"+e);return t(r[e],i,r)}(h,l,u);if(r){i=O_(s[0],n);return s.concat(i)}return s}if(r){i=O_(l[0],n);return l.concat(i)}return l});r.setStyle(f)}delete i.Style;r.setProperties(i);return r}};t.prototype.readSharedStyle_=function(t,e){var i=t.getAttribute("id");if(null!==i){var r=rg(t,e);if(r){var n,o=t.baseURI;o&&"about:blank"!=o||(o=window.location.href);if(o){n=new URL("#"+i,o).href}else n="#"+i;this.sharedStyles_[n]=r}}};t.prototype.readSharedStyleMap_=function(t,e){var i=t.getAttribute("id");if(null!==i){var r=N_(t,e);if(r){var n,o=t.baseURI;o&&"about:blank"!=o||(o=window.location.href);if(o){n=new URL("#"+i,o).href}else n="#"+i;this.sharedStyles_[n]=r}}};t.prototype.readFeatureFromNode=function(t,e){if(!Lr(p_,t.namespaceURI))return null;var i=this.readPlacemark_(t,[this.getReadOptions(t,e)]);return i||null};t.prototype.readFeaturesFromNode=function(t,e){var i;if(!Lr(p_,t.namespaceURI))return[];var r=t.localName;if("Document"==r||"Folder"==r)return(i=this.readDocumentOrFolder_(t,[this.getReadOptions(t,e)]))||[];if("Placemark"==r){var n=this.readPlacemark_(t,[this.getReadOptions(t,e)]);return n?[n]:[]}if("kml"!=r)return[];i=[];for(var o=t.firstElementChild;o;o=o.nextElementSibling){var s=this.readFeaturesFromNode(o,e);s&&br(i,s)}return i};t.prototype.readName=function(t){if(cd(t))return this.readNameFromDocument(t);if(pd(t))return this.readNameFromNode(t);if("string"==typeof t){var e=fd(t);return this.readNameFromDocument(e)}};t.prototype.readNameFromDocument=function(t){for(var e=t.firstChild;e;e=e.nextSibling)if(e.nodeType==Node.ELEMENT_NODE){var i=this.readNameFromNode(e);if(i)return i}};t.prototype.readNameFromNode=function(t){for(var e=t.firstElementChild;e;e=e.nextElementSibling)if(Lr(p_,e.namespaceURI)&&"name"==e.localName)return Yd(e);for(var i=t.firstElementChild;i;i=i.nextElementSibling){var r=i.localName;if(Lr(p_,i.namespaceURI)&&("Document"==r||"Folder"==r||"Placemark"==r||"kml"==r)){var n=this.readNameFromNode(i);if(n)return n}}};t.prototype.readNetworkLinks=function(t){var e=[];if(cd(t))br(e,this.readNetworkLinksFromDocument(t));else if(pd(t))br(e,this.readNetworkLinksFromNode(t));else if("string"==typeof t){var i=fd(t);br(e,this.readNetworkLinksFromDocument(i))}return e};t.prototype.readNetworkLinksFromDocument=function(t){for(var e=[],i=t.firstChild;i;i=i.nextSibling)i.nodeType==Node.ELEMENT_NODE&&br(e,this.readNetworkLinksFromNode(i));return e};t.prototype.readNetworkLinksFromNode=function(t){for(var e=[],i=t.firstElementChild;i;i=i.nextElementSibling)if(Lr(p_,i.namespaceURI)&&"NetworkLink"==i.localName){var r=wd({},__,i,[]);e.push(r)}for(var n=t.firstElementChild;n;n=n.nextElementSibling){var o=n.localName;!Lr(p_,n.namespaceURI)||"Document"!=o&&"Folder"!=o&&"kml"!=o||br(e,this.readNetworkLinksFromNode(n))}return e};t.prototype.readRegion=function(t){var e=[];if(cd(t))br(e,this.readRegionFromDocument(t));else if(pd(t))br(e,this.readRegionFromNode(t));else if("string"==typeof t){var i=fd(t);br(e,this.readRegionFromDocument(i))}return e};t.prototype.readRegionFromDocument=function(t){for(var e=[],i=t.firstChild;i;i=i.nextSibling)i.nodeType==Node.ELEMENT_NODE&&br(e,this.readRegionFromNode(i));return e};t.prototype.readRegionFromNode=function(t){for(var e=[],i=t.firstElementChild;i;i=i.nextElementSibling)if(Lr(p_,i.namespaceURI)&&"Region"==i.localName){var r=wd({},y_,i,[]);e.push(r)}for(var n=t.firstElementChild;n;n=n.nextElementSibling){var o=n.localName;!Lr(p_,n.namespaceURI)||"Document"!=o&&"Folder"!=o&&"kml"!=o||br(e,this.readRegionFromNode(n))}return e};t.prototype.writeFeaturesNode=function(t,e){e=this.adaptOptions(e);var i=hd(p_[4],"kml"),r="http://www.w3.org/2000/xmlns/";i.setAttributeNS(r,"xmlns:gx",c_[0]);i.setAttributeNS(r,"xmlns:xsi",ad);i.setAttributeNS(ad,"xsi:schemaLocation","http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd");var n={node:i},o={};1<t.length?o.Document=t:1==t.length&&(o.Placemark=t[0]);var s=v_[i.namespaceURI],a=Cd(o,s);Od(n,m_,Sd,a,[e],s,this);return i};return t}(Pd);function O_(t,e){var i=null,r=[0,0],n="start";if(t.getImage()){var o=t.getImage().getImageSize();null===o&&(o=s_);if(2==o.length){var s=t.getImage().getScale();r[0]=s*o[0]/2;r[1]=-s*o[1]/2;n="left"}}if(null!==t.getText()){var a=t.getText();(i=a.clone()).setFont(a.getFont()||R_.getFont());i.setScale(a.getScale()||R_.getScale());i.setFill(a.getFill()||R_.getFill());i.setStroke(a.getStroke()||S_)}else i=R_.clone();i.setText(e);i.setOffsetX(r[0]);i.setOffsetY(r[1]);i.setTextAlign(n);return new yr({text:i})}function P_(t){var e=ld(t,!1),i=/^\s*#?\s*([0-9A-Fa-f]{8})\s*$/.exec(e);if(i){var r=i[1];return[parseInt(r.substr(6,2),16),parseInt(r.substr(4,2),16),parseInt(r.substr(2,2),16),parseInt(r.substr(0,2),16)/255]}}function b_(t){for(var e,i=ld(t,!1),r=[],n=/^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*,\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)(?:\s*,\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?))?\s*/i;e=n.exec(i);){var o=parseFloat(e[1]),s=parseFloat(e[2]),a=e[3]?parseFloat(e[3]):0;r.push(o,s,a);i=i.substr(e[0].length)}if(""===i)return r}function M_(t){var e=ld(t,!1).trim(),i=t.baseURI;i&&"about:blank"!=i||(i=window.location.href);if(i){return new URL(e,i).href}return e}function F_(t){return Gd(t)}var A_=Rd(p_,{Pair:function(t,e){var i=wd({},lg,t,e);if(!i)return;var r=i.key;if(r&&"normal"==r){var n=i.styleUrl;n&&(e[e.length-1]=n);var o=i.Style;o&&(e[e.length-1]=o)}}});function N_(t,e){return wd(void 0,A_,t,e)}var D_=Rd(p_,{Icon:md(function(t,e){var i=wd({},z_,t,e);return i||null}),heading:md(Gd),hotSpot:md(function(t){var e,i=t.getAttribute("xunits"),r=t.getAttribute("yunits");e="insetPixels"!==i?"insetPixels"!==r?l_.BOTTOM_LEFT:l_.TOP_LEFT:"insetPixels"!==r?l_.BOTTOM_RIGHT:l_.TOP_RIGHT;return{x:parseFloat(t.getAttribute("x")),xunits:d_[i],y:parseFloat(t.getAttribute("y")),yunits:d_[r],origin:e}}),scale:md(F_)});var G_=Rd(p_,{color:md(P_),scale:md(F_)});var k_=Rd(p_,{color:md(P_),width:md(Gd)});var j_=Rd(p_,{color:md(P_),fill:md(Ad),outline:md(Ad)});var U_=Rd(p_,{coordinates:yd(b_)});function Y_(t,e){return wd(null,U_,t,e)}var B_=Rd(c_,{Track:gd(X_)});var V_=Rd(p_,{when:function(t,e){var i=e[e.length-1].whens,r=ld(t,!1),n=Date.parse(r);i.push(isNaN(n)?0:n)}},Rd(c_,{coord:function(t,e){var i=e[e.length-1].flatCoordinates,r=ld(t,!1),n=/^\s*([+\-]?\d+(?:\.\d*)?(?:e[+\-]?\d*)?)\s+([+\-]?\d+(?:\.\d*)?(?:e[+\-]?\d*)?)\s+([+\-]?\d+(?:\.\d*)?(?:e[+\-]?\d*)?)\s*$/i.exec(r);if(n){var o=parseFloat(n[1]),s=parseFloat(n[2]),a=parseFloat(n[3]);i.push(o,s,a,0)}else i.push(0,0,0,0)}}));function X_(t,e){var i=wd({flatCoordinates:[],whens:[]},V_,t,e);if(i){for(var r=i.flatCoordinates,n=i.whens,o=0,s=Math.min(r.length,n.length);o<s;++o)r[4*o+3]=n[o];return new ro(r,kr.XYZM)}}var z_=Rd(p_,{href:md(M_)},Rd(c_,{x:md(Gd),y:md(Gd),w:md(Gd),h:md(Gd)}));var W_=Rd(p_,{coordinates:yd(b_)});function H_(t,e){return wd(null,W_,t,e)}var K_=Rd(p_,{extrude:md(Ad),tessellate:md(Ad),altitudeMode:md(Yd)});function Z_(t,e){var i=wd({},K_,t,e),r=H_(t,e);if(r){var n=new ro(r,kr.XYZ);n.setProperties(i);return n}}function q_(t,e){var i=wd({},K_,t,e),r=H_(t,e);if(r){var n=new Fn(r,kr.XYZ,[r.length]);n.setProperties(i);return n}}var J_=Rd(p_,{LineString:gd(Z_),LinearRing:gd(q_),MultiGeometry:gd(Q_),Point:gd($_),Polygon:gd(eg)});function Q_(t,e){var i,r=wd([],J_,t,e);if(!r)return null;if(0===r.length)return new Df(r);for(var n=!0,o=r[0].getType(),s=1,a=r.length;s<a;++s)if(r[s].getType()!=o){n=!1;break}if(n){var h,l;if(o==kt.POINT){var u=r[0];h=u.getLayout();l=u.getFlatCoordinates();for(var c=1,p=r.length;c<p;++c)br(l,r[c].getFlatCoordinates());ng(i=new Ih(l,h),r)}else o==kt.LINE_STRING?ng(i=new Rh(r),r):o==kt.POLYGON?ng(i=new Lh(r),r):o==kt.GEOMETRY_COLLECTION?i=new Df(r):A(!1,37)}else i=new Df(r);return i}function $_(t,e){var i=wd({},K_,t,e),r=H_(t,e);if(r){var n=new fn(r,kr.XYZ);n.setProperties(i);return n}}var tg=Rd(p_,{innerBoundaryIs:function(t,e){var i=wd(void 0,dg,t,e);if(i){var r=e[e.length-1];r.push(i)}},outerBoundaryIs:function(t,e){var i=wd(void 0,fg,t,e);if(i){var r=e[e.length-1];r[0]=i}}});function eg(t,e){var i=wd({},K_,t,e),r=wd([null],tg,t,e);if(r&&r[0]){for(var n=r[0],o=[n.length],s=1,a=r.length;s<a;++s){br(n,r[s]);o.push(n.length)}var h=new Fn(n,kr.XYZ,o);h.setProperties(i);return h}}var ig=Rd(p_,{IconStyle:function(t,e){var i=wd({},D_,t,e);if(i){var r,n,o,s,a=e[e.length-1],h="Icon"in i?i.Icon:{},l=!("Icon"in i)||0<Object.keys(h).length,u=h.href;u?r=u:l&&(r=a_);var c,p=l_.BOTTOM_LEFT,d=i.hotSpot;if(d){n=[d.x,d.y];o=d.xunits;s=d.yunits;p=d.origin}else if(r===a_){n=r_;o=n_;s=o_}else if(/^http:\/\/maps\.(?:google|gstatic)\.com\//.test(r)){n=[.5,0];o=$f.FRACTION;s=$f.FRACTION}var f,_=h.x,g=h.y;void 0!==_&&void 0!==g&&(c=[_,g]);var y,v=h.w,m=h.h;void 0!==v&&void 0!==m&&(f=[v,m]);var x=i.heading;void 0!==x&&(y=Nt(x));var E=i.scale;if(l){if(r==a_){f=s_;void 0===E&&(E=h_)}var T=new u_({anchor:n,anchorOrigin:p,anchorXUnits:o,anchorYUnits:s,crossOrigin:"anonymous",offset:c,offsetOrigin:l_.BOTTOM_LEFT,rotation:y,scale:E,size:f,src:r});a.imageStyle=T}else a.imageStyle=E_}},LabelStyle:function(t,e){var i=wd({},G_,t,e);if(i){var r=e[e.length-1],n=new lo({fill:new _r({color:"color"in i?i.color:i_}),scale:i.scale});r.textStyle=n}},LineStyle:function(t,e){var i=wd({},k_,t,e);if(i){var r=e[e.length-1],n=new gr({color:"color"in i?i.color:i_,width:"width"in i?i.width:1});r.strokeStyle=n}},PolyStyle:function(t,e){var i=wd({},j_,t,e);if(i){var r=e[e.length-1],n=new _r({color:"color"in i?i.color:i_});r.fillStyle=n;var o=i.fill;void 0!==o&&(r.fill=o);var s=i.outline;void 0!==s&&(r.outline=s)}}});function rg(t,e){var i=wd({},ig,t,e);if(!i)return null;var r="fillStyle"in i?i.fillStyle:x_,n=i.fill;void 0===n||n||(r=null);var o="imageStyle"in i?i.imageStyle:T_;o==E_&&(o=void 0);var s="textStyle"in i?i.textStyle:R_,a="strokeStyle"in i?i.strokeStyle:C_,h=i.outline;void 0===h||h||(a=null);return[new yr({fill:r,image:o,stroke:a,text:s,zIndex:void 0})]}function ng(t,e){var i,r,n,o=e.length,s=new Array(e.length),a=new Array(e.length),h=new Array(e.length);i=r=n=!1;for(var l=0;l<o;++l){var u=e[l];s[l]=u.get("extrude");a[l]=u.get("tessellate");h[l]=u.get("altitudeMode");i=i||void 0!==s[l];r=r||void 0!==a[l];n=n||h[l]}i&&t.set("extrude",s);r&&t.set("tessellate",a);n&&t.set("altitudeMode",h)}var og=Rd(p_,{displayName:md(Yd),value:md(Yd)});var sg=Rd(p_,{Data:function(t,e){var i=t.getAttribute("name");Id(og,t,e);var r=e[e.length-1];null!==i?r[i]=r.value:null!==r.displayName&&(r[r.displayName]=r.value);delete r.value},SchemaData:function(t,e){Id(ug,t,e)}});function ag(t,e){Id(sg,t,e)}function hg(t,e){Id(y_,t,e)}var lg=Rd(p_,{Style:md(rg),key:md(Yd),styleUrl:md(M_)});var ug=Rd(p_,{SimpleData:function(t,e){var i=t.getAttribute("name");if(null!==i){var r=Yd(t),n=e[e.length-1];n[i]=r}}});var cg=Rd(p_,{altitudeMode:md(Yd),minAltitude:md(Gd),maxAltitude:md(Gd),north:md(Gd),south:md(Gd),east:md(Gd),west:md(Gd)});var pg=Rd(p_,{minLodPixels:md(Gd),maxLodPixels:md(Gd),minFadeExtent:md(Gd),maxFadeExtent:md(Gd)});var dg=Rd(p_,{LinearRing:yd(Y_)});var fg=Rd(p_,{LinearRing:yd(Y_)});function _g(t,e){for(var i=Je(e),r=[255*(4==i.length?i[3]:1),i[2],i[1],i[0]],n=0;n<4;++n){var o=parseInt(r[n],10).toString(16);r[n]=1==o.length?"0"+o:o}Hd(t,r.join(""))}var gg=Rd(p_,{Data:xd(function(t,e,i){t.setAttribute("name",e.name);var r={node:t},n=e.value;if("object"==typeof n){null!==n&&n.displayName&&Od(r,gg,Sd,[n.displayName],i,["displayName"]);null!==n&&n.value&&Od(r,gg,Sd,[n.value],i,["value"])}else Od(r,gg,Sd,[n],i,["value"])}),value:xd(function(t,e){Hd(t,e)}),displayName:xd(function(t,e){Vd(t,e)})});var yg=Rd(p_,{Placemark:xd(Bg)}),vg=function(t,e,i){return hd(e[e.length-1].node.namespaceURI,"Placemark")};var mg=Td("Data");var xg=Rd(p_,["href"],Rd(c_,["x","y","w","h"])),Eg=Rd(p_,{href:xd(Hd)},Rd(c_,{x:xd(zd),y:xd(zd),w:xd(zd),h:xd(zd)})),Tg=function(t,e,i){return hd(c_[0],"gx:"+i)};var Sg=Rd(p_,["scale","heading","Icon","hotSpot"]),Cg=Rd(p_,{Icon:xd(function(t,e,i){var r={node:t},n=i[i.length-1].node,o=xg[n.namespaceURI],s=Cd(e,o);Od(r,Eg,Sd,s,i,o);s=Cd(e,o=xg[c_[0]]);Od(r,Eg,Tg,s,i,o)}),heading:xd(zd),hotSpot:xd(function(t,e){t.setAttribute("x",e.x);t.setAttribute("y",e.y);t.setAttribute("xunits",e.xunits);t.setAttribute("yunits",e.yunits)}),scale:xd(Qg)});var Rg=Rd(p_,["color","scale"]),Ig=Rd(p_,{color:xd(_g),scale:xd(Qg)});var wg=Rd(p_,["color","width"]),Lg=Rd(p_,{color:xd(_g),width:xd(zd)});var Og={Point:"Point",LineString:"LineString",LinearRing:"LinearRing",Polygon:"Polygon",MultiPoint:"MultiGeometry",MultiLineString:"MultiGeometry",MultiPolygon:"MultiGeometry",GeometryCollection:"MultiGeometry"},Pg=function(t,e,i){if(t){return hd(e[e.length-1].node.namespaceURI,Og[t.getType()])}},bg=Td("Point"),Mg=Td("LineString"),Fg=Td("LinearRing"),Ag=Td("Polygon"),Ng=Rd(p_,{LineString:xd(zg),Point:xd(zg),Polygon:xd(Zg),GeometryCollection:xd(Dg)});function Dg(t,e,i){var r,n,o={node:t},s=e.getType();if(s==kt.GEOMETRY_COLLECTION){r=e.getGeometries();n=Pg}else if(s==kt.MULTI_POINT){r=e.getPoints();n=bg}else if(s==kt.MULTI_LINE_STRING){r=e.getLineStrings();n=Mg}else if(s==kt.MULTI_POLYGON){r=e.getPolygons();n=Ag}else A(!1,39);Od(o,Ng,n,r,i)}var Gg=Rd(p_,{LinearRing:xd(zg)});function kg(t,e,i){Od({node:t},Gg,Fg,[e],i)}var jg=Rd(p_,{ExtendedData:xd(function(t,e,i){for(var r={node:t},n=e.names,o=e.values,s=n.length,a=0;a<s;a++)Od(r,gg,mg,[{name:n[a],value:o[a]}],i)}),MultiGeometry:xd(Dg),LineString:xd(zg),LinearRing:xd(zg),Point:xd(zg),Polygon:xd(Zg),Style:xd(function(t,e,i){var r={node:t},n={},o=e.getFill(),s=e.getStroke(),a=e.getImage(),h=e.getText();a instanceof u_&&(n.IconStyle=a);h&&(n.LabelStyle=h);s&&(n.LineStyle=s);o&&(n.PolyStyle=o);var l=i[i.length-1].node,u=$g[l.namespaceURI],c=Cd(n,u);Od(r,ty,Sd,c,i,u)}),address:xd(Hd),description:xd(Hd),name:xd(Hd),open:xd(Bd),phoneNumber:xd(Hd),styleUrl:xd(Hd),visibility:xd(Bd)}),Ug=Rd(p_,["name","open","visibility","address","phoneNumber","description","styleUrl","Style"]),Yg=Td("ExtendedData");function Bg(t,e,i){var r={node:t};e.getId()&&t.setAttribute("id",e.getId());var n=e.getProperties(),o={address:1,description:1,name:1,open:1,phoneNumber:1,styleUrl:1,visibility:1};o[e.getGeometryName()]=1;var s=Object.keys(n||{}).sort().filter(function(t){return!o[t]});if(0<s.length){var a=Cd(n,s);Od(r,jg,Yg,[{names:s,values:a}],i)}var h=e.getStyleFunction();if(h){var l=h(e,0);if(l){var u=Array.isArray(l)?l[0]:l;this.writeStyles_&&(n.Style=u);var c=u.getText();c&&(n.name=c.getText())}}var p=i[i.length-1].node,d=Ug[p.namespaceURI],f=Cd(n,d);Od(r,jg,Sd,f,i,d);var _=i[0],g=e.getGeometry();g&&(g=qp(g,!0,_));Od(r,jg,Pg,[g],i)}var Vg=Rd(p_,["extrude","tessellate","altitudeMode","coordinates"]),Xg=Rd(p_,{extrude:xd(Bd),tessellate:xd(Bd),altitudeMode:xd(Hd),coordinates:xd(function(t,e,i){var r,n=i[i.length-1],o=n.layout,s=n.stride;o==kr.XY||o==kr.XYM?r=2:o==kr.XYZ||o==kr.XYZM?r=3:A(!1,34);var a=e.length,h="";if(0<a){h+=e[0];for(var l=1;l<r;++l)h+=","+e[l];for(var u=s;u<a;u+=s){h+=" "+e[u];for(var c=1;c<r;++c)h+=","+e[u+c]}}Hd(t,h)})});function zg(t,e,i){var r=e.getFlatCoordinates(),n={node:t};n.layout=e.getLayout();n.stride=e.getStride();var o=e.getProperties();o.coordinates=r;var s=i[i.length-1].node,a=Vg[s.namespaceURI],h=Cd(o,a);Od(n,Xg,Sd,h,i,a)}var Wg=Rd(p_,{outerBoundaryIs:xd(kg),innerBoundaryIs:xd(kg)}),Hg=Td("innerBoundaryIs"),Kg=Td("outerBoundaryIs");function Zg(t,e,i){var r=e.getLinearRings(),n=r.shift(),o={node:t};Od(o,Wg,Hg,r,i);Od(o,Wg,Kg,[n],i)}var qg=Rd(p_,{color:xd(_g)}),Jg=Td("color");function Qg(t,e){zd(t,Math.round(1e6*e)/1e6)}var $g=Rd(p_,["IconStyle","LabelStyle","LineStyle","PolyStyle"]),ty=Rd(p_,{IconStyle:xd(function(t,e,i){var r={node:t},n={},o=e.getSrc(),s=e.getSize(),a=e.getImageSize(),h={href:o};if(s){h.w=s[0];h.h=s[1];var l=e.getAnchor(),u=e.getOrigin();if(u&&a&&0!==u[0]&&u[1]!==s[1]){h.x=u[0];h.y=a[1]-(u[1]+s[1])}if(l&&(l[0]!==s[0]/2||l[1]!==s[1]/2)){var c={x:l[0],xunits:$f.PIXELS,y:s[1]-l[1],yunits:$f.PIXELS};n.hotSpot=c}}n.Icon=h;var p=e.getScale();1!==p&&(n.scale=p);var d=e.getRotation();0!==d&&(n.heading=d);var f=i[i.length-1].node,_=Sg[f.namespaceURI],g=Cd(n,_);Od(r,Cg,Sd,g,i,_)}),LabelStyle:xd(function(t,e,i){var r={node:t},n={},o=e.getFill();o&&(n.color=o.getColor());var s=e.getScale();s&&1!==s&&(n.scale=s);var a=i[i.length-1].node,h=Rg[a.namespaceURI],l=Cd(n,h);Od(r,Ig,Sd,l,i,h)}),LineStyle:xd(function(t,e,i){var r={node:t},n={color:e.getColor(),width:e.getWidth()},o=i[i.length-1].node,s=wg[o.namespaceURI],a=Cd(n,s);Od(r,Lg,Sd,a,i,s)}),PolyStyle:xd(function(t,e,i){Od({node:t},qg,Jg,[e.getColor()],i)})});var ey=function(t,e,i,r,n){var o,s,a=8*n-r-1,h=(1<<a)-1,l=h>>1,u=-7,c=i?n-1:0,p=i?-1:1,d=t[e+c];c+=p;o=d&(1<<-u)-1;d>>=-u;u+=a;for(;0<u;o=256*o+t[e+c],c+=p,u-=8);s=o&(1<<-u)-1;o>>=-u;u+=r;for(;0<u;s=256*s+t[e+c],c+=p,u-=8);if(0===o)o=1-l;else{if(o===h)return s?NaN:1/0*(d?-1:1);s+=Math.pow(2,r);o-=l}return(d?-1:1)*s*Math.pow(2,o-r)},iy=function(t,e,i,r,n,o){var s,a,h,l=8*o-n-1,u=(1<<l)-1,c=u>>1,p=23===n?Math.pow(2,-24)-Math.pow(2,-77):0,d=r?0:o-1,f=r?1:-1,_=e<0||0===e&&1/e<0?1:0;e=Math.abs(e);if(isNaN(e)||e===1/0){a=isNaN(e)?1:0;s=u}else{s=Math.floor(Math.log(e)/Math.LN2);if(e*(h=Math.pow(2,-s))<1){s--;h*=2}if(2<=(e+=1<=s+c?p/h:p*Math.pow(2,1-c))*h){s++;h/=2}if(u<=s+c){a=0;s=u}else if(1<=s+c){a=(e*h-1)*Math.pow(2,n);s+=c}else{a=e*Math.pow(2,c-1)*Math.pow(2,n);s=0}}for(;8<=n;t[i+d]=255&a,d+=f,a/=256,n-=8);s=s<<n|a;l+=n;for(;0<l;t[i+d]=255&s,d+=f,s/=256,l-=8);t[i+d-f]|=128*_},ry=ny;function ny(t){this.buf=ArrayBuffer.isView&&ArrayBuffer.isView(t)?t:new Uint8Array(t||0);this.pos=0;this.type=0;this.length=this.buf.length}ny.Varint=0;ny.Fixed64=1;ny.Bytes=2;ny.Fixed32=5;var oy=4294967296,sy=1/oy;ny.prototype={destroy:function(){this.buf=null},readFields:function(t,e,i){i=i||this.length;for(;this.pos<i;){var r=this.readVarint(),n=r>>3,o=this.pos;this.type=7&r;t(n,e,this);this.pos===o&&this.skip(r)}return e},readMessage:function(t,e){return this.readFields(t,e,this.readVarint()+this.pos)},readFixed32:function(){var t=my(this.buf,this.pos);this.pos+=4;return t},readSFixed32:function(){var t=Ey(this.buf,this.pos);this.pos+=4;return t},readFixed64:function(){var t=my(this.buf,this.pos)+my(this.buf,this.pos+4)*oy;this.pos+=8;return t},readSFixed64:function(){var t=my(this.buf,this.pos)+Ey(this.buf,this.pos+4)*oy;this.pos+=8;return t},readFloat:function(){var t=ey(this.buf,this.pos,!0,23,4);this.pos+=4;return t},readDouble:function(){var t=ey(this.buf,this.pos,!0,52,8);this.pos+=8;return t},readVarint:function(t){var e,i,r=this.buf;e=127&(i=r[this.pos++]);if(i<128)return e;e|=(127&(i=r[this.pos++]))<<7;if(i<128)return e;e|=(127&(i=r[this.pos++]))<<14;if(i<128)return e;e|=(127&(i=r[this.pos++]))<<21;return i<128?e:function(t,e,i){var r,n,o=i.buf;n=o[i.pos++];r=(112&n)>>4;if(n<128)return hy(t,r,e);n=o[i.pos++];r|=(127&n)<<3;if(n<128)return hy(t,r,e);n=o[i.pos++];r|=(127&n)<<10;if(n<128)return hy(t,r,e);n=o[i.pos++];r|=(127&n)<<17;if(n<128)return hy(t,r,e);n=o[i.pos++];r|=(127&n)<<24;if(n<128)return hy(t,r,e);n=o[i.pos++];r|=(1&n)<<31;if(n<128)return hy(t,r,e);throw new Error("Expected varint not more than 10 bytes")}(e|=(15&(i=r[this.pos]))<<28,t,this)},readVarint64:function(){return this.readVarint(!0)},readSVarint:function(){var t=this.readVarint();return t%2==1?(t+1)/-2:t/2},readBoolean:function(){return Boolean(this.readVarint())},readString:function(){var t=this.readVarint()+this.pos,e=function(t,e,i){var r="",n=e;for(;n<i;){var o,s,a,h=t[n],l=null,u=239<h?4:223<h?3:191<h?2:1;if(i<n+u)break;if(1===u)h<128&&(l=h);else if(2===u)128==(192&(o=t[n+1]))&&(l=(31&h)<<6|63&o)<=127&&(l=null);else if(3===u){o=t[n+1];s=t[n+2];128==(192&o)&&128==(192&s)&&((l=(15&h)<<12|(63&o)<<6|63&s)<=2047||55296<=l&&l<=57343)&&(l=null)}else if(4===u){o=t[n+1];s=t[n+2];a=t[n+3];128==(192&o)&&128==(192&s)&&128==(192&a)&&((l=(15&h)<<18|(63&o)<<12|(63&s)<<6|63&a)<=65535||1114112<=l)&&(l=null)}if(null===l){l=65533;u=1}else if(65535<l){l-=65536;r+=String.fromCharCode(l>>>10&1023|55296);l=56320|1023&l}r+=String.fromCharCode(l);n+=u}return r}(this.buf,this.pos,t);this.pos=t;return e},readBytes:function(){var t=this.readVarint()+this.pos,e=this.buf.subarray(this.pos,t);this.pos=t;return e},readPackedVarint:function(t,e){var i=ay(this);t=t||[];for(;this.pos<i;)t.push(this.readVarint(e));return t},readPackedSVarint:function(t){var e=ay(this);t=t||[];for(;this.pos<e;)t.push(this.readSVarint());return t},readPackedBoolean:function(t){var e=ay(this);t=t||[];for(;this.pos<e;)t.push(this.readBoolean());return t},readPackedFloat:function(t){var e=ay(this);t=t||[];for(;this.pos<e;)t.push(this.readFloat());return t},readPackedDouble:function(t){var e=ay(this);t=t||[];for(;this.pos<e;)t.push(this.readDouble());return t},readPackedFixed32:function(t){var e=ay(this);t=t||[];for(;this.pos<e;)t.push(this.readFixed32());return t},readPackedSFixed32:function(t){var e=ay(this);t=t||[];for(;this.pos<e;)t.push(this.readSFixed32());return t},readPackedFixed64:function(t){var e=ay(this);t=t||[];for(;this.pos<e;)t.push(this.readFixed64());return t},readPackedSFixed64:function(t){var e=ay(this);t=t||[];for(;this.pos<e;)t.push(this.readSFixed64());return t},skip:function(t){var e=7&t;if(e===ny.Varint)for(;127<this.buf[this.pos++];);else if(e===ny.Bytes)this.pos=this.readVarint()+this.pos;else if(e===ny.Fixed32)this.pos+=4;else{if(e!==ny.Fixed64)throw new Error("Unimplemented type: "+e);this.pos+=8}},writeTag:function(t,e){this.writeVarint(t<<3|e)},realloc:function(t){for(var e=this.length||16;e<this.pos+t;)e*=2;if(e!==this.length){var i=new Uint8Array(e);i.set(this.buf);this.buf=i;this.length=e}},finish:function(){this.length=this.pos;this.pos=0;return this.buf.subarray(0,this.length)},writeFixed32:function(t){this.realloc(4);xy(this.buf,t,this.pos);this.pos+=4},writeSFixed32:function(t){this.realloc(4);xy(this.buf,t,this.pos);this.pos+=4},writeFixed64:function(t){this.realloc(8);xy(this.buf,-1&t,this.pos);xy(this.buf,Math.floor(t*sy),this.pos+4);this.pos+=8},writeSFixed64:function(t){this.realloc(8);xy(this.buf,-1&t,this.pos);xy(this.buf,Math.floor(t*sy),this.pos+4);this.pos+=8},writeVarint:function(t){if(268435455<(t=+t||0)||t<0)!function(t,e){var i,r;if(0<=t){i=t%4294967296|0;r=t/4294967296|0}else{r=~(-t/4294967296);4294967295^(i=~(-t%4294967296))?i=i+1|0:r=r+1|(i=0)}if(0x10000000000000000<=t||t<-0x10000000000000000)throw new Error("Given varint doesn't fit into 10 bytes");e.realloc(10);!function(t,e,i){i.buf[i.pos++]=127&t|128;t>>>=7;i.buf[i.pos++]=127&t|128;t>>>=7;i.buf[i.pos++]=127&t|128;t>>>=7;i.buf[i.pos++]=127&t|128;t>>>=7;i.buf[i.pos]=127&t}(i,0,e);!function(t,e){var i=(7&t)<<4;e.buf[e.pos++]|=i|((t>>>=3)?128:0);if(!t)return;e.buf[e.pos++]=127&t|((t>>>=7)?128:0);if(!t)return;e.buf[e.pos++]=127&t|((t>>>=7)?128:0);if(!t)return;e.buf[e.pos++]=127&t|((t>>>=7)?128:0);if(!t)return;e.buf[e.pos++]=127&t|((t>>>=7)?128:0);if(!t)return;e.buf[e.pos++]=127&t}(r,e)}(t,this);else{this.realloc(4);this.buf[this.pos++]=127&t|(127<t?128:0);if(!(t<=127)){this.buf[this.pos++]=127&(t>>>=7)|(127<t?128:0);if(!(t<=127)){this.buf[this.pos++]=127&(t>>>=7)|(127<t?128:0);t<=127||(this.buf[this.pos++]=t>>>7&127)}}}},writeSVarint:function(t){this.writeVarint(t<0?2*-t-1:2*t)},writeBoolean:function(t){this.writeVarint(Boolean(t))},writeString:function(t){t=String(t);this.realloc(4*t.length);this.pos++;var e=this.pos;this.pos=function(t,e,i){for(var r,n,o=0;o<e.length;o++){if(55295<(r=e.charCodeAt(o))&&r<57344){if(!n){if(56319<r||o+1===e.length){t[i++]=239;t[i++]=191;t[i++]=189}else n=r;continue}if(r<56320){t[i++]=239;t[i++]=191;t[i++]=189;n=r;continue}r=n-55296<<10|r-56320|65536;n=null}else if(n){t[i++]=239;t[i++]=191;t[i++]=189;n=null}if(r<128)t[i++]=r;else{if(r<2048)t[i++]=r>>6|192;else{if(r<65536)t[i++]=r>>12|224;else{t[i++]=r>>18|240;t[i++]=r>>12&63|128}t[i++]=r>>6&63|128}t[i++]=63&r|128}}return i}(this.buf,t,this.pos);var i=this.pos-e;128<=i&&ly(e,i,this);this.pos=e-1;this.writeVarint(i);this.pos+=i},writeFloat:function(t){this.realloc(4);iy(this.buf,t,this.pos,!0,23,4);this.pos+=4},writeDouble:function(t){this.realloc(8);iy(this.buf,t,this.pos,!0,52,8);this.pos+=8},writeBytes:function(t){var e=t.length;this.writeVarint(e);this.realloc(e);for(var i=0;i<e;i++)this.buf[this.pos++]=t[i]},writeRawMessage:function(t,e){this.pos++;var i=this.pos;t(e,this);var r=this.pos-i;128<=r&&ly(i,r,this);this.pos=i-1;this.writeVarint(r);this.pos+=r},writeMessage:function(t,e,i){this.writeTag(t,ny.Bytes);this.writeRawMessage(e,i)},writePackedVarint:function(t,e){this.writeMessage(t,uy,e)},writePackedSVarint:function(t,e){this.writeMessage(t,cy,e)},writePackedBoolean:function(t,e){this.writeMessage(t,fy,e)},writePackedFloat:function(t,e){this.writeMessage(t,py,e)},writePackedDouble:function(t,e){this.writeMessage(t,dy,e)},writePackedFixed32:function(t,e){this.writeMessage(t,_y,e)},writePackedSFixed32:function(t,e){this.writeMessage(t,gy,e)},writePackedFixed64:function(t,e){this.writeMessage(t,yy,e)},writePackedSFixed64:function(t,e){this.writeMessage(t,vy,e)},writeBytesField:function(t,e){this.writeTag(t,ny.Bytes);this.writeBytes(e)},writeFixed32Field:function(t,e){this.writeTag(t,ny.Fixed32);this.writeFixed32(e)},writeSFixed32Field:function(t,e){this.writeTag(t,ny.Fixed32);this.writeSFixed32(e)},writeFixed64Field:function(t,e){this.writeTag(t,ny.Fixed64);this.writeFixed64(e)},writeSFixed64Field:function(t,e){this.writeTag(t,ny.Fixed64);this.writeSFixed64(e)},writeVarintField:function(t,e){this.writeTag(t,ny.Varint);this.writeVarint(e)},writeSVarintField:function(t,e){this.writeTag(t,ny.Varint);this.writeSVarint(e)},writeStringField:function(t,e){this.writeTag(t,ny.Bytes);this.writeString(e)},writeFloatField:function(t,e){this.writeTag(t,ny.Fixed32);this.writeFloat(e)},writeDoubleField:function(t,e){this.writeTag(t,ny.Fixed64);this.writeDouble(e)},writeBooleanField:function(t,e){this.writeVarintField(t,Boolean(e))}};function ay(t){return t.type===ny.Bytes?t.readVarint()+t.pos:t.pos+1}function hy(t,e,i){return i?4294967296*e+(t>>>0):4294967296*(e>>>0)+(t>>>0)}function ly(t,e,i){var r=e<=16383?1:e<=2097151?2:e<=268435455?3:Math.ceil(Math.log(e)/(7*Math.LN2));i.realloc(r);for(var n=i.pos-1;t<=n;n--)i.buf[n+r]=i.buf[n]}function uy(t,e){for(var i=0;i<t.length;i++)e.writeVarint(t[i])}function cy(t,e){for(var i=0;i<t.length;i++)e.writeSVarint(t[i])}function py(t,e){for(var i=0;i<t.length;i++)e.writeFloat(t[i])}function dy(t,e){for(var i=0;i<t.length;i++)e.writeDouble(t[i])}function fy(t,e){for(var i=0;i<t.length;i++)e.writeBoolean(t[i])}function _y(t,e){for(var i=0;i<t.length;i++)e.writeFixed32(t[i])}function gy(t,e){for(var i=0;i<t.length;i++)e.writeSFixed32(t[i])}function yy(t,e){for(var i=0;i<t.length;i++)e.writeFixed64(t[i])}function vy(t,e){for(var i=0;i<t.length;i++)e.writeSFixed64(t[i])}function my(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16)+16777216*t[e+3]}function xy(t,e,i){t[i]=e;t[i+1]=e>>>8;t[i+2]=e>>>16;t[i+3]=e>>>24}function Ey(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16)+(t[e+3]<<24)}var Ty=[1,0,0,1,0,0],Sy=function(t,e,i,r,n){this.extent_;this.id_=n;this.type_=t;this.flatCoordinates_=e;this.flatInteriorPoints_=null;this.flatMidpoints_=null;this.ends_=i;this.properties_=r};Sy.prototype.get=function(t){return this.properties_[t]};Sy.prototype.getExtent=function(){this.extent_||(this.extent_=this.type_===kt.POINT?H(this.flatCoordinates_):Z(this.flatCoordinates_,0,this.flatCoordinates_.length,2));return this.extent_};Sy.prototype.getFlatInteriorPoint=function(){if(!this.flatInteriorPoints_){var t=ht(this.getExtent());this.flatInteriorPoints_=mn(this.flatCoordinates_,0,this.ends_,2,t,0)}return this.flatInteriorPoints_};Sy.prototype.getFlatInteriorPoints=function(){if(!this.flatInteriorPoints_){var t=wh(this.flatCoordinates_,0,this.ends_,2);this.flatInteriorPoints_=xn(this.flatCoordinates_,0,this.ends_,2,t)}return this.flatInteriorPoints_};Sy.prototype.getFlatMidpoint=function(){this.flatMidpoints_||(this.flatMidpoints_=$n(this.flatCoordinates_,0,this.flatCoordinates_.length,2,.5));return this.flatMidpoints_};Sy.prototype.getFlatMidpoints=function(){if(!this.flatMidpoints_){this.flatMidpoints_=[];for(var t=this.flatCoordinates_,e=0,i=this.ends_,r=0,n=i.length;r<n;++r){var o=i[r],s=$n(t,e,o,2,.5);br(this.flatMidpoints_,s);e=o}}return this.flatMidpoints_};Sy.prototype.getId=function(){return this.id_};Sy.prototype.getOrientedFlatCoordinates=function(){return this.flatCoordinates_};Sy.prototype.getGeometry=function(){return this};Sy.prototype.getProperties=function(){return this.properties_};Sy.prototype.getStride=function(){return 2};Sy.prototype.getType=function(){return this.type_};Sy.prototype.transform=function(t,e){var i=(t=ye(t)).getExtent(),r=t.getWorldExtent(),n=ct(r)/ct(i);Ue(Ty,r[0],r[3],n,-n,0,0,0);It(this.flatCoordinates_,0,this.flatCoordinates_.length,2,Ty,this.flatCoordinates_)};Sy.prototype.getEnds=Sy.prototype.getEndss=function(){return this.ends_};Sy.prototype.getFlatCoordinates=Sy.prototype.getOrientedFlatCoordinates;Sy.prototype.getSimplifiedGeometry=Sy.prototype.getGeometry;Sy.prototype.getStyleFunction=L;var Cy=function(i){function t(t){i.call(this);var e=t||{};this.dataProjection=new Wt({code:"",units:Xt.TILE_PIXELS});this.featureClass_=e.featureClass?e.featureClass:Sy;this.geometryName_=e.geometryName;this.layerName_=e.layerName?e.layerName:"layer";this.layers_=e.layers?e.layers:null;this.extent_=null}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readRawGeometry_=function(t,e,i,r){t.pos=e.geometry;for(var n=t.readVarint()+t.pos,o=1,s=0,a=0,h=0,l=0,u=0;t.pos<n;){if(!s){var c=t.readVarint();o=7&c;s=c>>3}s--;if(1===o||2===o){a+=t.readSVarint();h+=t.readSVarint();if(1===o&&u<l){r.push(l);u=l}i.push(a,h);l+=2}else if(7===o){if(u<l){i.push(i[u],i[u+1]);l+=2}}else A(!1,59)}if(u<l){r.push(l);u=l}};t.prototype.createFeature_=function(t,e,i){var r,n=e.type;if(0===n)return null;var o=e.id,s=e.properties;s[this.layerName_]=e.layer.name;var a=[],h=[];this.readRawGeometry_(t,e,a,h);var l=function(t,e){var i;1===t?i=1===e?kt.POINT:kt.MULTI_POINT:2===t?i=1===e?kt.LINE_STRING:kt.MULTI_LINE_STRING:3===t&&(i=kt.POLYGON);return i}(n,h.length);if(this.featureClass_===Sy)r=new this.featureClass_(l,a,h,s,o);else{var u;if(l==kt.POLYGON){for(var c=[],p=0,d=0,f=0,_=h.length;f<_;++f){var g=h[f];if(!Ln(a,p,g,2)){c.push(h.slice(d,f));d=f}p=g}u=1<c.length?new Lh(a,kr.XY,c):new Fn(a,kr.XY,h)}else u=l===kt.POINT?new fn(a,kr.XY):l===kt.LINE_STRING?new ro(a,kr.XY):l===kt.POLYGON?new Fn(a,kr.XY,h):l===kt.MULTI_POINT?new Ih(a,kr.XY):l===kt.MULTI_LINE_STRING?new Rh(a,kr.XY,h):null;r=new this.featureClass_;this.geometryName_&&r.setGeometryName(this.geometryName_);var y=qp(u,!1,this.adaptOptions(i));r.setGeometry(y);r.setId(o);r.setProperties(s)}return r};t.prototype.getLastExtent=function(){return this.extent_};t.prototype.getType=function(){return Mh.ARRAY_BUFFER};t.prototype.readFeatures=function(t,e){var i=this.layers_,r=new ry(t),n=r.readFields(Ry,{}),o=[];for(var s in n)if(!i||-1!=i.indexOf(s)){for(var a=n[s],h=0,l=a.length;h<l;++h){var u=Ly(r,a,h);o.push(this.createFeature_(r,u))}this.extent_=a?[0,0,a.extent,a.extent]:null}return o};t.prototype.readProjection=function(t){return this.dataProjection};t.prototype.setLayers=function(t){this.layers_=t};return t}(Zp);function Ry(t,e,i){if(3===t){var r={keys:[],values:[],features:[]},n=i.readVarint()+i.pos;i.readFields(Iy,r,n);r.length=r.features.length;r.length&&(e[r.name]=r)}}function Iy(t,e,i){if(15===t)e.version=i.readVarint();else if(1===t)e.name=i.readString();else if(5===t)e.extent=i.readVarint();else if(2===t)e.features.push(i.pos);else if(3===t)e.keys.push(i.readString());else if(4===t){for(var r=null,n=i.readVarint()+i.pos;i.pos<n;)r=1===(t=i.readVarint()>>3)?i.readString():2===t?i.readFloat():3===t?i.readDouble():4===t?i.readVarint64():5===t?i.readVarint():6===t?i.readSVarint():7===t?i.readBoolean():null;e.values.push(r)}}function wy(t,e,i){if(1==t)e.id=i.readVarint();else if(2==t)for(var r=i.readVarint()+i.pos;i.pos<r;){var n=e.layer.keys[i.readVarint()],o=e.layer.values[i.readVarint()];e.properties[n]=o}else 3==t?e.type=i.readVarint():4==t&&(e.geometry=i.pos)}function Ly(t,e,i){t.pos=e.features[i];var r=t.readVarint()+t.pos,n={layer:e,type:0,properties:{}};t.readFields(wy,n,r);return n}var Oy=[null],Py=Rd(Oy,{nd:function(t,e){e[e.length-1].ndrefs.push(t.getAttribute("ref"))},tag:Ay}),by=Rd(Oy,{node:function(t,e){var i=e[0],r=e[e.length-1],n=t.getAttribute("id"),o=[parseFloat(t.getAttribute("lon")),parseFloat(t.getAttribute("lat"))];r.nodes[n]=o;var s=wd({tags:{}},Fy,t,e);if(!Ct(s.tags)){var a=new fn(o);qp(a,!1,i);var h=new Sr(a);h.setId(n);h.setProperties(s.tags);r.features.push(h)}},way:function(t,e){var i=wd({id:t.getAttribute("id"),ndrefs:[],tags:{}},Py,t,e);e[e.length-1].ways.push(i)}}),My=function(t){function e(){t.call(this);this.dataProjection=ye("EPSG:4326")}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.readFeaturesFromNode=function(t,e){var i=this.getReadOptions(t,e);if("osm"==t.localName){for(var r=wd({nodes:{},ways:[],features:[]},by,t,[i]),n=0;n<r.ways.length;n++){for(var o=r.ways[n],s=[],a=0,h=o.ndrefs.length;a<h;a++){br(s,r.nodes[o.ndrefs[a]])}var l=void 0;qp(l=o.ndrefs[0]==o.ndrefs[o.ndrefs.length-1]?new Fn(s,kr.XY,[s.length]):new ro(s,kr.XY),!1,i);var u=new Sr(l);u.setId(o.id);u.setProperties(o.tags);r.features.push(u)}if(r.features)return r.features}return[]};return e}(Pd),Fy=Rd(Oy,{tag:Ay});function Ay(t,e){e[e.length-1].tags[t.getAttribute("k")]=t.getAttribute("v")}var Ny="http://www.w3.org/1999/xlink";function Dy(t){return t.getAttributeNS(Ny,"href")}var Gy=function(){};Gy.prototype.read=function(t){if(cd(t))return this.readFromDocument(t);if(pd(t))return this.readFromNode(t);if("string"!=typeof t)return null;var e=fd(t);return this.readFromDocument(e)};Gy.prototype.readFromDocument=function(t){};Gy.prototype.readFromNode=function(t){};var ky=[null,"http://www.opengis.net/ows/1.1"],jy=Rd(ky,{ServiceIdentification:md(function(t,e){return wd({},Qy,t,e)}),ServiceProvider:md(function(t,e){return wd({},$y,t,e)}),OperationsMetadata:md(function(t,e){return wd({},Ky,t,e)})}),Uy=function(t){function e(){t.call(this)}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.readFromDocument=function(t){for(var e=t.firstChild;e;e=e.nextSibling)if(e.nodeType==Node.ELEMENT_NODE)return this.readFromNode(e);return null};e.prototype.readFromNode=function(t){var e=wd({},jy,t,[]);return e||null};return e}(Gy),Yy=Rd(ky,{DeliveryPoint:md(Yd),City:md(Yd),AdministrativeArea:md(Yd),PostalCode:md(Yd),Country:md(Yd),ElectronicMailAddress:md(Yd)}),By=Rd(ky,{Value:vd(function(t,e){return Yd(t)})}),Vy=Rd(ky,{AllowedValues:md(function(t,e){return wd({},By,t,e)})}),Xy=Rd(ky,{Phone:md(function(t,e){return wd({},Zy,t,e)}),Address:md(function(t,e){return wd({},Yy,t,e)})}),zy=Rd(ky,{HTTP:md(function(t,e){return wd({},Wy,t,e)})}),Wy=Rd(ky,{Get:vd(function(t,e){var i=Dy(t);return i?wd({href:i},qy,t,e):void 0}),Post:void 0}),Hy=Rd(ky,{DCP:md(function(t,e){return wd({},zy,t,e)})}),Ky=Rd(ky,{Operation:function(t,e){var i=t.getAttribute("name"),r=wd({},Hy,t,e);if(!r)return;e[e.length-1][i]=r}}),Zy=Rd(ky,{Voice:md(Yd),Facsimile:md(Yd)}),qy=Rd(ky,{Constraint:vd(function(t,e){var i=t.getAttribute("name");return i?wd({name:i},Vy,t,e):void 0})}),Jy=Rd(ky,{IndividualName:md(Yd),PositionName:md(Yd),ContactInfo:md(function(t,e){return wd({},Xy,t,e)})}),Qy=Rd(ky,{Abstract:md(Yd),AccessConstraints:md(Yd),Fees:md(Yd),Title:md(Yd),ServiceTypeVersion:md(Yd),ServiceType:md(Yd)}),$y=Rd(ky,{ProviderName:md(Yd),ProviderSite:md(Dy),ServiceContact:md(function(t,e){return wd({},Jy,t,e)})});function tv(t,e,i,r,n,o){var s,a;if(void 0!==n){s=n;a=void 0!==o?o:0}else{s=[];a=0}for(var h=e;h<i;){var l=t[h++];s[a++]=t[h++];s[a++]=l;for(var u=2;u<r;++u)s[a++]=t[h++]}s.length=a;return s}var ev=function(i){function t(t){i.call(this);var e=t||{};this.dataProjection=ye("EPSG:4326");this.factor_=e.factor?e.factor:1e5;this.geometryLayout_=e.geometryLayout?e.geometryLayout:kr.XY}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readFeatureFromText=function(t,e){var i=this.readGeometryFromText(t,e);return new Sr(i)};t.prototype.readFeaturesFromText=function(t,e){return[this.readFeatureFromText(t,e)]};t.prototype.readGeometryFromText=function(t,e){var i=Ur(this.geometryLayout_),r=rv(t,i,this.factor_);tv(r,0,r.length,i,r);var n=rn(r,0,r.length,i);return qp(new ro(n,this.geometryLayout_),!1,this.adaptOptions(e))};t.prototype.writeFeatureText=function(t,e){var i=t.getGeometry();if(i)return this.writeGeometryText(i,e);A(!1,40);return""};t.prototype.writeFeaturesText=function(t,e){return this.writeFeatureText(t[0],e)};t.prototype.writeGeometryText=function(t,e){var i=(t=qp(t,!0,this.adaptOptions(e))).getFlatCoordinates(),r=t.getStride();tv(i,0,i.length,r,i);return iv(i,r,this.factor_)};return t}(Vf);function iv(t,e,i){var r,n=i||1e5,o=new Array(e);for(r=0;r<e;++r)o[r]=0;for(var s=0,a=t.length;s<a;)for(r=0;r<e;++r,++s){var h=t[s],l=h-o[r];o[r]=h;t[s]=l}return nv(t,n)}function rv(t,e,i){var r,n=i||1e5,o=new Array(e);for(r=0;r<e;++r)o[r]=0;for(var s=ov(t,n),a=0,h=s.length;a<h;)for(r=0;r<e;++r,++a){o[r]+=s[a];s[a]=o[r]}return s}function nv(t,e){for(var i=e||1e5,r=0,n=t.length;r<n;++r)t[r]=Math.round(t[r]*i);return sv(t)}function ov(t,e){for(var i=e||1e5,r=av(t),n=0,o=r.length;n<o;++n)r[n]/=i;return r}function sv(t){for(var e=0,i=t.length;e<i;++e){var r=t[e];t[e]=r<0?~(r<<1):r<<1}return hv(t)}function av(t){for(var e=lv(t),i=0,r=e.length;i<r;++i){var n=e[i];e[i]=1&n?~(n>>1):n>>1}return e}function hv(t){for(var e="",i=0,r=t.length;i<r;++i)e+=uv(t[i]);return e}function lv(t){for(var e=[],i=0,r=0,n=0,o=t.length;n<o;++n){var s=t.charCodeAt(n)-63;i|=(31&s)<<r;if(s<32){e.push(i);r=i=0}else r+=5}return e}function uv(t){for(var e,i="";32<=t;){e=63+(32|31&t);i+=String.fromCharCode(e);t>>=5}e=t+63;return i+=String.fromCharCode(e)}var cv=function(i){function t(t){i.call(this);var e=t||{};this.layerName_=e.layerName;this.layers_=e.layers?e.layers:null;this.dataProjection=ye(e.dataProjection?e.dataProjection:"EPSG:4326")}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.readFeaturesFromObject=function(t,e){if("Topology"!=t.type)return[];var i,r=t,n=null,o=null;if(r.transform){n=(i=r.transform).scale;o=i.translate}var s=r.arcs;i&&function(t,e,i){for(var r=0,n=t.length;r<n;++r)gv(t[r],e,i)}(s,n,o);var a,h=[],l=r.objects,u=this.layerName_;for(var c in l)if(!this.layers_||-1!=this.layers_.indexOf(c))if("GeometryCollection"===l[c].type){a=l[c];h.push.apply(h,fv(a,s,n,o,u,c,e))}else{a=l[c];h.push(_v(a,s,n,o,u,c,e))}return h};t.prototype.readProjectionFromObject=function(t){return this.dataProjection};return t}(Jp),pv={Point:function(t,e,i){var r=t.coordinates;e&&i&&yv(r,e,i);return new fn(r)},LineString:function(t,e){var i=dv(t.arcs,e);return new ro(i)},Polygon:function(t,e){for(var i=[],r=0,n=t.arcs.length;r<n;++r)i[r]=dv(t.arcs[r],e);return new Fn(i)},MultiPoint:function(t,e,i){var r=t.coordinates;if(e&&i)for(var n=0,o=r.length;n<o;++n)yv(r[n],e,i);return new Ih(r)},MultiLineString:function(t,e){for(var i=[],r=0,n=t.arcs.length;r<n;++r)i[r]=dv(t.arcs[r],e);return new Rh(i)},MultiPolygon:function(t,e){for(var i=[],r=0,n=t.arcs.length;r<n;++r){for(var o=t.arcs[r],s=[],a=0,h=o.length;a<h;++a)s[a]=dv(o[a],e);i[r]=s}return new Lh(i)}};function dv(t,e){for(var i,r,n=[],o=0,s=t.length;o<s;++o){i=t[o];0<o&&n.pop();r=0<=i?e[i]:e[~i].slice().reverse();n.push.apply(n,r)}for(var a=0,h=n.length;a<h;++a)n[a]=n[a].slice();return n}function fv(t,e,i,r,n,o,s){for(var a=t.geometries,h=[],l=0,u=a.length;l<u;++l)h[l]=_v(a[l],e,i,r,n,o,s);return h}function _v(t,e,i,r,n,o,s){var a,h=t.type,l=pv[h];a="Point"===h||"MultiPoint"===h?l(t,i,r):l(t,e);var u=new Sr;u.setGeometry(qp(a,!1,s));void 0!==t.id&&u.setId(t.id);var c=t.properties;if(n){c||(c={});c[n]=o}c&&u.setProperties(c);return u}function gv(t,e,i){for(var r=0,n=0,o=0,s=t.length;o<s;++o){var a=t[o];r+=a[0];n+=a[1];a[0]=r;a[1]=n;yv(a,e,i)}}function yv(t,e,i){t[0]=t[0]*e[0]+i[0];t[1]=t[1]*e[1]+i[1]}var vv=function(t){this.tagName_=t};vv.prototype.getTagName=function(){return this.tagName_};var mv=function(i){function t(t,e){i.call(this,t);this.conditions=Array.prototype.slice.call(arguments,1);A(2<=this.conditions.length,57)}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(vv),xv=function(i){function t(t){var e=["And"].concat(Array.prototype.slice.call(arguments));i.apply(this,e)}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(mv),Ev=function(r){function t(t,e,i){r.call(this,"BBOX");this.geometryName=t;this.extent=e;this.srsName=i}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(vv),Tv=function(n){function t(t,e,i,r){n.call(this,t);this.geometryName=e||"the_geom";this.geometry=i;this.srsName=r}n&&(t.__proto__=n);return(t.prototype=Object.create(n&&n.prototype)).constructor=t}(vv),Sv=function(r){function t(t,e,i){r.call(this,"Contains",t,e,i)}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(Tv),Cv=function(i){function t(t,e){i.call(this,t);this.propertyName=e}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(vv),Rv=function(r){function t(t,e,i){r.call(this,"During",t);this.begin=e;this.end=i}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(Cv),Iv=function(n){function t(t,e,i,r){n.call(this,t,e);this.expression=i;this.matchCase=r}n&&(t.__proto__=n);return(t.prototype=Object.create(n&&n.prototype)).constructor=t}(Cv),wv=function(r){function t(t,e,i){r.call(this,"PropertyIsEqualTo",t,e,i)}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(Iv),Lv=function(i){function t(t,e){i.call(this,"PropertyIsGreaterThan",t,e)}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(Iv),Ov=function(i){function t(t,e){i.call(this,"PropertyIsGreaterThanOrEqualTo",t,e)}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(Iv),Pv=function(r){function t(t,e,i){r.call(this,"Intersects",t,e,i)}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(Tv),bv=function(r){function t(t,e,i){r.call(this,"PropertyIsBetween",t);this.lowerBoundary=e;this.upperBoundary=i}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(Cv),Mv=function(s){function t(t,e,i,r,n,o){s.call(this,"PropertyIsLike",t);this.pattern=e;this.wildCard=void 0!==i?i:"*";this.singleChar=void 0!==r?r:".";this.escapeChar=void 0!==n?n:"!";this.matchCase=o}s&&(t.__proto__=s);return(t.prototype=Object.create(s&&s.prototype)).constructor=t}(Cv),Fv=function(e){function t(t){e.call(this,"PropertyIsNull",t)}e&&(t.__proto__=e);return(t.prototype=Object.create(e&&e.prototype)).constructor=t}(Cv),Av=function(i){function t(t,e){i.call(this,"PropertyIsLessThan",t,e)}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(Iv),Nv=function(i){function t(t,e){i.call(this,"PropertyIsLessThanOrEqualTo",t,e)}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(Iv),Dv=function(e){function t(t){e.call(this,"Not");this.condition=t}e&&(t.__proto__=e);return(t.prototype=Object.create(e&&e.prototype)).constructor=t}(vv),Gv=function(r){function t(t,e,i){r.call(this,"PropertyIsNotEqualTo",t,e,i)}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(Iv),kv=function(i){function t(t){var e=["Or"].concat(Array.prototype.slice.call(arguments));i.apply(this,e)}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(mv),jv=function(r){function t(t,e,i){r.call(this,"Within",t,e,i)}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(Tv);function Uv(t){var e=[null].concat(Array.prototype.slice.call(arguments));return new(Function.prototype.bind.apply(xv,e))}function Yv(t,e,i){return new Ev(t,e,i)}var Bv={"http://www.opengis.net/gml":{boundedBy:md(Fd.prototype.readGeometryElement,"bounds")}},Vv={"http://www.opengis.net/wfs":{totalInserted:md(jd),totalUpdated:md(jd),totalDeleted:md(jd)}},Xv={"http://www.opengis.net/wfs":{TransactionSummary:md(function(t,e){return wd({},Vv,t,e)},"transactionSummary"),InsertResults:md(function(t,e){return wd([],tm,t,e)},"insertIds")}},zv={"http://www.opengis.net/wfs":{PropertyName:xd(Hd)}},Wv={"http://www.opengis.net/wfs":{Insert:xd(function(t,e,i){var r=i[i.length-1],n=r.featureType,o=r.featureNS,s=r.gmlVersion,a=hd(o,n);t.appendChild(a);2===s?tf.prototype.writeFeatureElement(a,e,i):qd.prototype.writeFeatureElement(a,e,i)}),Update:xd(function(t,e,i){var r=i[i.length-1];A(void 0!==e.getId(),27);var n=r.featureType,o=r.featurePrefix,s=r.featureNS,a=im(o,n),h=e.getGeometryName();t.setAttribute("typeName",a);t.setAttributeNS(Kv,"xmlns:"+o,s);var l=e.getId();if(void 0!==l){for(var u=e.getKeys(),c=[],p=0,d=u.length;p<d;p++){var f=e.get(u[p]);if(void 0!==f){var _=u[p];f instanceof Xe&&(_=h);c.push({name:_,value:f})}}Od({gmlVersion:r.gmlVersion,node:t,hasZ:r.hasZ,srsName:r.srsName},Wv,Td("Property"),c,i);em(t,l,i)}}),Delete:xd(function(t,e,i){var r=i[i.length-1];A(void 0!==e.getId(),26);var n=r.featureType,o=r.featurePrefix,s=r.featureNS,a=im(o,n);t.setAttribute("typeName",a);t.setAttributeNS(Kv,"xmlns:"+o,s);var h=e.getId();void 0!==h&&em(t,h,i)}),Property:xd(function(t,e,i){var r=hd(qv,"Name"),n=i[i.length-1].gmlVersion;t.appendChild(r);Hd(r,e.name);if(void 0!==e.value&&null!==e.value){var o=hd(qv,"Value");t.appendChild(o);e.value instanceof Xe?2===n?tf.prototype.writeGeometryElement(o,e.value,i):qd.prototype.writeGeometryElement(o,e.value,i):Hd(o,e.value)}}),Native:xd(function(t,e,i){e.vendorId&&t.setAttribute("vendorId",e.vendorId);void 0!==e.safeToIgnore&&t.setAttribute("safeToIgnore",e.safeToIgnore);void 0!==e.value&&Hd(t,e.value)})}},Hv="feature",Kv="http://www.w3.org/2000/xmlns/",Zv="http://www.opengis.net/ogc",qv="http://www.opengis.net/wfs",Jv={"1.1.0":"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd","1.0.0":"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/wfs.xsd"},Qv=function(i){function t(t){i.call(this);var e=t||{};this.featureType_=e.featureType;this.featureNS_=e.featureNS;this.gmlFormat_=e.gmlFormat?e.gmlFormat:new qd;this.schemaLocation_=e.schemaLocation?e.schemaLocation:Jv["1.1.0"]}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getFeatureType=function(){return this.featureType_};t.prototype.setFeatureType=function(t){this.featureType_=t};t.prototype.readFeaturesFromNode=function(t,e){var i={featureType:this.featureType_,featureNS:this.featureNS_};T(i,this.getReadOptions(t,e||{}));var r=[i];this.gmlFormat_.FEATURE_COLLECTION_PARSERS[bd].featureMember=gd(Fd.prototype.readFeaturesInternal);var n=wd([],this.gmlFormat_.FEATURE_COLLECTION_PARSERS,t,r,this.gmlFormat_);n||(n=[]);return n};t.prototype.readTransactionResponse=function(t){if(cd(t))return this.readTransactionResponseFromDocument(t);if(pd(t))return this.readTransactionResponseFromNode(t);if("string"==typeof t){var e=fd(t);return this.readTransactionResponseFromDocument(e)}};t.prototype.readFeatureCollectionMetadata=function(t){if(cd(t))return this.readFeatureCollectionMetadataFromDocument(t);if(pd(t))return this.readFeatureCollectionMetadataFromNode(t);if("string"==typeof t){var e=fd(t);return this.readFeatureCollectionMetadataFromDocument(e)}};t.prototype.readFeatureCollectionMetadataFromDocument=function(t){for(var e=t.firstChild;e;e=e.nextSibling)if(e.nodeType==Node.ELEMENT_NODE)return this.readFeatureCollectionMetadataFromNode(e)};t.prototype.readFeatureCollectionMetadataFromNode=function(t){var e={},i=Ud(t.getAttribute("numberOfFeatures"));e.numberOfFeatures=i;return wd(e,Bv,t,[],this.gmlFormat_)};t.prototype.readTransactionResponseFromDocument=function(t){for(var e=t.firstChild;e;e=e.nextSibling)if(e.nodeType==Node.ELEMENT_NODE)return this.readTransactionResponseFromNode(e)};t.prototype.readTransactionResponseFromNode=function(t){return wd({},Xv,t,[])};t.prototype.writeGetFeature=function(t){var e,i=hd(qv,"GetFeature");i.setAttribute("service","WFS");i.setAttribute("version","1.1.0");if(t){t.handle&&i.setAttribute("handle",t.handle);t.outputFormat&&i.setAttribute("outputFormat",t.outputFormat);void 0!==t.maxFeatures&&i.setAttribute("maxFeatures",t.maxFeatures);t.resultType&&i.setAttribute("resultType",t.resultType);void 0!==t.startIndex&&i.setAttribute("startIndex",t.startIndex);void 0!==t.count&&i.setAttribute("count",t.count);e=t.filter;if(t.bbox){A(t.geometryName,12);var r=Yv(t.geometryName,t.bbox,t.srsName);e=e?Uv(e,r):r}}i.setAttributeNS(ad,"xsi:schemaLocation",this.schemaLocation_);var n={node:i,srsName:t.srsName,featureNS:t.featureNS?t.featureNS:this.featureNS_,featurePrefix:t.featurePrefix,geometryName:t.geometryName,filter:e,propertyNames:t.propertyNames?t.propertyNames:[]};A(Array.isArray(t.featureTypes),11);!function(t,e,i){var r=i[i.length-1],n=T({},r);n.node=t;Od(n,rm,Td("Query"),e,i)}(i,t.featureTypes,[n]);return i};t.prototype.writeTransaction=function(t,e,i,r){var n,o,s=[],a=hd(qv,"Transaction"),h=r.version?r.version:"1.1.0",l="1.0.0"===h?2:3;a.setAttribute("service","WFS");a.setAttribute("version",h);if(r){n=r.gmlOptions?r.gmlOptions:{};r.handle&&a.setAttribute("handle",r.handle)}var u=Jv[h];a.setAttributeNS(ad,"xsi:schemaLocation",u);var c=r.featurePrefix?r.featurePrefix:Hv;if(t){o={node:a,featureNS:r.featureNS,featureType:r.featureType,featurePrefix:c,gmlVersion:l,hasZ:r.hasZ,srsName:r.srsName};T(o,n);Od(o,Wv,Td("Insert"),t,s)}if(e){o={node:a,featureNS:r.featureNS,featureType:r.featureType,featurePrefix:c,gmlVersion:l,hasZ:r.hasZ,srsName:r.srsName};T(o,n);Od(o,Wv,Td("Update"),e,s)}i&&Od({node:a,featureNS:r.featureNS,featureType:r.featureType,featurePrefix:c,gmlVersion:l,srsName:r.srsName},Wv,Td("Delete"),i,s);r.nativeElements&&Od({node:a,featureNS:r.featureNS,featureType:r.featureType,featurePrefix:c,gmlVersion:l,srsName:r.srsName},Wv,Td("Native"),r.nativeElements,s);return a};t.prototype.readProjectionFromDocument=function(t){for(var e=t.firstChild;e;e=e.nextSibling)if(e.nodeType==Node.ELEMENT_NODE)return this.readProjectionFromNode(e);return null};t.prototype.readProjectionFromNode=function(t){if(t.firstElementChild&&t.firstElementChild.firstElementChild)for(var e=(t=t.firstElementChild.firstElementChild).firstElementChild;e;e=e.nextElementSibling)if(0!==e.childNodes.length&&(1!==e.childNodes.length||3!==e.firstChild.nodeType)){var i=[{}];this.gmlFormat_.readGeometryElement(e,i);return ye(i.pop().srsName)}return null};return t}(Pd);var $v={"http://www.opengis.net/ogc":{FeatureId:gd(function(t,e){return t.getAttribute("fid")})}};var tm={"http://www.opengis.net/wfs":{Feature:function(t,e){Id($v,t,e)}}};function em(t,e,i){var r=hd(Zv,"Filter"),n=hd(Zv,"FeatureId");r.appendChild(n);n.setAttribute("fid",e);t.appendChild(r)}function im(t,e){var i=(t=t||Hv)+":";return 0===e.indexOf(i)?e:i+e}var rm={"http://www.opengis.net/wfs":{Query:xd(function(t,e,i){var r,n=i[i.length-1],o=n.featurePrefix,s=n.featureNS,a=n.propertyNames,h=n.srsName;r=o?im(o,e):e;t.setAttribute("typeName",r);h&&t.setAttribute("srsName",h);s&&t.setAttributeNS(Kv,"xmlns:"+o,s);var l=T({},n);l.node=t;Od(l,zv,Td("PropertyName"),a,i);var u=n.filter;if(u){var c=hd(Zv,"Filter");t.appendChild(c);nm(c,u,i)}})},"http://www.opengis.net/ogc":{During:xd(function(t,e,i){var r=hd("http://www.opengis.net/fes","ValueReference");Hd(r,e.propertyName);t.appendChild(r);var n=hd(bd,"TimePeriod");t.appendChild(n);var o=hd(bd,"begin");n.appendChild(o);um(o,e.begin);var s=hd(bd,"end");n.appendChild(s);um(s,e.end)}),And:xd(om),Or:xd(om),Not:xd(function(t,e,i){var r={node:t},n=e.condition;Od(r,rm,Td(n.getTagName()),[n],i)}),BBOX:xd(function(t,e,i){i[i.length-1].srsName=e.srsName;hm(t,e.geometryName);qd.prototype.writeGeometryElement(t,e.extent,i)}),Contains:xd(function(t,e,i){i[i.length-1].srsName=e.srsName;hm(t,e.geometryName);qd.prototype.writeGeometryElement(t,e.geometry,i)}),Intersects:xd(function(t,e,i){i[i.length-1].srsName=e.srsName;hm(t,e.geometryName);qd.prototype.writeGeometryElement(t,e.geometry,i)}),Within:xd(function(t,e,i){i[i.length-1].srsName=e.srsName;hm(t,e.geometryName);qd.prototype.writeGeometryElement(t,e.geometry,i)}),PropertyIsEqualTo:xd(sm),PropertyIsNotEqualTo:xd(sm),PropertyIsLessThan:xd(sm),PropertyIsLessThanOrEqualTo:xd(sm),PropertyIsGreaterThan:xd(sm),PropertyIsGreaterThanOrEqualTo:xd(sm),PropertyIsNull:xd(function(t,e,i){hm(t,e.propertyName)}),PropertyIsBetween:xd(function(t,e,i){hm(t,e.propertyName);var r=hd(Zv,"LowerBoundary");t.appendChild(r);lm(r,""+e.lowerBoundary);var n=hd(Zv,"UpperBoundary");t.appendChild(n);lm(n,""+e.upperBoundary)}),PropertyIsLike:xd(function(t,e,i){t.setAttribute("wildCard",e.wildCard);t.setAttribute("singleChar",e.singleChar);t.setAttribute("escapeChar",e.escapeChar);void 0!==e.matchCase&&t.setAttribute("matchCase",e.matchCase.toString());hm(t,e.propertyName);lm(t,""+e.pattern)})}};function nm(t,e,i){Od({node:t},rm,Td(e.getTagName()),[e],i)}function om(t,e,i){for(var r={node:t},n=e.conditions,o=0,s=n.length;o<s;++o){var a=n[o];Od(r,rm,Td(a.getTagName()),[a],i)}}function sm(t,e,i){void 0!==e.matchCase&&t.setAttribute("matchCase",e.matchCase.toString());hm(t,e.propertyName);lm(t,""+e.expression)}function am(t,e,i){var r=hd(Zv,t);Hd(r,i);e.appendChild(r)}function hm(t,e){am("PropertyName",t,e)}function lm(t,e){am("Literal",t,e)}function um(t,e){var i=hd(bd,"TimeInstant");t.appendChild(i);var r=hd(bd,"timePosition");i.appendChild(r);Hd(r,e)}var cm={POINT:fn,LINESTRING:ro,POLYGON:Fn,MULTIPOINT:Ih,MULTILINESTRING:Rh,MULTIPOLYGON:Lh},pm="EMPTY",dm="Z",fm="M",_m=1,gm=2,ym=3,vm=4,mm=5,xm=6,Em={};for(var Tm in kt)Em[Tm]=kt[Tm].toUpperCase();var Sm=function(t){this.wkt=t;this.index_=-1};Sm.prototype.isAlpha_=function(t){return"a"<=t&&t<="z"||"A"<=t&&t<="Z"};Sm.prototype.isNumeric_=function(t,e){return"0"<=t&&t<="9"||"."==t&&!(void 0!==e&&e)};Sm.prototype.isWhiteSpace_=function(t){return" "==t||"\t"==t||"\r"==t||"\n"==t};Sm.prototype.nextChar_=function(){return this.wkt.charAt(++this.index_)};Sm.prototype.nextToken=function(){var t=this.nextChar_(),e={position:this.index_,value:t};if("("==t)e.type=gm;else if(","==t)e.type=mm;else if(")"==t)e.type=ym;else if(this.isNumeric_(t)||"-"==t){e.type=vm;e.value=this.readNumber_()}else if(this.isAlpha_(t)){e.type=_m;e.value=this.readText_()}else{if(this.isWhiteSpace_(t))return this.nextToken();if(""!==t)throw new Error("Unexpected character: "+t);e.type=xm}return e};Sm.prototype.readNumber_=function(){var t,e=this.index_,i=!1,r=!1;do{"."==t?i=!0:"e"!=t&&"E"!=t||(r=!0);t=this.nextChar_()}while(this.isNumeric_(t,i)||!r&&("e"==t||"E"==t)||r&&("-"==t||"+"==t));return parseFloat(this.wkt.substring(e,this.index_--))};Sm.prototype.readText_=function(){for(var t,e=this.index_;t=this.nextChar_(),this.isAlpha_(t););return this.wkt.substring(e,this.index_--).toUpperCase()};var Cm=function(t){this.lexer_=t;this.token_;this.layout_=kr.XY};Cm.prototype.consume_=function(){this.token_=this.lexer_.nextToken()};Cm.prototype.isTokenType=function(t){return this.token_.type==t};Cm.prototype.match=function(t){var e=this.isTokenType(t);e&&this.consume_();return e};Cm.prototype.parse=function(){this.consume_();return this.parseGeometry_()};Cm.prototype.parseGeometryLayout_=function(){var t=kr.XY,e=this.token_;if(this.isTokenType(_m)){var i=e.value;i===dm?t=kr.XYZ:i===fm?t=kr.XYM:"ZM"===i&&(t=kr.XYZM);t!==kr.XY&&this.consume_()}return t};Cm.prototype.parseGeometryCollectionText_=function(){if(this.match(gm)){for(var t=[];t.push(this.parseGeometry_()),this.match(mm););if(this.match(ym))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())};Cm.prototype.parsePointText_=function(){if(this.match(gm)){var t=this.parsePoint_();if(this.match(ym))return t}else if(this.isEmptyGeometry_())return null;throw new Error(this.formatErrorMessage_())};Cm.prototype.parseLineStringText_=function(){if(this.match(gm)){var t=this.parsePointList_();if(this.match(ym))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())};Cm.prototype.parsePolygonText_=function(){if(this.match(gm)){var t=this.parseLineStringTextList_();if(this.match(ym))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())};Cm.prototype.parseMultiPointText_=function(){if(this.match(gm)){var t;t=this.token_.type==gm?this.parsePointTextList_():this.parsePointList_();if(this.match(ym))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())};Cm.prototype.parseMultiLineStringText_=function(){if(this.match(gm)){var t=this.parseLineStringTextList_();if(this.match(ym))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())};Cm.prototype.parseMultiPolygonText_=function(){if(this.match(gm)){var t=this.parsePolygonTextList_();if(this.match(ym))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())};Cm.prototype.parsePoint_=function(){for(var t=[],e=this.layout_.length,i=0;i<e;++i){var r=this.token_;if(!this.match(vm))break;t.push(r.value)}if(t.length==e)return t;throw new Error(this.formatErrorMessage_())};Cm.prototype.parsePointList_=function(){for(var t=[this.parsePoint_()];this.match(mm);)t.push(this.parsePoint_());return t};Cm.prototype.parsePointTextList_=function(){for(var t=[this.parsePointText_()];this.match(mm);)t.push(this.parsePointText_());return t};Cm.prototype.parseLineStringTextList_=function(){for(var t=[this.parseLineStringText_()];this.match(mm);)t.push(this.parseLineStringText_());return t};Cm.prototype.parsePolygonTextList_=function(){for(var t=[this.parsePolygonText_()];this.match(mm);)t.push(this.parsePolygonText_());return t};Cm.prototype.isEmptyGeometry_=function(){var t=this.isTokenType(_m)&&this.token_.value==pm;t&&this.consume_();return t};Cm.prototype.formatErrorMessage_=function(){return"Unexpected `"+this.token_.value+"` at position "+this.token_.position+" in `"+this.lexer_.wkt+"`"};Cm.prototype.parseGeometry_=function(){var t=this.token_;if(this.match(_m)){var e=t.value;this.layout_=this.parseGeometryLayout_();if("GEOMETRYCOLLECTION"==e){var i=this.parseGeometryCollectionText_();return new Df(i)}var r,n=cm[e];if(!n)throw new Error("Invalid geometry type: "+e);switch(e){case"POINT":r=this.parsePointText_();break;case"LINESTRING":r=this.parseLineStringText_();break;case"POLYGON":r=this.parsePolygonText_();break;case"MULTIPOINT":r=this.parseMultiPointText_();break;case"MULTILINESTRING":r=this.parseMultiLineStringText_();break;case"MULTIPOLYGON":r=this.parseMultiPolygonText_();break;default:throw new Error("Invalid geometry type: "+e)}r||(r=n===cm.POINT?[NaN,NaN]:[]);return new n(r,this.layout_)}throw new Error(this.formatErrorMessage_())};var Rm=function(i){function t(t){i.call(this);var e=t||{};this.splitCollection_=void 0!==e.splitCollection&&e.splitCollection}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.parse_=function(t){var e=new Sm(t);return new Cm(e).parse()};t.prototype.readFeatureFromText=function(t,e){var i=this.readGeometryFromText(t,e);if(i){var r=new Sr;r.setGeometry(i);return r}return null};t.prototype.readFeaturesFromText=function(t,e){for(var i=[],r=this.readGeometryFromText(t,e),n=[],o=0,s=(i=this.splitCollection_&&r.getType()==kt.GEOMETRY_COLLECTION?r.getGeometriesArray():[r]).length;o<s;++o){var a=new Sr;a.setGeometry(i[o]);n.push(a)}return n};t.prototype.readGeometryFromText=function(t,e){var i=this.parse_(t);return i?qp(i,!1,e):null};t.prototype.writeFeatureText=function(t,e){var i=t.getGeometry();return i?this.writeGeometryText(i,e):""};t.prototype.writeFeaturesText=function(t,e){if(1==t.length)return this.writeFeatureText(t[0],e);for(var i=[],r=0,n=t.length;r<n;++r)i.push(t[r].getGeometry());var o=new Df(i);return this.writeGeometryText(o,e)};t.prototype.writeGeometryText=function(t,e){return Pm(qp(t,!0,e))};return t}(Vf);function Im(t){var e=t.getCoordinates();return 0===e.length?"":e.join(" ")}function wm(t){for(var e=t.getCoordinates(),i=[],r=0,n=e.length;r<n;++r)i.push(e[r].join(" "));return i.join(",")}function Lm(t){for(var e=[],i=t.getLinearRings(),r=0,n=i.length;r<n;++r)e.push("("+wm(i[r])+")");return e.join(",")}var Om={Point:Im,LineString:wm,Polygon:Lm,MultiPoint:function(t){for(var e=[],i=t.getPoints(),r=0,n=i.length;r<n;++r)e.push("("+Im(i[r])+")");return e.join(",")},MultiLineString:function(t){for(var e=[],i=t.getLineStrings(),r=0,n=i.length;r<n;++r)e.push("("+wm(i[r])+")");return e.join(",")},MultiPolygon:function(t){for(var e=[],i=t.getPolygons(),r=0,n=i.length;r<n;++r)e.push("("+Lm(i[r])+")");return e.join(",")},GeometryCollection:function(t){for(var e=[],i=t.getGeometries(),r=0,n=i.length;r<n;++r)e.push(Pm(i[r]));return e.join(",")}};function Pm(t){var e=t.getType(),i=(0,Om[e])(t);e=e.toUpperCase();if(t instanceof jr){var r=function(t){var e=t.getLayout(),i="";e!==kr.XYZ&&e!==kr.XYZM||(i+=dm);e!==kr.XYM&&e!==kr.XYZM||(i+=fm);return i}(t);0<r.length&&(e+=" "+r)}return 0===i.length?e+" "+pm:e+"("+i+")"}var bm=[null,"http://www.opengis.net/wms"],Mm=Rd(bm,{Service:md(function(t,e){return wd({},Nm,t,e)}),Capability:md(function(t,e){return wd({},Fm,t,e)})}),Fm=Rd(bm,{Request:md(function(t,e){return wd({},Vm,t,e)}),Exception:md(function(t,e){return wd([],jm,t,e)}),Layer:md(function(t,e){return wd({},Um,t,e)})}),Am=function(t){function e(){t.call(this);this.version=void 0}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.readFromDocument=function(t){for(var e=t.firstChild;e;e=e.nextSibling)if(e.nodeType==Node.ELEMENT_NODE)return this.readFromNode(e);return null};e.prototype.readFromNode=function(t){this.version=t.getAttribute("version").trim();var e=wd({version:this.version},Mm,t,[]);return e||null};return e}(Gy),Nm=Rd(bm,{Name:md(Yd),Title:md(Yd),Abstract:md(Yd),KeywordList:md($m),OnlineResource:md(Dy),ContactInformation:md(function(t,e){return wd({},Dm,t,e)}),Fees:md(Yd),AccessConstraints:md(Yd),LayerLimit:md(jd),MaxWidth:md(jd),MaxHeight:md(jd)}),Dm=Rd(bm,{ContactPersonPrimary:md(function(t,e){return wd({},Gm,t,e)}),ContactPosition:md(Yd),ContactAddress:md(function(t,e){return wd({},km,t,e)}),ContactVoiceTelephone:md(Yd),ContactFacsimileTelephone:md(Yd),ContactElectronicMailAddress:md(Yd)}),Gm=Rd(bm,{ContactPerson:md(Yd),ContactOrganization:md(Yd)}),km=Rd(bm,{AddressType:md(Yd),Address:md(Yd),City:md(Yd),StateOrProvince:md(Yd),PostCode:md(Yd),Country:md(Yd)}),jm=Rd(bm,{Format:gd(Yd)}),Um=Rd(bm,{Name:md(Yd),Title:md(Yd),Abstract:md(Yd),KeywordList:md($m),CRS:vd(Yd),EX_GeographicBoundingBox:md(function(t,e){var i=wd({},Bm,t,e);if(!i)return;var r=i.westBoundLongitude,n=i.southBoundLatitude,o=i.eastBoundLongitude,s=i.northBoundLatitude;return void 0!==r&&void 0!==n&&void 0!==o&&void 0!==s?[r,n,o,s]:void 0}),BoundingBox:vd(function(t,e){var i=[kd(t.getAttribute("minx")),kd(t.getAttribute("miny")),kd(t.getAttribute("maxx")),kd(t.getAttribute("maxy"))],r=[kd(t.getAttribute("resx")),kd(t.getAttribute("resy"))];return{crs:t.getAttribute("CRS"),extent:i,res:r}}),Dimension:vd(function(t,e){return{name:t.getAttribute("name"),units:t.getAttribute("units"),unitSymbol:t.getAttribute("unitSymbol"),default:t.getAttribute("default"),multipleValues:Nd(t.getAttribute("multipleValues")),nearestValue:Nd(t.getAttribute("nearestValue")),current:Nd(t.getAttribute("current")),values:Yd(t)}}),Attribution:md(function(t,e){return wd({},Ym,t,e)}),AuthorityURL:vd(function(t,e){var i=qm(t,e);if(i){i.name=t.getAttribute("name");return i}return}),Identifier:vd(Yd),MetadataURL:vd(function(t,e){var i=qm(t,e);if(i){i.type=t.getAttribute("type");return i}return}),DataURL:vd(qm),FeatureListURL:vd(qm),Style:vd(function(t,e){return wd({},Hm,t,e)}),MinScaleDenominator:md(Gd),MaxScaleDenominator:md(Gd),Layer:vd(function(t,e){var i=e[e.length-1],r=wd({},Um,t,e);if(!r)return;var n=Nd(t.getAttribute("queryable"));void 0===n&&(n=i.queryable);r.queryable=void 0!==n&&n;var o=Ud(t.getAttribute("cascaded"));void 0===o&&(o=i.cascaded);r.cascaded=o;var s=Nd(t.getAttribute("opaque"));void 0===s&&(s=i.opaque);r.opaque=void 0!==s&&s;var a=Nd(t.getAttribute("noSubsets"));void 0===a&&(a=i.noSubsets);r.noSubsets=void 0!==a&&a;var h=kd(t.getAttribute("fixedWidth"));h||(h=i.fixedWidth);r.fixedWidth=h;var l=kd(t.getAttribute("fixedHeight"));l||(l=i.fixedHeight);r.fixedHeight=l;["Style","CRS","AuthorityURL"].forEach(function(t){if(t in i){var e=r[t]||[];r[t]=e.concat(i[t])}});["EX_GeographicBoundingBox","BoundingBox","Dimension","Attribution","MinScaleDenominator","MaxScaleDenominator"].forEach(function(t){if(!(t in r)){var e=i[t];r[t]=e}});return r})}),Ym=Rd(bm,{Title:md(Yd),OnlineResource:md(Dy),LogoURL:md(Qm)}),Bm=Rd(bm,{westBoundLongitude:md(Gd),eastBoundLongitude:md(Gd),southBoundLatitude:md(Gd),northBoundLatitude:md(Gd)}),Vm=Rd(bm,{GetCapabilities:md(Jm),GetMap:md(Jm),GetFeatureInfo:md(Jm)}),Xm=Rd(bm,{Format:vd(Yd),DCPType:vd(function(t,e){return wd({},zm,t,e)})}),zm=Rd(bm,{HTTP:md(function(t,e){return wd({},Wm,t,e)})}),Wm=Rd(bm,{Get:md(qm),Post:md(qm)}),Hm=Rd(bm,{Name:md(Yd),Title:md(Yd),Abstract:md(Yd),LegendURL:vd(Qm),StyleSheetURL:md(qm),StyleURL:md(qm)}),Km=Rd(bm,{Format:md(Yd),OnlineResource:md(Dy)}),Zm=Rd(bm,{Keyword:gd(Yd)});function qm(t,e){return wd({},Km,t,e)}function Jm(t,e){return wd({},Xm,t,e)}function Qm(t,e){var i=qm(t,e);if(i){var r=[Ud(t.getAttribute("width")),Ud(t.getAttribute("height"))];i.size=r;return i}}function $m(t,e){return wd([],Zm,t,e)}var tx=function(i){function t(t){i.call(this);var e=t||{};this.featureNS_="http://mapserver.gis.umn.edu/mapserver";this.gmlFormat_=new tf;this.layers_=e.layers?e.layers:null}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getLayers=function(){return this.layers_};t.prototype.setLayers=function(t){this.layers_=t};t.prototype.readFeatures_=function(t,e){t.setAttribute("namespaceURI",this.featureNS_);var i=t.localName,r=[];if(0===t.childNodes.length)return r;if("msGMLOutput"==i)for(var n=0,o=t.childNodes.length;n<o;n++){var s=t.childNodes[n];if(s.nodeType===Node.ELEMENT_NODE){var a=e[0],h=s.localName.replace("_layer","");if(!this.layers_||Lr(this.layers_,h)){var l=h+"_feature";a.featureType=l;a.featureNS=this.featureNS_;var u={};u[l]=gd(this.gmlFormat_.readFeatureElement,this.gmlFormat_);var c=Rd([a.featureNS,null],u);s.setAttribute("namespaceURI",this.featureNS_);var p=wd([],c,s,e,this.gmlFormat_);p&&br(r,p)}}}if("FeatureCollection"==i){var d=wd([],this.gmlFormat_.FEATURE_COLLECTION_PARSERS,t,[{}],this.gmlFormat_);d&&(r=d)}return r};t.prototype.readFeaturesFromNode=function(t,e){var i={};e&&T(i,this.getReadOptions(t,e));return this.readFeatures_(t,[i])};return t}(Pd),ex=[null,"http://www.opengis.net/wmts/1.0"],ix=[null,"http://www.opengis.net/ows/1.1"],rx=Rd(ex,{Contents:md(function(t,e){return wd({},ox,t,e)})}),nx=function(t){function e(){t.call(this);this.owsParser_=new Uy}t&&(e.__proto__=t);((e.prototype=Object.create(t&&t.prototype)).constructor=e).prototype.readFromDocument=function(t){for(var e=t.firstChild;e;e=e.nextSibling)if(e.nodeType==Node.ELEMENT_NODE)return this.readFromNode(e);return null};e.prototype.readFromNode=function(t){var e=t.getAttribute("version").trim(),i=this.owsParser_.readFromNode(t);if(!i)return null;i.version=e;return(i=wd(i,rx,t,[]))||null};return e}(Gy),ox=Rd(ex,{Layer:vd(function(t,e){return wd({},sx,t,e)}),TileMatrixSet:vd(function(t,e){return wd({},dx,t,e)})}),sx=Rd(ex,{Style:vd(function(t,e){var i=wd({},ax,t,e);if(!i)return;var r="true"===t.getAttribute("isDefault");i.isDefault=r;return i}),Format:vd(Yd),TileMatrixSetLink:vd(function(t,e){return wd({},hx,t,e)}),Dimension:vd(function(t,e){return wd({},cx,t,e)}),ResourceURL:vd(function(t,e){var i=t.getAttribute("format"),r=t.getAttribute("template"),n=t.getAttribute("resourceType"),o={};i&&(o.format=i);r&&(o.template=r);n&&(o.resourceType=n);return o})},Rd(ix,{Title:md(Yd),Abstract:md(Yd),WGS84BoundingBox:md(function(t,e){var i=wd([],px,t,e);return 2==i.length?G(i):void 0}),Identifier:md(Yd)})),ax=Rd(ex,{LegendURL:vd(function(t,e){var i={};i.format=t.getAttribute("format");i.href=Dy(t);return i})},Rd(ix,{Title:md(Yd),Identifier:md(Yd)})),hx=Rd(ex,{TileMatrixSet:md(Yd),TileMatrixSetLimits:md(function(t,e){return wd([],lx,t,e)})}),lx=Rd(ex,{TileMatrixLimits:gd(function(t,e){return wd({},ux,t,e)})}),ux=Rd(ex,{TileMatrix:md(Yd),MinTileRow:md(jd),MaxTileRow:md(jd),MinTileCol:md(jd),MaxTileCol:md(jd)}),cx=Rd(ex,{Default:md(Yd),Value:vd(Yd)},Rd(ix,{Identifier:md(Yd)})),px=Rd(ix,{LowerCorner:gd(_x),UpperCorner:gd(_x)}),dx=Rd(ex,{WellKnownScaleSet:md(Yd),TileMatrix:vd(function(t,e){return wd({},fx,t,e)})},Rd(ix,{SupportedCRS:md(Yd),Identifier:md(Yd)})),fx=Rd(ex,{TopLeftCorner:md(_x),ScaleDenominator:md(Gd),TileWidth:md(jd),TileHeight:md(jd),MatrixWidth:md(jd),MatrixHeight:md(jd)},Rd(ix,{Identifier:md(Yd)}));function _x(t,e){var i=Yd(t).split(/\s+/);if(i&&2==i.length){var r=+i[0],n=+i[1];if(!isNaN(r)&&!isNaN(n))return[r,n]}}var gx="blur",yx="gradient",vx="radius",mx=["#00f","#0ff","#0f0","#ff0","#f00"],xx=function(n){function t(t){var e=t||{},i=T({},e);delete i.gradient;delete i.radius;delete i.blur;delete i.shadow;delete i.weight;n.call(this,i);this.gradient_=null;this.shadow_=void 0!==e.shadow?e.shadow:250;this.circleImage_=void 0;this.styleCache_=null;S(this,P(yx),this.handleGradientChanged_,this);this.setGradient(e.gradient?e.gradient:mx);this.setBlur(void 0!==e.blur?e.blur:15);this.setRadius(void 0!==e.radius?e.radius:8);S(this,P(gx),this.handleStyleChanged_,this);S(this,P(vx),this.handleStyleChanged_,this);this.handleStyleChanged_();var s,r=e.weight?e.weight:"weight";s="string"==typeof r?function(t){return t.get(r)}:r;this.setStyle(function(t,e){var i=s(t),r=void 0!==i?Lt(i,0,1):1,n=255*r|0,o=this.styleCache_[n];if(!o){o=[new yr({image:new u_({opacity:r,src:this.circleImage_})})];this.styleCache_[n]=o}return o}.bind(this));this.setRenderOrder(null);S(this,ao.RENDER,this.handleRender_,this)}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.createCircle_=function(){var t=this.getRadius(),e=this.getBlur(),i=t+e+1,r=2*i,n=ii(r,r);n.shadowOffsetX=n.shadowOffsetY=this.shadow_;n.shadowBlur=e;n.shadowColor="#000";n.beginPath();var o=i-this.shadow_;n.arc(o,o,t,0,2*Math.PI,!0);n.fill();return n.canvas.toDataURL()};t.prototype.getBlur=function(){return this.get(gx)};t.prototype.getGradient=function(){return this.get(yx)};t.prototype.getRadius=function(){return this.get(vx)};t.prototype.handleGradientChanged_=function(){this.gradient_=function(t){for(var e=ii(1,256),i=e.createLinearGradient(0,0,1,256),r=1/(t.length-1),n=0,o=t.length;n<o;++n)i.addColorStop(n*r,t[n]);e.fillStyle=i;e.fillRect(0,0,1,256);return e.getImageData(0,0,1,256).data}(this.getGradient())};t.prototype.handleStyleChanged_=function(){this.circleImage_=this.createCircle_();this.styleCache_=new Array(256);this.changed()};t.prototype.handleRender_=function(t){for(var e=t.context,i=e.canvas,r=e.getImageData(0,0,i.width,i.height),n=r.data,o=0,s=n.length;o<s;o+=4){var a=4*n[o+3];if(a){n[o]=this.gradient_[a];n[o+1]=this.gradient_[a+1];n[o+2]=this.gradient_[a+2]}}e.putImageData(r,0,0)};t.prototype.setBlur=function(t){this.set(gx,t)};t.prototype.setGradient=function(t){this.set(yx,t)};t.prototype.setRadius=function(t){this.set(vx,t)};return t}(bh);var Ex=function(i){function t(t){var e=t||{};i.call(this,e);this.type=Io.IMAGE}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(qs);Ex.prototype.getSource;var Tx={PRELOAD:"preload",USE_INTERIM_TILES_ON_ERROR:"useInterimTilesOnError"},Sx=function(r){function t(t){var e=t||{},i=T({},e);delete i.preload;delete i.useInterimTilesOnError;r.call(this,i);this.setPreload(void 0!==e.preload?e.preload:0);this.setUseInterimTilesOnError(void 0===e.useInterimTilesOnError||e.useInterimTilesOnError);this.type=Io.TILE}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.getPreload=function(){return this.get(Tx.PRELOAD)};t.prototype.setPreload=function(t){this.set(Tx.PRELOAD,t)};t.prototype.getUseInterimTilesOnError=function(){return this.get(Tx.USE_INTERIM_TILES_ON_ERROR)};t.prototype.setUseInterimTilesOnError=function(t){this.set(Tx.USE_INTERIM_TILES_ON_ERROR,t)};return t}(qs);Sx.prototype.getSource;var Cx=function(n){function t(t){var e=t||{},i=e.renderMode||Xu.HYBRID;A(null==i||i==Xu.IMAGE||i==Xu.HYBRID||i==Xu.VECTOR,28);e.declutter&&i==Xu.IMAGE&&(i=Xu.HYBRID);e.renderMode=i;var r=T({},e);delete r.preload;delete r.useInterimTilesOnError;n.call(this,r);this.setPreload(e.preload?e.preload:0);this.setUseInterimTilesOnError(void 0===e.useInterimTilesOnError||e.useInterimTilesOnError);this.type=Io.VECTOR_TILE}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.getPreload=function(){return this.get(Tx.PRELOAD)};t.prototype.getUseInterimTilesOnError=function(){return this.get(Tx.USE_INTERIM_TILES_ON_ERROR)};t.prototype.setPreload=function(t){this.set(Tx.PRELOAD,t)};t.prototype.setUseInterimTilesOnError=function(t){this.set(Tx.USE_INTERIM_TILES_ON_ERROR,t)};return t}(bh);Cx.prototype.getSource;function Rx(t,e,i,r){var n=we(i,e,t),o=ve(e,r,i),s=e.getMetersPerUnit();void 0!==s&&(o*=s);var a=t.getMetersPerUnit();void 0!==a&&(o/=a);var h=t.getExtent();if(!h||Y(h,n)){var l=ve(t,o,n)/o;isFinite(l)&&0<l&&(o/=l)}return o}function Ix(t,e,i,r){var n=i-t,o=r-e,s=Math.sqrt(n*n+o*o);return[Math.round(i+n/s),Math.round(r+o/s)]}function wx(t,e,R,I,i,w,r,n,o,a,s){var L=ii(Math.round(R*t),Math.round(R*e));if(0===o.length)return L.canvas;L.scale(R,R);var O=[1/0,1/0,-1/0,-1/0];o.forEach(function(t,e,i){q(O,t.extent)});var h=_t(O),l=ct(O),P=ii(Math.round(R*h/I),Math.round(R*l/I)),u=R/I;o.forEach(function(t,e,i){var r=t.extent[0]-O[0],n=-(t.extent[3]-O[3]),o=_t(t.extent),s=ct(t.extent);P.drawImage(t.image,a,a,t.image.width-2*a,t.image.height-2*a,r*u,n*u,o*u,s*u)});var b=dt(r);n.getTriangles().forEach(function(t,e,i){var r=t.source,n=t.target,o=r[0][0],s=r[0][1],a=r[1][0],h=r[1][1],l=r[2][0],u=r[2][1],c=(n[0][0]-b[0])/w,p=-(n[0][1]-b[1])/w,d=(n[1][0]-b[0])/w,f=-(n[1][1]-b[1])/w,_=(n[2][0]-b[0])/w,g=-(n[2][1]-b[1])/w,y=o,v=s,m=Ft([[a-=y,h-=v,s=o=0,0,d-c],[l-=y,u-=v,0,0,_-c],[0,0,a,h,f-p],[0,0,l,u,g-p]]);if(m){L.save();L.beginPath();var x=(c+d+_)/3,E=(p+f+g)/3,T=Ix(x,E,c,p),S=Ix(x,E,d,f),C=Ix(x,E,_,g);L.moveTo(S[0],S[1]);L.lineTo(T[0],T[1]);L.lineTo(C[0],C[1]);L.clip();L.transform(m[0],m[2],m[1],m[3],c,p);L.translate(O[0]-y,O[3]-v);L.scale(I/R,-I/R);L.drawImage(P.canvas,0,0);L.restore()}});if(s){L.save();L.strokeStyle="black";L.lineWidth=1;n.getTriangles().forEach(function(t,e,i){var r=t.target,n=(r[0][0]-b[0])/w,o=-(r[0][1]-b[1])/w,s=(r[1][0]-b[0])/w,a=-(r[1][1]-b[1])/w,h=(r[2][0]-b[0])/w,l=-(r[2][1]-b[1])/w;L.beginPath();L.moveTo(s,a);L.lineTo(n,o);L.lineTo(h,l);L.closePath();L.stroke()});L.restore()}return L.canvas}var Lx=function(t,e,i,r,n){this.sourceProj_=t;this.targetProj_=e;var o={},s=Ie(this.targetProj_,this.sourceProj_);this.transformInv_=function(t){var e=t[0]+"/"+t[1];o[e]||(o[e]=s(t));return o[e]};this.maxSourceExtent_=r;this.errorThresholdSquared_=n*n;this.triangles_=[];this.wrapsXInSource_=!1;this.canWrapXInSource_=this.sourceProj_.canWrapX()&&!!r&&!!this.sourceProj_.getExtent()&&_t(r)==_t(this.sourceProj_.getExtent());this.sourceWorldWidth_=this.sourceProj_.getExtent()?_t(this.sourceProj_.getExtent()):null;this.targetWorldWidth_=this.targetProj_.getExtent()?_t(this.targetProj_.getExtent()):null;var a=dt(i),h=ft(i),l=at(i),u=st(i),c=this.transformInv_(a),p=this.transformInv_(h),d=this.transformInv_(l),f=this.transformInv_(u);this.addQuad_(a,h,l,u,c,p,d,f,10);if(this.wrapsXInSource_){var _=1/0;this.triangles_.forEach(function(t,e,i){_=Math.min(_,t.source[0][0],t.source[1][0],t.source[2][0])});this.triangles_.forEach(function(t){if(Math.max(t.source[0][0],t.source[1][0],t.source[2][0])-_>this.sourceWorldWidth_/2){var e=[[t.source[0][0],t.source[0][1]],[t.source[1][0],t.source[1][1]],[t.source[2][0],t.source[2][1]]];e[0][0]-_>this.sourceWorldWidth_/2&&(e[0][0]-=this.sourceWorldWidth_);e[1][0]-_>this.sourceWorldWidth_/2&&(e[1][0]-=this.sourceWorldWidth_);e[2][0]-_>this.sourceWorldWidth_/2&&(e[2][0]-=this.sourceWorldWidth_);var i=Math.min(e[0][0],e[1][0],e[2][0]);Math.max(e[0][0],e[1][0],e[2][0])-i<this.sourceWorldWidth_/2&&(t.source=e)}}.bind(this))}o={}};Lx.prototype.addTriangle_=function(t,e,i,r,n,o){this.triangles_.push({source:[r,n,o],target:[t,e,i]})};Lx.prototype.addQuad_=function(t,e,i,r,n,o,s,a,h){var l=G([n,o,s,a]),u=this.sourceWorldWidth_?_t(l)/this.sourceWorldWidth_:null,c=this.sourceWorldWidth_,p=this.sourceProj_.canWrapX()&&.5<u&&u<1,d=!1;if(0<h){if(this.targetProj_.isGlobal()&&this.targetWorldWidth_){d|=.25<_t(G([t,e,i,r]))/this.targetWorldWidth_}!p&&this.sourceProj_.isGlobal()&&u&&(d|=.25<u)}if(d||!this.maxSourceExtent_||Rt(l,this.maxSourceExtent_)){if(!(d||isFinite(n[0])&&isFinite(n[1])&&isFinite(o[0])&&isFinite(o[1])&&isFinite(s[0])&&isFinite(s[1])&&isFinite(a[0])&&isFinite(a[1]))){if(!(0<h))return;d=!0}if(0<h){if(!d){var f,_=[(t[0]+i[0])/2,(t[1]+i[1])/2],g=this.transformInv_(_);if(p){f=(Dt(n[0],c)+Dt(s[0],c))/2-Dt(g[0],c)}else f=(n[0]+s[0])/2-g[0];var y=(n[1]+s[1])/2-g[1];d=f*f+y*y>this.errorThresholdSquared_}if(d){if(Math.abs(t[0]-i[0])<=Math.abs(t[1]-i[1])){var v=[(e[0]+i[0])/2,(e[1]+i[1])/2],m=this.transformInv_(v),x=[(r[0]+t[0])/2,(r[1]+t[1])/2],E=this.transformInv_(x);this.addQuad_(t,e,v,x,n,o,m,E,h-1);this.addQuad_(x,v,i,r,E,m,s,a,h-1)}else{var T=[(t[0]+e[0])/2,(t[1]+e[1])/2],S=this.transformInv_(T),C=[(i[0]+r[0])/2,(i[1]+r[1])/2],R=this.transformInv_(C);this.addQuad_(t,T,C,r,n,S,R,a,h-1);this.addQuad_(T,e,i,C,S,o,s,R,h-1)}return}}if(p){if(!this.canWrapXInSource_)return;this.wrapsXInSource_=!0}this.addTriangle_(t,i,r,n,s,a);this.addTriangle_(t,e,i,n,o,s)}};Lx.prototype.calculateSourceExtent=function(){var n=[1/0,1/0,-1/0,-1/0];this.triangles_.forEach(function(t,e,i){var r=t.source;J(n,r[0]);J(n,r[1]);J(n,r[2])});return n};Lx.prototype.getTriangles=function(){return this.triangles_};var Ox=function(f){function t(t,e,i,r,n,o){var s=t.getExtent(),a=e.getExtent(),h=a?pt(i,a):i,l=Rx(t,e,ht(h),r),u=new Lx(t,e,h,s,.5*l),c=o(u.calculateSourceExtent(),l,n),p=Ni.LOADED;c&&(p=Ni.IDLE);var d=c?c.getPixelRatio():1;f.call(this,i,r,d,p);this.targetProj_=e;this.maxSourceExtent_=s;this.triangulation_=u;this.targetResolution_=r;this.targetExtent_=i;this.sourceImage_=c;this.sourcePixelRatio_=d;this.canvas_=null;this.sourceListenerKey_=null}f&&(t.__proto__=f);((t.prototype=Object.create(f&&f.prototype)).constructor=t).prototype.disposeInternal=function(){this.state==Ni.LOADING&&this.unlistenSource_();f.prototype.disposeInternal.call(this)};t.prototype.getImage=function(){return this.canvas_};t.prototype.getProjection=function(){return this.targetProj_};t.prototype.reproject_=function(){var t=this.sourceImage_.getState();if(t==Ni.LOADED){var e=_t(this.targetExtent_)/this.targetResolution_,i=ct(this.targetExtent_)/this.targetResolution_;this.canvas_=wx(e,i,this.sourcePixelRatio_,this.sourceImage_.getResolution(),this.maxSourceExtent_,this.targetResolution_,this.targetExtent_,this.triangulation_,[{extent:this.sourceImage_.getExtent(),image:this.sourceImage_.getImage()}],0)}this.state=t;this.changed()};t.prototype.load=function(){if(this.state==Ni.IDLE){this.state=Ni.LOADING;this.changed();var t=this.sourceImage_.getState();if(t==Ni.LOADED||t==Ni.ERROR)this.reproject_();else{this.sourceListenerKey_=S(this.sourceImage_,R.CHANGE,function(t){var e=this.sourceImage_.getState();if(e==Ni.LOADED||e==Ni.ERROR){this.unlistenSource_();this.reproject_()}},this);this.sourceImage_.load()}}};t.prototype.unlistenSource_=function(){g(this.sourceListenerKey_);this.sourceListenerKey_=null};return t}(fo),Px=function(C){function t(t,e,i,r,n,o,s,a,h,l,u){C.call(this,n,yo.IDLE);this.renderEdges_=void 0!==u&&u;this.pixelRatio_=s;this.gutter_=a;this.canvas_=null;this.sourceTileGrid_=e;this.targetTileGrid_=r;this.wrappedTileCoord_=o||n;this.sourceTiles_=[];this.sourcesListenerKeys_=null;this.sourceZ_=0;var c=r.getTileCoordExtent(this.wrappedTileCoord_),p=this.targetTileGrid_.getExtent(),d=this.sourceTileGrid_.getExtent(),f=p?pt(c,p):c;if(0!==ot(f)){var _=t.getExtent();_&&(d=d?pt(d,_):_);var g=r.getResolution(this.wrappedTileCoord_[0]),y=Rx(t,i,ht(f),g);if(!isFinite(y)||y<=0)this.state=yo.EMPTY;else{var v=void 0!==l?l:.5;this.triangulation_=new Lx(t,i,f,d,y*v);if(0!==this.triangulation_.getTriangles().length){this.sourceZ_=e.getZForResolution(y);var m=this.triangulation_.calculateSourceExtent();if(d)if(t.canWrapX()){m[1]=Lt(m[1],d[1],d[3]);m[3]=Lt(m[3],d[1],d[3])}else m=pt(m,d);if(ot(m)){for(var x=e.getTileRangeForExtentAndZ(m,this.sourceZ_),E=x.minX;E<=x.maxX;E++)for(var T=x.minY;T<=x.maxY;T++){var S=h(this.sourceZ_,E,T,s);S&&this.sourceTiles_.push(S)}0===this.sourceTiles_.length&&(this.state=yo.EMPTY)}else this.state=yo.EMPTY}else this.state=yo.EMPTY}}else this.state=yo.EMPTY}C&&(t.__proto__=C);((t.prototype=Object.create(C&&C.prototype)).constructor=t).prototype.disposeInternal=function(){this.state==yo.LOADING&&this.unlistenSources_();C.prototype.disposeInternal.call(this)};t.prototype.getImage=function(){return this.canvas_};t.prototype.reproject_=function(){var r=[];this.sourceTiles_.forEach(function(t,e,i){t&&t.getState()==yo.LOADED&&r.push({extent:this.sourceTileGrid_.getTileCoordExtent(t.tileCoord),image:t.getImage()})}.bind(this));if((this.sourceTiles_.length=0)===r.length)this.state=yo.ERROR;else{var t=this.wrappedTileCoord_[0],e=this.targetTileGrid_.getTileSize(t),i="number"==typeof e?e:e[0],n="number"==typeof e?e:e[1],o=this.targetTileGrid_.getResolution(t),s=this.sourceTileGrid_.getResolution(this.sourceZ_),a=this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);this.canvas_=wx(i,n,this.pixelRatio_,s,this.sourceTileGrid_.getExtent(),o,a,this.triangulation_,r,this.gutter_,this.renderEdges_);this.state=yo.LOADED}this.changed()};t.prototype.load=function(){if(this.state==yo.IDLE){this.state=yo.LOADING;this.changed();var o=0;this.sourcesListenerKeys_=[];this.sourceTiles_.forEach(function(i,t,e){var r=i.getState();if(r==yo.IDLE||r==yo.LOADING){o++;var n=S(i,R.CHANGE,function(t){var e=i.getState();if(e==yo.LOADED||e==yo.ERROR||e==yo.EMPTY){g(n);if(0===--o){this.unlistenSources_();this.reproject_()}}},this);this.sourcesListenerKeys_.push(n)}}.bind(this));this.sourceTiles_.forEach(function(t,e,i){t.getState()==yo.IDLE&&t.load()});0===o&&setTimeout(this.reproject_.bind(this),0)}};t.prototype.unlistenSources_=function(){this.sourcesListenerKeys_.forEach(g);this.sourcesListenerKeys_=null};return t}(To);function bx(r,n){var o=/\{z\}/g,s=/\{x\}/g,a=/\{y\}/g,h=/\{-y\}/g;return function(i,t,e){return i?r.replace(o,i[0].toString()).replace(s,i[1].toString()).replace(a,function(){return(-i[2]-1).toString()}).replace(h,function(){var t=i[0],e=n.getFullTileRange(t);A(e,55);return(e.getHeight()+i[2]).toString()}):void 0}}function Mx(t,e){for(var i=t.length,r=new Array(i),n=0;n<i;++n)r[n]=bx(t[n],e);return Fx(r)}function Fx(n){return 1===n.length?n[0]:function(t,e,i){if(t){var r=Dt(sc(t),n.length);return n[r](t,e,i)}}}function Ax(t,e,i){}function Nx(t){var e=[],i=/\{([a-z])-([a-z])\}/.exec(t);if(i){var r,n=i[1].charCodeAt(0),o=i[2].charCodeAt(0);for(r=n;r<=o;++r)e.push(t.replace(i[0],String.fromCharCode(r)));return e}if(i=i=/\{(\d+)-(\d+)\}/.exec(t)){for(var s=parseInt(i[2],10),a=parseInt(i[1],10);a<=s;a++)e.push(t.replace(i[0],a.toString()));return e}e.push(t);return e}function Dx(t,e,i,r){var n=document.createElement("script"),o="olc_"+St(e);function s(){delete window[o];n.parentNode.removeChild(n)}n.async=!0;n.src=t+(-1==t.indexOf("?")?"?":"&")+(r||"callback")+"="+o;var a=setTimeout(function(){s();i&&i()},1e4);window[o]=function(t){clearTimeout(a);s();e(t)};document.getElementsByTagName("head")[0].appendChild(n)}var Gx=[0,0,0],kx=function(t){var e;this.minZoom=void 0!==t.minZoom?t.minZoom:0;this.resolutions_=t.resolutions;A(Gr(this.resolutions_,function(t,e){return e-t},!0),17);if(!t.origins)for(var i=0,r=this.resolutions_.length-1;i<r;++i)if(e){if(this.resolutions_[i]/this.resolutions_[i+1]!==e){e=void 0;break}}else e=this.resolutions_[i]/this.resolutions_[i+1];this.zoomFactor_=e;this.maxZoom=this.resolutions_.length-1;this.origin_=void 0!==t.origin?t.origin:null;this.origins_=null;if(void 0!==t.origins){this.origins_=t.origins;A(this.origins_.length==this.resolutions_.length,20)}var n=t.extent;void 0===n||this.origin_||this.origins_||(this.origin_=dt(n));A(!this.origin_&&this.origins_||this.origin_&&!this.origins_,18);this.tileSizes_=null;if(void 0!==t.tileSizes){this.tileSizes_=t.tileSizes;A(this.tileSizes_.length==this.resolutions_.length,19)}this.tileSize_=void 0!==t.tileSize?t.tileSize:this.tileSizes_?null:Ts;A(!this.tileSize_&&this.tileSizes_||this.tileSize_&&!this.tileSizes_,22);this.extent_=void 0!==n?n:null;this.fullTileRanges_=null;this.tmpSize_=[0,0];void 0!==t.sizes?this.fullTileRanges_=t.sizes.map(function(t,e){return new lu(Math.min(0,t[0]),Math.max(t[0]-1,-1),Math.min(0,t[1]),Math.max(t[1]-1,-1))},this):n&&this.calculateTileRanges_(n)};kx.prototype.forEachTileCoord=function(t,e,i){for(var r=this.getTileRangeForExtentAndZ(t,e),n=r.minX,o=r.maxX;n<=o;++n)for(var s=r.minY,a=r.maxY;s<=a;++s)i([e,n,s])};kx.prototype.forEachTileCoordParentTileRange=function(t,e,i,r,n){var o,s,a,h=null,l=t[0]-1;if(2===this.zoomFactor_){s=t[1];a=t[2]}else h=this.getTileCoordExtent(t,n);for(;l>=this.minZoom;){o=2===this.zoomFactor_?uu(s=Math.floor(s/2),s,a=Math.floor(a/2),a,r):this.getTileRangeForExtentAndZ(h,l,r);if(e.call(i,l,o))return!0;--l}return!1};kx.prototype.getExtent=function(){return this.extent_};kx.prototype.getMaxZoom=function(){return this.maxZoom};kx.prototype.getMinZoom=function(){return this.minZoom};kx.prototype.getOrigin=function(t){return this.origin_?this.origin_:this.origins_[t]};kx.prototype.getResolution=function(t){return this.resolutions_[t]};kx.prototype.getResolutions=function(){return this.resolutions_};kx.prototype.getTileCoordChildTileRange=function(t,e,i){if(t[0]<this.maxZoom){if(2===this.zoomFactor_){var r=2*t[1],n=2*t[2];return uu(r,r+1,n,n+1,e)}var o=this.getTileCoordExtent(t,i);return this.getTileRangeForExtentAndZ(o,t[0]+1,e)}return null};kx.prototype.getTileRangeExtent=function(t,e,i){var r=this.getOrigin(t),n=this.getResolution(t),o=Hs(this.getTileSize(t),this.tmpSize_),s=r[0]+e.minX*o[0]*n,a=r[0]+(e.maxX+1)*o[0]*n;return z(s,r[1]+e.minY*o[1]*n,a,r[1]+(e.maxY+1)*o[1]*n,i)};kx.prototype.getTileRangeForExtentAndZ=function(t,e,i){var r=Gx;this.getTileCoordForXYAndZ_(t[0],t[1],e,!1,r);var n=r[1],o=r[2];this.getTileCoordForXYAndZ_(t[2],t[3],e,!0,r);return uu(n,r[1],o,r[2],i)};kx.prototype.getTileCoordCenter=function(t){var e=this.getOrigin(t[0]),i=this.getResolution(t[0]),r=Hs(this.getTileSize(t[0]),this.tmpSize_);return[e[0]+(t[1]+.5)*r[0]*i,e[1]+(t[2]+.5)*r[1]*i]};kx.prototype.getTileCoordExtent=function(t,e){var i=this.getOrigin(t[0]),r=this.getResolution(t[0]),n=Hs(this.getTileSize(t[0]),this.tmpSize_),o=i[0]+t[1]*n[0]*r,s=i[1]+t[2]*n[1]*r;return z(o,s,o+n[0]*r,s+n[1]*r,e)};kx.prototype.getTileCoordForCoordAndResolution=function(t,e,i){return this.getTileCoordForXYAndResolution_(t[0],t[1],e,!1,i)};kx.prototype.getTileCoordForXYAndResolution_=function(t,e,i,r,n){var o=this.getZForResolution(i),s=i/this.getResolution(o),a=this.getOrigin(o),h=Hs(this.getTileSize(o),this.tmpSize_),l=r?.5:0,u=r?0:.5,c=Math.floor((t-a[0])/i+l),p=Math.floor((e-a[1])/i+u),d=s*c/h[0],f=s*p/h[1];if(r){d=Math.ceil(d)-1;f=Math.ceil(f)-1}else{d=Math.floor(d);f=Math.floor(f)}return ic(o,d,f,n)};kx.prototype.getTileCoordForXYAndZ_=function(t,e,i,r,n){var o=this.getOrigin(i),s=this.getResolution(i),a=Hs(this.getTileSize(i),this.tmpSize_),h=r?.5:0,l=r?0:.5,u=Math.floor((t-o[0])/s+h),c=Math.floor((e-o[1])/s+l),p=u/a[0],d=c/a[1];if(r){p=Math.ceil(p)-1;d=Math.ceil(d)-1}else{p=Math.floor(p);d=Math.floor(d)}return ic(i,p,d,n)};kx.prototype.getTileCoordForCoordAndZ=function(t,e,i){return this.getTileCoordForXYAndZ_(t[0],t[1],e,!1,i)};kx.prototype.getTileCoordResolution=function(t){return this.resolutions_[t[0]]};kx.prototype.getTileSize=function(t){return this.tileSize_?this.tileSize_:this.tileSizes_[t]};kx.prototype.getFullTileRange=function(t){return this.fullTileRanges_?this.fullTileRanges_[t]:null};kx.prototype.getZForResolution=function(t,e){return Lt(Or(this.resolutions_,t,e||0),this.minZoom,this.maxZoom)};kx.prototype.calculateTileRanges_=function(t){for(var e=this.resolutions_.length,i=new Array(e),r=this.minZoom;r<e;++r)i[r]=this.getTileRangeForExtentAndZ(t,r);this.fullTileRanges_=i};function jx(t){var e=t.getDefaultTileGrid();if(!e){e=Xx(t);t.setDefaultTileGrid(e)}return e}function Ux(t,e,i){var r=e[0],n=t.getTileCoordCenter(e),o=zx(i);if(Y(o,n))return e;var s=_t(o),a=Math.ceil((o[0]-n[0])/s);n[0]+=s*a;return t.getTileCoordForCoordAndZ(n,r)}function Yx(t,e,i,r){var n=void 0!==r?r:N.TOP_LEFT,o=Vx(t,e,i);return new kx({extent:t,origin:lt(t,n),resolutions:o,tileSize:i})}function Bx(t){var e={};T(e,void 0!==t?t:{});void 0===e.extent&&(e.extent=ye("EPSG:3857").getExtent());e.resolutions=Vx(e.extent,e.maxZoom,e.tileSize);delete e.maxZoom;return new kx(e)}function Vx(t,e,i){for(var r=void 0!==e?e:Es,n=ct(t),o=_t(t),s=Hs(void 0!==i?i:Ts),a=Math.max(o/s[0],n/s[1]),h=r+1,l=new Array(h),u=0;u<h;++u)l[u]=a/Math.pow(2,u);return l}function Xx(t,e,i,r){return Yx(zx(t),e,i,r)}function zx(t){var e=(t=ye(t)).getExtent();if(!e){var i=180*zt[Xt.DEGREES]/t.getMetersPerUnit();e=z(-i,-i,i,i)}return e}var Wx=function(e){function t(t){e.call(this,{attributions:t.attributions,extent:t.extent,projection:t.projection,state:t.state,wrapX:t.wrapX});this.opaque_=void 0!==t.opaque&&t.opaque;this.tilePixelRatio_=void 0!==t.tilePixelRatio?t.tilePixelRatio:1;this.tileGrid=void 0!==t.tileGrid?t.tileGrid:null;this.tileCache=new lc(t.cacheSize);this.tmpSize=[0,0];this.key_="";this.tileOptions={transition:t.transition}}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.canExpireCache=function(){return this.tileCache.canExpireCache()};t.prototype.expireCache=function(t,e){var i=this.getTileCacheForProjection(t);i&&i.expireCache(e)};t.prototype.forEachLoadedTile=function(t,e,i,r){var n=this.getTileCacheForProjection(t);if(!n)return!1;for(var o,s,a,h=!0,l=i.minX;l<=i.maxX;++l)for(var u=i.minY;u<=i.maxY;++u){s=rc(e,l,u);a=!1;n.containsKey(s)&&(a=(o=n.get(s)).getState()===yo.LOADED)&&(a=!1!==r(o));a||(h=!1)}return h};t.prototype.getGutterForProjection=function(t){return 0};t.prototype.getKey=function(){return this.key_};t.prototype.setKey=function(t){if(this.key_!==t){this.key_=t;this.changed()}};t.prototype.getOpaque=function(t){return this.opaque_};t.prototype.getResolutions=function(){return this.tileGrid.getResolutions()};t.prototype.getTile=function(t,e,i,r,n){};t.prototype.getTileGrid=function(){return this.tileGrid};t.prototype.getTileGridForProjection=function(t){return this.tileGrid?this.tileGrid:jx(t)};t.prototype.getTileCacheForProjection=function(t){var e=this.getProjection();return e&&!Ce(e,t)?null:this.tileCache};t.prototype.getTilePixelRatio=function(t){return this.tilePixelRatio_};t.prototype.getTilePixelSize=function(t,e,i){var r=this.getTileGridForProjection(i),n=this.getTilePixelRatio(e),o=Hs(r.getTileSize(t),this.tmpSize);return 1==n?o:Ws(o,n,this.tmpSize)};t.prototype.getTileCoordForTileUrlFunction=function(t,e){var i=void 0!==e?e:this.getProjection(),r=this.getTileGridForProjection(i);this.getWrapX()&&i.isGlobal()&&(t=Ux(r,t,i));return hc(t,r)?t:null};t.prototype.refresh=function(){this.tileCache.clear();this.changed()};return t}(Dh);Wx.prototype.useTile=L;var Hx=function(i){function t(t,e){i.call(this,t);this.tile=e}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(x),Kx={TILELOADSTART:"tileloadstart",TILELOADEND:"tileloadend",TILELOADERROR:"tileloaderror"},Zx=function(e){function t(t){e.call(this,{attributions:t.attributions,cacheSize:t.cacheSize,extent:t.extent,opaque:t.opaque,projection:t.projection,state:t.state,tileGrid:t.tileGrid,tilePixelRatio:t.tilePixelRatio,wrapX:t.wrapX,transition:t.transition});this.tileLoadFunction=t.tileLoadFunction;this.tileUrlFunction=this.fixedTileUrlFunction?this.fixedTileUrlFunction.bind(this):Ax;this.urls=null;t.urls?this.setUrls(t.urls):t.url&&this.setUrl(t.url);t.tileUrlFunction&&this.setTileUrlFunction(t.tileUrlFunction);this.tileLoadingKeys_={}}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getTileLoadFunction=function(){return this.tileLoadFunction};t.prototype.getTileUrlFunction=function(){return this.tileUrlFunction};t.prototype.getUrls=function(){return this.urls};t.prototype.handleTileChange=function(t){var e,i=t.target,r=St(i),n=i.getState();if(n==yo.LOADING){this.tileLoadingKeys_[r]=!0;e=Kx.TILELOADSTART}else if(r in this.tileLoadingKeys_){delete this.tileLoadingKeys_[r];e=n==yo.ERROR?Kx.TILELOADERROR:n==yo.LOADED||n==yo.ABORT?Kx.TILELOADEND:void 0}null!=e&&this.dispatchEvent(new Hx(e,i))};t.prototype.setTileLoadFunction=function(t){this.tileCache.clear();this.tileLoadFunction=t;this.changed()};t.prototype.setTileUrlFunction=function(t,e){this.tileUrlFunction=t;this.tileCache.pruneExceptNewestZ();void 0!==e?this.setKey(e):this.changed()};t.prototype.setUrl=function(t){var e=this.urls=Nx(t);this.setTileUrlFunction(this.fixedTileUrlFunction?this.fixedTileUrlFunction.bind(this):Mx(e,this.tileGrid),t)};t.prototype.setUrls=function(t){var e=(this.urls=t).join("\n");this.setTileUrlFunction(this.fixedTileUrlFunction?this.fixedTileUrlFunction.bind(this):Mx(t,this.tileGrid),e)};t.prototype.useTile=function(t,e,i){var r=rc(t,e,i);this.tileCache.containsKey(r)&&this.tileCache.get(r)};return t}(Wx);Zx.prototype.fixedTileUrlFunction;var qx=function(e){function t(t){e.call(this,{attributions:t.attributions,cacheSize:t.cacheSize,extent:t.extent,opaque:t.opaque,projection:t.projection,state:t.state,tileGrid:t.tileGrid,tileLoadFunction:t.tileLoadFunction?t.tileLoadFunction:Jx,tilePixelRatio:t.tilePixelRatio,tileUrlFunction:t.tileUrlFunction,url:t.url,urls:t.urls,wrapX:t.wrapX,transition:t.transition});this.crossOrigin=void 0!==t.crossOrigin?t.crossOrigin:null;this.tileClass=void 0!==t.tileClass?t.tileClass:So;this.tileCacheForProjection={};this.tileGridForProjection={};this.reprojectionErrorThreshold_=t.reprojectionErrorThreshold;this.renderReprojectionEdges_=!1}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.canExpireCache=function(){if(this.tileCache.canExpireCache())return!0;for(var t in this.tileCacheForProjection)if(this.tileCacheForProjection[t].canExpireCache())return!0;return!1};t.prototype.expireCache=function(t,e){var i=this.getTileCacheForProjection(t);this.tileCache.expireCache(this.tileCache==i?e:{});for(var r in this.tileCacheForProjection){var n=this.tileCacheForProjection[r];n.expireCache(n==i?e:{})}};t.prototype.getGutterForProjection=function(t){return this.getProjection()&&t&&!Ce(this.getProjection(),t)?0:this.getGutter()};t.prototype.getGutter=function(){return 0};t.prototype.getOpaque=function(t){return!(this.getProjection()&&t&&!Ce(this.getProjection(),t))&&e.prototype.getOpaque.call(this,t)};t.prototype.getTileGridForProjection=function(t){var e=this.getProjection();if(!this.tileGrid||e&&!Ce(e,t)){var i=St(t).toString();i in this.tileGridForProjection||(this.tileGridForProjection[i]=jx(t));return this.tileGridForProjection[i]}return this.tileGrid};t.prototype.getTileCacheForProjection=function(t){var e=this.getProjection();if(!e||Ce(e,t))return this.tileCache;var i=St(t).toString();i in this.tileCacheForProjection||(this.tileCacheForProjection[i]=new lc(this.tileCache.highWaterMark));return this.tileCacheForProjection[i]};t.prototype.createTile_=function(t,e,i,r,n,o){var s=[t,e,i],a=this.getTileCoordForTileUrlFunction(s,n),h=a?this.tileUrlFunction(a,r,n):void 0,l=new this.tileClass(s,void 0!==h?yo.IDLE:yo.EMPTY,void 0!==h?h:"",this.crossOrigin,this.tileLoadFunction,this.tileOptions);l.key=o;S(l,R.CHANGE,this.handleTileChange,this);return l};t.prototype.getTile=function(t,e,i,r,n){var o=this.getProjection();if(o&&n&&!Ce(o,n)){var s,a=this.getTileCacheForProjection(n),h=[t,e,i],l=nc(h);a.containsKey(l)&&(s=a.get(l));var u=this.getKey();if(s&&s.key==u)return s;var c=this.getTileGridForProjection(o),p=this.getTileGridForProjection(n),d=this.getTileCoordForTileUrlFunction(h,n),f=new Px(o,c,n,p,h,d,this.getTilePixelRatio(r),this.getGutter(),function(t,e,i,r){return this.getTileInternal(t,e,i,r,o)}.bind(this),this.reprojectionErrorThreshold_,this.renderReprojectionEdges_);f.key=u;if(s){f.interimTile=s;f.refreshInterimChain();a.replace(l,f)}else a.set(l,f);return f}return this.getTileInternal(t,e,i,r,o||n)};t.prototype.getTileInternal=function(t,e,i,r,n){var o=null,s=rc(t,e,i),a=this.getKey();if(this.tileCache.containsKey(s)){if((o=this.tileCache.get(s)).key!=a){var h=o;o=this.createTile_(t,e,i,r,n,a);h.getState()==yo.IDLE?o.interimTile=h.interimTile:o.interimTile=h;o.refreshInterimChain();this.tileCache.replace(s,o)}}else{o=this.createTile_(t,e,i,r,n,a);this.tileCache.set(s,o)}return o};t.prototype.setRenderReprojectionEdges=function(t){if(this.renderReprojectionEdges_!=t){this.renderReprojectionEdges_=t;for(var e in this.tileCacheForProjection)this.tileCacheForProjection[e].clear();this.changed()}};t.prototype.setTileGridForProjection=function(t,e){var i=ye(t);if(i){var r=St(i).toString();r in this.tileGridForProjection||(this.tileGridForProjection[r]=e)}};return t}(Zx);function Jx(t,e){t.getImage().src=e}var Qx=function(i){function t(t){var e=void 0!==t.hidpi&&t.hidpi;i.call(this,{cacheSize:t.cacheSize,crossOrigin:"anonymous",opaque:!0,projection:ye("EPSG:3857"),reprojectionErrorThreshold:t.reprojectionErrorThreshold,state:Ys.LOADING,tileLoadFunction:t.tileLoadFunction,tilePixelRatio:e?2:1,wrapX:void 0===t.wrapX||t.wrapX,transition:t.transition});this.hidpi_=e;this.culture_=void 0!==t.culture?t.culture:"en-us";this.maxZoom_=void 0!==t.maxZoom?t.maxZoom:-1;this.apiKey_=t.key;this.imagerySet_=t.imagerySet;Dx("https://dev.virtualearth.net/REST/v1/Imagery/Metadata/"+this.imagerySet_+"?uriScheme=https&include=ImageryProviders&key="+this.apiKey_+"&c="+this.culture_,this.handleImageryMetadataResponse.bind(this),void 0,"jsonp")}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getApiKey=function(){return this.apiKey_};t.prototype.getImagerySet=function(){return this.imagerySet_};t.prototype.handleImageryMetadataResponse=function(t){if(200==t.statusCode&&"OK"==t.statusDescription&&"ValidCredentials"==t.authenticationResultCode&&1==t.resourceSets.length&&1==t.resourceSets[0].resources.length){var e=t.resourceSets[0].resources[0],i=-1==this.maxZoom_?e.zoomMax:this.maxZoom_,r=zx(this.getProjection()),n=e.imageWidth==e.imageHeight?e.imageWidth:[e.imageWidth,e.imageHeight],o=Bx({extent:r,minZoom:e.zoomMin,maxZoom:i,tileSize:n/(this.hidpi_?2:1)});this.tileGrid=o;var s=this.culture_,a=this.hidpi_;this.tileUrlFunction=Fx(e.imageUrlSubdomains.map(function(t){var n=[0,0,0],o=e.imageUrl.replace("{subdomain}",t).replace("{culture}",s);return function(t,e,i){if(t){ic(t[0],t[1],-t[2]-1,n);var r=o;a&&(r+="&dpi=d1&device=mobile");return r.replace("{quadkey}",ac(n))}}}));if(e.imageryProviders){var u=Re(ye("EPSG:4326"),this.getProjection());this.setAttributions(function(a){var h=[],l=a.viewState.zoom;e.imageryProviders.map(function(t){for(var e=!1,i=t.coverageAreas,r=0,n=i.length;r<n;++r){var o=i[r];if(l>=o.zoomMin&&l<=o.zoomMax){var s=o.bbox;if(Rt(xt([s[1],s[0],s[3],s[2]],u),a.extent)){e=!0;break}}}e&&h.push(t.attribution)});h.push('<a class="ol-attribution-bing-tos" href="https://www.microsoft.com/maps/product/terms.html">Terms of Use</a>');return h})}this.setState(Ys.READY)}else this.setState(Ys.ERROR)};return t}(qx),$x=function(n){function t(t){var e=t||{},i=void 0!==e.projection?e.projection:"EPSG:3857",r=void 0!==e.tileGrid?e.tileGrid:Bx({extent:zx(i),maxZoom:e.maxZoom,minZoom:e.minZoom,tileSize:e.tileSize});n.call(this,{attributions:e.attributions,cacheSize:e.cacheSize,crossOrigin:e.crossOrigin,opaque:e.opaque,projection:i,reprojectionErrorThreshold:e.reprojectionErrorThreshold,tileGrid:r,tileLoadFunction:e.tileLoadFunction,tilePixelRatio:e.tilePixelRatio,tileUrlFunction:e.tileUrlFunction,url:e.url,urls:e.urls,wrapX:void 0===e.wrapX||e.wrapX,transition:e.transition})}n&&(t.__proto__=n);return(t.prototype=Object.create(n&&n.prototype)).constructor=t}(qx),tE=function(e){function t(t){e.call(this,{attributions:t.attributions,cacheSize:t.cacheSize,crossOrigin:t.crossOrigin,maxZoom:void 0!==t.maxZoom?t.maxZoom:18,minZoom:t.minZoom,projection:t.projection,state:Ys.LOADING,wrapX:t.wrapX});this.account_=t.account;this.mapId_=t.map||"";this.config_=t.config||{};this.templateCache_={};this.initializeMap_()}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getConfig=function(){return this.config_};t.prototype.updateConfig=function(t){T(this.config_,t);this.initializeMap_()};t.prototype.setConfig=function(t){this.config_=t||{};this.initializeMap_()};t.prototype.initializeMap_=function(){var t=JSON.stringify(this.config_);if(this.templateCache_[t])this.applyTemplate_(this.templateCache_[t]);else{var e="https://"+this.account_+".carto.com/api/v1/map";this.mapId_&&(e+="/named/"+this.mapId_);var i=new XMLHttpRequest;i.addEventListener("load",this.handleInitResponse_.bind(this,t));i.addEventListener("error",this.handleInitError_.bind(this));i.open("POST",e);i.setRequestHeader("Content-type","application/json");i.send(JSON.stringify(this.config_))}};t.prototype.handleInitResponse_=function(t,e){var i=e.target;if(!i.status||200<=i.status&&i.status<300){var r;try{r=JSON.parse(i.responseText)}catch(t){this.setState(Ys.ERROR);return}this.applyTemplate_(r);this.templateCache_[t]=r;this.setState(Ys.READY)}else this.setState(Ys.ERROR)};t.prototype.handleInitError_=function(t){this.setState(Ys.ERROR)};t.prototype.applyTemplate_=function(t){var e="https://"+t.cdn_url.https+"/"+this.account_+"/api/v1/map/"+t.layergroupid+"/{z}/{x}/{y}.png";this.setUrl(e)};return t}($x),eE=function(e){function t(t){e.call(this,{attributions:t.attributions,extent:t.extent,projection:t.projection,wrapX:t.wrapX});this.resolution=void 0;this.distance=void 0!==t.distance?t.distance:20;this.features=[];this.geometryFunction=t.geometryFunction||function(t){var e=t.getGeometry();A(e instanceof fn,10);return e};this.source=t.source;S(this.source,R.CHANGE,this.refresh,this)}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getDistance=function(){return this.distance};t.prototype.getSource=function(){return this.source};t.prototype.loadFeatures=function(t,e,i){this.source.loadFeatures(t,e,i);if(e!==this.resolution){this.clear();this.resolution=e;this.cluster();this.addFeatures(this.features)}};t.prototype.setDistance=function(t){this.distance=t;this.refresh()};t.prototype.refresh=function(){this.clear();this.cluster();this.addFeatures(this.features);e.prototype.refresh.call(this)};t.prototype.cluster=function(){if(void 0!==this.resolution)for(var t=[1/(this.features.length=0),1/0,-1/0,-1/0],e=this.distance*this.resolution,i=this.source.getFeatures(),r={},n=0,o=i.length;n<o;n++){var s=i[n];if(!(St(s).toString()in r)){var a=this.geometryFunction(s);if(a){H(a.getCoordinates(),t);k(t,e,t);var h=this.source.getFeaturesInExtent(t);h=h.filter(function(t){var e=St(t).toString();return!(e in r)&&(r[e]=!0)});this.features.push(this.createCluster(h))}}}};t.prototype.createCluster=function(t){for(var e=[0,0],i=t.length-1;0<=i;--i){var r=this.geometryFunction(t[i]);r?Yn(e,r.getCoordinates()):t.splice(i,1)}Kn(e,1/t.length);var n=new Sr(new fn(e));n.set("features",t);return n};return t}(rl),iE="imageloadstart",rE="imageloadend",nE="imageloaderror",oE=function(i){function t(t,e){i.call(this,t);this.image=e}i&&(t.__proto__=i);return(t.prototype=Object.create(i&&i.prototype)).constructor=t}(x),sE=function(e){function t(t){e.call(this,{attributions:t.attributions,extent:t.extent,projection:t.projection,state:t.state});this.resolutions_=void 0!==t.resolutions?t.resolutions:null;this.reprojectedImage_=null;this.reprojectedRevision_=0}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getResolutions=function(){return this.resolutions_};t.prototype.findNearestResolution=function(t){if(this.resolutions_){var e=Or(this.resolutions_,t,0);t=this.resolutions_[e]}return t};t.prototype.getImage=function(t,e,i,r){var n=this.getProjection();if(n&&r&&!Ce(n,r)){if(this.reprojectedImage_){if(this.reprojectedRevision_==this.getRevision()&&Ce(this.reprojectedImage_.getProjection(),r)&&this.reprojectedImage_.getResolution()==e&&$(this.reprojectedImage_.getExtent(),t))return this.reprojectedImage_;this.reprojectedImage_.dispose();this.reprojectedImage_=null}this.reprojectedImage_=new Ox(n,r,t,e,i,function(t,e,i){return this.getImageInternal(t,e,i,n)}.bind(this));this.reprojectedRevision_=this.getRevision();return this.reprojectedImage_}n&&(r=n);return this.getImageInternal(t,e,i,r)};t.prototype.getImageInternal=function(t,e,i,r){};t.prototype.handleImageChange=function(t){var e=t.target;switch(e.getState()){case Ni.LOADING:this.loading=!0;this.dispatchEvent(new oE(iE,e));break;case Ni.LOADED:this.loading=!1;this.dispatchEvent(new oE(rE,e));break;case Ni.ERROR:this.loading=!1;this.dispatchEvent(new oE(nE,e))}};return t}(Dh);function aE(t,e){t.getImage().src=e}function hE(t,e){var i=[];Object.keys(e).forEach(function(t){null!==e[t]&&void 0!==e[t]&&i.push(t+"="+encodeURIComponent(e[t]))});var r=i.join("&");return(t=-1===(t=t.replace(/[?&]$/,"")).indexOf("?")?t+"?":t+"&")+r}var lE=function(i){function t(t){var e=t||{};i.call(this,{attributions:e.attributions,projection:e.projection,resolutions:e.resolutions});this.crossOrigin_=void 0!==e.crossOrigin?e.crossOrigin:null;this.hidpi_=void 0===e.hidpi||e.hidpi;this.url_=e.url;this.imageLoadFunction_=void 0!==e.imageLoadFunction?e.imageLoadFunction:aE;this.params_=e.params||{};this.image_=null;this.imageSize_=[0,0];this.renderedRevision_=0;this.ratio_=void 0!==e.ratio?e.ratio:1.5}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getParams=function(){return this.params_};t.prototype.getImageInternal=function(t,e,i,r){if(void 0===this.url_)return null;e=this.findNearestResolution(e);i=this.hidpi_?i:1;var n=this.image_;if(n&&this.renderedRevision_==this.getRevision()&&n.getResolution()==e&&n.getPixelRatio()==i&&Q(n.getExtent(),t))return n;var o={F:"image",FORMAT:"PNG32",TRANSPARENT:!0};T(o,this.params_);var s=((t=t.slice())[0]+t[2])/2,a=(t[1]+t[3])/2;if(1!=this.ratio_){var h=this.ratio_*_t(t)/2,l=this.ratio_*ct(t)/2;t[0]=s-h;t[1]=a-l;t[2]=s+h;t[3]=a+l}var u=e/i,c=Math.ceil(_t(t)/u),p=Math.ceil(ct(t)/u);t[0]=s-u*c/2;t[2]=s+u*c/2;t[1]=a-u*p/2;t[3]=a+u*p/2;this.imageSize_[0]=c;this.imageSize_[1]=p;var d=this.getRequestUrl_(t,this.imageSize_,i,r,o);this.image_=new _o(t,e,i,d,this.crossOrigin_,this.imageLoadFunction_);this.renderedRevision_=this.getRevision();S(this.image_,R.CHANGE,this.handleImageChange,this);return this.image_};t.prototype.getImageLoadFunction=function(){return this.imageLoadFunction_};t.prototype.getRequestUrl_=function(t,e,i,r,n){var o=r.getCode().split(":").pop();n.SIZE=e[0]+","+e[1];n.BBOX=t.join(",");n.BBOXSR=o;n.IMAGESR=o;n.DPI=Math.round(90*i);var s=this.url_,a=s.replace(/MapServer\/?$/,"MapServer/export").replace(/ImageServer\/?$/,"ImageServer/exportImage");a==s&&A(!1,50);return hE(a,n)};t.prototype.getUrl=function(){return this.url_};t.prototype.setImageLoadFunction=function(t){this.image_=null;this.imageLoadFunction_=t;this.changed()};t.prototype.setUrl=function(t){if(t!=this.url_){this.url_=t;this.image_=null;this.changed()}};t.prototype.updateParams=function(t){T(this.params_,t);this.image_=null;this.changed()};return t}(sE),uE=function(e){function t(t){e.call(this,{attributions:t.attributions,projection:t.projection,resolutions:t.resolutions,state:t.state});this.canvasFunction_=t.canvasFunction;this.canvas_=null;this.renderedRevision_=0;this.ratio_=void 0!==t.ratio?t.ratio:1.5}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getImageInternal=function(t,e,i,r){e=this.findNearestResolution(e);var n=this.canvas_;if(n&&this.renderedRevision_==this.getRevision()&&n.getResolution()==e&&n.getPixelRatio()==i&&Q(n.getExtent(),t))return n;vt(t=t.slice(),this.ratio_);var o=[_t(t)/e*i,ct(t)/e*i],s=this.canvasFunction_(t,e,i,o,r);s&&(n=new go(t,e,i,s));this.canvas_=n;this.renderedRevision_=this.getRevision();return n};return t}(sE),cE=function(e){function t(t){e.call(this,{projection:t.projection,resolutions:t.resolutions});this.crossOrigin_=void 0!==t.crossOrigin?t.crossOrigin:null;this.displayDpi_=void 0!==t.displayDpi?t.displayDpi:96;this.params_=t.params||{};this.url_=t.url;this.imageLoadFunction_=void 0!==t.imageLoadFunction?t.imageLoadFunction:aE;this.hidpi_=void 0===t.hidpi||t.hidpi;this.metersPerUnit_=void 0!==t.metersPerUnit?t.metersPerUnit:1;this.ratio_=void 0!==t.ratio?t.ratio:1;this.useOverlay_=void 0!==t.useOverlay&&t.useOverlay;this.image_=null;this.renderedRevision_=0}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getParams=function(){return this.params_};t.prototype.getImageInternal=function(t,e,i,r){e=this.findNearestResolution(e);i=this.hidpi_?i:1;var n=this.image_;if(n&&this.renderedRevision_==this.getRevision()&&n.getResolution()==e&&n.getPixelRatio()==i&&Q(n.getExtent(),t))return n;1!=this.ratio_&&vt(t=t.slice(),this.ratio_);var o=[_t(t)/e*i,ct(t)/e*i];if(void 0!==this.url_){var s=this.getUrl(this.url_,this.params_,t,o,r);S(n=new _o(t,e,i,s,this.crossOrigin_,this.imageLoadFunction_),R.CHANGE,this.handleImageChange,this)}else n=null;this.image_=n;this.renderedRevision_=this.getRevision();return n};t.prototype.getImageLoadFunction=function(){return this.imageLoadFunction_};t.prototype.updateParams=function(t){T(this.params_,t);this.changed()};t.prototype.getUrl=function(t,e,i,r,n){var o,s,a,h,l,u,c,p,d,f=(o=i,s=r,a=this.metersPerUnit_,h=this.displayDpi_,l=_t(o),u=ct(o),c=s[0],p=s[1],d=.0254/h,c*u<p*l?l*a/(c*d):u*a/(p*d)),_=ht(i),g={OPERATION:this.useOverlay_?"GETDYNAMICMAPOVERLAYIMAGE":"GETMAPIMAGE",VERSION:"2.0.0",LOCALE:"en",CLIENTAGENT:"ol/source/ImageMapGuide source",CLIP:"1",SETDISPLAYDPI:this.displayDpi_,SETDISPLAYWIDTH:Math.round(r[0]),SETDISPLAYHEIGHT:Math.round(r[1]),SETVIEWSCALE:f,SETVIEWCENTERX:_[0],SETVIEWCENTERY:_[1]};T(g,e);return hE(t,g)};t.prototype.setImageLoadFunction=function(t){this.image_=null;this.imageLoadFunction_=t;this.changed()};return t}(sE);var pE=function(l){function t(t){var e=void 0!==t.crossOrigin?t.crossOrigin:null,i=void 0!==t.imageLoadFunction?t.imageLoadFunction:aE;l.call(this,{attributions:t.attributions,projection:ye(t.projection)});this.url_=t.url;this.imageExtent_=t.imageExtent;this.image_=new _o(this.imageExtent_,void 0,1,this.url_,e,i);this.imageSize_=t.imageSize?t.imageSize:null;S(this.image_,R.CHANGE,this.handleImageChange,this)}l&&(t.__proto__=l);((t.prototype=Object.create(l&&l.prototype)).constructor=t).prototype.getImageExtent=function(){return this.imageExtent_};t.prototype.getImageInternal=function(t,e,i,r){return Rt(t,this.image_.getExtent())?this.image_:null};t.prototype.getUrl=function(){return this.url_};t.prototype.handleImageChange=function(t){if(this.image_.getState()==Ni.LOADED){var e,i,r=this.image_.getExtent(),n=this.image_.getImage();if(this.imageSize_){e=this.imageSize_[0];i=this.imageSize_[1]}else{e=n.width;i=n.height}var o=ct(r)/i,s=Math.ceil(_t(r)/o);if(s!=e){var a=ii(s,i),h=a.canvas;a.drawImage(n,0,0,e,i,0,0,h.width,h.height);this.image_.setImage(h)}}l.prototype.handleImageChange.call(this,t)};return t}(sE),dE="1.3.0",fE={CARMENTA_SERVER:"carmentaserver",GEOSERVER:"geoserver",MAPSERVER:"mapserver",QGIS:"qgis"},_E=[101,101],gE=function(i){function t(t){var e=t||{};i.call(this,{attributions:e.attributions,projection:e.projection,resolutions:e.resolutions});this.crossOrigin_=void 0!==e.crossOrigin?e.crossOrigin:null;this.url_=e.url;this.imageLoadFunction_=void 0!==e.imageLoadFunction?e.imageLoadFunction:aE;this.params_=e.params||{};this.v13_=!0;this.updateV13_();this.serverType_=e.serverType;this.hidpi_=void 0===e.hidpi||e.hidpi;this.image_=null;this.imageSize_=[0,0];this.renderedRevision_=0;this.ratio_=void 0!==e.ratio?e.ratio:1.5}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getGetFeatureInfoUrl=function(t,e,i,r){if(void 0!==this.url_){var n=ye(i),o=this.getProjection();if(o&&o!==n){e=Rx(o,n,t,e);t=we(t,n,o)}var s=ut(t,e,0,_E),a={SERVICE:"WMS",VERSION:dE,REQUEST:"GetFeatureInfo",FORMAT:"image/png",TRANSPARENT:!0,QUERY_LAYERS:this.params_.LAYERS};T(a,this.params_,r);var h=Math.floor((t[0]-s[0])/e),l=Math.floor((s[3]-t[1])/e);a[this.v13_?"I":"X"]=h;a[this.v13_?"J":"Y"]=l;return this.getRequestUrl_(s,_E,1,o||n,a)}};t.prototype.getParams=function(){return this.params_};t.prototype.getImageInternal=function(t,e,i,r){if(void 0===this.url_)return null;e=this.findNearestResolution(e);1==i||this.hidpi_&&void 0!==this.serverType_||(i=1);var n=e/i,o=ht(t),s=ut(o,n,0,[Math.ceil(_t(t)/n),Math.ceil(ct(t)/n)]),a=ut(o,n,0,[Math.ceil(this.ratio_*_t(t)/n),Math.ceil(this.ratio_*ct(t)/n)]),h=this.image_;if(h&&this.renderedRevision_==this.getRevision()&&h.getResolution()==e&&h.getPixelRatio()==i&&Q(h.getExtent(),s))return h;var l={SERVICE:"WMS",VERSION:dE,REQUEST:"GetMap",FORMAT:"image/png",TRANSPARENT:!0};T(l,this.params_);this.imageSize_[0]=Math.round(_t(a)/n);this.imageSize_[1]=Math.round(ct(a)/n);var u=this.getRequestUrl_(a,this.imageSize_,i,r,l);this.image_=new _o(a,e,i,u,this.crossOrigin_,this.imageLoadFunction_);this.renderedRevision_=this.getRevision();S(this.image_,R.CHANGE,this.handleImageChange,this);return this.image_};t.prototype.getImageLoadFunction=function(){return this.imageLoadFunction_};t.prototype.getRequestUrl_=function(t,e,i,r,n){A(void 0!==this.url_,9);n[this.v13_?"CRS":"SRS"]=r.getCode();"STYLES"in this.params_||(n.STYLES="");if(1!=i)switch(this.serverType_){case fE.GEOSERVER:var o=90*i+.5|0;"FORMAT_OPTIONS"in n?n.FORMAT_OPTIONS+=";dpi:"+o:n.FORMAT_OPTIONS="dpi:"+o;break;case fE.MAPSERVER:n.MAP_RESOLUTION=90*i;break;case fE.CARMENTA_SERVER:case fE.QGIS:n.DPI=90*i;break;default:A(!1,8)}n.WIDTH=e[0];n.HEIGHT=e[1];var s,a=r.getAxisOrientation();s=this.v13_&&"ne"==a.substr(0,2)?[t[1],t[0],t[3],t[2]]:t;n.BBOX=s.join(",");return hE(this.url_,n)};t.prototype.getUrl=function(){return this.url_};t.prototype.setImageLoadFunction=function(t){this.image_=null;this.imageLoadFunction_=t;this.changed()};t.prototype.setUrl=function(t){if(t!=this.url_){this.url_=t;this.image_=null;this.changed()}};t.prototype.updateParams=function(t){T(this.params_,t);this.updateV13_();this.image_=null;this.changed()};t.prototype.updateV13_=function(){var t=this.params_.VERSION||dE;this.v13_=0<=Un(t,"1.3")};return t}(sE),yE='&#169; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',vE=function(o){function t(t){var e,i=t||{};e=void 0!==i.attributions?i.attributions:[yE];var r=void 0!==i.crossOrigin?i.crossOrigin:"anonymous",n=void 0!==i.url?i.url:"https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png";o.call(this,{attributions:e,cacheSize:i.cacheSize,crossOrigin:r,opaque:void 0===i.opaque||i.opaque,maxZoom:void 0!==i.maxZoom?i.maxZoom:19,reprojectionErrorThreshold:i.reprojectionErrorThreshold,tileLoadFunction:i.tileLoadFunction,url:n,wrapX:i.wrapX})}o&&(t.__proto__=o);return(t.prototype=Object.create(o&&o.prototype)).constructor=t}($x),mE=!0;try{new ImageData(10,10)}catch(t){mE=!1}var xE=document.createElement("canvas").getContext("2d");var EE={newImageData:function(t,e,i){if(mE)return new ImageData(t,e,i);var r=xE.createImageData(e,i);r.data.set(t);return r}}.newImageData;function TE(x){var E=!0;try{new ImageData(10,10)}catch(t){E=!1}return function(t){var e,i,r,n,o,s=t.buffers,a=t.meta,h=t.imageOps,l=t.width,u=t.height,c=s.length,p=s[0].byteLength;if(h){var d=new Array(c);for(i=0;i<c;++i)d[i]=(r=new Uint8ClampedArray(s[i]),n=l,o=u,E?new ImageData(r,n,o):{data:r,width:n,height:o});e=x(d,a).data}else{e=new Uint8ClampedArray(p);var f=new Array(c),_=new Array(c);for(i=0;i<c;++i){f[i]=new Uint8ClampedArray(s[i]);_[i]=[0,0,0,0]}for(var g=0;g<p;g+=4){for(var y=0;y<c;++y){var v=f[y];_[y][0]=v[g];_[y][1]=v[g+1];_[y][2]=v[g+2];_[y][3]=v[g+3]}var m=x(_,a);e[g]=m[0];e[g+1]=m[1];e[g+2]=m[2];e[g+3]=m[3]}}return e.buffer}}function SE(e,t){var i=Object.keys(e.lib||{}).map(function(t){return"var "+t+" = "+e.lib[t].toString()+";"}).concat(["var __minion__ = ("+TE.toString()+")(",e.operation.toString(),");",'self.addEventListener("message", function(event) {',"  var buffer = __minion__(event.data);","  self.postMessage({buffer: buffer, meta: event.data.meta}, [buffer]);","});"]),r=new Blob(i,{type:"text/javascript"}),n=URL.createObjectURL(r),o=new Worker(n);o.addEventListener("message",t);return o}function CE(t){var e;this._imageOps=!!t.imageOps;var i,r,n,o=[];if(e=0===t.threads?0:this._imageOps?1:t.threads||1)for(var s=0;s<e;++s)o[s]=SE(t,this._onWorkerMessage.bind(this,s));else o[0]=(i=t,r=this._onWorkerMessage.bind(this,0),n=TE(i.operation),{postMessage:function(t){setTimeout(function(){r({data:{buffer:n(t),meta:t.meta}})},0)}});this._workers=o;this._queue=[];this._maxQueueLength=t.queue||1/0;this._running=0;this._dataLookup={};this._job=null}CE.prototype.process=function(t,e,i){this._enqueue({inputs:t,meta:e,callback:i});this._dispatch()};CE.prototype.destroy=function(){for(var t in this)this[t]=null;this._destroyed=!0};CE.prototype._enqueue=function(t){this._queue.push(t);for(;this._queue.length>this._maxQueueLength;)this._queue.shift().callback(null,null)};CE.prototype._dispatch=function(){if(0===this._running&&0<this._queue.length){var t=this._job=this._queue.shift(),e=t.inputs[0].width,i=t.inputs[0].height,r=t.inputs.map(function(t){return t.data.buffer}),n=this._workers.length;if(1===(this._running=n))this._workers[0].postMessage({buffers:r,meta:t.meta,imageOps:this._imageOps,width:e,height:i},r);else for(var o=t.inputs[0].data.length,s=4*Math.ceil(o/4/n),a=0;a<n;++a){for(var h=a*s,l=[],u=0,c=r.length;u<c;++u)l.push(r[a].slice(h,h+s));this._workers[a].postMessage({buffers:l,meta:t.meta,imageOps:this._imageOps,width:e,height:i},l)}}};CE.prototype._onWorkerMessage=function(t,e){if(!this._destroyed){this._dataLookup[t]=e.data;--this._running;0===this._running&&this._resolveJob()}};CE.prototype._resolveJob=function(){var t,e,i=this._job,r=this._workers.length;if(1===r){t=new Uint8ClampedArray(this._dataLookup[0].buffer);e=this._dataLookup[0].meta}else{var n=i.inputs[0].data.length;t=new Uint8ClampedArray(n);e=new Array(n);for(var o=4*Math.ceil(n/4/r),s=0;s<r;++s){var a=this._dataLookup[s].buffer,h=s*o;t.set(new Uint8ClampedArray(a),h);e[s]=this._dataLookup[s].meta}}this._job=null;this._dataLookup={};i.callback(null,EE(t,i.inputs[0].width,i.inputs[0].height),e);this._dispatch()};var RE=CE,IE="beforeoperations",wE="afteroperations",LE="pixel",OE="image",PE=function(r){function t(t,e,i){r.call(this,t);this.extent=e.extent;this.resolution=e.viewState.resolution/e.pixelRatio;this.data=i}r&&(t.__proto__=r);return(t.prototype=Object.create(r&&r.prototype)).constructor=t}(x),bE=function(a){function t(t){a.call(this,{});this.worker_=null;this.operationType_=void 0!==t.operationType?t.operationType:LE;this.threads_=void 0!==t.threads?t.threads:1;this.renderers_=function(t){for(var e=t.length,i=new Array(e),r=0;r<e;++r)i[r]=AE(t[r]);return i}(t.sources);for(var e=0,i=this.renderers_.length;e<i;++e)S(this.renderers_[e],R.CHANGE,this.changed,this);this.tileQueue_=new xs(function(){return 1},this.changed.bind(this));for(var r=this.renderers_.map(function(t){return t.getLayer().getLayerState()}),n={},o=0,s=r.length;o<s;++o)n[St(r[o].layer)]=r[o];this.requestedFrameState_;this.renderedImageCanvas_=null;this.renderedRevision_;this.frameState_={animate:!1,coordinateToPixelTransform:[1,0,0,1,0,0],extent:null,focus:null,index:0,layerStates:n,layerStatesArray:r,pixelRatio:1,pixelToCoordinateTransform:[1,0,0,1,0,0],postRenderFunctions:[],size:[0,0],skippedFeatureUids:{},tileQueue:this.tileQueue_,time:Date.now(),usedTiles:{},viewState:{rotation:0},viewHints:[],wantedTiles:{}};void 0!==t.operation&&this.setOperation(t.operation,t.lib)}a&&(t.__proto__=a);((t.prototype=Object.create(a&&a.prototype)).constructor=t).prototype.setOperation=function(t,e){this.worker_=new RE({operation:t,imageOps:this.operationType_===OE,queue:1,lib:e,threads:this.threads_});this.changed()};t.prototype.updateFrameState_=function(t,e,i){var r=T({},this.frameState_);r.viewState=T({},r.viewState);var n=ht(t);r.extent=t.slice();r.focus=n;r.size[0]=Math.round(_t(t)/e);r.size[1]=Math.round(ct(t)/e);r.time=Date.now();r.animate=!1;var o=r.viewState;o.center=n;o.projection=i;o.resolution=e;return r};t.prototype.allSourcesReady_=function(){for(var t=!0,e=0,i=this.renderers_.length;e<i;++e)if(this.renderers_[e].getLayer().getSource().getState()!==Ys.READY){t=!1;break}return t};t.prototype.getImage=function(t,e,i,r){if(!this.allSourcesReady_())return null;var n=this.updateFrameState_(t,e,r);this.requestedFrameState_=n;if(this.renderedImageCanvas_){var o=this.renderedImageCanvas_.getResolution(),s=this.renderedImageCanvas_.getExtent();e===o&&$(t,s)||(this.renderedImageCanvas_=null)}this.renderedImageCanvas_&&this.getRevision()===this.renderedRevision_||this.processSources_();n.tileQueue.loadMoreTiles(16,16);n.animate&&requestAnimationFrame(this.changed.bind(this));return this.renderedImageCanvas_};t.prototype.processSources_=function(){for(var t=this.requestedFrameState_,e=this.renderers_.length,i=new Array(e),r=0;r<e;++r){var n=FE(this.renderers_[r],t,t.layerStatesArray[r]);if(!n)return;i[r]=n}var o={};this.dispatchEvent(new PE(IE,t,o));this.worker_.process(i,o,this.onWorkerComplete_.bind(this,t))};t.prototype.onWorkerComplete_=function(t,e,i,r){if(!e&&i){var n=t.extent,o=t.viewState.resolution;if(o===this.requestedFrameState_.viewState.resolution&&$(n,this.requestedFrameState_.extent)){var s;if(this.renderedImageCanvas_)s=this.renderedImageCanvas_.getImage().getContext("2d");else{s=ii(Math.round(_t(n)/o),Math.round(ct(n)/o));this.renderedImageCanvas_=new go(n,o,1,s.canvas)}s.putImageData(i,0,0);this.changed();this.renderedRevision_=this.getRevision();this.dispatchEvent(new PE(wE,t,r))}}};t.prototype.getImageInternal=function(){return null};return t}(sE),ME=null;function FE(t,e,i){if(!t.prepareFrame(e,i))return null;var r=e.size[0],n=e.size[1];if(ME){var o=ME.canvas;o.width!==r||o.height!==n?ME=ii(r,n):ME.clearRect(0,0,r,n)}else ME=ii(r,n);t.composeFrame(e,i,ME);return ME.getImageData(0,0,r,n)}function AE(t){var e,i,r=null;t instanceof Wx?r=(i=new Sx({source:t}),new cu(i)):t instanceof sE?r=(e=new Ex({source:t}),new hu(e)):t instanceof Sx?r=new cu(t):t instanceof qs&&(t.getType()==Io.IMAGE||t.getType()==Io.VECTOR)&&(r=new hu(t));return r}var NE=['Map tiles by <a href="https://stamen.com/">Stamen Design</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.',yE],DE={terrain:{extension:"jpg",opaque:!0},"terrain-background":{extension:"jpg",opaque:!0},"terrain-labels":{extension:"png",opaque:!1},"terrain-lines":{extension:"png",opaque:!1},"toner-background":{extension:"png",opaque:!0},toner:{extension:"png",opaque:!0},"toner-hybrid":{extension:"png",opaque:!1},"toner-labels":{extension:"png",opaque:!1},"toner-lines":{extension:"png",opaque:!1},"toner-lite":{extension:"png",opaque:!0},watercolor:{extension:"jpg",opaque:!0}},GE={terrain:{minZoom:4,maxZoom:18},toner:{minZoom:0,maxZoom:20},watercolor:{minZoom:1,maxZoom:16}},kE=function(s){function t(t){var e=t.layer.indexOf("-"),i=-1==e?t.layer:t.layer.slice(0,e),r=GE[i],n=DE[t.layer],o=void 0!==t.url?t.url:"https://stamen-tiles-{a-d}.a.ssl.fastly.net/"+t.layer+"/{z}/{x}/{y}."+n.extension;s.call(this,{attributions:NE,cacheSize:t.cacheSize,crossOrigin:"anonymous",maxZoom:null!=t.maxZoom?t.maxZoom:r.maxZoom,minZoom:null!=t.minZoom?t.minZoom:r.minZoom,opaque:n.opaque,reprojectionErrorThreshold:t.reprojectionErrorThreshold,tileLoadFunction:t.tileLoadFunction,url:o,wrapX:t.wrapX})}s&&(t.__proto__=s);return(t.prototype=Object.create(s&&s.prototype)).constructor=t}($x),jE=function(i){function t(t){var e=t||{};i.call(this,{attributions:e.attributions,cacheSize:e.cacheSize,crossOrigin:e.crossOrigin,projection:e.projection,reprojectionErrorThreshold:e.reprojectionErrorThreshold,tileGrid:e.tileGrid,tileLoadFunction:e.tileLoadFunction,url:e.url,urls:e.urls,wrapX:void 0===e.wrapX||e.wrapX,transition:e.transition});this.params_=e.params||{};this.tmpExtent_=[1/0,1/0,-1/0,-1/0];this.setKey(this.getKeyForParams_())}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.getKeyForParams_=function(){var t=0,e=[];for(var i in this.params_)e[t++]=i+"-"+this.params_[i];return e.join("/")};t.prototype.getParams=function(){return this.params_};t.prototype.getRequestUrl_=function(t,e,i,r,n,o){var s=this.urls;if(s){var a,h=n.getCode().split(":").pop();o.SIZE=e[0]+","+e[1];o.BBOX=i.join(",");o.BBOXSR=h;o.IMAGESR=h;o.DPI=Math.round(o.DPI?o.DPI*r:90*r);if(1==s.length)a=s[0];else{a=s[Dt(sc(t),s.length)]}return hE(a.replace(/MapServer\/?$/,"MapServer/export").replace(/ImageServer\/?$/,"ImageServer/exportImage"),o)}};t.prototype.getTilePixelRatio=function(t){return t};t.prototype.fixedTileUrlFunction=function(t,e,i){var r=this.getTileGrid();r||(r=this.getTileGridForProjection(i));if(!(r.getResolutions().length<=t[0])){var n=r.getTileCoordExtent(t,this.tmpExtent_),o=Hs(r.getTileSize(t[0]),this.tmpSize);1!=e&&(o=Ws(o,e,this.tmpSize));var s={F:"image",FORMAT:"PNG32",TRANSPARENT:!0};T(s,this.params_);return this.getRequestUrl_(t,o,n,e,i,s)}};t.prototype.updateParams=function(t){T(this.params_,t);this.setKey(this.getKeyForParams_())};return t}(qx),UE=function(r){function t(t,e,i){r.call(this,t,yo.LOADED);this.tileSize_=e;this.text_=i;this.canvas_=null}r&&(t.__proto__=r);((t.prototype=Object.create(r&&r.prototype)).constructor=t).prototype.getImage=function(){if(this.canvas_)return this.canvas_;var t=this.tileSize_,e=ii(t[0],t[1]);e.strokeStyle="black";e.strokeRect(.5,.5,t[0]+.5,t[1]+.5);e.fillStyle="black";e.textAlign="center";e.textBaseline="middle";e.font="24px sans-serif";e.fillText(this.text_,t[0]/2,t[1]/2);this.canvas_=e.canvas;return e.canvas};t.prototype.load=function(){};return t}(To),YE=function(e){function t(t){e.call(this,{opaque:!1,projection:t.projection,tileGrid:t.tileGrid,wrapX:void 0===t.wrapX||t.wrapX})}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getTile=function(t,e,i){var r=rc(t,e,i);if(this.tileCache.containsKey(r))return this.tileCache.get(r);var n=Hs(this.tileGrid.getTileSize(t)),o=[t,e,i],s=this.getTileCoordForTileUrlFunction(o),a=s?this.getTileCoordForTileUrlFunction(s).toString():"",h=new UE(o,n,a);this.tileCache.set(r,h);return h};return t}(Wx),BE=function(i){function t(t){i.call(this,{attributions:t.attributions,cacheSize:t.cacheSize,crossOrigin:t.crossOrigin,projection:ye("EPSG:3857"),reprojectionErrorThreshold:t.reprojectionErrorThreshold,state:Ys.LOADING,tileLoadFunction:t.tileLoadFunction,wrapX:void 0===t.wrapX||t.wrapX,transition:t.transition});this.tileJSON_=null;if(t.url)if(t.jsonp)Dx(t.url,this.handleTileJSONResponse.bind(this),this.handleTileJSONError.bind(this));else{var e=new XMLHttpRequest;e.addEventListener("load",this.onXHRLoad_.bind(this));e.addEventListener("error",this.onXHRError_.bind(this));e.open("GET",t.url);e.send()}else t.tileJSON?this.handleTileJSONResponse(t.tileJSON):A(!1,51)}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.onXHRLoad_=function(t){var e=t.target;if(!e.status||200<=e.status&&e.status<300){var i;try{i=JSON.parse(e.responseText)}catch(t){this.handleTileJSONError();return}this.handleTileJSONResponse(i)}else this.handleTileJSONError()};t.prototype.onXHRError_=function(t){this.handleTileJSONError()};t.prototype.getTileJSON=function(){return this.tileJSON_};t.prototype.handleTileJSONResponse=function(e){var t,i=ye("EPSG:4326"),r=this.getProjection();if(void 0!==e.bounds){var n=Re(i,r);t=xt(e.bounds,n)}var o=e.minzoom||0,s=e.maxzoom||22,a=Bx({extent:zx(r),maxZoom:s,minZoom:o});this.tileGrid=a;this.tileUrlFunction=Mx(e.tiles,a);if(void 0!==e.attribution&&!this.getAttributions()){var h=void 0!==t?t:i.getExtent();this.setAttributions(function(t){return Rt(h,t.extent)?[e.attribution]:null})}this.tileJSON_=e;this.setState(Ys.READY)};t.prototype.handleTileJSONError=function(){this.setState(Ys.ERROR)};return t}(qx),VE=function(n){function t(t){var e=t||{},i=e.params||{},r=!("TRANSPARENT"in i)||i.TRANSPARENT;n.call(this,{attributions:e.attributions,cacheSize:e.cacheSize,crossOrigin:e.crossOrigin,opaque:!r,projection:e.projection,reprojectionErrorThreshold:e.reprojectionErrorThreshold,tileClass:e.tileClass,tileGrid:e.tileGrid,tileLoadFunction:e.tileLoadFunction,url:e.url,urls:e.urls,wrapX:void 0===e.wrapX||e.wrapX,transition:e.transition});this.gutter_=void 0!==e.gutter?e.gutter:0;this.params_=i;this.v13_=!0;this.serverType_=e.serverType;this.hidpi_=void 0===e.hidpi||e.hidpi;this.tmpExtent_=[1/0,1/0,-1/0,-1/0];this.updateV13_();this.setKey(this.getKeyForParams_())}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.getGetFeatureInfoUrl=function(t,e,i,r){var n=ye(i),o=this.getProjection(),s=this.getTileGrid();s||(s=this.getTileGridForProjection(n));var a=s.getTileCoordForCoordAndResolution(t,e);if(!(s.getResolutions().length<=a[0])){var h=s.getResolution(a[0]),l=s.getTileCoordExtent(a,this.tmpExtent_),u=Hs(s.getTileSize(a[0]),this.tmpSize),c=this.gutter_;if(0!==c){u=Xs(u,c,this.tmpSize);l=k(l,h*c,l)}if(o&&o!==n){h=Rx(o,n,t,h);l=Le(l,n,o);t=we(t,n,o)}var p={SERVICE:"WMS",VERSION:dE,REQUEST:"GetFeatureInfo",FORMAT:"image/png",TRANSPARENT:!0,QUERY_LAYERS:this.params_.LAYERS};T(p,this.params_,r);var d=Math.floor((t[0]-l[0])/h),f=Math.floor((l[3]-t[1])/h);p[this.v13_?"I":"X"]=d;p[this.v13_?"J":"Y"]=f;return this.getRequestUrl_(a,u,l,1,o||n,p)}};t.prototype.getGutter=function(){return this.gutter_};t.prototype.getParams=function(){return this.params_};t.prototype.getRequestUrl_=function(t,e,i,r,n,o){var s=this.urls;if(s){o.WIDTH=e[0];o.HEIGHT=e[1];o[this.v13_?"CRS":"SRS"]=n.getCode();"STYLES"in this.params_||(o.STYLES="");if(1!=r)switch(this.serverType_){case fE.GEOSERVER:var a=90*r+.5|0;"FORMAT_OPTIONS"in o?o.FORMAT_OPTIONS+=";dpi:"+a:o.FORMAT_OPTIONS="dpi:"+a;break;case fE.MAPSERVER:o.MAP_RESOLUTION=90*r;break;case fE.CARMENTA_SERVER:case fE.QGIS:o.DPI=90*r;break;default:A(!1,52)}var h,l=n.getAxisOrientation(),u=i;if(this.v13_&&"ne"==l.substr(0,2)){var c;c=i[0];u[0]=i[1];u[1]=c;c=i[2];u[2]=i[3];u[3]=c}o.BBOX=u.join(",");if(1==s.length)h=s[0];else{h=s[Dt(sc(t),s.length)]}return hE(h,o)}};t.prototype.getTilePixelRatio=function(t){return this.hidpi_&&void 0!==this.serverType_?t:1};t.prototype.getKeyForParams_=function(){var t=0,e=[];for(var i in this.params_)e[t++]=i+"-"+this.params_[i];return e.join("/")};t.prototype.fixedTileUrlFunction=function(t,e,i){var r=this.getTileGrid();r||(r=this.getTileGridForProjection(i));if(!(r.getResolutions().length<=t[0])){1==e||this.hidpi_&&void 0!==this.serverType_||(e=1);var n=r.getResolution(t[0]),o=r.getTileCoordExtent(t,this.tmpExtent_),s=Hs(r.getTileSize(t[0]),this.tmpSize),a=this.gutter_;if(0!==a){s=Xs(s,a,this.tmpSize);o=k(o,n*a,o)}1!=e&&(s=Ws(s,e,this.tmpSize));var h={SERVICE:"WMS",VERSION:dE,REQUEST:"GetMap",FORMAT:"image/png",TRANSPARENT:!0};T(h,this.params_);return this.getRequestUrl_(t,s,o,e,i,h)}};t.prototype.updateParams=function(t){T(this.params_,t);this.updateV13_();this.setKey(this.getKeyForParams_())};t.prototype.updateV13_=function(){var t=this.params_.VERSION||dE;this.v13_=0<=Un(t,"1.3")};return t}(qx),XE=function(s){function t(t,e,i,r,n,o){s.call(this,t,e);this.src_=i;this.extent_=r;this.preemptive_=n;this.grid_=null;this.keys_=null;this.data_=null;this.jsonp_=o}s&&(t.__proto__=s);((t.prototype=Object.create(s&&s.prototype)).constructor=t).prototype.getImage=function(){return null};t.prototype.getData=function(t){if(!this.grid_||!this.keys_)return null;var e=(t[0]-this.extent_[0])/(this.extent_[2]-this.extent_[0]),i=(t[1]-this.extent_[1])/(this.extent_[3]-this.extent_[1]),r=this.grid_[Math.floor((1-i)*this.grid_.length)];if("string"!=typeof r)return null;var n=r.charCodeAt(Math.floor(e*r.length));93<=n&&n--;35<=n&&n--;var o=null;if((n-=32)in this.keys_){var s=this.keys_[n];o=this.data_&&s in this.data_?this.data_[s]:s}return o};t.prototype.forDataAtCoordinate=function(e,i,r,t){if(this.state==yo.IDLE&&!0===t){d(this,R.CHANGE,function(t){i.call(r,this.getData(e))},this);this.loadInternal_()}else!0===t?setTimeout(function(){i.call(r,this.getData(e))}.bind(this),0):i.call(r,this.getData(e))};t.prototype.getKey=function(){return this.src_};t.prototype.handleError_=function(){this.state=yo.ERROR;this.changed()};t.prototype.handleLoad_=function(t){this.grid_=t.grid;this.keys_=t.keys;this.data_=t.data;this.state=yo.EMPTY;this.changed()};t.prototype.loadInternal_=function(){if(this.state==yo.IDLE){this.state=yo.LOADING;if(this.jsonp_)Dx(this.src_,this.handleLoad_.bind(this),this.handleError_.bind(this));else{var t=new XMLHttpRequest;t.addEventListener("load",this.onXHRLoad_.bind(this));t.addEventListener("error",this.onXHRError_.bind(this));t.open("GET",this.src_);t.send()}}};t.prototype.onXHRLoad_=function(t){var e=t.target;if(!e.status||200<=e.status&&e.status<300){var i;try{i=JSON.parse(e.responseText)}catch(t){this.handleError_();return}this.handleLoad_(i)}else this.handleError_()};t.prototype.onXHRError_=function(t){this.handleError_()};t.prototype.load=function(){this.preemptive_&&this.loadInternal_()};return t}(To),zE=function(i){function t(t){i.call(this,{projection:ye("EPSG:3857"),state:Ys.LOADING});this.preemptive_=void 0===t.preemptive||t.preemptive;this.tileUrlFunction_=Ax;this.template_=void 0;this.jsonp_=t.jsonp||!1;if(t.url)if(this.jsonp_)Dx(t.url,this.handleTileJSONResponse.bind(this),this.handleTileJSONError.bind(this));else{var e=new XMLHttpRequest;e.addEventListener("load",this.onXHRLoad_.bind(this));e.addEventListener("error",this.onXHRError_.bind(this));e.open("GET",t.url);e.send()}else t.tileJSON?this.handleTileJSONResponse(t.tileJSON):A(!1,51)}i&&(t.__proto__=i);((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.onXHRLoad_=function(t){var e=t.target;if(!e.status||200<=e.status&&e.status<300){var i;try{i=JSON.parse(e.responseText)}catch(t){this.handleTileJSONError();return}this.handleTileJSONResponse(i)}else this.handleTileJSONError()};t.prototype.onXHRError_=function(t){this.handleTileJSONError()};t.prototype.getTemplate=function(){return this.template_};t.prototype.forDataAtCoordinateAndResolution=function(t,e,i,r){if(this.tileGrid){var n=this.tileGrid.getTileCoordForCoordAndResolution(t,e);this.getTile(n[0],n[1],n[2],1,this.getProjection()).forDataAtCoordinate(t,i,null,r)}else!0===r?setTimeout(function(){i(null)},0):i(null)};t.prototype.handleTileJSONError=function(){this.setState(Ys.ERROR)};t.prototype.handleTileJSONResponse=function(e){var t,i=ye("EPSG:4326"),r=this.getProjection();if(void 0!==e.bounds){var n=Re(i,r);t=xt(e.bounds,n)}var o=e.minzoom||0,s=e.maxzoom||22,a=Bx({extent:zx(r),maxZoom:s,minZoom:o});this.tileGrid=a;this.template_=e.template;var h=e.grids;if(h){this.tileUrlFunction_=Mx(h,a);if(void 0!==e.attribution){var l=void 0!==t?t:i.getExtent();this.setAttributions(function(t){return Rt(l,t.extent)?[e.attribution]:null})}this.setState(Ys.READY)}else this.setState(Ys.ERROR)};t.prototype.getTile=function(t,e,i,r,n){var o=rc(t,e,i);if(this.tileCache.containsKey(o))return this.tileCache.get(o);var s=[t,e,i],a=this.getTileCoordForTileUrlFunction(s,n),h=this.tileUrlFunction_(a,r,n),l=new XE(s,void 0!==h?yo.IDLE:yo.EMPTY,void 0!==h?h:"",this.tileGrid.getTileCoordExtent(s),this.preemptive_,this.jsonp_);this.tileCache.set(o,l);return l};t.prototype.useTile=function(t,e,i){var r=rc(t,e,i);this.tileCache.containsKey(r)&&this.tileCache.get(r)};return t}(Wx),WE=function(n){function t(t){var e=t.projection||"EPSG:3857",i=t.extent||zx(e),r=t.tileGrid||Bx({extent:i,maxZoom:t.maxZoom||22,minZoom:t.minZoom,tileSize:t.tileSize||512});n.call(this,{attributions:t.attributions,cacheSize:void 0!==t.cacheSize?t.cacheSize:128,extent:i,opaque:!1,projection:e,state:t.state,tileGrid:r,tileLoadFunction:t.tileLoadFunction?t.tileLoadFunction:cc,tileUrlFunction:t.tileUrlFunction,url:t.url,urls:t.urls,wrapX:void 0===t.wrapX||t.wrapX,transition:t.transition});this.format_=t.format?t.format:null;this.sourceTiles_={};this.overlaps_=null==t.overlaps||t.overlaps;this.tileClass=t.tileClass?t.tileClass:fc;this.tileGrids_={}}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.getOverlaps=function(){return this.overlaps_};t.prototype.clear=function(){this.tileCache.clear();this.sourceTiles_={}};t.prototype.getTile=function(t,e,i,r,n){var o=rc(t,e,i);if(this.tileCache.containsKey(o))return this.tileCache.get(o);var s=[t,e,i],a=this.getTileCoordForTileUrlFunction(s,n),h=new uc(s,null!==a?yo.IDLE:yo.EMPTY,this.getRevision(),this.format_,this.tileLoadFunction,a,this.tileUrlFunction,this.tileGrid,this.getTileGridForProjection(n),this.sourceTiles_,r,n,this.tileClass,this.handleTileChange.bind(this),s[0]);this.tileCache.set(o,h);return h};t.prototype.getTileGridForProjection=function(t){var e=t.getCode(),i=this.tileGrids_[e];if(!i){var r=this.tileGrid;i=this.tileGrids_[e]=Xx(t,void 0,r?r.getTileSize(r.getMinZoom()):void 0)}return i};t.prototype.getTilePixelRatio=function(t){return t};t.prototype.getTilePixelSize=function(t,e,i){var r=Hs(this.getTileGridForProjection(i).getTileSize(t),this.tmpSize);return[Math.round(r[0]*e),Math.round(r[1]*e)]};return t}(Zx),HE={KVP:"KVP",REST:"REST"},KE=function(e){function t(t){e.call(this,{extent:t.extent,origin:t.origin,origins:t.origins,resolutions:t.resolutions,tileSize:t.tileSize,tileSizes:t.tileSizes,sizes:t.sizes});this.matrixIds_=t.matrixIds}e&&(t.__proto__=e);((t.prototype=Object.create(e&&e.prototype)).constructor=t).prototype.getMatrixId=function(t){return this.matrixIds_[t]};t.prototype.getMatrixIds=function(){return this.matrixIds_};return t}(kx);function ZE(n,t,e){var o=[],s=[],a=[],h=[],l=[],u=void 0!==e?e:[],c="TileMatrix",p="Identifier",d="ScaleDenominator",f="TopLeftCorner",i=n.SupportedCRS,r=ye(i.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/,"$1:$3"))||ye(i),_=r.getMetersPerUnit(),g="ne"==r.getAxisOrientation().substr(0,2);n[c].sort(function(t,e){return e[d]-t[d]});n[c].forEach(function(e){if(!(0<u.length)||Fr(u,function(t){return e[p]==t[c]||-1===e[p].indexOf(":")&&n[p]+":"+e[p]===t[c]})){s.push(e[p]);var t=28e-5*e[d]/_,i=e.TileWidth,r=e.TileHeight;g?a.push([e[f][1],e[f][0]]):a.push(e[f]);o.push(t);h.push(i==r?i:[i,r]);l.push([e.MatrixWidth,-e.MatrixHeight])}});return new KE({extent:t,origins:a,resolutions:o,matrixIds:s,tileSizes:h,sizes:l})}var qE=function(n){function t(t){var e=void 0!==t.requestEncoding?t.requestEncoding:HE.KVP,i=t.tileGrid,r=t.urls;void 0===r&&void 0!==t.url&&(r=Nx(t.url));n.call(this,{attributions:t.attributions,cacheSize:t.cacheSize,crossOrigin:t.crossOrigin,projection:t.projection,reprojectionErrorThreshold:t.reprojectionErrorThreshold,tileClass:t.tileClass,tileGrid:i,tileLoadFunction:t.tileLoadFunction,tilePixelRatio:t.tilePixelRatio,tileUrlFunction:Ax,urls:r,wrapX:void 0!==t.wrapX&&t.wrapX,transition:t.transition});this.version_=void 0!==t.version?t.version:"1.0.0";this.format_=void 0!==t.format?t.format:"image/jpeg";this.dimensions_=void 0!==t.dimensions?t.dimensions:{};this.layer_=t.layer;this.matrixSet_=t.matrixSet;this.style_=t.style;this.requestEncoding_=e;this.setKey(this.getKeyForDimensions_());r&&0<r.length&&(this.tileUrlFunction=Fx(r.map(JE.bind(this))))}n&&(t.__proto__=n);((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.setUrls=function(t){var e=(this.urls=t).join("\n");this.setTileUrlFunction(this.fixedTileUrlFunction?this.fixedTileUrlFunction.bind(this):Fx(t.map(JE.bind(this))),e)};t.prototype.getDimensions=function(){return this.dimensions_};t.prototype.getFormat=function(){return this.format_};t.prototype.getLayer=function(){return this.layer_};t.prototype.getMatrixSet=function(){return this.matrixSet_};t.prototype.getRequestEncoding=function(){return this.requestEncoding_};t.prototype.getStyle=function(){return this.style_};t.prototype.getVersion=function(){return this.version_};t.prototype.getKeyForDimensions_=function(){var t=0,e=[];for(var i in this.dimensions_)e[t++]=i+"-"+this.dimensions_[i];return e.join("/")};t.prototype.updateDimensions=function(t){T(this.dimensions_,t);this.setKey(this.getKeyForDimensions_())};return t}(qx);function JE(o){var s=this.requestEncoding_,i={layer:this.layer_,style:this.style_,tilematrixset:this.matrixSet_};s==HE.KVP&&T(i,{Service:"WMTS",Request:"GetTile",Version:this.version_,Format:this.format_});o=s==HE.KVP?hE(o,i):o.replace(/\{(\w+?)\}/g,function(t,e){return e.toLowerCase()in i?i[e.toLowerCase()]:t});var a=this.tileGrid,h=this.dimensions_;return function(t,e,i){if(t){var r={TileMatrix:a.getMatrixId(t[0]),TileCol:t[1],TileRow:-t[2]-1};T(r,h);var n=o;return n=s==HE.KVP?hE(n,r):n.replace(/\{(\w+?)\}/g,function(t,e){return r[e]})}}}var QE="default",$E="truncated",tT=function(a){function t(t,e,i,r,n,o,s){a.call(this,e,i,r,n,o,s);this.zoomifyImage_=null;this.tileSize_=Hs(t.getTileSize(e[0]))}a&&(t.__proto__=a);((t.prototype=Object.create(a&&a.prototype)).constructor=t).prototype.getImage=function(){if(this.zoomifyImage_)return this.zoomifyImage_;var t=a.prototype.getImage.call(this);if(this.state!=yo.LOADED)return t;var e=this.tileSize_;if(t.width==e[0]&&t.height==e[1])return this.zoomifyImage_=t;var i=ii(e[0],e[1]);i.drawImage(t,0,0);this.zoomifyImage_=i.canvas;return i.canvas};return t}(So),eT=function(x){function t(t){var e=t||{},i=e.size,r=void 0!==e.tierSizeCalculation?e.tierSizeCalculation:QE,n=i[0],o=i[1],s=e.extent||[0,-i[1],i[0],0],u=[],a=e.tileSize||Ts,h=a;switch(r){case QE:for(;h<n||h<o;){u.push([Math.ceil(n/h),Math.ceil(o/h)]);h+=h}break;case $E:for(var l=n,c=o;h<l||h<c;){u.push([Math.ceil(l/h),Math.ceil(c/h)]);l>>=1;c>>=1}break;default:A(!1,53)}u.push([1,1]);u.reverse();for(var p=[1],d=[0],f=1,_=u.length;f<_;f++){p.push(1<<f);d.push(u[f-1][0]*u[f-1][1]+d[f-1])}p.reverse();var g=new kx({tileSize:a,extent:s,origin:dt(s),resolutions:p}),y=e.url;y&&-1==y.indexOf("{TileGroup}")&&-1==y.indexOf("{tileIndex}")&&(y+="{TileGroup}/{z}-{x}-{y}.jpg");var v=Fx(Nx(y).map(function(l){return function(t,e,i){if(t){var r=t[0],n=t[1],o=-t[2]-1,s=n+o*u[r][0],a=g.getTileSize(r),h={z:r,x:n,y:o,tileIndex:s,TileGroup:"TileGroup"+((s+d[r])/a|0)};return l.replace(/\{(\w+?)\}/g,function(t,e){return h[e]})}}})),m=tT.bind(null,g);x.call(this,{attributions:e.attributions,cacheSize:e.cacheSize,crossOrigin:e.crossOrigin,projection:e.projection,reprojectionErrorThreshold:e.reprojectionErrorThreshold,tileClass:m,tileGrid:g,tileUrlFunction:v,transition:e.transition})}x&&(t.__proto__=x);return(t.prototype=Object.create(x&&x.prototype)).constructor=t}(qx);var iT=window.ol={};iT.AssertionError=n;iT.Collection=F;iT.Collection.CollectionEvent=M;iT.CollectionEventType=a;iT.Disposable=t;iT.Feature=Sr;iT.Feature.createStyleFunction=Cr;iT.Geolocation=kn;iT.GeolocationProperty=Rr;iT.Graticule=po;iT.Image=_o;iT.ImageBase=fo;iT.ImageCanvas=go;iT.ImageState=Ni;iT.ImageTile=So;iT.Kinetic=Ro;iT.LayerType=Io;iT.Map=Ku;iT.MapBrowserEvent=Lo;iT.MapBrowserEventHandler=gs;iT.MapBrowserEventType=Oo;iT.MapBrowserPointerEvent=Po;iT.MapEvent=wo;iT.MapEventType=ys;iT.MapProperty=vs;iT.Object=w;iT.Object.getChangeEventType=P;iT.ObjectEventType=h;iT.Observable=C;iT.Observable.unByKey=function(t){if(Array.isArray(t))for(var e=0,i=t.length;e<i;++e)g(t[e]);else g(t)};iT.Overlay=ec;iT.OverlayPositioning=Zu;iT.PluggableMap=Ks;iT.Tile=To;iT.TileCache=lc;iT.TileQueue=xs;iT.TileRange=lu;iT.TileRange.createOrUpdate=uu;iT.TileState=yo;iT.VectorImageTile=uc;iT.VectorImageTile.defaultLoadFunction=cc;iT.VectorTile=fc;iT.View=Fs;iT.View.createCenterConstraint=Ns;iT.View.createResolutionConstraint=Ds;iT.View.createRotationConstraint=Gs;iT.View.isNoopAnimation=ks;iT.ViewHint=bs;iT.ViewProperty=Ms;iT.WebGLMap=Xp;iT.array={};iT.array.binarySearch=Ir;iT.array.equals=Ar;iT.array.extend=br;iT.array.find=Fr;iT.array.findIndex=Dr;iT.array.includes=Lr;iT.array.isSorted=Gr;iT.array.linearFindNearest=Or;iT.array.numberSafeCompareFunction=wr;iT.array.remove=Mr;iT.array.reverseSubArray=Pr;iT.array.stableSort=Nr;iT.asserts={};iT.asserts.assert=A;iT.centerconstraint={};iT.centerconstraint.createExtent=Ss;iT.centerconstraint.none=Cs;iT.color={};iT.color.asArray=Je;iT.color.asString=He;iT.color.fromString=qe;iT.color.normalize=Qe;iT.color.toString=$e;iT.colorlike={};iT.colorlike.asColorLike=ti;iT.colorlike.isColorLike=ei;iT.control={};iT.control.Attribution=Qs;iT.control.Attribution.render=$s;iT.control.Control=Zs;iT.control.FullScreen=gc;iT.control.MousePosition=Hp;iT.control.MousePosition.render=Kp;iT.control.OverviewMap=xc;iT.control.OverviewMap.render=Ec;iT.control.Rotate=ta;iT.control.Rotate.render=ea;iT.control.ScaleLine=Rc;iT.control.ScaleLine.Units=Sc;iT.control.ScaleLine.render=Ic;iT.control.Zoom=ia;iT.control.ZoomSlider=Oc;iT.control.ZoomSlider.render=Pc;iT.control.ZoomToExtent=bc;iT.control.util={};iT.control.util.defaults=ra;iT.coordinate={};iT.coordinate.add=Yn;iT.coordinate.closestOnCircle=Bn;iT.coordinate.closestOnSegment=Vn;iT.coordinate.createStringXY=function(e){return function(t){return Qn(t,e)}};iT.coordinate.degreesToStringHDMS=Xn;iT.coordinate.distance=qn;iT.coordinate.equals=Wn;iT.coordinate.format=zn;iT.coordinate.rotate=Hn;iT.coordinate.scale=Kn;iT.coordinate.squaredDistance=Zn;iT.coordinate.squaredDistanceToSegment=Jn;iT.coordinate.toStringHDMS=function(t,e){return t?Xn("NS",t[1],e)+" "+Xn("EW",t[0],e):""};iT.coordinate.toStringXY=Qn;iT.css={};iT.css.CLASS_COLLAPSED=Yi;iT.css.CLASS_CONTROL=Ui;iT.css.CLASS_HIDDEN=Di;iT.css.CLASS_SELECTABLE=Gi;iT.css.CLASS_UNSELECTABLE=ki;iT.css.CLASS_UNSUPPORTED=ji;iT.css.getFontFamilies=Bi;iT.dom={};iT.dom.createCanvasContext2D=ii;iT.dom.outerHeight=ni;iT.dom.outerWidth=ri;iT.dom.removeChildren=ai;iT.dom.removeNode=si;iT.dom.replaceNode=oi;iT.easing={};iT.easing.easeIn=vo;iT.easing.easeOut=mo;iT.easing.inAndOut=xo;iT.easing.linear=Eo;iT.easing.upAndDown=function(t){return t<.5?xo(2*t):1-xo(2*(t-.5))};iT.events={};iT.events.Event=x;iT.events.Event.preventDefault=function(t){t.preventDefault()};iT.events.Event.stopPropagation=E;iT.events.EventType=R;iT.events.KeyCode=$a;iT.events.Target=i;iT.events.bindListener=l;iT.events.condition={};iT.events.condition.altKeyOnly=fa;iT.events.condition.altShiftKeysOnly=_a;iT.events.condition.always=ya;iT.events.condition.click=function(t){return t.type==Oo.CLICK};iT.events.condition.doubleClick=function(t){return t.type==Oo.DBLCLICK};iT.events.condition.focus=ga;iT.events.condition.mouseActionButton=va;iT.events.condition.mouseOnly=Ra;iT.events.condition.never=ma;iT.events.condition.noModifierKeys=Ta;iT.events.condition.platformModifierKeyOnly=function(t){var e=t.originalEvent;return!e.altKey&&(Li?e.metaKey:e.ctrlKey)&&!e.shiftKey};iT.events.condition.pointerMove=xa;iT.events.condition.primaryAction=Ia;iT.events.condition.shiftKeyOnly=Sa;iT.events.condition.singleClick=Ea;iT.events.condition.targetNotEditable=Ca;iT.events.findListener=u;iT.events.getListeners=c;iT.events.listen=S;iT.events.listenOnce=d;iT.events.unlisten=f;iT.events.unlistenAll=y;iT.events.unlistenByKey=g;iT.extent={};iT.extent.Corner=N;iT.extent.Relationship=D;iT.extent.applyTransform=xt;iT.extent.boundingExtent=G;iT.extent.buffer=k;iT.extent.clone=j;iT.extent.closestSquaredDistanceXY=U;iT.extent.containsCoordinate=Y;iT.extent.containsExtent=Q;iT.extent.containsXY=B;iT.extent.coordinateRelationship=V;iT.extent.createEmpty=X;iT.extent.createOrUpdate=z;iT.extent.createOrUpdateEmpty=W;iT.extent.createOrUpdateFromCoordinate=H;iT.extent.createOrUpdateFromCoordinates=K;iT.extent.createOrUpdateFromFlatCoordinates=Z;iT.extent.createOrUpdateFromRings=function(t,e){return it(W(e),t)};iT.extent.equals=$;iT.extent.extend=q;iT.extent.extendCoordinate=J;iT.extent.extendCoordinates=tt;iT.extent.extendFlatCoordinates=et;iT.extent.extendRings=it;iT.extent.extendXY=rt;iT.extent.forEachCorner=nt;iT.extent.getArea=ot;iT.extent.getBottomLeft=st;iT.extent.getBottomRight=at;iT.extent.getCenter=ht;iT.extent.getCorner=lt;iT.extent.getEnlargedArea=function(t,e){var i=Math.min(t[0],e[0]),r=Math.min(t[1],e[1]);return(Math.max(t[2],e[2])-i)*(Math.max(t[3],e[3])-r)};iT.extent.getForViewAndSize=ut;iT.extent.getHeight=ct;iT.extent.getIntersection=pt;iT.extent.getIntersectionArea=function(t,e){return ot(pt(t,e))};iT.extent.getMargin=function(t){return _t(t)+ct(t)};iT.extent.getSize=function(t){return[t[2]-t[0],t[3]-t[1]]};iT.extent.getTopLeft=dt;iT.extent.getTopRight=ft;iT.extent.getWidth=_t;iT.extent.intersects=Rt;iT.extent.intersectsSegment=mt;iT.extent.isEmpty=gt;iT.extent.returnOrUpdate=yt;iT.extent.scaleFromCenter=vt;iT.featureloader={};iT.featureloader.loadFeaturesXhr=Fh;iT.featureloader.xhr=Ah;iT.format={};iT.format.EsriJSON=ed;iT.format.Feature=Zp;iT.format.Feature.transformWithOptions=qp;iT.format.FormatType=Mh;iT.format.GML=Jd;iT.format.GML2=tf;iT.format.GML3=qd;iT.format.GMLBase=Fd;iT.format.GMLBase.GMLNS=bd;iT.format.GPX=af;iT.format.GeoJSON=kf;iT.format.IGC=Qf;iT.format.JSONFeature=Jp;iT.format.KML=L_;iT.format.KML.getDefaultFillStyle=function(){return x_};iT.format.KML.getDefaultImageStyle=function(){return T_};iT.format.KML.getDefaultStrokeStyle=function(){return C_};iT.format.KML.getDefaultStyle=function(){return I_};iT.format.KML.getDefaultStyleArray=function(){return w_};iT.format.KML.getDefaultTextStyle=function(){return R_};iT.format.KML.readFlatCoordinates=b_;iT.format.MVT=Cy;iT.format.OSMXML=My;iT.format.OWS=Uy;iT.format.Polyline=ev;iT.format.Polyline.decodeDeltas=rv;iT.format.Polyline.decodeFloats=ov;iT.format.Polyline.decodeSignedIntegers=av;iT.format.Polyline.decodeUnsignedIntegers=lv;iT.format.Polyline.encodeDeltas=iv;iT.format.Polyline.encodeFloats=nv;iT.format.Polyline.encodeSignedIntegers=sv;iT.format.Polyline.encodeUnsignedInteger=uv;iT.format.Polyline.encodeUnsignedIntegers=hv;iT.format.TextFeature=Vf;iT.format.TopoJSON=cv;iT.format.WFS=Qv;iT.format.WFS.writeFilter=function(t){var e=hd(Zv,"Filter");nm(e,t,[]);return e};iT.format.WKT=Rm;iT.format.WMSCapabilities=Am;iT.format.WMSGetFeatureInfo=tx;iT.format.WMTSCapabilities=nx;iT.format.XLink={};iT.format.XLink.readHref=Dy;iT.format.XML=Gy;iT.format.XMLFeature=Pd;iT.format.filter={};iT.format.filter.And=xv;iT.format.filter.Bbox=Ev;iT.format.filter.Comparison=Cv;iT.format.filter.ComparisonBinary=Iv;iT.format.filter.Contains=Sv;iT.format.filter.During=Rv;iT.format.filter.EqualTo=wv;iT.format.filter.Filter=vv;iT.format.filter.GreaterThan=Lv;iT.format.filter.GreaterThanOrEqualTo=Ov;iT.format.filter.Intersects=Pv;iT.format.filter.IsBetween=bv;iT.format.filter.IsLike=Mv;iT.format.filter.IsNull=Fv;iT.format.filter.LessThan=Av;iT.format.filter.LessThanOrEqualTo=Nv;iT.format.filter.LogicalNary=mv;iT.format.filter.Not=Dv;iT.format.filter.NotEqualTo=Gv;iT.format.filter.Or=kv;iT.format.filter.Spatial=Tv;iT.format.filter.Within=jv;iT.format.filter.and=Uv;iT.format.filter.bbox=Yv;iT.format.filter.between=function(t,e,i){return new bv(t,e,i)};iT.format.filter.contains=function(t,e,i){return new Sv(t,e,i)};iT.format.filter.during=function(t,e,i){return new Rv(t,e,i)};iT.format.filter.equalTo=function(t,e,i){return new wv(t,e,i)};iT.format.filter.greaterThan=function(t,e){return new Lv(t,e)};iT.format.filter.greaterThanOrEqualTo=function(t,e){return new Ov(t,e)};iT.format.filter.intersects=function(t,e,i){return new Pv(t,e,i)};iT.format.filter.isNull=function(t){return new Fv(t)};iT.format.filter.lessThan=function(t,e){return new Av(t,e)};iT.format.filter.lessThanOrEqualTo=function(t,e){return new Nv(t,e)};iT.format.filter.like=function(t,e,i,r,n,o){return new Mv(t,e,i,r,n,o)};iT.format.filter.not=function(t){return new Dv(t)};iT.format.filter.notEqualTo=function(t,e,i){return new Gv(t,e,i)};iT.format.filter.or=function(t){var e=[null].concat(Array.prototype.slice.call(arguments));return new(Function.prototype.bind.apply(kv,e))};iT.format.filter.within=function(t,e,i){return new jv(t,e,i)};iT.format.xsd={};iT.format.xsd.readBoolean=Ad;iT.format.xsd.readBooleanString=Nd;iT.format.xsd.readDateTime=Dd;iT.format.xsd.readDecimal=Gd;iT.format.xsd.readDecimalString=kd;iT.format.xsd.readNonNegativeInteger=jd;iT.format.xsd.readNonNegativeIntegerString=Ud;iT.format.xsd.readString=Yd;iT.format.xsd.writeBooleanTextNode=Bd;iT.format.xsd.writeCDATASection=Vd;iT.format.xsd.writeDateTimeTextNode=Xd;iT.format.xsd.writeDecimalTextNode=zd;iT.format.xsd.writeNonNegativeIntegerTextNode=Wd;iT.format.xsd.writeStringTextNode=Hd;iT.functions={};iT.functions.FALSE=m;iT.functions.TRUE=v;iT.functions.VOID=L;iT.geom={};iT.geom.Circle=Ch;iT.geom.Geometry=Xe;iT.geom.GeometryCollection=Df;iT.geom.GeometryLayout=kr;iT.geom.GeometryType=kt;iT.geom.LineString=ro;iT.geom.LinearRing=dn;iT.geom.MultiLineString=Rh;iT.geom.MultiPoint=Ih;iT.geom.MultiPolygon=Lh;iT.geom.Point=fn;iT.geom.Polygon=Fn;iT.geom.Polygon.circular=An;iT.geom.Polygon.fromCircle=Dn;iT.geom.Polygon.fromExtent=Nn;iT.geom.Polygon.makeRegular=Gn;iT.geom.SimpleGeometry=jr;iT.geom.SimpleGeometry.getStrideForLayout=Ur;iT.geom.SimpleGeometry.transformGeom2D=Yr;iT.geom.flat={};iT.geom.flat.area={};iT.geom.flat.area.linearRing=Br;iT.geom.flat.area.linearRings=Vr;iT.geom.flat.area.linearRingss=Xr;iT.geom.flat.center={};iT.geom.flat.center.linearRingss=wh;iT.geom.flat.closest={};iT.geom.flat.closest.arrayMaxSquaredDelta=Hr;iT.geom.flat.closest.assignClosestArrayPoint=qr;iT.geom.flat.closest.assignClosestMultiArrayPoint=Jr;iT.geom.flat.closest.assignClosestPoint=Zr;iT.geom.flat.closest.maxSquaredDelta=Wr;iT.geom.flat.closest.multiArrayMaxSquaredDelta=Kr;iT.geom.flat.contains={};iT.geom.flat.contains.linearRingContainsExtent=_n;iT.geom.flat.contains.linearRingContainsXY=gn;iT.geom.flat.contains.linearRingsContainsXY=yn;iT.geom.flat.contains.linearRingssContainsXY=vn;iT.geom.flat.deflate={};iT.geom.flat.deflate.deflateCoordinate=Qr;iT.geom.flat.deflate.deflateCoordinates=$r;iT.geom.flat.deflate.deflateCoordinatesArray=tn;iT.geom.flat.deflate.deflateMultiCoordinatesArray=en;iT.geom.flat.flip={};iT.geom.flat.flip.flipXY=tv;iT.geom.flat.geodesic={};iT.geom.flat.geodesic.greatCircleArc=function(h,t,l,u,e,i){var r=ye("EPSG:4326"),c=Math.cos(Nt(t)),p=Math.sin(Nt(t)),d=Math.cos(Nt(u)),f=Math.sin(Nt(u)),_=Math.cos(Nt(l-h)),g=Math.sin(Nt(l-h)),y=p*f+c*d*_;return no(function(t){if(1<=y)return[l,u];var e=t*Math.acos(y),i=Math.cos(e),r=Math.sin(e),n=g*d,o=c*f-p*d*_,s=Math.atan2(n,o),a=Math.asin(p*i+c*r*Math.cos(s));return[At(Nt(h)+Math.atan2(Math.sin(s)*r*c,i-p*Math.sin(a))),At(a)]},Ie(r,e),i)};iT.geom.flat.geodesic.meridian=oo;iT.geom.flat.geodesic.parallel=so;iT.geom.flat.inflate={};iT.geom.flat.inflate.inflateCoordinates=rn;iT.geom.flat.inflate.inflateCoordinatesArray=nn;iT.geom.flat.inflate.inflateMultiCoordinatesArray=on;iT.geom.flat.interiorpoint={};iT.geom.flat.interiorpoint.getInteriorPointOfArray=mn;iT.geom.flat.interiorpoint.getInteriorPointsOfMultiArray=xn;iT.geom.flat.interpolate={};iT.geom.flat.interpolate.interpolatePoint=$n;iT.geom.flat.interpolate.lineStringCoordinateAtM=to;iT.geom.flat.interpolate.lineStringsCoordinateAtM=eo;iT.geom.flat.intersectsextent={};iT.geom.flat.intersectsextent.intersectsLineString=Tn;iT.geom.flat.intersectsextent.intersectsLineStringArray=Sn;iT.geom.flat.intersectsextent.intersectsLinearRing=Cn;iT.geom.flat.intersectsextent.intersectsLinearRingArray=Rn;iT.geom.flat.intersectsextent.intersectsLinearRingMultiArray=In;iT.geom.flat.length={};iT.geom.flat.length.lineStringLength=io;iT.geom.flat.length.linearRingLength=function(t,e,i,r){var n=io(t,e,i,r),o=t[i-r]-t[e],s=t[i-r+1]-t[e+1];return n+=Math.sqrt(o*o+s*s)};iT.geom.flat.orient={};iT.geom.flat.orient.linearRingIsClockwise=Ln;iT.geom.flat.orient.linearRingIsOriented=On;iT.geom.flat.orient.linearRingsAreOriented=Pn;iT.geom.flat.orient.orientLinearRings=bn;iT.geom.flat.orient.orientLinearRingsArray=Mn;iT.geom.flat.reverse={};iT.geom.flat.reverse.coordinates=wn;iT.geom.flat.segments={};iT.geom.flat.segments.forEach=En;iT.geom.flat.simplify={};iT.geom.flat.simplify.douglasPeucker=sn;iT.geom.flat.simplify.douglasPeuckerArray=an;iT.geom.flat.simplify.douglasPeuckerMultiArray=function(t,e,i,r,n,o,s,a){for(var h=0,l=i.length;h<l;++h){var u=i[h],c=[];s=an(t,e,u,r,n,o,s,c);a.push(c);e=u[u.length-1]}return s};iT.geom.flat.simplify.quantize=un;iT.geom.flat.simplify.quantizeArray=cn;iT.geom.flat.simplify.quantizeMultiArray=pn;iT.geom.flat.simplify.radialDistance=hn;iT.geom.flat.simplify.simplifyLineString=function(t,e,i,r,n,o,s){var a=void 0!==s?s:[];if(!o){i=hn(t,e,i,r,n,a,0);t=a;e=0;r=2}a.length=sn(t,e,i,r,n,a,0);return a};iT.geom.flat.simplify.snap=ln;iT.geom.flat.straightchunk={};iT.geom.flat.straightchunk.matchingChunk=Lu;iT.geom.flat.textpath={};iT.geom.flat.textpath.drawTextOnPath=fu;iT.geom.flat.topology={};iT.geom.flat.topology.lineStringIsClosed=hp;iT.geom.flat.transform={};iT.geom.flat.transform.rotate=Et;iT.geom.flat.transform.scale=Tt;iT.geom.flat.transform.transform2D=It;iT.geom.flat.transform.translate=wt;iT.has={};iT.has.CANVAS_LINE_DASH=Pi;iT.has.DEVICE_PIXEL_RATIO=Oi;iT.has.FIREFOX=Ri;iT.has.GEOLOCATION=bi;iT.has.MAC=Li;iT.has.MSPOINTER=Ai;iT.has.POINTER=Fi;iT.has.SAFARI=Ii;iT.has.TOUCH=Mi;iT.has.WEBKIT=wi;iT.interaction={};iT.interaction.DoubleClickZoom=pa;iT.interaction.DragAndDrop=yh;iT.interaction.DragBox=Wa;iT.interaction.DragPan=Na;iT.interaction.DragRotate=ja;iT.interaction.DragRotateAndZoom=xh;iT.interaction.DragZoom=Ja;iT.interaction.Draw=hl;iT.interaction.Draw.createBox=function(){return function(t,e){var i=G(t),r=[[st(i),at(i),ft(i),dt(i),st(i)]],n=e;n?n.setCoordinates(r):n=new Fn(r);return n}};iT.interaction.Draw.createRegularPolygon=function(l,u){return function(t,e){var i=t[0],r=t[1],n=Math.sqrt(Zn(i,r)),o=e||Dn(new Ch(i),l),s=u;if(!u){var a=r[0]-i[0],h=r[1]-i[1];s=Math.atan(h/a)-(a<0?Math.PI:0)}Gn(o,i,n,s);return o}};iT.interaction.Draw.handleEvent=ll;iT.interaction.Extent=fl;iT.interaction.Interaction=oa;iT.interaction.Interaction.pan=sa;iT.interaction.Interaction.rotate=aa;iT.interaction.Interaction.rotateWithoutConstraints=ha;iT.interaction.Interaction.zoom=la;iT.interaction.Interaction.zoomByDelta=ua;iT.interaction.Interaction.zoomWithoutConstraints=ca;iT.interaction.KeyboardPan=th;iT.interaction.KeyboardZoom=ih;iT.interaction.Modify=Rl;iT.interaction.Modify.ModifyEvent=Cl;iT.interaction.MouseWheelZoom=oh;iT.interaction.MouseWheelZoom.Mode=nh;iT.interaction.PinchRotate=ah;iT.interaction.PinchZoom=ch;iT.interaction.Pointer=ba;iT.interaction.Pointer.centroid=Ma;iT.interaction.Pointer.handleEvent=Fa;iT.interaction.Property=na;iT.interaction.Select=Nl;iT.interaction.Snap=Gl;iT.interaction.Snap.handleEvent=kl;iT.interaction.Translate=Bl;iT.interaction.Translate.TranslateEvent=Yl;iT.interaction.defaults=Hl;iT.layer={};iT.layer.Base=Us;iT.layer.Group=Vs;iT.layer.Heatmap=xx;iT.layer.Image=Ex;iT.layer.Layer=qs;iT.layer.Layer.visibleAtResolution=Js;iT.layer.Property=js;iT.layer.Tile=Sx;iT.layer.TileProperty=Tx;iT.layer.Vector=bh;iT.layer.Vector.RenderType={IMAGE:"image",VECTOR:"vector"};iT.layer.VectorRenderType=Oh;iT.layer.VectorTile=Cx;iT.layer.VectorTile.RenderType={IMAGE:"image",HYBRID:"hybrid",VECTOR:"vector"};iT.layer.VectorTileRenderType=Xu;iT.loadingstrategy={};iT.loadingstrategy.all=Nh;iT.loadingstrategy.bbox=function(t,e){return[t]};iT.loadingstrategy.tile=function(s){return function(t,e){var i=s.getZForResolution(e),r=s.getTileRangeForExtentAndZ(t,i),n=[],o=[i,0,0];for(o[1]=r.minX;o[1]<=r.maxX;++o[1])for(o[2]=r.minY;o[2]<=r.maxY;++o[2])n.push(s.getTileCoordExtent(o));return n}};iT.math={};iT.math.clamp=Lt;iT.math.cosh=Ot;iT.math.lerp=Gt;iT.math.modulo=Dt;iT.math.roundUpToPowerOfTwo=Pt;iT.math.solveLinearSystem=Ft;iT.math.squaredDistance=Mt;iT.math.squaredSegmentDistance=bt;iT.math.toDegrees=At;iT.math.toRadians=Nt;iT.net={};iT.net.jsonp=Dx;iT.obj={};iT.obj.assign=T;iT.obj.clear=_;iT.obj.getValues=s;iT.obj.isEmpty=Ct;iT.pointer={};iT.pointer.EventSource=Mo;iT.pointer.EventType=bo;iT.pointer.MouseSource=Uo;iT.pointer.MouseSource.POINTER_ID=Fo;iT.pointer.MouseSource.POINTER_TYPE=Ao;iT.pointer.MsSource=Jo;iT.pointer.NativeSource=ss;iT.pointer.PointerEvent=hs;iT.pointer.PointerEventHandler=_s;iT.pointer.TouchSource=ds;iT.proj={};iT.proj.Projection=Wt;iT.proj.Units=Xt;iT.proj.Units.METERS_PER_UNIT=zt;iT.proj.addCommon=Oe;iT.proj.addCoordinateTransforms=Se;iT.proj.addEquivalentProjections=me;iT.proj.addEquivalentTransforms=xe;iT.proj.addProjection=_e;iT.proj.addProjections=ge;iT.proj.clearAllProjections=function(){se();ue()};iT.proj.cloneTransform=de;iT.proj.createProjection=Ee;iT.proj.createTransformFromCoordinateTransform=Te;iT.proj.epsg3857={};iT.proj.epsg3857.EXTENT=Zt;iT.proj.epsg3857.HALF_SIZE=Kt;iT.proj.epsg3857.PROJECTIONS=Qt;iT.proj.epsg3857.RADIUS=Ht;iT.proj.epsg3857.WORLD_EXTENT=qt;iT.proj.epsg3857.fromEPSG4326=$t;iT.proj.epsg3857.toEPSG4326=te;iT.proj.epsg4326={};iT.proj.epsg4326.EXTENT=ee;iT.proj.epsg4326.METERS_PER_UNIT=ie;iT.proj.epsg4326.PROJECTIONS=ne;iT.proj.epsg4326.RADIUS=6378137;iT.proj.equivalent=Ce;iT.proj.fromLonLat=function(t,e){return we(t,"EPSG:4326",void 0!==e?e:"EPSG:3857")};iT.proj.get=ye;iT.proj.getPointResolution=ve;iT.proj.getTransform=Ie;iT.proj.getTransformFromProjections=Re;iT.proj.identityTransform=fe;iT.proj.proj4={};iT.proj.proj4.register=function(t){var e,i,r=Object.keys(t.defs),n=r.length;for(e=0;e<n;++e){var o=r[e];if(!ye(o)){var s=t.defs(o);_e(new Wt({code:o,axisOrientation:s.axis,metersPerUnit:s.to_meter,units:s.units}))}}for(e=0;e<n;++e){var a=r[e],h=ye(a);for(i=0;i<n;++i){var l=r[i],u=ye(l);if(!pe(a,l))if(t.defs[a]===t.defs[l])me([h,u]);else{var c=t(a,l);Se(h,u,c.forward,c.inverse)}}}};iT.proj.projections={};iT.proj.projections.add=he;iT.proj.projections.clear=se;iT.proj.projections.get=ae;iT.proj.toLonLat=function(t,e){var i=we(t,void 0!==e?e:"EPSG:3857","EPSG:4326"),r=i[0];(r<-180||180<r)&&(i[0]=Dt(r+180,360)-180);return i};iT.proj.transform=we;iT.proj.transformExtent=Le;iT.proj.transformWithProjections=function(t,e,i){return Re(e,i)(t)};iT.proj.transforms={};iT.proj.transforms.add=ce;iT.proj.transforms.clear=ue;iT.proj.transforms.get=pe;iT.proj.transforms.remove=function(t,e){var i=t.getCode(),r=e.getCode(),n=le[i][r];delete le[i][r];Ct(le[i])&&delete le[i];return n};iT.render={};iT.render.Box=Va;iT.render.Event=Kl;iT.render.EventType=ao;iT.render.Feature=Sy;iT.render.ReplayGroup=pu;iT.render.ReplayType=du;iT.render.VectorContext=Zl;iT.render.canvas={};iT.render.canvas.ImageReplay=Ru;iT.render.canvas.Immediate=ql;iT.render.canvas.Instruction=_u;iT.render.canvas.Instruction.beginPathInstruction=vu;iT.render.canvas.Instruction.closePathInstruction=mu;iT.render.canvas.Instruction.fillInstruction=gu;iT.render.canvas.Instruction.strokeInstruction=yu;iT.render.canvas.LineStringReplay=Iu;iT.render.canvas.PolygonReplay=wu;iT.render.canvas.Replay=Cu;iT.render.canvas.ReplayGroup=Mu;iT.render.canvas.ReplayGroup.getCircleArray=Nu;iT.render.canvas.ReplayGroup.replayDeclutter=Du;iT.render.canvas.TextReplay=Ou;iT.render.canvas.TextReplay.measureTextWidths=Pu;iT.render.canvas.checkFont=rr;iT.render.canvas.checkedFonts=tr;iT.render.canvas.defaultFillStyle=zi;iT.render.canvas.defaultFont=Xi;iT.render.canvas.defaultLineCap=Wi;iT.render.canvas.defaultLineDash=Hi;iT.render.canvas.defaultLineDashOffset=0;iT.render.canvas.defaultLineJoin=Ki;iT.render.canvas.defaultLineWidth=1;iT.render.canvas.defaultMiterLimit=10;iT.render.canvas.defaultPadding=Qi;iT.render.canvas.defaultStrokeStyle=Zi;iT.render.canvas.defaultTextAlign=qi;iT.render.canvas.defaultTextBaseline=Ji;iT.render.canvas.drawImage=cr;iT.render.canvas.labelCache=$i;iT.render.canvas.measureTextHeight=ar;iT.render.canvas.measureTextWidth=hr;iT.render.canvas.resetTransform=ur;iT.render.canvas.rotateAtOffset=lr;iT.render.canvas.textHeights=ir;iT.render.replay={};iT.render.replay.ORDER=xu;iT.render.replay.TEXT_ALIGN=Eu;iT.render.toContext=function(t,e){var i=t.canvas,r=e||{},n=r.pixelRatio||Oi,o=r.size;if(o){i.width=o[0]*n;i.height=o[1]*n;i.style.width=o[0]+"px";i.style.height=o[1]+"px"}var s=[0,0,i.width,i.height],a=ke([1,0,0,1,0,0],n,n);return new ql(t,n,s,a,0)};iT.render.webgl={};iT.render.webgl.CircleReplay=Jc;iT.render.webgl.DEFAULT_FILLSTYLE=Bc;iT.render.webgl.DEFAULT_FONT=Yc;iT.render.webgl.DEFAULT_LINECAP=Vc;iT.render.webgl.DEFAULT_LINEDASH=Xc;iT.render.webgl.DEFAULT_LINEDASHOFFSET=0;iT.render.webgl.DEFAULT_LINEJOIN=zc;iT.render.webgl.DEFAULT_LINEWIDTH=1;iT.render.webgl.DEFAULT_MITERLIMIT=10;iT.render.webgl.DEFAULT_STROKESTYLE=Wc;iT.render.webgl.DEFAULT_TEXTALIGN=.5;iT.render.webgl.DEFAULT_TEXTBASELINE=.5;iT.render.webgl.EPSILON=Hc;iT.render.webgl.ImageReplay=ap;iT.render.webgl.Immediate=Mp;iT.render.webgl.LineStringReplay=xp;iT.render.webgl.PolygonReplay=Rp;iT.render.webgl.Replay=Uc;iT.render.webgl.ReplayGroup=bp;iT.render.webgl.TextReplay=Lp;iT.render.webgl.TextureReplay=sp;iT.render.webgl.circlereplay={};iT.render.webgl.circlereplay.defaultshader={};iT.render.webgl.circlereplay.defaultshader.Locations=Gc;iT.render.webgl.circlereplay.defaultshader.fragment=Nc;iT.render.webgl.circlereplay.defaultshader.vertex=Dc;iT.render.webgl.linestringreplay={};iT.render.webgl.linestringreplay.defaultshader={};iT.render.webgl.linestringreplay.defaultshader.Locations=cp;iT.render.webgl.linestringreplay.defaultshader.fragment=lp;iT.render.webgl.linestringreplay.defaultshader.vertex=up;iT.render.webgl.polygonreplay={};iT.render.webgl.polygonreplay.defaultshader={};iT.render.webgl.polygonreplay.defaultshader.Locations=Sp;iT.render.webgl.polygonreplay.defaultshader.fragment=Ep;iT.render.webgl.polygonreplay.defaultshader.vertex=Tp;iT.render.webgl.texturereplay={};iT.render.webgl.texturereplay.defaultshader={};iT.render.webgl.texturereplay.defaultshader.Locations=tp;iT.render.webgl.texturereplay.defaultshader.fragment=Qc;iT.render.webgl.texturereplay.defaultshader.vertex=$c;iT.render.webgl.triangleIsCounterClockwise=Kc;iT.renderer={};iT.renderer.Layer=ou;iT.renderer.Map=tu;iT.renderer.Map.sortByZIndex=iu;iT.renderer.canvas={};iT.renderer.canvas.ImageLayer=hu;iT.renderer.canvas.IntermediateCanvas=au;iT.renderer.canvas.Layer=su;iT.renderer.canvas.Map=nu;iT.renderer.canvas.Map.layerRendererConstructors=ru;iT.renderer.canvas.TileLayer=cu;iT.renderer.canvas.VectorLayer=Vu;iT.renderer.canvas.VectorTileLayer=Hu;iT.renderer.vector={};iT.renderer.vector.defaultOrder=ju;iT.renderer.vector.getSquaredTolerance=Uu;iT.renderer.vector.getTolerance=Yu;iT.renderer.vector.renderFeature=Bu;iT.renderer.webgl={};iT.renderer.webgl.ImageLayer=Gp;iT.renderer.webgl.Layer=Dp;iT.renderer.webgl.Map=kp;iT.renderer.webgl.TileLayer=Bp;iT.renderer.webgl.VectorLayer=Vp;iT.renderer.webgl.defaultmapshader={};iT.renderer.webgl.defaultmapshader.Locations=Np;iT.renderer.webgl.defaultmapshader.fragment=Fp;iT.renderer.webgl.defaultmapshader.vertex=Ap;iT.renderer.webgl.tilelayershader={};iT.renderer.webgl.tilelayershader.Locations=Yp;iT.renderer.webgl.tilelayershader.fragment=jp;iT.renderer.webgl.tilelayershader.vertex=Up;iT.reproj={};iT.reproj.Image=Ox;iT.reproj.Tile=Px;iT.reproj.Triangulation=Lx;iT.reproj.calculateSourceResolution=Rx;iT.reproj.common={};iT.reproj.common.ENABLE_RASTER_REPROJECTION=!0;iT.reproj.common.ERROR_THRESHOLD=.5;iT.reproj.render=wx;iT.resolutionconstraint={};iT.resolutionconstraint.createSnapToPower=Is;iT.resolutionconstraint.createSnapToResolutions=Rs;iT.rotationconstraint={};iT.rotationconstraint.createSnapToN=Os;iT.rotationconstraint.createSnapToZero=Ps;iT.rotationconstraint.disable=ws;iT.rotationconstraint.none=Ls;iT.size={};iT.size.buffer=Xs;iT.size.hasArea=zs;iT.size.scale=Ws;iT.size.toSize=Hs;iT.source={};iT.source.BingMaps=Qx;iT.source.CartoDB=tE;iT.source.Cluster=eE;iT.source.Image=sE;iT.source.Image.defaultImageLoadFunction=aE;iT.source.ImageArcGISRest=lE;iT.source.ImageCanvas=uE;iT.source.ImageMapGuide=cE;iT.source.ImageStatic=pE;iT.source.ImageWMS=gE;iT.source.OSM=vE;iT.source.OSM.ATTRIBUTION=yE;iT.source.Raster=bE;iT.source.Source=Dh;iT.source.Stamen=kE;iT.source.State=Ys;iT.source.Tile=Wx;iT.source.Tile.TileSourceEvent=Hx;iT.source.TileArcGISRest=jE;iT.source.TileDebug=YE;iT.source.TileEventType=Kx;iT.source.TileImage=qx;iT.source.TileJSON=BE;iT.source.TileWMS=VE;iT.source.UTFGrid=zE;iT.source.UTFGrid.CustomTile=XE;iT.source.UrlTile=Zx;iT.source.Vector=rl;iT.source.Vector.VectorSourceEvent=il;iT.source.VectorEventType=Gh;iT.source.VectorTile=WE;iT.source.WMSServerType=fE;iT.source.WMTS=qE;iT.source.WMTS.optionsFromCapabilities=function(t,s){var e=Fr(t.Contents.Layer,function(t,e,i){return t.Identifier==s.layer});if(null===e)return null;var i,a=t.Contents.TileMatrixSet;(i=1<e.TileMatrixSetLink.length?Dr(e.TileMatrixSetLink,"projection"in s?function(e,t,i){var r=Fr(a,function(t){return t.Identifier==e.TileMatrixSet}).SupportedCRS,n=ye(r.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/,"$1:$3"))||ye(r),o=ye(s.projection);return n&&o?Ce(n,o):r==s.projection}:function(t,e,i){return t.TileMatrixSet==s.matrixSet}):0)<0&&(i=0);var r=e.TileMatrixSetLink[i].TileMatrixSet,n=e.TileMatrixSetLink[i].TileMatrixSetLimits,o=e.Format[0];"format"in s&&(o=s.format);(i=Dr(e.Style,function(t,e,i){return"style"in s?t.Title==s.style:t.isDefault}))<0&&(i=0);var h=e.Style[i].Identifier,l={};"Dimension"in e&&e.Dimension.forEach(function(t,e,i){var r=t.Identifier,n=t.Default;void 0===n&&(n=t.Value[0]);l[r]=n});var u,c=Fr(t.Contents.TileMatrixSet,function(t,e,i){return t.Identifier==r}),p=c.SupportedCRS;p&&(u=ye(p.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/,"$1:$3"))||ye(p));if("projection"in s){var d=ye(s.projection);d&&(u&&!Ce(d,u)||(u=d))}var f,_,g=e.WGS84BoundingBox;if(void 0!==g){var y=ye("EPSG:4326").getExtent();_=g[0]==y[0]&&g[2]==y[2];f=Le(g,"EPSG:4326",u);var v=u.getExtent();v&&(Q(v,f)||(f=void 0))}var m=ZE(c,f,n),x=[],E=s.requestEncoding;E=void 0!==E?E:"";if("OperationsMetadata"in t&&"GetTile"in t.OperationsMetadata)for(var T=t.OperationsMetadata.GetTile.DCP.HTTP.Get,S=0,C=T.length;S<C;++S)if(T[S].Constraint){var R=Fr(T[S].Constraint,function(t){return"GetEncoding"==t.name}).AllowedValues.Value;""===E&&(E=R[0]);if(E!==HE.KVP)break;Lr(R,HE.KVP)&&x.push(T[S].href)}else if(T[S].href){E=HE.KVP;x.push(T[S].href)}if(0===x.length){E=HE.REST;e.ResourceURL.forEach(function(t){if("tile"===t.resourceType){o=t.format;x.push(t.template)}})}return{urls:x,layer:s.layer,matrixSet:r,format:o,projection:u,requestEncoding:E,tileGrid:m,style:h,dimensions:l,wrapX:_,crossOrigin:s.crossOrigin}};iT.source.WMTSRequestEncoding=HE;iT.source.XYZ=$x;iT.source.Zoomify=eT;iT.source.Zoomify.CustomTile=tT;iT.source.common={};iT.source.common.DEFAULT_WMS_VERSION=dE;iT.sphere={};iT.sphere.DEFAULT_RADIUS=jt;iT.sphere.getArea=function t(e,i){var r=i||{},n=r.radius||jt,o=r.projection||"EPSG:3857",s=e.getType();s!==kt.GEOMETRY_COLLECTION&&(e=e.clone().transform(o,"EPSG:4326"));var a,h,l,u,c,p,d=0;switch(s){case kt.POINT:case kt.MULTI_POINT:case kt.LINE_STRING:case kt.MULTI_LINE_STRING:case kt.LINEAR_RING:break;case kt.POLYGON:a=e.getCoordinates();d=Math.abs(Bt(a[0],n));for(l=1,u=a.length;l<u;++l)d-=Math.abs(Bt(a[l],n));break;case kt.MULTI_POLYGON:for(l=0,u=(a=e.getCoordinates()).length;l<u;++l){h=a[l];d+=Math.abs(Bt(h[0],n));for(c=1,p=h.length;c<p;++c)d-=Math.abs(Bt(h[c],n))}break;case kt.GEOMETRY_COLLECTION:var f=e.getGeometries();for(l=0,u=f.length;l<u;++l)d+=t(f[l],i);break;default:throw new Error("Unsupported geometry type: "+s)}return d};iT.sphere.getDistance=Ut;iT.sphere.getLength=function t(e,i){var r=i||{},n=r.radius||jt,o=r.projection||"EPSG:3857",s=e.getType();s!==kt.GEOMETRY_COLLECTION&&(e=e.clone().transform(o,"EPSG:4326"));var a,h,l,u,c,p,d=0;switch(s){case kt.POINT:case kt.MULTI_POINT:break;case kt.LINE_STRING:case kt.LINEAR_RING:d=Yt(a=e.getCoordinates(),n);break;case kt.MULTI_LINE_STRING:case kt.POLYGON:for(l=0,u=(a=e.getCoordinates()).length;l<u;++l)d+=Yt(a[l],n);break;case kt.MULTI_POLYGON:for(l=0,u=(a=e.getCoordinates()).length;l<u;++l)for(c=0,p=(h=a[l]).length;c<p;++c)d+=Yt(h[c],n);break;case kt.GEOMETRY_COLLECTION:var f=e.getGeometries();for(l=0,u=f.length;l<u;++l)d+=t(f[l],i);break;default:throw new Error("Unsupported geometry type: "+s)}return d};iT.sphere.offset=Vt;iT.string={};iT.string.compareVersions=Un;iT.string.padNumber=jn;iT.structs={};iT.structs.LRUCache=Vi;iT.structs.LinkedList=Cp;iT.structs.PriorityQueue=ms;iT.structs.PriorityQueue.DROP=1/0;iT.structs.RBush=el;iT.style={};iT.style.Atlas=Ip;iT.style.AtlasManager=wp;iT.style.Circle=fr;iT.style.Fill=_r;iT.style.Icon=u_;iT.style.IconAnchorUnits=$f;iT.style.IconImage=t_;iT.style.IconImage.get=e_;iT.style.IconImageCache=Jl;iT.style.IconImageCache.shared=$l;iT.style.IconOrigin=l_;iT.style.Image=pr;iT.style.RegularShape=dr;iT.style.Stroke=gr;iT.style.Style=yr;iT.style.Style.createDefaultStyle=xr;iT.style.Style.createEditingStyle=Er;iT.style.Style.toFunction=vr;iT.style.Text=lo;iT.style.TextPlacement=ho;iT.tilecoord={};iT.tilecoord.createOrUpdate=ic;iT.tilecoord.fromKey=oc;iT.tilecoord.getKey=nc;iT.tilecoord.getKeyZXY=rc;iT.tilecoord.hash=sc;iT.tilecoord.quadKey=ac;iT.tilecoord.withinExtentAndZ=hc;iT.tilegrid={};iT.tilegrid.TileGrid=kx;iT.tilegrid.WMTS=KE;iT.tilegrid.WMTS.createFromCapabilitiesMatrixSet=ZE;iT.tilegrid.common={};iT.tilegrid.common.DEFAULT_MAX_ZOOM=Es;iT.tilegrid.common.DEFAULT_TILE_SIZE=Ts;iT.tilegrid.createForExtent=Yx;iT.tilegrid.createForProjection=Xx;iT.tilegrid.createXYZ=Bx;iT.tilegrid.extentFromProjection=zx;iT.tilegrid.getForProjection=jx;iT.tilegrid.wrapX=Ux;iT.tileurlfunction={};iT.tileurlfunction.createFromTemplate=bx;iT.tileurlfunction.createFromTemplates=Mx;iT.tileurlfunction.createFromTileUrlFunctions=Fx;iT.tileurlfunction.expandUrl=Nx;iT.tileurlfunction.nullTileUrlFunction=Ax;iT.transform={};iT.transform.apply=De;iT.transform.compose=Ue;iT.transform.create=be;iT.transform.determinant=Be;iT.transform.invert=Ye;iT.transform.multiply=Fe;iT.transform.reset=Me;iT.transform.rotate=Ge;iT.transform.scale=ke;iT.transform.set=Ae;iT.transform.setFromArray=Ne;iT.transform.translate=je;iT.uri={};iT.uri.appendParams=hE;iT.util={};iT.util.VERSION=r;iT.util.getUid=St;iT.util.inherits=function(t,e){t.prototype=Object.create(e.prototype);t.prototype.constructor=t};iT.vec={};iT.vec.mat4={};iT.vec.mat4.create=kc;iT.vec.mat4.fromTransform=jc;iT.webgl={};iT.webgl.ARRAY_BUFFER=hi;iT.webgl.BLEND=3042;iT.webgl.Buffer=qc;iT.webgl.CLAMP_TO_EDGE=_i;iT.webgl.COLOR_ATTACHMENT0=36064;iT.webgl.COLOR_BUFFER_BIT=16384;iT.webgl.COMPILE_STATUS=35713;iT.webgl.CULL_FACE=2884;iT.webgl.Context=ip;iT.webgl.Context.createEmptyTexture=np;iT.webgl.Context.createTexture=op;iT.webgl.ContextEventType=ep;iT.webgl.DEBUG=!0;iT.webgl.DEPTH_TEST=2929;iT.webgl.DYNAMIC_DRAW=35048;iT.webgl.ELEMENT_ARRAY_BUFFER=34963;iT.webgl.FLOAT=li;iT.webgl.FRAGMENT_SHADER=35632;iT.webgl.FRAMEBUFFER=gi;iT.webgl.Fragment=Fc;iT.webgl.LINEAR=ci;iT.webgl.LINK_STATUS=35714;iT.webgl.ONE=1;iT.webgl.ONE_MINUS_SRC_ALPHA=771;iT.webgl.RGBA=ui;iT.webgl.SCISSOR_TEST=3089;iT.webgl.SRC_ALPHA=770;iT.webgl.STATIC_DRAW=35044;iT.webgl.STENCIL_TEST=2960;iT.webgl.STREAM_DRAW=35040;iT.webgl.Shader=Mc;iT.webgl.TEXTURE0=33984;iT.webgl.TEXTURE_2D=fi;iT.webgl.TEXTURE_MAG_FILTER=10240;iT.webgl.TEXTURE_MIN_FILTER=10241;iT.webgl.TEXTURE_WRAP_S=pi;iT.webgl.TEXTURE_WRAP_T=di;iT.webgl.TRIANGLES=4;iT.webgl.TRIANGLE_STRIP=5;iT.webgl.UNSIGNED_BYTE=5121;iT.webgl.UNSIGNED_INT=5125;iT.webgl.UNSIGNED_SHORT=5123;iT.webgl.VERTEX_SHADER=35633;iT.webgl.Vertex=Ac;iT.webgl.getContext=vi;iT.xml={};iT.xml.DOCUMENT=sd;iT.xml.OBJECT_PROPERTY_NODE_FACTORY=Sd;iT.xml.XML_SCHEMA_INSTANCE_URI=ad;iT.xml.createElementNS=hd;iT.xml.getAllTextContent=ld;iT.xml.getAllTextContent_=ud;iT.xml.getAttributeNS=dd;iT.xml.isDocument=cd;iT.xml.isNode=pd;iT.xml.makeArrayExtender=_d;iT.xml.makeArrayPusher=gd;iT.xml.makeArraySerializer=Ed;iT.xml.makeChildAppender=xd;iT.xml.makeObjectPropertyPusher=vd;iT.xml.makeObjectPropertySetter=md;iT.xml.makeReplacer=yd;iT.xml.makeSequence=Cd;iT.xml.makeSimpleNodeFactory=Td;iT.xml.makeStructureNS=Rd;iT.xml.parse=fd;iT.xml.parseNode=Id;iT.xml.pushParseAndPop=wd;iT.xml.pushSerializeAndPop=Od;iT.xml.serialize=Ld}();
//# sourceMappingURL=ol.js.map
var olcs_unused_var =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.library.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/goog/asserts.js":
/*!*****************************!*\
  !*** ./src/goog/asserts.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  assert(condition) {
    console.assert(condition);
  },
  assertInstanceof(object, type) {
    console.assert(object instanceof type);
  },
  fail() {
    console.fail();
  },
  assertNumber(number) {
    console.assert(typeof number === 'number');
  }
});


/***/ }),

/***/ "./src/index.library.js":
/*!******************************!*\
  !*** ./src/index.library.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _olcs_OLCesium_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./olcs/OLCesium.js */ "./src/olcs/OLCesium.js");
/* harmony import */ var _olcs_AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./olcs/AbstractSynchronizer.js */ "./src/olcs/AbstractSynchronizer.js");
/* harmony import */ var _olcs_RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./olcs/RasterSynchronizer.js */ "./src/olcs/RasterSynchronizer.js");
/* harmony import */ var _olcs_VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./olcs/VectorSynchronizer.js */ "./src/olcs/VectorSynchronizer.js");
/* harmony import */ var _olcs_core_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./olcs/core.js */ "./src/olcs/core.js");
/* harmony import */ var _olcs_GaKmlSynchronizer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./olcs/GaKmlSynchronizer.js */ "./src/olcs/GaKmlSynchronizer.js");
/* harmony import */ var _olcs_GaRasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./olcs/GaRasterSynchronizer.js */ "./src/olcs/GaRasterSynchronizer.js");
/* harmony import */ var _olcs_GaTileset3dSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./olcs/GaTileset3dSynchronizer.js */ "./src/olcs/GaTileset3dSynchronizer.js");
/* harmony import */ var _olcs_GaVectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./olcs/GaVectorSynchronizer.js */ "./src/olcs/GaVectorSynchronizer.js");












/* harmony default export */ __webpack_exports__["default"] = (_olcs_OLCesium_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

// Using var for phantomJS
// eslint-disable-next-line no-var
var olcs = window['olcs'] = {};
olcs.OLCesium = _olcs_OLCesium_js__WEBPACK_IMPORTED_MODULE_0__["default"];
olcs.AbstractSynchronizer = _olcs_AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_1__["default"];
olcs.RasterSynchronizer = _olcs_RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_2__["default"];
olcs.VectorSynchronizer = _olcs_VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_3__["default"];
olcs.core = _olcs_core_js__WEBPACK_IMPORTED_MODULE_4__["default"];

olcs.GaKmlSynchronizer = _olcs_GaKmlSynchronizer_js__WEBPACK_IMPORTED_MODULE_5__["default"];
olcs.GaRasterSynchronizer = _olcs_GaRasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_6__["default"];
olcs.GaTileset3dSynchronizer = _olcs_GaTileset3dSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__["default"];
olcs.GaVectorSynchronizer = _olcs_GaVectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_8__["default"];


/***/ }),

/***/ "./src/olcs/AbstractSynchronizer.js":
/*!******************************************!*\
  !*** ./src/olcs/AbstractSynchronizer.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! goog/asserts.js */ "./src/goog/asserts.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/Observable.js */ "ol/Observable.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/layer/Group.js */ "ol/layer/Group.js");
/* harmony import */ var ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module olcs.AbstractSynchronizer
 */





var AbstractSynchronizer = function () {
  /**
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   * @template T
   * @abstract
   * @api
   */
  function AbstractSynchronizer(map, scene) {
    _classCallCheck(this, AbstractSynchronizer);

    /**
     * @type {!ol.Map}
     * @protected
     */
    this.map = map;

    /**
     * @type {ol.View}
     * @protected
     */
    this.view = map.getView();

    /**
     * @type {!Cesium.Scene}
     * @protected
     */
    this.scene = scene;

    /**
     * @type {ol.Collection.<ol.layer.Base>}
     * @protected
     */
    this.olLayers = map.getLayerGroup().getLayers();

    /**
     * @type {ol.layer.Group}
     */
    this.mapLayerGroup = map.getLayerGroup();

    /**
     * Map of OpenLayers layer ids (from getUid) to the Cesium ImageryLayers.
     * Null value means, that we are unable to create equivalent layers.
     * @type {Object.<string, ?Array.<T>>}
     * @protected
     */
    this.layerMap = {};

    /**
     * Map of listen keys for OpenLayers layer layers ids (from getUid).
     * @type {!Object.<string, Array<ol.EventsKey>>}
     * @protected
     */
    this.olLayerListenKeys = {};

    /**
     * Map of listen keys for OpenLayers layer groups ids (from getUid).
     * @type {!Object.<string, !Array.<ol.EventsKey>>}
     * @private
     */
    this.olGroupListenKeys_ = {};
  }

  /**
   * Destroy all and perform complete synchronization of the layers.
   * @api
   */


  AbstractSynchronizer.prototype.synchronize = function synchronize() {
    this.destroyAll();
    this.addLayers_(this.mapLayerGroup);
  };

  /**
   * Order counterparts using the same algorithm as the Openlayers renderer:
   * z-index then original sequence order.
   * @protected
   */


  AbstractSynchronizer.prototype.orderLayers = function orderLayers() {}
  // Ordering logics is handled in subclasses.


  /**
   * Add a layer hierarchy.
   * @param {ol.layer.Base} root
   * @private
   */
  ;

  AbstractSynchronizer.prototype.addLayers_ = function addLayers_(root) {
    var _this = this;

    /** @type {Array<olcsx.LayerWithParents>} */
    var fifo = [{
      layer: root,
      parents: []
    }];

    var _loop = function _loop() {
      var olLayerWithParents = fifo.splice(0, 1)[0];
      var olLayer = olLayerWithParents.layer;
      var olLayerId = Object(_util_js__WEBPACK_IMPORTED_MODULE_3__["getUid"])(olLayer).toString();
      _this.olLayerListenKeys[olLayerId] = [];
      goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__["default"].assert(!_this.layerMap[olLayerId]);

      var cesiumObjects = null;
      if (olLayer instanceof ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_2___default.a) {
        _this.listenForGroupChanges_(olLayer);
        if (olLayer !== _this.mapLayerGroup) {
          cesiumObjects = _this.createSingleLayerCounterparts(olLayerWithParents);
        }
        if (!cesiumObjects) {
          olLayer.getLayers().forEach(function (l) {
            if (l) {
              var newOlLayerWithParents = {
                layer: l,
                parents: olLayer === _this.mapLayerGroup ? [] : [olLayerWithParents.layer].concat(olLayerWithParents.parents)
              };
              fifo.push(newOlLayerWithParents);
            }
          });
        }
      } else {
        cesiumObjects = _this.createSingleLayerCounterparts(olLayerWithParents);
        if (!cesiumObjects) {
          // keep an eye on the layers that once failed to be added (might work when the layer is updated)
          // for example when a source is set after the layer is added to the map
          var layerId = olLayerId;
          var layerWithParents = olLayerWithParents;
          var onLayerChange = function onLayerChange(e) {
            var cesiumObjs = _this.createSingleLayerCounterparts(layerWithParents);
            if (cesiumObjs) {
              // unsubscribe event listener
              layerWithParents.layer.un('change', onLayerChange);
              _this.addCesiumObjects_(cesiumObjs, layerId, layerWithParents.layer);
              _this.orderLayers();
            }
          };
          _this.olLayerListenKeys[olLayerId].push(Object(_util_js__WEBPACK_IMPORTED_MODULE_3__["olcsListen"])(layerWithParents.layer, 'change', onLayerChange));
        }
      }
      // add Cesium layers
      if (cesiumObjects) {
        _this.addCesiumObjects_(cesiumObjects, olLayerId, olLayer);
      }
    };

    while (fifo.length > 0) {
      _loop();
    }

    this.orderLayers();
  };

  /**
   * Add Cesium objects.
   * @param {Array.<T>} cesiumObjects
   * @param {string} layerId
   * @param {ol.layer.Base} layer
   * @private
   */


  AbstractSynchronizer.prototype.addCesiumObjects_ = function addCesiumObjects_(cesiumObjects, layerId, layer) {
    var _this2 = this;

    this.layerMap[layerId] = cesiumObjects;
    this.olLayerListenKeys[layerId].push(Object(_util_js__WEBPACK_IMPORTED_MODULE_3__["olcsListen"])(layer, 'change:zIndex', function () {
      return _this2.orderLayers();
    }));
    cesiumObjects.forEach(function (cesiumObject) {
      _this2.addCesiumObject(cesiumObject);
    });
  };

  /**
   * Remove and destroy a single layer.
   * @param {ol.layer.Layer} layer
   * @return {boolean} counterpart destroyed
   * @private
   */


  AbstractSynchronizer.prototype.removeAndDestroySingleLayer_ = function removeAndDestroySingleLayer_(layer) {
    var _this3 = this;

    var uid = Object(_util_js__WEBPACK_IMPORTED_MODULE_3__["getUid"])(layer).toString();
    var counterparts = this.layerMap[uid];
    if (!!counterparts) {
      counterparts.forEach(function (counterpart) {
        _this3.removeSingleCesiumObject(counterpart, false);
        _this3.destroyCesiumObject(counterpart);
      });
      this.olLayerListenKeys[uid].forEach(ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__["unByKey"]);
      delete this.olLayerListenKeys[uid];
    }
    delete this.layerMap[uid];
    return !!counterparts;
  };

  /**
   * Unlisten a single layer group.
   * @param {ol.layer.Group} group
   * @private
   */


  AbstractSynchronizer.prototype.unlistenSingleGroup_ = function unlistenSingleGroup_(group) {
    if (group === this.mapLayerGroup) {
      return;
    }
    var uid = Object(_util_js__WEBPACK_IMPORTED_MODULE_3__["getUid"])(group).toString();
    var keys = this.olGroupListenKeys_[uid];
    keys.forEach(function (key) {
      Object(ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__["unByKey"])(key);
    });
    delete this.olGroupListenKeys_[uid];
    delete this.layerMap[uid];
  };

  /**
   * Remove layer hierarchy.
   * @param {ol.layer.Base} root
   * @private
   */


  AbstractSynchronizer.prototype.removeLayer_ = function removeLayer_(root) {
    var _this4 = this;

    if (!!root) {
      (function () {
        var fifo = [root];
        while (fifo.length > 0) {
          var _olLayer = fifo.splice(0, 1)[0];
          var done = _this4.removeAndDestroySingleLayer_(_olLayer);
          if (_olLayer instanceof ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_2___default.a) {
            _this4.unlistenSingleGroup_(_olLayer);
            if (!done) {
              // No counterpart for the group itself so removing
              // each of the child layers.
              _olLayer.getLayers().forEach(function (l) {
                fifo.push(l);
              });
            }
          }
        }
      })();
    }
  };

  /**
   * Register listeners for single layer group change.
   * @param {ol.layer.Group} group
   * @private
   */


  AbstractSynchronizer.prototype.listenForGroupChanges_ = function listenForGroupChanges_(group) {
    var uuid = Object(_util_js__WEBPACK_IMPORTED_MODULE_3__["getUid"])(group).toString();

    goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__["default"].assert(this.olGroupListenKeys_[uuid] === undefined);

    var listenKeyArray = [];
    this.olGroupListenKeys_[uuid] = listenKeyArray;

    // only the keys that need to be relistened when collection changes
    var contentKeys = [];
    var listenAddRemove = function () {
      var _this5 = this;

      var collection = group.getLayers();
      if (collection) {
        contentKeys = [collection.on('add', function (event) {
          _this5.addLayers_(event.element);
        }), collection.on('remove', function (event) {
          _this5.removeLayer_(event.element);
        })];
        listenKeyArray.push.apply(listenKeyArray, contentKeys);
      }
    }.bind(this);

    listenAddRemove();

    listenKeyArray.push(group.on('change:layers', function (e) {
      contentKeys.forEach(function (el) {
        var i = listenKeyArray.indexOf(el);
        if (i >= 0) {
          listenKeyArray.splice(i, 1);
        }
        Object(ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__["unByKey"])(el);
      });
      listenAddRemove();
    }));
  };

  /**
   * Destroys all the created Cesium objects.
   * @protected
   */


  AbstractSynchronizer.prototype.destroyAll = function destroyAll() {
    this.removeAllCesiumObjects(true); // destroy
    var objKey = void 0;
    for (objKey in this.olGroupListenKeys_) {
      var keys = this.olGroupListenKeys_[objKey];
      keys.forEach(ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__["unByKey"]);
    }
    for (objKey in this.olLayerListenKeys) {
      this.olLayerListenKeys[objKey].forEach(ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__["unByKey"]);
    }
    this.olGroupListenKeys_ = {};
    this.olLayerListenKeys = {};
    this.layerMap = {};
  };

  /**
   * Adds a single Cesium object to the collection.
   * @param {!T} object
   * @abstract
   * @protected
   */


  AbstractSynchronizer.prototype.addCesiumObject = function addCesiumObject(object) {};

  /**
   * @param {!T} object
   * @abstract
   * @protected
   */


  AbstractSynchronizer.prototype.destroyCesiumObject = function destroyCesiumObject(object) {};

  /**
   * Remove single Cesium object from the collection.
   * @param {!T} object
   * @param {boolean} destroy
   * @abstract
   * @protected
   */


  AbstractSynchronizer.prototype.removeSingleCesiumObject = function removeSingleCesiumObject(object, destroy) {};

  /**
   * Remove all Cesium objects from the collection.
   * @param {boolean} destroy
   * @abstract
   * @protected
   */


  AbstractSynchronizer.prototype.removeAllCesiumObjects = function removeAllCesiumObjects(destroy) {};

  /**
   * @param {olcsx.LayerWithParents} olLayerWithParents
   * @return {?Array.<T>}
   * @abstract
   * @protected
   */


  AbstractSynchronizer.prototype.createSingleLayerCounterparts = function createSingleLayerCounterparts(olLayerWithParents) {};

  return AbstractSynchronizer;
}();

/* harmony default export */ __webpack_exports__["default"] = (AbstractSynchronizer);

/***/ }),

/***/ "./src/olcs/AutoRenderLoop.js":
/*!************************************!*\
  !*** ./src/olcs/AutoRenderLoop.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module olcs.AutoRenderLoop
 */

var AutoRenderLoop = function () {
  /**
   * @constructor
   * @param {olcs.OLCesium} ol3d
   */
  function AutoRenderLoop(ol3d) {
    _classCallCheck(this, AutoRenderLoop);

    this.ol3d = ol3d;
    this.scene_ = ol3d.getCesiumScene();
    this.canvas_ = this.scene_.canvas;
    this._boundNotifyRepaintRequired = this.notifyRepaintRequired.bind(this);

    this.repaintEventNames_ = ['mousemove', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'touchmove', 'pointerdown', 'pointerup', 'pointermove', 'wheel'];

    this.enable();
  }

  /**
   * Enable.
   */


  AutoRenderLoop.prototype.enable = function enable() {
    this.scene_.requestRenderMode = true;
    for (var _iterator = this.repaintEventNames_, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var repaintKey = _ref;

      this.canvas_.addEventListener(repaintKey, this._boundNotifyRepaintRequired, false);
    }

    window.addEventListener('resize', this._boundNotifyRepaintRequired, false);

    // Listen for changes on the layer group
    this.ol3d.getOlMap().getLayerGroup().on('change', this._boundNotifyRepaintRequired);
  };

  /**
   * Disable.
   */


  AutoRenderLoop.prototype.disable = function disable() {
    for (var _iterator2 = this.repaintEventNames_, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var repaintKey = _ref2;

      this.canvas_.removeEventListener(repaintKey, this._boundNotifyRepaintRequired, false);
    }

    window.removeEventListener('resize', this._boundNotifyRepaintRequired, false);

    this.ol3d.getOlMap().getLayerGroup().un('change', this._boundNotifyRepaintRequired);
    this.scene_.requestRenderMode = false;
  };

  /**
   * Restart render loop.
   * Force a restart of the render loop.
   * @api
   */


  AutoRenderLoop.prototype.restartRenderLoop = function restartRenderLoop() {
    this.notifyRepaintRequired();
  };

  AutoRenderLoop.prototype.notifyRepaintRequired = function notifyRepaintRequired() {
    this.scene_.requestRender();
  };

  return AutoRenderLoop;
}();

/* harmony default export */ __webpack_exports__["default"] = (AutoRenderLoop);

/***/ }),

/***/ "./src/olcs/Camera.js":
/*!****************************!*\
  !*** ./src/olcs/Camera.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! goog/asserts.js */ "./src/goog/asserts.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/Observable.js */ "ol/Observable.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math.js */ "./src/olcs/math.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core.js */ "./src/olcs/core.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module olcs.Camera
 */







var Camera = function () {
  /**
   * This object takes care of additional 3d-specific properties of the view and
   * ensures proper synchronization with the underlying raw Cesium.Camera object.
   * @param {!Cesium.Scene} scene
   * @param {!ol.Map} map
   * @api
   */
  function Camera(scene, map) {
    var _this = this;

    _classCallCheck(this, Camera);

    /**
     * @type {!Cesium.Scene}
     * @private
     */
    this.scene_ = scene;

    /**
     * @type {!Cesium.Camera}
     * @private
     */
    this.cam_ = scene.camera;

    /**
     * @type {!ol.Map}
     * @private
     */
    this.map_ = map;

    /**
     * @type {?ol.View}
     * @private
     */
    this.view_ = null;

    /**
     * @type {?ol.EventsKey}
     * @private
     */
    this.viewListenKey_ = null;

    /**
     * @type {!ol.TransformFunction}
     * @private
     */
    this.toLonLat_ = Camera.identityProjection;

    /**
     * @type {!ol.TransformFunction}
     * @private
     */
    this.fromLonLat_ = Camera.identityProjection;

    /**
     * 0 -- topdown, PI/2 -- the horizon
     * @type {number}
     * @private
     */
    this.tilt_ = 0;

    /**
     * @type {number}
     * @private
     */
    this.distance_ = 0;

    /**
     * @type {?Cesium.Matrix4}
     * @private
     */
    this.lastCameraViewMatrix_ = null;

    /**
     * This is used to discard change events on view caused by updateView method.
     * @type {boolean}
     * @private
     */
    this.viewUpdateInProgress_ = false;

    this.map_.on('change:view', function (e) {
      _this.setView_(_this.map_.getView());
    });
    this.setView_(this.map_.getView());
  }

  /**
   * @param {Array.<number>} input Input coordinate array.
   * @param {Array.<number>=} opt_output Output array of coordinate values.
   * @param {number=} opt_dimension Dimension.
   * @return {Array.<number>} Input coordinate array (same array as input).
   */


  Camera.identityProjection = function identityProjection(input, opt_output, opt_dimension) {
    var dim = opt_dimension || input.length;
    if (opt_output) {
      for (var i = 0; i < dim; ++i) {
        opt_output[i] = input[i];
      }
    }
    return input;
  };

  /**
   * @param {?ol.View} view New view to use.
   * @private
   */


  Camera.prototype.setView_ = function setView_(view) {
    var _this2 = this;

    if (this.view_) {
      Object(ol_Observable_js__WEBPACK_IMPORTED_MODULE_1__["unByKey"])(this.viewListenKey_);
      this.viewListenKey_ = null;
    }

    this.view_ = view;
    if (view) {
      var toLonLat = ol_proj_js__WEBPACK_IMPORTED_MODULE_3__["getTransform"](view.getProjection(), 'EPSG:4326');
      var fromLonLat = ol_proj_js__WEBPACK_IMPORTED_MODULE_3__["getTransform"]('EPSG:4326', view.getProjection());
      goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__["default"].assert(toLonLat && fromLonLat);

      this.toLonLat_ = toLonLat;
      this.fromLonLat_ = fromLonLat;

      this.viewListenKey_ = view.on('propertychange', function (e) {
        return _this2.handleViewEvent_(e);
      });

      this.readFromView();
    } else {
      this.toLonLat_ = Camera.identityProjection;
      this.fromLonLat_ = Camera.identityProjection;
    }
  };

  /**
   * @param {?} e
   * @private
   */


  Camera.prototype.handleViewEvent_ = function handleViewEvent_(e) {
    if (!this.viewUpdateInProgress_) {
      this.readFromView();
    }
  };

  /**
   * @param {number} heading In radians.
   * @api
   */


  Camera.prototype.setHeading = function setHeading(heading) {
    if (!this.view_) {
      return;
    }

    this.view_.setRotation(heading);
  };

  /**
   * @return {number|undefined} Heading in radians.
   * @api
   */


  Camera.prototype.getHeading = function getHeading() {
    if (!this.view_) {
      return undefined;
    }
    var rotation = this.view_.getRotation();
    return rotation || 0;
  };

  /**
   * @param {number} tilt In radians.
   * @api
   */


  Camera.prototype.setTilt = function setTilt(tilt) {
    this.tilt_ = tilt;
    this.updateCamera_();
  };

  /**
   * @return {number} Tilt in radians.
   * @api
   */


  Camera.prototype.getTilt = function getTilt() {
    return this.tilt_;
  };

  /**
   * @param {number} distance In meters.
   * @api
   */


  Camera.prototype.setDistance = function setDistance(distance) {
    this.distance_ = distance;
    this.updateCamera_();
    this.updateView();
  };

  /**
   * @return {number} Distance in meters.
   * @api
   */


  Camera.prototype.getDistance = function getDistance() {
    return this.distance_;
  };

  /**
   * Shortcut for ol.View.setCenter().
   * @param {!ol.Coordinate} center Same projection as the ol.View.
   * @api
   */


  Camera.prototype.setCenter = function setCenter(center) {
    if (!this.view_) {
      return;
    }
    this.view_.setCenter(center);
  };

  /**
   * Shortcut for ol.View.getCenter().
   * @return {ol.Coordinate|undefined} Same projection as the ol.View.
   * @api
   */


  Camera.prototype.getCenter = function getCenter() {
    if (!this.view_) {
      return undefined;
    }
    return this.view_.getCenter();
  };

  /**
   * Sets the position of the camera.
   * @param {!ol.Coordinate} position Same projection as the ol.View.
   * @api
   */


  Camera.prototype.setPosition = function setPosition(position) {
    if (!this.toLonLat_) {
      return;
    }
    var ll = this.toLonLat_(position);
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__["default"].assert(ll);

    var carto = new Cesium.Cartographic(Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["toRadians"])(ll[0]), Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["toRadians"])(ll[1]), this.getAltitude());

    this.cam_.setView({
      destination: Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto)
    });
    this.updateView();
  };

  /**
   * Calculates position under the camera.
   * @return {!ol.Coordinate|undefined} Same projection as the ol.View.
   * @api
   */


  Camera.prototype.getPosition = function getPosition() {
    if (!this.fromLonLat_) {
      return undefined;
    }
    var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position);

    var pos = this.fromLonLat_([Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["toDegrees"])(carto.longitude), Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["toDegrees"])(carto.latitude)]);
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__["default"].assert(pos);
    return pos;
  };

  /**
   * @param {number} altitude In meters.
   * @api
   */


  Camera.prototype.setAltitude = function setAltitude(altitude) {
    var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position);
    carto.height = altitude;
    this.cam_.position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);

    this.updateView();
  };

  /**
   * @return {number} Altitude in meters.
   * @api
   */


  Camera.prototype.getAltitude = function getAltitude() {
    var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position);

    return carto.height;
  };

  /**
   * Updates the state of the underlying Cesium.Camera
   * according to the current values of the properties.
   * @private
   */


  Camera.prototype.updateCamera_ = function updateCamera_() {
    if (!this.view_ || !this.toLonLat_) {
      return;
    }
    var center = this.view_.getCenter();
    if (!center) {
      return;
    }
    var ll = this.toLonLat_(center);
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__["default"].assert(ll);

    var carto = new Cesium.Cartographic(Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["toRadians"])(ll[0]), Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["toRadians"])(ll[1]));
    if (this.scene_.globe) {
      var height = this.scene_.globe.getHeight(carto);
      carto.height = height || 0;
    }

    var destination = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);

    /** @type {Cesium.optionsOrientation} */
    var orientation = {
      pitch: this.tilt_ - Cesium.Math.PI_OVER_TWO,
      heading: -this.view_.getRotation(),
      roll: undefined
    };
    this.cam_.setView({
      destination: destination,
      orientation: orientation
    });

    this.cam_.moveBackward(this.distance_);

    this.checkCameraChange(true);
  };

  /**
   * Calculates the values of the properties from the current ol.View state.
   * @api
   */


  Camera.prototype.readFromView = function readFromView() {
    if (!this.view_ || !this.toLonLat_) {
      return;
    }
    var center = this.view_.getCenter();
    if (center === undefined || center === null) {
      return;
    }
    var ll = this.toLonLat_(center);
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__["default"].assert(ll);

    var resolution = this.view_.getResolution();
    this.distance_ = this.calcDistanceForResolution(resolution || 0, Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["toRadians"])(ll[1]));

    this.updateCamera_();
  };

  /**
   * Calculates the values of the properties from the current Cesium.Camera state.
   * Modifies the center, resolution and rotation properties of the view.
   * @api
   */


  Camera.prototype.updateView = function updateView() {
    if (!this.view_ || !this.fromLonLat_) {
      return;
    }
    this.viewUpdateInProgress_ = true;

    // target & distance
    var ellipsoid = Cesium.Ellipsoid.WGS84;
    var scene = this.scene_;
    var target = _core_js__WEBPACK_IMPORTED_MODULE_4__["default"].pickCenterPoint(scene);

    var bestTarget = target;
    if (!bestTarget) {
      //TODO: how to handle this properly ?
      var globe = scene.globe;
      var carto = this.cam_.positionCartographic.clone();
      var height = globe.getHeight(carto);
      carto.height = height || 0;
      bestTarget = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
    }
    this.distance_ = Cesium.Cartesian3.distance(bestTarget, this.cam_.position);
    var bestTargetCartographic = ellipsoid.cartesianToCartographic(bestTarget);
    this.view_.setCenter(this.fromLonLat_([Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["toDegrees"])(bestTargetCartographic.longitude), Object(_math_js__WEBPACK_IMPORTED_MODULE_2__["toDegrees"])(bestTargetCartographic.latitude)]));

    // resolution
    this.view_.setResolution(this.calcResolutionForDistance(this.distance_, bestTargetCartographic ? bestTargetCartographic.latitude : 0));

    /*
     * Since we are positioning the target, the values of heading and tilt
     * need to be calculated _at the target_.
     */
    if (target) {
      var pos = this.cam_.position;

      // normal to the ellipsoid at the target
      var targetNormal = new Cesium.Cartesian3();
      ellipsoid.geocentricSurfaceNormal(target, targetNormal);

      // vector from the target to the camera
      var targetToCamera = new Cesium.Cartesian3();
      Cesium.Cartesian3.subtract(pos, target, targetToCamera);
      Cesium.Cartesian3.normalize(targetToCamera, targetToCamera);

      // HEADING
      var up = this.cam_.up;
      var right = this.cam_.right;
      var normal = new Cesium.Cartesian3(-target.y, target.x, 0); // what is it?
      var heading = Cesium.Cartesian3.angleBetween(right, normal);
      var cross = Cesium.Cartesian3.cross(target, up, new Cesium.Cartesian3());
      var orientation = cross.z;

      this.view_.setRotation(orientation < 0 ? heading : -heading);

      // TILT
      var tiltAngle = Math.acos(Cesium.Cartesian3.dot(targetNormal, targetToCamera));
      this.tilt_ = isNaN(tiltAngle) ? 0 : tiltAngle;
    } else {
      // fallback when there is no target
      this.view_.setRotation(this.cam_.heading);
      this.tilt_ = -this.cam_.pitch + Math.PI / 2;
    }

    this.viewUpdateInProgress_ = false;
  };

  /**
   * Check if the underlying camera state has changed and ensure synchronization.
   * @param {boolean=} opt_dontSync Do not synchronize the view.
   */


  Camera.prototype.checkCameraChange = function checkCameraChange(opt_dontSync) {
    var old = this.lastCameraViewMatrix_;
    var current = this.cam_.viewMatrix;

    if (!old || !Cesium.Matrix4.equalsEpsilon(old, current, 1e-5)) {
      this.lastCameraViewMatrix_ = current.clone();
      if (opt_dontSync !== true) {
        this.updateView();
      }
    }
  };

  /**
   * calculate the distance between camera and centerpoint based on the resolution and latitude value
   * @param {number} resolution Number of map units per pixel.
   * @param {number} latitude Latitude in radians.
   * @return {number} The calculated distance.
   * @api
   */


  Camera.prototype.calcDistanceForResolution = function calcDistanceForResolution(resolution, latitude) {
    var canvas = this.scene_.canvas;
    var fovy = this.cam_.frustum.fovy; // vertical field of view
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_0__["default"].assert(!isNaN(fovy));
    var metersPerUnit = this.view_.getProjection().getMetersPerUnit();

    // number of "map units" visible in 2D (vertically)
    var visibleMapUnits = resolution * canvas.clientHeight;

    // The metersPerUnit does not take latitude into account, but it should
    // be lower with increasing latitude -- we have to compensate.
    // In 3D it is not possible to maintain the resolution at more than one point,
    // so it only makes sense to use the latitude of the "target" point.
    var relativeCircumference = Math.cos(Math.abs(latitude));

    // how many meters should be visible in 3D
    var visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;

    // distance required to view the calculated length in meters
    //
    //  fovy/2
    //    |\
    //  x | \
    //    |--\
    // visibleMeters/2
    var requiredDistance = visibleMeters / 2 / Math.tan(fovy / 2);

    // NOTE: This calculation is not absolutely precise, because metersPerUnit
    // is a great simplification. It does not take ellipsoid/terrain into account.

    return requiredDistance;
  };

  /**
   * calculate the resolution based on a distance(camera to position) and latitude value
   * @param {number} distance
   * @param {number} latitude
   * @return {number} The calculated resolution.
   * @api
   */


  Camera.prototype.calcResolutionForDistance = function calcResolutionForDistance(distance, latitude) {
    // See the reverse calculation (calcDistanceForResolution) for details
    var canvas = this.scene_.canvas;
    var fovy = this.cam_.frustum.fovy;
    var metersPerUnit = this.view_.getProjection().getMetersPerUnit();

    var visibleMeters = 2 * distance * Math.tan(fovy / 2);
    var relativeCircumference = Math.cos(Math.abs(latitude));
    var visibleMapUnits = visibleMeters / metersPerUnit / relativeCircumference;
    var resolution = visibleMapUnits / canvas.clientHeight;

    return resolution;
  };

  return Camera;
}();

/* harmony default export */ __webpack_exports__["default"] = (Camera);

/***/ }),

/***/ "./src/olcs/FeatureConverter.js":
/*!**************************************!*\
  !*** ./src/olcs/FeatureConverter.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/geom/Geometry.js */ "ol/geom/Geometry.js");
/* harmony import */ var ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_style_Icon_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/style/Icon.js */ "ol/style/Icon.js");
/* harmony import */ var ol_style_Icon_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_style_Icon_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/source/Vector.js */ "ol/source/Vector.js");
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/source/Cluster.js */ "ol/source/Cluster.js");
/* harmony import */ var ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ol_geom_Polygon_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/geom/Polygon.js */ "ol/geom/Polygon.js");
/* harmony import */ var ol_geom_Polygon_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ol_geom_Polygon_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! goog/asserts.js */ "./src/goog/asserts.js");
/* harmony import */ var ol_events_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/events.js */ "ol/events.js");
/* harmony import */ var ol_events_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ol_events_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ol_extent_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ol/extent.js */ "ol/extent.js");
/* harmony import */ var ol_extent_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ol_extent_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var ol_geom_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ol/geom/SimpleGeometry.js */ "ol/geom/SimpleGeometry.js");
/* harmony import */ var ol_geom_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(ol_geom_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core.js */ "./src/olcs/core.js");
/* harmony import */ var _core_VectorLayerCounterpart_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/VectorLayerCounterpart.js */ "./src/olcs/core/VectorLayerCounterpart.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module olcs.FeatureConverter
 */













var FeatureConverter = function () {
  /**
   * Concrete base class for converting from OpenLayers3 vectors to Cesium
   * primitives.
   * Extending this class is possible provided that the extending class and
   * the library are compiled together by the closure compiler.
   * @param {!Cesium.Scene} scene Cesium scene.
   * @constructor
   * @api
   */
  function FeatureConverter(scene) {
    _classCallCheck(this, FeatureConverter);

    /**
     * @protected
     */
    this.scene = scene;

    /**
     * Bind once to have a unique function for using as a listener
     * @type {function(ol.source.Vector.Event)}
     * @private
     */
    this.boundOnRemoveOrClearFeatureListener_ = this.onRemoveOrClearFeature_.bind(this);
  }

  /**
   * @param {ol.source.Vector.Event} evt
   * @private
   */


  FeatureConverter.prototype.onRemoveOrClearFeature_ = function onRemoveOrClearFeature_(evt) {
    var source = evt.target;
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assertInstanceof(source, ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2___default.a);

    var cancellers = _util_js__WEBPACK_IMPORTED_MODULE_11__["default"].obj(source)['olcs_cancellers'];
    if (cancellers) {
      var feature = evt.feature;
      if (feature) {
        // remove
        var id = Object(_util_js__WEBPACK_IMPORTED_MODULE_11__["getUid"])(feature);
        var canceller = cancellers[id];
        if (canceller) {
          canceller();
          delete cancellers[id];
        }
      } else {
        // clear
        for (var key in cancellers) {
          if (cancellers.hasOwnProperty(key)) {
            cancellers[key]();
          }
        }
        _util_js__WEBPACK_IMPORTED_MODULE_11__["default"].obj(source)['olcs_cancellers'] = {};
      }
    }
  };

  /**
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!Cesium.Primitive|Cesium.Label|Cesium.Billboard} primitive
   * @protected
   */


  FeatureConverter.prototype.setReferenceForPicking = function setReferenceForPicking(layer, feature, primitive) {
    primitive.olLayer = layer;
    primitive.olFeature = feature;
  };

  /**
   * Basics primitive creation using a color attribute.
   * Note that Cesium has 'interior' and outline geometries.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!ol.geom.Geometry} olGeometry OpenLayers geometry.
   * @param {!Cesium.Geometry} geometry
   * @param {!Cesium.Color} color
   * @param {number=} opt_lineWidth
   * @return {Cesium.Primitive}
   * @protected
   */


  FeatureConverter.prototype.createColoredPrimitive = function createColoredPrimitive(layer, feature, olGeometry, geometry, color, opt_lineWidth) {
    var createInstance = function createInstance(geometry, color) {
      return new Cesium.GeometryInstance({
        // always update Cesium externs before adding a property
        geometry: geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
        }
      });
    };

    var options = {
      // always update Cesium externs before adding a property
      flat: true, // work with all geometries
      renderState: {
        depthTest: {
          enabled: true
        }
      }
    };

    if (opt_lineWidth !== undefined) {
      if (!options.renderState) {
        options.renderState = {};
      }
      options.renderState.lineWidth = opt_lineWidth;
    }

    var instances = createInstance(geometry, color);

    var heightReference = this.getHeightReference(layer, feature, olGeometry);

    var primitive = void 0;

    if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
      var ctor = instances.geometry.constructor;
      if (ctor && !ctor['createShadowVolume']) {
        return null;
      }
      primitive = new Cesium.GroundPrimitive({
        // always update Cesium externs before adding a property
        geometryInstances: instances
      });
    } else {
      var appearance = new Cesium.PerInstanceColorAppearance(options);
      primitive = new Cesium.Primitive({
        // always update Cesium externs before adding a property
        geometryInstances: instances,
        appearance: appearance
      });
    }

    this.setReferenceForPicking(layer, feature, primitive);
    return primitive;
  };

  /**
   * Return the fill or stroke color from a plain ol style.
   * @param {!ol.style.Style|ol.style.Text} style
   * @param {boolean} outline
   * @return {!Cesium.Color}
   * @protected
   */


  FeatureConverter.prototype.extractColorFromOlStyle = function extractColorFromOlStyle(style, outline) {
    var fillColor = style.getFill() ? style.getFill().getColor() : null;
    var strokeColor = style.getStroke() ? style.getStroke().getColor() : null;

    var olColor = 'black';
    if (strokeColor && outline) {
      olColor = strokeColor;
    } else if (fillColor) {
      olColor = fillColor;
    }

    return _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].convertColorToCesium(olColor);
  };

  /**
   * Return the width of stroke from a plain ol style.
   * @param {!ol.style.Style|ol.style.Text} style
   * @return {number}
   * @protected
   */


  FeatureConverter.prototype.extractLineWidthFromOlStyle = function extractLineWidthFromOlStyle(style) {
    // Handling of line width WebGL limitations is handled by Cesium.
    var width = style.getStroke() ? style.getStroke().getWidth() : undefined;
    return width !== undefined ? width : 1;
  };

  /**
   * Create a primitive collection out of two Cesium geometries.
   * Only the OpenLayers style colors will be used.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!ol.geom.Geometry} olGeometry OpenLayers geometry.
   * @param {!Cesium.Geometry} fillGeometry
   * @param {!Cesium.Geometry} outlineGeometry
   * @param {!ol.style.Style} olStyle
   * @return {!Cesium.PrimitiveCollection}
   * @protected
   */


  FeatureConverter.prototype.wrapFillAndOutlineGeometries = function wrapFillAndOutlineGeometries(layer, feature, olGeometry, fillGeometry, outlineGeometry, olStyle) {
    var fillColor = this.extractColorFromOlStyle(olStyle, false);
    var outlineColor = this.extractColorFromOlStyle(olStyle, true);

    var primitives = new Cesium.PrimitiveCollection();
    if (olStyle.getFill()) {
      var p1 = this.createColoredPrimitive(layer, feature, olGeometry, fillGeometry, fillColor);
      goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assert(!!p1);
      primitives.add(p1);
    }

    if (olStyle.getStroke() && outlineGeometry) {
      var width = this.extractLineWidthFromOlStyle(olStyle);
      var p2 = this.createColoredPrimitive(layer, feature, olGeometry, outlineGeometry, outlineColor, width);
      if (p2) {
        // Some outline geometries are not supported by Cesium in clamp to ground
        // mode. These primitives are skipped.
        primitives.add(p2);
      }
    }

    return primitives;
  };

  // Geometry converters
  /**
   * Create a Cesium primitive if style has a text component.
   * Eventually return a PrimitiveCollection including current primitive.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Geometry} geometry
   * @param {!ol.style.Style} style
   * @param {!Cesium.Primitive} primitive current primitive
   * @return {!Cesium.PrimitiveCollection}
   * @protected
   */


  FeatureConverter.prototype.addTextStyle = function addTextStyle(layer, feature, geometry, style, primitive) {
    var primitives = void 0;
    if (!(primitive instanceof Cesium.PrimitiveCollection)) {
      primitives = new Cesium.PrimitiveCollection();
      primitives.add(primitive);
    } else {
      primitives = primitive;
    }

    if (!style.getText()) {
      return primitives;
    }

    var text = /** @type {!ol.style.Text} */style.getText();
    var label = this.olGeometry4326TextPartToCesium(layer, feature, geometry, text);
    if (label) {
      primitives.add(label);
    }
    return primitives;
  };

  /**
   * Add a billboard to a Cesium.BillboardCollection.
   * Overriding this wrapper allows manipulating the billboard options.
   * @param {!Cesium.BillboardCollection} billboards
   * @param {!Cesium.optionsBillboardCollectionAdd} bbOptions
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!ol.geom.Geometry} geometry
   * @param {!ol.style.Style} style
   * @return {!Cesium.Billboard} newly created billboard
   * @api
   */


  FeatureConverter.prototype.csAddBillboard = function csAddBillboard(billboards, bbOptions, layer, feature, geometry, style) {
    var bb = billboards.add(bbOptions);
    this.setReferenceForPicking(layer, feature, bb);
    return bb;
  };

  /**
   * Convert an OpenLayers circle geometry to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Circle} olGeometry OpenLayers circle geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} olStyle
   * @return {!Cesium.PrimitiveCollection} primitives
   * @api
   */


  FeatureConverter.prototype.olCircleGeometryToCesium = function olCircleGeometryToCesium(layer, feature, olGeometry, projection, olStyle) {
    var _this = this;

    olGeometry = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].olGeometryCloneTo4326(olGeometry, projection);
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assert(olGeometry.getType() == 'Circle');

    // ol.Coordinate
    var center = olGeometry.getCenter();
    var height = center.length == 3 ? center[2] : 0.0;
    var point = center.slice();
    point[0] += olGeometry.getRadius();

    // Cesium
    center = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].ol4326CoordinateToCesiumCartesian(center);
    point = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].ol4326CoordinateToCesiumCartesian(point);

    // Accurate computation of straight distance
    var radius = Cesium.Cartesian3.distance(center, point);

    var fillGeometry = new Cesium.CircleGeometry({
      // always update Cesium externs before adding a property
      center: center,
      radius: radius,
      height: height
    });

    var outlinePrimitive = void 0,
        outlineGeometry = void 0;
    if (this.getHeightReference(layer, feature, olGeometry) === Cesium.HeightReference.CLAMP_TO_GROUND) {
      var width = this.extractLineWidthFromOlStyle(olStyle);
      if (width) {
        var circlePolygon = Object(ol_geom_Polygon_js__WEBPACK_IMPORTED_MODULE_4__["circular"])(olGeometry.getCenter(), radius);
        var positions = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].ol4326CoordinateArrayToCsCartesians(circlePolygon.getLinearRing(0).getCoordinates());
        if (!Cesium.GroundPolylinePrimitive.isSupported(this.scene)) {
          var color = this.extractColorFromOlStyle(olStyle, true);
          outlinePrimitive = this.createStackedGroundCorridors(layer, feature, width, color, positions);
        } else {
          outlinePrimitive = new Cesium.GroundPolylinePrimitive({
            geometryInstances: new Cesium.GeometryInstance({
              geometry: new Cesium.GroundPolylineGeometry({ positions: positions, width: width })
            }),
            appearance: new Cesium.PolylineMaterialAppearance({
              material: this.olStyleToCesium(feature, olStyle, true)
            }),
            classificationType: Cesium.ClassificationType.TERRAIN
          });
          outlinePrimitive.readyPromise.then(function () {
            _this.setReferenceForPicking(layer, feature, outlinePrimitive._primitive);
          });
        }
      }
    } else {
      outlineGeometry = new Cesium.CircleOutlineGeometry({
        // always update Cesium externs before adding a property
        center: center,
        radius: radius,
        extrudedHeight: height,
        height: height
      });
    }

    var primitives = this.wrapFillAndOutlineGeometries(layer, feature, olGeometry, fillGeometry, outlineGeometry, olStyle);

    if (outlinePrimitive) {
      primitives.add(outlinePrimitive);
    }
    return this.addTextStyle(layer, feature, olGeometry, olStyle, primitives);
  };

  /**
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!number} width The width of the line.
   * @param {!Cesium.Color} color The color of the line.
   * @param {!Array<Cesium.Cartesian3>|Array<Array<Cesium.Cartesian3>>} positions The vertices of the line(s).
   * @return {!Cesium.GroundPrimitive} primitive
   */


  FeatureConverter.prototype.createStackedGroundCorridors = function createStackedGroundCorridors(layer, feature, width, color, positions) {
    // Convert positions to an Array if it isn't
    if (!Array.isArray(positions[0])) {
      positions = [positions];
    }
    width = Math.max(3, width); // A <3px width is too small for ground primitives
    var geometryInstances = [];
    var previousDistance = 0;
    // A stack of ground lines with increasing width (in meters) are created.
    // Only one of these lines is displayed at any time giving a feeling of continuity.
    // The values for the distance and width factor are more or less arbitrary.
    // Applications can override this logics by subclassing the FeatureConverter class.
    var _arr = [1000, 4000, 16000, 64000, 254000, 1000000, 10000000];
    for (var _i = 0; _i < _arr.length; _i++) {
      var distance = _arr[_i];
      width *= 2.14;
      var geometryOptions = {
        // always update Cesium externs before adding a property
        width: width,
        vertexFormat: Cesium.VertexFormat.POSITION_ONLY
      };
      for (var _iterator = positions, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i2 >= _iterator.length) break;
          _ref = _iterator[_i2++];
        } else {
          _i2 = _iterator.next();
          if (_i2.done) break;
          _ref = _i2.value;
        }

        var linePositions = _ref;

        geometryOptions.positions = linePositions;
        geometryInstances.push(new Cesium.GeometryInstance({
          geometry: new Cesium.CorridorGeometry(geometryOptions),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
            distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(previousDistance, distance - 1)
          }
        }));
      }
      previousDistance = distance;
    }
    return new Cesium.GroundPrimitive({
      // always update Cesium externs before adding a property
      geometryInstances: geometryInstances
    });
  };

  /**
   * Convert an OpenLayers line string geometry to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.LineString} olGeometry OpenLayers line string geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} olStyle
   * @return {!Cesium.PrimitiveCollection} primitives
   * @api
   */


  FeatureConverter.prototype.olLineStringGeometryToCesium = function olLineStringGeometryToCesium(layer, feature, olGeometry, projection, olStyle) {
    var _this2 = this;

    olGeometry = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].olGeometryCloneTo4326(olGeometry, projection);
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assert(olGeometry.getType() == 'LineString');

    var positions = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].ol4326CoordinateArrayToCsCartesians(olGeometry.getCoordinates());
    var width = this.extractLineWidthFromOlStyle(olStyle);

    var outlinePrimitive = void 0;
    var heightReference = this.getHeightReference(layer, feature, olGeometry);

    if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND && !Cesium.GroundPolylinePrimitive.isSupported(this.scene)) {
      var color = this.extractColorFromOlStyle(olStyle, true);
      outlinePrimitive = this.createStackedGroundCorridors(layer, feature, width, color, positions);
    } else {
      var appearance = new Cesium.PolylineMaterialAppearance({
        // always update Cesium externs before adding a property
        material: this.olStyleToCesium(feature, olStyle, true)
      });
      var geometryOptions = {
        // always update Cesium externs before adding a property
        positions: positions,
        width: width
      };
      var primitiveOptions = {
        // always update Cesium externs before adding a property
        appearance: appearance
      };
      if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
        var geometry = new Cesium.GroundPolylineGeometry(geometryOptions);
        primitiveOptions.geometryInstances = new Cesium.GeometryInstance({
          geometry: geometry
        }), outlinePrimitive = new Cesium.GroundPolylinePrimitive(primitiveOptions);
        outlinePrimitive.readyPromise.then(function () {
          _this2.setReferenceForPicking(layer, feature, outlinePrimitive._primitive);
        });
      } else {
        geometryOptions.vertexFormat = appearance.vertexFormat;
        var _geometry = new Cesium.PolylineGeometry(geometryOptions);
        primitiveOptions.geometryInstances = new Cesium.GeometryInstance({
          geometry: _geometry
        }), outlinePrimitive = new Cesium.Primitive(primitiveOptions);
      }
    }

    this.setReferenceForPicking(layer, feature, outlinePrimitive);

    return this.addTextStyle(layer, feature, olGeometry, olStyle, outlinePrimitive);
  };

  /**
   * Convert an OpenLayers polygon geometry to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Polygon} olGeometry OpenLayers polygon geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} olStyle
   * @return {!Cesium.PrimitiveCollection} primitives
   * @api
   */


  FeatureConverter.prototype.olPolygonGeometryToCesium = function olPolygonGeometryToCesium(layer, feature, olGeometry, projection, olStyle) {
    var _this3 = this;

    olGeometry = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].olGeometryCloneTo4326(olGeometry, projection);
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assert(olGeometry.getType() == 'Polygon');

    var heightReference = this.getHeightReference(layer, feature, olGeometry);

    var fillGeometry = void 0,
        outlineGeometry = void 0,
        outlinePrimitive = void 0;
    if (olGeometry.getCoordinates()[0].length == 5 && feature.getGeometry().get('olcs.polygon_kind') === 'rectangle') {
      // Create a rectangle according to the longitude and latitude curves
      var coordinates = olGeometry.getCoordinates()[0];
      // Extract the West, South, East, North coordinates
      var extent = ol_extent_js__WEBPACK_IMPORTED_MODULE_7__["boundingExtent"](coordinates);
      var rectangle = Cesium.Rectangle.fromDegrees(extent[0], extent[1], extent[2], extent[3]);

      // Extract the average height of the vertices
      var maxHeight = 0.0;
      if (coordinates[0].length == 3) {
        for (var c = 0; c < coordinates.length; c++) {
          maxHeight = Math.max(maxHeight, coordinates[c][2]);
        }
      }

      // Render the cartographic rectangle
      fillGeometry = new Cesium.RectangleGeometry({
        ellipsoid: Cesium.Ellipsoid.WGS84,
        rectangle: rectangle,
        height: maxHeight
      });

      outlineGeometry = new Cesium.RectangleOutlineGeometry({
        ellipsoid: Cesium.Ellipsoid.WGS84,
        rectangle: rectangle,
        height: maxHeight
      });
    } else {
      var rings = olGeometry.getLinearRings();
      // always update Cesium externs before adding a property
      var hierarchy = {};
      var polygonHierarchy = hierarchy;
      goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assert(rings.length > 0);

      for (var i = 0; i < rings.length; ++i) {
        var olPos = rings[i].getCoordinates();
        var positions = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].ol4326CoordinateArrayToCsCartesians(olPos);
        goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assert(positions && positions.length > 0);
        if (i == 0) {
          hierarchy.positions = positions;
        } else {
          if (!hierarchy.holes) {
            hierarchy.holes = [];
          }
          hierarchy.holes.push({
            positions: positions
          });
        }
      }

      fillGeometry = new Cesium.PolygonGeometry({
        // always update Cesium externs before adding a property
        polygonHierarchy: polygonHierarchy,
        perPositionHeight: true
      });

      // Since Cesium doesn't yet support Polygon outlines on terrain yet (coming soon...?)
      // we don't create an outline geometry if clamped, but instead do the polyline method
      // for each ring. Most of this code should be removeable when Cesium adds
      // support for Polygon outlines on terrain.
      if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
        var width = this.extractLineWidthFromOlStyle(olStyle);
        if (width > 0) {
          var _positions = [hierarchy.positions];
          if (hierarchy.holes) {
            for (var _i3 = 0; _i3 < hierarchy.holes.length; ++_i3) {
              _positions.push(hierarchy.holes[_i3].positions);
            }
          }
          if (!Cesium.GroundPolylinePrimitive.isSupported(this.scene)) {
            var color = this.extractColorFromOlStyle(olStyle, true);
            outlinePrimitive = this.createStackedGroundCorridors(layer, feature, width, color, _positions);
          } else {
            var appearance = new Cesium.PolylineMaterialAppearance({
              // always update Cesium externs before adding a property
              material: this.olStyleToCesium(feature, olStyle, true)
            });
            var geometryInstances = [];
            for (var _iterator2 = _positions, _isArray2 = Array.isArray(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
              var _ref2;

              if (_isArray2) {
                if (_i4 >= _iterator2.length) break;
                _ref2 = _iterator2[_i4++];
              } else {
                _i4 = _iterator2.next();
                if (_i4.done) break;
                _ref2 = _i4.value;
              }

              var linePositions = _ref2;

              var polylineGeometry = new Cesium.GroundPolylineGeometry({ positions: linePositions, width: width });
              geometryInstances.push(new Cesium.GeometryInstance({
                geometry: polylineGeometry
              }));
            }
            var primitiveOptions = {
              // always update Cesium externs before adding a property
              appearance: appearance,
              geometryInstances: geometryInstances
            };
            outlinePrimitive = new Cesium.GroundPolylinePrimitive(primitiveOptions);
            outlinePrimitive.readyPromise.then(function () {
              _this3.setReferenceForPicking(layer, feature, outlinePrimitive._primitive);
            });
          }
        }
      } else {
        // Actually do the normal polygon thing. This should end the removable
        // section of code described above.
        outlineGeometry = new Cesium.PolygonOutlineGeometry({
          // always update Cesium externs before adding a property
          polygonHierarchy: hierarchy,
          perPositionHeight: true
        });
      }
    }

    var primitives = this.wrapFillAndOutlineGeometries(layer, feature, olGeometry, fillGeometry, outlineGeometry, olStyle);

    if (outlinePrimitive) {
      primitives.add(outlinePrimitive);
    }

    return this.addTextStyle(layer, feature, olGeometry, olStyle, primitives);
  };

  /**
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Geometry} geometry
   * @return {!Cesium.HeightReference}
   * @api
   */


  FeatureConverter.prototype.getHeightReference = function getHeightReference(layer, feature, geometry) {

    // Read from the geometry
    var altitudeMode = geometry.get('altitudeMode');

    // Or from the feature
    if (altitudeMode === undefined) {
      altitudeMode = feature.get('altitudeMode');
    }

    // Or from the layer
    if (altitudeMode === undefined) {
      altitudeMode = layer.get('altitudeMode');
    }

    var heightReference = Cesium.HeightReference.NONE;
    if (altitudeMode === 'clampToGround') {
      heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
    } else if (altitudeMode === 'relativeToGround') {
      heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
    }

    return heightReference;
  };

  /**
   * Convert a point geometry to a Cesium BillboardCollection.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Point} olGeometry OpenLayers point geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} style
   * @param {!ol.style.Image} imageStyle
   * @param {!Cesium.BillboardCollection} billboards
   * @param {function(!Cesium.Billboard)=} opt_newBillboardCallback Called when the new billboard is added.
   * @api
   */


  FeatureConverter.prototype.createBillboardFromImage = function createBillboardFromImage(layer, feature, olGeometry, projection, style, imageStyle, billboards, opt_newBillboardCallback) {

    if (imageStyle instanceof ol_style_Icon_js__WEBPACK_IMPORTED_MODULE_1___default.a) {
      // make sure the image is scheduled for load
      imageStyle.load();
    }

    var image = imageStyle.getImage(1); // get normal density
    var isImageLoaded = function isImageLoaded(image) {
      return image.src != '' && image.naturalHeight != 0 && image.naturalWidth != 0 && image.complete;
    };
    var reallyCreateBillboard = function () {
      if (!image) {
        return;
      }
      if (!(image instanceof HTMLCanvasElement || image instanceof Image || image instanceof HTMLImageElement)) {
        return;
      }
      var center = olGeometry.getCoordinates();
      var position = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].ol4326CoordinateToCesiumCartesian(center);
      var color = void 0;
      var opacity = imageStyle.getOpacity();
      if (opacity !== undefined) {
        color = new Cesium.Color(1.0, 1.0, 1.0, opacity);
      }

      var heightReference = this.getHeightReference(layer, feature, olGeometry);

      var bbOptions = /** @type {Cesium.optionsBillboardCollectionAdd} */{
        // always update Cesium externs before adding a property
        image: image,
        color: color,
        scale: imageStyle.getScale(),
        heightReference: heightReference,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        position: position
      };
      var bb = this.csAddBillboard(billboards, bbOptions, layer, feature, olGeometry, style);
      if (opt_newBillboardCallback) {
        opt_newBillboardCallback(bb);
      }
    }.bind(this);

    if (image instanceof Image && !isImageLoaded(image)) {
      // Cesium requires the image to be loaded
      var cancelled = false;
      var source = layer.getSource();
      var canceller = function canceller() {
        cancelled = true;
      };
      source.on(['removefeature', 'clear'], this.boundOnRemoveOrClearFeatureListener_);
      var cancellers = _util_js__WEBPACK_IMPORTED_MODULE_11__["default"].obj(source)['olcs_cancellers'];
      if (!cancellers) {
        cancellers = _util_js__WEBPACK_IMPORTED_MODULE_11__["default"].obj(source)['olcs_cancellers'] = {};
      }

      var fuid = Object(_util_js__WEBPACK_IMPORTED_MODULE_11__["getUid"])(feature);
      if (cancellers[fuid]) {
        // When the feature change quickly, a canceller may still be present so
        // we cancel it here to prevent creation of a billboard.
        cancellers[fuid]();
      }
      cancellers[fuid] = canceller;

      var listener = function listener() {
        if (!billboards.isDestroyed() && !cancelled) {
          // Create billboard if the feature is still displayed on the map.
          reallyCreateBillboard();
        }
      };

      ol_events_js__WEBPACK_IMPORTED_MODULE_6__["listenOnce"](image, 'load', listener);
    } else {
      reallyCreateBillboard();
    }
  };

  /**
   * Convert a point geometry to a Cesium BillboardCollection.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Point} olGeometry OpenLayers point geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} style
   * @param {!Cesium.BillboardCollection} billboards
   * @param {function(!Cesium.Billboard)=} opt_newBillboardCallback Called when
   * the new billboard is added.
   * @return {Cesium.Primitive} primitives
   * @api
   */


  FeatureConverter.prototype.olPointGeometryToCesium = function olPointGeometryToCesium(layer, feature, olGeometry, projection, style, billboards, opt_newBillboardCallback) {
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assert(olGeometry.getType() == 'Point');
    olGeometry = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].olGeometryCloneTo4326(olGeometry, projection);

    var modelPrimitive = null;
    var imageStyle = style.getImage();
    if (imageStyle) {
      var olcsModelFunction = /** @type {function():olcsx.ModelStyle} */olGeometry.get('olcs_model') || feature.get('olcs_model');
      if (olcsModelFunction) {
        var olcsModel = olcsModelFunction();
        var options = /** @type {Cesium.ModelFromGltfOptions} */Object.assign({}, { scene: this.scene }, olcsModel.cesiumOptions);
        var model = Cesium.Model.fromGltf(options);
        modelPrimitive = new Cesium.PrimitiveCollection();
        modelPrimitive.add(model);
        if (olcsModel.debugModelMatrix) {
          modelPrimitive.add(new Cesium.DebugModelMatrixPrimitive({
            modelMatrix: olcsModel.debugModelMatrix
          }));
        }
      } else {
        this.createBillboardFromImage(layer, feature, olGeometry, projection, style, imageStyle, billboards, opt_newBillboardCallback);
      }
    }

    if (style.getText()) {
      return this.addTextStyle(layer, feature, olGeometry, style, modelPrimitive || new Cesium.Primitive());
    } else {
      return modelPrimitive;
    }
  };

  /**
   * Convert an OpenLayers multi-something geometry to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Geometry} geometry OpenLayers geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} olStyle
   * @param {!Cesium.BillboardCollection} billboards
   * @param {function(!Cesium.Billboard)=} opt_newBillboardCallback Called when
   * the new billboard is added.
   * @return {Cesium.Primitive} primitives
   * @api
   */


  FeatureConverter.prototype.olMultiGeometryToCesium = function olMultiGeometryToCesium(layer, feature, geometry, projection, olStyle, billboards, opt_newBillboardCallback) {
    var _this4 = this;

    // Do not reproject to 4326 now because it will be done later.

    // FIXME: would be better to combine all child geometries in one primitive
    // instead we create n primitives for simplicity.
    var accumulate = function accumulate(geometries, functor) {
      var primitives = new Cesium.PrimitiveCollection();
      geometries.forEach(function (geometry) {
        primitives.add(functor(layer, feature, geometry, projection, olStyle));
      });
      return primitives;
    };

    var subgeos = void 0;
    switch (geometry.getType()) {
      case 'MultiPoint':
        geometry = /** @type {!ol.geom.MultiPoint} */geometry;
        subgeos = geometry.getPoints();
        if (olStyle.getText()) {
          var primitives = new Cesium.PrimitiveCollection();
          subgeos.forEach(function (geometry) {
            goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assert(geometry);
            var result = _this4.olPointGeometryToCesium(layer, feature, geometry, projection, olStyle, billboards, opt_newBillboardCallback);
            if (result) {
              primitives.add(result);
            }
          });
          return primitives;
        } else {
          subgeos.forEach(function (geometry) {
            goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assert(geometry);
            _this4.olPointGeometryToCesium(layer, feature, geometry, projection, olStyle, billboards, opt_newBillboardCallback);
          });
          return null;
        }
      case 'MultiLineString':
        geometry = /** @type {!ol.geom.MultiLineString} */geometry;
        subgeos = geometry.getLineStrings();
        return accumulate(subgeos, this.olLineStringGeometryToCesium.bind(this));
      case 'MultiPolygon':
        geometry = /** @type {!ol.geom.MultiPolygon} */geometry;
        subgeos = geometry.getPolygons();
        return accumulate(subgeos, this.olPolygonGeometryToCesium.bind(this));
      default:
        goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].fail('Unhandled multi geometry type' + geometry.getType());
    }
  };

  /**
   * Convert an OpenLayers text style to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Geometry} geometry
   * @param {!ol.style.Text} style
   * @return {Cesium.LabelCollection} Cesium primitive
   * @api
   */


  FeatureConverter.prototype.olGeometry4326TextPartToCesium = function olGeometry4326TextPartToCesium(layer, feature, geometry, style) {
    var text = style.getText();
    if (!text) {
      return null;
    }

    var labels = new Cesium.LabelCollection({ scene: this.scene });
    // TODO: export and use the text draw position from OpenLayers .
    // See src/ol/render/vector.js
    var extentCenter = ol_extent_js__WEBPACK_IMPORTED_MODULE_7__["getCenter"](geometry.getExtent());
    if (geometry instanceof ol_geom_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_8___default.a) {
      var first = geometry.getFirstCoordinate();
      extentCenter[2] = first.length == 3 ? first[2] : 0.0;
    }
    var options = /** @type {Cesium.optionsLabelCollection} */{};

    options.position = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].ol4326CoordinateToCesiumCartesian(extentCenter);

    options.text = text;

    options.heightReference = this.getHeightReference(layer, feature, geometry);

    var offsetX = style.getOffsetX();
    var offsetY = style.getOffsetY();
    if (offsetX != 0 && offsetY != 0) {
      var offset = new Cesium.Cartesian2(offsetX, offsetY);
      options.pixelOffset = offset;
    }

    options.font = style.getFont() || '10px sans-serif'; // OpenLayers default

    var labelStyle = undefined;
    if (style.getFill()) {
      options.fillColor = this.extractColorFromOlStyle(style, false);
      labelStyle = Cesium.LabelStyle.FILL;
    }
    if (style.getStroke()) {
      options.outlineWidth = this.extractLineWidthFromOlStyle(style);
      options.outlineColor = this.extractColorFromOlStyle(style, true);
      labelStyle = Cesium.LabelStyle.OUTLINE;
    }
    if (style.getFill() && style.getStroke()) {
      labelStyle = Cesium.LabelStyle.FILL_AND_OUTLINE;
    }
    options.style = labelStyle;

    var horizontalOrigin = void 0;
    switch (style.getTextAlign()) {
      case 'left':
        horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
        break;
      case 'right':
        horizontalOrigin = Cesium.HorizontalOrigin.RIGHT;
        break;
      case 'center':
      default:
        horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
    }
    options.horizontalOrigin = horizontalOrigin;

    if (style.getTextBaseline()) {
      var verticalOrigin = void 0;
      switch (style.getTextBaseline()) {
        case 'top':
          verticalOrigin = Cesium.VerticalOrigin.TOP;
          break;
        case 'middle':
          verticalOrigin = Cesium.VerticalOrigin.CENTER;
          break;
        case 'bottom':
          verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
          break;
        case 'alphabetic':
          verticalOrigin = Cesium.VerticalOrigin.TOP;
          break;
        case 'hanging':
          verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
          break;
        default:
          goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].fail('unhandled baseline ' + style.getTextBaseline());
      }
      options.verticalOrigin = verticalOrigin;
    }

    var l = labels.add(options);
    this.setReferenceForPicking(layer, feature, l);
    return labels;
  };

  /**
   * Convert an OpenLayers style to a Cesium Material.
   * @param {ol.Feature} feature OpenLayers feature..
   * @param {!ol.style.Style} style
   * @param {boolean} outline
   * @return {Cesium.Material}
   * @api
   */


  FeatureConverter.prototype.olStyleToCesium = function olStyleToCesium(feature, style, outline) {
    var fill = style.getFill();
    var stroke = style.getStroke();
    if (outline && !stroke || !outline && !fill) {
      return null; // FIXME use a default style? Developer error?
    }

    var color = outline ? stroke.getColor() : fill.getColor();
    color = _core_js__WEBPACK_IMPORTED_MODULE_9__["default"].convertColorToCesium(color);

    if (outline && stroke.getLineDash()) {
      return Cesium.Material.fromType('Stripe', {
        // always update Cesium externs before adding a property
        horizontal: false,
        repeat: 500, // TODO how to calculate this?
        evenColor: color,
        oddColor: new Cesium.Color(0, 0, 0, 0) // transparent
      });
    } else {
      return Cesium.Material.fromType('Color', {
        // always update Cesium externs before adding a property
        color: color
      });
    }
  };

  /**
   * Compute OpenLayers plain style.
   * Evaluates style function, blend arrays, get default style.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature
   * @param {ol.StyleFunction|undefined} fallbackStyleFunction
   * @param {number} resolution
   * @return {Array.<!ol.style.Style>} null if no style is available
   * @api
   */


  FeatureConverter.prototype.computePlainStyle = function computePlainStyle(layer, feature, fallbackStyleFunction, resolution) {
    /**
     * @type {ol.FeatureStyleFunction|undefined}
     */
    var featureStyleFunction = feature.getStyleFunction();

    /**
     * @type {ol.style.Style|Array.<ol.style.Style>}
     */
    var style = null;

    if (featureStyleFunction) {
      style = featureStyleFunction.call(feature, resolution);
    }

    if (!style && fallbackStyleFunction) {
      style = fallbackStyleFunction(feature, resolution);
    }

    if (!style) {
      // The feature must not be displayed
      return null;
    }

    // FIXME combine materials as in cesium-materials-pack?
    // then this function must return a custom material
    // More simply, could blend the colors like described in
    // http://en.wikipedia.org/wiki/Alpha_compositing
    return Array.isArray(style) ? style : [style];
  };

  /**
   * @protected
   * @param {!ol.Feature} feature
   * @param {!ol.style.Style} style
   * @param {!ol.geom.Geometry=} opt_geom Geometry to be converted.
   * @return {ol.geom.Geometry|undefined}
   */


  FeatureConverter.prototype.getGeometryFromFeature = function getGeometryFromFeature(feature, style, opt_geom) {
    if (opt_geom) {
      return opt_geom;
    }

    var geom3d = /** @type {!ol.geom.Geometry} */feature.get('olcs.3d_geometry');
    if (geom3d && geom3d instanceof ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0___default.a) {
      return geom3d;
    }

    if (style) {
      var geomFuncRes = style.getGeometryFunction()(feature);
      if (geomFuncRes instanceof ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0___default.a) {
        return geomFuncRes;
      }
    }

    return feature.getGeometry();
  };

  /**
   * Convert one OpenLayers feature up to a collection of Cesium primitives.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!ol.style.Style} style
   * @param {!olcsx.core.OlFeatureToCesiumContext} context
   * @param {!ol.geom.Geometry=} opt_geom Geometry to be converted.
   * @return {Cesium.Primitive} primitives
   * @api
   */


  FeatureConverter.prototype.olFeatureToCesium = function olFeatureToCesium(layer, feature, style, context, opt_geom) {
    var _this5 = this;

    var geom = this.getGeometryFromFeature(feature, style, opt_geom);

    if (!geom) {
      // OpenLayers features may not have a geometry
      // See http://geojson.org/geojson-spec.html#feature-objects
      return null;
    }

    var proj = context.projection;
    var newBillboardAddedCallback = function newBillboardAddedCallback(bb) {
      var featureBb = context.featureToCesiumMap[Object(_util_js__WEBPACK_IMPORTED_MODULE_11__["getUid"])(feature)];
      if (featureBb instanceof Array) {
        featureBb.push(bb);
      } else {
        context.featureToCesiumMap[Object(_util_js__WEBPACK_IMPORTED_MODULE_11__["getUid"])(feature)] = [bb];
      }
    };

    switch (geom.getType()) {
      case 'GeometryCollection':
        var primitives = new Cesium.PrimitiveCollection();
        var collection = /** @type {!ol.geom.GeometryCollection} */geom;
        // TODO: use getGeometriesArray() instead
        collection.getGeometries().forEach(function (geom) {
          if (geom) {
            var prims = _this5.olFeatureToCesium(layer, feature, style, context, geom);
            if (prims) {
              primitives.add(prims);
            }
          }
        });
        return primitives;
      case 'Point':
        geom = /** @type {!ol.geom.Point} */geom;
        var bbs = context.billboards;
        var result = this.olPointGeometryToCesium(layer, feature, geom, proj, style, bbs, newBillboardAddedCallback);
        if (!result) {
          // no wrapping primitive
          return null;
        } else {
          return result;
        }
      case 'Circle':
        geom = /** @type {!ol.geom.Circle} */geom;
        return this.olCircleGeometryToCesium(layer, feature, geom, proj, style);
      case 'LineString':
        geom = /** @type {!ol.geom.LineString} */geom;
        return this.olLineStringGeometryToCesium(layer, feature, geom, proj, style);
      case 'Polygon':
        geom = /** @type {!ol.geom.Polygon} */geom;
        return this.olPolygonGeometryToCesium(layer, feature, geom, proj, style);
      case 'MultiPoint':
      case 'MultiLineString':
      case 'MultiPolygon':
        var result2 = this.olMultiGeometryToCesium(layer, feature, geom, proj, style, context.billboards, newBillboardAddedCallback);
        if (!result2) {
          // no wrapping primitive
          return null;
        } else {
          return result2;
        }
      case 'LinearRing':
        throw new Error('LinearRing should only be part of polygon.');
      default:
        throw new Error('Ol geom type not handled : ' + geom.getType());
    }
  };

  /**
   * Convert an OpenLayers vector layer to Cesium primitive collection.
   * For each feature, the associated primitive will be stored in
   * `featurePrimitiveMap`.
   * @param {!(ol.layer.Vector|ol.layer.Image)} olLayer
   * @param {!ol.View} olView
   * @param {!Object.<number, !Cesium.Primitive>} featurePrimitiveMap
   * @return {!olcs.core.VectorLayerCounterpart}
   * @api
   */


  FeatureConverter.prototype.olVectorLayerToCesium = function olVectorLayerToCesium(olLayer, olView, featurePrimitiveMap) {
    var proj = olView.getProjection();
    var resolution = olView.getResolution();

    if (resolution === undefined || !proj) {
      goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].fail('View not ready');
      // an assertion is not enough for closure to assume resolution and proj
      // are defined
      throw new Error('View not ready');
    }

    var source = olLayer.getSource();
    if (source instanceof ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_3___default.a) {
      source = source.getSource();
    }

    goog_asserts_js__WEBPACK_IMPORTED_MODULE_5__["default"].assertInstanceof(source, ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2___default.a);
    var features = source.getFeatures();
    var counterpart = new _core_VectorLayerCounterpart_js__WEBPACK_IMPORTED_MODULE_10__["default"](proj, this.scene);
    var context = counterpart.context;
    for (var i = 0; i < features.length; ++i) {
      var feature = features[i];
      if (!feature) {
        continue;
      }
      /**
       * @type {ol.StyleFunction|undefined}
       */
      var layerStyle = olLayer.getStyleFunction();
      var styles = this.computePlainStyle(olLayer, feature, layerStyle, resolution);
      if (!styles || !styles.length) {
        // only 'render' features with a style
        continue;
      }

      /**
       * @type {Cesium.Primitive|null}
       */
      var primitives = null;
      for (var _i5 = 0; _i5 < styles.length; _i5++) {
        var prims = this.olFeatureToCesium(olLayer, feature, styles[_i5], context);
        if (prims) {
          if (!primitives) {
            primitives = prims;
          } else if (prims) {
            var _i6 = 0,
                prim = void 0;
            while (prim = prims.get(_i6)) {
              primitives.add(prim);
              _i6++;
            }
          }
        }
      }
      if (!primitives) {
        continue;
      }
      featurePrimitiveMap[Object(_util_js__WEBPACK_IMPORTED_MODULE_11__["getUid"])(feature)] = primitives;
      counterpart.getRootPrimitive().add(primitives);
    }

    return counterpart;
  };

  /**
   * Convert an OpenLayers feature to Cesium primitive collection.
   * @param {!(ol.layer.Vector|ol.layer.Image)} layer
   * @param {!ol.View} view
   * @param {!ol.Feature} feature
   * @param {!olcsx.core.OlFeatureToCesiumContext} context
   * @return {Cesium.Primitive}
   * @api
   */


  FeatureConverter.prototype.convert = function convert(layer, view, feature, context) {
    var proj = view.getProjection();
    var resolution = view.getResolution();

    if (resolution == undefined || !proj) {
      return null;
    }

    /**
     * @type {ol.StyleFunction|undefined}
     */
    var layerStyle = layer.getStyleFunction();

    var styles = this.computePlainStyle(layer, feature, layerStyle, resolution);

    if (!styles.length) {
      // only 'render' features with a style
      return null;
    }

    context.projection = proj;

    /**
     * @type {Cesium.Primitive|null}
     */
    var primitives = null;
    for (var i = 0; i < styles.length; i++) {
      var prims = this.olFeatureToCesium(layer, feature, styles[i], context);
      if (!primitives) {
        primitives = prims;
      } else if (prims) {
        var _i7 = 0,
            prim = void 0;
        while (prim = prims.get(_i7)) {
          primitives.add(prim);
          _i7++;
        }
      }
    }
    return primitives;
  };

  return FeatureConverter;
}();

/* harmony default export */ __webpack_exports__["default"] = (FeatureConverter);

/***/ }),

/***/ "./src/olcs/GaKmlSynchronizer.js":
/*!***************************************!*\
  !*** ./src/olcs/GaKmlSynchronizer.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/layer/Layer.js */ "ol/layer/Layer.js");
/* harmony import */ var ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/layer/Vector.js */ "ol/layer/Vector.js");
/* harmony import */ var ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var _AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AbstractSynchronizer.js */ "./src/olcs/AbstractSynchronizer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module olcs.GaKmlSynchronizer
 */





var exports = function (_olcsAbstractSynchron) {
  _inherits(exports, _olcsAbstractSynchron);

  /**
   * Unidirectionally synchronize geoadmin kml layers to Cesium.
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   * @param {!Cesium.DataSourceCollection} dataSources
   */
  function exports(map, scene, dataSources) {
    _classCallCheck(this, exports);

    /**
     * @protected
     */
    var _this = _possibleConstructorReturn(this, _olcsAbstractSynchron.call(this, map, scene));

    _this.dataSources_ = dataSources;
    return _this;
  }

  exports.prototype.createSingleLayerCounterparts = function createSingleLayerCounterparts(olLayerWithParents) {

    var dsP = void 0;
    var layer = olLayerWithParents.layer;
    var factory = layer['getCesiumDataSource'];

    if (factory) {
      dsP = factory(this.scene);
    }

    if (!dsP) {

      /** @type {string} */
      var id = layer.id;

      /** @type {string} */
      var url = layer.url;

      if (!(layer instanceof ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_0___default.a) || !id || !/^KML/.test(id) || !url || /:\/\/public\./.test(url)) {
        return null;
      }

      /** @type {string|Document} */
      var loadParam = url;

      /** @type {string} */
      var kml = '' + (layer.getSource().get('rawData') || '');
      if (kml) {
        loadParam = new DOMParser().parseFromString(kml, 'text/xml');
      }
      dsP = Cesium.KmlDataSource.load(loadParam, {
        camera: this.scene.camera,
        canvas: this.scene.canvas,
        clampToGround: true
      });
    }
    var that = this;
    dsP.then(function (ds) {
      var _that$olLayerListenKe;

      ds.show = layer.getVisible();
      var uid = Object(_util_js__WEBPACK_IMPORTED_MODULE_2__["getUid"])(layer).toString();
      var listenKeyArray = [];
      listenKeyArray.push(layer.on('change:visible', function (evt) {
        ds.show = evt.target.getVisible();
      }));
      (_that$olLayerListenKe = that.olLayerListenKeys[uid]).push.apply(_that$olLayerListenKe, listenKeyArray);

      // Add link between OL and Cesium features.
      if (layer instanceof ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_1___default.a) {
        layer.getSource().getFeatures().forEach(function (feature) {
          if (ds.entities.getById) {
            var entity = ds.entities.getById(feature.getId());
            if (entity) {
              entity['olFeature'] = feature;
              entity['olLayer'] = layer;
            }
          }
        });
      }
    });

    return [dsP];
  };

  exports.prototype.addCesiumObject = function addCesiumObject(dsP) {
    this.dataSources_.add(dsP);
  };

  /**
   * @inheritDoc
   */


  exports.prototype.destroyCesiumObject = function destroyCesiumObject(dsP) {
    var that = this;
    dsP.then(function (ds) {
      that.dataSources_.remove(ds, true);
    });
  };

  /**
   * @inheritDoc
   */


  exports.prototype.removeSingleCesiumObject = function removeSingleCesiumObject(dsP, destroy) {
    var that = this;
    dsP.then(function (ds) {
      that.dataSources_.remove(ds, destroy);
    });
  };

  /**
   * @inheritDoc
   */


  exports.prototype.removeAllCesiumObjects = function removeAllCesiumObjects(destroy) {
    this.dataSources_.removeAll(destroy);
  };

  return exports;
}(_AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_3__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (exports);

/***/ }),

/***/ "./src/olcs/GaRasterSynchronizer.js":
/*!******************************************!*\
  !*** ./src/olcs/GaRasterSynchronizer.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/layer/Layer.js */ "ol/layer/Layer.js");
/* harmony import */ var ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/source/Vector.js */ "ol/source/Vector.js");
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RasterSynchronizer.js */ "./src/olcs/RasterSynchronizer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module olcs.GaRasterSynchronizer
 */




var exports = function (_olcsRasterSynchroniz) {
  _inherits(exports, _olcsRasterSynchroniz);

  function exports() {
    _classCallCheck(this, exports);

    return _possibleConstructorReturn(this, _olcsRasterSynchroniz.apply(this, arguments));
  }

  /**
   * @override
   */
  exports.prototype.convertLayerToCesiumImageries = function convertLayerToCesiumImageries(olLayer, viewProj) {

    if (olLayer instanceof ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_0___default.a) {
      var source = olLayer.getSource();
      if (source instanceof ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_1___default.a) {
        return null;
      }
    }

    /**
     * @type {Cesium.ImageryProvider}
     */
    var provider = null;

    // Read custom, non standard properties
    var factory = olLayer['getCesiumImageryProvider'];
    if (!factory) {
      // root layer group
      return null;
    }
    provider = factory();
    if (!provider) {
      return null;
    }

    // the provider is always non-null if we got this far

    var providers = Array.isArray(provider) ? provider : [provider];
    return providers.map(function (p) {
      return new Cesium.ImageryLayer(p);
    });
  };

  return exports;
}(_RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (exports);

/***/ }),

/***/ "./src/olcs/GaTileset3dSynchronizer.js":
/*!*********************************************!*\
  !*** ./src/olcs/GaTileset3dSynchronizer.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var _AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractSynchronizer.js */ "./src/olcs/AbstractSynchronizer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module olcs.GaTileset3dSynchronizer
 */



var exports = function (_olcsAbstractSynchron) {
  _inherits(exports, _olcsAbstractSynchron);

  /**
   * Unidirectionally synchronize geoadmin kml layers to Cesium.
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   */
  function exports(map, scene) {
    _classCallCheck(this, exports);

    /**
     * @protected
     */
    var _this = _possibleConstructorReturn(this, _olcsAbstractSynchron.call(this, map, scene));

    _this.primitives_ = new Cesium.PrimitiveCollection();
    scene.primitives.add(_this.primitives_);
    return _this;
  }

  exports.prototype.createSingleLayerCounterparts = function createSingleLayerCounterparts(olLayerWithParents) {
    var prim = void 0;
    var layer = olLayerWithParents.layer;
    var factory = layer['getCesiumTileset3d'];

    if (factory) {
      prim = factory(this.scene);
    }

    if (!prim) {
      return null;
    }
    if (prim) {
      var _olLayerListenKeys$ui;

      prim.show = layer.getVisible();
      var uid = Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["getUid"])(layer).toString();
      var listenKeyArray = [];
      listenKeyArray.push(layer.on(['change:visible'], function (e) {
        prim.show = layer.getVisible();
      }));
      (_olLayerListenKeys$ui = this.olLayerListenKeys[uid]).push.apply(_olLayerListenKeys$ui, listenKeyArray);
    }

    return [prim];
  };

  exports.prototype.addCesiumObject = function addCesiumObject(prim) {
    if (!this.primitives_.contains(prim)) {
      this.primitives_.add(prim);
    }
  };

  exports.prototype.destroyCesiumObject = function destroyCesiumObject(prim) {
    if (this.primitives_.contains(prim)) {
      this.primitives_.remove(prim);
    }
  };

  exports.prototype.removeSingleCesiumObject = function removeSingleCesiumObject(prim, destroy) {
    if (this.primitives_.contains(prim)) {
      this.primitives_.remove(prim);
    }
  };

  exports.prototype.removeAllCesiumObjects = function removeAllCesiumObjects(destroy) {
    this.primitives_.removeAll();
  };

  return exports;
}(_AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (exports);

/***/ }),

/***/ "./src/olcs/GaVectorSynchronizer.js":
/*!******************************************!*\
  !*** ./src/olcs/GaVectorSynchronizer.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VectorSynchronizer.js */ "./src/olcs/VectorSynchronizer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module olcs.GaVectorSynchronizer
 */


var exports = function (_olcsVectorSynchroniz) {
  _inherits(exports, _olcsVectorSynchroniz);

  function exports() {
    _classCallCheck(this, exports);

    return _possibleConstructorReturn(this, _olcsVectorSynchroniz.apply(this, arguments));
  }

  exports.prototype.createSingleLayerCounterparts = function createSingleLayerCounterparts(olLayerWithParents) {

    var layer = olLayerWithParents.layer;

    /** @type {string} */
    var id = layer.id;

    /** @type {string} */
    var url = layer.url;

    if (/^KML/.test(id) && url && !/:\/\/public\./.test(url)) {
      return null;
    }
    return _olcsVectorSynchroniz.prototype.createSingleLayerCounterparts.call(this, olLayerWithParents);
  };

  return exports;
}(_VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (exports);

/***/ }),

/***/ "./src/olcs/OLCesium.js":
/*!******************************!*\
  !*** ./src/olcs/OLCesium.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_geom_Point_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/geom/Point.js */ "ol/geom/Point.js");
/* harmony import */ var ol_geom_Point_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_geom_Point_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! goog/asserts.js */ "./src/goog/asserts.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core.js */ "./src/olcs/core.js");
/* harmony import */ var _AutoRenderLoop_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AutoRenderLoop.js */ "./src/olcs/AutoRenderLoop.js");
/* harmony import */ var _Camera_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Camera.js */ "./src/olcs/Camera.js");
/* harmony import */ var _RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./RasterSynchronizer.js */ "./src/olcs/RasterSynchronizer.js");
/* harmony import */ var _VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./VectorSynchronizer.js */ "./src/olcs/VectorSynchronizer.js");
/* harmony import */ var _OverlaySynchronizer_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./OverlaySynchronizer.js */ "./src/olcs/OverlaySynchronizer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module olcs.OLCesium
 */











var OLCesium = function () {
  /**
   * @param {!olcsx.OLCesiumOptions} options Options.
   * @constructor
   * @api
   */
  function OLCesium(options) {
    _classCallCheck(this, OLCesium);

    /**
     * @type {olcs.AutoRenderLoop}
     * @private
     */
    this.autoRenderLoop_ = null;

    /**
     * @type {!ol.Map}
     * @private
     */
    this.map_ = options.map;

    /**
     * @type {!function(): Cesium.JulianDate}
     * @private
     */
    this.time_ = options.time || function () {
      return Cesium.JulianDate.now();
    };

    /**
     * No change of the view projection.
     * @private
     */
    this.to4326Transform_ = ol_proj_js__WEBPACK_IMPORTED_MODULE_2__["getTransform"](this.map_.getView().getProjection(), 'EPSG:4326');

    /**
     * @type {number}
     * @private
     */
    this.resolutionScale_ = 1.0;

    /**
     * @type {number}
     * @private
     */
    this.canvasClientWidth_ = 0.0;

    /**
     * @type {number}
     * @private
     */
    this.canvasClientHeight_ = 0.0;

    /**
     * @type {boolean}
     * @private
     */
    this.resolutionScaleChanged_ = true; // force resize

    var fillArea = 'position:absolute;top:0;left:0;width:100%;height:100%;';

    /**
     * @type {!Element}
     * @private
     */
    this.container_ = document.createElement('DIV');
    var containerAttribute = document.createAttribute('style');
    containerAttribute.value = fillArea + 'visibility:hidden;';
    this.container_.setAttributeNode(containerAttribute);

    var targetElement = options.target || null;
    if (targetElement) {
      if (typeof targetElement === 'string') {
        targetElement = document.getElementById(targetElement);
      }
      targetElement.appendChild(this.container_);
    } else {
      var oc = this.map_.getViewport().querySelector('.ol-overlaycontainer');
      if (oc && oc.parentNode) {
        oc.parentNode.insertBefore(this.container_, oc);
      }
    }

    /**
     * Whether the Cesium container is placed over the ol map.
     * @type {boolean}
     * @private
     */
    this.isOverMap_ = !targetElement;

    if (this.isOverMap_ && options.stopOpenLayersEventsPropagation) {
      var overlayEvents = ['click', 'dblclick', 'mousedown', 'touchstart', 'MSPointerDown', 'pointerdown', 'mousewheel', 'wheel'];
      for (var i = 0, ii = overlayEvents.length; i < ii; ++i) {
        this.container_.addEventListener(overlayEvents[i], function (evt) {
          return evt.stopPropagation();
        });
      }
    }

    /**
     * @type {!HTMLCanvasElement}
     * @private
     */
    this.canvas_ = /** @type {!HTMLCanvasElement} */document.createElement('CANVAS');
    var canvasAttribute = document.createAttribute('style');
    canvasAttribute.value = fillArea;
    this.canvas_.setAttributeNode(canvasAttribute);

    if (_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].supportsImageRenderingPixelated()) {
      // non standard CSS4
      this.canvas_.style['imageRendering'] = _util_js__WEBPACK_IMPORTED_MODULE_3__["default"].imageRenderingValue();
    }

    this.canvas_.oncontextmenu = function () {
      return false;
    };
    this.canvas_.onselectstart = function () {
      return false;
    };

    this.container_.appendChild(this.canvas_);

    /**
     * @type {boolean}
     * @private
     */
    this.enabled_ = false;

    /**
     * @type {!Array.<ol.interaction.Interaction>}
     * @private
     */
    this.pausedInteractions_ = [];

    /**
     * @type {?ol.layer.Group}
     * @private
     */
    this.hiddenRootGroup_ = null;

    var sceneOptions = options.sceneOptions !== undefined ? options.sceneOptions :
    /** @type {Cesium.SceneOptions} */{};
    sceneOptions.canvas = this.canvas_;
    sceneOptions.scene3DOnly = true;

    /**
     * @type {!Cesium.Scene}
     * @private
     */
    this.scene_ = new Cesium.Scene(sceneOptions);

    var sscc = this.scene_.screenSpaceCameraController;

    sscc.tiltEventTypes.push({
      'eventType': Cesium.CameraEventType.LEFT_DRAG,
      'modifier': Cesium.KeyboardEventModifier.SHIFT
    });

    sscc.tiltEventTypes.push({
      'eventType': Cesium.CameraEventType.LEFT_DRAG,
      'modifier': Cesium.KeyboardEventModifier.ALT
    });

    sscc.enableLook = false;

    this.scene_.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;

    /**
     * @type {!olcs.Camera}
     * @private
     */
    this.camera_ = new _Camera_js__WEBPACK_IMPORTED_MODULE_6__["default"](this.scene_, this.map_);

    /**
     * @type {!Cesium.Globe}
     * @private
     */
    this.globe_ = new Cesium.Globe(Cesium.Ellipsoid.WGS84);
    this.globe_.baseColor = Cesium.Color.WHITE;
    this.scene_.globe = this.globe_;
    this.scene_.skyAtmosphere = new Cesium.SkyAtmosphere();

    // The first layer of Cesium is special; using a 1x1 transparent image to workaround it.
    // See https://github.com/AnalyticalGraphicsInc/cesium/issues/1323 for details.
    var firstImageryProvider = new Cesium.SingleTileImageryProvider({
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      rectangle: Cesium.Rectangle.fromDegrees(0, 0, 1, 1) // the Rectangle dimensions are arbitrary
    });
    this.globe_.imageryLayers.addImageryProvider(firstImageryProvider, 0);

    this.dataSourceCollection_ = new Cesium.DataSourceCollection();
    this.dataSourceDisplay_ = new Cesium.DataSourceDisplay({
      scene: this.scene_,
      dataSourceCollection: this.dataSourceCollection_
    });

    var synchronizers = options.createSynchronizers ? options.createSynchronizers(this.map_, this.scene_, this.dataSourceCollection_) : [new _RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__["default"](this.map_, this.scene_), new _VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_8__["default"](this.map_, this.scene_), new _OverlaySynchronizer_js__WEBPACK_IMPORTED_MODULE_9__["default"](this.map_, this.scene_)];

    // Assures correct canvas size after initialisation
    this.handleResize_();

    for (var _i = synchronizers.length - 1; _i >= 0; --_i) {
      synchronizers[_i].synchronize();
    }

    /**
     * Time of the last rendered frame, as returned by `performance.now()`.
     * @type {number}
     * @private
     */
    this.lastFrameTime_ = 0;

    /**
     * The identifier returned by `requestAnimationFrame`.
     * @type {number|undefined}
     * @private
     */
    this.renderId_ = undefined;

    /**
     * Target frame rate for the render loop.
     * @type {number}
     * @private
     */
    this.targetFrameRate_ = Number.POSITIVE_INFINITY;

    /**
     * If the Cesium render loop is being blocked.
     * @type {boolean}
     * @private
     */
    this.blockCesiumRendering_ = false;

    /**
     * If the warmup routine is active.
     * @type {boolean}
     * @private
     */
    this.warmingUp_ = false;

    /**
     * @type {ol.Feature}
     * @private
     */
    this.trackedFeature_ = null;

    /**
     * @type {Cesium.Entity}
     * @private
     */
    this.trackedEntity_ = null;

    /**
     * @type {Cesium.EntityView}
     * @private
     */
    this.entityView_ = null;

    /**
     * @type {boolean}
     * @private
     */
    this.needTrackedEntityUpdate_ = false;

    /**
     * @type {!Cesium.BoundingSphere}
     */
    this.boundingSphereScratch_ = new Cesium.BoundingSphere();

    var eventHelper = new Cesium.EventHelper();
    eventHelper.add(this.scene_.postRender, OLCesium.prototype.updateTrackedEntity_, this);

    // Cesium has a mechanism to prevent the camera to go under the terrain.
    // Unfortunately, it is only active when all the terrain has been loaded, which:
    // - does not prevent the camera to sink under terrain anymore;
    // - introduce a jumping effect once all terrain has been loaded and the position of the camera is finally fixed.
    // The property below enables a workaround found in the Camptocamp Cesium fork.
    // See also https://github.com/AnalyticalGraphicsInc/cesium/issues/5999.
    Cesium.Camera.enableSuspendTerrainAdjustment = false;
  }

  /**
   * Render the Cesium scene.
   * @private
   */


  OLCesium.prototype.render_ = function render_() {
    // if a call to `requestAnimationFrame` is pending, cancel it
    if (this.renderId_ !== undefined) {
      cancelAnimationFrame(this.renderId_);
      this.renderId_ = undefined;
    }

    // only render if Cesium is enabled/warming and rendering hasn't been blocked
    if ((this.enabled_ || this.warmingUp_) && !this.blockCesiumRendering_) {
      this.renderId_ = requestAnimationFrame(this.onAnimationFrame_.bind(this));
    }
  };

  /**
   * Callback for `requestAnimationFrame`.
   * @param {number} frameTime The frame time, from `performance.now()`.
   * @private
   */


  OLCesium.prototype.onAnimationFrame_ = function onAnimationFrame_(frameTime) {
    this.renderId_ = undefined;

    // check if a frame was rendered within the target frame rate
    var interval = 1000.0 / this.targetFrameRate_;
    var delta = frameTime - this.lastFrameTime_;
    if (delta < interval) {
      // too soon, don't render yet
      this.render_();
      return;
    }

    // time to render a frame, save the time
    this.lastFrameTime_ = frameTime;

    var julianDate = this.time_();
    this.scene_.initializeFrame();
    this.handleResize_();
    this.dataSourceDisplay_.update(julianDate);

    // Update tracked entity
    if (this.entityView_) {
      var trackedEntity = this.trackedEntity_;
      var trackedState = this.dataSourceDisplay_.getBoundingSphere(trackedEntity, false, this.boundingSphereScratch_);
      if (trackedState === Cesium.BoundingSphereState.DONE) {
        this.boundingSphereScratch_.radius = 1; // a radius of 1 is enough for tracking points
        this.entityView_.update(julianDate, this.boundingSphereScratch_);
      }
    }

    this.scene_.render(julianDate);
    this.camera_.checkCameraChange();

    // request the next render call after this one completes to ensure the browser doesn't get backed up
    this.render_();
  };

  /**
   * @private
   */


  OLCesium.prototype.updateTrackedEntity_ = function updateTrackedEntity_() {
    if (!this.needTrackedEntityUpdate_) {
      return;
    }

    var trackedEntity = this.trackedEntity_;
    var scene = this.scene_;

    var state = this.dataSourceDisplay_.getBoundingSphere(trackedEntity, false, this.boundingSphereScratch_);
    if (state === Cesium.BoundingSphereState.PENDING) {
      return;
    }

    scene.screenSpaceCameraController.enableTilt = false;

    var bs = state !== Cesium.BoundingSphereState.FAILED ? this.boundingSphereScratch_ : undefined;
    if (bs) {
      bs.radius = 1;
    }
    this.entityView_ = new Cesium.EntityView(trackedEntity, scene, scene.mapProjection.ellipsoid);
    this.entityView_.update(this.time_(), bs);
    this.needTrackedEntityUpdate_ = false;
  };

  /**
   * @private
   */


  OLCesium.prototype.handleResize_ = function handleResize_() {
    var width = this.canvas_.clientWidth;
    var height = this.canvas_.clientHeight;

    if (width === 0 | height === 0) {
      // The canvas DOM element is not ready yet.
      return;
    }

    if (width === this.canvasClientWidth_ && height === this.canvasClientHeight_ && !this.resolutionScaleChanged_) {
      return;
    }

    var resolutionScale = this.resolutionScale_;
    if (!_util_js__WEBPACK_IMPORTED_MODULE_3__["default"].supportsImageRenderingPixelated()) {
      resolutionScale *= window.devicePixelRatio || 1.0;
    }
    this.resolutionScaleChanged_ = false;

    this.canvasClientWidth_ = width;
    this.canvasClientHeight_ = height;

    width *= resolutionScale;
    height *= resolutionScale;

    this.canvas_.width = width;
    this.canvas_.height = height;
    this.scene_.camera.frustum.aspectRatio = width / height;
  };

  /**
   * @return {!olcs.Camera}
   * @api
   */


  OLCesium.prototype.getCamera = function getCamera() {
    return this.camera_;
  };

  /**
   * @return {!ol.Map}
   * @api
   */


  OLCesium.prototype.getOlMap = function getOlMap() {
    return this.map_;
  };

  /**
   * @return {!ol.View}
   * @api
   */


  OLCesium.prototype.getOlView = function getOlView() {
    var view = this.map_.getView();
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__["default"].assert(view);
    return view;
  };

  /**
   * @return {!Cesium.Scene}
   * @api
   */


  OLCesium.prototype.getCesiumScene = function getCesiumScene() {
    return this.scene_;
  };

  /**
   * @return {!Cesium.DataSourceCollection}
   * @api
   */


  OLCesium.prototype.getDataSources = function getDataSources() {
    return this.dataSourceCollection_;
  };

  /**
   * @return {!Cesium.DataSourceDisplay}
   * @api
   */


  OLCesium.prototype.getDataSourceDisplay = function getDataSourceDisplay() {
    return this.dataSourceDisplay_;
  };

  /**
   * @return {boolean}
   * @api
   */


  OLCesium.prototype.getEnabled = function getEnabled() {
    return this.enabled_;
  };

  /**
   * Enables/disables the Cesium.
   * This modifies the visibility style of the container element.
   * @param {boolean} enable
   * @api
   */


  OLCesium.prototype.setEnabled = function setEnabled(enable) {
    var _this = this;

    if (this.enabled_ === enable) {
      return;
    }
    this.enabled_ = enable;

    // some Cesium operations are operating with canvas.clientWidth,
    // so we can't remove it from DOM or even make display:none;
    this.container_.style.visibility = this.enabled_ ? 'visible' : 'hidden';
    var interactions = void 0;
    if (this.enabled_) {
      this.throwOnUnitializedMap_();
      if (this.isOverMap_) {
        interactions = this.map_.getInteractions();
        interactions.forEach(function (el, i, arr) {
          _this.pausedInteractions_.push(el);
        });
        interactions.clear();

        var rootGroup = this.map_.getLayerGroup();
        if (rootGroup.getVisible()) {
          this.hiddenRootGroup_ = rootGroup;
          this.hiddenRootGroup_.setVisible(false);
        }

        this.map_.getOverlayContainer().classList.add('olcs-hideoverlay');
        this.map_.getOverlayContainerStopEvent().classList.add('olcs-hideoverlay');
      }

      this.camera_.readFromView();
      this.render_();
    } else {
      if (this.isOverMap_) {
        interactions = this.map_.getInteractions();
        this.pausedInteractions_.forEach(function (interaction) {
          interactions.push(interaction);
        });
        this.pausedInteractions_.length = 0;
        this.map_.getOverlayContainer().classList.remove('olcs-hideoverlay');
        this.map_.getOverlayContainerStopEvent().classList.remove('olcs-hideoverlay');
        if (this.hiddenRootGroup_) {
          this.hiddenRootGroup_.setVisible(true);
          this.hiddenRootGroup_ = null;
        }
      }

      this.camera_.updateView();
    }
  };

  /**
   * Preload Cesium so that it is ready when transitioning from 2D to 3D.
   * @param {number} height Target height of the camera
   * @param {number} timeout Milliseconds after which the warming will stop
   * @api
  */


  OLCesium.prototype.warmUp = function warmUp(height, timeout) {
    var _this2 = this;

    if (this.enabled_) {
      // already enabled
      return;
    }
    this.throwOnUnitializedMap_();
    this.camera_.readFromView();
    var ellipsoid = this.globe_.ellipsoid;
    var csCamera = this.scene_.camera;
    var position = ellipsoid.cartesianToCartographic(csCamera.position);
    if (position.height < height) {
      position.height = height;
      csCamera.position = ellipsoid.cartographicToCartesian(position);
    }

    this.warmingUp_ = true;
    this.render_();

    setTimeout(function () {
      _this2.warmingUp_ = false;
    }, timeout);
  };

  /**
   * Block Cesium rendering to save resources.
   * @param {boolean} block True to block.
   * @api
  */


  OLCesium.prototype.setBlockCesiumRendering = function setBlockCesiumRendering(block) {
    if (this.blockCesiumRendering_ !== block) {
      this.blockCesiumRendering_ = block;

      // reset the render loop
      this.render_();
    }
  };

  /**
   * Render the globe only when necessary in order to save resources.
   * Experimental.
   * @api
   */


  OLCesium.prototype.enableAutoRenderLoop = function enableAutoRenderLoop() {
    if (!this.autoRenderLoop_) {
      this.autoRenderLoop_ = new _AutoRenderLoop_js__WEBPACK_IMPORTED_MODULE_5__["default"](this);
    }
  };

  /**
   * Get the autorender loop.
   * @return {?olcs.AutoRenderLoop}
   * @api
  */


  OLCesium.prototype.getAutoRenderLoop = function getAutoRenderLoop() {
    return this.autoRenderLoop_;
  };

  /**
   * The 3D Cesium globe is rendered in a canvas with two different dimensions:
   * clientWidth and clientHeight which are the dimension on the screen and
   * width and height which are the dimensions of the drawing buffer.
   *
   * By using a resolution scale lower than 1.0, it is possible to render the
   * globe in a buffer smaller than the canvas client dimensions and improve
   * performance, at the cost of quality.
   *
   * Pixel ratio should also be taken into account; by default, a device with
   * pixel ratio of 2.0 will have a buffer surface 4 times bigger than the client
   * surface.
   *
   * @param {number} value
   * @this {olcs.OLCesium}
   * @api
   */


  OLCesium.prototype.setResolutionScale = function setResolutionScale(value) {
    value = Math.max(0, value);
    if (value !== this.resolutionScale_) {
      this.resolutionScale_ = Math.max(0, value);
      this.resolutionScaleChanged_ = true;
      if (this.autoRenderLoop_) {
        this.autoRenderLoop_.restartRenderLoop();
      }
    }
  };

  /**
   * Set the target frame rate for the renderer. Set to `Number.POSITIVE_INFINITY`
   * to render as quickly as possible.
   * @param {number} value The frame rate, in frames per second.
   * @api
   */


  OLCesium.prototype.setTargetFrameRate = function setTargetFrameRate(value) {
    if (this.targetFrameRate_ !== value) {
      this.targetFrameRate_ = value;

      // reset the render loop
      this.render_();
    }
  };

  /**
   * Check if OpenLayers map is not properly initialized.
   * @private
   */


  OLCesium.prototype.throwOnUnitializedMap_ = function throwOnUnitializedMap_() {
    var map = this.map_;
    var view = map.getView();
    var center = view.getCenter();
    if (!view.isDef() || isNaN(center[0]) || isNaN(center[1])) {
      throw new Error('The OpenLayers map is not properly initialized: ' + center + ' / ' + view.getResolution());
    }
  };

  return OLCesium;
}();

Object.defineProperties(OLCesium.prototype, {
  'trackedFeature': {
    'get': /** @this {olcs.OLCesium} */function get() {
      return this.trackedFeature_;
    },
    'set': /** @this {olcs.OLCesium} */function set(feature) {
      if (this.trackedFeature_ !== feature) {

        var scene = this.scene_;

        //Stop tracking
        if (!feature || !feature.getGeometry()) {
          this.needTrackedEntityUpdate_ = false;
          scene.screenSpaceCameraController.enableTilt = true;

          if (this.trackedEntity_) {
            this.dataSourceDisplay_.defaultDataSource.entities.remove(this.trackedEntity_);
          }
          this.trackedEntity_ = null;
          this.trackedFeature_ = null;
          this.entityView_ = null;
          scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
          return;
        }

        this.trackedFeature_ = feature;

        //We can't start tracking immediately, so we set a flag and start tracking
        //when the bounding sphere is ready (most likely next frame).
        this.needTrackedEntityUpdate_ = true;

        var to4326Transform = this.to4326Transform_;
        var toCesiumPosition = function toCesiumPosition() {
          var geometry = feature.getGeometry();
          goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__["default"].assertInstanceof(geometry, ol_geom_Point_js__WEBPACK_IMPORTED_MODULE_0___default.a);
          var coo = geometry.getCoordinates();
          var coo4326 = to4326Transform(coo, undefined, coo.length);
          return _core_js__WEBPACK_IMPORTED_MODULE_4__["default"].ol4326CoordinateToCesiumCartesian(coo4326);
        };

        // Create an invisible point entity for tracking.
        // It is independant from the primitive/geometry created by the vector synchronizer.
        var options = {
          'position': new Cesium.CallbackProperty(function (time, result) {
            return toCesiumPosition();
          }, false),
          'point': {
            'pixelSize': 1,
            'color': Cesium.Color.TRANSPARENT
          }
        };

        this.trackedEntity_ = this.dataSourceDisplay_.defaultDataSource.entities.add(options);
      }
    }
  }
});

/* harmony default export */ __webpack_exports__["default"] = (OLCesium);

/***/ }),

/***/ "./src/olcs/OverlaySynchronizer.js":
/*!*****************************************!*\
  !*** ./src/olcs/OverlaySynchronizer.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SynchronizedOverlay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SynchronizedOverlay.js */ "./src/olcs/SynchronizedOverlay.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module olcs.OverlaySynchronizer
 */



var OverlaySynchronizer = function () {
  /**
  * @param {!ol.Map} map
  * @param {!Cesium.Scene} scene
  * @constructor
  * @template T
  * @api
  */
  function OverlaySynchronizer(map, scene) {
    var _this = this;

    _classCallCheck(this, OverlaySynchronizer);

    /**
    * @type {!ol.Map}
    * @protected
    */
    this.map = map;

    /**
    * @type {ol.Collection.<ol.Overlay>}
    * @private
    */
    this.overlays_ = this.map.getOverlays();

    /**
    * @type {!Cesium.Scene}
    * @protected
    */
    this.scene = scene;

    /**
    * @private
    * @type {!Element}
    */
    this.overlayContainerStopEvent_ = document.createElement('DIV');
    this.overlayContainerStopEvent_.className = 'ol-overlaycontainer-stopevent';
    var overlayEvents = ['click', 'dblclick', 'mousedown', 'touchstart', 'MSPointerDown', 'pointerdown', 'mousewheel', 'wheel'];
    overlayEvents.forEach(function (event) {
      _this.overlayContainerStopEvent_.addEventListener(event, function (evt) {
        return evt.stopPropagation();
      });
    });
    this.scene.canvas.parentElement.appendChild(this.overlayContainerStopEvent_);

    /**
    * @private
    * @type {!Element}
    */
    this.overlayContainer_ = document.createElement('DIV');
    this.overlayContainer_.className = 'ol-overlaycontainer';
    this.scene.canvas.parentElement.appendChild(this.overlayContainer_);

    /**
    * @type {!Object<?,olcs.SynchronizedOverlay>}
    * @private
    */
    this.overlayMap_ = {};
  }

  /**
  * Get the element that serves as a container for overlays that don't allow
  * event propagation. Elements added to this container won't let mousedown and
  * touchstart events through to the map, so clicks and gestures on an overlay
  * don't trigger any {@link ol.MapBrowserEvent}.
  * @return {!Element} The map's overlay container that stops events.
  */


  OverlaySynchronizer.prototype.getOverlayContainerStopEvent = function getOverlayContainerStopEvent() {
    return this.overlayContainerStopEvent_;
  };

  /**
  * Get the element that serves as a container for overlays.
  * @return {!Element} The map's overlay container.
  */


  OverlaySynchronizer.prototype.getOverlayContainer = function getOverlayContainer() {
    return this.overlayContainer_;
  };

  /**
  * Destroy all and perform complete synchronization of the overlays.
  * @api
  */


  OverlaySynchronizer.prototype.synchronize = function synchronize() {
    this.destroyAll();
    this.addOverlays();
    this.overlays_.on('add', this.addOverlayFromEvent_.bind(this));
    this.overlays_.on('remove', this.removeOverlayFromEvent_.bind(this));
  };

  /**
  * @param {ol.Collection.Event} event
  * @private
  */


  OverlaySynchronizer.prototype.addOverlayFromEvent_ = function addOverlayFromEvent_(event) {
    var overlay = /** @type {ol.Overlay} */event.element;
    this.addOverlay(overlay);
  };

  /**
  * @api
  */


  OverlaySynchronizer.prototype.addOverlays = function addOverlays() {
    var _this2 = this;

    this.overlays_.forEach(function (overlay) {
      _this2.addOverlay();
    });
  };

  /**
  * @param {ol.Overlay} overlay
  * @api
  */


  OverlaySynchronizer.prototype.addOverlay = function addOverlay(overlay) {
    if (!overlay) {
      return;
    }
    var cesiumOverlay = new _SynchronizedOverlay_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
      scene: this.scene,
      synchronizer: this,
      parent: overlay
    });

    var overlayId = Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["getUid"])(overlay).toString();
    this.overlayMap_[overlayId] = cesiumOverlay;
  };

  /**
  * @param {ol.Collection.Event} event
  * @private
  */


  OverlaySynchronizer.prototype.removeOverlayFromEvent_ = function removeOverlayFromEvent_(event) {
    var removedOverlay = /** @type {ol.Overlay} */event.element;
    this.removeOverlay(removedOverlay);
  };

  /**
  * Removes an overlay from the scene
  * @param {ol.Overlay} overlay
  * @api
  */


  OverlaySynchronizer.prototype.removeOverlay = function removeOverlay(overlay) {
    var overlayId = Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["getUid"])(overlay).toString();
    var csOverlay = this.overlayMap_[overlayId];
    if (csOverlay) {
      csOverlay.destroy();
      delete this.overlayMap_[overlayId];
    }
  };

  /**
  * Destroys all the created Cesium objects.
  * @protected
  */


  OverlaySynchronizer.prototype.destroyAll = function destroyAll() {
    var _this3 = this;

    Object.keys(this.overlayMap_).forEach(function (key) {
      var overlay = _this3.overlayMap_[key];
      overlay.destroy();
      delete _this3.overlayMap_[key];
    });
  };

  return OverlaySynchronizer;
}();

/* harmony default export */ __webpack_exports__["default"] = (OverlaySynchronizer);

/***/ }),

/***/ "./src/olcs/RasterSynchronizer.js":
/*!****************************************!*\
  !*** ./src/olcs/RasterSynchronizer.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/layer/Group.js */ "ol/layer/Group.js");
/* harmony import */ var ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! goog/asserts.js */ "./src/goog/asserts.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var _AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AbstractSynchronizer.js */ "./src/olcs/AbstractSynchronizer.js");
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core.js */ "./src/olcs/core.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module olcs.RasterSynchronizer
 */






var RasterSynchronizer = function (_olcsAbstractSynchron) {
  _inherits(RasterSynchronizer, _olcsAbstractSynchron);

  /**
   * This object takes care of one-directional synchronization of
   * Openlayers raster layers to the given Cesium globe.
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   * @constructor
   * @extends {olcsAbstractSynchronizer.<Cesium.ImageryLayer>}
   * @api
   */
  function RasterSynchronizer(map, scene) {
    _classCallCheck(this, RasterSynchronizer);

    /**
     * @type {!Cesium.ImageryLayerCollection}
     * @private
     */
    var _this = _possibleConstructorReturn(this, _olcsAbstractSynchron.call(this, map, scene));

    _this.cesiumLayers_ = scene.imageryLayers;

    /**
     * @type {!Cesium.ImageryLayerCollection}
     * @private
     */
    _this.ourLayers_ = new Cesium.ImageryLayerCollection();
    return _this;
  }

  /**
   * @inheritDoc
   */


  RasterSynchronizer.prototype.addCesiumObject = function addCesiumObject(object) {
    this.cesiumLayers_.add(object);
    this.ourLayers_.add(object);
  };

  /**
   * @inheritDoc
   */


  RasterSynchronizer.prototype.destroyCesiumObject = function destroyCesiumObject(object) {
    object.destroy();
  };

  /**
   * @inheritDoc
   */


  RasterSynchronizer.prototype.removeSingleCesiumObject = function removeSingleCesiumObject(object, destroy) {
    this.cesiumLayers_.remove(object, destroy);
    this.ourLayers_.remove(object, false);
  };

  /**
   * @inheritDoc
   */


  RasterSynchronizer.prototype.removeAllCesiumObjects = function removeAllCesiumObjects(destroy) {
    for (var i = 0; i < this.ourLayers_.length; ++i) {
      this.cesiumLayers_.remove(this.ourLayers_.get(i), destroy);
    }
    this.ourLayers_.removeAll(false);
  };

  /**
   * Creates an array of Cesium.ImageryLayer.
   * May be overriden by child classes to implement custom behavior.
   * The default implementation handles tiled imageries in EPSG:4326 or
   * EPSG:3859.
   * @param {!ol.layer.Base} olLayer
   * @param {!ol.proj.Projection} viewProj Projection of the view.
   * @return {?Array.<!Cesium.ImageryLayer>} array or null if not possible
   * (or supported)
   * @protected
   */


  RasterSynchronizer.prototype.convertLayerToCesiumImageries = function convertLayerToCesiumImageries(olLayer, viewProj) {
    var result = _core_js__WEBPACK_IMPORTED_MODULE_4__["default"].tileLayerToImageryLayer(this.map, olLayer, viewProj);
    return result ? [result] : null;
  };

  /**
   * @inheritDoc
   */


  RasterSynchronizer.prototype.createSingleLayerCounterparts = function createSingleLayerCounterparts(olLayerWithParents) {
    var _this2 = this;

    var olLayer = olLayerWithParents.layer;
    var uid = Object(_util_js__WEBPACK_IMPORTED_MODULE_2__["getUid"])(olLayer).toString();
    var viewProj = this.view.getProjection();
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__["default"].assert(viewProj);
    var cesiumObjects = this.convertLayerToCesiumImageries(olLayer, viewProj);
    if (cesiumObjects) {
      var _olLayerListenKeys$ui;

      var listenKeyArray = [];
      [olLayerWithParents.layer].concat(olLayerWithParents.parents).forEach(function (olLayerItem) {
        listenKeyArray.push(olLayerItem.on(['change:opacity', 'change:visible'], function () {
          // the compiler does not seem to be able to infer this
          goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__["default"].assert(cesiumObjects);
          for (var i = 0; i < cesiumObjects.length; ++i) {
            _core_js__WEBPACK_IMPORTED_MODULE_4__["default"].updateCesiumLayerProperties(olLayerWithParents, cesiumObjects[i]);
          }
        }));
      });

      for (var i = 0; i < cesiumObjects.length; ++i) {
        _core_js__WEBPACK_IMPORTED_MODULE_4__["default"].updateCesiumLayerProperties(olLayerWithParents, cesiumObjects[i]);
      }

      // there is no way to modify Cesium layer extent,
      // we have to recreate when OpenLayers layer extent changes:
      listenKeyArray.push(olLayer.on('change:extent', function (e) {
        for (var _i = 0; _i < cesiumObjects.length; ++_i) {
          _this2.cesiumLayers_.remove(cesiumObjects[_i], true); // destroy
          _this2.ourLayers_.remove(cesiumObjects[_i], false);
        }
        delete _this2.layerMap[Object(_util_js__WEBPACK_IMPORTED_MODULE_2__["getUid"])(olLayer)]; // invalidate the map entry
        _this2.synchronize();
      }));

      listenKeyArray.push(olLayer.on('change', function (e) {
        // when the source changes, re-add the layer to force update
        for (var _i2 = 0; _i2 < cesiumObjects.length; ++_i2) {
          var position = _this2.cesiumLayers_.indexOf(cesiumObjects[_i2]);
          if (position >= 0) {
            _this2.cesiumLayers_.remove(cesiumObjects[_i2], false);
            _this2.cesiumLayers_.add(cesiumObjects[_i2], position);
          }
        }
      }));

      (_olLayerListenKeys$ui = this.olLayerListenKeys[uid]).push.apply(_olLayerListenKeys$ui, listenKeyArray);
    }

    return Array.isArray(cesiumObjects) ? cesiumObjects : null;
  };

  /**
   * Order counterparts using the same algorithm as the Openlayers renderer:
   * z-index then original sequence order.
   * @override
   * @protected
   */


  RasterSynchronizer.prototype.orderLayers = function orderLayers() {
    var _this3 = this;

    var layers = [];
    var zIndices = {};
    var queue = [this.mapLayerGroup];

    while (queue.length > 0) {
      var olLayer = queue.splice(0, 1)[0];
      layers.push(olLayer);
      zIndices[Object(_util_js__WEBPACK_IMPORTED_MODULE_2__["getUid"])(olLayer)] = olLayer.getZIndex();

      if (olLayer instanceof ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_0___default.a) {
        var sublayers = olLayer.getLayers();
        if (sublayers) {
          // Prepend queue with sublayers in order
          queue.unshift.apply(queue, sublayers.getArray());
        }
      }
    }

    Object(_util_js__WEBPACK_IMPORTED_MODULE_2__["stableSort"])(layers, function (layer1, layer2) {
      return zIndices[Object(_util_js__WEBPACK_IMPORTED_MODULE_2__["getUid"])(layer1)] - zIndices[Object(_util_js__WEBPACK_IMPORTED_MODULE_2__["getUid"])(layer2)];
    });

    layers.forEach(function (olLayer) {
      var olLayerId = Object(_util_js__WEBPACK_IMPORTED_MODULE_2__["getUid"])(olLayer).toString();
      var cesiumObjects = _this3.layerMap[olLayerId];
      if (cesiumObjects) {
        cesiumObjects.forEach(function (cesiumObject) {
          _this3.raiseToTop(cesiumObject);
        });
      }
    });
  };

  /**
   * @param {Cesium.ImageryLayer} counterpart
   */


  RasterSynchronizer.prototype.raiseToTop = function raiseToTop(counterpart) {
    this.cesiumLayers_.raiseToTop(counterpart);
  };

  return RasterSynchronizer;
}(_AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_3__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (RasterSynchronizer);

/***/ }),

/***/ "./src/olcs/SynchronizedOverlay.js":
/*!*****************************************!*\
  !*** ./src/olcs/SynchronizedOverlay.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_Overlay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/Overlay.js */ "ol/Overlay.js");
/* harmony import */ var ol_Overlay_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_Overlay_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/dom.js */ "ol/dom.js");
/* harmony import */ var ol_dom_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_dom_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/Observable.js */ "ol/Observable.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_Observable_js__WEBPACK_IMPORTED_MODULE_3__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module olcs.SynchronizedOverlay
 */





var SynchronizedOverlay = function (_olOverlay) {
  _inherits(SynchronizedOverlay, _olOverlay);

  /**
   * @param {olcsx.SynchronizedOverlayOptions} options SynchronizedOverlay Options.
   * @api
   */
  function SynchronizedOverlay(options) {
    _classCallCheck(this, SynchronizedOverlay);

    var parent = options.parent;

    /**
     * @private
     * @type {?Function}
     */
    var _this = _possibleConstructorReturn(this, _olOverlay.call(this, parent.getOptions()));

    _this.scenePostRenderListenerRemover_ = null;

    /**
     * @private
     * @type {!Cesium.Scene}
     */
    _this.scene_ = options.scene;

    /**
     * @private
     * @type {!olcs.OverlaySynchronizer}
     */
    _this.synchronizer_ = options.synchronizer;

    /**
     * @private
     * @type {!ol.Overlay}
     */
    _this.parent_ = parent;

    /**
     * @private
     * @type {ol.Coordinate|undefined}
     */
    _this.positionWGS84_ = undefined;

    /**
     * @private
     * @type {MutationObserver}
     */
    _this.observer_ = new MutationObserver(_this.handleElementChanged.bind(_this));

    /**
     * @private
     * @type {Array.<MutationObserver>}
     */
    _this.attributeObserver_ = [];

    /**
     * @private
     * @type {Array<ol.EventsKey>}
     */
    _this.listenerKeys_ = [];
    // synchronize our Overlay with the parent Overlay
    var setPropertyFromEvent = function setPropertyFromEvent(event) {
      return _this.setPropertyFromEvent_(event);
    };
    _this.listenerKeys_.push(_this.parent_.on('change:position', setPropertyFromEvent));
    _this.listenerKeys_.push(_this.parent_.on('change:element', setPropertyFromEvent));
    _this.listenerKeys_.push(_this.parent_.on('change:offset', setPropertyFromEvent));
    _this.listenerKeys_.push(_this.parent_.on('change:position', setPropertyFromEvent));
    _this.listenerKeys_.push(_this.parent_.on('change:positioning', setPropertyFromEvent));

    _this.setProperties(_this.parent_.getProperties());

    _this.handleMapChanged();
    _this.handleElementChanged();
    return _this;
  }

  /**
   * @param {Node} target
   * @private
   */


  SynchronizedOverlay.prototype.observeTarget_ = function observeTarget_(target) {
    if (!this.observer_) {
      // not ready, skip the event (this occurs on construction)
      return;
    }
    this.observer_.disconnect();
    this.observer_.observe(target, {
      attributes: false,
      childList: true,
      characterData: true,
      subtree: true
    });
    this.attributeObserver_.forEach(function (observer) {
      observer.disconnect();
    });
    this.attributeObserver_.length = 0;
    for (var i = 0; i < target.childNodes.length; i++) {
      var node = target.childNodes[i];
      if (node.nodeType === 1) {
        var observer = new MutationObserver(this.handleElementChanged.bind(this));
        observer.observe(node, {
          attributes: true,
          subtree: true
        });
        this.attributeObserver_.push(observer);
      }
    }
  };

  /**
   *
   * @param {ol.Object.Event} event
   * @private
   */


  SynchronizedOverlay.prototype.setPropertyFromEvent_ = function setPropertyFromEvent_(event) {
    if (event.target && event.key) {
      this.set(event.key, event.target.get(event.key));
    }
  };

  /**
   * Get the scene associated with this overlay.
   * @see ol.Overlay.prototype.getMap
   * @return {!Cesium.Scene} The scene that the overlay is part of.
   * @api
   */


  SynchronizedOverlay.prototype.getScene = function getScene() {
    return this.scene_;
  };

  /**
   * @override
   */


  SynchronizedOverlay.prototype.handleMapChanged = function handleMapChanged() {
    if (this.scenePostRenderListenerRemover_) {
      this.scenePostRenderListenerRemover_();
      ol_dom_js__WEBPACK_IMPORTED_MODULE_2__["removeNode"](this.element);
    }
    this.scenePostRenderListenerRemover_ = null;
    var scene = this.getScene();
    if (scene) {
      this.scenePostRenderListenerRemover_ = scene.postRender.addEventListener(this.updatePixelPosition.bind(this));
      this.updatePixelPosition();
      var container = this.stopEvent ? this.synchronizer_.getOverlayContainerStopEvent() : this.synchronizer_.getOverlayContainer();
      if (this.insertFirst) {
        container.insertBefore(this.element, container.childNodes[0] || null);
      } else {
        container.appendChild(this.element);
      }
    }
  };

  /**
   * @override
   */


  SynchronizedOverlay.prototype.handlePositionChanged = function handlePositionChanged() {
    // transform position to WGS84
    var position = this.getPosition();
    if (position) {
      var sourceProjection = this.parent_.getMap().getView().getProjection();
      this.positionWGS84_ = ol_proj_js__WEBPACK_IMPORTED_MODULE_1__["transform"](position, sourceProjection, 'EPSG:4326');
    } else {
      this.positionWGS84_ = undefined;
    }
    this.updatePixelPosition();
  };

  /**
   * @override
   */


  SynchronizedOverlay.prototype.handleElementChanged = function handleElementChanged() {
    function cloneNode(node, parent) {
      var clone = node.cloneNode();
      if (parent) {
        parent.appendChild(clone);
      }
      if (node.nodeType != Node.TEXT_NODE) {
        clone.addEventListener('click', function (event) {
          node.dispatchEvent(new MouseEvent('click', event));
          event.stopPropagation();
        });
      }
      var nodes = node.childNodes;
      for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i]) {
          continue;
        }
        cloneNode(nodes[i], clone);
      }
      return clone;
    }
    ol_dom_js__WEBPACK_IMPORTED_MODULE_2__["removeChildren"](this.element);
    var element = this.getElement();
    if (element) {
      if (element.parentNode && element.parentNode.childNodes) {
        for (var _iterator = element.parentNode.childNodes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var node = _ref;

          var clonedNode = cloneNode(node, null);
          this.element.appendChild(clonedNode);
        }
      }
    }
    if (element.parentNode) {
      // set new Observer
      this.observeTarget_(element.parentNode);
    }
  };

  /**
   * @override
   */


  SynchronizedOverlay.prototype.updatePixelPosition = function updatePixelPosition() {
    var position = this.positionWGS84_;
    if (!this.scene_ || !position) {
      this.setVisible(false);
      return;
    }
    var cartesian = void 0;
    if (position.length === 2) {
      cartesian = Cesium.Cartesian3.fromDegreesArray(position)[0];
    } else {
      cartesian = Cesium.Cartesian3.fromDegreesArrayHeights(position)[0];
    }
    var camera = this.scene_.camera;
    var ellipsoidBoundingSphere = new Cesium.BoundingSphere(new Cesium.Cartesian3(), 6356752);
    var occluder = new Cesium.Occluder(ellipsoidBoundingSphere, camera.position);
    // check if overlay position is behind the horizon
    if (!occluder.isPointVisible(cartesian)) {
      this.setVisible(false);
      return;
    }
    var cullingVolume = camera.frustum.computeCullingVolume(camera.position, camera.direction, camera.up);
    // check if overlay position is visible from the camera
    if (cullingVolume.computeVisibility(new Cesium.BoundingSphere(cartesian)) !== 1) {
      this.setVisible(false);
      return;
    }
    this.setVisible(true);

    var pixelCartesian = this.scene_.cartesianToCanvasCoordinates(cartesian);
    var pixel = [pixelCartesian.x, pixelCartesian.y];
    var mapSize = [this.scene_.canvas.width, this.scene_.canvas.height];
    this.updateRenderedPosition(pixel, mapSize);
  };

  /**
   * Destroys the overlay, removing all its listeners and elements
   * @api
   */


  SynchronizedOverlay.prototype.destroy = function destroy() {
    if (this.scenePostRenderListenerRemover_) {
      this.scenePostRenderListenerRemover_();
    }
    if (this.observer_) {
      this.observer_.disconnect();
    }
    Object(ol_Observable_js__WEBPACK_IMPORTED_MODULE_3__["unByKey"])(this.listenerKeys_);
    this.listenerKeys_.splice(0);
    if (this.element.removeNode) {
      this.element.removeNode(true);
    } else {
      this.element.remove();
    }
    this.element = null;
  };

  return SynchronizedOverlay;
}(ol_Overlay_js__WEBPACK_IMPORTED_MODULE_0___default.a);

/* harmony default export */ __webpack_exports__["default"] = (SynchronizedOverlay);

/***/ }),

/***/ "./src/olcs/VectorSynchronizer.js":
/*!****************************************!*\
  !*** ./src/olcs/VectorSynchronizer.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/source/Vector.js */ "ol/source/Vector.js");
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/layer/Layer.js */ "ol/layer/Layer.js");
/* harmony import */ var ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/source/Cluster.js */ "ol/source/Cluster.js");
/* harmony import */ var ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/layer/Image.js */ "ol/layer/Image.js");
/* harmony import */ var ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var goog_asserts_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! goog/asserts.js */ "./src/goog/asserts.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/layer/Vector.js */ "ol/layer/Vector.js");
/* harmony import */ var ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./AbstractSynchronizer.js */ "./src/olcs/AbstractSynchronizer.js");
/* harmony import */ var _FeatureConverter_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./FeatureConverter.js */ "./src/olcs/FeatureConverter.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module olcs.VectorSynchronizer
 */










var VectorSynchronizer = function (_olcsAbstractSynchron) {
  _inherits(VectorSynchronizer, _olcsAbstractSynchron);

  /**
   * Unidirectionally synchronize OpenLayers vector layers to Cesium.
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   * @param {olcs.FeatureConverter=} opt_converter
   * @extends {olcs.AbstractSynchronizer.<olcs.core.VectorLayerCounterpart>}
   * @api
   */
  function VectorSynchronizer(map, scene, opt_converter) {
    _classCallCheck(this, VectorSynchronizer);

    /**
     * @protected
     */
    var _this = _possibleConstructorReturn(this, _olcsAbstractSynchron.call(this, map, scene));

    _this.converter = opt_converter || new _FeatureConverter_js__WEBPACK_IMPORTED_MODULE_8__["default"](scene);

    /**
     * @private
     */
    _this.csAllPrimitives_ = new Cesium.PrimitiveCollection();
    scene.primitives.add(_this.csAllPrimitives_);
    _this.csAllPrimitives_.destroyPrimitives = false;
    return _this;
  }

  /**
   * @inheritDoc
   */


  VectorSynchronizer.prototype.addCesiumObject = function addCesiumObject(counterpart) {
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_4__["default"].assert(counterpart);
    counterpart.getRootPrimitive()['counterpart'] = counterpart;
    this.csAllPrimitives_.add(counterpart.getRootPrimitive());
  };

  /**
   * @inheritDoc
   */


  VectorSynchronizer.prototype.destroyCesiumObject = function destroyCesiumObject(object) {
    object.getRootPrimitive().destroy();
  };

  /**
   * @inheritDoc
   */


  VectorSynchronizer.prototype.removeSingleCesiumObject = function removeSingleCesiumObject(object, destroy) {
    object.destroy();
    this.csAllPrimitives_.destroyPrimitives = destroy;
    this.csAllPrimitives_.remove(object.getRootPrimitive());
    this.csAllPrimitives_.destroyPrimitives = false;
  };

  /**
   * @inheritDoc
   */


  VectorSynchronizer.prototype.removeAllCesiumObjects = function removeAllCesiumObjects(destroy) {
    this.csAllPrimitives_.destroyPrimitives = destroy;
    if (destroy) {
      for (var i = 0; i < this.csAllPrimitives_.length; ++i) {
        this.csAllPrimitives_.get(i)['counterpart'].destroy();
      }
    }
    this.csAllPrimitives_.removeAll();
    this.csAllPrimitives_.destroyPrimitives = false;
  };

  /**
   * Synchronizes the layer visibility properties
   * to the given Cesium Primitive.
   * @param {olcsx.LayerWithParents} olLayerWithParents
   * @param {!Cesium.Primitive} csPrimitive
   */


  VectorSynchronizer.prototype.updateLayerVisibility = function updateLayerVisibility(olLayerWithParents, csPrimitive) {
    var visible = true;
    [olLayerWithParents.layer].concat(olLayerWithParents.parents).forEach(function (olLayer) {
      var layerVisible = olLayer.getVisible();
      if (layerVisible !== undefined) {
        visible &= layerVisible;
      } else {
        visible = false;
      }
    });
    csPrimitive.show = visible;
  };

  /**
   * @inheritDoc
   */


  VectorSynchronizer.prototype.createSingleLayerCounterparts = function createSingleLayerCounterparts(olLayerWithParents) {
    var _this2 = this;

    var olLayer = olLayerWithParents.layer;
    if (!(olLayer instanceof ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_6___default.a)) {
      return null;
    }
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_4__["default"].assertInstanceof(olLayer, ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_1___default.a);

    var source = olLayer.getSource();
    if (source instanceof ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_2___default.a) {
      source = source.getSource();
    }

    if (!source) {
      return null;
    }

    goog_asserts_js__WEBPACK_IMPORTED_MODULE_4__["default"].assertInstanceof(source, ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_0___default.a);
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_4__["default"].assert(this.view);

    var view = this.view;
    var featurePrimitiveMap = {};
    var counterpart = this.converter.olVectorLayerToCesium(olLayer, view, featurePrimitiveMap);
    var csPrimitives = counterpart.getRootPrimitive();
    var olListenKeys = counterpart.olListenKeys;

    [olLayerWithParents.layer].concat(olLayerWithParents.parents).forEach(function (olLayerItem) {
      olListenKeys.push(Object(_util_js__WEBPACK_IMPORTED_MODULE_5__["olcsListen"])(olLayerItem, 'change:visible', function () {
        _this2.updateLayerVisibility(olLayerWithParents, csPrimitives);
      }));
    });
    this.updateLayerVisibility(olLayerWithParents, csPrimitives);

    var onAddFeature = function (feature) {
      goog_asserts_js__WEBPACK_IMPORTED_MODULE_4__["default"].assert(olLayer instanceof ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_6___default.a || olLayer instanceof ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3___default.a);
      var context = counterpart.context;
      var prim = this.converter.convert(olLayer, view, feature, context);
      if (prim) {
        featurePrimitiveMap[Object(_util_js__WEBPACK_IMPORTED_MODULE_5__["getUid"])(feature)] = prim;
        csPrimitives.add(prim);
      }
    }.bind(this);

    var onRemoveFeature = function (feature) {
      var id = Object(_util_js__WEBPACK_IMPORTED_MODULE_5__["getUid"])(feature);
      var context = counterpart.context;
      var bbs = context.featureToCesiumMap[id];
      if (bbs) {
        delete context.featureToCesiumMap[id];
        bbs.forEach(function (bb) {
          if (bb instanceof Cesium.Billboard) {
            context.billboards.remove(bb);
          }
        });
      }
      var csPrimitive = featurePrimitiveMap[id];
      delete featurePrimitiveMap[id];
      if (csPrimitive) {
        csPrimitives.remove(csPrimitive);
      }
    }.bind(this);

    olListenKeys.push(Object(_util_js__WEBPACK_IMPORTED_MODULE_5__["olcsListen"])(source, 'addfeature', function (e) {
      goog_asserts_js__WEBPACK_IMPORTED_MODULE_4__["default"].assert(e.feature);
      onAddFeature(e.feature);
    }, this));

    olListenKeys.push(Object(_util_js__WEBPACK_IMPORTED_MODULE_5__["olcsListen"])(source, 'removefeature', function (e) {
      goog_asserts_js__WEBPACK_IMPORTED_MODULE_4__["default"].assert(e.feature);
      onRemoveFeature(e.feature);
    }, this));

    olListenKeys.push(Object(_util_js__WEBPACK_IMPORTED_MODULE_5__["olcsListen"])(source, 'changefeature', function (e) {
      var feature = e.feature;
      goog_asserts_js__WEBPACK_IMPORTED_MODULE_4__["default"].assert(feature);
      onRemoveFeature(feature);
      onAddFeature(feature);
    }, this));

    return counterpart ? [counterpart] : null;
  };

  return VectorSynchronizer;
}(_AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VectorSynchronizer);

/***/ }),

/***/ "./src/olcs/core.js":
/*!**************************!*\
  !*** ./src/olcs/core.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_easing_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/easing.js */ "ol/easing.js");
/* harmony import */ var ol_easing_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_easing_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! goog/asserts.js */ "./src/goog/asserts.js");
/* harmony import */ var ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/layer/Tile.js */ "ol/layer/Tile.js");
/* harmony import */ var ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/layer/Image.js */ "ol/layer/Image.js");
/* harmony import */ var ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ol_source_ImageWMS_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/source/ImageWMS.js */ "ol/source/ImageWMS.js");
/* harmony import */ var ol_source_ImageWMS_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ol_source_ImageWMS_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ol_source_TileImage_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/source/TileImage.js */ "ol/source/TileImage.js");
/* harmony import */ var ol_source_TileImage_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ol_source_TileImage_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ol/source/TileWMS.js */ "ol/source/TileWMS.js");
/* harmony import */ var ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var ol_source_Image_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ol/source/Image.js */ "ol/source/Image.js");
/* harmony import */ var ol_source_Image_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(ol_source_Image_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _core_OLImageryProvider_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core/OLImageryProvider.js */ "./src/olcs/core/OLImageryProvider.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/**
 * @module olcs.core
 */
var exports = {};












/**
 * Compute the pixel width and height of a point in meters using the
 * camera frustum.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.Cartesian3} target
 * @return {!Cesium.Cartesian2} the pixel size
 * @api
 */
exports.computePixelSizeAtCoordinate = function (scene, target) {
  var camera = scene.camera;
  var canvas = scene.canvas;
  var frustum = camera.frustum;
  var distance = Cesium.Cartesian3.magnitude(Cesium.Cartesian3.subtract(camera.position, target, new Cesium.Cartesian3()));
  var pixelSize = new Cesium.Cartesian2();
  return frustum.getPixelDimensions(canvas.clientWidth, canvas.clientHeight, distance, pixelSize);
};

/**
 * Compute bounding box around a target point.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.Cartesian3} target
 * @param {number} amount Half the side of the box, in pixels.
 * @return {Array<Cesium.Cartographic>} bottom left and top right
 * coordinates of the box
 */
exports.computeBoundingBoxAtTarget = function (scene, target, amount) {
  var pixelSize = exports.computePixelSizeAtCoordinate(scene, target);
  var transform = Cesium.Transforms.eastNorthUpToFixedFrame(target);

  var bottomLeft = Cesium.Matrix4.multiplyByPoint(transform, new Cesium.Cartesian3(-pixelSize.x * amount, -pixelSize.y * amount, 0), new Cesium.Cartesian3());

  var topRight = Cesium.Matrix4.multiplyByPoint(transform, new Cesium.Cartesian3(pixelSize.x * amount, pixelSize.y * amount, 0), new Cesium.Cartesian3());

  return Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray([bottomLeft, topRight]);
};

/**
 *
 * @param {!ol.geom.Geometry} geometry
 * @param {number} height
 * @api
 */
exports.applyHeightOffsetToGeometry = function (geometry, height) {
  geometry.applyTransform(function (input, output, stride) {
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__["default"].assert(input === output);
    if (stride !== undefined && stride >= 3) {
      for (var i = 0; i < output.length; i += stride) {
        output[i + 2] = output[i + 2] + height;
      }
    }
    return output;
  });
};

/**
 * @param {ol.Coordinate} coordinates
 * @param {number=} rotation
 * @param {!Cesium.Cartesian3=} translation
 * @param {!Cesium.Cartesian3=} scale
 * @return {!Cesium.Matrix4}
 * @api
 */
exports.createMatrixAtCoordinates = function (coordinates) {
  var rotation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var translation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Cesium.Cartesian3.ZERO;
  var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Cesium.Cartesian3(1, 1, 1);

  var position = exports.ol4326CoordinateToCesiumCartesian(coordinates);
  var rawMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
  var quaternion = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, -rotation);
  var rotationMatrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(translation, quaternion, scale);
  return Cesium.Matrix4.multiply(rawMatrix, rotationMatrix, new Cesium.Matrix4());
};

/**
 * @param {!Cesium.Camera} camera
 * @param {number} angle
 * @param {!Cesium.Cartesian3} axis
 * @param {!Cesium.Matrix4} transform
 * @param {olcsx.core.RotateAroundAxisOption=} opt_options
 * @api
 */
exports.rotateAroundAxis = function (camera, angle, axis, transform, opt_options) {
  var clamp = Cesium.Math.clamp;
  var defaultValue = Cesium.defaultValue;

  var options = opt_options || {};
  var duration = defaultValue(options.duration, 500); // ms
  var easing = defaultValue(options.easing, ol_easing_js__WEBPACK_IMPORTED_MODULE_0__["linear"]);
  var callback = options.callback;

  var lastProgress = 0;
  var oldTransform = new Cesium.Matrix4();

  var start = Date.now();
  var step = function step() {
    var timestamp = Date.now();
    var timeDifference = timestamp - start;
    var progress = easing(clamp(timeDifference / duration, 0, 1));
    goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__["default"].assert(progress >= lastProgress);

    camera.transform.clone(oldTransform);
    var stepAngle = (progress - lastProgress) * angle;
    lastProgress = progress;
    camera.lookAtTransform(transform);
    camera.rotate(axis, stepAngle);
    camera.lookAtTransform(oldTransform);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      if (callback) {
        callback();
      }
    }
  };
  window.requestAnimationFrame(step);
};

/**
 * @param {!Cesium.Scene} scene
 * @param {number} heading
 * @param {!Cesium.Cartesian3} bottomCenter
 * @param {olcsx.core.RotateAroundAxisOption=} opt_options
 * @api
 */
exports.setHeadingUsingBottomCenter = function (scene, heading, bottomCenter, opt_options) {
  var camera = scene.camera;
  // Compute the camera position to zenith quaternion
  var angleToZenith = exports.computeAngleToZenith(scene, bottomCenter);
  var axis = camera.right;
  var quaternion = Cesium.Quaternion.fromAxisAngle(axis, angleToZenith);
  var rotation = Cesium.Matrix3.fromQuaternion(quaternion);

  // Get the zenith point from the rotation of the position vector
  var vector = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(camera.position, bottomCenter, vector);
  var zenith = new Cesium.Cartesian3();
  Cesium.Matrix3.multiplyByVector(rotation, vector, zenith);
  Cesium.Cartesian3.add(zenith, bottomCenter, zenith);

  // Actually rotate around the zenith normal
  var transform = Cesium.Matrix4.fromTranslation(zenith);
  var rotateAroundAxis = exports.rotateAroundAxis;
  rotateAroundAxis(camera, heading, zenith, transform, opt_options);
};

/**
 * Get the 3D position of the given pixel of the canvas.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.Cartesian2} pixel
 * @return {!Cesium.Cartesian3|undefined}
 * @api
 */
exports.pickOnTerrainOrEllipsoid = function (scene, pixel) {
  var ray = scene.camera.getPickRay(pixel);
  var target = scene.globe.pick(ray, scene);
  return target || scene.camera.pickEllipsoid(pixel);
};

/**
 * Get the 3D position of the point at the bottom-center of the screen.
 * @param {!Cesium.Scene} scene
 * @return {!Cesium.Cartesian3|undefined}
 * @api
 */
exports.pickBottomPoint = function (scene) {
  var canvas = scene.canvas;
  var bottom = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight);
  return exports.pickOnTerrainOrEllipsoid(scene, bottom);
};

/**
 * Get the 3D position of the point at the center of the screen.
 * @param {!Cesium.Scene} scene
 * @return {!Cesium.Cartesian3|undefined}
 * @api
 */
exports.pickCenterPoint = function (scene) {
  var canvas = scene.canvas;
  var center = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2);
  return exports.pickOnTerrainOrEllipsoid(scene, center);
};

/**
 * Compute the signed tilt angle on globe, between the opposite of the
 * camera direction and the target normal. Return undefined if there is no
 * intersection of the camera direction with the globe.
 * @param {!Cesium.Scene} scene
 * @return {number|undefined}
 * @api
 */
exports.computeSignedTiltAngleOnGlobe = function (scene) {
  var camera = scene.camera;
  var ray = new Cesium.Ray(camera.position, camera.direction);
  var target = scene.globe.pick(ray, scene);

  if (!target) {
    // no tiles in the area were loaded?
    var ellipsoid = Cesium.Ellipsoid.WGS84;
    var obj = Cesium.IntersectionTests.rayEllipsoid(ray, ellipsoid);
    if (obj) {
      target = Cesium.Ray.getPoint(ray, obj.start);
    }
  }

  if (!target) {
    return undefined;
  }

  var normal = new Cesium.Cartesian3();
  Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(target, normal);

  var angleBetween = exports.signedAngleBetween;
  var angle = angleBetween(camera.direction, normal, camera.right) - Math.PI;
  return Cesium.Math.convertLongitudeRange(angle);
};

/**
 * Compute the ray from the camera to the bottom-center of the screen.
 * @param {!Cesium.Scene} scene
 * @return {!Cesium.Ray}
 */
exports.bottomFovRay = function (scene) {
  var camera = scene.camera;
  var fovy2 = camera.frustum.fovy / 2;
  var direction = camera.direction;
  var rotation = Cesium.Quaternion.fromAxisAngle(camera.right, fovy2);
  var matrix = Cesium.Matrix3.fromQuaternion(rotation);
  var vector = new Cesium.Cartesian3();
  Cesium.Matrix3.multiplyByVector(matrix, direction, vector);
  return new Cesium.Ray(camera.position, vector);
};

/**
 * Compute the angle between two Cartesian3.
 * @param {!Cesium.Cartesian3} first
 * @param {!Cesium.Cartesian3} second
 * @param {!Cesium.Cartesian3} normal Normal to test orientation against.
 * @return {number}
 */
exports.signedAngleBetween = function (first, second, normal) {
  // We are using the dot for the angle.
  // Then the cross and the dot for the sign.
  var a = new Cesium.Cartesian3();
  var b = new Cesium.Cartesian3();
  var c = new Cesium.Cartesian3();
  Cesium.Cartesian3.normalize(first, a);
  Cesium.Cartesian3.normalize(second, b);
  Cesium.Cartesian3.cross(a, b, c);

  var cosine = Cesium.Cartesian3.dot(a, b);
  var sine = Cesium.Cartesian3.magnitude(c);

  // Sign of the vector product and the orientation normal
  var sign = Cesium.Cartesian3.dot(normal, c);
  var angle = Math.atan2(sine, cosine);
  return sign >= 0 ? angle : -angle;
};

/**
 * Compute the rotation angle around a given point, needed to reach the
 * zenith position.
 * At a zenith position, the camera direction is going througth the earth
 * center and the frustrum bottom ray is going through the chosen pivot
 * point.
 * The bottom-center of the screen is a good candidate for the pivot point.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.Cartesian3} pivot Point around which the camera rotates.
 * @return {number}
 * @api
 */
exports.computeAngleToZenith = function (scene, pivot) {
  // This angle is the sum of the angles 'fy' and 'a', which are defined
  // using the pivot point and its surface normal.
  //        Zenith |    camera
  //           \   |   /
  //            \fy|  /
  //             \ |a/
  //              \|/pivot
  var camera = scene.camera;
  var fy = camera.frustum.fovy / 2;
  var ray = exports.bottomFovRay(scene);
  var direction = Cesium.Cartesian3.clone(ray.direction);
  Cesium.Cartesian3.negate(direction, direction);

  var normal = new Cesium.Cartesian3();
  Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(pivot, normal);

  var left = new Cesium.Cartesian3();
  Cesium.Cartesian3.negate(camera.right, left);

  var a = exports.signedAngleBetween(normal, direction, left);
  return a + fy;
};

/**
 * Convert an OpenLayers extent to a Cesium rectangle.
 * @param {ol.Extent} extent Extent.
 * @param {ol.ProjectionLike} projection Extent projection.
 * @return {Cesium.Rectangle} The corresponding Cesium rectangle.
 * @api
 */
exports.extentToRectangle = function (extent, projection) {
  if (extent && projection) {
    var ext = ol_proj_js__WEBPACK_IMPORTED_MODULE_4__["transformExtent"](extent, projection, 'EPSG:4326');
    return Cesium.Rectangle.fromDegrees(ext[0], ext[1], ext[2], ext[3]);
  } else {
    return null;
  }
};

/**
 * Creates Cesium.ImageryLayer best corresponding to the given ol.layer.Layer.
 * Only supports raster layers
 * @param {!ol.Map} olMap
 * @param {!ol.layer.Base} olLayer
 * @param {!ol.proj.Projection} viewProj Projection of the view.
 * @return {?Cesium.ImageryLayer} null if not possible (or supported)
 * @api
 */
exports.tileLayerToImageryLayer = function (olMap, olLayer, viewProj) {

  if (!(olLayer instanceof ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_2___default.a) && !(olLayer instanceof ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3___default.a)) {
    return null;
  }

  var provider = null;
  var source = olLayer.getSource();

  // Convert ImageWMS to TileWMS
  if (source instanceof ol_source_ImageWMS_js__WEBPACK_IMPORTED_MODULE_5___default.a && source.getUrl() && source.getImageLoadFunction() === ol_source_Image_js__WEBPACK_IMPORTED_MODULE_8__["defaultImageLoadFunction"]) {
    var sourceProps = {
      'olcs.proxy': source.get('olcs.proxy'),
      'olcs.extent': source.get('olcs.extent'),
      'olcs.projection': source.get('olcs.projection'),
      'olcs.imagesource': source
    };
    source = new ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_7___default.a({
      url: source.getUrl(),
      attributions: source.getAttributions(),
      projection: source.getProjection(),
      params: source.getParams()
    });
    source.setProperties(sourceProps);
  }

  if (source instanceof ol_source_TileImage_js__WEBPACK_IMPORTED_MODULE_6___default.a) {
    var projection = _util_js__WEBPACK_IMPORTED_MODULE_10__["default"].getSourceProjection(source);

    if (!projection) {
      // if not explicit, assume the same projection as view
      projection = viewProj;
    }

    if (exports.isCesiumProjection(projection)) {
      provider = new _core_OLImageryProvider_js__WEBPACK_IMPORTED_MODULE_9__["default"](olMap, source, viewProj);
    }
    // Projection not supported by Cesium
    else {
        return null;
      }
  } else {
    // sources other than TileImage are currently not supported
    return null;
  }

  // the provider is always non-null if we got this far

  var layerOptions = {};

  var forcedExtent = /** @type {ol.Extent} */olLayer.get('olcs.extent');
  var ext = forcedExtent || olLayer.getExtent();
  if (ext) {
    layerOptions.rectangle = exports.extentToRectangle(ext, viewProj);
  }

  var cesiumLayer = new Cesium.ImageryLayer(provider, layerOptions);
  return cesiumLayer;
};

/**
 * Synchronizes the layer rendering properties (opacity, visible)
 * to the given Cesium ImageryLayer.
 * @param {olcsx.LayerWithParents} olLayerWithParents
 * @param {!Cesium.ImageryLayer} csLayer
 * @api
 */
exports.updateCesiumLayerProperties = function (olLayerWithParents, csLayer) {
  var opacity = 1;
  var visible = true;
  [olLayerWithParents.layer].concat(olLayerWithParents.parents).forEach(function (olLayer) {
    var layerOpacity = olLayer.getOpacity();
    if (layerOpacity !== undefined) {
      opacity *= layerOpacity;
    }
    var layerVisible = olLayer.getVisible();
    if (layerVisible !== undefined) {
      visible &= layerVisible;
    }
  });
  csLayer.alpha = opacity;
  csLayer.show = visible;
};

/**
 * Convert a 2D or 3D OpenLayers coordinate to Cesium.
 * @param {ol.Coordinate} coordinate Ol3 coordinate.
 * @return {!Cesium.Cartesian3} Cesium cartesian coordinate
 * @api
 */
exports.ol4326CoordinateToCesiumCartesian = function (coordinate) {
  var coo = coordinate;
  return coo.length > 2 ? Cesium.Cartesian3.fromDegrees(coo[0], coo[1], coo[2]) : Cesium.Cartesian3.fromDegrees(coo[0], coo[1]);
};

/**
 * Convert an array of 2D or 3D OpenLayers coordinates to Cesium.
 * @param {Array.<!ol.Coordinate>} coordinates Ol3 coordinates.
 * @return {!Array.<Cesium.Cartesian3>} Cesium cartesian coordinates
 * @api
 */
exports.ol4326CoordinateArrayToCsCartesians = function (coordinates) {
  goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__["default"].assert(coordinates !== null);
  var toCartesian = exports.ol4326CoordinateToCesiumCartesian;
  var cartesians = [];
  for (var i = 0; i < coordinates.length; ++i) {
    cartesians.push(toCartesian(coordinates[i]));
  }
  return cartesians;
};

/**
 * Reproject an OpenLayers geometry to EPSG:4326 if needed.
 * The geometry will be cloned only when original projection is not EPSG:4326
 * and the properties will be shallow copied.
 * @param {!T} geometry
 * @param {!ol.ProjectionLike} projection
 * @return {!T}
 * @template T
 * @api
 */
exports.olGeometryCloneTo4326 = function (geometry, projection) {
  goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__["default"].assert(projection);

  var proj4326 = ol_proj_js__WEBPACK_IMPORTED_MODULE_4__["get"]('EPSG:4326');
  var proj = ol_proj_js__WEBPACK_IMPORTED_MODULE_4__["get"](projection);
  if (proj !== proj4326) {
    var properties = geometry.getProperties();
    geometry = geometry.clone();
    geometry.transform(proj, proj4326);
    geometry.setProperties(properties);
  }
  return geometry;
};

/**
 * Convert an OpenLayers color to Cesium.
 * @param {ol.Color|CanvasGradient|CanvasPattern|string} olColor
 * @return {!Cesium.Color}
 * @api
 */
exports.convertColorToCesium = function (olColor) {
  olColor = olColor || 'black';
  if (Array.isArray(olColor)) {
    return new Cesium.Color(Cesium.Color.byteToFloat(olColor[0]), Cesium.Color.byteToFloat(olColor[1]), Cesium.Color.byteToFloat(olColor[2]), olColor[3]);
  } else if (typeof olColor == 'string') {
    return Cesium.Color.fromCssColorString(olColor);
  }
  goog_asserts_js__WEBPACK_IMPORTED_MODULE_1__["default"].fail('impossible');
};

/**
 * Convert an OpenLayers url to Cesium.
 * @param {string} url
 * @return {!olcsx.core.CesiumUrlDefinition}
 * @api
 */
exports.convertUrlToCesium = function (url) {
  var subdomains = '';
  var re = /\{(\d|[a-z])-(\d|[a-z])\}/;
  var match = re.exec(url);
  if (match) {
    url = url.replace(re, '{s}');
    var startCharCode = match[1].charCodeAt(0);
    var stopCharCode = match[2].charCodeAt(0);
    var charCode = void 0;
    for (charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
      subdomains += String.fromCharCode(charCode);
    }
  }
  return {
    url: url,
    subdomains: subdomains
  };
};

/**
 * Animate the return to a top-down view from the zenith.
 * The camera is rotated to orient to the North.
 * @param {!ol.Map} map
 * @param {!Cesium.Scene} scene
 * @return {Promise<undefined>}
 * @api
 */
exports.resetToNorthZenith = function (map, scene) {
  return new Promise(function (resolve, reject) {
    var camera = scene.camera;
    var pivot = exports.pickBottomPoint(scene);
    if (!pivot) {
      reject('Could not get bottom pivot');
      return;
    }

    var currentHeading = map.getView().getRotation();
    if (currentHeading === undefined) {
      reject('The view is not initialized');
      return;
    }
    var angle = exports.computeAngleToZenith(scene, pivot);

    // Point to North
    exports.setHeadingUsingBottomCenter(scene, currentHeading, pivot);

    // Go to zenith
    var transform = Cesium.Matrix4.fromTranslation(pivot);
    var axis = camera.right;
    var options = {
      callback: function callback() {
        var view = map.getView();
        exports.normalizeView(view);
        resolve();
      }
    };
    exports.rotateAroundAxis(camera, -angle, axis, transform, options);
  });
};

/**
 * @param {!Cesium.Scene} scene
 * @param {number} angle in radian
 * @return {Promise<undefined>}
 * @api
 */
exports.rotateAroundBottomCenter = function (scene, angle) {
  return new Promise(function (resolve, reject) {
    var camera = scene.camera;
    var pivot = exports.pickBottomPoint(scene);
    if (!pivot) {
      reject('could not get bottom pivot');
      return;
    }

    var options = { callback: resolve };
    var transform = Cesium.Matrix4.fromTranslation(pivot);
    var axis = camera.right;
    var rotateAroundAxis = exports.rotateAroundAxis;
    rotateAroundAxis(camera, -angle, axis, transform, options);
  });
};

/**
 * Set the OpenLayers view to a specific rotation and
 * the nearest resolution.
 * @param {ol.View} view
 * @param {number=} angle
 * @api
 */
exports.normalizeView = function (view) {
  var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var resolution = view.getResolution();
  view.setRotation(angle);
  view.setResolution(view.constrainResolution(resolution));
};

/**
 * Check if the given projection is managed by Cesium (WGS84 or Mercator Spheric)
 *
 * @param {ol.proj.Projection} projection Projection to check.
 * @returns {boolean} Whether it's managed by Cesium.
 */
exports.isCesiumProjection = function (projection) {
  var is3857 = projection === ol_proj_js__WEBPACK_IMPORTED_MODULE_4__["get"]('EPSG:3857');
  var is4326 = projection === ol_proj_js__WEBPACK_IMPORTED_MODULE_4__["get"]('EPSG:4326');
  return is3857 || is4326;
};

/* harmony default export */ __webpack_exports__["default"] = (exports);

/***/ }),

/***/ "./src/olcs/core/OLImageryProvider.js":
/*!********************************************!*\
  !*** ./src/olcs/core/OLImageryProvider.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util.js */ "./src/olcs/util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module olcs.core.OLImageryProvider
 */



var OLImageryProvider /* should not extend Cesium.ImageryProvider */ = function () {
  /**
   * Special class derived from Cesium.ImageryProvider
   * that is connected to the given ol.source.TileImage.
   * @param {!ol.Map} olMap
   * @param {!ol.source.TileImage} source
   * @param {ol.proj.Projection=} opt_fallbackProj Projection to assume if the
   *                                               projection of the source is not defined.
   * @constructor
   * @extends {Cesium.ImageryProvider}
   */
  function OLImageryProvider(olMap, source, opt_fallbackProj) {
    var _this = this;

    _classCallCheck(this, OLImageryProvider);

    // Do not extend or call super constructor from
    // Cesium.ImageryProvider since this particular function is a
    // 'non instanciable interface' which throws on instanciation.

    /**
     * @type {!ol.source.TileImage}
     * @private
     */
    this.source_ = source;

    /**
     * @type {?ol.proj.Projection}
     * @private
     */
    this.projection_ = null;

    /**
     * @type {?ol.proj.Projection}
     * @private
     */
    this.fallbackProj_ = opt_fallbackProj || null;

    /**
     * @type {boolean}
     * @private
     */
    this.ready_ = false;

    /**
     * @type {?Cesium.TilingScheme}
     * @private
     */
    this.tilingScheme_ = null;

    /**
     * @type {?Cesium.Rectangle}
     * @private
     */
    this.rectangle_ = null;

    /**
     * @type {!ol.Map}
     * @private
     */
    this.map_ = olMap;

    var proxy = this.source_.get('olcs.proxy');
    if (proxy) {
      if (typeof proxy === 'function') {
        this.proxy_ = {
          'getURL': proxy
        };
      } else if (typeof proxy === 'string') {
        this.proxy_ = new Cesium.DefaultProxy(proxy);
      }
    }

    this.errorEvent_ = new Cesium.Event();

    this.emptyCanvas_ = document.createElement('canvas');
    this.emptyCanvas_.width = 1;
    this.emptyCanvas_.height = 1;

    this.source_.on('change', function (e) {
      _this.handleSourceChanged_();
    });
    this.handleSourceChanged_();
  }

  /**
   * Checks if the underlying source is ready and cached required data.
   * @private
   */


  OLImageryProvider.prototype.handleSourceChanged_ = function handleSourceChanged_(frameState) {
    if (!this.ready_ && this.source_.getState() == 'ready') {
      this.projection_ = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].getSourceProjection(this.source_) || this.fallbackProj_;
      if (this.projection_ == ol_proj_js__WEBPACK_IMPORTED_MODULE_0__["get"]('EPSG:4326')) {
        this.tilingScheme_ = new Cesium.GeographicTilingScheme();
      } else if (this.projection_ == ol_proj_js__WEBPACK_IMPORTED_MODULE_0__["get"]('EPSG:3857')) {
        this.tilingScheme_ = new Cesium.WebMercatorTilingScheme();
      } else {
        return;
      }
      this.rectangle_ = this.tilingScheme_.rectangle;

      this.ready_ = true;
    }
  };

  /**
   * Generates the proper attributions for a given position and zoom
   * level.
   * @export
   * @override
   */


  OLImageryProvider.prototype.getTileCredits = function getTileCredits(x, y, level) {
    var olExtent = this.map_.getView().calculateExtent(this.map_.getSize());
    var zoom = this.tilingScheme_ instanceof Cesium.GeographicTilingScheme ? level + 1 : level;

    var frameState = {
      viewState: { zoom: zoom },
      extent: olExtent
    };

    var attributionsFunction = this.source_.getAttributions();
    if (!attributionsFunction) {
      return [];
    }
    var attributions = attributionsFunction(frameState);
    if (!Array.isArray(attributions)) {
      attributions = [attributions];
    }

    return attributions.map(function (html) {
      return new Cesium.Credit(html, true);
    });
  };

  /**
   * @export
   * @override
   */


  OLImageryProvider.prototype.requestImage = function requestImage(x, y, level) {
    var tileUrlFunction = this.source_.getTileUrlFunction();
    if (tileUrlFunction && this.projection_) {

      // Perform mapping of Cesium tile coordinates to OpenLayers tile coordinates:
      // 1) Cesium zoom level 0 is OpenLayers zoom level 1 for EPSG:4326
      var z_ = this.tilingScheme_ instanceof Cesium.GeographicTilingScheme ? level + 1 : level;
      // 2) OpenLayers tile coordinates increase from bottom to top
      var y_ = -y - 1;

      var url = tileUrlFunction.call(this.source_, [z_, x, y_], 1, this.projection_);
      if (this.proxy_) {
        url = this.proxy_.getURL(url);
      }
      return url ? Cesium.ImageryProvider.loadImage(this, url) : this.emptyCanvas_;
    } else {
      // return empty canvas to stop Cesium from retrying later
      return this.emptyCanvas_;
    }
  };

  return OLImageryProvider;
}();

// definitions of getters that are required to be present
// in the Cesium.ImageryProvider instance:


Object.defineProperties(OLImageryProvider.prototype, {
  'ready': {
    'get': /** @this {olcs.core.OLImageryProvider} */
    function get() {
      return this.ready_;
    }
  },

  'rectangle': {
    'get': /** @this {olcs.core.OLImageryProvider} */
    function get() {
      return this.rectangle_;
    }
  },

  'tileWidth': {
    'get': /** @this {olcs.core.OLImageryProvider} */
    function get() {
      var tg = this.source_.getTileGrid();
      return tg ? Array.isArray(tg.getTileSize(0)) ? tg.getTileSize(0)[0] : tg.getTileSize(0) : 256;
    }
  },

  'tileHeight': {
    'get': /** @this {olcs.core.OLImageryProvider} */
    function get() {
      var tg = this.source_.getTileGrid();
      return tg ? Array.isArray(tg.getTileSize(0)) ? tg.getTileSize(0)[1] : tg.getTileSize(0) : 256;
    }
  },

  'maximumLevel': {
    'get': /** @this {olcs.core.OLImageryProvider} */
    function get() {
      var tg = this.source_.getTileGrid();
      return tg ? tg.getMaxZoom() : 18;
    }
  },

  'minimumLevel': {
    'get': /** @this {olcs.core.OLImageryProvider} */
    function get() {
      // WARNING: Do not use the minimum level (at least until the extent is
      // properly set). Cesium assumes the minimumLevel to contain only
      // a few tiles and tries to load them all at once -- this can
      // freeze and/or crash the browser !
      return 0;
      //var tg = this.source_.getTileGrid();
      //return tg ? tg.getMinZoom() : 0;
    }
  },

  'tilingScheme': {
    'get': /** @this {olcs.core.OLImageryProvider} */
    function get() {
      return this.tilingScheme_;
    }
  },

  'tileDiscardPolicy': {
    'get': function get() {
      return undefined;
    }
  },

  'errorEvent': {
    'get': /** @this {olcs.core.OLImageryProvider} */
    function get() {
      return this.errorEvent_;
    }
  },

  'proxy': {
    'get': /** @this {olcs.core.OLImageryProvider} */
    function get() {
      return this.proxy_;
    }
  },

  'hasAlphaChannel': {
    'get': function get() {
      return true;
    }
  },

  'pickFeatures': {
    'get': function get() {
      return undefined;
    }
  }
});

/* harmony default export */ __webpack_exports__["default"] = (OLImageryProvider);

/***/ }),

/***/ "./src/olcs/core/VectorLayerCounterpart.js":
/*!*************************************************!*\
  !*** ./src/olcs/core/VectorLayerCounterpart.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/Observable.js */ "ol/Observable.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module olcs.core.VectorLayerCounterpart
 */


var VectorLayerCounterpart = function () {
  /**
  * Result of the conversion of an OpenLayers layer to Cesium.
  * @param {!(ol.proj.Projection|string)} layerProjection
  * @param {!Cesium.Scene} scene
  */
  function VectorLayerCounterpart(layerProjection, scene) {
    _classCallCheck(this, VectorLayerCounterpart);

    var billboards = new Cesium.BillboardCollection({ scene: scene });
    var primitives = new Cesium.PrimitiveCollection();

    /**
    * @type {!Array.<ol.EventsKey>}
    */
    this.olListenKeys = [];

    this.rootCollection_ = new Cesium.PrimitiveCollection();
    /**
    * @type {!olcsx.core.OlFeatureToCesiumContext}
    */
    this.context = {
      projection: layerProjection,
      billboards: billboards,
      featureToCesiumMap: {},
      primitives: primitives
    };

    this.rootCollection_.add(billboards);
    this.rootCollection_.add(primitives);
  }

  /**
  * Unlisten.
  */


  VectorLayerCounterpart.prototype.destroy = function destroy() {
    this.olListenKeys.forEach(ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__["unByKey"]);
    this.olListenKeys.length = 0;
  };

  /**
  * @return {!Cesium.Primitive}
  */


  VectorLayerCounterpart.prototype.getRootPrimitive = function getRootPrimitive() {
    return this.rootCollection_;
  };

  return VectorLayerCounterpart;
}();

/* harmony default export */ __webpack_exports__["default"] = (VectorLayerCounterpart);

/***/ }),

/***/ "./src/olcs/math.js":
/*!**************************!*\
  !*** ./src/olcs/math.js ***!
  \**************************/
/*! exports provided: toDegrees, toRadians */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toDegrees", function() { return toDegrees; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRadians", function() { return toRadians; });
/**
 * Converts radians to to degrees.
 *
 * @param {number} angleInRadians Angle in radians.
 * @return {number} Angle in degrees.
 */
function toDegrees(angleInRadians) {
  return angleInRadians * 180 / Math.PI;
}

/**
 * Converts degrees to radians.
 *
 * @param {number} angleInDegrees Angle in degrees.
 * @return {number} Angle in radians.
 */
function toRadians(angleInDegrees) {
  return angleInDegrees * Math.PI / 180;
}

/***/ }),

/***/ "./src/olcs/util.js":
/*!**************************!*\
  !*** ./src/olcs/util.js ***!
  \**************************/
/*! exports provided: olcsListen, getUid, stableSort, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "olcsListen", function() { return olcsListen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUid", function() { return getUid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stableSort", function() { return stableSort; });
/**
 * @module olcs.util
 */
var exports = {};

/**
 * Cast to object.
 * @param {Object} param
 * @return {Object}
 */
exports.obj = function (param) {
  return param;
};

/**
 * @type {boolean|undefined}
 * @private
 */
exports.supportsImageRenderingPixelatedResult_ = undefined;

/**
 * @type {string|undefined}
 * @private
 */
exports.imageRenderingValueResult_ = undefined;

/**
 * @return {boolean}
 */
exports.supportsImageRenderingPixelated = function () {
  if (exports.supportsImageRenderingPixelatedResult_ === undefined) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('style', 'image-rendering: -moz-crisp-edges; image-rendering: pixelated;');
    // canvas.style.imageRendering will be undefined, null or an
    // empty string on unsupported browsers.
    var tmp = canvas.style['imageRendering']; // non standard
    exports.supportsImageRenderingPixelatedResult_ = !!tmp;
    if (exports.supportsImageRenderingPixelatedResult_) {
      exports.imageRenderingValueResult_ = tmp;
    }
  }
  return exports.supportsImageRenderingPixelatedResult_;
};

/**
 * @return {string}
 */
exports.imageRenderingValue = function () {
  exports.supportsImageRenderingPixelated();
  return exports.imageRenderingValueResult_ || '';
};

/**
 * Return the projection of the source that Cesium should use.
 *
 * @param {ol.source.Source} source Source.
 * @returns {ol.proj.Projection} The projection of the source.
 */
exports.getSourceProjection = function (source) {
  return (/** @type {ol.proj.Projection} */source.get('olcs.projection') || source.getProjection()
  );
};

/**
 * @param {ol.Observable} observable
 * @param {string} type
 * @param {Function} listener
 * @return {!ol.events.EventsKey}
 */
function olcsListen(observable, type, listener) {
  // See https://github.com/openlayers/openlayers/pull/8481
  // ol.events.listen is internal so we use `on` instead.
  // And since `on` as a convoluted API (can return an EventsKey or an array of them)
  // we use a cast here.
  return (/** @type {!ol.events.EventsKey} */observable.on(type, listener)
  );
}

/**
 * Counter for getUid.
 * @type {number}
 */
var uidCounter_ = 0;

/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. Unique IDs are generated
 * as a strictly increasing sequence. Adapted from goog.getUid.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
function getUid(obj) {
  return obj.olcs_uid || (obj.olcs_uid = ++uidCounter_);
}

/**
 * Sort the passed array such that the relative order of equal elements is preverved.
 * See https://en.wikipedia.org/wiki/Sorting_algorithm#Stability for details.
 * @param {Array<*>} arr The array to sort (modifies original).
 * @param {!function(*, *): number} compareFnc Comparison function.
 */
function stableSort(arr, compareFnc) {
  var length = arr.length;
  var tmp = Array(arr.length);
  for (var i = 0; i < length; i++) {
    tmp[i] = { index: i, value: arr[i] };
  }
  tmp.sort(function (a, b) {
    return compareFnc(a.value, b.value) || a.index - b.index;
  });
  for (var _i = 0; _i < arr.length; _i++) {
    arr[_i] = tmp[_i].value;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (exports);

/***/ }),

/***/ "ol/Observable.js":
/*!********************************!*\
  !*** external "ol.Observable" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.Observable;

/***/ }),

/***/ "ol/Overlay.js":
/*!*****************************!*\
  !*** external "ol.Overlay" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.Overlay;

/***/ }),

/***/ "ol/dom.js":
/*!*************************!*\
  !*** external "ol.dom" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.dom;

/***/ }),

/***/ "ol/easing.js":
/*!****************************!*\
  !*** external "ol.easing" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.easing;

/***/ }),

/***/ "ol/events.js":
/*!****************************!*\
  !*** external "ol.events" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.events;

/***/ }),

/***/ "ol/extent.js":
/*!****************************!*\
  !*** external "ol.extent" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.extent;

/***/ }),

/***/ "ol/geom/Geometry.js":
/*!***********************************!*\
  !*** external "ol.geom.Geometry" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.geom.Geometry;

/***/ }),

/***/ "ol/geom/Point.js":
/*!********************************!*\
  !*** external "ol.geom.Point" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.geom.Point;

/***/ }),

/***/ "ol/geom/Polygon.js":
/*!**********************************!*\
  !*** external "ol.geom.Polygon" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.geom.Polygon;

/***/ }),

/***/ "ol/geom/SimpleGeometry.js":
/*!*****************************************!*\
  !*** external "ol.geom.SimpleGeometry" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.geom.SimpleGeometry;

/***/ }),

/***/ "ol/layer/Group.js":
/*!*********************************!*\
  !*** external "ol.layer.Group" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.layer.Group;

/***/ }),

/***/ "ol/layer/Image.js":
/*!*********************************!*\
  !*** external "ol.layer.Image" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.layer.Image;

/***/ }),

/***/ "ol/layer/Layer.js":
/*!*********************************!*\
  !*** external "ol.layer.Layer" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.layer.Layer;

/***/ }),

/***/ "ol/layer/Tile.js":
/*!********************************!*\
  !*** external "ol.layer.Tile" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.layer.Tile;

/***/ }),

/***/ "ol/layer/Vector.js":
/*!**********************************!*\
  !*** external "ol.layer.Vector" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.layer.Vector;

/***/ }),

/***/ "ol/proj.js":
/*!**************************!*\
  !*** external "ol.proj" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.proj;

/***/ }),

/***/ "ol/source/Cluster.js":
/*!************************************!*\
  !*** external "ol.source.Cluster" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.Cluster;

/***/ }),

/***/ "ol/source/Image.js":
/*!**********************************!*\
  !*** external "ol.source.Image" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.Image;

/***/ }),

/***/ "ol/source/ImageWMS.js":
/*!*************************************!*\
  !*** external "ol.source.ImageWMS" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.ImageWMS;

/***/ }),

/***/ "ol/source/TileImage.js":
/*!**************************************!*\
  !*** external "ol.source.TileImage" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.TileImage;

/***/ }),

/***/ "ol/source/TileWMS.js":
/*!************************************!*\
  !*** external "ol.source.TileWMS" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.TileWMS;

/***/ }),

/***/ "ol/source/Vector.js":
/*!***********************************!*\
  !*** external "ol.source.Vector" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.source.Vector;

/***/ }),

/***/ "ol/style/Icon.js":
/*!********************************!*\
  !*** external "ol.style.Icon" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ol.style.Icon;

/***/ })

/******/ });
//# sourceMappingURL=olcesium.js.map