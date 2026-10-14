/* ============================================================================
   PAGINAS.JS — Construcción del contenido de cada página del cuaderno
   ========================================================================== */

const CLAVES = {};

function esc(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function campo(o){
  CLAVES[o.id] = { resp:o.resp || [], modo:o.modo || 'texto', nota:o.nota || '',
                   modelo:o.modelo || '', tol:o.tol };
  const cls = 'campo' + (o.modo === 'simbolo' || o.modo === 'numero' ? '' : ' campo--texto')
            + (o.clase ? ' ' + o.clase : '');
  return `<input type="text" class="${cls}" id="${o.id}" data-campo="${o.id}"
            inputmode="${o.modo === 'numero' ? 'decimal' : 'text'}"
            placeholder="${esc(o.ph || '')}" autocomplete="off" spellcheck="false"
            aria-label="${esc(o.et || o.ph || o.id)}">
          <span class="pista" id="pista-${o.id}"></span>`;
}

function area(o){
  CLAVES[o.id] = { resp:[], modo:'libre', nota:o.guia || '', modelo:o.modelo || '' };
  /* El «eco» es una copia del texto que solo aparece al imprimir: un textarea
     conserva su altura en papel y recortaría las respuestas largas. */
  return `<textarea class="campo" id="${o.id}" data-campo="${o.id}" rows="${o.filas || 5}"
            placeholder="${esc(o.ph || 'Escribe aquí tu respuesta…')}"
            aria-label="${esc(o.et || o.id)}"></textarea>
          <div class="eco" id="eco-${o.id}" aria-hidden="true"></div>`;
}

function num(o){
  o.modo = 'numero'; o.clase = (o.clase || '') + ' campo--num'; o.ph = o.ph || '0,00';
  return campo(o);
}

/* Dato del estudiante: no se verifica, pero el autocompletado lo rellena con el
   valor del conjunto de datos de referencia. */
function dato(o){
  CLAVES[o.id] = { resp:[], modo:'libre', nota:'', modelo:o.modelo || '' };
  return `<input type="text" class="campo campo--num${o.clase ? ' ' + o.clase : ''}"
            id="${o.id}" data-campo="${o.id}" inputmode="decimal"
            placeholder="${esc(o.ph || '0,0')}" autocomplete="off" spellcheck="false"
            aria-label="${esc(o.et || o.id)}">`;
}

function accionesPagina(){
  return `<div class="acciones-pag">
      <button class="btn-papel btn-papel--clave" data-accion="autopag">Autocompletar esta página</button>
      <button class="btn-papel" data-accion="verificarpag">Verificar</button>
      <button class="btn-papel btn-papel--fantasma" data-accion="limpiarpag">Limpiar</button>
    </div>`;
}

function enunciado(n, texto){
  return `<div class="punto">
      <div class="punto__num" aria-hidden="true">${n}</div>
      <div class="punto__texto"><p>${texto}</p></div>
    </div>`;
}

/* ==========================================================================
   PÁGINAS
   ========================================================================== */
const PAGINAS = [];

/* --- 0 · Portada -------------------------------------------------------- */
PAGINAS.push(() => `
  <div class="portada">
    <img class="portada__img" src="imagenesUTP/portada.png"
         alt="Portada del cuaderno interactivo: Práctica 5, Ley de Hooke. Universidad Tecnológica de Pereira, Facultad de Ciencias Básicas.">
    <div>
      <span class="portada__sello">${esc(META.universidad)}</span>
      <h1>Cuaderno<br>interactivo<em>${esc(META.asignatura)}</em></h1>
      <p class="portada__practica">${esc(META.practica)} · ${esc(META.titulo)}</p>
      <div class="si-fila" aria-label="Magnitudes de la práctica">
        <span class="si-chip">F</span><span class="si-chip">x</span><span class="si-chip">k</span>
        <span class="si-chip">N</span><span class="si-chip">N/m</span>
      </div>
      <ul class="portada__meta">
        <li><b>Facultad</b><span>Ciencias Básicas · ${esc(META.departamento)}</span></li>
        <li><b>Asignatura</b><span>${esc(META.asignatura)}</span></li>
        <li><b>Docente</b><span>${campo({id:'docente', modo:'libre', ph:'Escribe el nombre de tu docente', et:'Docente', clase:'campo--ancho'})}</span></li>
        <li><b>Grupo</b><span>${campo({id:'grupo', modo:'libre', ph:'Número o código del grupo', et:'Grupo', clase:'campo--ancho'})}</span></li>
        <li><b>Fecha</b><span>${campo({id:'fecha', modo:'libre', ph:'dd / mm / aaaa', et:'Fecha', clase:'campo--ancho'})}</span></li>
      </ul>
      <button class="btn-grande" data-ir="1">Abrir el cuaderno →</button>
    </div>
  </div>
`);

/* --- 1 · Índice --------------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Navegación</span>
  <h1 class="titulo">Índice del cuaderno</h1>
  <p class="plomo">Veintiuna secciones: el fundamento y el procedimiento, el preinforme, las diez
  tablas de datos de los dos resortes, el cálculo de la fuerza y el alargamiento promedio, las
  gráficas con su ajuste, las constantes elásticas, el simulador, las preguntas y los anexos. Tu
  trabajo se guarda solo en este navegador cada vez que escribes.</p>
  <ol class="indice">
    ${SECCIONES.map((s,i) => `
      <li><button class="indice__btn" data-ir="${i}">
        <span class="indice__n">${String(i).padStart(2,'0')}</span>
        <span class="indice__t">${esc(s.t)}<br><span class="indice__d">${esc(s.d)}</span></span>
        <span class="indice__p">pág. ${i+1}</span>
      </button></li>`).join('')}
  </ol>
`);

/* --- 2 · Presentación --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe de laboratorio</span>
  <h1 class="titulo">Presentación de la práctica</h1>
  <p class="plomo">Colgar pesas de un resorte y medir cuánto se estira. Con eso basta para
  convertir el resorte en un instrumento de medida, que es lo que hace cualquier dinamómetro.</p>

  <p>En esta práctica vas a <b>verificar experimentalmente la ley de Hooke</b> y a determinar la
  <b>constante elástica de dos resortes</b>. El procedimiento es el mismo para ambos: se cuelga el
  resorte del soporte universal, se marca con un cursor la posición de su extremo libre, se le
  cuelga un portamasas con una carga conocida y se marca con otro cursor la nueva posición. La
  distancia entre los dos cursores es el <b>alargamiento</b>.</p>

  <p>Eso se repite con <b>cinco masas distintas</b> y, para cada masa, <b>tres veces</b>: una
  medición por cada integrante del grupo. Son treinta lecturas por resorte, sesenta en total. La
  insistencia tiene su razón: el alargamiento no se mide directamente, sino como diferencia de dos
  lecturas de una regla, de modo que las incertidumbres de ambas se acumulan y conviene promediar.</p>

  <p>El resultado se obtiene al final, de la gráfica. Al representar la fuerza
  <span class="dato">F = m·g</span> frente al alargamiento promedio, los puntos deben alinearse
  sobre una recta que pase por el origen, y <b>la pendiente de esa recta es la constante
  elástica</b> del resorte. Como en la práctica anterior, la magnitud que se busca no se lee en
  ningún instrumento: aparece en la forma de la curva que relacionan dos magnitudes que sí se
  pueden medir.</p>

  <div class="tarjetas">
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Lo que necesitas</h3>
      <p>El montaje de elasticidad del laboratorio —soporte, regla, cursores, dos resortes,
      portamasas y balanza— y este cuaderno abierto al lado.</p>
    </div>
    <div class="tarjeta tarjeta--azul">
      <h3 class="tarjeta__tit">Lo que entregas</h3>
      <p>El informe completo: resumen, marco teórico, Tablas 1 a 13, las dos gráficas con sus
      ecuaciones, las constantes elásticas, las cuatro preguntas y tres conclusiones propias.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Cómo se evalúa</h3>
      <p>Coherencia de los datos, correcta obtención de las ecuaciones de ajuste y justificación
      física de cada respuesta.</p>
    </div>
  </div>

  <div class="nota">
    <strong>El ajuste va incluido.</strong> La guía pide construir las gráficas en Excel con sus
    respectivas ecuaciones. Este cuaderno hace ese ajuste solo, por mínimos cuadrados, a partir de
    lo que escribas en las tablas: te entrega la ecuación de cada resorte, su coeficiente de
    determinación y la constante elástica que se deduce de la pendiente. Puedes usarlo para
    comprobar tu hoja de cálculo.
  </div>
`);

/* --- 3 · Objetivos ------------------------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 2</span>
  <h1 class="titulo">Objetivos</h1>

  <div class="tarjetas">
    <div class="tarjeta tarjeta--azul">
      <h3 class="tarjeta__tit">Objetivo general</h3>
      <p>Verificar la ley de Hooke estudiando la relación existente entre el alargamiento que
      experimenta un resorte y la fuerza deformadora a la que es sometido.</p>
    </div>
    <div class="tarjeta tarjeta--azul">
      <h3 class="tarjeta__tit">Objetivo específico</h3>
      <p>Obtener la constante de elasticidad de dos resortes.</p>
    </div>
  </div>

  <h2 class="sub">Lo que hay que conseguir por el camino</h2>
  <div class="tarjetas">
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Medir</h3>
      <p>Registrar la posición inicial y final del extremo del resorte para cinco cargas
      distintas, repitiendo tres veces cada medida.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Calcular</h3>
      <p>Obtener la elongación como diferencia de posiciones, su promedio y la fuerza deformadora
      a partir de la masa medida en la balanza.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Graficar</h3>
      <p>Representar F frente al alargamiento promedio y obtener la ecuación de la recta de
      ajuste para cada resorte.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Comparar</h3>
      <p>Interpretar la pendiente como constante elástica y contrastar la rigidez de los dos
      resortes.</p>
    </div>
  </div>

  <div class="nota">
    <strong>Al terminar deberías poder responder sin dudar:</strong> ¿cómo cambia el alargamiento
    al aumentar el peso?, ¿pasan las rectas por el origen y por qué?, ¿qué representa la pendiente
    y en qué unidades?, ¿cuál de los dos resortes es más rígido?
  </div>
`);

/* --- 4 · Materiales ----------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 3</span>
  <h1 class="titulo">Materiales e instrumentos</h1>
  <p class="plomo">Un soporte con una regla, dos resortes, unas pesas y una balanza. Todo el
  resultado de la práctica sale de combinar una medida de longitud con una medida de masa.</p>

  <div class="tarjetas">
    ${MATERIALES.map((m,i) => `
      <div class="tarjeta${i < 3 ? ' tarjeta--azul' : ''}">
        <h3 class="tarjeta__tit">${esc(m.n)}</h3>
        <p>${esc(m.f)}</p>
      </div>`).join('')}
  </div>

  <h2 class="sub">Qué se mide directamente y qué no</h2>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr><th style="width:28%">Magnitud</th><th style="width:20%">¿Se mide?</th><th>De dónde sale</th></tr></thead>
      <tbody>
        <tr><td class="col-fija">Posiciones x<sub>i</sub>, x<sub>f</sub></td>
            <td class="td-centro"><span class="dato">directa</span></td>
            <td>Se leen en la regla graduada del soporte, con los dos cursores.</td></tr>
        <tr><td class="col-fija">Masa m</td><td class="td-centro"><span class="dato">directa</span></td>
            <td>La da la balanza. Es la del conjunto completo: portamasas más pesas.</td></tr>
        <tr><td class="col-fija">Elongación x</td><td class="td-centro"><span class="dato">calculada</span></td>
            <td>Diferencia x = x<sub>f</sub> − x<sub>i</sub>, promediada sobre las tres mediciones.</td></tr>
        <tr><td class="col-fija">Fuerza F</td><td class="td-centro"><span class="dato">calculada</span></td>
            <td>F = m·g, con g = ${f2(G_REF)} m/s².</td></tr>
        <tr><td class="col-fija">Constante elástica k</td><td class="td-centro"><span class="dato">indirecta</span></td>
            <td>No se mide: es la pendiente de la recta que ajusta las cinco parejas (x̄, F).</td></tr>
      </tbody>
    </table>
    <caption>Tabla de apoyo. El objetivo de la práctica es, de nuevo, una magnitud que ningún instrumento lee.</caption>
  </div>

  <div class="nota nota--aviso">
    <strong>El portamasas también pesa.</strong> La masa que va a la tabla es la del
    <b>conjunto completo</b> colgado del resorte, medida en la balanza, no solo la de las pesas
    añadidas. Olvidarlo es el error más frecuente de esta práctica: desplaza todos los puntos hacia
    fuerzas menores y hace que la recta deje de pasar por el origen.
  </div>
`);

/* --- 5 · Fundamento físico ---------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 4</span>
  <h1 class="titulo">Fundamento físico</h1>
  <p class="plomo">Una proporcionalidad y una constante. Lo interesante no es la fórmula, sino que
  la constante se puede leer en la inclinación de una recta.</p>

  <h2 class="sub">La ley de Hooke</h2>
  <p>Cuando a un cuerpo elástico se le aplica una fuerza, se deforma; y si la fuerza no es
  excesiva, recupera su forma original al retirarla. Para el caso más sencillo, el de un resorte
  estirado a lo largo de su eje, el alargamiento resulta <b>directamente proporcional</b> a la
  fuerza aplicada:</p>

  <div class="formula">
    <div class="formula__ec">F = k · x</div>
    <div class="formula__pie">Con F en newtons, x en metros y k en newtons por metro.</div>
  </div>

  <div class="datos-ejer">
    <span>F : fuerza deformadora (N)</span>
    <span>x : alargamiento (m)</span>
    <span>k : constante elástica (N/m)</span>
  </div>

  <p>La constante <i>k</i> es característica de cada resorte y se llama <b>constante elástica</b>
  o de rigidez. Su significado es directo: cuántos newtons hay que aplicar para conseguir un metro
  de alargamiento. Un resorte con <i>k</i> grande es duro y se estira poco; uno con <i>k</i>
  pequeña es blando y se estira mucho con la misma carga.</p>

  <h2 class="sub">Dos fuerzas que conviene no confundir</h2>
  <div class="formulario">
    <div class="f-carta">
      <div class="f-carta__n">Deformadora</div>
      <div class="f-carta__ec">F = k · x</div>
      <div class="f-carta__p">La que se aplica desde fuera. Aquí, el peso colgado.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Recuperadora</div>
      <div class="f-carta__ec">F = − k · x</div>
      <div class="f-carta__p">La que ejerce el resorte. El signo indica que apunta hacia el equilibrio.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">En equilibrio</div>
      <div class="f-carta__ec">m · g = k · x</div>
      <div class="f-carta__p">Se compensan: medir el peso es medir la fuerza del resorte.</div>
    </div>
  </div>

  <p>Con el portamasas en reposo las dos fuerzas se equilibran. Esa es la razón por la que basta
  con pesar lo que cuelga para conocer la fuerza que el resorte está ejerciendo, sin necesidad de
  ningún dinamómetro.</p>

  <h2 class="sub">Cómo se obtiene k de la gráfica</h2>
  <p>En lugar de calcular <i>k</i> con una sola pareja de valores, se miden varias y se
  representan. Si la ley se cumple, los puntos describen una recta que pasa por el origen —un
  resorte sin carga no se alarga— y <b>su pendiente es la constante elástica</b>:</p>

  <div class="formulario">
    <div class="f-carta">
      <div class="f-carta__n">Lo que mides</div>
      <div class="f-carta__ec">F = m · g</div>
      <div class="f-carta__p">Con la masa de la balanza y g = ${f2(G_REF)} m/s².</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Lo que ajustas</div>
      <div class="f-carta__ec">F = m · x̄ + b</div>
      <div class="f-carta__p">La recta de mínimos cuadrados sobre tus cinco parejas.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Lo que obtienes</div>
      <div class="f-carta__ec">k = pendiente</div>
      <div class="f-carta__p">Y el término independiente b debería salir casi nulo.</div>
    </div>
  </div>

  <p>Obtener <i>k</i> del ajuste es mejor que calcularlo con una sola medida por dos razones: el
  ajuste promedia los errores de todos los puntos, y además permite <b>comprobar</b> que la
  relación es realmente lineal, cosa que una sola pareja de valores nunca podría decir.</p>

  <h2 class="sub">El límite elástico</h2>
  <p>La ley no vale indefinidamente. Existe un valor de la carga, el <b>límite elástico</b>, por
  encima del cual el resorte deja de comportarse de forma proporcional: la gráfica se curva y, si
  se insiste, el resorte queda permanentemente deformado. Por eso se trabaja con masas moderadas y
  por eso tiene sentido mirar si el último punto se sale de la recta.</p>

  <h2 class="sub">La energía almacenada</h2>
  <div class="formula">
    <div class="formula__ec">E = ½ · k · x²</div>
    <div class="formula__pie">Energía potencial elástica, en julios.</div>
  </div>
  <p>No crece en proporción al alargamiento sino con su <b>cuadrado</b>: estirar un resorte el
  doble exige acumular cuatro veces más energía. Esa es la energía que devuelve al soltarlo, y la
  razón de que los resortes sirvan para almacenar y restituir trabajo mecánico.</p>

  <div class="nota nota--aviso">
    <strong>Cuidado con los centímetros.</strong> Las posiciones se leen en la regla en
    centímetros, pero la constante elástica se expresa en newtons por <b>metro</b>. Si llevas a la
    gráfica el alargamiento en centímetros, la pendiente que obtengas será <b>cien veces menor</b>
    que la constante verdadera. Es, de lejos, el error más común en esta práctica.
  </div>
`);

/* --- 6 · Montaje experimental -------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 5</span>
  <h1 class="titulo">Montaje experimental</h1>
  <p class="plomo">Primero el equipo real, tal como está en el laboratorio; después un esquema con
  puntos sensibles para repasar qué papel cumple cada parte.</p>

  <h2 class="sub">El montaje en el laboratorio</h2>
  <div class="fotos">
    <figure class="foto">
      <img src="imagenesUTP/montaje_general.jpg" alt="Soporte universal con la regla vertical graduada y el resorte colgado">
      <figcaption><b>Figura 1.</b> Montaje experimental completo: el soporte universal con la
      regla vertical graduada y el resorte colgado de su extremo superior.</figcaption>
    </figure>
    <figure class="foto">
      <img src="imagenesUTP/cursor_inicial.jpg" alt="Cursor superior alineado con el extremo del resorte sin carga">
      <figcaption><b>Figura 2.</b> Medición de la posición inicial: el cursor superior se alinea
      con el extremo del resorte <b>sin carga</b> y ya no vuelve a moverse.</figcaption>
    </figure>
    <figure class="foto">
      <img src="imagenesUTP/con_masa.jpg" alt="Resorte alargado con el portamasas colgado">
      <figcaption><b>Figura 3.</b> Elongación del resorte con la masa: el portamasas cuelga del
      gancho y el resorte queda estirado en su nueva posición de equilibrio.</figcaption>
    </figure>
    <figure class="foto">
      <img src="imagenesUTP/cursor_final.jpg" alt="Los dos cursores marcando la posición inicial y la final">
      <figcaption><b>Figura 4.</b> Medición de la posición final: el cursor inferior se baja hasta
      el extremo del resorte cargado. La distancia entre los dos cursores es la elongación.</figcaption>
    </figure>
  </div>

  <h2 class="sub">Esquema interactivo</h2>
  <p>Toca o haz clic sobre cada punto naranja para leer qué función cumple esa parte y por qué
  importa.</p>

  <div class="instr">
    <h3 class="instr__tit">Soporte, resorte y cursores <span>interactivo</span></h3>
    <div class="montaje" id="montaje-host"></div>
  </div>

  <div class="nota">
    <strong>La medida clave es una resta.</strong> Lo que entra en la gráfica no es ninguna de las
    dos posiciones que lees, sino su diferencia. Por eso el cursor superior debe quedar fijo
    durante toda la serie: si se desplaza un milímetro entre dos medidas, ese milímetro se suma o
    se resta a la elongación sin que nada lo delate.
  </div>
`);

/* --- 7 · Procedimiento --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 6</span>
  <h1 class="titulo">Procedimiento</h1>
  <p class="plomo">Los diez pasos de la guía. Los marcados en naranja son aquellos en los que
  debes registrar datos en el cuaderno.</p>

  <div class="pasos">
    ${PASOS.map((p,i) => `
      <div class="paso${p.clave ? ' paso--clave' : ''}">
        <div class="paso__n" aria-hidden="true">${i+1}</div>
        <div class="paso__t">
          <h3 class="sub3" style="margin:0 0 4px">${esc(p.t)}</h3>
          <p>${p.d}</p>
        </div>
      </div>`).join('')}
  </div>

  <div class="nota nota--aviso">
    <strong>Sesenta lecturas en total.</strong> Dos posiciones por medición, tres mediciones por
    masa, cinco masas por resorte y dos resortes. Conviene completar una tabla entera, con su
    promedio, antes de añadir la siguiente masa.
  </div>

  <div class="nota">
    <strong>Todos los integrantes miden.</strong> La guía lo pide expresamente, y no es una
    formalidad: las tres lecturas de una misma tabla deben ser independientes para que el promedio
    reduzca de verdad el error aleatorio. Si una sola persona mide tres veces mirando desde la
    misma posición, repetirá el mismo error de paralaje las tres veces y el promedio no corregirá
    nada.
  </div>
`);

/* --- 8 · Encabezado del informe ------------------------------------------ */
PAGINAS.push(() => `
  <div class="cab-informe">
    <div class="cab-informe__txt">
      <span class="eyebrow">Informe · Encabezado</span>
      <h1 class="titulo" style="margin-bottom:0">Resumen y grupo de trabajo</h1>
    </div>
    <div class="casilla-nota">
      <span class="casilla-nota__et">Nota</span>
      ${campo({id:'nota', modo:'libre', ph:'—', et:'Nota asignada por el docente', clase:'campo--num'})}
      <span class="casilla-nota__pie">Espacio reservado para el docente</span>
    </div>
  </div>

  <h2 class="sub">Resumen</h2>
  <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">
    Un párrafo que diga qué se hizo, cómo se hizo y qué se obtuvo. Se escribe al final, cuando ya
    conoces los resultados, aunque aparezca al principio del informe.</p>
  ${area({id:'resumen', filas:8, modelo:RESUMEN_MODELO, et:'Resumen del informe'})}

  <h2 class="sub">Estudiantes</h2>
  <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">
    Esta práctica está pensada para grupos de tres: cada integrante realiza una de las tres
    mediciones de cada tabla.</p>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr><th class="col-num">#</th><th style="width:58%">Nombre completo</th><th style="width:34%">Código</th></tr></thead>
      <tbody>
        ${[0,1,2].map(i => `
          <tr>
            <td class="col-num">${i+1}</td>
            <td>${campo({id:'est'+i, modo:'libre', ph:'nombre y apellidos', et:'Estudiante '+(i+1)})}</td>
            <td>${campo({id:'cod'+i, modo:'libre', ph:'código', et:'Código '+(i+1), clase:'campo--num'})}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <caption>Integrantes del grupo de laboratorio.</caption>
  </div>

  <div class="nota">
    <strong>Estos campos son tuyos.</strong> El autocompletado no inventa nombres, códigos ni
    calificaciones: la casilla de nota, la tabla de estudiantes y el docente quedan siempre en
    blanco. El resumen sí trae un modelo de redacción.
  </div>
  ${accionesPagina()}
`);

/* --- 9 · Marco teórico --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 1</span>
  <h1 class="titulo">Marco teórico</h1>
  ${enunciado(1, 'Redacte el marco teórico de la práctica.')}

  <p>Debe cubrir, con tus propias palabras y citando las fuentes que consultes: qué afirma la ley
  de Hooke y bajo qué condiciones es válida; qué es la constante elástica, qué unidades tiene y
  qué significa físicamente; la diferencia entre la fuerza deformadora y la recuperadora y por qué
  en equilibrio basta con pesar lo que cuelga; qué es el límite elástico; y cómo se obtiene la
  constante a partir de la pendiente de la gráfica.</p>

  ${area({id:'marco', filas:16, modelo:MARCO_MODELO, et:'Marco teórico',
          ph:'Desarrolla aquí el marco teórico…'})}

  <div class="nota">
    <strong>El autocompletado carga un texto de referencia.</strong> Sirve para que veas la
    profundidad y la estructura esperadas, no para copiarlo: el marco teórico se califica por la
    comprensión que demuestra, y esa tiene que ser tuya.
  </div>
  ${accionesPagina()}
`);

/* --- 10 · Preinforme ----------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Preinforme</span>
  <h1 class="titulo">Predicciones antes de medir</h1>
  <p class="plomo">Cinco cálculos que puedes hacer con la teoría, antes de tocar el montaje. Tres
  de ellos obligan a cambiar de unidades, que es justo donde se pierde esta práctica. Estos sí
  tienen respuesta correcta: el botón <em>Verificar</em> la contrasta.</p>

  <div class="datos-ejer">
    <span>g = ${f2(G_REF)} m/s²</span>
    <span>F = m·g</span>
    <span>F = k·x</span>
    <span>E = ½·k·x²</span>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>1.</b> ¿Qué fuerza ejerce sobre el resorte un conjunto de masa
    <b>0,200 kg</b> colgado de él?</p>
    <div class="ejer__r">
      <label for="pre-f">fuerza</label>
      ${num({id:'pre-f', resp:[f2(0.200*G_REF)], tol:0.02, ph:'0,00',
             et:'Fuerza ejercida por 0,200 kg',
             nota:`F = m·g = 0,200 × ${f2(G_REF)} = ${f2(0.200*G_REF)} N.`})}
      <span class="ejer__u">N</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>2.</b> Un resorte tiene una constante elástica de <b>25,0 N/m</b>.
    ¿Cuántos <b>centímetros</b> se alarga al colgarle esa misma masa de 0,200 kg?</p>
    <div class="ejer__r">
      <label for="pre-x">alargamiento</label>
      ${num({id:'pre-x', resp:[f1(0.200*G_REF/25.0*100)], tol:0.15, ph:'0,0',
             et:'Alargamiento en centímetros',
             nota:`x = F/k = ${f2(0.200*G_REF)} / 25,0 = ${f4(0.200*G_REF/25.0)} m, que son ${f1(0.200*G_REF/25.0*100)} cm.`})}
      <span class="ejer__u">cm</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>3.</b> Otro resorte se alarga <b>8,0 cm</b> cuando se le aplica una
    fuerza de <b>2,0 N</b>. ¿Cuál es su constante elástica, <b>en N/m</b>?</p>
    <div class="ejer__r">
      <label for="pre-k">constante elástica</label>
      ${num({id:'pre-k', resp:[f1(2.0/0.080)], tol:0.6, ph:'0,0',
             et:'Constante elástica en newtons por metro',
             nota:'k = F/x = 2,0 N / 0,080 m = 25,0 N/m. Hay que pasar los 8,0 cm a metros: si se divide entre 8,0 sale 0,25 N/cm, que es cien veces menor.'})}
      <span class="ejer__u">N/m</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>4.</b> En una medición la posición inicial fue <b>72,0 cm</b> y la
    final <b>64,4 cm</b>. ¿Cuál es la elongación <b>en metros</b>?</p>
    <div class="ejer__r">
      <label for="pre-elo">elongación</label>
      ${num({id:'pre-elo', resp:[f3(0.076)], tol:0.002, ph:'0,000',
             et:'Elongación en metros',
             nota:'x = |x_f − x_i| = |64,4 − 72,0| = 7,6 cm = 0,076 m. La diferencia sale negativa porque la regla decrece hacia abajo: lo que cuenta es la distancia entre los dos cursores. Primero la resta, después la conversión.'})}
      <span class="ejer__u">m</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>5.</b> ¿Cuánta energía potencial elástica almacena el resorte de la
    pregunta 3 cuando está estirado esos <b>8,0 cm</b>?</p>
    <div class="ejer__r">
      <label for="pre-e">energía</label>
      ${num({id:'pre-e', resp:[f3(0.5*25.0*0.080*0.080)], tol:0.004, ph:'0,000',
             et:'Energía potencial elástica',
             nota:`E = ½·k·x² = 0,5 × 25,0 × 0,080² = ${f3(0.5*25.0*0.0064)} J. Nota que al duplicar el alargamiento la energía se multiplicaría por cuatro.`})}
      <span class="ejer__u">J</span>
    </div>
  </div>

  <div class="nota">
    <strong>Tres de las cinco respuestas dependen de una conversión.</strong> Si alguna te sale
    cien veces mayor o menor de lo esperado, el problema casi seguro está en los centímetros. En
    el cuaderno las posiciones se escriben en centímetros, como se leen en la regla, y la
    conversión a metros la hace el propio cuaderno antes de ajustar la recta.
  </div>
  ${accionesPagina()}
`);

/* --- 11 y 12 · Tablas de datos de cada resorte --------------------------- */
function tablaMini(r, i){
  const nTabla = r * N_MASAS + i + 1;          // 1..5 y 6..10
  const filas = [0,1,2].map(j => `
    <tr>
      <td class="col-mag">${j+1}</td>
      <td class="td-centro">${dato({ id:`xi-${r+1}-${i+1}-${j}`, modelo:f1(xiModelo(r,i,j)), ph:'0,0',
            et:`Posición inicial, tabla ${nTabla}, medición ${j+1}` })}</td>
      <td class="td-centro">${dato({ id:`xf-${r+1}-${i+1}-${j}`, modelo:f1(xfModelo(r,i,j)), ph:'0,0',
            et:`Posición final, tabla ${nTabla}, medición ${j+1}` })}</td>
      <td class="td-centro"><span class="dato" id="elo-${r+1}-${i+1}-${j}">—</span></td>
    </tr>`).join('');

  return `
    <div class="tabla-mini">
      <h3 class="tabla-mini__tit">Tabla ${nTabla}</h3>
      <p class="tabla-mini__m">
        <label for="m-${r+1}-${i+1}">m =</label>
        ${dato({ id:`m-${r+1}-${i+1}`, modelo:f3(MASAS_MODELO[i]), ph:'0,000',
                 et:`Masa de la tabla ${nTabla}` })}
        <span class="ejer__u">kg</span>
      </p>
      <div class="tabla-caja">
        <table class="tabla">
          <thead>
            <tr>
              <th style="width:15%">No.</th>
              <th class="th-sub" style="width:31%">x<sub>i</sub> (cm)</th>
              <th class="th-sub" style="width:31%">x<sub>f</sub> (cm)</th>
              <th class="th-sub">x (cm)</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      <div class="tabla-mini__prom" id="prom-${r+1}-${i+1}">—</div>
    </div>`;
}

[0,1].forEach(r => {
  PAGINAS.push(() => `
    <span class="eyebrow">Informe · Punto 2 · Datos experimentales</span>
    <h1 class="titulo">${esc(RESORTES[r].nombre)} · Tablas ${r*N_MASAS+1} a ${r*N_MASAS+N_MASAS}</h1>
    ${enunciado(2, `Registre la masa colgada y, para cada una de las tres mediciones, la posición inicial y la posición final del extremo del <b>${esc(RESORTES[r].nombre.toLowerCase())}</b>.`)}

    <div class="datos-ejer">
      <span>${N_MASAS} masas</span>
      <span>${N_MED} mediciones por masa</span>
      <span>una por integrante</span>
      <span>x = |x<sub>f</sub> − x<sub>i</sub>|</span>
    </div>

    <p>La columna de la elongación y el promedio de cada tabla los calcula el cuaderno: tú solo
    escribes lo que lees en la regla y en la balanza.</p>

    <div class="rejilla-tablas">
      ${[0,1,2,3,4].map(i => tablaMini(r, i)).join('')}
    </div>

    <div class="nota nota--aviso">
      <strong>Escribe las posiciones con una cifra decimal.</strong> La regla resuelve un
      milímetro, es decir, una décima de centímetro: anotar «12» en lugar de «12,0» tira
      información, y anotar «12,04» inventa una precisión que el instrumento no tiene. Usa coma o
      punto decimal, como prefieras: el cuaderno entiende las dos formas.
    </div>

    <div class="nota">
      <strong>Fíjate en el sentido de la regla.</strong> En el montaje del laboratorio la
      graduación <b>decrece hacia abajo</b>: al estirarse el resorte, la lectura del cursor
      inferior resulta <b>menor</b> que la del superior. La elongación es la distancia entre los
      dos cursores, es decir, el <b>valor absoluto</b> de la diferencia, y así la calcula el
      cuaderno. De ese modo da igual en qué sentido esté graduada tu regla.
    </div>
    ${accionesPagina()}
  `);
});

/* --- 13 · Tablas 11 y 12 ------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Análisis · Punto 1</span>
  <h1 class="titulo">Tablas 11 y 12 · Fuerza y alargamiento</h1>
  ${enunciado(1, 'Con los datos consignados en cada una de las tablas, calcule la fuerza (F = m·g) y el promedio del alargamiento x, y complete las Tablas 11 y 12.')}

  <p class="plomo">Estas dos tablas se completan <b>solas</b> con lo que escribiste en las Tablas
  1 a 10. Si corriges un dato y vuelves aquí, todo se recalcula.</p>

  <div class="formulario">
    <div class="f-carta">
      <div class="f-carta__n">Fuerza</div>
      <div class="f-carta__ec">F = m · g</div>
      <div class="f-carta__p">Con la masa en kg y g = ${f2(G_REF)} m/s², F sale en newtons.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Alargamiento medio</div>
      <div class="f-carta__ec">x̄ = (x₁+x₂+x₃)/3</div>
      <div class="f-carta__p">Promedio de las tres mediciones de esa tabla.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Unidades</div>
      <div class="f-carta__ec">1 cm = 0,01 m</div>
      <div class="f-carta__p">La columna x̄ va en metros, no en centímetros.</div>
    </div>
  </div>

  <div id="tabla-11"></div>
  <div id="tabla-12"></div>

  <h2 class="sub">Lectura de los datos</h2>
  <p>Cada barra representa el alargamiento promedio obtenido con esa carga. Observa que, dentro de
  cada resorte, las barras crecen de forma regular: cada masa añadida produce aproximadamente el
  mismo incremento de longitud. Esa regularidad es la ley de Hooke antes de graficar nada.</p>
  <div id="barras-datos"></div>

  <div class="nota">
    <strong>Mira la última columna.</strong> El cociente F/x̄ debería salir parecido en las cinco
    filas de un mismo resorte: es la constante elástica calculada punto a punto. Si una fila se
    aparta mucho de las demás, lo más probable es que haya un error de lectura en esa tabla, y
    conviene revisarla antes de pasar a la gráfica.
  </div>
  ${accionesPagina()}
`);

/* --- 14 · Gráficas y Tabla 13 -------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Análisis · Punto 2</span>
  <h1 class="titulo">Gráficas F frente a x̄</h1>
  ${enunciado(2, 'Para cada uno de los resortes, construya las gráficas de F en función de x̄ con sus respectivas ecuaciones y complete la Tabla 13.')}

  <p class="plomo">Fuerza en el eje vertical, alargamiento promedio en el horizontal, los dos
  resortes en unos mismos ejes para poder compararlos. La gráfica y el ajuste se recalculan solos
  cada vez que cambias un dato.</p>

  <div class="grafica" id="graf-fx"></div>

  <h2 class="sub">Modelo de ajuste</h2>
  <p>La recta general es la que entrega la línea de tendencia de una hoja de cálculo y es la que
  pide la guía. La recta por el origen impone que el resorte sin carga no se alargue; compara las
  dos y fíjate en cuánto cambia la pendiente.</p>

  <div class="ejer__r" style="margin:12px 0 4px">
    <label for="tipo-ajuste">Ajuste de los datos</label>
    <select class="campo campo--texto" id="tipo-ajuste" data-campo="tipo-ajuste"
            aria-label="Tipo de ajuste de los datos" style="min-width:290px">
      <option value="general">F = m·x + b  ·  recta general</option>
      <option value="origen">F = k·x  ·  recta por el origen</option>
    </select>
  </div>

  <div id="resultado-ajuste"></div>

  <h2 class="sub">Tabla 13 · Ecuaciones obtenidas</h2>
  <p>Transcribe aquí la ecuación de cada resorte, tal como la pide el informe.</p>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr><th style="width:26%">Resorte</th><th>Ecuación</th></tr></thead>
      <tbody>
        ${RESORTES.map(R => `
          <tr>
            <td class="col-mag">${R.n}</td>
            <td>${campo({id:'ec-'+R.n, modo:'libre', ph:'F = k·x', et:'Ecuación del resorte '+R.n})}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <caption>Tabla 13. Ecuaciones de las dos rectas. Se autocompletan con lo que el cuaderno acaba de calcular.</caption>
  </div>

  <div class="nota">
    <strong>Qué mirar en la ecuación.</strong> Dos cosas. El <b>coeficiente que multiplica a x</b>
    es la constante elástica, y debe salir en newtons por metro. El <b>término independiente</b>
    debería ser prácticamente cero: si te sale un valor apreciable, no lo ignores, es la pista de
    que falta descontar algo —casi siempre el peso del portamasas— o de que el cursor superior se
    movió.
  </div>
  ${accionesPagina()}
`);

/* --- 15 · Constantes elásticas ------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Análisis · Punto 3</span>
  <h1 class="titulo">Constantes elásticas</h1>
  ${enunciado(3, 'Obtenga la constante de elasticidad de cada resorte a partir de la pendiente de su recta y compare los dos resortes entre sí.')}

  <p class="plomo">La pendiente de cada recta es la constante elástica. Aquí la tienes despejada,
  con su coeficiente de determinación y la comparación entre los dos resortes.</p>

  <div id="constantes-host"></div>

  <h2 class="sub">Transcribe los resultados para tu informe</h2>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr>
        <th style="width:22%">Resorte</th>
        <th style="width:28%">k (N/m)</th>
        <th style="width:25%">R²</th>
        <th style="width:25%">Término indep. (N)</th>
      </tr></thead>
      <tbody>
        ${RESORTES.map(R => `
          <tr>
            <td class="col-mag">${R.n}</td>
            <td class="td-centro">${campo({id:'k-'+R.n, modo:'libre', clase:'campo--num', ph:'0,00', et:'Constante elástica del resorte '+R.n})}</td>
            <td class="td-centro">${campo({id:'r2-'+R.n, modo:'libre', clase:'campo--num', ph:'0,0000', et:'Coeficiente de determinación del resorte '+R.n})}</td>
            <td class="td-centro">${campo({id:'b-'+R.n, modo:'libre', clase:'campo--num', ph:'0,000', et:'Término independiente del resorte '+R.n})}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <caption>Resultados finales de la práctica. Las casillas se autocompletan con lo que el cuaderno calculó.</caption>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>Comparación.</b> ¿Cuántas veces más rígido es un resorte que el otro?
    Escribe el cociente entre la constante mayor y la menor.</p>
    <div class="ejer__r">
      <label for="razon-k">k mayor / k menor</label>
      ${campo({id:'razon-k', modo:'libre', clase:'campo--num', ph:'0,00', et:'Cociente entre las dos constantes'})}
      <span class="ejer__u">veces</span>
    </div>
  </div>

  <div class="nota">
    <strong>Qué significa ese número.</strong> Si el cociente vale 1,8, el primer resorte necesita
    1,8 veces más fuerza que el segundo para alargarse lo mismo; o, visto al revés, con la misma
    carga el segundo se estira 1,8 veces más. Es exactamente lo que notaste al colgar las pesas.
  </div>
  ${accionesPagina()}
`);

/* --- 16 · Simulador ------------------------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 7</span>
  <h1 class="titulo">Simulador de la ley de Hooke</h1>
  <p class="plomo">Un resorte que puedes cargar y descargar sin tocar el montaje. Sirve para
  anticipar lo que vas a medir y para comprobar los cálculos del preinforme.</p>

  <div class="instr">
    <h3 class="instr__tit">Resorte con carga <span>en vivo</span></h3>
    <p class="instr__ayuda">Mueve el deslizador de <b>masa</b> y observa cómo se estira el
    resorte. El de <b>constante elástica</b> cambia el resorte por otro más duro o más blando: con
    la misma carga, el alargamiento cambia en proporción inversa. Los dos botones cargan las
    constantes de los resortes de la práctica.</p>
    <div id="simulador-host"></div>
  </div>

  <div class="nota">
    <strong>Prueba esto.</strong> Fija la masa en 0,100 kg y anota el alargamiento. Después
    duplícala a 0,200 kg: el alargamiento se duplica también. Ahora vuelve a 0,100 kg y duplica en
    cambio la constante elástica: el alargamiento se reduce a la mitad. Esas dos proporciones, una
    directa y otra inversa, son todo el contenido de F = k·x.
  </div>

  <div class="nota nota--aviso">
    <strong>El simulador no tiene límite elástico.</strong> Aquí el resorte sigue la ley de Hooke
    por mucho que lo cargues, cosa que ningún resorte real hace. En el laboratorio, pasado cierto
    punto, la gráfica se curva y el resorte queda deformado para siempre: por eso se trabaja con
    masas moderadas.
  </div>
`);

/* --- 17 · Preguntas ------------------------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Preguntas</span>
  <h1 class="titulo">Preguntas</h1>
  ${enunciado(4, 'Responda y justifique cada pregunta con los datos, las gráficas y las ecuaciones que obtuvo.')}

  ${PREGUNTAS.map((q,i) => `
    <h3 class="sub3">${i+1}. ${esc(q.texto)}</h3>
    <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">${esc(q.guia)}</p>
    ${area({id:q.id, guia:q.guia, modelo:q.modelo, et:'Respuesta '+(i+1), filas:7})}
  `).join('')}

  <div class="nota">
    <strong>Se califica la justificación, no la extensión.</strong> Una respuesta corta que cite un
    valor concreto de tus tablas y lo explique con F = k·x vale más que un párrafo largo y
    genérico.
  </div>
  ${accionesPagina()}
`);

/* --- 18 · Conclusiones --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Conclusiones</span>
  <h1 class="titulo">Conclusiones</h1>
  ${enunciado(5, 'Escriba 3 conclusiones con respecto a la práctica.')}
  <p class="plomo">Cada conclusión debe apoyarse en algo que mediste: una pareja de las Tablas 11
  o 12, una ecuación de la Tabla 13 o la comparación entre las dos constantes.</p>

  <div class="datos-ejer">
    <span>proporcionalidad F–x</span><span>constantes obtenidas</span>
    <span>comparación de resortes</span><span>fuentes de error</span>
  </div>

  ${CONCLUSIONES.map((c,i) => `
    <h3 class="sub3">Conclusión ${i+1}</h3>
    <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">${esc(c.guia)}</p>
    ${area({id:c.id, guia:c.guia, modelo:c.modelo, et:'Conclusión '+(i+1), filas:6})}
  `).join('')}
  ${accionesPagina()}
`);

/* --- 19 · Glosario ------------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Anexo</span>
  <h1 class="titulo">Glosario</h1>
  <p class="plomo">Toca cada término para desplegar su definición.</p>

  <div class="glosario">
    ${GLOSARIO.map((g,i) => `
      <div class="glos-item">
        <button class="glos-btn" data-glos="${i}" aria-expanded="false" aria-controls="glos-${i}">
          <span class="glos-term">${esc(g.t)}</span>
          <span class="glos-mas" aria-hidden="true">+</span>
        </button>
        <div class="glos-def" id="glos-${i}" hidden>
          ${esc(g.d)} ${g.f ? `<em>(${esc(g.f)})</em>` : ''}
        </div>
      </div>`).join('')}
  </div>
`);

/* --- 20 · Referencias ---------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Anexo</span>
  <h1 class="titulo">Referencias</h1>
  <p class="plomo">Fuentes que sustentan el marco teórico y el procedimiento. Formato APA,
  7.ª edición.</p>

  <div style="margin-top:18px">
    ${REFERENCIAS.map(r => `
      <p style="padding-left:2.2em;text-indent:-2.2em;margin-bottom:14px;font-size:.95rem">${r}</p>
    `).join('')}
  </div>

  <div class="nota">
    <strong>Cómo citar este cuaderno.</strong> Departamento de Física, Universidad Tecnológica de
    Pereira. <i>Cuaderno interactivo de Laboratorio de Física I: ley de Hooke</i>
    [Recurso educativo digital].
  </div>

  <h2 class="sub">Tu trabajo</h2>
  <p>Todo lo que escribiste se guarda únicamente en este navegador y en este dispositivo. Usa
  <em>Imprimir</em> en la barra superior para generar el PDF de entrega con todas las páginas, o
  <em>Reiniciar</em> para vaciar el cuaderno y empezar de nuevo.</p>
`);
