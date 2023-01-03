import tableStyles from './style.scss?inline'

import templateContent from './template.html?raw'

import { RowComponent, TabulatorFull as Tabulator } from 'tabulator-tables';

type OnRowClickInstructions = string | ((event: UIEvent, row: RowComponent) => void)

const ATTRIBUTES: string[] = [
  "base-url",
  "onrowclick"
];

export class TypidKnownPidsTable extends HTMLElement {

  shadowRoot: ShadowRoot;
  private table: Tabulator | null = null;
  
  // --- Attributes accessible from the HTML tag:
  baseUrl: URL = new URL("http://localhost:8090")
  _onRowClick: OnRowClickInstructions = (_event, row) => {
    window.open(
      'https://kit-data-manager.github.io/fairdoscope/?pid=' + row.getData().pid,
      '_blank'
    )
  }

  set onRowClick(newValue: OnRowClickInstructions) {
    this._onRowClick = newValue;
    if (this.table != null) {
      this.table.on("rowClick", this.rowEventHandler);
    }
  }
  
  rowEventHandler = (event: UIEvent, row: RowComponent) => {
    if (typeof this._onRowClick == 'string') {
      eval(this._onRowClick)
    } else if (typeof this._onRowClick == 'function') {
      this._onRowClick(event, row)
    }
  }

  /**
   * Contruct element properties etc, without DOM access.
   * 
   * "an element's attributes are unavailable until connected to the DOM"
   * So you may write to, but not read from it.
   * 
   * Sources: 
   * - https://andyogo.github.io/custom-element-reactions-diagram/
   * - https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks
   */
  constructor() {
    super();
    // Create Shadow DOM
    this.shadowRoot = this.attachShadow({ mode: 'open' })
    // Apply HTML Template to shadow DOM
    const template = document.createElement('template')
    template.innerHTML = templateContent
    this.shadowRoot.append(template.content.cloneNode(true))
  }

  /**
   * Which attributes to notice change for.
   * 
   * For all returned attributes, attributeChangedCallback might be called
   * due to add/remove/change events.
   */
  static get observedAttributes() {
    return ATTRIBUTES;
  }

  /**
   * Initialize your component.
   * 
   * Invoked each time the custom element is appended into a document-connected element.
   * This will happen each time the node is moved, and may happen before the element's
   * contents have been fully parsed.
   * 
   * Note: connectedCallback may be called once your element is no longer connected,
   * use Node.isConnected to make sure.
   * 
   * Source: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks
   */
  connectedCallback(): void {
    if (!this.isConnected) {
      // Might be called after disconnected. Handle this here.
      return;
    }
    let baseUrl = this.getAttribute(ATTRIBUTES[0])
    if (baseUrl != null) {
      this.baseUrl = new URL(baseUrl)
    }

    let tableHolder = this.shadowRoot.getElementById("typed-pid-maker-known-pids-table")
    if (tableHolder != null) {
      let styleTag = document.createElement("style")
      styleTag.textContent = tableStyles
      this.shadowRoot.appendChild(styleTag)
      
      this.table = new Tabulator(tableHolder, {
        height: "auto", // Set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        layout: "fitColumns", // Fit columns to width of table (optional)
        columns: [ // Define Table Columns format
          { title: "PID", field: "pid", width: 150 },
          { title: "Date Created", field: "created", hozAlign: "center", formatter: "plaintext" },
          { title: "Date Modified", field: "modified", hozAlign: "center", formatter: 'plaintext' },
        ],
        index: "pid",
        pagination: true,
        paginationMode: "remote",
        ajaxURL: this.baseUrl.toString() + "api/v1/pit/known-pid",
        ajaxConfig: {
          method: "GET",
          headers: {
            "Accept": "application/tabulator+json; charset=utf-8"
          }
        },
        //ajaxParams:{}, //set any standard parameters to pass with the request
        //paginationSize: 5, //optional parameter to request a certain number of rows per page
        paginationSizeSelector: true
      });
      //trigger an alert message when the row is clicked
      this.table.on("rowClick", this.rowEventHandler);
    } else {
      console.error("Could not find the tag which should hold the table.");
    }
  }

  /**
   * Invoked each time the custom element is disconnected from the document's DOM.
   */
  disconnectedCallback(): void {
    return;
  }

  /**
   * Invoked each time the custom element is moved to a new document.
   */
  adoptedCallback() {
    return;
  }

  /**
   * Invoked each time one of the custom element's attributes is added, removed, or changed.
   * Which attributes to notice change for is specified in a static get observedAttributes method.
   * 
   * @param name attributes name
   * @param oldValue attributes value before the change
   * @param newValue attributes value after the change
   */
  attributeChangedCallback(name: string, _oldValue: any, newValue: any) {
    if (name == ATTRIBUTES[0]) {
      this.baseUrl = newValue;
      this.connectedCallback();
    } else if (name == ATTRIBUTES[1]) {
      this.onRowClick = newValue; // uses setter
    }
  }
}

// Custom Elements:
// If you inherit e.g. from HTMLUListElement instead of HTMLElement,
// you need to write some additional boilerplate here (see commented code).
// Also, the HTML will work different, then. Example:
// <ul is="my-list"></ul>
window.customElements.define('typid-known-pids-table', TypidKnownPidsTable, /* { extends: "ul" } */);
