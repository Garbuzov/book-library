var app = app || {};

app.Book = Backbone.Model.extend({
  defaults: {
    coverImage: 'img/placeholder.png',
    title: 'No title',
    author: 'Unknown',
    releaseDate: 'Unknown',
    keywords: 'None'
  },
  parse: function( response ) {
    response.id = response._id;
    return response;
  }
});

app.Library = Backbone.Collection.extend({
  model: app.Book,
  url: '/api/books'
});

app.BookView = Backbone.View.extend({
  tagName: 'div',
  className: 'bookContainer',
  template: _.template($('#bookTemplate').html()),

  events : {
    'click .delete': 'deleteBook'
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  deleteBook: function() {
    //Delete view
    this.remove();

    //Delete model
    this.model.destroy();
  }
});

app.LibraryView = Backbone.View.extend({
    el: '#books',

    events: {
      'click #add': 'addBook'
    },

    initialize: function () {
      this.collection = new app.Library();
      this.collection.fetch({reset: true});
      this.render();

      this.listenTo( this.collection, 'add', this.renderBook );
      this.listenTo( this.collection, 'reset', this.render);
    },

    render: function () {
      this.collection.each(function (item) {
        this.renderBook(item);
      }, this);
    },

    renderBook: function (item) {

      var bookView = new app.BookView({
        model: item
      });
      this.$el.append(bookView.render().el);
    },

    addBook: function (e) {
      e.preventDefault();

      var formData = {};

      $('#addBook div').children('input').each(function(i, el){
        if($(el).val() !== '') {
          if (el.id === 'keywords'){
            formData[el.id] = [];
            _.each($(el).val().split(' '), function(keyword){
              formData[el.id].push({
                'keyword': keyword
              });
            });
          } else if (el.id === 'releaseDate') {
            formData[el.id] = $('#releaseDate').datepicker('getDate').getTime();
          } else {
            formData[el.id] = $(el).val();
          }
        }
      });

      this.collection.create(formData);
    }
});

$(function() {
  $( '#releaseDate' ).datepicker();
  new app.LibraryView();
});
