const{parentPort}=require("worker_threads"),path2ModuleCache=new Map;function requireInstance(e){let t=path2ModuleCache.get(e);if(!t){if(t=require(e),!t.format)throw new Error("wrong instance");path2ModuleCache.set(e,t)}return t}parentPort.on("message",(({type:e,id:t,payload:a})=>{switch(e){case"import":{const{modulePath:r}=a;try{const a=requireInstance(r);parentPort.postMessage({type:e,id:t,payload:{version:a.version}})}catch{parentPort.postMessage({type:e,id:t,payload:{version:null}})}break}case"callMethod":{const{modulePath:r,methodName:o,methodArgs:s}=a,n=a=>{parentPort.postMessage({type:e,id:t,payload:{result:a,isError:!0}})},p=a=>{parentPort.postMessage({type:e,id:t,payload:{result:a,isError:!1}})};let c,i=path2ModuleCache.get(r);if(!i)try{i=requireInstance(r)}catch(e){n(e)}try{c=i[o](...s)}catch(e){n(e)}if(c instanceof Promise){c.then((e=>{try{"getSupportInfo"===o&&(e={languages:e.languages}),p(e)}catch(e){n(e)}}),(e=>{n(e)}));break}try{"getSupportInfo"===o&&(c={languages:c.languages}),p(c)}catch(e){n(e)}break}}}));