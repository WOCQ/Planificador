const TODAY = new Date(2026, 9, 6);
const COURSES = [
  "Interacción Hombre Máquina",
  "Desarrollo Web Integrado",
  "Base de Datos",
  "Ingeniería de Software",
];
const TYPES = {
  prog: { n: "Programación", i: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/>' },
  lect: {
    n: "Lectura",
    i: '<path d="M3 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z"/>',
  },
  inv: {
    n: "Investigación",
    i: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  },
  inf: {
    n: "Informe",
    i: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/>',
  },
  lab: {
    n: "Laboratorio",
    i: '<path d="M9 3h6M10 3v6L5 19a1 1 0 0 0 1 2h12a1 1 0 0 0 1-2l-5-10V3"/>',
  },
  exa: {
    n: "Examen",
    i: '<path d="M5 4h14v16H5z"/><path d="M8 9l2 2 4-4M8 16h8"/>',
  },
};
const TEMPLATES = {
  "Informe académico": [
    "Leer la guía y la rúbrica",
    "Redactar el borrador por apartados",
    "Revisar citas y referencias APA 7",
    "Exportar a PDF y entregar en el aula virtual",
  ],
  "Proyecto de software": [
    "Definir requisitos y alcance",
    "Diseñar modelo de datos y endpoints",
    "Implementar y probar",
    "Documentar y subir al repositorio",
  ],
  "Revisión sistemática": [
    "Definir pregunta y cadena de búsqueda",
    "Buscar en bases de datos",
    "Aplicar criterios de inclusión",
    "Sintetizar resultados",
  ],
};
let uid = 100;
const d = (m, day, h = 23, mi = 59) => new Date(2026, m, day, h, mi);
let tasks = [
  {
    id: 1,
    title: "API REST de autenticación (Spring Boot)",
    course: "Desarrollo Web Integrado",
    type: "prog",
    due: d(9, 6, 23, 59),
    prio: "Alta",
    done: false,
    subs: [
      { id: 11, text: "Configurar Spring Security", date: d(9, 4), done: true },
      { id: 12, text: "Endpoint de login con JWT", date: d(9, 5), done: true },
      { id: 13, text: "Pruebas con Postman", date: d(9, 6), done: false },
    ],
  },
  {
    id: 2,
    title: "Informe APF2: prototipo y evaluación",
    course: "Interacción Hombre Máquina",
    type: "inf",
    due: d(9, 9, 23, 59),
    prio: "Alta",
    done: false,
    subs: [],
  },
  {
    id: 3,
    title: "Lectura: Norman, cap. 2",
    course: "Interacción Hombre Máquina",
    type: "lect",
    due: d(9, 8, 18, 0),
    prio: "Media",
    done: false,
    subs: [],
  },
  {
    id: 4,
    title: "Laboratorio 5: normalización",
    course: "Base de Datos",
    type: "lab",
    due: d(9, 12, 20, 0),
    prio: "Media",
    done: false,
    subs: [],
  },
  {
    id: 5,
    title: "RSL: búsqueda en Scopus",
    course: "Ingeniería de Software",
    type: "inv",
    due: d(9, 15, 23, 59),
    prio: "Media",
    done: false,
    subs: [
      {
        id: 51,
        text: "Definir cadena de búsqueda",
        date: d(9, 8),
        done: false,
      },
      {
        id: 52,
        text: "Exportar resultados a Excel",
        date: d(9, 12),
        done: false,
      },
    ],
  },
  {
    id: 6,
    title: "Examen parcial",
    course: "Base de Datos",
    type: "exa",
    due: d(9, 20, 8, 0),
    prio: "Alta",
    done: false,
    subs: [],
  },
  {
    id: 7,
    title: "Cuestionario semana 8",
    course: "Ingeniería de Software",
    type: "exa",
    due: d(9, 2, 23, 59),
    prio: "Baja",
    done: true,
    subs: [],
  },
  {
    id: 8,
    title: "Mapa de navegación del sitio",
    course: "Interacción Hombre Máquina",
    type: "inf",
    due: d(9, 23, 23, 59),
    prio: "Baja",
    done: false,
    subs: [],
  },
];
let view = "inicio",
  calMonth = new Date(2026, 9, 1),
  filter = { course: "Todos", prio: "Todas", show: "pendientes" },
  openId = null,
  toastTimer = null;

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const DIAS_L = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const fmt = (dt) =>
  `${DIAS[dt.getDay()]} ${dt.getDate()} ${MESES[dt.getMonth()].slice(0, 3)}`;
const hhmm = (dt) =>
  dt.getHours() === 23 && dt.getMinutes() === 59
    ? "23:59"
    : `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const dayDiff = (a) =>
  Math.round(
    (new Date(a.getFullYear(), a.getMonth(), a.getDate()) - TODAY) / 86400000,
  );
function status(t) {
  if (t.done) return { c: "ok", l: "Completada" };
  const n = dayDiff(t.due);
  if (n < 0) return { c: "danger", l: `Vencida hace ${-n} d` };
  if (n === 0) return { c: "danger", l: `Vence hoy ${hhmm(t.due)}` };
  if (n <= 3)
    return { c: "warn", l: n === 1 ? `Mañana ${hhmm(t.due)}` : `En ${n} días` };
  return { c: "plan", l: fmt(t.due) };
}
const icon = (k) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TYPES[k].i}</svg>`;
const check =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2"><path d="M5 12l5 5 9-10"/></svg>';
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const prog = (t) =>
  t.subs.length
    ? Math.round((100 * t.subs.filter((s) => s.done).length) / t.subs.length)
    : t.done
      ? 100
      : 0;
const byDue = (a, b) => a.due - b.due;

function taskRow(t) {
  const s = status(t);
  const sub = t.subs.length
    ? `<span>· ${t.subs.filter((x) => x.done).length}/${t.subs.length} subtareas <span class="progress"><i style="width:${prog(t)}%"></i></span></span>`
    : `<span>· sin desglosar</span>`;
  return `<div class="task ${t.done ? "done" : ""}" data-open="${t.id}" role="group" tabindex="0" aria-label="Tarea: ${esc(t.title)}. ${s.l}. Presiona Enter para abrir el detalle.">
    <button class="chk" role="checkbox" aria-checked="${t.done}" aria-label="Marcar «${esc(t.title)}» como completada" data-toggle="${t.id}">${t.done ? check : ""}</button>
    <div class="t-ico" title="${TYPES[t.type].n}">${icon(t.type)}</div>
    <div><div class="t-title">${esc(t.title)}</div><div class="t-meta"><span>${esc(t.course)}</span><span>· ${TYPES[t.type].n}</span>${sub}</div></div>
    <span class="prio">Prioridad <b>${t.prio}</b></span>
    <span class="due ${s.c}"><span class="dot d-${s.c === "danger" ? "danger" : s.c === "warn" ? "warn" : s.c === "ok" ? "ok" : "plan"}"></span>${s.l}</span>
  </div>`;
}
function legend() {
  return `<div class="legend" aria-label="Leyenda de colores"><span><i class="dot d-danger"></i>Vence hoy o vencida</span><span><i class="dot d-warn"></i>En 1 a 3 días</span><span><i class="dot d-plan"></i>Planificada</span><span><i class="dot d-ok"></i>Completada</span></div>`;
}

function renderInicio() {
  const pend = tasks.filter((t) => !t.done).sort(byDue);
  const hoy = pend.filter((t) => dayDiff(t.due) <= 0);
  const semana = pend.filter((t) => {
    const n = dayDiff(t.due);
    return n >= 0 && n <= 7;
  });
  const doneWeek =
    tasks.filter((t) => t.done).length +
    tasks.flatMap((t) => t.subs).filter((s) => s.done).length;
  return `<div class="head-row"><div><h1>Buenas tardes, Estudiante</h1><p class="sub">Hoy es ${DIAS_L[TODAY.getDay()]} ${TODAY.getDate()} de ${MESES[TODAY.getMonth()]} de ${TODAY.getFullYear()}. Esto es lo que requiere tu atención.</p></div>${legend()}</div>
  <div class="kpis">
    <div class="card kpi"><div class="label">Vencen hoy</div><div class="value">${hoy.length}</div><div class="hint">${hoy.filter((t) => t.prio === "Alta").length} de prioridad alta</div></div>
    <div class="card kpi"><div class="label">Entregas en los próximos 7 días</div><div class="value">${semana.length}</div><div class="hint">Incluye las de hoy</div></div>
    <div class="card kpi"><div class="label">Tareas y subtareas completadas</div><div class="value">${doneWeek}</div><div class="hint">En lo que va de la semana</div></div>
  </div>
  <div class="grid-2">
    <div style="display:flex;flex-direction:column;gap:18px">
      <div class="card"><div class="card-h"><h2>Para hoy</h2></div>${hoy.length ? hoy.map(taskRow).join("") : `<div class="empty">No tienes entregas para hoy. Revisa las próximas.</div>`}<button class="add-inline" data-new>+ Agregar tarea para hoy</button></div>
      <div class="card"><div class="card-h"><h2>Próximas entregas</h2><button class="link" data-go="tareas">Ver todas →</button></div>${pend
        .filter((t) => dayDiff(t.due) > 0)
        .slice(0, 4)
        .map(taskRow)
        .join("")}</div>
    </div>
    <div class="card mini-cal">${miniCal()}</div>
  </div>`;
}
function miniCal() {
  const y = TODAY.getFullYear(),
    m = TODAY.getMonth(),
    first = new Date(y, m, 1),
    start = (first.getDay() + 6) % 7,
    days = new Date(y, m + 1, 0).getDate();
  let h = `<div class="mc-head"><span>${MESES[m][0].toUpperCase() + MESES[m].slice(1)} ${y}</span><button class="link btn-ghost" style="color:var(--primary);font-weight:600;font-size:12.5px;border:0;background:none" data-go="calendario">Abrir calendario</button></div><div class="mc-grid">`;
  ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].forEach(
    (w) => (h += `<div class="wd">${w}</div>`),
  );
  for (let i = 0; i < start; i++) h += `<div class="mc-day out">·</div>`;
  for (let i = 1; i <= days; i++) {
    const dt = new Date(y, m, i);
    const has = tasks.some((t) => !t.done && sameDay(t.due, dt));
    h += `<div class="mc-day ${sameDay(dt, TODAY) ? "today" : ""} ${has ? "has" : ""}" title="${has ? "Hay entregas" : ""}">${i}</div>`;
  }
  return (
    h +
    `</div><p class="hint-txt" style="margin-top:10px">El punto indica días con entregas. El día resaltado es hoy.</p>`
  );
}
function renderTareas() {
  let list = tasks.slice().sort(byDue);
  if (filter.show === "pendientes") list = list.filter((t) => !t.done);
  if (filter.show === "completadas") list = list.filter((t) => t.done);
  if (filter.course !== "Todos")
    list = list.filter((t) => t.course === filter.course);
  if (filter.prio !== "Todas")
    list = list.filter((t) => t.prio === filter.prio);
  const q = document.getElementById("search").value.trim().toLowerCase();
  if (q)
    list = list.filter((t) => (t.title + t.course).toLowerCase().includes(q));
  const groups = [
    ["Vencidas o para hoy", (t) => !t.done && dayDiff(t.due) <= 0],
    [
      "Esta semana",
      (t) => !t.done && dayDiff(t.due) > 0 && dayDiff(t.due) <= 7,
    ],
    ["Más adelante", (t) => !t.done && dayDiff(t.due) > 7],
    ["Completadas", (t) => t.done],
  ];
  let body = "";
  groups.forEach(([n, f]) => {
    const g = list.filter(f);
    if (g.length)
      body +=
        `<div class="group-title">${n} · ${g.length}</div>` +
        g.map(taskRow).join("");
  });
  return `<div class="head-row"><div><h1>Mis tareas</h1><p class="sub">Haz clic en una tarea para ver su detalle y desglosarla en subtareas.</p></div>${legend()}</div>
  <div class="toolbar">
    <div class="seg" role="group" aria-label="Mostrar">${["pendientes", "completadas", "todas"].map((s) => `<button aria-pressed="${filter.show === s}" data-show="${s}">${s[0].toUpperCase() + s.slice(1)}</button>`).join("")}</div>
    <select class="f" id="fCourse" aria-label="Filtrar por curso"><option>Todos</option>${COURSES.map((c) => `<option ${filter.course === c ? "selected" : ""}>${c}</option>`).join("")}</select>
    <select class="f" id="fPrio" aria-label="Filtrar por prioridad">${["Todas", "Alta", "Media", "Baja"].map((p) => `<option ${filter.prio === p ? "selected" : ""}>${p}</option>`).join("")}</select>
    ${filter.course !== "Todos" || filter.prio !== "Todas" ? `<button class="btn btn-ghost" id="clearF">Quitar filtros</button>` : ""}
  </div>
  <div class="card">${body || `<div class="empty">No hay tareas con estos filtros. <button class="btn btn-ghost" id="clearF2" style="color:var(--primary)">Quitar filtros</button></div>`}<button class="add-inline" data-new>+ Agregar tarea</button></div>`;
}
function renderCal() {
  const y = calMonth.getFullYear(),
    m = calMonth.getMonth(),
    first = new Date(y, m, 1),
    start = (first.getDay() + 6) % 7;
  const gridStart = new Date(y, m, 1 - start);
  let cells = "";
  for (let i = 0; i < 42; i++) {
    const dt = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    );
    if (i >= 35 && dt.getMonth() !== m) break;
    const items = [];
    tasks.forEach((t) => {
      if (sameDay(t.due, dt)) {
        const s = status(t);
        items.push(
          `<button class="chip ${s.c}" data-open="${t.id}" title="${esc(t.title)} · ${s.l}"><span class="tag">Entrega</span>${esc(t.title)}</button>`,
        );
      }
      t.subs.forEach((sb) => {
        if (sameDay(sb.date, dt))
          items.push(
            `<button class="chip ${sb.done ? "ok" : "plan"}" data-open="${t.id}" title="Subtarea de: ${esc(t.title)}" style="opacity:.92">◦ ${esc(sb.text)}</button>`,
          );
      });
    });
    cells += `<div class="cal-cell ${dt.getMonth() !== m ? "out" : ""} ${sameDay(dt, TODAY) ? "today" : ""}"><span class="cal-num">${dt.getDate()}</span>${items.slice(0, 3).join("")}${items.length > 3 ? `<span class="hint-txt">+${items.length - 3} más</span>` : ""}</div>`;
  }
  return `<div class="head-row"><div><h1>Calendario</h1><p class="sub">Entregas y subtareas del mes. Haz clic en un elemento para abrir su detalle.</p></div>${legend()}</div>
  <div class="card cal"><div class="cal-head"><button class="icon-btn" id="prevM" aria-label="Mes anterior">‹</button><button class="icon-btn" id="nextM" aria-label="Mes siguiente">›</button><h2>${MESES[m][0].toUpperCase() + MESES[m].slice(1)} de ${y}</h2><button class="btn" id="todayM" style="margin-left:auto">Hoy</button></div>
  <div class="cal-grid">${["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((w) => `<div class="cal-wd">${w}</div>`).join("")}${cells}</div></div>`;
}
function renderCursos() {
  return `<div class="head-row"><div><h1>Cursos</h1><p class="sub">Avance de tus entregas agrupadas por curso.</p></div></div><div class="courses">${COURSES.map(
    (c) => {
      const ts = tasks.filter((t) => t.course === c),
        dn = ts.filter((t) => t.done).length,
        nx = ts.filter((t) => !t.done).sort(byDue)[0];
      return `<div class="card course"><h3>${c}</h3><div class="hint-txt">${ts.length} entregas · ${dn} completadas</div><div class="bar"><i style="width:${ts.length ? (100 * dn) / ts.length : 0}%"></i></div><div class="t-meta">${nx ? `Próxima: <b style="color:var(--text)">${esc(nx.title)}</b> · ${fmt(nx.due)}` : "Sin entregas pendientes"}</div></div>`;
    },
  ).join("")}</div>`;
}
function renderProg() {
  const all = tasks.flatMap((t) => t.subs),
    ds = all.filter((s) => s.done).length;
  return `<div class="head-row"><div><h1>Progreso</h1><p class="sub">Resumen de tu avance (datos de ejemplo).</p></div></div><div class="kpis"><div class="card kpi"><div class="label">Entregas completadas</div><div class="value">${tasks.filter((t) => t.done).length} / ${tasks.length}</div></div><div class="card kpi"><div class="label">Subtareas completadas</div><div class="value">${ds} / ${all.length}</div></div><div class="card kpi"><div class="label">Entregas desglosadas</div><div class="value">${tasks.filter((t) => t.subs.length).length}</div><div class="hint">Desglosar ayuda a empezar antes</div></div></div>`;
}
function render() {
  const titles = {
    inicio: "Inicio",
    tareas: "Mis tareas",
    calendario: "Calendario",
    cursos: "Cursos",
    progreso: "Progreso",
  };
  document.getElementById("crumb").textContent = titles[view];
  document.title = `${titles[view]} · Prototipo V2.1`;
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) =>
      b.setAttribute(
        "aria-current",
        b.dataset.view === view ? "page" : "false",
      ),
    );
  document.getElementById("navCount").textContent = tasks.filter(
    (t) => !t.done,
  ).length;
  const v = document.getElementById("view");
  v.innerHTML = {
    inicio: renderInicio,
    tareas: renderTareas,
    calendario: renderCal,
    cursos: renderCursos,
    progreso: renderProg,
  }[view]();
  bindView();
  if (openId) renderDrawer();
}
function bindView() {
  const v = document.getElementById("view");
  v.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.closest("[data-toggle]")) return;
      openTask(+el.dataset.open);
    });
    el.addEventListener("keydown", (e) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        !e.target.closest("[data-toggle]")
      ) {
        e.preventDefault();
        openTask(+el.dataset.open);
      }
    });
  });
  v.querySelectorAll("[data-toggle]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTask(+el.dataset.toggle);
    }),
  );
  v.querySelectorAll("[data-go]").forEach((el) =>
    el.addEventListener("click", () => go(el.dataset.go)),
  );
  v.querySelectorAll("[data-new]").forEach((el) =>
    el.addEventListener("click", () => openNew()),
  );
  v.querySelectorAll("[data-show]").forEach((el) =>
    el.addEventListener("click", () => {
      filter.show = el.dataset.show;
      render();
    }),
  );
  const fc = document.getElementById("fCourse");
  if (fc)
    fc.onchange = (e) => {
      filter.course = e.target.value;
      render();
    };
  const fp = document.getElementById("fPrio");
  if (fp)
    fp.onchange = (e) => {
      filter.prio = e.target.value;
      render();
    };
  ["clearF", "clearF2"].forEach((id) => {
    const b = document.getElementById(id);
    if (b)
      b.onclick = () => {
        filter.course = "Todos";
        filter.prio = "Todas";
        render();
      };
  });
  const p = document.getElementById("prevM");
  if (p) {
    p.onclick = () => {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
      render();
    };
    document.getElementById("nextM").onclick = () => {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
      render();
    };
    document.getElementById("todayM").onclick = () => {
      calMonth = new Date(2026, 9, 1);
      render();
    };
  }
}
function go(v) {
  view = v;
  closeDrawer(true);
  render();
  document.querySelector("main").scrollTop = 0;
}

