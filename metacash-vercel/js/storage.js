/* =========================================
        METACASH
        CENTRAL DE ARMAZENAMENTO
========================================= */


/* =========================================
        OBTER USUÁRIO
========================================= */

function obterUsuario() {

    const usuarioSalvo =
        localStorage.getItem("usuario");

    if (!usuarioSalvo) {

        return null;

    }

    try {

        return JSON.parse(usuarioSalvo);

    } catch (erro) {

        console.error(
            "Erro ao carregar os dados do usuário:",
            erro
        );

        return null;

    }

}


/* =========================================
        SALVAR USUÁRIO
========================================= */

function salvarUsuario(usuario) {

    localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
    );

}


/* =========================================
        ATUALIZAR USUÁRIO
========================================= */

function atualizarUsuario(alteracoes = {}) {

    const usuario =
        obterUsuario();

    if (!usuario) {

        return null;

    }

    Object.assign(
        usuario,
        alteracoes
    );

    salvarUsuario(usuario);

    return usuario;

}


/* =========================================
        SAIR DA CONTA
========================================= */

function removerUsuario() {

    localStorage.removeItem(
        "usuario"
    );

}


/* =========================================
        LIMPAR DADOS FINANCEIROS
========================================= */

function limparDadosFinanceiros() {

    const usuario =
        obterUsuario();

    if (!usuario) {

        return null;

    }


    usuario.entradas = [];

    usuario.gastos = [];

    usuario.historico = [];

    usuario.saldoAtual =
        Number(usuario.saldoInicial || 0);


    salvarUsuario(usuario);

    return usuario;

}