pp.helpers =

  addressFields: [ 'addr:housenumber', 'addr:street', 'addr:city', 'addr:state',
    'addr:postalcode', 'addr:postcode', 'addr:country' ]

  formatAddress: (tags) ->
    sub_thoroughfare = tags['addr:housenumber'] or ''
    thoroughfare = tags['addr:street'] or ''
    locality = tags['addr:city'] or ''
    sub_admin_area = tags['addr:state'] or ''
    postal = tags['addr:postalcode'] or tags['addr:postcode'] or ''
    country = tags['addr:country'] or ''

    lineOne  = _.compact([sub_thoroughfare, thoroughfare])
    lineTwo  = _.compact([locality, sub_admin_area])
    joined   = _.compact([postal, country]).join(', ')

    if lineOne.length is 0 && lineTwo.length is 0 && country.length is 0 and postal.length is 0
      "No address available for this record. Download Pushpin and help contribute to open data!"
    else if lineOne.length > 0 && lineTwo.length > 0 && country.length > 0
      "#{lineOne.join(' ')}<br>#{lineTwo.join(', ')} #{joined}"
    else if lineOne.length > 0
      "#{lineOne.join(' ')}<br>#{joined}"
    else if lineTwo.length > 0
      "#{lineTwo.join(' ')}<br>#{joined}"
    else
      joined

  labelFor: (string) ->
    switch string
      when 'addr:city'    then 'City'
      when 'addr:country' then 'Country'
      when 'addr:postalcode', 'addr:postcode' then 'Postal Code'
      when 'addr:street'  then 'Street'
      when 'addr:state'   then 'State'
      when 'addr:housenumber' then 'Number'
      else
        if string.indexOf(':') is -1 then string.toTitleCase() else string
