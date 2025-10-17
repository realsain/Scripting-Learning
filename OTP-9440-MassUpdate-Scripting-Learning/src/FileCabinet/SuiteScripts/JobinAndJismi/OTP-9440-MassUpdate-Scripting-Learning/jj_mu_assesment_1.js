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

        function updateStudentDetails(objRec, recordId) {
            let currentClass = objRec.getValue('custrecord_jj_student_class');
            log.debug('Current Class', currentClass);
 
            if (currentClass < 10) {
                objRec.setValue({
                    fieldId: 'custrecord_jj_student_class',
                    value: parseInt(currentClass) + 1
                });
            }
            else {
                objRec.setValue({
                    fieldId: 'custrecord_jj_student_class',
                    value: 'Completed'
                });
            }

            objRec.save();
            log.audit('Updated Record', `ID: ${recordId} - Class changed!`);
        }
        
        const each = (params) => {

            const objRec = record.load({
                type: params.type,
                id: params.id
            });

            updateStudentDetails(objRec, params.id);

        }

        return {each}

    });