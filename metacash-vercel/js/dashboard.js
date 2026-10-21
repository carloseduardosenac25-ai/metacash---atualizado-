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

const nomeUsuario =
    document.getElementById("nomeUsuario");

const saudacao =
    document.getElementById("saudacao");

const avatar =
    document.getElementById("avatar");

const dataAtual =
    document.getElementById("dataAtual");

function atualizarDataAtual() {
    if (!dataAtual) return;

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();

    dataAtual.textContent = `${dia}/${mes}/${ano}`;
    dataAtual.dateTime = `${ano}-${mes}-${dia}`;
}

atualizarDataAtual();

const saldoAtual =
    document.getElementById("saldoAtual");

const totalEntradas =
    document.getElementById("totalEntradas");

const totalGastos =
    document.getElementById("totalGastos");

const categoriasLista =
    document.getElementById("categoriasLista");

const movimentacoesLista =
    document.getElementById("movimentacoesLista");

const alertasFinanceiros =
    document.getElementById("alertasFinanceiros");


/* =========================================
        DADOS
========================================= */

const entradas =
    Array.isArray(usuario.entradas)
        ? usuario.entradas
        : [];

const gastos =
    Array.isArray(usuario.gastos)
        ? usuario.gastos
        : [];

const aportesMetas =
    Array.isArray(usuario.aportesMetas)
        ? usuario.aportesMetas
        : [];

const categoriasOriginais =
    Array.isArray(usuario.categorias)
        ? usuario.categorias
        : [];


/* =========================================
        CONFIGURAÇÕES DOS AVISOS
========================================= */

if (!usuario.alertas) {

    usuario.alertas = {

        limiteCategoria: 80,

        saldoMinimo: 50,

        comparacaoMensal: true

    };

}


const limiteAlertaCategoria =
    Number(
        usuario.alertas.limiteCategoria || 80
    );


const saldoMinimoAlerta =
    Number(
        usuario.alertas.saldoMinimo ?? 50
    );


const comparacaoMensalAtiva =
    usuario.alertas.comparacaoMensal !== false;


/* =========================================
        NORMALIZAR CATEGORIAS
========================================= */

const categorias =
    categoriasOriginais.map(
        function (categoria, index) {

            if (
                typeof categoria === "object" &&
                categoria !== null
            ) {

                return {

                    nome:
                        String(
                            categoria.nome ||
                            "Outros"
                        ),

                    percentual:
                        Number(
                            categoria.percentual || 0
                        ),

                    index:
                        index

                };

            }


            return {

                nome:
                    String(categoria),

                percentual:
                    0,

                index:
                    index

            };

        }
    );


/* =========================================
        INFORMAÇÕES DO USUÁRIO
========================================= */

const nome =
    usuario.nome || "Usuário";


if (nomeUsuario) {

    nomeUsuario.textContent =
        nome;

}


if (saudacao) {

    saudacao.textContent =
        `Olá, ${nome}! 👋`;

}


if (avatar) {

    avatar.textContent =
        nome
            .charAt(0)
            .toUpperCase();

}


/* =========================================
        VALORES FINANCEIROS
========================================= */

const saldoInicial =
    Number(
        usuario.saldoInicial || 0
    );


const somaEntradas =
    entradas.reduce(
        function (total, entrada) {

            return (
                total +
                Number(
                    entrada.valor || 0
                )
            );

        },
        0
    );


const somaGastos =
    gastos.reduce(
        function (total, gasto) {

            return (
                total +
                Number(
                    gasto.valor || 0
                )
            );

        },
        0
    );


const somaAportesMetas =
    aportesMetas.reduce(
        function (total, aporte) {

            return (
                total +
                Number(
                    aporte.valor || 0
                )
            );

        },
        0
    );


/* =========================================
        SALDO DISPONÍVEL
========================================= */

const saldo =
    saldoInicial +
    somaEntradas -
    somaGastos -
    somaAportesMetas;


/* =========================================
        BASE FINANCEIRA
========================================= */

const baseFinanceira =
    saldoInicial +
    somaEntradas;


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
        ATUALIZAR CARDS
========================================= */

if (saldoAtual) {

    saldoAtual.textContent =
        formatarMoeda(saldo);

}


