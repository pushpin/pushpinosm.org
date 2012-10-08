class pp.views.map extends Backbone.View

  initialize: ->
    @activeXHR = undefined
    @features  = []

    @mapbox = mapbox.map("map")
    @mapbox.addCallback('panned', @createMoveEndCallback)
    @mapbox.addCallback('zoomed', @createMoveEndCallback)

  limitOnScreen: 350
  baseURI: 'http://www.overpass-api.de/api/interpreter'
  baseQuery: ->
    "[out:json];(node[source~'Pushpin|Fulcrum'];);out meta;"

  render: ->
    @tileLayer = mapbox.layer().id('spatialnetworks.map-jt158wp6')
    @mapbox.addLayer(@tileLayer)
    @mapbox.centerzoom { lat: 34, lon: 0 }, 3
    @mapbox.ui.zoomer.add()
    @mapbox.ui.zoombox.add()
    @mapbox.ui.attribution.add()
    $attribution = $('.map-attribution')
    $attribution.html("Tiles Courtesy of <a href=\"http://www.mapbox.com/\" target=\"_blank\">
      MapBox</a> — “<a target=\"_blank\" href=\"http://creativecommons.org/licenses/by-sa/2.0/\">
      CC-BY-SA</a>  2012  <a target=\"_blank\" href=\"http://openstreetmap.org\">
      OpenStreetMap.org</a>  contributors”")

  moveEndCallback: =>
    boundingBox = @mapbox.getExtent()
    featuresInView = []
    for feature, index in @features
      break if featuresInView.length >= @limitOnScreen
      featuresInView.push(feature) if @featureIsInView(feature, boundingBox)

    @addFeatures(featuresInView)

  featureIsInView: (feature, box) ->
    lon = feature.geometry.coordinates[0]
    lat = feature.geometry.coordinates[1]
    box.west < lon < box.east && box.south < lat < box.north

  createMoveEndCallback: =>
    clearTimeout(@_timeout)
    @_timeout = setTimeout(@moveEndCallback, 100)

  renderNoSearchResults: ->
    @removeMarkerLayer()
    $('#no-results').fadeIn()
    setTimeout ->
      $('#no-results').fadeOut()
    , 8000

  buildQuery: (query) ->
    "[out:json];(node[source~'Pushpin|Fulcrum'][name~'#{query}'];);out meta;"

  fetchWithCustomQuery: (query)->
    @fetch @buildQuery(query)

  removeMarkerLayer: ->
    @markerLayer?.features([])

  fetch: (query) ->
    $('#no-results').fadeOut()
    @removeMarkerLayer()
    @activeXHR?.abort()

    url = "#{@baseURI}?data=#{window.encodeURIComponent(query or @baseQuery())}"
    @activeXHR = $.get(url, @queryCallback)

  queryCallback: (json) =>
    if json && json.elements && json.elements.length > 0
      @features.push @createFeature(element) for element in json.elements
      @moveEndCallback()
    else
      @renderNoSearchResults()

    @activeXHR = undefined

  createFeature: (element) ->
    geometry:
      type: "Point"
      coordinates: [element.lon, element.lat]

    properties:
      'marker-color': '#377099',
      'marker-symbol': pp.maki.findTag(element.tags),
      element: element

  addFeatures: (features) ->
    @mapbox.removeLayer(@markerLayer) if @markerLayer
    @markerLayer = mapbox.markers.layer().features(features)
    interaction = mapbox.markers.interaction(@markerLayer)
    template = _.template $("#popupTemplate").html()
    interaction.formatter(template)
    @mapbox.addLayer(@markerLayer)
