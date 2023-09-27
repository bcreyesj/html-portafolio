let gastos = [];
let saldoInicial = 0;
let ahorro = 0;

// Cargar datos desde localStorage al cargar la página
cargarDatosDesdeLocalStorage();

function cargarDatosDesdeLocalStorage() {
    const saldoInicialGuardado = localStorage.getItem('saldoInicial');
    if (saldoInicialGuardado) {
        saldoInicial = parseFloat(saldoInicialGuardado);
        document.getElementById('saldoInicial').value = saldoInicial;
    }

    const gastosGuardados = localStorage.getItem('gastos');
    if (gastosGuardados) {
        gastos = JSON.parse(gastosGuardados);
        mostrarGastos();
        actualizarGrafico();
    }
}

function actualizarSaldo() {
    const nuevoSaldo = parseFloat(document.getElementById('saldoInicial').value);

    if (isNaN(nuevoSaldo) || nuevoSaldo < 0) {
        alert('Ingrese un saldo válido.');
        return;
    }

    saldoInicial = nuevoSaldo;
    actualizarGrafico();
    // Guardar el saldo en localStorage
    localStorage.setItem('saldoInicial', saldoInicial);
}

function registrarGasto() {
    const categoria = document.getElementById('categoria').value;
    const gasto = parseFloat(document.getElementById('gasto').value);

    if (isNaN(gasto) || gasto <= 0) {
        alert('Ingrese un gasto válido.');
        return;
    }

    saldoInicial -= gasto;
    actualizarGrafico();

    const gastoObj = { categoria, gasto };
    gastos.push(gastoObj);

    // Guardar los gastos en localStorage
    localStorage.setItem('gastos', JSON.stringify(gastos));
    actualizarGrafico();
    mostrarGastos();
}

function mostrarGastos() {
const listaGastosFormulario = document.getElementById('listaGastosFormulario');
listaGastosFormulario.innerHTML = '';  // Limpiar la lista

gastos.forEach(gasto => {
    const listItem = document.createElement('li');
    listItem.textContent = `Categoría: ${gasto.categoria}, Gasto: $${gasto.gasto.toFixed(2)}`;
    listaGastosFormulario.appendChild(listItem);
});
}


function ahorrar() {
    const cantidadAhorro = parseFloat(document.getElementById('ahorro').value);

    if (isNaN(cantidadAhorro) || cantidadAhorro <= 0) {
        alert('Ingrese una cantidad de ahorro válida.');
        return;
    }

    saldoInicial -= cantidadAhorro;
    ahorro += cantidadAhorro;
    actualizarGrafico();
}
function actualizarGrafico() {
// Colores para los segmentos: amarillo, azul, rojo, verde
const colores = ["#C6BC82", "#007BFF", "#FF0000", "#008000", "#FFD700"];

// Agrupar gastos por categoría y calcular el total para cada categoría
const categoriasGastos = gastos.reduce((categorias, gasto) => {
    const categoria = gasto.categoria;
    const monto = gasto.gasto;

    if (categorias[categoria]) {
        categorias[categoria] += monto;
    } else {
        categorias[categoria] = monto;
    }

    return categorias;
}, {});

// Convertir el objeto en un array de dataPoints para la gráfica
const dataPoints = Object.keys(categoriasGastos).map((categoria, index) => ({
    y: categoriasGastos[categoria],
    label: categoria,
    color: colores[index % colores.length]
}));

// Agregar el saldo restante y los ahorros como dataPoints adicionales
dataPoints.push({ y: saldoInicial, label: "Saldo Restante", color: colores[colores.length - 1] });
dataPoints.push({ y: ahorro, label: "Ahorro", color: "#0E420E" });

// Crear un objeto de gráfico (instancia de CanvasJS.Chart) en el contenedor con ID "chartContainer"
const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,  // Habilita la animación del gráfico
    title: {
        text: "Resumen de Gastos y Ahorro"  // Establece el texto del título del gráfico
    },
    data: [{
        type: "pie",  // Tipo de gráfico: pastel
        startAngle: 240,  // Ángulo inicial de la gráfica (en grados)
        yValueFormatString: "##0.00 'MXN'",  // Formato para los valores de la gráfica
        indexLabel: "{label} {y}",  // Etiqueta para cada segmento (categoría y valor)
        dataPoints: dataPoints
    }]
});

// Renderizar el gráfico en el contenedor especificado
chart.render();
}
