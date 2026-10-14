/* ============================================================================
   DATOS.JS — Contenido académico de la práctica
   Universidad Tecnológica de Pereira · Facultad de Ciencias Básicas
   Departamento de Física · Laboratorio de Física I
   Práctica 5 · Ley de Hooke
   Fuente: «Informe. Verificación experimental. Ley de Hooke»
   ========================================================================== */

const META = {
  universidad:  "Universidad Tecnológica de Pereira",
  facultad:     "Facultad de Ciencias Básicas",
  departamento: "Departamento de Física",
  asignatura:   "Laboratorio de Física I",
  practica:     "Práctica 5",
  titulo:       "Ley de Hooke"
};

/* ------------------------------------------------------- Constantes físicas */
const G_REF = 9.80;          // aceleración de la gravedad, m/s²
const N_MASAS = 5;           // cinco masas por resorte
const N_MED   = 3;           // tres mediciones por masa (una por integrante)

/* Las masas que se van añadiendo al portamasas, en kilogramos */
const MASAS_MODELO = [0.050, 0.100, 0.150, 0.200, 0.250];

/* --------------------------------------------------------------------------
   CONJUNTO DE DATOS DE REFERENCIA

   El estudiante mide sus propios resortes y sus propias masas, de modo que las
   casillas de las Tablas 1 a 10 no tienen una «respuesta correcta»: son datos
   suyos. Lo que sí tiene el cuaderno es un conjunto de datos de referencia,
   coherente y reproducible, que carga el botón «Autocompletar».

   Se construye con dos resortes de constante conocida. Para cada masa se
   calcula el alargamiento teórico x = F/k y se sitúa el resorte en la regla
   partiendo de una longitud inicial fija. A las lecturas de posición inicial y
   final se les aplica una desviación de una o dos décimas de centímetro, que es
   justo la resolución de la regla del montaje. Las desviaciones están escritas
   una a una y no se sortean al azar, para que el cuaderno entregue siempre el
   mismo ejemplo y el docente pueda proyectarlo en clase.
   -------------------------------------------------------------------------- */
const RESORTES = [
  { n:1, k:25.8, x0:72.0, color:"#0C2B52", nombre:"Resorte 1" },
  { n:2, k:14.6, x0:74.0, color:"#C87020", nombre:"Resorte 2" }
];

/* Desviación de la lectura de la posición inicial, en cm */
const DESV_XI = [
  [[ 0.0, 0.1,-0.1], [ 0.1, 0.0, 0.0], [-0.1, 0.0, 0.1], [ 0.0,-0.1, 0.1], [ 0.1, 0.1,-0.1]],
  [[ 0.1, 0.0, 0.0], [-0.1, 0.1, 0.0], [ 0.0, 0.1,-0.1], [ 0.1,-0.1, 0.0], [ 0.0, 0.0, 0.1]]
];
/* Desviación de la lectura de la posición final, en cm */
const DESV_XF = [
  [[ 0.1,-0.1, 0.1], [-0.1, 0.2, 0.0], [ 0.2, 0.0,-0.1], [ 0.0, 0.1, 0.2], [-0.1, 0.2, 0.1]],
  [[ 0.2, 0.0,-0.1], [ 0.1, 0.2, 0.0], [-0.1, 0.1, 0.2], [ 0.2,-0.1, 0.1], [ 0.1, 0.2, 0.0]]
];

/* Posición inicial de referencia (cm) del resorte r, masa i, medición j */
function xiModelo(r, i, j){
  return RESORTES[r].x0 + DESV_XI[r][i][j];
}
/* Posición final de referencia (cm).
   En la regla del montaje la graduación DECRECE hacia abajo —se comprueba en las
   fotografías—, de modo que al estirarse el resorte la lectura disminuye y la
   posición final resulta menor que la inicial. */
function xfModelo(r, i, j){
  const F = MASAS_MODELO[i] * G_REF;              // newtons
  const alarga = F / RESORTES[r].k * 100;         // centímetros
  return xiModelo(r, i, j) - alarga + DESV_XF[r][i][j];
}

/* Formato español: coma decimal */
function f1(x){ return Number(x).toFixed(1).replace('.', ','); }
function f2(x){ return Number(x).toFixed(2).replace('.', ','); }
function f3(x){ return Number(x).toFixed(3).replace('.', ','); }
function f4(x){ return Number(x).toFixed(4).replace('.', ','); }

