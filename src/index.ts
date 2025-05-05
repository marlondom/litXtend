import { html } from 'lit-html';
import XTemplate from './tpl/XTemplate.js';

const myTpl = new XTemplate((data: { name: string; items: string[] }) => html`
  <div>
    <h2>Hello, ${data.name}</h2>
    <ul>
      ${data.items.map(item => html`<li>${item}</li>`)}
    </ul>
  </div>
`);

const data = {
  name: 'Kai',
  items: ['Magic', 'Adventure', 'Friendship']
};

// Ensure the container is not null before calling overwrite
const container = document.getElementById('app');
if (container) {
  myTpl.overwrite(container, data);
} else {
  console.error('Container with id "app" not found.');
}
