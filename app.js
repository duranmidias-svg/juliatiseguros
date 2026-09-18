const WHATSAPP_NUMBER = "5517981105060";

const dimensions = {
  patrimonio: { name: "Proteção patrimonial", low: "A cobertura do próprio veículo merece revisão para evitar uma perda relevante ou uma reposição desalinhada ao seu patrimônio.", high: "Sua preocupação com o valor do veículo e o tipo de reparo indica uma base patrimonial consistente." },
  terceiros: { name: "Responsabilidade com terceiros", low: "Os limites destinados a terceiros podem ser pequenos diante de veículos, pessoas e despesas médicas de alto valor.", high: "Você reconhece que um sinistro pode afetar muito mais do que o veículo segurado." },
  mobilidade: { name: "Continuidade de mobilidade", low: "Uma pane ou reparo prolongado pode interromper sua rotina mais do que o previsto.", high: "Seu perfil valoriza assistência e continuidade da rotina, pontos importantes em veículos de maior complexidade." },
  especializado: { name: "Reparo especializado", low: "Peças, vidros, sensores e oficinas qualificadas precisam aparecer com mais clareza na análise da apólice.", high: "Você já considera a qualidade do reparo como parte essencial da proteção do veículo." },
};

const steps = [
  { type: "intro" },
  { type: "contact", kicker: "Sobre você", title: "Vamos personalizar seu diagnóstico", subtitle: "Comece pelos dados de contato. Seu WhatsApp será validado e seguirá junto com a solicitação de cotação." },
  { type: "vehicle", kicker: "Seu veículo", title: "Qual patrimônio estamos protegendo?", subtitle: "Marca e modelo ajudam na pré-análise, mas o diagnóstico não depende de uma montadora específica." },
  { id: "momento", type: "choice", kicker: "Contexto da cotação", title: "Em qual momento você está?", options: [
    { label: "Meu seguro vence nos próximos 30 dias", score: 3 },
    { label: "Meu seguro vence entre 31 e 90 dias", score: 3 },
    { label: "Estou comprando ou trocando de veículo", score: 2 },
    { label: "Estou sem seguro e quero me proteger", score: 1 },
    { label: "Quero comparar minha proteção atual", score: 2 },
  ]},
  { id: "uso", type: "choice", kicker: "Perfil de uso", title: "Como o veículo participa da sua rotina?", options: [
    { label: "Uso pessoal, principalmente na cidade", score: 3 },
    { label: "Uso pessoal com viagens frequentes", score: 2 },
    { label: "Uso profissional ou visitas a clientes", score: 2 },
    { label: "É um segundo veículo, usado ocasionalmente", score: 4 },
  ]},
  { id: "cobertura", dimension: "patrimonio", type: "choice", kicker: "Proteção patrimonial", title: "Se acontecesse uma perda total hoje, sua apólice estaria alinhada ao valor do veículo?", options: [
    { label: "Não tenho seguro ou não sei como seria a indenização", score: 1 },
    { label: "Tenho cobertura pela FIPE, mas nunca revisei os detalhes", score: 2 },
    { label: "Conheço o percentual contratado e avalio se ele é adequado", score: 3 },
    { label: "Além do valor, revisei acessórios, blindagem e condições de reposição", score: 4 },
  ]},
  { id: "terceiros", dimension: "terceiros", type: "choice", kicker: "Responsabilidade civil", title: "Quanto sua proteção contra danos a terceiros foi pensada para um acidente de maior impacto?", options: [
    { label: "Não sei o limite contratado ou estou sem cobertura", score: 1 },
    { label: "Escolhi o limite mais básico apresentado", score: 2 },
    { label: "Revisei danos materiais e corporais separadamente", score: 3 },
    { label: "Defini limites considerando veículos caros, vítimas e possíveis ações", score: 4 },
  ]},
  { id: "mobilidade", dimension: "mobilidade", type: "choice", kicker: "Continuidade da rotina", title: "Se seu veículo ficasse parado por vários dias, o quanto sua rotina seria afetada?", options: [
    { label: "Muito, e não tenho alternativa de mobilidade planejada", score: 1 },
    { label: "Teria impacto, mas consigo me organizar por alguns dias", score: 2 },
    { label: "Tenho carro reserva ou outra alternativa disponível", score: 3 },
    { label: "Tenho solução compatível com meu padrão de uso e prazo de reparo", score: 4 },
  ]},
  { id: "assistencia", dimension: "mobilidade", type: "choice", kicker: "Assistência", title: "A assistência 24 horas contratada acompanha os trajetos que você realiza?", options: [
    { label: "Não sei qual é o limite de guincho", score: 1 },
    { label: "Tenho assistência básica e uso principalmente na cidade", score: 2 },
    { label: "Verifiquei quilometragem de guincho e cobertura em viagens", score: 3 },
    { label: "Revisei guincho, pane, chave, pneus e suporte em viagens", score: 4 },
  ]},
  { id: "reparo", dimension: "especializado", type: "choice", kicker: "Qualidade do reparo", title: "Como sua apólice trata peças, sensores, vidros e oficinas especializadas?", options: [
    { label: "Nunca conferi esses detalhes", score: 1 },
    { label: "Sei que há cobertura, mas não conheço as condições", score: 2 },
    { label: "Revisei cobertura de vidros, faróis, retrovisores e sensores", score: 3 },
    { label: "Também avaliei rede, peças, oficina de preferência e calibrações", score: 4 },
  ]},
  { id: "risco", dimension: "patrimonio", type: "choice", kicker: "Exposição", title: "Qual situação mais preocupa você em relação ao veículo?", options: [
    { label: "Roubo, furto ou perda total", score: 2, tag: "Perda patrimonial" },
    { label: "Colisão com um veículo de alto valor", score: 2, tag: "Terceiros" },
    { label: "Danos parciais caros ou demorados", score: 3, tag: "Reparo" },
    { label: "Ficar sem mobilidade em uma viagem ou compromisso", score: 3, tag: "Mobilidade" },
  ]},
  { type: "quote", kicker: "Pré-cotação", title: "Últimos dados para o especialista preparar o contato", subtitle: "Nada de CPF, placa ou documentos agora. Esses dados podem ser confirmados com segurança durante o atendimento." },
  { type: "result" },
];

