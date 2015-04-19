Template.registerHelper('isLeader', function() {
  var rank = Meteor.user().profile.rank || RANK_MEMBER;
  return (rank === RANK_LEADER) || (rank === RANK_COLEADER);
});
