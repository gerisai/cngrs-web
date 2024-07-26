const validationRules = {
  username: [
    {
      required: true,
      message: 'Teclea tu usuario',
    }
  ],
  password: [
    {
      required: true,
      message: 'Teclea tu contraseña',
    }
  ]
}

export default validationRules;