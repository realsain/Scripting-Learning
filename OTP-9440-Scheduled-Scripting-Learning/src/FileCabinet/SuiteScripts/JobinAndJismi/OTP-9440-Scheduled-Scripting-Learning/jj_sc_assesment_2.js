/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/log', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{log} log
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, log, runtime, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */

        function openInvoices() {
            try {
                let count = 0;
                let bodyContent = 'Dear Mam, \n'
                    + 'I hereby sending the details of all open invoices that present int he system and it will be sent to you in a monthly basis.\n'
                    + 'The invoice number and the corresponding customers are added here: \n\n';

                const openInvoices = search.create({
                    type: search.Type.INVOICE,
                    filters: [['status', 'anyof', 'CustInvc:A'],
                        'AND',
                    ['mainline', 'is', 'T']],
                    columns: ['entity', 'tranid',]
                });

                openInvoices.run().each(result => {
                    count++;
                    bodyContent += `Invoice Document #: ${result.getValue('tranid')} | Customer Name: ${result.getText('entity')} \n\n`;
                    return true;
                });

                bodyContent += 'Thank You!';

                if (count === 0) {
                    bodyContent += 'No Open Invoices';
                }

                email.send({
                    author: -5,
                    recipients: -5,
                    subject: 'Open Invoices',
                    body: bodyContent
                });

                log.audit({
                    title: 'Script Executed!',
                    details: `Email sent with ${count} invoices!`
                });
            }
            catch (e) {
                log.error({
                    title: 'Error Occurred',
                    details: e.message
                });
            }
        }

        const execute = (scriptContext) => {
            try {
                openInvoices();
            }
            catch (e) {
                log.error({
                    title: 'Error Occurred',
                    details: e.message
                });
            }
        }

        return { execute }

    });
