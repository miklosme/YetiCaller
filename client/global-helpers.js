isLeader = function() {
  if (!Meteor.user())
    return false;

  var rank = Meteor.user().profile.rank || RANK_MEMBER;
  return (rank === RANK_LEADER) || (rank === RANK_COLEADER);
};

Template.registerHelper('isLeader', isLeader);
