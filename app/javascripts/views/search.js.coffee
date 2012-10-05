class pp.views.search extends Backbone.View
  el: '#search'
  events:
    'submit form': 'search'

  initialize: (options) ->
    @router = options.router
    @controller = options.controller

    $('img').ajaxStart -> $(this).fadeIn()
    $('img').ajaxStop -> $(this).fadeOut()

  search: (event) =>
    query = @$('input').val()
    @router.navigate("search/#{query}", trigger: true)
    event.preventDefault()

  ajaxStart: ->
    @$('img').fadeIn()
