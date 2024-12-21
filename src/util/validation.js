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
      pattern: /^[a-zA-ZÀ-ž\ ]+$/,
      message: 'El nombre solo puede contener letras y espacios'
    }
  ],
  email: [
    {
      required: true,
      message: 'Ingresa un email',
    },
    {
      pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      message: 'Correo electrónico inválido'
    }
  ],
  cellphone: [
    {
      required: true,
      message: 'Ingresa tu teléfono',
    },
    {
      pattern: /^[0-9]+$/,
      message: 'Solo puede contener números'
    }
  ],
  gender: [
    {
      required: true,
      message: 'Selecciona un género',
    }
  ],
  city: [
    {
      required: true,
      message: 'Selecciona una ciudad',
    }
  ],
  room: [
    {
      required: true,
      message: 'Selecciona un cuarto',
    }
  ],
  age: [
    {
      pattern: /^[0-9]+$/,
      message: 'Solo puede contener números'
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
