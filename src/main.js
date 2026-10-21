import './style.css';

const resources = [
  ['hoje', 'Seu dia de relance', 'O essencial, em um painel.', 'O que importa hoje.<br>Sem complicar.', 'Veja seus registros e acompanhe as metas que você definiu para o dia.', '01-inicio-painel-hoje.png'],
  ['alimentacao', 'Alimentação organizada', 'Comida real, porções do seu dia.', 'Sua alimentação.<br>Do seu jeito.', 'Registre alimentos da tabela TACO e acompanhe suas refeições em um só lugar.', '02-alimentacao.png'],
  ['refeicao', 'Refeições favoritas', 'Menos passos para registrar.', 'O que faz parte<br>da sua rotina.', 'Encontre refeições anteriores e favoritas para facilitar seus próximos registros.', '03-registrar-refeicao.png'],
  ['aplicacoes', 'Aplicações em dia', 'Datas, locais e lembretes.', 'Cada aplicação.<br>Bem registrada.', 'Organize os registros de datas e locais conforme o tratamento orientado pelo seu médico.', '04-registrar-aplicacao-mapa-corporal.png'],
  ['progresso', 'Seu progresso', 'Seu histórico em perspectiva.', 'Uma visão maior<br>da sua rotina.', 'Observe seus registros ao longo do tempo e leve mais contexto para o acompanhamento.', '05-progresso.png'],
  ['diario', 'Um espaço para você', 'Sono, água e como você se sente.', 'Seu dia tem<br>muitos detalhes.', 'Reúna seus registros diários e observe fome, energia, sono e sintomas ao longo do tempo.', '06-diario.png'],
  ['relatorio', 'Tudo para a consulta', 'Uma conversa com mais contexto.', 'Seus registros.<br>Prontos para conversar.', 'Consulte um resumo dos seus registros. A prévia é grátis; a exportação em PDF é Premium.', '07-relatorio-consulta.png'],
  ['privacidade', 'Privacidade por princípio', 'Seus dados ficam com você.', 'Pessoal.<br>Como deve ser.', 'Conheça o armazenamento local e os lembretes no aparelho, sem anúncios nem rastreamento.', '08-privacidade.png']
];
const tablist = document.querySelector('.resource-tabs');
const panel = document.querySelector('.resource-panel');
resources.forEach((resource, index) => {
  const button = document.createElement('button');
  button.className = 'resource-tab';
  button.id = `tab-${resource[0]}`;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-controls', panel.id);
  button.setAttribute('aria-selected', String(index === 0));
  button.tabIndex = index === 0 ? 0 : -1;
  button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><span><strong>${resource[1]}</strong><small>${resource[2]}</small></span><span aria-hidden="true">↗</span>`;
  tablist.append(button);
});
const tabs = [...tablist.children];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 760px)');
function selectResource(index, animate = true) {
  const resource = resources[index];
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tabs[index].id);
  panel.querySelector('.panel-number').textContent = `${String(index + 1).padStart(2, '0')} / 08`;
  panel.querySelector('h3').innerHTML = resource[3];
  panel.querySelector('.panel-copy p').textContent = resource[4];
  const image = panel.querySelector('img');
  image.src = `/assets/${resource[5]}`;
  image.alt = resource[1] + ' — tela real do Equilibra';
  panel.querySelector('button').setAttribute('aria-label', `Ampliar: ${resource[1]}`);
  if (animate && !motion.matches) {
    panel.classList.remove('is-switching');
    void panel.offsetWidth;
    panel.classList.add('is-switching');
  }
  if (mobile.matches) tablist.scrollTo({ left: tabs[index].offsetLeft - tablist.offsetLeft, behavior: motion.matches ? 'instant' : 'smooth' });
}
selectResource(0, false);
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectResource(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % tabs.length;
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectResource(next); tabs[next].focus({preventScroll:true}); }
  });
});
function setOrientation() { tablist.setAttribute('aria-orientation', mobile.matches ? 'horizontal' : 'vertical'); }
setOrientation();
mobile.addEventListener('change', setOrientation);
document.querySelectorAll('[data-resource]').forEach(link => link.addEventListener('click', () => selectResource(resources.findIndex(resource => resource[0] === link.dataset.resource))));

const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); }
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
mobile.addEventListener('change', closeMenu);

const preview = document.querySelector('.preview');
let previewTrigger;
document.querySelectorAll('.screenshot').forEach(button => {
  button.setAttribute('aria-haspopup', 'dialog');
  button.addEventListener('click', () => {
    previewTrigger = button;
    const image = button.querySelector('img');
    preview.querySelector('img').src = image.src;
    preview.querySelector('img').alt = image.alt;
    preview.showModal();
    document.body.classList.add('preview-open');
  });
});
preview.querySelector('button').addEventListener('click', () => preview.close());
preview.addEventListener('click', event => { if (event.target === preview) { const r = preview.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) preview.close(); } });
preview.addEventListener('close', () => { document.body.classList.remove('preview-open'); previewTrigger?.focus({preventScroll:true}); });

if ('IntersectionObserver' in window && !motion.matches) {
  const targets = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: .08});
  targets.forEach(element => { if (element.closest('.social-cards')) element.style.setProperty('--reveal-delay', element.previousElementSibling ? '100ms' : '0ms'); element.classList.add('reveal'); observer.observe(element); });
  motion.addEventListener('change', event => { if (event.matches) { targets.forEach(element => element.classList.add('visible')); observer.disconnect(); } });
}

