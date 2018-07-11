define(function (require) {
        var _ = require("underscore"),
            moment = require("moment"),
            momentTimezone = require("momentTimezone"),
            formatsMappingUtil = require("./formatsMappingUtil"),
            i18n = require("bundle!AdHocBundle"),
            config = require("jrs.configs");

        return {
            format: function (val, format, options) {
                if (formatsMappingUtil.isNullOrEmpty(val)) {
                    return "";
                }
                if (formatsMappingUtil.isOtherNode(val)) {
                    return val;
                }
                if (formatsMappingUtil.shouldBeReturnedAsLocalazedDayOfWeek(options)) {
                    return formatsMappingUtil.getLocalizedDayOfWeek(val);
                }

                format = formatsMappingUtil.getFormatForMoment(format, options);

                if (format) {
                    return momentLocale(convertToIso(val)).format(format);
                }

                return val;
            }
        };

        function momentLocale(val) {
            return moment(val)
                .locale(config.userLocale);
        }

        function convertToIso(value) {
            if (/Q1/.test(value)) {
                return value.slice(0, 4).concat('-01-05T01:32:21.196Z');
            } else if (/Q2/.test(value)) {
                return value.slice(0, 4).concat('-04-05T01:32:21.196Z');
            } else if (/Q3/.test(value)) {
                return value.slice(0, 4).concat('-07-05T01:32:21.196Z');
            } else if (/Q4/.test(value)) {
                return value.slice(0, 4).concat('-10-05T01:32:21.196Z');
            } else if (/^\d{4}$/.test(value)) {
                return value.concat('-01-05T01:32:21.196Z');
            } else {
                return value;
            }
        }
    }
);