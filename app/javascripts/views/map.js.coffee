class pp.views.map extends Backbone.View

  initialize: ->
    @mapbox = mapbox.map("map")
    @activeXHR = undefined
    @resetBoundingBox()

  maxRecords: 350

  baseURI: 'http://www.overpass-api.de/api/interpreter'
  baseQuery: ->
    "[out:json];(node[source~'Pushpin|Fulcrum'];);out meta #{@maxRecords};"

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

  renderNoSearchResults: ->
    @removeMarkerLayer()
    $('#no-results').fadeIn()
    setTimeout ->
      $('#no-results').fadeOut()
    , 8000

  buildQuery: (query) ->
    "[out:json];(node[source~'Pushpin|Fulcrum'][name~'#{query}'];);out meta #{@maxRecords};"

  fetchWithCustomQuery: (query)->
    query = @buildQuery(query)
    @fetch(query)

  removeMarkerLayer: ->
    @markerLayer?.features([])

  fetch: (query) ->
    $('#no-results').fadeOut()
    @removeMarkerLayer()
    @activeXHR?.abort()

    url = "#{@baseURI}?data=#{window.encodeURIComponent(query or @baseQuery())}"
    @activeXHR = $.get(url, @queryCallback)

  queryCallback: (json) =>
    features = []
    if json && json.elements && json.elements.length > 0
      for element in json.elements
        features.push @createFeature(element)
        @updateBoundingBox(element.lat, element.lon)

      @addFeatures(features)
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
    @markerLayer = mapbox.markers.layer().features(features)
    interaction = mapbox.markers.interaction(@markerLayer)
    template = _.template $("#popupTemplate").html()
    interaction.formatter(template)
    @mapbox.addLayer(@markerLayer)
    @mapbox.setExtent new MM.Extent(@boundingBox...)

  updateBoundingBox: (lat, long) ->
    if @boundingBox.length == 0
      newBoundingBox = [lat, long, lat, long]
    else
      newBoundingBox = []
      newBoundingBox.push [@boundingBox[0], lat ].sort()[0]
      newBoundingBox.push [@boundingBox[1], long].sort()[0]
      newBoundingBox.push [@boundingBox[2], lat ].sort()[1]
      newBoundingBox.push [@boundingBox[3], long].sort()[1]

    @boundingBox = newBoundingBox

  resetBoundingBox: ->
    @boundingBox = []

