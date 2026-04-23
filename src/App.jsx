import { useState, useEffect, useCallback, useRef } from "react";

const SUPABASE_URL = "https://vcvayipstgbksiehvolp.supabase.co";
const SUPABASE_KEY = "SUBSTITUA_PELA_SUA_CHAVE_ANON";

// ── DADOS BASE ────────────────────────────────────────────────────────────────
const ANOS = ["Educação Infantil","1º Ano","2º Ano","3º Ano","4º Ano","5º Ano"];
const BIMESTRES = ["1º Bimestre","2º Bimestre","3º Bimestre","4º Bimestre"];
const DISCIPLINAS = ["Língua Portuguesa","Matemática","Ciências","História","Geografia","Inglês","Artes","Educação Física"];
const BLOOM = ["Lembrar","Entender","Aplicar","Analisar","Avaliar","Criar"];

const BNCC = {
  "Língua Portuguesa":{"1º Ano":{"1º Bimestre":[
    {cod:"EF01LP01",desc:"Reconhecer que textos são lidos da esquerda para direita e de cima para baixo"},
    {cod:"EF01LP02",desc:"Escrever espontaneamente palavras e frases de forma alfabética"},
    {cod:"EF01LP04",desc:"Distinguir letras do alfabeto de outros sinais gráficos"},
    {cod:"EF01LP05",desc:"Reconhecer o SEA como representação dos sons da fala"},
    {cod:"EF01LP07",desc:"Identificar fonemas e sua representação por letras"},
    {cod:"EF01LP10",desc:"Nomear as letras do alfabeto e recitá-lo na ordem"},
    {cod:"EF01LP11",desc:"Conhecer, diferenciar e relacionar letras imprensa e cursiva"},
    {cod:"EF12LP04",desc:"Ler e compreender listas, agendas, avisos e convites"},
  ],"2º Bimestre":[
    {cod:"EF01LP06",desc:"Segmentar oralmente palavras em sílabas"},
    {cod:"EF01LP08",desc:"Relacionar elementos sonoros com sua representação escrita"},
    {cod:"EF01LP13",desc:"Comparar palavras identificando rimas"},
    {cod:"EF01LP16",desc:"Ler e compreender quadrinhas, parlendas e trava-línguas"},
    {cod:"EF01LP19",desc:"Recitar parlendas e quadrinhas com entonação"},
    {cod:"EF12LP07",desc:"Identificar rimas, aliterações e ritmo"},
  ],"3º Bimestre":[
    {cod:"EF01LP17",desc:"Planejar e produzir listas, agendas, convites e legendas"},
    {cod:"EF01LP25",desc:"Produzir recontagens de histórias"},
    {cod:"EF01LP26",desc:"Identificar elementos da narrativa"},
    {cod:"EF15LP16",desc:"Ler e compreender contos populares e de fadas"},
  ],"4º Bimestre":[
    {cod:"EF12LP05",desc:"Planejar e produzir recontagens, poemas e quadrinhas"},
    {cod:"EF15LP02",desc:"Estabelecer expectativas em relação ao texto"},
    {cod:"EF15LP03",desc:"Localizar informações explícitas em textos"},
    {cod:"EF15LP15",desc:"Reconhecer dimensão lúdica de textos literários"},
  ]},"2º Ano":{"1º Bimestre":[
    {cod:"EF02LP01",desc:"Ler palavras com correspondências regulares e irregulares"},
    {cod:"EF02LP07",desc:"Escrever palavras, frases e textos curtos em imprensa e cursiva"},
    {cod:"EF12LP01",desc:"Ler palavras novas com precisão na decodificação"},
    {cod:"EF12LP03",desc:"Copiar textos breves mantendo características"},
  ],"2º Bimestre":[
    {cod:"EF02LP08",desc:"Segmentar textos em unidades silábicas"},
    {cod:"EF02LP11",desc:"Identificar e usar dígrafo, encontro consonantal e vocálico"},
    {cod:"EF12LP07",desc:"Identificar e reproduzir rimas, aliterações e ritmo"},
  ],"3º Bimestre":[],"4º Bimestre":[]}},
  "Matemática":{"1º Ano":{"1º Bimestre":[
    {cod:"EF01MA01",desc:"Utilizar números naturais como indicador de quantidade"},
    {cod:"EF01MA04",desc:"Contar coleções de até 100 elementos"},
    {cod:"EF01MA07",desc:"Compor e decompor número de até duas ordens"},
    {cod:"EF01MA13",desc:"Descrever localização de objetos no espaço"},
  ],"2º Bimestre":[
    {cod:"EF01MA06",desc:"Construir fatos básicos da adição"},
    {cod:"EF01MA08",desc:"Resolver situações-problema de adição e subtração"},
    {cod:"EF01MA09",desc:"Organizar e interpretar dados em tabelas e gráficos"},
  ],"3º Bimestre":[
    {cod:"EF01MA14",desc:"Identificar e nomear figuras planas"},
    {cod:"EF01MA16",desc:"Descrever características de figuras geométricas"},
  ],"4º Bimestre":[
    {cod:"EF01MA11",desc:"Fazer estimativas por meio de estratégias diversas"},
  ]},"2º Ano":{"1º Bimestre":[
    {cod:"EF02MA01",desc:"Comparar e ordenar números naturais de até três ordens"},
    {cod:"EF02MA05",desc:"Construir fatos básicos da subtração"},
  ],"2º Bimestre":[
    {cod:"EF02MA07",desc:"Resolver situações de adição e subtração com reagrupamento"},
  ],"3º Bimestre":[],"4º Bimestre":[]}}
};

// ── CATEGORIAS E FERRAMENTAS ──────────────────────────────────────────────────
const CATEGORIAS = [
  {id:"todos",label:"Todos",icon:"✦"},
  {id:"planejamento",label:"Planejamento",icon:"📅"},
  {id:"preparar",label:"Preparar Aulas",icon:"📚"},
  {id:"avaliacoes",label:"Avaliações",icon:"📝"},
  {id:"engajar",label:"Engajar Alunos",icon:"🎮"},
  {id:"alfabetizacao",label:"Alfabetização",icon:"🐝"},
  {id:"acessibilidade",label:"Acessibilidade",icon:"♿"},
  {id:"comunicacao",label:"Comunicação",icon:"✉️"},
];

