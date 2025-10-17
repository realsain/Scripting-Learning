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
        console.log('pageInit triggered');
        var currentRecord = scriptContext.currentRecord;
        if(scriptContext.mode === 'create') {
            currentRecord.setValue({
                fieldId: 'entity',
                value: '7205'
            })
        }
    }

    return {
        pageInit: pageInit,
    };
    
});