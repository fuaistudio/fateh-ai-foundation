'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = __dirname, PUBLIC = path.join(ROOT, 'public'), DATA = path.join(ROOT, 'data');
function loadEnv(){const p=path.join(ROOT,'.env');if(fs.existsSync(p))for(const line of fs.readFileSync(p,'utf8').split(/\r?\n/)){const m=line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^['"]|['"]$/g,'')}}
loadEnv();
function read(name, fallback=[]){try{return JSON.parse(fs.readFileSync(path.join(DATA,name),'utf8'))}catch{return fallback}}
function write(name,value){fs.writeFileSync(path.join(DATA,name),JSON.stringify(value,null,2))}
const studios=['Game Development','Website','Software & Apps','Film & Cinema','Video Creation','Image & Art','3D Design','Animation','Music & Audio','Voice & Speech','AI & ML','Robotics','Cybersecurity','Data & Analytics','Cloud & Servers','Blockchain','AR & VR','Electronics & IoT','Architecture','Graphic Design','E-Commerce','Marketing','Automation','Education','Documents & Books','Networks','Business Systems','Science & Research','Maps & GIS','Digital Products'];
const agents=['Master Orchestrator','Research Agent','Planning Agent','Coding Agent','Code Review Agent','Testing Agent','Website Agent','App Agent','Game Agent','Film Agent','Video Agent','Image Agent','3D Agent','Audio Agent','Voice Agent','Data Agent','Security Agent','Cloud Agent','Automation Agent','Documentation Agent'];
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function send(res,status,body,type='application/json; charset=utf-8'){res.writeHead(status,{'Content-Type':type,'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Cache-Control':'no-store'});res.end(type.startsWith('application/json')?JSON.stringify(body):body)}
function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>{s+=c;if(s.length>1e6)reject(new Error('Request too large'))});req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch{reject(new Error('Invalid JSON'))}});req.on('error',reject)})}
const server=http.createServer(async(req,res)=>{const url=new URL(req.url,'http://localhost');
 if(req.method==='GET'&&url.pathname==='/api/health')return send(res,200,{ok:true,product:'FATEH AI',version:'0.1.0',aiConfigured:Boolean(process.env.GEMINI_API_KEY),time:new Date().toISOString()});
 if(req.method==='GET'&&url.pathname==='/api/overview')return send(res,200,{studios:studios.length,agents:agents.length,projects:read('projects.json'),tasks:read('tasks.json'),aiConfigured:Boolean(process.env.GEMINI_API_KEY)});
 if(req.method==='GET'&&url.pathname==='/api/studios')return send(res,200,studios.map((name,i)=>({id:i+1,name,status:'planned'})));
 if(req.method==='GET'&&url.pathname==='/api/agents')return send(res,200,agents.map((name,i)=>({id:i+1,name,role:i===0?'Orchestration':'Specialist',status:i===0?'foundation':'planned'})));
 if(req.method==='POST'&&url.pathname==='/api/projects'){try{const b=await body(req);if(!b.name||!String(b.name).trim())return send(res,400,{error:'Project name is required'});const items=read('projects.json');const p={id:crypto.randomUUID(),name:String(b.name).trim().slice(0,100),description:String(b.description||'').slice(0,1000),createdAt:new Date().toISOString(),status:'created'};items.unshift(p);write('projects.json',items);return send(res,201,p)}catch(e){return send(res,400,{error:e.message})}}
 if(req.method==='POST'&&url.pathname==='/api/chat'){try{const b=await body(req);const prompt=String(b.message||'').trim();if(!prompt)return send(res,400,{error:'Message is required'});if(!process.env.GEMINI_API_KEY)return send(res,503,{error:'AI is not connected yet. Add GEMINI_API_KEY to your local .env file.'});const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});const data=await r.json();if(!r.ok)return send(res,502,{error:data.error?.message||'AI provider request failed'});const answer=data.candidates?.[0]?.content?.parts?.map(x=>x.text||'').join('')||'No text response returned.';return send(res,200,{answer,used:'FATEH',model})}catch(e){return send(res,500,{error:e.message})}}
 if(req.method==='GET'){let file=path.join(PUBLIC,url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/,''));if(!file.startsWith(PUBLIC))return send(res,403,{error:'Forbidden'});if(fs.existsSync(file)&&fs.statSync(file).isFile())return send(res,200,fs.readFileSync(file),mime[path.extname(file)]||'application/octet-stream')}
 send(res,404,{error:'Not found'});
});
const port=Number(process.env.PORT||8787);server.listen(port,'0.0.0.0',()=>console.log(`FATEH AI running at http://localhost:${port}`));
