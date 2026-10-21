/* =========================================
        VERIFICAR USUÁRIO
========================================= */

const usuarioSalvo =
    localStorage.getItem("usuario");


if (!usuarioSalvo) {

    window.location.href =
        "../meta/index.html";

}


const usuario =
    JSON.parse(usuarioSalvo);


/* =========================================
        ELEMENTOS
========================================= */

const nomeUsuario =
    document.getElementById(
        "nomeUsuario"
    );

const formulario =
    document.getElementById(
        "configForm"
    );

const saldoInput =
    document.getElementById(
        "saldo"
    );


/* =========================================
        MOSTRAR NOME
========================================= */

if (nomeUsuario) {

    nomeUsuario.textContent =
        `Olá, ${usuario.nome}! 👋`;

}


/* =========================================
        CARREGAR SALDO EXISTENTE
========================================= */

if (
    usuario.saldoInicial !== undefined
) {

    saldoInput.value =
        usuario.saldoInicial;

}


/* =========================================
        CARREGAR CATEGORIAS EXISTENTES
========================================= */

if (
    Array.isArray(
        usuario.categorias
    )
) {

    const categoriasExistentes =
        usuario.categorias.map(
            function(categoria) {

                /*
                    Aceita tanto o formato antigo:

                    "Jogos"

                    quanto o formato de versões
                    anteriores:

                    {
                        nome: "Jogos",
                        percentual: 10
                    }
                */

                if (
                    typeof categoria ===
                    "object" &&
                    categoria !== null
                ) {

                    return String(
                        categoria.nome || ""
                    );

                }


                return String(
                    categoria
                );

            }
        );


    const inputsCategorias =
        document.querySelectorAll(
            ".category input"
        );


    inputsCategorias.forEach(
        function(input) {

            input.checked =
                categoriasExistentes.includes(
                    input.value
                );

        }
    );

}


/* =========================================
        FORMULÁRIO
========================================= */

if (formulario) {

    formulario.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /* ================================
                    SALDO INICIAL
            ================================= */

            const saldo =
                Number(
                    saldoInput.value
                );


            if (
                isNaN(saldo) ||
                saldo < 0
            ) {

                alert(
                    "Digite um saldo válido."
                );

                return;

            }


            /* ================================
                    CATEGORIAS
            ================================= */

            const selecionadas =
                document.querySelectorAll(
                    ".category input:checked"
                );


            const categorias = [];


            selecionadas.forEach(
                function(item) {

                    /*
                        IMPORTANTE:

                        A categoria é salva
                        somente pelo nome.

                        NÃO salvamos percentual
                        individual aqui.
                    */

                    categorias.push(
                        item.value
                    );

                }
            );


            /* ================================
                    VALIDAR CATEGORIAS
            ================================= */

            if (
                categorias.length === 0
            ) {

                alert(
                    "Escolha pelo menos uma categoria."
                );

                return;

            }


            /* ================================
                    SALDO
            ================================= */

            usuario.saldo =
                saldo;


            usuario.saldoInicial =
                saldo;


            /* ================================
                    CATEGORIAS
            ================================= */

            usuario.categorias =
                categorias;


            /* ================================
                    GARANTIR ESTRUTURAS
            ================================= */

            if (
                !Array.isArray(
                    usuario.entradas
                )
            ) {

                usuario.entradas = [];

            }


            if (
                !Array.isArray(
                    usuario.gastos
                )
            ) {

                usuario.gastos = [];

            }


            if (
                !Array.isArray(
                    usuario.metas
                )
            ) {

                usuario.metas = [];

            }


            if (
                !Array.isArray(
                    usuario.aportesMetas
                )
            ) {

                usuario.aportesMetas = [];

            }


            if (
                !Array.isArray(
                    usuario.historico
                )
            ) {

                usuario.historico = [];

            }


            /* ================================
                    CONFIGURAÇÃO DOS ALERTAS
            ================================= */

            /*
                Se o usuário ainda não possui
                configurações de alertas,
                criamos os valores padrão.

                Categoria: 80%
                Saldo mínimo: R$ 50
                Comparação mensal: ativada
            */

            if (
                !usuario.alertas
            ) {

                usuario.alertas = {

                    limiteCategoria:
                        80,

                    saldoMinimo:
                        50,

                    comparacaoMensal:
                        true

                };

            }


            /* ================================
                    SALVAR USUÁRIO
            ================================= */

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );


            /* ================================
                    IR PARA DASHBOARD
            ================================= */

            window.location.href =
                "../meta/dashboard.html";

        }
    );

}