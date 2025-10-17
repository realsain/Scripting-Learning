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
                log.debug('Processing Record', `Type: ${params.type}, ID: ${params.id}`);

                const objRec = record.load({
                    type: params.type,
                    id: params.id
                });

                const maritalStatus = objRec.getText('custrecord_marital_status');

                log.debug('Marital Status', objRec.getText('custrecord_marital_status'));

                if (maritalStatus === 'Unmarried') {
                    objRec.setText({
                        fieldId: 'custrecord_marital_status',
                        text: 'Married'
                    });

                    objRec.save();
                    log.audit('Updated Record', `ID: ${params.id} - Status changed to Married`);
                } 
                else {
                    log.debug('Skipped', `Record ID: ${params.id} - Not Unmarried`);
                }
            }
            catch (e) {
                log.error({
                    title: 'Error Updating!',
                    details: e
                });
            }

        }

        return {
            each: each
        };

    });
