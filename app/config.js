'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    yaml = require('js-yaml');

function parseEnvValue(value, isArray) {
    value = value.trim();
    if (isArray) {
        return _.map(value.split(','), function(value) {
            return parseEnvValue(value);
        });
    }
    // YAML compatible boolean values
    else if (/^(y|yes|true|on)$/i.test(value)) {
        return true;
    }
    else if (/^(n|no|false|off)$/i.test(value)) {
        return false;
    }
    else if (/^[+-]?\d+.?\d*$/.test(value) &&
             !isNaN(parseInt(value, 10))) {
        return parseInt(value, 10);
    }
    return value;
}

var pipeline = [

    function getFileSettings(context) {
        var file;
        if (fs.existsSync('settings.yml')) {
            file = fs.readFileSync('settings.yml', 'utf8');
            context.file = yaml.safeLoad(file) || {};
        } else {
            context.file = {};
        }
    },

    function mergeDefaultAndFileSettings(context) {
        context.result = context.file;
    },

    function mergeEnvSettings(context) {
        function recurse(baseKey, object) {
            _.forEach(object, function(value, key) {
                var envKey = baseKey + '_' +
                             key.replace(/([A-Z]+)/g, '_$1').toUpperCase();
                if (_.isPlainObject(value)) {
                    recurse(envKey, value);
                } else {
                    var val = process.env[envKey];
                    if (val) {
                        object[key] = parseEnvValue(val,
                                                    _.isArray(object[key]));
                    }
                }
            });
        }

        recurse('', context.result);
    },

    function overrideEnvSetting(context) {
        if (process.env.NODE_ENV) {
            context.result.env = process.env.NODE_ENV;
        }
    },

    function overridePortSetting(context) {
        if (process.env.PORT) {
            context.result.http.port = process.env.PORT;
        }
    },

    function herokuDbUrl(context) {
        // Override database URI - if using a Heroku add-on
        // console.log(context.result);
        if (process.env.REDIS_URL) {
            context.result.REDIS_URL = process.env.REDIS_URL;
        }
    },

    function overrideInstamojoSetting(context){
        if(process.env.INSTAMOJO_URL){
            context.result.INSTAMOJO_URL = process.env.INSTAMOJO_URL;
        }
        if(process.env.INSTAMOJO_API_KEY){
            context.result.INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY;
        }
        if(process.env.INSTAMOJO_AUTH_TOKEN){
            context.result.INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN;
        }
    }

];

var context = {
    plugins: {},
    export: {}
};

_.each(pipeline, function(step) {
    step(context);
});

module.exports = context.result;