(function () {
    window.pp = {
        views: {}
    }, $(document).ready(function () {
        return _.defer(function () {
            var e;
            return e = new pp.views.controller, e.render()
        })
    }), String.prototype.toTitleCase = function () {
        var e;
        return e = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i, this.replace(/([^\W_]+[^\s-]*) */g, function (t, n, r, i) {
            return r > 0 && r + n.length !== i.length && n.search(e) > -1 && i.charAt(r - 2) !== ":" && i.charAt(r - 1).search(/[^\s-]/) < 0 ? t.toLowerCase() : n.substr(1).search(/[A-Z]|\../) > -1 ? t : t.charAt(0).toUpperCase() + t.substr(1)
        })
    }
}).call(this),
function () {
    var e = this;
    pp.maki = {
        "default": "marker",
        tags: ["circle-stroked", "circle", "square-stroked", "square", "triangle-stroked", "triangle", "star-stroked", "star", "cross", "marker-stroked", "marker", "religious-jewish", "religious-christian", "religious-muslim", "cemetery", "airport", "heliport", "rail", "rail-underground", "rail-above", "bus", "fuel", "parking", "parking-garage", "london-underground", "airfield", "roadblock", "ferry", "harbor", "bicycle", "park", "park2", "museum", "lodging", "monument", "zoo", "garden", "campsite", "theatre", "art-gallery", "pitch", "soccer", "america-football", "tennis", "basketball", "baseball", "golf", "swimming", "cricket", "skiing", "school", "college", "library", "post", "fire-station", "town-hall", "police", "prison", "embassy", "beer", "restaurant", "cafe", "shop", "fast-food", "bar", "bank", "grocery", "cinema", "pharmacy", "hospital", "minefield", "industrial", "warehouse", "commercial"],
        findTag: function (e) {
            if (e.shop) switch (e.shop) {
                case "supermarket":
                    return "grocery";
                default:
                    return "shop"
            }
            if (e.leisure) return pp.maki.find(e.sport, "pitch");
            if (e.historic) return pp.maki.find(e.historic);
            if (e.railway) return "rail";
            if (e.highway) switch (e.highway) {
                case "bus_stop":
                    return "bus"
            }
            if (e.aeroway) return "airport";
            if (e.office) switch (e.office) {
                case "government":
                    return "town-hall";
                default:
                    return "commercial"
            }
            if (e.tourism) switch (e.tourism) {
                case "hotel":
                    return "lodging";
                case "motel":
                    return "lodging";
                case "museum":
                    return "museum";
                default:
                    return pp.maki["default"]
            }
            if (e.amenity) switch (e.amenity) {
                case "atm":
                    return "bank";
                case "bicycle_rental":
                    return "bicycle";
                case "biergarten":
                    return "beer";
                case "bus_station":
                    return "bus";
                case "courthouse":
                    return "prison";
                case "department_store":
                    return "shop";
                case "fast_food":
                    return "fast-food";
                case "fire_station":
                    return "fire-station";
                case "fitness_center":
                    return "pitch";
                case "grave_yard":
                    return "cemetery";
                case "ice_cream":
                    return "restaurant";
                case "place_of_worship":
                    return pp.maki.find("religious-" + e.religion);
                case "post_office":
                    return "post";
                case "post_box":
                    return "post";
                case "pub":
                    return "beer";
                case "stadium":
                    return "soccer";
                case "university":
                    return "college";
                default:
                    return pp.maki.find(e.amenity)
            }
            return pp.maki["default"]
        },
        find: function (e, t) {
            var n;
            return t == null && (t = pp.maki["default"]), n = _.indexOf(pp.maki.tags, e), n === -1 ? t : pp.maki.tags[n]
        }
    }
}.call(this),
function () {
    pp.helpers = {
        addressFields: ["addr:housenumber", "addr:street", "addr:city", "addr:state", "addr:postalcode", "addr:postcode", "addr:country"],
        formatAddress: function (e) {
            var t, n, r, i, s, o, u, a, f;
            return a = e["addr:housenumber"] || "", f = e["addr:street"] || "", s = e["addr:city"] || "", u = e["addr:state"] || "", o = e["addr:postalcode"] || e["addr:postcode"] || "", t = e["addr:country"] || "", r = _.compact([a, f]), i = _.compact([s, u]), n = _.compact([o, t]).join(", "), r.length === 0 && i.length === 0 && t.length === 0 && o.length === 0 ? "No address available for this record. Download<br>Pushpin and help contribute to open data!" : r.length > 0 && i.length > 0 && t.length > 0 ? "" + r.join(" ") + "<br>" + i.join(", ") + " " + n : r.length > 0 ? "" + r.join(" ") + "<br>" + n : i.length > 0 ? "" + i.join(" ") + "<br>" + n : n
        },
        labelFor: function (e) {
            switch (e) {
                case "addr:city":
                    return "City";
                case "addr:country":
                    return "Country";
                case "addr:postalcode":
                case "addr:postcode":
                    return "Postal Code";
                case "addr:street":
                    return "Street";
                case "addr:state":
                    return "State";
                case "addr:housenumber":
                    return "Number";
                default:
                    return e.indexOf(":") === -1 ? e.toTitleCase() : e
            }
        }
    }
}.call(this),
function () {
    var e = {}.hasOwnProperty,
        t = function (t, n) {
            function i() {
                this.constructor = t
            }
            for (var r in n) e.call(n, r) && (t[r] = n[r]);
            return i.prototype = n.prototype, t.prototype = new i, t.__super__ = n.prototype, t
        };
    pp.views.controller = function (e) {
        function n() {
            return n.__super__.constructor.apply(this, arguments)
        }
        return t(n, e), n.prototype.initialize = function () {
            return this.router = new pp.router({
                controller: this
            }), this.search = new pp.views.search({
                controller: this,
                router: this.router
            }), this.map = new pp.views.map({
                controller: this
            }), Backbone.history.start()
        }, n.prototype.render = function () {
            return this.search.render(), this.map.render()
        }, n.prototype.searchRecords = function (e) {
            return $("#search input").val(e), this.map.fetchWithCustomQuery(e)
        }, n.prototype.root = function () {
            return this.map.fetch()
        }, n
    }(Backbone.View)
}.call(this),
function () {
    var e = function (e, t) {
        return function () {
            return e.apply(t, arguments)
        }
    }, t = {}.hasOwnProperty,
        n = function (e, n) {
            function i() {
                this.constructor = e
            }
            for (var r in n) t.call(n, r) && (e[r] = n[r]);
            return i.prototype = n.prototype, e.prototype = new i, e.__super__ = n.prototype, e
        };
    pp.views.map = function (t) {
        function r() {
            return this.queryCallback = e(this.queryCallback, this), this.createMoveEndCallback = e(this.createMoveEndCallback, this), this.moveEndCallback = e(this.moveEndCallback, this), r.__super__.constructor.apply(this, arguments)
        }
        return n(r, t), r.prototype.initialize = function () {
            return this.activeXHR = void 0, this.features = [], this.mapbox = mapbox.map("map"), this.mapbox.addCallback("panned", this.createMoveEndCallback), this.mapbox.addCallback("zoomed", this.createMoveEndCallback)
        }, r.prototype.limitOnScreen = 350, r.prototype.baseURI = "http://www.overpass-api.de/api/interpreter", r.prototype.baseQuery = function () {
            return "[out:json];(node[source~'Pushpin|Fulcrum'];);out meta;"
        }, r.prototype.render = function () {
            var e;
            return this.tileLayer = mapbox.layer().id("spatialnetworks.map-jt158wp6"), this.mapbox.addLayer(this.tileLayer), this.mapbox.centerzoom({
                lat: 34,
                lon: 0
            }, 3), this.mapbox.ui.zoomer.add(), this.mapbox.ui.zoombox.add(), this.mapbox.ui.attribution.add(), e = $(".map-attribution"), e.html('Tiles Courtesy of <a href="http://www.mapbox.com/" target="_blank">      MapBox</a> — “<a target="_blank" href="http://creativecommons.org/licenses/by-sa/2.0/">      CC-BY-SA</a>  2012  <a target="_blank" href="http://openstreetmap.org">      OpenStreetMap.org</a>  contributors”')
        }, r.prototype.moveEndCallback = function () {
            var e, t, n, r, i, s, o;
            e = this.mapbox.getExtent(), n = [], o = this.features;
            for (r = i = 0, s = o.length; i < s; r = ++i) {
                t = o[r];
                if (n.length >= this.limitOnScreen) break;
                this.featureIsInView(t, e) && n.push(t)
            }
            return this.addFeatures(n)
        }, r.prototype.featureIsInView = function (e, t) {
            var n, r;
            return r = e.geometry.coordinates[0], n = e.geometry.coordinates[1], t.west < r && r < t.east && t.south < n && n < t.north
        }, r.prototype.createMoveEndCallback = function () {
            return clearTimeout(this._timeout), this._timeout = setTimeout(this.moveEndCallback, 100)
        }, r.prototype.renderNoSearchResults = function () {
            return this.removeMarkerLayer(), $("#no-results").fadeIn(), setTimeout(function () {
                return $("#no-results").fadeOut()
            }, 8e3)
        }, r.prototype.buildQuery = function (e) {
            return "[out:json];(node[source~'Pushpin|Fulcrum'][name~'" + e + "'];);out meta;"
        }, r.prototype.fetchWithCustomQuery = function (e) {
            return this.fetch(this.buildQuery(e))
        }, r.prototype.removeMarkerLayer = function () {
            var e;
            return (e = this.markerLayer) != null ? e.features([]) : void 0
        }, r.prototype.fetch = function (e) {
            var t, n;
            return $("#no-results").fadeOut(), this.removeMarkerLayer(), (n = this.activeXHR) != null && n.abort(), t = "" + this.baseURI + "?data=" + window.encodeURIComponent(e || this.baseQuery()), this.activeXHR = $.get(t, this.queryCallback)
        }, r.prototype.queryCallback = function (e) {
            var t, n, r, i;
            if (e && e.elements && e.elements.length > 0) {
                i = e.elements;
                for (n = 0, r = i.length; n < r; n++) t = i[n], this.features.push(this.createFeature(t));
                this.moveEndCallback()
            } else this.renderNoSearchResults();
            return this.activeXHR = void 0
        }, r.prototype.createFeature = function (e) {
            return {
                geometry: {
                    type: "Point",
                    coordinates: [e.lon, e.lat]
                },
                properties: {
                    "marker-color": "#377099",
                    "marker-symbol": pp.maki.findTag(e.tags),
                    element: e
                }
            }
        }, r.prototype.addFeatures = function (e) {
            var t, n;
            return this.markerLayer && this.mapbox.removeLayer(this.markerLayer), this.markerLayer = mapbox.markers.layer().features(e), t = mapbox.markers.interaction(this.markerLayer), n = _.template($("#popupTemplate").html()), t.formatter(n), this.mapbox.addLayer(this.markerLayer)
        }, r
    }(Backbone.View)
}.call(this),
function () {
    var e = function (e, t) {
        return function () {
            return e.apply(t, arguments)
        }
    }, t = {}.hasOwnProperty,
        n = function (e, n) {
            function i() {
                this.constructor = e
            }
            for (var r in n) t.call(n, r) && (e[r] = n[r]);
            return i.prototype = n.prototype, e.prototype = new i, e.__super__ = n.prototype, e
        };
    pp.views.search = function (t) {
        function r() {
            return this.search = e(this.search, this), r.__super__.constructor.apply(this, arguments)
        }
        return n(r, t), r.prototype.el = "#search", r.prototype.events = {
            "submit form": "search"
        }, r.prototype.initialize = function (e) {
            return this.router = e.router, this.controller = e.controller, this.$("img").ajaxStart(function () {
                return $(this).fadeIn()
            }), this.$("img").ajaxStop(function () {
                return $(this).fadeOut()
            })
        }, r.prototype.search = function (e) {
            var t, n;
            return t = this.$("input").val(), n = t.length === 0 ? "" : "search/" + t, this.router.navigate(n, {
                trigger: !0
            }), e.preventDefault()
        }, r.prototype.ajaxStart = function () {
            return this.$("img").fadeIn()
        }, r
    }(Backbone.View)
}.call(this),
function () {
    var e = {}.hasOwnProperty,
        t = function (t, n) {
            function i() {
                this.constructor = t
            }
            for (var r in n) e.call(n, r) && (t[r] = n[r]);
            return i.prototype = n.prototype, t.prototype = new i, t.__super__ = n.prototype, t
        };
    pp.router = function (e) {
        function n() {
            return n.__super__.constructor.apply(this, arguments)
        }
        return t(n, e), n.prototype.routes = {
            "": "root",
            "search/:query": "search"
        }, n.prototype.initialize = function (e) {
            return this.controller = e.controller
        }, n.prototype.root = function () {
            return this.controller.root()
        }, n.prototype.search = function (e) {
            return this.controller.searchRecords(e)
        }, n
    }(Backbone.Router)
}.call(this);