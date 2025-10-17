/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/log', 'N/record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
            
        const get = (requestParams) => {
            try {
                let salesOrderId = requestParams.id;


                if (!salesOrderId) {
                    return { message: "Missing sales order ID" };
                }
                let salesOrder = record.load({
                    type: record.Type.SALES_ORDER,
                    isDynamic: true,
                    id: salesOrderId
                })

                return {
                    transId: salesOrder.getValue('tranid'),
                    customerName: salesOrder.getText('entity'),
                    amount: salesOrder.getValue('total'),
                    status: salesOrder.getText('status')
                }
            } 
            
            catch (error) {
                return {
                    message: "Does not exist",
                    error: error.message
                };
            }

        }
 

        return {get}

    });