const FERRAMENTAS = [
  // Planejamento
  {id:"plano_aula",cat:"planejamento",nome:"Plano de Aula",desc:"Gere planos completos com objetivos, metodologia, recursos e avaliação.",icon:"📋",cor:"#6366F1",bg:"#EEF2FF",destaque:true},
  {id:"sequencia",cat:"planejamento",nome:"Sequência Didática",desc:"Distribua conteúdo em 1–10 aulas com objetivos, atividades e BNCC.",icon:"🗂️",cor:"#8B5CF6",bg:"#F5F3FF"},
  {id:"calendario",cat:"planejamento",nome:"Calendário Escolar",desc:"Planeje semanas, bimestres ou o ano letivo inteiro em minutos.",icon:"📅",cor:"#0EA5E9",bg:"#F0F9FF"},
  {id:"objetivos",cat:"planejamento",nome:"Objetivos de Aprendizagem",desc:"Escreva objetivos claros, mensuráveis e alinhados ao tema.",icon:"🎯",cor:"#10B981",bg:"#ECFDF5"},
  {id:"projeto",cat:"planejamento",nome:"Projeto",desc:"Crie o roteiro completo com etapas, critérios de avaliação e cronograma.",icon:"🏗️",cor:"#F59E0B",bg:"#FFFBEB"},
  {id:"recuperacao",cat:"planejamento",nome:"Plano de Recuperação",desc:"Crie plano focado nos pontos de dificuldade dos alunos.",icon:"🔄",cor:"#EF4444",bg:"#FEF2F2"},
  // Preparar Aulas
  {id:"aula_magica",cat:"preparar",nome:"Aula Mágica",desc:"Crie aulas completas com diversos materiais prontos para usar.",icon:"✨",cor:"#8B5CF6",bg:"#F5F3FF",destaque:true},
  {id:"slides",cat:"preparar",nome:"Apresentação de Slides",desc:"Produza roteiro de slides alinhados ao tema, prontos para apresentar.",icon:"📊",cor:"#6366F1",bg:"#EEF2FF"},
  {id:"texto_apoio",cat:"preparar",nome:"Texto de Apoio",desc:"Crie textos de leitura alinhados ao tema da aula.",icon:"📄",cor:"#0EA5E9",bg:"#F0F9FF"},
  {id:"resumo",cat:"preparar",nome:"Resumo",desc:"Obtenha texto conciso e atualizado sobre qualquer tema.",icon:"📑",cor:"#10B981",bg:"#ECFDF5"},
  {id:"experimento",cat:"preparar",nome:"Experimento Científico",desc:"Crie experimentos seguros e alinhados ao currículo.",icon:"🔬",cor:"#F59E0B",bg:"#FFFBEB"},
  {id:"mapa_mental",cat:"preparar",nome:"Mapa Mental",desc:"Converta qualquer assunto em mapa mental editável.",icon:"🧠",cor:"#EC4899",bg:"#FDF2F8"},
  {id:"transposicao",cat:"preparar",nome:"Transposição Didática",desc:"Transforme conteúdos complexos em atividades didáticas.",icon:"🔀",cor:"#14B8A6",bg:"#F0FDFA"},
  {id:"bncc_desc",cat:"preparar",nome:"BNCC Descomplicada",desc:"Entenda como trabalhar sua habilidade BNCC em sala de aula.",icon:"📖",cor:"#6366F1",bg:"#EEF2FF"},
  // Avaliações
  {id:"avaliacao",cat:"avaliacoes",nome:"Atividade Avaliativa",desc:"Crie atividades com critérios A/PA/NA alinhados à BNCC.",icon:"📝",cor:"#6366F1",bg:"#EEF2FF",destaque:true},
  {id:"avaliacao_diag",cat:"avaliacoes",nome:"Avaliação Diagnóstica",desc:"Mapeie conhecimentos prévios e dificuldades dos alunos.",icon:"🔍",cor:"#8B5CF6",bg:"#F5F3FF"},
  {id:"prova",cat:"avaliacoes",nome:"Prova",desc:"Gere uma prova para avaliar seus alunos.",icon:"📃",cor:"#EF4444",bg:"#FEF2F2"},
  {id:"simulado",cat:"avaliacoes",nome:"Simulado",desc:"Gere simulado com questões de concursos e provas padronizadas.",icon:"🏆",cor:"#F59E0B",bg:"#FFFBEB"},
  {id:"ditado",cat:"avaliacoes",nome:"Ditado Diagnóstico",desc:"Diagnostique hipóteses de escrita com palavras progressivas.",icon:"✏️",cor:"#10B981",bg:"#ECFDF5"},
  {id:"roteiro_obs",cat:"avaliacoes",nome:"Roteiro de Observação",desc:"Registre evidências de aprendizagem com indicadores por habilidade.",icon:"👁️",cor:"#0EA5E9",bg:"#F0F9FF"},
  {id:"saeb",cat:"avaliacoes",nome:"Questões modelo SAEB",desc:"Gere questões no formato das avaliações em larga escala.",icon:"📊",cor:"#6366F1",bg:"#EEF2FF"},
  {id:"criterios",cat:"avaliacoes",nome:"Critérios de Avaliação",desc:"Construa listas de critérios e pesos para corrigir qualquer tarefa.",icon:"⭐",cor:"#F59E0B",bg:"#FFFBEB"},
  // Engajar Alunos
  {id:"jogo",cat:"engajar",nome:"Jogo Pedagógico",desc:"Crie jogos com regras, materiais e objetivos pedagógicos.",icon:"🎲",cor:"#EC4899",bg:"#FDF2F8",destaque:true},
  {id:"lista_exercicios",cat:"engajar",nome:"Lista de Exercícios",desc:"Crie questões objetivas/dissertativas com gabarito.",icon:"📋",cor:"#8B5CF6",bg:"#F5F3FF"},
  {id:"caca_palavras",cat:"engajar",nome:"Caça-Palavras",desc:"Gere caça-palavras em três níveis com gabarito.",icon:"🔎",cor:"#0EA5E9",bg:"#F0F9FF"},
  {id:"jogo_memoria",cat:"engajar",nome:"Jogo da Memória",desc:"Crie pares para imprimir e usar em sala de aula.",icon:"🃏",cor:"#6366F1",bg:"#EEF2FF"},
  {id:"bingo",cat:"engajar",nome:"Bingo Temático",desc:"Crie cartelas de bingo para engajar os alunos.",icon:"🎱",cor:"#F59E0B",bg:"#FFFBEB"},
  {id:"charadas",cat:"engajar",nome:"Charadas",desc:"Crie charadas temáticas para iniciar ou encerrar a aula.",icon:"🤔",cor:"#EC4899",bg:"#FDF2F8"},
  {id:"dinamicas",cat:"engajar",nome:"Dinâmicas para Sala",desc:"Crie atividades de integração e quebra-gelo.",icon:"🎯",cor:"#10B981",bg:"#ECFDF5"},
  {id:"ideias_aula",cat:"engajar",nome:"Ideias de Atividades",desc:"Crie dinâmicas de aprendizagem ativa adaptadas ao tema.",icon:"💡",cor:"#F59E0B",bg:"#FFFBEB"},
  {id:"musica",cat:"engajar",nome:"Música Pedagógica",desc:"Crie letras de músicas que ensinam o conteúdo de forma divertida.",icon:"🎵",cor:"#8B5CF6",bg:"#F5F3FF"},
  // Alfabetização
  {id:"ortografia",cat:"alfabetizacao",nome:"Atividades de Ortografia",desc:"Atividades com sílabas, palavras e letras para alfabetização.",icon:"🔡",cor:"#6366F1",bg:"#EEF2FF",destaque:true},
  {id:"caligrafia",cat:"alfabetizacao",nome:"Caligrafia",desc:"Ajude alunos a desenvolverem caligrafia com formatos tracejados.",icon:"✍️",cor:"#0EA5E9",bg:"#F0F9FF"},
  {id:"folha_exercicios",cat:"alfabetizacao",nome:"Folha de Exercícios",desc:"Gere atividades para o aluno aplicar o que aprendeu.",icon:"📄",cor:"#10B981",bg:"#ECFDF5"},
  {id:"lacunas",cat:"alfabetizacao",nome:"Complete as Lacunas",desc:"Gere exercícios de preenchimento de lacunas.",icon:"📝",cor:"#F59E0B",bg:"#FFFBEB"},
  {id:"vocabulario",cat:"alfabetizacao",nome:"Lista de Vocabulário",desc:"Gere palavras com significados e exercícios de associação.",icon:"📚",cor:"#EC4899",bg:"#FDF2F8"},
  {id:"bloom_q",cat:"alfabetizacao",nome:"Perguntas por Bloom",desc:"Crie questões em cada nível da Taxonomia de Bloom.",icon:"🔺",cor:"#8B5CF6",bg:"#F5F3FF"},
  // Acessibilidade
  {id:"adaptacao",cat:"acessibilidade",nome:"Atividade Adaptada",desc:"Torne suas atividades mais acessíveis para todos.",icon:"♿",cor:"#10B981",bg:"#ECFDF5",destaque:true},
  {id:"pei",cat:"acessibilidade",nome:"PEI / PDI",desc:"Elabore Planos de Ensino ou Desenvolvimento Individual.",icon:"🧩",cor:"#6366F1",bg:"#EEF2FF"},
  {id:"libras",cat:"acessibilidade",nome:"Aprendendo Libras",desc:"Atividades com Língua Brasileira de Sinais.",icon:"🤟",cor:"#0EA5E9",bg:"#F0F9FF"},
  {id:"acessib_texto",cat:"acessibilidade",nome:"Acessibilidade de Texto",desc:"Torne seus textos acessíveis para diferentes necessidades.",icon:"📖",cor:"#F59E0B",bg:"#FFFBEB"},
  {id:"datas",cat:"acessibilidade",nome:"Datas Comemorativas",desc:"Crie atividades ligadas a feriados e datas especiais.",icon:"🗓️",cor:"#EC4899",bg:"#FDF2F8"},
  // Comunicação
  {id:"email",cat:"comunicacao",nome:"E-mails Escolares",desc:"Gere e-mails para alunos, pais, professores e direção.",icon:"✉️",cor:"#6366F1",bg:"#EEF2FF"},
  {id:"relatorio",cat:"comunicacao",nome:"Relatório",desc:"Crie relatórios de desempenho com estatísticas claras.",icon:"📊",cor:"#0EA5E9",bg:"#F0F9FF"},
  {id:"feedback",cat:"comunicacao",nome:"Feedback para Alunos",desc:"Gere feedbacks individualizados e construtivos.",icon:"💬",cor:"#10B981",bg:"#ECFDF5"},
];