/* ------------------------------------------------------- Índice de secciones */
const SECCIONES = [
  { t: "Portada",                          d: "Identificación del cuaderno" },
  { t: "Índice",                           d: "Navegación por secciones" },
  { t: "Presentación de la práctica",      d: "Qué se mide y para qué" },
  { t: "Objetivos",                        d: "Metas de la sesión" },
  { t: "Materiales e instrumentos",        d: "El montaje de resorte y masas" },
  { t: "Fundamento físico",                d: "Ley de Hooke y constante elástica" },
  { t: "Montaje experimental",             d: "Fotografías y esquema interactivo" },
  { t: "Procedimiento",                    d: "Los diez pasos de la toma de datos" },
  { t: "Encabezado del informe",           d: "Resumen, nota y grupo de trabajo" },
  { t: "Marco teórico",                    d: "Redacción propia del grupo" },
  { t: "Preinforme · Predicciones",        d: "Cinco cálculos previos" },
  { t: "Resorte 1 · Tablas 1 a 5",         d: "Posiciones y elongaciones" },
  { t: "Resorte 2 · Tablas 6 a 10",        d: "Posiciones y elongaciones" },
  { t: "Tablas 11 y 12 · Fuerza y x̄",      d: "Peso aplicado y alargamiento medio" },
  { t: "Gráficas F frente a x̄",            d: "Ajuste lineal y Tabla 13" },
  { t: "Constantes elásticas",             d: "Comparación de los dos resortes" },
  { t: "Simulador de la ley de Hooke",     d: "Un resorte que se estira en vivo" },
  { t: "Preguntas",                        d: "Cuatro preguntas para justificar" },
  { t: "Conclusiones",                     d: "Tres cierres propios" },
  { t: "Glosario",                         d: "Términos clave de la práctica" },
  { t: "Referencias",                      d: "Fuentes consultadas" }
];

/* ----------------------------------------- Materiales e instrumentos */
const MATERIALES = [
  { n:"Soporte universal con regla", f:"Columna vertical graduada en centímetros sobre la que se cuelga el resorte. La escala es la que se lee para obtener las posiciones inicial y final; su resolución, de un milímetro, fija el número de cifras con que tiene sentido anotar cada medida." },
  { n:"Dos resortes", f:"Son el objeto de estudio. Tienen constantes elásticas distintas, y el contraste entre ambos es precisamente uno de los resultados de la práctica: el más duro se alarga menos con la misma carga." },
  { n:"Cursores deslizantes", f:"Dos índices rojos que se desplazan a lo largo de la regla. El superior se fija en el extremo del resorte sin carga y no vuelve a moverse; el inferior se baja hasta el extremo del resorte ya cargado. La elongación es la distancia entre ambos." },
  { n:"Portamasas con cuatro o cinco masas", f:"Se cuelga del extremo libre del resorte. Su peso, junto con el de las masas que se le van añadiendo, es la fuerza deformadora que estira el resorte." },
  { n:"Balanza", f:"Determina la masa real del portamasas y de cada conjunto de masas. No se da por supuesto el valor nominal grabado en las pesas: se mide, porque de esa masa sale la fuerza." }
];

