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
        const each = (params) => {
            try {
                log.debug("Params: ", params);

                const objectRecord = record.load({
                    type: params.type,
                    id: params.id
                });

                const lineCount = objectRecord.getLineCount({ sublistId: 'item' });

                for (let i = 0; i < lineCount; i++) {
                    objectRecord.setSublistValue({
                        subistId: 'item',
                        fieldId: 'quantity',
                        value: 5,
                        line: i
                    })
                }

                const id = objectRecord.save();

                log.debug("Id: ", id);
            }
            catch (e) {
                log.error({
                    title: 'Error',
                    details: e
                });
            }
        }

        return { each }

    });
