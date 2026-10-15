import fs from 'fs';
import path from 'path';

const enginePath = path.resolve('packages/engine/src/index.ts');
let content = fs.readFileSync(enginePath, 'utf8');

const scaffoldingMap = {
  ADD_LEFT_RIGHT: [
    {
      equation: '54 + 38',
      instruction: 'Some as dezenas primeiro, depois as unidades:',
      template: '54 + 38 = 54 + {tens} = {partial} + 8 = {answer}',
      blanks: [
        { key: 'tens', label: 'Dezenas (30)', expected: '30' },
        { key: 'partial', label: '54 + 30', expected: '84' },
        { key: 'answer', label: '84 + 8', expected: '92' },
      ],
    },
    {
      equation: '76 + 45',
      instruction: 'Decomponha 45 em 40 + 5:',
      template: '76 + 45 = 76 + {tens} = {partial} + 5 = {answer}',
      blanks: [
        { key: 'tens', label: '40', expected: '40' },
        { key: 'partial', label: '76 + 40', expected: '116' },
        { key: 'answer', label: '116 + 5', expected: '121' },
      ],
    },
    {
      equation: '47 + 36',
      instruction: 'Some 30 e depois incorpore 6:',
      template: '47 + 36 = 47 + {tens} = {partial} + 6 = {answer}',
      blanks: [
        { key: 'tens', label: 'Dezenas (30)', expected: '30' },
        { key: 'partial', label: '47 + 30', expected: '77' },
        { key: 'answer', label: '77 + 6', expected: '83' },
      ],
    },
  ],

  SUB_COMPENSATION: [
    {
      equation: '152 - 89',
      instruction: 'Subtraia 90 e some 1:',
      template: '152 - 89 = 152 - {round} = {partial} + 1 = {answer}',
      blanks: [
        { key: 'round', label: '90', expected: '90' },
        { key: 'partial', label: '152 - 90', expected: '62' },
        { key: 'answer', label: '62 + 1', expected: '63' },
      ],
    },
    {
      equation: '84 - 39',
      instruction: 'Subtraia 40 e compense somando 1:',
      template: '84 - 39 = 84 - {round} = {partial} + 1 = {answer}',
      blanks: [
        { key: 'round', label: 'Pivô (40)', expected: '40' },
        { key: 'partial', label: '84 - 40', expected: '44' },
        { key: 'answer', label: '44 + 1', expected: '45' },
      ],
    },
    {
      equation: '163 - 78',
      instruction: 'Subtraia 80 e devolva a folga de 2:',
      template: '163 - 78 = 163 - {round} = {partial} + 2 = {answer}',
      blanks: [
        { key: 'round', label: 'Pivô (80)', expected: '80' },
        { key: 'partial', label: '163 - 80', expected: '83' },
        { key: 'answer', label: '83 + 2', expected: '85' },
      ],
    },
  ],

  COMPLEMENT_100: [
    {
      equation: '100 - 64',
      instruction: 'Subtraia 6 de 9 e 4 de 10:',
      template: '9 - 6 = {first}, 10 - 4 = {second} -> {answer}',
      blanks: [
        { key: 'first', label: 'Primeiro dígito', expected: '3' },
        { key: 'second', label: 'Segundo dígito', expected: '6' },
        { key: 'answer', label: 'Total', expected: '36' },
      ],
    },
    {
      equation: '100 - 43',
      instruction: 'Sutra: Todos do 9 e o último do 10:',
      template: '9 - 4 = {first}, 10 - 3 = {second} -> {answer}',
      blanks: [
        { key: 'first', label: '9 - 4', expected: '5' },
        { key: 'second', label: '10 - 3', expected: '7' },
        { key: 'answer', label: 'Resultado', expected: '57' },
      ],
    },
    {
      equation: '100 - 28',
      instruction: 'Aplique o complemento de base 100:',
      template: '9 - 2 = {first}, 10 - 8 = {second} -> {answer}',
      blanks: [
        { key: 'first', label: '9 - 2', expected: '7' },
        { key: 'second', label: '10 - 8', expected: '2' },
        { key: 'answer', label: 'Resultado', expected: '72' },
      ],
    },
  ],

  DIV_4: [
    {
      equation: '528 ÷ 4',
      instruction: 'Corte 528 pela metade duas vezes:',
      template: '528 ÷ 2 = {half} -> {half} ÷ 2 = {answer}',
      blanks: [
        { key: 'half', label: 'Primeira metade (264)', expected: '264' },
        { key: 'answer', label: 'Segunda metade (132)', expected: '132' },
      ],
    },
    {
      equation: '248 ÷ 4',
      instruction: 'Primeira bisseção e segunda bisseção:',
      template: '248 ÷ 2 = {half} -> {half} ÷ 2 = {answer}',
      blanks: [
        { key: 'half', label: 'Metade de 248', expected: '124' },
        { key: 'answer', label: 'Metade de 124', expected: '62' },
      ],
    },
    {
      equation: '684 ÷ 4',
      instruction: 'Dupla bisseção mental:',
      template: '684 ÷ 2 = {half} -> {half} ÷ 2 = {answer}',
      blanks: [
        { key: 'half', label: 'Metade de 684', expected: '342' },
        { key: 'answer', label: 'Metade de 342', expected: '171' },
      ],
    },
  ],

  MULT_9_99: [
    {
      equation: '36 × 9',
      instruction: 'Multiplique por 10 e subtraia 36:',
      template: '36 × 10 = {ten} -> {ten} - 36 = {answer}',
      blanks: [
        { key: 'ten', label: '36 × 10', expected: '360' },
        { key: 'answer', label: '360 - 36', expected: '324' },
      ],
    },
    {
      equation: '54 × 9',
      instruction: 'Alavanca decimal de 10x menos 1x:',
      template: '54 × 10 = {ten} -> {ten} - 54 = {answer}',
      blanks: [
        { key: 'ten', label: '54 × 10', expected: '540' },
        { key: 'answer', label: '540 - 54', expected: '486' },
      ],
    },
    {
      equation: '23 × 99',
      instruction: 'Multiplique por 100 e subtraia 23:',
      template: '23 × 100 = {hundred} -> {hundred} - 23 = {answer}',
      blanks: [
        { key: 'hundred', label: '23 × 100', expected: '2300' },
        { key: 'answer', label: '2300 - 23', expected: '2277' },
      ],
    },
  ],

  MULT_5_50: [
    {
      equation: '86 x 5',
      instruction: 'Calcule a metade de 86 e multiplique por 10:',
      template: '86 / 2 = {half} -> {half} x 10 = {answer}',
      blanks: [
        { key: 'half', label: 'Metade de 86', expected: '43' },
        { key: 'answer', label: '43 x 10', expected: '430' },
      ],
    },
    {
      equation: '64 × 5',
      instruction: 'Metade de 64 com zero final:',
      template: '64 ÷ 2 = {half} -> {half} × 10 = {answer}',
      blanks: [
        { key: 'half', label: 'Metade de 64', expected: '32' },
        { key: 'answer', label: '32 × 10', expected: '320' },
      ],
    },
    {
      equation: '28 × 50',
      instruction: 'Metade de 28 com dois zeros:',
      template: '28 ÷ 2 = {half} -> {half} × 100 = {answer}',
      blanks: [
        { key: 'half', label: 'Metade de 28', expected: '14' },
        { key: 'answer', label: '14 × 100', expected: '1400' },
      ],
    },
  ],

  DIV_5: [
    {
      equation: '340 ÷ 5',
      instruction: 'Dobre 340 e corte o zero final:',
      template: '340 × 2 = {double} -> {double} ÷ 10 = {answer}',
      blanks: [
        { key: 'double', label: 'Dobro de 340', expected: '680' },
        { key: 'answer', label: '680 ÷ 10', expected: '68' },
      ],
    },
    {
      equation: '180 ÷ 5',
      instruction: 'Dobre 180 e divida por 10:',
      template: '180 × 2 = {double} -> {double} ÷ 10 = {answer}',
      blanks: [
        { key: 'double', label: '180 × 2', expected: '360' },
        { key: 'answer', label: '360 ÷ 10', expected: '36' },
      ],
    },
    {
      equation: '420 ÷ 5',
      instruction: 'Dobre 420 e desloque a casa decimal:',
      template: '420 × 2 = {double} -> {double} ÷ 10 = {answer}',
      blanks: [
        { key: 'double', label: 'Dobro de 420', expected: '840' },
        { key: 'answer', label: '840 ÷ 10', expected: '84' },
      ],
    },
  ],

  MULT_25: [
    {
      equation: '64 x 25',
      instruction: 'Divida 64 por 4 e multiplique por 100:',
      template: '64 / 4 = {quarter} -> {quarter} x 100 = {answer}',
      blanks: [
        { key: 'quarter', label: '64 / 4', expected: '16' },
        { key: 'answer', label: '16 x 100', expected: '1600' },
      ],
    },
    {
      equation: '48 × 25',
      instruction: 'Quarta parte de 48 com dois zeros:',
      template: '48 ÷ 4 = {quarter} -> {quarter} × 100 = {answer}',
      blanks: [
        { key: 'quarter', label: '48 ÷ 4', expected: '12' },
        { key: 'answer', label: '12 × 100', expected: '1200' },
      ],
    },
    {
      equation: '32 × 25',
      instruction: 'Divida por 4 e anexe 00:',
      template: '32 ÷ 4 = {quarter} -> {quarter} × 100 = {answer}',
      blanks: [
        { key: 'quarter', label: '32 ÷ 4', expected: '8' },
        { key: 'answer', label: '8 × 100', expected: '800' },
      ],
    },
  ],

  DIV_25: [
    {
      equation: '350 ÷ 25',
      instruction: 'Multiplique por 4 e divida por 100:',
      template: '350 × 4 = {quad} -> {quad} ÷ 100 = {answer}',
      blanks: [
        { key: 'quad', label: '350 × 4', expected: '1400' },
        { key: 'answer', label: '1400 ÷ 100', expected: '14' },
      ],
    },
    {
      equation: '600 ÷ 25',
      instruction: 'Quadruplique e corte dois zeros:',
      template: '600 × 4 = {quad} -> {quad} ÷ 100 = {answer}',
      blanks: [
        { key: 'quad', label: '600 × 4', expected: '2400' },
        { key: 'answer', label: '2400 ÷ 100', expected: '24' },
      ],
    },
    {
      equation: '450 ÷ 25',
      instruction: 'Quadruplique 450 e recue duas casas decimais:',
      template: '450 × 4 = {quad} -> {quad} ÷ 100 = {answer}',
      blanks: [
        { key: 'quad', label: '450 × 4', expected: '1800' },
        { key: 'answer', label: '1800 ÷ 100', expected: '18' },
      ],
    },
  ],

  MULT_11: [
    {
      equation: '52 x 11',
      instruction: 'Afaste os extremos e insira a soma:',
      template: '5 _ 2 com {sum} no meio -> {answer}',
      blanks: [
        { key: 'sum', label: '5 + 2', expected: '7' },
        { key: 'answer', label: 'Resultado', expected: '572' },
      ],
    },
    {
      equation: '35 × 11',
      instruction: 'Afaste 3 e 5 e intercale a soma:',
      template: '3 _ 5 com {sum} no meio -> {answer}',
      blanks: [
        { key: 'sum', label: '3 + 5', expected: '8' },
        { key: 'answer', label: 'Resultado', expected: '385' },
      ],
    },
    {
      equation: '62 × 11',
      instruction: 'Acordeão elástico: 6 nos extremos, soma no meio:',
      template: '6 _ 2 com {sum} no meio -> {answer}',
      blanks: [
        { key: 'sum', label: '6 + 2', expected: '8' },
        { key: 'answer', label: 'Resultado', expected: '682' },
      ],
    },
  ],

  MULT_TEENS_11_19: [
    {
      equation: '13 × 17',
      instruction: 'Some a unidade do segundo ao primeiro e multiplique as unidades:',
      template: '(13 + 7) = {cross} -> {cross} × 10 = {base} + (3 × 7 = {units}) -> {answer}',
      blanks: [
        { key: 'cross', label: '13 + 7', expected: '20' },
        { key: 'base', label: '20 × 10', expected: '200' },
        { key: 'units', label: '3 × 7', expected: '21' },
        { key: 'answer', label: 'Total', expected: '221' },
      ],
    },
    {
      equation: '14 × 16',
      instruction: 'Cruze 14 com 6 e adicione 4 × 6:',
      template: '(14 + 6) = {cross} -> {cross} × 10 = {base} + (4 × 6 = {units}) -> {answer}',
      blanks: [
        { key: 'cross', label: '14 + 6', expected: '20' },
        { key: 'base', label: '20 × 10', expected: '200' },
        { key: 'units', label: '4 × 6', expected: '24' },
        { key: 'answer', label: 'Total', expected: '224' },
      ],
    },
    {
      equation: '12 × 15',
      instruction: 'Base decimal 10 com desvios 2 e 5:',
      template: '(12 + 5) = {cross} -> {cross} × 10 = {base} + (2 × 5 = {units}) -> {answer}',
      blanks: [
        { key: 'cross', label: '12 + 5', expected: '17' },
        { key: 'base', label: '17 × 10', expected: '170' },
        { key: 'units', label: '2 × 5', expected: '10' },
        { key: 'answer', label: 'Total', expected: '180' },
      ],
    },
  ],

  MULT_ENDS_IN_1: [
    {
      equation: '31 × 51',
      instruction: 'Multiplique as dezenas, some as dezenas e adicione 1:',
      template: '30 × 50 = {tensProd} | 30 + 50 = {tensSum} -> {tensProd} + {tensSum} + 1 = {answer}',
      blanks: [
        { key: 'tensProd', label: '30 × 50', expected: '1500' },
        { key: 'tensSum', label: '30 + 50', expected: '80' },
        { key: 'answer', label: 'Total', expected: '1581' },
      ],
    },
    {
      equation: '21 × 41',
      instruction: 'Decomponha: dezenas multiplicadas + dezenas somadas + 1:',
      template: '20 × 40 = {tensProd} | 20 + 40 = {tensSum} -> {tensProd} + {tensSum} + 1 = {answer}',
      blanks: [
        { key: 'tensProd', label: '20 × 40', expected: '800' },
        { key: 'tensSum', label: '20 + 40', expected: '60' },
        { key: 'answer', label: 'Total', expected: '861' },
      ],
    },
    {
      equation: '61 × 31',
      instruction: 'Expansão unitária dos fatores:',
      template: '60 × 30 = {tensProd} | 60 + 30 = {tensSum} -> {tensProd} + {tensSum} + 1 = {answer}',
      blanks: [
        { key: 'tensProd', label: '60 × 30', expected: '1800' },
        { key: 'tensSum', label: '60 + 30', expected: '90' },
        { key: 'answer', label: 'Total', expected: '1891' },
      ],
    },
  ],

  DIFF_OF_SQUARES: [
    {
      equation: '59 x 61',
      instruction: 'Pivô 60 com desvio 1:',
      template: '(60 - 1)(60 + 1) = {square} - 1 = {answer}',
      blanks: [
        { key: 'square', label: '60^2', expected: '3600' },
        { key: 'answer', label: '3600 - 1', expected: '3599' },
      ],
    },
    {
      equation: '48 × 52',
      instruction: 'Pivô 50 com desvio 2:',
      template: '(50 - 2)(50 + 2) = {square} - 4 = {answer}',
      blanks: [
        { key: 'square', label: '50²', expected: '2500' },
        { key: 'answer', label: '2500 - 4', expected: '2496' },
      ],
    },
    {
      equation: '77 × 83',
      instruction: 'Pivô 80 com desvio 3:',
      template: '(80 - 3)(80 + 3) = {square} - 9 = {answer}',
      blanks: [
        { key: 'square', label: '80²', expected: '6400' },
        { key: 'answer', label: '6400 - 9', expected: '6391' },
      ],
    },
  ],

  SQUARES_ENDING_5: [
    {
      equation: '65^2',
      instruction: 'Multiplique 6 por 7 e termine com 25:',
      template: '6 x 7 = {prefix} -> {answer}',
      blanks: [
        { key: 'prefix', label: '6 x 7', expected: '42' },
        { key: 'answer', label: '42 anexado a 25', expected: '4225' },
      ],
    },
    {
      equation: '45²',
      instruction: 'Multiplique a dezena 4 pelo sucessor 5 e anexe 25:',
      template: '4 × 5 = {prefix} -> {answer}',
      blanks: [
        { key: 'prefix', label: '4 × 5', expected: '20' },
        { key: 'answer', label: '20 com final 25', expected: '2025' },
      ],
    },
    {
      equation: '85²',
      instruction: 'Multiplique 8 pelo sucessor 9 e finalize em 25:',
      template: '8 × 9 = {prefix} -> {answer}',
      blanks: [
        { key: 'prefix', label: '8 × 9', expected: '72' },
        { key: 'answer', label: '72 com final 25', expected: '7225' },
      ],
    },
  ],

  ANTYAYOREVA: [
    {
      equation: '64 × 66',
      instruction: 'Dezenas iguais a 6 e unidades 4 + 6 = 10:',
      template: '6 × 7 = {lead} | 4 × 6 = {tail} -> {answer}',
      blanks: [
        { key: 'lead', label: '6 × 7', expected: '42' },
        { key: 'tail', label: '4 × 6', expected: '24' },
        { key: 'answer', label: 'Total', expected: '4224' },
      ],
    },
    {
      equation: '43 × 47',
      instruction: 'Dezenas 4x5 e unidades 3x7:',
      template: '4 × 5 = {lead} | 3 × 7 = {tail} -> {answer}',
      blanks: [
        { key: 'lead', label: '4 × 5', expected: '20' },
        { key: 'tail', label: '3 × 7', expected: '21' },
        { key: 'answer', label: 'Total', expected: '2021' },
      ],
    },
    {
      equation: '82 × 88',
      instruction: 'Dezenas 8x9 e unidades 2x8:',
      template: '8 × 9 = {lead} | 2 × 8 = {tail} -> {answer}',
      blanks: [
        { key: 'lead', label: '8 × 9', expected: '72' },
        { key: 'tail', label: '2 × 8', expected: '16' },
        { key: 'answer', label: 'Total', expected: '7216' },
      ],
    },
  ],

  SQUARES_NEAR_50: [
    {
      equation: '53²',
      instruction: 'Desvio é +3 em relação a 50:',
      template: '25 + 3 = {lead} | 3² = {tail} -> {answer}',
      blanks: [
        { key: 'lead', label: '25 + 3', expected: '28' },
        { key: 'tail', label: '3² (2 dígitos: 09)', expected: '09' },
        { key: 'answer', label: 'Total', expected: '2809' },
      ],
    },
    {
      equation: '47²',
      instruction: 'Desvio é -3 em relação a 50:',
      template: '25 - 3 = {lead} | (-3)² = {tail} -> {answer}',
      blanks: [
        { key: 'lead', label: '25 - 3', expected: '22' },
        { key: 'tail', label: '(-3)² (2 dígitos: 09)', expected: '09' },
        { key: 'answer', label: 'Total', expected: '2209' },
      ],
    },
    {
      equation: '56²',
      instruction: 'Desvio é +6 em relação a 50:',
      template: '25 + 6 = {lead} | 6² = {tail} -> {answer}',
      blanks: [
        { key: 'lead', label: '25 + 6', expected: '31' },
        { key: 'tail', label: '6²', expected: '36' },
        { key: 'answer', label: 'Total', expected: '3136' },
      ],
    },
  ],

  YAVADUNAM_BASE_100: [
    {
      equation: '103 × 106',
      instruction: 'Desvios +3 e +6 da base 100:',
      template: '103 + 6 = {lead} | 3 × 6 = {tail} -> {answer}',
      blanks: [
        { key: 'lead', label: '103 + 6', expected: '109' },
        { key: 'tail', label: '3 × 6', expected: '18' },
        { key: 'answer', label: 'Total', expected: '10918' },
      ],
    },
    {
      equation: '105 × 107',
      instruction: 'Desvios +5 e +7 da base 100:',
      template: '105 + 7 = {lead} | 5 × 7 = {tail} -> {answer}',
      blanks: [
        { key: 'lead', label: '105 + 7', expected: '112' },
        { key: 'tail', label: '5 × 7', expected: '35' },
        { key: 'answer', label: 'Total', expected: '11235' },
      ],
    },
    {
      equation: '104 × 108',
      instruction: 'Desvios +4 e +8 da base 100:',
      template: '104 + 8 = {lead} | 4 × 8 = {tail} -> {answer}',
      blanks: [
        { key: 'lead', label: '104 + 8', expected: '112' },
        { key: 'tail', label: '4 × 8', expected: '32' },
        { key: 'answer', label: 'Total', expected: '11232' },
      ],
    },
  ],

  FERMI_MAGNITUDE: [
    {
      equation: '492 x 198',
      instruction: 'Aproxime para 500 x 200:',
      template: '500 x 200 = {est} -> Resposta aproximada: {answer}',
      blanks: [
        { key: 'est', label: '500 x 200', expected: '100000' },
        { key: 'answer', label: 'Opção correta (~97.416)', expected: '97416' },
      ],
    },
    {
      equation: '389 × 31',
      instruction: 'Arredonde 389 para 400 e 31 para 30:',
      template: '400 × 30 = {est} -> Resposta aproximada: {answer}',
      blanks: [
        { key: 'est', label: '400 × 30', expected: '12000' },
        { key: 'answer', label: 'Valor real (~12.059)', expected: '12059' },
      ],
    },
    {
      equation: '7920 ÷ 19',
      instruction: 'Aproxime para 8000 ÷ 20:',
      template: '8000 ÷ 20 = {est} -> Resposta aproximada: {answer}',
      blanks: [
        { key: 'est', label: '8000 ÷ 20', expected: '400' },
        { key: 'answer', label: 'Valor real (~416)', expected: '416' },
      ],
    },
  ],

  CUBE_ROOT_PERFECT: [
    {
      equation: '∛314432',
      instruction: 'Extraia unidade e dezena da raiz cúbica:',
      template: 'Termina em 2 -> unidade {u} | 314 fica entre 6³ e 7³ -> dezena {t} -> {answer}',
      blanks: [
        { key: 'u', label: 'Unidade (8)', expected: '8' },
        { key: 't', label: 'Dezena (6)', expected: '6' },
        { key: 'answer', label: 'Raiz final', expected: '68' },
      ],
    },
    {
      equation: '∛175616',
      instruction: 'Bijeção de finais cúbicos para 175.616:',
      template: 'Termina em 6 -> unidade {u} | 175 fica entre 5³ e 6³ -> dezena {t} -> {answer}',
      blanks: [
        { key: 'u', label: 'Unidade (6)', expected: '6' },
        { key: 't', label: 'Dezena (5)', expected: '5' },
        { key: 'answer', label: 'Raiz final', expected: '56' },
      ],
    },
    {
      equation: '∛59319',
      instruction: 'Bijeção de finais cúbicos para 59.319:',
      template: 'Termina em 9 -> unidade {u} | 59 fica entre 3³ e 4³ -> dezena {t} -> {answer}',
      blanks: [
        { key: 'u', label: 'Unidade (9)', expected: '9' },
        { key: 't', label: 'Dezena (3)', expected: '3' },
        { key: 'answer', label: 'Raiz final', expected: '39' },
      ],
    },
  ],

  RULE_OF_72: [
    {
      equation: 'Dobrar capital a 6% a.a.',
      instruction: 'Divida 72 pela taxa:',
      template: '72 ÷ 6 = {answer} anos',
      blanks: [{ key: 'answer', label: 'Anos', expected: '12' }],
    },
    {
      equation: 'Dobrar capital a 8% a.a.',
      instruction: 'Divida 72 pela taxa de juros:',
      template: '72 ÷ 8 = {answer} anos',
      blanks: [{ key: 'answer', label: 'Anos', expected: '9' }],
    },
    {
      equation: 'Dobrar capital a 12% a.a.',
      instruction: 'Cálculo do tempo de duplicação exponencial:',
      template: '72 ÷ 12 = {answer} anos',
      blanks: [{ key: 'answer', label: 'Anos', expected: '6' }],
    },
  ],

  MULT_125_750: [
    {
      equation: '32 × 125',
      instruction: 'Divida por 8 e acrescente três zeros:',
      template: '32 ÷ 8 = {oct} -> {oct} × 1000 = {answer}',
      blanks: [
        { key: 'oct', label: '32 ÷ 8', expected: '4' },
        { key: 'answer', label: 'Total', expected: '4000' },
      ],
    },
    {
      equation: '48 × 125',
      instruction: 'Divida por 8 e multiplique por 1000:',
      template: '48 ÷ 8 = {oct} -> {oct} × 1000 = {answer}',
      blanks: [
        { key: 'oct', label: '48 ÷ 8', expected: '6' },
        { key: 'answer', label: 'Total', expected: '6000' },
      ],
    },
    {
      equation: '64 × 125',
      instruction: 'Oitava parte com três zeros:',
      template: '64 ÷ 8 = {oct} -> {oct} × 1000 = {answer}',
      blanks: [
        { key: 'oct', label: '64 ÷ 8', expected: '8' },
        { key: 'answer', label: 'Total', expected: '8000' },
      ],
    },
  ],

  DECIMAL_FRAC_CONVERSION: [
    {
      equation: '48 × 0.25',
      instruction: 'Transforme o 0.25 em divisão por 4:',
      template: '48 ÷ 4 = {answer}',
      blanks: [{ key: 'answer', label: '48 ÷ 4', expected: '12' }],
    },
    {
      equation: '60 × 0.2',
      instruction: 'Multiplicar por 0.2 é o mesmo que dividir por 5:',
      template: '60 ÷ 5 = {answer}',
      blanks: [{ key: 'answer', label: '60 ÷ 5', expected: '12' }],
    },
    {
      equation: '36 × 0.75',
      instruction: '0.75 são três quartos (divida por 4 e multiplique por 3):',
      template: '(36 ÷ 4) × 3 = {step} × 3 = {answer}',
      blanks: [
        { key: 'step', label: '36 ÷ 4', expected: '9' },
        { key: 'answer', label: '9 × 3', expected: '27' },
      ],
    },
  ],

  VEDIC_CROSS: [
    {
      equation: '31 x 22',
      instruction: 'Calcule as partes cruzadas:',
      template: 'Unidades: {u}, Cruzado (3x2 + 1x2): {cross}, Dezenas: {d} -> {answer}',
      blanks: [
        { key: 'u', label: '1 x 2', expected: '2' },
        { key: 'cross', label: '6 + 2', expected: '8' },
        { key: 'd', label: '3 x 2', expected: '6' },
        { key: 'answer', label: 'Total', expected: '682' },
      ],
    },
    {
      equation: '23 × 21',
      instruction: 'Produto vertical das unidades, cruzado central, produto das dezenas:',
      template: 'Unidades: {u}, Cruzado (2x1 + 3x2): {cross}, Dezenas: {d} -> {answer}',
      blanks: [
        { key: 'u', label: '3 × 1', expected: '3' },
        { key: 'cross', label: '2 + 6', expected: '8' },
        { key: 'd', label: '2 × 2', expected: '4' },
        { key: 'answer', label: 'Total', expected: '483' },
      ],
    },
    {
      equation: '41 × 12',
      instruction: 'Multiplicação cruzada védica:',
      template: 'Unidades: {u}, Cruzado (4x2 + 1x1): {cross}, Dezenas: {d} -> {answer}',
      blanks: [
        { key: 'u', label: '1 × 2', expected: '2' },
        { key: 'cross', label: '8 + 1', expected: '9' },
        { key: 'd', label: '4 × 1', expected: '4' },
        { key: 'answer', label: 'Total', expected: '492' },
      ],
    },
  ],

  TRACHTENBERG_12: [
    {
      equation: '231 × 12',
      instruction: 'Dobre cada dígito e adicione o vizinho da direita:',
      template: '2×1 = {u} | 2×3+1 = {t} | 2×2+3 = {h} | 0×2+2 = {th} -> {answer}',
      blanks: [
        { key: 'u', label: 'Unidade (2)', expected: '2' },
        { key: 't', label: 'Dezena (7)', expected: '7' },
        { key: 'h', label: 'Centena (7)', expected: '7' },
        { key: 'th', label: 'Milhar (2)', expected: '2' },
        { key: 'answer', label: 'Total', expected: '2772' },
      ],
    },
    {
      equation: '142 × 12',
      instruction: 'Algoritmo de Trachtenberg para o 12:',
      template: '2×2 = {u} | 2×4+2 = {t} | 2×1+4 = {h} | 0×2+1 = {th} -> {answer}',
      blanks: [
        { key: 'u', label: 'Unidade', expected: '4' },
        { key: 't', label: 'Dezena', expected: '10' },
        { key: 'h', label: 'Centena (+1 do vai-um)', expected: '7' },
        { key: 'th', label: 'Milhar', expected: '1' },
        { key: 'answer', label: 'Total', expected: '1704' },
      ],
    },
    {
      equation: '314 × 12',
      instruction: 'Dobre cada algarismo e some o vizinho à direita:',
      template: '2×4 = {u} | 2×1+4 = {t} | 2×3+1 = {h} | 0×2+3 = {th} -> {answer}',
      blanks: [
        { key: 'u', label: 'Unidade', expected: '8' },
        { key: 't', label: 'Dezena', expected: '6' },
        { key: 'h', label: 'Centena', expected: '7' },
        { key: 'th', label: 'Milhar', expected: '3' },
        { key: 'answer', label: 'Total', expected: '3768' },
      ],
    },
  ],

  SQUARE_ROOT_PERFECT: [
    {
      equation: '√3136',
      instruction: 'Descubra a dezena e use o pivô terminado em 5:',
      template: '31 entre 5²=25 e 6²=36 -> dezena {d} | 55² = {piv} > 3136 -> raiz {answer}',
      blanks: [
        { key: 'd', label: 'Dezena (5)', expected: '5' },
        { key: 'piv', label: '55²', expected: '3025' },
        { key: 'answer', label: 'Raiz final', expected: '56' },
      ],
    },
    {
      equation: '√2209',
      instruction: 'Enquadramento quadrático no pivô 45²:',
      template: '22 entre 4²=16 e 5²=25 -> dezena {d} | 45² = {piv} < 2209 -> raiz {answer}',
      blanks: [
        { key: 'd', label: 'Dezena (4)', expected: '4' },
        { key: 'piv', label: '45²', expected: '2025' },
        { key: 'answer', label: 'Raiz final', expected: '47' },
      ],
    },
    {
      equation: '√5184',
      instruction: 'Enquadramento quadrático no pivô 75²:',
      template: '51 entre 7²=49 e 8²=64 -> dezena {d} | 75² = {piv} > 5184 -> raiz {answer}',
      blanks: [
        { key: 'd', label: 'Dezena (7)', expected: '7' },
        { key: 'piv', label: '75²', expected: '5625' },
        { key: 'answer', label: 'Raiz final', expected: '72' },
      ],
    },
  ],

  PERCENT_PIVOT_10_1: [
    {
      equation: '10% de 560',
      instruction: 'Desloque a vírgula uma casa para a esquerda:',
      template: '560 ÷ 10 = {answer}',
      blanks: [{ key: 'answer', label: '10%', expected: '56' }],
    },
    {
      equation: '10% de 840',
      instruction: 'Corte o zero para obter o pivô de 10%:',
      template: '840 ÷ 10 = {answer}',
      blanks: [{ key: 'answer', label: '10%', expected: '84' }],
    },
    {
      equation: '1% de 1500',
      instruction: 'Pivô de 1%: desloque duas casas decimais:',
      template: '1500 ÷ 100 = {answer}',
      blanks: [{ key: 'answer', label: '1%', expected: '15' }],
    },
  ],

  PERCENT_TIP_15: [
    {
      equation: '15% de 120',
      instruction: 'Calcule 10%, a metade e some:',
      template: '10% = {p10} | Metade = {p5} -> {p10} + {p5} = {answer}',
      blanks: [
        { key: 'p10', label: '10%', expected: '12' },
        { key: 'p5', label: '5%', expected: '6' },
        { key: 'answer', label: 'Total', expected: '18' },
      ],
    },
    {
      equation: '15% de 80',
      instruction: '10% + 5% da conta:',
      template: '10% = {p10} | Metade = {p5} -> {p10} + {p5} = {answer}',
      blanks: [
        { key: 'p10', label: '10%', expected: '8' },
        { key: 'p5', label: '5%', expected: '4' },
        { key: 'answer', label: 'Total', expected: '12' },
      ],
    },
    {
      equation: '15% de 240',
      instruction: 'Gorjeta mental rápida:',
      template: '10% = {p10} | Metade = {p5} -> {p10} + {p5} = {answer}',
      blanks: [
        { key: 'p10', label: '10%', expected: '24' },
        { key: 'p5', label: '5%', expected: '12' },
        { key: 'answer', label: 'Total', expected: '36' },
      ],
    },
  ],

  PERCENT_FRIENDLY_FRACTIONS: [
    {
      equation: '20% de 75',
      instruction: 'Substitua 20% pela divisão por 5:',
      template: '75 ÷ 5 = {answer}',
      blanks: [{ key: 'answer', label: '20%', expected: '15' }],
    },
    {
      equation: '25% de 84',
      instruction: '25% equivale à quarta parte do número:',
      template: '84 ÷ 4 = {answer}',
      blanks: [{ key: 'answer', label: '25%', expected: '21' }],
    },
    {
      equation: '75% de 48',
      instruction: '75% são 3 quartos: divida por 4 e multiplique por 3:',
      template: '(48 ÷ 4) × 3 = {step} × 3 = {answer}',
      blanks: [
        { key: 'step', label: '48 ÷ 4', expected: '12' },
        { key: 'answer', label: '12 × 3', expected: '36' },
      ],
    },
  ],

  PERCENT_SYMMETRY: [
    {
      equation: '18% de 50',
      instruction: 'Inverta a porcentagem para 50% de 18:',
      template: '50% de 18 = 18 ÷ 2 = {answer}',
      blanks: [{ key: 'answer', label: 'Resultado', expected: '9' }],
    },
    {
      equation: '16% de 25',
      instruction: 'Pela simetria: 16% de 25 = 25% de 16:',
      template: '25% de 16 = 16 ÷ 4 = {answer}',
      blanks: [{ key: 'answer', label: 'Resultado', expected: '4' }],
    },
    {
      equation: '32% de 50',
      instruction: 'Comutação de porcentagem: 50% de 32:',
      template: '50% de 32 = 32 ÷ 2 = {answer}',
      blanks: [{ key: 'answer', label: 'Resultado', expected: '16' }],
    },
  ],

  PERCENT_DISCOUNT_ADD: [
    {
      equation: '120 com 10% de desconto',
      instruction: 'Calcule 10% e deduza do valor total:',
      template: '10% de 120 = {d} -> 120 - {d} = {answer}',
      blanks: [
        { key: 'd', label: '10%', expected: '12' },
        { key: 'answer', label: 'Preço final', expected: '108' },
      ],
    },
    {
      equation: '80 com 20% de desconto',
      instruction: 'Calcule 20% e subtraia:',
      template: '20% de 80 = {d} -> 80 - {d} = {answer}',
      blanks: [
        { key: 'd', label: '20%', expected: '16' },
        { key: 'answer', label: 'Preço com desconto', expected: '64' },
      ],
    },
    {
      equation: '150 com 10% de acréscimo',
      instruction: 'Calcule 10% e some ao montante inicial:',
      template: '10% de 150 = {a} -> 150 + {a} = {answer}',
      blanks: [
        { key: 'a', label: '10%', expected: '15' },
        { key: 'answer', label: 'Preço final', expected: '165' },
      ],
    },
  ],
};

