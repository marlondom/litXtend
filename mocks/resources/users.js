export const loadRoutes = (mockRouter) => {
  mockRouter.get('/api/users', async function (req, res) {
    const lines = [
      {id:'1', name: 'João Maria', age: '46', email: 'joao.maria@neoway.com.br'},
      {id:'2', name: 'Maria José', age: '52', email: 'maria.jose@neoway.com.br'},
      {id:'3', name: 'José da Silva', age: '19', email: 'jose.silva@neoway.com.br'},
      {id:'4', name: 'Silva Pam', age: '27', email: 'silva.pam@neoway.com.br'},
      {id:'5', name: 'Pam Pom', age: '38', email: 'pam.pom@neoway.com.br'},
      {id:'6', name: 'Kaka', age: '99', email: 'kaka@neoway.com.br'},
      {id:'7', name: 'Neimar', age: '12', email: 'neimar@neoway.com.br'},
      {id:'8', name: 'Romário', age: '16', email: 'romário@neoway.com.br'},
      {id:'9', name: 'Ronaldinho', age: '43', email: 'ronaldinho@neoway.com.br'},
      {id:'10', name: 'Robinho', age: '51', email: 'robinho@neoway.com.br'}
    ];
    res.status(200).json({ data: lines});
  });
};