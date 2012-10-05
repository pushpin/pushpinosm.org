class pp.views.map extends Backbone.View
  initialize: ->
    @mapbox = mapbox.map("map")

  maxRecords: 200

  baseQuery: ->
    "[out:json];(node[source~'Pushpin|Fulcrum'];);out #{@maxRecords};"

  render: ->
    @tileLayer = mapbox.layer()
      .id("base.live-land-tr,base.live-landuse-tr,base.live-water,base.live-streets")
    @mapbox.addLayer(@tileLayer)
    @mapbox.centerzoom { lat: 34, lon: 0}, 3
    @mapbox.ui.zoomer.add()
    @mapbox.ui.zoombox.add()

  renderNoSearchResults: ->
    @removeMarkerLayer()
    $('#no-results').fadeIn()

  buildQuery: (query) ->
    "[out:json];(node[source~'Pushpin|Fulcrum'][name~'#{query}'];);out #{@maxRecords};"

  fetchWithCustomQuery: (query)->
    query = @buildQuery(query)
    @fetch(query)

  removeMarkerLayer: ->
    @mapbox.removeLayer(@markerLayer) if @markerLayer

  fetch: (query) ->
    $('#no-results').fadeOut()
    @removeMarkerLayer()
    url = "http://www.overpass-api.de/api/interpreter?data=#{window.encodeURIComponent(query or @baseQuery())}"
    $.get url, (json) =>
      if json
        features = []
        if json.elements && json.elements.length > 0
          for element in json.elements
            features.push
              geometry:
                type: "Point"
                coordinates: [element.lon, element.lat]

              properties:
                'marker-color': '#808080',
                'marker-symbol': 'marker-stroked',
                title: 'Example Marker',
                description: 'This is a single marker.'
                element: element


          html = $("#popupTemplate").html()
          template = _.template(html)

          @markerLayer = mapbox.markers.layer().features(features)
          interaction = mapbox.markers.interaction(@markerLayer)
          interaction.formatter(template)
          @mapbox.addLayer(@markerLayer)
        else
          @renderNoSearchResults()

