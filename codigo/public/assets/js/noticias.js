
// API de Notícias de Saúde
class NoticiasAPI {
    constructor() {
        this.apiKey = '568a7cceaa0c4ed7a03e754a0c1a9391';
        this.baseUrl = 'https://newsapi.org/v2/everything';
    }

    async buscarNoticiasSaude() {
        try {
            // Configuração para buscar notícias de saúde
            const params = new URLSearchParams({
                q: 'saúde OR medicina OR tratamento OR remédio OR medicamento',
                language: 'pt',
                sortBy: 'publishedAt',
                pageSize: 6,
                apiKey: this.apiKey
            });

            const response = await fetch(`${this.baseUrl}?${params}`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
            return this.getNoticiasDefault();
        }
    }

    getNoticiasDefault() {
        // Notícias padrão caso a API falhe
        return [
            {
                title: "Importância da Adesão ao Tratamento Medicamentoso",
                description: "Estudos mostram que seguir corretamente o tratamento com medicamentos é fundamental para a recuperação.",
                urlToImage: "https://via.placeholder.com/300x200?text=Saúde",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Dicas para Não Esquecer de Tomar Remédios",
                description: "Especialistas recomendam o uso de lembretes e aplicativos para manter a rotina de medicamentos.",
                urlToImage: "https://via.placeholder.com/300x200?text=Medicamentos",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Cuidados com Medicamentos para Idosos",
                description: "Orientações importantes sobre como gerenciar múltiplos medicamentos na terceira idade.",
                urlToImage: "https://via.placeholder.com/300x200?text=Idosos",
                url: "#",
                publishedAt: new Date().toISOString()
            }
        ];
    }

    formatarData(dataISO) {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    truncarTexto(texto, limite = 100) {
        if (!texto) return '';
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    }

    async renderizarNoticias() {
        const container = document.getElementById('noticias-container');
        if (!container) return;

        // Mostrar loading
        container.innerHTML = '<p>Carregando notícias...</p>';

        try {
            const noticias = await this.buscarNoticiasSaude();
            
            if (!noticias || noticias.length === 0) {
                container.innerHTML = '<p>Nenhuma notícia encontrada no momento.</p>';
                return;
            }

            const noticiasHTML = noticias.map(noticia => {
                const imagemUrl = noticia.urlToImage || 'https://via.placeholder.com/300x200?text=Notícia';
                const titulo = noticia.title || 'Título não disponível';
                const descricao = this.truncarTexto(noticia.description || 'Descrição não disponível', 120);
                const dataPublicacao = this.formatarData(noticia.publishedAt);
                const link = noticia.url || '#';

                return `
                    <article class="noticia-card">
                        <div class="noticia-imagem">
                            <img src="${imagemUrl}" alt="${titulo}" onerror="this.src='https://via.placeholder.com/300x200?text=Saúde'">
                        </div>
                        <div class="noticia-conteudo">
                            <h3 class="noticia-titulo">${titulo}</h3>
                            <p class="noticia-descricao">${descricao}</p>
                            <div class="noticia-footer">
                                <span class="noticia-data">${dataPublicacao}</span>
                                <a href="${link}" target="_blank" rel="noopener noreferrer" class="noticia-link">
                                    Ler mais <i class="fa-solid fa-external-link-alt"></i>
                                </a>
                            </div>
                        </div>
                    </article>
                `;
            }).join('');

            container.innerHTML = noticiasHTML;

        } catch (error) {
            console.error('Erro ao renderizar notícias:', error);
            container.innerHTML = '<p>Erro ao carregar notícias. Tente novamente mais tarde.</p>';
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const noticiasAPI = new NoticiasAPI();
    noticiasAPI.renderizarNoticias();
});
