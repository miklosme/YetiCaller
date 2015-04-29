function getClanID(userId) {
  var user = Meteor.users.findOne(userId);
  return user.profile.clanID;
}

Meteor.publish('wars', function() {
  if (this.userId) {
    return Wars.find({friendlyID: getClanID(this.userId)});
  } else {
    this.ready();
  }
});

Meteor.publish('clans', function() {
  if (this.userId) {
    return Clans.find(getClanID(this.userId));
  } else {
    return Clans.find(); // TODO: coz of register
    //this.ready();
  }
});

Meteor.publish('regtokens', function() {
  return RegistrationTokens.find(); // TODO
  /*if (this.userId) {
    return RegistrationTokens.find({clanID: getClanID(this.userId)});
  } else {
    this.ready();
  }*/
});

Meteor.publish('chat', function() {
  if (this.userId) {
    return Chat.find({clanID: getClanID(this.userId)});
  } else {
    this.ready();
  }
});

Meteor.publish('allUserData', function () {
  if (this.userId) {
    return Meteor.users.find({
      'profile.clanID': getClanID(this.userId)
    }, {
      fields: {'profile': 1}
    });
  } else {
    this.ready();
  }
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