/* ------------------------------------------------- Procedimiento (guía) */
const PASOS = [
  { t:"Monta el primer resorte",
    d:"Coloca uno de los resortes en el soporte universal, colgado del extremo superior, tal como aparece en la primera fotografía del montaje. Comprueba que cuelgue libre y no roce la regla." },
  { t:"Fija el cursor superior y lee la posición inicial",
    d:"Ubica el <b>cursor superior</b> en el extremo libre del resorte sin carga y mide esa posición en la regla. <b>Regístrala</b> en la columna «Posición inicial x<sub>i</sub>» de la Tabla 1.", clave:true },
  { t:"Mide la masa en la balanza",
    d:"Toma el portamasas con una de las masas, <b>mide su valor en la balanza</b> y anótalo en la casilla <b>m</b> de la Tabla 1. No uses el valor grabado en la pesa: úsalo medido.", clave:true },
  { t:"Cuelga el portamasas",
    d:"Coloca el portamasas en el gancho del resorte, cuidando de que el <b>cursor superior siga en su sitio</b>. El resorte se estira y queda en reposo en una nueva posición." },
  { t:"Baja el cursor inferior",
    d:"Desplaza el <b>cursor inferior</b> hasta el extremo del resorte ya cargado. Espera a que deje de oscilar: la medida se toma con el sistema en equilibrio, no en movimiento." },
  { t:"Lee la posición final",
    d:"Mide en la regla la posición del cursor inferior y <b>anótala</b> en la columna «Posición final x<sub>f</sub>» de la Tabla 1. La elongación, que es la distancia entre los dos cursores, la calcula el cuaderno.", clave:true },
  { t:"Repite con cada integrante del grupo",
    d:"Retira el portamasas y repite la medición hasta completar las <b>tres filas</b> de la Tabla 1. <b>Cada integrante del grupo debe hacer una medición</b>: así las tres lecturas son independientes y el promedio tiene sentido.", clave:true },
  { t:"Añade las masas una a una",
    d:"Coloca, una por una, las masas restantes en el portamasas y repite todo el proceso para completar las <b>Tablas 2, 3, 4 y 5</b>. Cada tabla corresponde a una carga distinta.", clave:true },
  { t:"Cambia de resorte",
    d:"Repite todo el procedimiento con el <b>segundo resorte</b> y completa las <b>Tablas 6 a 10</b>. Conviene usar las mismas masas que con el primero, para que la comparación entre ambos sea limpia.", clave:true },
  { t:"Calcula la fuerza y el promedio",
    d:"Para cada tabla obtén la fuerza F = m·g y el alargamiento promedio x̄ de las tres mediciones, y lleva esos valores a las <b>Tablas 11 y 12</b>. Después grafica F frente a x̄ y obtén la ecuación de cada recta.", clave:true }
];

/* ---------------------------- Partes del montaje (esquema interactivo) */
const PARTES = [
  { id:"sop", n:"Soporte universal",
    d:"La estructura que sostiene todo. Debe quedar firme y perfectamente vertical: si el resorte cuelga inclinado, solo una parte del peso tira de él a lo largo de su eje y el alargamiento medido resulta menor del que corresponde a esa carga." },
  { id:"reg", n:"Regla graduada",
    d:"La escala vertical sobre la que se leen las dos posiciones. Su resolución es de un milímetro, de modo que las lecturas se anotan con una cifra decimal en centímetros. Es la fuente de incertidumbre dominante en esta práctica: el alargamiento es una resta de dos lecturas, y las incertidumbres de ambas se acumulan." },
  { id:"res", n:"Resorte",
    d:"El objeto de estudio. Mientras no se sobrepase su límite elástico, el alargamiento es proporcional a la fuerza aplicada y el resorte recupera su longitud al retirar la carga. Esa proporcionalidad es justamente lo que la práctica pone a prueba." },
  { id:"csu", n:"Cursor superior",
    d:"Índice que se fija en el extremo del resorte sin carga y marca la posición inicial xᵢ. Una vez colocado no debe moverse en toda la serie de medidas de esa tabla: si se desplaza, todas las elongaciones posteriores quedan desplazadas con él." },
  { id:"cin", n:"Cursor inferior",
    d:"Índice que se baja hasta el extremo del resorte ya cargado y marca la posición final x_f. La distancia entre los dos cursores es la elongación. Se coloca con el sistema en reposo, cuando el portamasas ha dejado de oscilar." },
  { id:"por", n:"Portamasas y masas",
    d:"El conjunto que cuelga del resorte. Su peso, F = m·g, es la fuerza deformadora. Importa recordar que el propio portamasas pesa: la masa que se lleva a la tabla es la del conjunto completo, medida en la balanza, no solo la de las pesas añadidas." },
  { id:"elo", n:"Elongación x",
    d:"La diferencia x = x_f − xᵢ entre las dos posiciones. No es la longitud del resorte, sino cuánto se ha estirado respecto de su estado sin carga. Es la variable independiente del experimento y la que se representa en el eje horizontal de la gráfica." },
  { id:"pes", n:"Fuerza deformadora F",
    d:"El peso del conjunto colgado, F = m·g, dirigido verticalmente hacia abajo. Con el sistema en equilibrio, la fuerza recuperadora del resorte tiene la misma magnitud y sentido contrario, de modo que midiendo el peso se conoce la fuerza que ejerce el resorte." }
];

