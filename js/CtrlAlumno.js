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
    collection("Alumno");
const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
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
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc =
      await daoAlumno.
        doc(id).
        get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Alumno} */
      const data = doc.data();
      forma.nombre.value = data.nombre || "";
      forma.apellido.value = data.apellido || "";
      forma.curp.value = data.curp || "";
      forma.telefono.value = data.telefono || "";
      forma.fechayhora.value = data.fechayhora || "";
      forma.doctor.value = data.doctor || "";
      forma.motivo.value = data.motivo || "";
      forma.correo.value = data.correo || "";
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraAlumnos();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
      const nombre = getString(formData, "nombre").trim();
      const apellido = getString(formData, "apellido").trim();
      const curp = getString(formData, "curp").trim();
      const telefono = getString(formData, "telefono").trim();
      const fechayhora = getString(formData, "fechayhora").trim();
      const doctor = getString(formData, "doctor").trim();
      const motivo = getString(formData, "motivo").trim();
      const correo = getString(formData, "correo").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      nombre,
      apellido, 
      curp,
      telefono,
      fechayhora,
      doctor, 
      motivo,
      correo
    };
    await daoAlumno.
      doc(id).
      set(modelo);
    muestraAlumnos();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoAlumno.
        doc(id).
        delete();
      muestraAlumnos();
    }
  } catch (e) {
    muestraError(e);
  }
}

/**
 * @param {Event} evt
 * @param {FormData} formData

/*export async function
 guardaUsuario(evt, formData,
   id) {
 try {
   evt.preventDefault();
   const alumnoId =
     getForánea(formData,
       "alumnoId");
   const rolIds =
     formData.getAll("rolIds");
   await daoAlumno.
     doc(id).
     set({
       alumnoId,
       rolIds
     });
   const avatar =
     formData.get("avatar");
   await subeStorage(id, avatar);
   muestraAlumnos();
 } catch (e) {
   muestraError(e);
 }
}*/

