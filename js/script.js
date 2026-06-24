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
// ── FORMULÁRIO BISCHOF → WHATSAPP ────────────────────────────
function enviarBischofWhatsApp(e) {
    e.preventDefault();

    const nome    = document.getElementById('b-nome').value.trim();
    const wapp    = document.getElementById('b-whatsapp').value.trim();
    const cpfCnpjTipo = document.getElementById('b-cpf-cnpj-tipo').value;
    const cpfCnpj = document.getElementById('b-cpf-cnpj').value.trim();
    const cidade  = document.getElementById('b-cidade').value.trim();
    const tipo    = document.getElementById('b-tipo').value;
    const volume  = document.getElementById('b-volume').value;
    const obs     = document.getElementById('b-mensagem').value.trim();

    const texto = `Olá! Vim pelo site da *Bischof Distribuidora* e gostaria de receber a tabela de preços. 😊

*📋 Dados do pedido:*
• *Nome/Empresa:* ${nome}
• *WhatsApp:* ${wapp}
• *${cpfCnpjTipo}:* ${cpfCnpj}
• *Cidade:* ${cidade}
• *Tipo de negócio:* ${tipo}${volume ? `
• *Volume estimado:* ${volume}` : ''}${obs ? `
• *Observações:* ${obs}` : ''}

Aguardo o contato!`;

    const url = `https://wa.me/5547999743400?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
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

// ── VALIDAÇÃO E FEEDBACK DO FORMULÁRIO ──────────────────────
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bPedidoForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Validação em tempo real
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validarCampo(this);
            }
        });
    });
    
    // Validar CPF/CNPJ apenas números
    const cpfCnpjInput = document.getElementById('b-cpf-cnpj');
    if (cpfCnpjInput) {
        cpfCnpjInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
});

function validarCampo(field) {
    const valor = field.value.trim();
    
    if (field.hasAttribute('required') && !valor) {
        field.classList.add('error');
        field.classList.remove('valid');
        return false;
    }
    
    // Validações específicas
    if (field.type === 'tel' && valor) {
        const televalid = /^\d{10,11}$/.test(valor.replace(/\D/g, ''));
        if (!televalid) {
            field.classList.add('error');
            field.classList.remove('valid');
            return false;
        }
    }
    
    // Se passou, marcar como válido
    field.classList.remove('error');
    field.classList.add('valid');
    return true;
}

// ── FEEDBACK VISUAL NO ENVIO ────────────────────────────────
document.addEventListener('submit', function(e) {
    if (e.target.id === 'bPedidoForm') {
        const botao = e.target.querySelector('button[type="submit"]');
        if (botao) {
            botao.classList.add('loading');
            botao.disabled = true;
        }
        
        // Mostrar mensagem de sucesso após redirecionamento
        setTimeout(() => {
            const msgSucesso = document.querySelector('.form-success-msg');
            if (msgSucesso) {
                msgSucesso.classList.add('show');
                setTimeout(() => {
                    msgSucesso.classList.remove('show');
                }, 3000);
            }
        }, 500);
    }
}, true);


// ── LIMITAR QUANTIDADE DE NÚMEROS NOS CAMPOS ────────────────
document.addEventListener('DOMContentLoaded', function() {
    // WhatsApp - máximo 11 números
    const whatsappInput = document.getElementById('b-whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }
            e.target.value = valor;
        });
    }
    
    // CPF/CNPJ - máximo 14 números (CNPJ)
    const cpfCnpjInput = document.getElementById('b-cpf-cnpj');
    const cpfCnpjTipo = document.getElementById('b-cpf-cnpj-tipo');
    
    if (cpfCnpjInput) {
        cpfCnpjInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            
            // Definir máximo baseado no tipo selecionado
            let max = 14; // CNPJ padrão
            if (cpfCnpjTipo && cpfCnpjTipo.value === 'CPF') {
                max = 11;
            }
            
            if (valor.length > max) {
                valor = valor.slice(0, max);
            }
            e.target.value = valor;
        });
        
        // Atualizar limite quando mudar o tipo
        if (cpfCnpjTipo) {
            cpfCnpjTipo.addEventListener('change', function() {
                cpfCnpjInput.value = '';
                if (this.value === 'CPF') {
                    cpfCnpjInput.placeholder = 'Ex: 00000000000 (11 dígitos)';
                } else if (this.value === 'CNPJ') {
                    cpfCnpjInput.placeholder = 'Ex: 00000000000000 (14 dígitos)';
                }
            });
        }
    }
});

