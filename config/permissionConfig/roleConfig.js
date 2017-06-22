'use strict';
//hr user driver vendor admin manager
exports.roleConfig = {
    "user": {
        url: [
        ],
        rootRole: "basic"
    },
    "notuser": {
        url: [
            {
                resources: /^\/loginuser.*/,
                exclude: true,
                method: {'post': true}
            },
            {
                resources: /^\/loginuser.*/,
                exclude: true,
                method: {'delete': true}
            },
            {
                resources: /^\/loginuser.*/,
                exclude: true,
                method: {'put': true}
            }
        ],
        rootRole: "basic"
    },
    "admin": {
        url: [
            {
                resources: /.*/,
                method: {'all': true}
            }
        ]
    },
    "basic": {
        url: [
            {
                resources: /.*/,
                method: {'all': true}
            }
        ],
        missHandler: function (req, resp) {
            resp.json({status: "nooooooooooooooooooo"});
        }
    }
};
