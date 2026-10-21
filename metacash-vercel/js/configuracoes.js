/* =========================================
        METACASH
        CONFIGURAÇÕES
        INTEGRADO AO STORAGE
========================================= */


/* =========================================
        VERIFICAR USUÁRIO
========================================= */

const usuario = obterUsuario();

if (!usuario) {

    window.location.href =
        "../meta/index.html";

    throw new Error(
        "Usuário não encontrado."
    );

}


/* =========================================
        ELEMENTOS
========================================= */

const nomeInput =
    document.getElementById("nome");

const salvarNome =
    document.getElementById("salvarNome");

const mensagemNome =
    document.getElementById("mensagemNome");

const saldoInput =
    document.getElementById("saldoInicial");

const salvarSaldo =
    document.getElementById("salvarSaldo");

const mensagemSaldo =
    document.getElementById("mensagemSaldo");

const porcentagemMetasInput =
    document.getElementById("porcentagemMetas");

const salvarPorcentagemMetas =
    document.getElementById("salvarPorcentagemMetas");

const mensagemPorcentagemMetas =
    document.getElementById("mensagemPorcentagemMetas");

const listaCategorias =
    document.getElementById("listaCategorias");

const salvarAlertas =
    document.getElementById("salvarAlertas");

const mensagemAlertas =
    document.getElementById("mensagemAlertas");

const saldoMinimoInput =
    document.getElementById("saldoMinimo");

const comparacaoMensalInput =
    document.getElementById("comparacaoMensal");

const botaoApagar =
    document.getElementById("apagarDados");

const avatar =
    document.getElementById("avatar");

const botaoSair =
    document.getElementById("sair");


/* =========================================
        GARANTIR ESTRUTURAS
========================================= */

if (
    !Array.isArray(usuario.categorias)
) {

    usuario.categorias = [];

}


if (
    !Array.isArray(usuario.entradas)
) {

    usuario.entradas = [];

}


if (
    !Array.isArray(usuario.gastos)
) {

    usuario.gastos = [];

}


if (
    !Array.isArray(usuario.metas)
) {

    usuario.metas = [];

}


if (
    !Array.isArray(usuario.aportesMetas)
) {

    usuario.aportesMetas = [];

}


if (
    !usuario.alertas
) {

    usuario.alertas = {

        limiteCategoria: 80,

        saldoMinimo: 50,

        comparacaoMensal: true

    };

}


/*
    Garante que essas estruturas criadas
    também sejam salvas pela central.
*/

salvarUsuario(usuario);


/* =========================================
        DADOS INICIAIS
========================================= */

nomeInput.value =
    usuario.nome || "";


saldoInput.value =
    Number(
        usuario.saldoInicial || 0
    );

if (porcentagemMetasInput) {
    porcentagemMetasInput.value = Number(
        usuario.porcentagemMetas ?? 10
    );
}


if (avatar) {

    avatar.textContent =
        (
            usuario.nome ||
            "U"
        )
        .charAt(0)
        .toUpperCase();

}


/* =========================================
        CARREGAR AVISOS
========================================= */

const botoesLimite =
    document.querySelectorAll(
        'input[name="limiteCategoria"]'
    );


const limiteSalvo =
    Number(
        usuario.alertas.limiteCategoria ||
        80
    );


botoesLimite.forEach(
    function(input) {

        input.checked =
            Number(input.value) ===
            limiteSalvo;

    }
);


saldoMinimoInput.value =
    Number(
        usuario.alertas.saldoMinimo ?? 50
    );


comparacaoMensalInput.checked =
    usuario.alertas.comparacaoMensal !== false;


/* =========================================
        MENSAGEM
========================================= */

function mostrarMensagem(
    elemento,
    texto,
    tipo
) {

    if (!elemento) {

        return;

    }


    elemento.textContent =
        texto;


    elemento.className =
        `message ${tipo}`;


    setTimeout(
        function() {

            elemento.textContent =
                "";

        },
        2500
    );

}


/* =========================================
        SALVAR NOME
========================================= */

if (salvarNome) {

    salvarNome.addEventListener(
        "click",
        function() {

            const nome =
                nomeInput.value.trim();


            if (!nome) {

                mostrarMensagem(
                    mensagemNome,
                    "Digite um nome válido.",
                    "erro"
                );

                return;

            }


            usuario.nome =
                nome;


            salvarUsuario(usuario);


            if (avatar) {

                avatar.textContent =
                    nome
                        .charAt(0)
                        .toUpperCase();

            }


            mostrarMensagem(
                mensagemNome,
                "Nome alterado com sucesso!",
                "sucesso"
            );

        }
    );

}


/* =========================================
        SALVAR SALDO
========================================= */

if (salvarSaldo) {

    salvarSaldo.addEventListener(
        "click",
        function() {

            const saldo =
                Number(
                    saldoInput.value
                );


            if (
                isNaN(saldo) ||
                saldo < 0
            ) {

                mostrarMensagem(
                    mensagemSaldo,
                    "Digite um saldo válido.",
                    "erro"
                );

                return;

            }


            usuario.saldoInicial =
                saldo;


            usuario.saldo =
                saldo;


            usuario.saldoAtual =
                saldo;


            salvarUsuario(usuario);


            mostrarMensagem(
                mensagemSaldo,
                "Saldo alterado com sucesso!",
                "sucesso"
            );

        }
    );

}


/* =========================================
        SALVAR PORCENTAGEM DAS METAS
========================================= */

