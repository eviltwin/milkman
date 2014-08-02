/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'Route', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name milkman.Route.create
     * @function
     * @param {sntls.Path} routePath
     * @returns {milkman.Route}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    milkman.Route = self
        .addTraitAndExtend(evan.Evented)
        .setEventSpace(milkman.routingEventSpace)
        .addMethods(/** @lends milkman.Route# */{
            /**
             * @param {sntls.Path} routePath
             * @ignore
             */
            init: function (routePath) {
                dessert.isPath(routePath, "Invalid route path");

                /**
                 * Path associated with route.
                 * @type {sntls.Path}
                 */
                this.routePath = routePath;

                // setting event path as self
                this.setEventPath(routePath);
            },

            /**
             * Tells if the specified route is equivalent to the current one.
             * @param {milkman.Route} route
             * @returns {boolean}
             */
            equals: function (route) {
                return route && this.routePath.equals(route.routePath);
            },

            /**
             * Navigates app to current route path.
             * @param {*} [payload]
             * @param {evan.Event} [originalEvent]
             * @returns {milkman.Route}
             */
            navigateTo: function (payload, originalEvent) {
                milkman.Router.create()
                    .navigateToRoute(this, payload, originalEvent);
                return this;
            },

            /**
             * Navigates app to current route path silently.
             * @param {*} [payload]
             * @param {evan.Event} [originalEvent]
             * @returns {milkman.Route}
             */
            navigateToSilent: function (payload, originalEvent) {
                milkman.Router.create()
                    .navigateToRouteSilent(this, payload, originalEvent);
                return this;
            },

            /** @returns {string} */
            toString: function () {
                return this.routePath.asArray.join('/');
            },

            /**
             * Converts path instance to hash string.
             * @returns {string}
             */
            toHash: function () {
                return '#' + this;
            }
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path.addMethods(/** @lends sntls.Path */{
        /**
         * Converts normal path to route path.
         * @returns {milkman.Route}
         */
        toRoute: function () {
            return milkman.Route.create(this);
        }
    });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isRoute: function (expr) {
            return milkman.Route.isBaseOf(expr);
        },

        isRouteOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   milkman.Route.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Creates a new Route instance based on the current string.
             * @returns {milkman.Route}
             */
            toRoute: function () {
                return milkman.Route.create(this.split('/').toPath());
            },

            /**
             * Creates a new Route instance based on the current string interpreted as a hash.
             * @returns {milkman.Route}
             */
            toRouteFromHash: function () {
                var hash = this.split('#')[1];

                var asArray = hash ?
                    hash.split('/') :
                    [];

                return milkman.Route.create(asArray.toPath());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Creates a new Route instance based on the current array.
             * @returns {milkman.Route}
             */
            toRoute: function () {
                return milkman.Route.create(this.toPath());
            }
        },
        false, false, false
    );
}());