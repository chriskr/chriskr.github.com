const log = (...args) => {
  const pre = document.querySelector('pre');
  if (pre.innerHTML.length > 0) {
    pre.innerHTML += '\n';
  }
  pre.innerHTML += args.map((s) => String(s)).join('\n');
};

const A = 'ArchService';
const B = 'ProcessStep';
const C = 'Decision';
const D = 'Deliverable';
const E = 'E';
const F = 'F';

const rawGrap = [
  [A, [[B]]],
  [B, [[B, 5], [C], [D]]],
  [C, [[B, 5]]],
];

const graph = new Map(
  rawGrap.map(([source, targets]) => {
    return [
      source,
      targets.map(([target, repetitions = 0]) => {
        const config = { isRepeating: Boolean(repetitions), repetitions };
        return { target, config };
      }),
    ];
  })
);

const last = (list) => list[list.length - 1];

const unfold = (paths, graph) => {
  const repetitions = new Set();
  const exausted = [];
  const nextPaths = [];
  paths.forEach((path) => {
    const refs = graph.get(last(path)) ?? [];
    if (
      refs.length === 0 ||
      refs.every(
        ({ config: { isRepeating, repetitions } }) =>
          isRepeating && repetitions === 0
      )
    ) {
      exausted.push(path);
      return;
    }
    refs.forEach((linked) => {
      const { target, config } = linked;
      if (config.isRepeating) {
        if (config.repetitions <= 0) return;
        repetitions.add(config);
      }
      nextPaths.push([...path, target]);
    });
  });

  repetitions.forEach((config) => {
    config.repetitions -= 1;
  });

  if (nextPaths.length > 0) {
    return unfold([...exausted, ...nextPaths], graph);
  } else {
    return exausted;
  }
};

const printGraph = (graph) => {
  log('traversals');
  Array.from(graph).forEach(([source, targets]) => {
    log(`from ${source}`);
    targets.forEach(({ target, config: { repetitions, isRepeating } }) => {
      if (isRepeating) {
        log(`   to ${target}, back reference, ${repetitions} times`);
      } else {
        log(`   to ${target}`);
      }
    });
  });
  log('\n');
};

const DGT = [
  {
    traversals: [[A, B]],
  },
  {
    traversals: [
      [B, B],
      [B, C],
      [C, B],
    ],
    repetitions: 5,
  },
  {
    traversals: [[B, D]],
  },
];

const indent = (n) => '  '.repeat(n);

const printDGT = (dgt) => {
  log('DGT');
  dgt.forEach(({ traversals, repetitions }, index) => {
    log(`${indent(1)}step ${index + 1}`);
    if (repetitions) {
      log(`${indent(2)}traversal, repeated ${repetitions} times`);
    } else {
      log(`${indent(2)}traversals`);
    }
    traversals.forEach(([source, target]) => {
      log(`${indent(3)}${source} -> ${target}`);
    });
  });
};

const toKey = (path) => path.join('->');

const isUniq = () => {
  const set = new Set();
  return (path) => {
    const key = toKey(path);
    const result = !set.has(key);
    set.add(key);
    return result;
  };
};

const removeSubPaths = (paths) => {
  const keyMap = new Map(paths.map((path) => [path, toKey(path)]));
  const keys = Array.from(keyMap.values());
  console.log(keyMap, keys);
  const sortedByLength = paths.sort((a, b) => a.length - b.length);
  return sortedByLength.filter((path) => {
    const pathKey = keyMap.get(path);

    return !keys.some((key) => key !== pathKey && key.startsWith(pathKey));
  });
};

const unfoldDGT = (paths, dgt, stepIndex = 0) => {
  console.log({ paths, stepIndex });
  let { traversals, repetitions = 1 } = dgt[stepIndex];
  while (repetitions > 0) {
    repetitions -= 1;
    const exhausted = new Set();
    const newPaths = [];
    paths.forEach((path) => {
      traversals.forEach(([source, target]) => {
        if (source === last(path)) {
          newPaths.push([...path, target]);
        } else {
          exhausted.add(path);
        }
      });
    });
    paths = [...exhausted, ...newPaths].filter(isUniq());
  }
  if (stepIndex < dgt.length - 1) {
    return unfoldDGT(paths, dgt, stepIndex + 1);
  } else {
    return removeSubPaths(paths);
  }
};

const checkmark = `<span style="color: #090">✓</span>`;

const main = () => {
  printGraph(graph);
  const exausted = unfold([[A]], graph);
  log(`unfolded with BFS (total ${exausted.length}):`);
  log(...exausted.map((path) => path.join(' |-> ')).sort());
  log('\n');
  printDGT(DGT);
  log('\n');
  const exausted2 = unfoldDGT([[A]], DGT);
  log(`unfold with DGT (total ${exausted2.length}):`);
  ('✓');
  const bfsKeys = exausted.map(toKey);
  log(...exausted2.map((path) => path.join(' |-> ')).sort());
  //log(
  //...exausted2.map((path) => {
  //const pathKey = toKey(path);
  //return `${path.join(' -> ')}${
  //  bfsKeys.some((key) => key.startsWith(pathKey)) ? ` ${checkmark}` : ''
  //}`;
  //})
  //);
};

window.onload = main;
