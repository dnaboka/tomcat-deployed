define(["require","underscore","moment","momentTimezone","./formatsMappingUtil","bundle!AdHocBundle","jrs.configs"],function(e){function n(e){return parseInt(o(e).format("HH"))>=12?"\u4e0b\u5348":"\u4e0a\u5348"}function o(e){return t(e).locale(i.userLocale).tz(i.userTimezone)}function r(e){return/T/.test(e)?e:"1970-01-01T"+e}var t=(e("underscore"),e("moment")),u=(e("momentTimezone"),e("./formatsMappingUtil")),i=(e("bundle!AdHocBundle"),e("jrs.configs"));return{format:function(e,t,m){return u.isNullOrEmpty(e)?"":u.isOtherNode(e)?e:u.shouldBeReturnedAsLocalazedDayOfWeek(m)?u.getLocalizedDayOfWeek(e):(t=u.getFormatForMoment(t,m),t?(/^zh/.test(i.userLocale)&&(t=t.replace("A",n(r(e)))),e=m&&m.ignoreTimezone?u.setToUserTimezone(e):u.ensureTimezone(e),o(r(e)).format(t)):e)}}});