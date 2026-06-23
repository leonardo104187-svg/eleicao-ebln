const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const CONFIG_PATH = path.join(__dirname, 'config.json');
const DATA_PATH = path.join(__dirname, 'inscricoes.json');
function lerConfig(){return JSON.parse(fs.readFileSync(CONFIG_PATH,'utf8'));}
function lerDados(){if(!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({inscricoes:[]}, null, 2)); return JSON.parse(fs.readFileSync(DATA_PATH,'utf8'));}
function salvarDados(dados){fs.writeFileSync(DATA_PATH, JSON.stringify(dados,null,2));}
function proximoId(inscricoes){const ocupados=inscricoes.map(x=>x.id); for(let i=1;i<=15;i++){if(!ocupados.includes(i)) return i;} return null;}
async function webhook(payload){const url=lerConfig().DISCORD_WEBHOOK_URL; if(!url||url==='COLE_AQUI_SEU_WEBHOOK_DO_DISCORD'){console.log('Webhook não configurado.'); return;} try{await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});}catch(e){console.error('Erro webhook:', e.message);}}
app.get('/api/vagas',(req,res)=>{const dados=lerDados(); const vagas=[]; for(let i=1;i<=15;i++){const ins=dados.inscricoes.find(x=>x.id===i); vagas.push({id:i,ocupada:!!ins,roblox:ins?ins.roblox:null,discord:ins?ins.discord:null});} res.json({total:15,ocupadas:dados.inscricoes.length,livres:15-dados.inscricoes.length,vagas});});
app.post('/api/inscrever', async(req,res)=>{let {roblox,discord}=req.body; if(!roblox||!discord) return res.status(400).json({erro:'Preencha o nick do Roblox e o Discord.'}); roblox=String(roblox).trim(); discord=String(discord).trim(); if(roblox.length<3||discord.length<2) return res.status(400).json({erro:'Preencha informações válidas.'}); const dados=lerDados(); const existe=dados.inscricoes.find(x=>x.roblox.toLowerCase()===roblox.toLowerCase()||x.discord.toLowerCase()===discord.toLowerCase()); if(existe) return res.status(409).json({erro:'Esse Roblox ou Discord já está inscrito.', id:existe.id}); const id=proximoId(dados.inscricoes); if(!id) return res.status(403).json({erro:'Todas as 15 vagas já foram preenchidas.'}); const item={id,roblox,discord,data:new Date().toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}; dados.inscricoes.push(item); salvarDados(dados); await webhook({username:'Logs da Eleição',embeds:[{title:'🗳️ Nova inscrição registrada',color:3447003,fields:[{name:'Número de identificação',value:'#'+id,inline:true},{name:'Nick Roblox',value:roblox,inline:true},{name:'Discord',value:discord,inline:true},{name:'Vagas ocupadas',value:`${dados.inscricoes.length}/15`,inline:true},{name:'Data',value:item.data,inline:true}],footer:{text:'Exército Brasileiro LN • Sistema Eleitoral'}}]}); if(dados.inscricoes.length===15){await webhook({username:'Logs da Eleição',embeds:[{title:'🚨 Todas as vagas foram preenchidas!',description:'As 15 vagas da Fase 1 foram ocupadas. As inscrições podem ser encerradas.',color:16766720,fields:[{name:'Status',value:'Inscrições lotadas',inline:true},{name:'Total',value:'15/15',inline:true}],footer:{text:'Exército Brasileiro LN • Sistema Eleitoral'}}]});} res.json({sucesso:true,id,mensagem:`Inscrição realizada com sucesso. Seu número é #${id}.`});});
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
const PORT=process.env.PORT||lerConfig().PORT||3000; app.listen(PORT,()=>console.log('Rodando em http://localhost:'+PORT));
