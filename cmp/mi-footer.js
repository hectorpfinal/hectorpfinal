class MiFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<p>
        &copy; 2021
        Proyecto Hospital - Hector Alvarez Espinosa.
      </p>`;
  }
}

customElements.define("mi-footer", MiFooter);