/* ----------------------------------------------- Resumen y marco teórico */
const RESUMEN_MODELO =
  "En esta práctica se verificó experimentalmente la ley de Hooke y se determinó la constante " +
  "elástica de dos resortes. Para cada resorte se colgó un portamasas con cargas crecientes, " +
  "entre 0,050 kg y 0,250 kg, y se midió con una regla graduada la posición del extremo libre " +
  "antes y después de aplicar cada carga, repitiendo la medida tres veces por cada masa, una por " +
  "cada integrante del grupo. La diferencia entre ambas posiciones da la elongación, y el " +
  "promedio de las tres lecturas es el valor que se llevó al análisis. Al representar la fuerza " +
  "deformadora F = m·g frente al alargamiento promedio se obtuvieron, para los dos resortes, " +
  "rectas que pasan por el origen dentro de la incertidumbre experimental, con coeficientes de " +
  "determinación muy próximos a la unidad. Esto confirma que la fuerza y el alargamiento son " +
  "directamente proporcionales mientras no se sobrepase el límite elástico. La pendiente de cada " +
  "recta es la constante elástica del resorte correspondiente: resultaron del orden de 25 N/m " +
  "para el primer resorte y de 15 N/m para el segundo, de modo que el primero es " +
  "aproximadamente el doble de rígido que el segundo y se alarga la mitad bajo la misma carga.";

const MARCO_MODELO =
  "Cuando a un cuerpo elástico se le aplica una fuerza, el cuerpo se deforma; y si la fuerza no " +
  "es excesiva, recupera exactamente su forma original al retirarla. Robert Hooke formuló en el " +
  "siglo XVII la relación que describe ese comportamiento para el caso más sencillo, el de un " +
  "resorte estirado a lo largo de su eje: el alargamiento es directamente proporcional a la " +
  "fuerza aplicada.\n\n" +
  "Escrita como una relación entre la fuerza deformadora y el alargamiento, la ley toma la forma " +
  "F = k·x, donde x es cuánto se ha estirado el resorte respecto de su longitud natural y k es " +
  "una constante característica de ese resorte concreto, llamada constante elástica o constante " +
  "de rigidez. Sus unidades en el Sistema Internacional son newtons por metro: k indica cuántos " +
  "newtons hay que aplicar para conseguir un metro de alargamiento, o, dicho de forma más útil en " +
  "el laboratorio, cuántos newtons por cada centímetro. Un resorte con k grande es duro y se " +
  "estira poco; uno con k pequeña es blando y se estira mucho con la misma carga.\n\n" +
  "Conviene distinguir dos fuerzas que suelen confundirse. La que aparece en F = k·x tal como se " +
  "usa aquí es la fuerza deformadora, la que se aplica desde fuera para estirar el resorte. El " +
  "resorte responde con una fuerza recuperadora de igual magnitud y sentido contrario, que suele " +
  "escribirse F = −k·x; el signo negativo expresa que siempre apunta hacia la posición de " +
  "equilibrio. Con el sistema en reposo las dos se equilibran, y por eso medir el peso colgado " +
  "equivale a medir la fuerza que ejerce el resorte.\n\n" +
  "La ley no vale indefinidamente. Existe un valor de la carga, llamado límite elástico, por " +
  "encima del cual el resorte deja de comportarse de forma proporcional: la gráfica se curva y, " +
  "si se insiste, el resorte queda permanentemente deformado y ya no recupera su longitud " +
  "inicial. Por eso la práctica se hace con masas moderadas y por eso tiene sentido comprobar " +
  "que los puntos experimentales se alinean: si el último punto se saliera de la recta, sería " +
  "señal de haber alcanzado ese límite.\n\n" +
  "El método experimental consiste en invertir la ley. En lugar de usar k para predecir el " +
  "alargamiento, se miden pares de valores de fuerza y alargamiento y se representa F frente a x. " +
  "Si la ley se cumple, los puntos describen una recta que pasa por el origen —un resorte sin " +
  "carga no se alarga— y su pendiente es la constante elástica buscada. Determinar k por el " +
  "ajuste de varios puntos es preferible a calcularlo con una sola medida, porque el ajuste " +
  "promedia los errores de todas ellas y además permite comprobar, con el coeficiente de " +
  "determinación, que la relación es efectivamente lineal.\n\n" +
  "La energía almacenada en el resorte estirado vale E = ½·k·x². No crece de forma proporcional " +
  "al alargamiento sino con su cuadrado, de modo que estirar un resorte el doble exige acumular " +
  "cuatro veces más energía. Esa energía es la que devuelve el resorte al soltarlo, y es la razón " +
  "de que los resortes se empleen para almacenar y restituir trabajo mecánico.";

