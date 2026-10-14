/* ============================================================================
   INSTRUMENTOS.JS — Componentes interactivos de la práctica
   1. Montaje    : soporte, resorte y cursores, con puntos sensibles
   2. Simulador  : un resorte que se estira en vivo, con oscilación amortiguada
   3. Analisis   : elongaciones, Tablas 11 a 13, gráficas, ajuste y constantes
   ========================================================================== */

const SIN_MOVIMIENTO = window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fmt(x, d){ return Number(x).toFixed(d).replace('.', ','); }

function leerNum(id){
  const el = document.getElementById(id);
  if (!el) return null;
  const n = parseFloat(String(el.value).replace(/\s/g, '').replace(',', '.'));
  return isFinite(n) ? n : null;
}

/* Dibuja un resorte helicoidal entre (cx, y0) y (cx, y0+L) */
function espiral(cx, y0, L, vueltas, amp){
  const n = Math.max(24, Math.round(vueltas * 14));
  let d = `M ${cx.toFixed(1)} ${y0.toFixed(1)} `;
  for (let i = 1; i <= n; i++){
    const t = i / n;
    const x = cx + amp * Math.sin(2 * Math.PI * vueltas * t);
    d += `L ${x.toFixed(1)} ${(y0 + L * t).toFixed(1)} `;
  }
  return d;
}

/* ==========================================================================
   1. SOPORTE, RESORTE Y CURSORES, CON PUNTOS SENSIBLES
   ========================================================================== */
