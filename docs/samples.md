const container = new ExtContainer({
  renderTo: document.body,
  layout: 'hbox',
  items: [button1, button2],
});

container.el.setAttribute('align', 'center');
container.el.setAttribute('justify', 'space-between');
button1.el.classList.add('ext-grow');
