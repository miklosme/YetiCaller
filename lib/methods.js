Meteor.methods({
  'registerTargetChatMessage': function(clanID, warID, targetIndex, message) {

    Chat.insert({
      name: Meteor.user().profile.name,
      message: message,
      clanID: clanID,
      warID: warID,
      targetIndex: targetIndex,
      createdAt: new Date()
    });
  },
  'reorderClan': function(clanID, order) {
    Clans.update(clanID, {
      $set: {
        'order': order
      }
    }, function(error) {
      if (error)
        console.log(error);
    });
  }
});
