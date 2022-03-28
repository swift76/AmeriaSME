require.config({
    baseUrl: "/js",
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
    ////urlArgs: "bust=" + (new Date()).getTime(),
    waitSeconds: 15
});

require([
    'knockout',
    './vm/rootViewModel.vm',
    'jquery',
    'bootstrap',
    './lib/jquery.number.min',
    'knockout-amd-helpers',
    './extensions/ko.ext.all',
    './formatters/ko.format.all',
    './components/components.all',
],
    function (ko, RootViewModel, $) {
        $(function () {
            ko.amdTemplateEngine.defaultPath = "/views";
            ko.amdTemplateEngine.defaultSuffix = ".html";
            ko.amdTemplateEngine.defaultRequireTextPluginName = "text";

            ko.applyBindings(new RootViewModel());
        });
    }
);
