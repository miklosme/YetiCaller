Template.war.events({
  'click .delete-war': function() {
    Wars.remove(this._id);
    Router.go('home');
  }
});