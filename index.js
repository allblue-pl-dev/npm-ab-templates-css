/* ab-templates-css */
'use strict';

var abWatcher = require('ab-watcher');


module.exports = {
    _path: null,
    _uri: null,
    _watcher: null,

    name: 'CSS',

    onCreate: function(tpl) {
        this._path = tpl.paths.front + '/css.min.js';
        this._uri = tpl.uris.front + 'css.min.js';
        this._watcher = abWatcher.new();

        var self = this;
        this._watcher = abWatcher.new()
            .on([ 'add', 'unlink' ], function(file, evt) {
                tpl.tasks.buildHeader().call();
            });
    },

    onBuild: function(tpl) {
        // tpl.log('Building...');
    },

    onBuildHeader: function(tpl, header) {
        var file_paths = this._watcher.getFilePaths();

        // console.dir(Object.getOwnPropertyNames(header));

        tpl.log('Styles:');
        for (var i = 0; i < file_paths.length; i++) {
            tpl.log('  - ' + file_paths[i]);

            var uri = tpl.getUri(file_paths[i]);

            tpl.log('  - ' + uri);
            header.addTag('link', {
                rel: "stylesheet",
                href: uri + '?v=' + tpl.build.hash,
                type: "text/css"
            });
        }
    },

    onTplChanged: function(tpl, tpl_info) {
        if (!('css' in tpl_info)) {
            this._watcher.clear();
            return;
        }

        this._watcher.update(tpl_info.css);
    }

};
