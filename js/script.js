  // Mostrar coluna direita só no desktop
  function checkHeroRight() {
    const el = document.getElementById('heroRight');
    if (el) {
      el.style.display = window.innerWidth >= 768 ? 'flex' : 'none';
    }
  }
  checkHeroRight();
  window.addEventListener('resize', checkHeroRight);

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }


// ── MODAL PRIVACIDADE ─────────────────────────────────────────
function abrirPrivacidade(e) {
    e.preventDefault();
    document.getElementById("modalPrivacidade").style.display = "flex";
    document.body.style.overflow = "hidden";
}
function fecharPrivacidade() {
    document.getElementById("modalPrivacidade").style.display = "none";
    document.body.style.overflow = "";
}
// Fechar clicando fora do modal
document.getElementById("modalPrivacidade").addEventListener("click", function(e) {
    if (e.target === this) fecharPrivacidade();
});
// Fechar com ESC
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") fecharPrivacidade();
});


// ── EVENT LISTENERS (substituindo inline handlers) ────────────

// Menu mobile — fechar ao clicar nos links
document.querySelectorAll('[data-action="close-menu"]').forEach(el => {
    el.addEventListener('click', closeMenu);
});

// FAQ — accordion
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const toggle = this.getAttribute('data-toggle');
            const answer = document.getElementById(toggle);
            const isOpen = answer.style.display !== 'none';
            
            // Fechar todos
            document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
            document.querySelectorAll('.faq-question').forEach(b => b.classList.remove('open'));
            
            // Abrir o clicado
            if (!isOpen) {
                answer.style.display = 'block';
                this.classList.add('open');
            }
        });
    });
});

// Formulário pedido — submit
const formPedido = document.getElementById('bPedidoForm');
if (formPedido) {
    formPedido.addEventListener('submit', enviarBischofWhatsApp);
}

// Política de privacidade — abrir
const linkPrivacidade = document.getElementById('linkPrivacidade');
if (linkPrivacidade) {
    linkPrivacidade.addEventListener('click', abrirPrivacidade);
}

// Política de privacidade — fechar
const btnFecharPrivacidade = document.getElementById('btnFecharPrivacidade');
if (btnFecharPrivacidade) {
    btnFecharPrivacidade.addEventListener('click', fecharPrivacidade);
}

// ============================================
// CATÁLOGO MODAL
// ============================================

function openCatalogModal() {
  document.getElementById('catalogModal').classList.add('active');
}

function closeCatalogModal() {
  document.getElementById('catalogModal').classList.remove('active');
}

function closeCatalogModalOnBackground(event) {
  if (event.target.id === 'catalogModal') {
    closeCatalogModal();
  }
}

// Fechar modal com Esc
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeCatalogModal();
  }
});
