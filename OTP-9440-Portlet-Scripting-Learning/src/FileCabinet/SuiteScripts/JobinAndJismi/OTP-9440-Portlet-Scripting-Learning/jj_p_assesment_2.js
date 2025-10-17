/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    function (search) {
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

        function portletList (portlet) {
            
            portlet.title = 'Customer Engagement Tracking';
            
            portlet.addColumn({
                id: 'internalid',
                type: 'text',
                label: 'ID',
            });

            portlet.addColumn({
                id: 'companyname',
                type: 'text',
                label: 'Customer Name'
            });
            
            portlet.addColumn({
                id: 'lastorderdate',
                type: 'date',
                label: 'Last Order Date'
            });

            const customerSearch = search.create({
                type: 'customer',
                columns: ['internalid', 'companyname', 'lastorderdate']
            });

            customerSearch.run().each(function(result) {
                portlet.addRow(result.getAllValues());
                return true;
            });
        }

        const render = (params) => {
            const portlet = params.portlet;
            portletList(portlet);
        }

        return {render}

    });