// ── PROMPTS POR FERRAMENTA ────────────────────────────────────────────────────
function buildPrompt(ferramenta, config) {
  const {ano, bimestre, disciplina, bloom, tema, habilidades, complemento, nivel} = config;
  const hbcc = habilidades?.length ? `\nHabilidades BNCC:\n${habilidades.map(h=>`${h.cod}: ${h.desc}`).join("\n")}` : "";
  const ctx = complemento ? `\nContexto adicional: ${complemento}` : "";
  const t = tema || `${disciplina||"Educação Básica"} — ${bimestre||"1º Bimestre"}`;

  const base = `Professor(a) de ${disciplina||"Educação Básica"}, ${ano||"1º Ano"} EF, ${bimestre||"1º Bimestre"}.`;

  const prompts = {
    plano_aula:`${base}\nCrie um plano de aula detalhado.\nTema: ${t}${hbcc}\nNível Bloom: ${bloom||"Aplicar"}${ctx}\n\nEstrutura:\n1. TÍTULO\n2. OBJETIVO GERAL\n3. OBJETIVOS ESPECÍFICOS (3 verbos de ação)\n4. DURAÇÃO\n5. MATERIAIS NECESSÁRIOS\n6. DESENVOLVIMENTO\n   • Início (10 min): motivação e ativação\n   • Meio (25 min): desenvolvimento do conteúdo\n   • Fim (10 min): sistematização e encerramento\n7. AVALIAÇÃO (critérios observáveis)\n8. OBSERVAÇÕES PEDAGÓGICAS\n\nSeja específico e prático.`,
    sequencia:`${base}\nCrie uma sequência didática de 5 aulas.\nTema: ${t}${hbcc}${ctx}\n\nPara cada aula:\n🔹 Aula N — Título\nObjetivo: ...\nAtividade principal: ...\nRecurso necessário: ...\nAvaliação formativa: ...\n\nAo final: Síntese da progressão de aprendizagem esperada.`,
    aula_magica:`${base}\nCrie uma aula completa e engajante.\nTema: ${t}${hbcc}${ctx}\n\nInclua todos estes elementos:\n1. ABERTURA CRIATIVA (música, história, objeto surpresa)\n2. DESENVOLVIMENTO (3 momentos com atividades)\n3. ATIVIDADE PRÁTICA (faça-agora)\n4. FECHAMENTO (síntese participativa)\n5. PARA CASA (opcional, leve)\n6. MATERIAL DE APOIO (texto curto ou exercício)\n7. DICA DO PROFESSOR`,
    avaliacao:`${base}\nCrie uma atividade avaliativa completa.\nTema: ${t}${hbcc}\nNível Bloom: ${bloom||"Aplicar"}${ctx}\n\nInclua:\n• Título e objetivo\n• Instrução para o aluno (linguagem simples, ${ano||"1º Ano"})\n• 6 questões variadas: circule / ligue / escreva / complete / desenhe\n• Critérios de observação para o professor\n• Legenda A / PA / NA com descritores comportamentais`,
    avaliacao_diag:`${base}\nCrie uma avaliação diagnóstica.\nTema: ${t}${hbcc}${ctx}\n\nInclua:\n• Propósito diagnóstico\n• 8–10 questões em ordem crescente de complexidade\n• Ficha de análise por nível (abaixo/em desenvolvimento/consolidado)\n• Interpretação dos resultados\n• Encaminhamentos por perfil de aluno`,
    ditado:`${base}\nCrie um ditado diagnóstico de alfabetização.\nTema: ${t}${hbcc}${ctx}\n\nInclua:\n• Objetivo diagnóstico\n• 10 palavras progressivas (monossílabas → polissílabas, do familiar ao incomum)\n• 1 frase contextualizada\n• Tabela de análise: pré-silábico / silábico sem VS / silábico com VS / silábico-alfabético / alfabético\n• Orientações de intervenção para cada nível\n• O que observar no processo`,
    roteiro_obs:`${base}\nCrie um roteiro de observação pedagógica.\nTema: ${t}${hbcc}${ctx}\n\nInclua:\n• Período de observação\n• Situações planejadas para observar\n• Indicadores específicos por habilidade BNCC\n• Escala A/PA/NA com descritores\n• Campo de registro qualitativo\n• Sugestões de intervenção diferenciada por perfil`,
    jogo:`${base}\nCrie um jogo pedagógico criativo.\nTema: ${t}${hbcc}\nNível Bloom: ${bloom||"Aplicar"}${ctx}\n\nInclua:\n• Nome criativo do jogo\n• Objetivo pedagógico\n• Materiais (fáceis de produzir ou imprimíveis)\n• Número de jogadores\n• Regras passo a passo\n• Como adaptar para diferentes níveis\n• O que observar durante o jogo`,
    lista_exercicios:`${base}\nCrie uma lista de exercícios variada.\nTema: ${t}${hbcc}\nNível: ${bloom||"Aplicar"}${ctx}\n\n10 questões com:\n• Mistura de tipos: múltipla escolha, verdadeiro/falso, completar, relacionar, dissertativa\n• Gabarito comentado ao final\n• Indicação do nível Bloom de cada questão`,
    ortografia:`${base}\nCrie atividades de ortografia e alfabetização.\nTema: ${t}${hbcc}${ctx}\n\nInclua 5 atividades variadas:\n1. Atividade com sílabas (montar palavras)\n2. Caça ao fonema (identificar sons)\n3. Completar palavras (lacunas)\n4. Classificar por número de sílabas\n5. Escrever de memória com apoio de imagem\n\nEspecifique o nível de dificuldade e adapte para ${ano||"1º Ano"}.`,
    caca_palavras:`${base}\nCrie um caça-palavras temático.\nTema: ${t}${ctx}\n\nInclua:\n• 12 palavras relacionadas ao tema\n• Grade 12x12 com as palavras escondidas (horizontal, vertical e diagonal)\n• Lista de palavras para o aluno buscar\n• Gabarito com as palavras marcadas\n• Curiosidade sobre o tema`,
    folha_exercicios:`${base}\nCrie uma folha de exercícios completa.\nTema: ${t}${hbcc}${ctx}\n\n6 atividades para o aluno:\n1. Observe e responda\n2. Complete\n3. Ligue os pares\n4. Circule a resposta correta\n5. Escreva\n6. Crie (produção autoral simples)\n\nAdapte ao nível do ${ano||"1º Ano"}.`,
    vocabulario:`${base}\nCrie uma lista de vocabulário temática.\nTema: ${t}${ctx}\n\n• 15 palavras do tema com definição simples\n• Exercício de associação palavra-imagem (descrito textualmente)\n• Atividade de uso em contexto (complete a frase)\n• Jogo de memória com os pares`,
    bloom_q:`${base}\nCrie 6 questões — uma por nível da Taxonomia de Bloom.\nTema: ${t}${hbcc}${ctx}\n\nPara cada nível:\n🔹 LEMBRAR: ...\n🔹 ENTENDER: ...\n🔹 APLICAR: ...\n🔹 ANALISAR: ...\n🔹 AVALIAR: ...\n🔹 CRIAR: ...\n\nAdapte ao ${ano||"1º Ano"} e contextualize no cotidiano.`,
    saeb:`${base}\nCrie 5 questões no formato SAEB/Prova Brasil.\nTema: ${t}${hbcc}${ctx}\n\nCada questão:\n• Contexto (texto-base ou situação-problema)\n• 4 alternativas (A, B, C, D)\n• Gabarito com justificativa\n• Habilidade BNCC associada\n• Nível de dificuldade`,
    mapa_mental:`${base}\nCrie um mapa mental estruturado para o professor usar em aula.\nTema: ${t}${hbcc}${ctx}\n\nEstrutura em texto com hierarquia:\nTEMA CENTRAL\n├── Subtema 1\n│   ├── Detalhe\n│   └── Detalhe\n├── Subtema 2\n│   └── ...\n└── Conexões com a vida real\n\nIncluindo atividade de registro para os alunos.`,
    slides:`${base}\nCrie o roteiro detalhado de uma apresentação.\nTema: ${t}${hbcc}${ctx}\n\n8–10 slides:\n• Slide 1: título + gancho\n• Slides 2–7: conteúdo (título, bullet points, imagem sugerida, fala do professor)\n• Slide 8: atividade interativa\n• Slide 9: síntese\n• Slide 10: referências\n\nIncluir nota para o apresentador em cada slide.`,
    resumo:`${base}\nCrie um resumo didático sobre o tema.\nTema: ${t}${ctx}\n\n• Parágrafo introdutório (contexto e relevância)\n• 4–5 tópicos principais com explicação\n• Exemplos do cotidiano\n• Conclusão e conexão com a vida do aluno\n• 3 perguntas para reflexão\n\nAdapte o vocabulário para ${ano||"1º Ano"}.`,
    texto_apoio:`${base}\nCrie um texto de apoio para leitura.\nTema: ${t}${ctx}\n\n• Título chamativo\n• Texto de 15–20 linhas, vocabulário acessível\n• Subtítulos para organização\n• 1 quadro de curiosidade\n• 3 perguntas de interpretação (explícitas e inferência)\n• Mini-glossário (5 palavras)`,
    experimento:`${base}\nCrie um experimento científico seguro.\nTema: ${t}${ctx}\n\n• Nome criativo do experimento\n• Pergunta investigativa\n• Hipótese esperada\n• Materiais (baratos e acessíveis)\n• Procedimento passo a passo\n• O que observar e registrar\n• Explicação científica (nível ${ano||"1º Ano"})\n• Variações possíveis`,
    objetivos:`${base}\nCrie objetivos de aprendizagem.\nTema: ${t}${hbcc}\nNível Bloom: ${bloom||"Aplicar"}${ctx}\n\n• 1 Objetivo Geral (amplo)\n• 5 Objetivos Específicos (verbos de ação, mensuráveis, observáveis)\n• Para cada objetivo: como avaliar e evidência de alcance\n• Articulação com as habilidades BNCC`,
    projeto:`${base}\nCrie o roteiro completo de um projeto pedagógico.\nTema: ${t}${hbcc}${ctx}\n\n• Título e justificativa\n• Objetivos e competências\n• Público-alvo e duração\n• Etapas (5 fases com atividades)\n• Recursos necessários\n• Produto final esperado\n• Critérios de avaliação\n• Cronograma semanal`,
    recuperacao:`${base}\nCrie um plano de recuperação de aprendizagem.\nTema: ${t}${hbcc}${ctx}\n\n• Diagnóstico inicial (o que observar)\n• Objetivos específicos de recuperação\n• Sequência de 3 intervenções\n• Atividades diferenciadas por nível\n• Estratégias de mediação\n• Avaliação do progresso\n• Comunicação com a família`,
    calendario:`${base}\nCrie um planejamento de calendário.\nTema: ${t}${ctx}\n\nCalendário para 1 bimestre (10 semanas):\n• Semana 1: ...\n• Semana 2: ...\n...\n\nInclua: conteúdos, habilidades BNCC previstas, avaliações, datas comemorativas relevantes e flexibilidade pedagógica.`,
    transposicao:`${base}\nFaça a transposição didática do conteúdo.\nTema: ${t}${hbcc}${ctx}\n\n• O saber científico (como os especialistas conhecem)\n• O saber a ensinar (adaptação curricular)\n• O saber ensinado (sequência para ${ano||"1º Ano"})\n• Possíveis obstáculos de aprendizagem\n• Estratégias de mediação\n• Situações didáticas progressivas`,
    bncc_desc:`Explique como trabalhar a habilidade BNCC em sala de aula.\nHabilidades:${hbcc||"\n(nenhuma selecionada)"}\nAno: ${ano||"1º Ano"}\n${ctx}\n\n• Tradução da habilidade em linguagem simples\n• O que o aluno deve saber/saber fazer\n• 3 situações didáticas práticas\n• Como avaliar o alcance\n• Conexão com outras áreas\n• Progressão (o que vem antes e depois)`,
    adaptacao:`${base}\nCrie uma versão adaptada da atividade.\nTema: ${t}${ctx}\n\nVersões para:\n• Alunos com dislexia\n• Alunos com TDAH\n• Alunos com TEA\n• Alunos com baixa visão\n• Alunos em processo de alfabetização\n\nPara cada: adaptação específica da atividade, recursos necessários e orientações ao professor.`,
    pei:`${base}\nCrie um PEI (Plano Educacional Individualizado).\nContexto: ${t}${ctx}\n\n• Identificação do aluno (perfil genérico)\n• Diagnóstico pedagógico atual\n• Objetivos individualizados (curto, médio e longo prazo)\n• Estratégias de ensino\n• Recursos e apoios necessários\n• Adaptações curriculares\n• Avaliação e acompanhamento\n• Parceria com família e equipe`,
    email:`${base}\nCrie um e-mail escolar profissional.\nAssunto: ${t}${ctx}\n\n• Versão para FAMÍLIA (tom acolhedor, claro)\n• Versão para EQUIPE PEDAGÓGICA (profissional, objetivo)\n• Versão para DIREÇÃO (formal, com dados)\n\nInclua linha de assunto, corpo e despedida para cada versão.`,
    relatorio:`${base}\nCrie um relatório de desempenho pedagógico.\nReferência: ${t}${ctx}\n\n• Cabeçalho (turma, período, professor)\n• Síntese geral da turma\n• Tabela de objetivos x desempenho (A/PA/NA)\n• Destaque: avanços observados\n• Destaque: pontos de atenção\n• Alunos que precisam de intervenção\n• Encaminhamentos para o próximo período`,
    feedback:`${base}\nCrie modelos de feedback individualizado.\nContexto: ${t}${ctx}\n\nFeedback para aluno que:\n• Alcançou plenamente\n• Está em processo\n• Precisa de reforço\n\nCada feedback: 3–4 frases, positivo-construtivo-orientador, linguagem adequada a ${ano||"1º Ano"}.`,
    ideias_aula:`${base}\nGere 6 ideias criativas de atividades.\nTema: ${t}${hbcc}${ctx}\n\nPara cada ideia:\n• Nome criativo\n• Objetivo\n• Tempo estimado\n• Materiais\n• Como executar (3 passos)\n• Variação para incluir`,
    charadas:`${base}\nCrie 8 charadas pedagógicas.\nTema: ${t}${ctx}\n\nCada charada:\n• Pergunta rimada\n• Resposta\n• Curiosidade relacionada\n\nAdapte ao vocabulário de ${ano||"1º Ano"}.`,
    dinamicas:`${base}\nCrie 3 dinâmicas para sala de aula.\nTema: ${t}${ctx}\n\nCada dinâmica:\n• Nome\n• Objetivo (integração/conteúdo)\n• Duração\n• Materiais\n• Passo a passo\n• Variação inclusiva`,
    musica:`${base}\nCrie a letra de uma música pedagógica.\nTema: ${t}${ctx}\n\n• Título criativo\n• Letra completa (2 estrofes + refrão)\n• Melodia sugerida (música conhecida ou original)\n• Atividades para usar com a música\n• Valores e aprendizados embutidos`,
    bingo:`${base}\nCrie um bingo temático.\nTema: ${t}${ctx}\n\n• 25 termos/conceitos do tema\n• Modelo de cartela 5x5\n• 4 cartelas diferentes (para imprimir)\n• Regras adaptadas ao ${ano||"1º Ano"}\n• Perguntas para o apresentador`,
    jogo_memoria:`${base}\nCrie um jogo da memória.\nTema: ${t}${ctx}\n\n• 15 pares (30 cartas no total)\n• Descrição de cada par (palavra + definição, imagem + nome, etc.)\n• Layout sugerido para impressão\n• Variações de jogo\n• Objetivos pedagógicos de cada par`,
    lacunas:`${base}\nCrie exercícios de completar lacunas.\nTema: ${t}${hbcc}${ctx}\n\n8 exercícios:\n• 3 frases para completar (banco de palavras)\n• 2 textos curtos com lacunas\n• 2 equações/problemas incompletos\n• 1 mapa/diagrama para completar\n\nGabarito ao final.`,
    caligrafia:`${base}\nCrie uma atividade de caligrafia.\nTema: ${t}${ctx}\n\n• 5 palavras para tracejado (letra por letra)\n• 3 frases curtas para copiar\n• 1 texto de 4 linhas para caligrafia livre\n• Orientações para o professor (postura, lápis, ritmo)\n• Critérios de avaliação do traçado`,
    libras:`${base}\nCrie atividades de introdução à Libras.\nTema: ${t}${ctx}\n\n• 10 sinais básicos relacionados ao tema (descrição do sinal)\n• Atividade de associação sinal-palavra\n• Diálogo simples em Libras\n• Curiosidades sobre a língua\n• Recursos digitais sugeridos`,
    acessib_texto:`${base}\nAdapte um texto para diferentes necessidades.\nTema: ${t}${ctx}\n\n• Texto original (5–8 linhas)\n• Versão simplificada (vocabulário básico)\n• Versão com pictogramas (descrição)\n• Versão para dislexia (sugestões de formatação)\n• Versão em Libras (pontos-chave)`,
    datas:`${base}\nCrie atividades para data comemorativa.\nData/Tema: ${t}${ctx}\n\n• Contexto histórico-cultural\n• 3 atividades progressivas\n• Sugestão de produto final\n• Conexão com BNCC\n• Texto informativo para alunos`,
    simulado:`${base}\nCrie um simulado.\nTema: ${t}${hbcc}${ctx}\n\n10 questões:\n• 7 múltipla escolha (4 alternativas)\n• 2 verdadeiro ou falso com justificativa\n• 1 dissertativa\n\nGabarito comentado. Tabela de pontuação.`,
    prova:`${base}\nCrie uma prova formal.\nTema: ${t}${hbcc}\nNível: ${bloom||"Aplicar"}${ctx}\n\nEstrutura:\n• Cabeçalho (nome, data, turma, nota)\n• Instruções gerais\n• Parte I: 4 questões objetivas\n• Parte II: 2 questões dissertativas\n• Gabarito e critérios de correção`,
    criterios:`${base}\nCrie critérios de avaliação detalhados.\nTema: ${t}${hbcc}${ctx}\n\n• Rubrica com 4 níveis (Excelente/Bom/Regular/Insuficiente)\n• Peso de cada critério\n• Descritores comportamentais observáveis\n• Formulário de registro para o professor\n• Como comunicar ao aluno`,
    recuperacao:`${base}\nCrie um plano de recuperação.\nTema: ${t}${hbcc}${ctx}\n\n• Diagnóstico inicial\n• Objetivos de recuperação\n• 3 intervenções progressivas\n• Atividades diferenciadas por nível\n• Estratégias de mediação\n• Avaliação do progresso\n• Comunicação com família`,
  };
  return prompts[ferramenta.id] || `Crie um(a) ${ferramenta.nome} sobre "${t}" para ${ano||"1º Ano"} EF.${hbcc}${ctx}\n\nSeja detalhado, prático e alinhado à BNCC.`;
}

