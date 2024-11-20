var y=Object.defineProperty;var n=(i,e)=>y(i,"name",{value:e,configurable:!0});var o=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports);var b=o((v,h)=>{"use strict";var p={after:`
`,beforeClose:`
`,beforeComment:`
`,beforeDecl:`
`,beforeOpen:" ",beforeRule:`
`,colon:": ",commentLeft:" ",commentRight:" ",emptyBody:"",indent:"    ",semicolon:!1};function d(i){return i[0].toUpperCase()+i.slice(1)}n(d,"capitalize");var u=class{static{n(this,"Stringifier")}constructor(e){this.builder=e}atrule(e,t){let r="@"+e.name,l=e.params?this.rawValue(e,"params"):"";if(typeof e.raws.afterName<"u"?r+=e.raws.afterName:l&&(r+=" "),e.nodes)this.block(e,r+l);else{let a=(e.raws.between||"")+(t?";":"");this.builder(r+l+a,e)}}beforeAfter(e,t){let r;e.type==="decl"?r=this.raw(e,null,"beforeDecl"):e.type==="comment"?r=this.raw(e,null,"beforeComment"):t==="before"?r=this.raw(e,null,"beforeRule"):r=this.raw(e,null,"beforeClose");let l=e.parent,a=0;for(;l&&l.type!=="root";)a+=1,l=l.parent;if(r.includes(`
`)){let f=this.raw(e,null,"indent");if(f.length)for(let s=0;s<a;s++)r+=f}return r}block(e,t){let r=this.raw(e,"between","beforeOpen");this.builder(t+r+"{",e,"start");let l;e.nodes&&e.nodes.length?(this.body(e),l=this.raw(e,"after")):l=this.raw(e,"after","emptyBody"),l&&this.builder(l),this.builder("}",e,"end")}body(e){let t=e.nodes.length-1;for(;t>0&&e.nodes[t].type==="comment";)t-=1;let r=this.raw(e,"semicolon");for(let l=0;l<e.nodes.length;l++){let a=e.nodes[l],f=this.raw(a,"before");f&&this.builder(f),this.stringify(a,t!==l||r)}}comment(e){let t=this.raw(e,"left","commentLeft"),r=this.raw(e,"right","commentRight");this.builder("/*"+t+e.text+r+"*/",e)}decl(e,t){let r=this.raw(e,"between","colon"),l=e.prop+r+this.rawValue(e,"value");e.important&&(l+=e.raws.important||" !important"),t&&(l+=";"),this.builder(l,e)}document(e){this.body(e)}raw(e,t,r){let l;if(r||(r=t),t&&(l=e.raws[t],typeof l<"u"))return l;let a=e.parent;if(r==="before"&&(!a||a.type==="root"&&a.first===e||a&&a.type==="document"))return"";if(!a)return p[r];let f=e.root();if(f.rawCache||(f.rawCache={}),typeof f.rawCache[r]<"u")return f.rawCache[r];if(r==="before"||r==="after")return this.beforeAfter(e,r);{let s="raw"+d(r);this[s]?l=this[s](f,e):f.walk(m=>{if(l=m.raws[t],typeof l<"u")return!1})}return typeof l>"u"&&(l=p[r]),f.rawCache[r]=l,l}rawBeforeClose(e){let t;return e.walk(r=>{if(r.nodes&&r.nodes.length>0&&typeof r.raws.after<"u")return t=r.raws.after,t.includes(`
`)&&(t=t.replace(/[^\n]+$/,"")),!1}),t&&(t=t.replace(/\S/g,"")),t}rawBeforeComment(e,t){let r;return e.walkComments(l=>{if(typeof l.raws.before<"u")return r=l.raws.before,r.includes(`
`)&&(r=r.replace(/[^\n]+$/,"")),!1}),typeof r>"u"?r=this.raw(t,null,"beforeDecl"):r&&(r=r.replace(/\S/g,"")),r}rawBeforeDecl(e,t){let r;return e.walkDecls(l=>{if(typeof l.raws.before<"u")return r=l.raws.before,r.includes(`
`)&&(r=r.replace(/[^\n]+$/,"")),!1}),typeof r>"u"?r=this.raw(t,null,"beforeRule"):r&&(r=r.replace(/\S/g,"")),r}rawBeforeOpen(e){let t;return e.walk(r=>{if(r.type!=="decl"&&(t=r.raws.between,typeof t<"u"))return!1}),t}rawBeforeRule(e){let t;return e.walk(r=>{if(r.nodes&&(r.parent!==e||e.first!==r)&&typeof r.raws.before<"u")return t=r.raws.before,t.includes(`
`)&&(t=t.replace(/[^\n]+$/,"")),!1}),t&&(t=t.replace(/\S/g,"")),t}rawColon(e){let t;return e.walkDecls(r=>{if(typeof r.raws.between<"u")return t=r.raws.between.replace(/[^\s:]/g,""),!1}),t}rawEmptyBody(e){let t;return e.walk(r=>{if(r.nodes&&r.nodes.length===0&&(t=r.raws.after,typeof t<"u"))return!1}),t}rawIndent(e){if(e.raws.indent)return e.raws.indent;let t;return e.walk(r=>{let l=r.parent;if(l&&l!==e&&l.parent&&l.parent===e&&typeof r.raws.before<"u"){let a=r.raws.before.split(`
`);return t=a[a.length-1],t=t.replace(/\S/g,""),!1}}),t}rawSemicolon(e){let t;return e.walk(r=>{if(r.nodes&&r.nodes.length&&r.last.type==="decl"&&(t=r.raws.semicolon,typeof t<"u"))return!1}),t}rawValue(e,t){let r=e[t],l=e.raws[t];return l&&l.value===r?l.raw:r}root(e){this.body(e),e.raws.after&&this.builder(e.raws.after)}rule(e){this.block(e,this.rawValue(e,"selector")),e.raws.ownSemicolon&&this.builder(e.raws.ownSemicolon,e,"end")}stringify(e,t){if(!this[e.type])throw new Error("Unknown AST node type "+e.type+". Maybe you need to change PostCSS stringifier.");this[e.type](e,t)}};h.exports=u;u.default=u});var k=o((B,c)=>{var g=b();function w(i,e){new g(e).stringify(i)}n(w,"stringify");c.exports=w;w.default=w});export default k();
//# sourceMappingURL=stringify.js.map