function toast(msg, actionLabel, action, ms = 6000) {
  const t = document.getElementById("toast");
  clearTimeout(toastTimer);
  t.innerHTML = `<span class="ok-ico">✓</span><span>${msg}</span>${actionLabel ? `<button id="toastAct">${actionLabel}</button>` : ""}<button aria-label="Cerrar aviso" id="toastX" style="background:none">✕</button><span class="timer" id="tbar" style="width:100%"></span>`;
  t.classList.add("show");
  if (accessSettings.vibration && "vibrate" in navigator) {
    navigator.vibrate([120, 60, 120]);
  }
  const bar = document.getElementById("tbar");
  if (!accessSettings.reduceMotion) {
    bar.animate([{ width: "100%" }, { width: "0%" }], {
      duration: ms,
      fill: "forwards",
    });
  } else {
    bar.style.width = "0%";
  }
  if (actionLabel)
    document.getElementById("toastAct").onclick = () => {
      action();
      t.classList.remove("show");
    };
  document.getElementById("toastX").onclick = () => t.classList.remove("show");
  toastTimer = setTimeout(() => t.classList.remove("show"), ms);
}
function toggleTask(id) {
  const t = tasks.find((x) => x.id === id);
  t.done = !t.done;
  render();
  if (t.done)
    toast(`Tarea completada: «${esc(t.title)}»`, "Deshacer", () => {
      t.done = false;
      render();
    });
}
function toggleSub(tid, sid) {
  const t = tasks.find((x) => x.id === tid),
    s = t.subs.find((x) => x.id === sid);
  s.done = !s.done;
  subWarn = "";
  subErr = "";
  render();
  if (s.done) {
    const n = t.subs.filter((x) => x.done).length;
    toast(`Subtarea completada · ${n} de ${t.subs.length}`, "Deshacer", () => {
      s.done = false;
      render();
    });
  }
}

