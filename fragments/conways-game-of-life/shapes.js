const shapes = [
  {
    name: '',
    width: 5,
    height: 5,
    data: [
      1, 1, 1, 0, 1,
      1, 0, 0, 0, 0,
      0, 0, 0, 1, 1,
      0, 1, 1, 0, 1,
      1, 0, 1, 0, 1,
    ],
  },
  {
    name: '',
    width: 8,
    height: 6,
    data: [
      0, 0, 0, 0, 0, 0, 1, 0,
      0, 0, 0, 0, 1, 0, 1, 1,
      0, 0, 0, 0, 1, 0, 1, 0,
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 1, 0, 0, 0, 0, 0,
      1, 0, 1, 0, 0, 0, 0, 0,
    ],
  },
  {
    name: 'acorn',
    width: 7,
    height: 3,
    data: [
      0, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 1, 0, 0, 0,
      1, 1, 0, 0, 1, 1, 1,
    ],
  },
  {
    name: 'the r-pentomino',
    width: 3,
    height: 3,
    data: [
      0, 1, 1,
      1, 1, 0,
      0, 1, 0,
    ],
  },
  {
    name: '',
    width: 39,
    height: 1,
    data: [
      1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
    ],
  },
  {
    name: 'gosper glider gun',
    width: 36,
    height: 9,
    data: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
      1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
];