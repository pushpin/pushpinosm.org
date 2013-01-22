window.onload = function() {
  var url = "http://s3.amazonaws.com/pushpinapp/stats.json"

  $.get(url, function(json) {
    if (json) {
      numberOfEditsInLast24Hours = 0;

      var now = moment(new Date);

      var recent_html = '';

      _.each(json.recent_edits, function(edit) {
        var editDate = moment(edit.date);

        if (now.diff(editDate, 'minutes') < 1440)
          numberOfEditsInLast24Hours++;

        var changesetURL = 'http://www.openstreetmap.org/browse/changeset/' + edit.id;

        recent_html += '<div class="edit">' +
                       '  <a href="' + changesetURL + '" class="recent-edit">' + edit.name + ' (' + edit.tags.comment + ')</a> ' +
                       '  <span class="date">' + editDate.fromNow() + '</span>' +
                       '</div>';
      });

      $('#recent-edits').html(recent_html);

      $('#total-edits').html(
        '<table>' +
        '  <tr>' +
        '    <td class="left">Total Edits</td>' +
        '    <td class="right"><strong>' + json.total_edits + '</strong></td>' +
        '  </tr>' +
        '  <tr>' +
        '    <td class="left">Active Users</td>' +
        '    <td class="right"><strong>' + json.top_users.length + '</strong></td>' +
        '  </tr>' +
        '  <tr>' +
        '    <td class="left">Edits in Last 24 Hours</td>' +
        '    <td class="right"><strong>' + numberOfEditsInLast24Hours + '</strong></td>' +
        '  </tr>' +
        '  <tr>' +
        '    <td></td>' +
        '    <td class="return"><a href="/">&laquo; Return Home</a></td>' +
        '  </tr>' +
        '</table>'
      );

      top_users = '';
      _.each(json.top_users, function(user, index) {
        top_users += '<div class="user">' + (index + 1) + ') <a href="http://www.openstreetmap.org/user/' + user.name + '" class="top-user">' + user.name + '</a> (' + user.edits + ' edits)</div>';
      });

      $('#top-users').html(top_users);
    }
  });
}
