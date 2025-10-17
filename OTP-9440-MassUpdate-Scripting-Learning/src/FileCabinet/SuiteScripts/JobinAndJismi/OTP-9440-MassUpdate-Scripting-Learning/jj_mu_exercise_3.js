/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/log', 'N/record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        function each(params) {
            try {
                log.debug('Params: ', `ID: ${params.id}, Type: ${params.type}`);
                const objRecord = record.load({
                    type: params.type,
                    id: params.id
                });

                const dueDateStr = new Date(objRecord.getValue('duedate'));
                const dueDate = new Date(dueDateStr);
                const today = new Date();

                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                
                log.debug('Date Check', `Due Date: ${dueDate}, 7 Days Ago: ${sevenDaysAgo}`);

                if (dueDate < sevenDaysAgo) {
                    const newDueDate = new Date(today);
                    newDueDate.setDate(today.getDate() + 7);

                    objRecord.setValue({
                        fieldId: 'duedate',
                        value: newDueDate
                    });

                    objRecord.save();

                    log.audit('Due Date Updated!', `ID: ${params.id}`);
                }
                else {
                    log.audit('Skipped! Not overdue by 7 days!', `ID: ${params.id}`);
                }
            }
            catch (e) {
                log.error({
                    title: 'Error in processing record',
                    details: `ID: ${params.id}, Type: ${params.type}, Error: ${e.message}`
                });
            }
        }

        return {
            each: each
        };

    });
