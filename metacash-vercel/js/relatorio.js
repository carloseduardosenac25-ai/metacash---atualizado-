/* =========================================
    METACASH
    RELATÓRIOS
========================================= */

const usuarioSalvo = localStorage.getItem('usuario');

if (!usuarioSalvo) {
    window.location.href = '../meta/index.html';
    throw new Error('Usuário não encontrado.');
}

let usuario;

try {
    usuario = JSON.parse(usuarioSalvo);
} catch (erro) {
    console.error('Erro ao carregar usuário:', erro);
    localStorage.removeItem('usuario');
    window.location.href = '../meta/index.html';
    throw erro;
}

const entradas = Array.isArray(usuario.entradas) ? usuario.entradas : [];
const gastos = Array.isArray(usuario.gastos) ? usuario.gastos : [];
const aportesMetas = Array.isArray(usuario.aportesMetas) ? usuario.aportesMetas : [];
const saldoInicial = Number(usuario.saldoInicial || 0);

const elementoEntradas = document.getElementById('relatorioEntradas');
const elementoGastos = document.getElementById('relatorioGastos');
const elementoSaldo = document.getElementById('relatorioSaldo');
const detalheCategorias = document.getElementById('detalhamentoCategorias');
const selectMes = document.getElementById('mesRelatorio');
const selectAno = document.getElementById('anoRelatorio');

const statusMetodologia = document.getElementById('statusMetodologia');
const percentualNecessidades = document.getElementById('percentualNecessidades');
const percentualLazer = document.getElementById('percentualLazer');
const percentualEconomia = document.getElementById('percentualEconomia');
const barraNecessidades = document.getElementById('barraNecessidades');
const barraLazer = document.getElementById('barraLazer');
const barraEconomia = document.getElementById('barraEconomia');
const feedbackNecessidades = document.getElementById('feedbackNecessidades');
const feedbackLazer = document.getElementById('feedbackLazer');
const feedbackEconomia = document.getElementById('feedbackEconomia');

let graficoCategorias = null;
let graficoEntradasGastos = null;

