#= deploy

# This is a manifest file that'll be compiled into application.js, which will include all the files
# listed below.

# Any JavaScript/Coffee file within this directory or vendor/javascripts can be referenced here using a relative path.

# It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
# the compiled file.
#= require_self
#= require 'maki'
#= require 'helpers'
#= require_tree './views'
#= require 'router'

window.pp =
  views: {}

$(document).ready ->
  _.defer ->
    controller = new pp.views.controller
    controller.render()

# https://github.com/gouch/to-title-case

String::toTitleCase = ->
  smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i
  @replace /([^\W_]+[^\s-]*) */g, (match, p1, index, title) ->
    return match.toLowerCase()  if index > 0 and index + p1.length isnt title.length and p1.search(smallWords) > -1 and title.charAt(index - 2) isnt ":" and title.charAt(index - 1).search(/[^\s-]/) < 0
    return match  if p1.substr(1).search(/[A-Z]|\../) > -1
    match.charAt(0).toUpperCase() + match.substr(1)

