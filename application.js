(function() {

  window.pp = {
    views: {}
  };

  $(document).ready(function() {
    return _.defer(function() {
      var controller;
      controller = new pp.views.controller;
      return controller.render();
    });
  });

  String.prototype.toTitleCase = function() {
    var smallWords;
    smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;
    return this.replace(/([^\W_]+[^\s-]*) */g, function(match, p1, index, title) {
      if (index > 0 && index + p1.length !== title.length && p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && title.charAt(index - 1).search(/[^\s-]/) < 0) {
        return match.toLowerCase();
      }
      if (p1.substr(1).search(/[A-Z]|\../) > -1) {
        return match;
      }
      return match.charAt(0).toUpperCase() + match.substr(1);
    });
  };

}).call(this);
(function() {
  var _this = this;

  pp.maki = {
    "default": 'marker',
    tags: ['circle-stroked', 'circle', 'square-stroked', 'square', 'triangle-stroked', 'triangle', 'star-stroked', 'star', 'cross', 'marker-stroked', 'marker', 'religious-jewish', 'religious-christian', 'religious-muslim', 'cemetery', 'airport', 'heliport', 'rail', 'rail-underground', 'rail-above', 'bus', 'fuel', 'parking', 'parking-garage', 'london-underground', 'airfield', 'roadblock', 'ferry', 'harbor', 'bicycle', 'park', 'park2', 'museum', 'lodging', 'monument', 'zoo', 'garden', 'campsite', 'theatre', 'art-gallery', 'pitch', 'soccer', 'america-football', 'tennis', 'basketball', 'baseball', 'golf', 'swimming', 'cricket', 'skiing', 'school', 'college', 'library', 'post', 'fire-station', 'town-hall', 'police', 'prison', 'embassy', 'beer', 'restaurant', 'cafe', 'shop', 'fast-food', 'bar', 'bank', 'grocery', 'cinema', 'pharmacy', 'hospital', 'minefield', 'industrial', 'warehouse', 'commercial'],
    findTag: function(tags) {
      var index;
      if (tags.shop) {
        return 'shop';
      }
      if (tags.leisure) {
        return 'pitch';
      }
      if (tags.tourism) {
        switch (tags.tourism) {
          case 'hotel':
            return 'lodging';
          case 'museum':
            return 'museum';
          default:
            return pp.maki["default"];
        }
      }
      if (tags.amenity) {
        switch (tags.amenity) {
          case 'place_of_worship':
            return pp.maki.placeOfWorship(tags);
          case 'courthouse':
            return 'prison';
          case 'fire_station':
            return 'fire-station';
          case 'post_office':
            return 'post';
          case 'grave_yard':
            return 'cemetery';
          case 'department_store':
            return 'shop';
          case 'fast_food':
            return 'fast-food';
          case 'pub':
            return 'beer';
          case 'stadium':
            return 'soccer';
          default:
            index = _.indexOf(pp.maki.tags, tags.amenity);
            if (index === -1) {
              return pp.maki["default"];
            } else {
              return pp.maki.tags[index];
            }
        }
      } else {
        return pp.maki["default"];
      }
    },
    placeOfWorship: function(tags) {
      var index, tag;
      if (tags.religion) {
        tag = "religious-" + tags.religion;
        index = _.indexOf(pp.maki.tags, tag);
        if (index === -1) {
          return pp.maki["default"];
        } else {
          return pp.maki.tags[index];
        }
      } else {
        return pp.maki["default"];
      }
    }
  };

}).call(this);
(function() {

  pp.helpers = {
    addressFields: ['addr:housenumber', 'addr:street', 'addr:city', 'addr:state', 'addr:postalcode', 'addr:postcode', 'addr:country'],
    formatAddress: function(tags) {
      var country, joined, lineOne, lineTwo, locality, postal, sub_admin_area, sub_thoroughfare, thoroughfare;
      sub_thoroughfare = tags['addr:housenumber'] || '';
      thoroughfare = tags['addr:street'] || '';
      locality = tags['addr:city'] || '';
      sub_admin_area = tags['addr:state'] || '';
      postal = tags['addr:postalcode'] || tags['addr:postcode'] || '';
      country = tags['addr:country'] || '';
      lineOne = _.compact([sub_thoroughfare, thoroughfare]);
      lineTwo = _.compact([locality, sub_admin_area]);
      joined = _.compact([postal, country]).join(', ');
      if (lineOne.length === 0 && lineTwo.length === 0 && country.length === 0 && postal.length === 0) {
        return "No address available for this record. Download Pushpin and help contribute to open data!";
      } else if (lineOne.length > 0 && lineTwo.length > 0 && country.length > 0) {
        return "" + (lineOne.join(' ')) + "<br>" + (lineTwo.join(', ')) + " " + joined;
      } else if (lineOne.length > 0) {
        return "" + (lineOne.join(' ')) + "<br>" + joined;
      } else if (lineTwo.length > 0) {
        return "" + (lineTwo.join(' ')) + "<br>" + joined;
      } else {
        return joined;
      }
    },
    labelFor: function(string) {
      switch (string) {
        case 'addr:city':
          return 'City';
        case 'addr:country':
          return 'Country';
        case 'addr:postalcode':
        case 'addr:postcode':
          return 'Postal Code';
        case 'addr:street':
          return 'Street';
        case 'addr:state':
          return 'State';
        case 'addr:housenumber':
          return 'Number';
        default:
          if (string.indexOf(':') === -1) {
            return string.toTitleCase();
          } else {
            return string;
          }
      }
    }
  };

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  pp.views.controller = (function(_super) {

    __extends(controller, _super);

    function controller() {
      return controller.__super__.constructor.apply(this, arguments);
    }

    controller.prototype.initialize = function() {
      this.router = new pp.router({
        controller: this
      });
      this.search = new pp.views.search({
        controller: this,
        router: this.router
      });
      this.map = new pp.views.map({
        controller: this
      });
      return Backbone.history.start();
    };

    controller.prototype.render = function() {
      this.search.render();
      return this.map.render();
    };

    controller.prototype.searchRecords = function(query) {
      $('#search input').val(query);
      return this.map.fetchWithCustomQuery(query);
    };

    controller.prototype.root = function() {
      return this.map.fetch();
    };

    return controller;

  })(Backbone.View);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  pp.views.map = (function(_super) {

    __extends(map, _super);

    function map() {
      this.queryCallback = __bind(this.queryCallback, this);
      return map.__super__.constructor.apply(this, arguments);
    }

    map.prototype.initialize = function() {
      this.mapbox = mapbox.map("map");
      this.activeXHR = void 0;
      return this.resetBoundingBox();
    };

    map.prototype.maxRecords = 200;

    map.prototype.mapSettings = ["base.live-land-tr", "base.live-landuse-tr", "base.live-water", "base.live-streets"];

    map.prototype.baseURI = 'http://www.overpass-api.de/api/interpreter';

    map.prototype.baseQuery = function() {
      return "[out:json];(node[source~'Pushpin|Fulcrum'];);out " + this.maxRecords + ";";
    };

    map.prototype.render = function() {
      var $attribution;
      this.tileLayer = mapbox.layer().id(this.mapSettings.join(','));
      this.mapbox.addLayer(this.tileLayer);
      this.mapbox.centerzoom({
        lat: 34,
        lon: 0
      }, 3);
      this.mapbox.ui.zoomer.add();
      this.mapbox.ui.zoombox.add();
      this.mapbox.ui.attribution.add();
      $attribution = $('.map-attribution');
      return $attribution.html("Tiles Courtesy of <a href=\"http://www.mapbox.com/\" target=\"_blank\">      MapBox</a> — “<a target=\"_blank\" href=\"http://creativecommons.org/licenses/by-sa/2.0/\">      CC-BY-SA</a>  2012  <a target=\"_blank\" href=\"http://openstreetmap.org\">      OpenStreetMap.org</a>  contributors”");
    };

    map.prototype.renderNoSearchResults = function() {
      this.removeMarkerLayer();
      return $('#no-results').fadeIn();
    };

    map.prototype.buildQuery = function(query) {
      return "[out:json];(node[source~'Pushpin|Fulcrum'][name~'" + query + "'];);out " + this.maxRecords + ";";
    };

    map.prototype.fetchWithCustomQuery = function(query) {
      query = this.buildQuery(query);
      return this.fetch(query);
    };

    map.prototype.removeMarkerLayer = function() {
      var _ref;
      return (_ref = this.markerLayer) != null ? _ref.features([]) : void 0;
    };

    map.prototype.fetch = function(query) {
      var url, _ref;
      $('#no-results').fadeOut();
      this.removeMarkerLayer();
      if ((_ref = this.activeXHR) != null) {
        _ref.abort();
      }
      url = "" + this.baseURI + "?data=" + (window.encodeURIComponent(query || this.baseQuery()));
      return this.activeXHR = $.get(url, this.queryCallback);
    };

    map.prototype.queryCallback = function(json) {
      var element, features, _i, _len, _ref;
      features = [];
      if (json && json.elements && json.elements.length > 0) {
        _ref = json.elements;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          features.push(this.createFeature(element));
          this.updateBoundingBox(element.lat, element.lon);
        }
        this.addFeatures(features);
      } else {
        this.renderNoSearchResults();
      }
      return this.activeXHR = void 0;
    };

    map.prototype.createFeature = function(element) {
      return {
        geometry: {
          type: "Point",
          coordinates: [element.lon, element.lat]
        },
        properties: {
          'marker-color': '#377099',
          'marker-symbol': pp.maki.findTag(element.tags),
          element: element
        }
      };
    };

    map.prototype.addFeatures = function(features) {
      var interaction, template;
      this.markerLayer = mapbox.markers.layer().features(features);
      interaction = mapbox.markers.interaction(this.markerLayer);
      template = _.template($("#popupTemplate").html());
      interaction.formatter(template);
      this.mapbox.addLayer(this.markerLayer);
      return this.mapbox.setExtent((function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(MM.Extent, this.boundingBox, function(){}));
    };

    map.prototype.updateBoundingBox = function(lat, long) {
      var newBoundingBox;
      if (this.boundingBox.length === 0) {
        newBoundingBox = [lat, long, lat, long];
      } else {
        newBoundingBox = [];
        newBoundingBox.push([this.boundingBox[0], lat].sort()[0]);
        newBoundingBox.push([this.boundingBox[1], long].sort()[0]);
        newBoundingBox.push([this.boundingBox[2], lat].sort()[1]);
        newBoundingBox.push([this.boundingBox[3], long].sort()[1]);
      }
      return this.boundingBox = newBoundingBox;
    };

    map.prototype.resetBoundingBox = function() {
      return this.boundingBox = [];
    };

    return map;

  })(Backbone.View);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  pp.views.search = (function(_super) {

    __extends(search, _super);

    function search() {
      this.search = __bind(this.search, this);
      return search.__super__.constructor.apply(this, arguments);
    }

    search.prototype.el = '#search';

    search.prototype.events = {
      'submit form': 'search'
    };

    search.prototype.initialize = function(options) {
      this.router = options.router;
      this.controller = options.controller;
      this.$('img').ajaxStart(function() {
        return $(this).fadeIn();
      });
      return this.$('img').ajaxStop(function() {
        return $(this).fadeOut();
      });
    };

    search.prototype.search = function(event) {
      var query, route;
      query = this.$('input').val();
      route = query.length === 0 ? '' : "search/" + query;
      this.router.navigate(route, {
        trigger: true
      });
      return event.preventDefault();
    };

    search.prototype.ajaxStart = function() {
      return this.$('img').fadeIn();
    };

    return search;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  pp.router = (function(_super) {

    __extends(router, _super);

    function router() {
      return router.__super__.constructor.apply(this, arguments);
    }

    router.prototype.routes = {
      '': 'root',
      'search/:query': 'search'
    };

    router.prototype.initialize = function(options) {
      return this.controller = options.controller;
    };

    router.prototype.root = function() {
      return this.controller.root();
    };

    router.prototype.search = function(query) {
      return this.controller.searchRecords(query);
    };

    return router;

  })(Backbone.Router);

}).call(this);