const categoriasNecessidades = ['Alimentação', 'Transporte', 'Estudos'];
const categoriasLazer = ['Jogos', 'Streaming', 'Compras', 'Lazer', 'Figurinhas'];

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function normalizarNome(texto) {
    return String(texto || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function obterData(data) {
    if (!data) return null;

    data = String(data).trim();

    if (data.includes('/')) {
        const partes = data.split('/');
        if (partes.length !== 3) return null;

        const dia = Number(partes[0]);
        const mes = Number(partes[1]) - 1;
        const ano = Number(partes[2]);

        if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;

        return { dia, mes, ano };
    }

    if (data.includes('-')) {
        const partes = data.split('-');
        if (partes.length < 3) return null;

        const ano = Number(partes[0]);
        const mes = Number(partes[1]) - 1;
        const dia = Number(partes[2].substring(0, 2));

        if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;

        return { dia, mes, ano };
    }

    return null;
}

function carregarAnos() {
    if (!selectAno) return;

    const anos = new Set();

    entradas.forEach(function (entrada) {
        const data = obterData(entrada.data);
        if (data) anos.add(data.ano);
    });

    gastos.forEach(function (gasto) {
        const data = obterData(gasto.data);
        if (data) anos.add(data.ano);
    });

    aportesMetas.forEach(function (aporte) {
        const data = obterData(aporte.data);
        if (data) anos.add(data.ano);
    });

    anos.add(new Date().getFullYear());
    const listaAnos = Array.from(anos).sort(function (a, b) {
        return b - a;
    });

    selectAno.innerHTML = '';

    listaAnos.forEach(function (ano) {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        selectAno.appendChild(option);
    });
}

function filtrarPorPeriodo(lista, mesSelecionado, anoSelecionado) {
    return lista.filter(function (item) {
        const data = obterData(item.data);
        if (!data) return false;

        const anoCorreto = data.ano === Number(anoSelecionado);
        const mesCorreto = mesSelecionado === 'todos' || data.mes === Number(mesSelecionado);

        return anoCorreto && mesCorreto;
    });
}

function atualizarRelatorio() {
    const mesSelecionado = selectMes ? selectMes.value : 'todos';
    const anoSelecionado = selectAno ? selectAno.value : String(new Date().getFullYear());

    const entradasFiltradas = filtrarPorPeriodo(entradas, mesSelecionado, anoSelecionado);
    const gastosFiltrados = filtrarPorPeriodo(gastos, mesSelecionado, anoSelecionado);
    const aportesFiltrados = filtrarPorPeriodo(aportesMetas, mesSelecionado, anoSelecionado);

    const totalEntradas = entradasFiltradas.reduce(function (total, entrada) {
        return total + Number(entrada.valor || 0);
    }, 0);

    const totalGastos = gastosFiltrados.reduce(function (total, gasto) {
        return total + Number(gasto.valor || 0);
    }, 0);

    const totalAportes = aportesFiltrados.reduce(function (total, aporte) {
        return total + Number(aporte.valor || 0);
    }, 0);

    // O saldo é acumulado: meses anteriores continuam compondo o saldo do período escolhido.
    function ocorreuAteFimDoPeriodo(item) {
        const data = obterData(item.data);
        if (!data) return false;

        const anoLimite = Number(anoSelecionado);
        if (data.ano < anoLimite) return true;
        if (data.ano > anoLimite) return false;

        if (mesSelecionado === 'todos') return true;
        return data.mes <= Number(mesSelecionado);
    }

    const entradasAcumuladas = entradas.filter(ocorreuAteFimDoPeriodo).reduce(function (total, entrada) {
        return total + Number(entrada.valor || 0);
    }, 0);
    const gastosAcumulados = gastos.filter(ocorreuAteFimDoPeriodo).reduce(function (total, gasto) {
        return total + Number(gasto.valor || 0);
    }, 0);
    const aportesAcumulados = aportesMetas.filter(ocorreuAteFimDoPeriodo).reduce(function (total, aporte) {
        return total + Number(aporte.valor || 0);
    }, 0);

    const saldoPeriodo = saldoInicial + entradasAcumuladas - gastosAcumulados - aportesAcumulados;

    if (elementoEntradas) {
        elementoEntradas.textContent = formatarMoeda(totalEntradas);
    }

    if (elementoGastos) {
        elementoGastos.textContent = formatarMoeda(totalGastos);
    }

    if (elementoSaldo) {
        elementoSaldo.textContent = formatarMoeda(saldoPeriodo);
    }

    const gastosPorCategoria = {};

    gastosFiltrados.forEach(function (gasto) {
        const categoria = gasto.categoria || 'Outros';
        const valor = Number(gasto.valor || 0);

        if (!gastosPorCategoria[categoria]) {
            gastosPorCategoria[categoria] = 0;
        }

        gastosPorCategoria[categoria] += valor;
    });

    mostrarDetalhamento(gastosPorCategoria, totalGastos);
    atualizarGraficoCategorias(gastosPorCategoria);
    atualizarGraficoComparacao(totalEntradas, totalGastos, totalAportes);
    analisarMetodologia(gastosFiltrados, totalEntradas, totalGastos, totalAportes);
}

function mostrarDetalhamento(gastosPorCategoria, totalGastos) {
    if (!detalheCategorias) return;

    detalheCategorias.innerHTML = '';

    const categorias = Object.entries(gastosPorCategoria);

    if (categorias.length === 0) {
        detalheCategorias.innerHTML = '<div class="empty-report"><span>Sem dados</span><p>Nenhum gasto registrado neste período.</p></div>';
        return;
    }

    categorias.sort(function (a, b) {
        return b[1] - a[1];
    });

    categorias.forEach(function (item) {
        const categoria = item[0];
        const valor = Number(item[1] || 0);
        const percentual = totalGastos > 0 ? (valor / totalGastos) * 100 : 0;

        const linha = document.createElement('div');
        linha.className = 'category-detail';
        linha.innerHTML = '<div class="category-detail-top"><span class="category-detail-name">' + categoria + '</span><span class="category-detail-value">' + formatarMoeda(valor) + ' · ' + percentual.toFixed(1) + '%</span></div><div class="category-bar"><div class="category-bar-fill" style="width:' + Math.min(percentual, 100) + '%"></div></div>';
        detalheCategorias.appendChild(linha);
    });
}

function atualizarGraficoCategorias(gastosPorCategoria) {
    const canvas = document.getElementById('graficoCategorias');

    if (!canvas || typeof Chart === 'undefined') return;

    if (graficoCategorias) {
        graficoCategorias.destroy();
        graficoCategorias = null;
    }

    const categorias = Object.keys(gastosPorCategoria);
    const valores = Object.values(gastosPorCategoria);

    if (categorias.length === 0) return;

    graficoCategorias = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: categorias,
            datasets: [{
                data: valores,
                borderWidth: 2,
                borderColor: '#071022',
                backgroundColor: ['#00d68f', '#6ecbff', '#ffd166', '#ff7f7f', '#8c7ae6', '#00b894', '#fd79a8', '#e17055']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#A8B2C4',
                        padding: 18,
                        font: { family: 'Poppins' }
                    }
                }
            }
        }
    });
}