/* ---------------------------------------------------------- Preguntas */
const PREGUNTAS = [
  { id:"q1",
    texto:"De acuerdo con las gráficas obtenidas, ¿cómo es el comportamiento del alargamiento con respecto al peso que se le suspende al resorte?",
    guia:"Fíjate en si los puntos se alinean y en qué le ocurre al alargamiento cuando la carga se duplica.",
    modelo:"El alargamiento es directamente proporcional al peso suspendido. En las dos gráficas los puntos experimentales se alinean sobre una recta, de modo que al aumentar la carga el resorte se estira en la misma proporción: si el peso se duplica, el alargamiento se duplica; si se triplica, se triplica. Se comprueba directamente en las tablas sin necesidad de graficar. En el primer resorte, una masa de 0,050 kg produjo un alargamiento promedio de unos 1,9 cm, y una masa de 0,250 kg, cinco veces mayor, produjo unos 9,6 cm, es decir, cinco veces más. En el segundo resorte ocurre lo mismo con sus propios valores. Esa proporcionalidad es exactamente lo que afirma la ley de Hooke, F = k·x, y es válida mientras no se sobrepase el límite elástico del resorte. Si alguna de las cargas lo hubiera superado, el último punto se habría separado de la recta hacia alargamientos mayores de los esperados." },
  { id:"q2",
    texto:"¿Las gráficas pasan por el origen? Explique.",
    guia:"Mira el término independiente de cada ecuación y compáralo con la incertidumbre de tus medidas.",
    modelo:"Sí, las dos rectas pasan por el origen dentro de la incertidumbre experimental. Los términos independientes obtenidos en el ajuste son del orden de unas pocas milésimas de newton, muy por debajo de la precisión con la que se conoce cada fuerza, de modo que no se distinguen de cero. Y debe ser así por una razón física, no por casualidad: el punto (0, 0) significa que un resorte sin fuerza aplicada no se alarga, y eso es cierto por definición, porque la elongación se mide precisamente respecto de la posición del resorte descargado. El origen no es un dato experimental más, sino una condición que el montaje impone. Si en algún ajuste apareciera un término independiente apreciable, habría que buscar la causa en el procedimiento y no en la física: lo más probable sería no haber descontado el peso del portamasas, o haber desplazado el cursor superior entre una medida y otra." },
  { id:"q3",
    texto:"¿Qué representan las pendientes de las rectas obtenidas? ¿Cuáles son sus unidades?",
    guia:"Compara la ecuación de tu recta con la expresión de la ley de Hooke, término a término.",
    modelo:"La pendiente de cada recta es la constante elástica k del resorte correspondiente. Se ve comparando la ecuación obtenida, F = m·x, con la ley de Hooke, F = k·x: el coeficiente que multiplica al alargamiento es la constante elástica. Sus unidades son newtons por metro (N/m), que resultan de dividir una fuerza entre una longitud, y tienen un significado directo: cuántos newtons hay que aplicar para conseguir un metro de alargamiento. Una constante grande corresponde a un resorte duro, que se estira poco bajo una carga dada; una constante pequeña, a un resorte blando. Conviene prestar atención a las unidades al calcularla, porque las posiciones se midieron en centímetros y la constante debe expresarse con el alargamiento en metros: si se olvida la conversión, el valor obtenido resulta cien veces menor que el verdadero." },
  { id:"q4",
    texto:"¿Qué puede concluir con respecto a los dos resortes utilizados en esta práctica?",
    guia:"Compara las dos constantes entre sí y relaciona la diferencia con lo que viste al cargarlos.",
    modelo:"Los dos resortes cumplen la ley de Hooke, pero con constantes elásticas claramente distintas. El primero resultó del orden de 25 N/m y el segundo de unos 15 N/m, es decir, el primero es aproximadamente 1,8 veces más rígido que el segundo. La consecuencia práctica se observa directamente en las tablas: bajo la misma carga, el segundo resorte se alarga casi el doble que el primero. Esto confirma que la constante elástica no es una propiedad universal de los resortes, como lo es la aceleración de la gravedad para los cuerpos en caída, sino una característica individual de cada uno, determinada por el material del alambre, su grosor, el diámetro de las espiras y el número de ellas. Lo que ambos comparten es el comportamiento lineal: la recta tiene distinta inclinación en cada caso, pero sigue siendo una recta que parte del origen." }
];

