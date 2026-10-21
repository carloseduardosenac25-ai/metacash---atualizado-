/* =========================================
        VERIFICAR USUÁRIO
========================================= */

const usuario = obterUsuario();

if (!usuario) {

    window.location.href =
        "../meta/index.html";

}


/* =========================================
        ELEMENTOS
========================================= */

const metaForm =
    document.getElementById("metaForm");

const listaMetas =
    document.getElementById("listaMetas");

const alertasMetas =
    document.getElementById("alertasMetas");

const avatar =
    document.getElementById("avatar");


/* =========================================
        INFORMAÇÕES DO USUÁRIO
========================================= */

const nomeUsuario =
    usuario.nome || "Usuário";


if (avatar) {

    avatar.textContent =
        nomeUsuario
            .charAt(0)
            .toUpperCase();

}


/* =========================================
        GARANTIR ARRAYS
========================================= */

if (!Array.isArray(usuario.metas)) {

    usuario.metas = [];

}


if (!Array.isArray(usuario.aportesMetas)) {

    usuario.aportesMetas = [];

}


/* =========================================
        FORMATAR MOEDA
========================================= */

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================
        FORMATAR DATA
========================================= */

function formatarData(data) {

    if (!data) {

        return "";

    }


    const partes =
        String(data).split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );

}


/* =========================================
        CONVERTER DATA
========================================= */

function converterData(data) {

    if (!data) {

        return 0;

    }


    const partes =
        String(data).split("-");


    if (
        partes.length === 3
    ) {

        return new Date(
            Number(partes[0]),
            Number(partes[1]) - 1,
            Number(partes[2])
        ).getTime();

    }


    return 0;

}


/* =========================================
        CALCULAR PROGRESSO
========================================= */

function calcularProgresso(meta) {

    const valorMeta =
        Number(
            meta.valorMeta || 0
        );


    const valorGuardado =
        Number(
            meta.valorGuardado || 0
        );


    if (
        valorMeta <= 0
    ) {

        return 0;

    }


    return Math.min(
        (
            valorGuardado /
            valorMeta
        ) * 100,
        100
    );

}


/* =========================================
        SALVAR DADOS
========================================= */

function salvarDados() {

    salvarUsuario(
        usuario
    );

}


/* =========================================
        CRIAR META
========================================= */

if (metaForm) {

    metaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nome =
                document.getElementById(
                    "nomeMeta"
                ).value.trim();


            const valorMeta =
                Number(
                    document.getElementById(
                        "valorMeta"
                    ).value
                );


            const valorGuardado =
                Number(
                    document.getElementById(
                        "valorGuardado"
                    ).value || 0
                );


            const prazo =
                document.getElementById(
                    "prazoMeta"
                ).value;


            /* ===============================
                    VALIDAÇÕES
            =============================== */

            if (!nome) {

                alert(
                    "Digite um nome para a meta."
                );

                return;

            }


            if (
                isNaN(valorMeta) ||
                valorMeta <= 0
            ) {

                alert(
                    "Digite um valor válido para a meta."
                );

                return;

            }


            if (
                isNaN(valorGuardado) ||
                valorGuardado < 0
            ) {

                alert(
                    "Digite um valor válido já guardado."
                );

                return;

            }


            if (
                valorGuardado >
                valorMeta
            ) {

                alert(
                    "O valor guardado não pode ser maior que o valor da meta."
                );

                return;

            }


            if (!prazo) {

                alert(
                    "Selecione um prazo para a meta."
                );

                return;

            }


            /* ===============================
                    CRIAR META
            =============================== */

            const meta = {

                id:
                    Date.now(),

                nome:
                    nome,

                valorMeta:
                    valorMeta,

                valorGuardado:
                    valorGuardado,

                prazo:
                    prazo,

                criadaEm:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            };


            usuario.metas.push(
                meta
            );


            /*
                Se o usuário informou um valor
                inicial já guardado, registramos
                esse valor no histórico também.
            */

            if (
                valorGuardado > 0
            ) {

                usuario.aportesMetas.push({

                    id:
                        Date.now() + 1,

                    metaId:
                        meta.id,

                    metaNome:
                        meta.nome,

                    valor:
                        valorGuardado,

                    data:
                        new Date()
                            .toISOString()
                            .split("T")[0],

                    tipo:
                        "inicial"

                });

            }


            salvarDados();


            /* ===============================
                    LIMPAR FORMULÁRIO
            =============================== */

            metaForm.reset();


            document.getElementById(
                "valorGuardado"
            ).value = 0;


            /* ===============================
                    ATUALIZAR
            =============================== */

            renderizarAlertas();

            renderizarMetas();


            alert(
                "Meta criada com sucesso!"
            );

        }
    );

}