function atualizarGraficoComparacao(totalEntradas, totalGastos, totalAportes) {
    const canvas = document.getElementById('graficoEntradasGastos');

    if (!canvas || typeof Chart === 'undefined') return;

    if (graficoEntradasGastos) {
        graficoEntradasGastos.destroy();
        graficoEntradasGastos = null;
    }

    graficoEntradasGastos = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Entradas', 'Gastos', 'Metas'],
            datasets: [{
                data: [totalEntradas, totalGastos, totalAportes],
                backgroundColor: ['#4ade80', '#ff8a8a', '#6ecbff'],
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: '#A8B2C4',
                        font: { family: 'Poppins' }
                    },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#657084',
                        callback: function (valor) {
                            return formatarMoeda(valor);
                        }
                    },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function analisarMetodologia(gastosFiltrados, totalEntradas, totalGastos, totalAportes) {
    if (!percentualNecessidades || !percentualLazer || !percentualEconomia) return;

    const baseFinanceira = saldoInicial + totalEntradas;

    if (baseFinanceira <= 0) {
        percentualNecessidades.textContent = '0%';
        percentualLazer.textContent = '0%';
        percentualEconomia.textContent = '0%';

        if (barraNecessidades) barraNecessidades.style.width = '0%';
        if (barraLazer) barraLazer.style.width = '0%';
        if (barraEconomia) barraEconomia.style.width = '0%';

        if (feedbackNecessidades) feedbackNecessidades.textContent = 'Nenhum valor disponível para análise.';
        if (feedbackLazer) feedbackLazer.textContent = 'Nenhum valor disponível para análise.';
        if (feedbackEconomia) feedbackEconomia.textContent = 'Nenhum valor disponível para análise.';

        if (statusMetodologia) {
            statusMetodologia.className = 'methodology-status';
            statusMetodologia.textContent = 'Informe um saldo inicial ou registre uma entrada.';
        }

        return;
    }

    let valorNecessidades = 0;
    let valorLazer = 0;

    gastosFiltrados.forEach(function (gasto) {
        const categoria = normalizarNome(gasto.categoria);
        const valor = Number(gasto.valor || 0);
        const necessidades = categoriasNecessidades.map(normalizarNome);
        const lazer = categoriasLazer.map(normalizarNome);

        if (necessidades.includes(categoria)) {
            valorNecessidades += valor;
        } else if (lazer.includes(categoria)) {
            valorLazer += valor;
        }
    });

    const valorEconomia = Math.max(baseFinanceira - totalGastos - totalAportes, 0);
    const porcentagemNecessidades = (valorNecessidades / baseFinanceira) * 100;
    const porcentagemLazer = (valorLazer / baseFinanceira) * 100;
    const porcentagemEconomia = (valorEconomia / baseFinanceira) * 100;

    percentualNecessidades.textContent = porcentagemNecessidades.toFixed(1) + '%';
    percentualLazer.textContent = porcentagemLazer.toFixed(1) + '%';
    percentualEconomia.textContent = porcentagemEconomia.toFixed(1) + '%';

    if (barraNecessidades) barraNecessidades.style.width = Math.min(porcentagemNecessidades, 100) + '%';
    if (barraLazer) barraLazer.style.width = Math.min(porcentagemLazer, 100) + '%';
    if (barraEconomia) barraEconomia.style.width = Math.min(porcentagemEconomia, 100) + '%';

    if (feedbackNecessidades) {
        feedbackNecessidades.textContent = porcentagemNecessidades <= 50 ? 'Dentro do limite planejado.' : 'Acima dos 50% planejados.';
    }

    if (feedbackLazer) {
        feedbackLazer.textContent = porcentagemLazer <= 30 ? 'Dentro do limite planejado.' : 'Acima dos 30% planejados.';
    }

    if (feedbackEconomia) {
        feedbackEconomia.textContent = porcentagemEconomia >= 20 ? 'Você atingiu a meta de economia.' : 'Sua economia está abaixo dos 20%.';
    }

    const necessidadesAcima = porcentagemNecessidades > 50;
    const lazerAcima = porcentagemLazer > 30;
    const economiaAbaixo = porcentagemEconomia < 20;

    if (statusMetodologia) {
        if (!necessidadesAcima && !lazerAcima && !economiaAbaixo) {
            statusMetodologia.className = 'methodology-status success';
            statusMetodologia.textContent = 'Sua distribuição está dentro das metas da metodologia 50/30/20.';
        } else {
            statusMetodologia.className = 'methodology-status warning';

            if (necessidadesAcima && lazerAcima) {
                statusMetodologia.textContent = 'Necessidades e lazer estão acima dos limites planejados.';
            } else if (necessidadesAcima) {
                statusMetodologia.textContent = 'Necessidades estão acima dos 50% planejados.';
            } else if (lazerAcima) {
                statusMetodologia.textContent = 'Lazer está acima dos 30% planejados.';
            } else {
                statusMetodologia.textContent = 'A economia está abaixo dos 20% planejados.';
            }
        }
    }
}

if (selectMes) {
    selectMes.addEventListener('change', atualizarRelatorio);
}

if (selectAno) {
    selectAno.addEventListener('change', atualizarRelatorio);
}

carregarAnos();

if (selectMes) {
    selectMes.value = 'todos';
}

if (selectAno) {
    selectAno.value = String(new Date().getFullYear());
}

atualizarRelatorio();
