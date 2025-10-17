/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/ui/serverWidget', 'N/record'], 
    (log, serverWidget, record) => {

        /**
         * Main entry point for Suitelet
         */
        const onRequest = (scriptContext) => {
            try {
                if (scriptContext.request.method === 'GET') {
                    displayCustomerForm(scriptContext);
                } else if (scriptContext.request.method === 'POST') {
                    processCustomerForm(scriptContext);
                }
            } catch (error) {
                log.error('Error in onRequest', error);
                scriptContext.response.write({
                    output: `<h2 style="color:red;">An error occurred: ${error.message}</h2>`
                });
            }
        };

        /**
         * Function to display form to collect customer info
         */
        function displayCustomerForm(scriptContext) {
            const form = serverWidget.createForm({
                title: 'Customer Information Form'
            });

            form.addResetButton({ label: 'Reset' });
            form.addSubmitButton({ label: 'Save' });

            form.addFieldGroup({
                id: 'custpage_customer_details',
                label: 'Customer Details'
            });

            form.addField({
                id: 'custpage_name',
                label: 'Name',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_customer_details'
            });

            form.addField({
                id: 'custpage_email',
                label: 'Email',
                type: serverWidget.FieldType.EMAIL,
                container: 'custpage_customer_details'
            });

            form.addField({
                id: 'custpage_phone',
                label: 'Phone Number',
                type: serverWidget.FieldType.PHONE,
                container: 'custpage_customer_details'
            });

            form.addField({
                id: 'custpage_sales_rep',
                label: 'Sales Rep',
                type: serverWidget.FieldType.SELECT,
                source: 'employee',
                container: 'custpage_customer_details'
            });

            form.addField({
                id: 'custpage_subsidiary',
                label: 'Subsidiary',
                type: serverWidget.FieldType.SELECT,
                source: 'subsidiary',
                container: 'custpage_customer_details'
            });

            scriptContext.response.writePage({ pageObject: form });
        }

        /**
         * Function to handle form submission and create customer record
         */
        function processCustomerForm(scriptContext) {
            try {
                const name = scriptContext.request.parameters.custpage_name;
                const email = scriptContext.request.parameters.custpage_email;
                const phone = scriptContext.request.parameters.custpage_phone;
                const salesRep = scriptContext.request.parameters.custpage_sales_rep;
                const subsidiary = scriptContext.request.parameters.custpage_subsidiary;

                log.debug('Form Data', { name, email, phone, salesRep, subsidiary });

                // Create customer record
                const customerRecord = record.create({
                    type: record.Type.CUSTOMER,
                    isDynamic: true
                });

                customerRecord.setValue({ fieldId: 'companyname', value: name });
                customerRecord.setValue({ fieldId: 'email', value: email });
                customerRecord.setValue({ fieldId: 'phone', value: phone });
                customerRecord.setValue({ fieldId: 'salesrep', value: salesRep });
                customerRecord.setValue({ fieldId: 'subsidiary', value: subsidiary });

                const customerId = customerRecord.save();
                log.debug('Customer Created', `Customer ID: ${customerId}`);

                const html = `
                    <h1 style="color:green;">Data Submitted Successfully!</h1>
                    <h3>Customer Record Created (ID: ${customerId})</h3>
                    <table border="1" cellpadding="6" style="border-collapse:collapse;">
                        <tr><th>Name</th><td>${name}</td></tr>
                        <tr><th>Email</th><td>${email}</td></tr>
                        <tr><th>Phone</th><td>${phone}</td></tr>
                        <tr><th>Sales Rep</th><td>${salesRep}</td></tr>
                        <tr><th>Subsidiary</th><td>${subsidiary}</td></tr>
                    </table>
                    <br>
                    <button onclick="window.history.back()">Go Back</button>
                `;

                scriptContext.response.write({ output: html });

            } catch (error) {
                log.error('Error in processCustomerForm', error);
                scriptContext.response.write({
                    output: `<h3 style="color:red;">Error creating customer: ${error.message}</h3>`
                });
            }
        }

        return { onRequest };
    });
