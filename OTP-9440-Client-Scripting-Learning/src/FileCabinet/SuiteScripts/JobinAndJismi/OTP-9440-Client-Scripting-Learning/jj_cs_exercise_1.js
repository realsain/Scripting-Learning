/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

    function () {

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
            const currentRecord = scriptContext.currentRecord;
            const couponField = currentRecord.getField({ fieldId: 'custentity_jj_coupon_code' });
            couponField.isDisabled = true;
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
            const currentRecord = scriptContext.currentRecord;
            if (scriptContext.fieldId === 'custentity_jj_apply_coupon') {
                const isChecked = currentRecord.getValue({ fieldId: 'custentity_jj_apply_coupon' });
                const couponField = currentRecord.getField({ fieldId: 'custentity_jj_coupon_code' });
                couponField.isDisabled = !isChecked;
                if (!isChecked) {
                    currentRecord.setValue({ fieldId: 'custentity_jj_coupon_code', value: '' });
                }
            }
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
        function saveRecord(context) {
            const currentRecord = context.currentRecord;
            if (currentRecord.getValue({ fieldId: 'custentity_jj_apply_coupon' })) {
                const couponCode = currentRecord.getValue({ fieldId: 'custentity_jj_coupon_code' });
                if (!couponCode || couponCode.length !== 5) {
                    alert('Coupon Code must be exactly 5 characters.');
                    return false;
                }
            }
            return true;
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord
        };

    });