if (salvarPorcentagemMetas) {
    salvarPorcentagemMetas.addEventListener("click", function() {
        const percentual = Number(porcentagemMetasInput.value);

        if (!Number.isFinite(percentual) || percentual < 0 || percentual > 100) {
            mostrarMensagem(
                mensagemPorcentagemMetas,
                "Informe uma porcentagem entre 0% e 100%.",
                "erro"
            );
            return;
        }

        usuario.porcentagemMetas = percentual;
        salvarUsuario(usuario);

        mostrarMensagem(
            mensagemPorcentagemMetas,
            `Reserva automática definida em ${percentual}% das novas entradas.`,
            "sucesso"
        );
    });
}


/* =========================================
        ÍCONES
========================================= */

function obterIcone(
    categoria
) {

    const icones = {

        Jogos: "🎮",

        Alimentação: "🍔",

        Transporte: "🚌",

        Streaming: "🎬",

        Compras: "🛍️",

        Estudos: "📚",

        Lazer: "🎮",

        Figurinhas: "⚽",

        Outros: "📦"

    };


    return (
        icones[categoria] ||
        "📦"
    );

}


/* =========================================
        RENDERIZAR CATEGORIAS
========================================= */

function renderizarCategorias() {

    if (!listaCategorias) {

        return;

    }


    listaCategorias.innerHTML =
        "";


    if (
        usuario.categorias.length === 0
    ) {

        listaCategorias.innerHTML = `

            <div class="empty-categories">

                <span>
                    📦
                </span>

                <p>
                    Nenhuma categoria cadastrada.
                </p>

            </div>

        `;

        return;

    }


    usuario.categorias.forEach(
        function(categoria, index) {

            let nomeCategoria =
                "";


            if (
                typeof categoria ===
                "object" &&
                categoria !== null
            ) {

                nomeCategoria =
                    categoria.nome ||
                    "Outros";

            } else {

                nomeCategoria =
                    String(categoria);

            }


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "category-setting";


            div.innerHTML = `

                <div class="category-setting-left">

                    <div class="category-setting-icon">

                        ${obterIcone(
                            nomeCategoria
                        )}

                    </div>


                    <div class="category-setting-info">

                        <strong>

                            ${nomeCategoria}

                        </strong>

                    </div>

                </div>


                <button
                    type="button"
                    class="btn-remove-category"
                    data-index="${index}"
                >

                    Remover

                </button>

            `;


            listaCategorias.appendChild(
                div
            );

        }
    );


    adicionarEventosCategorias();

}


/* =========================================
        EVENTOS CATEGORIAS
========================================= */

function adicionarEventosCategorias() {

    const botoes =
        document.querySelectorAll(
            ".btn-remove-category"
        );


    botoes.forEach(
        function(botao) {

            botao.addEventListener(
                "click",
                function() {

                    const index =
                        Number(
                            botao.dataset.index
                        );


                    if (
                        usuario.categorias.length <= 1
                    ) {

                        alert(
                            "Você precisa manter pelo menos uma categoria."
                        );

                        return;

                    }


                    const categoria =
                        usuario.categorias[
                            index
                        ];


                    const nomeCategoria =
                        typeof categoria ===
                        "object"

                            ? categoria.nome

                            : categoria;


                    const confirmar =
                        confirm(
                            `Deseja remover a categoria "${nomeCategoria}"?`
                        );


                    if (!confirmar) {

                        return;

                    }


                    usuario.categorias.splice(
                        index,
                        1
                    );


                    salvarUsuario(usuario);


                    renderizarCategorias();

                }
            );

        }
    );

}


/* =========================================
        SALVAR AVISOS
========================================= */

if (salvarAlertas) {

    salvarAlertas.addEventListener(
        "click",
        function() {

            let limiteCategoria =
                80;


            botoesLimite.forEach(
                function(input) {

                    if (
                        input.checked
                    ) {

                        limiteCategoria =
                            Number(
                                input.value
                            );

                    }

                }
            );


            const saldoMinimo =
                Number(
                    saldoMinimoInput.value
                );


            if (
                isNaN(saldoMinimo) ||
                saldoMinimo < 0
            ) {

                mostrarMensagem(
                    mensagemAlertas,
                    "Digite um saldo mínimo válido.",
                    "erro"
                );

                return;

            }


            usuario.alertas = {

                limiteCategoria:
                    limiteCategoria,

                saldoMinimo:
                    saldoMinimo,

                comparacaoMensal:
                    comparacaoMensalInput.checked

            };


            salvarUsuario(usuario);


            mostrarMensagem(
                mensagemAlertas,
                "Avisos salvos com sucesso!",
                "sucesso"
            );

        }
    );

}


/* =========================================
        APAGAR DADOS
========================================= */

if (botaoApagar) {

    botaoApagar.addEventListener(
        "click",
        function() {

            const confirmar =
                confirm(
                    "Tem certeza que deseja apagar todos os seus dados financeiros?"
                );


            if (!confirmar) {

                return;

            }


            const confirmarNovamente =
                confirm(
                    "Essa ação não pode ser desfeita. Deseja continuar?"
                );


            if (!confirmarNovamente) {

                return;

            }


            usuario.saldo =
                0;

            usuario.saldoInicial =
                0;

            usuario.saldoAtual =
                0;

            usuario.entradas =
                [];

            usuario.gastos =
                [];

            usuario.metas =
                [];

            usuario.aportesMetas =
                [];

            usuario.historico =
                [];


            salvarUsuario(usuario);


            alert(
                "Dados financeiros apagados com sucesso."
            );


            window.location.href =
                "dashboard.html";

        }
    );

}


/* =========================================
        SAIR
========================================= */

if (botaoSair) {

    botaoSair.addEventListener(
        "click",
        function() {

            const confirmar =
                confirm(
                    "Deseja realmente sair?"
                );


            if (!confirmar) {

                return;

            }


            removerUsuario();


            window.location.href =
                "../meta/index.html";

        }
    );

}


/* =========================================
        INICIALIZAÇÃO
========================================= */

renderizarCategorias();
