document.addEventListener('DOMContentLoaded', function () {

  /*
   * Trick Collection
   */

  var TrickModel = Backbone.Model.extend();
  var TrickCollection = Backbone.Collection.extend({model: TrickModel});

  TrickCollection.prototype.add = function (model) {
    var id = this.models.length + 1;
    var model = Backbone.Collection.prototype.add.apply(this, [_.extend({id: id}, model)]);

    if (id === 1) model.set('state', 'current');
    if (id === 2) model.set('state', 'next');

    model.on('change:state', _.bind(function () {
      if (model.get('state') === 'finished') {
        var next = this.get(model.get('id') + 1);
        var future = this.get(model.get('id') + 1);

        if (!!next) next.set('state', 'current');
        if (!!future) future.set('state', 'next');
      }
    }, this));
  };


  var tricks = new TrickCollection();

  tricks.add({
    combinations: [
      {name: 'set-of-three'},
      {name: 'set-of-three'},
    ]
  });

  tricks.add({
    combinations: [
      {name: 'suite-of-four'},
      {name: 'set-of-three'},
    ]
  });

  tricks.add({
    combinations: [
      {name: 'set-of-four'},
      {name: 'set-of-four'},
    ]
  });

  tricks.add({
    combinations: [
      {name: 'suite-of-four'},
      {name: 'suite-of-four'},
    ]
  });

  tricks.add({
    combinations: [
      {name: 'set-of-three'},
      {name: 'set-of-three'},
      {name: 'set-of-three'},
    ]
  });

  tricks.add({
    combinations: [
      {name: 'suite-of-four'},
      {name: 'set-of-three'},
      {name: 'set-of-three'},
    ]
  });

  tricks.add({
    combinations: [
      {name: 'suite-of-five'},
      {name: 'set-of-four'},
    ]
  });

  tricks.add({
    combinations: [
      {name: 'suite-of-five'},
      {name: 'suite-of-five'},
    ]
  });

  tricks.add({
    combinations: [
      {name: 'suite-of-five'},
      {name: 'set-of-three'},
      {name: 'set-of-three'},
    ]
  });

  tricks.add({
    combinations: [
      {name: 'suite-of-seven'},
      {name: 'set-of-four'},
    ]
  });

  /*
   * Trick View
   */

  var TrickView = Backbone.View.extend();

  TrickView.prototype.template = Handlebars.compile($('#trick-template').text());

  TrickView.prototype.tagName = 'section';
  TrickView.prototype.className = 'page trick';
  TrickView.prototype.events = {
    'click footer button': 'onClickFinish'
  };

  TrickView.prototype.initialize = function () {
    _.bindAll(this, 'showState', 'onClickFinish');
    this.showState();
    this.model.on('change:state', this.showState);
  };

  TrickView.prototype.onClickFinish = function () {
    this.model.set('state', 'finished');
  };

  TrickView.prototype.showState = function () {
    switch (this.model.get('state')) {
      case 'current':
        this.setAsCurrent();
        break;

      case 'next':
        this.setAsNext();
        break;

      case 'finished':
        this.setAsFinished();
        break;

      default:
        break;
    };
  };


  TrickView.prototype.setAsFinished = function () {
    this.el.classList.remove('current');
    this.el.classList.add('finished');
  };

  TrickView.prototype.setAsNext = function () {
    this.el.classList.add('next');
  };

  TrickView.prototype.setAsCurrent = function () {
    this.el.classList.remove('next');
    this.el.classList.add('current');
  };

  TrickView.prototype.render = function (opts) {
    this.$el.html(this.template({trick: this.model.toJSON()}));
    return this;
  };

  /*
   * boot
   */


  $(document.body).html(
    tricks.map(function (trick) {
      return new TrickView({model: trick}).render().el
    })
  )
});