const Montaje = (() => {

  const REGLA_X = 192, REGLA_Y0 = 62, REGLA_Y1 = 404;   // escala vertical
  const VAR_X   = 300;                                  // varilla del soporte
  const RES_X   = 392;                                  // eje del resorte
  const Y_SUP = 166, Y_INF = 262;                       // cursores superior e inferior

  /* Rótulo con subíndice, que en SVG hay que componer a mano */
  function sub(base, ind){
    return `${base}<tspan dy="5" font-size="11">${ind}</tspan>`;
  }

  function cursor(y, rotulo){
    return `
      <g>
        <line x1="${REGLA_X + 14}" y1="${y}" x2="${RES_X + 14}" y2="${y}"
              stroke="#C0272D" stroke-width="1.1" stroke-dasharray="4 3"/>
        <path d="M ${REGLA_X + 14} ${y} L ${REGLA_X + 68} ${y - 14} L ${REGLA_X + 68} ${y + 14} Z"
              fill="#C0272D" stroke="#1F1C17" stroke-width="1.4" stroke-linejoin="round"/>
        <text x="${REGLA_X + 76}" y="${y - 7}" class="m-et" text-anchor="start">${rotulo}</text>
      </g>`;
  }

  function svg(){
    let ticks = '';
    for (let i = 0; i <= 22; i++){
      const y = REGLA_Y0 + i * (REGLA_Y1 - REGLA_Y0) / 22;
      const largo = i % 5 === 0;
      ticks += `<line x1="${REGLA_X}" y1="${y.toFixed(1)}" x2="${(REGLA_X + (largo ? 13 : 7)).toFixed(1)}"
                  y2="${y.toFixed(1)}" stroke="#5A5346" stroke-width="${largo ? 1.5 : 0.9}"/>`;
      if (largo){
        ticks += `<text x="${REGLA_X - 6}" y="${(y + 4).toFixed(1)}" class="g-num"
                    text-anchor="end">${80 - i * 2}</text>`;
      }
    }

    const yMedio = (Y_SUP + Y_INF) / 2;

    return `
    <svg viewBox="150 18 520 452" role="img"
         aria-label="Esquema del montaje: soporte universal con regla graduada, resorte, los dos cursores y el portamasas">

      <!-- base del soporte -->
      <path d="M ${VAR_X - 76} 430 L ${VAR_X - 6} 416 L ${VAR_X + 84} 424 L ${VAR_X + 16} 439 Z"
            fill="#C9C4B4" stroke="#1F1C17" stroke-width="2.4" stroke-linejoin="round"/>
      <!-- varilla vertical -->
      <rect x="${VAR_X - 5}" y="50" width="10" height="376" fill="#A8A497"
            stroke="#1F1C17" stroke-width="2"/>
      <!-- nuez y brazo horizontal del que cuelga el resorte -->
      <rect x="${VAR_X - 17}" y="70" width="34" height="20" rx="3" fill="#8F8C80"
            stroke="#1F1C17" stroke-width="1.8"/>
      <rect x="${VAR_X + 10}" y="76" width="${RES_X - VAR_X}" height="8" rx="2" fill="#A8A497"
            stroke="#1F1C17" stroke-width="1.8"/>
      <line x1="${RES_X}" y1="84" x2="${RES_X}" y2="94" stroke="#1F1C17" stroke-width="2.4"/>

      <!-- regla graduada -->
      <rect x="${REGLA_X - 30}" y="${REGLA_Y0 - 11}" width="30" height="${REGLA_Y1 - REGLA_Y0 + 24}"
            fill="#EDE5CF" stroke="#1F1C17" stroke-width="1.8"/>
      <rect x="${REGLA_X - 1}" y="${REGLA_Y0 - 11}" width="2" height="${REGLA_Y1 - REGLA_Y0 + 24}" fill="#5A5346"/>
      ${ticks}
      <text x="${REGLA_X - 15}" y="${REGLA_Y0 - 19}" class="m-lab" text-anchor="middle">x (cm)</text>

      <!-- resorte ya cargado -->
      <path d="${espiral(RES_X, 94, Y_INF - 94, 9, 13)}" fill="none" stroke="#0C2B52"
            stroke-width="2.6" stroke-linejoin="round"/>

      <!-- gancho, portamasas y pesas -->
      <line x1="${RES_X}" y1="${Y_INF}" x2="${RES_X}" y2="${Y_INF + 15}" stroke="#1F1C17" stroke-width="2.4"/>
      <path d="M ${RES_X - 7} ${Y_INF + 15} q 7 10 14 0" fill="none" stroke="#1F1C17" stroke-width="2.4"/>
      <rect x="${RES_X - 27}" y="${Y_INF + 25}" width="54" height="15" rx="2" fill="#B08B3E"
            stroke="#1F1C17" stroke-width="1.8"/>
      <rect x="${RES_X - 23}" y="${Y_INF + 40}" width="46" height="12" rx="2" fill="#C9A24F"
            stroke="#1F1C17" stroke-width="1.5"/>
      <rect x="${RES_X - 23}" y="${Y_INF + 52}" width="46" height="12" rx="2" fill="#C9A24F"
            stroke="#1F1C17" stroke-width="1.5"/>
      <text x="${RES_X + 36}" y="${Y_INF + 46}" class="m-lab" text-anchor="start">portamasas</text>

      <!-- peso -->
      <line x1="${RES_X}" y1="${Y_INF + 76}" x2="${RES_X}" y2="${Y_INF + 112}"
            stroke="#A62F26" stroke-width="3"/>
      <path d="M ${RES_X - 7} ${Y_INF + 103} L ${RES_X} ${Y_INF + 118} L ${RES_X + 7} ${Y_INF + 103}"
            fill="none" stroke="#A62F26" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>
      <text x="${RES_X + 26}" y="${Y_INF + 102}" class="m-et" text-anchor="start" fill="#A62F26">F = m·g</text>

      <!-- cursores -->
      ${cursor(Y_SUP, sub('x', 'i'))}
      ${cursor(Y_INF, sub('x', 'f'))}

      <!-- elongación -->
      <line x1="${RES_X + 72}" y1="${Y_SUP}" x2="${RES_X + 72}" y2="${Y_INF}"
            stroke="#C87020" stroke-width="2.4"/>
      <path d="M ${RES_X + 66} ${Y_SUP + 10} L ${RES_X + 72} ${Y_SUP} L ${RES_X + 78} ${Y_SUP + 10}"
            fill="none" stroke="#C87020" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M ${RES_X + 66} ${Y_INF - 10} L ${RES_X + 72} ${Y_INF} L ${RES_X + 78} ${Y_INF - 10}"
            fill="none" stroke="#C87020" stroke-width="2.2" stroke-linejoin="round"/>
      <line x1="${RES_X + 14}" y1="${Y_SUP}" x2="${RES_X + 72}" y2="${Y_SUP}"
            stroke="#C87020" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="${RES_X + 14}" y1="${Y_INF}" x2="${RES_X + 72}" y2="${Y_INF}"
            stroke="#C87020" stroke-width="1" stroke-dasharray="4 3"/>
      <rect x="${RES_X + 86}" y="${yMedio - 17}" width="40" height="34" rx="5"
            fill="#F3ECD9" stroke="#C87020" stroke-width="2"/>
      <text x="${RES_X + 106}" y="${yMedio + 6}" class="m-et" text-anchor="middle">x</text>
      <text x="${RES_X + 86}" y="${yMedio + 36}" class="m-lab" text-anchor="start">elongación</text>

      <!-- recordatorio de la ley -->
      <rect x="486" y="52" width="160" height="60" rx="6" fill="#D6DEE9"
            stroke="#0C2B52" stroke-width="1.6"/>
      <text x="566" y="76" class="m-lab" text-anchor="middle">ley de Hooke</text>
      <text x="566" y="99" class="m-et" text-anchor="middle">F = k · x</text>

      <!-- puntos sensibles -->
      <g class="punto-caliente" data-parte="sop" tabindex="0" role="button" aria-label="Soporte universal">
        <circle cx="${VAR_X}" cy="372" r="16" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="reg" tabindex="0" role="button" aria-label="Regla graduada">
        <circle cx="${REGLA_X - 15}" cy="340" r="16" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="res" tabindex="0" role="button" aria-label="Resorte">
        <circle cx="${RES_X}" cy="128" r="16" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="csu" tabindex="0" role="button" aria-label="Cursor superior">
        <circle cx="${REGLA_X + 42}" cy="${Y_SUP}" r="15" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="cin" tabindex="0" role="button" aria-label="Cursor inferior">
        <circle cx="${REGLA_X + 42}" cy="${Y_INF}" r="15" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="por" tabindex="0" role="button" aria-label="Portamasas y masas">
        <circle cx="${RES_X}" cy="${Y_INF + 44}" r="17" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="elo" tabindex="0" role="button" aria-label="Elongación">
        <circle cx="${RES_X + 106}" cy="${yMedio}" r="17" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="pes" tabindex="0" role="button" aria-label="Fuerza deformadora">
        <circle cx="${RES_X}" cy="${Y_INF + 96}" r="16" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
    </svg>
    <div class="montaje__leyenda" id="montaje-leyenda" role="status" aria-live="polite">
      <b>Toca un punto naranja</b> para leer qué función cumple cada parte del montaje.
    </div>`;
  }

  function montar(id){
    const host = document.getElementById(id);
    if (!host) return;
    host.innerHTML = svg();
    const leyenda = host.querySelector('#montaje-leyenda');
    const mostrar = clave => {
      const p = PARTES.find(x => x.id === clave);
      if (p) leyenda.innerHTML = `<b>${esc(p.n)}.</b> ${esc(p.d)}`;
    };
    host.querySelectorAll('.punto-caliente').forEach(g => {
      g.addEventListener('click', () => mostrar(g.dataset.parte));
      g.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' '){ mostrar(g.dataset.parte); e.preventDefault(); }
      });
    });
  }

  return { montar };
})();

