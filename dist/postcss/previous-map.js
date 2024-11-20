var Fe=Object.defineProperty;var u=(t,e)=>Fe(t,"name",{value:e,configurable:!0}),le=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var w=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var ce=w(J=>{var ae="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");J.encode=function(t){if(0<=t&&t<ae.length)return ae[t];throw new TypeError("Must be between 0 and 63: "+t)};J.decode=function(t){var e=65,r=90,n=97,o=122,i=48,s=57,l=43,a=47,c=26,f=52;return e<=t&&t<=r?t-e:n<=t&&t<=o?t-n+c:i<=t&&t<=s?t-i+f:t==l?62:t==a?63:-1}});var K=w(Z=>{var fe=ce(),X=5,he=1<<X,de=he-1,ge=he;function Pe(t){return t<0?(-t<<1)+1:(t<<1)+0}u(Pe,"toVLQSigned");function Be(t){var e=(t&1)===1,r=t>>1;return e?-r:r}u(Be,"fromVLQSigned");Z.encode=u(function(e){var r="",n,o=Pe(e);do n=o&de,o>>>=X,o>0&&(n|=ge),r+=fe.encode(n);while(o>0);return r},"base64VLQ_encode");Z.decode=u(function(e,r,n){var o=e.length,i=0,s=0,l,a;do{if(r>=o)throw new Error("Expected more digits in base 64 VLQ value.");if(a=fe.decode(e.charCodeAt(r++)),a===-1)throw new Error("Invalid base64 digit: "+e.charAt(r-1));l=!!(a&ge),a&=de,i=i+(a<<s),s+=X}while(l);n.value=Be(i),n.rest=r},"base64VLQ_decode")});var x=w(C=>{function We(t,e,r){if(e in t)return t[e];if(arguments.length===3)return r;throw new Error('"'+e+'" is a required argument.')}u(We,"getArg");C.getArg=We;var pe=/^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,ze=/^data:.+\,.+$/;function D(t){var e=t.match(pe);return e?{scheme:e[1],auth:e[2],host:e[3],port:e[4],path:e[5]}:null}u(D,"urlParse");C.urlParse=D;function G(t){var e="";return t.scheme&&(e+=t.scheme+":"),e+="//",t.auth&&(e+=t.auth+"@"),t.host&&(e+=t.host),t.port&&(e+=":"+t.port),t.path&&(e+=t.path),e}u(G,"urlGenerate");C.urlGenerate=G;var Qe=32;function $e(t){var e=[];return function(r){for(var n=0;n<e.length;n++)if(e[n].input===r){var o=e[0];return e[0]=e[n],e[n]=o,e[0].result}var i=t(r);return e.unshift({input:r,result:i}),e.length>Qe&&e.pop(),i}}u($e,"lruMemoize");var Y=$e(u(function(e){var r=e,n=D(e);if(n){if(!n.path)return e;r=n.path}for(var o=C.isAbsolute(r),i=[],s=0,l=0;;)if(s=l,l=r.indexOf("/",s),l===-1){i.push(r.slice(s));break}else for(i.push(r.slice(s,l));l<r.length&&r[l]==="/";)l++;for(var a,c=0,l=i.length-1;l>=0;l--)a=i[l],a==="."?i.splice(l,1):a===".."?c++:c>0&&(a===""?(i.splice(l+1,c),c=0):(i.splice(l,2),c--));return r=i.join("/"),r===""&&(r=o?"/":"."),n?(n.path=r,G(n)):r},"normalize"));C.normalize=Y;function ve(t,e){t===""&&(t="."),e===""&&(e=".");var r=D(e),n=D(t);if(n&&(t=n.path||"/"),r&&!r.scheme)return n&&(r.scheme=n.scheme),G(r);if(r||e.match(ze))return e;if(n&&!n.host&&!n.path)return n.host=e,G(n);var o=e.charAt(0)==="/"?e:Y(t.replace(/\/+$/,"")+"/"+e);return n?(n.path=o,G(n)):o}u(ve,"join");C.join=ve;C.isAbsolute=function(t){return t.charAt(0)==="/"||pe.test(t)};function Ve(t,e){t===""&&(t="."),t=t.replace(/\/$/,"");for(var r=0;e.indexOf(t+"/")!==0;){var n=t.lastIndexOf("/");if(n<0||(t=t.slice(0,n),t.match(/^([^\/]+:\/)?\/*$/)))return e;++r}return Array(r+1).join("../")+e.substr(t.length+1)}u(Ve,"relative");C.relative=Ve;var _e=function(){var t=Object.create(null);return!("__proto__"in t)}();function me(t){return t}u(me,"identity");function ke(t){return Se(t)?"$"+t:t}u(ke,"toSetString");C.toSetString=_e?me:ke;function Je(t){return Se(t)?t.slice(1):t}u(Je,"fromSetString");C.fromSetString=_e?me:Je;function Se(t){if(!t)return!1;var e=t.length;if(e<9||t.charCodeAt(e-1)!==95||t.charCodeAt(e-2)!==95||t.charCodeAt(e-3)!==111||t.charCodeAt(e-4)!==116||t.charCodeAt(e-5)!==111||t.charCodeAt(e-6)!==114||t.charCodeAt(e-7)!==112||t.charCodeAt(e-8)!==95||t.charCodeAt(e-9)!==95)return!1;for(var r=e-10;r>=0;r--)if(t.charCodeAt(r)!==36)return!1;return!0}u(Se,"isProtoString");function Xe(t,e,r){var n=b(t.source,e.source);return n!==0||(n=t.originalLine-e.originalLine,n!==0)||(n=t.originalColumn-e.originalColumn,n!==0||r)||(n=t.generatedColumn-e.generatedColumn,n!==0)||(n=t.generatedLine-e.generatedLine,n!==0)?n:b(t.name,e.name)}u(Xe,"compareByOriginalPositions");C.compareByOriginalPositions=Xe;function Ze(t,e,r){var n;return n=t.originalLine-e.originalLine,n!==0||(n=t.originalColumn-e.originalColumn,n!==0||r)||(n=t.generatedColumn-e.generatedColumn,n!==0)||(n=t.generatedLine-e.generatedLine,n!==0)?n:b(t.name,e.name)}u(Ze,"compareByOriginalPositionsNoSource");C.compareByOriginalPositionsNoSource=Ze;function Ke(t,e,r){var n=t.generatedLine-e.generatedLine;return n!==0||(n=t.generatedColumn-e.generatedColumn,n!==0||r)||(n=b(t.source,e.source),n!==0)||(n=t.originalLine-e.originalLine,n!==0)||(n=t.originalColumn-e.originalColumn,n!==0)?n:b(t.name,e.name)}u(Ke,"compareByGeneratedPositionsDeflated");C.compareByGeneratedPositionsDeflated=Ke;function Ye(t,e,r){var n=t.generatedColumn-e.generatedColumn;return n!==0||r||(n=b(t.source,e.source),n!==0)||(n=t.originalLine-e.originalLine,n!==0)||(n=t.originalColumn-e.originalColumn,n!==0)?n:b(t.name,e.name)}u(Ye,"compareByGeneratedPositionsDeflatedNoLine");C.compareByGeneratedPositionsDeflatedNoLine=Ye;function b(t,e){return t===e?0:t===null?1:e===null?-1:t>e?1:-1}u(b,"strcmp");function He(t,e){var r=t.generatedLine-e.generatedLine;return r!==0||(r=t.generatedColumn-e.generatedColumn,r!==0)||(r=b(t.source,e.source),r!==0)||(r=t.originalLine-e.originalLine,r!==0)||(r=t.originalColumn-e.originalColumn,r!==0)?r:b(t.name,e.name)}u(He,"compareByGeneratedPositionsInflated");C.compareByGeneratedPositionsInflated=He;function er(t){return JSON.parse(t.replace(/^\)]}'[^\n]*\n/,""))}u(er,"parseSourceMapInput");C.parseSourceMapInput=er;function rr(t,e,r){if(e=e||"",t&&(t[t.length-1]!=="/"&&e[0]!=="/"&&(t+="/"),e=t+e),r){var n=D(r);if(!n)throw new Error("sourceMapURL could not be parsed");if(n.path){var o=n.path.lastIndexOf("/");o>=0&&(n.path=n.path.substring(0,o+1))}e=ve(G(n),e)}return Y(e)}u(rr,"computeSourceURL");C.computeSourceURL=rr});var re=w(Ce=>{var H=x(),ee=Object.prototype.hasOwnProperty,R=typeof Map<"u";function E(){this._array=[],this._set=R?new Map:Object.create(null)}u(E,"ArraySet");E.fromArray=u(function(e,r){for(var n=new E,o=0,i=e.length;o<i;o++)n.add(e[o],r);return n},"ArraySet_fromArray");E.prototype.size=u(function(){return R?this._set.size:Object.getOwnPropertyNames(this._set).length},"ArraySet_size");E.prototype.add=u(function(e,r){var n=R?e:H.toSetString(e),o=R?this.has(e):ee.call(this._set,n),i=this._array.length;(!o||r)&&this._array.push(e),o||(R?this._set.set(e,i):this._set[n]=i)},"ArraySet_add");E.prototype.has=u(function(e){if(R)return this._set.has(e);var r=H.toSetString(e);return ee.call(this._set,r)},"ArraySet_has");E.prototype.indexOf=u(function(e){if(R){var r=this._set.get(e);if(r>=0)return r}else{var n=H.toSetString(e);if(ee.call(this._set,n))return this._set[n]}throw new Error('"'+e+'" is not in the set.')},"ArraySet_indexOf");E.prototype.at=u(function(e){if(e>=0&&e<this._array.length)return this._array[e];throw new Error("No element indexed by "+e)},"ArraySet_at");E.prototype.toArray=u(function(){return this._array.slice()},"ArraySet_toArray");Ce.ArraySet=E});var Me=w(Le=>{var ye=x();function nr(t,e){var r=t.generatedLine,n=e.generatedLine,o=t.generatedColumn,i=e.generatedColumn;return n>r||n==r&&i>=o||ye.compareByGeneratedPositionsInflated(t,e)<=0}u(nr,"generatedPositionAfter");function W(){this._array=[],this._sorted=!0,this._last={generatedLine:-1,generatedColumn:0}}u(W,"MappingList");W.prototype.unsortedForEach=u(function(e,r){this._array.forEach(e,r)},"MappingList_forEach");W.prototype.add=u(function(e){nr(this._last,e)?(this._last=e,this._array.push(e)):(this._sorted=!1,this._array.push(e))},"MappingList_add");W.prototype.toArray=u(function(){return this._sorted||(this._array.sort(ye.compareByGeneratedPositionsInflated),this._sorted=!0),this._array},"MappingList_toArray");Le.MappingList=W});var ne=w(we=>{var U=K(),m=x(),z=re().ArraySet,tr=Me().MappingList;function A(t){t||(t={}),this._file=m.getArg(t,"file",null),this._sourceRoot=m.getArg(t,"sourceRoot",null),this._skipValidation=m.getArg(t,"skipValidation",!1),this._ignoreInvalidMapping=m.getArg(t,"ignoreInvalidMapping",!1),this._sources=new z,this._names=new z,this._mappings=new tr,this._sourcesContents=null}u(A,"SourceMapGenerator");A.prototype._version=3;A.fromSourceMap=u(function(e,r){var n=e.sourceRoot,o=new A(Object.assign(r||{},{file:e.file,sourceRoot:n}));return e.eachMapping(function(i){var s={generated:{line:i.generatedLine,column:i.generatedColumn}};i.source!=null&&(s.source=i.source,n!=null&&(s.source=m.relative(n,s.source)),s.original={line:i.originalLine,column:i.originalColumn},i.name!=null&&(s.name=i.name)),o.addMapping(s)}),e.sources.forEach(function(i){var s=i;n!==null&&(s=m.relative(n,i)),o._sources.has(s)||o._sources.add(s);var l=e.sourceContentFor(i);l!=null&&o.setSourceContent(i,l)}),o},"SourceMapGenerator_fromSourceMap");A.prototype.addMapping=u(function(e){var r=m.getArg(e,"generated"),n=m.getArg(e,"original",null),o=m.getArg(e,"source",null),i=m.getArg(e,"name",null);!this._skipValidation&&this._validateMapping(r,n,o,i)===!1||(o!=null&&(o=String(o),this._sources.has(o)||this._sources.add(o)),i!=null&&(i=String(i),this._names.has(i)||this._names.add(i)),this._mappings.add({generatedLine:r.line,generatedColumn:r.column,originalLine:n!=null&&n.line,originalColumn:n!=null&&n.column,source:o,name:i}))},"SourceMapGenerator_addMapping");A.prototype.setSourceContent=u(function(e,r){var n=e;this._sourceRoot!=null&&(n=m.relative(this._sourceRoot,n)),r!=null?(this._sourcesContents||(this._sourcesContents=Object.create(null)),this._sourcesContents[m.toSetString(n)]=r):this._sourcesContents&&(delete this._sourcesContents[m.toSetString(n)],Object.keys(this._sourcesContents).length===0&&(this._sourcesContents=null))},"SourceMapGenerator_setSourceContent");A.prototype.applySourceMap=u(function(e,r,n){var o=r;if(r==null){if(e.file==null)throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);o=e.file}var i=this._sourceRoot;i!=null&&(o=m.relative(i,o));var s=new z,l=new z;this._mappings.unsortedForEach(function(a){if(a.source===o&&a.originalLine!=null){var c=e.originalPositionFor({line:a.originalLine,column:a.originalColumn});c.source!=null&&(a.source=c.source,n!=null&&(a.source=m.join(n,a.source)),i!=null&&(a.source=m.relative(i,a.source)),a.originalLine=c.line,a.originalColumn=c.column,c.name!=null&&(a.name=c.name))}var f=a.source;f!=null&&!s.has(f)&&s.add(f);var g=a.name;g!=null&&!l.has(g)&&l.add(g)},this),this._sources=s,this._names=l,e.sources.forEach(function(a){var c=e.sourceContentFor(a);c!=null&&(n!=null&&(a=m.join(n,a)),i!=null&&(a=m.relative(i,a)),this.setSourceContent(a,c))},this)},"SourceMapGenerator_applySourceMap");A.prototype._validateMapping=u(function(e,r,n,o){if(r&&typeof r.line!="number"&&typeof r.column!="number"){var i="original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";if(this._ignoreInvalidMapping)return typeof console<"u"&&console.warn&&console.warn(i),!1;throw new Error(i)}if(!(e&&"line"in e&&"column"in e&&e.line>0&&e.column>=0&&!r&&!n&&!o)){if(e&&"line"in e&&"column"in e&&r&&"line"in r&&"column"in r&&e.line>0&&e.column>=0&&r.line>0&&r.column>=0&&n)return;var i="Invalid mapping: "+JSON.stringify({generated:e,source:n,original:r,name:o});if(this._ignoreInvalidMapping)return typeof console<"u"&&console.warn&&console.warn(i),!1;throw new Error(i)}},"SourceMapGenerator_validateMapping");A.prototype._serializeMappings=u(function(){for(var e=0,r=1,n=0,o=0,i=0,s=0,l="",a,c,f,g,d=this._mappings.toArray(),p=0,_=d.length;p<_;p++){if(c=d[p],a="",c.generatedLine!==r)for(e=0;c.generatedLine!==r;)a+=";",r++;else if(p>0){if(!m.compareByGeneratedPositionsInflated(c,d[p-1]))continue;a+=","}a+=U.encode(c.generatedColumn-e),e=c.generatedColumn,c.source!=null&&(g=this._sources.indexOf(c.source),a+=U.encode(g-s),s=g,a+=U.encode(c.originalLine-1-o),o=c.originalLine-1,a+=U.encode(c.originalColumn-n),n=c.originalColumn,c.name!=null&&(f=this._names.indexOf(c.name),a+=U.encode(f-i),i=f)),l+=a}return l},"SourceMapGenerator_serializeMappings");A.prototype._generateSourcesContent=u(function(e,r){return e.map(function(n){if(!this._sourcesContents)return null;r!=null&&(n=m.relative(r,n));var o=m.toSetString(n);return Object.prototype.hasOwnProperty.call(this._sourcesContents,o)?this._sourcesContents[o]:null},this)},"SourceMapGenerator_generateSourcesContent");A.prototype.toJSON=u(function(){var e={version:this._version,sources:this._sources.toArray(),names:this._names.toArray(),mappings:this._serializeMappings()};return this._file!=null&&(e.file=this._file),this._sourceRoot!=null&&(e.sourceRoot=this._sourceRoot),this._sourcesContents&&(e.sourcesContent=this._generateSourcesContent(e.sources,e.sourceRoot)),e},"SourceMapGenerator_toJSON");A.prototype.toString=u(function(){return JSON.stringify(this.toJSON())},"SourceMapGenerator_toString");we.SourceMapGenerator=A});var Ae=w(N=>{N.GREATEST_LOWER_BOUND=1;N.LEAST_UPPER_BOUND=2;function te(t,e,r,n,o,i){var s=Math.floor((e-t)/2)+t,l=o(r,n[s],!0);return l===0?s:l>0?e-s>1?te(s,e,r,n,o,i):i==N.LEAST_UPPER_BOUND?e<n.length?e:-1:s:s-t>1?te(t,s,r,n,o,i):i==N.LEAST_UPPER_BOUND?s:t<0?-1:t}u(te,"recursiveSearch");N.search=u(function(e,r,n,o){if(r.length===0)return-1;var i=te(-1,r.length,e,r,n,o||N.GREATEST_LOWER_BOUND);if(i<0)return-1;for(;i-1>=0&&n(r[i],r[i-1],!0)===0;)--i;return i},"search")});var Ee=w(be=>{function or(t){function e(o,i,s){var l=o[i];o[i]=o[s],o[s]=l}u(e,"swap");function r(o,i){return Math.round(o+Math.random()*(i-o))}u(r,"randomIntInRange");function n(o,i,s,l){if(s<l){var a=r(s,l),c=s-1;e(o,a,l);for(var f=o[l],g=s;g<l;g++)i(o[g],f,!1)<=0&&(c+=1,e(o,c,g));e(o,c+1,g);var d=c+1;n(o,i,s,d-1),n(o,i,d+1,l)}}return u(n,"doQuickSort"),n}u(or,"SortTemplate");function ir(t){let e=or.toString();return new Function(`return ${e}`)()(t)}u(ir,"cloneSort");var Oe=new WeakMap;be.quickSort=function(t,e,r=0){let n=Oe.get(e);n===void 0&&(n=ir(e),Oe.set(e,n)),n(t,e,r,t.length-1)}});var Ie=w(Q=>{var h=x(),ie=Ae(),T=re().ArraySet,sr=K(),q=Ee().quickSort;function v(t,e){var r=t;return typeof t=="string"&&(r=h.parseSourceMapInput(t)),r.sections!=null?new O(r,e):new y(r,e)}u(v,"SourceMapConsumer");v.fromSourceMap=function(t,e){return y.fromSourceMap(t,e)};v.prototype._version=3;v.prototype.__generatedMappings=null;Object.defineProperty(v.prototype,"_generatedMappings",{configurable:!0,enumerable:!0,get:u(function(){return this.__generatedMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__generatedMappings},"get")});v.prototype.__originalMappings=null;Object.defineProperty(v.prototype,"_originalMappings",{configurable:!0,enumerable:!0,get:u(function(){return this.__originalMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__originalMappings},"get")});v.prototype._charIsMappingSeparator=u(function(e,r){var n=e.charAt(r);return n===";"||n===","},"SourceMapConsumer_charIsMappingSeparator");v.prototype._parseMappings=u(function(e,r){throw new Error("Subclasses must implement _parseMappings")},"SourceMapConsumer_parseMappings");v.GENERATED_ORDER=1;v.ORIGINAL_ORDER=2;v.GREATEST_LOWER_BOUND=1;v.LEAST_UPPER_BOUND=2;v.prototype.eachMapping=u(function(e,r,n){var o=r||null,i=n||v.GENERATED_ORDER,s;switch(i){case v.GENERATED_ORDER:s=this._generatedMappings;break;case v.ORIGINAL_ORDER:s=this._originalMappings;break;default:throw new Error("Unknown order of iteration.")}for(var l=this.sourceRoot,a=e.bind(o),c=this._names,f=this._sources,g=this._sourceMapURL,d=0,p=s.length;d<p;d++){var _=s[d],S=_.source===null?null:f.at(_.source);S!==null&&(S=h.computeSourceURL(l,S,g)),a({source:S,generatedLine:_.generatedLine,generatedColumn:_.generatedColumn,originalLine:_.originalLine,originalColumn:_.originalColumn,name:_.name===null?null:c.at(_.name)})}},"SourceMapConsumer_eachMapping");v.prototype.allGeneratedPositionsFor=u(function(e){var r=h.getArg(e,"line"),n={source:h.getArg(e,"source"),originalLine:r,originalColumn:h.getArg(e,"column",0)};if(n.source=this._findSourceIndex(n.source),n.source<0)return[];var o=[],i=this._findMapping(n,this._originalMappings,"originalLine","originalColumn",h.compareByOriginalPositions,ie.LEAST_UPPER_BOUND);if(i>=0){var s=this._originalMappings[i];if(e.column===void 0)for(var l=s.originalLine;s&&s.originalLine===l;)o.push({line:h.getArg(s,"generatedLine",null),column:h.getArg(s,"generatedColumn",null),lastColumn:h.getArg(s,"lastGeneratedColumn",null)}),s=this._originalMappings[++i];else for(var a=s.originalColumn;s&&s.originalLine===r&&s.originalColumn==a;)o.push({line:h.getArg(s,"generatedLine",null),column:h.getArg(s,"generatedColumn",null),lastColumn:h.getArg(s,"lastGeneratedColumn",null)}),s=this._originalMappings[++i]}return o},"SourceMapConsumer_allGeneratedPositionsFor");Q.SourceMapConsumer=v;function y(t,e){var r=t;typeof t=="string"&&(r=h.parseSourceMapInput(t));var n=h.getArg(r,"version"),o=h.getArg(r,"sources"),i=h.getArg(r,"names",[]),s=h.getArg(r,"sourceRoot",null),l=h.getArg(r,"sourcesContent",null),a=h.getArg(r,"mappings"),c=h.getArg(r,"file",null);if(n!=this._version)throw new Error("Unsupported version: "+n);s&&(s=h.normalize(s)),o=o.map(String).map(h.normalize).map(function(f){return s&&h.isAbsolute(s)&&h.isAbsolute(f)?h.relative(s,f):f}),this._names=T.fromArray(i.map(String),!0),this._sources=T.fromArray(o,!0),this._absoluteSources=this._sources.toArray().map(function(f){return h.computeSourceURL(s,f,e)}),this.sourceRoot=s,this.sourcesContent=l,this._mappings=a,this._sourceMapURL=e,this.file=c}u(y,"BasicSourceMapConsumer");y.prototype=Object.create(v.prototype);y.prototype.consumer=v;y.prototype._findSourceIndex=function(t){var e=t;if(this.sourceRoot!=null&&(e=h.relative(this.sourceRoot,e)),this._sources.has(e))return this._sources.indexOf(e);var r;for(r=0;r<this._absoluteSources.length;++r)if(this._absoluteSources[r]==t)return r;return-1};y.fromSourceMap=u(function(e,r){var n=Object.create(y.prototype),o=n._names=T.fromArray(e._names.toArray(),!0),i=n._sources=T.fromArray(e._sources.toArray(),!0);n.sourceRoot=e._sourceRoot,n.sourcesContent=e._generateSourcesContent(n._sources.toArray(),n.sourceRoot),n.file=e._file,n._sourceMapURL=r,n._absoluteSources=n._sources.toArray().map(function(p){return h.computeSourceURL(n.sourceRoot,p,r)});for(var s=e._mappings.toArray().slice(),l=n.__generatedMappings=[],a=n.__originalMappings=[],c=0,f=s.length;c<f;c++){var g=s[c],d=new Ne;d.generatedLine=g.generatedLine,d.generatedColumn=g.generatedColumn,g.source&&(d.source=i.indexOf(g.source),d.originalLine=g.originalLine,d.originalColumn=g.originalColumn,g.name&&(d.name=o.indexOf(g.name)),a.push(d)),l.push(d)}return q(n.__originalMappings,h.compareByOriginalPositions),n},"SourceMapConsumer_fromSourceMap");y.prototype._version=3;Object.defineProperty(y.prototype,"sources",{get:u(function(){return this._absoluteSources.slice()},"get")});function Ne(){this.generatedLine=0,this.generatedColumn=0,this.source=null,this.originalLine=null,this.originalColumn=null,this.name=null}u(Ne,"Mapping");var oe=h.compareByGeneratedPositionsDeflatedNoLine;function Re(t,e){let r=t.length,n=t.length-e;if(!(n<=1))if(n==2){let o=t[e],i=t[e+1];oe(o,i)>0&&(t[e]=i,t[e+1]=o)}else if(n<20)for(let o=e;o<r;o++)for(let i=o;i>e;i--){let s=t[i-1],l=t[i];if(oe(s,l)<=0)break;t[i-1]=l,t[i]=s}else q(t,oe,e)}u(Re,"sortGenerated");y.prototype._parseMappings=u(function(e,r){var n=1,o=0,i=0,s=0,l=0,a=0,c=e.length,f=0,g={},d={},p=[],_=[],S,qe,L,I,ue;let k=0;for(;f<c;)if(e.charAt(f)===";")n++,f++,o=0,Re(_,k),k=_.length;else if(e.charAt(f)===",")f++;else{for(S=new Ne,S.generatedLine=n,I=f;I<c&&!this._charIsMappingSeparator(e,I);I++);for(qe=e.slice(f,I),L=[];f<I;)sr.decode(e,f,d),ue=d.value,f=d.rest,L.push(ue);if(L.length===2)throw new Error("Found a source, but no line and column");if(L.length===3)throw new Error("Found a source and line, but no column");if(S.generatedColumn=o+L[0],o=S.generatedColumn,L.length>1&&(S.source=l+L[1],l+=L[1],S.originalLine=i+L[2],i=S.originalLine,S.originalLine+=1,S.originalColumn=s+L[3],s=S.originalColumn,L.length>4&&(S.name=a+L[4],a+=L[4])),_.push(S),typeof S.originalLine=="number"){let B=S.source;for(;p.length<=B;)p.push(null);p[B]===null&&(p[B]=[]),p[B].push(S)}}Re(_,k),this.__generatedMappings=_;for(var P=0;P<p.length;P++)p[P]!=null&&q(p[P],h.compareByOriginalPositionsNoSource);this.__originalMappings=[].concat(...p)},"SourceMapConsumer_parseMappings");y.prototype._findMapping=u(function(e,r,n,o,i,s){if(e[n]<=0)throw new TypeError("Line must be greater than or equal to 1, got "+e[n]);if(e[o]<0)throw new TypeError("Column must be greater than or equal to 0, got "+e[o]);return ie.search(e,r,i,s)},"SourceMapConsumer_findMapping");y.prototype.computeColumnSpans=u(function(){for(var e=0;e<this._generatedMappings.length;++e){var r=this._generatedMappings[e];if(e+1<this._generatedMappings.length){var n=this._generatedMappings[e+1];if(r.generatedLine===n.generatedLine){r.lastGeneratedColumn=n.generatedColumn-1;continue}}r.lastGeneratedColumn=1/0}},"SourceMapConsumer_computeColumnSpans");y.prototype.originalPositionFor=u(function(e){var r={generatedLine:h.getArg(e,"line"),generatedColumn:h.getArg(e,"column")},n=this._findMapping(r,this._generatedMappings,"generatedLine","generatedColumn",h.compareByGeneratedPositionsDeflated,h.getArg(e,"bias",v.GREATEST_LOWER_BOUND));if(n>=0){var o=this._generatedMappings[n];if(o.generatedLine===r.generatedLine){var i=h.getArg(o,"source",null);i!==null&&(i=this._sources.at(i),i=h.computeSourceURL(this.sourceRoot,i,this._sourceMapURL));var s=h.getArg(o,"name",null);return s!==null&&(s=this._names.at(s)),{source:i,line:h.getArg(o,"originalLine",null),column:h.getArg(o,"originalColumn",null),name:s}}}return{source:null,line:null,column:null,name:null}},"SourceMapConsumer_originalPositionFor");y.prototype.hasContentsOfAllSources=u(function(){return this.sourcesContent?this.sourcesContent.length>=this._sources.size()&&!this.sourcesContent.some(function(e){return e==null}):!1},"BasicSourceMapConsumer_hasContentsOfAllSources");y.prototype.sourceContentFor=u(function(e,r){if(!this.sourcesContent)return null;var n=this._findSourceIndex(e);if(n>=0)return this.sourcesContent[n];var o=e;this.sourceRoot!=null&&(o=h.relative(this.sourceRoot,o));var i;if(this.sourceRoot!=null&&(i=h.urlParse(this.sourceRoot))){var s=o.replace(/^file:\/\//,"");if(i.scheme=="file"&&this._sources.has(s))return this.sourcesContent[this._sources.indexOf(s)];if((!i.path||i.path=="/")&&this._sources.has("/"+o))return this.sourcesContent[this._sources.indexOf("/"+o)]}if(r)return null;throw new Error('"'+o+'" is not in the SourceMap.')},"SourceMapConsumer_sourceContentFor");y.prototype.generatedPositionFor=u(function(e){var r=h.getArg(e,"source");if(r=this._findSourceIndex(r),r<0)return{line:null,column:null,lastColumn:null};var n={source:r,originalLine:h.getArg(e,"line"),originalColumn:h.getArg(e,"column")},o=this._findMapping(n,this._originalMappings,"originalLine","originalColumn",h.compareByOriginalPositions,h.getArg(e,"bias",v.GREATEST_LOWER_BOUND));if(o>=0){var i=this._originalMappings[o];if(i.source===n.source)return{line:h.getArg(i,"generatedLine",null),column:h.getArg(i,"generatedColumn",null),lastColumn:h.getArg(i,"lastGeneratedColumn",null)}}return{line:null,column:null,lastColumn:null}},"SourceMapConsumer_generatedPositionFor");Q.BasicSourceMapConsumer=y;function O(t,e){var r=t;typeof t=="string"&&(r=h.parseSourceMapInput(t));var n=h.getArg(r,"version"),o=h.getArg(r,"sections");if(n!=this._version)throw new Error("Unsupported version: "+n);this._sources=new T,this._names=new T;var i={line:-1,column:0};this._sections=o.map(function(s){if(s.url)throw new Error("Support for url field in sections not implemented.");var l=h.getArg(s,"offset"),a=h.getArg(l,"line"),c=h.getArg(l,"column");if(a<i.line||a===i.line&&c<i.column)throw new Error("Section offsets must be ordered and non-overlapping.");return i=l,{generatedOffset:{generatedLine:a+1,generatedColumn:c+1},consumer:new v(h.getArg(s,"map"),e)}})}u(O,"IndexedSourceMapConsumer");O.prototype=Object.create(v.prototype);O.prototype.constructor=v;O.prototype._version=3;Object.defineProperty(O.prototype,"sources",{get:u(function(){for(var t=[],e=0;e<this._sections.length;e++)for(var r=0;r<this._sections[e].consumer.sources.length;r++)t.push(this._sections[e].consumer.sources[r]);return t},"get")});O.prototype.originalPositionFor=u(function(e){var r={generatedLine:h.getArg(e,"line"),generatedColumn:h.getArg(e,"column")},n=ie.search(r,this._sections,function(i,s){var l=i.generatedLine-s.generatedOffset.generatedLine;return l||i.generatedColumn-s.generatedOffset.generatedColumn}),o=this._sections[n];return o?o.consumer.originalPositionFor({line:r.generatedLine-(o.generatedOffset.generatedLine-1),column:r.generatedColumn-(o.generatedOffset.generatedLine===r.generatedLine?o.generatedOffset.generatedColumn-1:0),bias:e.bias}):{source:null,line:null,column:null,name:null}},"IndexedSourceMapConsumer_originalPositionFor");O.prototype.hasContentsOfAllSources=u(function(){return this._sections.every(function(e){return e.consumer.hasContentsOfAllSources()})},"IndexedSourceMapConsumer_hasContentsOfAllSources");O.prototype.sourceContentFor=u(function(e,r){for(var n=0;n<this._sections.length;n++){var o=this._sections[n],i=o.consumer.sourceContentFor(e,!0);if(i||i==="")return i}if(r)return null;throw new Error('"'+e+'" is not in the SourceMap.')},"IndexedSourceMapConsumer_sourceContentFor");O.prototype.generatedPositionFor=u(function(e){for(var r=0;r<this._sections.length;r++){var n=this._sections[r];if(n.consumer._findSourceIndex(h.getArg(e,"source"))!==-1){var o=n.consumer.generatedPositionFor(e);if(o){var i={line:o.line+(n.generatedOffset.generatedLine-1),column:o.column+(n.generatedOffset.generatedLine===o.line?n.generatedOffset.generatedColumn-1:0)};return i}}}return{line:null,column:null}},"IndexedSourceMapConsumer_generatedPositionFor");O.prototype._parseMappings=u(function(e,r){this.__generatedMappings=[],this.__originalMappings=[];for(var n=0;n<this._sections.length;n++)for(var o=this._sections[n],i=o.consumer._generatedMappings,s=0;s<i.length;s++){var l=i[s],a=o.consumer._sources.at(l.source);a!==null&&(a=h.computeSourceURL(o.consumer.sourceRoot,a,this._sourceMapURL)),this._sources.add(a),a=this._sources.indexOf(a);var c=null;l.name&&(c=o.consumer._names.at(l.name),this._names.add(c),c=this._names.indexOf(c));var f={source:a,generatedLine:l.generatedLine+(o.generatedOffset.generatedLine-1),generatedColumn:l.generatedColumn+(o.generatedOffset.generatedLine===l.generatedLine?o.generatedOffset.generatedColumn-1:0),originalLine:l.originalLine,originalColumn:l.originalColumn,name:c};this.__generatedMappings.push(f),typeof f.originalLine=="number"&&this.__originalMappings.push(f)}q(this.__generatedMappings,h.compareByGeneratedPositionsDeflated),q(this.__originalMappings,h.compareByOriginalPositions)},"IndexedSourceMapConsumer_parseMappings");Q.IndexedSourceMapConsumer=O});var xe=w(Ge=>{var ur=ne().SourceMapGenerator,$=x(),lr=/(\r?\n)/,ar=10,j="$$$isSourceNode$$$";function M(t,e,r,n,o){this.children=[],this.sourceContents={},this.line=t??null,this.column=e??null,this.source=r??null,this.name=o??null,this[j]=!0,n!=null&&this.add(n)}u(M,"SourceNode");M.fromStringWithSourceMap=u(function(e,r,n){var o=new M,i=e.split(lr),s=0,l=u(function(){var d=_(),p=_()||"";return d+p;function _(){return s<i.length?i[s++]:void 0}},"shiftNextLine"),a=1,c=0,f=null;return r.eachMapping(function(d){if(f!==null)if(a<d.generatedLine)g(f,l()),a++,c=0;else{var p=i[s]||"",_=p.substr(0,d.generatedColumn-c);i[s]=p.substr(d.generatedColumn-c),c=d.generatedColumn,g(f,_),f=d;return}for(;a<d.generatedLine;)o.add(l()),a++;if(c<d.generatedColumn){var p=i[s]||"";o.add(p.substr(0,d.generatedColumn)),i[s]=p.substr(d.generatedColumn),c=d.generatedColumn}f=d},this),s<i.length&&(f&&g(f,l()),o.add(i.splice(s).join(""))),r.sources.forEach(function(d){var p=r.sourceContentFor(d);p!=null&&(n!=null&&(d=$.join(n,d)),o.setSourceContent(d,p))}),o;function g(d,p){if(d===null||d.source===void 0)o.add(p);else{var _=n?$.join(n,d.source):d.source;o.add(new M(d.originalLine,d.originalColumn,_,p,d.name))}}u(g,"addMappingWithCode")},"SourceNode_fromStringWithSourceMap");M.prototype.add=u(function(e){if(Array.isArray(e))e.forEach(function(r){this.add(r)},this);else if(e[j]||typeof e=="string")e&&this.children.push(e);else throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+e);return this},"SourceNode_add");M.prototype.prepend=u(function(e){if(Array.isArray(e))for(var r=e.length-1;r>=0;r--)this.prepend(e[r]);else if(e[j]||typeof e=="string")this.children.unshift(e);else throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+e);return this},"SourceNode_prepend");M.prototype.walk=u(function(e){for(var r,n=0,o=this.children.length;n<o;n++)r=this.children[n],r[j]?r.walk(e):r!==""&&e(r,{source:this.source,line:this.line,column:this.column,name:this.name})},"SourceNode_walk");M.prototype.join=u(function(e){var r,n,o=this.children.length;if(o>0){for(r=[],n=0;n<o-1;n++)r.push(this.children[n]),r.push(e);r.push(this.children[n]),this.children=r}return this},"SourceNode_join");M.prototype.replaceRight=u(function(e,r){var n=this.children[this.children.length-1];return n[j]?n.replaceRight(e,r):typeof n=="string"?this.children[this.children.length-1]=n.replace(e,r):this.children.push("".replace(e,r)),this},"SourceNode_replaceRight");M.prototype.setSourceContent=u(function(e,r){this.sourceContents[$.toSetString(e)]=r},"SourceNode_setSourceContent");M.prototype.walkSourceContents=u(function(e){for(var r=0,n=this.children.length;r<n;r++)this.children[r][j]&&this.children[r].walkSourceContents(e);for(var o=Object.keys(this.sourceContents),r=0,n=o.length;r<n;r++)e($.fromSetString(o[r]),this.sourceContents[o[r]])},"SourceNode_walkSourceContents");M.prototype.toString=u(function(){var e="";return this.walk(function(r){e+=r}),e},"SourceNode_toString");M.prototype.toStringWithSourceMap=u(function(e){var r={code:"",line:1,column:0},n=new ur(e),o=!1,i=null,s=null,l=null,a=null;return this.walk(function(c,f){r.code+=c,f.source!==null&&f.line!==null&&f.column!==null?((i!==f.source||s!==f.line||l!==f.column||a!==f.name)&&n.addMapping({source:f.source,original:{line:f.line,column:f.column},generated:{line:r.line,column:r.column},name:f.name}),i=f.source,s=f.line,l=f.column,a=f.name,o=!0):o&&(n.addMapping({generated:{line:r.line,column:r.column}}),i=null,o=!1);for(var g=0,d=c.length;g<d;g++)c.charCodeAt(g)===ar?(r.line++,r.column=0,g+1===d?(i=null,o=!1):o&&n.addMapping({source:f.source,original:{line:f.line,column:f.column},generated:{line:r.line,column:r.column},name:f.name})):r.column++}),this.walkSourceContents(function(c,f){n.setSourceContent(c,f)}),{code:r.code,map:n}},"SourceNode_toStringWithSourceMap");Ge.SourceNode=M});var Te=w(V=>{V.SourceMapGenerator=ne().SourceMapGenerator;V.SourceMapConsumer=Ie().SourceMapConsumer;V.SourceNode=xe().SourceNode});var gr=w((Dr,Ue)=>{var{existsSync:cr,readFileSync:fr}=le("fs"),{dirname:se,join:hr}=le("path"),{SourceMapConsumer:je,SourceMapGenerator:De}=Te();function dr(t){return Buffer?Buffer.from(t,"base64").toString():window.atob(t)}u(dr,"fromBase64");var F=class{static{u(this,"PreviousMap")}constructor(e,r){if(r.map===!1)return;this.loadAnnotation(e),this.inline=this.startWith(this.annotation,"data:");let n=r.map?r.map.prev:void 0,o=this.loadMap(r.from,n);!this.mapFile&&r.from&&(this.mapFile=r.from),this.mapFile&&(this.root=se(this.mapFile)),o&&(this.text=o)}consumer(){return this.consumerCache||(this.consumerCache=new je(this.text)),this.consumerCache}decodeInline(e){let r=/^data:application\/json;charset=utf-?8;base64,/,n=/^data:application\/json;base64,/,o=/^data:application\/json;charset=utf-?8,/,i=/^data:application\/json,/,s=e.match(o)||e.match(i);if(s)return decodeURIComponent(e.substr(s[0].length));let l=e.match(r)||e.match(n);if(l)return dr(e.substr(l[0].length));let a=e.match(/data:application\/json;([^,]+),/)[1];throw new Error("Unsupported source map encoding "+a)}getAnnotationURL(e){return e.replace(/^\/\*\s*# sourceMappingURL=/,"").trim()}isMap(e){return typeof e!="object"?!1:typeof e.mappings=="string"||typeof e._mappings=="string"||Array.isArray(e.sections)}loadAnnotation(e){let r=e.match(/\/\*\s*# sourceMappingURL=/g);if(!r)return;let n=e.lastIndexOf(r.pop()),o=e.indexOf("*/",n);n>-1&&o>-1&&(this.annotation=this.getAnnotationURL(e.substring(n,o)))}loadFile(e){if(this.root=se(e),cr(e))return this.mapFile=e,fr(e,"utf-8").toString().trim()}loadMap(e,r){if(r===!1)return!1;if(r){if(typeof r=="string")return r;if(typeof r=="function"){let n=r(e);if(n){let o=this.loadFile(n);if(!o)throw new Error("Unable to load previous source map: "+n.toString());return o}}else{if(r instanceof je)return De.fromSourceMap(r).toString();if(r instanceof De)return r.toString();if(this.isMap(r))return JSON.stringify(r);throw new Error("Unsupported previous source map format: "+r.toString())}}else{if(this.inline)return this.decodeInline(this.annotation);if(this.annotation){let n=this.annotation;return e&&(n=hr(se(e),n)),this.loadFile(n)}}}startWith(e,r){return e?e.substr(0,r.length)===r:!1}withContent(){return!!(this.consumer().sourcesContent&&this.consumer().sourcesContent.length>0)}};Ue.exports=F;F.default=F});export default gr();
//# sourceMappingURL=previous-map.js.map
