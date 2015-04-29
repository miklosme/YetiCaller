/*Template.clan.onRendered(function() {
  makeMembersSortable();
});*/

Template.clan.onRendered(function() {
  var user = Meteor.user();
  if (user && user.profile.rank >= RANK_ELDER) {
    var members = this.$('table#members tbody')[0];
    var that = this;
    dragula([members], {
      moves: function (el, container, handle) {
        return handle.className === 'name';
      }
    }).on('drop', function (el) {
      var order = {};
      that.$('table#members tbody tr').each(function(index) {
        order[$(this).data('id')] = index;
      });
      var clanID = user.profile.clanID;
      Meteor.call('reorderClan', clanID, order);
    });
  }
});

Template.clan.helpers({
  members: function() {
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
  },
  pending: function() {
    return RegistrationTokens.find({clanID: this._id});
  },
  optin: function() {
    return this.profile.optin;
  },
  canChangeOptin: function() {
    if (isLeader())
      return true;

    if (this._id === Meteor.user()._id) {
      return true;
    }

    return false;
  },
  rank: function() {
    switch (this.profile.rank) {
      case RANK_ELDER:     return '(elder)';
      case RANK_COLEADER:  return '(co-leader)';
      case RANK_LEADER:    return '(leader)';
      case RANK_ADMIN:     return '(admin)';
      default:             return '';
    }
  }
});

Template.clan.events({
  'submit': function(event, template) {
    event.preventDefault();

    var $input = template.$('[name=playername]');
    var name = $input.val();

    if (!name) {
      return;
    }

    RegistrationTokens.insert({
      name: name,
      token: makeToken(5),
      clanID: this._id
    }, function(err) {
      if (err)
        return;

      $input.val('');
    });
  },
  'click .cancel': function() {
    RegistrationTokens.remove({_id: this._id});
  },
  'click .promote': function() {
    Meteor.call("promotePlayer", this._id);
  },
  'click .demote': function() {
    var isMainLeader = (this.profile.rank == RANK_LEADER);

    if (!isMainLeader) {
      Meteor.call("demotePlayer", this._id);
    } else {
      if (this._id === Meteor.user()._id) {
        alert('To transfer leader rank, promote a co-loader.');
      } else {
        alert('You can\'t demote the leader ;(');
      }
    }
  },
  'click .kick': function() {
    var confirmed = window.confirm('Do you really want to kick ' + this.profile.name + '?');

    if (confirmed) {
      Meteor.call("kickPlayer", this._id);
    }
  },
  'change input.optin': function (event) {
     Meteor.call("setOptin", this._id, event.target.checked);
  }
});

function makeToken(size) {
    var text = "";
    //var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < size; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