/* ==========================================================================
   2. SIMULADOR DE LA LEY DE HOOKE
   ========================================================================== */
const Simulador = (() => {
  const VW = 660, VH = 430;
  const EJE_X = 150, Y_TECHO = 50;
  const L0 = 70;                    // longitud natural del resorte, en px
  const PX_POR_CM = 7.2;            // escala del dibujo
  const G = { l: 330, r: 26, t: 48, b: 66 };

  let host, svg, m = 0.100, k = 25.8;
  let xMostrado = 0, anim = null, ultimo = 0, reloj = 0, xDesde = 0, xHacia = 0;

  const fuerza   = () => m * G_REF;
  const xEquil   = () => fuerza() / k;             // metros
  const energia  = () => 0.5 * k * xEquil() ** 2;  // julios

  function dibujar(){
    const xcm = xMostrado * 100;
    const L = L0 + xcm * PX_POR_CM;
    const ySup = Y_TECHO + L0;
    const yInf = Y_TECHO + L;

    /* --- regla --- */
    let ticks = '';
    for (let c = 0; c <= 26; c += 1){
      const y = ySup + c * PX_POR_CM;
      if (y > VH - 26) break;
      const largo = c % 5 === 0;
      ticks += `<line x1="${EJE_X - 96}" y1="${y.toFixed(1)}" x2="${(EJE_X - 96 + (largo ? 13 : 7)).toFixed(1)}"
                  y2="${y.toFixed(1)}" stroke="#5A5346" stroke-width="${largo ? 1.4 : 0.8}"/>`;
      if (largo) ticks += `<text x="${EJE_X - 100}" y="${(y + 4).toFixed(1)}" class="g-num" text-anchor="end">${c}</text>`;
    }

    /* --- gráfica F frente a x --- */
    const anchoG = VW - G.r - G.l, altoG = VH - G.b - G.t;
    /* La escala se adapta al resorte: así el punto de trabajo no queda pegado al origen */
    const fMaxG = 0.5 * G_REF * 1.08;
    const xMaxG = Math.max(0.04, fMaxG / k);
    const pxG = x => G.l + Math.min(x / xMaxG, 1) * anchoG;
    const pyG = f => (VH - G.b) - Math.min(f / fMaxG, 1) * altoG;

    let rej = '';
    for (let i = 0; i <= 4; i++){
      const x = xMaxG * i / 4;
      rej += `<line class="g-rejilla" x1="${pxG(x).toFixed(1)}" y1="${G.t}" x2="${pxG(x).toFixed(1)}" y2="${VH - G.b}"/>
              <text class="g-num" x="${pxG(x).toFixed(1)}" y="${VH - G.b + 16}" text-anchor="middle">${fmt(x,2)}</text>`;
      const f = fMaxG * i / 4;
      rej += `<line class="g-rejilla" x1="${G.l}" y1="${pyG(f).toFixed(1)}" x2="${VW - G.r}" y2="${pyG(f).toFixed(1)}"/>
              <text class="g-num" x="${G.l - 7}" y="${(pyG(f) + 4).toFixed(1)}" text-anchor="end">${fmt(f,1)}</text>`;
    }
    const xTope = Math.min(xMaxG, fMaxG / k);

    svg.innerHTML = `
      <!-- techo -->
      <rect x="${EJE_X - 60}" y="${Y_TECHO - 14}" width="120" height="14" fill="#8F8C80"
            stroke="#1F1C17" stroke-width="1.8"/>
      <path d="M ${EJE_X - 56} ${Y_TECHO} l 8 -14 M ${EJE_X - 38} ${Y_TECHO} l 8 -14
               M ${EJE_X - 20} ${Y_TECHO} l 8 -14 M ${EJE_X - 2} ${Y_TECHO} l 8 -14
               M ${EJE_X + 16} ${Y_TECHO} l 8 -14 M ${EJE_X + 34} ${Y_TECHO} l 8 -14"
            stroke="#1F1C17" stroke-width="1.2"/>

      <!-- regla -->
      <rect x="${EJE_X - 122}" y="${(ySup - 14).toFixed(1)}" width="26" height="${(VH - 26 - ySup + 14).toFixed(1)}"
            fill="#EDE5CF" stroke="#1F1C17" stroke-width="1.5"/>
      ${ticks}
      <text x="${EJE_X - 109}" y="${(ySup - 22).toFixed(1)}" class="m-lab" text-anchor="middle">x (cm)</text>

      <!-- posición sin carga -->
      <line x1="${EJE_X - 96}" y1="${ySup.toFixed(1)}" x2="${EJE_X + 60}" y2="${ySup.toFixed(1)}"
            stroke="#8A8171" stroke-width="1.2" stroke-dasharray="5 4"/>
      <text x="${EJE_X + 66}" y="${(ySup - 7).toFixed(1)}" class="m-lab" text-anchor="start">posición sin carga</text>

      <!-- resorte -->
      <path d="${espiral(EJE_X, Y_TECHO, L, 10, 15)}" fill="none" stroke="#0C2B52"
            stroke-width="2.6" stroke-linejoin="round"/>

      <!-- gancho y masas -->
      <line x1="${EJE_X}" y1="${yInf.toFixed(1)}" x2="${EJE_X}" y2="${(yInf + 13).toFixed(1)}"
            stroke="#1F1C17" stroke-width="2.4"/>
      <rect x="${EJE_X - 27}" y="${(yInf + 13).toFixed(1)}" width="54" height="15" rx="2"
            fill="#B08B3E" stroke="#1F1C17" stroke-width="1.8"/>
      ${[0,1,2].map(i => {
        const alto = 11;
        const visible = m > 0.08 * (i + 1);
        return visible ? `<rect x="${EJE_X - 23}" y="${(yInf + 28 + i*alto).toFixed(1)}" width="46"
                            height="${alto - 1}" rx="2" fill="#C9A24F" stroke="#1F1C17" stroke-width="1.4"/>` : '';
      }).join('')}

      <!-- elongación -->
      ${xcm > 0.3 ? `
        <line x1="${EJE_X + 48}" y1="${ySup.toFixed(1)}" x2="${EJE_X + 48}" y2="${yInf.toFixed(1)}"
              stroke="#C87020" stroke-width="2.2"/>
        <path d="M ${EJE_X + 43} ${(ySup + 9).toFixed(1)} L ${EJE_X + 48} ${ySup.toFixed(1)} L ${EJE_X + 53} ${(ySup + 9).toFixed(1)}"
              fill="none" stroke="#C87020" stroke-width="2" stroke-linejoin="round"/>
        <path d="M ${EJE_X + 43} ${(yInf - 9).toFixed(1)} L ${EJE_X + 48} ${yInf.toFixed(1)} L ${EJE_X + 53} ${(yInf - 9).toFixed(1)}"
              fill="none" stroke="#C87020" stroke-width="2" stroke-linejoin="round"/>
        <text x="${EJE_X + 58}" y="${((ySup + yInf)/2 + 4).toFixed(1)}" class="m-et"
              text-anchor="start" fill="#C87020">${fmt(xcm,1)} cm</text>` : ''}

      <!-- gráfica -->
      ${rej}
      <line class="g-eje" x1="${G.l}" y1="${VH - G.b}" x2="${VW - G.r}" y2="${VH - G.b}"/>
      <line class="g-eje" x1="${G.l}" y1="${G.t}" x2="${G.l}" y2="${VH - G.b}"/>
      <text class="g-tit" x="${((VW - G.r + G.l)/2).toFixed(1)}" y="${VH - G.b + 36}" text-anchor="middle">alargamiento x (m)</text>
      <text class="g-tit" x="${(-(VH - G.b + G.t)/2).toFixed(1)}" y="${G.l - 42}" text-anchor="middle"
            transform="rotate(-90)">fuerza F (N)</text>
      <text class="g-tit" x="${G.l}" y="${G.t - 14}" text-anchor="start">F = k · x  con k = ${fmt(k,1)} N/m</text>

      <path d="M ${pxG(0).toFixed(1)} ${pyG(0).toFixed(1)} L ${pxG(xTope).toFixed(1)} ${pyG(k*xTope).toFixed(1)}"
            fill="none" stroke="#0C2B52" stroke-width="2.6"/>
      <line x1="${pxG(xEquil()).toFixed(1)}" y1="${pyG(fuerza()).toFixed(1)}"
            x2="${pxG(xEquil()).toFixed(1)}" y2="${(VH - G.b).toFixed(1)}"
            stroke="#C87020" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="${G.l}" y1="${pyG(fuerza()).toFixed(1)}"
            x2="${pxG(xEquil()).toFixed(1)}" y2="${pyG(fuerza()).toFixed(1)}"
            stroke="#C87020" stroke-width="1" stroke-dasharray="3 3"/>
      <circle cx="${pxG(xEquil()).toFixed(1)}" cy="${pyG(fuerza()).toFixed(1)}" r="6"
              fill="#C87020" stroke="#F3ECD9" stroke-width="2"/>`;

    svg.setAttribute('aria-valuetext',
      `masa ${fmt(m,3)} kilogramos, fuerza ${fmt(fuerza(),2)} newtons, alargamiento ${fmt(xcm,1)} centímetros`);
  }

  function refrescar(){
    dibujar();
    host.querySelector('#sim-lecturas').innerHTML = `
      <div class="visor"><div class="visor__et">Fuerza F = m·g</div>
        <div class="visor__v">${fmt(fuerza(),2)} N</div></div>
      <div class="visor"><div class="visor__et">Alargamiento x</div>
        <div class="visor__v" style="color:#8FE3A8">${fmt(xEquil()*100,2)} cm</div></div>
      <div class="visor"><div class="visor__et">Alargamiento en metros</div>
        <div class="visor__v" style="color:#FF9E85">${fmt(xEquil(),4)} m</div></div>
      <div class="visor"><div class="visor__et">Energía ½·k·x²</div>
        <div class="visor__v">${fmt(energia(),4)} J</div></div>`;
    host.querySelector('#sim-cuenta').innerHTML =
      `F = m·g = ${fmt(m,3)} × ${fmt(G_REF,2)} = <b>${fmt(fuerza(),2)} N</b> · ` +
      `x = F/k = ${fmt(fuerza(),2)} / ${fmt(k,1)} = <b>${fmt(xEquil(),4)} m</b> = ${fmt(xEquil()*100,2)} cm`;
    host.querySelector('#out-m').textContent = fmt(m,3) + ' kg';
    host.querySelector('#out-k').textContent = fmt(k,1) + ' N/m';
    host.querySelector('#sim-m').value = m.toFixed(3);
    host.querySelector('#sim-k').value = k.toFixed(1);
    host.querySelectorAll('.chip[data-k]').forEach(c =>
      c.setAttribute('aria-pressed', String(Math.abs(parseFloat(c.dataset.k) - k) < 0.05)));
  }

  /* El resorte no salta a su nueva posición: oscila y se amortigua, como el real */
  function lanzar(){
    xDesde = xMostrado; xHacia = xEquil(); reloj = 0;
    if (SIN_MOVIMIENTO || Math.abs(xHacia - xDesde) < 1e-5){
      xMostrado = xHacia; refrescar(); return;
    }
    cancelAnimationFrame(anim); ultimo = 0;
    /* Las lecturas responden al instante; solo el dibujo del resorte oscila. */
    refrescar();
    anim = requestAnimationFrame(bucle);
  }

  function bucle(ahora){
    if (!ultimo) ultimo = ahora;
    reloj += Math.min((ahora - ultimo) / 1000, 0.05);
    ultimo = ahora;
    const w = Math.sqrt(k / Math.max(m, 0.02));          // pulsación propia
    const amort = Math.exp(-reloj * 2.6);
    xMostrado = xHacia + (xDesde - xHacia) * amort * Math.cos(w * reloj);
    if (reloj > 2.2 || amort < 0.02){
      xMostrado = xHacia; anim = null; ultimo = 0; refrescar(); return;
    }
    refrescar();
    anim = requestAnimationFrame(bucle);
  }

  function montar(id){
    host = document.getElementById(id);
    if (!host) return;
    host.innerHTML = `
      <svg class="hooke-svg" viewBox="0 0 ${VW} ${VH}" role="img"
           aria-label="Resorte cargado junto a la gráfica de la fuerza frente al alargamiento"></svg>
      <div class="lectura-caja" id="sim-lecturas" style="margin-top:13px"></div>
      <p id="sim-cuenta" class="instr__ayuda"
         style="margin:12px 0 0;font-family:var(--mono);font-size:.86rem;color:var(--azul)"></p>
      <div class="controles">
        <div class="control">
          <label for="sim-m">Masa colgada · <output id="out-m"></output></label>
          <input type="range" id="sim-m" min="0" max="0.5" step="0.005" value="${m}">
        </div>
        <div class="control">
          <label for="sim-k">Constante elástica · <output id="out-k"></output></label>
          <input type="range" id="sim-k" min="5" max="45" step="0.5" value="${k}">
        </div>
      </div>
      <div class="materiales" role="group" aria-label="Resortes de la práctica">
        ${RESORTES.map(R => `<button class="chip" data-k="${R.k}"
            aria-pressed="${Math.abs(R.k - k) < 0.05 ? 'true' : 'false'}">${esc(R.nombre)} · k = ${fmt(R.k,1)} N/m</button>`).join('')}
      </div>`;

    svg = host.querySelector('.hooke-svg');
    host.querySelector('#sim-m').addEventListener('input', e => { m = parseFloat(e.target.value); lanzar(); });
    host.querySelector('#sim-k').addEventListener('input', e => { k = parseFloat(e.target.value); lanzar(); });
    host.querySelectorAll('.chip[data-k]').forEach(c =>
      c.addEventListener('click', () => { k = parseFloat(c.dataset.k); lanzar(); }));

    xMostrado = xEquil();
    refrescar();
  }

  return { montar };
})();

