document.addEventListener("DOMContentLoaded", function () {

    // ======================================================
    // PARTE 1: ANIMAÇÕES VISUAIS (SEU CÓDIGO ORIGINAL)
    // ======================================================

    // 1. Observer para a classe .fade-on-scroll
    const fadeOnScrollOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const fadeOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, fadeOnScrollOptions);

    document.querySelectorAll('.fade-on-scroll').forEach(el => {
        fadeOnScrollObserver.observe(el);
    });

    // 2. Observer para a classe .fade-up
    const fadeUpOptions = {
        threshold: 0.1 
    };

    const fadeUpObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Opcional
            }
        });
    }, fadeUpOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        fadeUpObserver.observe(el);
    });

    // ======================================================
    // PARTE 2: INTEGRAÇÃO ANALYTICS & PIXEL (NOVO)
    // ======================================================

    /**
     * Função auxiliar para disparar eventos de forma segura
     * @param {string} selector - A classe CSS do botão
     * @param {string} pixelEvent - Nome do evento no Facebook (ex: 'InitiateCheckout')
     * @param {string} gaEvent - Nome do evento no Google (ex: 'begin_checkout')
     * @param {string} label - Rótulo para identificar qual botão foi clicado
     */
    function trackEvent(selector, pixelEvent, gaEvent, label) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(btn => {
            btn.addEventListener('click', function() {
                // 1. Dispara Meta Pixel
                if (typeof fbq === 'function') {
                    fbq('track', pixelEvent, { content_name: label });
                }

                // 2. Dispara Google Analytics 4
                if (typeof gtag === 'function') {
                    gtag('event', gaEvent, {
                        'event_category': 'Engagement',
                        'event_label': label
                    });
                }
                
                // Log para teste (remova quando for para produção se quiser)
                console.log(`Evento disparado: ${label}`);
            });
        });
    }

    // --- CONFIGURAÇÃO DOS BOTÕES ---

    // 1. Botões de Compra (Checkout)
    // Seleciona todas as classes de botões que criamos no projeto
    trackEvent(
        '.btn-checkout, .btn-primary-pulse, .btn-final-pulse, .btn-final-push', 
        'InitiateCheckout', // Evento Padrão Facebook para início de compra
        'begin_checkout',   // Evento Padrão GA4
        'Botão de Compra'
    );

    // 2. Botão do WhatsApp (Contato)
    trackEvent(
        '.whatsapp-float', 
        'Contact',          // Evento Padrão Facebook para contato
        'generate_lead',    // Evento GA4 (ou use 'select_content')
        'Clique WhatsApp'
    );
    
    // 3. Links de Redes Sociais (Rodapé)
    trackEvent(
        '.social-icon',
        'ViewContent',
        'social_click',
        'Link Social Footer'
    );

});