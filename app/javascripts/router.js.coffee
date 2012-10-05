class pp.router extends Backbone.Router
  routes:
    '':              'root'
    'search/:query': 'search'

  initialize: (options) ->
    @controller = options.controller

  root: ->
    @controller.root()

  search: (query) ->
    @controller.searchRecords(query)
