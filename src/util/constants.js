export const pageSize = 10;

export const userFilters = [
  {
    label: 'Rol',
    value: 'role',
    children: [
      {
        label: 'Administrador',
        value: 'admin'
      },
      {
        label: 'Operador',
        value: 'operator'
      },
    ]
  }
]

export const staticCategories = ['room', 'accessed']

export function getStaticCategory (name) {
  const staticCategories = {
    accessed: [
      {
        label: 'Si',
        value: true
      },
      {
        label: 'No',
        value: false
      },
    ],
    room: [
      {
        label: 'Junior 203',
        value: 'Junior 203'
      },
      {
        label: 'Presidencial 309',
        value: 'Presidencial 309'
      },
    ],
  }
  return staticCategories[name];
};

export const emptyUsersFilter = {
  role: []
};

export const personFilters = [
  {
    label: 'Habitación',
    value: 'room',
    isLeaf: false
  },
  {
    label: 'Zona',
    value: 'zone',
    isLeaf: false
  },
  {
    label: 'Localidad',
    value: 'branch',
    isLeaf: false
  },
  {
    label: 'Ciudad',
    value: 'city',
    isLeaf: false
  },
  {
    label: 'Registrado',
    value: 'accessed',
    isLeaf: false
  }
]

export const emptyPeopleFilter = {
  room: [],
  zone: [],
  branch: [],
  city: [],
  accessed: []
};

export const csvFields = {
  usuarios: ['name','email'],
  asistentes: ['name', 'email', 'gender', 'cellphone', 'illness', 'tutor', 'zone', 'branch', 'room', 'age', 'city', 'activity']
}

export const activities = [
  '⚽️ Fútbol',
  '🏀 Basquetbol',
  '🏐 Voleibol',
  '🏉 Tochito',
  '🎾 Tenis',
  '🏊🏼 Natación',
  '♟️ Ajedrez',
  '🃏 Uno (Juego de mesa)',
  '🎲 Juegos de mesa variados',
  '🎸 Música libre',
]
