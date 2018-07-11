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
                    if (/^zh/.test(config.userLocale)) {
                        format = format.replace("A", AmPmForZhCN(convertToIso(val)));
                    }
                    if (options && options.ignoreTimezone) {
                        val = formatsMappingUtil.setToUserTimezone(val);
                    } else {
                        val = formatsMappingUtil.ensureTimezone(val);
                    }

                    return momentLocaleTimezone(convertToIso(val)).format(format);
                }

                return val;
            }
        };

        function AmPmForZhCN(val) {
            //上午 = A.M.
            //下午 = P.M.
            return parseInt(momentLocaleTimezone(val).format("HH")) >= 12 ? "下午" : "上午";
        }

        function momentLocaleTimezone(val) {
            return moment(val)
                .locale(config.userLocale)
                .tz(config.userTimezone);
        }

        function convertToIso(value) {
            // If value already ISO formatted just return it.
            if (/T/.test(value)) {
                return value;
            } else {
                return "1970-01-01T" + value;
            }
        }
    }
);