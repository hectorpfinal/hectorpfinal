import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraAlumnos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoAlumno =
  getFirestore().
    collection("Paciente");
/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    forma.addEventListener(
      "submit", guarda);
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const nombre = getString(formData, "nombre").trim();
    const apellido = getString(formData, "apellidos").trim();
    const curp = getString(formData, "curp").trim();
    const telefono = getString(formData, "telefono").trim();
    const fechayhora = getString(formData, "fechayhora").trim();
    const doctor = getString(formData, "doctor").trim();
    const motivo = getString(formData, "motivo").trim();
    /**
     * @type {
        import("./tipos.js").
                Paciente} */
    const modelo = {
      nombre,
      apellido,
      curp,
      telefono,
      fechayhora,
      doctor,
      motivo
    };
    await daoPaciente.
      add(modelo);
    muestraAlumnos();
  } catch (e) {
    muestraError(e);
  }
}

