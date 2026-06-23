const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const COUNT = 60;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle() {
  return {
    x: rand(0, canvas.width),
    y: rand(0, canvas.height),
    r: rand(1, 3.5),
    opacity: rand(0.1, 0.55),
    speedX: rand(-0.3, 0.3),
    speedY: rand(-0.6, -0.15),
    drift: rand(0, Math.PI * 2),
    driftSpeed: rand(0.005, 0.02)
  };
}

for (let i = 0; i < COUNT; i++) {
  particles.push(createParticle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.drift += p.driftSpeed;
    p.x += p.speedX + Math.sin(p.drift) * 0.3;
    p.y += p.speedY;

    if (p.y < -10) {
      p.y = canvas.height + 5;
      p.x = rand(0, canvas.width);
    }

    if (p.x < -10) p.x = canvas.width + 5;
    if (p.x > canvas.width + 10) p.x = -5;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100, 220, 80, ${p.opacity})`;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

// análise simples de clima e plantio
function analisar() {
  const localizacao = document.getElementById('localizacao').value.trim();
  const semente = document.getElementById('sementeEscolhida').value.trim();
  const resultado = document.getElementById('resultado');

  if (localizacao === '' || semente === '') {
    resultado.style.display = 'block';
    resultado.innerHTML = 'Preencha a localização e a semente escolhida para receber a recomendação.';
    return;
  }

  resultado.style.display = 'block';
  resultado.innerHTML = `
    <strong>Resultado da análise:</strong><br>
    Localização informada: ${localizacao}<br>
    Semente escolhida: ${semente}<br>
    Recomendação: aguarde a redução da chuva antes do plantio e mantenha o solo monitorado.
  `;
}

// pré-visualização de imagem da planta
function previewFoto(event) {
  const arquivo = event.target.files[0];
  const previewContainer = document.getElementById('previewContainer');
  const previewImg = document.getElementById('previewImg');
  const resultadoFoto = document.getElementById('resultadoFoto');

  if (!arquivo) {
    return;
  }

  previewImg.src = URL.createObjectURL(arquivo);
  previewContainer.style.display = 'block';
  resultadoFoto.style.display = 'none';
  resultadoFoto.innerHTML = '';
}

function analisarFoto() {
  const resultadoFoto = document.getElementById('resultadoFoto');
  resultadoFoto.style.display = 'block';
  resultadoFoto.innerHTML = 'Análise simulada: a planta apresenta aspecto regular. Recomenda-se verificar umidade do solo e observar possíveis manchas nas folhas.';
}

// carrinho simples no marketplace
const botoesComprar = document.querySelectorAll('.btn-comprar');
const quantidadeCarrinho = document.getElementById('quantidadeCarrinho');
const totalCarrinho = document.getElementById('totalCarrinho');
const listaCarrinho = document.getElementById('listaCarrinho');
const botaoLimparCarrinho = document.getElementById('limparCarrinho');

let carrinho = [];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarCarrinho() {
  let total = 0;
  listaCarrinho.innerHTML = '';

  carrinho.forEach(item => {
    total += item.preco;
    const li = document.createElement('li');
    li.textContent = `${item.produto} - ${formatarMoeda(item.preco)}`;
    listaCarrinho.appendChild(li);
  });

  quantidadeCarrinho.textContent = carrinho.length;
  totalCarrinho.textContent = formatarMoeda(total);
}

botoesComprar.forEach(botao => {
  botao.addEventListener('click', () => {
    const produto = botao.dataset.produto;
    const preco = Number(botao.dataset.preco);
    carrinho.push({ produto, preco });
    atualizarCarrinho();
  });
});

botaoLimparCarrinho.addEventListener('click', () => {
  carrinho = [];
  atualizarCarrinho();
});

// validação do formulário Fale Conosco
const formContato = document.getElementById('formContato');
const nomeCompleto = document.getElementById('nomeCompleto');
const emailContato = document.getElementById('emailContato');
const mensagemContato = document.getElementById('mensagemContato');
const erroNome = document.getElementById('erroNome');
const erroEmail = document.getElementById('erroEmail');
const erroMensagem = document.getElementById('erroMensagem');
const contadorMensagem = document.getElementById('contadorMensagem');
const mensagemSucesso = document.getElementById('mensagemSucesso');

function marcarCampo(campo, valido, mensagemErro, elementoErro) {
  if (valido) {
    campo.classList.remove('is-invalid');
    campo.classList.add('is-valid');
    elementoErro.textContent = '';
  } else {
    campo.classList.remove('is-valid');
    campo.classList.add('is-invalid');
    elementoErro.textContent = mensagemErro;
  }
}

function validarNomeCompleto() {
  const nome = nomeCompleto.value.trim().replace(/\s+/g, ' ');
  const partes = nome.split(' ');
  const letrasApenas = /^[A-Za-zÀ-ÿ\s']+$/.test(nome);

  if (nome === '') {
    marcarCampo(nomeCompleto, false, 'O nome completo não pode ficar em branco.', erroNome);
    return false;
  }

  if (!letrasApenas) {
    marcarCampo(nomeCompleto, false, 'Digite apenas letras no nome.', erroNome);
    return false;
  }

  if (partes.length < 2) {
    marcarCampo(nomeCompleto, false, 'Digite nome e sobrenome.', erroNome);
    return false;
  }

  if (partes[0].length < 2 || partes[partes.length - 1].length < 2) {
    marcarCampo(nomeCompleto, false, 'Nome e sobrenome precisam ter pelo menos 2 letras cada.', erroNome);
    return false;
  }

  marcarCampo(nomeCompleto, true, '', erroNome);
  return true;
}

function validarEmail() {
  const email = emailContato.value.trim();
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  if (email === '') {
    marcarCampo(emailContato, false, 'O e-mail não pode ficar em branco.', erroEmail);
    return false;
  }

  if (!formatoValido) {
    marcarCampo(emailContato, false, 'Digite um e-mail em formato válido.', erroEmail);
    return false;
  }

  marcarCampo(emailContato, true, '', erroEmail);
  return true;
}

function validarMensagem() {
  const mensagem = mensagemContato.value.trim();

  if (mensagem === '') {
    marcarCampo(mensagemContato, false, 'A descrição da mensagem não pode ficar em branco.', erroMensagem);
    return false;
  }

  if (mensagem.length > 500) {
    marcarCampo(mensagemContato, false, 'A mensagem deve ter no máximo 500 caracteres.', erroMensagem);
    return false;
  }

  marcarCampo(mensagemContato, true, '', erroMensagem);
  return true;
}

mensagemContato.addEventListener('input', () => {
  contadorMensagem.textContent = `${mensagemContato.value.length}/500`;
  validarMensagem();
});

nomeCompleto.addEventListener('input', validarNomeCompleto);
emailContato.addEventListener('input', validarEmail);

formContato.addEventListener('submit', function(event) {
  event.preventDefault();

  const nomeValido = validarNomeCompleto();
  const emailValido = validarEmail();
  const mensagemValida = validarMensagem();

  if (nomeValido && emailValido && mensagemValida) {
    mensagemSucesso.classList.remove('d-none');
    formContato.reset();
    contadorMensagem.textContent = '0/500';
    nomeCompleto.classList.remove('is-valid');
    emailContato.classList.remove('is-valid');
    mensagemContato.classList.remove('is-valid');
  } else {
    mensagemSucesso.classList.add('d-none');
  }
});

