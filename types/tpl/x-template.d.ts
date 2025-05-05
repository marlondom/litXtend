// src/types/x-template.d.ts
declare module 'XTemplate' {
    export default class XTemplate {
      constructor(template: string, config?: any);
      render(data: any): string;
      // 🔧 Aqui você pode refinar os tipos conforme for usando a classe
    }
  }
  