function formatScaffolding(tasks) {
  const lines = ['scaffolding: ['];
  for (const t of tasks) {
    lines.push('          {');
    lines.push(`            equation: ${JSON.stringify(t.equation)},`);
    lines.push(`            instruction: ${JSON.stringify(t.instruction)},`);
    lines.push(`            template: ${JSON.stringify(t.template)},`);
    lines.push('            blanks: [');
    for (const b of t.blanks) {
      lines.push('              {');
      lines.push(`                key: ${JSON.stringify(b.key)},`);
      lines.push(`                label: ${JSON.stringify(b.label)},`);
      lines.push(`                expected: ${JSON.stringify(b.expected)},`);
      lines.push('              },');
    }
    lines.push('            ],');
    lines.push('          },');
  }
  lines.push('        ],');
  return lines.join('\n');
}

// Replace each node's scaffolding block in index.ts
let replacedCount = 0;
for (const [nodeId, tasks] of Object.entries(scaffoldingMap)) {
  // Regex finding node definition and its scaffolding: [ ... ]
  // Match `id: 'NODE_ID',` and then the next `scaffolding: \[[\s\S]*?\n\s*\],`
  const nodeRegex = new RegExp(`(id:\\s*'${nodeId}',[\\s\\S]*?)(scaffolding:\\s*\\[[\\s\\S]*?\\n\\s*\\],)`, 'm');
  const match = content.match(nodeRegex);
  if (match) {
    const formatted = formatScaffolding(tasks);
    content = content.replace(nodeRegex, `$1${formatted}`);
    replacedCount++;
  } else {
    console.error('Could not find node:', nodeId);
  }
}

fs.writeFileSync(enginePath, content, 'utf8');
console.log(`Successfully updated ${replacedCount} nodes in packages/engine/src/index.ts!`);
