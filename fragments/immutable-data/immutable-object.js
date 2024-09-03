const getUUID = () => {
  return [8, 4, 4, 4, 12]
    .map((length) =>
      new Array(length)
        .fill(1)
        .map(() => ((Math.random() * 16) | 0).toString(16).toUpperCase())
        .join("")
    )
    .join("-");
};

const names = [
  "James",
  "Michael",
  "Robert",
  "John",
  "David",
  "William",
  "Richard",
  "Joseph",
  "Thomas",
  "Christopher",
  "Charles",
  "Daniel",
  "Matthew",
  "Anthony",
  "Mark",
  "Donald",
  "Steven",
  "Andrew",
  "Paul",
  "Joshua",
  "Kenneth",
  "Kevin",
  "Brian",
  "Timothy",
  "Ronald",
  "George",
  "Jason",
  "Edward",
  "Jeffrey",
  "Ryan",
  "Jacob",
  "Nicholas",
  "Gary",
  "Eric",
  "Jonathan",
  "Stephen",
  "Larry",
  "Justin",
  "Scott",
  "Brandon",
  "Benjamin",
  "Samuel",
  "Gregory",
  "Alexander",
  "Patrick",
  "Frank",
  "Raymond",
  "Jack",
  "Dennis",
  "Jerry",
  "Tyler",
  "Aaron",
  "Jose",
  "Adam",
  "Nathan",
  "Henry",
  "Zachary",
  "Douglas",
  "Peter",
  "Kyle",
  "Noah",
  "Ethan",
  "Jeremy",
  "Christian",
  "Walter",
  "Keith",
  "Austin",
  "Roger",
  "Terry",
  "Sean",
  "Gerald",
  "Carl",
  "Dylan",
  "Harold",
  "Jordan",
  "Jesse",
  "Bryan",
  "Lawrence",
  "Arthur",
  "Gabriel",
  "Bruce",
  "Logan",
  "Billy",
  "Joe",
  "Alan",
  "Juan",
  "Elijah",
  "Willie",
  "Albert",
  "Wayne",
  "Randy",
  "Mason",
  "Vincent",
  "Liam",
  "Roy",
  "Bobby",
  "Caleb",
  "Bradley",
  "Russell",
  "Luca",
];

const getName = () =>
  `${names[(Math.random() * names.length) | 0]} ${
    names[(Math.random() * names.length) | 0]
  } ${names[(Math.random() * names.length) | 0]}`;

const counts = 500000;

const log = (...args) => {
  document.querySelector("#log").textContent += args.join(" ") + "\n";
};

const main = () => {
  log(`number of objects: ${counts}`);

  const objects = new Array(counts).fill(1).map(() => ({
    id: getUUID(),
    name: getName(),
  }));

  let t = performance.now();
  const dict = _.keyBy(objects, "id");
  log("create dict:", performance.now() - t);

  t = performance.now();
  const map = new Map(objects.map((obj) => [obj.id, obj]));
  log("create map:", performance.now() - t);

  const updateRandomObjectInDict = (dict) => {
    const objId = objects[(Math.random() * objects.length) | 0].id;
    const newObj = { ...dict, objId: { ...dict[objId], name: getName() } };
    return newObj;
  };

  window.testDictUpdate = () => {
    const t = performance.now();
    updateRandomObjectInDict(dict);
    log("dict update random member:", performance.now() - t);
  };

  const updateRandomObjectInMap = (map) => {
    const objId = objects[(Math.random() * objects.length) | 0].id;
    const t = performance.now();
    const newMap = new Map(map);
    const obj = newMap.get(objId);
    newMap.set(objId, { ...obj, name: getName() });
    return newMap;
  };

  window.testMapUpdate = () => {
    const t = performance.now();
    updateRandomObjectInMap(map);
    log("map update random member:", performance.now() - t);
  };
};
