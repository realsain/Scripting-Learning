    /**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define([],
    
    function () {
        /**
         * Defines the Portlet script trigger point.
         * @param {Object} params - The params parameter is a JavaScript object. It is automatically passed to the script entry
         *     point by NetSuite. The values for params are read-only.
         * @param {Portlet} params.portlet - The portlet object used for rendering
         * @param {string} params.column - Column index forthe portlet on the dashboard; left column (1), center column (2) or
         *     right column (3)
         * @param {string} params.entity - (For custom portlets only) references the customer ID for the selected customer
         * @since 2015.2
         */
        function render(params) {
            params.portlet.title = 'My First Portlet';
            params.portlet.html = '<h3>Hello from my first Portlet!</h3>';
        }

        return {render}

    });
