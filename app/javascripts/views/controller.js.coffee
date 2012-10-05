class pp.views.controller extends Backbone.View
  initialize: ->
    @router = new pp.router(controller: @)
    @search = new pp.views.search(controller: @, router: @router)
    @map    = new pp.views.map(controller: @)
    Backbone.history.start()

  render: ->
    @search.render()
    @map.render()

  searchRecords: (query) ->
    $('#search input').val(query)
    @map.fetchWithCustomQuery(query)

  root: ->
    @map.fetch()
