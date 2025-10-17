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
                log.debug('Params: ', `ID: ${params.id}, Type: ${params.type}`)
                const objRecord = record.load({
                    type: params.type,
                    id: params.id
                });

                const tranDate = objRecord.getValue('trandate');
                const soDate = new Date(tranDate);
                const today = new Date();

                const previousMonth = today.getMonth() - 1;
                const currentYear = today.getFullYear();

                const prevMonthYear = previousMonth < 0 ? currentYear - 1 : currentYear;
                const prevMonth = previousMonth < 0 ? 11 : previousMonth;

                if (soDate.getMonth() === prevMonth && soDate.getFullYear() === prevMonthYear) {
                    objRecord.setValue({
                        fieldId: 'memo',
                        value: 'Memo updated for previous month'
                    });

                    objRecord.save();

                    log.audit('Memo Updated!', `Sales Order ID: ${params.id}`);4
                }
                else {
                    log.debug('Skipped!', `Sales Order ID: ${params.id} is not from previous month!`);
                }

            }
            catch (e) {
                log.error({
                    title: 'Error Updating memo!',
                    details: e
                });
            }   

        }

        return {
            each: each
        };

    });
