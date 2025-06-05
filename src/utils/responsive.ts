// src/utils/responsive.ts

/**
 * Adiciona a classe 'is-mobile' ao body quando a largura da tela está <= 600px.
 */
export function setupResponsiveClass() {
  function update() {
    const isMobile = window.innerWidth <= 600;
    document.body.classList.toggle('is-mobile', isMobile);
  }

  // Inicializa e atualiza em resize
  update();
  window.addEventListener('resize', update);
}
