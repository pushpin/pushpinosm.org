pp.maki =
  default: 'marker'
  tags: [ 'circle-stroked', 'circle', 'square-stroked', 'square', 'triangle-stroked',
    'triangle', 'star-stroked', 'star', 'cross', 'marker-stroked', 'marker',
    'religious-jewish', 'religious-christian', 'religious-muslim', 'cemetery', 'airport',
    'heliport', 'rail', 'rail-underground', 'rail-above', 'bus', 'fuel', 'parking',
    'parking-garage', 'london-underground', 'airfield', 'roadblock', 'ferry',
    'harbor', 'bicycle', 'park', 'park2', 'museum', 'lodging', 'monument', 'zoo', 'garden',
    'campsite', 'theatre', 'art-gallery', 'pitch', 'soccer', 'america-football',
    'tennis', 'basketball', 'baseball', 'golf', 'swimming', 'cricket', 'skiing', 'school',
    'college', 'library', 'post', 'fire-station', 'town-hall', 'police', 'prison', 'embassy',
    'beer', 'restaurant', 'cafe', 'shop', 'fast-food', 'bar', 'bank', 'grocery', 'cinema',
    'pharmacy', 'hospital', 'minefield', 'industrial', 'warehouse', 'commercial' ]

  findTag: (tags) =>
    if tags.shop
      return switch tags.shop
        when 'supermarket' then 'grocery'
        else 'shop'
    if tags.leisure then return 'pitch'
    if tags.aeroway then return 'airport'
    if tags.office
      return switch tags.office
        when 'government' then 'town-hall'
        else 'commercial'
    if tags.tourism
      return switch tags.tourism
        when 'motel'  then 'lodging'
        when 'hotel'  then 'lodging'
        when 'museum' then 'museum'
        else pp.maki.default
    if tags.amenity
      return switch tags.amenity
        when 'place_of_worship' then pp.maki.placeOfWorship(tags)
        when 'post_office'      then 'post'
        when 'post_box'         then 'post'
        when 'courthouse'       then 'prison'
        when 'fire_station'     then 'fire-station'
        when 'grave_yard'       then 'cemetery'
        when 'department_store' then 'shop'
        when 'fast_food'        then 'fast-food'
        when 'pub'              then 'beer'
        when 'stadium'          then 'soccer'
        when 'ice_cream'        then 'restaurant'
        when 'fitness_center'   then 'pitch'
        else
          index = _.indexOf(pp.maki.tags, tags.amenity)
          if index is -1 then pp.maki.default else pp.maki.tags[index]
    else
      pp.maki.default

  placeOfWorship: (tags) ->
    if tags.religion
      tag = "religious-#{tags.religion}"
      index = _.indexOf(pp.maki.tags, tag)
      if index is -1 then pp.maki.default else pp.maki.tags[index]
    else
      pp.maki.default