if (totalEntradas) {

    totalEntradas.textContent =
        formatarMoeda(somaEntradas);

}


if (totalGastos) {

    totalGastos.textContent =
        formatarMoeda(somaGastos);

}


/* =========================================
        METODOLOGIA
========================================= */

const categoriasNecessidades = [

    "Alimentação",

    "Transporte",

    "Estudos"

];


const categoriasLazer = [

    "Jogos",

    "Streaming",

    "Compras",

    "Lazer",

    "Figurinhas"

];


/* =========================================
        NORMALIZAR TEXTO
========================================= */

function normalizarNome(nome) {

    return String(nome)
        .trim()
        .toLowerCase();

}


/* =========================================
        GRUPO DA CATEGORIA
========================================= */

function obterGrupoCategoria(
    nomeCategoria
) {

    const nomeNormalizado =
        normalizarNome(
            nomeCategoria
        );


    if (
        categoriasNecessidades
            .map(normalizarNome)
            .includes(nomeNormalizado)
    ) {

        return "necessidades";

    }


    if (
        categoriasLazer
            .map(normalizarNome)
            .includes(nomeNormalizado)
    ) {

        return "lazer";

    }


    return "outros";

}


/* =========================================
        CALCULAR GASTO DA CATEGORIA
========================================= */

function calcularGastoCategoria(
    nomeCategoria
) {

    const nomeNormalizado =
        normalizarNome(
            nomeCategoria
        );


    return gastos.reduce(
        function (total, gasto) {

            const categoriaGasto =
                normalizarNome(
                    gasto.categoria || ""
                );


            if (
                categoriaGasto ===
                nomeNormalizado
            ) {

                return (
                    total +
                    Number(
                        gasto.valor || 0
                    )
                );

            }


            return total;

        },
        0
    );

}


/* =========================================
        LIMITES
========================================= */

const limiteNecessidades =
    baseFinanceira * 0.50;


const limiteLazer =
    baseFinanceira * 0.30;


const qtdNecessidades =
    categorias.filter(
        function (categoria) {

            return (
                obterGrupoCategoria(
                    categoria.nome
                ) === "necessidades"
            );

        }
    ).length;


const qtdLazer =
    categorias.filter(
        function (categoria) {

            return (
                obterGrupoCategoria(
                    categoria.nome
                ) === "lazer"
            );

        }
    ).length;


/* =========================================
        LIMITE DA CATEGORIA
========================================= */

function obterLimiteCategoria(
    categoria
) {

    if (
        categoria.percentual > 0
    ) {

        return (
            baseFinanceira *
            categoria.percentual /
            100
        );

    }


    const grupo =
        obterGrupoCategoria(
            categoria.nome
        );


    if (
        grupo === "necessidades" &&
        qtdNecessidades > 0
    ) {

        return (
            limiteNecessidades /
            qtdNecessidades
        );

    }


    if (
        grupo === "lazer" &&
        qtdLazer > 0
    ) {

        return (
            limiteLazer /
            qtdLazer
        );

    }


    return 0;

}


/* =========================================
        ÍCONES DAS CATEGORIAS
========================================= */

