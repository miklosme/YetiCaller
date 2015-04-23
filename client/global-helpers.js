isLeader = function() {
  if (!Meteor.user())
    return false;

  var rank = Meteor.user().profile.rank || RANK_MEMBER;
  return (rank === RANK_LEADER) || (rank === RANK_COLEADER);
};

Template.registerHelper('isLeader', isLeader);

makeMembersSortable = function() {
  var user = Meteor.user();
  if (user && user.profile.rank >= RANK_ELDER) {
    var members = this.$('table#members tbody')[0];
    var that = this;
    dragula([members]).on('drop', function (el) {
      var order = {};
      that.$('table#members tbody tr').each(function(index) {
        order[$(this).data('id')] = index;
      });
      var clanID = user.profile.clanID;
      Meteor.call('reorderClan', clanID, order);
    });
  }
};

getMembersSorted = function() {
  var user = Meteor.user();
  if (user) {
    var clanID = user.profile.clanID;
    var order = Clans.findOne(clanID).order || {};
    var unsorted = Meteor.users.find({"profile.clanID": clanID}).fetch();
    var sorted = _.sortBy(unsorted, function(m) {
      return order[m._id] || 1;
    });
    return sorted;
  }
};
