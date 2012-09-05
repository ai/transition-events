# encoding: utf-8

Gem::Specification.new do |s|
  s.name        = 'jQuery Transition Events'
  s.version     = '0.0.0'
  s.platform    = Gem::Platform::RUBY
  s.authors     = ['Andrey "A.I" Sitnik']
  s.email       = ['andrey@sitnik.ru']
  s.homepage    = 'https://github.com/ai/transition-events'
  s.summary     = ''
  s.description = ''

  s.add_dependency 'sprockets', '>= 2'

  s.files            = ['lib/assets/javascripts/transition-events.js',
                        'lib/transition_events_js.rb',
                        'LICENSE', 'README.md', 'ChangeLog']
  s.extra_rdoc_files = ['LICENSE', 'README.md', 'ChangeLog']
  s.require_path     = 'lib'
end