function obterIcone(
    categoria
) {

    const icones = {

        "Jogos": "🎮",

        "Alimentação": "🍔",

        "Transporte": "🚌",

        "Streaming": "🎬",

        "Compras": "🛍️",

        "Estudos": "📚",

        "Lazer": "🎮",

        "Figurinhas": "⚽",

        "Outros": "📦"

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

    if (!categoriasLista) {

        return;

    }


    categoriasLista.innerHTML =
        "";


    if (
        categorias.length === 0
    ) {

        categoriasLista.innerHTML = `

            <p class="empty-category">

                Nenhuma categoria cadastrada.

            </p>

        `;

        return;

    }


    categorias.forEach(
        function (categoria) {

            const nomeCategoria =
                categoria.nome;


            const gastoCategoria =
                calcularGastoCategoria(
                    nomeCategoria
                );


            const limiteCategoria =
                obterLimiteCategoria(
                    categoria
                );


            let porcentagemUsada =
                0;


            if (
                limiteCategoria > 0
            ) {

                porcentagemUsada =
                    (
                        gastoCategoria /
                        limiteCategoria
                    ) * 100;

            }


            const grupo =
                obterGrupoCategoria(
                    nomeCategoria
                );


            let cor =
                "#51CF66";


            if (
                grupo === "necessidades"
            ) {

                cor =
                    "#6268DF";

            }


            if (
                grupo === "lazer"
            ) {

                cor =
                    "#D84AC7";

            }


            if (
                porcentagemUsada >=
                limiteAlertaCategoria
            ) {

                cor =
                    "#FFD93D";

            }


            if (
                porcentagemUsada >= 100
            ) {

                cor =
                    "#FF6B6B";

            }


            const div =
                document.createElement(
                    "div"
                );


            div.classList.add(
                "category-row"
            );


            div.innerHTML = `

                <div class="category-top">

                    <div class="category-left">

                        <div class="category-icon">

                            ${obterIcone(
                                nomeCategoria
                            )}

                        </div>


                        <div class="category-info">

                            <strong>

                                ${nomeCategoria}

                            </strong>


                            <small>

                                ${formatarMoeda(
                                    gastoCategoria
                                )}

                                ${
                                    limiteCategoria > 0

                                        ? ` de ${formatarMoeda(
                                            limiteCategoria
                                        )}`

                                        : ""
                                }

                            </small>

                        </div>

                    </div>


                    <div class="category-percent">

                        ${
                            limiteCategoria > 0

                                ? `${Math.min(
                                    porcentagemUsada,
                                    100
                                ).toFixed(0)}%`

                                : "—"
                        }

                    </div>

                </div>


                <div class="category-progress">

                    <div
                        class="category-progress-bar"
                        style="
                            width:
                            ${Math.min(
                                porcentagemUsada,
                                100
                            )}%;

                            background:
                            ${cor};
                        "
                    ></div>

                </div>

            `;


            categoriasLista.appendChild(
                div
            );

        }
    );

}


/* =========================================
        DATA
========================================= */

function obterMesAtual() {

    const hoje =
        new Date();


    return {

        ano:
            hoje.getFullYear(),

        mes:
            hoje.getMonth()

    };

}


/* =========================================
        DATA → MÊS
========================================= */

function obterMesDaData(
    data
) {

    if (!data) {

        return null;

    }


    if (
        data.includes("-")
    ) {

        const partes =
            data.split("-");


        if (
            partes.length === 3
        ) {

            return {

                ano:
                    Number(partes[0]),

                mes:
                    Number(partes[1]) - 1

            };

        }

    }


    if (
        data.includes("/")
    ) {

        const partes =
            data.split("/");


        if (
            partes.length === 3
        ) {

            return {

                ano:
                    Number(partes[2]),

                mes:
                    Number(partes[1]) - 1

            };

        }

    }


    return null;

}


/* =========================================
        VERIFICAR MÊS
========================================= */

function pertenceAoMes(
    data,
    ano,
    mes
) {

    const resultado =
        obterMesDaData(
            data
        );


    if (!resultado) {

        return false;

    }


    return (
        resultado.ano === ano &&
        resultado.mes === mes
    );

}


/* =========================================
        GASTOS DO MÊS
========================================= */

function calcularGastosDoMes(
    ano,
    mes
) {

    return gastos.reduce(
        function (total, gasto) {

            if (
                pertenceAoMes(
                    gasto.data,
                    ano,
                    mes
                )
            ) {

                return (
                    total +
                    Number(
                        gasto.valor || 0
                    )
                );

            }


            return total;

        },
        0
    );

}


/* =========================================
        MÉDIA MENSAL
========================================= */

function calcularMediaMensalGastos() {

    const mesesComGastos = {};


    gastos.forEach(
        function (gasto) {

            const data =
                obterMesDaData(
                    gasto.data
                );


            if (!data) {

                return;

            }


            const chave =
                `${data.ano}-${data.mes}`;


            if (
                !mesesComGastos[chave]
            ) {

                mesesComGastos[chave] =
                    0;

            }


            mesesComGastos[chave] +=
                Number(
                    gasto.valor || 0
                );

        }
    );


    const valores =
        Object.values(
            mesesComGastos
        );


    if (
        valores.length === 0
    ) {

        return 0;

    }


    const total =
        valores.reduce(
            function (soma, valor) {

                return (
                    soma +
                    valor
                );

            },
            0
        );


    return (
        total /
        valores.length
    );

}


/* =========================================
        GASTOS DA CATEGORIA NO MÊS
========================================= */

function calcularCategoriaNoMes(
    categoria,
    ano,
    mes
) {

    const categoriaNormalizada =
        normalizarNome(
            categoria
        );


    return gastos.reduce(
        function (total, gasto) {

            const categoriaGasto =
                normalizarNome(
                    gasto.categoria || ""
                );


            if (
                categoriaGasto !==
                categoriaNormalizada
            ) {

                return total;

            }


            if (
                !pertenceAoMes(
                    gasto.data,
                    ano,
                    mes
                )
            ) {

                return total;

            }


            return (
                total +
                Number(
                    gasto.valor || 0
                )
            );

        },
        0
    );

}


/* =========================================
        VARIAÇÃO
========================================= */

function calcularVariacao(
    atual,
    anterior
) {

    if (
        anterior === 0
    ) {

        return atual > 0
            ? 100
            : 0;

    }


    return (
        (
            (
                atual -
                anterior
            ) /
            anterior
        ) * 100
    );

}


/* =========================================
        CRIAR ALERTA
========================================= */

function criarAlerta({
    prioridade,
    tipo,
    icone,
    titulo,
    mensagem
}) {

    return {

        prioridade:
            prioridade,

        tipo:
            tipo,

        icone:
            icone,

        titulo:
            titulo,

        mensagem:
            mensagem

    };

}


/* =========================================
        ALERTAS FINANCEIROS
========================================= */

function renderizarAlertasFinanceiros() {

    if (!alertasFinanceiros) {

        return;

    }


    alertasFinanceiros.innerHTML =
        "";


    const alertas = [];


    /* =====================================
            GRUPOS
    ====================================== */

    let gastosNecessidades =
        0;


    let gastosLazer =
        0;


    gastos.forEach(
        function (gasto) {

            const categoria =
                normalizarNome(
                    gasto.categoria ||
                    ""
                );


            const valor =
                Number(
                    gasto.valor || 0
                );


            if (
                categoriasNecessidades
                    .map(normalizarNome)
                    .includes(categoria)
            ) {

                gastosNecessidades +=
                    valor;

            }


            if (
                categoriasLazer
                    .map(normalizarNome)
                    .includes(categoria)
            ) {

                gastosLazer +=
                    valor;

            }

        }
    );


    /* =====================================
            50/30/20
    ====================================== */

    const percentualNecessidades =
        baseFinanceira > 0

            ? (
                gastosNecessidades /
                baseFinanceira
            ) * 100

            : 0;


    const percentualLazer =
        baseFinanceira > 0

            ? (
                gastosLazer /
                baseFinanceira
            ) * 100

            : 0;


    const economiaAtual =
        Math.max(
            baseFinanceira -
            somaGastos -
            somaAportesMetas,
            0
        );


    const percentualEconomia =
        baseFinanceira > 0

            ? (
                economiaAtual /
                baseFinanceira
            ) * 100

            : 0;


    /* =====================================
            NECESSIDADES
    ====================================== */

    if (
        percentualNecessidades > 50
    ) {

        alertas.push(
            criarAlerta({

                prioridade: 2,

                tipo:
                    "atencao",

                icone:
                    "⚠️",

                titulo:
                    "Necessidades acima do limite",

                mensagem:
                    `Seus gastos com necessidades chegaram a ${percentualNecessidades.toFixed(1)}%. O limite planejado é 50%.`

            })
        );

    }


    /* =====================================
            LAZER
    ====================================== */

    if (
        percentualLazer > 30
    ) {

        alertas.push(
            criarAlerta({

                prioridade: 2,

                tipo:
                    "atencao",

                icone:
                    "🎮",

                titulo:
                    "Atenção aos gastos de lazer",

                mensagem:
                    `Você já utilizou ${percentualLazer.toFixed(1)}% da sua base financeira com lazer. O limite planejado é 30%.`

            })
        );

    }


    /* =====================================
            ECONOMIA
    ====================================== */

    if (
        baseFinanceira > 0 &&
        percentualEconomia < 20
    ) {

        alertas.push(
            criarAlerta({

                prioridade: 2,

                tipo:
                    "atencao",

                icone:
                    "💰",

                titulo:
                    "Economia abaixo da meta",

                mensagem:
                    `Sua economia está em ${percentualEconomia.toFixed(1)}%. A meta é de pelo menos 20%.`

            })
        );

    }


    /* =====================================
            COMPARAÇÃO MENSAL
    ====================================== */

    if (
        comparacaoMensalAtiva
    ) {

        const mesAtual =
            obterMesAtual();


        let mesAnterior =
            mesAtual.mes - 1;


        let anoAnterior =
            mesAtual.ano;


        if (
            mesAnterior < 0
        ) {

            mesAnterior =
                11;

            anoAnterior--;

        }


        const gastosMesAtual =
            calcularGastosDoMes(
                mesAtual.ano,
                mesAtual.mes
            );


        const gastosMesAnterior =
            calcularGastosDoMes(
                anoAnterior,
                mesAnterior
            );


        const variacaoGastos =
            calcularVariacao(
                gastosMesAtual,
                gastosMesAnterior
            );


        /* ================================
                AUMENTO
        ================================= */

        if (
            gastosMesAnterior > 0 &&
            variacaoGastos >= 20
        ) {

            alertas.push(
                criarAlerta({

                    prioridade: 2,

                    tipo:
                        "atencao",

                    icone:
                        "📈",

                    titulo:
                        "Seus gastos aumentaram",

                    mensagem:
                        `Seus gastos deste mês aumentaram ${variacaoGastos.toFixed(0)}% em relação ao mês anterior.`

                })
            );

        }


        /* ================================
                REDUÇÃO
        ================================= */

        if (
            gastosMesAnterior > 0 &&
            variacaoGastos <= -20
        ) {

            alertas.push(
                criarAlerta({

                    prioridade: 3,

                    tipo:
                        "sucesso",

                    icone:
                        "📉",

                    titulo:
                        "Você está gastando menos",

                    mensagem:
                        `Seus gastos diminuíram ${Math.abs(
                            variacaoGastos
                        ).toFixed(0)}% em relação ao mês anterior.`

                })
            );

        }


        /* ================================
                CATEGORIAS
        ================================= */

        categorias.forEach(
            function (categoria) {

                const atual =
                    calcularCategoriaNoMes(
                        categoria.nome,
                        mesAtual.ano,
                        mesAtual.mes
                    );


                const anterior =
                    calcularCategoriaNoMes(
                        categoria.nome,
                        anoAnterior,
                        mesAnterior
                    );


                const variacao =
                    calcularVariacao(
                        atual,
                        anterior
                    );


                if (
                    anterior > 0 &&
                    variacao >= 30
                ) {

                    alertas.push(
                        criarAlerta({

                            prioridade: 2,

                            tipo:
                                "atencao",

                            icone:
                                "📊",

                            titulo:
                                `Aumento em ${categoria.nome}`,

                            mensagem:
                                `Seus gastos com ${categoria.nome} aumentaram ${variacao.toFixed(0)}% em relação ao mês anterior.`

                        })
                    );

                }

            }
        );

    }


    /* =====================================
            ANÁLISE DO SALDO
    ====================================== */

    /* -------------------------------------
            SALDO NEGATIVO
    ------------------------------------- */

    if (
        saldo < 0
    ) {

        alertas.push(
            criarAlerta({

                prioridade: 1,

                tipo:
                    "perigo",

                icone:
                    "🚨",

                titulo:
                    "Seu saldo está negativo",

                mensagem:
                    `Seus compromissos ultrapassaram o dinheiro disponível em ${formatarMoeda(
                        Math.abs(saldo)
                    )}.`

            })
        );

    }


    /* -------------------------------------
            SALDO ABAIXO DO MÍNIMO
    ------------------------------------- */

    else if (
        saldo < saldoMinimoAlerta
    ) {

        alertas.push(
            criarAlerta({

                prioridade: 2,

                tipo:
                    "atencao",

                icone:
                    "⚠️",

                titulo:
                    "Seu saldo está abaixo do mínimo",

                mensagem:
                    `Seu saldo atual é ${formatarMoeda(
                        saldo
                    )}. O limite configurado é ${formatarMoeda(
                        saldoMinimoAlerta
                    )}.`

            })
        );

    }


    /* -------------------------------------
            SALDO ABAIXO DO PADRÃO
    ------------------------------------- */

    const mediaMensalGastos =
        calcularMediaMensalGastos();


    if (
        saldo >= 0 &&
        mediaMensalGastos > 0 &&
        saldo <
        (
            mediaMensalGastos *
            0.25
        )
    ) {

        alertas.push(
            criarAlerta({

                prioridade: 2,

                tipo:
                    "atencao",

                icone:
                    "💳",

                titulo:
                    "Seu saldo está abaixo do seu padrão",

                mensagem:
                    `Você possui ${formatarMoeda(
                        saldo
                    )}, enquanto seu gasto médio mensal é ${formatarMoeda(
                        mediaMensalGastos
                    )}.`

            })
        );

    }


    /* =====================================
            ALERTAS POR CATEGORIA
    ====================================== */

    categorias.forEach(
        function (categoria) {

            const gastoCategoria =
                calcularGastoCategoria(
                    categoria.nome
                );


            const limiteCategoria =
                obterLimiteCategoria(
                    categoria
                );


            if (
                limiteCategoria <= 0
            ) {

                return;

            }


            const porcentagemUsada =
                (
                    gastoCategoria /
                    limiteCategoria
                ) * 100;


            /* ================================
                    LIMITE ULTRAPASSADO
            ================================= */

            if (
                porcentagemUsada >= 100
            ) {

                alertas.push(
                    criarAlerta({

                        prioridade: 1,

                        tipo:
                            "perigo",

                        icone:
                            "🚨",

                        titulo:
                            `Limite ultrapassado: ${categoria.nome}`,

                        mensagem:
                            `Você ultrapassou o limite planejado dessa categoria.`

                    })
                );

            }


            /* ================================
                    ALERTA PERSONALIZADO
            ================================= */

            else if (
                porcentagemUsada >=
                limiteAlertaCategoria
            ) {

                alertas.push(
                    criarAlerta({

                        prioridade: 2,

                        tipo:
                            "atencao",

                        icone:
                            "⚠️",

                        titulo:
                            `Atenção com ${categoria.nome}`,

                        mensagem:
                            `Você já utilizou ${porcentagemUsada.toFixed(0)}% do limite dessa categoria.`

                    })
                );

            }

        }
    );


    /* =====================================
            NENHUM ALERTA
    ====================================== */

    if (
        alertas.length === 0
    ) {

        alertas.push(
            criarAlerta({

                prioridade: 3,

                tipo:
                    "sucesso",

                icone:
                    "✅",

                titulo:
                    "Suas finanças estão dentro do planejado",

                mensagem:
                    "Nenhum comportamento financeiro preocupante foi identificado neste momento."

            })
        );

    }


    /* =====================================
            ORDENAR POR PRIORIDADE
    ====================================== */

    alertas.sort(
        function (a, b) {

            return (
                a.prioridade -
                b.prioridade
            );

        }
    );


    /* =====================================
            LIMITAR ALERTAS
    ====================================== */

    const alertasExibidos =
        alertas.slice(
            0,
            5
        );


    /* =====================================
            MOSTRAR ALERTAS
    ====================================== */

    alertasExibidos.forEach(
        function (alerta) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                `alerta-financeiro ${alerta.tipo}`;


            div.innerHTML = `

                <div class="alerta-financeiro-icon">

                    ${alerta.icone}

                </div>


                <div class="alerta-financeiro-info">

                    <strong>

                        ${alerta.titulo}

                    </strong>


                    <p>

                        ${alerta.mensagem}

                    </p>

                </div>

            `;


            alertasFinanceiros.appendChild(
                div
            );

        }
    );

}


