class MiFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<p>
        &copy; 2021
        Hector Alvarez Espinosa.
      </p>`;
  }
}

customElements.define("mi-footer", MiFooter);
