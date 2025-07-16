const form = document.getElementById("debt-form");
const lista = document.getElementById("deuda-lista");

let deudas = JSON.parse(localStorage.getItem("deudas")) || [];

function guardarDeudas() {
  localStorage.setItem("deudas", JSON.stringify(deudas));
}

function generarCuotas(fechaInicial, cantidad, frecuencia) {
  const cuotas = [];
  let fecha = new Date(fechaInicial);

  for (let i = 0; i < cantidad; i++) {
    cuotas.push({
      fecha: fecha.toISOString().split("T")[0], // yyyy-mm-dd
      pagado: false,
    });

    switch (frecuencia) {
      case "mensual":
        fecha.setMonth(fecha.getMonth() + 1);
        break;
      case "semestral":
        fecha.setMonth(fecha.getMonth() + 6);
        break;
      case "anual":
        fecha.setFullYear(fecha.getFullYear() + 1);
        break;
    }
  }
  return cuotas;
}

function renderizarDeudas() {
  lista.innerHTML = "";
  deudas.forEach((deuda, deudaIndex) => {
    const li = document.createElement("li");
    li.className = "deuda-item";
    
    const cuotasPagadas = deuda.cuotas.filter(c => c.pagado).length;

    // Botón para expandir/cerrar
    li.innerHTML = `
    <div class="deuda-header">
      <strong>${deuda.nombre}</strong> - ${cuotasPagadas}/${deuda.cuotas.length} cuotas pagadas
      <span class="toggle-arrow" onclick="toggleCuotas(${deudaIndex}, event)">▶</span>
    </div>
    <div class="cuotas-lista" id="cuotas-${deudaIndex}" style="display: none;"></div>
    <button onclick="eliminarDeuda(${deudaIndex})">Eliminar deuda</button>
    `;

    lista.appendChild(li);

    const contenedorCuotas = document.getElementById(`cuotas-${deudaIndex}`);
    deuda.cuotas.forEach((cuota, cuotaIndex) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <input type="checkbox" id="cuota-${deudaIndex}-${cuotaIndex}" ${cuota.pagado ? "checked" : ""}>
        <label for="cuota-${deudaIndex}-${cuotaIndex}">${cuota.fecha}</label>
      `;

      const checkbox = div.querySelector("input");
      checkbox.addEventListener("change", () => {
        deuda.cuotas[cuotaIndex].pagado = checkbox.checked;
        guardarDeudas();
        renderizarDeudas();
      });

      contenedorCuotas.appendChild(div);
    });
  });
}

// Función para mostrar/ocultar cuotas
function toggleCuotas(index, event) {
  event.stopPropagation(); // evita que otros clics interfieran
  const contenedor = document.getElementById(`cuotas-${index}`);
  contenedor.style.display = (contenedor.style.display === "none") ? "block" : "none";
}

function eliminarDeuda(index) {
  if (confirm("¿Eliminar esta deuda?")) {
    deudas.splice(index, 1);
    guardarDeudas();
    renderizarDeudas();
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const monto = document.getElementById("monto").value;
  const fecha = document.getElementById("fecha").value;
  const cantidadCuotas = parseInt(document.getElementById("cuotas").value);
  const frecuencia = document.getElementById("frecuencia").value;

  const cuotas = generarCuotas(fecha, cantidadCuotas, frecuencia);

  deudas.push({
    nombre,
    monto,
    cuotas,
  });

  guardarDeudas();
  renderizarDeudas();
  form.reset();
});

renderizarDeudas();