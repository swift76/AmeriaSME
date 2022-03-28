({
    baseUrl: "wwwroot/js",
    paths: {
        "jquery": "lib/jquery-1.12.4",
        'knockout-amd-helpers': 'lib/knockout-amd-helpers.min',
        'knockout': 'lib/knockout-3.4.2',
        'jquery.dataTables': 'lib/jquery.dataTables.min',
        'moment': 'lib/moment.min',
        'numeric': 'lib/jquery.alphanum',
        'text': 'lib/text',
        'objectLoader': 'util/objectLoader',
        'lookupDirectory': 'util/lookupDirectory',
        'helpers': 'util/helpers',
        'regexpFormat': 'lib/jquery.regexpFormat',
        'bootstrap': 'lib/bootstrap.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    },
    name: "app",
    out: "wwwroot/js/app.build.js",
    preserveLicenseComments: false,
    generateSourceMaps: true,
    optimize: "uglify"
})