/* =========================================
        ALERTAS DAS METAS
========================================= */

function renderizarAlertas() {

    if (!alertasMetas) {

        return;

    }


    alertasMetas.innerHTML = "";


    const alertas = [];


    usuario.metas.forEach(
        function(meta) {

            const valorMeta =
                Number(
                    meta.valorMeta || 0
                );


            const valorGuardado =
                Number(
                    meta.valorGuardado || 0
                );


            if (
                valorMeta <= 0
            ) {

                return;

            }


            const progresso =
                Math.min(
                    (
                        valorGuardado /
                        valorMeta
                    ) * 100,
                    100
                );


            const valorRestante =
                Math.max(
                    valorMeta -
                    valorGuardado,
                    0
                );


            let diasRestantes =
                null;


            /* =================================
                    CALCULAR PRAZO
            ================================== */

            if (meta.prazo) {

                const hoje =
                    new Date();

                hoje.setHours(
                    0,
                    0,
                    0,
                    0
                );


                const prazo =
                    new Date(
                        `${meta.prazo}T00:00:00`
                    );


                prazo.setHours(
                    0,
                    0,
                    0,
                    0
                );


                diasRestantes =
                    Math.ceil(
                        (
                            prazo.getTime() -
                            hoje.getTime()
                        ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    );

            }


            /* =================================
                    CONCLUÍDA
            ================================== */

            if (
                progresso >= 100
            ) {

                alertas.push({

                    tipo:
                        "sucesso",

                    icone:
                        "✅",

                    titulo:
                        `Meta "${meta.nome}" concluída!`,

                    mensagem:
                        `Parabéns! Você atingiu ${formatarMoeda(valorMeta)}.`

                });


                return;

            }


            /* =================================
                    PRAZO VENCIDO
            ================================== */

            if (
                diasRestantes !== null &&
                diasRestantes < 0
            ) {

                alertas.push({

                    tipo:
                        "perigo",

                    icone:
                        "⚠️",

                    titulo:
                        `O prazo da meta "${meta.nome}" venceu.`,

                    mensagem:
                        `Ainda faltam ${formatarMoeda(valorRestante)} para alcançar essa meta.`

                });

            }


            /* =================================
                    PRAZO PRÓXIMO
            ================================== */

            else if (
                diasRestantes !== null &&
                diasRestantes <= 7
            ) {

                const textoDias =
                    diasRestantes === 1
                        ? "1 dia"
                        : `${diasRestantes} dias`;


                alertas.push({

                    tipo:
                        "atencao",

                    icone:
                        "⏰",

                    titulo:
                        `A meta "${meta.nome}" está perto do prazo.`,

                    mensagem:
                        `Faltam ${textoDias} e ${formatarMoeda(valorRestante)} para concluir.`

                });

            }


            /* =================================
                    80% OU MAIS
            ================================== */

            if (
                progresso >= 80 &&
                progresso < 100
            ) {

                alertas.push({

                    tipo:
                        "sucesso",

                    icone:
                        "🎯",

                    titulo:
                        `A meta "${meta.nome}" está quase concluída!`,

                    mensagem:
                        `Você já alcançou ${progresso.toFixed(0)}%. Faltam ${formatarMoeda(valorRestante)}.`

                });

            }

        }
    );


    /* =====================================
            NENHUM ALERTA
    ====================================== */

    if (
        alertas.length === 0
    ) {

        alertasMetas.innerHTML = `

            <div class="alerta-meta alerta-sucesso">

                <div class="alerta-icon">

                    ✅

                </div>


                <div class="alerta-info">

                    <strong>

                        Tudo certo com suas metas!

                    </strong>


                    <p>

                        Continue acompanhando seu progresso.

                    </p>

                </div>

            </div>

        `;

        return;

    }


    /* =====================================
            RENDERIZAR
    ====================================== */

    alertas.forEach(
        function(alerta) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                `alerta-meta alerta-${alerta.tipo}`;


            div.innerHTML = `

                <div class="alerta-icon">

                    ${alerta.icone}

                </div>


                <div class="alerta-info">

                    <strong>

                        ${alerta.titulo}

                    </strong>


                    <p>

                        ${alerta.mensagem}

                    </p>

                </div>

            `;


            alertasMetas.appendChild(
                div
            );

        }
    );

}


