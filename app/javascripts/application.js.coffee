#= deploy

# This is a manifest file that'll be compiled into application.js, which will include all the files
# listed below.

# Any JavaScript/Coffee file within this directory or vendor/javascripts can be referenced here using a relative path.

# It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
# the compiled file.
#= require_self
#= require 'maki'
#= require_tree './views'
#= require 'router'

window.pp =
  views: {}

$(document).ready ->
  _.defer ->
    controller = new pp.views.controller
    controller.render()
