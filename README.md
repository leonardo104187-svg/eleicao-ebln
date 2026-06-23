# Site de Inscrições da Eleição - EB LN

## Faz o quê
- Formulário com nick do Roblox e Discord.
- Entrega ID automático de 1 a 15.
- Mostra vagas livres e ocupadas.
- Bloqueia Roblox ou Discord repetido.
- Envia log para webhook do Discord.
- Avisa no webhook quando completar 15/15 vagas.

## Configurar webhook
Abra `config.json` e troque:

```json
"DISCORD_WEBHOOK_URL": "COLE_AQUI_SEU_WEBHOOK_DO_DISCORD"
```

pelo link do webhook do canal de logs.

## Rodar
Instale Node.js. Depois, dentro da pasta:

```bash
npm install
npm start
```

Abra:

```txt
http://localhost:3000
```

## Limpar inscrições
Abra `inscricoes.json` e deixe:

```json
{"inscricoes":[]}
```

Depois reinicie o servidor.
