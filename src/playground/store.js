class Store {
    constructor() {
      this.data = []; // Armazena os dados
      this.observers = []; // Funções que serão notificadas sobre atualizações
    }
  
    async loadData(url) {
      const response = await fetch(url);
      const json = await response.json();
      this.data = json.data; // Exemplo: espera que os dados estejam na propriedade "data"
      this.notify();
    }
  
    subscribe(callback) {
      this.observers.push(callback);
    }
  
    notify() {
      this.observers.forEach(callback => callback(this.data));
    }
  
    getData() {
      return this.data;
    }
  }
  
  export const store = new Store();
  