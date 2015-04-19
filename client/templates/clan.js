Template.clan.helpers({
  members: function() {
    return Meteor.users.find({"profile.clanID": this._id}, {sort: {"profile.name": 1}});
  },
  pending: function() {
    return RegistrationTokens.find({clanID: this._id});
  },
  optin: function() {
    return this.profile.optin;
  },
  rank: function() {
    switch (this.profile.rank) {
      case RANK_ELDER:     return '(elder)';
      case RANK_COLEADER:  return '(co-leader)';
      case RANK_LEADER:    return '(leader)';
      case RANK_ADMIN:     return '(admin)';
      default:             return '';
    }
  },
  isLeader: function() {
    var rank = Meteor.user().profile.rank;
    return (rank === RANK_LEADER) || (rank === RANK_COLEADER);
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