function openTask(id) {
  openId = id;
  subWarn = "";
  subErr = "";
  renderDrawer();
  document.getElementById("drawer").classList.add("show");
  document.getElementById("scrim").classList.add("show");
  setTimeout(() => {
    const i = document.getElementById("subText");
    if (i && !tasks.find((t) => t.id === id).subs.length) i.focus();
  }, 50);
}
function closeDrawer(silent) {
  openId = null;
  document.getElementById("drawer").classList.remove("show");
  document.getElementById("scrim").classList.remove("show");
}
let subWarn = "",
  subErr = "";
function renderDrawer() {
  const t = tasks.find((x) => x.id === openId);
  if (!t) {
    closeDrawer();
    return;
  }
  const s = status(t),
    p = prog(t);
  const subs = t.subs
    .slice()
    .sort((a, b) => a.date - b.date)
    .map(
      (sb) =>
        `<li class="sub-item ${sb.done ? "done" : ""}"><button class="chk" role="checkbox" aria-checked="${sb.done}" aria-label="Completar subtarea ${esc(sb.text)}" data-sub="${sb.id}">${sb.done ? check : ""}</button><span class="s-text">${esc(sb.text)}</span><span class="s-date ${sb.date > t.due ? "late" : ""}" title="${sb.date > t.due ? "Posterior a la entrega" : ""}">${fmt(sb.date)}</span><button class="del" aria-label="Eliminar subtarea ${esc(sb.text)}" data-delsub="${sb.id}">✕</button></li>`,
    )
    .join("");
  const defDate = new Date(
    Math.min(
      t.due.getTime(),
      new Date(
        TODAY.getFullYear(),
        TODAY.getMonth(),
        TODAY.getDate() + 1,
      ).getTime(),
    ),
  );
  document.getElementById("drawer").innerHTML = `
  <div class="dr-head"><div class="t-ico" style="margin-top:2px">${icon(t.type)}</div><div style="flex:1"><h2 id="drTitle">${esc(t.title)}</h2><div class="t-meta">${esc(t.course)} · ${TYPES[t.type].n}</div></div><button class="icon-btn" id="drClose" aria-label="Cerrar panel (Esc)" title="Cerrar (Esc)">✕</button></div>
  <div class="dr-body">
    <dl class="meta-grid"><dt>Entrega</dt><dd>${fmt(t.due)}, ${hhmm(t.due)} <span class="due ${s.c}" style="margin-left:6px">${s.l}</span></dd><dt>Prioridad</dt><dd>${t.prio}</dd><dt>Avance</dt><dd><div class="big-progress" aria-label="Avance ${p}%"><i style="width:${p}%"></i></div><span class="hint-txt">${t.subs.length ? `${t.subs.filter((x) => x.done).length} de ${t.subs.length} subtareas (${p}%)` : "Aún no tiene subtareas"}</span></dd></dl>
    <div><div class="sec-title">Desglose en subtareas <span class="count">${t.subs.length}</span>
      <select class="f" id="tpl" style="margin-left:auto;font-size:12.5px" aria-label="Usar plantilla de desglose"><option value="">Usar plantilla…</option>${Object.keys(
        TEMPLATES,
      )
        .map((k) => `<option>${k}</option>`)
        .join("")}</select></div></div>
    ${t.subs.length ? `<ul class="sub-list" id="subList">${subs}</ul>` : `<div class="tip"><b>¿Cómo desglosar?</b> Divide la entrega en pasos que puedas terminar en una sola sesión de estudio y asigna a cada uno una fecha anterior a la entrega. También puedes partir de una plantilla.</div>`}
    <div>
      <div class="add-sub"><input class="inp ${subErr ? "invalid" : ""}" id="subText" placeholder="Escribe una subtarea y presiona Enter" aria-label="Nueva subtarea" aria-describedby="subMsg"><input class="inp" type="date" id="subDate" value="${defDate.toISOString().slice(0, 10)}" aria-label="Fecha de la subtarea"><button class="btn" id="subAdd">Añadir</button></div>
      <div id="subMsg">${subErr ? `<div class="err-msg">⚠ ${subErr}</div>` : ""}${subWarn ? `<div class="warn-msg" style="margin-top:4px">⚠ ${subWarn}</div>` : ""}</div>
    </div>
  </div>
  <div class="dr-foot"><button class="btn ${t.done ? "" : "btn-primary"}" id="drDone">${t.done ? "Marcar como pendiente" : "✓ Marcar entrega como completada"}</button><button class="btn btn-ghost btn-danger" id="drDel" style="margin-left:auto">Eliminar</button></div>`;
  document.getElementById("drClose").onclick = () => closeDrawer();
  document
    .querySelectorAll("[data-sub]")
    .forEach((b) => (b.onclick = () => toggleSub(t.id, +b.dataset.sub)));
  document.querySelectorAll("[data-delsub]").forEach(
    (b) =>
      (b.onclick = () => {
        const sb = t.subs.find((x) => x.id === +b.dataset.delsub);
        const idx = t.subs.indexOf(sb);
        t.subs.splice(idx, 1);
        render();
        toast("Subtarea eliminada", "Deshacer", () => {
          t.subs.splice(idx, 0, sb);
          render();
        });
      }),
  );
  const add = () => {
    const txt = document.getElementById("subText").value.trim(),
      dv = document.getElementById("subDate").value;
    subErr = "";
    subWarn = "";
    if (!txt) {
      subErr =
        "Escribe el nombre de la subtarea (por ejemplo, «Redactar introducción»).";
      renderDrawer();
      document.getElementById("subText").focus();
      return;
    }
    if (!dv) {
      subErr = "Elige una fecha para la subtarea.";
      renderDrawer();
      return;
    }
    const [yy, mm, dd] = dv.split("-").map(Number),
      dt = new Date(yy, mm - 1, dd, 23, 59);
    t.subs.push({ id: ++uid, text: txt, date: dt, done: false });
    if (dt > t.due)
      subWarn = `«${esc(txt)}» quedó después de la entrega (${fmt(t.due)}). Te sugerimos adelantarla.`;
    render();
    setTimeout(
      () =>
        document.getElementById("subText") &&
        document.getElementById("subText").focus(),
      0,
    );
  };
  document.getElementById("subAdd").onclick = add;
  document.getElementById("subText").onkeydown = (e) => {
    if (e.key === "Enter") add();
  };
  document.getElementById("tpl").onchange = (e) => {
    const k = e.target.value;
    if (!k) return;
    const steps = TEMPLATES[k];
    const span = Math.max(1, dayDiff(t.due));
    steps.forEach((s, i) => {
      const off = Math.max(
        0,
        Math.round((span * (i + 1)) / steps.length) -
          (i === steps.length - 1 ? 0 : 0),
      );
      const dt = new Date(
        TODAY.getFullYear(),
        TODAY.getMonth(),
        TODAY.getDate() + Math.min(off, span),
        23,
        59,
      );
      t.subs.push({
        id: ++uid,
        text: s,
        date: dt > t.due ? new Date(t.due) : dt,
        done: false,
      });
    });
    subErr = "";
    subWarn = "";
    render();
    toast(
      `Se añadieron ${steps.length} subtareas de la plantilla «${k}»`,
      "Deshacer",
      () => {
        t.subs.splice(t.subs.length - steps.length, steps.length);
        render();
      },
    );
  };
  document.getElementById("drDone").onclick = () => {
    toggleTask(t.id);
  };
  document.getElementById("drDel").onclick = () =>
    confirmBox(
      "¿Eliminar esta entrega?",
      `Se eliminará «${esc(t.title)}» y sus ${t.subs.length} subtareas.`,
      "Eliminar",
      () => {
        const idx = tasks.indexOf(t);
        tasks.splice(idx, 1);
        closeDrawer();
        render();
        toast("Entrega eliminada", "Deshacer", () => {
          tasks.splice(idx, 0, t);
          render();
        });
      },
    );
}