/* =========================================
        HISTÓRICO DE APORTES
========================================= */

function renderizarHistoricoAportes(
    metaId
) {

    const aportes =
        usuario.aportesMetas
            .filter(
                function(aporte) {

                    return (
                        Number(aporte.metaId) ===
                        Number(metaId)
                    );

                }
            )
            .sort(
                function(a, b) {

                    return (
                        converterData(b.data) -
                        converterData(a.data)
                    );

                }
            );


    /* =====================================
            SEM APORTES
    ====================================== */

    if (
        aportes.length === 0
    ) {

        return `

            <div class="meta-history-empty">

                Nenhum aporte registrado ainda.

            </div>

        `;

    }


    /* =====================================
            LISTAR
    ====================================== */

    return aportes.map(
        function(aporte) {

            const tipoTexto =
                aporte.tipo === "inicial"
                    ? "Valor inicial"
                    : "Aporte";


            return `

                <div class="meta-history-item">


                    <div class="meta-history-icon">

                        ↑

                    </div>


                    <div class="meta-history-info">

                        <strong>

                            + ${formatarMoeda(
                                aporte.valor
                            )}

                        </strong>


                        <small>

                            ${tipoTexto}
                            •
                            ${formatarData(
                                aporte.data
                            )}

                        </small>

                    </div>


                </div>

            `;

        }
    ).join("");

}


/* =========================================
        RENDERIZAR METAS
========================================= */

