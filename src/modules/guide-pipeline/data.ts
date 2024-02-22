export const nodes = [
  {
    id: '1',
    shape: 'guide-input-node',
    x: 160,
    y: 60,
    data: {
      name: 'Alice',
      icon: '',
    },
  },
  {
    id: '2',
    shape: 'guide-input-node',
    x: 160,
    y: 220,
    data: {
      name: 'Bob',
      icon: '',
    },
  },
  {
    id: '3',
    shape: 'guide-node',
    x: 260,
    y: 140,
    data: {
      name: '达成合作',
      icon: '',
      index: 1,
      description: '双方线下沟通',
    },
  },

  {
    id: '4',
    shape: 'guide-node',
    x: 650,
    y: 60,
    data: {
      name: '发起任务',
      icon: '',
      index: 2,
      description: '配置任务信息',
    },
  },

  {
    id: '5',
    shape: 'guide-node',
    x: 650,
    y: 220,
    data: {
      name: '同意任务',
      icon: '',
      index: 3,
      description: '自动校验信息',
    },
  },
  {
    id: '6',
    shape: 'guide-node',
    x: 900,
    y: 140,
    data: {
      name: '执行任务',
      icon: '',
      index: 4,
      description: '同意后开始执行',
    },
  },
  {
    id: '7',
    shape: 'guide-node',
    x: 1250,
    y: 140,
    data: {
      name: '查看产出结果',
      icon: '',
      index: 5,
      description: '下载到本地查看',
    },
  },
];

export const edges = [
  {
    id: '1-3',
    shape: 'guide-edge',
    source: '1',
    target: {
      cell: '3',
      // anchor: 'top',
      // connectionPoint: 'anchor',
    },
    router: 'orth',
  },
  {
    id: '2-3',
    shape: 'guide-edge',
    source: '2',
    target: '3',
    router: 'orth',
  },
  {
    id: '3-4',
    shape: 'guide-edge',
    source: '3',
    target: '4',
  },
  {
    id: '4-5',
    shape: 'guide-edge',
    source: '4',
    target: '5',
  },
  {
    id: '4-6',
    shape: 'guide-edge',
    source: '4',
    target: '6',
    router: 'orth',
  },
  {
    id: '5-6',
    shape: 'guide-edge',
    source: '5',
    target: '6',
    router: 'orth',
  },
  {
    id: '6-7',
    shape: 'guide-edge',
    source: '6',
    target: '7',
  },
];
