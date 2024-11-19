var Te=Object.defineProperty;var f=(n,e)=>Te(n,"name",{value:e,configurable:!0});var d=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports);var q=d((tt,H)=>{var L=process||{},Y=L.argv||[],I=L.env||{},je=!(I.NO_COLOR||Y.includes("--no-color"))&&(!!I.FORCE_COLOR||Y.includes("--color")||L.platform==="win32"||(L.stdout||{}).isTTY&&I.TERM!=="dumb"||!!I.CI),_e=f((n,e,r=n)=>t=>{let i=""+t,s=i.indexOf(e,n.length);return~s?n+Ue(i,e,r,s)+e:n+i+e},"formatter"),Ue=f((n,e,r,t)=>{let i="",s=0;do i+=n.substring(s,t)+r,s=t+e.length,t=n.indexOf(e,s);while(~t);return i+n.substring(s)},"replaceClose"),V=f((n=je)=>{let e=n?_e:()=>String;return{isColorSupported:n,reset:e("\x1B[0m","\x1B[0m"),bold:e("\x1B[1m","\x1B[22m","\x1B[22m\x1B[1m"),dim:e("\x1B[2m","\x1B[22m","\x1B[22m\x1B[2m"),italic:e("\x1B[3m","\x1B[23m"),underline:e("\x1B[4m","\x1B[24m"),inverse:e("\x1B[7m","\x1B[27m"),hidden:e("\x1B[8m","\x1B[28m"),strikethrough:e("\x1B[9m","\x1B[29m"),black:e("\x1B[30m","\x1B[39m"),red:e("\x1B[31m","\x1B[39m"),green:e("\x1B[32m","\x1B[39m"),yellow:e("\x1B[33m","\x1B[39m"),blue:e("\x1B[34m","\x1B[39m"),magenta:e("\x1B[35m","\x1B[39m"),cyan:e("\x1B[36m","\x1B[39m"),white:e("\x1B[37m","\x1B[39m"),gray:e("\x1B[90m","\x1B[39m"),bgBlack:e("\x1B[40m","\x1B[49m"),bgRed:e("\x1B[41m","\x1B[49m"),bgGreen:e("\x1B[42m","\x1B[49m"),bgYellow:e("\x1B[43m","\x1B[49m"),bgBlue:e("\x1B[44m","\x1B[49m"),bgMagenta:e("\x1B[45m","\x1B[49m"),bgCyan:e("\x1B[46m","\x1B[49m"),bgWhite:e("\x1B[47m","\x1B[49m"),blackBright:e("\x1B[90m","\x1B[39m"),redBright:e("\x1B[91m","\x1B[39m"),greenBright:e("\x1B[92m","\x1B[39m"),yellowBright:e("\x1B[93m","\x1B[39m"),blueBright:e("\x1B[94m","\x1B[39m"),magentaBright:e("\x1B[95m","\x1B[39m"),cyanBright:e("\x1B[96m","\x1B[39m"),whiteBright:e("\x1B[97m","\x1B[39m"),bgBlackBright:e("\x1B[100m","\x1B[49m"),bgRedBright:e("\x1B[101m","\x1B[49m"),bgGreenBright:e("\x1B[102m","\x1B[49m"),bgYellowBright:e("\x1B[103m","\x1B[49m"),bgBlueBright:e("\x1B[104m","\x1B[49m"),bgMagentaBright:e("\x1B[105m","\x1B[49m"),bgCyanBright:e("\x1B[106m","\x1B[49m"),bgWhiteBright:e("\x1B[107m","\x1B[49m")}},"createColors");H.exports=V();H.exports.createColors=V});var ee=d((it,Z)=>{"use strict";var D=/[\t\n\f\r "#'()/;[\\\]{}]/g,T=/[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g,We=/.[\r\n"'(/\\]/,X=/[\da-f]/i;Z.exports=f(function(e,r={}){let t=e.css.valueOf(),i=r.ignoreErrors,s,l,u,o,v,h,m,x,c,B,b=t.length,a=0,E=[],g=[];function _(){return a}f(_,"position");function U(w){throw e.error("Unclosed "+w,a)}f(U,"unclosed");function Ie(){return g.length===0&&a>=b}f(Ie,"endOfFile");function Le(w){if(g.length)return g.pop();if(a>=b)return;let W=w?w.ignoreUnclosed:!1;switch(s=t.charCodeAt(a),s){case 10:case 32:case 9:case 13:case 12:{o=a;do o+=1,s=t.charCodeAt(o);while(s===32||s===10||s===9||s===13||s===12);h=["space",t.slice(a,o)],a=o-1;break}case 91:case 93:case 123:case 125:case 58:case 59:case 41:{let J=String.fromCharCode(s);h=[J,J,a];break}case 40:{if(B=E.length?E.pop()[1]:"",c=t.charCodeAt(a+1),B==="url"&&c!==39&&c!==34&&c!==32&&c!==10&&c!==9&&c!==12&&c!==13){o=a;do{if(m=!1,o=t.indexOf(")",o+1),o===-1)if(i||W){o=a;break}else U("bracket");for(x=o;t.charCodeAt(x-1)===92;)x-=1,m=!m}while(m);h=["brackets",t.slice(a,o+1),a,o],a=o}else o=t.indexOf(")",a+1),l=t.slice(a,o+1),o===-1||We.test(l)?h=["(","(",a]:(h=["brackets",l,a,o],a=o);break}case 39:case 34:{v=s===39?"'":'"',o=a;do{if(m=!1,o=t.indexOf(v,o+1),o===-1)if(i||W){o=a+1;break}else U("string");for(x=o;t.charCodeAt(x-1)===92;)x-=1,m=!m}while(m);h=["string",t.slice(a,o+1),a,o],a=o;break}case 64:{D.lastIndex=a+1,D.test(t),D.lastIndex===0?o=t.length-1:o=D.lastIndex-2,h=["at-word",t.slice(a,o+1),a,o],a=o;break}case 92:{for(o=a,u=!0;t.charCodeAt(o+1)===92;)o+=1,u=!u;if(s=t.charCodeAt(o+1),u&&s!==47&&s!==32&&s!==10&&s!==9&&s!==13&&s!==12&&(o+=1,X.test(t.charAt(o)))){for(;X.test(t.charAt(o+1));)o+=1;t.charCodeAt(o+1)===32&&(o+=1)}h=["word",t.slice(a,o+1),a,o],a=o;break}default:{s===47&&t.charCodeAt(a+1)===42?(o=t.indexOf("*/",a+2)+1,o===0&&(i||W?o=t.length:U("comment")),h=["comment",t.slice(a,o+1),a,o],a=o):(T.lastIndex=a+1,T.test(t),T.lastIndex===0?o=t.length-1:o=T.lastIndex-2,h=["word",t.slice(a,o+1),a,o],E.push(h),a=o);break}}return a++,h}f(Le,"nextToken");function De(w){g.push(w)}return f(De,"back"),{back:De,endOfFile:Ie,nextToken:Le,position:_}},"tokenizer")});var se=d((nt,ie)=>{"use strict";var p=q(),He=ee(),te;function qe(n){te=n}f(qe,"registerInput");var Me={";":p.yellow,":":p.yellow,"(":p.cyan,")":p.cyan,"[":p.yellow,"]":p.yellow,"{":p.yellow,"}":p.yellow,"at-word":p.cyan,brackets:p.cyan,call:p.cyan,class:p.yellow,comment:p.gray,hash:p.magenta,string:p.green};function Qe([n,e],r){if(n==="word"){if(e[0]===".")return"class";if(e[0]==="#")return"hash"}if(!r.endOfFile()){let t=r.nextToken();if(r.back(t),t[0]==="brackets"||t[0]==="(")return"call"}return n}f(Qe,"getTokenType");function re(n){let e=He(new te(n),{ignoreErrors:!0}),r="";for(;!e.endOfFile();){let t=e.nextToken(),i=Me[Qe(t,e)];i?r+=t[1].split(/\r?\n/).map(s=>i(s)).join(`
`):r+=t[1]}return r}f(re,"terminalHighlight");re.registerInput=qe;ie.exports=re});var ae=d((lt,le)=>{"use strict";var ne=q(),oe=se(),O=class n extends Error{static{f(this,"CssSyntaxError")}constructor(e,r,t,i,s,l){super(e),this.name="CssSyntaxError",this.reason=e,s&&(this.file=s),i&&(this.source=i),l&&(this.plugin=l),typeof r<"u"&&typeof t<"u"&&(typeof r=="number"?(this.line=r,this.column=t):(this.line=r.line,this.column=r.column,this.endLine=t.line,this.endColumn=t.column)),this.setMessage(),Error.captureStackTrace&&Error.captureStackTrace(this,n)}setMessage(){this.message=this.plugin?this.plugin+": ":"",this.message+=this.file?this.file:"<css input>",typeof this.line<"u"&&(this.message+=":"+this.line+":"+this.column),this.message+=": "+this.reason}showSourceCode(e){if(!this.source)return"";let r=this.source;e==null&&(e=ne.isColorSupported);let t=f(h=>h,"aside"),i=f(h=>h,"mark"),s=f(h=>h,"highlight");if(e){let{bold:h,gray:m,red:x}=ne.createColors(!0);i=f(c=>h(x(c)),"mark"),t=f(c=>m(c),"aside"),oe&&(s=f(c=>oe(c),"highlight"))}let l=r.split(/\r?\n/),u=Math.max(this.line-3,0),o=Math.min(this.line+2,l.length),v=String(o).length;return l.slice(u,o).map((h,m)=>{let x=u+1+m,c=" "+(" "+x).slice(-v)+" | ";if(x===this.line){if(h.length>160){let b=20,a=Math.max(0,this.column-b),E=Math.max(this.column+b,this.endColumn+b),g=h.slice(a,E),_=t(c.replace(/\d/g," "))+h.slice(0,Math.min(this.column-1,b-1)).replace(/[^\t]/g," ");return i(">")+t(c)+s(g)+`
 `+_+i("^")}let B=t(c.replace(/\d/g," "))+h.slice(0,this.column-1).replace(/[^\t]/g," ");return i(">")+t(c)+s(h)+`
 `+B+i("^")}return" "+t(c)+s(h)}).join(`
`)}toString(){let e=this.showSourceCode();return e&&(e=`

`+e+`
`),this.name+": "+this.message+e}};le.exports=O;O.default=O});var M=d((ft,ue)=>{"use strict";var fe={after:`
`,beforeClose:`
`,beforeComment:`
`,beforeDecl:`
`,beforeOpen:" ",beforeRule:`
`,colon:": ",commentLeft:" ",commentRight:" ",emptyBody:"",indent:"    ",semicolon:!1};function Fe(n){return n[0].toUpperCase()+n.slice(1)}f(Fe,"capitalize");var S=class{static{f(this,"Stringifier")}constructor(e){this.builder=e}atrule(e,r){let t="@"+e.name,i=e.params?this.rawValue(e,"params"):"";if(typeof e.raws.afterName<"u"?t+=e.raws.afterName:i&&(t+=" "),e.nodes)this.block(e,t+i);else{let s=(e.raws.between||"")+(r?";":"");this.builder(t+i+s,e)}}beforeAfter(e,r){let t;e.type==="decl"?t=this.raw(e,null,"beforeDecl"):e.type==="comment"?t=this.raw(e,null,"beforeComment"):r==="before"?t=this.raw(e,null,"beforeRule"):t=this.raw(e,null,"beforeClose");let i=e.parent,s=0;for(;i&&i.type!=="root";)s+=1,i=i.parent;if(t.includes(`
`)){let l=this.raw(e,null,"indent");if(l.length)for(let u=0;u<s;u++)t+=l}return t}block(e,r){let t=this.raw(e,"between","beforeOpen");this.builder(r+t+"{",e,"start");let i;e.nodes&&e.nodes.length?(this.body(e),i=this.raw(e,"after")):i=this.raw(e,"after","emptyBody"),i&&this.builder(i),this.builder("}",e,"end")}body(e){let r=e.nodes.length-1;for(;r>0&&e.nodes[r].type==="comment";)r-=1;let t=this.raw(e,"semicolon");for(let i=0;i<e.nodes.length;i++){let s=e.nodes[i],l=this.raw(s,"before");l&&this.builder(l),this.stringify(s,r!==i||t)}}comment(e){let r=this.raw(e,"left","commentLeft"),t=this.raw(e,"right","commentRight");this.builder("/*"+r+e.text+t+"*/",e)}decl(e,r){let t=this.raw(e,"between","colon"),i=e.prop+t+this.rawValue(e,"value");e.important&&(i+=e.raws.important||" !important"),r&&(i+=";"),this.builder(i,e)}document(e){this.body(e)}raw(e,r,t){let i;if(t||(t=r),r&&(i=e.raws[r],typeof i<"u"))return i;let s=e.parent;if(t==="before"&&(!s||s.type==="root"&&s.first===e||s&&s.type==="document"))return"";if(!s)return fe[t];let l=e.root();if(l.rawCache||(l.rawCache={}),typeof l.rawCache[t]<"u")return l.rawCache[t];if(t==="before"||t==="after")return this.beforeAfter(e,t);{let u="raw"+Fe(t);this[u]?i=this[u](l,e):l.walk(o=>{if(i=o.raws[r],typeof i<"u")return!1})}return typeof i>"u"&&(i=fe[t]),l.rawCache[t]=i,i}rawBeforeClose(e){let r;return e.walk(t=>{if(t.nodes&&t.nodes.length>0&&typeof t.raws.after<"u")return r=t.raws.after,r.includes(`
`)&&(r=r.replace(/[^\n]+$/,"")),!1}),r&&(r=r.replace(/\S/g,"")),r}rawBeforeComment(e,r){let t;return e.walkComments(i=>{if(typeof i.raws.before<"u")return t=i.raws.before,t.includes(`
`)&&(t=t.replace(/[^\n]+$/,"")),!1}),typeof t>"u"?t=this.raw(r,null,"beforeDecl"):t&&(t=t.replace(/\S/g,"")),t}rawBeforeDecl(e,r){let t;return e.walkDecls(i=>{if(typeof i.raws.before<"u")return t=i.raws.before,t.includes(`
`)&&(t=t.replace(/[^\n]+$/,"")),!1}),typeof t>"u"?t=this.raw(r,null,"beforeRule"):t&&(t=t.replace(/\S/g,"")),t}rawBeforeOpen(e){let r;return e.walk(t=>{if(t.type!=="decl"&&(r=t.raws.between,typeof r<"u"))return!1}),r}rawBeforeRule(e){let r;return e.walk(t=>{if(t.nodes&&(t.parent!==e||e.first!==t)&&typeof t.raws.before<"u")return r=t.raws.before,r.includes(`
`)&&(r=r.replace(/[^\n]+$/,"")),!1}),r&&(r=r.replace(/\S/g,"")),r}rawColon(e){let r;return e.walkDecls(t=>{if(typeof t.raws.between<"u")return r=t.raws.between.replace(/[^\s:]/g,""),!1}),r}rawEmptyBody(e){let r;return e.walk(t=>{if(t.nodes&&t.nodes.length===0&&(r=t.raws.after,typeof r<"u"))return!1}),r}rawIndent(e){if(e.raws.indent)return e.raws.indent;let r;return e.walk(t=>{let i=t.parent;if(i&&i!==e&&i.parent&&i.parent===e&&typeof t.raws.before<"u"){let s=t.raws.before.split(`
`);return r=s[s.length-1],r=r.replace(/\S/g,""),!1}}),r}rawSemicolon(e){let r;return e.walk(t=>{if(t.nodes&&t.nodes.length&&t.last.type==="decl"&&(r=t.raws.semicolon,typeof r<"u"))return!1}),r}rawValue(e,r){let t=e[r],i=e.raws[r];return i&&i.value===t?i.raw:t}root(e){this.body(e),e.raws.after&&this.builder(e.raws.after)}rule(e){this.block(e,this.rawValue(e,"selector")),e.raws.ownSemicolon&&this.builder(e.raws.ownSemicolon,e,"end")}stringify(e,r){if(!this[e.type])throw new Error("Unknown AST node type "+e.type+". Maybe you need to change PostCSS stringifier.");this[e.type](e,r)}};ue.exports=S;S.default=S});var ce=d((ht,he)=>{"use strict";var $e=M();function Q(n,e){new $e(e).stringify(n)}f(Q,"stringify");he.exports=Q;Q.default=Q});var $=d((pt,F)=>{"use strict";F.exports.isClean=Symbol("isClean");F.exports.my=Symbol("my")});var j=d((dt,pe)=>{"use strict";var ze=ae(),Ge=M(),Ke=ce(),{isClean:A,my:Je}=$();function z(n,e){let r=new n.constructor;for(let t in n){if(!Object.prototype.hasOwnProperty.call(n,t)||t==="proxyCache")continue;let i=n[t],s=typeof i;t==="parent"&&s==="object"?e&&(r[t]=e):t==="source"?r[t]=i:Array.isArray(i)?r[t]=i.map(l=>z(l,r)):(s==="object"&&i!==null&&(i=z(i)),r[t]=i)}return r}f(z,"cloneNode");function N(n,e){if(e&&typeof e.offset<"u")return e.offset;let r=1,t=1,i=0;for(let s=0;s<n.length;s++){if(t===e.line&&r===e.column){i=s;break}n[s]===`
`?(r=1,t+=1):r+=1}return i}f(N,"sourceOffset");var k=class{static{f(this,"Node")}constructor(e={}){this.raws={},this[A]=!1,this[Je]=!0;for(let r in e)if(r==="nodes"){this.nodes=[];for(let t of e[r])typeof t.clone=="function"?this.append(t.clone()):this.append(t)}else this[r]=e[r]}addToError(e){if(e.postcssNode=this,e.stack&&this.source&&/\n\s{4}at /.test(e.stack)){let r=this.source;e.stack=e.stack.replace(/\n\s{4}at /,`$&${r.input.from}:${r.start.line}:${r.start.column}$&`)}return e}after(e){return this.parent.insertAfter(this,e),this}assign(e={}){for(let r in e)this[r]=e[r];return this}before(e){return this.parent.insertBefore(this,e),this}cleanRaws(e){delete this.raws.before,delete this.raws.after,e||delete this.raws.between}clone(e={}){let r=z(this);for(let t in e)r[t]=e[t];return r}cloneAfter(e={}){let r=this.clone(e);return this.parent.insertAfter(this,r),r}cloneBefore(e={}){let r=this.clone(e);return this.parent.insertBefore(this,r),r}error(e,r={}){if(this.source){let{end:t,start:i}=this.rangeBy(r);return this.source.input.error(e,{column:i.column,line:i.line},{column:t.column,line:t.line},r)}return new ze(e)}getProxyProcessor(){return{get(e,r){return r==="proxyOf"?e:r==="root"?()=>e.root().toProxy():e[r]},set(e,r,t){return e[r]===t||(e[r]=t,(r==="prop"||r==="value"||r==="name"||r==="params"||r==="important"||r==="text")&&e.markDirty()),!0}}}markClean(){this[A]=!0}markDirty(){if(this[A]){this[A]=!1;let e=this;for(;e=e.parent;)e[A]=!1}}next(){if(!this.parent)return;let e=this.parent.index(this);return this.parent.nodes[e+1]}positionBy(e){let r=this.source.start;if(e.index)r=this.positionInside(e.index);else if(e.word){let i=this.source.input.css.slice(N(this.source.input.css,this.source.start),N(this.source.input.css,this.source.end)).indexOf(e.word);i!==-1&&(r=this.positionInside(i))}return r}positionInside(e){let r=this.source.start.column,t=this.source.start.line,i=N(this.source.input.css,this.source.start),s=i+e;for(let l=i;l<s;l++)this.source.input.css[l]===`
`?(r=1,t+=1):r+=1;return{column:r,line:t}}prev(){if(!this.parent)return;let e=this.parent.index(this);return this.parent.nodes[e-1]}rangeBy(e){let r={column:this.source.start.column,line:this.source.start.line},t=this.source.end?{column:this.source.end.column+1,line:this.source.end.line}:{column:r.column+1,line:r.line};if(e.word){let s=this.source.input.css.slice(N(this.source.input.css,this.source.start),N(this.source.input.css,this.source.end)).indexOf(e.word);s!==-1&&(r=this.positionInside(s),t=this.positionInside(s+e.word.length))}else e.start?r={column:e.start.column,line:e.start.line}:e.index&&(r=this.positionInside(e.index)),e.end?t={column:e.end.column,line:e.end.line}:typeof e.endIndex=="number"?t=this.positionInside(e.endIndex):e.index&&(t=this.positionInside(e.index+1));return(t.line<r.line||t.line===r.line&&t.column<=r.column)&&(t={column:r.column+1,line:r.line}),{end:t,start:r}}raw(e,r){return new Ge().raw(this,e,r)}remove(){return this.parent&&this.parent.removeChild(this),this.parent=void 0,this}replaceWith(...e){if(this.parent){let r=this,t=!1;for(let i of e)i===this?t=!0:t?(this.parent.insertAfter(r,i),r=i):this.parent.insertBefore(r,i);t||this.remove()}return this}root(){let e=this;for(;e.parent&&e.parent.type!=="document";)e=e.parent;return e}toJSON(e,r){let t={},i=r==null;r=r||new Map;let s=0;for(let l in this){if(!Object.prototype.hasOwnProperty.call(this,l)||l==="parent"||l==="proxyCache")continue;let u=this[l];if(Array.isArray(u))t[l]=u.map(o=>typeof o=="object"&&o.toJSON?o.toJSON(null,r):o);else if(typeof u=="object"&&u.toJSON)t[l]=u.toJSON(null,r);else if(l==="source"){let o=r.get(u.input);o==null&&(o=s,r.set(u.input,s),s++),t[l]={end:u.end,inputId:o,start:u.start}}else t[l]=u}return i&&(t.inputs=[...r.keys()].map(l=>l.toJSON())),t}toProxy(){return this.proxyCache||(this.proxyCache=new Proxy(this,this.getProxyProcessor())),this.proxyCache}toString(e=Ke){e.stringify&&(e=e.stringify);let r="";return e(this,t=>{r+=t}),r}warn(e,r,t){let i={node:this};for(let s in t)i[s]=t[s];return e.warn(r,i)}get proxyOf(){return this}};pe.exports=k;k.default=k});var me=d((xt,de)=>{"use strict";var Ye=j(),R=class extends Ye{static{f(this,"Comment")}constructor(e){super(e),this.type="comment"}};de.exports=R;R.default=R});var ye=d((bt,xe)=>{"use strict";var Ve=j(),P=class extends Ve{static{f(this,"Declaration")}constructor(e){e&&typeof e.value<"u"&&typeof e.value!="string"&&(e={...e,value:String(e.value)}),super(e),this.type="decl"}get variable(){return this.prop.startsWith("--")||this.prop[0]==="$"}};xe.exports=P;P.default=P});var ke=d((wt,Ne)=>{"use strict";var be=me(),ge=ye(),Xe=j(),{isClean:we,my:Ce}=$(),G,Ee,Oe,K;function Se(n){return n.map(e=>(e.nodes&&(e.nodes=Se(e.nodes)),delete e.source,e))}f(Se,"cleanSource");function Ae(n){if(n[we]=!1,n.proxyOf.nodes)for(let e of n.proxyOf.nodes)Ae(e)}f(Ae,"markTreeDirty");var y=class n extends Xe{static{f(this,"Container")}append(...e){for(let r of e){let t=this.normalize(r,this.last);for(let i of t)this.proxyOf.nodes.push(i)}return this.markDirty(),this}cleanRaws(e){if(super.cleanRaws(e),this.nodes)for(let r of this.nodes)r.cleanRaws(e)}each(e){if(!this.proxyOf.nodes)return;let r=this.getIterator(),t,i;for(;this.indexes[r]<this.proxyOf.nodes.length&&(t=this.indexes[r],i=e(this.proxyOf.nodes[t],t),i!==!1);)this.indexes[r]+=1;return delete this.indexes[r],i}every(e){return this.nodes.every(e)}getIterator(){this.lastEach||(this.lastEach=0),this.indexes||(this.indexes={}),this.lastEach+=1;let e=this.lastEach;return this.indexes[e]=0,e}getProxyProcessor(){return{get(e,r){return r==="proxyOf"?e:e[r]?r==="each"||typeof r=="string"&&r.startsWith("walk")?(...t)=>e[r](...t.map(i=>typeof i=="function"?(s,l)=>i(s.toProxy(),l):i)):r==="every"||r==="some"?t=>e[r]((i,...s)=>t(i.toProxy(),...s)):r==="root"?()=>e.root().toProxy():r==="nodes"?e.nodes.map(t=>t.toProxy()):r==="first"||r==="last"?e[r].toProxy():e[r]:e[r]},set(e,r,t){return e[r]===t||(e[r]=t,(r==="name"||r==="params"||r==="selector")&&e.markDirty()),!0}}}index(e){return typeof e=="number"?e:(e.proxyOf&&(e=e.proxyOf),this.proxyOf.nodes.indexOf(e))}insertAfter(e,r){let t=this.index(e),i=this.normalize(r,this.proxyOf.nodes[t]).reverse();t=this.index(e);for(let l of i)this.proxyOf.nodes.splice(t+1,0,l);let s;for(let l in this.indexes)s=this.indexes[l],t<s&&(this.indexes[l]=s+i.length);return this.markDirty(),this}insertBefore(e,r){let t=this.index(e),i=t===0?"prepend":!1,s=this.normalize(r,this.proxyOf.nodes[t],i).reverse();t=this.index(e);for(let u of s)this.proxyOf.nodes.splice(t,0,u);let l;for(let u in this.indexes)l=this.indexes[u],t<=l&&(this.indexes[u]=l+s.length);return this.markDirty(),this}normalize(e,r){if(typeof e=="string")e=Se(Ee(e).nodes);else if(typeof e>"u")e=[];else if(Array.isArray(e)){e=e.slice(0);for(let i of e)i.parent&&i.parent.removeChild(i,"ignore")}else if(e.type==="root"&&this.type!=="document"){e=e.nodes.slice(0);for(let i of e)i.parent&&i.parent.removeChild(i,"ignore")}else if(e.type)e=[e];else if(e.prop){if(typeof e.value>"u")throw new Error("Value field is missed in node creation");typeof e.value!="string"&&(e.value=String(e.value)),e=[new ge(e)]}else if(e.selector||e.selectors)e=[new K(e)];else if(e.name)e=[new G(e)];else if(e.text)e=[new be(e)];else throw new Error("Unknown node type in node creation");return e.map(i=>(i[Ce]||n.rebuild(i),i=i.proxyOf,i.parent&&i.parent.removeChild(i),i[we]&&Ae(i),i.raws||(i.raws={}),typeof i.raws.before>"u"&&r&&typeof r.raws.before<"u"&&(i.raws.before=r.raws.before.replace(/\S/g,"")),i.parent=this.proxyOf,i))}prepend(...e){e=e.reverse();for(let r of e){let t=this.normalize(r,this.first,"prepend").reverse();for(let i of t)this.proxyOf.nodes.unshift(i);for(let i in this.indexes)this.indexes[i]=this.indexes[i]+t.length}return this.markDirty(),this}push(e){return e.parent=this,this.proxyOf.nodes.push(e),this}removeAll(){for(let e of this.proxyOf.nodes)e.parent=void 0;return this.proxyOf.nodes=[],this.markDirty(),this}removeChild(e){e=this.index(e),this.proxyOf.nodes[e].parent=void 0,this.proxyOf.nodes.splice(e,1);let r;for(let t in this.indexes)r=this.indexes[t],r>=e&&(this.indexes[t]=r-1);return this.markDirty(),this}replaceValues(e,r,t){return t||(t=r,r={}),this.walkDecls(i=>{r.props&&!r.props.includes(i.prop)||r.fast&&!i.value.includes(r.fast)||(i.value=i.value.replace(e,t))}),this.markDirty(),this}some(e){return this.nodes.some(e)}walk(e){return this.each((r,t)=>{let i;try{i=e(r,t)}catch(s){throw r.addToError(s)}return i!==!1&&r.walk&&(i=r.walk(e)),i})}walkAtRules(e,r){return r?e instanceof RegExp?this.walk((t,i)=>{if(t.type==="atrule"&&e.test(t.name))return r(t,i)}):this.walk((t,i)=>{if(t.type==="atrule"&&t.name===e)return r(t,i)}):(r=e,this.walk((t,i)=>{if(t.type==="atrule")return r(t,i)}))}walkComments(e){return this.walk((r,t)=>{if(r.type==="comment")return e(r,t)})}walkDecls(e,r){return r?e instanceof RegExp?this.walk((t,i)=>{if(t.type==="decl"&&e.test(t.prop))return r(t,i)}):this.walk((t,i)=>{if(t.type==="decl"&&t.prop===e)return r(t,i)}):(r=e,this.walk((t,i)=>{if(t.type==="decl")return r(t,i)}))}walkRules(e,r){return r?e instanceof RegExp?this.walk((t,i)=>{if(t.type==="rule"&&e.test(t.selector))return r(t,i)}):this.walk((t,i)=>{if(t.type==="rule"&&t.selector===e)return r(t,i)}):(r=e,this.walk((t,i)=>{if(t.type==="rule")return r(t,i)}))}get first(){if(this.proxyOf.nodes)return this.proxyOf.nodes[0]}get last(){if(this.proxyOf.nodes)return this.proxyOf.nodes[this.proxyOf.nodes.length-1]}};y.registerParse=n=>{Ee=n};y.registerRule=n=>{K=n};y.registerAtRule=n=>{G=n};y.registerRoot=n=>{Oe=n};Ne.exports=y;y.default=y;y.rebuild=n=>{n.type==="atrule"?Object.setPrototypeOf(n,G.prototype):n.type==="rule"?Object.setPrototypeOf(n,K.prototype):n.type==="decl"?Object.setPrototypeOf(n,ge.prototype):n.type==="comment"?Object.setPrototypeOf(n,be.prototype):n.type==="root"&&Object.setPrototypeOf(n,Oe.prototype),n[Ce]=!0,n.nodes&&n.nodes.forEach(e=>{y.rebuild(e)})}});var ve=d((Et,Pe)=>{"use strict";var Re=ke(),C=class extends Re{static{f(this,"AtRule")}constructor(e){super(e),this.type="atrule"}append(...e){return this.proxyOf.nodes||(this.nodes=[]),super.append(...e)}prepend(...e){return this.proxyOf.nodes||(this.nodes=[]),super.prepend(...e)}};Pe.exports=C;C.default=C;Re.registerAtRule(C)});var Ze=d((At,Be)=>{var St=ve();Be.exports=Node});export default Ze();
//# sourceMappingURL=node.d.js.map
