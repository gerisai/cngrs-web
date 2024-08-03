const roleMappings = {
  root: [
    {
      resource: 'user',
      verbs: ['CREATE', 'READ', 'LIST', 'UPDATE', 'DELETE'],
    },
    {
      resource: 'person',
      verbs: ['CREATE', 'READ','LIST', 'UPDATE', 'DELETE'],
    }
  ],
  admin: [
      {
        resource: 'user',
        verbs: ['CREATE', 'READ', 'LIST', 'UPDATE'],
      },
      {
        resource: 'person',
        verbs: ['CREATE', 'READ', 'LIST', 'UPDATE'],
      }
  ],
  operator: [
    {
      resource: 'user',
      verbs: ['READ'],
    },
    {
      resource: 'person',
      verbs: ['CREATE', 'READ', 'LIST', 'UPDATE', 'DELETE'],
    }
  ]
}

function canRoleDo(role, verb, resource) {

  const policies = roleMappings[role];
  for (const policy of policies) {
    if (policy.resource == resource && policy.verbs.includes(verb)) return true;
    return false
  }
}

export default canRoleDo;
