/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record', 'N/email', 'N/runtime'],
    /**
     * @param{log} log
     * @param{record} record
     * @param{email} email
     * @param{runtime} runtime
     */
    function (log, record, email, runtime) {

        let oldQuantity = null;

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

        }

        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {
            try {
                if (scriptContext.sublistId === 'item') {
                    const currentRecord = scriptContext.currentRecord;

                    // Get new quantity
                    const line = currentRecord.getCurrentSublistIndex({ sublistId: 'item' });
                    const newQuantity = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });

                    // Compare old vs new
                    if (oldQuantity !== null && oldQuantity !== newQuantity) {
                        const itemName = currentRecord.getCurrentSublistText({
                            sublistId: 'item',
                            fieldId: 'item'
                        });

                        const poId = currentRecord.id; // Purchase Order ID
                        const vendorId = currentRecord.getValue({ fieldId: 'entity' });

                        // Send email
                        email.send({
                            author: runtime.getCurrentUser().id,  // sender = admin/user
                            recipients: vendorId,                // vendor internal ID
                            subject: 'Quantity updated in PO: ' + poId,
                            body: 'Item: ' + itemName +
                                '\nOld Qty: ' + oldQuantity +
                                '\nNew Qty: ' + newQuantity
                        });

                        alert('Email sent to Vendor: Quantity updated for item ' + itemName);
                    }

                    // Reset oldQuantity
                    oldQuantity = newQuantity;
                }
            }

            catch (e) {
                console.log('Error in sublistChanged: ' + e.message);
            }
        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {
            try {
                if (scriptContext.sublistId === 'item') {
                    const currentRecord = scriptContext.currentRecord;
                    oldQuantity = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });
                }
            }

            catch (e) {
                console.log('Error in lineInit: ' + e.message);
            }
        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

        }

        return {
            // pageInit: pageInit,
            // fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            sublistChanged: sublistChanged,
            lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };

    });
