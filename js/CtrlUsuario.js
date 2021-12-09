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

/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
    function htmlFila(doc) {
      /**
       * @type {import("./tipos.js").
                      Alumno} */
      const data = doc.data();
      const matricula = cod(data.matricula);
      const nombre = cod(data.nombre);
      var fsf= cod(data.fecha);
      var fecha = new Date(fsf);
      var espacio="[   -   ]";
      var dformat = [fecha.getDate()+1, fecha.getMonth()+1, fecha.getFullYear()].join('/');
      const parámetros =
        new URLSearchParams();
      parámetros.append("id", doc.id);
      return ( /* html */
        `<li>
          <a class="fila" href=
      "alumno.html?${parámetros}">
            <strong class="primario">
              ${matricula} ${nombre} ${dformat}
            </strong>
          </a>
         
        </li>`);
    }
    
    /** @param {Error} e */
    function errConsulta(e) {
      muestraError(e);
      consulta();
    }
    