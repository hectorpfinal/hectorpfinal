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

/** @type {HTMLUListElement} */
const lista = document.
  querySelector("#lista");
const daoAlumno =
  getFirestore().
    collection("Alumno");

getAuth().
  onAuthStateChanged(
    protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    consulta();
  }
}

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
      forma.matricula.value = data.matricula;
      forma.nombre.value = data.nombre || "";
      forma.telefono.value = data.telefono || "";
      forma.grupo.value = data.grupo || "";
      forma.fecha.value = data.fecha || "";
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
    const matricula = getString(
        formData, "matricula").trim();  
    const nombre = getString(formData, "nombre").trim();
    const telefono = getString(formData, "telefono").trim();
    const grupo = getString(formData, "grupo").trim();
    const fecha = getString(formData, "fecha").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      matricula, 
      nombre,
      telefono,
      grupo,
      fecha
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

