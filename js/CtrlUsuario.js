import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  eliminaStorage,
  urlStorage
} from "../lib/storage.js";
import {
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
      forma.matricula.value = data.matricula;  
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
  await guardaUsuario(evt,
    new FormData(forma), id);
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

async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const matricula = getString(formData, "matricula").trim();  
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      matricula
    };
    await daoAlumno.
      doc(id).
      set(modelo);
    muestraAlumnos();
  } catch (e) {
    muestraError(e);
  }
}