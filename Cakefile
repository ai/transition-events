fs     = require('fs-extra')
exec   = require('child_process').exec
path   = require('path')
glob   = require('glob')
uglify = require('uglify-js')

task 'clean', 'Remove all generated files', ->
  fs.removeSync('build/') if path.existsSync('build/')
  fs.removeSync('pkg/')   if path.existsSync('pkg/')

task 'min', 'Create minimized version of library', ->
  fs.mkdirSync('pkg/') unless path.existsSync('pkg/')
  version = JSON.parse(fs.readFileSync('package.json')).version
  source  = fs.readFileSync('lib/transition-events.js').toString()

  ast = uglify.parser.parse(source)
  ast = uglify.uglify.ast_mangle(ast)
  ast = uglify.uglify.ast_squeeze(ast)
  min = uglify.uglify.gen_code(ast)

  fs.writeFileSync("pkg/transition-events-#{version}.min.js", min)

task 'gem', 'Build RubyGem package', ->
  fs.removeSync('build/') if path.existsSync('build/')
  fs.mkdirSync('build/lib/assets/javascripts/')

  copy = require('fs-extra/lib/copy').copyFileSync
  fs.removeSync('build/') if path.existsSync('build/')
  fs.mkdirSync('build/lib/assets/javascripts/')

  copy = require('fs-extra/lib/copy').copyFileSync
  copy('lib/transition-events.js',
       'build/lib/assets/javascripts/transition-events.js')
  copy('gem/transition-events-js.gemspec', 'build/transition-events-js.gemspec')
  copy('gem/transition_events_js.rb',      'build/lib/transition_events_js.rb')
  copy('README.md',                        'build/README.md')
  copy('ChangeLog',                        'build/ChangeLog')
  copy('LICENSE',                          'build/LICENSE')

  exec 'cd build/; gem build transition-events-js.gemspec', (error, message) ->
    if error
      process.stderr.write(error.message)
      process.exit(1)
    else
      fs.mkdirSync('pkg/') unless path.existsSync('pkg/')
      gem = glob.sync('build/*.gem')[0]
      copy(gem, gem.replace(/^build\//, 'pkg/'))
      fs.removeSync('build/')
