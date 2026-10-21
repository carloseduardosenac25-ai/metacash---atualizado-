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

const selectCategoria =
    document.getElementById(
        "categoria"
    );

const formulario =
    document.getElementById(
        "gastoForm"
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
        CATEGORIAS
========================================= */

if (
    usuario.categorias &&
    usuario.categorias.length > 0
) {

    usuario.categorias.forEach(
        function(categoria) {

            /*
                Aceita tanto:

                "Jogos"

                quanto:

                {
                    nome: "Jogos",
                    percentual: 10
                }
            */

            let nomeCategoria;


            if (
                typeof categoria === "object" &&
                categoria !== null
            ) {

                nomeCategoria =
                    categoria.nome ||
                    "Outros";

            }
            else {

                nomeCategoria =
                    categoria;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                nomeCategoria;


            option.textContent =
                nomeCategoria;


            selectCategoria.appendChild(
                option
            );

        }
    );

}


/* =========================================
        FORMULÁRIO
========================================= */

formulario.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const valor =
            Number(
                document.getElementById(
                    "valor"
                ).value
            );


        const categoria =
            document.getElementById(
                "categoria"
            ).value;


        const descricao =
            document.getElementById(
                "descricao"
            ).value.trim();


        /* ================================
                VALIDAR VALOR
        ================================= */

        if (
            isNaN(valor) ||
            valor <= 0
        ) {

            alert(
                "Digite um valor válido."
            );

            return;

        }


        /* ================================
                VALIDAR CATEGORIA
        ================================= */

        if (!categoria) {

            alert(
                "Selecione uma categoria."
            );

            return;

        }


        /* ================================
                CRIAR GASTO
        ================================= */

        const gasto = {

            id:
                Date.now(),

            valor:
                valor,

            categoria:
                categoria,

            descricao:
                descricao ||
                "Sem descrição",

            data:
                obterDataLocal()

        };


        /* ================================
                GARANTIR ARRAY
        ================================= */

        if (
            !Array.isArray(
                usuario.gastos
            )
        ) {

            usuario.gastos = [];

        }


        /* ================================
                SALVAR
        ================================= */

        usuario.gastos.push(
            gasto
        );


        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );


        /* ================================
                MENSAGEM
        ================================= */

        alert(
            "Gasto adicionado com sucesso!"
        );


        /* ================================
                REDIRECIONAR
        ================================= */

        window.location.href =
            "../meta/dashboard.html";

    }
);