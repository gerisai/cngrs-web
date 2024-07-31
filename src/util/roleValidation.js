const getRoleMappings = (it) => {
  return {
    root: {
      user: [{
        verbs: ['CREATE', 'READ', 'LIST', 'UPDATE', 'DELETE'],
      }],
      person: [{
        verbs: ['CREATE', 'READ', 'LIST', 'UPDATE', 'DELETE'],
        conditions: {
          roles: ['admin', 'operator']
        }
      }],
    },
    admin: {
      user: [
        {
          verbs: ['CREATE', 'READ', 'LIST', 'UPDATE', 'DELETE'],
          conditions: {
            roles: ['operator']
          }
        },
        {
          verbs: ['READ', 'LIST'],
          conditions: {
            roles: ['admin']
          }
        }
      ],
      person: {
        verbs: ['CREATE', 'READ', 'LIST', 'UPDATE', 'DELETE'],
      },
    },
    operator: {
      user: [{
        verbs: ['READ'],
        conditions: {
          name: [it]
        }
      }],
      person: [{
        verbs: ['CREATE', 'READ', 'LIST', 'UPDATE', 'DELETE'],
      }],
    }
  }
}

function evaluateRole(role, action, details) {
  const { resource, verb } = action;
  const roleMappings = getRoleMappings(details.it);

  const permissions = roleMappings[role][resource];
  if (!permissions) return false; // No access to the resource
  for (const policy of permissions) {
    if (!policy.verbs.includes(verb)) continue; // No verbs over the resource
    for (condition in policy.conditions) { // Iterate over conditions to see restrictions
      if (!details[condition]) return true; // The actions does not have more details or do not apply
      if (policy.conditions[condition].includes(extra[condition])) return true; // Conditions allow it
      continue; // Policy is not valid, next one
    }
    return true; // No conditions, go ahead
  }
}

export default evaluateRole;