/* -------------------------------------------------------- Conclusiones */
const CONCLUSIONES = [
  { id:"c1",
    guia:"Sobre la ley de Hooke: qué forma tienen los datos y qué modelo los describe.",
    modelo:"Las medidas realizadas con los dos resortes confirman la ley de Hooke: la fuerza deformadora y el alargamiento del resorte son directamente proporcionales. Al representar F frente al alargamiento promedio, los puntos experimentales de ambos resortes se alinean sobre rectas con coeficientes de determinación muy próximos a la unidad, y los términos independientes resultan indistinguibles de cero, como corresponde a un resorte que no se alarga cuando no se le aplica fuerza. La relación se mantuvo en todo el intervalo de cargas empleado, entre 0,050 kg y 0,250 kg, lo que indica que en ningún momento se sobrepasó el límite elástico de los resortes." },
  { id:"c2",
    guia:"Sobre las constantes elásticas obtenidas y lo que significa la diferencia entre ellas.",
    modelo:"La pendiente de cada recta proporcionó la constante elástica del resorte correspondiente, en newtons por metro. Los valores obtenidos fueron del orden de 25 N/m para el primer resorte y de 15 N/m para el segundo, de modo que el primero es aproximadamente 1,8 veces más rígido. Esa diferencia se traduce directamente en el comportamiento observado durante la práctica: con la misma masa colgada, el segundo resorte se alargó casi el doble que el primero. La constante elástica es, por tanto, una propiedad individual de cada resorte, que depende de su construcción, y el método gráfico permite determinarla sin más instrumentos que una regla y una balanza." },
  { id:"c3",
    guia:"Sobre el método y las fuentes de error: qué cuidados exigió la medida y qué podría mejorarse.",
    modelo:"El método resultó fiable, pero exige cuidados que determinan la calidad del resultado. La elongación se obtiene como diferencia de dos lecturas de la regla, de manera que la incertidumbre de ambas se acumula; por eso se repitió tres veces cada medida, una por integrante, y se trabajó con el promedio. Las fuentes de error más probables son el desplazamiento involuntario del cursor superior entre medidas, la lectura en paralaje sobre la escala, la posible falta de verticalidad del montaje y el hecho de tomar la medida antes de que el portamasas dejara de oscilar. Para mejorar el resultado convendría ampliar el intervalo de cargas, de modo que los puntos cubran un tramo mayor de la recta, y verificar al final que el resorte recupera su longitud inicial, lo que confirmaría que no se superó el límite elástico." }
];

