import frappe
from io import StringIO
import csv
from frappe.query_builder.custom import GROUP_CONCAT

@frappe.whitelist()
def get_items_from_sr_qr(qr_code):
    

    f = StringIO(qr_code)
    reader = csv.reader(f, delimiter=',')
    list = []
    for row in reader:
        for item in row:
            if item:
                list.append(item.strip())

    SN = frappe.qb.DocType('Serial No')
    query = (
        frappe.qb.from_(SN)
        .select(
            SN.item_code,
            SN.warehouse,
            GROUP_CONCAT(SN.name).as_("name")
        )
        .groupby(SN.item_code)
    ).where(
        SN.name.isin(list)
    )
    return query.run(as_dict=True)