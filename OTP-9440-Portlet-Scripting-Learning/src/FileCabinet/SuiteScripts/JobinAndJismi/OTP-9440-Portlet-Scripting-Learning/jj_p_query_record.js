/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N/query'],
    /**
 * @param{query} query
 */
    function (query) {
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

            params.portlet.title = 'Sales Orders';

            params.portlet.addColumn({
                id: 'tranid',
                type: 'text',
                label: 'Sales Order #'
            });

            params.portlet.addColumn({
                id: 'trandate',
                type: 'date',
                label: 'Date'
            });

            params.portlet.addColumn({
                id: 'entity',
                type: 'text',
                label: 'Customer'
            });

            const myQuery = query.create({
                type: query.Type.TRANSACTION
            });

            myQuery.columns = [
                myQuery.createColumn({ fieldId: 'tranid' }),
                myQuery.createColumn({ fieldId: 'trandate' }),
                myQuery.createColumn({ fieldId: 'entity' })
            ];

            myQuery.condition = myQuery.createCondition({
                fieldId: 'type',
                operator: query.Operator.ANY_OF,
                values: ['SalesOrd']
            });

            const results = myQuery.run().asMappedResults();

            results.forEach((result) => {
                params.portlet.addRow({
                    tranid: result.tranid,
                    trandate: result.trandate,
                    entity: result.entity
                });
            });
        }

        return { render }

    });
