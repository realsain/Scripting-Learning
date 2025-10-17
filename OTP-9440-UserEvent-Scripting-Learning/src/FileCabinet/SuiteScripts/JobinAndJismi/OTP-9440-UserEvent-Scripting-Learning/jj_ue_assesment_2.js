/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/email', 'N/search', 'N/runtime'],
    /**
 * @param{log} log
 * @param{email} email
 * @param{search} search
 * @param{runtime} runtime
 */
    (log, email, search, runtime) => {

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function afterSubmit(scriptContext) {
            try {
                const newRecord = scriptContext.newRecord;
                const customerId = newRecord.getValue('entity');
                const salesRepId = newRecord.getValue('salesrep');
                const salesManagerId = 371;

                if (!customerId || !salesRepId) {
                    log.debug({
                        title: 'Error!',
                        details: 'Customer/Sales Rep not found'
                    });
                    return;
                }

                const invoiceSearch = search.create({
                    type: search.Type.INVOICE,
                    filters: [
                        ['entity', 'anyof', customerId],
                        'AND',
                        ['status', 'anyof', 'CustInvc:A'],
                        'AND',
                        ['duedate', 'onorbefore', 'today']
                    ],
                    columns: ['internalid']
                });

                let hasOverdue = false;
                invoiceSearch.run().each(() => {
                    hasOverdue = true;
                    return false;
                });

                if(!hasOverdue) {
                    return;
                }
                
                const subjectContent = 'Overdue Information'
                const bodyContent = `The customer with ID: ${customerId} has an Overdue!`

                email.send({
                    author: runtime.getCurrentUser().id,
                    recipients: salesManagerId,
                    subject: subjectContent,
                    body: bodyContent,
                });

            }
            catch (e) {
                log.error({
                    title: 'Error sending email!',
                    details: e
                });
            }
        }

        return {
            afterSubmit: afterSubmit
        };

    });