/* ==========================================================================
   3. ANÁLISIS: ELONGACIONES, TABLAS 11 A 13, GRÁFICAS Y CONSTANTES
   ========================================================================== */
const Analisis = (() => {

  /* ---------------------------------------------- Lectura de una tabla */
  function datosTabla(r, i){                     // r: 0 o 1 · i: 0 a 4
    const m  = leerNum(`m-${r+1}-${i+1}`);
    const xs = [0,1,2].map(j => {
      const xi = leerNum(`xi-${r+1}-${i+1}-${j}`);
      const xf = leerNum(`xf-${r+1}-${i+1}-${j}`);
      /* La elongación es la distancia entre las dos lecturas. Se toma el valor
         absoluto porque la regla del montaje está graduada de forma decreciente
         hacia abajo, de modo que la lectura final es menor que la inicial. */
      return (xi !== null && xf !== null) ? Math.abs(xf - xi) : null;
    });
    const okX = xs.every(x => x !== null);
    const okM = m !== null && m > 0;
    const prom = okX ? (xs[0] + xs[1] + xs[2]) / 3 : null;   // centímetros
    return { tabla: r * N_MASAS + i + 1, m, xs, prom, okX, okM, completa: okX && okM };
  }

  function pares(r){
    const p = [];
    for (let i = 0; i < N_MASAS; i++){
      const d = datosTabla(r, i);
      if (d.completa && d.prom > 0){
        p.push({ tabla: d.tabla, m: d.m, F: d.m * G_REF, x: d.prom / 100 });  // x en metros
      }
    }
    return p;
  }

  /* -------------------------- Columna de elongaciones y promedio por tabla */
  function pintarElongaciones(){
    for (let r = 0; r < RESORTES.length; r++){
      for (let i = 0; i < N_MASAS; i++){
        const d = datosTabla(r, i);
        d.xs.forEach((x, j) => {
          const el = document.getElementById(`elo-${r+1}-${i+1}-${j}`);
          if (!el) return;
          if (x === null){ el.textContent = '—'; el.removeAttribute('style'); return; }
          el.textContent = fmt(x, 1);
          el.style.color = x > 0 ? 'var(--azul)' : 'var(--err)';
          el.title = x > 0 ? '' : 'Las dos posiciones son iguales: revisa la lectura.';
        });
        const caja = document.getElementById(`prom-${r+1}-${i+1}`);
        if (!caja) continue;
        if (!d.okX){
          caja.innerHTML = '<span class="tabla-mini__pendiente">Faltan posiciones para calcular el promedio.</span>';
        } else {
          const suma = d.xs[0] + d.xs[1] + d.xs[2];
          caja.innerHTML =
            `x̄ = (${fmt(d.xs[0],1)} + ${fmt(d.xs[1],1)} + ${fmt(d.xs[2],1)}) / 3 = ` +
            `<b class="nw">${fmt(d.prom,3)} cm</b> = <b class="nw">${fmt(d.prom/100,4)} m</b>` +
            (d.okM ? `<br>F = ${fmt(d.m,3)} × ${fmt(G_REF,2)} = <b class="nw">${fmt(d.m*G_REF,2)} N</b>`
                   : `<br><b style="color:var(--err)">Falta la masa:</b> sin ella no hay fuerza que graficar.`);
        }
      }
    }
  }

  /* -------------------------------------------------- Tablas 11 y 12 */
  function pintarTablas1112(){
    RESORTES.forEach((R, r) => {
      const host = document.getElementById('tabla-' + (11 + r));
      if (!host) return;
      const vacio = '<span style="color:var(--tinta-3);font-style:italic">pendiente</span>';
      let filas = '';
      for (let i = 0; i < N_MASAS; i++){
        const d = datosTabla(r, i);
        const F = d.okM ? d.m * G_REF : null;
        const xm = d.okX ? d.prom / 100 : null;
        const kp = (F !== null && xm !== null && xm > 0) ? F / xm : null;
        filas += `<tr>
          <td class="col-mag">${d.tabla}</td>
          <td class="td-centro">${d.okM ? `<span class="dato">${fmt(d.m,3)}</span>` : vacio}</td>
          <td class="td-centro">${F !== null ? `<span class="dato">${fmt(F,2)}</span>` : vacio}</td>
          <td class="td-centro">${xm !== null ? `<span class="dato">${fmt(d.prom,2)}</span>` : vacio}</td>
          <td class="td-centro">${xm !== null ? `<span class="dato" style="color:var(--azul-2)">${fmt(xm,4)}</span>` : vacio}</td>
          <td class="td-centro">${kp !== null ? `<span class="dato">${fmt(kp,2)}</span>` : vacio}</td>
        </tr>`;
      }
      host.innerHTML = `<div class="tabla-caja" style="margin-top:16px">
        <table class="tabla" style="min-width:620px">
          <thead>
            <tr><th colspan="6" class="th-grupo">Tabla ${11 + r} · ${esc(R.nombre)}</th></tr>
            <tr>
              <th style="width:12%">Tabla</th><th style="width:16%">m (kg)</th>
              <th style="width:16%">F (N)</th><th style="width:18%">x̄ (cm)</th>
              <th style="width:19%">x̄ (m)</th><th style="width:19%">F / x̄ (N/m)</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
        <caption>Tabla ${11 + r}. Fuerza aplicada y alargamiento promedio del ${esc(R.nombre.toLowerCase())}.
        La última columna no la pide el informe: es la constante calculada punto a punto, útil para detectar una medida descuadrada.</caption>
      </div>`;
    });
  }

  function pintarBarras(){
    const host = document.getElementById('barras-datos');
    if (!host) return;
    const todos = [].concat(...RESORTES.map((R, r) => pares(r).map(p => ({ ...p, r }))));
    if (!todos.length){
      host.innerHTML = '<p class="instr__ayuda" style="margin:10px 0 0">Aún no hay filas completas. ' +
        'Llena la masa y las tres mediciones de alguna tabla para ver el resumen aquí.</p>';
      return;
    }
    const xMax = Math.max(...todos.map(p => p.x));
    host.innerHTML = '<div class="barras">' + todos.map(p => `
      <div class="barra-dato">
        <span class="barra-dato__et">Tabla ${p.tabla}</span>
        <span class="barra-dato__pista"><i style="width:${Math.max(3, p.x / xMax * 100).toFixed(1)}%;
              background:${RESORTES[p.r].color}"></i></span>
        <span class="barra-dato__v">F = ${fmt(p.F,2)} N · x̄ = ${fmt(p.x*100,2)} cm</span>
      </div>`).join('') + '</div>';
  }

  /* ----------------------------------------- Ajustes por mínimos cuadrados */
  function fitOrigen(P){                                 // F = k·x
    let s1 = 0, s2 = 0;
    P.forEach(p => { s1 += p.F * p.x; s2 += p.x * p.x; });
    if (s2 === 0) return null;
    const k = s1 / s2;
    return { tipo:'origen', k, b:0, f: x => k * x };
  }

  function fitGeneral(P){                                // F = m·x + b
    const n = P.length;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    P.forEach(p => { sx += p.x; sy += p.F; sxx += p.x * p.x; sxy += p.x * p.F; });
    const den = n * sxx - sx * sx;
    if (Math.abs(den) < 1e-18) return null;
    const k = (n * sxy - sx * sy) / den;
    const b = (sy - k * sx) / n;
    return { tipo:'general', k, b, f: x => k * x + b };
  }

  function coefR2(P, f){
    const ym = P.reduce((s,p) => s + p.F, 0) / P.length;
    let ssr = 0, sst = 0;
    P.forEach(p => { ssr += (p.F - f(p.x)) ** 2; sst += (p.F - ym) ** 2; });
    return sst > 0 ? 1 - ssr / sst : 1;
  }

  function tipoAjuste(){
    const el = document.getElementById('tipo-ajuste');
    return (el && el.value) ? el.value : 'general';
  }

  function ajuste(P){
    if (P.length < 2) return null;
    const a = tipoAjuste() === 'origen' ? fitOrigen(P) : fitGeneral(P);
    if (a) a.R2 = coefR2(P, a.f);
    return a;
  }

  function ecuacion(a){
    if (!a) return '—';
    if (a.tipo === 'origen') return `F = ${fmt(a.k,2)} · x`;
    const s = a.b >= 0 ? '+ ' : '− ';
    return `F = ${fmt(a.k,2)} · x ${s}${fmt(Math.abs(a.b),4)}`;
  }

  /* ------------------------------------------------------------- Gráfica */
  function pintarGrafica(datos){
    const host = document.getElementById('graf-fx');
    if (!host) return;
    const W = 660, H = 370, M = { l: 62, r: 20, t: 18, b: 50 };
    const todos = [].concat(...datos.map(d => d.P));
    const xMax = todos.length ? Math.max(...todos.map(p => p.x)) * 1.15 : 0.2;
    const fMax = todos.length ? Math.max(...todos.map(p => p.F)) * 1.15 : 3;
    const px = x => M.l + x / xMax * (W - M.l - M.r);
    const py = f => (H - M.b) - f / fMax * (H - M.b - M.t);

    let g = '';
    for (let i = 0; i <= 5; i++){
      const x = xMax * i / 5;
      g += `<line class="g-rejilla" x1="${px(x).toFixed(1)}" y1="${M.t}" x2="${px(x).toFixed(1)}" y2="${H - M.b}"/>
            <text class="g-num" x="${px(x).toFixed(1)}" y="${H - M.b + 16}" text-anchor="middle">${fmt(x,3)}</text>`;
      const f = fMax * i / 5;
      g += `<line class="g-rejilla" x1="${M.l}" y1="${py(f).toFixed(1)}" x2="${W - M.r}" y2="${py(f).toFixed(1)}"/>
            <text class="g-num" x="${M.l - 7}" y="${(py(f) + 4).toFixed(1)}" text-anchor="end">${fmt(f,2)}</text>`;
    }
    g += `<line class="g-eje" x1="${M.l}" y1="${H - M.b}" x2="${W - M.r}" y2="${H - M.b}"/>
          <line class="g-eje" x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${H - M.b}"/>
          <text class="g-tit" x="${((W + M.l)/2).toFixed(1)}" y="${H - 8}" text-anchor="middle">alargamiento promedio x̄ (m)</text>
          <text class="g-tit" x="${(-((H - M.b + M.t)/2)).toFixed(1)}" y="14" text-anchor="middle" transform="rotate(-90)">fuerza F (N)</text>`;

    datos.forEach((d, r) => {
      const color = RESORTES[r].color;
      if (d.a){
        /* La recta se recorta donde sale del recuadro. Truncar solo la ordenada
           cambiaría la pendiente dibujada y falsearía la gráfica. */
        let xA = 0, xB = xMax;
        if (d.a.k > 1e-12){
          xA = Math.max(0, Math.min(xMax, -d.a.b / d.a.k));          // donde F = 0
          xB = Math.max(xA, Math.min(xMax, (fMax - d.a.b) / d.a.k)); // donde F = fMax
        }
        if (xB > xA){
          g += `<path d="M ${px(xA).toFixed(1)} ${py(d.a.f(xA)).toFixed(1)} ` +
               `L ${px(xB).toFixed(1)} ${py(d.a.f(xB)).toFixed(1)}" ` +
               `fill="none" stroke="${color}" stroke-width="2.2" stroke-dasharray="7 5" opacity=".9"/>`;
        }
      }
      d.P.forEach(p => {
        g += `<circle cx="${px(p.x).toFixed(1)}" cy="${py(p.F).toFixed(1)}" r="5"
                fill="${color}" stroke="#1F1C17" stroke-width="1.4">
                <title>Tabla ${p.tabla}: x̄ = ${fmt(p.x,4)} m, F = ${fmt(p.F,2)} N</title></circle>`;
      });
    });

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img"
        aria-label="Gráfica de la fuerza frente al alargamiento promedio de los dos resortes">${g}</svg>
      <div class="leyenda">
        ${RESORTES.map(R => `<span><i class="punto" style="background:${R.color}"></i>${esc(R.nombre)}</span>`).join('')}
      </div>` +
      (todos.length ? '' : '<p class="instr__ayuda" style="margin:10px 0 0">Completa las Tablas 1 a 10 para que aparezcan los puntos.</p>');
  }

  /* --------------------------------------------- Resultado del ajuste */
  function pintarResultado(datos){
    const host = document.getElementById('resultado-ajuste');
    if (!host) return;
    const faltan = datos.filter(d => !d.a);
    if (faltan.length === RESORTES.length){
      host.innerHTML = `<div class="nota nota--aviso"><strong>Faltan datos.</strong> El ajuste
        necesita al menos <b>dos</b> filas completas por resorte. Vuelve a las tablas y completa la
        masa y las tres mediciones.</div>`;
      return;
    }
    host.innerHTML = datos.map((d, r) => {
      if (!d.a) return `<div class="nota nota--aviso"><strong>${esc(RESORTES[r].nombre)}:</strong>
        aún no hay suficientes filas completas para ajustar la recta.</div>`;
      const bueno = d.a.R2 >= 0.99;
      return `<div class="formula" style="max-width:none">
          <div class="formula__n" style="color:${RESORTES[r].color}">${esc(RESORTES[r].nombre)}</div>
          <div class="formula__ec" style="font-size:1.35rem">${ecuacion(d.a)}</div>
          <div class="formula__pie">Ajuste sobre ${d.P.length} parejas ·
            R² = <b style="color:${bueno ? 'var(--ok)' : 'var(--err)'}">${fmt(d.a.R2,5)}</b> ·
            con F en newtons y x̄ en metros, de modo que la pendiente queda en N/m.</div>
        </div>`;
    }).join('');
  }

  /* --------------------------------------------- Constantes elásticas */
  function pintarConstantes(datos){
    const host = document.getElementById('constantes-host');
    if (!host) return;
    const ks = datos.map(d => d.a ? d.a.k : null);

    const tarjetas = `
      <div class="vs">
        <div class="vs__caja">
          <div class="vs__et">${esc(RESORTES[0].nombre)}</div>
          <div class="vs__v">${ks[0] !== null ? fmt(ks[0],2) : '—'}</div>
          <div class="vs__u">N/m</div>
        </div>
        <div class="vs__sep" aria-hidden="true">vs</div>
        <div class="vs__caja vs__caja--ref">
          <div class="vs__et">${esc(RESORTES[1].nombre)}</div>
          <div class="vs__v">${ks[1] !== null ? fmt(ks[1],2) : '—'}</div>
          <div class="vs__u">N/m</div>
        </div>
      </div>`;

    let texto;
    if (ks[0] === null || ks[1] === null){
      texto = `<div class="nota"><strong>Faltan constantes.</strong> Completa las tablas de los dos
        resortes para que el cuaderno pueda compararlos.</div>`;
    } else {
      const mayor = Math.max(ks[0], ks[1]), menor = Math.min(ks[0], ks[1]);
      const cual = ks[0] >= ks[1] ? RESORTES[0].nombre : RESORTES[1].nombre;
      const otro = ks[0] >= ks[1] ? RESORTES[1].nombre : RESORTES[0].nombre;
      const razon = mayor / menor;
      texto = `<div class="nota">
        <strong>Comparación de los dos resortes</strong><br>
        El <b>${esc(cual.toLowerCase())}</b> es el más rígido: su constante es
        <span class="dato">${fmt(mayor,2)} N/m</span> frente a los
        <span class="dato">${fmt(menor,2)} N/m</span> del ${esc(otro.toLowerCase())}, es decir,
        <span class="dato" style="font-size:1.12em">${fmt(razon,2)} veces mayor</span>.<br>
        Dicho de otro modo: bajo la misma carga, el ${esc(otro.toLowerCase())} se alarga
        ${fmt(razon,2)} veces más que el ${esc(cual.toLowerCase())}. Para conseguir un alargamiento
        de 10 cm harían falta ${fmt(mayor*0.10,2)} N en uno y solo ${fmt(menor*0.10,2)} N en el otro.
      </div>`;
      const bs = datos.map(d => d.a ? d.a.b : 0);
      const maxB = Math.max(...bs.map(Math.abs));
      texto += `<div class="nota${maxB <= 0.05 ? '' : ' nota--aviso'}">
        <strong>¿Pasan las rectas por el origen?</strong> Los términos independientes valen
        <span class="dato">${fmt(bs[0],4)} N</span> y <span class="dato">${fmt(bs[1],4)} N</span>.
        ${maxB <= 0.05
          ? 'Ambos son despreciables frente a las fuerzas medidas, de modo que las dos rectas pasan por el origen dentro de la incertidumbre experimental. Es lo que debe ocurrir: un resorte sin carga no se alarga.'
          : 'Alguno es apreciable frente a las fuerzas medidas. Revisa si descontaste el peso del portamasas o si el cursor superior se movió entre mediciones: son las dos causas habituales.'}
      </div>`;
    }
    host.innerHTML = tarjetas + texto;
  }

  /* ------------------------------------------------------------ Refresco */
  function refrescar(){
    pintarElongaciones();
    const datos = RESORTES.map((R, r) => { const P = pares(r); return { P, a: ajuste(P) }; });
    pintarTablas1112();
    pintarBarras();
    pintarGrafica(datos);
    pintarResultado(datos);
    pintarConstantes(datos);

    /* Modelos de las casillas que el estudiante transcribe */
    const poner = (id, v) => { if (CLAVES[id]) CLAVES[id].modelo = v; };
    const ks = [];
    datos.forEach((d, r) => {
      const n = RESORTES[r].n;
      poner('ec-' + n, d.a ? ecuacion(d.a) : '');
      poner('k-'  + n, d.a ? fmt(d.a.k, 2) : '');
      poner('r2-' + n, d.a ? fmt(d.a.R2, 5) : '');
      poner('b-'  + n, d.a ? fmt(d.a.b, 4) : '');
      ks.push(d.a ? d.a.k : null);
    });
    poner('razon-k', (ks[0] && ks[1])
      ? fmt(Math.max(ks[0], ks[1]) / Math.min(ks[0], ks[1]), 2) : '');
  }

  return { refrescar, datosTabla, pares, ajuste, ecuacion };
})();

/* Estilos de los textos dentro de los SVG */
(function estilosSVG(){
  const s = document.createElement('style');
  s.textContent = `
    .m-lab{ font-family:var(--texto); font-size:12px; fill:#5A5346; }
    .m-et{ font-family:var(--mono); font-size:15px; font-weight:700; fill:#0C2B52; }
    .g-eje{ stroke:#4A4234; stroke-width:1.3; }
    .g-rejilla{ stroke:rgba(120,100,66,.18); stroke-width:1; }
    .g-num{ font-family:var(--mono); font-size:10px; fill:#5A5346; }
    .g-tit{ font-family:var(--texto); font-size:11px; fill:#4A4234; }
  `;
  document.head.appendChild(s);
})();
