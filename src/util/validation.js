const validationRules = {
  username: [
    {
      required: true,
      message: 'Ingresa el nombre usuario',
    },
    {
      pattern: /^[a-z]+$/,
      message: 'El usuario solo puede contener minúsculas'
    }
  ],
  password: [
    {
      required: true,
      message: 'Teclea tu contraseña',
    }
  ],
  name: [
    {
      required: true,
      message: 'Ingresa un nombre',
    },
    {
      pattern: /^[a-zA-Z\ ]+$/,
      message: 'El nombre solo puede contener letras'
    }
  ],
  role: [
    {
      required: true,
      message: 'Selecciona un rol',
    }
  ]
}

export default validationRules;