let form = {},
  errs = {};
function openNew() {
  form = {
    title: "",
    course: "",
    type: "",
    date: "",
    time: "23:59",
    prio: "Media",
    breakdown: true,
  };
  errs = {};
  renderModal();
  document.getElementById("modalWrap").classList.add("show");
  setTimeout(() => document.getElementById("fTitle").focus(), 30);
}
function dirty() {
  return form.title || form.course || form.type || form.date;
}
function renderModal() {
  const e = (k) =>
    errs[k] ? `<div class="err-msg" id="err-${k}">⚠ ${errs[k]}</div>` : "";
  document.getElementById("modal").innerHTML = `
  <div class="m-head"><h2 id="mTitle">Nueva tarea</h2><button class="icon-btn" style="margin-left:auto" id="mX" aria-label="Cerrar (Esc)">✕</button></div>
  <div class="m-body">
    ${Object.keys(errs).length ? `<div class="err-msg" role="alert" style="background:var(--danger-soft);padding:8px 10px;border-radius:8px;margin:0">Revisa ${Object.keys(errs).length === 1 ? "el campo marcado" : "los " + Object.keys(errs).length + " campos marcados"} para poder guardar.</div>` : ""}
    <div class="field"><label for="fTitle">Nombre de la tarea <span class="req">*</span></label><input class="inp ${errs.title ? "invalid" : ""}" id="fTitle" value="${esc(form.title)}" placeholder="Ej.: Informe APF2 de Interacción Hombre Máquina" aria-required="true">${e("title")}</div>
    <div class="row-2">
      <div class="field"><label for="fCourseN">Curso <span class="req">*</span></label><select class="inp ${errs.course ? "invalid" : ""}" id="fCourseN" aria-required="true"><option value="">Selecciona un curso</option>${COURSES.map((c) => `<option ${form.course === c ? "selected" : ""}>${c}</option>`).join("")}</select>${e("course")}</div>
      <div class="field"><label>Prioridad</label><div class="seg" role="group" aria-label="Prioridad">${["Alta", "Media", "Baja"].map((p) => `<button type="button" aria-pressed="${form.prio === p}" data-prio="${p}">${p}</button>`).join("")}</div></div>
    </div>
    <div class="field"><label>Tipo de actividad</label><div class="types" role="group" aria-label="Tipo de actividad">${Object.entries(
      TYPES,
    )
      .map(
        ([k, v]) =>
          `<button type="button" class="type" aria-pressed="${form.type === k}" data-type="${k}">${icon(k)}${v.n}</button>`,
      )
      .join(
        "",
      )}</div><div class="hint-txt">Opcional. Ayuda a reconocer la tarea por su ícono.</div></div>
    <div class="row-2">
      <div class="field"><label for="fDate">Fecha de entrega <span class="req">*</span></label><input class="inp ${errs.date ? "invalid" : ""}" type="date" id="fDate" value="${form.date}" min="2026-01-01" aria-required="true">${e("date")}</div>
      <div class="field"><label for="fTime">Hora límite</label><input class="inp" type="time" id="fTime" value="${form.time}"></div>
    </div>
    <label style="display:flex;gap:8px;align-items:center;font-size:13.5px"><input type="checkbox" id="fBreak" ${form.breakdown ? "checked" : ""}> Abrir el desglose en subtareas después de guardar</label>
    <div class="hint-txt"><span class="req">*</span> Campos obligatorios</div>
  </div>
  <div class="m-foot"><span class="hint-txt" style="margin-right:auto">Esc para cancelar</span><button class="btn" id="mCancel">Cancelar</button><button class="btn btn-primary" id="mSave">Guardar tarea</button></div>`;
  const sync = () => {
    form.title = document.getElementById("fTitle").value;
    form.course = document.getElementById("fCourseN").value;
    form.date = document.getElementById("fDate").value;
    form.time = document.getElementById("fTime").value;
    form.breakdown = document.getElementById("fBreak").checked;
  };
  document.querySelectorAll("[data-prio]").forEach(
    (b) =>
      (b.onclick = () => {
        sync();
        form.prio = b.dataset.prio;
        renderModal();
      }),
  );
  document.querySelectorAll("[data-type]").forEach(
    (b) =>
      (b.onclick = () => {
        sync();
        form.type = form.type === b.dataset.type ? "" : b.dataset.type;
        renderModal();
      }),
  );
  document.getElementById("mX").onclick = document.getElementById(
    "mCancel",
  ).onclick = () => {
    sync();
    cancelNew();
  };
  document.getElementById("mSave").onclick = () => {
    sync();
    saveNew();
  };
  document.getElementById("fTitle").onkeydown = (ev) => {
    if (ev.key === "Enter") {
      sync();
      saveNew();
    }
  };
}
function cancelNew() {
  if (dirty())
    confirmBox(
      "¿Descartar la tarea?",
      "Los datos que escribiste no se guardarán.",
      "Descartar",
      () => closeModal(),
      "Seguir editando",
    );
  else closeModal();
}
function closeModal() {
  document.getElementById("modalWrap").classList.remove("show");
}
function saveNew() {
  errs = {};
  if (!form.title.trim()) errs.title = "Escribe un nombre para la tarea.";
  if (!form.course) errs.course = "Elige el curso al que pertenece.";
  if (!form.date) errs.date = "Elige la fecha de entrega en el calendario.";
  else {
    const [y, m, dd] = form.date.split("-").map(Number);
    if (new Date(y, m - 1, dd) < TODAY)
      errs.date = `La fecha ya pasó. Elige hoy (${fmt(TODAY)}) o una fecha posterior.`;
  }
  if (Object.keys(errs).length) {
    renderModal();
    const f = document.querySelector(".inp.invalid");
    if (f) f.focus();
    return;
  }
  const [y, m, dd] = form.date.split("-").map(Number),
    [hh, mi] = (form.time || "23:59").split(":").map(Number);
  const t = {
    id: ++uid,
    title: form.title.trim(),
    course: form.course,
    type: form.type || "inf",
    due: new Date(y, m - 1, dd, hh, mi),
    prio: form.prio,
    done: false,
    subs: [],
  };
  tasks.push(t);
  closeModal();
  render();
  toast(`Tarea guardada: «${esc(t.title)}» · ${fmt(t.due)}`, "Ver", () =>
    openTask(t.id),
  );
  if (form.breakdown) openTask(t.id);
}

