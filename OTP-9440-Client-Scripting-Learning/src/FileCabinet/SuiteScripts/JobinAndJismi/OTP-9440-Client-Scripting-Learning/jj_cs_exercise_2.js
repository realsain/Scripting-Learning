/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {
    
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
        try {
            const currentRecord = scriptContext.currentRecord;
            const statusTextField = currentRecord.getField({ fieldId: 'custbody_jj_status_text'});
            if(statusTextField) {
                statusTextField.isDisabled = true;
            }
        } 
        catch (e) {
            console.error('Error in pageInit:', e);
        }
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
        try {
            console.log('fieldChanged triggered');
            if(scriptContext.fieldId == 'custbody_jj_apply_status') {
                const currentRecord = scriptContext.currentRecord;
                const isChecked = currentRecord.getValue('custbody_jj_apply_status');
                
                if(isChecked) {
                    currentRecord.setValue({
                        fieldId: 'custbody_jj_status_text',
                        value: 'Passed'
                    });
                }
                else {
                    currentRecord.setValue({
                        fieldId: 'custbody_jj_status_text',
                        value: 'Failed'
                    });
                }
            }
        } 
        catch (e) {
            console.error('Error in fieldChanged:', e);
        }
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    };
    
});