// ── API CLAUDE ────────────────────────────────────────────────────────────────
// ── GROQ API (gratuita, funciona no Brasil) ──────────────────────────────────
const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = "Você é especialista em educação básica, alfabetização, BNCC e Taxonomia de Bloom. Cria materiais pedagógicos práticos, contextualizados e prontos para usar. Linguagem profissional e direta. Estruture bem com títulos e marcadores.";

async function gerarIA(ferramenta, config) {
  const prompt = buildPrompt(ferramenta, config);

  if (!GROQ_KEY) throw new Error("Chave VITE_GROQ_KEY não configurada. Veja as instruções.");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }

  const d = await res.json();
  const texto = d?.choices?.[0]?.message?.content;
  if (!texto) throw new Error("Groq não retornou conteúdo. Tente novamente.");
  return texto;
}

async function salvarSupabase(payload) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/planos_aula`, {
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"return=minimal"},
    body:JSON.stringify({...payload, created_at:new Date().toISOString()})
  });
  if(!r.ok) throw new Error(await r.text());
}

async function carregarSupabase() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/planos_aula?order=created_at.desc&limit=30`,{
    headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
  });
  if(!r.ok) return [];
  const d = await r.json();
  return Array.isArray(d) ? d : [];
}

// ── COMPONENTES ────────────────────────────────────────────────────────────────