function renderizarMetas() {

    if (!listaMetas) {

        return;

    }


    listaMetas.innerHTML =
        "";


    if (
        usuario.metas.length === 0
    ) {

        listaMetas.innerHTML = `

            <div class="empty-metas">

                <span>

                    🎯

                </span>


                <h3>

                    Você ainda não tem metas

                </h3>


                <p>

                    Crie sua primeira meta para começar.

                </p>

            </div>

        `;

        return;

    }


    usuario.metas.forEach(
        function(meta) {

            const progresso =
                calcularProgresso(
                    meta
                );


            const valorMeta =
                Number(
                    meta.valorMeta || 0
                );


            const valorGuardado =
                Number(
                    meta.valorGuardado || 0
                );


            const valorRestante =
                Math.max(
                    valorMeta -
                    valorGuardado,
                    0
                );


            const concluida =
                progresso >= 100;


            /* =================================
                    HISTÓRICO
            ================================== */

            const aportes =
                usuario.aportesMetas
                    .filter(
                        function(aporte) {

                            return (
                                Number(aporte.metaId) ===
                                Number(meta.id)
                            );

                        }
                    );


            const quantidadeAportes =
                aportes.length;


            const textoAportes =
                quantidadeAportes === 1
                    ? "1 aporte"
                    : `${quantidadeAportes} aportes`;


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "meta-item";


            if (concluida) {

                card.classList.add(
                    "concluida"
                );

            }


            card.innerHTML = `

                <!-- =================================
                        TOPO
                ================================== -->

                <div class="meta-item-top">


                    <div class="meta-item-title">


                        <div class="meta-item-icon">

                            ${
                                concluida
                                    ? "✅"
                                    : "🎯"
                            }

                        </div>


                        <div>

                            <h3>

                                ${meta.nome}

                            </h3>


                            <small>

                                Prazo:
                                ${formatarData(
                                    meta.prazo
                                )}

                            </small>

                        </div>


                    </div>


                    <div class="meta-percent">

                        ${progresso.toFixed(0)}%

                    </div>


                </div>



                <!-- =================================
                        VALORES
                ================================== -->

                <div class="meta-values">


                    <div>

                        <span>

                            Guardado

                        </span>


                        <strong>

                            ${formatarMoeda(
                                valorGuardado
                            )}

                        </strong>

                    </div>


                    <div>

                        <span>

                            Meta

                        </span>


                        <strong>

                            ${formatarMoeda(
                                valorMeta
                            )}

                        </strong>

                    </div>


                </div>



                <!-- =================================
                        BARRA
                ================================== -->

                <div class="meta-progress">


                    <div
                        class="meta-progress-bar"
                        style="
                            width:${progresso}%;
                        "
                    ></div>


                </div>



                <!-- =================================
                        RESTANTE
                ================================== -->

                <div class="meta-values">


                    <div>

                        <span>

                            ${
                                concluida
                                    ? "Status"
                                    : "Falta"
                            }

                        </span>


                        <strong>

                            ${
                                concluida

                                    ? "Meta concluída! 🎉"

                                    : formatarMoeda(
                                        valorRestante
                                    )
                            }

                        </strong>

                    </div>


                    <div>

                        <span>

                            Criada em

                        </span>


                        <strong>

                            ${formatarData(
                                meta.criadaEm
                            )}

                        </strong>

                    </div>


                </div>



                <!-- =================================
                        HISTÓRICO
                ================================== -->

                <div class="meta-history">


                    <div class="meta-history-title">


                        <span>

                            Histórico de aportes

                        </span>


                        <span>

                            ${textoAportes}

                        </span>


                    </div>


                    <div class="meta-history-list">

                        ${renderizarHistoricoAportes(
                            meta.id
                        )}

                    </div>


                </div>



                <!-- =================================
                        BOTÕES
                ================================== -->

                <div class="meta-actions">


                    <button
                        type="button"
                        class="btn-adicionar-valor"
                        data-id="${meta.id}"

                        ${
                            concluida
                                ? "disabled"
                                : ""
                        }
                    >

                        ${
                            concluida
                                ? "Meta concluída"
                                : "+ Adicionar valor"
                        }

                    </button>


                    <button
                        type="button"
                        class="btn-remover-meta"
                        data-id="${meta.id}"
                    >

                        Excluir meta

                    </button>


                </div>

            `;


            listaMetas.appendChild(
                card
            );

        }
    );


    adicionarEventos();

}


/* =========================================
        ADICIONAR VALOR À META
========================================= */