/* ------------------------------------------------------------- Glosario */
const GLOSARIO = [
  { t:"Ley de Hooke", d:"Enuncia que, dentro del límite elástico, la deformación de un cuerpo elástico es directamente proporcional a la fuerza que la produce: F = k·x.", f:"" },
  { t:"Resorte", d:"Alambre arrollado en espiral que se deforma bajo una fuerza y recupera su forma al retirarla. Su comportamiento elástico es el objeto de esta práctica.", f:"" },
  { t:"Constante elástica (k)", d:"Característica de cada resorte: la fuerza necesaria por unidad de alargamiento. Se mide en newtons por metro (N/m) y es la pendiente de la recta F frente a x.", f:"" },
  { t:"Elongación (x)", d:"Cuánto se ha estirado el resorte respecto de su longitud sin carga: la distancia entre las dos posiciones leídas, x = |x_f − x_i|. No es la longitud del resorte, sino su incremento.", f:"" },
  { t:"Posición inicial (x_i)", d:"Lectura en la regla del extremo libre del resorte sin carga, señalada con el cursor superior.", f:"" },
  { t:"Posición final (x_f)", d:"Lectura en la regla del extremo del resorte ya cargado, señalada con el cursor inferior y con el sistema en reposo. En la regla del montaje los números decrecen hacia abajo, de modo que esta lectura resulta menor que la inicial.", f:"" },
  { t:"Fuerza deformadora", d:"La que se aplica desde fuera para estirar el resorte. En esta práctica es el peso del conjunto colgado: F = m·g.", f:"" },
  { t:"Fuerza recuperadora", d:"La que ejerce el resorte estirado, de igual magnitud y sentido contrario a la deformadora: F = −k·x. El signo indica que apunta hacia la posición de equilibrio.", f:"" },
  { t:"Peso", d:"Fuerza con que la Tierra atrae a un cuerpo, F = m·g. Se mide en newtons, a diferencia de la masa, que se mide en kilogramos.", f:"" },
  { t:"Masa", d:"Cantidad de materia de un cuerpo, medida en kilogramos con la balanza. No depende del lugar, a diferencia del peso.", f:"" },
  { t:"Límite elástico", d:"Valor de la fuerza por encima del cual el cuerpo deja de comportarse de forma proporcional y queda permanentemente deformado. La ley de Hooke solo vale por debajo de él.", f:"" },
  { t:"Deformación elástica", d:"La que desaparece al retirar la fuerza: el cuerpo recupera exactamente su forma original.", f:"" },
  { t:"Deformación plástica", d:"La que permanece después de retirar la fuerza. Aparece al superar el límite elástico.", f:"" },
  { t:"Energía potencial elástica", d:"Energía almacenada en un resorte deformado: E = ½·k·x². Crece con el cuadrado del alargamiento, no de forma proporcional.", f:"" },
  { t:"Equilibrio", d:"Estado en que la suma de las fuerzas sobre el cuerpo es nula. Con el portamasas en reposo, el peso y la fuerza recuperadora se compensan, y por eso medir uno equivale a medir la otra.", f:"" },
  { t:"Promedio", d:"Media aritmética de las mediciones repetidas de una misma magnitud. Reduce el efecto de los errores aleatorios de lectura.", f:"" },
  { t:"Ajuste por mínimos cuadrados", d:"Procedimiento que busca la recta que pasa lo más cerca posible de un conjunto de puntos, haciendo mínima la suma de los cuadrados de las separaciones.", f:"" },
  { t:"Pendiente", d:"Inclinación de una recta: cuánto cambia la variable del eje vertical por cada unidad de la horizontal. Aquí, la constante elástica.", f:"" },
  { t:"Coeficiente de determinación (R²)", d:"Número entre 0 y 1 que indica qué fracción de la variación de los datos explica la recta ajustada. Cuanto más próximo a 1, mejor describe el modelo a los datos.", f:"" },
  { t:"Resolución", d:"Menor variación de la magnitud medida que produce un cambio perceptible en la indicación del instrumento. La regla del montaje resuelve un milímetro.", f:"VIM 4.14" }
];

/* ----------------------------------------------------------- Referencias */
const REFERENCIAS = [
  "Serway, R. A., & Jewett, J. W. (2019). <i>Física para ciencias e ingeniería con física moderna</i> (10.ª ed., Vol. 1). Cengage Learning. Capítulo 7: Energía de un sistema — la fuerza de un resorte y la ley de Hooke.",
  "Young, H. D., & Freedman, R. A. (2018). <i>Sears y Zemansky. Física universitaria con física moderna</i> (14.ª ed., Vol. 1). Pearson. Capítulo 6: Trabajo y energía cinética; capítulo 11: Elasticidad.",
  "Tipler, P. A., & Mosca, G. (2010). <i>Física para la ciencia y la tecnología</i> (6.ª ed., Vol. 1). Reverté.",
  "Taylor, J. R. (2014). <i>Introducción al análisis de errores. El estudio de las incertidumbres en las mediciones físicas</i> (2.ª ed.). Reverté.",
  "Bureau International des Poids et Mesures. (2012). <i>Vocabulario Internacional de Metrología (VIM)</i> (3.ª ed.). JCGM 200:2012.",
  "Departamento de Física, Universidad Tecnológica de Pereira. <i>Informe. Verificación experimental de la ley de Hooke</i>. Laboratorio de Física I, Facultad de Ciencias Básicas."
];
