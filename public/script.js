const form = document.getElementById("formInscricao");
const robloxInput = document.getElementById("roblox");
const discordInput = document.getElementById("discord");
const resultado = document.getElementById("resultado");
const listaVagas = document.getElementById("listaVagas");
const contadorVagas = document.getElementById("contadorVagas");
const ocupadasTopo = document.getElementById("ocupadasTopo");
const livresTopo = document.getElementById("livresTopo");
const btnEnviar = document.getElementById("btnEnviar");

async function carregarVagas() {
  try {
    const resposta = await fetch("/api/vagas");
    const dados = await resposta.json();

    contadorVagas.textContent = `${dados.ocupadas}/15`;
    ocupadasTopo.textContent = dados.ocupadas;
    livresTopo.textContent = dados.livres;

    listaVagas.innerHTML = "";

    dados.vagas.forEach((vaga) => {
      const div = document.createElement("div");
      div.className = vaga.ocupada ? "vaga ocupada" : "vaga";

      div.innerHTML = `
        <strong>#${String(vaga.id).padStart(2, "0")}</strong>
        <span>${vaga.ocupada ? "OCUPADA" : "LIVRE"}</span>
      `;

      listaVagas.appendChild(div);
    });

    if (dados.livres <= 0) {
      btnEnviar.disabled = true;
      btnEnviar.textContent = "Inscrições lotadas";
    }
  } catch (erro) {
    console.error("Erro ao carregar vagas:", erro);
  }
}

function mostrarResultado(texto, erro = false) {
  resultado.classList.remove("escondido");
  resultado.classList.toggle("erro", erro);
  resultado.innerHTML = texto;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  btnEnviar.disabled = true;
  btnEnviar.textContent = "Enviando...";

  try {
    const resposta = await fetch("/api/inscrever", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        roblox: robloxInput.value,
        discord: discordInput.value
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarResultado(dados.erro || "Erro ao realizar inscrição.", true);
      return;
    }

    mostrarResultado(`
      ✅ Inscrição realizada com sucesso!<br>
      Seu número oficial é <strong>#${String(dados.id).padStart(2, "0")}</strong>.<br>
      Guarde esse número para as próximas fases da eleição.
    `);

    form.reset();
    await carregarVagas();
  } catch (erro) {
    mostrarResultado("Erro ao conectar com o servidor.", true);
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.textContent = "Próximo";

    try {
      const resposta = await fetch("/api/vagas");
      const dados = await resposta.json();

      if (dados.livres <= 0) {
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Inscrições lotadas";
      }
    } catch {}
  }
});

carregarVagas();
setInterval(carregarVagas, 7000);
