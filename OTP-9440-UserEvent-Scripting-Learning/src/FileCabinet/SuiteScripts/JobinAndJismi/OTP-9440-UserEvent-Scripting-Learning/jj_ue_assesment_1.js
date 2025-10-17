/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record) => {

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            try {
                var newRec = scriptContext.newRecord;

                const customerValue = newRec.getValue({
                    fieldId: 'entity'
                });

                log.debug(`Customer ID: ${customerValue}`);

                let appendedText = 'Customers Sales Rep';

                if (customerValue !== '') {
                    newRec.setValue({
                        fieldId: 'custbody_customer_sales_rep',
                        value: appendedText
                    });
                    log.debug('Customer has a value');
                }
                else {
                    log.debug('Customer has no value');
                    return;
                }
                
            }
            catch (e) {
                log.error({
                    title: 'Error updating the field!',
                    details: e
                });
            }
        }

        return { 
            beforeSubmit: beforeSubmit 
        };

    });
