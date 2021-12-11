import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  eliminaStorage,
  urlStorage
} from "../lib/storage.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraUsuarios
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  checksRoles,
  guardaUsuario,
  selectAlumnos
} from "./usuarios.js";

const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
const daoUsuario = getFirestore().
  collection("Usuario");
/** @type {HTMLFormElement} */
const forma = document["forma"];
const img = document.
  querySelector("img");
/** @type {HTMLUListElement} */
const listaRoles = document.
  querySelector("#listaRoles");
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

async function busca() {
  try {
    const doc = await daoUsuario.
      doc(id).
      get();
    if (doc.exists) {
      const data = doc.data();
      forma.cue.value = id || "";
      forma.nombre.value = data.nombre || "";
      forma.apelllido.value = data.apellido || "";
      forma.curp.value = data.curp || "";
      forma.telefono.value = data.telefono || "";
      forma.fechayhora.value = data.fechayhora || "";
      forma.doctor.value = data.doctor || "";
      forma.motivo.value = data.motivo || "";
      forma.correo.value = data.correo || "";
      img.src =
        await urlStorage(id);
      selectAlumnos(
        forma.alumnoId,
        data.alummnoId)
      checksRoles(
        listaRoles, data.rolIds);
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    }
  } catch (e) {
    muestraError(e);
    muestraUsuarios();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  await guardaUsuario(evt, new FormData(forma), id);
    try {
      evt.preventDefault();
      const formData = new FormData(forma);
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
      await daoUsuario.
        doc(id).
        set(modelo);
      muestraUsuarios();
    } catch (e) {
      muestraError(e);
    }
  }




async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoUsuario.
        doc(id).delete();
      await eliminaStorage(id);
      muestraUsuarios();
    }
  } catch (e) {
    muestraError(e);
  }
}

