/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/log', 'N/record', 'N/redirect'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{redirect} redirect
 */
    (log, record, redirect) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */

        function createEmpRecord(taskEmployee) {
            try {
                const empRecord = record.create({
                    type: 'customrecord_jj_employee_custom_record',
                    isDynamic: true
                });

                empRecord.setValue({
                    fieldId: 'custrecord_jj_name',
                    value: taskEmployee
                });

                const empRecordId = empRecord.save();
                return empRecordId;
            }
            catch (e) {
                log.error({
                    title: 'Error creating demo record',
                    details: e
                });
            }
        }

        const onAction = (scriptContext) => {
            try {
                const taskRecord = scriptContext.newRecord;

                const taskEmployee = taskRecord.getText({
                    fieldId: 'assigned'
                });

                const empRecordId = createEmpRecord(taskEmployee);

                redirect.toRecord({
                    type: 'customrecord_jj_employee_custom_record',
                    id: empRecordId,
                    isEditMode: true
                });
            }

            catch (e) {
                log.error({
                    title: 'Error in onAction',
                    details: e
                });
            }
        }

        return { onAction };
    });