function confirmBox(title, msg, okLabel, onOk, cancelLabel = "Cancelar") {
  const w = document.getElementById("confirmWrap");
  document.getElementById("confirm").innerHTML =
    `<div class="m-head"><h2>${title}</h2></div><div class="m-body"><p style="margin:0">${msg}</p></div><div class="m-foot"><button class="btn" id="cNo">${cancelLabel}</button><button class="btn btn-primary" id="cYes" style="background:var(--danger);border-color:var(--danger)">${okLabel}</button></div>`;
  w.classList.add("show");
  document.getElementById("cNo").focus();
  document.getElementById("cNo").onclick = () => w.classList.remove("show");
  document.getElementById("cYes").onclick = () => {
    w.classList.remove("show");
    onOk();
  };
}

const accessSettings = {
  largeText: false,
  highContrast: false,
  reduceMotion: false,
  vibration: false,
};
function applyAccessSettings() {
  document.body.classList.toggle("large-text", accessSettings.largeText);
  document.body.classList.toggle("high-contrast", accessSettings.highContrast);
  document.body.classList.toggle("reduce-motion", accessSettings.reduceMotion);
  ["largeText", "highContrast", "reduceMotion", "vibration"].forEach((k) => {
    const el = document.getElementById(k);
    if (el) el.checked = accessSettings[k];
  });
}
function setAccessSetting(key, value) {
  accessSettings[key] = value;
  applyAccessSettings();
}
const accessToggle = document.getElementById("accessToggle");
const accessPanel = document.getElementById("accessPanel");
accessToggle.onclick = () => {
  const opened = accessPanel.classList.toggle("show");
  accessToggle.setAttribute("aria-expanded", String(opened));
  if (opened) document.getElementById("largeText").focus();
};
["largeText", "highContrast", "reduceMotion", "vibration"].forEach(
  (k) =>
    (document.getElementById(k).onchange = (e) =>
      setAccessSetting(k, e.target.checked)),
);
document.getElementById("testNotice").onclick = () =>
  toast("Aviso de prueba: tus cambios se muestran también mediante texto.");
