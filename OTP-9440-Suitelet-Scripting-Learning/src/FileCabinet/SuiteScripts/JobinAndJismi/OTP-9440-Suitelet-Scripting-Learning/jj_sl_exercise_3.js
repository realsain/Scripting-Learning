/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/ui/serverWidget', 'N/search'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{serverWidget} serverWidget
 * @param{search} search
 */
    (log, record, serverWidget, search) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            const form = serverWidget.createForm({
                title : 'Sales Order'
            });

            form.addButton({
                id : 'custpage_jj_refresh_button',
                label : 'Refresh',
                functionName: 'window.location.reload();',
            });

            const sublist = form.addSublist({
                id : 'custsublist_jj_sublistid',
                type : serverWidget.SublistType.LIST,
                label : 'Sublist'
            });

            sublist.addField({
                id: 'custsublistfield_jj_doc_no',
                type: serverWidget.FieldType.TEXT,
                label: 'Document #'
            });
            sublist.addField({
                id: 'custsublistfield_jj_customer',
                type: serverWidget.FieldType.TEXT,
                label: 'Customer'
            });
            sublist.addField({
                id: 'custsublistfield_jj_subsidiary',
                type: serverWidget.FieldType.TEXT,
                label: 'Subsidiary'
            });
            sublist.addField({
                id: 'custsublistfield_jj_order_date',
                type: serverWidget.FieldType.TEXT,
                label: 'Order Date'
            });

            const soSearch = search.create({
                type: search.Type.SALES_ORDER,
                columns: [
                    'tranid',
                    'entity',
                    'subsidiary',
                    'trandate'
                ],
                filters: [['mainline', 'is', 'T']]
            });

            let lineCount = 0;

            soSearch.run().each(result => {
                const docNumber = result.getValue('tranid');
                const customer = result.getText('entity');
                const subsidiary = result.getText('subsidiary');
                const orderDate = result.getValue('trandate');

                sublist.setSublistValue({
                    id: 'custsublistfield_jj_doc_no',
                    line: lineCount,
                    value: docNumber
                });
                sublist.setSublistValue({
                    id: 'custsublistfield_jj_customer',
                    line: lineCount,
                    value: customer
                });
                sublist.setSublistValue({
                    id: 'custsublistfield_jj_subsidiary',
                    line: lineCount,
                    value: subsidiary
                });
                sublist.setSublistValue({
                    id: 'custsublistfield_jj_order_date',
                    line: lineCount,
                    value: orderDate
                });

                lineCount++;

                return true;
            });

            scriptContext.response.writePage({
                pageObject: form
            });


        }

        return {onRequest}

    });