/* =========================================
        CONVERTER DATA
========================================= */

function converterData(data) {

    if (!data) {

        return 0;

    }


    if (
        data.includes("/")
    ) {

        const partes =
            data.split("/");


        if (
            partes.length === 3
        ) {

            return new Date(
                Number(partes[2]),
                Number(partes[1]) - 1,
                Number(partes[0])
            ).getTime();

        }

    }


    if (
        data.includes("-")
    ) {

        const partes =
            data.split("-");


        if (
            partes.length === 3
        ) {

            return new Date(
                Number(partes[0]),
                Number(partes[1]) - 1,
                Number(partes[2])
            ).getTime();

        }

    }


    return 0;

}


/* =========================================
        ÚLTIMAS MOVIMENTAÇÕES
========================================= */

function renderizarMovimentacoes() {

    if (!movimentacoesLista) {

        return;

    }


    const movimentacoes = [];


    /* =====================================
            GASTOS
    ====================================== */

    gastos.forEach(
        function (gasto) {

            movimentacoes.push({

                tipo:
                    "gasto",

                valor:
                    Number(
                        gasto.valor || 0
                    ),

                categoria:
                    gasto.categoria ||
                    "Outros",

                descricao:
                    gasto.descricao ||
                    "Gasto",

                data:
                    gasto.data ||
                    ""

            });

        }
    );


    /* =====================================
            ENTRADAS
    ====================================== */

    entradas.forEach(
        function (entrada) {

            movimentacoes.push({

                tipo:
                    "entrada",

                valor:
                    Number(
                        entrada.valor || 0
                    ),

                categoria:
                    entrada.tipo ||
                    "Entrada",

                descricao:
                    entrada.descricao ||
                    "Entrada",

                data:
                    entrada.data ||
                    ""

            });

        }
    );


    /* =====================================
            APORTES
    ====================================== */

    aportesMetas.forEach(
        function (aporte) {

            movimentacoes.push({

                tipo:
                    "aporte",

                valor:
                    Number(
                        aporte.valor || 0
                    ),

                categoria:
                    "Meta",

                descricao:
                    `Meta: ${
                        aporte.metaNome ||
                        "Objetivo"
                    }`,

                data:
                    aporte.data ||
                    ""

            });

        }
    );


    /* =====================================
            ORDENAR
    ====================================== */

    movimentacoes.sort(
        function (a, b) {

            return (
                converterData(b.data) -
                converterData(a.data)
            );

        }
    );


    /* =====================================
            5 MAIS RECENTES
    ====================================== */

    const ultimas =
        movimentacoes.slice(
            0,
            5
        );


    /* =====================================
            VAZIO
    ====================================== */

    if (
        ultimas.length === 0
    ) {

        movimentacoesLista.innerHTML = `

            <p class="empty-movements">

                Nenhuma movimentação registrada.

            </p>

        `;

        return;

    }


    movimentacoesLista.innerHTML =
        "";


    /* =====================================
            MOSTRAR
    ====================================== */

    ultimas.forEach(
        function (mov) {

            const div =
                document.createElement(
                    "div"
                );


            div.classList.add(
                "movement-item"
            );


            if (
                mov.tipo === "gasto"
            ) {

                div.classList.add(
                    "movement-expense"
                );

            }
            else {

                div.classList.add(
                    "movement-income"
                );

            }


            const sinal =
                mov.tipo === "entrada"
                    ? "+"
                    : "−";


            const icone =
                mov.tipo === "entrada"
                    ? "↑"
                    : mov.tipo === "aporte"
                        ? "🎯"
                        : "↓";


            div.innerHTML = `

                <div class="movement-icon">

                    ${icone}

                </div>


                <div class="movement-info">

                    <strong>

                        ${mov.descricao}

                    </strong>


                    <small>

                        ${mov.categoria}

                        ${
                            mov.data
                                ? " • " +
                                  mov.data
                                : ""
                        }

                    </small>

                </div>


                <div class="movement-value">

                    ${sinal}

                    ${formatarMoeda(
                        mov.valor
                    )}

                </div>

            `;


            movimentacoesLista.appendChild(
                div
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
        function () {

            const confirmar =
                confirm(
                    "Deseja realmente sair?"
                );


            if (!confirmar) {

                return;

            }


            localStorage.removeItem(
                "usuario"
            );


            window.location.href =
                "../meta/index.html";

        }
    );

}


/* =========================================
        INICIALIZAÇÃO
========================================= */

renderizarCategorias();

renderizarAlertasFinanceiros();

renderizarMovimentacoes();