function Badge({children, cor, bg}) {
  return <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,background:bg||"#EEF2FF",color:cor||"#6366F1",letterSpacing:".04em"}}>{children}</span>;
}

function Sel({label, value, onChange, options, placeholder}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      {label&&<label style={{fontSize:10.5,fontWeight:700,color:"#6B7280",textTransform:"uppercase",letterSpacing:".05em"}}>{label}</label>}
      <select value={value} onChange={e=>onChange(e.target.value)} style={{
        padding:"8px 30px 8px 11px",border:"1.5px solid #E5E7EB",borderRadius:9,
        fontSize:13,fontFamily:"inherit",background:"#FAFAFA",color:value?"#111":"#9CA3AF",
        cursor:"pointer",outline:"none",appearance:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%236B7280' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"
      }}>
        <option value="" disabled>{placeholder||"Selecione..."}</option>
        {options.map(o=>(
          <option key={typeof o==="string"?o:o.id} value={typeof o==="string"?o:o.id}>
            {typeof o==="string"?o:o.label||o.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

function HabCheck({habs,selected,onChange}) {
  if(!habs?.length) return (
    <div style={{padding:12,background:"#F9FAFB",borderRadius:9,fontSize:12,color:"#9CA3AF",textAlign:"center",border:"1.5px dashed #E5E7EB"}}>
      Selecione ano, bimestre e disciplina
    </div>
  );
  const all = habs.every(h=>selected.includes(h.cod));
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:11,color:"#6B7280"}}>{habs.length} disponíveis</span>
        <button onClick={()=>onChange(all?[]:habs.map(h=>h.cod))} style={{fontSize:11,color:"#6366F1",background:"none",border:"none",cursor:"pointer",fontWeight:700}}>
          {all?"Desmarcar todas":"Marcar todas"}
        </button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:180,overflowY:"auto"}}>
        {habs.map(h=>{
          const on=selected.includes(h.cod);
          return (
            <label key={h.cod} style={{display:"flex",alignItems:"flex-start",gap:8,cursor:"pointer",padding:"7px 9px",borderRadius:8,background:on?"#EEF2FF":"#F9FAFB",border:`1.5px solid ${on?"#818CF8":"#E5E7EB"}`,transition:"all .1s"}}>
              <input type="checkbox" checked={on} onChange={()=>onChange(on?selected.filter(c=>c!==h.cod):[...selected,h.cod])} style={{marginTop:2,accentColor:"#6366F1",flexShrink:0}}/>
              <span><b style={{fontSize:10.5,color:"#6366F1",fontFamily:"monospace",marginRight:5}}>{h.cod}</b><span style={{fontSize:12,color:"#374151"}}>{h.desc}</span></span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ── MODAL DE GERAÇÃO ────────────────────────────────────────────────────────────
function Modal({ferramenta, onClose}) {
  const [ano,setAno]=useState("");
  const [bim,setBim]=useState("");
  const [disc,setDisc]=useState("");
  const [bloom,setBloom]=useState("");
  const [habs,setHabs]=useState([]);
  const [tema,setTema]=useState("");
  const [extra,setExtra]=useState("");
  const [gerando,setGerando]=useState(false);
  const [resultado,setResultado]=useState("");
  const [salvando,setSalvando]=useState(false);
  const [salvo,setSalvo]=useState(false);
  const [erro,setErro]=useState("");
  const [copiado,setCopiado]=useState(false);

  const habsDisp = BNCC[disc]?.[ano]?.[bim]||[];
  const habObjs  = habsDisp.filter(h=>habs.includes(h.cod));

  const gerar = async() => {
    setErro("");setGerando(true);setResultado("");setSalvo(false);
    try {
      const r = await gerarIA(ferramenta,{ano,bimestre:bim,disciplina:disc,bloom,tema,habilidades:habObjs,complemento:extra});
      setResultado(r);
    } catch(e){setErro(e.message);}
    setGerando(false);
  };

  const salvar = async() => {
    setSalvando(true);
    try {
      await salvarSupabase({tipo:ferramenta.id,ano,bimestre:bim,disciplina:disc,bloom,titulo:tema||`${ferramenta.nome} — ${disc||"Geral"}`,habilidades_bncc:habs,conteudo:resultado});
      setSalvo(true);
    }catch(e){setErro(e.message);}
    setSalvando(false);
  };

  const copiar = () => {
    navigator.clipboard?.writeText(resultado);
    setCopiado(true);setTimeout(()=>setCopiado(false),2000);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:100,overflowY:"auto",padding:"20px 12px"}}>
      <div style={{background:"#fff",borderRadius:18,width:"100%",maxWidth:700,boxShadow:"0 24px 60px rgba(0,0,0,.18)",animation:"slideUp .2s ease"}}>
        {/* Header do modal */}
        <div style={{padding:"18px 22px 14px",borderBottom:"1.5px solid #F3F4F6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:ferramenta.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{ferramenta.icon}</div>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#111"}}>{ferramenta.nome}</div>
              <div style={{fontSize:12,color:"#6B7280"}}>{ferramenta.desc}</div>
            </div>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:8,border:"1.5px solid #E5E7EB",background:"#F9FAFB",cursor:"pointer",fontSize:18,color:"#6B7280",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        <div style={{padding:"18px 22px"}}>
          {/* Config */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
            <Sel label="Ano" value={ano} onChange={setAno} options={ANOS} placeholder="Selecione"/>
            <Sel label="Bimestre" value={bim} onChange={v=>{setBim(v);setHabs([]);}} options={BIMESTRES} placeholder="Selecione"/>
            <Sel label="Disciplina" value={disc} onChange={v=>{setDisc(v);setHabs([]);}} options={DISCIPLINAS} placeholder="Selecione"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <Sel label="Nível Bloom" value={bloom} onChange={setBloom} options={BLOOM} placeholder="Profundidade cognitiva"/>
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              <label style={{fontSize:10.5,fontWeight:700,color:"#6B7280",textTransform:"uppercase",letterSpacing:".05em"}}>Tema / Contexto</label>
              <input value={tema} onChange={e=>setTema(e.target.value)} placeholder="Ex: Aimê e as vogais, Restinga..." style={{padding:"8px 11px",border:"1.5px solid #E5E7EB",borderRadius:9,fontSize:13,fontFamily:"inherit",outline:"none",background:"#FAFAFA"}}/>
            </div>
          </div>

          {/* Habilidades BNCC */}
          <div style={{marginBottom:10}}>
            <label style={{fontSize:10.5,fontWeight:700,color:"#6B7280",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:5}}>Habilidades BNCC</label>
            <HabCheck habs={habsDisp} selected={habs} onChange={setHabs}/>
            {habs.length>0&&<div style={{marginTop:4,fontSize:11,color:"#6366F1",fontWeight:600}}>{habs.length} selecionada(s)</div>}
          </div>

          {/* Extra */}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:10.5,fontWeight:700,color:"#6B7280",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Orientações adicionais (opcional)</label>
            <textarea value={extra} onChange={e=>setExtra(e.target.value)} rows={2} placeholder="Ex: turma com alunos em fase silábica, incluir alfabeto móvel, adaptar para TDAH..."
              style={{width:"100%",padding:"8px 11px",border:"1.5px solid #E5E7EB",borderRadius:9,fontSize:13,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box",background:"#FAFAFA"}}/>
          </div>

          {erro&&<div style={{padding:"9px 13px",background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:9,fontSize:12.5,color:"#DC2626",marginBottom:12}}>{erro}</div>}

          <button onClick={gerar} disabled={gerando} style={{
            width:"100%",padding:"12px",borderRadius:11,border:"none",cursor:gerando?"wait":"pointer",
            background:gerando?"#E5E7EB":`linear-gradient(135deg,${ferramenta.cor},${ferramenta.cor}CC)`,
            color:gerando?"#9CA3AF":"#fff",fontSize:14.5,fontWeight:800,transition:"all .18s"
          }}>
            {gerando?`✦ Gerando ${ferramenta.nome}...`:`✦ Gerar ${ferramenta.nome}`}
          </button>

          {/* Resultado */}
          {resultado&&(
            <div style={{marginTop:16,border:"1.5px solid #E5E7EB",borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"10px 14px",background:"#F9FAFB",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1.5px solid #E5E7EB"}}>
                <span style={{fontSize:12.5,fontWeight:700,color:ferramenta.cor}}>{ferramenta.icon} {ferramenta.nome} gerado</span>
                <div style={{display:"flex",gap:7}}>
                  <button onClick={copiar} style={{padding:"4px 11px",borderRadius:7,border:"1.5px solid #E5E7EB",background:"#fff",fontSize:11.5,cursor:"pointer",color:"#6B7280"}}>
                    {copiado?"✓ Copiado":"Copiar"}
                  </button>
                  <button onClick={salvar} disabled={salvando||salvo} style={{
                    padding:"4px 12px",borderRadius:7,border:"none",cursor:salvo?"default":"pointer",
                    background:salvo?"#DCFCE7":salvando?"#E5E7EB":"#6366F1",
                    color:salvo?"#15803D":salvando?"#9CA3AF":"#fff",fontSize:11.5,fontWeight:700
                  }}>
                    {salvo?"✓ Salvo":salvando?"Salvando...":"Salvar ↑"}
                  </button>
                </div>
              </div>
              <pre style={{padding:"16px 18px",fontSize:12.5,lineHeight:1.85,color:"#1F2937",whiteSpace:"pre-wrap",fontFamily:"Georgia,serif",margin:0,maxHeight:400,overflowY:"auto"}}>
                {resultado}
              </pre>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── CARD DE FERRAMENTA ────────────────────────────────────────────────────────
function Card({f, onOpen, favoritos, toggleFav}) {
  const fav = favoritos.includes(f.id);
  return (
    <div onClick={()=>onOpen(f)} style={{
      background:"#fff",border:"1.5px solid #F3F4F6",borderRadius:14,padding:"14px 16px",
      cursor:"pointer",transition:"all .15s",position:"relative",
      boxShadow:"0 1px 4px rgba(0,0,0,.04)"
    }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor=f.cor+"66";e.currentTarget.style.boxShadow=`0 4px 16px ${f.cor}22`}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor="#F3F4F6";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.04)"}}>
      {f.destaque&&<div style={{position:"absolute",top:10,right:36,fontSize:9,fontWeight:700,color:"#fff",background:f.cor,padding:"1px 6px",borderRadius:20,letterSpacing:".04em"}}>POPULAR</div>}
      <button onClick={e=>{e.stopPropagation();toggleFav(f.id);}} style={{position:"absolute",top:10,right:10,background:"none",border:"none",cursor:"pointer",fontSize:16,color:fav?"#F59E0B":"#D1D5DB"}}>
        {fav?"★":"☆"}
      </button>
      <div style={{width:42,height:42,borderRadius:11,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10}}>{f.icon}</div>
      <div style={{fontSize:13.5,fontWeight:700,color:"#111",marginBottom:4,paddingRight:8}}>{f.nome}</div>
      <div style={{fontSize:12,color:"#6B7280",lineHeight:1.5}}>{f.desc}</div>
    </div>
  );
}

// ── HISTORICO VIEW ────────────────────────────────────────────────────────────
function HistoricoView() {
  const [lista,setLista]=useState([]);
  const [carregando,setCarregando]=useState(true);
  const [vendo,setVendo]=useState(null);
  const [filtro,setFiltro]=useState("");

  useEffect(()=>{
    carregarSupabase().then(d=>{setLista(d);setCarregando(false);});
  },[]);

  const filtrado = filtro ? lista.filter(i=>i.disciplina===filtro||i.tipo===filtro||i.ano===filtro) : lista;
  const f = FERRAMENTAS.find(f=>f.id===vendo?.tipo);

  if(vendo) return (
    <div>
      <button onClick={()=>setVendo(null)} style={{padding:"7px 14px",borderRadius:8,border:"1.5px solid #E5E7EB",background:"#fff",cursor:"pointer",fontSize:13,marginBottom:14,color:"#6B7280"}}>← Voltar</button>
      <div style={{background:"#fff",border:"1.5px solid #E5E7EB",borderRadius:14,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",background:f?.bg||"#F9FAFB",borderBottom:"1.5px solid #E5E7EB"}}>
          <div style={{fontSize:15,fontWeight:800,color:"#111"}}>{f?.icon} {vendo.titulo}</div>
          <div style={{fontSize:12,color:"#6B7280",marginTop:3}}>{vendo.tipo} · {vendo.ano} · {vendo.bimestre} · {vendo.disciplina}</div>
          {vendo.habilidades_bncc?.length>0&&(
            <div style={{marginTop:6,display:"flex",gap:4,flexWrap:"wrap"}}>
              {vendo.habilidades_bncc.map(h=><span key={h} style={{fontSize:10,fontWeight:700,color:f?.cor||"#6366F1",background:"#EEF2FF",padding:"2px 6px",borderRadius:4,fontFamily:"monospace"}}>{h}</span>)}
            </div>
          )}
        </div>
        <pre style={{padding:"18px",fontSize:13,lineHeight:1.85,whiteSpace:"pre-wrap",fontFamily:"Georgia,serif",color:"#1F2937",margin:0,maxHeight:600,overflowY:"auto"}}>{vendo.conteudo}</pre>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {["","Língua Portuguesa","Matemática","1º Ano","2º Ano"].map(v=>(
          <button key={v} onClick={()=>setFiltro(v)} style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid",borderColor:filtro===v?"#6366F1":"#E5E7EB",background:filtro===v?"#EEF2FF":"#fff",color:filtro===v?"#6366F1":"#6B7280",fontSize:12,cursor:"pointer",fontWeight:filtro===v?700:400}}>
            {v||"Todos"}
          </button>
        ))}
        <button onClick={()=>{setCarregando(true);carregarSupabase().then(d=>{setLista(d);setCarregando(false);});}} style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid #E5E7EB",background:"#fff",color:"#6B7280",fontSize:12,cursor:"pointer",marginLeft:"auto"}}>↻ Atualizar</button>
      </div>
      {carregando&&<div style={{textAlign:"center",color:"#9CA3AF",padding:40}}>Carregando...</div>}
      {!carregando&&filtrado.length===0&&(
        <div style={{textAlign:"center",color:"#9CA3AF",padding:56,background:"#F9FAFB",borderRadius:14,border:"1.5px dashed #E5E7EB"}}>
          <div style={{fontSize:36,marginBottom:10}}>◈</div>
          <div style={{fontSize:14,fontWeight:700}}>Nenhum material ainda</div>
          <div style={{fontSize:12,marginTop:4}}>Gere materiais na aba Ferramentas</div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {filtrado.map(item=>{
          const f=FERRAMENTAS.find(f=>f.id===item.tipo);
          return (
            <div key={item.id} onClick={()=>setVendo(item)} style={{padding:"11px 14px",border:"1.5px solid #E5E7EB",borderRadius:11,cursor:"pointer",background:"#FAFAFA",transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#F5F3FF"}
              onMouseLeave={e=>e.currentTarget.style.background="#FAFAFA"}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:16}}>{f?.icon||"📄"}</span>
                <span style={{fontSize:13,fontWeight:700,color:"#111",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.titulo||item.tipo}</span>
              </div>
              <div style={{fontSize:11,color:"#9CA3AF"}}>{item.ano} · {item.disciplina} · {new Date(item.created_at).toLocaleDateString("pt-BR")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [aba,setAba]=useState("ferramentas");
  const [catAtiva,setCatAtiva]=useState("todos");
  const [busca,setBusca]=useState("");
  const [modalFerramenta,setModalFerramenta]=useState(null);
  const [favoritos,setFavoritos]=useState([]);
  const [dbOk,setDbOk]=useState(null);

  useEffect(()=>{
    fetch(`${SUPABASE_URL}/rest/v1/planos_aula?limit=1`,{headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}})
      .then(r=>setDbOk(r.ok)).catch(()=>setDbOk(false));
  },[]);

  const toggleFav = id => setFavoritos(p=>p.includes(id)?p.filter(f=>f!==id):[...p,id]);

  const ferramentasFiltradas = FERRAMENTAS.filter(f=>{
    const matchCat = catAtiva==="todos"||f.cat===catAtiva||(catAtiva==="favoritos"&&favoritos.includes(f.id));
    const matchBusca = !busca||(f.nome+f.desc).toLowerCase().includes(busca.toLowerCase());
    return matchCat&&matchBusca;
  });

  const ABAS=[{id:"ferramentas",l:"✦ Ferramentas"},{id:"historico",l:"◈ Histórico"},{id:"banco",l:"◎ Banco"}];

  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#F8F7FF",minHeight:"100vh"}}>
      {/* HEADER */}
      <div style={{background:"#fff",borderBottom:"1.5px solid #E8E7F0",padding:"0 20px",display:"flex",alignItems:"center",gap:16,height:54,position:"sticky",top:0,zIndex:30}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🐝</div>
          <div>
            <div style={{fontSize:14,fontWeight:900,color:"#111",lineHeight:1.1,letterSpacing:"-.01em"}}>Portal Aimê</div>
            <div style={{fontSize:9.5,color:"#9CA3AF",fontWeight:600,letterSpacing:".06em"}}>FERRAMENTAS PEDAGÓGICAS · IA</div>
          </div>
        </div>

        <div style={{display:"flex",gap:2,marginLeft:8}}>
          {ABAS.map(a=>(
            <button key={a.id} onClick={()=>setAba(a.id)} style={{padding:"6px 13px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12.5,fontWeight:700,background:aba===a.id?"#EEF2FF":"transparent",color:aba===a.id?"#6366F1":"#6B7280",transition:"all .12s"}}>{a.l}</button>
          ))}
        </div>

        <div style={{flex:1,maxWidth:300,marginLeft:"auto"}}>
          <input value={busca} onChange={e=>{setBusca(e.target.value);setAba("ferramentas");}} placeholder="Buscar ferramenta..." style={{width:"100%",padding:"7px 12px",border:"1.5px solid #E5E7EB",borderRadius:9,fontSize:13,fontFamily:"inherit",outline:"none",background:"#F9FAFB",boxSizing:"border-box"}}/>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11.5,flexShrink:0}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:dbOk===null?"#9CA3AF":dbOk?"#22C55E":"#F59E0B"}}/>
          <span style={{color:"#9CA3AF"}}>{dbOk===null?"…":dbOk?"Supabase":"Configurar"}</span>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div style={{display:"flex",maxWidth:1100,margin:"0 auto",padding:"20px 14px",gap:20}}>

        {/* SIDEBAR CATEGORIAS */}
        {aba==="ferramentas"&&(
          <div style={{width:180,flexShrink:0}}>
            <div style={{background:"#fff",border:"1.5px solid #E8E7F0",borderRadius:14,padding:"10px 8px"}}>
              {[...CATEGORIAS,{id:"favoritos",label:"Favoritos",icon:"★"}].map(c=>{
                const count = c.id==="todos"?FERRAMENTAS.length:c.id==="favoritos"?favoritos.length:FERRAMENTAS.filter(f=>f.cat===c.id).length;
                return (
                  <button key={c.id} onClick={()=>setCatAtiva(c.id)} style={{
                    width:"100%",padding:"8px 10px",borderRadius:9,border:"none",cursor:"pointer",
                    display:"flex",alignItems:"center",gap:8,textAlign:"left",
                    background:catAtiva===c.id?"#EEF2FF":"transparent",
                    color:catAtiva===c.id?"#6366F1":"#374151",
                    transition:"all .1s",marginBottom:1
                  }}>
                    <span style={{fontSize:16,flexShrink:0}}>{c.icon}</span>
                    <span style={{fontSize:12.5,fontWeight:catAtiva===c.id?700:400,flex:1}}>{c.label}</span>
                    <span style={{fontSize:10,color:catAtiva===c.id?"#818CF8":"#9CA3AF",fontWeight:600}}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL */}
        <div style={{flex:1,minWidth:0}}>
          {aba==="ferramentas"&&(
            <div>
              {busca&&<div style={{fontSize:13,color:"#6B7280",marginBottom:12}}>{ferramentasFiltradas.length} resultado(s) para "<b>{busca}</b>"</div>}
              {!busca&&catAtiva==="todos"&&(
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>⭐ Destaques</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:10}}>
                    {FERRAMENTAS.filter(f=>f.destaque).map(f=>(
                      <Card key={f.id} f={f} onOpen={setModalFerramenta} favoritos={favoritos} toggleFav={toggleFav}/>
                    ))}
                  </div>
                  <div style={{height:1,background:"#F0EFF8",margin:"18px 0"}}/>
                  <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Todas as ferramentas</div>
                </div>
              )}
              {ferramentasFiltradas.length===0?(
                <div style={{textAlign:"center",padding:48,color:"#9CA3AF"}}>
                  <div style={{fontSize:32,marginBottom:8}}>🔍</div>
                  <div style={{fontSize:14,fontWeight:600}}>Nenhuma ferramenta encontrada</div>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:10}}>
                  {ferramentasFiltradas.filter(f=>!(!busca&&catAtiva==="todos"&&f.destaque)).map(f=>(
                    <Card key={f.id} f={f} onOpen={setModalFerramenta} favoritos={favoritos} toggleFav={toggleFav}/>
                  ))}
                </div>
              )}
            </div>
          )}

          {aba==="historico"&&<HistoricoView/>}

          {aba==="banco"&&(
            <div style={{maxWidth:640}}>
              <h2 style={{fontSize:19,fontWeight:800,color:"#111",marginBottom:4}}>Banco de dados · Supabase</h2>
              <p style={{fontSize:13,color:"#6B7280",marginBottom:18}}>Projeto: <code style={{background:"#EEF2FF",padding:"1px 6px",borderRadius:4,color:"#6366F1",fontFamily:"monospace",fontSize:12}}>vcvayipstgbksiehvolp</code></p>
              <div style={{background:"#fff",border:"1.5px solid #E5E7EB",borderRadius:14,padding:18,marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Migration SQL</div>
                <pre style={{background:"#1E1B4B",borderRadius:10,padding:16,fontSize:11.5,color:"#C7D2FE",fontFamily:"monospace",lineHeight:1.7,margin:0,overflowX:"auto",whiteSpace:"pre-wrap"}}>
{`-- Execute no SQL Editor do Supabase
create table if not exists public.planos_aula (
  id          uuid primary key default gen_random_uuid(),
  tipo        text not null,
  ano         text,
  bimestre    text,
  disciplina  text,
  bloom       text,
  titulo      text,
  habilidades_bncc text[] default '{}',
  conteudo    text,
  created_at  timestamptz default now()
);
alter table public.planos_aula enable row level security;
create policy "select_all" on public.planos_aula for select using (true);
create policy "insert_all" on public.planos_aula for insert with check (true);
create index if not exists idx_tipo on public.planos_aula(tipo);
create index if not exists idx_ano  on public.planos_aula(ano);`}
                </pre>
                <a href="https://supabase.com/dashboard/project/vcvayipstgbksiehvolp/sql/new" target="_blank" rel="noreferrer"
                  style={{display:"inline-block",marginTop:10,padding:"7px 14px",borderRadius:8,background:"#6366F1",color:"#fff",fontSize:12.5,fontWeight:700,textDecoration:"none"}}>
                  Abrir SQL Editor ↗
                </a>
              </div>
              <div style={{background:"#fff",border:"1.5px solid #E5E7EB",borderRadius:14,padding:18}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Configurar chave anon</div>
                <p style={{fontSize:12.5,color:"#6B7280",marginBottom:10}}>Substitua <code style={{background:"#F3F4F6",padding:"1px 5px",borderRadius:4,fontFamily:"monospace"}}>SUBSTITUA_PELA_SUA_CHAVE_ANON</code> pela sua chave real.</p>
                <a href="https://supabase.com/dashboard/project/vcvayipstgbksiehvolp/settings/api" target="_blank" rel="noreferrer"
                  style={{display:"inline-block",padding:"7px 14px",borderRadius:8,background:"#F0FDF4",color:"#15803D",fontSize:12.5,fontWeight:700,textDecoration:"none",border:"1.5px solid #BBF7D0"}}>
                  Ver API Keys ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalFerramenta&&<Modal ferramenta={modalFerramenta} onClose={()=>setModalFerramenta(null)}/>}
    </div>
  );
}
