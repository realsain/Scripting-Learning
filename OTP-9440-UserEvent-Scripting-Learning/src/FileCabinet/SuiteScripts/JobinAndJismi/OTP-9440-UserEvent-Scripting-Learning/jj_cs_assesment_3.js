/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log'],
/**
 * @param{log} log
 */
function(log) {

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
    function fieldChanged(context) {
        try{
            if (context.sublistId === 'item' && context.fieldId === 'custcol1') {
                const currentRecord = context.currentRecord;
                const isChecked = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol1'
                });
                const rate = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate'
                });
                const quantity = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity'
                });
 
                let amount = rate * quantity;
                if (isChecked) {
                    amount = amount / 2;
                }
 
                currentRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount',
                    value: amount
                });
            }
        }
        catch(e)
        {
         log.error("Error Occured",e)  
        }
    }

    return {
        fieldChanged: fieldChanged
    };
    
});
