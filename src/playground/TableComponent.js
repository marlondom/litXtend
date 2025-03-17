import { html, render } from 'lit-html';
import { store } from './store.js';

class TableComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = [];
    this.renderTable = this.renderTable.bind(this);
  }

  connectedCallback() {
    // Inscreve-se no store para receber atualizações
    store.subscribe(this.renderTable);
    // Carrega os dados (você pode passar o URL ao store aqui)
    store.loadData('/mock/api/users');
  }

  renderTable(data) {
    this.data = data || [];
    this.update();
  }

  update() {
    const tableTemplate = html`
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f4f4f4;
          text-align: left;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map(
            item => html`
              <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>${item.email}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
    render(tableTemplate, this.shadowRoot);
  }
}

customElements.define('table-component', TableComponent);
