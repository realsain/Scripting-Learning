/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/search', 'N/file', 'N/email', 'N/runtime', 'N/record', 'N/format'],
    /**
 * @param{file} file
 * @param{search} search
 * @param{email} email
 * @param{runtime} runtime
 * @param{record} record
 * @param{format} format
 */
    (search, file, email, runtime, record, format) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = () => {
            try {
                return createSalesOrderSearch();
            }
            catch (error) {
                log.error('Error in getInputData', error);
            }
        };

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try {
                processMapStage(mapContext);
            }
            catch (error) {
                log.error('Error in map stage', error);
            }
        };

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            try {
                processReduceStage(reduceContext);
            }
            catch (error) {
                log.error('Error in reduce stage', error);
            }
        };


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
            try {
                summarizeResults(summaryContext);
            }
            catch (error) {
                log.error('Error in summarize stage', error);
            }
        };

        function createSalesOrderSearch() {
            return search.create({
                type: search.Type.SALES_ORDER,
                filters: [
                    ['mainline', 'is', 'T'],
                    'AND', ['trandate', 'within', 'lastmonth']
                ],
                columns: [
                    'tranid',
                    'entity',
                    'salesrep',
                    'total'
                ]
            });
        }

        function processMapStage(context) {
            const result = JSON.parse(context.value);
            const vals = result.values || {};

            // Use safe checks for undefined
            const salesRep = (vals.salesrep && vals.salesrep[0] && vals.salesrep[0].text) 
                                ? vals.salesrep[0].text 
                                : 'No Sales Rep';
            const customer = (vals.entity && vals.entity[0] && vals.entity[0].text) 
                                ? vals.entity[0].text 
                                : 'Unknown Customer';
            const orderNumber = vals.tranid || '';
            const totalAmount = vals.total || 0;

            context.write({
                key: salesRep,
                value: { customer, orderNumber, totalAmount }
            });

            log.debug('Map Stage', { salesRep, customer, orderNumber, totalAmount });
        }


        function processReduceStage(context) {
            const salesRep = context.key;
            const salesData = context.values.map(JSON.parse);

            let csvContent = 'Customer,Sales Order,Amount\n';
            salesData.forEach(data => {
                csvContent += `${data.customer},${data.orderNumber},${data.totalAmount}\n`;
            });

            const fileObj = file.create({
                name: `SalesReport_${salesRep}.csv`,
                fileType: file.Type.CSV,
                contents: csvContent,
                folder: -14
            });
            const fileId = fileObj.save();

            log.debug('File Created', `File ID: ${fileId}`);

            const recipientId = salesRep === 'No Sales Rep' ? -5 : salesRep;

            sendEmailToRep(salesRep, recipientId, fileId);
        }

        function sendEmailToRep(salesRep, recipientId, fileId) {
            const subject = `Monthly Sales Report - ${salesRep}`;
            const bodyText = salesRep === 'No Sales Rep'
                ? 'Some customers have no sales representative. Please check the report.'
                : 'Please find attached your monthly customer sales report.';

            email.send({
                author: -5,
                recipients: recipientId,
                subject,
                body: bodyText,
                attachments: [file.load({ id: fileId })]
            });

            log.debug('Email Sent', `To: ${recipientId}`);
        }

        function summarizeResults(summary) {
            log.audit('Summary', {
                totalUsage: summary.usage,
                totalKeysProcessed: summary.keys ? summary.keys.length : 0
            });
        }

        return {getInputData, map, reduce, summarize}

    });
