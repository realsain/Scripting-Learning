/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([], function () {

    function sublistChanged(scriptContext) {
        try {
            const currentRecord = scriptContext.currentRecord;
            const sublistId = scriptContext.sublistId;


            if (sublistId === 'item') {
                const bodyLocation = currentRecord.getValue({ fieldId: 'location' });

                const lineCount = currentRecord.getLineCount({ sublistId: 'item' });

                for (var i = 0; i < lineCount; i++) {
                    currentRecord.selectLine({ sublistId: 'item', line: i });

                    currentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_location',
                        value: bodyLocation,
                        ignoreFieldChange: true
                    });

                    currentRecord.commitLine({ sublistId: 'item' });
                }
            }
        } catch (e) {
            log.error('Error in sublistChanged', e.message);
        }
    }

    function saveRecord(scriptContext) {
        try {
            const currentRecord = scriptContext.currentRecord;
            const bodyLocation = currentRecord.getValue({ fieldId: 'location' });

            const lineCount = currentRecord.getLineCount({ sublistId: 'item' });

            for (var i = 0; i < lineCount; i++) {
                var lineLocation = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_location',
                    line: i
                });

                if (lineLocation !== bodyLocation) {
                    alert("Line " + (i + 1) + " location does not match body location!");
                    return false;
                }
            }

            return true;
        }

        catch (e) {
            log.error('Error in saveRecord', e.message);
            return false;
        }
    }

    return {
        sublistChanged: sublistChanged,
        saveRecord: saveRecord
    };

});
