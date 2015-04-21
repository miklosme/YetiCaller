Meteor.publish('wars', function() {
  return Wars.find({});
});

Meteor.publish('clans', function() {
  return Clans.find({});
});

Meteor.publish('regtokens', function() {
  return RegistrationTokens.find({});
});

Meteor.publish('chat', function() {
  return Chat.find({});
});

Meteor.publish("allUserData", function () {
    return Meteor.users.find({}, {fields: {'profile': 1}});
});

/*Meteor.publish('privateLists', function() {
  if (this.userId) {
    return Lists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);

  return Todos.find({listId: listId});
});*/
