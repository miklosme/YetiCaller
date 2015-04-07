var ERRORS_KEY = 'joinErrors';
var IS_NEW_CLAN = 'regType';

Template.join.onCreated(function() {
  Session.set(ERRORS_KEY, {});
  Session.set(IS_NEW_CLAN, true);
});

Template.join.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  },
  newClanClass: function() {
    return !Session.get(IS_NEW_CLAN) && 'hidden';
  },
  joinClanClass: function() {
    return Session.get(IS_NEW_CLAN) && 'hidden';
  }
});

Template.join.events({
  'click #newclan': function(event, template) {
    Session.set(IS_NEW_CLAN, true);
  },
  'click #joinclan': function(event, template) {
    Session.set(IS_NEW_CLAN, false);
  },
  'submit': function(event, template) {
    event.preventDefault();
    var token = template.$('[name=token]').val();
    var nickName = template.$('[name=nickname]').val();
    var clanName = template.$('[name=clanname]').val();
    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();
    var confirm = template.$('[name=confirm]').val();

    var errors = {};
    
    if (!Session.get(IS_NEW_CLAN)) {
      if (!token) {
        errors.regtoken = 'Registration token must be set, if you joining to your clan. You can get this from your clan Leaders';
      }
    }

    if (Session.get(IS_NEW_CLAN)) {
      if (!nickName) {
        errors.nickName = 'Your username in game is required';
      }
      
      if (!clanName) {
        errors.clanName = 'Clan name required';
      }
    }
    
    if (! email) {
      errors.email = 'Email required';
    }

    if (! password) {
      errors.password = 'Password required';
    }

    if (confirm !== password) {
      errors.confirm = 'Please confirm your password';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
    
    var clanID;

    if (Session.get(IS_NEW_CLAN)) {
      clanID = Clans.insert({
        createdAt: new Date(),
        name: clanName
      }, function(error) {
        if (error) {
          return Session.set(ERRORS_KEY, {'none': error.reason});
        }
      });
    } else {
      var regtoken = RegistrationTokens.findOne({token: token});
      
      if (!regtoken) {
        return Session.set(ERRORS_KEY, {'regtoken': 'Token is not valid!'});
      }
      
      nickName = regtoken.name;
      clanName = Clans.findOne({_id: regtoken.clanID}).name;
      clanID = regtoken.clanID;
      
      RegistrationTokens.remove({_id: regtoken._id});
    }

    Accounts.createUser({
      email: email,
      password: password,
      profile: {
        name: nickName,
        clanID: clanID,
        clanName: clanName,
        optin: true
      }
    }, function(error) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }
      Router.go('home');
    });
  }
});