document.getElementById("resetAccess").onclick = () => {
  Object.keys(accessSettings).forEach((k) => (accessSettings[k] = false));
  applyAccessSettings();
  toast("Preferencias de accesibilidad restablecidas");
};
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".access-wrap") &&
    accessPanel.classList.contains("show")
  ) {
    accessPanel.classList.remove("show");
    accessToggle.setAttribute("aria-expanded", "false");
  }
});

document
  .querySelectorAll(".nav-btn")
  .forEach((b) => (b.onclick = () => go(b.dataset.view)));
document.getElementById("btnNew").onclick = openNew;
document.getElementById("scrim").onclick = () => closeDrawer();
document.getElementById("search").oninput = () => {
  if (view !== "tareas") {
    view = "tareas";
  }
  render();
  document.getElementById("search").focus();
};
document.addEventListener("keydown", (e) => {
  const typing = ["INPUT", "SELECT", "TEXTAREA"].includes(
    document.activeElement.tagName,
  );
  if (e.key === "Escape") {
    if (document.getElementById("confirmWrap").classList.contains("show"))
      document.getElementById("confirmWrap").classList.remove("show");
    else if (document.getElementById("modalWrap").classList.contains("show")) {
      cancelNew();
    } else if (openId) closeDrawer();
    else if (accessPanel.classList.contains("show")) {
      accessPanel.classList.remove("show");
      accessToggle.setAttribute("aria-expanded", "false");
      accessToggle.focus();
    }
  }
  if (
    !typing &&
    (e.key === "n" || e.key === "N") &&
    !document.getElementById("modalWrap").classList.contains("show")
  ) {
    e.preventDefault();
    openNew();
  }
});
if (new URLSearchParams(location.search).has("wire"))
  document.body.classList.add("wire");
render();

window.__demo = {
  go,
  openTask,
  openNew,
  tasks,
  setForm: (f) => {
    Object.assign(form, f);
    renderModal();
  },
  save: () => saveNew(),
  toggleSub,
  toggleTask,
  closeDrawer,
  closeModal,
  render,
};
