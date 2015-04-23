Meteor.methods({
  'registerTargetChatMessage': function(message, warID, targetIndex) {

    Chat.insert({
      name: Meteor.user().profile.name,
      message: message,
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
