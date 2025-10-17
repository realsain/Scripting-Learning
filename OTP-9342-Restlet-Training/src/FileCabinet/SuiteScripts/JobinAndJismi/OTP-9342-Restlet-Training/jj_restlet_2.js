/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/log', 'N/record', 'N/search'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (log, record, search) => {
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
                // Get customer ID
                const customerId = requestParams.customerId;
                if (!customerId) {
                    return { error: 'Customer ID required' };
                }

                // Load customer record
                const customer = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerId
                });

                // Get customer name, days overdue, and overdue balance
                const customerName = customer.getValue('companyname') || customer.getValue('entityid') || 'Unknown';
                const daysOverdue = parseInt(customer.getValue('daysoverdue')) || 0;
                const overdueBalance = parseFloat(customer.getValue('overduebalance')) || 0;

                // Check if there is an overdue balance
                if (daysOverdue > 0 && overdueBalance > 0) {
                    return {
                    customerName: customerName,
                    date: `${daysOverdue} days overdue`,
                    overdueBalance: overdueBalance
                    };
                } else {
                    return 'No overdue';
                }
            } 
            
            catch (e) {
                return e.name === 'RCRD_DSNT_EXIST' ? { error: 'Customer not found' } : { error: `Error: ${e.message}` };
            }
        };

        return {get}

    });
