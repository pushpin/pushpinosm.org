window.onload = function() {
  var url = "http://s3.amazonaws.com/pushpinapp/stats.json"

  $.get(url, function(json) {
    if (json) {
      $('#total-edits').html('<table><tr><td class="left">Total Edits</td><td class="right"><strong>' + json.total_edits + '</strong></td></tr><tr><td class="left">Active Users</td><td class="right"><strong>' + json.top_users.length + '</strong></td></tr></table>');

      recent_html = '';
      _.each(json.recent_edits, function(edit) {
        recent_html += '<div class="edit"><a href="http://www.openstreetmap.org/browse/changeset/' + edit.id + '" class="recent-edit">' + edit.name + ' (' + edit.tags.comment + ')</a> <span class="date">' + moment(edit.date).fromNow() + '</span></div>';
      });

      $('#recent-edits').html(recent_html);

      top_users = '';
      _.each(json.top_users, function(user, index) {
        top_users += '<div class="user">' + (index + 1) + '.) <a href="http://www.openstreetmap.org/user/' + user.name + '" class="top-user">' + user.name + '</a> (' + user.edits + ' edits)</div>';
      });

      $('#top-users').html(top_users);

      // $('.page-title').html('Pushpin OSM - ' + json.elements.length + ' points');
    }
  });
}