const state = { current: 0, answers: {} };
const app = document.querySelector("#app");

function esc(value = "") { return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
function digits(value = "") { return value.replace(/\D/g, ""); }
function validPhone(value) { let d = digits(value); if (d.startsWith("55") && d.length === 13) d = d.slice(2); return /^[1-9]{2}9\d{8}$/.test(d); }
function phoneFormat(value) { let d = digits(value).slice(0, 11); if (d.length > 2) d = `(${d.slice(0,2)}) ${d.slice(2)}`; if (digits(d).length > 7) d = `${d.slice(0,10)}-${d.slice(10,14)}`; return d; }
function header() { return `<header class="topbar"><div class="brand"><img src="./assets/grupo-juliati.png" alt="Grupo Juliati"><div class="brand-copy"><strong>Grupo Juliati</strong><span>Proteção patrimonial</span></div></div><div class="secure-note">Seus dados seguem somente para a cotação</div></header>`; }

function renderIntro() {
  app.innerHTML = `<div class="shell">${header()}<section class="hero"><div class="hero-content"><p class="eyebrow">Diagnóstico de Proteção Premium</p><h1>Seu seguro está à altura do seu veículo?</h1><p class="hero-copy">Descubra em poucos minutos se sua proteção acompanha o valor, a tecnologia e o padrão de uso do seu automóvel. Ao final, receba uma análise personalizada e deixe sua cotação pré-organizada.</p><div class="trust-row"><span>Resultado imediato</span><span>Sem compromisso</span><span>Cotação personalizada</span></div><button class="primary" data-next>Iniciar meu diagnóstico&nbsp; →</button></div></section></div>`;
}

function progress() { const done = Math.max(0, state.current - 1); const total = steps.length - 3; return Math.min(100, Math.round((done / total) * 100)); }
function interviewerMessage() {
  const step = steps[state.current];
  if (step.type === "contact") return "Antes de falar em preço, quero entender quem você é e deixar sua análise realmente personalizada.";
  if (step.type === "vehicle") return "Agora me conte qual veículo você quer proteger. Esses dados ajudam a dimensionar melhor sua exposição.";
  if (step.id === "momento") return "O momento da contratação muda a urgência e o caminho da cotação. Vamos começar por aqui.";
  if (step.id === "uso") return "Um mesmo veículo pode exigir proteções diferentes conforme a rotina de quem dirige.";
  if (step.dimension === "patrimonio") return "Quero entender se a proteção do veículo acompanha o patrimônio que ele representa para você.";
  if (step.dimension === "terceiros") return "Em um sinistro, o maior impacto financeiro nem sempre está no seu próprio carro.";
  if (step.dimension === "mobilidade") return "Proteção também é conseguir manter sua rotina quando o veículo fica indisponível.";
  if (step.dimension === "especializado") return "Em veículos sofisticados, a qualidade do reparo e a calibração dos sistemas fazem diferença.";
  if (step.type === "quote") return "Com estes últimos dados, minha equipe já recebe um contexto muito melhor para preparar sua cotação.";
  return "Vamos analisar sua proteção com calma e sem comparar apenas o preço final.";
}
function aside() { return `<aside class="quiz-aside"><div class="aside-number">${String(Math.min(state.current, 9)).padStart(2,"0")}</div><h2>Proteção é mais do que o valor do carro.</h2><p>Uma boa apólice precisa acompanhar sua rotina, sua exposição e a complexidade do veículo.</p><div class="aside-list"><div class="aside-item"><div class="aside-icon">01</div><div><strong>Patrimônio</strong><span>Valor, acessórios e condições de indenização.</span></div></div><div class="aside-item"><div class="aside-icon">02</div><div><strong>Responsabilidade</strong><span>Limites adequados para danos a terceiros.</span></div></div><div class="aside-item"><div class="aside-icon">03</div><div><strong>Mobilidade</strong><span>Assistência e continuidade da sua rotina.</span></div></div><div class="aside-item"><div class="aside-icon">04</div><div><strong>Reparo</strong><span>Peças, sensores, vidros e oficinas.</span></div></div></div></aside>`; }
function frame(content) { const pct = progress(); return `<div class="shell">${header()}<div class="quiz-page"><section class="quiz-main"><div class="quiz-inner"><div class="progress-meta"><span>Diagnóstico de proteção</span><span>${pct}% concluído</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><div class="interviewer"><div class="interviewer-photo"><img src="./assets/murilo-juliati.jpg" alt="Murilo Juliati"></div><div><p><strong>Murilo Juliati</strong><span>Especialista em seguros</span></p><blockquote>${interviewerMessage()}</blockquote></div></div>${content}</div></section>${aside()}</div></div>`; }

function contactStep(step) {
  const a = state.answers.contact || {};
  app.innerHTML = frame(`<p class="question-kicker">${step.kicker}</p><h1 class="question-title">${step.title}</h1><p class="question-subtitle">${step.subtitle}</p><div class="form-grid"><div class="field full"><label for="name">Nome completo</label><input id="name" autocomplete="name" value="${esc(a.name)}" placeholder="Como podemos chamar você?"></div><div class="field"><label for="phone">WhatsApp</label><input id="phone" inputmode="tel" autocomplete="tel" value="${esc(a.phone)}" placeholder="(17) 99999-9999"><p id="phone-error" class="field-error" hidden>Informe um celular válido com DDD e 9 dígitos.</p></div><div class="field"><label for="email">E-mail <span style="font-weight:400;color:var(--muted)">(opcional)</span></label><input id="email" type="email" autocomplete="email" value="${esc(a.email)}" placeholder="voce@email.com"></div></div><div class="actions"><button class="back-button" data-back>← Voltar</button><button class="primary" data-contact>Continuar →</button></div>`);
  const phone = document.querySelector("#phone"); phone.addEventListener("input", () => phone.value = phoneFormat(phone.value));
}

function vehicleStep(step) {
  const a = state.answers.vehicle || {};
  app.innerHTML = frame(`<p class="question-kicker">${step.kicker}</p><h1 class="question-title">${step.title}</h1><p class="question-subtitle">${step.subtitle}</p><div class="form-grid"><div class="field"><label for="brand">Marca</label><input id="brand" value="${esc(a.brand)}" placeholder="Ex.: BMW"></div><div class="field"><label for="model">Modelo</label><input id="model" value="${esc(a.model)}" placeholder="Ex.: X5 xDrive"></div><div class="field"><label for="year">Ano/modelo</label><input id="year" inputmode="numeric" value="${esc(a.year)}" placeholder="Ex.: 2024/2025"></div><div class="field"><label for="value">Faixa de valor aproximada</label><select id="value"><option value="">Selecione</option>${["Até R$ 250 mil","R$ 250 mil a R$ 500 mil","R$ 500 mil a R$ 1 milhão","Acima de R$ 1 milhão"].map(x=>`<option ${a.value===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="field full"><label for="zip">CEP onde o veículo pernoita</label><input id="zip" inputmode="numeric" value="${esc(a.zip)}" placeholder="00000-000"><p class="field-help">O CEP influencia a análise de risco. Não precisamos do endereço completo nesta etapa.</p><p id="vehicle-error" class="field-error" hidden>Preencha marca, modelo, ano e um CEP válido.</p></div></div><div class="actions"><button class="back-button" data-back>← Voltar</button><button class="primary" data-vehicle>Continuar →</button></div>`);
}

function choiceStep(step) {
  const selected = state.answers[step.id];
  app.innerHTML = frame(`<p class="question-kicker">${step.kicker}</p><h1 class="question-title">${step.title}</h1><div class="options">${step.options.map((o,i)=>`<button class="option ${selected?.index===i?"selected":""}" data-choice="${i}"><span class="option-mark">${selected?.index===i?"✓":""}</span><span>${esc(o.label)}</span></button>`).join("")}</div><div class="actions"><button class="back-button" data-back>← Voltar</button></div>`);
}

function quoteStep(step) {
  const a = state.answers.quote || {};
  const moments = ["Renovação", "Seguro novo", "Compra/troca de veículo", "Quero avaliar com o corretor"];
  app.innerHTML = frame(`<p class="question-kicker">${step.kicker}</p><h1 class="question-title">${step.title}</h1><p class="question-subtitle">${step.subtitle}</p><div class="form-grid"><div class="field"><label for="insurance">Situação</label><select id="insurance"><option value="">Selecione</option>${moments.map(x=>`<option ${a.insurance===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="field"><label for="expiry">Vencimento atual <span style="font-weight:400;color:var(--muted)">(se houver)</span></label><input id="expiry" type="date" value="${esc(a.expiry)}"></div><div class="field"><label for="driver-age">Idade do principal condutor</label><input id="driver-age" inputmode="numeric" value="${esc(a.age)}" placeholder="Ex.: 42"></div><div class="field"><label for="claims">Sinistros nos últimos 3 anos</label><select id="claims"><option value="">Selecione</option>${["Nenhum","1 sinistro","2 ou mais","Prefiro informar no atendimento"].map(x=>`<option ${a.claims===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="field full"><label for="detail">Algum detalhe importante? <span style="font-weight:400;color:var(--muted)">(opcional)</span></label><input id="detail" value="${esc(a.detail)}" placeholder="Blindagem, condutor jovem, uso em viagens, veículo financiado..."><p id="quote-error" class="field-error" hidden>Informe a situação, a idade do condutor e os sinistros.</p></div></div><div class="actions"><button class="back-button" data-back>← Voltar</button><button class="primary" data-quote>Ver meu diagnóstico →</button></div>`);
}

function calculate() {
  const scored = steps.filter(s => s.dimension);
  const grouped = {};
  Object.keys(dimensions).forEach(k => grouped[k] = {score:0,max:0});
  scored.forEach(s => { const answer = state.answers[s.id]; grouped[s.dimension].max += 4; grouped[s.dimension].score += answer?.score || 0; });
  Object.keys(grouped).forEach(k => grouped[k].percent = Math.round(grouped[k].score / grouped[k].max * 100));
  const score = Math.round(scored.reduce((t,s)=>t+(state.answers[s.id]?.score||0),0) / (scored.length*4) * 100);
  const priority = Object.keys(grouped).sort((a,b)=>grouped[a].percent-grouped[b].percent)[0];
  return { score, grouped, priority };
}

function profile(score) {
  if (score < 45) return { title:"Proteção vulnerável", text:"Seu diagnóstico indica pontos importantes que podem deixar seu patrimônio e sua rotina expostos. Uma revisão orientada é recomendada antes de escolher apenas pelo preço.", action:"Priorize cobertura compreensiva, limites de terceiros e condições de reparo antes de comparar o valor final." };
  if (score < 65) return { title:"Proteção desalinhada", text:"Você já reconhece riscos relevantes, mas algumas decisões da apólice ainda podem não acompanhar o valor e a complexidade do seu veículo.", action:"Compare propostas pelo conjunto de coberturas, franquias, assistência e rede de reparo, não apenas pelo prêmio." };
  if (score < 82) return { title:"Proteção consistente", text:"Sua proteção demonstra uma boa base. O próximo passo é conferir se limites, assistência e condições específicas permanecem adequados à sua rotina atual.", action:"Use a nova cotação para ajustar detalhes que fazem diferença em sinistros de maior impacto ou reparos longos." };
  return { title:"Proteção bem estruturada", text:"Você demonstra atenção madura à preservação do veículo, à responsabilidade com terceiros e à continuidade da rotina.", action:"A cotação deve preservar esse padrão e buscar eficiência sem retirar coberturas que sustentam sua tranquilidade." };
}

function whatsappUrl(result, p) {
  const c = state.answers.contact, v = state.answers.vehicle, q = state.answers.quote;
  const msg = ["Olá, Grupo Juliati! Concluí o Diagnóstico de Proteção Premium e gostaria de receber uma cotação.","",`Nome: ${c.name}`,`WhatsApp: ${c.phone}`,`Veículo: ${v.brand} ${v.model} ${v.year}`,`Faixa de valor: ${v.value}`,`CEP de pernoite: ${v.zip}`,`Situação: ${q.insurance}${q.expiry ? ` | vencimento ${q.expiry}` : ""}`,`Condutor principal: ${q.age} anos`,`Sinistros: ${q.claims}`,q.detail ? `Observação: ${q.detail}` : "",`Diagnóstico: ${p.title} (${result.score}%)`,`Prioridade: ${dimensions[result.priority].name}`,"","Podemos continuar a pré-cotação?"].filter(Boolean).join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function resultStep() {
  const result = calculate(), p = profile(result.score), c = state.answers.contact, v = state.answers.vehicle;
  const cards = Object.entries(result.grouped).map(([key,val])=>`<article class="dimension-card"><div class="dimension-head"><strong>${dimensions[key].name}</strong><span class="dimension-score">${val.percent}%</span></div><div class="dimension-bar"><span style="width:${val.percent}%"></span></div><p>${val.percent < 65 ? dimensions[key].low : dimensions[key].high}</p></article>`).join("");
  app.innerHTML = `<div class="shell">${header()}<main class="result-page"><div class="result-wrap"><section class="result-hero"><div class="result-copy"><p class="eyebrow">Seu diagnóstico, ${esc(c.name.split(" ")[0])}</p><h1>${p.title}</h1><p>${p.text}</p></div><div class="score-panel"><div class="score-ring" style="--score:${result.score*3.6}deg"><span class="score-value">${result.score}%</span></div><p>Índice de alinhamento da proteção</p></div></section><section class="result-section"><h2>Leitura por dimensão</h2><p class="result-lead">O índice não é uma cotação nem uma análise de apólice. Ele organiza os pontos que merecem atenção na conversa com o corretor.</p><div class="dimension-grid">${cards}</div></section><section class="result-section"><h2>Seu próximo passo</h2><p class="result-lead">A maior oportunidade identificada está em <strong>${dimensions[result.priority].name.toLowerCase()}</strong>.</p><div class="recommendation"><article><h3>Recomendação principal</h3><p>${p.action}</p></article><article><h3>O que comparar na cotação</h3><ul><li>Franquia e forma de indenização</li><li>Limites para danos materiais e corporais</li><li>Carro reserva e quilometragem de guincho</li><li>Vidros, sensores, peças e rede de reparo</li></ul></article></div></section><section class="result-section"><h2>Pré-cotação organizada</h2><p class="result-lead">Esses dados seguirão na mensagem para reduzir perguntas repetidas durante o atendimento.</p><div class="vehicle-summary"><div><span>Veículo</span><strong>${esc(v.brand)} ${esc(v.model)}</strong></div><div><span>Ano/modelo</span><strong>${esc(v.year)}</strong></div><div><span>Faixa de valor</span><strong>${esc(v.value)}</strong></div><div><span>WhatsApp</span><strong>${esc(c.phone)}</strong></div></div></section><section class="result-section"><div class="cta-card"><div><p class="eyebrow" style="color:var(--navy);margin-bottom:10px">Grupo Juliati</p><h2>Transforme o diagnóstico em uma cotação sob medida</h2><p>Envie seus dados ao especialista e compare opções de seguradoras com orientação personalizada.</p></div><div class="cta-actions"><a class="whatsapp" href="${whatsappUrl(result,p)}" target="_blank" rel="noopener noreferrer">Continuar pelo WhatsApp</a><button class="secondary" data-pdf>Salvar diagnóstico em PDF</button></div></div><p class="disclaimer">Diagnóstico informativo e preliminar. Coberturas, aceitação, franquias e valores dependem da análise de risco e das condições de cada seguradora. Nenhum dado é enviado automaticamente ao Grupo Juliati até que você abra e envie a mensagem no WhatsApp.</p><button class="restart" data-restart>Refazer diagnóstico</button></section></div></main></div>`;
}

function render() {
  const step = steps[state.current];
  if (step.type === "intro") renderIntro();
  if (step.type === "contact") contactStep(step);
  if (step.type === "vehicle") vehicleStep(step);
  if (step.type === "choice") choiceStep(step);
  if (step.type === "quote") quoteStep(step);
  if (step.type === "result") resultStep();
  bindEvents();
}

function bindEvents() {
  document.querySelector("[data-next]")?.addEventListener("click", () => { state.current++; render(); });
  document.querySelector("[data-back]")?.addEventListener("click", () => { state.current = Math.max(0,state.current-1); render(); });
  document.querySelectorAll("[data-choice]").forEach(choice => choice.addEventListener("click", () => {
    const step=steps[state.current], index=Number(choice.dataset.choice), o=step.options[index];
    state.answers[step.id]={index,score:o.score,value:o.label,tag:o.tag};
    choice.classList.add("selected");
    setTimeout(()=>{state.current++;render();},180);
  }));
  document.querySelector("[data-contact]")?.addEventListener("click", () => {
    const name=document.querySelector("#name").value.trim(), phone=document.querySelector("#phone").value.trim(), email=document.querySelector("#email").value.trim();
    if(name.length<3 || !validPhone(phone)){ document.querySelector("#phone-error").hidden=false; return; }
    state.answers.contact={name,phone,email}; state.current++; render();
  });
  document.querySelector("[data-vehicle]")?.addEventListener("click", () => {
    const data={brand:document.querySelector("#brand").value.trim(),model:document.querySelector("#model").value.trim(),year:document.querySelector("#year").value.trim(),value:document.querySelector("#value").value,zip:document.querySelector("#zip").value.trim()};
    if(!data.brand||!data.model||data.year.length<4||digits(data.zip).length!==8||!data.value){document.querySelector("#vehicle-error").hidden=false;return;}
    state.answers.vehicle=data; state.current++;render();
  });
  document.querySelector("[data-quote]")?.addEventListener("click", () => {
    const data={insurance:document.querySelector("#insurance").value,expiry:document.querySelector("#expiry").value,age:document.querySelector("#driver-age").value.trim(),claims:document.querySelector("#claims").value,detail:document.querySelector("#detail").value.trim()}; const age=Number(data.age);
    if(!data.insurance||!data.claims||age<18||age>100){document.querySelector("#quote-error").hidden=false;return;}
    state.answers.quote=data;state.current++;render();
  });
  document.querySelector("[data-pdf]")?.addEventListener("click", () => window.print());
  document.querySelector("[data-restart]")?.addEventListener("click", () => { state.current=0;state.answers={};render(); });
}

render();
