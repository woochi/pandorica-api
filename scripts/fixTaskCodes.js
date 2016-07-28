import mongoose from 'mongoose';
import bootstrap from './bootstrap';
import _ from 'lodash';

bootstrap();

const the100 = [
  'abwpu',
  'axkqf',
  'bwknq',
  'qmrby',
  'kbvsv',
  'vjugw',
  'vwhpl',
  'hcmbs',
  'hhtbc',
  'uljyj',
  'rzodu',
  'sfqsr',
  'mflpb',
  'tiqho',
  'prmas',
  'istee',
  'kkjgg',
  'abwou',
  'rcuws',
  'sioke',
  'xjtao',
  'ilcvm',
  'rtjgy',
  'msaxe',
  'bhkio',
  'jtrdf',
  'dyfmz',
  'wcgsb',
  'okvgp',
  'pxjjf',
  'ynkod',
  'srcph',
  'ibzoy',
  'oylbb',
  'hyglo',
  'uvaya',
  'uoczm',
  'ebffy',
  'vhsoy',
  'ihjnz',
  'spcwr',
  'vpxxj',
  'ritnv',
  'cbxmk',
  'lpivj',
  'bzqpd',
  'nmfau',
  'ouvmf',
  'gofom',
  'zzdiz',
  'kgcuy',
  'uqjcm',
  'mtwbr',
  'hsjro',
  'sdtfb',
  'pxvdi',
  'mzzql',
  'erjkx',
  'xigwl',
  'hkrbm',
  'ygyzs',
  'fsyxp',
  'bjlgv',
  'wiaoi',
  'gnwmk',
  'awant',
  'uicaf',
  'ycioz',
  'sfzhx',
  'ddcrg',
  'vfhsw',
  'nndpy',
  'xozsu',
  'rxwhq',
  'sotoc'
];

const the150 = [
  'acrwb',
  'scala',
  'yrddu',
  'syuvv',
  'rjgfw',
  'clhwe',
  'urkib',
  'vuyht',
  'sblyx',
  'lwrmv',
  'gyctt',
  'wpeei',
  'ntech',
  'pfaru',
  'gvpnn',
  'wuqug',
  'hsnry',
  'twedx',
  'okvrg',
  'ghrms',
  'lgcoe',
  'fbrbz',
  'nqsde',
  'lwmbo',
  'keqsi',
  'fjiik',
  'dywej',
  'gsldt',
  'tekrr',
  'glxuh',
  'qojtj',
  'hsiyx',
  'yibju',
  'jbsmh',
  'fjfmu',
  'ajldq',
  'dbzsf',
  'oizzi',
  'qqvfp',
  'zeszp',
  'cqgxj',
  'qnoio',
  'ulvyt',
  'fbkhp',
  'ajowt',
  'oeygy',
  'kqart',
  'etsdj',
  'fvjqv',
  'kemwd',
  'olspu',
  'nhvwj',
  'wxzmx',
  'bxymu',
  'qmklw',
  'oxsaj',
  'uqntx',
  'umlmb',
  'mwfky',
  'bjjov',
  'suiil',
  'sefaw',
  'wljie',
  'ywiqi',
  'adbys',
  'aguhv',
  'ddinw',
  'atuab',
  'ujctv',
  'sytbw'
];

const the170 = [
  'skoyn',
  'usuyp',
  'ldzgf',
  'dlkui',
  'qkgfk',
  'dretd',
  'ppbga',
  'uioxy',
  'lifuv',
  'asotm',
  'zbzww',
  'udxsp',
  'juuqs',
  'tlqdw',
  'uwomx',
  'uemaw',
  'hctcr',
  'ihtck',
  'ryugw',
  'tayku',
  'fvruz',
  'mvrsu',
  'wrdur',
  'tnpte',
  'srnvw',
  'abwgk'
];

const the180 = [
  'bolwf',
  'dtode',
  'kbifp',
  'xqvka',
  'alqrm',
  'vsbts',
  'szygu',
  'oykrh',
  'excfg',
  'vibfn',
  'gohxq',
  'legrc',
  'xpnbf',
  'bxlup',
  'owceq',
  'enbea',
  'dukis'
];

const the250 = [
  'gyqjd',
  'lenpx',
  'vgvbp',
  'iudip',
  'uhdot',
  'smgkv',
  'ilakb',
  'rvhvi',
  'ifyxp',
  'ujrhg',
  'csmzg',
  'wrcyk',
  'awolp',
  'outfn',
  'aauns'
];

const the300 = [
  'tduve',
  'nvmnq'
]

const quests = {
  '"Kivellä kiinnostaa"': 'mqhsn',
  'A Guest of Honour': 'brqzo',
  'A Night\'s Rest': 'ijuxu',
  'A Visit to the Nerd Girls': 'pewsw',
  'Badge of Honour': 'tsczs',
  'Bardly Endeavours': 'bjqpx',
  'Chaos: Boss Fight!': 'vylti',
  'Order: Boss Fight!': 'kzgjl',
  'Candy to the Cloackroom': 'xgpfs',
  'Chaotic Symbols': 'dkbez',
  'Cleanliness is Godly': 'dnvgu',
  'Guild Moment: Chaos': 'rpdtz',
  'Guild Moment: Order': 'djpxg',
  'Herald of Chaos': 'mqotq',
  'In Orderly Form': 'rlsmr',
  'Knowledge on Wheels': 'weuoj',
  'New Experiences': 'jeiqr',
  'Open Mic': 'altff',
  'Opening Ceremony': 'hyyfx',
  'Secret of the Iron': 'wugsr',
  'Strategic Maneuvers': 'vnoub',
  'The Gala': 'pzwsd',
  'True Colours of Chaos': 'oqffn',
  'True Colours of Order': 'cqeou',
  'Unholy Hymns': 'xpjzy',
}

const Quest = mongoose.model('Quest');
const Task = mongoose.model('Task');

_.forEach(quests, (code, title) => {
  Quest.update({title: title}, {$set: {code: code}}, {multi: true}, (err, response) => {
    console.log('UPDATED QUEST', title, code, response);
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
});

Task.find({points: 100}, (err, tasks) => {
  console.log('UPDATING Tasks 100', tasks.length);
  tasks.forEach((task, i) => {
    task.code = the100[i];
    task.save();
  });
});

Task.find({points: 150}, (err, tasks) => {
  console.log('UPDATING Tasks 150', tasks.length);
  tasks.forEach((task, i) => {
    task.code = the150[i];
    task.save();
  });
});

Task.find({points: 170}, (err, tasks) => {
  console.log('UPDATING Tasks 170', tasks.length);
  tasks.forEach((task, i) => {
    task.code = the170[i];
    task.save();
  });
});

Task.find({points: 180}, (err, tasks) => {
  console.log('UPDATING Tasks 180', tasks.length);
  tasks.forEach((task, i) => {
    task.code = the180[i];
    task.save();
  });
});

Task.find({points: 250}, (err, tasks) => {
  console.log('UPDATING Tasks 250', tasks.length);
  tasks.forEach((task, i) => {
    task.code = the250[i];
    task.save();
  });
});

Task.find({points: 300}, (err, tasks) => {
  console.log('UPDATING Tasks 300', tasks.length);
  tasks.forEach((task, i) => {
    task.code = the300[i];
    task.save();
  });
});