function adicionarValorMeta(
    id
) {

    const meta =
        usuario.metas.find(
            function(meta) {

                return (
                    Number(meta.id) ===
                    Number(id)
                );

            }
        );


    if (!meta) {

        return;

    }


    const valorAtual =
        Number(
            meta.valorGuardado || 0
        );


    const valorMeta =
        Number(
            meta.valorMeta || 0
        );


    /* =====================================
            CONCLUÍDA
    ====================================== */

    if (
        valorAtual >= valorMeta
    ) {

        alert(
            "Essa meta já foi concluída!"
        );

        return;

    }


    /* =====================================
            DADOS FINANCEIROS
    ====================================== */

    const saldoInicial =
        Number(
            usuario.saldoInicial || 0
        );


    const entradas =
        Array.isArray(
            usuario.entradas
        )
            ? usuario.entradas
            : [];


    const gastos =
        Array.isArray(
            usuario.gastos
        )
            ? usuario.gastos
            : [];


    const totalEntradas =
        entradas.reduce(
            function(total, entrada) {

                return (
                    total +
                    Number(
                        entrada.valor || 0
                    )
                );

            },
            0
        );


    const totalGastos =
        gastos.reduce(
            function(total, gasto) {

                return (
                    total +
                    Number(
                        gasto.valor || 0
                    )
                );

            },
            0
        );


    const totalAportes =
        usuario.aportesMetas.reduce(
            function(total, aporte) {

                return (
                    total +
                    Number(
                        aporte.valor || 0
                    )
                );

            },
            0
        );


    const saldoDisponivel =
        saldoInicial +
        totalEntradas -
        totalGastos -
        totalAportes;


    /* =====================================
            RESTANTE
    ====================================== */

    const valorRestante =
        valorMeta -
        valorAtual;


    /* =====================================
            PEDIR VALOR
    ====================================== */

    const entrada =
        prompt(

            `Saldo disponível: ${
                formatarMoeda(
                    saldoDisponivel
                )
            }\n\n` +

            `Falta para a meta: ${
                formatarMoeda(
                    valorRestante
                )
            }\n\n` +

            "Quanto você quer adicionar à meta?"

        );


    if (
        entrada === null
    ) {

        return;

    }


    const valor =
        Number(
            String(
                entrada
            ).replace(",", ".")
        );


    /* =====================================
            VALIDAR
    ====================================== */

    if (
        isNaN(valor) ||
        valor <= 0
    ) {

        alert(
            "Digite um valor válido."
        );

        return;

    }


    if (
        valor > saldoDisponivel
    ) {

        alert(
            "Você não possui saldo disponível suficiente."
        );

        return;

    }


    if (
        valor > valorRestante
    ) {

        alert(
            "O valor informado é maior que o necessário para concluir a meta."
        );

        return;

    }


    /* =====================================
            ATUALIZAR META
    ====================================== */

    meta.valorGuardado =
        valorAtual +
        valor;


    /* =====================================
            REGISTRAR APORTES
    ====================================== */

    usuario.aportesMetas.push({

        id:
            Date.now(),

        metaId:
            meta.id,

        metaNome:
            meta.nome,

        valor:
            valor,

        data:
            new Date()
                .toISOString()
                .split("T")[0],

        tipo:
            "aporte"

    });


    /* =====================================
            SALVAR
    ====================================== */

    salvarDados();


    /* =====================================
            ATUALIZAR
    ====================================== */

    renderizarAlertas();

    renderizarMetas();


    alert(
        `Você adicionou ${
            formatarMoeda(valor)
        } à meta "${meta.nome}".`
    );

}


/* =========================================
        EVENTOS DOS BOTÕES
========================================= */

function adicionarEventos() {


    /* =====================================
            ADICIONAR VALOR
    ====================================== */

    const botoesAdicionar =
        document.querySelectorAll(
            ".btn-adicionar-valor"
        );


    botoesAdicionar.forEach(
        function(botao) {

            botao.addEventListener(
                "click",
                function() {

                    const id =
                        Number(
                            botao.dataset.id
                        );


                    adicionarValorMeta(
                        id
                    );

                }
            );

        }
    );


    /* =====================================
            EXCLUIR META
    ====================================== */

    const botoesRemover =
        document.querySelectorAll(
            ".btn-remover-meta"
        );


    botoesRemover.forEach(
        function(botao) {

            botao.addEventListener(
                "click",
                function() {

                    const id =
                        Number(
                            botao.dataset.id
                        );


                    const meta =
                        usuario.metas.find(
                            function(meta) {

                                return (
                                    Number(meta.id) ===
                                    id
                                );

                            }
                        );


                    if (!meta) {

                        return;

                    }


                    const confirmar =
                        confirm(
                            `Deseja excluir a meta "${meta.nome}"?`
                        );


                    if (!confirmar) {

                        return;

                    }


                    /* ===========================
                            REMOVER META
                    ============================ */

                    usuario.metas =
                        usuario.metas.filter(
                            function(meta) {

                                return (
                                    Number(meta.id) !==
                                    id
                                );

                            }
                        );


                    /* ===========================
                            REMOVER APORTES
                    ============================ */

                    usuario.aportesMetas =
                        usuario.aportesMetas.filter(
                            function(aporte) {

                                return (
                                    Number(aporte.metaId) !==
                                    id
                                );

                            }
                        );


                    salvarDados();


                    renderizarAlertas();

                    renderizarMetas();

                }
            );

        }
    );

}


/* =========================================
        BOTÃO SAIR
========================================= */

const botaoSair =
    document.getElementById("sair");


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

renderizarAlertas();

renderizarMetas();