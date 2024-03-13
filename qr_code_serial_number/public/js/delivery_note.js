frappe.ui.form.on('Delivery Note', {
	refresh(frm) {
        console.log("refressshh");
		frm.add_custom_button("Scan Serial QR",function(){
            let d = new frappe.ui.Dialog({
                title: 'Scan QR',
                fields: [
                    {
                        label: 'Scan QR',
                        fieldname: 'serial_numbers',
                        fieldtype: 'Text'
                    }
                ],
                size: 'small', // small, large, extra-large 
                primary_action_label: 'Insert',
                primary_action(values) {

                    frappe.call({
                        method: 'qr_code_serial_number.api.get_items_from_sr_qr',
                        args: {
                            qr_code: values.serial_numbers
                        },
                        callback: function (r) {
                            console.log(r.message);
                            d.hide();
                            res = r.message;
                            for (const row in res){
                                var itemsTable = frm.add_child("items");
                                frappe.model.set_value(itemsTable.doctype, itemsTable.name, "item_code", res[row]['item_code']);
                                frappe.model.set_value(itemsTable.doctype, itemsTable.name, "use_serial_batch_fields", 1);
                                frappe.model.set_value(itemsTable.doctype, itemsTable.name, "serial_no", res[row]['name']);
                            }
                            frm.refresh_fields("items");
                        }
                    })
                    
                }
            });
            
            d.show();
        })
	}
})