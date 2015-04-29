Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'appBody',

  // the appNotFound template is used for unknown routes and missing lists
  notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function() {
    return [
      Meteor.subscribe('wars'),
      Meteor.subscribe('chat'),
      Meteor.subscribe('clans'),
      Meteor.subscribe('allUserData'),
      Meteor.subscribe('regtokens')
    ];
  }
});

dataReadyHold = null;

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();

  // Show the loading screen on desktop
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}

Router.map(function() {
  this.route('join');
  this.route('signin');
  this.route('warDeclare');

  /*this.route('listsShow', {
    path: '/lists/:_id',
    // subscribe to todos before the page is rendered but don't wait on the
    // subscription, we'll just render the items as they arrive
    onBeforeAction: function () {
      this.todosHandle = Meteor.subscribe('todos', this.params._id);

      if (this.ready()) {
        // Handle for launch screen defined in app-body.js
        dataReadyHold.release();
      }
    },
    data: function () {
      return Lists.findOne(this.params._id);
    },
    action: function () {
      this.render();
    }
  });*/

  this.route('home', {
    path: '/',
    action: function() {
      this.render('welcome');
    }
  });

  this.route('war', {
    path: '/war/:_id',
    data: function () {
      return Wars.findOne(this.params._id);
    },
    action: function() {
      this.render();
    }
  });

  this.route('clan', {
    path: '/clan/:_id',
    data: function () {
      return Clans.findOne({_id: this.params._id});
    },
    action: function() {
      this.render();
    }
  });

  this.route('actual', {
    path: '/actual',
    action : function () {
      if (this.ready()) {
        var user = Meteor.user();
        if (!user) {
          return Router.go('home');
        }
        var clanID = Meteor.user().profile.clanID;
        var actualWar = Wars.findOne({friendlyID: clanID}, {
          sort: {"createdAt": -1}
        });
        if (actualWar._id) {
          Router.go('war', {_id: actualWar._id});
        } else {
          Router.go('clan', {_id: clanID});
        }
      }
    }
  });
});
