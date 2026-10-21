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

const limiteCategoriaInputs =
    document.querySelectorAll(
        'input[name="limiteCategoria"]'
    );


const saldoMinimoInput =
    document.getElementById(
        "saldoMinimo"
    );


const comparacaoMensalInput =
    document.getElementById(
        "comparacaoMensal"
    );


const botaoVoltar =
    document.getElementById(
        "voltar"
    );


const botaoFinalizar =
    document.getElementById(
        "finalizar"
    );


/* =========================================
        GARANTIR CONFIGURAÇÃO DE ALERTAS
========================================= */

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


/* =========================================
        CARREGAR LIMITE SALVO
========================================= */

const limiteCategoriaSalvo =
    Number(
        usuario.alertas.limiteCategoria
    );


limiteCategoriaInputs.forEach(
    function(input) {

        input.checked =
            Number(
                input.value
            ) ===
            limiteCategoriaSalvo;

    }
);


/* =========================================
        CARREGAR SALDO MÍNIMO
========================================= */

const saldoMinimoSalvo =
    Number(
        usuario.alertas.saldoMinimo
    );


if (
    !isNaN(saldoMinimoSalvo) &&
    saldoMinimoSalvo >= 0
) {

    saldoMinimoInput.value =
        saldoMinimoSalvo;

}


/* =========================================
        CARREGAR COMPARAÇÃO MENSAL
========================================= */

comparacaoMensalInput.checked =
    usuario.alertas.comparacaoMensal !== false;


/* =========================================
        VOLTAR
========================================= */

if (botaoVoltar) {

    botaoVoltar.addEventListener(
        "click",
        function() {

            window.location.href =
                "cadastro.html";

        }
    );

}


/* =========================================
        FINALIZAR CONFIGURAÇÃO
========================================= */

if (botaoFinalizar) {

    botaoFinalizar.addEventListener(
        "click",
        function() {


            /* ================================
                    LIMITE DE CATEGORIA
            ================================= */

            let limiteCategoria =
                80;


            limiteCategoriaInputs.forEach(
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


            /* ================================
                    SALDO MÍNIMO
            ================================= */

            const saldoMinimo =
                Number(
                    saldoMinimoInput.value
                );


            if (
                isNaN(saldoMinimo) ||
                saldoMinimo < 0
            ) {

                alert(
                    "Digite um valor válido para o saldo mínimo."
                );

                return;

            }


            /* ================================
                    COMPARAÇÃO MENSAL
            ================================= */

            const comparacaoMensal =
                comparacaoMensalInput.checked;


            /* ================================
                    SALVAR
            ================================= */

            usuario.alertas = {

                limiteCategoria:
                    limiteCategoria,

                saldoMinimo:
                    saldoMinimo,

                comparacaoMensal:
                    comparacaoMensal

            };


            /* ================================
                    LOCALSTORAGE
            ================================= */

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );


            /* ================================
                    DASHBOARD
            ================================= */

            window.location.href =
                "dashboard.html";

        }
    );

}