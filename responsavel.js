
document.addEventListener("DOMContentLoaded", () => {

  /* VERIFICAÇÃO DE ACESSO AO PAINEL */

  let acesso = null;

  try {
    acesso = JSON.parse(
      localStorage.getItem("escolhaPazResponsavel") || "null"
    );
  } catch (erro) {
    acesso = null;
  }

  if (!acesso || acesso.autenticado !== true) {
    window.location.replace("senha-responsavel.html");
    return;
  }

  /* DADOS DEMONSTRATIVOS */

  const reports = [
    {
      id: "EP-024",
      type: "Bullying",
      title: "Relato de intimidação entre colegas",
      place: "Pátio",
      date: "16/11/2026",
      status: "Em análise",
      reporter: "Estudante A",
      description: "Um estudante relatou comentários repetidos e constrangedores feitos por colegas durante o intervalo. O relato pede acolhimento e acompanhamento da equipe."
    },
    {
      id: "EP-023",
      type: "Conflito",
      title: "Desentendimento em sala de aula",
      place: "Sala 08",
      date: "15/11/2026",
      status: "Em acompanhamento",
      reporter: "Estudante B",
      description: "Foi informado um desentendimento durante uma atividade em grupo. A equipe está acompanhando a situação e buscando ouvir as pessoas envolvidas."
    },
    {
      id: "EP-022",
      type: "Ofensa",
      title: "Comentários desrespeitosos",
      place: "Corredor",
      date: "14/11/2026",
      status: "Em análise",
      reporter: "Estudante C",
      description: "O relato descreve comentários ofensivos no corredor. É necessário acolher o estudante e verificar os próximos passos com a equipe responsável."
    },
    {
      id: "EP-021",
      type: "Briga",
      title: "Discussão durante o intervalo",
      place: "Quadra",
      date: "12/11/2026",
      status: "Resolvido",
      reporter: "Observação da equipe",
      description: "A equipe realizou uma conversa mediada e registrou as orientações de convivência. Exemplo fictício de situação concluída."
    },
    {
      id: "EP-020",
      type: "Outro",
      title: "Pedido de apoio e orientação",
      place: "Biblioteca",
      date: "11/11/2026",
      status: "Em acompanhamento",
      reporter: "Estudante D",
      description: "Um estudante pediu ajuda para lidar com uma situação de convivência. O acompanhamento está em andamento."
    }
  ];

  const messages = [
    {
      id: "EP-023",
      date: "15/11/2026",
      text: "A equipe iniciou o acompanhamento e irá ouvir as pessoas envolvidas com cuidado."
    },
    {
      id: "EP-021",
      date: "12/11/2026",
      text: "Conversa mediada realizada. Orientações de respeito e convivência foram reforçadas."
    }
  ];

  const pages = {
    inicio: "Visão geral",
    denuncias: "Denúncias",
    pessoas: "Pessoas",
    mensagens: "Mensagens",
    nova: "Novo registro",
    orientacoes: "Orientações"
  };

  let selectedReport = null;

  const $ = id => document.getElementById(id);

  /* DATA ATUAL */

  function getCurrentDate() {
    const hoje = new Date();

    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  /* GERAR PRÓXIMO CÓDIGO */

  function getNextReportId() {
    const maiorNumero = reports.reduce((maior, report) => {
      const numero = Number(report.id.replace("EP-", ""));
      return Math.max(maior, numero);
    }, 0);

    return "EP-" + String(maiorNumero + 1).padStart(3, "0");
  }

  /* CLASSE DOS STATUS */

  const statusClass = status =>
    status === "Resolvido"
      ? "done"
      : status === "Em acompanhamento"
      ? "progress"
      : "analysis";

  /* PROTEÇÃO DE TEXTO */

  const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));

  /* AVISOS NA TELA */

  function showToast(message) {
    const toast = $("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  /* NAVEGAÇÃO ENTRE AS PÁGINAS */

  function goTo(page) {
    if (!pages[page]) return;

    document.querySelectorAll(".page").forEach(section => {
      section.classList.remove("active");
    });

    const selectedPage = $("page-" + page);

    if (!selectedPage) return;

    selectedPage.classList.add("active");

    document.querySelectorAll(".nav-item[data-page]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === page
      );
    });

    $("currentSection").textContent = pages[page];

    $("sidebar").classList.remove("open");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (page === "denuncias") renderTable();
    if (page === "mensagens") renderMessages();
    if (page === "pessoas") renderPeople();
  }

  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      goTo(button.dataset.page);
    });
  });

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      goTo(button.dataset.go);
    });
  });

  /* MENU PARA CELULAR */

  $("mobileMenu").addEventListener("click", () => {
    $("sidebar").classList.toggle("open");
  });

  /* NOTIFICAÇÕES */

  $("notificationButton").addEventListener("click", () => {
    goTo("denuncias");

    showToast(
      "Você está vendo os relatos registrados na demonstração."
    );
  });

  /* ATUALIZAR INDICADORES */

  function updateStats() {

    const pending = reports.filter(
      report => report.status === "Em análise"
    ).length;

    const progress = reports.filter(
      report => report.status === "Em acompanhamento"
    ).length;

    const resolved = reports.filter(
      report => report.status === "Resolvido"
    ).length;

    $("totalReports").textContent = reports.length;
    $("pendingReports").textContent = pending;
    $("progressReports").textContent = progress;
    $("resolvedReports").textContent = resolved;

    $("navCount").textContent = pending;
  }

  /* DENÚNCIAS RECENTES */

  function reportRow(report) {

    return `
      <div class="report-row">

        <div class="report-main">
          <strong>${escapeHTML(report.title)}</strong>

          <small>
            ${escapeHTML(report.id)} ·
            ${escapeHTML(report.place)} ·
            ${escapeHTML(report.date)}
          </small>
        </div>

        <div class="report-actions">

          <span class="status ${statusClass(report.status)}">
            ${escapeHTML(report.status)}
          </span>

          <button
            class="small-action"
            data-detail="${escapeHTML(report.id)}"
          >
            Ver detalhes
          </button>

        </div>
      </div>
    `;
  }

  function renderRecent() {

    $("recentReports").innerHTML =
      reports.slice(0, 3).map(reportRow).join("");

    bindDetailButtons();
  }

  /* TABELA DE DENÚNCIAS */

  function renderTable() {

    const query = $("reportSearch").value.toLowerCase().trim();

    const status = $("statusFilter").value;

    const type = $("typeFilter").value;

    const filtered = reports.filter(report => {

      const matchesQuery =
        `${report.id} ${report.title} ${report.place} ${report.reporter}`
        .toLowerCase()
        .includes(query);

      return (
        matchesQuery &&
        (status === "todos" || report.status === status) &&
        (type === "todos" || report.type === type)
      );
    });

    $("reportsTable").innerHTML = filtered.map(report => `

      <tr>

        <td class="code">
          ${escapeHTML(report.id)}
        </td>

        <td>
          ${escapeHTML(report.title)}
        </td>

        <td>
          ${escapeHTML(report.place)}
        </td>

        <td>
          ${escapeHTML(report.date)}
        </td>

        <td>
          <span class="status ${statusClass(report.status)}">
            ${escapeHTML(report.status)}
          </span>
        </td>

        <td>
          <button
            class="small-action"
            data-detail="${escapeHTML(report.id)}"
          >
            Abrir
          </button>
        </td>

      </tr>

    `).join("");

    $("emptyReports").classList.toggle(
      "hidden",
      filtered.length > 0
    );

    $("reportsTable").classList.toggle(
      "hidden",
      filtered.length === 0
    );

    bindDetailButtons();
  }

  /* BOTÕES DE DETALHES */

  function bindDetailButtons() {

    document.querySelectorAll("[data-detail]").forEach(button => {

      button.addEventListener("click", () => {
        openDetail(button.dataset.detail);
      });

    });
  }

  /* ABRIR DETALHES DA DENÚNCIA */

  function openDetail(id) {

    const report = reports.find(item => item.id === id);

    if (!report) return;

    selectedReport = report;

    $("modalTitle").textContent = report.title;

    $("modalContent").innerHTML = `

      <div class="detail-field">
        <small>Código e tipo</small>
        <p>
          ${escapeHTML(report.id)} ·
          ${escapeHTML(report.type)}
        </p>
      </div>

      <div class="detail-field">
        <small>Local e data</small>
        <p>
          ${escapeHTML(report.place)} ·
          ${escapeHTML(report.date)}
        </p>
      </div>

      <div class="detail-field">
        <small>Identificação demonstrativa</small>
        <p>${escapeHTML(report.reporter)}</p>
      </div>

      <div class="detail-field">
        <small>Descrição</small>
        <p>${escapeHTML(report.description)}</p>
      </div>

      <div class="detail-field">
        <small>Status atual</small>
        <p>${escapeHTML(report.status)}</p>
      </div>

    `;

    $("modalStatus").value = report.status;

    $("statusFeedback").textContent = "";

    $("detailModal").classList.remove("hidden");
  }

  /* FECHAR JANELA */

  function closeModal() {

    $("detailModal").classList.add("hidden");

    selectedReport = null;
  }

  $("closeModal").addEventListener("click", closeModal);

  $("detailModal").addEventListener("click", event => {

    if (event.target === $("detailModal")) {
      closeModal();
    }

  });

  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      !$("detailModal").classList.contains("hidden")
    ) {
      closeModal();
    }

  });

  /* ATUALIZAR STATUS */

  $("saveStatus").addEventListener("click", () => {

    if (!selectedReport) return;

    selectedReport.status = $("modalStatus").value;

    updateStats();

    renderRecent();

    renderTable();

    const reportId = selectedReport.id;

    openDetail(reportId);

    $("statusFeedback").textContent =
      "Status atualizado nesta demonstração.";

    showToast("Status atualizado no protótipo.");

  });

  /* PESSOAS ENVOLVIDAS */

  function renderPeople() {

    const people = [];

    reports.forEach(report => {

      const existingPerson = people.find(
        person => person.code === report.reporter
      );

      if (existingPerson) {
        existingPerson.count++;
      } else {
        people.push({
          code: report.reporter,
          role: report.reporter === "Observação da equipe"
            ? "Registro feito pela equipe"
            : "Pessoa que enviou um relato",
          count: 1
        });
      }

    });

    $("peopleGrid").innerHTML = people.map(person => `

      <article class="person-card">

        <div class="person-avatar">♙</div>

        <strong>${escapeHTML(person.code)}</strong>

        <small>${escapeHTML(person.role)}</small>

        <p>
          ${person.count} registro demonstrativo associado.
          Identidade real não exibida.
        </p>

      </article>

    `).join("");
  }

  /* MENSAGENS */

  function renderMessages() {

    $("messageList").innerHTML = messages.length

      ? messages.map(message => `

        <article class="message-item">

          <strong>
            Registro ${escapeHTML(message.id)}
          </strong>

          <small>
            ${escapeHTML(message.date)}
          </small>

          <p>
            ${escapeHTML(message.text)}
          </p>

        </article>

      `).join("")

      : `
        <p class="muted">
          Ainda não há mensagens nesta demonstração.
        </p>
      `;

    const selectedValue = $("messageReport").value;

    $("messageReport").innerHTML = reports.map(report => `

      <option value="${escapeHTML(report.id)}">
        ${escapeHTML(report.id)} —
        ${escapeHTML(report.title)}
      </option>

    `).join("");

    if (reports.some(report => report.id === selectedValue)) {
      $("messageReport").value = selectedValue;
    }
  }

  /* SALVAR MENSAGEM */

  $("messageForm").addEventListener("submit", event => {

    event.preventDefault();

    const text = $("messageText").value.trim();

    const reportId = $("messageReport").value;

    if (text.length < 5) {

      $("messageFeedback").textContent =
        "Escreva uma mensagem um pouco mais completa.";

      return;
    }

    if (!reportId) {

      $("messageFeedback").textContent =
        "Selecione um relato para vincular a mensagem.";

      return;
    }

    messages.unshift({

      id: reportId,

      date: getCurrentDate(),

      text: text

    });

    $("messageText").value = "";

    $("messageFeedback").textContent =
      "Mensagem adicionada somente à demonstração.";

    renderMessages();

    showToast("Mensagem registrada no protótipo.");

  });

  /* CRIAR NOVO REGISTRO */

  $("newReportForm").addEventListener("submit", event => {

    event.preventDefault();

    const type = $("newType").value;

    const place = $("newPlace").value;

    const reporter =
      $("newReporter").value.trim() || "Registro da equipe";

    const description = $("newDescription").value.trim();

    if (!type || !place || description.length < 15) {

      $("newFeedback").textContent =
        "Preencha os campos obrigatórios e escreva pelo menos 15 caracteres.";

      return;
    }

    const id = getNextReportId();

    reports.unshift({

      id: id,

      type: type,

      title: `Novo registro: ${type}`,

      place: place,

      date: getCurrentDate(),

      status: "Em análise",

      reporter: reporter,

      description: description

    });

    $("newReportForm").reset();

    $("newFeedback").textContent =
      `${id} criado apenas nesta demonstração. Nenhum dado foi enviado ou salvo em servidor.`;

    updateStats();

    renderRecent();

    renderTable();

    renderPeople();

    renderMessages();

    showToast("Novo registro demonstrativo criado.");

  });

  /* PESQUISA E FILTROS */

  ["reportSearch", "statusFilter", "typeFilter"].forEach(id => {

    $(id).addEventListener(
      id === "reportSearch" ? "input" : "change",
      renderTable
    );

  });

  /* INICIALIZAÇÃO DO PAINEL */

  renderRecent();

  renderTable();

  renderPeople();

  renderMessages();

  updateStats();

});

