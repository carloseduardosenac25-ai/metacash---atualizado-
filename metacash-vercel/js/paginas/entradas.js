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

const entradaForm =
    document.getElementById(
        "entradaForm"
    );

const mensagem =
    document.getElementById(
        "mensagem"
    );


/* =========================================
        DATA LOCAL
========================================= */

function obterDataLocal() {

    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");


    return `${ano}-${mes}-${dia}`;

}


/* =========================================
        FORMULÁRIO
========================================= */

entradaForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        /* =================================
                VALOR
        ================================== */

        const valor =
            parseFloat(
                document.getElementById(
                    "valor"
                ).value
            );


        /* =================================
                TIPO
        ================================== */

        const tipo =
            document.getElementById(
                "tipo"
            ).value;


        /* =================================
                DESCRIÇÃO
        ================================== */

        const descricao =
            document.getElementById(
                "descricao"
            ).value.trim();


        /* =================================
                VALIDAR VALOR
        ================================== */

        if (
            isNaN(valor) ||
            valor <= 0
        ) {

            mostrarMensagem(
                "Digite um valor válido.",
                "erro"
            );

            return;

        }


        /* =================================
                VALIDAR TIPO
        ================================== */

        if (!tipo) {

            mostrarMensagem(
                "Selecione o tipo de entrada.",
                "erro"
            );

            return;

        }


        /* =================================
                GARANTIR ARRAY
        ================================== */

        if (
            !Array.isArray(
                usuario.entradas
            )
        ) {

            usuario.entradas = [];

        }


        /* =================================
                CRIAR ENTRADA
        ================================== */

        const entrada = {

            id:
                Date.now(),

            valor:
                valor,

            tipo:
                tipo,

            descricao:
                descricao ||
                "Sem descrição",

            /*
                IMPORTANTE:

                usamos a data LOCAL,
                não UTC.
            */

            data:
                obterDataLocal()

        };


        /* =================================
                RESERVA AUTOMÁTICA PARA METAS
        ================================== */

        const percentualMetas = Math.min(
            100,
            Math.max(0, Number(usuario.porcentagemMetas ?? 10))
        );
        let valorParaMetas = Math.round(valor * percentualMetas) / 100;
        let valorAlocadoMetas = 0;

        if (!Array.isArray(usuario.metas)) usuario.metas = [];
        if (!Array.isArray(usuario.aportesMetas)) usuario.aportesMetas = [];

        // Distribui a reserva entre metas ainda não concluídas, respeitando o valor restante de cada uma.
        const metasPendentes = usuario.metas.filter(function(meta) {
            return Number(meta.valorMeta || 0) > Number(meta.valorGuardado || 0);
        });

        for (const meta of metasPendentes) {
            if (valorParaMetas <= 0) break;

            const restante = Math.max(
                0,
                Number(meta.valorMeta || 0) - Number(meta.valorGuardado || 0)
            );
            const aporte = Math.min(valorParaMetas, restante);
            if (aporte <= 0) continue;

            meta.valorGuardado = Math.round(
                (Number(meta.valorGuardado || 0) + aporte) * 100
            ) / 100;

            usuario.aportesMetas.push({
                id: Date.now() + usuario.aportesMetas.length,
                metaId: meta.id,
                metaNome: meta.nome,
                valor: aporte,
                data: entrada.data,
                tipo: "aporte_automatico",
                entradaId: entrada.id
            });

            valorParaMetas = Math.round((valorParaMetas - aporte) * 100) / 100;
            valorAlocadoMetas = Math.round((valorAlocadoMetas + aporte) * 100) / 100;
        }

        entrada.percentualMetas = percentualMetas;
        entrada.valorDestinadoMetas = valorAlocadoMetas;


        /* =================================
                SALVAR
        ================================== */

        usuario.entradas.push(
            entrada
        );


        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );


        /* =================================
                MENSAGEM
        ================================== */

        let textoSucesso = "Entrada adicionada com sucesso!";
        if (percentualMetas > 0 && valorAlocadoMetas > 0) {
            textoSucesso += ` ${valorAlocadoMetas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} foram destinados automaticamente às metas.`;
        } else if (percentualMetas > 0 && metasPendentes.length === 0) {
            textoSucesso += " Para usar a reserva automática, crie uma meta financeira ou confira se suas metas já foram concluídas.";
        }

        mostrarMensagem(
            textoSucesso,
            "sucesso"
        );


        /* =================================
                LIMPAR
        ================================== */

        entradaForm.reset();


        /* =================================
                REDIRECIONAR
        ================================== */

        setTimeout(
            function() {

                window.location.href =
                    "../meta/dashboard.html";

            },
            1000
        );

    }
);


/* =========================================
        MOSTRAR MENSAGEM
========================================= */

function mostrarMensagem(
    texto,
    tipo
) {

    if (!mensagem) {

        return;

    }


    mensagem.textContent =
        texto;


    mensagem.className =
        "mensagem " +
        tipo;

}