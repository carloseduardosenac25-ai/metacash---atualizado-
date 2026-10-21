const fs = require('fs');
const vm = require('vm');

const script = fs.readFileSync('./js/relatorio.js', 'utf8');

function makeElement(id) {
  return {
    id,
    textContent: '',
    style: {},
    className: '',
    innerHTML: '',
    value: '',
    checked: false,
    appendChild() {},
    addEventListener() {},
    focus() {},
    querySelectorAll() { return []; },
  };
}

const elements = {
  relatorioEntradas: makeElement('relatorioEntradas'),
  relatorioGastos: makeElement('relatorioGastos'),
  relatorioSaldo: makeElement('relatorioSaldo'),
  detalhamentoCategorias: makeElement('detalhamentoCategorias'),
  mesRelatorio: makeElement('mesRelatorio'),
  anoRelatorio: makeElement('anoRelatorio'),
  statusMetodologia: makeElement('statusMetodologia'),
  percentualNecessidades: makeElement('percentualNecessidades'),
  percentualLazer: makeElement('percentualLazer'),
  percentualEconomia: makeElement('percentualEconomia'),
  barraNecessidades: makeElement('barraNecessidades'),
  barraLazer: makeElement('barraLazer'),
  barraEconomia: makeElement('barraEconomia'),
  feedbackNecessidades: makeElement('feedbackNecessidades'),
  feedbackLazer: makeElement('feedbackLazer'),
  feedbackEconomia: makeElement('feedbackEconomia'),
  graficoCategorias: makeElement('graficoCategorias'),
  graficoEntradasGastos: makeElement('graficoEntradasGastos'),
};

const usuario = {
  nome: 'Teste',
  saldoInicial: 1000,
  entradaInicial: {
    valor: 1000,
    data: '2026-09-01',
  },
  entradas: [
    { valor: 500, data: '2026-09-10', categoria: 'Salário' },
  ],
  gastos: [
    { valor: 200, data: '2026-09-12', categoria: 'Alimentação' },
    { valor: 100, data: '2026-09-15', categoria: 'Streaming' },
  ],
  metas: [],
  aportesMetas: [],
  alertas: {
    limiteCategoria: 80,
    saldoMinimo: 50,
    comparacaoMensal: true,
  },
};

const context = {
  console,
  localStorage: {
    getItem: () => JSON.stringify(usuario),
  },
  document: {
    getElementById: (id) => elements[id] || null,
  },
  window: { location: { href: '' } },
  Chart: function Chart() {
    this.destroy = function () {};
  },
  setTimeout,
  Number,
  Array,
  Object,
  String,
  Math,
  Date,
  JSON,
  isNaN,
};

context.global = context;
context.globalThis = context;

try {
  vm.runInNewContext(script, context);
  console.log('OK: relatório carregou sem erro');
} catch (error) {
  console.error('ERRO:', error && error.message);
  process.exit(1);
}
