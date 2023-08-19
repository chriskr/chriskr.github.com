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
  [C, [[B, 4]]],
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
  log('Free Form Traversal\n');
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
  log('DGT\n');
  dgt.forEach(({ traversals, repetitions }, index) => {
    log(`${indent(1)}step ${index + 1}`);
    if (repetitions) {
      log(`${indent(2)}traversals, repeated ${repetitions} times`);
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

const substract = (pathsA, pathsB) => {
  const keyMapA = new Map(pathsA.map((path) => [path, toKey(path)]));
  const keyMapB = new Map(pathsB.map((path) => [path, toKey(path)]));
  const keysA = new Set(Array.from(keyMapA.values()));
  const contained = new Set();

  pathsB.forEach((path) => {
    const pathKey = keyMapB.get(path);
    if (keysA.has(pathKey)) contained.add(pathKey);
  });
  return pathsA.filter((path) => !contained.has(keyMapA.get(path)));
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

const toGreenSpan = (str) =>
  `<span style="background-color: hsl(120, 100%, 90%)">${str}</span>`;

const main = () => {
  log(`${toGreenSpan('&nbsp;'.repeat(5))} contained in BFS and DGT`);
  log(
    'unfolded traversals, wich are contained in another traversal are removed, any sub-traversal will be returned anyway.\n'
  );
  printGraph(graph);
  const exaustedBFS = unfold([[A]], graph)
    .map((path) => path.join(' -> '))
    .sort();
  const exaustedDGT = unfoldDGT([[A]], DGT)
    .map((path) => path.join(' -> '))
    .sort();
  const bfsKeys = new Set(exaustedBFS);
  const dgtKeys = new Set(exaustedDGT);

  log(`unfolded with BFS:\n`);
  log(
    ...exaustedBFS.map((traversal) =>
      dgtKeys.has(traversal) ? toGreenSpan(traversal) : traversal
    )
  );
  //log(...exaustedBFS.map((path) => path.join(' -> ')).sort());
  log('\n');
  printDGT(DGT);
  log('\n');
  log(`unfold with DGT:\n`);
  log(
    ...exaustedDGT.map((traversal) =>
      bfsKeys.has(traversal) ? toGreenSpan(traversal) : traversal
    )
  );
};

window.onload = main;
